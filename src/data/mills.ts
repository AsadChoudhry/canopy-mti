/**
 * Next Gen mill siting, India first.
 * Candidate regions are where a verified feedstock or demand signal already exists.
 * Signals are deliberately coarse: a region is only marked "strong" where a quantity is loaded.
 */

export type MillPath = 'agri_residue' | 'textile' | 'retrofit'
export type Signal = 'strong' | 'present' | 'unknown' | 'none'
export type Pillar = 'agri' | 'textile' | 'demand'

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
  name: string
  state: string
  lat: number
  lng: number
  path: MillPath
  pillars: Record<Pillar, PillarEvidence>
  why: string
  openQuestions: string[]
}

export const INDIA_CANDIDATES: CandidateRegion[] = [
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
      agri: { signal: 'strong', text: '18.74 Mt paddy straw, 16.07 Mt of it non-basmati, the straw most often burned (2021, projected).', quantityId: 'q_in_paddy_punjab' },
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
  { name: 'Active fire detections', publisher: 'NASA FIRMS (VIIRS)', what: 'Daily satellite fire points; stubble burning shows in October and November.', answers: 'Where residue is being burned, which means it is not used for anything else.', status: 'next' },
  { name: 'Crop production by district', publisher: 'Directorate of Economics and Statistics, Ministry of Agriculture', what: 'Rice, wheat and sugarcane output by district, converted with residue ratios.', answers: 'Residue in every state, not just three.', status: 'next' },
  { name: 'Textile waste by cluster', publisher: 'Fashion for Good, Sorting for Circularity India', what: 'Waste volumes and fibre mix for Panipat, Tiruppur and others.', answers: 'Which clusters can feed chemical recycling.', status: 'next' },
  { name: 'Dissolving pulp imports', publisher: 'UN Comtrade, HS 470200', what: 'Imports by partner country.', answers: 'How much wood pulp Indian mills import, and so how much Next Gen pulp could replace.', status: 'later' },
  { name: 'Straw already in use', publisher: 'CAQM and state pollution boards', what: 'Straw going to biomass power, boilers and in-field management.', answers: 'What is really left for a pulp mill.', status: 'later' },
]
