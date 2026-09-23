import { Info } from 'lucide-react'
import { useStore } from '@/store/StoreContext'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

/**
 * The Canopy fashion slice of a brand's material footprint:
 * what is forest-derived, what sits outside the scope, and what is feedstock rather than scope.
 */
export function BrandFashionScope({ companyId }: { companyId: string }) {
  const { data } = useStore()
  const q = (id: string) => data.quantities.find((x) => x.id === id)
  const mmcfShare = q('q_hm_mmcf_of_global')
  const cotton = q('q_hm_cotton_feedstock')
  const globalMmcf = q('q_fibre_mmcf_2024')
  if (companyId !== 'hm' || !mmcfShare || !cotton || !globalMmcf) return null

  const rows = [
    { label: 'Wood and MMCF', value: '~40,481 t', sub: '8% of product material, the forest-derived slice', scope: true, q: undefined },
    { label: 'Share of world MMCF production', value: `~${mmcfShare.value}%`, sub: 'Against the global 8.4 Mt', scope: true, q: mmcfShare },
    { label: 'Virgin MMCF FSC or PEFC certified', value: '100%', sub: 'Reported by H&M, against 65 to 70% globally', scope: true, q: q('virgin_mmcf_certified_pct') },
    { label: 'Cotton', value: '~283,368 t', sub: 'Outside CanopyStyle. Post-consumer cotton textiles are the main Next Gen feedstock for MMCF', scope: false, q: cotton },
    { label: 'Polyester, polyamide, wool, leather', value: '~28% of product material', sub: 'Not forest-derived, no Canopy programme', scope: false, q: undefined },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
      <div className="flex items-center justify-between gap-2 py-2.5 border-b border-slate-200">
        <span className="text-[14px] font-semibold text-slate-900">Canopy fashion scope</span>
        <span className="text-[11px] text-slate-500">What CanopyStyle covers, and what it does not</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} className={cn('flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0', r.scope && 'bg-brand-50/60 -mx-4 px-4')}>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-[13px] font-medium', r.scope ? 'text-brand-800' : 'text-slate-900')}>{r.label}</span>
              {r.scope && <span className="rounded-full bg-brand-500 text-white text-[10px] font-semibold px-2 py-0.5">In scope</span>}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{r.sub}</div>
          </div>
          <div className={cn('text-[15px] font-bold tabular-nums text-right shrink-0', r.scope ? 'text-brand-700' : 'text-slate-400')}>{r.value}</div>
          <div className="w-[92px] flex justify-end shrink-0">{r.q && <EvidenceBadge quantity={r.q} size="xs" />}</div>
        </div>
      ))}
      <p className="text-[11px] text-slate-500 py-2 flex gap-1.5">
        <Info size={12} className="shrink-0 mt-0.5" />
        H&M volumes are derived from reported material shares, not reported tonnages. Only 1.1% of world MMCF came from recycled feedstock in 2024, which is the gap this brand could help close.
      </p>
    </div>
  )
}
