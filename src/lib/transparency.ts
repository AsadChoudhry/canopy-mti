import type { Company, Store } from '@/data/model'
import { accountProduct } from './accounting'

/**
 * Pack4Good disclosure coverage: how much of a packaging producer's sourcing this prototype has found
 * in public sources. It measures research coverage and disclosure, not forest outcomes, and is not a rating.
 */

export interface TCriterion {
  key: string
  label: string
  max: number
  what: string
  /** What Canopy would ask the producer for when the criterion is not met. */
  ask: string
}

export const T_CRITERIA: TCriterion[] = [
  { key: 'output', label: 'Production disclosed', max: 4, what: 'Company paper and board output is reported.', ask: 'Publish annual paper and board output by grade.' },
  { key: 'mills', label: 'Mills named', max: 4, what: 'At least one producing mill is named in a source.', ask: 'Name the mills and their capacities.' },
  { key: 'origin', label: 'Wood origin declared', max: 4, what: 'Company-level sourcing countries are confirmed.', ask: 'Publish wood sourcing countries with volumes.' },
  { key: 'certified', label: 'Certified share disclosed', max: 4, what: 'FSC or PEFC certified share of wood is reported.', ask: 'Report the certified share of wood fibre, separately from Controlled Wood.' },
  { key: 'product', label: 'Product fibre traced', max: 6, what: 'Best product\'s share of the eight evidence fields filled.', ask: 'Share a content declaration (EPD) and mill for the products brand partners buy.' },
  { key: 'productOrigin', label: 'Product origin traced', max: 4, what: 'Wood origin is declared for at least one product.', ask: 'Declare origin per product, as the EUDR due diligence statement already requires.' },
  { key: 'split', label: 'Fibre split per product', max: 4, what: 'Virgin, recycled and Next Gen shares stated for a product.', ask: 'State virgin, recycled and Next Gen shares per product.' },
]

export const T_MAX = T_CRITERIA.reduce((a, c) => a + c.max, 0)

/** Bands describe how much disclosure this prototype has found, not a verdict on the company. */
export type TBand = 'leading' | 'partial' | 'opaque' | 'not_researched'
export const T_BAND_META: Record<TBand, { label: string; colour: string; range: string }> = {
  leading: { label: 'High coverage', colour: '#00614f', range: `22 to ${T_MAX}` },
  partial: { label: 'Partial coverage', colour: '#e09a12', range: '12 to 21' },
  opaque: { label: 'Low coverage', colour: '#4f5964', range: '0 to 11' },
  not_researched: { label: 'Not yet researched', colour: '#6c7783', range: 'no mills, products or origins loaded' },
}

export interface TResult {
  company: Company
  points: Record<string, number>
  detail: Record<string, string>
  total: number
  band: TBand
  bestProduct?: string
}

export function transparencyScore(c: Company, store: Store): TResult {
  const q = (id?: string) => (id ? store.quantities.find((x) => x.id === id) : undefined)
  const points: Record<string, number> = {}
  const detail: Record<string, string> = {}

  const out = q(c.totalOutputQuantityId)
  points.output = out && out.value !== null && out.status !== 'illustrative' ? 4 : 0
  detail.output = out && out.value !== null ? `${out.value} ${out.unit} (${out.period}, ${out.status})` : 'Not found'

  const mills = store.facilities.filter((f) => f.companyId === c.id)
  points.mills = mills.length ? 4 : 0
  detail.mills = mills.length ? `${mills.length} named: ${mills.slice(0, 3).map((m) => m.name).join(', ')}${mills.length > 3 ? '…' : ''}` : 'None named'

  const origins = store.relationships.filter((r) => r.kind === 'sourced_from' && r.fromType === 'company' && r.fromId === c.id && r.status === 'confirmed')
  points.origin = origins.length ? 4 : 0
  detail.origin = origins.length ? `${origins.length} sourcing countries` : 'Not declared'

  const cert = store.quantities.find((x) => x.subjectId === c.id && /certified/i.test(x.metric) && x.value !== null)
  const certStmt = c.sourcingStatements?.find((s) => /certified/i.test(s.text) && /\d+%/.test(s.text))
  points.certified = cert || certStmt ? 4 : 0
  detail.certified = cert ? `${cert.value}${cert.unit === '%' ? '%' : ` ${cert.unit}`} (${cert.period})` : certStmt ? certStmt.text.slice(0, 80) : 'Not reported'

  const products = store.products.filter((p) => p.companyId === c.id)
  const scored = products.map((p) => ({ p, s: accountProduct(p, store) })).sort((a, b) => b.s.passed - a.s.passed)
  const best = scored[0]
  points.product = best ? +((best.s.passed / best.s.total) * 6).toFixed(1) : 0
  detail.product = best ? `${best.p.name}: ${best.s.passed} of ${best.s.total} fields filled` : 'No product loaded'

  const withOrigin = products.filter((p) => p.originIds?.length)
  points.productOrigin = withOrigin.length ? 4 : 0
  detail.productOrigin = withOrigin.length ? `${withOrigin.length} of ${products.length} products` : 'No product with declared origin'

  const split = products.filter((p) => p.composition.status === 'reported' && p.composition.virginWoodPct !== null && p.composition.recycledPct !== null)
  points.split = split.length ? 4 : 0
  detail.split = split.length ? `${split.length} of ${products.length} products` : 'Not stated'

  const total = +Object.values(points).reduce((a, b) => a + b, 0).toFixed(1)
  const researched = mills.length > 0 || products.length > 0 || origins.length > 0
  const band: TBand = !researched ? 'not_researched' : total >= 22 ? 'leading' : total >= 12 ? 'partial' : 'opaque'
  return { company: c, points, detail, total, band, bestProduct: best?.p.id }
}

export function packagingProducers(store: Store) {
  return store.companies.filter((c) => c.type === 'producer' && (c.stream ?? 'packaging') === 'packaging')
}
