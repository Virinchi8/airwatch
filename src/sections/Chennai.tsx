import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Car, Factory, HardHat, Waves, Thermometer, Trash2, Flame, Ship, Wind, HeartPulse, Baby, Leaf, Eye, Globe2, ClipboardCheck, Radar, CloudSun, LineChart, Scale, Wrench, MapPin } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, DataBadge, Expandable } from '../components/ui'

const PROFILE = [
  { Icon: Users, t: 'Urbanisation & population', d: 'Chennai city had about 4.65 million people and the urban agglomeration about 8.65 million at the 2011 Census. In 2011 the Greater Chennai Corporation expanded to about 426 km², absorbing surrounding municipalities. Growth continues along the OMR (IT corridor), GST Road and the western suburbs.', src: 'Census of India 2011; Greater Chennai Corporation' },
  { Icon: Car, t: 'Transportation patterns', d: 'A large and growing fleet of two-wheelers and cars dominates road travel, alongside MTC buses, suburban rail, MRTS and Chennai Metro (Phase 1 opened from 2015; Phase 2 under construction). Arterial roads such as Anna Salai, Poonamallee High Road and GST Road see heavy congestion.', src: 'CMRL; MTC' },
  { Icon: Factory, t: 'Industrial & commercial activity', d: 'North Chennai hosts the Manali petrochemical cluster (including a refinery and chemical/fertiliser units) and the Ennore–Kamarajar port and thermal power belt. Industrial estates such as Guindy and Ambattur, and the automobile corridor towards Sriperumbudur–Oragadam, add manufacturing emissions.', src: 'TNPCB; SIPCOT' },
  { Icon: HardHat, t: 'Construction & infrastructure', d: 'Metro Phase 2 corridors, flyovers, storm-water drains, road widening and high-rise real estate create widespread, shifting sources of construction dust and truck traffic.', src: 'CMRL; GCC' },
  { Icon: Waves, t: 'Geography', d: 'A flat, low-lying coastal city on the Coromandel coast of the Bay of Bengal. The sea breeze typically sets in during afternoons, flushing pollutants inland and helping dispersion compared with land-locked cities.', src: 'IMD' },
  { Icon: Thermometer, t: 'Meteorology', d: 'Tropical wet-and-dry climate. Most rainfall arrives with the north-east monsoon (October–December), which washes out particles. Calm winter mornings (December–February) with low mixing heights and weak winds trap pollutants near the ground.', src: 'IMD' },
]

const SOURCES = [
  { Icon: Car, t: 'Vehicular emissions', d: 'The single most widespread urban source. Exhaust NO₂, CO and PM2.5 peak along arterials and junctions during morning and evening rush hours; diesel trucks serving the port add to north Chennai traffic.' },
  { Icon: Factory, t: 'Industrial clusters', d: 'Manali–Ennore–Kathivakkam hosts refining, petrochemical, fertiliser and power units. Residents have long raised concerns over SO₂, VOCs, odour and fly ash. In December 2023 an ammonia leak from a fertiliser unit\'s pipeline at Ennore led to residents being hospitalised.' },
  { Icon: HardHat, t: 'Construction dust', d: 'Excavation for metro stations, building demolition, sand and cement handling and uncovered trucks raise PM10, often near homes and schools.' },
  { Icon: Wind, t: 'Road dust', d: 'Silt deposited on roads — after drain works, monsoon flooding and construction spill-over — is resuspended by traffic, particularly on road edges and unpaved shoulders.' },
  { Icon: Trash2, t: 'Waste & dumpsite fires', d: 'Large dumpsites at Kodungaiyur and Perungudi have experienced fires — including a major Perungudi fire in April 2022 — releasing smoke over nearby neighbourhoods. Biomining is under way to reclaim these sites.' },
  { Icon: Flame, t: 'Bhogi & festival burning', d: 'On Bhogi (January), the tradition of burning old belongings — including tyres and plastics in some cases — causes a sharp, short-lived spike in particulates and visibility problems. TNPCB monitors air quality around Bhogi and campaigns for a smoke-free festival.' },
  { Icon: Ship, t: 'Other urban sources', d: 'Port and shipping activity, diesel generator sets, crematoria, commercial kitchens, and fireworks during Deepavali.' },
]

const POLLUTANTS = [
  { p: 'PM2.5', c: '#f97316', r: 'Primary concern for health. Driven by combustion — vehicles, industry, burning. Short episodes in winter and during Bhogi/Deepavali.' },
  { p: 'PM10', c: '#f59e0b', r: 'Strongly influenced by construction and road dust; often the parameter most likely to approach or exceed the 24-h standard near busy roads.' },
  { p: 'NO₂', c: '#ef4444', r: 'Traffic marker. Highest at kerbside sites and congested junctions; also emitted by power plants in north Chennai.' },
  { p: 'SO₂', c: '#eab308', r: 'Associated with refineries, thermal power and port activity; relevant mainly in the Manali–Ennore belt.' },
  { p: 'CO', c: '#94a3b8', r: 'Peaks with slow-moving traffic and near open burning; relevant to traffic police and commuters.' },
  { p: 'O₃', c: '#22d3ee', r: 'Secondary pollutant forming on sunny afternoons from NOx and VOCs, potentially highest downwind (inland) of the city centre.' },
]

const IMPACTS = [
  { Icon: HeartPulse, t: 'Respiratory health', d: 'Exposure to PM and NO₂ can aggravate asthma, bronchitis and other respiratory conditions, especially in people living near arterial roads and industrial zones.' },
  { Icon: HeartPulse, t: 'Cardiovascular health', d: 'Long-term exposure to fine particles is associated with heart disease and stroke in the global evidence reviewed by WHO.' },
  { Icon: Baby, t: 'Children & elderly', d: 'Children breathe more air per kg of body weight and their lungs are still developing; older adults often have pre-existing conditions — both are sensitive receptors.' },
  { Icon: Leaf, t: 'Urban vegetation', d: 'Dust coats roadside leaves and blocks stomata; SO₂ near industrial areas can cause leaf injury. Wetlands such as Pallikaranai and Ennore Creek face multiple pressures.' },
  { Icon: Eye, t: 'Visibility', d: 'Particulate haze reduces visibility; episodes such as Bhogi smoke have disrupted flights at Chennai airport in past years.' },
  { Icon: Globe2, t: 'Environmental quality', d: 'Deposition onto soil and water, soiling of buildings, and lower quality of life — with the highest burden often on low-income communities near sources.' },
]

const FINDINGS = [
  { Icon: Radar, t: 'Baseline assessment', d: 'Compile CAAQMS records from CPCB/TNPCB (e.g. Alandur, Velachery, Manali) plus manual NAMP stations. Supplement with a season of monitoring at sensitive receptors. Compute 24-h and annual averages; compare with NAAQS.', o: 'Particulate matter is the key parameter to watch; gaseous pollutants are generally of local concern near industry and traffic.' },
  { Icon: MapPin, t: 'Source identification', d: 'Build an emission inventory by sector and ward: vehicle counts × emission factors; industrial consents and stack data; construction permits; waste-burning surveys. A receptor-based source apportionment study confirms the mix.', o: 'Transport, road dust and construction are expected to dominate city-wide PM; industry and power dominate in the north.' },
  { Icon: CloudSun, t: 'Meteorological analysis', d: 'Use IMD and on-site data to construct seasonal wind roses, mixing heights and stability-class frequencies. Identify sea-breeze patterns and calm winter episodes.', o: 'Onshore winds carry north Chennai emissions inland; winter calms produce the worst dispersion.' },
  { Icon: LineChart, t: 'Impact prediction', d: 'Run a Gaussian model (e.g. AERMOD) for industrial stacks, a line-source model for major roads, and a box/area model for construction and diffuse sources. Predicted = baseline + increment.', o: 'Highest increments expected downwind of stacks and within ~100–200 m of major roads.' },
  { Icon: Scale, t: 'Significance assessment', d: 'Rate impacts by magnitude (vs NAAQS), duration, extent, reversibility and receptor sensitivity. Flag any receptor where predicted levels exceed standards.', o: 'Residential areas adjoining industry, dumpsites and arterial roads are priority receptors.' },
  { Icon: Wrench, t: 'Mitigation recommendations', d: 'Combine source controls (industrial APCDs, cleaner vehicles, dust control) with planning measures (green buffers, traffic management) and a monitoring plan.', o: 'See Sections 06–09 for mitigation options, the simulator and the Environmental Management Plan.' },
]

export function Chennai() {
  const [f, setF] = useState(0)
  return (
    <Section id="chennai" className="overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-cyan-glow/5 blur-3xl" />
      <SectionHeader index="04" kicker="Case study" title={<>Urban air pollution in <span className="text-gradient">Chennai</span> — a case study</>}
        intro="Chennai, the capital of Tamil Nadu, is one of India's largest metropolitan regions. Its coastal location gives it natural advantages for dispersion, yet rapid growth, traffic, industry in the north and frequent construction create persistent air-quality challenges." />

      <Reveal className="mb-10 flex flex-wrap gap-2">
        <DataBadge kind="verified" label="Facts cited to official sources" />
        <DataBadge kind="note" label="No station readings are reproduced here — see the CPCB portal for measured data" />
      </Reveal>

      <SubHeader letter="A" title="Introduction to Chennai" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROFILE.map(({ Icon, t, d, src }, i) => (
          <Reveal key={t} delay={i * 0.05}><Card className="h-full">
            <Icon className="text-leaf-400" size={22} />
            <h4 className="mt-3 font-display text-lg font-semibold text-white">{t}</h4>
            <p className="mt-2 text-sm leading-relaxed text-mist/80">{d}</p>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-mist/40">Source: {src}</div>
          </Card></Reveal>
        ))}
      </div>

      <SubHeader letter="B" title="Major pollution sources in Chennai" />
      <div className="relative">
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-leaf-400/60 via-white/10 to-transparent md:left-1/2" />
        <div className="space-y-6">
          {SOURCES.map(({ Icon, t, d }, i) => (
            <Reveal key={t}>
              <div className={`relative flex items-start gap-5 md:w-1/2 ${i % 2 ? 'md:ml-auto md:pl-10' : 'md:flex-row-reverse md:pr-10 md:text-right'}`}>
                <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-leaf-400/50 bg-ink-900 text-leaf-400 md:absolute md:top-2 ${i % 2 ? 'md:-left-5' : 'md:-right-5'}`}><Icon size={18} /></span>
                <div className="glass glass-hover flex-1 rounded-xl p-5">
                  <div className="font-display font-semibold text-white">{t}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist/75">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <SubHeader letter="C" title="Pollutant analysis — what matters in Chennai" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {POLLUTANTS.map(({ p, c, r }, i) => (
          <Reveal key={p} delay={i * 0.05}>
            <div className="glass glass-hover relative h-full overflow-hidden rounded-xl p-5">
              <div className="absolute inset-y-0 left-0 w-1" style={{ background: c }} />
              <div className="font-display text-2xl font-bold" style={{ color: c }}>{p}</div>
              <p className="mt-2 text-sm leading-relaxed text-mist/80">{r}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <SubHeader letter="D" title="Environmental and health impacts">Described qualitatively from WHO and CPCB evidence. No Chennai-specific health statistics are claimed.</SubHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IMPACTS.map(({ Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 0.05}><Card className="h-full">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-rose-500/10 text-rose-400"><Icon size={20} /></span><h4 className="font-display font-semibold text-white">{t}</h4></div>
            <p className="mt-3 text-sm leading-relaxed text-mist/75">{d}</p>
          </Card></Reveal>
        ))}
      </div>

      <SubHeader letter="E" title="Assessment and findings">How an air-environment EIA would be carried out for Chennai, with the expected qualitative findings at each stage.</SubHeader>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {FINDINGS.map(({ Icon, t }, i) => (
            <button key={t} onClick={() => setF(i)} className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${f === i ? 'border-leaf-400/60 bg-leaf-400/10 text-white' : 'border-white/10 text-mist/70 hover:text-white'}`}>
              <Icon size={18} className={f === i ? 'text-leaf-400' : ''} /> {t}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={f} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-6 sm:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-leaf-400">Stage {f + 1}</div>
            <h4 className="mt-2 font-display text-2xl font-semibold text-white">{FINDINGS[f].t}</h4>
            <p className="mt-4 leading-relaxed text-mist/85">{FINDINGS[f].d}</p>
            <div className="mt-6 rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-5">
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-cyan-300"><ClipboardCheck size={14} /> Expected finding (qualitative)</div>
              <p className="mt-2 text-sm text-mist/85">{FINDINGS[f].o}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Expandable title="Why is Chennai's air often cleaner than north Indian cities — yet still a concern?">
          Coastal location, sea breeze and the absence of large-scale crop-residue burning nearby generally give Chennai better dispersion than Indo-Gangetic plain cities.
          However, particulate levels can still exceed WHO guidelines, local hotspots near roads and industry persist, and short episodes (Bhogi, Deepavali, dumpsite fires,
          calm winter mornings) can push the AQI into “Poor” or worse. Chennai is among the cities covered under the National Clean Air Programme.
        </Expandable>
        <Expandable title="Where to get real Chennai data for your report">
          Use the CPCB National AQI portal (station-wise hourly and daily AQI), CPCB's CCR data portal, TNPCB's ambient air quality pages and the PRANA (NCAP) portal. Cite the station,
          the averaging period and the date range for any value you quote. Links are in the References section.
        </Expandable>
      </div>
    </Section>
  )
}
