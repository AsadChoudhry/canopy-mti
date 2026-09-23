import type { Quantity } from '@/data/model'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

/** What the 8.4 Mt of man-made cellulosic fibre is made from. Forest-derived fibre only. */
export function MmcfScope({ mmcf, certified, recycled }: { mmcf: Quantity; certified: Quantity; recycled: Quantity }) {
  const rows = [
    { label: 'From FSC or PEFC certified or controlled feedstock', value: '65 to 70%', q: certified, sub: 'Controlled is not the same as certified' },
    { label: 'From recycled feedstock', value: `${recycled.value}%`, q: recycled, sub: 'Up from 0.7% in 2023. Roughly 0.09 Mt of the 8.4 Mt', gap: true },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
        <div className="flex items-baseline gap-3 py-2.5 border-b border-slate-200">
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-slate-900">Man-made cellulosic fibre produced</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Viscose, lyocell, modal, acetate and cupro. Viscose alone is 6.7 Mt</div>
          </div>
          <div className="text-[19px] font-bold text-slate-900 tabular-nums w-[80px] text-right shrink-0">8.4 Mt</div>
          <div className="w-[92px] flex justify-end shrink-0"><EvidenceBadge quantity={mmcf} size="xs" /></div>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-slate-900">{r.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{r.sub}</div>
            </div>
            <div className={cn('text-[17px] font-bold tabular-nums w-[80px] text-right shrink-0', r.gap ? 'text-amber-600' : 'text-slate-900')}>{r.value}</div>
            <div className="w-[92px] flex justify-end shrink-0"><EvidenceBadge quantity={r.q} size="xs" /></div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">
        Recycled feedstock is the Next Generation criterion Canopy scores. At 1.1% it is the widest gap in the sector.
      </p>
    </div>
  )
}
