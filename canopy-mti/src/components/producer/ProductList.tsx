import type { Company } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { accountProduct } from '@/lib/accounting'
import { cn } from '@/lib/cn'
import { CheckCircle2, CircleDashed, CircleDot } from 'lucide-react'

const LEVEL = {
  full: { icon: CheckCircle2, colour: 'text-green-600', bar: 'bg-green-500' },
  partial: { icon: CircleDot, colour: 'text-amber-500', bar: 'bg-amber-400' },
  thin: { icon: CircleDashed, colour: 'text-slate-400', bar: 'bg-slate-300' },
}

/** Products of the selected company, ranked by evidence completeness. */
export function ProductList({ company, activeId, onSelect }: { company: Company; activeId?: string | null; onSelect: (id: string | null) => void }) {
  const { data } = useStore()
  const products = data.products
    .filter((p) => p.companyId === company.id)
    .map((p) => ({
      p,
      score: accountProduct(p, data),
      share: data.quantities.find((q) => q.id === p.shareOfCompanyQuantityId)?.value ?? null,
    }))
    .sort((a, b) => b.score.pct - a.score.pct || (b.share ?? -1) - (a.share ?? -1))

  const mapped = products.reduce((a, x) => a + (x.share ?? 0), 0)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-slate-900">{company.name} products</h2>
        {mapped > 0 && (
          <p className="text-[12px] text-slate-600 mt-0.5">
            <span className="font-semibold text-slate-900">{mapped.toFixed(1)}%</span> of company mapped
          </p>
        )}
      </div>
      <ul className="flex flex-col gap-1.5">
        {products.map(({ p, score, share }) => {
          const L = LEVEL[score.level]
          const Icon = L.icon
          const active = activeId === p.id
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect(active ? null : p.id)}
                className={cn('w-full text-left rounded-xl border px-3 py-2.5 transition-colors', active ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300')}
              >
                <div className="flex items-start gap-2">
                  <Icon size={15} className={cn('shrink-0 mt-0.5', L.colour)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-slate-900 leading-snug">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.application}</div>
                  </div>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className={cn('text-[12px]', share === null ? 'text-slate-400' : 'text-slate-700')}>
                    {share === null ? 'Share of company unknown' : <><span className="font-semibold text-slate-900">{share}%</span> of company</>}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{score.passed}/{score.total}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={cn('h-full rounded-full', L.bar)} style={{ width: `${score.pct}%` }} />
                </div>
              </button>
            </li>
          )
        })}
        {!products.length && <li className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-[12px] italic text-slate-400">No product records loaded.</li>}
      </ul>
    </div>
  )
}
