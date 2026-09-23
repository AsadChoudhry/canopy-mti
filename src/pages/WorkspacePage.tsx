import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Circle, Download, Upload, RotateCcw, Plus, Trash2, Info, ExternalLink, Save, Send, AlertTriangle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { FibreBar } from '@/components/ui/FibreBar'
import { useStore } from '@/store/StoreContext'
import { useUI } from '@/context/UIContext'
import { EVIDENCE_STATUS_META, FIBRE_META, type Collection, type FibreComposition, type Source } from '@/data/model'
import { compositionTotal } from '@/lib/scenario'
import { fmtDate } from '@/lib/format'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ */
/* Field schema                                                        */
/* ------------------------------------------------------------------ */
type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'sources' | 'composition' | 'boolean' | 'list' | 'ref'
interface FieldDef {
  key: string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
  ref?: Collection
  required?: boolean
  half?: boolean
  hint?: string
  unit?: string
}

const STATUS_OPTS = Object.entries(EVIDENCE_STATUS_META).map(([value, m]) => ({ value, label: m.label }))
const LINK_OPTS = [{ value: 'confirmed', label: 'Confirmed' }, { value: 'unresolved', label: 'Unresolved' }, { value: 'not_applicable', label: 'Not applicable' }]
const BASIS_OPTS = ['output', 'input', 'capacity', 'purchases', 'other'].map((v) => ({ value: v, label: v }))

const TABS: { id: Collection; label: string }[] = [
  { id: 'companies', label: 'Company' },
  { id: 'products', label: 'Product' },
  { id: 'facilities', label: 'Facility' },
  { id: 'origins', label: 'Origin & feedstock' },
  { id: 'relationships', label: 'Sourcing link' },
  { id: 'quantities', label: 'Quantity' },
  { id: 'sources', label: 'Source' },
  { id: 'solutions', label: 'Solution' },
  { id: 'scenarios', label: 'Scenario' },
]

const SCHEMAS: Record<Collection, FieldDef[]> = {
  companies: [
    { key: 'name', label: 'Company', type: 'text', required: true, half: true },
    { key: 'type', label: 'Type', type: 'select', options: [{ value: 'producer', label: 'Producer (output view)' }, { value: 'brand', label: 'Brand (purchasing view)' }], half: true, required: true },
    { key: 'sector', label: 'Sector', type: 'text', half: true },
    { key: 'hq', label: 'Headquarters', type: 'text', half: true },
    { key: 'logoText', label: 'Logo text', type: 'text', half: true },
    { key: 'logoColour', label: 'Logo colour', type: 'text', half: true },
    { key: 'totalOutputQuantityId', label: 'Total output quantity', type: 'ref', ref: 'quantities', half: true },
    { key: 'globalComparisonQuantityId', label: 'Global comparison quantity', type: 'ref', ref: 'quantities', half: true },
    { key: 'mapping.supplierIdentified', label: 'Supplier identified', type: 'select', options: LINK_OPTS, half: true },
    { key: 'mapping.millIdentified', label: 'Mill identified', type: 'select', options: LINK_OPTS, half: true },
    { key: 'mapping.originTraced', label: 'Origin traced', type: 'select', options: LINK_OPTS, half: true },
    { key: 'mapping.note', label: 'Mapping note', type: 'text', half: true },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
  products: [
    { key: 'companyId', label: 'Company', type: 'ref', ref: 'companies', required: true, half: true },
    { key: 'name', label: 'Product', type: 'text', required: true, half: true },
    { key: 'application', label: 'Application', type: 'text', required: true, half: true },
    { key: 'category', label: 'Category', type: 'text', half: true },
    { key: 'volumeQuantityId', label: 'Annual volume (quantity record)', type: 'ref', ref: 'quantities', half: true, hint: 'Leave empty = unknown' },
    { key: 'productionRegion.text', label: 'Production region (as stated)', type: 'text', half: true },
    { key: 'composition', label: 'Fibre composition', type: 'composition' },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
  facilities: [
    { key: 'name', label: 'Facility', type: 'text', required: true, half: true },
    { key: 'type', label: 'Type', type: 'select', options: ['pulp_mill', 'paper_mill', 'converter', 'recycling', 'forestry', 'other'].map((v) => ({ value: v, label: v.replace('_', ' ') })), half: true },
    { key: 'companyId', label: 'Operator', type: 'ref', ref: 'companies', half: true },
    { key: 'country', label: 'Country', type: 'text', half: true, required: true },
    { key: 'status', label: 'Evidence status', type: 'select', options: STATUS_OPTS, half: true },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'note', label: 'Note', type: 'textarea' },
  ],
  origins: [
    { key: 'name', label: 'Country / region', type: 'text', required: true, half: true },
    { key: 'm49', label: 'M49 code (for map)', type: 'text', half: true, hint: 'e.g. 040 Austria' },
    { key: 'feedstockType', label: 'Feedstock type', type: 'select', options: ['virgin_wood', 'recovered_paper', 'agricultural_residue', 'textile_waste', 'other', 'unknown'].map((v) => ({ value: v, label: v.replace(/_/g, ' ') })), half: true },
    { key: 'status', label: 'Evidence status', type: 'select', options: STATUS_OPTS, half: true },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'note', label: 'Note', type: 'textarea' },
  ],
  relationships: [
    { key: 'kind', label: 'Relationship', type: 'select', options: ['supplies', 'produced_at', 'sourced_from', 'sells_to', 'owns'].map((v) => ({ value: v, label: v.replace('_', ' ') })), half: true, required: true },
    { key: 'status', label: 'Status', type: 'select', options: LINK_OPTS, half: true },
    { key: 'fromType', label: 'From (type)', type: 'select', options: ['company', 'product', 'facility', 'origin'].map((v) => ({ value: v, label: v })), half: true },
    { key: 'fromId', label: 'From (id)', type: 'text', half: true },
    { key: 'toType', label: 'To (type)', type: 'select', options: ['company', 'product', 'facility', 'origin'].map((v) => ({ value: v, label: v })), half: true },
    { key: 'toId', label: 'To (id)', type: 'text', half: true, hint: 'Empty = unresolved target' },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'note', label: 'Note', type: 'textarea' },
  ],
  quantities: [
    { key: 'metric', label: 'Metric', type: 'text', required: true },
    { key: 'subjectType', label: 'Subject type', type: 'select', options: ['global', 'company', 'product', 'facility', 'origin'].map((v) => ({ value: v, label: v })), half: true },
    { key: 'subjectId', label: 'Subject id', type: 'text', half: true, hint: 'e.g. mondi, smartkraft_brown, world' },
    { key: 'value', label: 'Value', type: 'number', half: true, hint: 'Empty = unknown (never 0)' },
    { key: 'unit', label: 'Unit', type: 'text', half: true, required: true },
    { key: 'period', label: 'Reporting period', type: 'text', half: true, required: true },
    { key: 'basis', label: 'Measurement basis', type: 'select', options: BASIS_OPTS, half: true, required: true },
    { key: 'scope', label: 'Geographic & organisational scope', type: 'text', required: true },
    { key: 'denominator', label: 'Denominator (required for %)', type: 'text' },
    { key: 'status', label: 'Evidence status', type: 'select', options: STATUS_OPTS, half: true, required: true },
    { key: 'formula', label: 'Formula (if calculated)', type: 'text', half: true },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'note', label: 'Limitations / note', type: 'textarea' },
  ],
  sources: [
    { key: 'title', label: 'Document title', type: 'text', required: true },
    { key: 'publisher', label: 'Publisher', type: 'text', half: true, required: true },
    { key: 'kind', label: 'Type', type: 'select', options: ['company_report', 'company_product_page', 'statistical_database', 'canopy_directory', 'user_supplied', 'other'].map((v) => ({ value: v, label: v.replace(/_/g, ' ') })), half: true },
    { key: 'url', label: 'URL', type: 'text' },
    { key: 'page', label: 'Page / section', type: 'text', half: true },
    { key: 'accessDate', label: 'Access date', type: 'text', half: true, hint: 'YYYY-MM-DD' },
    { key: 'accessed', label: 'Document opened and read by the researcher', type: 'boolean', half: true },
    { key: 'reviewStatus', label: 'Review status', type: 'select', options: ['needs_review', 'reviewed', 'disputed'].map((v) => ({ value: v, label: v.replace('_', ' ') })), half: true },
    { key: 'passage', label: 'Supporting passage / evidence note', type: 'textarea' },
    { key: 'limitations', label: 'Limitations', type: 'textarea' },
    { key: 'reviewerNotes', label: 'Reviewer notes', type: 'textarea' },
  ],
  solutions: [
    { key: 'name', label: 'Solution', type: 'text', required: true, half: true },
    { key: 'provider', label: 'Provider', type: 'text', half: true },
    { key: 'category', label: 'Category', type: 'select', options: ['recycled_paper', 'agricultural_residue', 'textile_cellulose', 'nextgen_pulp', 'tool', 'other'].map((v) => ({ value: v, label: v.replace(/_/g, ' ') })), half: true },
    { key: 'directory', label: 'Directory', type: 'select', options: ['EcoPaper', 'Next Gen providers', 'ForestMapper', 'Other'].map((v) => ({ value: v, label: v })), half: true },
    { key: 'feedstock', label: 'Feedstock', type: 'text', half: true },
    { key: 'availability', label: 'Commercial availability', type: 'select', options: ['commercial', 'pilot', 'development', 'unknown'].map((v) => ({ value: v, label: v })), half: true },
    { key: 'capacity', label: 'Capacity (as disclosed)', type: 'text', half: true, hint: 'Empty = unknown' },
    { key: 'status', label: 'Record status', type: 'select', options: [{ value: 'verified', label: 'Verified' }, { value: 'listing_supplied', label: 'Listing supplied' }, { value: 'illustrative', label: 'Illustrative' }], half: true },
    { key: 'applications', label: 'Applications (comma separated)', type: 'list', half: true },
    { key: 'geography', label: 'Geography (comma separated, or "global"/"unknown")', type: 'list', half: true },
    { key: 'link', label: 'Link', type: 'text' },
    { key: 'sourceIds', label: 'Sources', type: 'sources' },
    { key: 'note', label: 'Note', type: 'textarea' },
  ],
  scenarios: [
    { key: 'companyId', label: 'Company', type: 'ref', ref: 'companies', half: true, required: true },
    { key: 'productId', label: 'Product', type: 'ref', ref: 'products', half: true, required: true },
    { key: 'name', label: 'Scenario name', type: 'text', required: true },
    { key: 'hypothetical', label: 'Hypothetical composition (illustrative)', type: 'composition' },
    { key: 'assumptions.productVolumeT', label: 'Assumed product volume', type: 'number', half: true, unit: 't/yr' },
    { key: 'assumptions.fibreShareOfMass', label: 'Fibre share of mass (0–1)', type: 'number', half: true },
    { key: 'assumptions.note', label: 'Assumption note', type: 'textarea' },
  ],
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
type Rec = Record<string, unknown>
const getPath = (o: Rec, path: string): unknown => path.split('.').reduce<unknown>((a, k) => (a && typeof a === 'object' ? (a as Rec)[k] : undefined), o)
const setPath = (o: Rec, path: string, v: unknown): Rec => {
  const [k, ...rest] = path.split('.')
  if (!rest.length) return { ...o, [k]: v }
  return { ...o, [k]: setPath(((o[k] as Rec) ?? {}) as Rec, rest.join('.'), v) }
}
const emptyComposition = (): FibreComposition => ({ virginWoodPct: null, recycledPct: null, nextGenPct: null, otherNonWoodPct: null, unknownPct: null, status: 'unknown', sourceIds: [] })

function blank(c: Collection): Rec {
  const id = `${c.slice(0, 3)}_${Date.now().toString(36)}`
  const base: Record<Collection, Rec> = {
    companies: { id, name: '', type: 'producer', sector: '', hq: '', logoText: '', logoColour: '#282727', sourceIds: [], mapping: { supplierIdentified: 'unresolved', millIdentified: 'unresolved', originTraced: 'unresolved' } },
    products: { id, companyId: '', name: '', application: '', composition: emptyComposition(), sourceIds: [] },
    facilities: { id, name: '', type: 'paper_mill', country: '', sourceIds: [], status: 'unknown' },
    origins: { id, name: '', feedstockType: 'unknown', sourceIds: [], status: 'unknown' },
    relationships: { id, kind: 'supplies', fromType: 'company', fromId: '', toType: 'facility', toId: '', status: 'unresolved', sourceIds: [] },
    quantities: { id, subjectType: 'company', subjectId: '', metric: '', value: null, unit: 'tonnes', period: 'not specified', scope: '', basis: 'output', status: 'unknown', sourceIds: [] },
    sources: { id, title: '', publisher: '', url: '', accessDate: '', accessed: false, reviewStatus: 'needs_review', kind: 'other' },
    solutions: { id, name: '', category: 'other', feedstock: '', applications: [], geography: 'unknown', availability: 'unknown', directory: 'Other', status: 'illustrative', sourceIds: [] },
    scenarios: { id, companyId: '', productId: '', name: '', current: emptyComposition(), hypothetical: emptyComposition(), assumptions: { productVolumeT: null, fibreShareOfMass: null, note: '' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  }
  return base[c]
}

function recordLabel(_c: Collection, r: Rec) {
  return (r.name as string) || (r.title as string) || (r.metric as string) || `${r.kind ?? ''} ${r.fromId ?? ''} → ${r.toId ?? ''}` || (r.id as string)
}

/* ------------------------------------------------------------------ */
/* Composition editor                                                  */
/* ------------------------------------------------------------------ */
function CompositionEditor({ value, onChange, sources }: { value: FibreComposition; onChange: (c: FibreComposition) => void; sources: Source[] }) {
  const t = compositionTotal(value)
  return (
    <div className="rounded-xl border border-slate-200 bg-cream-50 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(['virginWoodPct', 'recycledPct', 'nextGenPct', 'unknownPct'] as const).map((k) => (
          <label key={k} className="text-[12px]">
            <span className="inline-flex items-center gap-1.5 text-slate-700"><span className="w-2.5 h-2.5 rounded-full" style={{ background: FIBRE_META[k].colour }} />{FIBRE_META[k].label}</span>
            <span className="mt-1 flex rounded-lg border border-slate-200 bg-white overflow-hidden">
              <input type="number" value={value[k] ?? ''} placeholder="unknown" onChange={(e) => onChange({ ...value, [k]: e.target.value === '' ? null : Number(e.target.value) })} className="flex-1 min-w-0 px-2.5 py-1.5 outline-none placeholder:italic" />
              <span className="px-2 py-1.5 text-slate-400 border-l border-slate-200">%</span>
            </span>
          </label>
        ))}
      </div>
      <label className="block text-[12px] mt-2">
        <span className="inline-flex items-center gap-1.5 text-slate-700"><span className="w-2.5 h-2.5 rounded-full" style={{ background: FIBRE_META.otherNonWoodPct.colour }} />Other non-wood / classification pending</span>
        <span className="mt-1 flex rounded-lg border border-slate-200 bg-white overflow-hidden w-40">
          <input type="number" value={value.otherNonWoodPct ?? ''} placeholder="unknown" onChange={(e) => onChange({ ...value, otherNonWoodPct: e.target.value === '' ? null : Number(e.target.value) })} className="flex-1 min-w-0 px-2.5 py-1.5 outline-none placeholder:italic" />
          <span className="px-2 py-1.5 text-slate-400 border-l border-slate-200">%</span>
        </span>
      </label>
      <div className="mt-3"><FibreBar composition={value} height={18} /></div>
      <div className={cn('mt-2 rounded-lg px-3 py-2 text-[12px] flex items-center gap-2', t.over ? 'bg-red-50 text-red-700' : t.complete ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700')}>
        {t.over ? <AlertTriangle size={13} /> : t.complete ? <CheckCircle2 size={13} /> : <Info size={13} />}
        {t.over ? `Composition totals ${t.known}% — over 100%` : t.complete ? 'Composition totals 100%' : t.hasUnknown ? `Known categories total ${t.known}%. Unknown categories stay unknown — not filled to 100%.` : `Totals ${t.known}% — remainder recorded as unknown.`}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3 text-[12px]">
        <label>
          <span className="text-slate-600">Evidence status</span>
          <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value as FibreComposition['status'] })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
            {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label>
          <span className="text-slate-600">Basis / classification note</span>
          <input value={value.basis ?? ''} onChange={(e) => onChange({ ...value, basis: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5" placeholder="e.g. disclosed product blend" />
        </label>
      </div>
      <div className="mt-3 text-[12px]">
        <span className="text-slate-600">Composition sources</span>
        <SourcePicker value={value.sourceIds} onChange={(ids) => onChange({ ...value, sourceIds: ids })} sources={sources} />
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Certification and forest-risk assessment are recorded separately from fibre type. "Transitioning" is a progress status, not a category.</p>
    </div>
  )
}

function SourcePicker({ value, onChange, sources }: { value: string[]; onChange: (ids: string[]) => void; sources: Source[] }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {sources.map((s) => {
        const on = value.includes(s.id)
        return (
          <button type="button" key={s.id} onClick={() => onChange(on ? value.filter((x) => x !== s.id) : [...value, s.id])} className={cn('rounded-full border px-2.5 py-1 text-[11px] text-left', on ? 'bg-brand-100 border-brand-300 text-brand-700 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300')} title={s.title}>
            {s.title.length > 46 ? s.title.slice(0, 44) + '…' : s.title}
            {!s.accessed && ' ⚠'}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export function WorkspacePage() {
  const { data, upsert, remove, exportJson, importJson, resetToSeed, lastSaved } = useStore()
  const { openEvidence } = useUI()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Collection) || 'products'
  const list = data[tab] as unknown as Rec[]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Rec | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const first = list[0]
    setSelectedId(first ? (first.id as string) : null)
    setDraft(first ? structuredClone(first) : null)
    setErrors([])
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const select = (r: Rec) => {
    setSelectedId(r.id as string)
    setDraft(structuredClone(r))
    setErrors([])
  }
  const add = () => {
    const b = blank(tab)
    setSelectedId(b.id as string)
    setDraft(b)
    setErrors([])
  }

  const schema = SCHEMAS[tab]
  const validate = (r: Rec) => {
    const errs: string[] = []
    schema.forEach((f) => {
      if (f.required) {
        const v = getPath(r, f.key)
        if (v === undefined || v === null || v === '') errs.push(`${f.label} is required`)
      }
    })
    if (tab === 'quantities') {
      if ((r.unit as string) === '%' && !r.denominator) errs.push('Percentages require a denominator')
      if (r.status === 'calculated' && !r.formula) errs.push('Calculated values require a formula')
      if (r.status !== 'unknown' && r.status !== 'illustrative' && !((r.sourceIds as string[]) ?? []).length) errs.push('Reported / calculated / estimated values require at least one source')
      if (r.value === null && r.status !== 'unknown') errs.push('A value of unknown must have evidence status "Unknown"')
    }
    if (tab === 'products') {
      const t = compositionTotal(r.composition as FibreComposition)
      if (t.over) errs.push('Composition exceeds 100%')
    }
    if (tab === 'scenarios') {
      const t = compositionTotal(r.hypothetical as FibreComposition)
      if (t.over) errs.push('Hypothetical composition exceeds 100%')
    }
    if (tab === 'sources' && r.accessed && !r.accessDate) errs.push('An accessed source needs an access date')
    return errs
  }

  const save = (submit?: boolean) => {
    if (!draft) return
    const errs = validate(draft)
    setErrors(errs)
    if (errs.length) return
    let rec = draft
    if (tab === 'scenarios') {
      const prod = data.products.find((p) => p.id === rec.productId)
      rec = { ...rec, current: prod ? prod.composition : rec.current, updatedAt: new Date().toISOString(), hypothetical: { ...(rec.hypothetical as FibreComposition), status: 'illustrative' } }
    }
    if (submit && tab === 'sources') rec = { ...rec, reviewStatus: 'needs_review' }
    upsert(tab, rec as never)
    setFlash(submit ? 'Saved in this browser and marked needs review' : 'Draft saved')
    setTimeout(() => setFlash(null), 1500)
  }

  const del = () => {
    if (!selectedId) return
    remove(tab, selectedId)
    const next = list.filter((r) => r.id !== selectedId)[0]
    setSelectedId(next ? (next.id as string) : null)
    setDraft(next ? structuredClone(next) : null)
  }

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `canopy-mti-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }
  const doImport = (f: File) => {
    f.text().then((t) => {
      const r = importJson(t)
      setImportMsg(r.ok ? 'Imported — replaced local data.' : `Import failed: ${r.error}`)
      setTimeout(() => setImportMsg(null), 3000)
    })
  }

  const firstSource = useMemo(() => {
    if (!draft) return null
    if (tab === 'sources') return draft as unknown as Source
    const ids = (getPath(draft, 'sourceIds') as string[]) ?? (getPath(draft, 'composition.sourceIds') as string[]) ?? []
    return data.sources.find((s) => s.id === ids[0]) ?? null
  }, [draft, tab, data.sources])

  const completeness = useMemo(() => {
    if (!draft || tab !== 'products') return null
    const comp = draft.composition as FibreComposition
    const t = compositionTotal(comp)
    const vol = data.quantities.find((q) => q.id === draft.volumeQuantityId)
    const mill = data.relationships.find((r) => r.fromType === 'product' && r.fromId === draft.id && r.kind === 'produced_at' && r.status === 'confirmed' && r.toId)
    const origin = data.relationships.find((r) => r.fromType === 'product' && r.fromId === draft.id && r.kind === 'sourced_from' && r.status === 'confirmed' && r.toId)
    return [
      { ok: !t.hasUnknown, label: 'Composition recorded', sub: t.hasUnknown ? 'Some fibre categories unknown.' : 'All fibre categories specified.' },
      { ok: comp.sourceIds.length > 0, label: 'Source attached', sub: comp.sourceIds.length ? data.sources.find((s) => s.id === comp.sourceIds[0])?.title : 'No composition source.' },
      { ok: !!vol && vol.value !== null, label: vol && vol.value !== null ? 'Product volume recorded' : 'Product volume missing', sub: vol && vol.value !== null ? `${vol.value} ${vol.unit}` : 'Annual volume is not yet specified.' },
      { ok: !!mill, label: mill ? 'Mill connection confirmed' : 'Mill connection missing', sub: mill ? data.facilities.find((f) => f.id === mill.toId)?.name : 'Link to producing facility.' },
      { ok: !!origin, label: origin ? 'Fibre origin traced' : 'Fibre origin missing', sub: origin ? data.origins.find((o) => o.id === origin.toId)?.name : 'Source countries or regions not yet specified.' },
    ]
  }, [draft, tab, data])

  return (
    <AppShell crumbs={[{ label: 'Data workspace' }]}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Build the evidence</h1>
            <p className="text-[15px] text-slate-500 mt-1">Every number connected to its source</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => save(false)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold px-4 py-2.5 text-[13px] hover:border-brand-300"><Save size={15} /> Save draft</button>
            <button onClick={() => save(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 text-[13px]"><Send size={15} /> Save and mark for review</button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-[12px] text-slate-500">
          <span>{flash ?? importMsg ?? (lastSaved ? `Auto-saved locally ${fmtDate(lastSaved)} ${new Date(lastSaved).toLocaleTimeString()}` : '')}</span>
          <span className="ml-auto flex items-center gap-2">
            <button onClick={doExport} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 hover:border-brand-300"><Download size={12} /> Export JSON</button>
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 hover:border-brand-300"><Upload size={12} /> Import JSON</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
            <button onClick={() => window.confirm('Replace local data with the seed dataset? Unsaved edits are lost.') && resetToSeed()} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 hover:border-red-300 hover:text-red-600"><RotateCcw size={12} /> Reset to seed</button>
          </span>
        </div>

        <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scroll-thin">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setParams({ tab: t.id })} className={cn('px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-px whitespace-nowrap', tab === t.id ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>
              {t.label} <span className="text-[11px] text-slate-400">({(data[t.id] as unknown[]).length})</span>
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-[220px_minmax(0,1fr)_340px] gap-4 items-start">
          {/* record list */}
          <Card className="p-3">
            <button onClick={add} className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-brand-300 text-brand-700 text-[12px] font-semibold px-3 py-2 hover:bg-brand-50 mb-2"><Plus size={13} /> New record</button>
            <ul className="flex flex-col gap-0.5 max-h-[560px] overflow-y-auto scroll-thin">
              {list.map((r) => (
                <li key={r.id as string}>
                  <button onClick={() => select(r)} className={cn('w-full text-left rounded-lg px-2.5 py-2 text-[12px] truncate', selectedId === r.id ? 'bg-brand-50 text-brand-800 font-semibold' : 'hover:bg-cream-100 text-slate-700')}>
                    {recordLabel(tab, r)}
                  </button>
                </li>
              ))}
              {!list.length && <li className="text-[12px] italic text-slate-400 px-2">No records.</li>}
            </ul>
          </Card>

          {/* form */}
          <Card className="p-6">
            {draft ? (
              <form onSubmit={(e) => { e.preventDefault(); save(false) }} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-bold text-slate-900">{TABS.find((t) => t.id === tab)?.label} record</h2>
                  <span className="text-[11px] text-slate-400 font-mono">{draft.id as string}</span>
                </div>
                {errors.length > 0 && (
                  <ul className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12px] px-3 py-2 flex flex-col gap-0.5">
                    {errors.map((e) => <li key={e}>• {e}</li>)}
                  </ul>
                )}
                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                  {schema.map((f) => {
                    const v = getPath(draft, f.key)
                    const set = (nv: unknown) => setDraft(setPath(draft, f.key, nv))
                    const wrap = cn(!f.half && 'sm:col-span-2')
                    const base = 'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] outline-none focus:border-brand-400'
                    const lab = <span className="text-[13px] font-medium text-slate-800">{f.label}{f.required && <span className="text-red-500"> *</span>}</span>
                    if (f.type === 'composition') return <div key={f.key} className="sm:col-span-2">{lab}<div className="mt-1"><CompositionEditor value={(v as FibreComposition) ?? emptyComposition()} onChange={set} sources={data.sources} /></div></div>
                    if (f.type === 'sources') return <div key={f.key} className="sm:col-span-2">{lab}<SourcePicker value={(v as string[]) ?? []} onChange={set} sources={data.sources} /><p className="text-[11px] text-slate-400 mt-1">Multiple sources allowed. Record a conflicting observation as a new quantity rather than editing this one; the prototype keeps no edit history.</p></div>
                    if (f.type === 'textarea') return <label key={f.key} className={wrap}>{lab}<textarea value={(v as string) ?? ''} onChange={(e) => set(e.target.value)} rows={3} className={base} /></label>
                    if (f.type === 'select') return <label key={f.key} className={wrap}>{lab}<select value={(v as string) ?? ''} onChange={(e) => set(e.target.value)} className={base}><option value="">—</option>{f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
                    if (f.type === 'ref') return <label key={f.key} className={wrap}>{lab}<select value={(v as string) ?? ''} onChange={(e) => set(e.target.value || undefined)} className={base}><option value="">{f.hint ?? '— none —'}</option>{(data[f.ref!] as unknown as Rec[]).map((r) => <option key={r.id as string} value={r.id as string}>{recordLabel(f.ref!, r)}</option>)}</select></label>
                    if (f.type === 'boolean') return <label key={f.key} className={cn(wrap, 'flex items-center gap-2 pt-6')}><input type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} className="accent-brand-500" />{lab}</label>
                    if (f.type === 'number') return <label key={f.key} className={wrap}>{lab}<span className="mt-1 flex rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-brand-400"><input type="number" step="any" value={v === null || v === undefined ? '' : (v as number)} placeholder="unknown" onChange={(e) => set(e.target.value === '' ? null : Number(e.target.value))} className="flex-1 min-w-0 px-3 py-2 text-[14px] outline-none placeholder:italic" />{f.unit && <span className="px-2 py-2 text-slate-400 border-l border-slate-200 text-[13px]">{f.unit}</span>}</span>{f.hint && <span className="text-[11px] text-slate-400">{f.hint}</span>}</label>
                    if (f.type === 'list') return <label key={f.key} className={wrap}>{lab}<input value={Array.isArray(v) ? (v as string[]).join(', ') : (v as string) ?? ''} onChange={(e) => { const t = e.target.value; set(t === 'global' || t === 'unknown' ? t : t.split(',').map((x) => x.trim()).filter(Boolean)) }} className={base} /></label>
                    return <label key={f.key} className={wrap}>{lab}<input value={(v as string) ?? ''} onChange={(e) => set(e.target.value)} className={base} />{f.hint && <span className="text-[11px] text-slate-400">{f.hint}</span>}</label>
                  })}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button type="button" onClick={del} className="inline-flex items-center gap-1 text-[12px] text-slate-500 hover:text-red-600"><Trash2 size={13} /> Delete record</button>
                  <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 text-[13px]"><Save size={14} /> Save draft</button>
                </div>
              </form>
            ) : (
              <p className="text-[13px] text-slate-500">No record selected. Create one.</p>
            )}
          </Card>

          {/* right rail */}
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <h3 className="text-[16px] font-bold text-slate-900 mb-3">Source & confidence</h3>
              {firstSource ? (
                <dl className="text-[13px] flex flex-col gap-2">
                  <div className="flex gap-3"><dt className="w-24 text-slate-500">Type</dt><dd className="text-slate-800 capitalize">{firstSource.kind.replace(/_/g, ' ')}</dd></div>
                  <div className="flex gap-3"><dt className="w-24 text-slate-500">Source URL</dt><dd className="text-brand-600 break-all">{firstSource.url ? <a href={firstSource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">{firstSource.url.replace(/^https?:\/\//, '').slice(0, 40)}… <ExternalLink size={11} /></a> : '—'}</dd></div>
                  <div className="flex gap-3 items-center"><dt className="w-24 text-slate-500">Evidence</dt><dd><EvidenceBadge source={firstSource} label={firstSource.accessed ? 'Accessed' : 'Not accessed'} size="xs" /></dd></div>
                  <div className="flex gap-3 items-center"><dt className="w-24 text-slate-500">Review</dt><dd><span className={cn('rounded-md px-2 py-0.5 text-[11px] font-semibold', firstSource.reviewStatus === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600')}>{firstSource.reviewStatus.replace('_', ' ')}</span></dd></div>
                  {firstSource.passage && <div className="flex gap-3"><dt className="w-24 text-slate-500">Note</dt><dd className="text-slate-700 text-[12px]">{firstSource.passage.slice(0, 160)}{firstSource.passage.length > 160 && '…'}</dd></div>}
                  <button onClick={() => openEvidence({ source: firstSource })} className="text-[12px] text-brand-600 font-semibold hover:underline self-start mt-1">Open evidence drawer →</button>
                </dl>
              ) : (
                <p className="text-[13px] italic text-slate-400">No source attached to this record yet.</p>
              )}
            </Card>

            {completeness && (
              <Card className="p-5">
                <h3 className="text-[16px] font-bold text-slate-900 mb-3">Completeness</h3>
                <ul className="flex flex-col gap-3">
                  {completeness.map((c) => (
                    <li key={c.label} className="flex gap-3">
                      {c.ok ? <CheckCircle2 size={20} className="text-green-500 shrink-0" /> : <Circle size={20} className="text-slate-300 shrink-0" />}
                      <div>
                        <div className="text-[13px] font-medium text-slate-900">{c.label}</div>
                        <div className="text-[12px] text-slate-500">{c.sub}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="p-4 bg-brand-50 border-brand-100 text-[12px] text-slate-700 flex gap-2">
              <Info size={15} className="text-brand-500 shrink-0 mt-0.5" />
              <div>
                <b>Unknown values remain unknown.</b> They are never saved as zero.
                <div className="text-slate-500 mt-1">Persistence: this browser's local storage only — no sync, no history. Export JSON to keep or share a copy.</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

