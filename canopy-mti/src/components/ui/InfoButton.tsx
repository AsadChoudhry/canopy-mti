import { Info } from 'lucide-react'
import type { Evidence } from '@/data/types'
import { useUI } from '@/context/UIContext'
import { cn } from '@/lib/cn'

/** Opens the provenance drawer for an evidence record. */
export function InfoButton({ evidence, className, size = 14 }: { evidence: Evidence | string; className?: string; size?: number }) {
  const { openSource } = useUI()
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        openSource(evidence)
      }}
      title="View source and provenance"
      className={cn('text-slate-400 hover:text-brand-600 transition-colors inline-flex items-center', className)}
    >
      <Info size={size} />
    </button>
  )
}
