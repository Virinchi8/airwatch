import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Droplets, Fence, TreeDeciduous, Route, TrafficCone, Layers, Trash2, CloudFog, FlameKindling, Fuel, Zap, Leaf, Gauge, Check, X } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, Tabs } from '../components/ui'

const DUST = [
  { Icon: Sprout, t: 'Vegetation cover', d: 'Establish grass, shrubs and ground cover on exposed soil to bind particles and stop wind erosion.' },
  { Icon: Droplets, t: 'Watering construction areas', d: 'Regular sprinkling or misting of haul roads, stockpiles and work faces keeps the surface moist; effective but needs repeated application.' },
  { Icon: Fence, t: 'Windbreaks', d: 'Barriers, screens or hedges around sites reduce wind speed at the surface and trap moving dust.' },
  { Icon: TreeDeciduous, t: 'Fast-growing vegetation', d: 'Plant fast-growing, dust-tolerant species along boundaries and roads to create living screens and green belts.' },
  { Icon: Route, t: 'Paving unpaved roads', d: 'Paving or gravelling haul roads and road shoulders removes a major source of resuspended PM10.' },
  { Icon: TrafficCone, t: 'Traffic control regulations', d: 'Speed limits on site roads, covered trucks, wheel-washing at exits, and routing heavy vehicles away from residential areas.' },
]
const WASTE = [
  { Icon: Layers, t: 'Waste stabilisation', d: 'Compacting, covering (soil or membranes) and chemically stabilising waste or fine materials to stop them becoming airborne.' },
  { Icon: Trash2, t: 'Managing open waste piles', d: 'Segregation at source, timely collection, covered storage and scientific landfilling or biomining of legacy dumps.' },
  { Icon: CloudFog, t: 'Dust suppression', d: 'Water sprays, fog cannons, chemical dust suppressants and enclosures for transfer points and crushers.' },
  { Icon: FlameKindling, t: 'Control of open burning', d: 'Enforce bans on burning waste and leaves, monitor dumpsites for fires, and promote awareness (e.g. smoke-free Bhogi campaigns).' },
]
const FUELS = [
  { t: 'Methanol', d: 'Alcohol fuel that can be made from natural gas, coal or biomass. Burns with low particulate emissions but has lower energy density and can produce formaldehyde.' },
  { t: 'Ethanol', d: 'Produced from sugarcane, molasses or grains. Blended with petrol (India targets E20 blending) to cut CO and reduce oil imports; may increase some aldehyde emissions.' },
  { t: 'CNG', d: 'Compressed natural gas — mainly methane. Very low particulate and SO₂ emissions; widely used for buses, autos and taxis in Indian cities.' },
  { t: 'LPG', d: 'Liquefied petroleum gas (propane/butane). Cleaner than petrol/diesel for PM; used in auto-rickshaws and as a cooking fuel replacing biomass.' },
  { t: 'Electricity', d: 'Battery electric vehicles have zero tailpipe emissions. Overall benefit depends on how the electricity is generated (grid mix).' },
  { t: 'Reformulated gasoline', d: 'Petrol with modified composition — lower sulphur, benzene and vapour pressure, plus oxygenates — to reduce evaporative and exhaust emissions. BS-VI fuels contain ≤ 10 ppm sulphur.' },
]
const EXHAUST = ['Three-way catalytic converters (CO, HC, NOx)', 'Diesel particulate filters (DPF)', 'Selective catalytic reduction with urea/AdBlue (NOx)', 'Exhaust gas recirculation (EGR)', 'Diesel oxidation catalysts', 'On-board diagnostics (OBD) and evaporative emission controls']

interface Tech { id: string; name: string; principle: string; controls: string; pros: string[]; cons: string[]; diagram: ReactNode }

const D = { stroke: '#4b6285', gas: '#94a3b8', clean: '#34d399', dirty: '#f97316' }

const TECH: Tech[] = [
  { id: 'cyclone', name: 'Cyclone separator', principle: 'Dirty gas enters tangentially and spins in a vortex. Centrifugal force throws heavier particles to the wall, where they slide down into a hopper; clean gas exits through a central tube at the top.', controls: 'Coarse particulate matter (generally > 10 µm), used as pre-cleaner.', pros: ['Simple, no moving parts', 'Low capital and maintenance cost', 'Handles high temperatures'], cons: ['Poor efficiency for fine particles (PM2.5)', 'Pressure drop increases energy use'],
    diagram: (<svg viewBox="0 0 200 180"><path d="M70 30 H130 V90 L108 150 H92 L70 90 Z" fill="none" stroke={D.stroke} strokeWidth="2" /><rect x="90" y="10" width="20" height="40" fill="none" stroke={D.stroke} strokeWidth="2" /><path d="M20 40 H70" stroke={D.dirty} strokeWidth="3" className="flow-dash" /><path d="M100 10 V-5" stroke={D.clean} strokeWidth="3" /><path d="M100 45 V5" stroke={D.clean} strokeWidth="3" className="flow-dash" /><path d="M78 50 Q100 62 122 50 Q100 75 80 68 Q100 90 118 82 Q100 105 88 100 Q100 125 108 120" fill="none" stroke={D.dirty} strokeWidth="1.5" strokeDasharray="3 3" className="flow-dash" /><rect x="92" y="150" width="16" height="18" fill={D.dirty} opacity=".5" /><text x="20" y="34" fill="#8aa0bf" fontSize="9">dirty gas</text><text x="112" y="14" fill={D.clean} fontSize="9">clean gas</text><text x="114" y="166" fill="#8aa0bf" fontSize="9">dust</text></svg>) },
  { id: 'scrubber', name: 'Wet scrubber', principle: 'Gas is brought into contact with a liquid spray (water or alkaline solution). Particles are captured by droplets and soluble or reactive gases are absorbed; the liquid is collected and treated.', controls: 'Particulates, SO₂, HCl, NH₃ and other soluble gases.', pros: ['Removes both gases and particles', 'Handles hot, sticky or flammable gases', 'Compact'], cons: ['Generates wastewater / sludge', 'Corrosion; plume may be visible (steam)', 'Energy for pumping and pressure drop'],
    diagram: (<svg viewBox="0 0 200 180"><rect x="65" y="25" width="70" height="125" rx="6" fill="none" stroke={D.stroke} strokeWidth="2" /><path d="M20 130 H65" stroke={D.dirty} strokeWidth="3" className="flow-dash" /><path d="M100 25 V5" stroke={D.clean} strokeWidth="3" className="flow-dash" />{[80, 100, 120].map(x => <g key={x}><circle cx={x} cy={40} r="3" fill="#60a5fa" />{[55, 70, 85, 100].map(y => <circle key={y} cx={x + ((y / 15) % 2 ? 3 : -3)} cy={y} r="1.6" fill="#60a5fa"><animate attributeName="cy" values={`${y};${y + 15};${y}`} dur="1.2s" repeatCount="indefinite" /></circle>)}</g>)}<rect x="66" y="135" width="68" height="14" fill="#60a5fa" opacity=".35" /><text x="18" y="124" fill="#8aa0bf" fontSize="9">dirty gas</text><text x="106" y="12" fill={D.clean} fontSize="9">clean gas</text><text x="140" y="45" fill="#60a5fa" fontSize="9">spray</text><text x="140" y="148" fill="#8aa0bf" fontSize="9">slurry</text></svg>) },
  { id: 'baghouse', name: 'Fabric filter (baghouse)', principle: 'Gas passes through woven or felted fabric bags. Particles are captured on the fabric and a “dust cake” builds up that itself filters; bags are periodically cleaned by shaking or reverse pulse-jet air.', controls: 'Fine and coarse particulate matter, including PM2.5; with sorbent injection, some acid gases.', pros: ['Very high efficiency (often > 99%)', 'Effective for fine particles', 'Dry collection of dust'], cons: ['Temperature and moisture limits for fabrics', 'Bag wear and replacement', 'Fire risk with some dusts'],
    diagram: (<svg viewBox="0 0 200 180"><rect x="40" y="20" width="120" height="120" fill="none" stroke={D.stroke} strokeWidth="2" /><path d="M40 140 L90 168 H110 L160 140" fill="none" stroke={D.stroke} strokeWidth="2" />{[60, 85, 110, 135].map(x => <rect key={x} x={x - 7} y="35" width="14" height="85" rx="7" fill="#1b3156" stroke="#8aa0bf" />)}<path d="M5 130 H40" stroke={D.dirty} strokeWidth="3" className="flow-dash" /><path d="M160 28 H195" stroke={D.clean} strokeWidth="3" className="flow-dash" />{Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={48 + (i * 9) % 105} cy={128 - (i % 4) * 4} r="1.6" fill={D.dirty} />)}<text x="4" y="124" fill="#8aa0bf" fontSize="9">dirty gas</text><text x="162" y="22" fill={D.clean} fontSize="9">clean</text><text x="78" y="178" fill="#8aa0bf" fontSize="9">dust hopper</text></svg>) },
  { id: 'esp', name: 'Electrostatic precipitator (ESP)', principle: 'High-voltage discharge electrodes ionise the gas; particles pick up a negative charge and migrate to grounded collecting plates. Plates are rapped periodically so dust falls into hoppers.', controls: 'Fine and coarse particulates, fly ash from coal-fired power plants and cement kilns.', pros: ['High efficiency (often > 99%) with low pressure drop', 'Handles very large gas volumes', 'Works at high temperatures'], cons: ['High capital cost and large footprint', 'Performance depends on dust resistivity', 'Does not remove gases'],
    diagram: (<svg viewBox="0 0 200 180"><rect x="30" y="30" width="140" height="110" fill="none" stroke={D.stroke} strokeWidth="2" />{[55, 100, 145].map(x => <rect key={x} x={x - 2} y="40" width="4" height="90" fill="#8aa0bf" />)}{[77, 122].map(x => <g key={x}><line x1={x} y1="40" x2={x} y2="130" stroke="#facc15" strokeWidth="1.5" strokeDasharray="2 3" /><text x={x} y="36" fill="#facc15" fontSize="10" textAnchor="middle">−</text></g>)}{Array.from({ length: 12 }).map((_, i) => { const x = 65 + (i % 4) * 22; const y = 55 + Math.floor(i / 4) * 25; return <circle key={i} cx={x} cy={y} r="2" fill={D.dirty}><animate attributeName="cx" values={`${x};${x + (i % 2 ? 9 : -9)}`} dur="1.5s" repeatCount="indefinite" /></circle> })}<path d="M0 85 H30" stroke={D.dirty} strokeWidth="3" className="flow-dash" /><path d="M170 85 H200" stroke={D.clean} strokeWidth="3" className="flow-dash" /><text x="60" y="155" fill="#8aa0bf" fontSize="9">plates (+, grounded)</text><text x="2" y="78" fill="#8aa0bf" fontSize="9">gas in</text></svg>) },
  { id: 'fgd', name: 'Flue-gas desulphurisation (FGD)', principle: 'SO₂ in flue gas reacts with an alkaline reagent — typically limestone slurry in a wet absorber tower — forming calcium sulphite, which is oxidised to gypsum (CaSO₄·2H₂O). Dry and semi-dry variants inject lime powder.', controls: 'Sulphur dioxide (SO₂); also some acid gases and particulates.', pros: ['High SO₂ removal (wet systems often > 90%)', 'Gypsum by-product can be sold for cement/wallboard', 'Mandated for Indian thermal power plants'], cons: ['High capital and operating cost', 'Large water and limestone demand', 'Wastewater and solid by-product handling'],
    diagram: (<svg viewBox="0 0 200 180"><rect x="70" y="20" width="60" height="135" rx="30" fill="none" stroke={D.stroke} strokeWidth="2" /><path d="M10 120 H70" stroke="#eab308" strokeWidth="3" className="flow-dash" /><path d="M100 20 V2" stroke={D.clean} strokeWidth="3" className="flow-dash" />{[85, 100, 115].map(x => [45, 60, 75, 90].map(y => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="#e5e7eb"><animate attributeName="cy" values={`${y};${y + 12};${y}`} dur="1.4s" repeatCount="indefinite" /></circle>))}<rect x="72" y="130" width="56" height="20" rx="4" fill="#e5e7eb" opacity=".25" /><text x="8" y="113" fill="#eab308" fontSize="9">flue gas + SO₂</text><text x="134" y="50" fill="#e5e7eb" fontSize="9">CaCO₃ slurry</text><text x="134" y="146" fill="#e5e7eb" fontSize="9">gypsum</text><text x="108" y="10" fill={D.clean} fontSize="9">clean</text><text x="70" y="172" fill="#8aa0bf" fontSize="8">SO₂ + CaCO₃ + ½O₂ → CaSO₄ + CO₂</text></svg>) },
  { id: 'carbon', name: 'Carbon adsorption', principle: 'Gas passes through a bed of activated carbon whose enormous internal surface area holds organic molecules by physical adsorption. Saturated beds are regenerated with steam or heat, or replaced.', controls: 'VOCs, solvents, odours, benzene and some toxic organics (and mercury with treated carbon).', pros: ['Very effective for low-concentration VOCs', 'Solvent recovery possible', 'Simple operation'], cons: ['Bed saturation requires regeneration or replacement', 'Sensitive to humidity and high temperature', 'Not suited to particulate-laden gas without pre-filtering'],
    diagram: (<svg viewBox="0 0 200 180"><rect x="50" y="30" width="100" height="110" rx="8" fill="none" stroke={D.stroke} strokeWidth="2" />{Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={58 + (i * 17) % 86} cy={60 + Math.floor(i / 5) * 6} r="2.6" fill="#1f2937" stroke="#4b5563" />)}<path d="M100 170 V140" stroke="#a78bfa" strokeWidth="3" className="flow-dash" /><path d="M100 30 V5" stroke={D.clean} strokeWidth="3" className="flow-dash" /><text x="108" y="165" fill="#a78bfa" fontSize="9">VOC-laden gas</text><text x="108" y="14" fill={D.clean} fontSize="9">clean gas</text><text x="155" y="90" fill="#8aa0bf" fontSize="9">activated</text><text x="155" y="101" fill="#8aa0bf" fontSize="9">carbon bed</text></svg>) },
]

function IconGrid({ items }: { items: { Icon: typeof Sprout; t: string; d: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ Icon, t, d }, i) => (
        <Reveal key={t} delay={i * 0.04}><div className="glass glass-hover flex h-full gap-4 rounded-xl p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-leaf-400/10 text-leaf-400"><Icon size={20} /></span>
          <div><div className="font-display font-semibold text-white">{t}</div><p className="mt-1 text-[13px] leading-relaxed text-mist/70">{d}</p></div>
        </div></Reveal>
      ))}
    </div>
  )
}

function TechExplorer() {
  const [id, setId] = useState('esp')
  const t = TECH.find(x => x.id === id)!
  return (
    <div>
      <Tabs value={id} onChange={setId} size="sm" tabs={TECH.map(x => ({ id: x.id, label: x.name.split(' (')[0] }))} />
      <AnimatePresence mode="wait">
        <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass mt-5 grid gap-6 rounded-2xl p-6 sm:p-8 lg:grid-cols-[320px_1fr]">
          <div className="rounded-xl border border-white/10 bg-ink-950/60 p-4">{t.diagram}<div className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-mist/45">Simplified working diagram</div></div>
          <div>
            <h4 className="font-display text-2xl font-semibold text-white">{t.name}</h4>
            <div className="mt-4 font-mono text-[10.5px] uppercase tracking-wider text-leaf-400">Working principle</div>
            <p className="mt-1 text-sm leading-relaxed text-mist/85">{t.principle}</p>
            <div className="mt-4 font-mono text-[10.5px] uppercase tracking-wider text-leaf-400">Pollutants controlled</div>
            <p className="mt-1 text-sm text-mist/85">{t.controls}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-leaf-400/5 p-4"><div className="mb-2 text-sm font-semibold text-leaf-300">Advantages</div>{t.pros.map(p => <div key={p} className="flex gap-2 text-sm text-mist/80"><Check size={15} className="mt-0.5 shrink-0 text-leaf-400" />{p}</div>)}</div>
              <div className="rounded-xl bg-rose-500/5 p-4"><div className="mb-2 text-sm font-semibold text-rose-300">Limitations</div>{t.cons.map(p => <div key={p} className="flex gap-2 text-sm text-mist/80"><X size={15} className="mt-0.5 shrink-0 text-rose-400" />{p}</div>)}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function Mitigation() {
  const [fuel, setFuel] = useState(2)
  return (
    <Section id="mitigation">
      <SectionHeader index="06" kicker="Mitigation measures" title={<>From prediction to <span className="text-gradient">prevention.</span></>}
        intro="Unit IV groups mitigation into dust control, waste and fugitive-dust management, transportation controls and industrial air-pollution control devices." />
      <SubHeader letter="A" title="Dust control" />
      <IconGrid items={DUST} />
      <SubHeader letter="B" title="Waste and fugitive dust management" />
      <IconGrid items={WASTE} />
      <SubHeader letter="C" title="Transportation pollution control">Alternative fuels reduce emissions at the source; exhaust after-treatment cleans what remains.</SubHeader>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card hover={false}>
          <div className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white"><Fuel size={18} className="text-leaf-400" /> Alternative fuels</div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {FUELS.map((f, i) => (
              <button key={f.t} onClick={() => setFuel(i)} className={`rounded-lg border px-2 py-3 text-center text-xs font-medium transition ${fuel === i ? 'border-leaf-400 bg-leaf-400/15 text-white' : 'border-white/10 text-mist/70 hover:text-white'}`}>
                {i === 4 ? <Zap size={16} className="mx-auto mb-1" /> : i === 1 ? <Leaf size={16} className="mx-auto mb-1" /> : <Fuel size={16} className="mx-auto mb-1" />}{f.t}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={fuel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 rounded-xl bg-ink-950/50 p-5 text-sm leading-relaxed text-mist/85">
              <b className="text-white">{FUELS[fuel].t}.</b> {FUELS[fuel].d}
            </motion.p>
          </AnimatePresence>
        </Card>
        <Card hover={false}>
          <div className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white"><Gauge size={18} className="text-cyan-glow" /> Advanced exhaust controls</div>
          <ul className="space-y-2.5">
            {EXHAUST.map(e => <li key={e} className="flex gap-3 text-sm text-mist/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-glow" />{e}</li>)}
          </ul>
          <p className="mt-4 rounded-lg bg-cyan-400/5 p-3 text-xs leading-relaxed text-mist/70">India moved directly from Bharat Stage IV to <b className="text-white">BS-VI</b> emission norms nationwide from 1 April 2020, requiring these technologies on new vehicles.</p>
        </Card>
      </div>
      <SubHeader letter="D" title="Industrial pollution control devices">Select a technology to see how it works.</SubHeader>
      <TechExplorer />
    </Section>
  )
}
