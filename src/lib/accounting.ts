import type { Product, Store } from '@/data/model'

export interface AccountCheck {
  key: string
  label: string
  ok: boolean
  detail: string
  /** Set when the check passes on a proxy rather than product-level evidence. */
  proxy?: string
}

export interface AccountScore {
  checks: AccountCheck[]
  passed: number
  total: number
  pct: number
  level: 'full' | 'partial' | 'thin'
}

/** Evidence completeness for a product: fibres in, where sourced, certified share, size relative to the company. */
export function accountProduct(product: Product, store: Store): AccountScore {
  const q = (id?: string) => (id ? store.quantities.find((x) => x.id === id) : undefined)
  const mill = store.facilities.find((f) => f.id === product.millFacilityId)
  const volume = q(product.volumeQuantityId)
  const share = q(product.shareOfCompanyQuantityId)
  const certified = q(product.certifiedPctQuantityId)
  const cd = product.contentDeclaration

  const checks: AccountCheck[] = [
    {
      key: 'content',
      label: 'Fibre content declared',
      ok: !!cd && Math.abs(cd.lines.reduce((a, l) => a + l.pct, 0) - 100) < 0.5,
      detail: cd ? `${cd.lines.length} lines totalling ${cd.lines.reduce((a, l) => a + l.pct, 0)}%` : 'No content declaration found',
    },
    {
      key: 'types',
      label: 'Fibre types resolved',
      ok: product.composition.status === 'reported' && !Object.values({ v: product.composition.virginWoodPct, r: product.composition.recycledPct, n: product.composition.nextGenPct }).some((x) => x === null),
      detail: product.composition.status === 'reported' ? 'Virgin, recycled and Next Gen all stated' : 'Fibre split inherited or unknown',
    },
    {
      key: 'mill',
      label: 'Producing mill named',
      ok: !!mill,
      detail: mill ? `${mill.name}, ${mill.country}` : 'Mill not identified',
    },
    {
      key: 'pulp',
      label: 'Pulp source named',
      ok: !!product.pulpFacilityIds?.length,
      detail: product.pulpFacilityIds?.length ? `${product.pulpFacilityIds.length} pulp mill(s) in scope` : 'Pulp mills not identified',
    },
    {
      key: 'origin',
      label: 'Wood origin declared',
      ok: !!product.originIds?.length,
      detail: product.originIds?.length ? `${product.originIds.length} origin countries declared` : 'Fibre origin unknown',
      proxy: product.originIds?.length ? 'Country level, not forest or plot' : undefined,
    },
    {
      key: 'certified',
      label: 'Certified share known',
      ok: !!certified && certified.value !== null,
      detail: certified && certified.value !== null ? `${certified.value}% certified, company-wide` : 'Certified share unknown',
      proxy: certified && certified.value !== null && certified.subjectType !== 'product' ? 'Company-wide figure, not this product' : undefined,
    },
    {
      key: 'volume',
      label: 'Product volume known',
      ok: !!volume && volume.value !== null,
      detail: volume && volume.value !== null ? `${volume.value} ${volume.unit} (${volume.status})` : 'Annual volume unknown',
      proxy: volume && volume.value !== null && volume.basis === 'capacity' ? 'Mill capacity, not measured product output' : undefined,
    },
    {
      key: 'share',
      label: 'Share of company known',
      ok: !!share && share.value !== null,
      detail: share && share.value !== null ? `${share.value}% of company capacity` : 'Share of company output unknown',
    },
  ]

  const passed = checks.filter((c) => c.ok).length
  const pct = Math.round((passed / checks.length) * 100)
  return { checks, passed, total: checks.length, pct, level: pct >= 85 ? 'full' : pct >= 50 ? 'partial' : 'thin' }
}

/** Fibre vs non-fibre split from a content declaration. */
export function fibreSplit(product: Product) {
  const cd = product.contentDeclaration
  if (!cd) return null
  const fibre = cd.lines.filter((l) => l.isFibre).reduce((a, l) => a + l.pct, 0)
  return { fibre, nonFibre: 100 - fibre, lines: cd.lines }
}
