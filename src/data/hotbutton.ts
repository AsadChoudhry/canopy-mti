/**
 * Canopy Hot Button Report 2025, producer matrix.
 * This is Canopy's own scope for MMCF: what it scores is what it considers important.
 */

export type RiskStatus = 'NK' | 'LR' | 'KR' | 'RP' | 'AR' | 'IP' | 'NA'
export type Shirt = 'dark_green' | 'light_green' | 'light_green_red' | 'yellow' | 'red' | 'white'

export interface HotButtonCriterion {
  key: 'audits' | 'conservation' | 'nextgen' | 'policy' | 'traceability' | 'shifts' | 'highRisk'
  label: string
  max: number
  min?: number
  what: string
}

/** The six scored criteria plus the deduction. Maxima from the producer profile pages. */
export const HB_CRITERIA: HotButtonCriterion[] = [
  { key: 'audits', label: 'Completion of CanopyStyle audits', max: 8, what: 'Independent verification that the producer is not sourcing from Ancient and Endangered Forests.' },
  { key: 'conservation', label: 'Contribution to conservation legacies', max: 8, what: 'Support for protection of the forests the sector depends on.' },
  { key: 'nextgen', label: 'Innovation via Next Generation fibres', max: 10, what: 'Commercial use of alternative feedstocks such as recycled textiles and agricultural residues.' },
  { key: 'policy', label: 'Robust forest sourcing policy', max: 4, what: 'A published policy meeting CanopyStyle requirements.' },
  { key: 'traceability', label: 'Traceability and transparency', max: 5, what: 'Ability to trace fibre back to forest of origin, and public disclosure of it.' },
  { key: 'shifts', label: 'Leadership in supply chain shifts', max: 5, what: 'Moving volume, suppliers and contracts toward lower risk sources.' },
  { key: 'highRisk', label: 'High risk sourcing', max: 0, min: -5, what: 'Deduction where sourcing from Ancient and Endangered Forests is documented.' },
]

export const RISK_META: Record<RiskStatus, { label: string; short: string; tone: 'ok' | 'watch' | 'bad' | 'none' }> = {
  NK: { label: 'No known high risk', short: 'No known risk', tone: 'ok' },
  LR: { label: 'Low risk', short: 'Low risk', tone: 'ok' },
  KR: { label: 'Known risk', short: 'Known risk', tone: 'bad' },
  RP: { label: 'Address risk prior to audit', short: 'Risk to address', tone: 'bad' },
  AR: { label: 'Audit required', short: 'Audit required', tone: 'watch' },
  IP: { label: 'Audit in progress', short: 'Audit in progress', tone: 'watch' },
  NA: { label: 'Not yet assessed', short: 'Not assessed', tone: 'none' },
}

export const SHIRT_META: Record<Shirt, { label: string; colour: string; range: string }> = {
  dark_green: { label: 'Dark green', colour: '#00614f', range: '30 to 40' },
  light_green: { label: 'Light green', colour: '#009a7e', range: '20 to 29' },
  light_green_red: { label: 'Light green with red', colour: '#7aa32a', range: '20 to 24, known risk' },
  yellow: { label: 'Yellow', colour: '#f2b53a', range: '10 to 19' },
  red: { label: 'Red', colour: '#d14343', range: '0 to 9' },
  white: { label: 'Not assessed', colour: '#c7c7c7', range: 'newly engaged' },
}

export interface HotButtonRow {
  id: string
  producer: string
  capacityPct: number
  types: string[]
  risk: RiskStatus
  scores: Partial<Record<HotButtonCriterion['key'], number>>
  total: number | null
}

function shirtFor(total: number | null, risk: RiskStatus): Shirt {
  if (total === null) return 'white'
  if (total >= 30) return 'dark_green'
  if (total >= 20) return risk === 'KR' || risk === 'RP' ? 'light_green_red' : 'light_green'
  if (total >= 10) return 'yellow'
  return 'red'
}
export const hbShirt = shirtFor

const r = (id: string, producer: string, capacityPct: number, types: string[], risk: RiskStatus, s: HotButtonRow['scores']): HotButtonRow => {
  const keys: HotButtonCriterion['key'][] = ['audits', 'conservation', 'nextgen', 'policy', 'traceability', 'shifts', 'highRisk']
  const vals = keys.map((k) => s[k]).filter((v): v is number => typeof v === 'number')
  return { id, producer, capacityPct, types, risk, scores: s, total: vals.length ? +vals.reduce((a, b) => a + b, 0).toFixed(1) : null }
}

/** 2025 matrix, transcribed from the published PDF. Blank cells mean no points awarded in that category. */
export const HOT_BUTTON_2025: HotButtonRow[] = [
  r('lenzing', 'Lenzing', 12.93, ['LYO', 'VSF'], 'NK', { audits: 5.5, conservation: 7.0, nextgen: 8.5, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('tangshan_sanyou', 'Tangshan Sanyou', 9.14, ['VSF', 'LYO'], 'NK', { audits: 5.5, conservation: 5.5, nextgen: 10.0, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('aditya_birla', 'Aditya Birla (Grasim / Birla Cellulose)', 15.76, ['VSF', 'LYO', 'VFY'], 'LR', { audits: 6.0, conservation: 6.0, nextgen: 8.5, policy: 4.0, traceability: 5.0, shifts: 5.0 }),
  r('jilin', 'Jilin Chemical Fiber Stock Co., Ltd.', 2.37, ['VFY', 'VSF'], 'LR', { audits: 6.0, conservation: 5.5, nextgen: 8.0, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('xinxiang', 'Xinxiang Chemical Fiber (Bailu Group)', 1.45, ['VFY'], 'LR', { audits: 6.0, conservation: 4.5, nextgen: 9.0, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('yibin_grace', 'Yibin Grace Group Co. Ltd.', 4.46, ['VSF', 'VFY', 'LYO'], 'NK', { audits: 5.5, conservation: 5.5, nextgen: 9.0, policy: 4.0, traceability: 4.5, shifts: 4.5 }),
  r('acegreen', 'Acegreen', 0.02, ['LYO'], 'LR', { audits: 6.0, conservation: 4.5, nextgen: 7.0, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('daiwabo', 'Daiwabo Rayon Co. Ltd.', 0.34, ['VSF'], 'LR', { audits: 6.0, conservation: 5.0, nextgen: 6.5, policy: 4.0, traceability: 4.0, shifts: 5.0 }),
  r('eastman', 'Eastman Chemical Company', 2.26, ['ACE'], 'NK', { audits: 5.5, conservation: 6.0, nextgen: 6.5, policy: 4.0, traceability: 4.5, shifts: 3.5 }),
  r('cta', 'China Textile Academy', 1.13, ['LYO'], 'NK', { audits: 6.0, conservation: 3.5, nextgen: 7.0, policy: 4.0, traceability: 4.5, shifts: 4.5 }),
  r('karafiber', 'Karafiber', 0.56, ['LYO'], 'LR', { audits: 6.0, conservation: 6.0, nextgen: 4.0, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('miroglio', 'E. Miroglio', 0.02, ['VFY'], 'LR', { audits: 5.0, conservation: 4.5, nextgen: 5.5, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('century_rayon', 'Century Rayon', 0.33, ['VFY'], 'LR', { audits: 5.5, conservation: 4.5, nextgen: 5.5, policy: 4.0, traceability: 4.5, shifts: 4.0 }),
  r('enka', 'ENKA', 0.09, ['VFY'], 'LR', { audits: 6.0, conservation: 5.5, nextgen: 2.5, policy: 4.0, traceability: 4.5, shifts: 5.0 }),
  r('kelheim', 'Kelheim Fibres', 0.9, ['VSF'], 'LR', { audits: 6.0, conservation: 4.0, nextgen: 3.5, policy: 4.0, traceability: 5.0, shifts: 5.0 }),
  r('hongtaiding', 'Shandong Hongtaiding', 0.56, ['LYO'], 'NK', { audits: 6.0, conservation: 4.5, nextgen: 3.0, policy: 4.0, traceability: 4.0, shifts: 5.0 }),
  r('huafeng', 'Zhejiang Huafeng', 0.02, ['LYO'], 'LR', { audits: 6.0, conservation: 4.5, nextgen: 3.0, policy: 4.0, traceability: 4.0, shifts: 5.0 }),
  r('soalon', 'Soalon Corporation', 0.04, ['ACE'], 'LR', { audits: 6.0, conservation: 5.5, nextgen: 1.5, policy: 4.0, traceability: 4.5, shifts: 4.5 }),
  r('formosa', 'Formosa Chemical and Fibre Company', 0.0, ['VSF'], 'NK', { audits: 6.0, conservation: 4.0, nextgen: 3.0, policy: 4.0, traceability: 4.0, shifts: 4.5 }),
  r('mi_demo', 'MI Demo', 0.0, ['LYO'], 'LR', { audits: 6.0, conservation: 4.0, nextgen: 2.5, policy: 4.0, traceability: 5.0, shifts: 4.0 }),
  r('sateri', 'Sateri (RGE Group)', 24.0, ['VSF', 'LYO'], 'KR', { audits: 3.0, conservation: 6.0, nextgen: 8.0, policy: 2.5, traceability: 3.0, shifts: 1.5, highRisk: -3.0 }),
  r('nanjing', 'Nanjing Chemical Fibre Co., Ltd.', 1.36, ['VSF'], 'NK', { audits: 5.0, conservation: 3.5, nextgen: 2.5, policy: 4.0, traceability: 2.5, shifts: 2.5 }),
  r('weifang_xinlong', 'Weifang Xinlong Biological Materials', 2.26, ['VSF'], 'AR', { audits: 0.0, conservation: 1.0, policy: 4.0, traceability: 2.0, shifts: 1.0 }),
  r('apr', 'Asia Pacific Rayon', 3.39, ['VSF'], 'RP', { audits: 1.0, conservation: 4.0, nextgen: 2.5, policy: 2.5, traceability: 2.0, highRisk: -4.0 }),
  r('shandong_yamei', 'Shandong Yamei', 3.61, ['VSF'], 'AR', { audits: 0.5, conservation: 2.0, policy: 2.0, traceability: 2.0 }),
  r('hubei_golden_ring', 'Hubei Golden Ring', 0.17, ['VFY'], 'AR', { audits: 0.5, conservation: 1.0, policy: 2.0, traceability: 0.5 }),
  r('xinjiang_zhongtai', 'Xinjiang Zhongtai Textile Co., Ltd.', 8.36, ['VSF'], 'AR', { conservation: 1.0, policy: 4.0, highRisk: -2.0 }),
  r('silver_hawk', 'Silver Hawk', 2.03, ['VSF'], 'AR', { highRisk: -1.0 }),
  r('dp_acetate', 'DP Acetate', 0.08, ['ACE'], 'IP', {}),
  r('jiangsu_huasaier', 'Jiangsu Huasaier', 0.34, ['LYO'], 'IP', {}),
  r('zhengzhou', 'Zhengzhou Zhongyuan', 0.05, ['LYO'], 'NA', {}),
  r('woodspin', 'Woodspin', 0.23, ['LYO'], 'NA', {}),
  r('xinjiang_yaao', "Xinjiang Ya'ao", 1.36, ['VSF'], 'NA', {}),
  r('shandong_yingli', 'Shandong Yingli', 0.0, ['LYO'], 'NA', {}),
  r('swan_fiber', 'Swan Fiber', 0.34, ['LYO'], 'NA', {}),
  r('hubei_xinyang', 'Hubei Xinyang', 0.03, ['LYO'], 'NA', {}),
]

export const MMCF_TYPE_LABEL: Record<string, string> = {
  VSF: 'Viscose staple fibre',
  LYO: 'Lyocell',
  VFY: 'Viscose filament yarn',
  ACE: 'Acetate',
}

/** Capacity share by risk status, calculated from the matrix. */
export function capacityByRisk() {
  const out: Record<RiskStatus, number> = { NK: 0, LR: 0, KR: 0, RP: 0, AR: 0, IP: 0, NA: 0 }
  HOT_BUTTON_2025.forEach((x) => (out[x.risk] += x.capacityPct))
  return out
}

/**
 * Capacity share in green shirts (20 buttons or more).
 * Canopy's published green shirt figure excludes producers carrying known risk, which the
 * matrix marks as "light green with red". Both are returned so neither is implied by accident.
 */
export function greenShirtCapacity() {
  const green = HOT_BUTTON_2025.filter((x) => (x.total ?? -99) >= 20)
  const withKnownRisk = green.filter((x) => x.risk === 'KR' || x.risk === 'RP')
  const total = green.reduce((a, x) => a + x.capacityPct, 0)
  const knownRisk = withKnownRisk.reduce((a, x) => a + x.capacityPct, 0)
  return { total, knownRisk, clean: total - knownRisk, count: green.length, cleanCount: green.length - withKnownRisk.length }
}
