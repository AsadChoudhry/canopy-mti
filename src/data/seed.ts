import type { Store, Source, Quantity, Company, Product, Facility, Origin, Relationship, Solution, Scenario } from './model'
import { METSA_COMPANY, METSA_FACILITIES, METSA_ORIGINS, METSA_PRODUCTS, METSA_QUANTITIES, METSA_RELATIONSHIPS, METSA_SOURCES } from './metsa'
import { FASHION_FACILITIES, FASHION_QUANTITIES, FASHION_RELATIONSHIPS, FASHION_SOURCES, LENZING_COMPANY, SATERI_COMPANY, SATERI_QUANTITIES } from './fashion'
import { FIBRE_QUANTITIES, FIBRE_SOURCES } from './fibre'

const ACCESS = '2026-09-21'

/* -------------------------------------------------------------------------- */
/* Sources. Each records whether the document was actually opened.             */
/* -------------------------------------------------------------------------- */
export const SEED_SOURCES: Source[] = [
  {
    id: 'src_fao_2024',
    title: 'Forest Products Statistics, Data (2024 global production)',
    publisher: 'FAO',
    url: 'https://www.fao.org/forestry/statistics/data/en',
    page: 'Production / exports summary table, 2024',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Production 2024: paper and paperboard 423 Mt; wood pulp 189 Mt; pulp from fibres other than wood 10 Mt; recovered paper 241 Mt.',
    limitations: 'Paper and paperboard covers all end uses. Pulp and recovered paper are measured at different processing stages.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
  {
    id: 'src_faostat_bulk_2024',
    title: 'FAOSTAT Forestry Production and Trade, bulk download (Forestry_E_All_Data_(Normalized).zip)',
    publisher: 'FAO / FAOSTAT',
    url: 'https://bulks-faostat.fao.org/production/Forestry_E_All_Data_(Normalized).zip',
    page: 'Item: Paper and paperboard · Element: Production · Year: 2024',
    accessDate: ACCESS,
    accessed: true,
    passage: 'World 423,018,755 t, flag A. Country rows carry FAO flags: A official, E estimated, X figure from external organisation.',
    limitations: 'The China aggregate is excluded in favour of China, mainland and Taiwan. Top 40 producers loaded.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
  {
    id: 'src_faostat_grades_2024',
    title: 'FAOSTAT Forestry Production and Trade, paper and board grade breakdown 2024',
    publisher: 'FAO / FAOSTAT',
    url: 'https://bulks-faostat.fao.org/production/Forestry_E_All_Data_(Normalized).zip',
    page: 'Items: Packaging paper and paperboard; Case materials; Cartonboard; Wrapping papers; Printing and writing papers; Household and sanitary papers; Newsprint · Element: Production · Year: 2024 · Area: World',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Packaging paper and paperboard 277.9 Mt, flag A. Case materials 192.4 Mt, cartonboard 55.7 Mt, wrapping papers 19.9 Mt, other packaging papers 9.9 Mt.',
    limitations: 'Figures are mill output in tonnes of finished paper. FAO records no fibre composition.',
    reviewStatus: 'reviewed',
    kind: 'statistical_database',
  },
  {
    id: 'src_vanewijk_2018',
    title: 'Sustainable use of materials in the global paper life cycle (PhD thesis) / Global Life Cycle Paper Flows, Recycling Metrics, and Material Efficiency',
    publisher: 'Stijn van Ewijk, UCL. Also Journal of Industrial Ecology 22(4)',
    url: 'https://discovery.ucl.ac.uk/id/eprint/10052112/',
    page: 'Table 5-2 "Fraction of inputs in five main grades of paper", p. 84; Table 5-1 yield ratios, p. 84; RIR/CR results p. 126',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Table 5-2, packaging input fractions by mass: recycled pulp 0.56, chemical pulp 0.22, mechanical pulp 0.11, non-fibrous 0.10. Table 5-1, recycled pulping yield ratio 0.81.',
    limitations: 'Base year 2012. Grade fractions are derived from CEPI European utilisation data and applied worldwide. Packaging aggregates all packaging grades.',
    reviewerNotes: 'Thesis PDF text-extracted on the access date. The Wiley article is paywalled.',
    reviewStatus: 'reviewed',
    kind: 'other',
  },
  {
    id: 'src_fefco_recycled',
    title: 'Circular by nature, Easy to recycle',
    publisher: 'FEFCO (European Federation of Corrugated Board Manufacturers)',
    url: 'https://www.fefco.org/circular-by-nature/easy-to-recycle',
    page: 'Recycled content / recycling rate figures',
    accessDate: ACCESS,
    accessed: true,
    passage: '88% recycled content of new corrugated packaging, citing the European Database for Corrugated Board Life Cycle Studies 2021. 82.5% paper and board recycling rate in Europe, 2022.',
    limitations: 'Europe only, corrugated only. Based on a survey of FEFCO member mills and box plants.',
    reviewStatus: 'reviewed',
    kind: 'other',
  },
  {
    id: 'src_fba_recycled',
    title: 'The Corrugated Industry',
    publisher: 'Fibre Box Association (USA)',
    url: 'https://www.fibrebox.org/the-corrugated-industry',
    accessDate: ACCESS,
    accessed: true,
    passage: '"The average corrugated box contains 52 percent recycled content."',
    limitations: 'No year, data source or methodology stated on the page. USA only, corrugated only.',
    reviewStatus: 'needs_review',
    kind: 'other',
  },
  {
    id: 'src_pefc_facts',
    title: 'Facts and figures',
    publisher: 'PEFC',
    url: 'https://pefc.org/discover-pefc/facts-and-figures',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Almost 300 million hectares certified to PEFC, 71% of all certified forest globally. Approximately 63 million hectares double-certified with FSC, mid-2024. Certified forests supply about a quarter of global industrial roundwood harvests, figure dated February 2020.',
    limitations: 'Reports certified forest area and roundwood share, not certified fibre tonnes in packaging. The quarter-of-roundwood figure is dated 2020 and was not traced to a primary source.',
    reviewStatus: 'needs_review',
    kind: 'other',
  },
  {
    id: 'src_twosides_certified',
    title: 'Paper Fact 17: The EU pulp and paper industry sources FSC and PEFC certified pulp',
    publisher: 'Two Sides UK',
    url: 'https://twosides.info/UK/paper-fact-17-video/',
    accessDate: ACCESS,
    accessed: true,
    passage: '"74% of wood and 90% of pulp purchased by the European pulp and paper industry is FSC or PEFC certified."',
    limitations: 'Europe only. The page names no originating organisation and no year. Two Sides is an industry communications body. Procurement figures of this kind often count FSC Controlled Wood alongside full certification.',
    reviewStatus: 'needs_review',
    kind: 'other',
  },
  {
    id: 'src_canopy_nextgen_map',
    title: 'Global scale-up of NEXT GEN: results and projections',
    publisher: 'Canopy (nextgennow.canopyplanet.org)',
    url: 'https://nextgennow.canopyplanet.org/map',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Tonnes of NEXT GEN production capacity: 11,900,000. Target: 60,000,000 tonnes over a ten year transition.',
    limitations: 'Capacity across paper, packaging and textiles combined. Not packaging output. No base year stated on the page.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_mondi_sdr_2025',
    title: 'Mondi Group Sustainable Development Report 2025',
    publisher: 'Mondi Group',
    url: 'https://www.mondigroup.com/globalassets/mondigroup.com/sustainability/reports-and-publications/2025/mondi-group-sustainable-development-report-2025.pdf',
    page: 'Printed page 83, "Energy and materials flow 2025". Printed page 69, certified fibre',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Production statistics: containerboard 2.6 million tonnes, kraft paper 1.3 million tonnes, uncoated fine paper 0.9 million tonnes, market pulp 0.7 million tonnes. Purchased inputs: wood 15.1 million m³, external pulp 0.2 million tonnes, paper for recycling 1.5 million tonnes. "In 2025, 100% of our fibre was responsibly sourced, with 82% FSC- or PEFC-certified (2024: 76%). The remaining volume met the FSC Controlled Wood standard."',
    limitations: 'Text extraction places the materials flow page at printed page 83. Input materials are purchased quantities, not the fibre content of output.',
    reviewerNotes: 'Verified by text extraction of the PDF on the access date.',
    reviewStatus: 'reviewed',
    kind: 'company_report',
  },
  {
    id: 'src_mondi_esrs_2025',
    title: 'Mondi Group ESRS & Performance Index 2025',
    publisher: 'Mondi Group',
    url: 'https://www.mondigroup.com/globalassets/mondigroup.com/sustainability/reports-and-publications/2025/mondi-group-esrs-and-performance-index-2025.pdf',
    page: 'Not yet cited',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Document downloaded; no specific claims extracted into the workspace yet.',
    reviewStatus: 'needs_review',
    kind: 'company_report',
  },
  {
    id: 'src_mondi_wood_2025',
    title: 'Mondi, Responsible wood sourcing (SDR 2025 extract)',
    publisher: 'Mondi Group',
    url: 'https://www.mondigroup.com/globalassets/mondigroup.com/sustainability/map2030/mondi_sdr_25_responsible_wood_sourcing.pdf',
    page: 'Map "Main regions where Mondi sources wood fibre" and accompanying text',
    accessDate: ACCESS,
    accessed: true,
    passage: '"By sourcing more than 90% of our wood fibre from the countries where our pulp and paper mills are located". Main sourcing countries shown: Austria, Poland, Slovakia, Czech Republic, South Africa, Finland, Sweden. In South Africa timber is procured from plantation forests.',
    limitations: 'Company-wide statement. Wood origin is not allocated to any product or mill.',
    reviewStatus: 'reviewed',
    kind: 'company_report',
  },
  {
    id: 'src_smartkraft_spec',
    title: 'ProVantage SmartKraft Brown, product page',
    publisher: 'Mondi Containerboard',
    url: 'https://marketing.containerboard.mondigroup.com/provantage-smartkraft-brown',
    page: 'Section "Performance that fits your needs"',
    accessDate: ACCESS,
    accessed: true,
    passage: '"Combining 30% unbleached fresh fibre with 70% recycled fibre, ProVantage SmartKraft Brown delivers a resource-efficient solution…" "Produced in Europe from responsibly sourced fibres."',
    limitations: 'Marketing page. No annual tonnage, mill allocation, customers or fibre origin disclosed. Blend basis not specified.',
    reviewStatus: 'reviewed',
    kind: 'company_product_page',
  },
  {
    id: 'src_sw_2025',
    title: 'Smurfit Westrock Sustainability Report 2025, Supporting data',
    publisher: 'Smurfit Westrock',
    url: 'https://www.smurfitwestrock.com/-/m/files/publications---global/sr-2025-downloads/swsr2025_supporting_data.pdf?rev=b0e968e00e0e4f8ea37027777eaa8c85',
    page: 'Environmental data table, "Production, ktonnes" (paper and board mills)',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Production (ktonnes): North America 11,359; EMEA & APAC 6,399; Latam 1,365; Total paper and board mills 19,123.',
    limitations: 'Mill production of paper and board. No product-level composition loaded.',
    reviewStatus: 'reviewed',
    kind: 'company_report',
  },
  {
    id: 'src_canopy_nextgen_providers',
    title: 'Next Gen Solutions Providers directory',
    publisher: 'Canopy',
    url: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers',
    page: 'Directory landing page',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Categories listed: Commercially Available MMCF (8); Commercially Available MMC Pulp (2); Innovators, MMCF (19); Innovators, Paper and Packaging (9); Early Adopter Ventures, Paper and Packaging (3); Innovators, Feedstock Processing and Other Solutions (5).',
    limitations: 'Provider names load client-side and were not captured. Counts only.',
    reviewStatus: 'reviewed',
    kind: 'canopy_directory',
  },
  {
    id: 'src_canopy_tools',
    title: 'Canopy tools and resources',
    publisher: 'Canopy',
    url: 'https://canopyplanet.org/tools-and-resources',
    accessDate: '',
    accessed: false,
    passage: 'Link recorded from research brief; not opened during this session.',
    reviewStatus: 'needs_review',
    kind: 'canopy_directory',
  },
  {
    id: 'src_canopy_nextgen',
    title: 'Next Generation Solutions',
    publisher: 'Canopy',
    url: 'https://canopyplanet.org/next-generation-solutions',
    accessDate: '',
    accessed: false,
    passage: 'Link recorded from research brief; not opened during this session.',
    reviewStatus: 'needs_review',
    kind: 'canopy_directory',
  },
  {
    id: 'src_ecopaper_supplied',
    title: 'EcoPaper Database listings (as supplied in research brief)',
    publisher: 'Canopy EcoPaper Database',
    url: 'https://canopyplanet.org/tools-and-resources',
    accessDate: '',
    accessed: false,
    passage: 'Listing details for Charming Trim, Rudholm Group and Punarbhavaa/CEAE were supplied in the brief. The database entries were not independently opened.',
    limitations: 'Treat as listing-supplied, not verified.',
    reviewStatus: 'needs_review',
    kind: 'user_supplied',
  },
  {
    id: 'src_brief',
    title: 'Research brief (internal)',
    publisher: 'Canopy Data & Research',
    url: '',
    accessDate: ACCESS,
    accessed: true,
    passage: 'Figures and framing provided in the internal brief; used only where flagged.',
    reviewStatus: 'reviewed',
    kind: 'other',
  },
]

/* -------------------------------------------------------------------------- */
/* Quantities                                                                  */
/* -------------------------------------------------------------------------- */
const q = (x: Quantity): Quantity => x
export const SEED_QUANTITIES: Quantity[] = [
  q({ id: 'q_global_paper_2024', subjectType: 'global', subjectId: 'world', metric: 'Paper and paperboard production', value: 423, unit: 'Mt', period: '2024', scope: 'World, all paper and board grades', basis: 'output', status: 'reported', sourceIds: ['src_fao_2024', 'src_faostat_bulk_2024'], note: 'FAOSTAT bulk world value 423,018,755 t, flag A.' }),
  q({ id: 'q_global_woodpulp_2024', subjectType: 'global', subjectId: 'world', metric: 'Wood pulp production', value: 189, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'reported', sourceIds: ['src_fao_2024'], note: 'Raw-material stage. Not comparable to finished paper output.' }),
  q({ id: 'q_global_nonwoodpulp_2024', subjectType: 'global', subjectId: 'world', metric: 'Pulp from fibres other than wood', value: 10, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'reported', sourceIds: ['src_fao_2024'], note: 'Includes conventional non-wood pulps such as straw and bagasse. Not classified as Next Gen.' }),
  q({ id: 'q_global_recovered_2024', subjectType: 'global', subjectId: 'world', metric: 'Recovered paper', value: 241, unit: 'Mt', period: '2024', scope: 'World', basis: 'other', status: 'reported', sourceIds: ['src_fao_2024'], note: 'Collected recovered paper. Recycling losses mean this is not the recycled fibre content of output.' }),
  q({ id: 'q_global_nextgen_share', subjectType: 'global', subjectId: 'world', metric: 'Qualifying Next Gen share of global paper & board', value: null, unit: '%', period: '2024', scope: 'World', basis: 'output', denominator: 'Global paper & board production', status: 'unknown', sourceIds: [], note: 'No verified global figure was found.' }),
  q({ id: 'q_global_packaging_2024', subjectType: 'global', subjectId: 'world', metric: 'Packaging paper & paperboard production', value: 277.9, unit: 'Mt', period: '2024', scope: 'World, packaging grades only', basis: 'output', status: 'reported', sourceIds: ['src_faostat_grades_2024'], note: 'Case materials 192.4 Mt, cartonboard 55.7 Mt, wrapping 19.9 Mt, other packaging papers 9.9 Mt. Pack4Good scope.' }),
  q({ id: 'q_global_pkg_recycled_t', subjectType: 'global', subjectId: 'world', metric: 'Recycled fibre in packaging paper & board', value: 156, unit: 'Mt', period: '2024 output × 2012 model fractions', scope: 'World packaging paper & board', basis: 'input', denominator: 'Packaging paper & board production 277.9 Mt', status: 'estimated', sourceIds: ['src_vanewijk_2018', 'src_faostat_grades_2024', 'src_fefco_recycled', 'src_fba_recycled'], formula: '277.9 Mt × 0.56 (recycled pulp fraction of packaging inputs, by mass)', inputs: [{ label: 'Packaging output 2024 (FAO)', value: '277.9 Mt' }, { label: 'Recycled pulp fraction (van Ewijk Table 5-2)', value: '0.56' }], note: 'Approximately ±10 percentage points. Regional measurements: Europe corrugated 88% (FEFCO), USA corrugated 52% (Fibre Box Association). No sourced figure was found for China, which is 31% of world packaging output.' }),
  q({ id: 'q_global_pkg_virgin_t', subjectType: 'global', subjectId: 'world', metric: 'Virgin wood fibre in packaging paper & board', value: 92, unit: 'Mt', period: '2024 output × 2012 model fractions', scope: 'World packaging paper & board', basis: 'input', denominator: 'Packaging paper & board production 277.9 Mt', status: 'estimated', sourceIds: ['src_vanewijk_2018', 'src_faostat_grades_2024'], formula: '277.9 Mt × (0.22 chemical pulp + 0.11 mechanical pulp)', inputs: [{ label: 'Chemical pulp fraction', value: '0.22' }, { label: 'Mechanical pulp fraction', value: '0.11' }], note: 'Certified share of this slice is not published at global level.' }),
  q({ id: 'q_global_pkg_nonfibre_t', subjectType: 'global', subjectId: 'world', metric: 'Non-fibre content of packaging paper & board (starch, fillers, coatings)', value: 28, unit: 'Mt', period: '2024 output × 2012 model fractions', scope: 'World packaging paper & board', basis: 'input', denominator: 'Packaging paper & board production 277.9 Mt', status: 'estimated', sourceIds: ['src_vanewijk_2018'], formula: '277.9 Mt × 0.10 (non-fibrous fraction)', note: 'Approximately a tenth of a packaging tonne is not fibre.' }),
  q({ id: 'q_global_pkg_certified_t', subjectType: 'global', subjectId: 'world', metric: 'FSC/PEFC-certified share of virgin fibre in packaging', value: 33, unit: '% of virgin', period: '2024', scope: 'World packaging paper and board, virgin fibre only', basis: 'input', denominator: 'Virgin wood fibre in packaging (~92 Mt)', status: 'estimated', sourceIds: ['src_pefc_facts', 'src_twosides_certified', 'src_mondi_sdr_2025'], formula: 'Midpoint of a 25–40% range → 33% of ~92 Mt ≈ 30 Mt certified, ≈ 62 Mt uncertified', inputs: [{ label: 'Virgin fibre in packaging', value: '~92 Mt' }, { label: 'Global: certified forests supply ~¼ of industrial roundwood (PEFC, 2020)', value: '25%' }, { label: 'Europe: 74% of wood / 90% of pulp purchased certified (Two Sides)', value: 'upper anchor' }, { label: 'Company example: Mondi wood fibre FSC/PEFC', value: '82%' }], note: 'Midpoint of a 25 to 40% range. PEFC reports that certified forests supply about a quarter of global industrial roundwood (2020). Two Sides reports 74% of wood and 90% of pulp purchased by the European industry as certified. Mondi reports 82% of its own wood fibre. No organisation publishes certified fibre tonnes in packaging. Certification applies to virgin fibre and often includes FSC Controlled Wood.' }),
  q({ id: 'q_global_pkg_nextgen_t', subjectType: 'global', subjectId: 'world', metric: 'Qualifying Next Gen fibre in packaging paper & board', value: null, unit: 'Mt', period: '2024', scope: 'World packaging paper & board', basis: 'input', denominator: 'Packaging paper & board production 277.9 Mt', status: 'unknown', sourceIds: ['src_canopy_nextgen_map', 'src_fao_2024'], note: 'Not separately measured in official statistics. FAO records 10.5 Mt of pulp from fibres other than wood, which is conventional straw and bagasse pulp (China 49%, India 29%). Canopy reports 11.9 Mt of Next Gen production capacity across paper, packaging and textiles.' }),
  q({ id: 'q_global_nextgen_capacity', subjectType: 'global', subjectId: 'world', metric: 'Next Gen production capacity (all applications)', value: 11.9, unit: 'Mt', period: 'not stated', scope: 'World, paper, packaging and textiles combined', basis: 'capacity', status: 'reported', sourceIds: ['src_canopy_nextgen_map'], note: 'Capacity, not output. Covers paper, packaging and textiles. Canopy target 60 Mt over ten years.' }),
  q({ id: 'q_global_fibre_check', subjectType: 'global', subjectId: 'world', metric: 'Recycled share of all paper fibre, cross-check', value: 49, unit: '%', period: '2024', scope: 'World, all paper & board grades', basis: 'input', denominator: 'Total paper fibre input (recycled pulp + virgin pulp available to paper)', status: 'calculated', sourceIds: ['src_fao_2024', 'src_vanewijk_2018'], formula: '(241 × 0.81) / ((241 × 0.81) + (189 + 10.5 − 9.5)) × 100', inputs: [{ label: 'Recovered paper collected (FAO)', value: '241 Mt' }, { label: 'Recycled pulping yield (van Ewijk)', value: '0.81' }, { label: 'Wood pulp (FAO)', value: '189 Mt' }, { label: 'Non-wood pulp (FAO)', value: '10.5 Mt' }, { label: 'Less dissolving pulp (to textiles, not paper)', value: '9.5 Mt' }], note: 'Built from the FAO 2024 mass balance, independent of the van Ewijk grade fractions.' }),
  q({ id: 'q_global_printing_2024', subjectType: 'global', subjectId: 'world', metric: 'Printing & writing papers production', value: 74.5, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'reported', sourceIds: ['src_faostat_grades_2024'], note: 'FAO flag E, estimated.' }),
  q({ id: 'q_global_tissue_2024', subjectType: 'global', subjectId: 'world', metric: 'Household & sanitary papers production', value: 40.2, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'reported', sourceIds: ['src_faostat_grades_2024'], note: 'Tissue grades.' }),
  q({ id: 'q_global_newsprint_2024', subjectType: 'global', subjectId: 'world', metric: 'Newsprint production', value: 10.6, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'reported', sourceIds: ['src_faostat_grades_2024'], note: 'FAO flag E, estimated.' }),
  q({ id: 'q_global_other_2024', subjectType: 'global', subjectId: 'world', metric: 'Other paper & paperboard (specialty, n.e.s.)', value: 19.8, unit: 'Mt', period: '2024', scope: 'World', basis: 'output', status: 'calculated', sourceIds: ['src_faostat_grades_2024'], formula: '337.9 (other paper & paperboard) − 277.9 (packaging) − 40.2 (household & sanitary)', note: 'Remainder derived from FAO buckets. Not a published FAO item.' }),

  q({ id: 'q_mondi_containerboard_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Containerboard production', value: 2.6, unit: 'Mt', period: '2025', scope: 'Mondi Group, all pulp and paper mills', basis: 'output', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),
  q({ id: 'q_mondi_kraft_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Kraft paper production', value: 1.3, unit: 'Mt', period: '2025', scope: 'Mondi Group, all pulp and paper mills', basis: 'output', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),
  q({ id: 'q_mondi_ufp_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Uncoated fine paper production', value: 0.9, unit: 'Mt', period: '2025', scope: 'Mondi Group, all pulp and paper mills', basis: 'output', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),
  q({ id: 'q_mondi_marketpulp_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Market pulp production', value: 0.7, unit: 'Mt', period: '2025', scope: 'Mondi Group', basis: 'output', status: 'reported', sourceIds: ['src_mondi_sdr_2025'], note: 'Pulp, not paper and board. Excluded from the paper and board total.' }),
  q({ id: 'q_mondi_total_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Paper & board output (containerboard + kraft paper + uncoated fine paper)', value: 4.8, unit: 'Mt', period: '2025', scope: 'Mondi Group', basis: 'output', status: 'calculated', sourceIds: ['src_mondi_sdr_2025'], formula: '2.6 + 1.3 + 0.9', inputs: [{ label: 'Containerboard', value: '2.6 Mt' }, { label: 'Kraft paper', value: '1.3 Mt' }, { label: 'Uncoated fine paper', value: '0.9 Mt' }], note: 'Sum of the reported category figures, each rounded to 0.1 Mt.' }),
  q({ id: 'q_mondi_global_share', subjectType: 'company', subjectId: 'mondi', metric: '2025 company output compared with 2024 global packaging output', value: 1.4, unit: '%', period: '2025 vs 2024', scope: 'Mondi containerboard + kraft paper vs FAO world packaging paper & board', basis: 'output', denominator: 'FAO 2024 world packaging paper & paperboard (277.9 Mt)', status: 'calculated', sourceIds: ['src_mondi_sdr_2025', 'src_faostat_grades_2024'], formula: '(2.6 + 1.3) / 277.9 × 100', inputs: [{ label: 'Mondi containerboard 2025', value: '2.6 Mt' }, { label: 'Mondi kraft paper 2025', value: '1.3 Mt' }, { label: 'FAO world packaging 2024', value: '277.9 Mt' }], note: 'Packaging grades only. Uncoated fine paper (0.9 Mt) is excluded. Company year 2025 against FAO year 2024. Not a share of global fibre consumption.' }),
  q({ id: 'q_mondi_certified_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Wood fibre FSC- or PEFC-certified', value: 82, unit: '%', period: '2025', scope: 'Mondi Group wood fibre procured', basis: 'purchases', denominator: 'All wood fibre procured by Mondi in 2025', status: 'reported', sourceIds: ['src_mondi_sdr_2025'], note: 'Remainder met the FSC Controlled Wood standard.' }),
  q({ id: 'q_mondi_wood_input_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Wood input (purchased)', value: 15.1, unit: 'million m³', period: '2025', scope: 'Mondi Group', basis: 'purchases', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),
  q({ id: 'q_mondi_pfr_input_2025', subjectType: 'company', subjectId: 'mondi', metric: 'Paper for recycling input (purchased)', value: 1.5, unit: 'Mt', period: '2025', scope: 'Mondi Group', basis: 'purchases', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),
  q({ id: 'q_mondi_extpulp_input_2025', subjectType: 'company', subjectId: 'mondi', metric: 'External pulp input (purchased)', value: 0.2, unit: 'Mt', period: '2025', scope: 'Mondi Group', basis: 'purchases', status: 'reported', sourceIds: ['src_mondi_sdr_2025'] }),

  q({ id: 'q_sw_production_2025', subjectType: 'company', subjectId: 'smurfit_westrock', metric: 'Paper and board mill production', value: 19.123, unit: 'Mt', period: '2025', scope: 'Smurfit Westrock, all paper and board mills', basis: 'output', status: 'reported', sourceIds: ['src_sw_2025'], note: 'Reported as 19,123 ktonnes.' }),
  q({ id: 'q_sw_global_share', subjectType: 'company', subjectId: 'smurfit_westrock', metric: '2025 company output compared with 2024 global packaging output', value: 6.88, unit: '%', period: '2025 vs 2024', scope: 'Smurfit Westrock paper & board mills vs FAO world packaging paper & board', basis: 'output', denominator: 'FAO 2024 world packaging paper & paperboard (277.9 Mt)', status: 'calculated', sourceIds: ['src_sw_2025', 'src_faostat_grades_2024'], formula: '19.123 / 277.9 × 100', inputs: [{ label: 'SW paper & board mill production 2025', value: '19.123 Mt' }, { label: 'FAO world packaging 2024', value: '277.9 Mt' }], note: 'Mill production is reported as a single paper and board figure, so a non-packaging share may be included. Company year 2025 against FAO year 2024.' }),

  q({ id: 'q_smartkraft_volume', subjectType: 'product', subjectId: 'smartkraft_brown', metric: 'Annual product volume', value: null, unit: 'tonnes', period: 'not specified', scope: 'ProVantage SmartKraft Brown', basis: 'output', status: 'unknown', sourceIds: ['src_smartkraft_spec'], note: 'Not disclosed on the product page or in the sustainability report.' }),
]

/* -------------------------------------------------------------------------- */
/* Companies                                                                   */
/* -------------------------------------------------------------------------- */
export const SEED_COMPANIES: Company[] = [
  {
    id: 'mondi',
    name: 'Mondi',
    type: 'producer',
    stream: 'packaging',
    sector: 'Producer · Paper & packaging',
    hq: 'Weybridge, UK / Vienna, Austria',
    logoText: 'mondi',
    logoColour: '#ff6a13',
    description: 'Integrated pulp, paper and packaging producer with mills in Europe, North America and South Africa.',
    sourceIds: ['src_mondi_sdr_2025', 'src_mondi_esrs_2025', 'src_mondi_wood_2025'],
    mapping: { supplierIdentified: 'confirmed', millIdentified: 'unresolved', originTraced: 'unresolved', note: 'Producer identified (Mondi). Mill allocation for the selected product to verify. Fibre origin known only at company level.' },
    categories: [
      { name: 'Containerboard', quantityId: 'q_mondi_containerboard_2025' },
      { name: 'Kraft paper', quantityId: 'q_mondi_kraft_2025' },
      { name: 'Uncoated fine paper', quantityId: 'q_mondi_ufp_2025' },
      { name: 'Market pulp (not paper & board)', quantityId: 'q_mondi_marketpulp_2025' },
    ],
    totalOutputQuantityId: 'q_mondi_total_2025',
    globalComparisonQuantityId: 'q_mondi_global_share',
    sourcingStatements: [
      { text: '100% of fibre responsibly sourced; 82% FSC- or PEFC-certified (2024: 76%); remainder FSC Controlled Wood.', sourceIds: ['src_mondi_sdr_2025'], scope: 'Company-wide, 2025' },
      { text: 'More than 90% of wood fibre sourced from the countries where Mondi pulp and paper mills are located.', sourceIds: ['src_mondi_wood_2025'], scope: 'Company-wide' },
    ],
    notes: 'Company-wide sourcing statements must not be applied to individual products.',
  },
  {
    id: 'smurfit_westrock',
    name: 'Smurfit Westrock',
    type: 'producer',
    stream: 'packaging',
    sector: 'Producer · Paper-based packaging',
    hq: 'Dublin, Ireland',
    logoText: 'SW',
    logoColour: '#0075c9',
    sourceIds: ['src_sw_2025'],
    mapping: { supplierIdentified: 'confirmed', millIdentified: 'unresolved', originTraced: 'unresolved', note: 'Only group production loaded. No product, mill or origin records.' },
    totalOutputQuantityId: 'q_sw_production_2025',
    globalComparisonQuantityId: 'q_sw_global_share',
  },
]

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'smartkraft_brown',
    companyId: 'mondi',
    name: 'ProVantage SmartKraft Brown',
    application: 'Containerboard',
    category: 'Containerboard',
    composition: { virginWoodPct: 30, recycledPct: 70, nextGenPct: 0, otherNonWoodPct: 0, unknownPct: null, status: 'reported', sourceIds: ['src_smartkraft_spec'], basis: 'Disclosed product blend: 30% unbleached fresh fibre / 70% recycled fibre (fresh-fibre top ply, recycled base). Mass vs fibre basis not specified.', note: 'Next Gen and other non-wood recorded as 0% because the disclosed blend accounts for 100% of fibre. Certification is not part of the composition.' },
    volumeQuantityId: 'q_smartkraft_volume',
    sourceIds: ['src_smartkraft_spec'],
    productionRegion: { text: 'Produced in Europe (product page). Specific mill not disclosed.', sourceIds: ['src_smartkraft_spec'] },
    notes: 'Annual tonnage, mill allocation, customer relationships and forest origin remain unknown unless separately verified.',
  },
]

/* -------------------------------------------------------------------------- */
/* Facilities & origins                                                        */
/* -------------------------------------------------------------------------- */
export const SEED_FACILITIES: Facility[] = [
  { id: 'fac_steti', name: 'Štětí mill', type: 'paper_mill', companyId: 'mondi', country: 'Czech Republic', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi mill in the SDR 2025. Product allocation unknown.' },
  { id: 'fac_ruzomberok', name: 'Ružomberok mill', type: 'paper_mill', companyId: 'mondi', country: 'Slovakia', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi mill in the SDR 2025. Product allocation unknown.' },
  { id: 'fac_swiecie', name: 'Świecie mill', type: 'paper_mill', companyId: 'mondi', country: 'Poland', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi site in the SDR 2025. Product allocation unknown.' },
  { id: 'fac_frantschach', name: 'Frantschach mill', type: 'paper_mill', companyId: 'mondi', country: 'Austria', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi mill in the SDR 2025. Product allocation unknown.' },
  { id: 'fac_dynas', name: 'Dynäs mill', type: 'paper_mill', companyId: 'mondi', country: 'Sweden', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi mill in the SDR 2025. Product allocation unknown.' },
  { id: 'fac_richards_bay', name: 'Richards Bay mill', type: 'pulp_mill', companyId: 'mondi', country: 'South Africa', sourceIds: ['src_mondi_sdr_2025'], status: 'reported', note: 'Named as a Mondi mill in the SDR 2025.' },
]

const originOf = (id: string, name: string, m49: string, note?: string): Origin => ({ id, name, m49, feedstockType: 'virgin_wood', sourceIds: ['src_mondi_wood_2025'], status: 'reported', note: note ?? 'Company-wide main wood-fibre sourcing country (Mondi statement). Not product-specific.' })
export const SEED_ORIGINS: Origin[] = [
  originOf('org_austria', 'Austria', '040'),
  originOf('org_poland', 'Poland', '616'),
  originOf('org_slovakia', 'Slovakia', '703'),
  originOf('org_czechia', 'Czech Republic', '203'),
  originOf('org_south_africa', 'South Africa', '710', 'Company-wide sourcing country; timber procured from plantation forests (Mondi statement). Not product-specific.'),
  originOf('org_finland', 'Finland', '246'),
  originOf('org_sweden', 'Sweden', '752'),
]

/* -------------------------------------------------------------------------- */
/* Relationships. Confirmed and unresolved links are kept separate.            */
/* -------------------------------------------------------------------------- */
export const SEED_RELATIONSHIPS: Relationship[] = [
  ...SEED_FACILITIES.map<Relationship>((f) => ({ id: `rel_owns_${f.id}`, kind: 'owns', fromType: 'company', fromId: 'mondi', toType: 'facility', toId: f.id, status: 'confirmed', sourceIds: ['src_mondi_sdr_2025'] })),
  ...SEED_ORIGINS.map<Relationship>((o) => ({ id: `rel_src_${o.id}`, kind: 'sourced_from', fromType: 'company', fromId: 'mondi', toType: 'origin', toId: o.id, status: 'confirmed', sourceIds: ['src_mondi_wood_2025'], note: 'Company-wide sourcing region.' })),
  { id: 'rel_smartkraft_mill', kind: 'produced_at', fromType: 'product', fromId: 'smartkraft_brown', toType: 'facility', toId: '', status: 'unresolved', sourceIds: ['src_smartkraft_spec'], note: 'Product page states "Produced in Europe". Mill not identified.' },
  { id: 'rel_smartkraft_origin', kind: 'sourced_from', fromType: 'product', fromId: 'smartkraft_brown', toType: 'origin', toId: '', status: 'unresolved', sourceIds: [], note: 'Fibre origin unknown at product level.' },
]

/* -------------------------------------------------------------------------- */
/* Solutions catalogue                                                         */
/* -------------------------------------------------------------------------- */
export const SEED_SOLUTIONS: Solution[] = [
  { id: 'sol_cat_recycled', name: 'Recycled paper & board', category: 'recycled_paper', feedstock: 'Recovered paper', applications: ['Packaging', 'Paper'], geography: 'global', availability: 'commercial', directory: 'EcoPaper', status: 'illustrative', sourceIds: ['src_canopy_tools'], note: 'Illustrative resource category. See the EcoPaper Database for specific listings.' },
  { id: 'sol_cat_agri', name: 'Agricultural-residue materials', category: 'agricultural_residue', feedstock: 'Straw, bagasse and other by-products', applications: ['Packaging', 'Paper', 'Pulp'], geography: 'unknown', availability: 'unknown', directory: 'Next Gen providers', status: 'illustrative', sourceIds: ['src_canopy_nextgen_providers'], note: 'Illustrative resource category. Availability and capacity vary by provider.' },
  { id: 'sol_cat_textile', name: 'Textile-to-textile cellulose', category: 'textile_cellulose', feedstock: 'Textile waste', applications: ['MMCF'], geography: 'unknown', availability: 'unknown', directory: 'Next Gen providers', status: 'illustrative', sourceIds: ['src_canopy_nextgen_providers'], note: 'Illustrative resource category. Applies to MMCF, not paper and packaging.' },
  { id: 'sol_charming_trim', name: 'Custom Packaging with Sugarcane Bagasse', provider: 'Charming Trim', category: 'agricultural_residue', feedstock: '100% sugarcane bagasse (0% wood fibre)', applications: ['Corrugated solutions', 'Point of sale', 'Boxes', 'Bags'], geography: ['Bangladesh', 'China', 'USA', 'Vietnam'], availability: 'unknown', capacity: null, directory: 'EcoPaper', status: 'listing_supplied', sourceIds: ['src_ecopaper_supplied'], note: 'Listing details supplied in the research brief. Capacity and MOQ not provided.' },
  { id: 'sol_rudholm', name: 'Custom Recycled Paper Packaging', provider: 'Rudholm Group', category: 'recycled_paper', feedstock: '100% recycled content available to order (0% wood fibre available to order)', applications: ['Insert cards', 'Hang tags', 'Boxes', 'Custom packaging'], geography: 'global', availability: 'unknown', capacity: null, directory: 'EcoPaper', status: 'listing_supplied', sourceIds: ['src_ecopaper_supplied'] },
  { id: 'sol_punarbhavaa', name: '100% Recycled Cotton Paper Packaging & Stationery', provider: 'Punarbhavaa / CEAE', category: 'textile_cellulose', feedstock: 'Recycled cotton rags / textile-related fibre', applications: ['Labels', 'Hang tags', 'Boxes', 'Bags', 'Card stock', 'Stationery'], geography: ['India'], availability: 'unknown', capacity: '1,200 t/yr paper (listing)', directory: 'EcoPaper', status: 'listing_supplied', sourceIds: ['src_ecopaper_supplied'] },
  { id: 'sol_dir_mmcf_commercial', name: 'Commercially Available MMCF (8 providers)', category: 'nextgen_pulp', feedstock: 'Recycled / Next Gen MMCF', applications: ['MMCF'], geography: 'unknown', availability: 'commercial', directory: 'Next Gen providers', status: 'verified', sourceIds: ['src_canopy_nextgen_providers'], link: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers', note: 'Directory category count verified. Provider names not captured.' },
  { id: 'sol_dir_pp_innovators', name: 'Innovators, Paper and Packaging (9 providers)', category: 'nextgen_pulp', feedstock: 'Various Next Gen feedstocks', applications: ['Paper', 'Packaging'], geography: 'unknown', availability: 'development', directory: 'Next Gen providers', status: 'verified', sourceIds: ['src_canopy_nextgen_providers'], link: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers', note: 'Profiles indicate "Product in EcoPaper Database" where a product is commercially available.' },
  { id: 'sol_dir_pp_early', name: 'Early Adopter Ventures, Paper and Packaging (3)', category: 'nextgen_pulp', feedstock: 'Next Gen feedstock', applications: ['Paper', 'Packaging'], geography: 'unknown', availability: 'unknown', directory: 'Next Gen providers', status: 'verified', sourceIds: ['src_canopy_nextgen_providers'], link: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers' },
  { id: 'sol_dir_feedstock', name: 'Innovators, Feedstock Processing and Other Solutions (5)', category: 'other', feedstock: 'Feedstock aggregation / preparation', applications: ['Feedstock processing'], geography: 'unknown', availability: 'unknown', directory: 'Next Gen providers', status: 'verified', sourceIds: ['src_canopy_nextgen_providers'], link: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers' },
  { id: 'sol_forestmapper', name: 'ForestMapper', category: 'tool', feedstock: 'Not applicable', applications: ['Forest-risk screening'], geography: 'global', availability: 'commercial', directory: 'ForestMapper', status: 'verified', sourceIds: ['src_canopy_nextgen_providers'], link: 'https://canopyplanet.org/tools-and-resources', note: 'Canopy mapping tool for ancient and endangered forests.' },
]

/* -------------------------------------------------------------------------- */
/* Scenarios                                                                   */
/* -------------------------------------------------------------------------- */
export const SEED_SCENARIOS: Scenario[] = [
  {
    id: 'scn_smartkraft_demo',
    companyId: 'mondi',
    productId: 'smartkraft_brown',
    name: 'Illustrative: 20% Next Gen substitution',
    current: { virginWoodPct: 30, recycledPct: 70, nextGenPct: 0, otherNonWoodPct: 0, unknownPct: null, status: 'reported', sourceIds: ['src_smartkraft_spec'] },
    hypothetical: { virginWoodPct: 10, recycledPct: 70, nextGenPct: 20, otherNonWoodPct: 0, unknownPct: null, status: 'illustrative', sourceIds: [] },
    assumptions: { productVolumeT: null, fibreShareOfMass: null, note: 'Hypothetical. No product volume or fibre-mass share known.' },
    createdAt: '2026-09-21T00:00:00Z',
    updatedAt: '2026-09-21T00:00:00Z',
  },
]

export const SEED_STORE: Store = {
  version: 12,
  sources: [...SEED_SOURCES, ...METSA_SOURCES, ...FASHION_SOURCES, ...FIBRE_SOURCES],
  quantities: [...SEED_QUANTITIES, ...METSA_QUANTITIES, ...FASHION_QUANTITIES, ...SATERI_QUANTITIES, ...FIBRE_QUANTITIES],
  companies: [METSA_COMPANY, LENZING_COMPANY, SATERI_COMPANY, ...SEED_COMPANIES],
  products: [...METSA_PRODUCTS, ...SEED_PRODUCTS],
  facilities: [...SEED_FACILITIES, ...METSA_FACILITIES, ...FASHION_FACILITIES],
  origins: [...SEED_ORIGINS, ...METSA_ORIGINS],
  relationships: [...SEED_RELATIONSHIPS, ...METSA_RELATIONSHIPS, ...FASHION_RELATIONSHIPS],
  solutions: SEED_SOLUTIONS,
  scenarios: SEED_SCENARIOS,
  shortlist: [],
}
