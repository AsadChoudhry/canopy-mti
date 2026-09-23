import { GLOBAL_FIBRE_2024 } from '@/data/fibre'
import type { Quantity } from '@/data/model'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

/**
 * Where MMCF sits in global fibre, and why the rest is out of Canopy's direct scope.
 */
export function FibreScope({ total, mmcf, certified, recycled, recycledTextiles }: { total: Quantity; mmcf: Quantity; certified: Quantity; recycled: Quantity; recycledTextiles: Quantity }) {
  const rows = [...GLOBAL_FIBRE_2024].sort((a, b) => b.mt - a.mt)
  const T = total.value ?? 132

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
        <div className="flex items-baseline gap-3 py-2.5 border-b border-slate-200">
          <div className="min-w-0 flex-1 text-[14px] font-semibold text-slate-900">Global fibre production</div>
          <div className="text-[12px] text-slate-500 tabular-nums shrink-0">{T} Mt</div>
          <div className="text-[19px] font-bold text-slate-900 tabular-nums w-[62px] text-right shrink-0">100%</div>
          <div className="w-[92px] flex justify-end shrink-0"><EvidenceBadge quantity={total} size="xs" /></div>
        </div>

        {rows.map((r) => (
          <div key={r.id} className={cn('flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0', r.inCanopyScope && 'bg-brand-50/60 -mx-4 px-4')}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('font-medium', r.inCanopyScope ? 'text-[14px] text-brand-800' : 'text-[14px] text-slate-900')}>{r.label}</span>
                {r.inCanopyScope && <span className="rounded-full bg-brand-500 text-white text-[10px] font-semibold px-2 py-0.5">Canopy scope</span>}
              </div>
              {r.note && <div className="text-[11px] text-slate-500 mt-0.5">{r.note}</div>}
            </div>
            <div className="text-[12px] text-slate-500 tabular-nums shrink-0">{r.mt} Mt</div>
            <div className={cn('text-[19px] font-bold tabular-nums w-[62px] text-right shrink-0', r.inCanopyScope ? 'text-brand-700' : 'text-slate-400')}>{r.pct}%</div>
            <div className="w-[92px] flex justify-end shrink-0">{r.inCanopyScope && <EvidenceBadge quantity={mmcf} size="xs" />}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-1.5">
        <div className="text-[13px] font-semibold text-brand-800 py-2.5 border-b border-brand-100">Inside the 8.4 Mt Canopy works on</div>
        {[
          { label: 'From FSC or PEFC certified or controlled feedstock', q: certified, value: '65 to 70%' },
          { label: 'From recycled feedstock', q: recycled, value: `${recycled.value}%`, gap: true },
          { label: 'Global fibre from recycled textiles, the Next Gen feedstock pool', q: recycledTextiles, value: 'under 1%' },
        ].map((r) => (
          <div key={r.label} className="flex items-baseline gap-3 py-2.5 border-b border-brand-100 last:border-0">
            <div className="min-w-0 flex-1 text-[13px] text-slate-800">{r.label}</div>
            <div className={cn('text-[15px] font-bold tabular-nums text-right shrink-0', r.gap ? 'text-amber-600' : 'text-slate-900')}>{r.value}</div>
            <div className="w-[92px] flex justify-end shrink-0"><EvidenceBadge quantity={r.q} size="xs" /></div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Polyester, cotton and the rest are not forest-derived, so they sit outside CanopyStyle. Cotton matters indirectly: post-consumer cotton textiles are the main Next Gen feedstock for MMCF.
      </p>
    </div>
  )
}
