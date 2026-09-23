/**
 * Evidence-first data model for the materials-transition workspace.
 * Every quantitative record carries value + unit + period + scope + basis + evidence status + sources.
 * Unknown is a distinct state (value: null) — never zero.
 */

export type EvidenceStatus = 'reported' | 'calculated' | 'estimated' | 'illustrative' | 'unknown'
export type MeasurementBasis = 'output' | 'input' | 'capacity' | 'purchases' | 'other'
export type ReviewStatus = 'needs_review' | 'reviewed' | 'disputed'
export type CompanyType = 'producer' | 'brand'
export type LinkStatus = 'confirmed' | 'unresolved' | 'not_applicable'

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  page?: string // page or section
  accessDate: string // ISO; empty when not accessed
  accessed: boolean // true only if Canopy actually opened the document
  passage?: string // supporting passage / concise evidence note
  limitations?: string
  reviewerNotes?: string
  reviewStatus: ReviewStatus
  kind: 'company_report' | 'company_product_page' | 'statistical_database' | 'canopy_directory' | 'user_supplied' | 'other'
}

export interface Quantity {
  id: string
  subjectType: 'global' | 'company' | 'product' | 'facility' | 'origin'
  subjectId: string
  metric: string // e.g. "Paper and paperboard production"
  value: number | null // null = unknown
  unit: string
  period: string // "2024", "FY2025", "not specified"
  scope: string // geographic + organisational scope
  basis: MeasurementBasis
  denominator?: string // required for percentages
  status: EvidenceStatus
  sourceIds: string[]
  formula?: string
  inputs?: { label: string; value: string }[]
  note?: string
}

export interface FibreComposition {
  virginWoodPct: number | null
  recycledPct: number | null
  nextGenPct: number | null
  otherNonWoodPct: number | null // "Other non-wood / classification pending"
  unknownPct: number | null // explicit unknown remainder if stated
  status: EvidenceStatus
  sourceIds: string[]
  basis?: string // e.g. "disclosed product blend (fibre share)"
  note?: string
}

export interface Company {
  id: string
  name: string
  type: CompanyType
  sector: string
  hq: string
  logoText: string
  logoColour: string
  description?: string
  sourceIds: string[]
  mapping: {
    supplierIdentified: LinkStatus
    millIdentified: LinkStatus
    originTraced: LinkStatus
    note?: string
  }
  categories?: { name: string; quantityId: string }[] // production by category
  totalOutputQuantityId?: string
  globalComparisonQuantityId?: string
  sourcingStatements?: { text: string; sourceIds: string[]; scope: string }[]
  notes?: string
}

/** One line of a third-party content declaration (EPD). isFibre distinguishes fibre from fillers/moisture. */
export interface ContentLine {
  label: string
  pct: number
  kgPerTonne?: number
  isFibre: boolean
  fibreType?: 'virgin_wood' | 'recycled' | 'nextgen' | 'other_non_wood'
  note?: string
}

export interface Product {
  id: string
  companyId: string
  name: string
  application: string
  category?: string
  description?: string
  composition: FibreComposition
  volumeQuantityId?: string // null/undefined → unknown
  shareOfCompanyQuantityId?: string
  sourceIds: string[]
  productionRegion?: { text: string; sourceIds: string[] }
  notes?: string

  /* Product-level traceability — populated only where evidence exists */
  contentDeclaration?: { lines: ContentLine[]; declaredUnit: string; sourceId: string; dataYear?: string }
  millFacilityId?: string
  pulpFacilityIds?: string[]
  originIds?: string[]
  species?: string[]
  certifiedPctQuantityId?: string
}

export interface Facility {
  id: string
  name: string
  type: 'pulp_mill' | 'paper_mill' | 'converter' | 'recycling' | 'forestry' | 'other'
  companyId?: string
  country: string
  region?: string
  sourceIds: string[]
  status: EvidenceStatus
  note?: string
}

export interface Origin {
  id: string
  name: string // country or region
  m49?: string
  feedstockType: 'virgin_wood' | 'recovered_paper' | 'agricultural_residue' | 'textile_waste' | 'other' | 'unknown'
  sourceIds: string[]
  status: EvidenceStatus
  note?: string
}

export type RelationshipKind = 'supplies' | 'produced_at' | 'sourced_from' | 'sells_to' | 'owns'

export interface Relationship {
  id: string
  kind: RelationshipKind
  fromType: 'company' | 'product' | 'facility' | 'origin'
  fromId: string
  toType: 'company' | 'product' | 'facility' | 'origin'
  toId: string
  status: LinkStatus
  sourceIds: string[]
  note?: string
}

export interface Solution {
  id: string
  name: string
  provider?: string
  category: 'recycled_paper' | 'agricultural_residue' | 'textile_cellulose' | 'nextgen_pulp' | 'tool' | 'other'
  feedstock: string
  applications: string[]
  geography: string[] | 'global' | 'unknown'
  availability: 'commercial' | 'pilot' | 'development' | 'unknown'
  capacity?: string | null
  link?: string
  directory: 'EcoPaper' | 'Next Gen providers' | 'ForestMapper' | 'Other'
  status: 'verified' | 'listing_supplied' | 'illustrative'
  sourceIds: string[]
  note?: string
}

export interface Scenario {
  id: string
  companyId: string
  productId: string
  name: string
  current: FibreComposition
  hypothetical: FibreComposition
  assumptions: {
    productVolumeT: number | null // explicit user assumption; separate from observed data
    fibreShareOfMass: number | null // 0..1 — finished-product tonnes are not fibre tonnes
    note?: string
  }
  evidenceNote?: string
  createdAt: string
  updatedAt: string
}

export interface Store {
  version: number
  sources: Source[]
  quantities: Quantity[]
  companies: Company[]
  products: Product[]
  facilities: Facility[]
  origins: Origin[]
  relationships: Relationship[]
  solutions: Solution[]
  scenarios: Scenario[]
  shortlist: string[] // solution ids
}

export type Collection = Exclude<keyof Store, 'version' | 'shortlist'>

export const EVIDENCE_STATUS_META: Record<EvidenceStatus, { label: string; colour: string; bg: string; text: string }> = {
  reported: { label: 'Reported', colour: '#009a7e', bg: 'bg-green-100', text: 'text-green-700' },
  calculated: { label: 'Calculated', colour: '#009da1', bg: 'bg-inferred-100', text: 'text-inferred-600' },
  estimated: { label: 'Estimated', colour: '#e09a12', bg: 'bg-amber-100', text: 'text-amber-600' },
  illustrative: { label: 'Illustrative', colour: '#8b70ee', bg: 'bg-brand-100', text: 'text-brand-700' },
  unknown: { label: 'Unknown', colour: '#9aa3ad', bg: 'bg-slate-100', text: 'text-slate-500' },
}

export const FIBRE_META = {
  virginWoodPct: { label: 'Virgin wood', colour: '#282727' },
  recycledPct: { label: 'Recycled paper', colour: '#009a7e' },
  nextGenPct: { label: 'Qualifying Next Gen', colour: '#6a47ea' },
  otherNonWoodPct: { label: 'Other non-wood / pending', colour: '#00c1c6' },
  unknownPct: { label: 'Unknown', colour: '#c7c7c7' },
} as const

export type FibreKey = keyof typeof FIBRE_META
export const FIBRE_KEYS: FibreKey[] = ['virginWoodPct', 'recycledPct', 'nextGenPct', 'otherNonWoodPct', 'unknownPct']
