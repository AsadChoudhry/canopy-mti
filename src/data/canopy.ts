import type { Quantity, Source } from './model'
import { HB_2026_HEADLINES, capacityByRisk2026, greenShirtCapacity2026 } from './hotbutton'

/**
 * Canopy's own published goals and progress figures, plus the India feedstock figures
 * behind the Next Gen mill siting view.
 */

const ACCESS = '2026-09-23'
const green26 = greenShirtCapacity2026()
const risk26 = capacityByRisk2026()

export const CANOPY_SOURCES: Source[] = [
  {
    id: 'src_canopy_ar_2425',
    title: 'Canopy Annual Report 2024/2025, By Nature Fearless',
    publisher: 'Canopy',
    url: 'https://www.datocms-assets.com/132613/1774041305-canopy_annualreport_2024-25.pdf',
    page: 'Executive Director letter (p. 3); Canopy by the numbers (p. 27)',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Canopy by the numbers: 8.35M tonnes total Next Gen production in 2024; 950+ brand partners; 40 Next Gen innovator partners with signed policies; 2.4T USD in annual revenues of brand partners. Letter: "We\'re continuing to lay the foundations for the $78B USD investment needed to scale Next Gen manufacturing." EcoPaper Database has more than 1,400 vetted listings.',
    limitations: 'The production figure covers all Next Gen applications (paper, packaging and textiles). The report does not define how production is measured or split by sector.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_canopy_ar_2324',
    title: 'Canopy Annual Report 2023/2024, Getting Audacious',
    publisher: 'Canopy',
    url: 'https://www.datocms-assets.com/132613/1725937324-canopy-annual-report-2024-final.pdf',
    page: 'A Most Audacious Year (p. 7); Next Gen is Now (p. 19)',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Goal "to bring over 60 million tonnes of low-carbon, circular Next Gen Solutions to market by 2033. Such a scale-up would avoid over 1.3 billion tonnes of GHG emissions." "Compared to virgin tree fibre, each tonne of Next Gen pulp avoids an average of four tonnes of GHG emissions and has five-times less impact on land use and biodiversity." Six key regions for Next Gen scale-up, beginning with India, North America and Europe. Re-START Alliance in India: "scaling one million tonnes of recycled fibre production in India by 2030."',
    limitations: 'The four-tonne factor is an average across Next Gen pulp types from Canopy-commissioned life cycle analysis. It is per tonne of pulp, not per tonne of finished product.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_hotbutton_2026',
    title: 'Hot Button Progress Report 2026',
    publisher: 'Canopy',
    url: 'https://www.datocms-assets.com/132613/1790004515-hot-button-progress-2026.pdf',
    page: 'Executive summary (p. 2); producer grid (p. 5); producer updates (pp. 6 to 12)',
    accessDate: ACCESS,
    accessed: true,
    passage: '"For 2026, 22 of the total of 28 producers have achieved green shirt status." "Total Green Shirt capacity dropped slightly from 54% of global production in 2025 to 53% this year." "There are now 20 Next Gen product lines available on the market, up from 16 in 2025." "Twelve of these current Next Gen product lines are offered by Chinese producers." "Two producers ceased MMCF production and one new producer joined." Shirt colours are carried over from 2025 except for three producers. Full button scores return in 2027 under updated criteria.',
    limitations: 'Released 22 September 2026. No button scores are published for 2026, so the 2025 scores remain the latest. Shirt colours and Next Gen markers are images in the PDF and were read from the rendered page.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_pib_paddy_2021',
    title: 'Paddy straw generated in Punjab, Haryana and U.P. expected to come down significantly this year',
    publisher: 'Press Information Bureau, Ministry of Environment, Forest and Climate Change, Government of India',
    url: 'https://pib.gov.in/Pressreleaseshare.aspx?PRID=1762056',
    page: 'Press release, 8 October 2021',
    accessDate: ACCESS,
    accessed: true,
    passage: '"The total paddy straw generation is likely to come down by 1.31 million tonnes (from 20.05 million tonnes in 2020 to 18.74 million tonnes in 2021) in Punjab; by 0.8 million tonnes (from 7.6 million tonnes in 2020 to 6.8 million tonnes in 2021) in Haryana and; by 0.09 million tonnes (from 0.75 million tonnes in 2020 to 0.67 million tonnes in 2021) in the eight NCR districts of U.P." Non-basmati straw, the burning concern, 16.07 Mt in Punjab and 2.9 Mt in Haryana (2021).',
    limitations: 'State government projections for 2021, not a measured recent year. Covers paddy straw only; wheat straw and other residues are not included. Uttar Pradesh covers eight NCR districts only. Straw generated is not straw available: some is already used for fodder, boilers and in-field management.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
  {
    id: 'src_ffg_wealth_in_waste',
    title: 'Wealth in Waste: India\'s Potential to Lead Circular Textile Sourcing',
    publisher: 'Fashion for Good',
    url: 'https://www.fashionforgood.com/our_news/wealth-in-waste-indias-potential-to-lead-circular-textile-sourcing/',
    page: 'Summary article',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Up to 7,800 kilotonnes of textile waste accumulates in India annually, 8.5% of the global total. Post-consumer 51%, pre-consumer 42%, imported 7%. Only 59% finds its way back into the textile industry through reuse and recycling.',
    limitations: 'National totals only in the summary; no state or cluster split. The full report was not opened.',
    reviewStatus: 'needs_review',
    kind: 'other',
  },
]

const q = (x: Quantity): Quantity => x

export const CANOPY_QUANTITIES: Quantity[] = [
  q({ id: 'q_ng_production_2024', subjectType: 'global', subjectId: 'world', metric: 'Next Gen production', value: 8.35, unit: 'Mt', period: '2024', scope: 'World, all Next Gen applications', basis: 'output', status: 'reported', sourceIds: ['src_canopy_ar_2425'], note: 'Production, not capacity. The 11.9 Mt on nextgennow.canopyplanet.org is capacity.' }),
  q({ id: 'q_ng_target_2033', subjectType: 'global', subjectId: 'world', metric: 'Next Gen target', value: 60, unit: 'Mt', period: '2033', scope: 'World, paper, packaging and textiles', basis: 'output', status: 'reported', sourceIds: ['src_canopy_ar_2324'] }),
  q({ id: 'q_ng_ghg_2033', subjectType: 'global', subjectId: 'world', metric: 'GHG emissions avoided if the target is reached', value: 1.3, unit: 'Gt CO2e', period: 'to 2033', scope: 'World', basis: 'other', status: 'reported', sourceIds: ['src_canopy_ar_2324'] }),
  q({ id: 'q_ng_investment', subjectType: 'global', subjectId: 'world', metric: 'Investment needed to scale Next Gen manufacturing', value: 78, unit: 'USD bn', period: 'to 2033', scope: 'World', basis: 'other', status: 'reported', sourceIds: ['src_canopy_ar_2425'] }),
  q({ id: 'q_ng_cagr_needed', subjectType: 'global', subjectId: 'world', metric: 'Annual growth needed to reach the target', value: 24.5, unit: '% per year', period: '2024 to 2033', scope: 'World', basis: 'other', status: 'calculated', sourceIds: ['src_canopy_ar_2425', 'src_canopy_ar_2324'], formula: '(60 / 8.35) ^ (1 / 9) − 1', inputs: [{ label: '2024 production', value: '8.35 Mt' }, { label: '2033 target', value: '60 Mt' }, { label: 'Years', value: '9' }], note: 'Assumes the target is measured the same way as the 2024 production figure, which the reports do not confirm.' }),
  q({ id: 'q_ng_invest_per_t', subjectType: 'global', subjectId: 'world', metric: 'Implied investment per tonne of new annual Next Gen output', value: 1510, unit: 'USD / t', period: 'to 2033', scope: 'World', basis: 'other', status: 'calculated', sourceIds: ['src_canopy_ar_2425', 'src_canopy_ar_2324'], formula: '78 bn USD / (60 − 8.35) Mt', note: 'A rough check on scale, not a capital cost estimate. Canopy does not say whether the 78 bn covers the full gap to 60 Mt.' }),
  q({ id: 'q_ng_ghg_factor', subjectType: 'global', subjectId: 'world', metric: 'GHG avoided per tonne of Next Gen pulp', value: 4, unit: 't CO2e / t', period: 'not specified', scope: 'Average across Next Gen pulp, compared with virgin tree fibre', basis: 'other', status: 'reported', sourceIds: ['src_canopy_ar_2324'], note: 'An average. Applied to fibre tonnes in scenarios as an approximation.' }),

  q({ id: 'q_mmcf_green_2026', subjectType: 'global', subjectId: 'world', metric: 'Capacity held by green shirt producers, excluding known risk', value: +green26.clean.toFixed(1), unit: '%', period: '2026', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2026'], formula: 'Sum of 2026 capacity shares for green shirt producers, less light green with red', inputs: [{ label: 'All green shirts', value: `${green26.total.toFixed(1)}%` }, { label: 'Of which light green with red', value: `${(green26.total - green26.clean).toFixed(1)}%` }], note: `${green26.cleanCount} of ${green26.assessed} assessed producers. Canopy publishes ${HB_2026_HEADLINES.greenCapacityPct}%, which this matches.` }),
  q({ id: 'q_mmcf_known_risk_2026', subjectType: 'global', subjectId: 'world', metric: 'Capacity at known risk of Ancient and Endangered Forest sourcing', value: +risk26.KR.toFixed(1), unit: '%', period: '2026', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2026'], formula: 'Sum of 2026 capacity shares with risk status KR', note: 'Sateri alone, up from 24.0% in 2025.' }),
  q({ id: 'q_mmcf_audit_required_2026', subjectType: 'global', subjectId: 'world', metric: 'Capacity requiring an audit or with risk to address', value: +(risk26.AR + risk26.RP).toFixed(1), unit: '%', period: '2026', scope: 'World MMCF production capacity', basis: 'capacity', denominator: 'Total global MMCF capacity', status: 'calculated', sourceIds: ['src_hotbutton_2026'], formula: 'Sum of 2026 capacity shares for AR and RP' }),

  q({ id: 'q_in_paddy_punjab', subjectType: 'origin', subjectId: 'in_punjab', metric: 'Paddy straw generated', value: 18.74, unit: 'Mt', period: '2021 (projected)', scope: 'Punjab, India', basis: 'output', status: 'reported', sourceIds: ['src_pib_paddy_2021'], note: '16.07 Mt of it from non-basmati varieties, the straw most often burned.' }),
  q({ id: 'q_in_paddy_haryana', subjectType: 'origin', subjectId: 'in_haryana', metric: 'Paddy straw generated', value: 6.8, unit: 'Mt', period: '2021 (projected)', scope: 'Haryana, India', basis: 'output', status: 'reported', sourceIds: ['src_pib_paddy_2021'], note: '2.9 Mt from non-basmati varieties.' }),
  q({ id: 'q_in_paddy_up_ncr', subjectType: 'origin', subjectId: 'in_up_ncr', metric: 'Paddy straw generated', value: 0.67, unit: 'Mt', period: '2021 (projected)', scope: 'Eight NCR districts of Uttar Pradesh only', basis: 'output', status: 'reported', sourceIds: ['src_pib_paddy_2021'] }),
  q({ id: 'q_in_textile_waste', subjectType: 'global', subjectId: 'india', metric: 'Textile waste accumulated', value: 7.8, unit: 'Mt / yr', period: 'not specified', scope: 'India', basis: 'other', status: 'reported', sourceIds: ['src_ffg_wealth_in_waste'], note: 'Post-consumer 51%, pre-consumer 42%, imported 7%. 59% re-enters the textile industry.' }),
]
