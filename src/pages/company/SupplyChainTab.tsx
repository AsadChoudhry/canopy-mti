import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Confidence } from '@/data/types'
import { HM_COVERAGE, HM_DATA_GAPS, HM_PATHWAYS } from '@/data/hm'
import { Card, CardHeader } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { ConfidenceLegend } from '@/components/ui/ConfidenceBadge'
import { CoverageBar } from '@/components/company/CoverageBar'
import { SupplyChainFlow } from '@/components/company/SupplyChainFlow'
import { DataGapCard } from '@/components/company/DataGapCard'
import { useUI } from '@/context/UIContext'
import { ArrowRight } from 'lucide-react'

const INCUMBENTS = [
  { id: 'hm_packaging_incumbent', label: 'Packaging — paper/cardboard', gapIds: ['paper_cardboard'] },
  { id: 'hm_mmcf_incumbent', label: 'Products — Wood/MMCF', gapIds: ['wood_mmcf'] },
]

export function SupplyChainTab() {
  const [params, setParams] = useSearchParams()
  const pathwayId = params.get('pathway') ?? 'hm_packaging_incumbent'
  const [filter, setFilter] = useState<Confidence | null>(null)
  const [showAlt, setShowAlt] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'high'>('all')
  const { openActionPlan } = useUI()

  const pathway = HM_PATHWAYS[pathwayId] ?? HM_PATHWAYS.hm_packaging_incumbent
  const alts = (pathway.alternativePathwayIds ?? []).map((id) => HM_PATHWAYS[id])
  const gapIds = INCUMBENTS.find((i) => i.id === pathway.id)?.gapIds ?? []
  const gaps = HM_DATA_GAPS.filter((g) => g.relatedMaterialIds.some((r) => gapIds.includes(r))).filter((g) => statusFilter === 'all' || g.priority === 'high')

  useEffect(() => {
    if (window.location.hash === '#gaps') document.getElementById('gaps')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const counts = pathway.nodes.reduce<Record<string, number>>((a, n) => ((a[n.confidence] = (a[n.confidence] ?? 0) + 1), a), {})

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <div className="flex flex-wrap items-center gap-2">
        {INCUMBENTS.map((i) => (
          <Pill key={i.id} active={pathway.id === i.id} onClick={() => setParams({ pathway: i.id })}>
            {i.label}
          </Pill>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Pill active={showAlt} onClick={() => setShowAlt(!showAlt)}>
            {showAlt ? 'Hide' : 'Show'} potential transition route
          </Pill>
        </div>
      </div>

      <Card>
        <CardHeader
          title={pathway.name}
          subtitle="Left = origin, right = customer. Each node shows Canopy's evidence status; click for what we know, what is missing and the next research action."
        />
        <div className="px-5 pb-5">
          <ConfidenceLegend className="mb-3" />
          <SupplyChainFlow pathway={pathway} filter={filter} label />
          {showAlt &&
            alts.map((ap) => (
              <div key={ap.id} className="mt-4 pt-4 border-t border-dashed border-teal-500/50">
                <SupplyChainFlow pathway={ap} filter={filter} label />
                <p className="text-[11px] text-slate-500 mt-1">Potential transition route — candidate only. Nothing on this row is a confirmed H&M supplier or a replacement claim.</p>
              </div>
            ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <CoverageBar coverage={HM_COVERAGE} filter={filter} onFilter={setFilter} title="Supply-chain coverage — click a segment to filter nodes" />
        <Card className="p-4">
          <div className="text-[13px] font-semibold text-slate-900 mb-2">Nodes on this pathway</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(['verified', 'partial', 'unknown', 'inferred'] as Confidence[]).map((c) => (
              <button key={c} onClick={() => setFilter(filter === c ? null : c)} className={`rounded-lg py-2 border ${filter === c ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}>
                <div className="text-lg font-bold text-slate-900">{counts[c] ?? 0}</div>
                <div className="text-[10px] text-slate-500 capitalize">{c === 'verified' ? 'Known' : c === 'inferred' ? 'Derived' : c}</div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Node counts are the prototype's basis for the coverage score in production.</p>
        </Card>
      </div>

      <Card id="gaps">
        <CardHeader
          title="Research queue — data gaps"
          subtitle="Uncertainty converted into work. Each card has an owner, a reason and a next action."
          action={
            <div className="flex items-center gap-2">
              <Pill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All ({HM_DATA_GAPS.filter((g) => g.relatedMaterialIds.some((r) => gapIds.includes(r))).length})</Pill>
              <Pill active={statusFilter === 'high'} onClick={() => setStatusFilter('high')}>High priority</Pill>
              <Button size="sm" icon={<ArrowRight size={14} />} onClick={() => openActionPlan(pathway.name)}>
                Create Action Plan
              </Button>
            </div>
          }
        />
        <div className="px-5 pb-5 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {gaps.map((g) => (
            <DataGapCard key={g.id} gap={g} />
          ))}
        </div>
      </Card>
    </div>
  )
}
