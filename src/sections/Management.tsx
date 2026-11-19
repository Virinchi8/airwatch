import { useState } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Factory, HardHat, Bus, Users, Radar, MessagesSquare, RefreshCcw, ShieldCheck, Wrench, Search } from 'lucide-react'
import { Section, SectionHeader, SubHeader, Reveal, Tabs } from '../components/ui'

const RECS = {
  gov: { label: 'Government', Icon: Landmark, items: ['Expand the continuous monitoring network to cover industrial, traffic and residential zones', 'Implement and fund the NCAP city action plan with ward-level targets', 'Integrate air-quality modelling into master plans and building approvals', 'Enforce bans on open burning and complete biomining of legacy dumpsites', 'Publish data openly and issue health advisories during episodes'] },
  ind: { label: 'Industries', Icon: Factory, items: ['Install and maintain APCDs — ESPs, bag filters, FGD, scrubbers — matched to pollutants', 'Operate online continuous emission monitoring (OCEMS) linked to the regulator', 'Switch to cleaner fuels and improve combustion efficiency', 'Leak detection and repair for VOCs; emergency preparedness for gas leaks', 'Develop green belts around plant boundaries'] },
  con: { label: 'Construction', Icon: HardHat, items: ['Erect wind barriers / screens around sites', 'Sprinkle water on haul roads and exposed surfaces; use fog cannons', 'Cover trucks, stockpiles and debris; install wheel-washing at exits', 'Use ready-mix concrete and wet cutting to reduce dust', 'Monitor PM10 at site boundaries and stop dusty work in high winds'] },
  tra: { label: 'Transport', Icon: Bus, items: ['Expand metro and electric bus fleets; integrate last-mile connectivity', 'Improve footpaths and cycle lanes to encourage non-motorised travel', 'Synchronise traffic signals and remove bottlenecks to cut idling', 'Enforce PUC checks and phase out old polluting vehicles', 'Mechanical road sweeping and paving of road shoulders'] },
  cit: { label: 'Citizens', Icon: Users, items: ['Use public transport, carpool, walk or cycle for short trips', 'Never burn garbage, leaves or old items — including during Bhogi', 'Maintain vehicles and avoid idling engines', 'Check the AQI before outdoor exercise; protect children and elders on poor days', 'Plant and protect trees; report violations to the Pollution Control Board'] },
}
type RecKey = keyof typeof RECS

const EMP = [
  { issue: 'Fugitive dust from construction', measure: 'Wind barriers, water sprinkling, covered transport, wheel-washing', auth: 'Project proponent / contractor; GCC; TNPCB', mon: 'PM10 & PM2.5 at site boundary (24-h, weekly); site inspections' },
  { issue: 'Road dust resuspension', measure: 'Mechanical sweeping, paving shoulders, prompt removal of debris', auth: 'Greater Chennai Corporation; Highways Dept.', mon: 'PM10 at roadside stations; silt-loading surveys' },
  { issue: 'Vehicular exhaust (NOx, CO, PM)', measure: 'Electric/CNG buses, PUC enforcement, traffic signal coordination', auth: 'Transport Dept.; MTC; Traffic Police', mon: 'Kerbside NO₂/CO monitoring; PUC compliance records' },
  { issue: 'Industrial stack emissions (SO₂, NOx, PM)', measure: 'ESPs, FGD, scrubbers, low-NOx burners; fuel quality control', auth: 'Industry; TNPCB; CPCB', mon: 'OCEMS stack data; quarterly stack sampling; ambient monitoring downwind' },
  { issue: 'VOC emissions from refineries / storage', measure: 'Floating-roof tanks, vapour recovery, LDAR programme, carbon adsorption', auth: 'Industry; TNPCB', mon: 'VOC/benzene monitoring at fence-line; LDAR audit reports' },
  { issue: 'Open waste burning & dumpsite fires', measure: 'Segregated collection, biomining, fire surveillance, public awareness', auth: 'GCC; TNPCB; Fire & Rescue Services', mon: 'Complaint logs; satellite/thermal fire detection; episodic PM monitoring' },
  { issue: 'Loss of green cover', measure: 'Green belts, roadside plantation with dust-tolerant species', auth: 'Forest Dept.; GCC; CMDA', mon: 'Tree census; satellite vegetation indices; survival audits' },
  { issue: 'Exceedance of NAAQS / episodes', measure: 'Graded action plan, public advisories, temporary restrictions', auth: 'TNPCB; District administration', mon: 'Continuous CAAQMS data; daily AQI bulletin' },
]

const PILLARS = [
  { Icon: Radar, t: 'Continuous monitoring', d: 'Real-time stations reveal trends, episodes and hotspots and verify whether controls are working.' },
  { Icon: MessagesSquare, t: 'Public participation', d: 'Public hearings in EIA, open data and citizen reporting build accountability and better decisions.' },
  { Icon: RefreshCcw, t: 'Periodic assessment', d: 'Re-assess impacts as cities and projects change; update emission inventories and models.' },
  { Icon: ShieldCheck, t: 'Compliance with standards', d: 'Consent conditions, emission limits and NAAQS give measurable targets that can be enforced.' },
  { Icon: Wrench, t: 'Corrective action', d: 'When monitoring shows exceedance, trigger pre-agreed responses — from equipment repair to restrictions.' },
]

export function Management() {
  const [tab, setTab] = useState<RecKey>('gov')
  const [q, setQ] = useState('')
  const R = RECS[tab]
  const rows = EMP.filter(r => (r.issue + r.measure + r.auth + r.mon).toLowerCase().includes(q.toLowerCase()))
  return (
    <Section id="management" className="grid-bg">
      <SectionHeader index="09" kicker="Environmental management" title={<>Recommendations & the <span className="text-gradient">management plan.</span></>}
        intro="Mitigation only works when responsibilities are assigned and results are monitored. These recommendations and the EMP translate the assessment into action." />
      <SubHeader letter="A" title="Recommendations by stakeholder" />
      <Tabs value={tab} onChange={setTab} tabs={(Object.keys(RECS) as RecKey[]).map(k => ({ id: k, label: RECS[k].label }))} />
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {R.items.map((it, i) => (
          <motion.div key={it} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between"><R.Icon size={18} className="text-leaf-400" /><span className="font-mono text-xs text-mist/40">0{i + 1}</span></div>
            <p className="mt-3 text-sm leading-relaxed text-mist/85">{it}</p>
          </motion.div>
        ))}
      </motion.div>

      <SubHeader letter="B" title="Environmental Management Plan (EMP)">A framework EMP for urban air quality in Chennai. Search to filter rows.</SubHeader>
      <div className="mb-4 flex max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-ink-900/70 px-3 py-2">
        <Search size={15} className="text-mist/50" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter e.g. dust, TNPCB, VOC…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-mist/40" aria-label="Filter EMP table" />
      </div>
      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-ink-900/60 font-mono text-[11px] uppercase tracking-wider text-mist/60">
              <th className="px-5 py-4">Environmental issue</th><th className="px-5 py-4">Mitigation measure</th><th className="px-5 py-4">Responsible authority</th><th className="px-5 py-4">Monitoring method</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.issue} className="border-b border-white/5 align-top transition hover:bg-white/[0.03]">
                <td className="px-5 py-4 font-medium text-white">{r.issue}</td>
                <td className="px-5 py-4 text-mist/80">{r.measure}</td>
                <td className="px-5 py-4 text-leaf-300/90">{r.auth}</td>
                <td className="px-5 py-4 text-mist/70">{r.mon}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={4} className="px-5 py-6 text-center text-mist/50">No rows match “{q}”.</td></tr>}
          </tbody>
        </table>
      </div>

      <SubHeader letter="C" title="Pillars of effective air-quality management" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map(({ Icon, t, d }, i) => (
          <Reveal key={t} delay={i * 0.05}><div className="glass glass-hover h-full rounded-xl p-5">
            <Icon size={22} className="text-cyan-glow" />
            <div className="mt-3 font-display font-semibold text-white">{t}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-mist/70">{d}</p>
          </div></Reveal>
        ))}
      </div>
    </Section>
  )
}
