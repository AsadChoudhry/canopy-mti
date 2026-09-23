import { useEffect, useMemo, useState } from 'react'
import { Calculator, Check, ClipboardCopy, Info } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import type { Quantity } from '@/data/model'
import type { CandidateRegion, RegionKey } from '@/data/mills'
import { PATH_META } from '@/data/mills'
import { useStore } from '@/store/StoreContext'
import { collectableForOneMill, fmtMt, millBuild } from '@/lib/millbuild'
import { cn } from '@/lib/cn'

type Feed = 'agri' | 'textile'

interface Preset {
  id: string
  label: string
  feed: Feed
  quantityId?: string
  /** Used when the preset is not a loaded quantity. */
  mt?: number
}

const FEEDSTOCK: Record<RegionKey, Preset[]> = {
  india: [
    { id: 'punjab', label: 'Punjab paddy straw', feed: 'agri', quantityId: 'q_in_paddy_punjab' },
    { id: 'haryana', label: 'Haryana paddy straw', feed: 'agri', quantityId: 'q_in_paddy_haryana' },
    { id: 'up', label: 'NCR Uttar Pradesh paddy straw', feed: 'agri', quantityId: 'q_in_paddy_up_ncr' },
    { id: 'in_textile', label: 'India textile waste', feed: 'textile', quantityId: 'q_in_textile_waste' },
  ],
  north_america: [{ id: 'na_custom', label: 'Prairie straw (your estimate)', feed: 'agri', mt: 2 }],
  europe: [{ id: 'eu_textile', label: 'EU-27 textile waste', feed: 'textile', quantityId: 'q_eu_textile_waste' }],
}

/** Which feedstock preset fits a candidate region's mill type. Panipat is a textile candidate, so it starts on textile waste. */
const CANDIDATE_PRESET: Record<string, string> = {
  punjab: 'punjab',
  haryana_panipat: 'in_textile',
  up_ncr: 'up',
  tiruppur: 'in_textile',
  harihar: 'in_textile',
}

const SIZES = [
  { id: 'redleaf', label: 'Red Leaf, straw', kt: 200, quantityId: 'q_redleaf_pulp_out' },
  { id: 'circulose', label: 'Circulose, textile', kt: 60, quantityId: 'q_circulose_capacity' },
  { id: 'infinited', label: 'Infinited, textile', kt: 30, quantityId: 'q_infinited_capacity' },
]

const CAPEX = [
  { id: 'india', label: 'India blueprint', quantityId: 'q_in_invest_per_t' },
  { id: 'global', label: '$78 bn global plan', quantityId: 'q_ng_invest_per_t' },
]

const SENSITIVITY = [5, 10, 20, 35, 50]

export function MillBuildPlanner({ region, candidate }: { region: RegionKey; candidate?: CandidateRegion }) {
  const { data } = useStore()
  const Q = (id?: string): Quantity | undefined => (id ? data.quantities.find((q) => q.id === id) : undefined)
  const presets = FEEDSTOCK[region]

  const [presetId, setPresetId] = useState(presets[0].id)
  const [customMt, setCustomMt] = useState<number | null>(null)
  const [collect, setCollect] = useState(20)
  const [yieldPct, setYieldPct] = useState(50)
  const [sizeKt, setSizeKt] = useState(200)
  const [capexId, setCapexId] = useState('india')
  const [copied, setCopied] = useState(false)

  // Follow the region tab and the selected candidate.
  useEffect(() => {
    const want = (candidate && CANDIDATE_PRESET[candidate.id]) ?? presets[0].id
    const p = presets.find((x) => x.id === want) ?? presets[0]
    setPresetId(p.id)
    setCustomMt(null)
    setSizeKt(p.feed === 'agri' ? 200 : 60)
    setCapexId(region === 'india' ? 'india' : 'global')
  }, [region, candidate?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const preset = presets.find((p) => p.id === presetId) ?? presets[0]
  const loadedQ = Q(preset.quantityId)
  // An edited figure is the user's estimate, not the source's.
  const presetQ = customMt === null ? loadedQ : undefined
  const baseMt = presetQ?.value ?? preset.mt ?? 0
  const feedstockMt = customMt ?? baseMt
  const strawYield = Q('q_straw_pulp_yield')
  const capexQ = Q(CAPEX.find((c) => c.id === capexId)?.quantityId)
  const usdPerT = capexQ?.value ?? 1500
  const ghgQ = Q('q_ng_ghg_factor')
  const ghgPerT = ghgQ?.value ?? 4

  useEffect(() => {
    setYieldPct(preset.feed === 'agri' ? strawYield?.value ?? 50 : 50)
  }, [preset.feed, strawYield?.value])

  const input = { feedstockMt, collectablePct: collect, yieldPct, millSizeKt: sizeKt, usdPerT, ghgPerT }
  const r = useMemo(() => millBuild(input), [feedstockMt, collect, yieldPct, sizeKt, usdPerT, ghgPerT]) // eslint-disable-line react-hooks/exhaustive-deps
  const breakEven = collectableForOneMill(input)

  const indiaTarget = Q('q_in_ng_capacity_target')?.value ?? 1.5
  const gap = (Q('q_ng_target_2033')?.value ?? 60) - (Q('q_ng_production_2024')?.value ?? 8.35)
  const yieldIsAssumption = preset.feed === 'textile'

  const brief = [
    `Illustrative scenario, not a feasibility estimate. Next Gen mill build: ${candidate ? `${candidate.name}, ${candidate.state}` : preset.label}`,
    `Feedstock: ${fmtMt(feedstockMt)} Mt ${preset.label.toLowerCase()}${presetQ ? ` (${presetQ.period}, ${presetQ.status})` : ' (analyst estimate)'}`,
    `Assumptions: ${collect}% collectable, ${yieldPct}% yield, ${sizeKt} kt mills, $${usdPerT.toLocaleString('en-US')} per tonne`,
    `Result: ${r.mills} mill${r.mills === 1 ? '' : 's'}, ${fmtMt(r.capacityMt)} Mt a year of Next Gen pulp, about $${r.investmentBn.toFixed(1)} bn, ${fmtMt(r.ghgMt)} Mt CO2e avoided a year`,
    `Each mill needs ${Math.round(r.feedstockPerMillKt).toLocaleString('en-US')} kt of feedstock a year.${breakEven !== null ? ` One mill needs ${breakEven.toFixed(1)}% of the feedstock.` : ''}`,
    region === 'india' ? `Share of Canopy's 1.5 Mt India blueprint: ${((r.capacityMt / indiaTarget) * 100).toFixed(0)}%` : `Share of the ${gap.toFixed(1)} Mt gap to 60 Mt: ${((r.capacityMt / gap) * 100).toFixed(1)}%`,
    'Estimates from the Canopy Material Transition prototype. Collectable share and textile yield are assumptions.',
  ].join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Card>
      <CardHeader
        title={<span className="flex items-center gap-2"><Calculator size={16} className="text-brand-600" /> Mill build planner</span>}
        subtitle="An illustrative scenario: how many mills the feedstock could support under your assumptions, with rough cost and emissions. Not a feasibility or investment estimate."
        action={
          <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-700 hover:border-brand-300">
            {copied ? <Check size={13} className="text-green-600" /> : <ClipboardCopy size={13} />} {copied ? 'Copied' : 'Copy investor summary'}
          </button>
        }
      />
      <div className="px-5 pb-5 grid lg:grid-cols-[1fr_1.1fr] gap-5">
        {/* inputs */}
        <div className="flex flex-col gap-3">
          <Field label="Feedstock" badge={presetQ ? <EvidenceBadge quantity={presetQ} size="xs" /> : <Pill tone="grey">Your estimate</Pill>}>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <Pill key={p.id} active={p.id === presetId} onClick={() => { setPresetId(p.id); setCustomMt(null); setSizeKt(p.feed === 'agri' ? 200 : 60) }}>{p.label}</Pill>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min={0}
                step={0.1}
                value={+feedstockMt.toFixed(2)}
                onChange={(e) => setCustomMt(Math.max(0, Number(e.target.value)))}
                className="w-[96px] rounded-lg border border-slate-200 px-2 py-1 text-[13px] tabular-nums"
                aria-label="Feedstock in million tonnes"
              />
              <span className="text-[12px] text-slate-500">Mt a year</span>
              {customMt !== null && loadedQ && (
                <button className="text-[11px] text-brand-600 underline" onClick={() => setCustomMt(null)}>reset to {loadedQ.value} Mt</button>
              )}
            </div>
          </Field>

          <Slider label="Collectable share" hint="Assumption. Straw already used for fodder or power, or textile waste that is not cotton-rich, is not collectable." value={collect} min={1} max={80} unit="%" onChange={setCollect} />
          <Slider
            label={preset.feed === 'agri' ? 'Straw to pulp yield' : 'Textile waste to pulp yield'}
            hint={yieldIsAssumption ? 'Assumption, no source loaded yet.' : undefined}
            badge={!yieldIsAssumption && strawYield ? <EvidenceBadge quantity={strawYield} size="xs" /> : <Pill tone="grey">Assumption</Pill>}
            value={yieldPct}
            min={20}
            max={90}
            unit="%"
            onChange={setYieldPct}
          />

          <Field label="Mill size, pulp a year">
            <div className="flex flex-wrap gap-1.5 items-center">
              {SIZES.map((s) => (
                <Pill key={s.id} active={sizeKt === s.kt} onClick={() => setSizeKt(s.kt)}>{s.label} · {s.kt} kt</Pill>
              ))}
              <input type="number" min={5} step={5} value={sizeKt} onChange={(e) => setSizeKt(Math.max(1, Number(e.target.value)))} className="w-[72px] rounded-lg border border-slate-200 px-2 py-1 text-[12px] tabular-nums" aria-label="Mill size in kilotonnes" />
            </div>
          </Field>

          <Field label="Investment per tonne of capacity" badge={capexQ && <EvidenceBadge quantity={capexQ} size="xs" />}>
            <div className="flex flex-wrap gap-1.5">
              {CAPEX.map((c) => {
                const cq = Q(c.quantityId)
                return <Pill key={c.id} active={capexId === c.id} onClick={() => setCapexId(c.id)}>{c.label} · ${cq?.value?.toLocaleString('en-US')}</Pill>
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Both are programme totals divided by tonnes, not mill capital costs. First-of-a-kind mills cost more per tonne.</p>
          </Field>
        </div>

        {/* outputs */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500"><Pill tone="grey">Illustrative scenario</Pill> Results follow the assumptions on the left.</div>
          <div className="grid grid-cols-2 gap-2.5">
            <Big label="Mills of this size" value={String(r.mills)} tone={r.mills > 0 ? 'brand' : 'muted'} sub={r.mills === 0 && breakEven !== null ? `Needs ${breakEven.toFixed(1)}% collectable for one` : `${Math.round(r.feedstockPerMillKt).toLocaleString('en-US')} kt feedstock each`} />
            <Big label="Next Gen pulp a year" value={`${fmtMt(r.capacityMt)} Mt`} sub={`of ${fmtMt(r.pulpPotentialMt)} Mt potential`} />
            <Big label="Investment" value={`$${r.investmentBn.toFixed(1)} bn`} sub={`at $${usdPerT.toLocaleString('en-US')} / t`} />
            <Big label="GHG avoided a year" value={`${fmtMt(r.ghgMt)} Mt CO2e`} sub={<span className="inline-flex items-center gap-1">{ghgPerT} t per t pulp {ghgQ && <EvidenceBadge quantity={ghgQ} size="xs" label="" className="px-1" />}</span>} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 flex flex-col gap-2">
            {region === 'india' && <Progress label="Canopy's 1.5 Mt India blueprint" value={r.capacityMt} of={indiaTarget} />}
            <Progress label={`Gap to 60 Mt (${gap.toFixed(1)} Mt)`} value={r.capacityMt} of={gap} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">If the collectable share is…</div>
            <table className="w-full text-[12px] tabular-nums">
              <thead>
                <tr className="text-slate-400 text-[10px]"><th className="text-left font-semibold">Collectable</th>{SENSITIVITY.map((s) => <th key={s} className={cn('text-right font-semibold', s === collect && 'text-brand-700')}>{s}%</th>)}</tr>
              </thead>
              <tbody>
                <tr><td className="text-slate-500">Mills</td>{SENSITIVITY.map((s) => <td key={s} className="text-right font-semibold text-slate-900">{millBuild({ ...input, collectablePct: s }).mills}</td>)}</tr>
                <tr><td className="text-slate-500">Mt pulp</td>{SENSITIVITY.map((s) => <td key={s} className="text-right text-slate-600">{fmtMt(millBuild({ ...input, collectablePct: s }).capacityMt)}</td>)}</tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 flex gap-1.5">
            <Info size={12} className="shrink-0 mt-0.5" />
            {candidate ? <>Following <b className="text-slate-600">{candidate.name}</b> ({PATH_META[candidate.path].label.toLowerCase()}). {presetQ ? `The feedstock figure covers ${presetQ.scope}, not this locality alone. ` : ''}</> : null}
            The collectable share is the number that decides the answer and the one with the least data. Getting it is the first job of the next data layers.
          </p>
        </div>
      </div>
    </Card>
  )
}

function Field({ label, badge, children }: { label: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[12px] font-semibold text-slate-800">{label}</span>
        {badge}
      </div>
      {children}
    </div>
  )
}

function Slider({ label, hint, badge, value, min, max, unit, onChange }: { label: string; hint?: string; badge?: React.ReactNode; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <Field label={label} badge={badge ?? <Pill tone="grey">Assumption</Pill>}>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-brand-500" aria-label={label} />
        <span className="w-[44px] text-right text-[14px] font-bold tabular-nums text-slate-900">{value}{unit}</span>
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </Field>
  )
}

function Big({ label, value, sub, tone }: { label: string; value: string; sub?: React.ReactNode; tone?: 'brand' | 'muted' }) {
  return (
    <div className={cn('rounded-xl border px-3 py-2.5', tone === 'brand' ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white')}>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className={cn('text-[24px] font-bold tabular-nums leading-tight', tone === 'muted' ? 'text-slate-400' : 'text-slate-900')}>{value}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function Progress({ label, value, of }: { label: string; value: number; of: number }) {
  const pct = of > 0 ? (value / of) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-600">
        <span>{label}</span>
        <span className="tabular-nums font-semibold text-slate-900">{pct < 1 && pct > 0 ? pct.toFixed(2) : pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  )
}
