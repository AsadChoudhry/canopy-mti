import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Recycle, Leaf, Settings2, Factory, Truck, Coins, Save, Trash2, Info, Link2, ExternalLink } from 'lucide-react'
import type { Company, FibreComposition, Product, Scenario, Solution } from '@/data/model'
import { FIBRE_KEYS, FIBRE_META, type FibreKey } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { useUI } from '@/context/UIContext'
import { Card } from '@/components/ui/Card'
import { FibreBar } from '@/components/ui/FibreBar'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { computeScenario, compositionTotal, fmtT } from '@/lib/scenario'
import { cn } from '@/lib/cn'

type Tab = 'alternatives' | 'scenario' | 'evidence'

interface Pathway {
  id: string
  title: string
  icon: React.ReactNode
  iconBg: string
  categories: Solution['category'][]
  rationale: string
}

const PATHWAYS: Pathway[] = [
  { id: 'recycled', title: 'Increase recycled content', icon: <Recycle size={20} />, iconBg: 'bg-green-100 text-green-600', categories: ['recycled_paper'], rationale: 'Raise the recycled share of the base ply. Ceiling depends on strength requirements and recovered-paper availability at the producing mill.' },
  { id: 'agri', title: 'Assess agricultural-residue blends', icon: <Leaf size={20} />, iconBg: 'bg-green-100 text-green-600', categories: ['agricultural_residue', 'nextgen_pulp'], rationale: 'Partially substitute fresh fibre in the top ply with qualifying Next Gen pulp. No provider match is asserted.' },
]

const REQUIREMENTS = [
  { label: 'Strength & performance', icon: <Settings2 size={16} /> },
  { label: 'Mill compatibility', icon: <Factory size={16} /> },
  { label: 'Supply availability', icon: <Truck size={16} /> },
  { label: 'Cost', icon: <Coins size={16} /> },
]

const emptyHyp = (c: FibreComposition): FibreComposition => ({ ...c, status: 'illustrative', sourceIds: [] })

export function TransitionPanel({ company, product, tab, onTab }: { company: Company; product: Product; tab: Tab; onTab: (t: Tab) => void }) {
  const { data } = useStore()
  const { openEvidence } = useUI()
  const [open, setOpen] = useState<string | null>(null)

  const productSolutions = useMemo(() => {
    const appl = product.application.toLowerCase()
    return data.solutions.filter((s) => s.category !== 'tool' && (s.applications.some((a) => a.toLowerCase().includes('packag') || a.toLowerCase().includes('paper') || a.toLowerCase().includes('corrug') || a.toLowerCase().includes(appl)) || data.shortlist.includes(s.id)))
  }, [data.solutions, data.shortlist, product.application])

  return (
    <Card className="p-5 bg-brand-50/60 border-brand-100 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[19px] font-bold text-slate-900 leading-tight">Transition options for {product.name.replace('ProVantage ', '')}</h3>
        <span className="rounded-full bg-brand-100 text-brand-700 text-[11px] font-semibold px-3 py-1 whitespace-nowrap">Company-specific assessment</span>
      </div>

      <div className="flex gap-1 border-b border-brand-100">
        {(['alternatives', 'scenario', 'evidence'] as Tab[]).map((t) => (
          <button key={t} onClick={() => onTab(t)} className={cn('px-4 py-2 text-[13px] font-semibold capitalize border-b-2 -mb-px', tab === t ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>
            {t}
          </button>
        ))}
      </div>

      <div className="inline-flex items-center gap-1 self-start rounded-full bg-white border border-brand-200 px-3 py-1 text-[12px] text-brand-700">
        {company.name} <ChevronRight size={12} /> {product.category ?? product.application} <ChevronRight size={12} /> <b>{product.name.replace('ProVantage ', '')}</b>
      </div>

      {tab === 'alternatives' && (
        <div className="flex flex-col gap-4 animate-fade-up">
          <div>
            <div className="text-[14px] font-semibold text-slate-900 mb-2">Transition pathway options</div>
            <div className="flex flex-col gap-2">
              {PATHWAYS.map((p) => {
                const isOpen = open === p.id
                const sols = productSolutions.filter((s) => p.categories.includes(s.category))
                return (
                  <div key={p.id} className="rounded-xl border border-slate-200 bg-white">
                    <button onClick={() => setOpen(isOpen ? null : p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                      <span className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', p.iconBg)}>{p.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-semibold text-slate-900">{p.title}</span>
                        <span className="block text-[12px] text-slate-500">Candidate · suitability unverified</span>
                      </span>
                      {isOpen ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 animate-fade-up">
                        <p className="text-[12px] text-slate-600 mb-3">{p.rationale}</p>
                        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">Catalogue entries</div>
                        {sols.length ? (
                          <ul className="flex flex-col gap-1.5">
                            {sols.map((s) => {
                              const src = data.sources.find((x) => x.id === s.sourceIds[0])
                              return (
                                <li key={s.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[12px]">
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-900">
                                      {s.provider ? `${s.provider}: ` : ''}
                                      {s.name}
                                    </div>
                                    <div className="text-slate-500">
                                      {s.feedstock} · {s.geography === 'global' ? 'Global' : s.geography === 'unknown' ? 'Geography unknown' : s.geography.join(', ')} · capacity {s.capacity ?? 'unknown'}
                                    </div>
                                    {data.shortlist.includes(s.id) && <span className="text-[10px] text-brand-600 font-semibold">Shortlisted</span>}
                                  </div>
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    {src && <EvidenceBadge source={src} label={s.status === 'verified' ? 'Verified' : s.status === 'listing_supplied' ? 'Listing supplied' : 'Illustrative'} size="xs" />}
                                    <span className="text-[10px] text-slate-400">Not a confirmed match</span>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <p className="text-[12px] italic text-slate-400">No catalogue entries loaded for this pathway.</p>
                        )}
                        <div className="mt-3 flex items-center justify-between text-[12px]">
                          <span className="text-slate-500">Assessment status</span>
                          <span className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5 font-semibold">Not assessed</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-[14px] font-semibold text-slate-900 mb-2">Requirements to check</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {REQUIREMENTS.map((r) => (
                <div key={r.label} className="rounded-xl border border-slate-200 bg-white px-3 py-3 flex items-center gap-2 text-[12px]">
                  <span className="text-slate-500">{r.icon}</span>
                  <span className="flex-1 text-slate-800 leading-tight">{r.label}</span>
                  <span className="text-[10px] italic text-slate-400">unknown</span>
                </div>
              ))}
            </div>
          </div>

          <ScenarioSummary product={product} onOpen={() => onTab('scenario')} />
        </div>
      )}

      {tab === 'scenario' && <ScenarioEditor company={company} product={product} />}

      {tab === 'evidence' && (
        <div className="flex flex-col gap-3 animate-fade-up">
          <div className="text-[14px] font-semibold text-slate-900">Evidence attached to this product</div>
          {product.sourceIds.map((id) => {
            const s = data.sources.find((x) => x.id === id)
            if (!s) return null
            return (
              <button key={id} onClick={() => openEvidence({ source: s })} className="text-left rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-brand-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-900">{s.title}</span>
                  <EvidenceBadge source={s} label={s.accessed ? 'Accessed' : 'Not accessed'} size="xs" />
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5">{s.page}</div>
                {s.passage && <blockquote className="text-[12px] text-slate-600 italic border-l-2 border-brand-200 pl-2 mt-2">{s.passage}</blockquote>}
              </button>
            )
          })}
          <div className="text-[14px] font-semibold text-slate-900 mt-2">Company-wide statements (not product-specific)</div>
          {(company.sourcingStatements ?? []).map((st, i) => {
            const s = data.sources.find((x) => x.id === st.sourceIds[0])
            return (
              <div key={i} className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-[12px]">
                <div className="text-slate-800">{st.text}</div>
                <div className="flex items-center justify-between mt-1.5 text-slate-500">
                  <span>Scope: {st.scope}</span>
                  {s && <EvidenceBadge source={s} label="Source" size="xs" />}
                </div>
              </div>
            )
          })}
          <div className="text-[14px] font-semibold text-slate-900 mt-2">Supply-chain connections</div>
          <ul className="flex flex-col gap-1.5">
            {data.relationships
              .filter((r) => r.fromType === 'product' && r.fromId === product.id)
              .map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px]">
                  <span className="inline-flex items-center gap-2"><Link2 size={12} className="text-slate-400" /> {r.kind.replace('_', ' ')} → {r.toId ? data.facilities.find((f) => f.id === r.toId)?.name ?? data.origins.find((o) => o.id === r.toId)?.name ?? r.toId : <i className="text-slate-400">no target</i>}</span>
                  <span className={cn('rounded-md px-2 py-0.5 font-semibold', r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>{r.status === 'confirmed' ? 'Confirmed' : 'Unresolved'}</span>
                </li>
              ))}
          </ul>
          {product.notes && <p className="text-[12px] text-slate-500 flex gap-2"><Info size={13} className="shrink-0 mt-0.5" /> {product.notes}</p>}
        </div>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Scenario                                                            */
/* ------------------------------------------------------------------ */

function ScenarioSummary({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { data } = useStore()
  const saved = data.scenarios.filter((s) => s.productId === product.id)
  const s = saved[0]
  const vol = data.quantities.find((q) => q.id === product.volumeQuantityId)
  const res = s ? computeScenario(s, vol) : null
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-900 mb-2">Illustrative material mix <Info size={13} className="text-slate-400" /></div>
      <div className="grid grid-cols-[120px_1fr_auto] gap-x-3 gap-y-2 items-center text-[12px]">
        <span className="text-slate-700 font-medium">Current (product)</span>
        <FibreBar composition={product.composition} height={26} />
        <span className="text-slate-500 w-[110px] leading-tight">{compLabel(product.composition)}</span>
        {s && (
          <>
            <span className="text-slate-700 font-medium">
              Scenario <span className="block text-[10px] text-slate-400">(illustrative)</span>
            </span>
            <FibreBar composition={s.hypothetical} height={26} />
            <span className="text-slate-500 w-[110px] leading-tight">{compLabel(s.hypothetical)}</span>
          </>
        )}
      </div>
      {s && <span className="inline-block mt-2 rounded-md bg-brand-100 text-brand-700 text-[10px] font-semibold px-2 py-0.5">Illustrative scenario · {s.name}</span>}
      <div className="mt-3 flex items-center gap-1.5 text-[14px] font-semibold text-slate-900">Estimated impact <Info size={13} className="text-slate-400" /></div>
      <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
        <Leaf size={22} className="text-slate-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-slate-500">Tonnes shifted</div>
          {res?.state === 'ok' ? (
            <div className="text-[15px] font-semibold text-slate-900">{fmtT(res.virginFibreDisplacedT!)} virgin fibre displaced <span className="text-[11px] font-normal text-slate-500">(assumption-based)</span></div>
          ) : (
            <div className="text-[15px] font-semibold text-slate-900">{res ? (res.state === 'needs_volume' ? 'Needs product volume' : res.state === 'needs_fibre_share' ? 'Needs fibre-mass assumption' : 'Composition incomplete') : 'No scenario saved'}</div>
          )}
          <div className="text-[11px] text-slate-500">Enter a scenario volume to see the potential impact.</div>
        </div>
        <button onClick={onOpen} className="rounded-lg border border-brand-300 bg-white text-brand-700 text-[12px] font-semibold px-3 py-2 whitespace-nowrap hover:bg-brand-50">
          Enter scenario volume
        </button>
      </div>
    </div>
  )
}

function compLabel(c: FibreComposition) {
  const parts = FIBRE_KEYS.filter((k) => (c[k] ?? 0) > 0).map((k) => `${c[k]}% ${FIBRE_META[k].label.split(' ')[0].toLowerCase().replace('qualifying', 'Next Gen')}`)
  return parts.join(' / ')
}

function NumField({ label, value, onChange, unit, hint }: { label: string; value: number | null; onChange: (v: number | null) => void; unit?: string; hint?: string }) {
  return (
    <label className="block text-[12px]">
      <span className="text-slate-600">{label}</span>
      <span className="mt-1 flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-brand-400">
        <input
          type="number"
          value={value ?? ''}
          placeholder="unknown"
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className="flex-1 min-w-0 px-2.5 py-1.5 outline-none text-slate-900 placeholder:italic placeholder:text-slate-400"
        />
        {unit && <span className="px-2 text-slate-400 border-l border-slate-200 py-1.5">{unit}</span>}
      </span>
      {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
    </label>
  )
}

function ScenarioEditor({ company, product }: { company: Company; product: Product }) {
  const { data, upsert, remove } = useStore()
  const saved = data.scenarios.filter((s) => s.productId === product.id)
  const vol = data.quantities.find((q) => q.id === product.volumeQuantityId)
  const [editing, setEditing] = useState<Scenario>(() => saved[0] ?? newScenario(company, product))
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    setEditing(saved[0] ?? newScenario(company, product))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  const res = computeScenario(editing, vol)
  const hypTotal = compositionTotal(editing.hypothetical)

  const setHyp = (k: FibreKey, v: number | null) => setEditing((s) => ({ ...s, hypothetical: { ...s.hypothetical, [k]: v } }))

  const save = () => {
    const now = new Date().toISOString()
    upsert('scenarios', { ...editing, updatedAt: now, createdAt: editing.createdAt || now })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="rounded-lg bg-white border border-brand-100 text-[12px] text-slate-600 px-3 py-2 flex gap-2">
        <Info size={13} className="shrink-0 mt-0.5 text-brand-500" />
        Scenarios are saved to this company and product. Displacement is calculated on a fibre-mass basis.
      </div>

      <label className="block text-[12px]">
        <span className="text-slate-600">Scenario name</span>
        <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 outline-none focus:border-brand-400 text-slate-900" />
      </label>

      <div>
        <div className="text-[12px] text-slate-600 mb-1">Current (observed product composition)</div>
        <FibreBar composition={editing.current} height={24} />
        <div className="text-[11px] text-slate-400 mt-1">{compLabel(editing.current)} · {editing.current.status}</div>
      </div>

      <div>
        <div className="text-[12px] text-slate-600 mb-1">Hypothetical composition (illustrative)</div>
        <FibreBar composition={editing.hypothetical} height={24} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
          {(['virginWoodPct', 'recycledPct', 'nextGenPct', 'otherNonWoodPct'] as FibreKey[]).map((k) => (
            <NumField key={k} label={FIBRE_META[k].label} value={editing.hypothetical[k]} onChange={(v) => setHyp(k, v)} unit="%" />
          ))}
        </div>
        <div className={cn('text-[11px] mt-1.5', hypTotal.over ? 'text-red-600' : hypTotal.hasUnknown ? 'text-amber-600' : hypTotal.complete ? 'text-green-600' : 'text-slate-500')}>
          {hypTotal.over ? `Totals ${hypTotal.known}%, over 100%` : hypTotal.hasUnknown ? `Known shares total ${hypTotal.known}%, remainder unknown` : hypTotal.complete ? 'Composition totals 100%' : `Known shares total ${hypTotal.known}%, remainder ${(100 - hypTotal.known).toFixed(0)}% unknown`}
        </div>
      </div>

      <div>
        <div className="text-[12px] font-semibold text-slate-800 mb-1">Assumptions</div>
        <div className="grid sm:grid-cols-2 gap-2">
          <NumField label="Product volume (assumption)" value={editing.assumptions.productVolumeT} onChange={(v) => setEditing({ ...editing, assumptions: { ...editing.assumptions, productVolumeT: v } })} unit="t/yr" hint={vol && vol.value !== null ? `Observed: ${vol.value} ${vol.unit}` : 'Observed volume: unknown'} />
          <NumField label="Fibre share of product mass" value={editing.assumptions.fibreShareOfMass === null ? null : Math.round(editing.assumptions.fibreShareOfMass * 100)} onChange={(v) => setEditing({ ...editing, assumptions: { ...editing.assumptions, fibreShareOfMass: v === null ? null : v / 100 } })} unit="%" hint="Finished-product tonnes are not fibre tonnes" />
        </div>
        <label className="block text-[12px] mt-2">
          <span className="text-slate-600">Assumption note</span>
          <input value={editing.assumptions.note ?? ''} onChange={(e) => setEditing({ ...editing, assumptions: { ...editing.assumptions, note: e.target.value } })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 outline-none focus:border-brand-400 text-slate-900" placeholder="Why these assumptions?" />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1">Estimated impact</div>
        {res.state === 'ok' ? (
          <div className="grid sm:grid-cols-3 gap-3 text-[13px]">
            <div><div className="text-slate-500 text-[11px]">Fibre mass basis</div><div className="font-semibold text-slate-900">{fmtT(res.fibreMassT!)}</div></div>
            <div><div className="text-slate-500 text-[11px]">Virgin fibre displaced</div><div className="font-semibold text-green-700">{fmtT(res.virginFibreDisplacedT!)} ({res.virginDeltaPct} pts)</div></div>
            <div><div className="text-slate-500 text-[11px]">Next Gen introduced</div><div className="font-semibold text-brand-700">{fmtT(res.nextGenIntroducedT!)}</div></div>
            <div className="sm:col-span-3 text-[11px] text-slate-500">{res.message}</div>
          </div>
        ) : (
          <div className="text-[14px] font-semibold text-slate-800">{res.message}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-3 text-[14px]">
          <Save size={16} /> {savedFlash ? 'Saved' : 'Save to this product'}
        </button>
        <button onClick={() => setEditing(newScenario(company, product))} className="rounded-xl border border-slate-200 bg-white text-slate-600 px-3 py-3 text-[13px]">New</button>
      </div>

      {saved.length > 0 && (
        <div>
          <div className="text-[12px] font-semibold text-slate-800 mb-1">Saved scenarios for this product ({saved.length})</div>
          <ul className="flex flex-col gap-1">
            {saved.map((s) => (
              <li key={s.id} className={cn('flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[12px]', s.id === editing.id ? 'border-brand-300' : 'border-slate-200')}>
                <button onClick={() => setEditing(s)} className="flex-1 text-left">
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-slate-500">{compLabel(s.hypothetical)} · vol {s.assumptions.productVolumeT ?? 'unknown'} · saved {new Date(s.updatedAt).toLocaleDateString()}</div>
                </button>
                <Pill tone="inferred">illustrative</Pill>
                <button onClick={() => remove('scenarios', s.id)} className="text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-[10px] text-slate-400">Persistence: saved in this browser's local storage (see Data workspace for export). <a className="underline inline-flex items-center gap-0.5" href="/workspace">Export <ExternalLink size={9} /></a></p>
    </div>
  )
}

function newScenario(company: Company, product: Product): Scenario {
  const now = new Date().toISOString()
  return {
    id: `scn_${product.id}_${Date.now().toString(36)}`,
    companyId: company.id,
    productId: product.id,
    name: 'New hypothetical scenario',
    current: { ...product.composition },
    hypothetical: emptyHyp(product.composition),
    assumptions: { productVolumeT: null, fibreShareOfMass: null, note: '' },
    createdAt: now,
    updatedAt: now,
  }
}
