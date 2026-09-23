import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Boxes, Layers, Package, Recycle, Shirt, TreePine, Leaf } from 'lucide-react'
import type { Confidence } from '@/data/types'
import { HM_COVERAGE, HM_DATA_GAPS, HM_EVIDENCE, HM_OPPORTUNITIES, HM_PATHWAYS, HM_STREAMS, HM_GEO_POINTS } from '@/data/hm'
import { ECOPAPER_ALTERNATIVES } from '@/data/ecopaper'
import { Card, CardHeader } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { InfoButton } from '@/components/ui/InfoButton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { MetricCard } from '@/components/company/MetricCard'
import { MaterialDonut, type DonutSlice } from '@/components/company/MaterialDonut'
import { CoverageBar } from '@/components/company/CoverageBar'
import { SupplyChainFlow } from '@/components/company/SupplyChainFlow'
import { WorldMap, type MapMarker } from '@/components/company/WorldMap'
import { AlternativeCard } from '@/components/company/AlternativeCard'
import { TransitionOpportunityCard } from '@/components/company/TransitionOpportunityCard'
import { useUI } from '@/context/UIContext'
import { fmtNum } from '@/lib/format'

type View = 'all' | 'products' | 'packaging'

export function OverviewTab({ companyId }: { companyId: string }) {
  const nav = useNavigate()
  const { openActionPlan } = useUI()
  const [view, setView] = useState<View>('all')
  const [filter, setFilter] = useState<Confidence | null>(null)
  const [focus, setFocus] = useState<'packaging' | 'mmcf'>('packaging')

  const products = HM_STREAMS[0]
  const packaging = HM_STREAMS[1]

  const slices: DonutSlice[] =
    view === 'all'
      ? [
          ...products.materials.map((m) => ({ id: `products:${m.id}`, name: m.shortName ?? m.name, pct: +((m.sharePct * 0.85).toFixed(1)), colour: m.colour, forestLinked: m.forestLinked, focus: m.focus, tonnesLabel: m.derivedTonnes.display })).filter((s) => s.pct >= 0.5),
          { id: 'packaging:paper_cardboard', name: 'Paper+card (pkg)', pct: +((81 * 0.15).toFixed(1)), colour: '#009a7e', forestLinked: true, tonnesLabel: HM_EVIDENCE.paper_cardboard_t.display },
          { id: 'packaging:other', name: 'Other (pkg)', pct: +((19 * 0.15).toFixed(1)), colour: '#99d7c8', tonnesLabel: undefined },
        ]
      : (view === 'products' ? products : packaging).materials.map((m) => ({ id: `${view}:${m.id}`, name: m.shortName ?? m.name, pct: m.sharePct, colour: m.colour, forestLinked: m.forestLinked, focus: m.focus, tonnesLabel: m.derivedTonnes.display }))

  const centre = view === 'all' ? `${fmtNum(HM_EVIDENCE.total_tracked.value)} t` : view === 'products' ? `${fmtNum(products.tonnes.value)} t` : `${fmtNum(packaging.tonnes.value)} t`

  const onSlice = (id: string) => {
    const [stream, mat] = id.split(':')
    if (mat === 'other') return nav(`/companies/${companyId}/materials?stream=packaging`)
    nav(`/companies/${companyId}/materials?stream=${stream}&material=${mat}`)
  }

  const overviewPathway = { ...HM_PATHWAYS.hm_packaging_incumbent, nodes: HM_PATHWAYS.hm_packaging_incumbent.nodes.filter((n) => !['customer', 'end_of_life', 'pulp'].includes(n.stage)) }
  const keyGaps = HM_DATA_GAPS.filter((g) => g.priority === 'high').slice(0, 4)

  const mapMarkers: MapMarker[] = HM_GEO_POINTS.filter((p) => p.layer === 'hm_tier1').map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.label,
    sublabel: p.sublabel,
    colour: p.confidence === 'verified' ? '#282727' : '#00c1c6',
    kind: p.confidence === 'verified' ? 'major' : 'region',
    note: p.note,
  }))

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard evidence={HM_EVIDENCE.total_tracked} icon={<Layers size={22} />} label="Total tracked material (2025)" />
        <MetricCard
          evidence={HM_EVIDENCE.product_material}
          icon={<Shirt size={22} />}
          iconBg="bg-inferred-50 text-inferred-600"
          label="Product materials"
          aside="85%"
          onClick={() => nav(`/companies/${companyId}/materials?stream=products`)}
        />
        <MetricCard
          evidence={HM_EVIDENCE.packaging_material}
          icon={<Package size={22} />}
          iconBg="bg-amber-100 text-amber-600"
          label="Packaging materials"
          aside="15%"
          asideTone="text-amber-500"
          onClick={() => nav(`/companies/${companyId}/materials?stream=packaging`)}
        />
        <MetricCard evidence={HM_EVIDENCE.recycled_total} icon={<Recycle size={22} />} iconBg="bg-teal-300/50 text-brand-800" label="Total recycled material" aside="35%" className="bg-brand-50 border-brand-200" />
      </div>
      <p className="text-[11px] text-slate-500 -mt-2 px-1">Tracked ≠ traced. Tonnes above are reported by H&M; the level of traceability differs by material and is shown separately.</p>

      {/* Row 2 */}
      <div className="grid xl:grid-cols-[440px_minmax(0,1fr)] gap-4">
        <Card>
          <CardHeader
            title="Material Breakdown"
            subtitle="Share of total tracked material (2025)"
            info={<InfoButton evidence={HM_EVIDENCE.total_tracked} />}
          />
          <div className="px-5 pb-4">
            <div className="flex gap-1.5 mb-3">
              {(['all', 'products', 'packaging'] as View[]).map((v) => (
                <Pill key={v} active={view === v} onClick={() => setView(v)}>
                  {v === 'all' ? 'All Materials' : v === 'products' ? 'Product Materials' : 'Packaging Materials'}
                </Pill>
              ))}
            </div>
            <MaterialDonut slices={slices} centreValue={centre} centreLabel={view === 'all' ? 'total' : `${view === 'products' ? 85 : 15}% of total`} onSelect={onSlice} height={190} />
            <div className="flex items-center justify-between mt-3 text-[12px]">
              <span className="inline-flex items-center gap-1 text-brand-700"><TreePine size={12} /> = brand-linked · lime ring = Canopy focus</span>
              <Link to={`/companies/${companyId}/materials`} className="font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                View detailed breakdown <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={<span>Supply Chain <span className="text-slate-400 font-normal text-[13px]">(paper/cardboard packaging)</span></span>}
            subtitle="Click a node for evidence, gaps and next action. Use the coverage bar to filter."
            info={<InfoButton evidence={HM_EVIDENCE.coverage_illustrative} />}
            action={
              <Link to={`/companies/${companyId}/supply-chain`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                View details <ArrowRight size={13} />
              </Link>
            }
          />
          <div className="px-5 pb-4">
            <SupplyChainFlow pathway={overviewPathway} filter={filter} size="sm" />
            <div className="grid lg:grid-cols-[1fr_260px] gap-3 mt-3">
              <CoverageBar coverage={HM_COVERAGE} filter={filter} onFilter={setFilter} title="Data coverage for H&M's brand-material supply chain" />
              <div className="rounded-xl bg-cream-100 border border-cream-200 px-4 py-3">
                <div className="text-[13px] font-semibold text-slate-800 mb-1.5">Key data gaps</div>
                <ul className="flex flex-col gap-1 text-[12px] text-slate-600">
                  {keyGaps.map((g) => (
                    <li key={g.id} className="flex gap-1.5">
                      <span className="text-amber-500">▸</span> {g.field}
                    </li>
                  ))}
                </ul>
                <Link to={`/companies/${companyId}/supply-chain#gaps`} className="text-[11px] font-semibold text-brand-700 mt-2 inline-block hover:underline">
                  Research queue ({HM_DATA_GAPS.length}) →
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            title="Manufacturing Footprint"
            subtitle="H&M disclosed supplier geography"
            info={<InfoButton evidence={HM_EVIDENCE.tier1_count} />}
            action={
              <Link to={`/companies/${companyId}/geography`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                View map <ArrowRight size={13} />
              </Link>
            }
          />
          <div className="px-5 pb-4">
            <WorldMap markers={mapMarkers.filter((m) => m.kind === 'major')} height={170} basemap="svg" showLabels={false} highlight={{ China: '#282727', Bangladesh: '#282727', Sweden: '#8b70ee' }} />
            <ul className="mt-3 text-[12px] flex flex-col gap-1">
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-800" /> China</span><span className="text-slate-500">Major production market</span></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-800" /> Bangladesh</span><span className="text-slate-500">Major production market</span></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-brand-500" /> Europe · Asia · N. America</span><span className="text-slate-500">Disclosed Tier 1 regions</span></li>
            </ul>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-800">{HM_EVIDENCE.tier1_count.display} Tier 1 factories</span> · {HM_EVIDENCE.suppliers_count.display} suppliers
              <ConfidenceBadge level="verified" size="xs" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Country-level factory counts not loaded — see supplier dataset.</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Material Focus Areas" subtitle="Forest-linked materials Canopy can act on" />
          <div className="px-5 pb-4">
            <div className="flex gap-1.5 mb-3">
              <Pill active={focus === 'packaging'} onClick={() => setFocus('packaging')}>Packaging</Pill>
              <Pill active={focus === 'mmcf'} onClick={() => setFocus('mmcf')}>Wood + MMCF (Fashion)</Pill>
            </div>
            {focus === 'packaging' ? (
              <div className="rounded-xl border border-slate-200 p-4 animate-fade-up">
                <div className="flex items-center gap-2 mb-2">
                  <Boxes size={16} className="text-brand-700" />
                  <span className="text-[13px] font-semibold text-slate-900">Paper & Cardboard Packaging</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><ProgressBar segments={[{ pct: 81, colour: '#282727' }]} height={12} /></div>
                  <div className="text-right text-[12px] leading-tight">
                    <div className="font-semibold text-slate-900">81% of packaging</div>
                    <div className="text-slate-500 inline-flex items-center gap-1">≈{HM_EVIDENCE.paper_cardboard_t.display?.replace('~', '')} <InfoButton evidence={HM_EVIDENCE.paper_cardboard_t} size={11} /></div>
                  </div>
                </div>
                <ul className="mt-3 text-[12px] flex flex-col gap-1.5">
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-brand-600" /><b>52%</b> recycled (≈{fmtNum(HM_EVIDENCE.paper_cardboard_recycled_t.value)} t) <InfoButton evidence={HM_EVIDENCE.paper_cardboard_recycled_t} size={11} /></li>
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-amber-400" /><b>48%</b> non-recycled (≈{fmtNum(HM_EVIDENCE.paper_cardboard_nonrecycled_t.value)} t) <InfoButton evidence={HM_EVIDENCE.paper_cardboard_nonrecycled_t} size={11} /></li>
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-teal-400" /><b>88%</b> of virgin paper FSC-certified (100% from Dec 2025) <InfoButton evidence={HM_EVIDENCE.virgin_paper_fsc_pct} size={11} /></li>
                </ul>
                <div className="mt-3 flex items-center justify-between">
                  <ConfidenceBadge level="inferred" label="Derived volumes" size="xs" />
                  <Link to={`/companies/${companyId}/materials?stream=packaging&material=paper_cardboard`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                    Explore packaging in detail <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-4 animate-fade-up">
                <div className="flex items-center gap-2 mb-2">
                  <TreePine size={16} className="text-brand-700" />
                  <span className="text-[13px] font-semibold text-slate-900">Wood + Man-made cellulosic fibres</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><ProgressBar segments={[{ pct: 8, colour: '#f2b53a' }]} height={12} /></div>
                  <div className="text-right text-[12px] leading-tight">
                    <div className="font-semibold text-slate-900">8% of products</div>
                    <div className="text-slate-500 inline-flex items-center gap-1">≈{HM_EVIDENCE.wood_mmcf_t.display?.replace('~', '')} <InfoButton evidence={HM_EVIDENCE.wood_mmcf_t} size={11} /></div>
                  </div>
                </div>
                <ul className="mt-3 text-[12px] flex flex-col gap-1.5">
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-brand-600" /><b>100%</b> of virgin MMCF FSC/PEFC-certified (2025) <InfoButton evidence={HM_EVIDENCE.virgin_mmcf_certified_pct} size={11} /></li>
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] border border-dashed border-slate-400" />Producer list, fibre-type split, Next Gen share — <i>unknown</i></li>
                  <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-[3px] bg-inferred-500" />≈6.8% of combined tracked material</li>
                </ul>
                <div className="mt-3 flex items-center justify-between">
                  <ConfidenceBadge level="inferred" label="Derived volume" size="xs" />
                  <Link to={`/companies/${companyId}/materials?stream=products&material=wood_mmcf`} className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                    Explore MMCF pathway <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Possible Alternatives"
            subtitle="Candidate options from the EcoPaper Database — not recommendations"
            action={
              <Link to="/ecopaper" className="text-[12px] font-semibold text-brand-700 inline-flex items-center gap-1 hover:underline">
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <div className="px-5 pb-4 flex flex-col gap-2">
            {ECOPAPER_ALTERNATIVES.map((a) => (
              <AlternativeCard key={a.id} alt={a} compact onSelect={() => nav(`/companies/${companyId}/materials?stream=packaging&material=paper_cardboard&alt=${a.id}`)} />
            ))}
            <p className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1"><Leaf size={10} /> Candidates are leads until technical/commercial qualification.</p>
          </div>
        </Card>
      </div>

      {/* Row 4 */}
      <Card>
        <CardHeader title="Top Transition Opportunities" subtitle="Based on available data — each is gated on information Canopy does not yet hold" info={<InfoButton evidence={HM_EVIDENCE.paper_cardboard_nonrecycled_t} />} />
        <div className="px-5 pb-5 grid lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-stretch">
          {HM_OPPORTUNITIES.slice(0, 3).map((o) => (
            <TransitionOpportunityCard key={o.id} opp={o} compact onOpen={() => nav(`/companies/${companyId}/opportunities#${o.id}`)} />
          ))}
          <Button className="self-center h-12 px-5" icon={<ArrowRight size={16} />} onClick={() => openActionPlan('H&M overview')}>
            Create Action Plan
          </Button>
        </div>
      </Card>
    </div>
  )
}
