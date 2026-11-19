import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Car, Factory, HardHat, Wind, Flame, Home, Zap, HeartPulse, TreePine, Sprout, Droplets, Coins } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, DataBadge, Tabs, chartTooltipStyle } from '../components/ui'

interface PollutantInfo {
  id: string; sym: string; name: string; color: string; size?: string
  what: string; sources: string; entry: string; impacts: string; control: string
}

const POLLUTANTS: PollutantInfo[] = [
  { id: 'pm25', sym: 'PM2.5', name: 'Fine particulate matter', color: '#f97316', size: '≤ 2.5 µm — about 1/30th the width of a human hair',
    what: 'Airborne particles with aerodynamic diameter of 2.5 micrometres or less — a mixture of soot, sulphates, nitrates, organic carbon and metals.',
    sources: 'Vehicle exhaust (especially diesel), industrial combustion, power plants, open waste burning, domestic solid-fuel use; also formed secondarily from SO₂, NOx and VOCs.',
    entry: 'Emitted directly from combustion (primary) and formed in the atmosphere by chemical reactions and condensation of gases (secondary).',
    impacts: 'Penetrates deep into the lungs and can enter the bloodstream; associated with respiratory and cardiovascular disease. Reduces visibility (haze).',
    control: 'Electrostatic precipitators, fabric filters, cleaner fuels, BS-VI vehicle standards with particulate filters, ban on open burning.' },
  { id: 'pm10', sym: 'PM10', name: 'Coarse / respirable particulate matter', color: '#f59e0b', size: '≤ 10 µm',
    what: 'Inhalable particles of diameter 10 µm or less, including PM2.5 plus coarser dust, pollen and mineral fragments.',
    sources: 'Road dust resuspension, construction and demolition, unpaved surfaces, crushing and quarrying, industry.',
    entry: 'Mechanically lifted by wind, vehicle movement and handling of materials; also from combustion.',
    impacts: 'Deposits in nose, throat and upper airways; aggravates asthma and bronchitis; settles on leaves and buildings, soiling surfaces.',
    control: 'Water sprinkling, paving roads, covering trucks and stockpiles, windbreaks, mechanical sweeping, cyclones for industry.' },
  { id: 'co', sym: 'CO', name: 'Carbon monoxide', color: '#94a3b8',
    what: 'A colourless, odourless gas produced by incomplete combustion of carbon-containing fuels.',
    sources: 'Petrol vehicles (particularly in congestion and idling), biomass and waste burning, poorly tuned engines and generators.',
    entry: 'Released directly from exhaust pipes and fires; highest near busy roads and junctions.',
    impacts: 'Binds with haemoglobin to form carboxyhaemoglobin, reducing oxygen delivery to organs; headaches, dizziness; dangerous for people with heart disease.',
    control: 'Catalytic converters, better combustion, traffic flow management, shift to electric and CNG vehicles.' },
  { id: 'so2', sym: 'SO₂', name: 'Sulphur dioxide', color: '#eab308',
    what: 'A pungent, reactive gas formed when sulphur-containing fuels are burned.',
    sources: 'Coal-fired power stations, oil refineries, high-sulphur fuel oil in industry and ships, smelters.',
    entry: 'Emitted mainly from tall industrial stacks; converts to sulphate particles and sulphuric acid in the air.',
    impacts: 'Irritates airways and triggers bronchoconstriction in asthmatics; major precursor of acid rain; damages leaves and corrodes buildings.',
    control: 'Low-sulphur fuels, flue-gas desulphurisation (wet limestone scrubbers), fuel switching.' },
  { id: 'nox', sym: 'NOx', name: 'Nitrogen oxides (NO + NO₂)', color: '#ef4444',
    what: 'Nitric oxide and nitrogen dioxide, formed when nitrogen and oxygen in air combine at high combustion temperatures.',
    sources: 'Road transport (diesel vehicles), power plants, industrial boilers, generators.',
    entry: 'NO is emitted and quickly oxidised to NO₂; NOx participates in ozone and nitrate-particle formation.',
    impacts: 'NO₂ inflames the airways and reduces lung function; contributes to smog, acid deposition and nutrient over-enrichment of water bodies.',
    control: 'Exhaust gas recirculation, selective catalytic reduction (SCR), low-NOx burners, three-way catalytic converters.' },
  { id: 'o3', sym: 'O₃', name: 'Ground-level ozone', color: '#22d3ee',
    what: 'A secondary pollutant — not emitted directly but formed when NOx and VOCs react in sunlight.',
    sources: 'Precursors from vehicles, industry, solvents and fuel evaporation; peaks on sunny afternoons, often downwind of the city.',
    entry: 'Photochemical reactions in the lower atmosphere (troposphere).',
    impacts: 'Causes chest pain, coughing and airway inflammation; damages leaf tissue and reduces crop yields.',
    control: 'Control both precursors — NOx and VOCs — through vehicle, industry and solvent controls.' },
  { id: 'voc', sym: 'VOCs', name: 'Volatile organic compounds', color: '#a78bfa',
    what: 'Carbon-based chemicals that evaporate easily — e.g. benzene, toluene, xylene, formaldehyde.',
    sources: 'Fuel evaporation at petrol pumps, vehicle exhaust, paints and solvents, refineries and petrochemicals, waste burning.',
    entry: 'Evaporation and incomplete combustion; react with NOx to form ozone and secondary organic aerosol.',
    impacts: 'Some (e.g. benzene) are carcinogenic; cause eye and throat irritation; key ozone precursors.',
    control: 'Vapour recovery at fuel stations, carbon adsorption, low-VOC paints, leak detection and repair in industry.' },
]

function ParticleViz({ color, dense }: { color: string; dense: boolean }) {
  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full">
      {Array.from({ length: dense ? 26 : 14 }).map((_, i) => {
        const x = (i * 37) % 118 + 1, y = (i * 23) % 56 + 2
        return <circle key={i} cx={x} cy={y} r={dense ? 1.6 : 2.6} fill={color} opacity={0.35 + ((i * 13) % 50) / 100}>
          <animate attributeName="cy" values={`${y};${y - 3};${y}`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      })}
    </svg>
  )
}

function PollutantCards() {
  const [sel, setSel] = useState('pm25')
  const p = POLLUTANTS.find(x => x.id === sel)!
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
        {POLLUTANTS.map(x => (
          <button key={x.id} onClick={() => setSel(x.id)}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${sel === x.id ? 'border-leaf-400/60 bg-leaf-400/10' : 'border-white/10 bg-ink-900/50 hover:border-white/25'}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-semibold" style={{ background: `${x.color}22`, color: x.color, boxShadow: `inset 0 0 0 1px ${x.color}55` }}>{x.sym.replace('PM', '')}</span>
            <span className="min-w-0">
              <span className="block font-display font-semibold text-white">{x.sym}</span>
              <span className="hidden truncate text-xs text-mist/60 sm:block">{x.name}</span>
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
          className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl" style={{ background: `${p.color}22` }} />
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-display text-5xl font-bold" style={{ color: p.color }}>{p.sym}</div>
                <div className="mt-1 text-lg text-white">{p.name}</div>
                {p.size && <div className="mt-1 font-mono text-xs text-mist/60">{p.size}</div>}
              </div>
              <div className="w-40"><ParticleViz color={p.color} dense={p.id === 'pm25'} /></div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[['What it is', p.what], ['Major sources', p.sources], ['How it enters the atmosphere', p.entry], ['Health & environmental impacts', p.impacts]].map(([h, t]) => (
                <div key={h} className="rounded-xl border border-white/5 bg-ink-950/40 p-4">
                  <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-leaf-400">{h}</div>
                  <p className="text-sm leading-relaxed text-mist/85">{t}</p>
                </div>
              ))}
              <div className="rounded-xl border border-leaf-400/25 bg-leaf-400/5 p-4 sm:col-span-2">
                <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-leaf-300">Control measures</div>
                <p className="text-sm leading-relaxed text-mist/85">{p.control}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const SOURCE_SAMPLE = [
  { id: 'transport', name: 'Transport', value: 30, color: '#34d399', Icon: Car,
    detail: 'Tailpipe exhaust (PM, NOx, CO, VOCs) plus brake and tyre wear. Emissions concentrate along arterial roads and junctions where exposure is highest.' },
  { id: 'dust', name: 'Road dust', value: 20, color: '#f59e0b', Icon: Wind,
    detail: 'Fine soil and debris on roads is repeatedly resuspended by traffic and wind; a dominant contributor to PM10 in many Indian cities.' },
  { id: 'industry', name: 'Industry', value: 16, color: '#ef4444', Icon: Factory,
    detail: 'Process and combustion emissions from refineries, chemical units, foundries and boilers — mainly SO₂, NOx, PM and VOCs.' },
  { id: 'construction', name: 'Construction & demolition', value: 12, color: '#fb923c', Icon: HardHat,
    detail: 'Excavation, demolition, cement and sand handling, and haul trucks. Highly variable and localised around project sites.' },
  { id: 'power', name: 'Power generation', value: 9, color: '#a78bfa', Icon: Zap,
    detail: 'Thermal power plants emit SO₂, NOx and fly ash from tall stacks; impacts spread regionally downwind.' },
  { id: 'waste', name: 'Waste burning', value: 7, color: '#f43f5e', Icon: Flame,
    detail: 'Open burning of refuse and dumpsite fires release smoke, CO, PM2.5 and toxic organic compounds at ground level.' },
  { id: 'domestic', name: 'Domestic fuel', value: 6, color: '#22d3ee', Icon: Home,
    detail: 'Cooking and heating with biomass, kerosene or coal — mostly a concern in low-income settlements without clean fuel access.' },
]

function SourceBreakdown() {
  const [active, setActive] = useState(0)
  const s = SOURCE_SAMPLE[active]
  return (
    <Card hover={false} className="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="font-display text-lg font-semibold text-white">Source contribution to urban PM (hover or tap a slice)</div>
        <DataBadge kind="sample" />
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={SOURCE_SAMPLE} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="92%" paddingAngle={2} stroke="none"
                onMouseEnter={(_, i) => setActive(i)} onClick={(_, i) => setActive(i)}>
                {SOURCE_SAMPLE.map((d, i) => <Cell key={d.id} fill={d.color} opacity={i === active ? 1 : 0.35} style={{ cursor: 'pointer', outline: 'none' }} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${v}% (sample)`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-4xl font-bold" style={{ color: s.color }}>{s.value}%</div>
              <div className="text-xs text-mist/60">sample share</div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SOURCE_SAMPLE.map((d, i) => (
              <button key={d.id} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${i === active ? 'border-white/30 bg-white/5 text-white' : 'border-white/5 text-mist/60 hover:text-white'}`}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />{d.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-xl border border-white/10 bg-ink-950/50 p-5">
              <div className="flex items-center gap-2 font-display font-semibold text-white"><s.Icon size={18} style={{ color: s.color }} /> {s.name}</div>
              <p className="mt-2 text-sm leading-relaxed text-mist/80">{s.detail}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-xs leading-relaxed text-mist/50">
            These percentages are <strong className="text-amber-300">illustrative only</strong>, chosen to show typical relative importance in Indian cities.
            They are not measured Chennai figures. Real apportionment requires a source-apportionment study (receptor modelling and emission inventory).
          </p>
        </div>
      </div>
    </Card>
  )
}

const EFFECTS = {
  health: { label: 'Human health', Icon: HeartPulse, color: '#f43f5e', items: [
    ['Respiratory system', 'Irritation, coughing, aggravated asthma, bronchitis and reduced lung function; fine particles reach the alveoli.'],
    ['Cardiovascular system', 'PM2.5 is linked to inflammation, raised blood pressure, heart attacks and stroke.'],
    ['Vulnerable groups', 'Children (developing lungs), the elderly, pregnant women and people with existing diseases face greater risk.'],
    ['Long-term exposure', 'WHO classifies outdoor air pollution and particulate matter as carcinogenic to humans (IARC Group 1, 2013).'],
  ] },
  env: { label: 'Environment', Icon: Wind, color: '#22d3ee', items: [
    ['Smog and haze', 'Photochemical smog and particulate haze reduce visibility and sunlight.'],
    ['Acid deposition', 'SO₂ and NOx form sulphuric and nitric acids that fall as acid rain or dry deposits.'],
    ['Climate interaction', 'Black carbon absorbs heat; sulphate aerosols reflect sunlight; ozone is a greenhouse gas.'],
    ['Materials', 'Corrosion of metals, discolouration of monuments and soiling of buildings.'],
  ] },
  plants: { label: 'Plants & vegetation', Icon: TreePine, color: '#34d399', items: [
    ['Leaf injury', 'SO₂ and ozone cause chlorosis (yellowing) and necrosis (dead patches) of leaf tissue.'],
    ['Dust on leaves', 'Deposited dust blocks stomata and reduces photosynthesis in roadside trees.'],
    ['Crop yield', 'Ground-level ozone is known to reduce yields of sensitive crops such as wheat and rice.'],
    ['Biodiversity', 'Sensitive species such as lichens disappear first — they are used as bio-indicators.'],
  ] },
  soil: { label: 'Soil & water', Icon: Droplets, color: '#60a5fa', items: [
    ['Soil acidification', 'Acid deposition leaches nutrients like calcium and magnesium and mobilises aluminium.'],
    ['Heavy metals', 'Lead, cadmium and other metals in particulates accumulate in urban soils.'],
    ['Water bodies', 'Deposition of nitrogen and acids alters lake and river chemistry; contributes to eutrophication.'],
    ['Food chain', 'Pollutants deposited on soil and water can enter crops, fish and ultimately humans.'],
  ] },
  econ: { label: 'Economic & social', Icon: Coins, color: '#f59e0b', items: [
    ['Healthcare costs', 'Hospital visits, medicines and long-term treatment for pollution-related illness.'],
    ['Productivity', 'Lost working days and school absences reduce economic output and learning.'],
    ['Inequality', 'Low-income communities near roads, industries and dumpsites often face the highest exposure.'],
    ['Tourism & liveability', 'Poor air quality reduces a city\'s attractiveness for residents, visitors and investment.'],
  ] },
}
type EffKey = keyof typeof EFFECTS

function Effects() {
  const [tab, setTab] = useState<EffKey>('health')
  const e = EFFECTS[tab]
  return (
    <div>
      <Tabs value={tab} onChange={setTab} tabs={(Object.keys(EFFECTS) as EffKey[]).map(k => ({ id: k, label: EFFECTS[k].label }))} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="glass flex flex-col items-center justify-center rounded-2xl p-6 text-center">
            <div className="relative grid h-24 w-24 place-items-center rounded-full" style={{ background: `${e.color}15`, boxShadow: `0 0 60px ${e.color}33` }}>
              <span className="absolute inset-0 rounded-full border" style={{ borderColor: `${e.color}66`, animation: 'pulse-ring 3s ease-out infinite' }} />
              <e.Icon size={40} style={{ color: e.color }} />
            </div>
            <div className="mt-4 font-display text-lg font-semibold text-white">{e.label}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {e.items.map(([h, t], i) => (
              <motion.div key={h} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 font-display font-semibold text-white"><span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />{h}</div>
                <p className="mt-2 text-sm leading-relaxed text-mist/75">{t}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function Science() {
  return (
    <Section id="science">
      <SectionHeader index="02" kicker="Understanding air pollution" title={<>The chemistry of <span className="text-gradient">what we inhale.</span></>}
        intro="Seven pollutants dominate urban air-quality management. Each has distinct sources, behaviour in the atmosphere and effects on people and ecosystems." />
      <SubHeader letter="A" title="Types of air pollutants">Select a pollutant to see what it is, where it comes from and how it is controlled.</SubHeader>
      <PollutantCards />
      <SubHeader letter="B" title="Sources of air pollution">Seven source sectors contribute to urban air pollution. Their share varies widely between cities, seasons and pollutants.</SubHeader>
      <SourceBreakdown />
      <SubHeader letter="C" title="Effects of air pollution">Pollution affects people, ecosystems and economies through many pathways.</SubHeader>
      <Effects />
      <Reveal className="mt-6 flex items-center gap-2 text-xs text-mist/50"><Sprout size={14} className="text-leaf-400" /> Health effects summarised from WHO and CPCB material; see References.</Reveal>
    </Section>
  )
}
