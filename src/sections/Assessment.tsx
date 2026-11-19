import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, Activity, Scale, Calculator, ShieldAlert, ShieldCheck, ArrowUpFromLine, Wind, MoveDiagonal, Layers, FlaskConical, ArrowDownToLine, CloudRain, Cpu, ChevronLeft, ChevronRight } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, Slider, Expandable, DataBadge } from '../components/ui'
import { PlumeLab } from '../components/PlumeLab'
import { boxModel } from '../lib/models'

const STEPS = [
  { Icon: ScanSearch, title: 'Identify sources, types & quantities',
    body: 'Evaluate and identify the sources, types and quantities of pollutants that will be generated during each phase of project activity — pre-construction, construction, operation and decommissioning.',
    points: ['List every activity: excavation, haul trucks, DG sets, boilers, process vents, stockpiles.', 'Identify pollutants for each: PM10/PM2.5 from earthworks; SO₂/NOx from fuel combustion; VOCs from storage tanks.', 'Quantify using emission factors and activity data to build an emission inventory.'],
    example: 'A proposed metro depot: construction phase → dust from excavation and trucks; operation phase → limited emissions but traffic changes on adjoining roads.' },
  { Icon: Activity, title: 'Establish baseline air quality & meteorology',
    body: 'Carry out a detailed evaluation of existing ambient air quality, meteorological conditions and natural air quality in the project area — the “before” picture against which impacts are judged.',
    points: ['Ambient monitoring of PM10, PM2.5, SO₂, NO₂, CO, O₃ at several locations (upwind, downwind, sensitive receptors).', 'Meteorology: wind speed and direction (wind rose), temperature, humidity, rainfall, mixing height, stability.', 'Use existing CAAQM station records from CPCB/SPCB where available.'],
    example: 'Indian EIA practice typically uses a season of baseline monitoring at multiple stations around the site, alongside site-specific weather data.' },
  { Icon: Scale, title: 'Examine laws, regulations & standards',
    body: 'Examine the appropriate laws, regulations and criteria for maintaining ambient air quality and controlling emissions that apply to the project.',
    points: ['National Ambient Air Quality Standards (NAAQS), 2009 for receptor concentrations.', 'Industry-specific emission standards under the Environment (Protection) Rules, 1986.', 'Consent to Establish / Operate under the Air Act, 1981 from the State PCB; EIA Notification, 2006.'],
    example: 'A refinery expansion near Manali must meet NAAQS at nearby villages and the sector-specific stack emission limits.' },
  { Icon: Calculator, title: 'Predict impacts',
    body: 'Carry out impact assessment using a mass-balance approach, mathematical (dispersion) models, or qualitative prediction where data are limited.',
    points: ['Mass balance → total emission load (tonnes/day).', 'Box model → average concentration over an urban area.', 'Gaussian plume / computer models → concentration at each receptor; predicted = baseline + incremental.'],
    example: 'Modelled 24-h incremental PM10 from a stack is added to the measured baseline and compared with the 100 µg/m³ NAAQS.' },
  { Icon: ShieldAlert, title: 'Assess significance',
    body: 'Assess the significance of anticipated beneficial and detrimental impacts, considering magnitude, duration, frequency, reversibility, sensitivity of receptors and compliance with standards.',
    points: ['Compare predicted concentrations with NAAQS and WHO guidelines.', 'Weigh duration (temporary construction dust vs permanent emissions) and spatial extent.', 'Identify sensitive receptors — schools, hospitals, residential colonies, ecologically sensitive areas.'],
    example: 'A temporary dust impact meeting NAAQS may be “minor”; a permanent increment that pushes a residential area above standards is “major”.' },
  { Icon: ShieldCheck, title: 'Mitigate & plan remediation',
    body: 'Develop appropriate mitigation and remedial plans to reduce adverse impacts — the Environmental Management Plan (EMP) with monitoring and responsibilities.',
    points: ['Engineering controls: ESPs, bag filters, scrubbers, taller stacks, covered conveyors.', 'Operational controls: water sprinkling, speed limits, work-hour restrictions, green belt.', 'Post-project monitoring and corrective action if limits are exceeded.'],
    example: 'EMP for a construction site: wind barriers, covered trucks, wheel-washing, daily sprinkling, and weekly PM10 monitoring at the boundary.' },
]

function EiaSteps() {
  const [i, setI] = useState(0)
  const s = STEPS[i]
  return (
    <div>
      <div className="relative mb-8 hidden md:block">
        <div className="absolute left-[8%] right-[8%] top-6 h-px bg-white/10" />
        <motion.div className="absolute left-[8%] top-6 h-px bg-gradient-to-r from-leaf-400 to-cyan-glow" animate={{ width: `${(i / 5) * 84}%` }} transition={{ duration: 0.5 }} />
        <div className="relative grid grid-cols-6">
          {STEPS.map((st, k) => (
            <button key={k} onClick={() => setI(k)} className="group flex flex-col items-center gap-3 px-1 text-center">
              <span className={`grid h-12 w-12 place-items-center rounded-full border-2 transition ${k <= i ? 'border-leaf-400 bg-leaf-400 text-ink-950' : 'border-white/15 bg-ink-900 text-mist/60 group-hover:border-white/40'} ${k === i ? 'shadow-[0_0_30px_rgba(52,211,153,.6)]' : ''}`}>
                <st.Icon size={20} />
              </span>
              <span className={`text-xs leading-tight ${k === i ? 'text-white' : 'text-mist/50'}`}>{st.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex gap-1.5 md:hidden">
        {STEPS.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Step ${k + 1}`} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-leaf-400' : 'bg-white/10'}`} />)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
          className="glass relative overflow-hidden rounded-2xl p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-4 -top-10 font-display text-[11rem] font-bold leading-none text-white/[0.03]">{i + 1}</div>
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-leaf-400">Step {i + 1} of 6</div>
              <h4 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{s.title}</h4>
              <p className="mt-4 leading-relaxed text-mist/85">{s.body}</p>
              <ul className="mt-5 space-y-2.5">
                {s.points.map(p => <li key={p} className="flex gap-3 text-sm text-mist/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400" />{p}</li>)}
              </ul>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-5">
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-cyan-300">Example</div>
                <p className="mt-2 text-sm leading-relaxed text-mist/85">{s.example}</p>
              </div>
              <div className="flex gap-2">
                <button disabled={i === 0} onClick={() => setI(i - 1)} className="flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/40 disabled:opacity-30"><ChevronLeft size={16} /> Previous</button>
                <button disabled={i === 5} onClick={() => setI(i + 1)} className="flex items-center gap-1 rounded-lg bg-leaf-400 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-leaf-300 disabled:opacity-30">Next <ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function PredictionFlow() {
  const nodes = [
    { x: 70, label: 'Sources', sub: 'stacks · vehicles · dust', c: '#ef4444' },
    { x: 250, label: 'Emission rate', sub: 'g/s · t/day', c: '#f97316', tag: '1' },
    { x: 430, label: 'Transport & dispersion', sub: 'wind · turbulence · stability', c: '#f59e0b' },
    { x: 610, label: 'Concentration', sub: 'µg/m³ at receptors', c: '#22d3ee', tag: '2' },
    { x: 790, label: 'Deposition', sub: 'soil · water · vegetation', c: '#34d399', tag: '3' },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card hover={false} className="overflow-x-auto p-4 sm:p-6">
        <svg viewBox="0 0 860 260" className="min-w-[640px]" role="img" aria-label="Flowchart from emission sources to deposition">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#34d399" /></marker>
          </defs>
          {nodes.slice(0, -1).map((n, i) => (
            <line key={i} x1={n.x + 62} y1={110} x2={nodes[i + 1].x - 64} y2={110} stroke="#34d399" strokeWidth="2" className="flow-dash" markerEnd="url(#arr)" />
          ))}
          <path d="M430 150 C 430 210, 520 220, 520 220" stroke="#a78bfa" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          <rect x="460" y="205" width="170" height="40" rx="10" fill="#a78bfa22" stroke="#a78bfa66" />
          <text x="545" y="223" textAnchor="middle" fill="#ddd6fe" fontSize="12" fontWeight="600">Chemical transformation</text>
          <text x="545" y="238" textAnchor="middle" fill="#a78bfa" fontSize="10">SO₂→SO₄²⁻ · NOx+VOC→O₃</text>
          {nodes.map(n => (
            <g key={n.label}>
              <rect x={n.x - 62} y={70} width={124} height={80} rx={14} fill={`${n.c}18`} stroke={`${n.c}88`} />
              <text x={n.x} y={104} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">{n.label}</text>
              <text x={n.x} y={124} textAnchor="middle" fill="#8aa0bf" fontSize="10">{n.sub}</text>
              {n.tag && <g><circle cx={n.x + 52} cy={70} r={12} fill={n.c} /><text x={n.x + 52} y={74} textAnchor="middle" fontSize="12" fontWeight="700" fill="#040a14">{n.tag}</text></g>}
            </g>
          ))}
          <text x="790" y="40" textAnchor="middle" fill="#8aa0bf" fontSize="11">Receptors: people, crops,</text>
          <text x="790" y="54" textAnchor="middle" fill="#8aa0bf" fontSize="11">buildings, ecosystems</text>
        </svg>
      </Card>
      <div className="space-y-3">
        {[
          ['1', 'Rates of release', 'How much of each pollutant leaves each source per unit time — from emission factors, fuel analysis, stack tests and activity data.', '#f97316'],
          ['2', 'Atmospheric concentrations', 'How emissions translate into ground-level concentrations at receptors, using box, Gaussian or numerical models with meteorological data.', '#22d3ee'],
          ['3', 'Deposition rates', 'How fast pollutants are removed onto soil, water and vegetation by gravitational settling, dry deposition and rain-out (wet deposition).', '#34d399'],
        ].map(([n, h, t, c]) => (
          <Reveal key={n}><div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-ink-950" style={{ background: c }}>{n}</span><span className="font-display font-semibold text-white">{h}</span></div>
            <p className="mt-2 text-sm leading-relaxed text-mist/75">{t}</p>
          </div></Reveal>
        ))}
      </div>
    </div>
  )
}

function MassBalance() {
  const [coal, setCoal] = useState(2000)
  const [s, setS] = useState(0.5)
  const [eff, setEff] = useState(90)
  const so2Uncontrolled = coal * (s / 100) * (64 / 32)
  const so2 = so2Uncontrolled * (1 - eff / 100)

  const [trucks, setTrucks] = useState(150)
  const [km, setKm] = useState(5)
  const [ef, setEf] = useState(150)
  const [ctrl, setCtrl] = useState(50)
  const dust = (trucks * km * ef * (1 - ctrl / 100)) / 1000 // kg/day
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card hover={false}>
        <div className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-leaf-400">Concept</div>
        <h4 className="font-display text-xl font-semibold text-white">Inputs = Outputs + Accumulation</h4>
        <p className="mt-3 text-sm leading-relaxed text-mist/80">
          The mass-balance approach applies the law of conservation of mass: every kilogram of a substance entering a process must leave as product, waste, or
          emission (or accumulate). By tracking materials, we estimate emissions without measuring every stack. Summing estimates for all activities in an area
          produces an <strong className="text-white">emission inventory</strong>: <span className="font-mono text-leaf-300">E = A × EF × (1 − ER/100)</span>, where A is activity
          rate, EF an emission factor and ER the control efficiency.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-ink-950/50 p-3"><div className="font-semibold text-white">Construction phase</div><div className="mt-1 text-mist/70">Earthworks, haul roads, batching plants, DG sets — temporary, mostly PM10.</div></div>
          <div className="rounded-lg bg-ink-950/50 p-3"><div className="font-semibold text-white">Operational phase</div><div className="mt-1 text-mist/70">Boilers, process vents, storage, induced traffic — long-term, multiple pollutants.</div></div>
        </div>
      </Card>
      <Card hover={false}>
        <div className="mb-3 flex items-center justify-between"><h4 className="font-display text-lg font-semibold text-white">Worked example: sulphur balance</h4><DataBadge kind="note" label="Stoichiometry" /></div>
        <div className="space-y-4">
          <Slider label="Coal burned" value={coal} min={200} max={10000} step={100} unit=" t/day" onChange={setCoal} />
          <Slider label="Sulphur content" value={s} min={0.2} max={4} step={0.1} unit=" %" onChange={setS} />
          <Slider label="FGD removal efficiency" value={eff} min={0} max={98} unit=" %" onChange={setEff} />
        </div>
        <div className="mt-5 rounded-xl bg-ink-950/60 p-4 font-mono text-[12.5px] leading-7 text-mist/85">
          S burned = {coal} × {s}% = <b className="text-white">{(coal * s / 100).toFixed(1)} t/day</b><br />
          S + O₂ → SO₂ ⇒ ×(64/32) = <b className="text-white">{so2Uncontrolled.toFixed(1)} t SO₂/day</b><br />
          After FGD ({eff}%) = <b className="text-2xl text-leaf-300">{so2.toFixed(2)} t SO₂/day</b>
        </div>
      </Card>
      <Card hover={false} className="lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-lg font-semibold text-white">Construction inventory: haul-road dust</h4>
          <DataBadge kind="sample" label="Illustrative emission factor" />
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Slider label="Truck trips per day" value={trucks} min={10} max={600} step={10} onChange={setTrucks} />
            <Slider label="Unpaved distance per trip" value={km} min={0.5} max={20} step={0.5} unit=" km" onChange={setKm} />
            <Slider label="PM10 emission factor" value={ef} min={20} max={600} step={10} unit=" g/VKT" onChange={setEf} hint="Varies with silt content, vehicle weight and moisture" />
            <Slider label="Control (watering, speed limits)" value={ctrl} min={0} max={90} step={5} unit=" %" onChange={setCtrl} />
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-leaf-400/25 bg-leaf-400/5 p-5 text-center">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-leaf-300">PM10 emitted</div>
            <div className="mt-2 font-display text-4xl font-bold text-white">{dust.toFixed(0)}</div>
            <div className="text-sm text-mist/70">kg / day</div>
            <div className="mt-3 font-mono text-[11px] text-mist/55">{trucks} × {km} km × {ef} g × (1 − {ctrl}%)</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function BoxModel() {
  const [q, setQ] = useState(40) // µg/m²/s ×0.1 → use direct
  const [u, setU] = useState(3)
  const [H, setH] = useState(800)
  const [L, setL] = useState(20) // km
  const [cb, setCb] = useState(20)
  const qFlux = q / 10 // µg/m²/s
  const C = boxModel(qFlux, L * 1000, u, H, cb)
  const density = Math.min(1, (C - cb) / 120)
  const svgRef = useRef<SVGSVGElement>(null)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let raf = 0, last = 0
    const loop = (t: number) => { if (t - last > 50) { setTick(x => x + 1); last = t } raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  const particles = useMemo(() => Array.from({ length: 90 }, (_, k) => ({ x0: (k * 53) % 380, y: 40 + ((k * 31) % 150), sp: 0.6 + (k % 5) * 0.15 })), [])
  const boxH = 60 + (H / 2000) * 130
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card hover={false} className="p-4 sm:p-6">
        <svg ref={svgRef} viewBox="0 0 460 260" className="w-full" role="img" aria-label="Animated box model">
          <defs>
            <linearGradient id="boxfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f97316" stopOpacity={0.05 + density * 0.25} /><stop offset="1" stopColor="#f97316" stopOpacity={0.1 + density * 0.45} /></linearGradient>
          </defs>
          <rect x="40" y={230 - boxH} width="380" height={boxH} fill="url(#boxfill)" stroke="#f59e0b" strokeDasharray="5 4" />
          <rect x="0" y="230" width="460" height="30" fill="#0e1d33" />
          {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={50 + k * 31} y={230 - 10 - ((k * 7) % 20)} width="18" height={10 + ((k * 7) % 20)} fill="#22385e" />)}
          {particles.map((p, k) => {
            const show = k / particles.length < 0.15 + density * 0.85
            if (!show) return null
            const x = 40 + ((p.x0 + tick * p.sp * (u / 3)) % 380)
            const y = 230 - ((p.y - 40) / 150) * (boxH - 6) - 3
            return <circle key={k} cx={x} cy={y} r={1.8} fill="#fdba74" opacity={0.8} />
          })}
          {[0, 1, 2].map(k => <g key={k} transform={`translate(4 ${230 - boxH * (0.25 + k * 0.3)})`}><line x1="0" y1="0" x2="30" y2="0" stroke="#22d3ee" strokeWidth="2" className="flow-dash" /><path d="M30 -4 L36 0 L30 4z" fill="#22d3ee" /></g>)}
          <text x="10" y={225 - boxH} fill="#22d3ee" fontSize="11">u = {u} m/s, Cb = {cb}</text>
          <text x="430" y={230 - boxH / 2} fill="#f59e0b" fontSize="11" textAnchor="end" transform={`rotate(-90 440 ${230 - boxH / 2})`}>H = {H} m</text>
          <text x="230" y="250" fill="#8aa0bf" fontSize="11" textAnchor="middle">L = {L} km (downwind length) · emission flux q at ground</text>
          <text x="230" y="20" fill="#fff" fontSize="13" textAnchor="middle" fontWeight="600">C = Cb + qL / (uH)</text>
        </svg>
      </Card>
      <div className="space-y-4">
        <Slider label="Area emission flux (q)" value={q} min={5} max={150} unit="" onChange={setQ} hint={`${qFlux.toFixed(1)} µg/m²/s`} />
        <Slider label="Wind speed (u)" value={u} min={0.5} max={10} step={0.5} unit=" m/s" onChange={setU} />
        <Slider label="Mixing height (H)" value={H} min={100} max={2000} step={50} unit=" m" onChange={setH} />
        <Slider label="Downwind length of city (L)" value={L} min={5} max={50} unit=" km" onChange={setL} />
        <Slider label="Background concentration (Cb)" value={cb} min={0} max={60} unit=" µg/m³" onChange={setCb} />
        <div className="rounded-xl border border-orange-400/30 bg-orange-400/5 p-4">
          <div className="font-mono text-[10.5px] uppercase tracking-wider text-orange-300">Average concentration in the box</div>
          <div className="font-display text-3xl font-bold text-white">{C.toFixed(1)} <span className="text-base font-normal text-mist/60">µg/m³</span></div>
          <div className="text-xs text-mist/60">Halve the wind speed or mixing height and the increment doubles.</div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
        <Expandable title="What the box model assumes" defaultOpen>
          <ul className="space-y-1.5">
            <li>• The city is a rectangular box: length L (downwind), width W (crosswind) and height H (mixing height).</li>
            <li>• Pollutants emitted at ground level are instantly and uniformly mixed throughout the box.</li>
            <li>• Wind of constant speed u flows through the box; air entering carries background concentration Cb.</li>
            <li>• Steady state: emissions in (q·L·W) = pollutant carried out (u·W·H·(C − Cb)). Crosswind width W cancels.</li>
          </ul>
        </Expandable>
        <Expandable title="Limitations">
          <ul className="space-y-1.5">
            <li>• Gives only a single average — cannot show hotspots near roads or stacks.</li>
            <li>• Real emissions are not uniform in space or time; real mixing is not instantaneous.</li>
            <li>• Ignores chemical reactions, deposition and variation of wind with height.</li>
            <li>• Very sensitive to mixing height, which changes from day to night.</li>
            <li>• Best used for screening and for understanding the role of ventilation (u × H).</li>
          </ul>
        </Expandable>
      </div>
    </div>
  )
}

const PROCESSES = [
  { Icon: ArrowUpFromLine, t: 'Plume rise', d: 'Hot, fast exhaust rises above the stack because of buoyancy and momentum. Effective height H = physical stack height + plume rise (Δh).' },
  { Icon: Wind, t: 'Advection by wind', d: 'The mean wind carries the plume downwind. Higher wind speed stretches the plume and dilutes it (concentration ∝ 1/u).' },
  { Icon: MoveDiagonal, t: 'Turbulent diffusion', d: 'Eddies spread the plume vertically (σz), laterally/crosswind (σy) and along-wind. Spreading grows with distance and depends on stability.' },
  { Icon: Layers, t: 'Reflection', d: 'The ground and the top of the mixing layer (an inversion lid) act like mirrors, reflecting the plume and trapping it in the mixed layer.' },
  { Icon: FlaskConical, t: 'Chemical transformation', d: 'SO₂ oxidises to sulphate, NOx to nitrate; NOx and VOCs form ozone; gases condense into secondary aerosols.' },
  { Icon: ArrowDownToLine, t: 'Gravitational settling', d: 'Larger, heavier particles fall out of the plume near the source at their settling velocity.' },
  { Icon: CloudRain, t: 'Dry & wet deposition', d: 'Dry: gases and particles absorbed by or impacted on surfaces. Wet: scavenged by rain and cloud droplets (rain-out and wash-out).' },
]

const MODELS = [
  { t: 'Pasquill–Gifford (Gaussian plume) model', d: 'Assumes the plume has Gaussian (bell-shaped) concentration distributions in the crosswind and vertical directions. Spread parameters σy and σz are read from Pasquill–Gifford curves for six stability classes A–F, set by wind speed, solar radiation and cloud cover.', f: 'C(x,y,z) = Q / (2π u σy σz) · e^(−y²/2σy²) · [e^(−(z−H)²/2σz²) + e^(−(z+H)²/2σz²)]' },
  { t: 'Ground-level point source', d: 'For a source at ground level (H = 0) — e.g. a leak or a fire — the reflection terms combine and the ground-level centreline concentration simplifies. Concentration is highest at the source and falls with distance.', f: 'C(x,0,0) = Q / (π u σy σz)' },
  { t: 'Area source model', d: 'Many small sources (traffic over a district, domestic stoves, dust) are treated as an area emitting q per m². It is integrated as many point sources, or approximated with a box model or an equivalent “virtual point source” located upwind.', f: 'C ≈ Cb + qL / (uH)   (box approximation)' },
  { t: 'Computer-based simulation models', d: 'Regulatory and research models handle complex terrain, building downwash, hourly meteorology and chemistry — e.g. US EPA AERMOD (steady-state plume), CALPUFF (puff model), and CMAQ / WRF-Chem (3-D photochemical grid models).', f: 'Hourly met + emissions + terrain → receptor grid of concentrations' },
]

export function Assessment() {
  return (
    <Section id="assessment" className="grid-bg">
      <SectionHeader index="03" kicker="Unit IV · Core section" title={<>Predicting & assessing <span className="text-gradient">impacts on the air.</span></>}
        intro="Environmental impact assessment for the air environment is a structured, six-step process. At its heart is prediction: estimating how emissions from a project will change concentrations at the places people live." />

      <SubHeader letter="A" title="Six main steps for an EIA study on the air environment">Click a step to explore it.</SubHeader>
      <EiaSteps />

      <SubHeader letter="B" title="Air quality impact prediction">Three aspects of air-quality problems can be predicted quantitatively — they follow the pollutant's journey from source to receptor.</SubHeader>
      <PredictionFlow />

      <SubHeader letter="C" title="Mass balance approach">The simplest quantitative tool: follow the mass. Adjust the sliders to run the calculations.</SubHeader>
      <MassBalance />

      <SubHeader letter="D" title="Box model approach">Treat the city as a well-mixed box of air, ventilated by wind. A powerful way to see why calm, low-inversion days are the most polluted.</SubHeader>
      <BoxModel />

      <SubHeader letter="E" title="Air quality dispersion models">Dispersion models represent the physical and chemical processes that act on a plume after it leaves the source.</SubHeader>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESSES.map(({ Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 0.04} className={i === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}>
            <div className="glass glass-hover h-full rounded-xl p-5">
              <Icon size={20} className="text-leaf-400" />
              <div className="mt-3 font-display font-semibold text-white">{t}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist/70">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8"><PlumeLab /></div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {MODELS.map((m, i) => (
          <Reveal key={m.t} delay={i * 0.05}><Card className="h-full">
            <div className="flex items-center gap-2"><Cpu size={18} className="text-cyan-glow" /><h4 className="font-display text-lg font-semibold text-white">{m.t}</h4></div>
            <p className="mt-3 text-sm leading-relaxed text-mist/80">{m.d}</p>
            <div className="mt-4 overflow-x-auto rounded-lg bg-ink-950/70 px-3 py-2.5 font-mono text-[12px] text-leaf-300">{m.f}</div>
          </Card></Reveal>
        ))}
      </div>
      <Reveal className="mt-4 text-xs text-mist/50">Symbols: Q emission rate (g/s), u wind speed (m/s), H effective stack height (m), σy σz dispersion coefficients (m), q area emission flux, L downwind length, Cb background.</Reveal>
    </Section>
  )
}
