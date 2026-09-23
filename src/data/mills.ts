/**
 * Next Gen mill siting, India first.
 * Candidate regions are where a verified feedstock or demand signal already exists.
 * Signals are deliberately coarse: a region is only marked "strong" where a quantity is loaded.
 */

export type MillPath = 'agri_residue' | 'textile' | 'retrofit'
export type Signal = 'strong' | 'present' | 'unknown' | 'none'
export type Pillar = 'agri' | 'textile' | 'demand'
export type RegionKey = 'india' | 'north_america' | 'europe'

export const PILLAR_META: Record<Pillar, { label: string; short: string; what: string }> = {
  agri: { label: 'Agricultural residue', short: 'Ag residue', what: 'Straw and other crop residues that are burned or left unused.' },
  textile: { label: 'Textile waste', short: 'Textile waste', what: 'Pre- and post-consumer textile waste for textile-to-textile pulp.' },
  demand: { label: 'Existing MMCF demand', short: 'Demand nearby', what: 'A viscose or lyocell mill close enough to take Next Gen pulp.' },
}

export const PATH_META: Record<MillPath, { label: string; colour: string; what: string }> = {
  agri_residue: { label: 'Agri-residue pulp mill', colour: '#c9851a', what: 'New pulp capacity fed by straw.' },
  textile: { label: 'Textile-to-textile pulp', colour: '#6a47ea', what: 'Recycling mill fed by sorted cotton-rich waste.' },
  retrofit: { label: 'Retrofit or offtake', colour: '#009a7e', what: 'An existing MMCF mill switches part of its pulp to Next Gen.' },
}

export const SIGNAL_META: Record<Signal, { label: string; points: number; tone: string }> = {
  strong: { label: 'Quantified', points: 2, tone: 'bg-green-100 text-green-700' },
  present: { label: 'Known, not quantified', points: 1, tone: 'bg-amber-100 text-amber-600' },
  unknown: { label: 'Not loaded', points: 0, tone: 'bg-slate-100 text-slate-500 border border-dashed border-slate-300' },
  none: { label: 'None known', points: 0, tone: 'bg-slate-100 text-slate-400' },
}

export interface PillarEvidence {
  signal: Signal
  text: string
  quantityId?: string
  sourceId?: string
}

export interface CandidateRegion {
  id: string
  region: RegionKey
  name: string
  state: string
  lat: number
  lng: number
  path: MillPath
  pillars: Record<Pillar, PillarEvidence>
  why: string
  openQuestions: string[]
}

const INDIA: Omit<CandidateRegion, 'region'>[] = [
  {
    id: 'haryana_panipat',
    name: 'Panipat and surrounds',
    state: 'Haryana',
    lat: 29.39,
    lng: 76.97,
    path: 'textile',
    pillars: {
      agri: { signal: 'strong', text: '6.8 Mt paddy straw generated in the state (2021, projected).', quantityId: 'q_in_paddy_haryana' },
      textile: { signal: 'present', text: 'Panipat is India\'s best-known post-consumer textile recycling cluster. Volume not loaded.' },
      demand: { signal: 'none', text: 'No Hot Button MMCF mill located here.' },
    },
    why: 'The only candidate where both Next Gen feedstocks sit together, so a mill could blend straw and textile inputs or start with one and add the other.',
    openQuestions: ['How much of Panipat\'s intake is cotton-rich and sortable for chemical recycling?', 'Distance to the nearest viscose mill for pulp offtake.'],
  },
  {
    id: 'punjab',
    name: 'Central Punjab',
    state: 'Punjab',
    lat: 30.75,
    lng: 75.6,
    path: 'agri_residue',
    pillars: {
      agri: { signal: 'strong', text: '18.74 Mt paddy straw, 16.07 Mt of it non-basmati, the straw most often burned (2021, projected). 5,114 residue fires still detected in the 2025 season.', quantityId: 'q_in_paddy_punjab' },
      textile: { signal: 'unknown', text: 'Not loaded.' },
      demand: { signal: 'none', text: 'No Hot Button MMCF mill located here.' },
    },
    why: 'The largest single straw supply in the loaded data, and straw burning here is a national air quality issue, so a mill has a policy case as well as a feedstock case.',
    openQuestions: ['How much straw is already committed to biomass power, fodder and in-field management?', 'Can collection and storage cover a short harvest window?'],
  },
  {
    id: 'up_ncr',
    name: 'Western Uttar Pradesh (NCR)',
    state: 'Uttar Pradesh',
    lat: 28.98,
    lng: 77.7,
    path: 'agri_residue',
    pillars: {
      agri: { signal: 'strong', text: '0.67 Mt paddy straw in the eight NCR districts only (2021, projected). The rest of the state is not loaded.', quantityId: 'q_in_paddy_up_ncr' },
      textile: { signal: 'unknown', text: 'Not loaded.' },
      demand: { signal: 'none', text: 'No Hot Button MMCF mill located here.' },
    },
    why: 'A smaller supply in the loaded data, but the figure covers eight districts, so the state total is understated.',
    openQuestions: ['State-wide residue across all districts and crops.'],
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    state: 'Tamil Nadu',
    lat: 11.11,
    lng: 77.34,
    path: 'textile',
    pillars: {
      agri: { signal: 'unknown', text: 'Not loaded.' },
      textile: { signal: 'present', text: 'Major knitwear export cluster producing pre-consumer cutting waste. Volume not loaded.' },
      demand: { signal: 'none', text: 'No Hot Button MMCF mill located here.' },
    },
    why: 'Pre-consumer waste is cleaner and easier to sort than post-consumer, which suits chemical recycling. 42% of India\'s textile waste is pre-consumer.',
    openQuestions: ['Waste tonnage by fibre type from cluster studies.', 'Share already going to mechanical recycling.'],
  },
  {
    id: 'harihar',
    name: 'Harihar',
    state: 'Karnataka',
    lat: 14.51,
    lng: 75.8,
    path: 'retrofit',
    pillars: {
      agri: { signal: 'unknown', text: 'Not loaded.' },
      textile: { signal: 'unknown', text: 'Not loaded.' },
      demand: { signal: 'strong', text: 'Birla Cellulose plans a two-phase lyocell expansion here, first phase due 2027. Aditya Birla holds 15.87% of global MMCF capacity.', sourceId: 'src_hotbutton_2026' },
    },
    why: 'A mill already under expansion by a producer that already sells Next Gen lines (LIVA Reviva with Circulose pulp). The fastest route is Next Gen pulp offtake into new lines, not a new mill.',
    openQuestions: ['Would Birla commit a share of the new lyocell capacity to Next Gen pulp?', 'Where would that pulp come from: an Indian Next Gen mill or imports?'],
  },
]

export interface DataLayer {
  name: string
  publisher: string
  what: string
  answers: string
  status: 'loaded' | 'next' | 'later'
}

export const MILL_LAYERS: DataLayer[] = [
  { name: 'Paddy straw by state', publisher: 'PIB / state governments', what: 'Straw generated in Punjab, Haryana and NCR Uttar Pradesh.', answers: 'How much feedstock exists.', status: 'loaded' },
  { name: 'Textile waste, national', publisher: 'Fashion for Good, Wealth in Waste', what: '7.8 Mt a year; pre-, post-consumer and imported split.', answers: 'Scale of the textile feedstock.', status: 'loaded' },
  { name: 'Hot Button producer updates', publisher: 'Canopy', what: 'Mill expansions and Next Gen lines by producer.', answers: 'Where demand for Next Gen pulp already sits.', status: 'loaded' },
  { name: 'Paddy fire counts, Punjab', publisher: 'CAQM, via Lok Sabha answer', what: '5,114 residue burning events, 15 September to 30 November 2025; about 90% below 2022 across Punjab and Haryana.', answers: 'Whether straw is still being burned, and so still uncommitted.', status: 'loaded' },
  { name: 'Active fire detections by district', publisher: 'NASA FIRMS (VIIRS)', what: 'Daily satellite fire points; stubble burning shows in October and November.', answers: 'Where within a state residue is still being burned.', status: 'next' },
  { name: 'Crop production by district', publisher: 'Directorate of Economics and Statistics, Ministry of Agriculture', what: 'Rice, wheat and sugarcane output by district, converted with residue ratios.', answers: 'Residue in every state, not just three.', status: 'next' },
  { name: 'Textile waste by cluster', publisher: 'Fashion for Good, Sorting for Circularity India', what: 'Waste volumes and fibre mix for Panipat, Tiruppur and others.', answers: 'Which clusters can feed chemical recycling.', status: 'next' },
  { name: 'Dissolving pulp imports', publisher: 'UN Comtrade, HS 470200', what: 'Imports by partner country.', answers: 'How much wood pulp Indian mills import, and so how much Next Gen pulp could replace.', status: 'later' },
  { name: 'Straw already in use', publisher: 'CAQM and state pollution boards', what: 'Straw going to biomass power, boilers and in-field management.', answers: 'What is really left for a pulp mill.', status: 'later' },
]

export const INDIA_CANDIDATES: CandidateRegion[] = INDIA.map((r) => ({ ...r, region: 'india' }))

/* ------------------------------------------------------------------ */
/* North America and Europe                                             */
/* ------------------------------------------------------------------ */

export const NA_CANDIDATES: CandidateRegion[] = [
  {
    id: 'sk_regina',
    region: 'north_america',
    name: 'Regina and southern Saskatchewan',
    state: 'Saskatchewan, Canada',
    lat: 50.45,
    lng: -104.61,
    path: 'agri_residue',
    pillars: {
      agri: { signal: 'present', text: 'Prairie wheat straw. Red Leaf Pulp plans to take 400,000 t of straw a year; provincial straw supply is not loaded.', quantityId: 'q_redleaf_straw_in' },
      textile: { signal: 'unknown', text: 'Not loaded.' },
      demand: { signal: 'present', text: 'Packaging maker Dart funds Red Leaf. No Hot Button MMCF mill nearby, so demand is packaging, not textiles.', sourceId: 'src_redleaf_ck' },
    },
    why: 'The first commercial straw pulp mill in North America is under construction here, so the question is the second and third site, not the first.',
    openQuestions: ['Straw surplus by rural municipality after soil and livestock needs.', 'Which of the Prairie sites Red Leaf has scouted overlap with Canopy brand partner demand?'],
  },
]

export const EU_CANDIDATES: CandidateRegion[] = [
  {
    id: 'se_sundsvall',
    region: 'europe',
    name: 'Sundsvall (Ortviken)',
    state: 'Sweden',
    lat: 62.39,
    lng: 17.36,
    path: 'textile',
    pillars: {
      agri: { signal: 'none', text: 'Not a straw region.' },
      textile: { signal: 'present', text: '6.94 Mt of textile waste in the EU (2022). Only EU-wide totals are loaded, not flows into Sweden.', quantityId: 'q_eu_textile_waste' },
      demand: { signal: 'present', text: '11 brands have committed to buy Circulose pulp from the restart. Names and tonnes are not published. (Circulose\'s own 60,000 t is supply, shown in the project pipeline.)', sourceId: 'src_circulose_ortviken' },
    },
    why: 'The world\'s first commercial-scale chemical textile recycling plant is restarting here, with room to double capacity. The fastest European tonnes come from filling and expanding it.',
    openQuestions: ['Where will the sorted cotton-rich feedstock come from once EU textile EPR schemes start in 2028?', 'Which brands have committed, and at what volumes?'],
  },
  {
    id: 'fi_kemi',
    region: 'europe',
    name: 'Kemi (Veitsiluoto)',
    state: 'Finland',
    lat: 65.73,
    lng: 24.56,
    path: 'textile',
    pillars: {
      agri: { signal: 'none', text: 'Not a straw region.' },
      textile: { signal: 'present', text: 'EU-wide textile waste only. No Finnish collection figure loaded.', quantityId: 'q_eu_textile_waste' },
      demand: { signal: 'unknown', text: 'No published buyer commitments for Infinited Fiber\'s planned output. (The permitted factory itself is supply, shown in the project pipeline.)', sourceId: 'src_infinited_kemi' },
    },
    why: 'Permitted, on a brownfield pulp site with existing wastewater treatment. What is missing is the investment decision, which is where Canopy\'s brand demand evidence can help.',
    openQuestions: ['What offtake volume would unlock the final investment decision?', 'Is the 30,000 t a year plan still current?'],
  },
  {
    id: 'se_morrum',
    region: 'europe',
    name: 'Mörrum',
    state: 'Sweden',
    lat: 56.19,
    lng: 14.75,
    path: 'retrofit',
    pillars: {
      agri: { signal: 'none', text: 'Not a straw region.' },
      textile: { signal: 'present', text: 'Södra blends recycled textiles into dissolving pulp here (OnceMore). Volume from an unverified press release.', sourceId: 'src_sodra_oncemore' },
      demand: { signal: 'present', text: 'OnceMore pulp goes to MMCF producers, Lenzing among them.', sourceId: 'src_sodra_oncemore' },
    },
    why: 'An operating dissolving pulp mill already running textile blends. Raising the recycled share is a retrofit, not a new build.',
    openQuestions: ['Current recycled share of OnceMore pulp and total tonnes.', 'Does it meet Canopy\'s Next Gen definition at the blend level?'],
  },
  {
    id: 'at_lenzing',
    region: 'europe',
    name: 'Lenzing',
    state: 'Austria',
    lat: 47.97,
    lng: 13.6,
    path: 'retrofit',
    pillars: {
      agri: { signal: 'unknown', text: 'Not loaded.' },
      textile: { signal: 'unknown', text: 'Not loaded.' },
      demand: { signal: 'strong', text: 'Lenzing holds 12.65% of global MMCF capacity and sells Next Gen lines (Hot Button 2026).', sourceId: 'src_hotbutton_2026' },
    },
    why: 'The largest European MMCF producer, with its own pulp mill on site. A share of its pulp switching to Next Gen moves more tonnes than a small new mill.',
    openQuestions: ['What share of Lenzing pulp could come from recycled textiles by 2030?', 'Would it buy Circulose or OnceMore pulp, or build its own line?'],
  },
]

export const ALL_CANDIDATES: CandidateRegion[] = [...INDIA_CANDIDATES, ...NA_CANDIDATES, ...EU_CANDIDATES]

export interface RegionMeta {
  label: string
  /** ISO numeric ids to fit the map to. */
  fit: string[]
  highlight: string[]
  question: string
  context: { label: string; quantityId?: string; value?: string; sub: string }[]
}

export const REGION_META: Record<RegionKey, RegionMeta> = {
  india: {
    label: 'India',
    fit: ['356'],
    highlight: ['356'],
    question: 'Which Indian regions should Canopy validate first, and for which kind of mill?',
    context: [
      { label: 'Paddy straw, Punjab + Haryana + NCR UP', value: '26.2 Mt', quantityId: 'q_in_paddy_punjab', sub: 'Generated, 2021 projection. Not all of it is available.' },
      { label: 'Textile waste in India each year', quantityId: 'q_in_textile_waste', sub: '51% post-consumer · 42% pre-consumer · 7% imported' },
      { label: 'Capacity Canopy\'s India blueprint enables', quantityId: 'q_in_ng_capacity_target', sub: 'From an initial $2 bn. $13 to 15 bn over the next decade.' },
    ],
  },
  north_america: {
    label: 'North America',
    fit: ['124', '840'],
    highlight: ['124', '840'],
    question: 'Where should Canopy look for the second and third North American straw mills?',
    context: [
      { label: 'Red Leaf straw pulp, Regina, from 2028', quantityId: 'q_redleaf_pulp_out', sub: 'Market pulp from 400,000 t of straw a year' },
      { label: 'Straw to pulp yield, Red Leaf design', quantityId: 'q_straw_pulp_yield', sub: 'The planner uses this as its default' },
      { label: 'Prairie straw supply', value: 'not loaded', sub: 'Needs provincial crop and residue statistics' },
    ],
  },
  europe: {
    label: 'Europe',
    fit: ['752', '246', '040'],
    highlight: ['752', '246', '040'],
    question: 'Which European projects need demand evidence to reach investment decision or expand?',
    context: [
      { label: 'Textile waste in the EU, 2022', quantityId: 'q_eu_textile_waste', sub: '16 kg a person; under 15% collected separately' },
      { label: 'Circulose Ortviken restart', quantityId: 'q_circulose_capacity', sub: 'Textile-to-textile pulp, potential to double' },
      { label: 'MMCF from recycled feedstock, world', quantityId: 'q_mmcf_recycled_share_2024', sub: 'Of 8.4 Mt MMCF in 2024 (Textile Exchange)' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Named Next Gen capacity pipeline                                     */
/* ------------------------------------------------------------------ */

export type ProjectStage = 'operating' | 'restarting' | 'construction' | 'permitted' | 'announced'

export const STAGE_META: Record<ProjectStage, { label: string; colour: string; order: number }> = {
  operating: { label: 'Operating', colour: '#00614f', order: 0 },
  restarting: { label: 'Restarting', colour: '#009a7e', order: 1 },
  construction: { label: 'Under construction', colour: '#6a47ea', order: 2 },
  permitted: { label: 'Permitted, no investment decision', colour: '#f2b53a', order: 3 },
  announced: { label: 'Announced', colour: '#9aa3ad', order: 4 },
}

export interface PipelineProject {
  id: string
  name: string
  operator: string
  place: string
  region: RegionKey | 'china'
  path: MillPath
  stage: ProjectStage
  year?: number
  tonnes: number
  output: 'pulp' | 'fibre'
  quantityId?: string
  sourceId: string
  note?: string
}

export const PIPELINE: PipelineProject[] = [
  { id: 'fac_ng_sodra', name: 'OnceMore', operator: 'Södra', place: 'Mörrum, Sweden', region: 'europe', path: 'retrofit', stage: 'operating', year: 2022, tonnes: 6000, output: 'pulp', sourceId: 'src_sodra_oncemore', note: 'Blend of wood and recycled textile; Next Gen share lower than the tonnage.' },
  { id: 'fac_ng_xinxiang', name: 'Juncao grass pulp', operator: 'Xinxiang Chemical Fiber (Bailu)', place: 'Henan, China', region: 'china', path: 'agri_residue', stage: 'operating', tonnes: 10000, output: 'pulp', sourceId: 'src_hotbutton_2026', note: 'Capacity expanded to 10,000 t (Hot Button 2026 producer update).' },
  { id: 'fac_ng_circulose', name: 'Factory O', operator: 'Circulose', place: 'Sundsvall, Sweden', region: 'europe', path: 'textile', stage: 'restarting', year: 2026, tonnes: 60000, output: 'pulp', quantityId: 'q_circulose_capacity', sourceId: 'src_circulose_ortviken' },
  { id: 'fac_ng_redleaf', name: 'Regina mill', operator: 'Red Leaf Pulp', place: 'Regina, Saskatchewan', region: 'north_america', path: 'agri_residue', stage: 'construction', year: 2028, tonnes: 200000, output: 'pulp', quantityId: 'q_redleaf_pulp_out', sourceId: 'src_redleaf_ck' },
  { id: 'fac_ng_infinited', name: 'Kemi factory', operator: 'Infinited Fiber', place: 'Kemi, Finland', region: 'europe', path: 'textile', stage: 'permitted', tonnes: 30000, output: 'fibre', quantityId: 'q_infinited_capacity', sourceId: 'src_infinited_kemi' },
]

export const MILL_LAYERS_BY_REGION: Record<RegionKey, DataLayer[]> = {
  india: MILL_LAYERS,
  north_america: [
    { name: 'Red Leaf Regina mill', publisher: 'Corporate Knights', what: 'Straw in, pulp out, start dates and funder.', answers: 'The reference design for a Prairie straw mill.', status: 'loaded' },
    { name: 'Field crop area and production', publisher: 'Statistics Canada, table 32-10-0359; USDA NASS', what: 'Wheat, barley and flax by census division and county.', answers: 'Straw generated around each candidate site.', status: 'next' },
    { name: 'Sustainable straw removal rates', publisher: 'Provincial agriculture ministries, USDA', what: 'Share of straw that can leave the field without harming soil.', answers: 'How much of the straw a mill can actually buy.', status: 'next' },
    { name: 'Packaging and tissue mills', publisher: 'Company disclosures, Pack4Good engagement', what: 'Mills within trucking distance that could take straw pulp.', answers: 'Who buys the pulp.', status: 'later' },
  ],
  europe: [
    { name: 'Textile waste, EU-27', publisher: 'European Environment Agency', what: '6.94 Mt generated in 2022; under 15% collected separately.', answers: 'Scale of the European textile feedstock.', status: 'loaded' },
    { name: 'Named Next Gen projects', publisher: 'Circulose, Infinited Fiber, Södra', what: 'Capacity, stage and year.', answers: 'Which projects are closest to adding tonnes.', status: 'loaded' },
    { name: 'Textile EPR schemes by Member State', publisher: 'National transpositions of the revised Waste Framework Directive', what: 'Collection targets and fees from 2028.', answers: 'Where sorted feedstock will appear first.', status: 'next' },
    { name: 'Sorting capacity', publisher: 'Fashion for Good Sorting for Circularity Europe, Euratex', what: 'Automated sorting plants and cotton-rich output.', answers: 'Whether feedstock is clean enough for chemical recycling.', status: 'next' },
    { name: 'Dissolving pulp trade', publisher: 'UN Comtrade, HS 470200', what: 'EU imports by partner.', answers: 'How much imported wood pulp Next Gen pulp could replace.', status: 'later' },
  ],
}
