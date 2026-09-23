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
      '"Production of manmade cellulosic fibers (MMCFs), including viscose (rayon), lyocell, modal, acetate, and cupro, increased from 7.9 million tonnes in 2023 to 8.4 million tonnes in 2024." Viscose accounted for 6.7 million tonnes. "MMCFs produced using Forest Stewardship Council (FSC) and/or Programme for the Endorsement of Forest Certification (PEFC)-certified or controlled feedstock had an estimated market share of 65–70% of all MMCFs in 2024." "The market share of MMCFs made from recycled feedstocks increased from an estimated 0.7% in 2023 to 1.1% in 2024."',
    limitations: 'Production volumes, not consumption. Controlled feedstock is not the same as certified feedstock.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
]

const q = (x: Quantity): Quantity => x

export const FIBRE_QUANTITIES: Quantity[] = [
  q({ id: 'q_fibre_mmcf_2024', subjectType: 'global', subjectId: 'world', metric: 'Man-made cellulosic fibre production', value: 8.4, unit: 'Mt', period: '2024', scope: 'World, viscose, acetate, lyocell, modal and cupro', basis: 'output', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Viscose alone is 6.7 Mt. Acetate, lyocell, modal and cupro make up the rest.' }),
  q({ id: 'q_fibre_mmcf_certified', subjectType: 'global', subjectId: 'world', metric: 'MMCF from FSC or PEFC certified or controlled feedstock', value: 67.5, unit: '%', period: '2024', scope: 'World MMCF production', basis: 'input', denominator: 'All MMCF produced', status: 'estimated', sourceIds: ['src_te_mmr_2025'], formula: 'Midpoint of the reported 65 to 70% range', note: 'Reported as an estimated market share of 65 to 70%. Controlled is not the same as certified.' }),
  q({ id: 'q_fibre_mmcf_recycled', subjectType: 'global', subjectId: 'world', metric: 'MMCF made from recycled feedstocks', value: 1.1, unit: '%', period: '2024', scope: 'World MMCF production', basis: 'input', denominator: 'All MMCF produced', status: 'reported', sourceIds: ['src_te_mmr_2025'], note: 'Up from an estimated 0.7% in 2023. Roughly 0.09 Mt of the 8.4 Mt total.' }),
]
