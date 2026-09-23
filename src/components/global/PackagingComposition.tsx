import type { Quantity } from '@/data/model'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props {
  total: Quantity
  recycled: Quantity
  virgin: Quantity
  certified: Quantity
  nextGen: Quantity
  nonFibre: Quantity
  nextGenCapacity: Quantity
}

function Row({
  label,
  pct,
  tonnes,
  quantity,
  badge,
  sub,
  indent,
  muted,
}: {
  label: string
  pct: string
  tonnes?: string
  quantity?: Quantity
  badge?: string
  sub?: string
  indent?: boolean
  muted?: boolean
}) {
  const unknown = pct === 'Unknown'
  return (
    <div className={cn('flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0', indent && 'pl-5')}>
      <div className="min-w-0 flex-1">
        <div className={cn('font-medium', indent ? 'text-[13px] text-slate-700' : 'text-[14px] text-slate-900')}>{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
      {tonnes && <div className="text-[12px] text-slate-500 tabular-nums whitespace-nowrap shrink-0">{tonnes}</div>}
      <div className={cn('tabular-nums font-bold text-right whitespace-nowrap shrink-0', indent ? 'text-[15px] w-[52px]' : 'text-[19px] w-[62px]', muted ? 'text-slate-400' : 'text-slate-900', unknown && 'text-[12px] font-semibold italic')}>{pct}</div>
      <div className="w-[92px] flex justify-end shrink-0">{quantity && <EvidenceBadge quantity={quantity} size="xs" label={badge} />}</div>
    </div>
  )
}

export function PackagingComposition({ total, recycled, virgin, certified, nextGen, nonFibre, nextGenCapacity }: Props) {
  const T = total.value ?? 277.9
  const r = recycled.value ?? 0
  const v = virgin.value ?? 0
  const nf = nonFibre.value ?? 0
  const pct = (x: number) => `${Math.round((x / T) * 100)}%`
  // Midpoint of the sourced 25 to 40% range; the evidence drawer carries the range.
  const certOfVirgin = 33
  const certMt = Math.round((v * certOfVirgin) / 100)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
        <div className="flex items-baseline gap-3 border-b border-slate-200 py-2.5">
          <div className="min-w-0 flex-1 text-[14px] font-semibold text-slate-900">Packaging paper &amp; board</div>
          <div className="text-[12px] text-slate-500 tabular-nums">{T} Mt</div>
          <div className="text-[19px] font-bold text-slate-900 tabular-nums w-[62px] text-right shrink-0">100%</div>
          <div className="w-[92px] flex justify-end shrink-0">
            <EvidenceBadge quantity={total} size="xs" />
          </div>
        </div>

        <Row label="Recycled fibre" pct={pct(r)} tonnes={`~${r} Mt`} quantity={recycled} />

        <Row label="Virgin wood fibre" pct={pct(v)} tonnes={`~${v} Mt`} quantity={virgin} sub="Forest-risk fibre" />
        <Row label="FSC / PEFC certified" pct={`${certOfVirgin}%`} tonnes={`~${certMt} Mt`} quantity={certified} badge="Est. range" sub="Share of virgin fibre, not of the total" indent />
        <Row label="Uncertified / controlled wood" pct={`${100 - certOfVirgin}%`} tonnes={`~${v - certMt} Mt`} sub="Remainder of virgin fibre" indent muted />

        <Row label="Next Gen fibre" pct="Unknown" quantity={nextGen} muted sub={`Canopy reports ${nextGenCapacity.value} Mt capacity across paper, packaging and textiles`} />

        <Row label="Non-fibre" pct={pct(nf)} tonnes={`~${nf} Mt`} quantity={nonFibre} muted sub="Starch, fillers, coatings and moisture" />
      </div>

      <p className="text-[11px] text-slate-500 flex gap-1.5">
        <Info size={12} className="shrink-0 mt-0.5" />
        Only the 277.9 Mt is measured. Every share below it is an estimate. Click a badge for the formula, sources and limitations.
      </p>
    </div>
  )
}
