import { ExternalLink, Download, BookOpen } from 'lucide-react'
import { Section, SectionHeader, Reveal } from '../components/ui'
import { Logo } from '../components/Chrome'
import { downloadSummary } from '../lib/summary'

const POINTS = [
  ['Assessment matters', 'Urban air pollution is a predictable consequence of growth. Assessing it before projects are built is the most effective and least costly way to protect health.'],
  ['Chennai findings', 'Particulate matter from traffic, road dust and construction is the city-wide priority; north Chennai\'s industrial–power belt and dumpsites are local hotspots; calm winters and burning episodes cause spikes.'],
  ['Models are essential', 'Mass balance quantifies emissions, box models explain ventilation, and Gaussian dispersion models predict concentrations at receptors — turning data into decisions.'],
  ['Mitigation works', 'Proven technologies (ESPs, FGD, filters), cleaner fuels and dust controls can greatly reduce emissions when enforced and monitored.'],
  ['Sustainable cities', 'Lasting improvement needs land-use planning, public transport, green cover and public participation — clean air as a design goal, not an afterthought.'],
]

const REFS: { group: string; items: { t: string; org: string; url: string }[] }[] = [
  { group: 'Indian government & regulators', items: [
    { t: 'Central Pollution Control Board — official website (NAAQS 2009, NAMP, AQI reports)', org: 'CPCB, MoEFCC', url: 'https://cpcb.nic.in/' },
    { t: 'National Air Quality Index — real-time station data portal', org: 'CPCB', url: 'https://airquality.cpcb.gov.in/AQI_India/' },
    { t: 'PRANA — Portal for Regulation of Air-pollution in Non-Attainment cities (NCAP)', org: 'CPCB / MoEFCC', url: 'https://prana.cpcb.gov.in/' },
    { t: 'Tamil Nadu Pollution Control Board — official website', org: 'TNPCB', url: 'https://tnpcb.gov.in/' },
    { t: 'Ministry of Environment, Forest and Climate Change', org: 'Government of India', url: 'https://moef.gov.in/' },
    { t: 'India Code — full texts of the Air Act 1981 and Environment (Protection) Act 1986', org: 'Legislative Department, GoI', url: 'https://www.indiacode.nic.in/' },
  ] },
  { group: 'International & data sources', items: [
    { t: 'WHO global air quality guidelines: particulate matter, ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide (2021)', org: 'World Health Organization', url: 'https://www.who.int/publications/i/item/9789240034228' },
    { t: 'Ambient (outdoor) air pollution — fact sheet', org: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health' },
    { t: 'Copernicus Atmosphere Monitoring Service (CAMS)', org: 'ECMWF / European Union', url: 'https://atmosphere.copernicus.eu/' },
    { t: 'Open-Meteo Air Quality API documentation (data feed used by the dashboard)', org: 'Open-Meteo', url: 'https://open-meteo.com/en/docs/air-quality-api' },
    { t: 'Air Quality Dispersion Modeling (AERMOD and preferred models)', org: 'US EPA — SCRAM', url: 'https://www.epa.gov/scram/air-quality-dispersion-modeling' },
  ] },
  { group: 'Textbooks (for models and control technologies)', items: [
    { t: 'Turner, D. B. — Workbook of Atmospheric Dispersion Estimates (2nd ed., 1994), CRC Press / Lewis Publishers', org: 'Gaussian plume & Pasquill–Gifford curves', url: '' },
    { t: 'Seinfeld, J. H. & Pandis, S. N. — Atmospheric Chemistry and Physics (3rd ed., 2016), Wiley', org: 'Dispersion, chemistry, deposition', url: '' },
    { t: 'Canter, L. W. — Environmental Impact Assessment (2nd ed., 1996), McGraw-Hill', org: 'Prediction & assessment of impacts on the air environment', url: '' },
  ] },
]

export function Conclusion() {
  return (
    <>
      <Section id="conclusion">
        <SectionHeader index="10" kicker="Conclusion" title={<>Clean air is <span className="text-gradient">a planning decision.</span></>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {POINTS.map(([h, t], i) => (
            <Reveal key={h} delay={i * 0.06}><div className="glass h-full rounded-2xl p-6">
              <div className="font-mono text-xs text-leaf-400">0{i + 1}</div>
              <div className="mt-2 font-display text-lg font-semibold text-white">{h}</div>
              <p className="mt-2 text-sm leading-relaxed text-mist/75">{t}</p>
            </div></Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap gap-3">
          <button onClick={downloadSummary} className="inline-flex items-center gap-2 rounded-xl bg-leaf-400 px-6 py-3 font-semibold text-ink-950 transition hover:bg-leaf-300"><Download size={18} /> Download case study summary</button>
          <a href="#assessment" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-leaf-400/60">Revisit the models</a>
        </Reveal>
      </Section>

      <Section id="references" className="grid-bg">
        <SectionHeader kicker="References" title="Sources & further reading" intro="All factual claims on this site are drawn from the sources below. Live dashboard data are model estimates and illustrative values are labelled throughout." />
        <div className="grid gap-8 lg:grid-cols-3">
          {REFS.map(g => (
            <div key={g.group} className="min-w-0">
              <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-leaf-400">{g.group}</div>
              <ol className="space-y-3">
                {g.items.map(r => (
                  <li key={r.t}>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="glass glass-hover group block rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3 text-sm text-white">{r.t}<ExternalLink size={14} className="mt-0.5 shrink-0 text-mist/40 group-hover:text-leaf-400" /></div>
                        <div className="mt-1 text-xs text-mist/55">{r.org}</div>
                        <div className="mt-1 truncate font-mono text-[10.5px] text-leaf-400/70">{r.url.replace('https://', '')}</div>
                      </a>
                    ) : (
                      <div className="glass rounded-xl p-4">
                        <div className="flex items-start gap-2 text-sm text-white"><BookOpen size={14} className="mt-0.5 shrink-0 text-mist/40" />{r.t}</div>
                        <div className="mt-1 text-xs text-mist/55">{r.org}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      <footer className="border-t border-white/5 bg-ink-950 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed text-mist/50">
            An academic case study for Environmental Studies — Unit IV: Prediction and Assessment of Impacts on the Air Environment.
            Not an official air-quality service. For health decisions, use the CPCB National AQI portal and official advisories.
          </p>
        </div>
      </footer>
    </>
  )
}
