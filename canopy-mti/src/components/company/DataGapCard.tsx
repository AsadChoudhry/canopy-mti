import { ArrowRight, User } from 'lucide-react'
import type { DataGap } from '@/data/types'
import { Pill } from '@/components/ui/Pill'
import { cn } from '@/lib/cn'

const STATUS: Record<DataGap['status'], string> = { not_started: 'Not started', in_progress: 'In progress', requested: 'Requested', received: 'Received' }
const PRIORITY_TONE: Record<DataGap['priority'], 'amber' | 'default' | 'grey'> = { high: 'amber', medium: 'default', low: 'grey' }

export function DataGapCard({ gap, compact, className }: { gap: DataGap; compact?: boolean; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-dashed border-slate-300 bg-white p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">Missing</div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">{gap.field}</div>
        </div>
        <div className="flex gap-1">
          <Pill tone={PRIORITY_TONE[gap.priority]}>{gap.priority}</Pill>
        </div>
      </div>
      {!compact && (
        <>
          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">Why it matters</div>
            <p className="text-[13px] text-slate-600 mt-0.5">{gap.whyItMatters}</p>
          </div>
          <div className="mt-3 rounded-lg bg-brand-50 border border-brand-100 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-600 flex items-center gap-1">
              <ArrowRight size={11} /> Next action
            </div>
            <p className="text-[13px] text-brand-900 font-medium mt-0.5">{gap.nextAction}</p>
          </div>
        </>
      )}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <User size={11} /> {gap.owner}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          {STATUS[gap.status]}
        </span>
      </div>
    </div>
  )
}
