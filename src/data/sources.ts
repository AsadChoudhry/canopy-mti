import type { Source } from './types'

export const SOURCES: Record<string, Source> = {
  hm_asr_2025: {
    id: 'hm_asr_2025',
    title: 'H&M Group Annual and Sustainability Report 2025',
    type: 'company_disclosure',
    publisher: 'H&M Group',
    reportingYear: 2025,
    lastChecked: '2026-09-10',
    notes: 'Material volumes and shares as reported by the company. Percentages are rounded in the source.',
  },
  hm_supplier_list: {
    id: 'hm_supplier_list',
    title: 'H&M Group public supplier list (Tier 1 and selected Tier 2)',
    type: 'company_disclosure',
    publisher: 'H&M Group',
    reportingYear: 2025,
    lastChecked: '2026-09-10',
    notes: 'Public list covering factories that account for 99% of products sold. Includes some Tier 2 fabric-related facilities. Country-level counts not yet loaded into this prototype.',
  },
  derived: {
    id: 'derived',
    title: 'Derived estimate (Canopy calculation)',
    type: 'derived',
    publisher: 'Canopy Data & Research',
    lastChecked: '2026-09-15',
    notes: 'Calculated from reported shares. Approximate, subject to rounded reported percentages.',
  },
  ecopaper_charming_trim: {
    id: 'ecopaper_charming_trim',
    title: 'EcoPaper Database listing — Charming Trim',
    type: 'ecopaper_listing',
    publisher: 'Canopy EcoPaper Database',
    lastChecked: '2026-09-12',
  },
  ecopaper_rudholm: {
    id: 'ecopaper_rudholm',
    title: 'EcoPaper Database listing — Rudholm Group',
    type: 'ecopaper_listing',
    publisher: 'Canopy EcoPaper Database',
    lastChecked: '2026-09-12',
  },
  ecopaper_punarbhavaa: {
    id: 'ecopaper_punarbhavaa',
    title: 'EcoPaper Database listing — Punarbhavaa / CEAE',
    type: 'ecopaper_listing',
    publisher: 'Canopy EcoPaper Database',
    lastChecked: '2026-09-12',
  },
  canopy_partnerships: {
    id: 'canopy_partnerships',
    title: 'Canopy partnership records (CanopyStyle / Pack4Good)',
    type: 'canopy_internal',
    publisher: 'Canopy',
    lastChecked: '2026-09-01',
  },
  prototype_illustrative: {
    id: 'prototype_illustrative',
    title: 'Illustrative prototype value',
    type: 'prototype_illustrative',
    publisher: 'Canopy Data & Research (prototype)',
    lastChecked: '2026-09-15',
    notes: 'Not an H&M reported metric. Placeholder until calculated from underlying supply-chain records.',
  },
}

export const SOURCE_TYPE_LABEL: Record<Source['type'], string> = {
  company_disclosure: 'Company disclosure',
  derived: 'Derived / calculated',
  ecopaper_listing: 'EcoPaper listing',
  canopy_internal: 'Canopy internal',
  prototype_illustrative: 'Illustrative (prototype)',
}
