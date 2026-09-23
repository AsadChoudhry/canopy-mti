import type { FibreComposition, FibreKey } from '@/data/model'
import { FIBRE_KEYS, FIBRE_META } from '@/data/model'
import { compositionTotal } from '@/lib/scenario'
import { cn } from '@/lib/cn'

/**
 * Stacked fibre-composition bar. Unknown remainder is hatched, never invented.
 */
export function FibreBar({ composition, height = 26, showLabels = true, className, legend }: { composition: FibreComposition; height?: number; showLabels?: boolean; className?: string; legend?: boolean }) {
  const t = compositionTotal(composition)
  const remainder = Math.max(0, 100 - t.known)
  const segs = FIBRE_KEYS.filter((k) => (composition[k] ?? 0) > 0).map((k) => ({ k, pct: composition[k] as number }))
  return (
    <div className={className}>
      <div className="flex w-full rounded-md overflow-hidden bg-slate-100" style={{ height }}>
        {segs.map((s) => (
          <div key={s.k} title={`${FIBRE_META[s.k].label}: ${s.pct}%`} className="h-full flex items-center justify-center text-white text-[11px] font-semibold" style={{ width: `${s.pct}%`, background: FIBRE_META[s.k].colour }}>
            {showLabels && s.pct >= 12 && `${s.pct}%`}
          </div>
        ))}
        {(t.hasUnknown || remainder > 0.01) && (
          <div
            title="Unknown / not established"
            className="h-full flex items-center justify-center text-slate-500 text-[11px] font-semibold"
            style={{ width: `${remainder}%`, background: 'repeating-linear-gradient(135deg, #c7c7c7 0 5px, #ececec 5px 10px)' }}
          >
            {showLabels && remainder >= 14 && (t.hasUnknown ? 'unknown' : `${remainder.toFixed(0)}%`)}
          </div>
        )}
      </div>
      {legend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600">
          {FIBRE_KEYS.map((k) => (
            <span key={k} className={cn('inline-flex items-center gap-1.5', composition[k] === null && 'italic text-slate-400')}>
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: FIBRE_META[k].colour }} />
              {FIBRE_META[k].label}: {composition[k] === null ? 'unknown' : `${composition[k]}%`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function FibreLegend({ keys = FIBRE_KEYS, className }: { keys?: FibreKey[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600', className)}>
      {keys.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: FIBRE_META[k].colour }} />
          {FIBRE_META[k].label}
        </span>
      ))}
    </div>
  )
}
