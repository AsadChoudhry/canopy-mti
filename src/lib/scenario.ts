import type { FibreComposition, Quantity, Scenario } from '@/data/model'
import { FIBRE_KEYS } from '@/data/model'

/** Sum of the known (non-null) composition shares. Unknown stays unknown — never forced to 100. */
export function compositionTotal(c: FibreComposition) {
  // The four material categories must be stated; `unknownPct` is an optional explicit unknown remainder.
  const main = FIBRE_KEYS.filter((k) => k !== 'unknownPct')
  const known = main.filter((k) => c[k] !== null).reduce((a, k) => a + (c[k] as number), 0) + (c.unknownPct ?? 0)
  const hasUnknown = main.some((k) => c[k] === null)
  return { known, hasUnknown, complete: !hasUnknown && Math.abs(known - 100) < 0.01, over: known > 100.01 }
}

/** A loaded volume in tonnes, or null when its unit is not a mass per year we can convert. */
export function toTonnes(q: Quantity | undefined): number | null {
  if (!q || q.value === null) return null
  const u = q.unit.toLowerCase().replace(/\s/g, '').replace(/\/(yr|year)$|ayear$/, '')
  const factor: Record<string, number> = { t: 1, kt: 1e3, mt: 1e6 }
  return u in factor ? q.value * factor[u] : null
}

export interface ScenarioResult {
  state: 'needs_volume' | 'needs_fibre_share' | 'incomplete_composition' | 'ok'
  message: string
  fibreMassT?: number
  virginDeltaPct?: number
  virginFibreDisplacedT?: number
  nextGenIntroducedT?: number
  recycledDeltaT?: number
}

/**
 * Displacement is only computed on a compatible fibre-mass basis:
 * fibre mass = product volume × fibre share of mass (explicit assumption).
 * Finished-product tonnes are never treated as fibre tonnes automatically.
 */
export function computeScenario(s: Scenario, observedVolume: Quantity | undefined): ScenarioResult {
  const cur = compositionTotal(s.current)
  const hyp = compositionTotal(s.hypothetical)
  if (!cur.complete || !hyp.complete) return { state: 'incomplete_composition', message: 'Composition must be fully stated and add up to 100% before displacement can be calculated.' }
  const volume = s.assumptions.productVolumeT ?? toTonnes(observedVolume)
  if (volume === null) return { state: 'needs_volume', message: 'Tonnes shifted: needs product volume.' }
  const share = s.assumptions.fibreShareOfMass
  if (share === null) return { state: 'needs_fibre_share', message: 'Tonnes shifted: needs fibre share of product mass (finished-product tonnes ≠ fibre tonnes).' }
  const fibreMassT = volume * share
  const virginDeltaPct = (s.current.virginWoodPct ?? 0) - (s.hypothetical.virginWoodPct ?? 0)
  const nextGenDelta = (s.hypothetical.nextGenPct ?? 0) - (s.current.nextGenPct ?? 0)
  const recycledDelta = (s.hypothetical.recycledPct ?? 0) - (s.current.recycledPct ?? 0)
  return {
    state: 'ok',
    message: 'Calculated on fibre-mass basis from explicit assumptions.',
    fibreMassT,
    virginDeltaPct,
    virginFibreDisplacedT: (fibreMassT * virginDeltaPct) / 100,
    nextGenIntroducedT: (fibreMassT * nextGenDelta) / 100,
    recycledDeltaT: (fibreMassT * recycledDelta) / 100,
  }
}

export const fmtT = (n: number) => `${Math.round(n).toLocaleString('en-US')} t`
