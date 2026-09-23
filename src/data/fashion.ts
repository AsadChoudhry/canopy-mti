import type { Company, Facility, Origin, Quantity, Relationship, Source } from './model'
import { HOT_BUTTON_2025, capacityByRisk, greenShirtCapacity } from './hotbutton'

const ACCESS = '2026-09-23'
const byRisk = capacityByRisk()
const green = greenShirtCapacity()
const scored = HOT_BUTTON_2025.filter((x) => x.total !== null)

export const FASHION_SOURCES_BASE: Source[] = [
  {
    id: 'src_hotbutton_2025',
    title: 'The Hot Button Report 2025, producer matrix',
    publisher: 'Canopy',
    url: 'https://canopyplanet.org/tools-and-resources/hot-button-report',
    page: 'Producer matrix, 2025 % global production capacity',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Hot Button Score out of 40. Shirt bands: dark green 30 to 40, light green 20 to 29, light green with red 20 to 24 with known risk, yellow 10 to 19, red 0 to 9, white not assessed. Risk status codes: NK no known high risk, LR low risk, KR known risk, RP address risk prior to audit, AR audit required, IP audit in progress. 36 producers listed with percentage of global MMCF production capacity, type of MMCF and category scores.',
    limitations: 'Transcribed from the published PDF. The Next Gen product marker column could not be read from the text layer and is not loaded. Canopy reports each producer as a share of global MMCF production capacity and publishes no global tonnage, so these shares cannot be multiplied by a production tonnage from another source.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_hotbutton_lenzing',
    title: 'Hot Button Report, Lenzing producer profile',
    publisher: 'Canopy',
    url: 'https://canopyplanet.org/tools-and-resources/hot-button-report/lenzing',
    page: 'Producer profile',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Category maxima shown on the profile: completion of CanopyStyle audits out of 8, contribution to conservation legacies out of 8, innovation via new alternative fibres out of 10, adoption of robust forest sourcing policy out of 4, traceability and transparency out of 5, leaders in supply chain shifts out of 5, high risk sourcing 0 to minus 5. Chemical management 8 out of 8. Canopy states Lenzing must "significantly scale the use of Next Generation Solutions", continue proactive use of ForestMapper, and increase procurement of FSC 100% or FSC Mix certified inputs.',
    limitations: 'The profile page is maintained live and may reflect a later report year than the 2025 matrix PDF.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_lenzing_pulp_2025',
    title: 'Lenzing Annual and Sustainability Report 2025, Pulp Division',
    publisher: 'Lenzing AG',
    url: 'https://reports.lenzing.com/annual-and-sustainability-report/2025/management-report/business-development-divisions/pulp-division.html',
    page: 'Pulp Division',
    accessDate: ACCESS,
    accessed: true,
    passage: '"A total of approximately 1,218,000 tons of dissolving wood pulp was produced at Lenzing\'s pulp plants in 2025." Pulp plants are at Lenzing (Austria), Paskov (Czech Republic) and Indianópolis (Brazil). Self-sufficiency was increased to significantly more than the 75 percent targeted by the corporate strategy. "In 2025, audits in accordance with the Forest Stewardship Council (FSC) and the Programme for the Endorsement of Forest Certification (PEFC) forest certification systems confirmed again for both sites that, in addition to stringent forestry laws in the supplier countries, all wood used derives from PEFC and FSC certified or controlled sources." LD Celulose secured over 44,000 hectares of FSC certified commercial forest, working toward approximately 80,000 hectares.',
    limitations: 'Pulp tonnes, not fibre tonnes. The certification statement covers the two European sites. Wood origin countries are not listed in this section.',
    reviewStatus: 'reviewed',
    kind: 'company_report',
  },
]

const q = (x: Quantity): Quantity => x

export const FASHION_QUANTITIES: Quantity[] = [
  q({ id: 'q_mmcf_producers', subjectType: 'global', subjectId: 'world', metric: 'MMCF producers in the Hot Button matrix', value: HOT_BUTTON_2025.length, unit: 'producers', period: '2025', scope: 'World, man-made cellulosic fibre producers', basis: 'other', status: 'reported', sourceIds: ['src_hotbutton_2025'], note: `${scored.length} of them carry a score. The remainder are newly engaged or not yet assessed.` }),
  q({ id: 'q_mmcf_capacity_covered', subjectType: 'global', subjectId: 'world', metric: 'Global MMCF capacity covered by the matrix', value: 100, unit: '%', period: '2025', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Sum of the per-producer capacity shares in the matrix', note: 'The listed shares sum to 99.99%.' }),
  q({ id: 'q_mmcf_green', subjectType: 'global', subjectId: 'world', metric: 'Capacity held by green shirt producers, excluding known risk', value: +green.clean.toFixed(1), unit: '%', period: '2025', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Sum of capacity shares for producers scoring 20 buttons or more, less producers carrying known risk', inputs: [{ label: 'All producers scoring 20 or more', value: `${green.total.toFixed(1)}%` }, { label: 'Of which carry known risk, shown as light green with red', value: `${green.knownRisk.toFixed(1)}%` }], note: `${green.count} of the 28 scored producers reach 20 buttons, but ${green.count - green.cleanCount} of them carries known risk. Canopy's own published green shirt figure is about 53% of global capacity, which matches this calculation.` }),
  q({ id: 'q_mmcf_green_all', subjectType: 'global', subjectId: 'world', metric: 'Capacity scoring 20 buttons or more, including known risk', value: +green.total.toFixed(1), unit: '%', period: '2025', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Sum of capacity shares for all producers scoring 20 buttons or more', note: 'Includes Sateri at 24.0% of global capacity, which scores 21.0 but carries known risk.' }),
  q({ id: 'q_mmcf_known_risk', subjectType: 'global', subjectId: 'world', metric: 'Capacity at known risk of Ancient and Endangered Forest sourcing', value: +byRisk.KR.toFixed(1), unit: '%', period: '2025', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Sum of capacity shares for producers with risk status KR', note: 'One producer, Sateri, carries this status in the 2025 matrix.' }),
  q({ id: 'q_mmcf_audit_required', subjectType: 'global', subjectId: 'world', metric: 'Capacity requiring an audit or with risk to address', value: +(byRisk.AR + byRisk.RP).toFixed(1), unit: '%', period: '2025', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Sum of capacity shares for risk status AR and RP', note: 'Audit required plus address risk prior to audit.' }),
  q({ id: 'q_mmcf_nextgen_avg', subjectType: 'global', subjectId: 'world', metric: 'Average Next Generation fibre score across scored producers', value: +(scored.reduce((a, x) => a + (x.scores.nextgen ?? 0), 0) / scored.length).toFixed(1), unit: 'of 10', period: '2025', scope: 'The 28 scored producers', basis: 'other', denominator: 'Maximum 10 points', status: 'calculated', sourceIds: ['src_hotbutton_2025'], formula: 'Mean of the Next Generation fibre score, counting a blank cell as zero' }),

  q({ id: 'q_lenzing_hb_total', subjectType: 'company', subjectId: 'lenzing', metric: 'Hot Button score', value: 34.5, unit: 'of 40', period: '2025', scope: 'Lenzing, all MMCF operations', basis: 'other', denominator: 'Maximum 40 buttons', status: 'reported', sourceIds: ['src_hotbutton_2025'], note: 'Dark green shirt. Risk status: no known high risk.' }),
  q({ id: 'q_lenzing_capacity_share', subjectType: 'company', subjectId: 'lenzing', metric: 'Share of global MMCF production capacity', value: 12.93, unit: '%', period: '2025', scope: 'Lenzing against world MMCF capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'reported', sourceIds: ['src_hotbutton_2025'] }),
  q({ id: 'q_lenzing_pulp_2025', subjectType: 'company', subjectId: 'lenzing', metric: 'Dissolving wood pulp produced', value: 1.218, unit: 'Mt', period: '2025', scope: 'Lenzing pulp plants in Austria, Czech Republic and Brazil', basis: 'output', status: 'reported', sourceIds: ['src_lenzing_pulp_2025'], note: 'Reported as approximately 1,218,000 tonnes. Pulp tonnes, not fibre tonnes.' }),
  q({ id: 'q_lenzing_fibre_volume', subjectType: 'company', subjectId: 'lenzing', metric: 'Fibre production volume', value: null, unit: 't', period: '2025', scope: 'Lenzing', basis: 'output', status: 'unknown', sourceIds: [], note: 'Not loaded. Only the pulp figure has been verified.' }),
  q({ id: 'q_lenzing_nextgen_share', subjectType: 'company', subjectId: 'lenzing', metric: 'Next Generation feedstock share of fibre', value: null, unit: '%', period: '2025', scope: 'Lenzing fibre output', basis: 'input', denominator: 'All fibre produced', status: 'unknown', sourceIds: ['src_hotbutton_lenzing'], note: 'Not disclosed as a share. Canopy scores the innovation criterion 8.5 of 10 and asks Lenzing to significantly scale Next Generation Solutions.' }),
]

export const FASHION_FACILITIES: Facility[] = [
  { id: 'fac_lz_lenzing', name: 'Lenzing pulp plant', type: 'pulp_mill', companyId: 'lenzing', country: 'Austria', sourceIds: ['src_lenzing_pulp_2025'], status: 'reported' },
  { id: 'fac_lz_paskov', name: 'Paskov pulp plant', type: 'pulp_mill', companyId: 'lenzing', country: 'Czech Republic', sourceIds: ['src_lenzing_pulp_2025'], status: 'reported' },
  { id: 'fac_lz_ld', name: 'LD Celulose, Indianópolis', type: 'pulp_mill', companyId: 'lenzing', country: 'Brazil', sourceIds: ['src_lenzing_pulp_2025'], status: 'reported', note: 'Approximately 80,000 hectares of FSC certified forest area when complete.' },
]

export const FASHION_ORIGINS: Origin[] = []

export const LENZING_COMPANY: Company = {
  id: 'lenzing',
  name: 'Lenzing',
  type: 'producer',
  stream: 'fashion',
  sector: 'Producer · Man-made cellulosic fibre',
  hq: 'Lenzing, Austria',
  logoText: 'Lenzing',
  logoColour: '#00843d',
  description: 'Producer of lyocell and viscose staple fibre, with its own dissolving wood pulp plants in Austria, the Czech Republic and Brazil. Highest scoring producer in the Hot Button Report 2025.',
  sourceIds: ['src_hotbutton_2025', 'src_hotbutton_lenzing', 'src_lenzing_pulp_2025'],
  mapping: {
    supplierIdentified: 'confirmed',
    millIdentified: 'confirmed',
    originTraced: 'unresolved',
    note: 'Producer and pulp plants are named. Wood origin countries are not loaded.',
  },
  totalOutputQuantityId: 'q_lenzing_pulp_2025',
  globalComparisonQuantityId: 'q_lenzing_capacity_share',
  sourcingStatements: [
    { text: 'All wood used at the two European pulp sites derives from PEFC and FSC certified or controlled sources, confirmed by 2025 audits.', sourceIds: ['src_lenzing_pulp_2025'], scope: 'Austria and Czech Republic, 2025' },
    { text: 'Self-sufficiency in dissolving wood pulp was increased to significantly more than the 75 percent targeted by the corporate strategy.', sourceIds: ['src_lenzing_pulp_2025'], scope: 'Company-wide, 2025' },
  ],
  notes: 'Significantly scale the use of Next Generation Solutions, continue proactive use of ForestMapper to prevent Ancient and Endangered Forest sourcing, and increase procurement of FSC 100% or FSC Mix certified inputs.',
}

/* ------------------------------------------------------------------ */
/* Sateri: the largest producer, and the one carrying known risk        */
/* ------------------------------------------------------------------ */

export const SATERI_SOURCE: Source = {
  id: 'src_hotbutton_sateri',
  title: 'Hot Button Report, Sateri (part of the RGE Group) producer profile',
  publisher: 'Canopy',
  url: 'https://canopyplanet.org/tools-and-resources/hot-button-report/sateri-rge-group',
  page: 'Producer profile',
  accessDate: ACCESS,
  accessed: true,
  passage:
    'Canopy states that Sateri continues to source from high-risk suppliers and that a significant share of its pulp comes from sister companies. "APRIL continues to operate on carbon-rich, drained tropical peatlands." Canopy calls on Sateri to encourage APRIL to "Address the legacy of forest conversion and associated environmental impacts by increasing restoration and protection of high-carbon peatlands" and to "Set targets and timelines to retire and restore high-carbon peatlands within concession boundaries." Sateri Finex is one of ten established commercial lines of Next Gen made with discarded textiles.',
  limitations: 'The live profile page is maintained continuously and shows a later report year than the 2025 matrix. It gives a total of 20.5 out of 40 and a capacity share of 13 to 14%, where the 2025 matrix gives 21.0 and 24.00%. Scores and capacity in this workspace come from the 2025 matrix; only the commentary is taken from the profile page.',
  reviewStatus: 'needs_review',
  kind: 'canopy_directory',
}

export const SATERI_QUANTITIES: Quantity[] = [
  { id: 'q_sateri_hb_total', subjectType: 'company', subjectId: 'sateri', metric: 'Hot Button score', value: 21.0, unit: 'of 40', period: '2025', scope: 'Sateri, all MMCF operations', basis: 'other', denominator: 'Maximum 40 buttons', status: 'reported', sourceIds: ['src_hotbutton_2025'], note: 'Light green with red: a green-range score carrying known risk in supply. Includes a deduction of 3.0 for high risk sourcing.' },
  { id: 'q_sateri_capacity_share', subjectType: 'company', subjectId: 'sateri', metric: 'Share of global MMCF production capacity', value: 24.0, unit: '%', period: '2025', scope: 'Sateri against world MMCF capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'reported', sourceIds: ['src_hotbutton_2025'], note: 'The largest single share in the matrix. Excluding Sateri is what takes green shirt capacity from 77.7% to 53.7%.' },
  { id: 'q_sateri_deduction', subjectType: 'company', subjectId: 'sateri', metric: 'High risk sourcing deduction', value: -3.0, unit: 'buttons', period: '2025', scope: 'Sateri', basis: 'other', denominator: 'Deduction range 0 to minus 5', status: 'reported', sourceIds: ['src_hotbutton_2025', 'src_hotbutton_sateri'], note: 'Applied where sourcing from Ancient and Endangered Forests is documented.' },
]

export const SATERI_COMPANY: Company = {
  id: 'sateri',
  name: 'Sateri (RGE Group)',
  type: 'producer',
  stream: 'fashion',
  sector: 'Producer · Man-made cellulosic fibre',
  hq: 'Shanghai, China',
  logoText: 'Sateri',
  logoColour: '#0f7b3e',
  description: 'The largest MMCF producer in the Hot Button matrix at 24% of global capacity, and the only one carrying known risk in supply. Produces viscose staple fibre and lyocell.',
  sourceIds: ['src_hotbutton_2025', 'src_hotbutton_sateri'],
  mapping: {
    supplierIdentified: 'confirmed',
    millIdentified: 'unresolved',
    originTraced: 'unresolved',
    note: 'Canopy records a significant share of pulp coming from sister companies within the RGE group. Mills and forest origin are not loaded here.',
  },
  totalOutputQuantityId: undefined,
  globalComparisonQuantityId: 'q_sateri_capacity_share',
  sourcingStatements: [
    { text: 'Canopy states that Sateri continues to source from high-risk suppliers, and that a significant share of its pulp comes from sister companies.', sourceIds: ['src_hotbutton_sateri'], scope: 'Hot Button producer profile' },
    { text: 'APRIL continues to operate on carbon-rich, drained tropical peatlands.', sourceIds: ['src_hotbutton_sateri'], scope: 'Hot Button producer profile' },
  ],
  notes: 'Canopy asks Sateri to encourage APRIL to address the legacy of forest conversion by increasing restoration and protection of high-carbon peatlands, and to set targets and timelines to retire and restore high-carbon peatlands within concession boundaries.',
}

export const FASHION_RELATIONSHIPS: Relationship[] = FASHION_FACILITIES.map((f) => ({
  id: `rel_lz_owns_${f.id}`,
  kind: 'owns',
  fromType: 'company',
  fromId: 'lenzing',
  toType: 'facility',
  toId: f.id,
  status: 'confirmed',
  sourceIds: ['src_lenzing_pulp_2025'],
}))

export const FASHION_SOURCES: Source[] = [...FASHION_SOURCES_BASE, SATERI_SOURCE]
