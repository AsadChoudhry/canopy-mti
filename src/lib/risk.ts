import type { Company, Store } from '@/data/model'
import { HOT_BUTTON_2026, RISK_META, type RiskStatus } from '@/data/hotbutton'

/**
 * Supply risk overlay. Combines the layers that are loaded (EUDR country tier, Hot Button risk status,
 * certified share) and names the ones that are not (ForestMapper, tree cover loss, fires).
 */

export type Tier = 'low' | 'standard' | 'high'

/** EUDR country benchmark (Implementing Regulation 2025/1093), for countries in the store. */
export const EUDR_TIER: Record<string, { tier: Tier; m49: string; review?: boolean }> = {
  Austria: { tier: 'low', m49: '040' },
  Poland: { tier: 'low', m49: '616' },
  Slovakia: { tier: 'low', m49: '703' },
  'Czech Republic': { tier: 'low', m49: '203' },
  Finland: { tier: 'low', m49: '246' },
  Sweden: { tier: 'low', m49: '752' },
  Estonia: { tier: 'low', m49: '233' },
  Latvia: { tier: 'low', m49: '428' },
  Lithuania: { tier: 'low', m49: '440' },
  Germany: { tier: 'low', m49: '276' },
  Norway: { tier: 'low', m49: '578' },
  'South Africa': { tier: 'low', m49: '710', review: true },
  China: { tier: 'low', m49: '156' },
  Brazil: { tier: 'standard', m49: '076' },
  Indonesia: { tier: 'standard', m49: '360' },
  Russia: { tier: 'high', m49: '643' },
  Belarus: { tier: 'high', m49: '112' },
}

export const TIER_META: Record<Tier, { label: string; colour: string }> = {
  low: { label: 'Low', colour: '#009a7e' },
  standard: { label: 'Standard', colour: '#e09a12' },
  high: { label: 'High', colour: '#d14343' },
}

export type Exposure = 'high' | 'watch' | 'low' | 'unknown'
export const EXPOSURE_META: Record<Exposure, { label: string; colour: string; bg: string; why: string }> = {
  high: { label: 'High', colour: '#d14343', bg: 'bg-red-50 border-red-200', why: 'Known risk in Hot Button, or a high-risk origin country.' },
  watch: { label: 'Watch', colour: '#e09a12', bg: 'bg-amber-50 border-amber-200', why: 'Standard-risk country, audit outstanding, or certified share under 80% or not loaded.' },
  low: { label: 'Low', colour: '#009a7e', bg: 'bg-green-50 border-green-200', why: 'Low-risk countries only and at least 80% certified.' },
  unknown: { label: 'Unknown', colour: '#9aa3ad', bg: 'bg-slate-50 border-slate-200', why: 'No origin or mill country loaded.' },
}

export interface Place {
  country: string
  kind: 'origin' | 'mill'
  tier?: Tier
  m49?: string
  review?: boolean
}

export interface RiskRow {
  company: Company
  places: Place[]
  /** True when only mill countries are known, not wood origin. */
  millOnly: boolean
  hb?: { risk: RiskStatus; label: string; capacityPct: number }
  certifiedPct: number | null
  flags: string[]
  exposure: Exposure
}

export function riskRow(c: Company, store: Store): RiskRow {
  const originIds = store.relationships.filter((r) => r.kind === 'sourced_from' && r.fromType === 'company' && r.fromId === c.id && r.status === 'confirmed').map((r) => r.toId)
  const origins = store.origins.filter((o) => originIds.includes(o.id))
  let places: Place[] = [...new Set(origins.map((o) => o.name))].map((country) => ({ country, kind: 'origin' as const, ...EUDR_TIER[country] }))
  const millOnly = places.length === 0
  if (millOnly) {
    const mills = store.facilities.filter((f) => f.companyId === c.id)
    places = [...new Set(mills.map((m) => m.country))].map((country) => ({ country, kind: 'mill' as const, ...EUDR_TIER[country] }))
  }

  const hbRow = HOT_BUTTON_2026.find((r) => r.id === c.id)
  const hb = hbRow ? { risk: hbRow.risk, label: RISK_META[hbRow.risk].short, capacityPct: hbRow.capacityPct } : undefined

  const cert = store.quantities.find((x) => x.subjectId === c.id && /certified/i.test(x.metric) && x.unit.startsWith('%') && x.value !== null)
  const certStmt = c.sourcingStatements?.map((s) => s.text.match(/(\d+)% of (?:the )?wood[^.]*certified/i)).find(Boolean)
  const certifiedPct = cert?.value ?? (certStmt ? Number(certStmt[1]) : null)

  const flags: string[] = []
  if (hb && (hb.risk === 'KR' || hb.risk === 'RP')) flags.push(`Hot Button: ${RISK_META[hb.risk].label}`)
  if (hb && (hb.risk === 'AR' || hb.risk === 'IP')) flags.push(`Hot Button: ${RISK_META[hb.risk].label}`)
  places.filter((p) => p.tier && p.tier !== 'low').forEach((p) => flags.push(`${p.country}: ${TIER_META[p.tier!].label.toLowerCase()} risk country under EUDR`))
  places.filter((p) => !p.tier).forEach((p) => flags.push(`${p.country}: EUDR tier not loaded`))
  if (certifiedPct !== null && certifiedPct < 80) flags.push(`Only ${certifiedPct}% certified`)
  if (certifiedPct === null) flags.push('Certified share not loaded')
  if (millOnly && places.length) flags.push('Wood origin not declared; mill countries shown')

  let exposure: Exposure = 'unknown'
  if (places.length || hb) {
    if ((hb && (hb.risk === 'KR' || hb.risk === 'RP')) || places.some((p) => p.tier === 'high')) exposure = 'high'
    else if ((hb && (hb.risk === 'AR' || hb.risk === 'IP' || hb.risk === 'NA')) || places.some((p) => p.tier === 'standard' || !p.tier) || certifiedPct === null || certifiedPct < 80 || millOnly) exposure = 'watch'
    else exposure = 'low'
  }

  return { company: c, places, millOnly, hb, certifiedPct, flags, exposure }
}

export const RISK_LAYERS = [
  { name: 'EUDR country benchmark', publisher: 'European Commission, Implementing Regulation 2025/1093', status: 'loaded' as const, what: 'Low, standard or high risk by country.' },
  { name: 'Hot Button risk status', publisher: 'Canopy, 2026', status: 'loaded' as const, what: 'Known risk, audit required or no known risk, for MMCF producers.' },
  { name: 'Certified share', publisher: 'Company reports', status: 'loaded' as const, what: 'FSC or PEFC share of wood, where disclosed.' },
  { name: 'Ancient and Endangered Forests', publisher: 'Canopy ForestMapper', status: 'next' as const, what: 'Whether sourcing regions overlap forests Canopy protects.' },
  { name: 'Tree cover loss', publisher: 'Global Forest Watch (UMD)', status: 'next' as const, what: 'Annual loss in sourcing regions.' },
  { name: 'Fire detections', publisher: 'NASA FIRMS', status: 'later' as const, what: 'Fire in sourcing regions; the same feed as the mill siting layer.' },
  { name: 'Pulp trade flows', publisher: 'UN Comtrade HS 4702 to 4707', status: 'later' as const, what: 'Imported pulp by origin for producers that buy market pulp.' },
]
