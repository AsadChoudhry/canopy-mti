/**
 * Canopy Material Transition Intelligence — domain model.
 *
 * Every important number is an `Evidence` record with provenance and a
 * confidence classification. Nothing is presented as a bare fact.
 * The shapes below are designed to be replaced by an API/database later.
 */

export type Confidence = 'verified' | 'partial' | 'unknown' | 'inferred'

export type SourceType =
  | 'company_disclosure'
  | 'derived'
  | 'ecopaper_listing'
  | 'canopy_internal'
  | 'prototype_illustrative'

export interface Source {
  id: string
  title: string
  type: SourceType
  publisher?: string
  reportingYear?: number
  lastChecked: string // ISO date
  url?: string
  notes?: string
}

export interface Evidence<T = number> {
  id: string
  label: string
  value: T
  unit?: string
  display?: string // preformatted display value
  confidence: Confidence
  sourceId: string
  underlyingSourceIds?: string[]
  calculation?: string
  confidenceNote?: string
  notes?: string
  reportingYear?: number
}

export type CanopyProgramme = 'CanopyStyle' | 'Pack4Good'

export interface Company {
  id: string
  name: string
  sector: string
  hq: string
  logoText: string
  logoColour: string
  tagline?: string
  researchStatus: 'loaded' | 'not_loaded'
  relationship?: { programmes: CanopyProgramme[]; label: string }
  trackedMaterialT?: Evidence
  forestLinkedT?: Evidence
  coverage?: CoverageScore
  opportunitiesCount?: number
  lastUpdated?: string
}

export interface CoverageScore {
  verifiedPct: number
  partialPct: number
  unknownPct: number
  evidenceId: string
}

export interface MaterialShare {
  id: string
  name: string
  shortName?: string
  sharePct: number
  colour: string
  forestLinked: boolean
  derivedTonnes: Evidence
  recycledPct?: Evidence
  notes?: string
  pathwayId?: string // supply-chain pathway to fan out into
  traceability?: CoverageScore
  focus?: boolean
}

export interface MaterialStream {
  id: 'products' | 'packaging'
  name: string
  tonnes: Evidence
  shareOfTotalPct: number
  icon: 'shirt' | 'package'
  materials: MaterialShare[]
  groupings?: MaterialGrouping[]
}

/** A user-facing roll-up such as "Paper + Cardboard" derived from several shares. */
export interface MaterialGrouping {
  id: string
  name: string
  memberIds: string[]
  sharePct: number
  derivedTonnes: Evidence
  recycledPct?: Evidence
  nonRecycledTonnes?: Evidence
  recycledTonnes?: Evidence
  forestLinked: boolean
  pathwayId?: string
  traceability?: CoverageScore
  focus?: boolean
  colour: string
}

export type SupplyChainStage =
  | 'feedstock'
  | 'pulp'
  | 'mill'
  | 'processor'
  | 'converter'
  | 'tier1'
  | 'distribution'
  | 'brand'
  | 'customer'
  | 'end_of_life'
  | 'alt_feedstock'
  | 'alt_fibre'
  | 'alt_producer'
  | 'alt_application'
  | 'alt_validation'

export interface SupplyChainNode {
  id: string
  stage: SupplyChainStage
  label: string
  sublabel?: string
  confidence: Confidence
  whatWeKnow: string[]
  sourceIds: string[]
  sourceDate?: string
  missing: string[]
  whyItMatters: string
  nextAction: string
  geography?: string[]
  entityName?: string // NEVER fabricated — only set when evidence exists
}

export interface SupplyChainPathway {
  id: string
  name: string
  kind: 'incumbent' | 'alternative'
  materialLabel: string
  nodes: SupplyChainNode[]
  alternativePathwayIds?: string[]
}

export type GapStatus = 'not_started' | 'in_progress' | 'requested' | 'received'
export type Priority = 'high' | 'medium' | 'low'

export interface DataGap {
  id: string
  field: string
  category: 'supplier' | 'volume' | 'specification' | 'commercial' | 'capacity' | 'origin'
  whyItMatters: string
  nextAction: string
  owner: string
  status: GapStatus
  priority: Priority
  relatedMaterialIds: string[]
}

export type FitStatus = 'potential_match' | 'potential_overlap' | 'unknown' | 'mismatch' | 'confirmed'

export interface FitAssessment {
  geography: FitStatus
  material: FitStatus
  application: FitStatus
  volume: FitStatus
  technical: FitStatus
  economics: FitStatus
  qualification: FitStatus
}

export interface AlternativeMaterial {
  id: string
  provider: string
  product: string
  category: string
  applications: string[]
  feedstock: string
  feedstockShort: string
  woodFibrePct: number | null
  postConsumerRecycledPct?: number | null
  totalRecycledPct?: number | null
  manufacturingCountries: string[] | 'global'
  regionalAvailability: string
  capacity: string | null
  capacityNote?: string
  moq: string | null
  certification: string | null
  woodDisplacementPotential: 'high' | 'medium' | 'low' | 'unknown'
  fit: FitAssessment
  overall: 'promising_lead' | 'candidate' | 'not_assessed'
  confidence: Confidence
  nextCanopyAction: string
  sourceId: string
  canReplaceGroupingIds: string[]
  additionalProduction?: string[]
  colour: string
}

export type ImpactLevel = 'high' | 'medium' | 'low' | 'enabler'
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'low_medium'

export interface TransitionOpportunity {
  id: string
  number: number
  title: string
  summary: string
  addressableMaterial?: string
  addressableEvidenceId?: string
  confidence: ConfidenceLevel
  impact: ImpactLevel
  feasibility: string
  missingInformation: string[]
  recommendedAction: string
  candidates?: string[]
  geographicSignal?: string
  primaryBarrier?: string
  strategicQuestion?: string
  existingStrength?: string
  linkedTool: 'EcoPaper Database' | 'Hot Button / Next Gen' | 'Brand engagement' | 'ForestMapper'
  relatedGroupingId?: string
  relatedMaterialId?: string
  stream: 'products' | 'packaging'
}

export interface ActionItem {
  priority: number
  action: string
  owner: string
  dataRequired: string[]
  partner: string
  expectedImpact: string
  confidence: ConfidenceLevel
  status: GapStatus | 'planned'
  metrics?: string[]
}

export interface Commitment {
  id: string
  title: string
  detail: string
  year?: string
  status: 'reported' | 'committed' | 'partner_programme' | 'not_loaded'
  sourceId: string
  confidence: Confidence
}

export interface GeoPoint {
  id: string
  label: string
  sublabel?: string
  lat: number
  lng: number
  layer: GeoLayerId
  confidence: Confidence
  note?: string
}

export type GeoLayerId =
  | 'hm_tier1'
  | 'hm_tier2'
  | 'hm_hq'
  | 'packaging_converters'
  | 'paper_mills'
  | 'pulp_mills'
  | 'mmcf_producers'
  | 'alt_fibre_producers'
  | 'nextgen_facilities'
  | 'feedstock_regions'
  | 'forest_risk_regions'
  | 'ecopaper_manufacturing'

export interface GeoLayer {
  id: GeoLayerId
  name: string
  status: 'loaded' | 'not_loaded' | 'partial'
  note?: string
  colour: string
}

export interface ResearchNote {
  id: string
  date: string
  author: string
  text: string
  tags: string[]
}
