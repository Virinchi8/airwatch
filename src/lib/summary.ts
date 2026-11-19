const SUMMARY = `AIRWATCH — URBAN AIR POLLUTION IN CHENNAI: CASE STUDY SUMMARY
Environmental Studies · Unit IV: Prediction and Assessment of Impacts on the Air Environment
==========================================================================================

1. CONTEXT
Urban air pollution results from the concentration of vehicles, industry, construction,
waste burning and domestic combustion in dense settlements. Chennai is a coastal metropolis
on the Bay of Bengal (Census 2011: ~4.65 million in the city, ~8.65 million in the urban
agglomeration) with a north Chennai industrial belt (Manali–Ennore), rapid metro-rail and
road construction, and large municipal dumpsites (Kodungaiyur, Perungudi).

2. SIX STEPS OF AN EIA FOR THE AIR ENVIRONMENT
 (1) Identify sources, types and quantities of pollutants in each project phase.
 (2) Establish baseline ambient air quality and meteorology.
 (3) Examine applicable laws, regulations and standards (Air Act 1981, EP Act 1986, NAAQS 2009).
 (4) Predict impacts — mass balance, mathematical models, or qualitative prediction.
 (5) Assess significance of beneficial and detrimental impacts.
 (6) Develop mitigation and remedial plans (EMP).

3. PREDICTION TOOLS
 • Mass balance / emission inventory: E = A × EF × (1 − ER/100).
 • Box model: C = Cb + qL/(uH) — uniform mixing in a box; dilution ∝ wind speed × mixing height.
 • Gaussian plume (Pasquill–Gifford): C = Q/(2πuσyσz)·exp(−y²/2σy²)·[exp(−(z−H)²/2σz²)+exp(−(z+H)²/2σz²)].
 • Computer simulation models (e.g. AERMOD, CALPUFF, CMAQ) for regulatory and urban-scale studies.

4. KEY FINDINGS (QUALITATIVE)
 • Particulate matter (PM2.5/PM10) is the main concern; vehicles, road dust and construction are key urban sources.
 • North Chennai's industrial and power cluster is a concern for SO2/NO2/PM near Manali–Ennore.
 • Sea breeze generally aids dispersion; calm winter nights with low mixing heights trap pollutants,
   and episodic events (e.g. Bhogi festival burning in January, dumpsite fires) cause short spikes.

5. MITIGATION
 Dust control (water sprinkling, windbreaks, paving, green cover), control of open burning and
 waste stabilisation, cleaner fuels (CNG, LPG, electric, ethanol blends), BS-VI exhaust controls,
 and industrial controls (cyclones, scrubbers, fabric filters, ESPs, FGD, carbon adsorption).

6. NOTE ON DATA
 The AIRWATCH dashboard shows modelled concentrations (CAMS via Open-Meteo) or clearly labelled
 simulated data. Official measured data must be taken from the CPCB National AQI portal
 (https://airquality.cpcb.gov.in/AQI_India/) and TNPCB (https://tnpcb.gov.in/).

KEY REFERENCES
 • CPCB — https://cpcb.nic.in/
 • National AQI portal — https://airquality.cpcb.gov.in/AQI_India/
 • NCAP / PRANA portal — https://prana.cpcb.gov.in/
 • TNPCB — https://tnpcb.gov.in/
 • MoEFCC — https://moef.gov.in/
 • WHO Global Air Quality Guidelines (2021) — https://www.who.int/publications/i/item/9789240034228
 • WHO fact sheet — https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health
`

export function downloadSummary() {
  const blob = new Blob([SUMMARY], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'AIRWATCH_Chennai_Case_Study_Summary.txt'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
