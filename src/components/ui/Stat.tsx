import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Small labelled value used in detail panels. Renders "Unknown" honestly. */
export function Stat({ label, value, unknown, className, hint }: { label: string; value?: ReactNode; unknown?: boolean; className?: string; hint?: string }) {
  const isUnknown = unknown || value === null || value === undefined || value === ''
  return (
    <div className={cn('min-w-0', className)}>
      <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">{label}</div>
      <div className={cn('text-sm mt-0.5', isUnknown ? 'text-slate-400 italic' : 'text-slate-800 font-medium')}>
        {isUnknown ? 'Unknown' : value}
      </div>
      {hint && <div className="text-[10px] text-slate-400 mt-0.5">{hint}</div>}
    </div>
  )
}
