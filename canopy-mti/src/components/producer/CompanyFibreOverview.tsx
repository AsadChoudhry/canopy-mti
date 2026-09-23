import type { Company } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

/** Company-level fibre source overview. */
export function CompanyFibreOverview({ company }: { company: Company }) {
  const { data } = useStore()
  const certified = data.quantities.find((x) => x.subjectId === company.id && x.metric.toLowerCase().includes('certified'))
  const recycled = data.quantities.find((x) => x.subjectId === company.id && x.metric.toLowerCase().includes('recycled'))

  const products = data.products.filter((p) => p.companyId === company.id)
  const withComp = products.filter((p) => p.composition.status === 'reported')
  const avg = (k: 'virginWoodPct' | 'recycledPct' | 'nextGenPct') =>
    withComp.length ? Math.round(withComp.reduce((a, p) => a + (p.composition[k] ?? 0), 0) / withComp.length) : null

  const virginPct = avg('virginWoodPct')
  const recycledPct = recycled?.value ?? avg('recycledPct')
  const nextGenPct = avg('nextGenPct')
  const certPct = certified?.value ?? null

  if (!withComp.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-[13px] text-slate-500">
        No product content declarations loaded for {company.name}. {certPct !== null && <>Certified wood share: <b className="text-slate-800">{certPct}%</b>.</>}
      </div>
    )
  }

  const rows = [
    { label: 'Recycled fibre', value: recycledPct, q: recycled },
    { label: 'Virgin wood fibre', value: virginPct, q: undefined, sub: 'Share of product fibre' },
    { label: 'of which FSC / PEFC certified', value: certPct, q: certified, indent: true, sub: 'Company-wide wood procurement' },
    { label: 'Next Gen fibre', value: nextGenPct, q: undefined },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
      <div className="text-[14px] font-semibold text-slate-900 py-2.5 border-b border-slate-200">Fibre source overview</div>
      {rows.map((r) => (
        <div key={r.label} className={cn('flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0', r.indent && 'pl-5')}>
          <div className="min-w-0 flex-1">
            <div className={cn('font-medium', r.indent ? 'text-[13px] text-slate-700' : 'text-[14px] text-slate-900')}>{r.label}</div>
            {r.sub && <div className="text-[11px] text-slate-500 mt-0.5">{r.sub}</div>}
          </div>
          <div className={cn('tabular-nums font-bold text-right shrink-0', r.indent ? 'text-[15px] w-[52px]' : 'text-[19px] w-[62px]', r.value === null ? 'text-slate-400' : (r.value ?? 0) === 0 ? 'text-slate-400' : 'text-slate-900')}>
            {r.value === null ? 'n/a' : `${r.value}%`}
          </div>
          <div className="w-[92px] flex justify-end shrink-0">{r.q && <EvidenceBadge quantity={r.q} size="xs" />}</div>
        </div>
      ))}
      <p className="text-[11px] text-slate-400 py-2">Averaged across {withComp.length} product{withComp.length === 1 ? '' : 's'} with a content declaration. Not weighted by volume.</p>
    </div>
  )
}
