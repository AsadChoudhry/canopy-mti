import type { Company, Store } from './model'

/**
 * Regulations that put a date on a material transition. Dates come from sources in research2026.ts;
 * most were read in secondary summaries and are marked for review.
 */

export interface Milestone {
  date: string // ISO
  label: string
  who?: string
}

export interface Rule {
  id: string
  name: string
  short: string
  jurisdiction: 'EU' | 'India' | 'Global'
  streams: ('packaging' | 'fashion')[]
  status: 'applies' | 'in_force' | 'upcoming'
  sourceId: string
  what: string
  lever: string
  dataNeeded: string
  milestones: Milestone[]
  /** Which tracked companies it touches, and why. */
  appliesTo: (c: Company, store: Store) => string | null
}

const EU = new Set(['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'])

function euFootprint(c: Company, store: Store) {
  const mills = store.facilities.filter((f) => f.companyId === c.id && EU.has(f.country))
  const hqEu = [...EU].some((k) => c.hq.includes(k))
  if (mills.length) return `${mills.length} EU mill${mills.length > 1 ? 's' : ''} (${[...new Set(mills.map((m) => m.country))].slice(0, 3).join(', ')})`
  if (hqEu) return `Headquartered in the EU (${c.hq})`
  return null
}

export const RULES: Rule[] = [
  {
    id: 'ppwr',
    name: 'Packaging and Packaging Waste Regulation (EU) 2025/40',
    short: 'PPWR',
    jurisdiction: 'EU',
    streams: ['packaging'],
    status: 'applies',
    sourceId: 'src_ppwr_2025_40',
    what: 'Applies from 12 August 2026. All packaging recyclable by 2030; empty space capped at 40% for e-commerce and transport packaging; PFAS restricted in food-contact packaging.',
    lever: 'Recyclability rules favour fibre packaging that pulps cleanly. A move from plastic to paper raises fibre demand, and Canopy wants that demand met with recycled and Next Gen fibre, not virgin.',
    dataNeeded: 'Which traced products are sold in the EU, their barrier coatings, and recycled content.',
    milestones: [
      { date: '2025-02-11', label: 'Entered into force' },
      { date: '2026-08-12', label: 'General application; PFAS restriction for food contact' },
      { date: '2030-01-01', label: 'All packaging recyclable' },
    ],
    appliesTo: (c, s) => (c.stream === 'packaging' ? euFootprint(c, s) : null),
  },
  {
    id: 'eudr',
    name: 'EU Deforestation Regulation, as amended by (EU) 2025/2650',
    short: 'EUDR',
    jurisdiction: 'EU',
    streams: ['packaging', 'fashion'],
    status: 'upcoming',
    sourceId: 'src_eudr_2025_2650',
    what: 'Operators placing wood products on the EU market, including pulp and paper, must show they are deforestation-free and legal, with geolocation of origin.',
    lever: 'Due diligence statements create product-level origin data, which is exactly what this tool traces. Metsä Board already publishes it per product.',
    dataNeeded: 'Origin per product (country and plot), the due diligence statements producers file, and which products are exported to the EU.',
    milestones: [
      { date: '2025-12-23', label: 'Amendment published, one-year delay' },
      { date: '2026-12-30', label: 'Applies to large and medium operators', who: 'Large and medium' },
      { date: '2027-06-30', label: 'Applies to micro and small operators', who: 'Micro and small' },
    ],
    appliesTo: (c, s) => euFootprint(c, s),
  },
  {
    id: 'wfd_textiles',
    name: 'Revised Waste Framework Directive, textile EPR',
    short: 'Textile EPR',
    jurisdiction: 'EU',
    streams: ['fashion'],
    status: 'in_force',
    sourceId: 'src_wfd_textiles_2025',
    what: 'Every Member State must run extended producer responsibility schemes for textiles and footwear, financed by producers, within 30 months of 16 October 2025.',
    lever: 'Separate collection and sorting will create the cotton-rich feedstock textile-to-textile pulp mills need. It sets when European feedstock for Circulose and Infinited becomes reliable.',
    dataNeeded: 'National scheme dates, collection targets, and sorted tonnes by fibre.',
    milestones: [
      { date: '2025-10-16', label: 'Entered into force' },
      { date: '2027-06-16', label: 'Transposition deadline (20 months)' },
      { date: '2028-04-16', label: 'EPR schemes in place (30 months)' },
    ],
    appliesTo: (c, s) => (c.stream === 'fashion' ? (euFootprint(c, s) ? `${euFootprint(c, s)}; brands selling in the EU pay fees` : 'Customers selling in the EU pay fees') : null),
  },
]

export const RULE_GAPS = [
  { jurisdiction: 'India', text: 'No paper, packaging or textile rule loaded yet. The India hub would add state straw-burning directions (CAQM) and any textile EPR proposals.' },
  { jurisdiction: 'North America', text: 'State packaging EPR laws (for example California SB 54) are not loaded.' },
]

export function daysFrom(today: Date, iso: string) {
  return Math.round((new Date(iso + 'T00:00:00Z').getTime() - today.getTime()) / 86400000)
}
