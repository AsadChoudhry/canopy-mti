/**
 * Mill build arithmetic. Every input is either a loaded quantity or an explicit assumption
 * the user sets; nothing here is observed data.
 *
 *   pulp potential = feedstock × collectable share × yield
 *   mills          = floor(pulp potential / mill size)
 *   capacity built = mills × mill size
 *   investment     = capacity built × USD per tonne
 *   GHG avoided    = capacity built × t CO2e per tonne of pulp
 */

export interface MillBuildInput {
  feedstockMt: number
  collectablePct: number
  yieldPct: number
  millSizeKt: number
  usdPerT: number
  ghgPerT: number
}

export interface MillBuildResult {
  collectableMt: number
  pulpPotentialMt: number
  mills: number
  capacityMt: number
  feedstockPerMillKt: number
  investmentBn: number
  ghgMt: number
  /** Pulp potential left over after whole mills, too small for another mill. */
  remainderMt: number
}

export function millBuild(i: MillBuildInput): MillBuildResult {
  const collectableMt = i.feedstockMt * (i.collectablePct / 100)
  const pulpPotentialMt = collectableMt * (i.yieldPct / 100)
  const sizeMt = i.millSizeKt / 1000
  const mills = sizeMt > 0 ? Math.floor(pulpPotentialMt / sizeMt + 1e-9) : 0
  const capacityMt = mills * sizeMt
  return {
    collectableMt,
    pulpPotentialMt,
    mills,
    capacityMt,
    feedstockPerMillKt: i.yieldPct > 0 ? i.millSizeKt / (i.yieldPct / 100) : 0,
    investmentBn: (capacityMt * 1e6 * i.usdPerT) / 1e9,
    ghgMt: capacityMt * i.ghgPerT,
    remainderMt: pulpPotentialMt - capacityMt,
  }
}

/** Collectable share needed for one mill of the given size. */
export function collectableForOneMill(i: MillBuildInput) {
  if (i.feedstockMt <= 0 || i.yieldPct <= 0) return null
  return ((i.millSizeKt / 1000) / (i.yieldPct / 100) / i.feedstockMt) * 100
}

export const fmtMt = (v: number) => (v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1) : v >= 0.1 ? v.toFixed(2) : v.toFixed(3))
