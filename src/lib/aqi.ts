/**
 * India National Air Quality Index (CPCB, 2014) — categories and sub-index breakpoints.
 * Source: CPCB "National Air Quality Index" (2014). PM10, PM2.5, NO2, SO2 use 24-h averages;
 * CO and O3 use 8-h averages. CO in mg/m³, all others in µg/m³.
 */
export type Pollutant = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3'

export interface AqiCategory {
  name: string
  short: string
  min: number
  max: number
  color: string
  text: string
  health: string
  precaution: string
}

export const AQI_CATEGORIES: AqiCategory[] = [
  {
    name: 'Good', short: 'Good', min: 0, max: 50, color: '#00B050', text: '#04210f',
    health: 'Minimal impact.',
    precaution: 'Ideal for outdoor activity. A good time to ventilate homes.',
  },
  {
    name: 'Satisfactory', short: 'Satisf.', min: 51, max: 100, color: '#92D050', text: '#14240a',
    health: 'Minor breathing discomfort to sensitive people.',
    precaution: 'Sensitive individuals should watch for symptoms during long outdoor exertion.',
  },
  {
    name: 'Moderately Polluted', short: 'Moderate', min: 101, max: 200, color: '#FFFF00', text: '#2a2a00',
    health: 'Breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.',
    precaution: 'People with asthma or heart disease, children and older adults should reduce prolonged outdoor exertion.',
  },
  {
    name: 'Poor', short: 'Poor', min: 201, max: 300, color: '#FF9900', text: '#2b1700',
    health: 'Breathing discomfort to most people on prolonged exposure.',
    precaution: 'Limit outdoor exertion; avoid busy roads; keep reliever medication handy if prescribed.',
  },
  {
    name: 'Very Poor', short: 'V. Poor', min: 301, max: 400, color: '#FF0000', text: '#fff',
    health: 'Respiratory illness on prolonged exposure.',
    precaution: 'Avoid outdoor activity; keep windows closed during peak hours; sensitive groups stay indoors.',
  },
  {
    name: 'Severe', short: 'Severe', min: 401, max: 500, color: '#C00000', text: '#fff',
    health: 'Affects healthy people and seriously impacts those with existing diseases.',
    precaution: 'Stay indoors; follow official advisories (e.g. GRAP-type emergency measures where notified).',
  },
]

/** [concentration low, concentration high] for each of the 6 AQI bands. */
export const BREAKPOINTS: Record<Pollutant, [number, number][]> = {
  pm10: [[0, 50], [51, 100], [101, 250], [251, 350], [351, 430], [431, 600]],
  pm25: [[0, 30], [31, 60], [61, 90], [91, 120], [121, 250], [251, 380]],
  no2: [[0, 40], [41, 80], [81, 180], [181, 280], [281, 400], [401, 800]],
  so2: [[0, 40], [41, 80], [81, 380], [381, 800], [801, 1600], [1601, 2400]],
  co: [[0, 1.0], [1.1, 2.0], [2.1, 10], [10.1, 17], [17.1, 34], [34.1, 50]],
  o3: [[0, 50], [51, 100], [101, 168], [169, 208], [209, 748], [749, 1000]],
}

export const POLLUTANT_LABEL: Record<Pollutant, string> = {
  pm25: 'PM2.5', pm10: 'PM10', no2: 'NO₂', so2: 'SO₂', co: 'CO', o3: 'O₃',
}
export const POLLUTANT_UNIT: Record<Pollutant, string> = {
  pm25: 'µg/m³', pm10: 'µg/m³', no2: 'µg/m³', so2: 'µg/m³', co: 'mg/m³', o3: 'µg/m³',
}

/** Linear interpolation of the CPCB sub-index. Returns null for missing values. */
export function subIndex(p: Pollutant, c: number | null | undefined): number | null {
  if (c == null || Number.isNaN(c) || c < 0) return null
  const bands = BREAKPOINTS[p]
  for (let i = 0; i < bands.length; i++) {
    const [lo, hi] = bands[i]
    // treat gaps between bands (e.g. 50 → 51) as belonging to the upper band
    const nextLo = i < bands.length - 1 ? bands[i + 1][0] : Infinity
    if (c <= hi || c < nextLo) {
      const ilo = AQI_CATEGORIES[i].min
      const ihi = AQI_CATEGORIES[i].max
      const cc = Math.max(c, lo)
      return Math.round(ilo + ((ihi - ilo) / (hi - lo)) * (Math.min(cc, hi) - lo))
    }
  }
  return 500
}

export function categoryFor(aqi: number): AqiCategory {
  return AQI_CATEGORIES.find(c => aqi <= c.max) ?? AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
}

export interface AqiResult {
  aqi: number
  dominant: Pollutant
  subs: Partial<Record<Pollutant, number>>
}

/** Overall AQI = max of sub-indices (CPCB requires ≥3 pollutants incl. one PM). */
export function computeAqi(conc: Partial<Record<Pollutant, number | null>>): AqiResult | null {
  const subs: Partial<Record<Pollutant, number>> = {}
  ;(Object.keys(conc) as Pollutant[]).forEach(p => {
    const s = subIndex(p, conc[p])
    if (s != null) subs[p] = s
  })
  const keys = Object.keys(subs) as Pollutant[]
  if (keys.length < 3 || (subs.pm25 == null && subs.pm10 == null)) return null
  const dominant = keys.reduce((a, b) => ((subs[a] ?? 0) >= (subs[b] ?? 0) ? a : b))
  return { aqi: subs[dominant]!, dominant, subs }
}
