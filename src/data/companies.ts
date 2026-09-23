import type { Company } from './types'
import { HM_COVERAGE, HM_EVIDENCE, HM_OPPORTUNITIES } from './hm'

export const COMPANIES: Company[] = [
  {
    id: 'hm',
    name: 'H&M Group',
    sector: 'Global fashion retailer',
    hq: 'Stockholm, Sweden',
    logoText: 'H&M',
    logoColour: '#e50010',
    tagline: 'A more circular fashion industry.',
    researchStatus: 'loaded',
    relationship: { programmes: ['CanopyStyle', 'Pack4Good'], label: 'CanopyStyle / Pack4Good partner' },
    trackedMaterialT: HM_EVIDENCE.total_tracked,
    forestLinkedT: {
      id: 'hm_forest_linked',
      label: 'Forest-linked material (approximate)',
      value: 40481 + 72224 + 5350,
      unit: 't',
      display: '~118k t',
      confidence: 'inferred',
      sourceId: 'derived',
      underlyingSourceIds: ['hm_asr_2025'],
      calculation: 'Wood + MMCF (~40,481 t) + paper/cardboard packaging (~72,224 t) + wood packaging (~5,350 t)',
      confidenceNote: 'Approximate roll-up of derived volumes. Excludes viscose-blend and trim materials not separately reported.',
    },
    coverage: HM_COVERAGE,
    opportunitiesCount: HM_OPPORTUNITIES.length,
    lastUpdated: '2026-09-15',
  },
  { id: 'inditex', name: 'Inditex', sector: 'Fashion retail', hq: 'Arteixo, Spain', logoText: 'IN', logoColour: '#111111', researchStatus: 'not_loaded' },
  { id: 'lvmh', name: 'LVMH', sector: 'Luxury goods', hq: 'Paris, France', logoText: 'LV', logoColour: '#2b2b2b', researchStatus: 'not_loaded' },
  { id: 'ikea', name: 'IKEA', sector: 'Home furnishings retail', hq: 'Delft, Netherlands', logoText: 'IK', logoColour: '#0058a3', researchStatus: 'not_loaded' },
  { id: 'walmart', name: 'Walmart', sector: 'General retail', hq: 'Bentonville, USA', logoText: 'WM', logoColour: '#0071ce', researchStatus: 'not_loaded' },
  { id: 'nike', name: 'Nike', sector: 'Sportswear', hq: 'Beaverton, USA', logoText: 'NK', logoColour: '#111111', researchStatus: 'not_loaded' },
  { id: 'patagonia', name: 'Patagonia', sector: 'Outdoor apparel', hq: 'Ventura, USA', logoText: 'PT', logoColour: '#2f5d8a', researchStatus: 'not_loaded' },
  { id: 'hugo_boss', name: 'Hugo Boss', sector: 'Fashion / apparel', hq: 'Metzingen, Germany', logoText: 'HB', logoColour: '#111111', researchStatus: 'not_loaded' },
]

export const getCompany = (id: string) => COMPANIES.find((c) => c.id === id)
