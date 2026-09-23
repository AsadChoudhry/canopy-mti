import { GitBranch } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { PATH_META, PIPELINE, STAGE_META, type RegionKey } from '@/data/mills'
import { useStore } from '@/store/StoreContext'

const REGION_LABEL: Record<RegionKey | 'china', string> = { india: 'India', north_america: 'North America', europe: 'Europe', china: 'China' }

/** Named projects loaded in this prototype, against the gap to 60 Mt. Not a global inventory. */
export function NextGenPipeline({ region }: { region?: RegionKey }) {
  const { data } = useStore()
  const Q = (id?: string) => (id ? data.quantities.find((q) => q.id === id) : undefined)
  const S = (id?: string) => (id ? data.sources.find((s) => s.id === id) : undefined)
  const projects = [...PIPELINE].sort((a, b) => STAGE_META[a.stage].order - STAGE_META[b.stage].order || b.tonnes - a.tonnes)
  const max = Math.max(...projects.map((p) => p.tonnes))
  const total = projects.reduce((a, p) => a + p.tonnes, 0) / 1e6
  const committed = projects.filter((p) => p.stage !== 'permitted' && p.stage !== 'announced').reduce((a, p) => a + p.tonnes, 0) / 1e6
  const gap = (Q('q_ng_target_2033')?.value ?? 60) - (Q('q_ng_production_2024')?.value ?? 8.35)
  const capacity = Q('q_global_nextgen_capacity')

  return (
    <Card>
      <CardHeader
        title={<span className="flex items-center gap-2"><GitBranch size={16} className="text-brand-600" /> Named Next Gen projects</span>}
        subtitle="Projects loaded with a source, by stage. A starting list, not a global inventory."
      />
      <div className="px-5 pb-5 grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <ul className="flex flex-col gap-2">
          {projects.map((p) => {
            const q = Q(p.quantityId)
            const src = S(p.sourceId)
            const dim = region && p.region !== region
            return (
              <li key={p.id} className={dim ? 'opacity-45' : undefined}>
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="min-w-0 truncate">
                    <b className="text-slate-900">{p.operator}</b> <span className="text-slate-500">· {p.name}, {p.place}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="tabular-nums font-semibold text-slate-900">{(p.tonnes / 1000).toLocaleString('en-US')} kt</span>
                    {q ? <EvidenceBadge quantity={q} size="xs" label="" className="px-1" /> : src && <EvidenceBadge source={src} size="xs" label="" className="px-1" />}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(2, (p.tonnes / max) * 100)}%`, background: STAGE_META[p.stage].colour }} />
                  </div>
                  <span className="w-[150px] text-[10px] text-slate-500 truncate">{STAGE_META[p.stage].label}{p.year ? `, ${p.year}` : ''}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {REGION_LABEL[p.region]} · {PATH_META[p.path].label} · {p.output === 'fibre' ? 'fibre tonnes' : 'pulp tonnes'}{p.note ? ` · ${p.note}` : ''}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-2.5">
          <div className="rounded-xl bg-brand-50 border border-brand-100 px-3 py-2.5">
            <div className="text-[11px] text-slate-500">Named here, all stages</div>
            <div className="text-[24px] font-bold text-slate-900 tabular-nums leading-tight">{(total * 1000).toFixed(0)} kt</div>
            <div className="text-[11px] text-slate-600">{((total / gap) * 100).toFixed(1)}% of the {gap.toFixed(1)} Mt gap to 60 Mt. Operating, restarting or building: {(committed * 1000).toFixed(0)} kt.</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-600">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">Canopy's own capacity count</span>
              {capacity && <EvidenceBadge quantity={capacity} size="xs" />}
            </div>
            <div className="text-[20px] font-bold text-slate-900 tabular-nums">{capacity?.value ?? '?'} Mt</div>
            Canopy counts far more capacity than is named here, across paper, packaging and textiles. The finding is that a sourced, mill-by-mill list behind the 60 Mt goal is not in one place yet, and building it is year-one work.
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
            {Object.values(STAGE_META).map((s) => (
              <span key={s.label} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: s.colour }} />{s.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
