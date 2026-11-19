import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Landmark, Building, ScrollText, Target, BadgeCheck } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Card, Tabs, DataBadge } from '../components/ui'

const TIMELINE = [
  { y: '1974', t: 'CPCB constituted', d: 'The Central Pollution Control Board was constituted in September 1974 under the Water (Prevention and Control of Pollution) Act, 1974; later entrusted with air-pollution functions under the Air Act, 1981.' },
  { y: '1981', t: 'Air (Prevention and Control of Pollution) Act', d: 'Dedicated law to prevent, control and abate air pollution. Empowers State Boards to declare air-pollution control areas, requires consent to establish/operate industries, and lets Boards set emission standards. Amended in 1987 to include noise and allow citizen complaints.' },
  { y: '1986', t: 'Environment (Protection) Act', d: 'Umbrella legislation enacted after the Bhopal gas tragedy. Empowers the Central Government to set emission and discharge standards, regulate industry location and issue directions — including closure. The EP Rules, 1986 and the EIA Notification, 2006 are framed under it.' },
  { y: '2006', t: 'EIA Notification', d: 'Makes prior environmental clearance mandatory for listed projects, with an air-environment assessment covering baseline, prediction and EMP.' },
  { y: '2009', t: 'NAAQS revised', d: 'CPCB notified the revised National Ambient Air Quality Standards on 18 November 2009 for 12 pollutants, applying the same limits to industrial and residential areas.' },
  { y: '2014', t: 'National AQI launched', d: 'A single-number index with six categories for eight pollutants, to communicate air quality to the public.' },
  { y: '2019', t: 'National Clean Air Programme', d: 'Launched by MoEFCC in January 2019 as a national strategy with city action plans for non-attainment cities, tracked on the PRANA portal.' },
]

type Row = { p: string; avg: string; ind: string; eco: string; who: string; unit: string }
const NAAQS: Row[] = [
  { p: 'Sulphur dioxide (SO₂)', avg: 'Annual / 24 h', ind: '50 / 80', eco: '20 / 80', who: '— / 40', unit: 'µg/m³' },
  { p: 'Nitrogen dioxide (NO₂)', avg: 'Annual / 24 h', ind: '40 / 80', eco: '30 / 80', who: '10 / 25', unit: 'µg/m³' },
  { p: 'PM10', avg: 'Annual / 24 h', ind: '60 / 100', eco: '60 / 100', who: '15 / 45', unit: 'µg/m³' },
  { p: 'PM2.5', avg: 'Annual / 24 h', ind: '40 / 60', eco: '40 / 60', who: '5 / 15', unit: 'µg/m³' },
  { p: 'Ozone (O₃)', avg: '8 h / 1 h', ind: '100 / 180', eco: '100 / 180', who: '100 / —', unit: 'µg/m³' },
  { p: 'Lead (Pb)', avg: 'Annual / 24 h', ind: '0.5 / 1.0', eco: '0.5 / 1.0', who: '—', unit: 'µg/m³' },
  { p: 'Carbon monoxide (CO)', avg: '8 h / 1 h', ind: '2 / 4', eco: '2 / 4', who: '24 h: 4', unit: 'mg/m³' },
  { p: 'Ammonia (NH₃)', avg: 'Annual / 24 h', ind: '100 / 400', eco: '100 / 400', who: '—', unit: 'µg/m³' },
  { p: 'Benzene (C₆H₆)', avg: 'Annual', ind: '5', eco: '5', who: '—', unit: 'µg/m³' },
  { p: 'Benzo(a)pyrene (particulate)', avg: 'Annual', ind: '1', eco: '1', who: '—', unit: 'ng/m³' },
  { p: 'Arsenic (As)', avg: 'Annual', ind: '6', eco: '6', who: '—', unit: 'ng/m³' },
  { p: 'Nickel (Ni)', avg: 'Annual', ind: '20', eco: '20', who: '—', unit: 'ng/m³' },
]

const ROLES = {
  cpcb: { Icon: Landmark, title: 'Central Pollution Control Board', items: ['Advises the Central Government on prevention and control of air pollution', 'Plans and executes a nationwide programme — the National Air Quality Monitoring Programme (NAMP) and continuous stations (CAAQMS)', 'Lays down ambient standards (NAAQS) and coordinates State Boards', 'Publishes the National AQI and technical guidelines', 'Nodal technical agency for implementing NCAP'] },
  spcb: { Icon: Building, title: 'State Pollution Control Boards (e.g. TNPCB)', items: ['Grant, refuse or revoke Consent to Establish and Consent to Operate for industries under the Air Act', 'Inspect industries, sample stack emissions and ambient air', 'Declare air-pollution control areas and enforce standards in the state', 'Operate state monitoring stations and public information (e.g. Bhogi monitoring by TNPCB)', 'Take action against violators — directions, closure, prosecution'] },
}

export function Laws() {
  const [role, setRole] = useState<'cpcb' | 'spcb'>('cpcb')
  const [showWho, setShowWho] = useState(true)
  const R = ROLES[role]
  return (
    <Section id="laws">
      <SectionHeader index="08" kicker="Laws & standards" title={<>The legal framework for <span className="text-gradient">clean air in India.</span></>}
        intro="Indian air-quality governance rests on two key Acts, a set of ambient standards, a national index and a time-bound national programme — implemented through central and state pollution control boards." />

      <div className="relative">
        <div className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-leaf-400/50 to-transparent lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {TIMELINE.map((e, i) => (
            <Reveal key={e.y} delay={i * 0.06}>
              <div className="group h-full">
                <div className="font-display text-3xl font-bold text-white/90">{e.y}</div>
                <div className="my-3 hidden h-3 w-3 rounded-full border-2 border-leaf-400 bg-ink-950 transition group-hover:bg-leaf-400 lg:block" />
                <div className="glass rounded-xl p-4">
                  <div className="text-sm font-semibold text-leaf-300">{e.t}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist/70">{e.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <SubHeader letter="A" title="Key legislation and programmes" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><Gavel className="text-leaf-400" /><h4 className="mt-3 font-display text-lg font-semibold text-white">Air Act, 1981</h4><p className="mt-2 text-sm leading-relaxed text-mist/75">Defines air pollutants; constitutes Board functions for air; requires prior consent of the State Board to operate any industrial plant in an air-pollution control area; empowers Boards to restrict fuels and lay down emission standards; prescribes penalties for non-compliance.</p></Card>
        <Card><ScrollText className="text-leaf-400" /><h4 className="mt-3 font-display text-lg font-semibold text-white">Environment (Protection) Act, 1986</h4><p className="mt-2 text-sm leading-relaxed text-mist/75">Gives the Central Government wide powers to protect and improve the environment: set standards for emissions, restrict industrial areas, handle hazardous substances, and issue binding directions. Basis for the EIA Notification and sector-wise emission standards.</p></Card>
        <Card><Target className="text-leaf-400" /><h4 className="mt-3 font-display text-lg font-semibold text-white">National Clean Air Programme</h4><p className="mt-2 text-sm leading-relaxed text-mist/75">Launched in 2019, initially targeting a 20–30% reduction in PM concentrations by 2024 (2017 base); the target was later revised to up to 40% reduction in PM10 by 2025–26 for over 130 cities, including Chennai. Progress is tracked on the PRANA portal.</p></Card>
      </div>

      <SubHeader letter="B" title="National Ambient Air Quality Standards, 2009">Concentration limits in ambient air. The 24-hourly or 8-hourly values should be met 98% of the time in a year (they may be exceeded on up to 2% of days, but not on two consecutive days).</SubHeader>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <DataBadge kind="verified" label="CPCB notification, 18 Nov 2009 · WHO AQG 2021" />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-mist/80">
          <input type="checkbox" checked={showWho} onChange={e => setShowWho(e.target.checked)} className="h-4 w-4 accent-emerald-400" /> Compare with WHO 2021 guidelines
        </label>
      </div>
      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-ink-900/60 font-mono text-[11px] uppercase tracking-wider text-mist/60">
              <th className="px-5 py-4">Pollutant</th><th className="px-5 py-4">Averaging time</th><th className="px-5 py-4">Industrial, residential, rural & other areas</th><th className="px-5 py-4">Ecologically sensitive areas</th>
              {showWho && <th className="px-5 py-4 text-cyan-300">WHO AQG 2021</th>}<th className="px-5 py-4">Unit</th>
            </tr>
          </thead>
          <tbody>
            {NAAQS.map((r, i) => (
              <motion.tr key={r.p} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                <td className="px-5 py-3 font-medium text-white">{r.p}</td>
                <td className="px-5 py-3 text-mist/70">{r.avg}</td>
                <td className="px-5 py-3 font-mono text-leaf-300">{r.ind}</td>
                <td className="px-5 py-3 font-mono text-leaf-300/80">{r.eco}</td>
                {showWho && <td className="px-5 py-3 font-mono text-cyan-300">{r.who}</td>}
                <td className="px-5 py-3 text-mist/60">{r.unit}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mist/50">WHO values: annual / 24-h for PM, NO₂; 24-h for SO₂ and CO; 8-h daily maximum for O₃ (peak-season guideline 60 µg/m³ not shown). “—” = no corresponding WHO 2021 guideline value. WHO guidelines are health-based recommendations, not legally binding in India.</p>

      <SubHeader letter="C" title="Institutional roles" />
      <Tabs value={role} onChange={setRole} tabs={[{ id: 'cpcb', label: 'CPCB' }, { id: 'spcb', label: 'State PCBs / TNPCB' }]} />
      <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-5 grid gap-6 rounded-2xl p-6 sm:p-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-start gap-3"><R.Icon size={42} className="text-leaf-400" /><div className="font-display text-xl font-semibold text-white">{R.title}</div></div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {R.items.map(it => <li key={it} className="flex gap-2.5 text-sm text-mist/80"><BadgeCheck size={17} className="mt-0.5 shrink-0 text-leaf-400" />{it}</li>)}
        </ul>
      </motion.div>
    </Section>
  )
}
