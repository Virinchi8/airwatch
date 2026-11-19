import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FlaskConical, Radio, ShieldCheck, Info } from 'lucide-react'
import { useState, type ReactNode } from 'react'

export function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

export function SectionHeader({ kicker, title, intro, index }: { kicker: string; title: ReactNode; intro?: ReactNode; index?: string }) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-leaf-400">
        {index && <span className="rounded border border-leaf-400/30 px-1.5 py-0.5 text-[10px]">{index}</span>}
        <span>{kicker}</span>
        <span className="h-px w-12 bg-leaf-400/40" />
      </div>
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-mist/80 sm:text-lg">{intro}</p>}
    </Reveal>
  )
}

export function SubHeader({ letter, title, children }: { letter: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="mb-8 mt-20 first:mt-0">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-leaf-400">{letter}</span>
        <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h3>
      </div>
      {children && <p className="mt-3 max-w-3xl leading-relaxed text-mist/75">{children}</p>}
    </Reveal>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Card({ children, className = '', hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`glass rounded-2xl p-6 ${hover ? 'glass-hover' : ''} ${className}`}>{children}</div>
}

type BadgeKind = 'verified' | 'sample' | 'simulated' | 'model' | 'note'
const BADGE: Record<BadgeKind, { cls: string; label: string; Icon: typeof Info }> = {
  verified: { cls: 'border-leaf-400/40 bg-leaf-400/10 text-leaf-300', label: 'Official source', Icon: ShieldCheck },
  sample: { cls: 'border-amber-400/40 bg-amber-400/10 text-amber-300', label: 'Illustrative sample data', Icon: FlaskConical },
  simulated: { cls: 'border-orange-400/40 bg-orange-400/10 text-orange-300', label: 'Simulated – not real data', Icon: FlaskConical },
  model: { cls: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300', label: 'Live model estimate', Icon: Radio },
  note: { cls: 'border-slate-400/30 bg-slate-400/10 text-slate-300', label: 'Note', Icon: Info },
}
export function DataBadge({ kind, label }: { kind: BadgeKind; label?: string }) {
  const b = BADGE[kind]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider ${b.cls}`}>
      <b.Icon size={12} /> {label ?? b.label}
    </span>
  )
}

export function Expandable({ title, children, defaultOpen = false, icon }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; icon?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass overflow-hidden rounded-xl">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03]"
      >
        {icon}
        <span className="flex-1 font-display font-medium text-white">{title}</span>
        <ChevronDown size={18} className={`text-leaf-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="border-t border-white/5 px-5 py-4 text-sm leading-relaxed text-mist/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange, size = 'md' }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; size?: 'sm' | 'md' }) {
  return (
    <div role="tablist" className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-white/10 bg-ink-900/70 p-1">
      {tabs.map(t => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`relative rounded-lg ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} font-medium transition ${value === t.id ? 'text-ink-950' : 'text-mist/70 hover:text-white'}`}
        >
          {value === t.id && <motion.span layoutId={`tab-${tabs.map(x => x.id).join('')}`} className="absolute inset-0 rounded-lg bg-leaf-400" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, hint }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void; hint?: string }) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="text-mist/85">{label}</span>
        <span className="font-mono text-leaf-300">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ ['--p' as string]: `${p}%` }}
        aria-label={label}
      />
      {hint && <div className="mt-1 text-[11px] text-mist/50">{hint}</div>}
    </label>
  )
}

export function Stat({ value, label, sub }: { value: ReactNode; label: string; sub?: ReactNode }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold text-white sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-mist/70">{label}</div>
      {sub && <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-mist/45">{sub}</div>}
    </div>
  )
}

export const chartTooltipStyle = {
  contentStyle: { background: '#0a1628', border: '1px solid rgba(148,197,255,.2)', borderRadius: 10, fontSize: 12, color: '#e6edf7' },
  labelStyle: { color: '#8aa0bf', marginBottom: 4 },
  itemStyle: { padding: 0 },
}
export const axisProps = { stroke: '#4b6285', tick: { fill: '#8aa0bf', fontSize: 11 }, tickLine: false }
