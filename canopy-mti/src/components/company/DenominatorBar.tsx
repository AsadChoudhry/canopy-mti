import { ChevronRight } from 'lucide-react'
import type { MaterialStream } from '@/data/types'
import type { SelectedMaterial } from '@/lib/hierarchy'
import { TOTAL } from '@/lib/hierarchy'
import { fmtNum } from '@/lib/format'
import { InfoButton } from '@/components/ui/InfoButton'
import { cn } from '@/lib/cn'

/**
 * Always-visible denominator: what share of the company's footprint are we looking at?
 */
export function DenominatorBar({
  stream,
  selected,
  onCompany,
  onStream,
  className,
}: {
  stream: MaterialStream | null
  selected: SelectedMaterial | null
  onCompany: () => void
  onStream: (id: MaterialStream['id']) => void
  className?: string
}) {
  const pctOfTotal = selected ? selected.shareOfTotalPct : stream ? stream.shareOfTotalPct : 100
  return (
    <div className={cn('card px-4 py-3 flex flex-col md:flex-row md:items-center gap-4', className)}>
      <div className="flex items-center gap-1.5 text-[13px] flex-wrap">
        <button onClick={onCompany} className={cn('rounded-lg px-2 py-1 hover:bg-cream-100', !stream && 'bg-brand-800 text-white hover:bg-brand-800')}>
          <span className="font-semibold">H&M Group</span>
          <span className={cn('ml-1.5', stream ? 'text-slate-500' : 'text-brand-100')}>{fmtNum(TOTAL.value)} t</span>
        </button>
        {stream && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <button onClick={() => onStream(stream.id)} className={cn('rounded-lg px-2 py-1 hover:bg-cream-100', !selected && 'bg-brand-800 text-white hover:bg-brand-800')}>
              <span className="font-semibold">{stream.id === 'products' ? 'Products' : 'Packaging'}</span>
              <span className={cn('ml-1.5', selected ? 'text-slate-500' : 'text-brand-100')}>
                {fmtNum(stream.tonnes.value)} t · {stream.shareOfTotalPct}%
              </span>
            </button>
          </>
        )}
        {selected && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="rounded-lg px-2 py-1 bg-brand-800 text-white">
              <span className="font-semibold">{selected.name}</span>
              <span className="ml-1.5 text-brand-100">
                {selected.derivedTonnes.display ?? `~${fmtNum(selected.derivedTonnes.value)} t`} · {selected.sharePct}% of {stream?.id}
              </span>
            </span>
          </>
        )}
      </div>

      <div className="md:ml-auto flex items-center gap-3 min-w-[260px]">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Share of total tracked material</span>
            <span className="font-semibold text-slate-900">
              {pctOfTotal >= 10 ? pctOfTotal.toFixed(0) : pctOfTotal.toFixed(pctOfTotal < 1 ? 2 : 1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${Math.max(pctOfTotal, 0.5)}%` }} />
          </div>
        </div>
        <InfoButton evidence={selected?.derivedTonnes ?? stream?.tonnes ?? TOTAL} />
      </div>
    </div>
  )
}
