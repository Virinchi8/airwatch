/**
 * Educational implementations of the classic models from Unit IV.
 * Gaussian plume dispersion coefficients use Briggs (1973) open-country (rural)
 * fits to the Pasquill–Gifford curves, as tabulated in standard texts (e.g. Turner's
 * Workbook of Atmospheric Dispersion Estimates; Seinfeld & Pandis).
 */
export type Stability = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export const STABILITY_INFO: Record<Stability, { label: string; desc: string }> = {
  A: { label: 'A · Extremely unstable', desc: 'Strong sun, light wind. Vigorous convection mixes the plume to the ground close to the stack.' },
  B: { label: 'B · Moderately unstable', desc: 'Sunny with light-to-moderate wind. Rapid vertical spreading.' },
  C: { label: 'C · Slightly unstable', desc: 'Daytime, moderate wind or partial cloud.' },
  D: { label: 'D · Neutral', desc: 'Overcast or windy conditions, day or night. Plume “cones” downwind.' },
  E: { label: 'E · Slightly stable', desc: 'Night-time, light wind, some cloud. Vertical mixing suppressed.' },
  F: { label: 'F · Moderately stable', desc: 'Clear night with light wind (inversion). Plume “fans” and travels far with little dilution.' },
}

export function sigmaY(x: number, s: Stability): number {
  const a = { A: 0.22, B: 0.16, C: 0.11, D: 0.08, E: 0.06, F: 0.04 }[s]
  return a * x * Math.pow(1 + 0.0001 * x, -0.5)
}

export function sigmaZ(x: number, s: Stability): number {
  switch (s) {
    case 'A': return 0.2 * x
    case 'B': return 0.12 * x
    case 'C': return 0.08 * x * Math.pow(1 + 0.0002 * x, -0.5)
    case 'D': return 0.06 * x * Math.pow(1 + 0.0015 * x, -0.5)
    case 'E': return 0.03 * x / (1 + 0.0003 * x)
    case 'F': return 0.016 * x / (1 + 0.0003 * x)
  }
}

/**
 * Gaussian plume with total ground reflection.
 * C(x,y,z) = Q / (2π u σy σz) · exp(−y²/2σy²) · [exp(−(z−H)²/2σz²) + exp(−(z+H)²/2σz²)]
 * Q in g/s, u in m/s, distances in m → returns µg/m³.
 */
export function plumeConc(Q: number, u: number, H: number, x: number, y: number, z: number, s: Stability): number {
  if (x <= 0) return 0
  const sy = sigmaY(x, s)
  const sz = sigmaZ(x, s)
  const lateral = Math.exp(-(y * y) / (2 * sy * sy))
  const vertical = Math.exp(-((z - H) ** 2) / (2 * sz * sz)) + Math.exp(-((z + H) ** 2) / (2 * sz * sz))
  return (Q / (2 * Math.PI * u * sy * sz)) * lateral * vertical * 1e6
}

/** Holland / Briggs-style plume rise is out of scope; we use a simple momentum + buoyancy proxy. */
export function effectiveHeight(stackH: number, exitVel: number, u: number, diameter = 2): number {
  // Holland-type simplification (momentum term only, educational): Δh = vs·d/u · 1.5
  return stackH + (1.5 * exitVel * diameter) / Math.max(u, 0.5)
}

/** Box model: C = Cb + (q·L) / (u·H) — q in µg/m²/s, L m, u m/s, H m → µg/m³ */
export function boxModel(qUgPerM2s: number, L: number, u: number, H: number, background: number): number {
  return background + (qUgPerM2s * L) / (u * H)
}
