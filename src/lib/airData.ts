import { computeAqi, type AqiResult, type Pollutant } from './aqi'

export interface City {
  id: string
  name: string
  state: string
  lat: number
  lon: number
}

export const CITIES: City[] = [
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { id: 'delhi', name: 'Delhi', state: 'NCT of Delhi', lat: 28.6139, lon: 77.209 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lon: 78.4867 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558 },
]

export interface HourPoint {
  time: string
  pm25: number | null
  pm10: number | null
  no2: number | null
  so2: number | null
  co: number | null // mg/m³
  o3: number | null
}

export interface CitySeries {
  city: City
  hours: HourPoint[]
  /** index of the latest hour that is not in the future */
  nowIndex: number
  current: AqiResult | null
  averages: Record<Pollutant, number | null>
}

export type DataSource = 'live-model' | 'simulated'

export interface AirDataset {
  source: DataSource
  fetchedAt: Date
  series: CitySeries[]
  error?: string
}

const VARS = 'pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone'

function mean(xs: (number | null)[]): number | null {
  const v = xs.filter((x): x is number => x != null && !Number.isNaN(x))
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

/** CPCB averaging: 24-h mean for PM/NO2/SO2, 8-h mean for CO/O3, ending at nowIndex. */
function buildSeries(city: City, hours: HourPoint[], nowIndex: number): CitySeries {
  const w24 = hours.slice(Math.max(0, nowIndex - 23), nowIndex + 1)
  const w8 = hours.slice(Math.max(0, nowIndex - 7), nowIndex + 1)
  const averages: Record<Pollutant, number | null> = {
    pm25: mean(w24.map(h => h.pm25)),
    pm10: mean(w24.map(h => h.pm10)),
    no2: mean(w24.map(h => h.no2)),
    so2: mean(w24.map(h => h.so2)),
    co: mean(w8.map(h => h.co)),
    o3: mean(w8.map(h => h.o3)),
  }
  return { city, hours, nowIndex, current: computeAqi(averages), averages }
}

interface OMResponse {
  hourly: {
    time: string[]
    pm2_5: (number | null)[]
    pm10: (number | null)[]
    nitrogen_dioxide: (number | null)[]
    sulphur_dioxide: (number | null)[]
    carbon_monoxide: (number | null)[]
    ozone: (number | null)[]
  }
}

/**
 * Fetch modelled hourly concentrations (CAMS global/regional forecast) via the free
 * Open-Meteo Air Quality API. These are model estimates on a ~10–40 km grid, NOT CPCB
 * station measurements.
 */
export async function fetchModelledAir(pastDays = 7, signal?: AbortSignal): Promise<AirDataset> {
  const lat = CITIES.map(c => c.lat).join(',')
  const lon = CITIES.map(c => c.lon).join(',')
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=${VARS}&past_days=${pastDays}&forecast_days=1&timezone=Asia%2FKolkata`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Air-quality API responded ${res.status}`)
  const json = (await res.json()) as OMResponse | OMResponse[]
  const arr = Array.isArray(json) ? json : [json]
  if (arr.length !== CITIES.length) throw new Error('Unexpected API response shape')

  // "Now" in IST, formatted like the API's local timestamps (YYYY-MM-DDTHH:00)
  const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 13)

  const series = arr.map((r, i) => {
    const h = r.hourly
    const hours: HourPoint[] = h.time.map((t, k) => ({
      time: t,
      pm25: h.pm2_5[k],
      pm10: h.pm10[k],
      no2: h.nitrogen_dioxide[k],
      so2: h.sulphur_dioxide[k],
      co: h.carbon_monoxide[k] != null ? (h.carbon_monoxide[k] as number) / 1000 : null,
      o3: h.ozone[k],
    }))
    let nowIndex = hours.findIndex(x => x.time.slice(0, 13) === nowIst)
    if (nowIndex < 0) nowIndex = hours.length - 25
    // step back past trailing nulls
    while (nowIndex > 0 && hours[nowIndex].pm25 == null) nowIndex--
    return buildSeries(CITIES[i], hours, nowIndex)
  })
  return { source: 'live-model', fetchedAt: new Date(), series }
}

/* ---------- Simulated fallback (clearly labelled in the UI) ---------- */

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const SIM_BASE: Record<string, number> = {
  chennai: 32, delhi: 95, mumbai: 45, kolkata: 60, bengaluru: 30, hyderabad: 40, coimbatore: 25,
}

/** Deterministic demonstration data — for UI demonstration only. */
export function simulatedAir(pastDays = 7, error?: string): AirDataset {
  const now = new Date()
  const total = (pastDays + 1) * 24
  const series = CITIES.map((city, ci) => {
    const r = rng(ci * 97 + 13)
    const base = SIM_BASE[city.id] ?? 40
    const hours: HourPoint[] = []
    for (let k = 0; k < total; k++) {
      const t = new Date(now.getTime() - (total - 24 - k) * 3600 * 1000)
      const hr = t.getHours()
      const diurnal = 1 + 0.35 * Math.cos(((hr - 8) / 24) * 2 * Math.PI) + 0.2 * Math.cos(((hr - 21) / 12) * 2 * Math.PI)
      const synoptic = 1 + 0.3 * Math.sin((k / 60) * Math.PI + ci)
      const pm25 = Math.max(4, base * diurnal * synoptic * (0.85 + r() * 0.3))
      hours.push({
        time: new Date(t.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 16),
        pm25,
        pm10: pm25 * (1.6 + r() * 0.4),
        no2: Math.max(3, base * 0.55 * diurnal * (0.8 + r() * 0.4)),
        so2: Math.max(2, base * 0.18 * (0.8 + r() * 0.4)),
        co: Math.max(0.15, (base / 70) * diurnal * (0.8 + r() * 0.4)),
        o3: Math.max(5, 60 * (1.2 - diurnal * 0.6) * (0.8 + r() * 0.4)),
      })
    }
    return buildSeries(city, hours, total - 25)
  })
  return { source: 'simulated', fetchedAt: now, series, error }
}
