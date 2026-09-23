import { Factory, MapPin } from 'lucide-react'
import type { Company } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

export function CompanyOverview({ company }: { company: Company }) {
  const { data } = useStore()
  const cats = (company.categories ?? []).map((c) => ({ ...c, q: data.quantities.find((q) => q.id === c.quantityId) })).filter((c) => c.q)
  const max = Math.max(...cats.map((c) => c.q!.value ?? 0), 0.1)
  const facilities = data.facilities.filter((f) => f.companyId === company.id)
  const origins = data.relationships.filter((r) => r.kind === 'sourced_from' && r.fromType === 'company' && r.fromId === company.id).map((r) => data.origins.find((o) => o.id === r.toId)).filter(Boolean)
  const inputs = data.quantities.filter((q) => q.subjectType === 'company' && q.subjectId === company.id && q.basis === 'purchases')

  if (!cats.length && !facilities.length && !origins.length && !inputs.length) return null

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {cats.length > 0 && (
      <Card>
        <CardHeader title="Production by category" subtitle="Reported output, 2025" />
        <div className="px-5 pb-5 flex flex-col gap-2">
          {cats.length ? (
            cats.map((c) => (
              <div key={c.quantityId} className="grid grid-cols-[180px_1fr_auto] items-center gap-3 text-[13px]">
                <span className="text-slate-700 truncate">{c.name}</span>
                <div className="h-3.5 rounded bg-slate-100 overflow-hidden">
                  <div className={cn('h-full rounded', c.name.includes('pulp') ? 'bg-slate-300' : 'bg-brand-500')} style={{ width: `${((c.q!.value ?? 0) / max) * 100}%` }} />
                </div>
                <span className="inline-flex items-center gap-2 font-semibold text-slate-900 tabular-nums">
                  {c.q!.value} {c.q!.unit} <EvidenceBadge quantity={c.q!} size="xs" label="" className="px-1" />
                </span>
              </div>
            ))
          ) : null}
          {inputs.length > 0 && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">Purchased inputs</div>
              <div className="flex flex-wrap gap-2">
                {inputs.map((q) => (
                  <span key={q.id} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-cream-50 px-2.5 py-1 text-[12px]">
                    {q.metric.replace(' (purchased)', '')}: <b>{q.value} {q.unit}</b> <EvidenceBadge quantity={q} size="xs" label="" className="px-1" />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
      )}

      {(facilities.length > 0 || origins.length > 0) && (
      <div className="grid md:grid-cols-2 gap-4">
        {facilities.length > 0 && (
        <Card>
          <CardHeader title="Facilities" subtitle="Named in company reporting" />
          <ul className="px-5 pb-5 flex flex-col gap-1.5">
            {facilities.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 text-[12px] rounded-lg border border-slate-200 px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-slate-800"><Factory size={13} className="text-slate-400" /> {f.name} <span className="text-slate-400">· {f.country}</span></span>
                  <span className="text-[10px] text-slate-400 capitalize">{f.type.replace('_', ' ')}</span>
                </li>
              ))}
          </ul>
        </Card>
        )}
        {origins.length > 0 && (
        <Card>
          <CardHeader title="Wood-fibre sourcing countries" subtitle="Company-wide" />
          <div className="px-5 pb-5">
            <div className="flex flex-wrap gap-1.5">
              {origins.map((o) => (
                <span key={o!.id} className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 text-green-700 px-2.5 py-1 text-[12px]"><MapPin size={11} /> {o!.name}</span>
              ))}
            </div>
            {(company.sourcingStatements ?? []).map((st, i) => {
              const s = data.sources.find((x) => x.id === st.sourceIds[0])
              return (
                <div key={i} className="mt-3 text-[12px] text-slate-700 flex items-start justify-between gap-2">
                  <span>{st.text} <span className="text-slate-400">({st.scope})</span></span>
                  {s && <EvidenceBadge source={s} label="Source" size="xs" />}
                </div>
              )
            })}
          </div>
        </Card>
        )}
      </div>
      )}
    </div>
  )
}
