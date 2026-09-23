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
  if (cur.hasUnknown || hyp.hasUnknown || cur.over || hyp.over) return { state: 'incomplete_composition', message: 'Composition incomplete or over 100% — displacement cannot be calculated.' }
  const volume = s.assumptions.productVolumeT ?? (observedVolume?.value ?? null)
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
