import type { Quantity, Source } from './model'

const ACCESS = '2026-09-23'

export const FIBRE_SOURCES: Source[] = [
  {
    id: 'src_te_mmr_2025',
    title: 'Materials Market Report 2025',
    publisher: 'Textile Exchange',
    url: 'https://textileexchange.org/app/uploads/2025/09/Materials-Market-Report-2025.pdf',
    page: 'Global fibre production overview and manmade cellulosic fibers section',
    accessDate: ACCESS,
    accessed: true,
    passage:
      '"Global fiber production increased from around 125 million tonnes in 2023 to a record 132 million tonnes in 2024." Polyester 77.7 Mt, around 59%. Plant fibers ~31.3 Mt (~24%), of which cotton ~24.5 Mt (~19%). Manmade cellulosic fibers ~8.4 Mt (~6%), of which viscose 6.7 Mt. Polyamide 7.0 Mt (~5%). Other synthetics 6.3 Mt (~5%). Animal fibers ~1.3 Mt (~1%). "MMCFs produced using Forest Stewardship Council (FSC) and/or Programme for the Endorsement of Forest Certification (PEFC)-certified or controlled feedstock had an estimated market share of 65–70% of all MMCFs in 2024." "The market share of MMCFs made from recycled feedstocks increased from an estimated 0.7% in 2023 to 1.1% in 2024."',
    limitations: 'Production volumes, not consumption. Category shares are rounded in the source. Cotton is reported on a 2023/24 season basis.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
]

export interface FibreRow {
  id: string
  label: string
  mt: number
  pct: number
  inCanopyScope: boolean
  note?: string
}

/** Global fibre production 2024. Only MMCF is forest-derived, so only MMCF is Canopy's direct fashion scope. */
export const GLOBAL_FIBRE_2024: FibreRow[] = [
  { id: 'polyester', label: 'Polyester', mt: 77.7, pct: 59, inCanopyScope: false, note: 'Around 88% fossil-based PET' },
  { id: 'plant_other', label: 'Other plant fibres', mt: 6.8, pct: 5, inCanopyScope: false, note: 'Plant fibres 31.3 Mt less cotton 24.5 Mt' },
  { id: 'cotton', label: 'Cotton', mt: 24.5, pct: 19, inCanopyScope: false, note: 'Not forest-derived, but post-consumer cotton textiles are a Next Gen feedstock for MMCF' },
  { id: 'mmcf', label: 'Man-made cellulosic fibre', mt: 8.4, pct: 6, inCanopyScope: true, note: 'Viscose 6.7 Mt; acetate, lyocell, modal and cupro make up the rest' },
  { id: 'polyamide', label: 'Polyamide', mt: 7.0, pct: 5, inCanopyScope: false },
  { id: 'other_synthetic', label: 'Other synthetics', mt: 6.3, pct: 5, inCanopyScope: false, note: 'Polypropylene, acrylic, elastane' },
  { id: 'animal', label: 'Animal fibres', mt: 1.3, pct: 1, inCanopyScope: false, note: 'Wool, cashmere, mohair, alpaca, silk' },
]

const q = (x: Quantity): Quantity => x

export const FIBRE_QUANTITIES: Quantity[] = [
  q({ id: 'q_fibre_total_2024', subjectType: 'global', subjectId: 'world', metric: 'Global fibre production', value: 132, unit: 'Mt', period: '2024', scope: 'World, all textile fibres', basis: 'output', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Up from 125 Mt in 2023.' }),
  q({ id: 'q_fibre_mmcf_2024', subjectType: 'global', subjectId: 'world', metric: 'Man-made cellulosic fibre production', value: 8.4, unit: 'Mt', period: '2024', scope: 'World, viscose, acetate, lyocell, modal and cupro', basis: 'output', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Viscose alone is 6.7 Mt. This is the only forest-derived fibre category and therefore Canopy fashion scope.' }),
  q({ id: 'q_fibre_mmcf_share', subjectType: 'global', subjectId: 'world', metric: 'MMCF share of global fibre', value: 6, unit: '%', period: '2024', scope: 'World, all textile fibres', basis: 'output', denominator: 'Global fibre production 132 Mt', status: 'reported', sourceIds: ['src_te_mmr_2025'] }),
  q({ id: 'q_fibre_mmcf_certified', subjectType: 'global', subjectId: 'world', metric: 'MMCF from FSC or PEFC certified or controlled feedstock', value: 67.5, unit: '%', period: '2024', scope: 'World MMCF production', basis: 'input', denominator: 'All MMCF produced', status: 'estimated', sourceIds: ['src_te_mmr_2025'], formula: 'Midpoint of the reported 65 to 70% range', note: 'Reported as an estimated market share of 65 to 70%. Controlled is not the same as certified.' }),
  q({ id: 'q_fibre_mmcf_recycled', subjectType: 'global', subjectId: 'world', metric: 'MMCF made from recycled feedstocks', value: 1.1, unit: '%', period: '2024', scope: 'World MMCF production', basis: 'input', denominator: 'All MMCF produced', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Up from an estimated 0.7% in 2023. Roughly 0.09 Mt of the 8.4 Mt total.' }),
  q({ id: 'q_hm_mmcf_of_global', subjectType: 'company', subjectId: 'hm', metric: 'H&M Wood and MMCF against global MMCF production', value: 0.48, unit: '%', period: '2025 vs 2024', scope: 'H&M derived Wood and MMCF volume against world MMCF production', basis: 'input', denominator: 'Global MMCF production 8.4 Mt', status: 'calculated', sourceIds: ['src_te_mmr_2025', 'derived'], formula: '0.0405 Mt / 8.4 Mt x 100', inputs: [{ label: 'H&M Wood and MMCF, derived', value: '~40,481 t' }, { label: 'Global MMCF 2024', value: '8.4 Mt' }], note: 'The H&M figure is itself derived from a reported material share, so this is an estimate on an estimate. Brand purchases against world production, and the years differ.' }),
  q({ id: 'q_hm_cotton_feedstock', subjectType: 'company', subjectId: 'hm', metric: 'H&M cotton, potential Next Gen feedstock pool', value: 283368, unit: 't', basis: 'input', period: '2025', scope: 'H&M commercial product material', denominator: 'Product material 506,015 t', status: 'estimated', sourceIds: ['derived'], formula: '506,015 t x 56%', inputs: [{ label: 'Product material', value: '506,015 t' }, { label: 'Cotton share', value: '56%' }], note: 'Cotton is not forest-derived and is outside CanopyStyle. It is listed because post-consumer cotton textiles are the main Next Gen feedstock for MMCF. Nothing here implies this volume is available or collectable.' }),
  q({ id: 'q_fibre_recycled_textiles', subjectType: 'global', subjectId: 'world', metric: 'Global fibre from pre- and post-consumer recycled textiles', value: 1, unit: '%', period: '2024', scope: 'World, all textile fibres', basis: 'input', denominator: 'Global fibre production 132 Mt', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Reported as less than 1%. This is the feedstock pool Next Gen MMCF draws on.' }),
]
