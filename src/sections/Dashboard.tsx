import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, PieChart, Pie, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { RefreshCw, AlertTriangle, MapPin, Calculator } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, DataBadge, Tabs, chartTooltipStyle, axisProps } from '../components/ui'
import { HotspotMap } from '../components/HotspotMap'
import { SOURCE_SAMPLE } from './Science'
import { AQI_CATEGORIES, categoryFor, computeAqi, POLLUTANT_LABEL, POLLUTANT_UNIT, subIndex, type Pollutant } from '../lib/aqi'
import { CITIES, fetchModelledAir, simulatedAir, type AirDataset, type CitySeries } from '../lib/airData'

const NAAQS_24: Record<Pollutant, number> = { pm25: 60, pm10: 100, no2: 80, so2: 80, co: 2, o3: 100 } // CO, O3 are 8-h limits

function Gauge({ aqi }: { aqi: number }) {
  const cat = categoryFor(aqi)
  const frac = Math.min(aqi, 500) / 500
  const R = 90, C = Math.PI * R
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-[280px]">
      <defs>
        <linearGradient id="gauge" x1="0" x2="1">
          {AQI_CATEGORIES.map((c, i) => <stop key={c.name} offset={i / 5} stopColor={c.color} />)}
        </linearGradient>
      </defs>
      <path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="#16294a" strokeWidth="14" strokeLinecap="round" />
      <motion.path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="url(#gauge)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - frac) }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      <text x="110" y="98" textAnchor="middle" fill="#fff" fontSize="40" fontWeight="700" fontFamily="Space Grotesk">{aqi}</text>
      <text x="110" y="120" textAnchor="middle" fill={cat.color} fontSize="13" fontWeight="600">{cat.name}</text>
    </svg>
  )
}

function fmtTime(t: string, long: boolean) {
  const d = t.slice(5, 10).replace('-', '/')
  const h = t.slice(11, 13)
  return long ? `${d} ${h}:00` : `${d} ${h}h`
}

function rollingAqi(s: CitySeries, k: number) {
  const w24 = s.hours.slice(Math.max(0, k - 23), k + 1)
  const w8 = s.hours.slice(Math.max(0, k - 7), k + 1)
  const m = (xs: (number | null)[]) => { const v = xs.filter((x): x is number => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null }
  return computeAqi({ pm25: m(w24.map(h => h.pm25)), pm10: m(w24.map(h => h.pm10)), no2: m(w24.map(h => h.no2)), so2: m(w24.map(h => h.so2)), co: m(w8.map(h => h.co)), o3: m(w8.map(h => h.o3)) })?.aqi ?? null
}

function AqiCalculator() {
  const [v, setV] = useState<Record<Pollutant, string>>({ pm25: '45', pm10: '90', no2: '35', so2: '12', co: '0.9', o3: '40' })
  const conc = Object.fromEntries((Object.keys(v) as Pollutant[]).map(p => [p, v[p] === '' ? null : Number(v[p])])) as Record<Pollutant, number | null>
  const res = computeAqi(conc)
  const cat = res ? categoryFor(res.aqi) : null
  return (
    <Card hover={false}>
      <div className="mb-4 flex items-center gap-2"><Calculator size={18} className="text-leaf-400" /><h4 className="font-display text-lg font-semibold text-white">Indian AQI calculator</h4></div>
      <p className="mb-4 text-xs leading-relaxed text-mist/60">Enter your own averaged concentrations (e.g. copied from the CPCB portal). Sub-indices use CPCB breakpoints; overall AQI is the maximum sub-index (needs ≥ 3 pollutants including PM).</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(Object.keys(v) as Pollutant[]).map(p => {
          const si = subIndex(p, conc[p])
          return (
            <label key={p} className="block">
              <span className="mb-1 flex justify-between text-xs text-mist/70"><span>{POLLUTANT_LABEL[p]} <span className="text-mist/40">{POLLUTANT_UNIT[p]}</span></span>{si != null && <span className="font-mono" style={{ color: categoryFor(si).color }}>{si}</span>}</span>
              <input inputMode="decimal" value={v[p]} onChange={e => setV({ ...v, [p]: e.target.value.replace(/[^0-9.]/g, '') })}
                className="w-full rounded-lg border border-white/10 bg-ink-950/60 px-3 py-2 font-mono text-sm text-white outline-none transition focus:border-leaf-400/60" />
            </label>
          )
        })}
      </div>
      <div className="mt-5 flex items-center gap-4 rounded-xl p-4" style={{ background: cat ? `${cat.color}18` : '#ffffff08', border: `1px solid ${cat ? cat.color + '55' : '#ffffff20'}` }}>
        {res && cat ? (
          <>
            <div className="font-display text-4xl font-bold text-white">{res.aqi}</div>
            <div><div className="font-semibold" style={{ color: cat.color }}>{cat.name}</div><div className="text-xs text-mist/70">Dominant: {POLLUTANT_LABEL[res.dominant]}</div></div>
          </>
        ) : <div className="text-sm text-mist/60">Enter at least three pollutants, including PM2.5 or PM10.</div>}
      </div>
    </Card>
  )
}

export function Dashboard() {
  const [data, setData] = useState<AirDataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [cityId, setCityId] = useState('chennai')
  const [period, setPeriod] = useState<'24' | '72' | '168'>('72')
  const [trendVar, setTrendVar] = useState<'aqi' | Pollutant>('pm25')

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const d = await fetchModelledAir(7, signal)
      setData(d)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setData(simulatedAir(7, (e as Error).message || 'Network error'))
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { const ac = new AbortController(); load(ac.signal); return () => ac.abort() }, [load])

  const s = data?.series.find(x => x.city.id === cityId)
  const cur = s?.current
  const cat = cur ? categoryFor(cur.aqi) : null
  const live = data?.source === 'live-model'

  const trend = useMemo(() => {
    if (!s) return []
    const n = Number(period)
    const start = Math.max(0, s.nowIndex - n + 1)
    const step = n > 72 ? 3 : 1
    const out = []
    for (let k = start; k <= s.nowIndex; k += step) {
      const h = s.hours[k]
      out.push({ t: fmtTime(h.time, false), aqi: rollingAqi(s, k), pm25: h.pm25, pm10: h.pm10, no2: h.no2, so2: h.so2, co: h.co, o3: h.o3 })
    }
    return out
  }, [s, period])

  const pollBars = useMemo(() => s ? (Object.keys(NAAQS_24) as Pollutant[]).map(p => ({
    p: POLLUTANT_LABEL[p], pct: s.averages[p] != null ? Math.round((s.averages[p]! / NAAQS_24[p]) * 100) : 0,
    val: s.averages[p], unit: POLLUTANT_UNIT[p], si: cur?.subs[p] ?? null,
  })) : [], [s, cur])

  const cityBars = useMemo(() => data ? data.series.map(x => ({ name: x.city.name, aqi: x.current?.aqi ?? 0, pm25: x.averages.pm25 ? Math.round(x.averages.pm25) : 0 })).sort((a, b) => b.aqi - a.aqi) : [], [data])

  return (
    <Section id="dashboard" className="grid-bg">
      <SectionHeader index="05" kicker="Interactive dashboard" title={<>Air quality <span className="text-gradient">monitor.</span></>}
        intro="Modelled pollutant concentrations are fetched in real time and converted into an indicative Indian AQI using CPCB breakpoints and averaging periods. Every panel is labelled with its data type." />

      {/* Data source banner */}
      <Reveal>
        <div className={`mb-6 flex flex-wrap items-start gap-3 rounded-xl border p-4 text-sm ${live ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-orange-400/40 bg-orange-400/10'}`}>
          {loading ? <span className="text-mist/70">Loading air-quality data…</span> : live ? (
            <>
              <DataBadge kind="model" />
              <span className="flex-1 text-mist/80">Hourly concentrations from the <b className="text-white">Copernicus Atmosphere Monitoring Service (CAMS)</b> forecast model via the Open-Meteo Air Quality API. These are <b className="text-white">model estimates on a coarse grid, not CPCB station measurements</b>; the AQI shown is indicative and global models can over- or under-estimate local levels (ozone in particular). Verify against the CPCB portal before quoting any value. Updated {data!.fetchedAt.toLocaleTimeString()}.</span>
            </>
          ) : (
            <>
              <AlertTriangle size={18} className="text-orange-300" />
              <span className="flex-1 text-orange-100/90"><b>Showing SIMULATED demonstration data.</b> The live model feed could not be reached ({data?.error}). Values below are generated for demonstration and do not represent real air quality.</span>
            </>
          )}
          <button onClick={() => load()} disabled={loading} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition hover:border-leaf-400/60 disabled:opacity-40">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </Reveal>

      <div className="mb-6 flex flex-wrap gap-2">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCityId(c.id)} className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${cityId === c.id ? 'border-leaf-400 bg-leaf-400 font-semibold text-ink-950' : 'border-white/10 bg-ink-900/60 text-mist/75 hover:border-white/30 hover:text-white'}`}>
            <MapPin size={13} /> {c.name}
          </button>
        ))}
      </div>

      {/* Top row */}
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card hover={false} className="relative overflow-hidden">
          {cat && <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ background: `${cat.color}30` }} />}
          <div className="relative">
            <div className="flex items-center justify-between">
              <div><div className="font-display text-xl font-semibold text-white">{s?.city.name ?? '—'}</div><div className="text-xs text-mist/60">{s?.city.state}</div></div>
              {data && <DataBadge kind={live ? 'model' : 'simulated'} label={live ? 'Indicative AQI' : 'Simulated'} />}
            </div>
            <div className="mt-4 flex justify-center">{cur ? <Gauge aqi={cur.aqi} /> : <div className="py-12 text-sm text-mist/50">{loading ? 'Loading…' : 'Insufficient data'}</div>}</div>
            {cur && cat && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between rounded-lg bg-ink-950/50 px-3 py-2"><span className="text-mist/60">Dominant pollutant</span><span className="font-semibold text-white">{POLLUTANT_LABEL[cur.dominant]}</span></div>
                <div className="rounded-lg bg-ink-950/50 px-3 py-2"><div className="text-xs text-mist/60">Health implication (CPCB)</div><div className="mt-0.5 text-mist/90">{cat.health}</div></div>
                <div className="rounded-lg px-3 py-2" style={{ background: `${cat.color}15` }}><div className="text-xs text-mist/60">Suggested precautions</div><div className="mt-0.5 text-mist/90">{cat.precaution}</div></div>
              </div>
            )}
          </div>
        </Card>

        <Card hover={false}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-lg font-semibold text-white">Trend over time</div>
            <div className="flex flex-wrap gap-2">
              <Tabs size="sm" value={trendVar} onChange={setTrendVar} tabs={[{ id: 'aqi', label: 'AQI' }, { id: 'pm25', label: 'PM2.5' }, { id: 'pm10', label: 'PM10' }, { id: 'no2', label: 'NO₂' }, { id: 'o3', label: 'O₃' }, { id: 'co', label: 'CO' }]} />
              <Tabs size="sm" value={period} onChange={setPeriod} tabs={[{ id: '24', label: '24 h' }, { id: '72', label: '3 d' }, { id: '168', label: '7 d' }]} />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs><linearGradient id="tr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34d399" stopOpacity={0.5} /><stop offset="1" stopColor="#34d399" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#16294a" vertical={false} />
                <XAxis dataKey="t" {...axisProps} minTickGap={40} />
                <YAxis {...axisProps} width={45} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [v == null ? '—' : v.toFixed(trendVar === 'co' ? 2 : 0), trendVar === 'aqi' ? 'AQI (rolling)' : `${POLLUTANT_LABEL[trendVar as Pollutant]} (${POLLUTANT_UNIT[trendVar as Pollutant]})`]} />
                {trendVar !== 'aqi' && <ReferenceLine y={NAAQS_24[trendVar as Pollutant]} stroke="#f59e0b" strokeDasharray="5 4" ifOverflow="extendDomain" label={{ value: 'NAAQS', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />}
                <Area type="monotone" dataKey={trendVar} stroke="#34d399" strokeWidth={2} fill="url(#tr)" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-mist/50">Hourly values (AQI uses rolling 24-h / 8-h means). Dashed line: NAAQS 24-h limit (8-h for CO and O₃), shown for reference — hourly values are not directly comparable with a 24-h standard.</div>
        </Card>
      </div>

      {/* Second row */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card hover={false}>
          <div className="mb-1 flex items-center justify-between gap-2"><div className="font-display text-lg font-semibold text-white">Pollutant comparison vs NAAQS</div>{data && <DataBadge kind={live ? 'model' : 'simulated'} label={live ? 'Model' : 'Simulated'} />}</div>
          <div className="mb-3 text-xs text-mist/60">Current averaged concentration as % of the Indian standard (100% = limit)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={pollBars} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid stroke="#16294a" horizontal={false} />
                <XAxis type="number" {...axisProps} unit="%" domain={[0, (max: number) => Math.max(120, Math.ceil(max / 20) * 20)]} />
                <YAxis type="category" dataKey="p" {...axisProps} width={50} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number, _n, item) => [`${v}% of limit · ${item.payload.val?.toFixed(item.payload.unit === 'mg/m³' ? 2 : 1)} ${item.payload.unit}`, 'Level']} />
                <ReferenceLine x={100} stroke="#f59e0b" strokeDasharray="5 4" />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                  {pollBars.map(b => <Cell key={b.p} fill={b.si != null ? categoryFor(b.si).color : '#4b6285'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card hover={false}>
          <div className="mb-1 flex items-center justify-between gap-2"><div className="font-display text-lg font-semibold text-white">PM2.5 vs PM10</div>{data && <DataBadge kind={live ? 'model' : 'simulated'} label={live ? 'Model' : 'Simulated'} />}</div>
          <div className="mb-3 text-xs text-mist/60">A high PM2.5 / PM10 ratio points to combustion; a low ratio points to dust</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#16294a" vertical={false} />
                <XAxis dataKey="t" {...axisProps} minTickGap={40} />
                <YAxis {...axisProps} width={45} />
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => (v == null ? '—' : `${v.toFixed(0)} µg/m³`)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#f97316" strokeWidth={2} dot={false} connectNulls />
                <Line type="monotone" dataKey="pm10" name="PM10" stroke="#facc15" strokeWidth={2} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card hover={false}>
          <div className="mb-1 flex items-center justify-between gap-2"><div className="font-display text-lg font-semibold text-white">City comparison</div>{data && <DataBadge kind={live ? 'model' : 'simulated'} label={live ? 'Indicative AQI' : 'Simulated'} />}</div>
          <div className="mb-3 text-xs text-mist/60">Indicative AQI from the same model for major Indian cities</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={cityBars} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#16294a" vertical={false} />
                <XAxis dataKey="name" {...axisProps} interval={0} angle={-25} textAnchor="end" height={50} />
                <YAxis {...axisProps} width={45} />
                <Tooltip {...chartTooltipStyle} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="aqi" name="AQI" radius={[6, 6, 0, 0]} onClick={(d: { name: string }) => { const c = CITIES.find(x => x.name === d.name); if (c) setCityId(c.id) }}>
                  {cityBars.map(b => <Cell key={b.name} fill={categoryFor(b.aqi).color} stroke={CITIES.find(c => c.name === b.name)?.id === cityId ? '#fff' : 'none'} strokeWidth={2} style={{ cursor: 'pointer' }} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card hover={false}>
          <div className="mb-1 flex items-center justify-between gap-2"><div className="font-display text-lg font-semibold text-white">Source contribution</div><DataBadge kind="sample" /></div>
          <div className="mb-3 text-xs text-mist/60">Typical relative importance in Indian cities — not measured for any city</div>
          <div className="grid h-64 grid-cols-[1fr_1fr] items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SOURCE_SAMPLE} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="85%" stroke="none" paddingAngle={2}>
                  {SOURCE_SAMPLE.map(d => <Cell key={d.id} fill={d.color} />)}
                </Pie>
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => `${v}% (sample)`} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1.5 text-xs">
              {SOURCE_SAMPLE.map(d => <li key={d.id} className="flex items-center gap-2 text-mist/75"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.name}<span className="ml-auto font-mono text-mist/50">{d.value}%</span></li>)}
            </ul>
          </div>
        </Card>
      </div>

      <SubHeader letter="B" title="India's National Air Quality Index categories">Six colour-coded bands defined by CPCB (2014). The AQI is computed for eight pollutants; the highest sub-index determines the overall AQI.</SubHeader>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {AQI_CATEGORIES.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.05}>
            <div className={`h-full overflow-hidden rounded-xl border bg-ink-900/60 transition ${cat?.name === c.name ? 'border-white/60 ring-2 ring-white/20' : 'border-white/10'}`}>
              <div className="px-4 py-3" style={{ background: c.color, color: c.text }}>
                <div className="font-mono text-xs font-semibold">{c.min}–{c.max}</div>
                <div className="font-display text-lg font-bold leading-tight">{c.name}</div>
              </div>
              <p className="p-4 text-xs leading-relaxed text-mist/75">{c.health}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6"><AqiCalculator /></div>

      <SubHeader letter="D" title="Pollution hotspot map — Chennai">Click a marker for context. Values are illustrative pressure indices based on the type of nearby sources, not monitoring results.</SubHeader>
      <HotspotMap />
    </Section>
  )
}
