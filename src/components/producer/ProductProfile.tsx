import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronRight, Circle, Factory, Leaf, MapPin, Trees, Info } from 'lucide-react'
import type { Company, Product } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { accountProduct, fibreSplit } from '@/lib/accounting'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Card } from '@/components/ui/Card'
import { SvgWorldMap, type MapBubble } from '@/components/company/SvgWorldMap'
import { cn } from '@/lib/cn'

const FIBRE_COLOUR = { virgin_wood: '#282727', recycled: '#009a7e', nextgen: '#6a47ea', other_non_wood: '#00c1c6' }
const NONFIBRE_COLOUR = '#c7c7c7'

export function ProductProfile({ company, product, onOpenTransition }: { company: Company; product: Product; onOpenTransition: () => void }) {
  const { data } = useStore()
  const [tab, setTab] = useState<'fibre' | 'evidence'>('fibre')
  const score = accountProduct(product, data)
  const split = fibreSplit(product)
  const q = (id?: string) => (id ? data.quantities.find((x) => x.id === id) : undefined)
  const volume = q(product.volumeQuantityId)
  const share = q(product.shareOfCompanyQuantityId)
  const certified = q(product.certifiedPctQuantityId)
  const mill = data.facilities.find((f) => f.id === product.millFacilityId)
  const pulps = (product.pulpFacilityIds ?? []).map((id) => data.facilities.find((f) => f.id === id)).filter(Boolean)
  const origins = (product.originIds ?? []).map((id) => data.origins.find((o) => o.id === id)).filter(Boolean)

  const bubbles = useMemo<MapBubble[]>(
    () =>
      origins.map((o) => ({ id: o!.id, m49: o!.m49 ?? '', label: o!.name, sublabel: o!.note, radius: 10, colour: '#009a7e', showLabel: true, dashed: false })).filter((b) => b.m49),
    [origins],
  )
  const highlightById = Object.fromEntries(origins.filter((o) => o!.m49).map((o) => [o!.m49!, '#99d7c8']))

  const solutions = data.solutions.filter((s) => s.category !== 'tool' && s.applications.some((a) => /packag|paper|board|carton|corrug/i.test(a)))

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* header */}
      <div className="flex flex-col xl:flex-row xl:items-start gap-5">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 mb-1">
            {company.name} <ChevronRight size={12} /> {product.category ?? product.application}
          </div>
          <h1 className="text-[26px] font-bold text-slate-900 leading-tight">{product.name}</h1>
          <div className="text-[13px] text-slate-500">{product.application}</div>
          {product.description && <p className="text-[13px] text-slate-600 mt-2 max-w-2xl">{product.description}</p>}
        </div>
        <div className="flex items-stretch divide-x divide-slate-200 shrink-0">
          <div className="px-5 first:pl-0">
            <div className={cn('text-[22px] font-bold leading-none', volume && volume.value !== null ? 'text-slate-900' : 'text-slate-400')}>
              {volume && volume.value !== null ? `${volume.value} ${volume.unit}` : 'Unknown'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              {volume?.basis === 'capacity' ? 'Mill capacity (volume proxy)' : 'Annual volume'} {volume && <EvidenceBadge quantity={volume} size="xs" label="" className="px-1" />}
            </div>
          </div>
          <div className="px-5">
            <div className={cn('text-[22px] font-bold leading-none', share && share.value !== null ? 'text-slate-900' : 'text-slate-400')}>
              {share && share.value !== null ? `${share.value}%` : 'Unknown'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              of company {share && <EvidenceBadge quantity={share} size="xs" label="" className="px-1" />}
            </div>
          </div>
        </div>
      </div>

      {/* accounting score */}
      <Card className={cn('p-4', score.level === 'full' ? 'border-green-200 bg-green-50' : score.level === 'partial' ? 'border-amber-200 bg-amber-50' : 'border-slate-200')}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-[13px] font-semibold text-slate-900">
            Evidence fields filled: {score.passed} of {score.total}
            {score.checks.some((c) => c.ok && c.proxy) && <span className="ml-2 text-[11px] font-normal text-amber-600">· {score.checks.filter((c) => c.ok && c.proxy).length} filled with a proxy</span>}
          </div>
          <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', score.level === 'full' ? 'bg-green-500 text-white' : score.level === 'partial' ? 'bg-amber-400 text-white' : 'bg-slate-300 text-slate-700')}>
            {score.level === 'full' ? 'All fields filled' : score.level === 'partial' ? 'Some fields filled' : 'Thin evidence'}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1.5">
          {score.checks.map((c) => (
            <div key={c.key} className="flex items-start gap-1.5 text-[11px]">
              {c.ok ? <CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" /> : <Circle size={13} className="text-slate-300 shrink-0 mt-0.5" />}
              <div className="min-w-0">
                <div className={cn('font-medium', c.ok ? 'text-slate-800' : 'text-slate-500')}>{c.label}</div>
                <div className="text-slate-500 leading-snug">{c.detail}</div>
                {c.ok && c.proxy && <div className="text-amber-600 leading-snug">Proxy: {c.proxy}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-1 border-b border-slate-200">
        {(['fibre', 'evidence'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-2 text-[13px] font-semibold capitalize border-b-2 -mb-px', tab === t ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>
            {t === 'fibre' ? 'Fibre source & origin' : 'Evidence & sources'}
          </button>
        ))}
      </div>

      {tab === 'fibre' ? (
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          {/* composition */}
          <Card className="p-5">
            <h3 className="text-[15px] font-bold text-slate-900">Fibre source</h3>
            {split ? (
              <>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  {product.contentDeclaration!.declaredUnit}
                  {product.contentDeclaration!.dataYear && ` · data year ${product.contentDeclaration!.dataYear}`}
                </p>
                <div className="flex h-8 rounded-lg overflow-hidden mb-1">
                  {split.lines.map((l) => (
                    <div
                      key={l.label}
                      title={`${l.label}: ${l.pct}%`}
                      className="h-full flex items-center justify-center text-[11px] font-semibold text-white"
                      style={{
                        width: `${l.pct}%`,
                        background: l.isFibre ? FIBRE_COLOUR[l.fibreType ?? 'virgin_wood'] : `repeating-linear-gradient(135deg, ${NONFIBRE_COLOUR} 0 5px, #ececec 5px 10px)`,
                        color: l.isFibre ? '#fff' : '#6c7783',
                      }}
                    >
                      {l.pct >= 10 && `${l.pct}%`}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-3">
                  <span>Fibre {split.fibre}% of product mass</span>
                  <span>Non-fibre {split.nonFibre}%</span>
                </div>
                <ul className="flex flex-col">
                  {split.lines.map((l) => (
                    <li key={l.label} className="flex items-start gap-2.5 py-1.5 border-b border-slate-100 last:border-0">
                      <span
                        className="w-2.5 h-2.5 rounded-[3px] mt-1 shrink-0"
                        style={{ background: l.isFibre ? FIBRE_COLOUR[l.fibreType ?? 'virgin_wood'] : NONFIBRE_COLOUR }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[13px] text-slate-800">{l.label}</span>
                          <span className="text-[13px] font-bold text-slate-900 tabular-nums">{l.pct}%</span>
                          {l.kgPerTonne && <span className="text-[11px] text-slate-400">{l.kgPerTonne} kg/t</span>}
                        </div>
                        {l.note && <div className="text-[11px] text-slate-500">{l.note}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-lg bg-cream-100 p-3 text-[12px]">
                  <div className="font-semibold text-slate-800 mb-1.5">Of the fibre</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <Cell label="Virgin wood" value={`${product.composition.virginWoodPct}%`} colour="#282727" />
                    <Cell label="Recycled" value={`${product.composition.recycledPct}%`} colour="#009a7e" />
                    <Cell label="Next Gen" value={`${product.composition.nextGenPct}%`} colour="#6a47ea" />
                    <Cell label="FSC / PEFC certified" value={certified && certified.value !== null ? `${certified.value}%` : 'Unknown'} colour="#f2b53a" q={certified} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">{product.composition.basis}</p>
                </div>
                <div className="mt-2">
                  <EvidenceBadge source={data.sources.find((s) => s.id === product.contentDeclaration!.sourceId)} size="xs" label="Content declaration" />
                </div>
              </>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-[12px] text-slate-500">
                No content declaration found for this grade.
              </div>
            )}
          </Card>

          {/* spatial */}
          <Card className="p-5">
            <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin size={15} className="text-green-600" /> Where the fibre comes from
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-3">EUDR Article 12(4) declaration. No tonnage per country is disclosed.</p>
            {bubbles.length ? (
              <>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white" style={{ height: 210 }}>
                  <SvgWorldMap markers={[]} bubbles={bubbles.map((b) => ({ ...b, radius: 7 }))} highlightById={highlightById} landColour="#e4e7ea" fitToIds={bubbles.map((b) => b.m49)} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {origins.map((o) => (
                    <span key={o!.id} className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 text-green-700 px-2.5 py-1 text-[12px]">
                      <MapPin size={11} /> {o!.name}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-[12px] text-slate-500">Not declared for this product.</div>
            )}

            <div className="mt-4 flex flex-col gap-2.5">
              <Chain icon={<Trees size={14} />} label="Forest" value={origins.length ? `${origins.length} declared countries` : 'Unknown'} ok={!!origins.length} sub={product.species?.join(' · ')} />
              <Chain icon={<Factory size={14} />} label="Pulp mill" value={pulps.length ? pulps.map((f) => f!.name).join(', ') : 'Not identified'} ok={!!pulps.length} />
              <Chain icon={<Factory size={14} />} label="Board mill" value={mill ? `${mill.name}, ${mill.country}` : 'Not identified'} ok={!!mill} />
              <Chain icon={<Leaf size={14} />} label="Product" value={product.name} ok />
            </div>
          </Card>

          {/* alternatives */}
          <Card className="p-5 lg:col-span-2 bg-brand-50/60 border-brand-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Alternative Canopy solutions</h3>
                <p className="text-[12px] text-slate-600 mt-0.5">
                  {product.composition.virginWoodPct}% virgin wood fibre
                  {volume && volume.value !== null && <> across ~{volume.value} {volume.unit}/yr</>}. Candidates below are leads, not confirmed matches.
                </p>
              </div>
              <button onClick={onOpenTransition} className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 text-[13px]">
                Assess a transition <ArrowRight size={15} />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-2.5 mt-3">
              {solutions.slice(0, 3).map((s) => {
                const src = data.sources.find((x) => x.id === s.sourceIds[0])
                return (
                  <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[13px] font-semibold text-slate-900">{s.provider ?? s.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.feedstock}</div>
                    <div className="text-[11px] text-slate-500">
                      {s.geography === 'global' ? 'Global' : s.geography === 'unknown' ? 'Geography unknown' : s.geography.join(', ')} · capacity {s.capacity ?? 'unknown'}
                    </div>
                    {src && <div className="mt-2"><EvidenceBadge source={src} size="xs" label={s.status === 'verified' ? 'Verified' : s.status === 'listing_supplied' ? 'Listing supplied' : 'Illustrative'} /></div>}
                  </div>
                )
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex gap-1.5">
              <Info size={12} className="shrink-0 mt-0.5" />
              Technical, volume and commercial fit are unassessed.
            </p>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-up">
          {product.sourceIds.map((id) => {
            const s = data.sources.find((x) => x.id === id)
            if (!s) return null
            return (
              <div key={id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[13px] font-semibold text-slate-900">{s.title}</span>
                  <EvidenceBadge source={s} label={s.accessed ? 'Accessed' : 'Not accessed'} size="xs" />
                </div>
                <div className="text-[12px] text-slate-500 mt-0.5">{s.page}</div>
                {s.passage && <blockquote className="text-[12px] text-slate-600 italic border-l-2 border-brand-200 pl-2 mt-2">{s.passage}</blockquote>}
                {s.limitations && <p className="text-[12px] text-amber-700 mt-1.5">Limitations: {s.limitations}</p>}
              </div>
            )
          })}
          {product.notes && (
            <div className="rounded-xl bg-cream-100 border border-cream-200 px-4 py-3 text-[12px] text-slate-700">{product.notes}</div>
          )}
        </div>
      )}
    </div>
  )
}

function Cell({ label, value, colour, q }: { label: string; value: string; colour: string; q?: { id: string } }) {
  const { data } = useStore()
  const quantity = q ? data.quantities.find((x) => x.id === q.id) : undefined
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: colour }} />
      <span className="text-slate-600 flex-1">{label}</span>
      <span className={cn('font-bold', value === 'Unknown' ? 'text-slate-400 italic' : 'text-slate-900')}>{value}</span>
      {quantity && <EvidenceBadge quantity={quantity} size="xs" label="" className="px-1" />}
    </div>
  )
}

function Chain({ icon, label, value, ok, sub }: { icon: React.ReactNode; label: string; value: string; ok: boolean; sub?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', ok ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400')}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{label}</div>
        <div className={cn('text-[13px]', ok ? 'text-slate-800 font-medium' : 'text-slate-400 italic')}>{value}</div>
        {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
      </div>
    </div>
  )
}
