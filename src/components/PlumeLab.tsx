import { useEffect, useMemo, useRef, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { plumeConc, sigmaZ, sigmaY, effectiveHeight, STABILITY_INFO, type Stability } from '../lib/models'
import { Slider, Tabs, DataBadge, chartTooltipStyle, axisProps } from './ui'

const XMAX = 10000 // m
const ZMAX = 400 // m

const STOPS = [[7, 17, 31], [16, 120, 100], [52, 211, 153], [250, 204, 21], [249, 115, 22], [220, 38, 38]]
function heatColor(t: number): [number, number, number] {
  // t in 0..1 → dark navy → green → yellow → orange → red
  const x = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1)
  const i = Math.floor(x), f = x - i
  const a = STOPS[i], b = STOPS[i + 1]
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]
}

export function PlumeLab() {
  const [stab, setStab] = useState<Stability>('D')
  const [u, setU] = useState(4)
  const [hs, setHs] = useState(80)
  const [Q, setQ] = useState(50)
  const [view, setView] = useState<'side' | 'top'>('side')
  const canvas = useRef<HTMLCanvasElement>(null)
  const H = effectiveHeight(hs, 12, u)

  // ground-level centreline concentrations
  const profile = useMemo(() => {
    const pts = []
    for (let x = 100; x <= XMAX; x += 100) pts.push({ x: x / 1000, c: plumeConc(Q, u, H, x, 0, 0, stab) })
    return pts
  }, [Q, u, H, stab])
  const peak = profile.reduce((a, b) => (b.c > a.c ? b : a), profile[0])

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    const W = 560, Hh = 260
    cv.width = W; cv.height = Hh
    const img = ctx.createImageData(W, Hh)
    // normalise colour by a fixed reference so changes are visible between settings
    const ref = view === 'side' ? plumeConc(100, 4, 80, 400, 0, 80, 'D') * 1.2 : plumeConc(100, 4, 80, 2000, 0, 0, 'D') * 4
    for (let py = 0; py < Hh; py++) {
      for (let px = 0; px < W; px++) {
        const x = (px / W) * XMAX
        let c: number
        if (view === 'side') {
          const z = ZMAX * (1 - py / Hh)
          c = plumeConc(Q, u, H, x, 0, z, stab)
        } else {
          const y = ((py / Hh) - 0.5) * 3000
          c = plumeConc(Q, u, H, x, y, 0, stab)
        }
        const t = Math.pow(Math.min(1, c / ref), 0.45)
        const col = heatColor(t)
        const k = (py * W + px) * 4
        img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    // overlays
    ctx.strokeStyle = 'rgba(255,255,255,.15)'
    ctx.lineWidth = 1
    for (let km = 1; km < 10; km++) { const x = (km * 1000 / XMAX) * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Hh); ctx.stroke() }
    if (view === 'side') {
      const stackPx = (hs / ZMAX) * Hh
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(2, Hh - stackPx, 7, stackPx)
      ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,255,255,.5)'
      const hy = Hh - (H / ZMAX) * Hh
      ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke(); ctx.setLineDash([])
      ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '11px JetBrains Mono, monospace'
      ctx.fillText(`H = ${H.toFixed(0)} m (effective height)`, 14, hy - 6)
      // σz envelope
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.beginPath()
      for (let px = 1; px < W; px += 4) { const x = (px / W) * XMAX; const z = H + 2.15 * sigmaZ(x, stab); const y = Hh - (z / ZMAX) * Hh; px === 1 ? ctx.moveTo(px, y) : ctx.lineTo(px, y) }
      ctx.stroke()
    } else {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(5, Hh / 2, 4, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,.35)'
      for (const sgn of [1, -1]) {
        ctx.beginPath()
        for (let px = 1; px < W; px += 4) { const x = (px / W) * XMAX; const y = Hh / 2 + sgn * (2.15 * sigmaY(x, stab) / 3000) * Hh; px === 1 ? ctx.moveTo(px, y) : ctx.lineTo(px, y) }
        ctx.stroke()
      }
    }
  }, [Q, u, H, hs, stab, view])

  return (
    <div className="glass rounded-2xl p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold text-white">Gaussian Plume Lab</div>
          <div className="text-xs text-mist/60">Pasquill–Gifford stability classes · Briggs rural σ curves · ground reflection</div>
        </div>
        <Tabs size="sm" value={view} onChange={setView} tabs={[{ id: 'side', label: 'Side view (x–z)' }, { id: 'top', label: 'Plan view at ground' }]} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <canvas ref={canvas} className="block h-auto w-full" style={{ imageRendering: 'auto', aspectRatio: '560/260' }} aria-label="Plume concentration heat map" />
            <div className="pointer-events-none absolute bottom-1 left-2 right-2 flex justify-between font-mono text-[10px] text-white/60">
              <span>0 km</span><span>wind →</span><span>10 km</span>
            </div>
            <div className="pointer-events-none absolute left-2 top-1 font-mono text-[10px] text-white/60">{view === 'side' ? 'height 400 m' : 'crosswind ±1.5 km'}</div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer>
              <AreaChart data={profile} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs><linearGradient id="glc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f97316" stopOpacity={0.6} /><stop offset="1" stopColor="#f97316" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#16294a" vertical={false} />
                <XAxis dataKey="x" {...axisProps} unit=" km" type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                <YAxis {...axisProps} width={50} tickFormatter={v => v.toFixed(0)} />
                <Tooltip {...chartTooltipStyle} labelFormatter={v => `${v} km downwind`} formatter={(v: number) => [`${v.toFixed(1)} µg/m³`, 'Ground-level conc.']} />
                <Area type="monotone" dataKey="c" stroke="#f97316" fill="url(#glc)" strokeWidth={2} isAnimationActive={false} />
                <ReferenceDot x={peak.x} y={peak.c} r={5} fill="#fff" stroke="#f97316" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 text-center font-mono text-[11px] text-mist/60">Ground-level centreline concentration (µg/m³) vs downwind distance</div>
        </div>
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm text-mist/85">Atmospheric stability class</div>
            <div className="grid grid-cols-6 gap-1">
              {(Object.keys(STABILITY_INFO) as Stability[]).map(s => (
                <button key={s} onClick={() => setStab(s)} className={`rounded-md py-2 font-mono text-sm font-semibold transition ${stab === s ? 'bg-leaf-400 text-ink-950' : 'bg-ink-900 text-mist/70 hover:text-white'}`}>{s}</button>
              ))}
            </div>
            <div className="mt-2 rounded-lg bg-ink-950/50 p-3 text-xs leading-relaxed text-mist/75"><strong className="text-white">{STABILITY_INFO[stab].label}.</strong> {STABILITY_INFO[stab].desc}</div>
          </div>
          <Slider label="Wind speed at stack top (u)" value={u} min={1} max={12} step={0.5} unit=" m/s" onChange={setU} />
          <Slider label="Physical stack height (hs)" value={hs} min={10} max={220} step={5} unit=" m" onChange={setHs} />
          <Slider label="Emission rate (Q)" value={Q} min={10} max={500} step={10} unit=" g/s" onChange={setQ} />
          <div className="rounded-xl border border-orange-400/30 bg-orange-400/5 p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-orange-300">Maximum ground-level concentration</div>
            <div className="mt-1 font-display text-3xl font-bold text-white">{peak.c.toFixed(1)} <span className="text-base font-normal text-mist/60">µg/m³</span></div>
            <div className="text-xs text-mist/70">at ≈ {peak.x.toFixed(1)} km downwind</div>
          </div>
          <DataBadge kind="note" label="Educational model – not a regulatory run" />
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-mist/55">
        Try it: switch from <b>A</b> to <b>F</b> — unstable air brings the plume to the ground close to the stack, while stable air carries it far downwind with little dilution.
        Raising the stack or increasing wind speed lowers the peak ground-level concentration. Plume rise uses a simplified momentum term (exit velocity 12 m/s, diameter 2 m).
      </p>
    </div>
  )
}
