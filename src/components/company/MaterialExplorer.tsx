import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, GitBranch, Package, Shirt, TreePine, FlaskConical, Map as MapIcon, Recycle } from 'lucide-react'
import type { MaterialStream } from '@/data/types'
import { HM_STREAMS, HM_EVIDENCE } from '@/data/hm'
import { ECOPAPER_ALTERNATIVES, ECOPAPER_GEO, HM_MAJOR_MARKETS } from '@/data/ecopaper'
import { HM_GEO_POINTS } from '@/data/hm'
import { alternativePathwaysFor, gapsFor, getStream, pathwayFor, resolveMaterial, TOTAL } from '@/lib/hierarchy'
import { fmtNum } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { InfoButton } from '@/components/ui/InfoButton'
import { ConfidenceBadge, ConfidenceLegend } from '@/components/ui/ConfidenceBadge'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DenominatorBar } from './DenominatorBar'
import { FootprintTree } from './FootprintTree'
import { MaterialDonut, type DonutSlice } from './MaterialDonut'
import { CoverageBar } from './CoverageBar'
import { SupplyChainMini } from './SupplyChainFlow'
import { DataGapCard } from './DataGapCard'
import { AlternativeCard } from './AlternativeCard'
import { AlternativeComparison } from './AlternativeComparison'
import { WorldMap, type MapMarker } from './WorldMap'
import { useUI } from '@/context/UIContext'
import { cn } from '@/lib/cn'

export function MaterialExplorer({ companyId }: { companyId: string }) {
  const [params, setParams] = useSearchParams()
  const streamId = params.get('stream')
  const materialId = params.get('material')
  const altId = params.get('alt')
  const { openActionPlan } = useUI()

  const stream = getStream(streamId)
  const selected = useMemo(() => resolveMaterial(stream, materialId), [stream, materialId])
  const pathway = pathwayFor(selected)
  const altPathways = alternativePathwaysFor(selected)
  const alt = ECOPAPER_ALTERNATIVES.find((a) => a.id === altId) ?? null

  const go = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    setParams(p)
  }
  const onCompany = () => go({ stream: null, material: null, alt: null })
  const onStream = (id: MaterialStream['id']) => go({ stream: id, material: null, alt: null })
  const onMaterial = (sid: MaterialStream['id'], id: string) => go({ stream: sid, material: id, alt: null })

  return (
    <div className="flex flex-col gap-4">
      <DenominatorBar stream={stream} selected={selected} onCompany={onCompany} onStream={onStream} />

      <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
        <FootprintTree streamId={streamId} materialId={materialId} onCompany={onCompany} onStream={onStream} onMaterial={onMaterial} />

        <div className="flex flex-col gap-4 min-w-0">
          {/* LEVEL 0 — company */}
          {!stream && (
            <div className="animate-fade-up flex flex-col gap-4">
              <Card className="p-5">
                <CardHeader title="Where does H&M's tracked material go?" subtitle="Two streams. Click one to open its material categories." className="px-0 pt-0" />
                <MaterialDonut
                  slices={HM_STREAMS.map<DonutSlice>((s) => ({ id: s.id, name: s.name, pct: s.shareOfTotalPct, colour: s.id === 'products' ? '#282727' : '#6a47ea', tonnesLabel: `${fmtNum(s.tonnes.value)} t` }))}
                  centreValue={`${fmtNum(TOTAL.value)} t`}
                  centreLabel="tracked (2025)"
                  onSelect={(id) => onStream(id as MaterialStream['id'])}
                  height={200}
                />
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                {HM_STREAMS.map((s) => {
                  const Icon = s.icon === 'shirt' ? Shirt : Package
                  const forest = s.materials.filter((m) => m.forestLinked).reduce((a, m) => a + m.sharePct, 0)
                  return (
                    <button key={s.id} onClick={() => onStream(s.id)} className="card text-left p-5 hover:border-brand-400 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
                          <Icon size={22} />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-slate-900">
                            {fmtNum(s.tonnes.value)} t <span className="text-brand-600 text-base">· {s.shareOfTotalPct}%</span>
                          </div>
                          <div className="text-[13px] text-slate-500">{s.name}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[12px]">
                        <span className="inline-flex items-center gap-1 text-brand-700 font-medium">
                          <TreePine size={13} /> ~{forest}% brand-linked share
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-brand-700">
                          Explore <ArrowRight size={13} />
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-[12px] text-slate-500 px-1">
                Tracked ≠ traced. A tonne appearing here means H&M reports it; it does not mean Canopy knows where it came from. Traceability is shown per material.
              </p>
            </div>
          )}

          {/* LEVEL 1 — stream */}
          {stream && !selected && (
            <div className="animate-fade-up flex flex-col gap-4">
              <Card className="p-5">
                <CardHeader
                  title={`${stream.name} — ${fmtNum(stream.tonnes.value)} t`}
                  subtitle="Share of stream, 2025. Click a material to fan out into its supply chain. Forest-linked materials are marked."
                  className="px-0 pt-0"
                  info={<InfoButton evidence={stream.tonnes} />}
                />
                <MaterialDonut
                  slices={stream.materials.map<DonutSlice>((m) => ({ id: m.id, name: m.name, pct: m.sharePct, colour: m.colour, forestLinked: m.forestLinked, focus: m.focus, tonnesLabel: m.derivedTonnes.display }))}
                  centreValue={`${stream.shareOfTotalPct}%`}
                  centreLabel="of total tracked"
                  onSelect={(id) => onMaterial(stream.id, id)}
                  height={230}
                />
                <p className="text-[11px] text-slate-400 mt-3">Percentages are rounded in the source and may not sum to exactly 100%.</p>
              </Card>

              {stream.groupings?.map((g) => (
                <button key={g.id} onClick={() => onMaterial(stream.id, g.id)} className="card p-5 text-left hover:border-brand-400 transition-colors ring-1 ring-teal-400/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-600 flex items-center gap-1">
                        <TreePine size={11} /> Canopy focus — brand-linked
                      </div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {g.name} · {g.sharePct}% of {stream.id}
                      </div>
                      <div className="text-[13px] text-slate-500 inline-flex items-center gap-1">
                        {g.derivedTonnes.display} — approximate, derived from reported shares <InfoButton evidence={g.derivedTonnes} size={12} />
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-brand-600 shrink-0" />
                  </div>
                  {g.recycledPct && (
                    <div className="mt-3">
                      <ProgressBar segments={[{ pct: g.recycledPct.value, colour: '#009a7e', label: 'Recycled' }, { pct: 100 - g.recycledPct.value, colour: '#f2b53a', label: 'Non-recycled', pattern: 'hatched' }]} height={8} />
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>{g.recycledPct.value}% recycled</span>
                        <span>{100 - g.recycledPct.value}% non-recycled</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}

              {stream.id === 'products' && (
                <button onClick={() => onMaterial('products', 'wood_mmcf')} className="card p-5 text-left hover:border-brand-400 transition-colors ring-1 ring-teal-400/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-600 flex items-center gap-1">
                        <TreePine size={11} /> Canopy focus — brand-linked
                      </div>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">Wood + MMCF · 8% of products</div>
                      <div className="text-[13px] text-slate-500 inline-flex items-center gap-1">
                        {HM_EVIDENCE.wood_mmcf_t.display} — approximate volume derived from reported material share <InfoButton evidence={HM_EVIDENCE.wood_mmcf_t} size={12} />
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-brand-600 shrink-0" />
                  </div>
                </button>
              )}
            </div>
          )}

          {/* LEVEL 2 — material */}
          {stream && selected && (
            <div className="animate-fade-up flex flex-col gap-4">
              <Card className="p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-3 h-3 rounded-[4px]" style={{ background: selected.colour }} />
                      <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                      {selected.forestLinked ? (
                        <Pill tone="forest">
                          <TreePine size={11} /> Forest-linked
                        </Pill>
                      ) : (
                        <Pill tone="grey">Not brand-linked</Pill>
                      )}
                      <ConfidenceBadge level={selected.derivedTonnes.confidence} label="Derived volume" size="xs" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900 tracking-tight">{selected.derivedTonnes.display ?? `~${fmtNum(selected.derivedTonnes.value)} t`}</span>
                      <InfoButton evidence={selected.derivedTonnes} />
                    </div>
                    <div className="text-[12px] text-inferred-600 mt-0.5">Approximate volume derived from reported material share — not reported H&M tonnage.</div>
                    <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm">
                      <div className="rounded-lg bg-cream-100 px-3 py-2">
                        <div className="text-lg font-bold text-slate-900">{selected.sharePct}%</div>
                        <div className="text-[11px] text-slate-500">of {stream.id === 'products' ? 'product material' : 'packaging'}</div>
                      </div>
                      <div className="rounded-lg bg-cream-100 px-3 py-2">
                        <div className="text-lg font-bold text-slate-900">{selected.shareOfTotalPct.toFixed(1)}%</div>
                        <div className="text-[11px] text-slate-500">of combined tracked material</div>
                      </div>
                    </div>
                    {selected.notes && <p className="text-[13px] text-slate-600 mt-4 max-w-xl">{selected.notes}</p>}
                  </div>
                  {selected.traceability && (
                    <div className="md:w-[340px]">
                      <CoverageBar coverage={selected.traceability} title="How much can we trace?" compact />
                    </div>
                  )}
                </div>
              </Card>

              {/* Packaging recycled split */}
              {selected.grouping?.recycledPct && selected.grouping.nonRecycledTonnes && (
                <Card className="p-5">
                  <CardHeader title="Recycled vs non-recycled" subtitle="Reported shares applied to the derived paper/cardboard volume." className="px-0 pt-0" />
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    <div className="flex-1 w-full">
                      <div className="text-2xl font-bold text-slate-900 mb-2">
                        {selected.grouping.derivedTonnes.display} <span className="text-base text-slate-500 font-medium">paper + cardboard</span>
                      </div>
                      <ProgressBar
                        segments={[
                          { pct: selected.grouping.recycledPct.value, colour: '#009a7e', label: 'Recycled' },
                          { pct: 100 - selected.grouping.recycledPct.value, colour: '#f2b53a', label: 'Non-recycled', pattern: 'hatched' },
                        ]}
                        height={22}
                        rounded
                      />
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3">
                          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold text-brand-600">
                            <Recycle size={11} /> Recycled
                          </div>
                          <div className="text-xl font-bold text-brand-800">{selected.grouping.recycledPct.value}%</div>
                          <div className="text-[12px] text-slate-600 inline-flex items-center gap-1">
                            {selected.grouping.recycledTonnes?.display} <InfoButton evidence={selected.grouping.recycledTonnes!} size={12} />
                          </div>
                        </div>
                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                          <div className="text-[10px] uppercase tracking-wide font-semibold text-amber-600">Non-recycled</div>
                          <div className="text-xl font-bold text-amber-600">{100 - selected.grouping.recycledPct.value}%</div>
                          <div className="text-[12px] text-slate-600 inline-flex items-center gap-1">
                            {selected.grouping.nonRecycledTonnes.display} <InfoButton evidence={selected.grouping.nonRecycledTonnes} size={12} />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">Approximate, derived from reported shares. The ~34.7k t is a transition signal — not a replaceable volume.</p>
                    </div>
                    <div className="md:w-[260px] w-full rounded-xl bg-cream-100 border border-cream-200 p-4 text-[12px] flex flex-col gap-2">
                      <div className="font-semibold text-slate-900">Virgin fibre sourcing</div>
                      <Fact label="Virgin paper/cardboard FSC-certified (2025)" value="88%" evidenceId="virgin_paper_fsc_pct" />
                      <Fact label="From Dec 2025 (reported commitment)" value="100% FSC" evidenceId="virgin_paper_fsc_pct" />
                      <Fact label="All packaging recycled or sustainably sourced" value="86%" evidenceId="packaging_recycled_or_sustainable_pct" />
                      <Fact label="All packaging recycled" value="51%" evidenceId="packaging_recycled_pct" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Non-forest material: keep perspective, stop here */}
              {!selected.forestLinked && (
                <Card className="p-5 border-dashed">
                  <div className="text-sm font-semibold text-slate-900">Outside Canopy's brand-material scope</div>
                  <p className="text-[13px] text-slate-600 mt-1">
                    {selected.name} is not brand-linked, so no forest supply-chain pathway is modelled. It is shown here so the denominator stays honest:{' '}
                    <span className="font-medium text-slate-900">{selected.sharePct}%</span> of {stream.id} and{' '}
                    <span className="font-medium text-slate-900">{selected.shareOfTotalPct.toFixed(1)}%</span> of H&M's combined tracked material.
                  </p>
                </Card>
              )}

              {/* Material flow: incumbent vs alternative */}
              {pathway && (
                <Card className="p-5">
                  <CardHeader
                    title="Material flow — incumbent vs potential transition"
                    subtitle="Click any stage to see what is known, what is missing and the next research action."
                    className="px-0 pt-0"
                    action={
                      <Link to={`/companies/${companyId}/supply-chain?pathway=${pathway.id}`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                        <GitBranch size={13} /> Open full supply chain
                      </Link>
                    }
                  />
                  <ConfidenceLegend className="mb-3" />
                  <div className={cn('grid gap-4', altPathways.length ? 'md:grid-cols-2' : '')}>
                    <div className="rounded-xl border border-slate-200 bg-cream-50 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 bg-slate-800 text-white">Incumbent</span>
                        <span className="text-[11px] text-slate-500 truncate">{pathway.materialLabel}</span>
                      </div>
                      <SupplyChainMini pathway={{ ...pathway, nodes: pathway.nodes.filter((n) => !['customer', 'end_of_life'].includes(n.stage)) }} />
                    </div>
                    {altPathways.map((ap) => (
                      <div key={ap.id} className="rounded-xl border border-teal-500/40 bg-teal-300/10 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 bg-teal-400 text-brand-900">Potential transition</span>
                          <span className="text-[11px] text-slate-500 truncate">{ap.materialLabel}</span>
                        </div>
                        <SupplyChainMini pathway={ap} />
                        <p className="text-[10px] text-slate-500 mt-2">Candidate route only — validation required before any replacement claim.</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Wood/MMCF strategic question */}
              {selected.id === 'wood_mmcf' && (
                <Card className="p-5 bg-brand-800 text-white border-brand-800">
                  <div className="flex items-start gap-3">
                    <FlaskConical size={22} className="text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-200">Strategic question</div>
                      <div className="text-lg font-semibold leading-snug mt-0.5">Where can Next Gen fibre replace virgin brand-derived MMCF?</div>
                      <p className="text-[13px] text-brand-100 mt-2 max-w-2xl">
                        100% of virgin MMCF was FSC/PEFC-certified in 2025 — a strong baseline. The next step is not certification but feedstock: which producers supply H&M, and how much of their output can move to recycled-textile or agricultural-residue pulp. This connects to Canopy's Hot Button and Next Gen data rather than EcoPaper.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link to="/nextgen" className="inline-flex items-center gap-1 text-[12px] font-semibold bg-teal-400 text-brand-900 rounded-lg px-3 py-1.5">
                          Next Gen Solutions <ArrowRight size={13} />
                        </Link>
                        <Button variant="secondary" size="sm" className="bg-brand-700 border-brand-600 text-white hover:text-white hover:border-teal-400" onClick={() => openActionPlan('Wood + MMCF → Next Gen')}>
                          Create Action
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Alternatives for packaging grouping */}
              {selected.grouping && (
                <Card className="p-5">
                  <CardHeader
                    title="Possible alternatives"
                    subtitle="Candidate EcoPaper listings — leads until technical and commercial qualification. Not confirmed H&M suppliers."
                    className="px-0 pt-0"
                    action={
                      <Link to="/ecopaper" className="text-[12px] font-semibold text-brand-700 hover:underline">
                        Open EcoPaper Database
                      </Link>
                    }
                  />
                  <div className="grid md:grid-cols-3 gap-3">
                    {ECOPAPER_ALTERNATIVES.filter((a) => a.canReplaceGroupingIds.includes(selected.id)).map((a) => (
                      <AlternativeCard key={a.id} alt={a} selected={altId === a.id} onSelect={(x) => go({ alt: altId === x.id ? null : x.id })} />
                    ))}
                  </div>
                </Card>
              )}

              {alt && selected.grouping && (
                <div className="animate-fade-up flex flex-col gap-4">
                  <Card className="p-5">
                    <CardHeader title={`Compare: incumbent vs ${alt.provider}`} subtitle="Match assessment is hypothesis-level until H&M data is obtained." className="px-0 pt-0" />
                    <AlternativeComparison grouping={selected.grouping} alt={alt} />
                  </Card>
                  <Card className="p-5">
                    <CardHeader
                      title="Potential geographic overlap"
                      subtitle="H&M major production markets vs candidate manufacturing locations. Overlap ≠ confirmed supplier replacement."
                      className="px-0 pt-0"
                      action={
                        <Link to={`/companies/${companyId}/geography?alt=${alt.id}`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                          <MapIcon size={13} /> Open map
                        </Link>
                      }
                    />
                    <WorldMap markers={overlapMarkers(alt.id)} height={300} basemap="svg" highlight={overlapHighlight(alt.id)} />
                    <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-800" /> H&M major production market</span>
                      <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rotate-45 bg-teal-500" /> Candidate manufacturing</span>
                      <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-800 ring-2 ring-teal-400" /> Potential overlap</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* Data gaps */}
              {selected.forestLinked && (
                <Card className="p-5">
                  <CardHeader
                    title="Research queue — what we still need"
                    subtitle="Each missing field is a task, not a footnote."
                    className="px-0 pt-0"
                    action={
                      <Button size="sm" variant="secondary" onClick={() => openActionPlan(selected.name)}>
                        Create Action Plan
                      </Button>
                    }
                  />
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {gapsFor([selected.id, ...(selected.grouping?.memberIds ?? [])]).slice(0, 6).map((g) => (
                      <DataGapCard key={g.id} gap={g} compact />
                    ))}
                  </div>
                  <Link to={`/companies/${companyId}/supply-chain?pathway=${pathway?.id ?? ''}#gaps`} className="text-[12px] font-semibold text-brand-700 mt-3 inline-flex items-center gap-1 hover:underline">
                    View all gaps <ArrowRight size={13} />
                  </Link>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Fact({ label, value, evidenceId }: { label: string; value: string; evidenceId: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900 inline-flex items-center gap-1">
        {value} <InfoButton evidence={evidenceId} size={11} />
      </span>
    </div>
  )
}

export function overlapHighlight(altId: string | null): Record<string, string> {
  const h: Record<string, string> = { China: '#282727', Bangladesh: '#282727' }
  const alt = ECOPAPER_ALTERNATIVES.find((a) => a.id === altId)
  if (alt && alt.manufacturingCountries !== 'global') alt.manufacturingCountries.forEach((c) => (h[c] = HM_MAJOR_MARKETS.includes(c) ? '#6d9a1f' : '#00c1c6'))
  return h
}

export function overlapMarkers(altId: string | null): MapMarker[] {
  const hm: MapMarker[] = HM_GEO_POINTS.filter((p) => p.layer === 'hm_tier1' && p.confidence === 'verified').map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.label,
    sublabel: p.sublabel,
    colour: '#282727',
    kind: 'major',
    note: p.note,
  }))
  const alt = ECOPAPER_ALTERNATIVES.find((a) => a.id === altId)
  if (!alt || alt.manufacturingCountries === 'global') return hm
  const altMarkers: MapMarker[] = alt.manufacturingCountries
    .filter((c) => ECOPAPER_GEO[c])
    .map((c) => ({
      id: `alt_${c}`,
      lat: ECOPAPER_GEO[c].lat + (HM_MAJOR_MARKETS.includes(c) ? -5 : 0),
      lng: ECOPAPER_GEO[c].lng + (HM_MAJOR_MARKETS.includes(c) ? 7 : 0),
      label: HM_MAJOR_MARKETS.includes(c) ? '' : `${alt.provider}: ${c}`,
      sublabel: `${alt.provider} manufacturing: ${c}`,
      colour: '#6a47ea',
      kind: 'alt',
      note: 'Candidate manufacturing (EcoPaper listing)',
    }))
  return [...hm.map((m) => ({ ...m, overlap: alt.manufacturingCountries !== 'global' && (alt.manufacturingCountries as string[]).includes(m.label) })), ...altMarkers]
}
