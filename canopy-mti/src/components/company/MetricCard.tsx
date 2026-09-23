import type { ReactNode } from 'react'
import type { Evidence } from '@/data/types'
import { Card } from '@/components/ui/Card'
import { InfoButton } from '@/components/ui/InfoButton'
import { fmtNum } from '@/lib/format'
import { cn } from '@/lib/cn'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'

export function MetricCard({
  evidence,
  icon,
  iconBg = 'bg-brand-100 text-brand-700',
  label,
  aside,
  asideTone = 'text-brand-700',
  className,
  onClick,
  showConfidence,
}: {
  evidence: Evidence
  icon: ReactNode
  iconBg?: string
  label: string
  aside?: ReactNode
  asideTone?: string
  className?: string
  onClick?: () => void
  showConfidence?: boolean
}) {
  const value = evidence.display ?? `${fmtNum(evidence.value)} ${evidence.unit ?? ''}`
  return (
    <Card
      className={cn('px-4 py-4 flex items-center gap-3 min-w-0', onClick && 'cursor-pointer hover:border-brand-400 transition-colors', className)}
      onClick={onClick}
    >
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', iconBg)}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[22px] xl:text-[24px] font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">{value}</div>
        <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-slate-500">
          <span className="truncate">{label}</span>
          <InfoButton evidence={evidence} />
          {showConfidence && <ConfidenceBadge level={evidence.confidence} size="xs" />}
        </div>
      </div>
      {aside && <div className={cn('text-xl font-bold shrink-0', asideTone)}>{aside}</div>}
    </Card>
  )
}
