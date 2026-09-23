import type { Confidence, CoverageScore } from '@/data/types'
import { CONFIDENCE_META } from '@/lib/confidence'
import { InfoButton } from '@/components/ui/InfoButton'
import { cn } from '@/lib/cn'

/**
 * Segmented coverage bar: how much of the supply chain Canopy actually understands.
 * Clicking a segment filters the connected supply-chain view.
 */
export function CoverageBar({
  coverage,
  filter,
  onFilter,
  title = 'Supply-chain coverage',
  compact,
  className,
}: {
  coverage: CoverageScore
  filter?: Confidence | null
  onFilter?: (c: Confidence | null) => void
  title?: string
  compact?: boolean
  className?: string
}) {
  const segs: { key: Confidence; pct: number; label: string }[] = [
    { key: 'verified', pct: coverage.verifiedPct, label: 'Verified (known)' },
    { key: 'partial', pct: coverage.partialPct, label: 'Partially known' },
    { key: 'unknown', pct: coverage.unknownPct, label: 'Unknown' },
  ]
  return (
    <div className={cn('rounded-xl bg-amber-50 border border-amber-100 px-4 py-3', className)}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
          {title}
          <InfoButton evidence={coverage.evidenceId} />
        </div>
        {!compact && <span className="text-[10px] text-amber-600 font-medium">Illustrative prototype score — not an H&M reported metric</span>}
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {segs.map((s) => {
          const meta = CONFIDENCE_META[s.key]
          const dimmed = filter && filter !== s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onFilter?.(filter === s.key ? null : s.key)}
              title={`${s.label}: ${s.pct}% — click to filter`}
              className={cn('h-full transition-all', onFilter ? 'cursor-pointer hover:opacity-90' : 'cursor-default', dimmed && 'opacity-30')}
              style={{
                width: `${s.pct}%`,
                background:
                  s.key === 'unknown'
                    ? `repeating-linear-gradient(135deg, ${meta.colour} 0 5px, #dde0e4 5px 9px)`
                    : meta.colour,
              }}
            />
          )
        })}
      </div>
      <div className={cn('grid grid-cols-3 gap-2 mt-2', compact ? 'text-[11px]' : 'text-xs')}>
        {segs.map((s) => {
          const meta = CONFIDENCE_META[s.key]
          const active = filter === s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onFilter?.(filter === s.key ? null : s.key)}
              className={cn('text-left rounded-lg px-1.5 py-1 -mx-1.5 transition-colors', onFilter && 'hover:bg-white/60', active && 'bg-white shadow-sm')}
            >
              <div className={cn('font-bold text-slate-900', compact ? 'text-sm' : 'text-lg')}>{s.pct}%</div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ background: meta.colour }} />
                {s.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
