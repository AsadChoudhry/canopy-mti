import { CheckCircle2, CircleDashed, CircleAlert, Sparkles } from 'lucide-react'
import type { Confidence } from '@/data/types'
import { CONFIDENCE_META } from '@/lib/confidence'
import { cn } from '@/lib/cn'

const ICONS = {
  verified: CheckCircle2,
  partial: CircleAlert,
  unknown: CircleDashed,
  inferred: Sparkles,
}

export function ConfidenceBadge({
  level,
  label,
  size = 'sm',
  className,
}: {
  level: Confidence
  label?: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}) {
  const meta = CONFIDENCE_META[level]
  const Icon = ICONS[level]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap border',
        meta.bg,
        meta.text,
        level === 'unknown' ? 'border-dashed border-slate-300' : 'border-transparent',
        size === 'xs' && 'text-[10px] px-1.5 py-0.5',
        size === 'sm' && 'text-[11px] px-2 py-0.5',
        size === 'md' && 'text-xs px-2.5 py-1',
        className,
      )}
    >
      <Icon size={size === 'md' ? 14 : 12} strokeWidth={2.4} />
      {label ?? meta.short}
    </span>
  )
}

export function ConfidenceDot({ level, className }: { level: Confidence; className?: string }) {
  return <span className={cn('inline-block w-2 h-2 rounded-full', CONFIDENCE_META[level].dot, className)} />
}

export function ConfidenceLegend({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500', className)}>
      {(['verified', 'partial', 'unknown', 'inferred'] as Confidence[]).map((c) => (
        <span key={c} className="inline-flex items-center gap-1.5">
          <ConfidenceDot level={c} />
          {CONFIDENCE_META[c].label}
        </span>
      ))}
    </div>
  )
}
