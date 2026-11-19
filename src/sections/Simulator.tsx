import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Section, SectionHeader, Card, Slider, chartTooltipStyle, axisProps } from '../components/ui'
import { SOURCE_SAMPLE } from './Science'
import { categoryFor } from '../lib/aqi'

const BASELINE = 180 // illustrative index

type Controls = { vehicle: number; construction: number; industry: number; green: number; waste: number }
const ZERO: Controls = { vehicle: 0, construction: 0, industry: 0, green: 0, waste: 0 }
const PRESETS: { name: string; c: Controls }[] = [
  { name: 'Business as usual', c: ZERO },
  { name: 'Moderate action', c: { vehicle: 20, construction: 30, industry: 20, green: 10, waste: 40 } },
  { name: 'Ambitious action', c: { vehicle: 50, construction: 60, industry: 50, green: 25, waste: 80 } },
]

/**
 * Simple linear source model (educational assumptions):
 * - each sector contributes its sample share of the baseline index;
 * - each control reduces its sector proportionally;
 * - construction controls also cut road dust by 30% of their value (less spill-over);
 * - green cover: each +1% cuts dust sectors by 0.6% and all others by 0.2% (deposition/screening).
 */
function simulate(c: Controls) {
  const g = c.green / 100
  return SOURCE_SAMPLE.map(s => {
    const base = (s.value / 100) * BASELINE
    let r = 0
    if (s.id === 'transport') r = c.vehicle / 100
    if (s.id === 'construction') r = c.construction / 100
    if (s.id === 'dust') r = (c.construction / 100) * 0.3
    if (s.id === 'industry' || s.id === 'power') r = c.industry / 100
    if (s.id === 'waste') r = c.waste / 100
    const dusty = s.id === 'dust' || s.id === 'construction'
    const greenCut = dusty ? 0.6 * g : 0.2 * g
    const after = base * (1 - r) * (1 - greenCut)
    return { name: s.name, color: s.color, before: +base.toFixed(1), after: +after.toFixed(1) }
  })
}

export function Simulator() {
  const [c, setC] = useState<Controls>(ZERO)
  const rows = useMemo(() => simulate(c), [c])
  const after = Math.round(rows.reduce((a, r) => a + r.after, 0))
  const catB = categoryFor(BASELINE), catA = categoryFor(after)
  const pct = Math.round((1 - after / BASELINE) * 100)
  const set = (k: keyof Controls) => (v: number) => setC(prev => ({ ...prev, [k]: v }))
  return (
    <Section id="simulator" className="grid-bg">
      <SectionHeader index="07" kicker="Mitigation simulator" title={<>What if we <span className="text-gradient">reduced pollution?</span></>}
        intro="Move the sliders to apply hypothetical controls to each source sector and watch an illustrative pollution index respond." />
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100/90">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
        <span><b>Simplified educational simulation.</b> This is not a scientifically validated prediction of Chennai's AQI. It uses a hypothetical baseline index of {BASELINE}, the illustrative source shares from Section 02 and linear assumptions. Real air quality responds non-linearly (meteorology, secondary chemistry, regional transport).</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card hover={false} className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => <button key={p.name} onClick={() => setC(p.c)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-mist/80 transition hover:border-leaf-400/60 hover:text-white">{p.name}</button>)}
            <button onClick={() => setC(ZERO)} className="ml-auto rounded-full p-1.5 text-mist/60 hover:text-white" aria-label="Reset"><RotateCcw size={15} /></button>
          </div>
          <Slider label="Reduce vehicle emissions" value={c.vehicle} min={0} max={80} unit="%" onChange={set('vehicle')} hint="e.g. electric buses, BS-VI fleet, traffic management" />
          <Slider label="Reduce construction dust" value={c.construction} min={0} max={80} unit="%" onChange={set('construction')} hint="e.g. barriers, sprinkling, covered trucks" />
          <Slider label="Reduce industrial & power emissions" value={c.industry} min={0} max={80} unit="%" onChange={set('industry')} hint="e.g. ESPs, FGD, cleaner fuels" />
          <Slider label="Increase green cover" value={c.green} min={0} max={30} unit="%" onChange={set('green')} hint="green belts, roadside trees, urban forests" />
          <Slider label="Reduce open waste burning" value={c.waste} min={0} max={100} unit="%" onChange={set('waste')} hint="enforcement, collection, smoke-free festivals" />
        </Card>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card hover={false} className="text-center">
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-mist/60">Baseline index</div>
              <div className="mt-2 font-display text-5xl font-bold" style={{ color: catB.color }}>{BASELINE}</div>
              <div className="text-sm text-mist/70">{catB.name}</div>
            </Card>
            <Card hover={false} className="text-center">
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-mist/60">After controls</div>
              <motion.div key={after} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="mt-2 font-display text-5xl font-bold" style={{ color: catA.color }}>{after}</motion.div>
              <div className="text-sm text-mist/70">{catA.name}</div>
            </Card>
            <Card hover={false} className="text-center">
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-mist/60">Reduction</div>
              <div className="mt-2 font-display text-5xl font-bold text-leaf-300">{pct}%</div>
              <div className="text-sm text-mist/70">illustrative</div>
            </Card>
          </div>
          <div className="relative h-4 overflow-hidden rounded-full bg-ink-800">
            <div className="absolute inset-0 flex">{['#00B050', '#92D050', '#FFFF00', '#FF9900', '#FF0000', '#C00000'].map((col, i) => <div key={col} style={{ background: col, width: i < 2 ? '10%' : '20%', opacity: 0.35 }} />)}</div>
            <motion.div className="absolute top-0 h-4 w-1 rounded bg-white" animate={{ left: `${Math.min(after, 500) / 5}%` }} />
            <div className="absolute top-0 h-4 w-1 rounded bg-white/40" style={{ left: `${BASELINE / 5}%` }} />
          </div>
          <Card hover={false}>
            <div className="mb-3 font-display text-lg font-semibold text-white">Contribution by source — before vs after</div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#16294a" vertical={false} />
                  <XAxis dataKey="name" {...axisProps} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis {...axisProps} width={40} />
                  <Tooltip {...chartTooltipStyle} cursor={{ fill: '#ffffff08' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="before" name="Before" fill="#4b6285" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" name="After" radius={[4, 4, 0, 0]}>{rows.map(r => <Cell key={r.name} fill={r.color} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  )
}
