import { FileText, ExternalLink, AlertCircle } from 'lucide-react'
import type { EvidenceStatus, Quantity, Source } from '@/data/model'
import { EVIDENCE_STATUS_META } from '@/data/model'
import { useUI } from '@/context/UIContext'
import { cn } from '@/lib/cn'

/** Clickable status badge — opens the evidence drawer for a quantity or a source. */
export function EvidenceBadge({
  status,
  quantity,
  source,
  label,
  size = 'sm',
  className,
}: {
  status?: EvidenceStatus
  quantity?: Quantity
  source?: Source
  label?: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}) {
  const { openEvidence } = useUI()
  const st = status ?? quantity?.status ?? (source ? (source.accessed ? 'reported' : 'unknown') : 'unknown')
  const meta = EVIDENCE_STATUS_META[st]
  const clickable = !!(quantity || source)
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={(e) => {
        e.stopPropagation()
        if (quantity) openEvidence({ quantity })
        else if (source) openEvidence({ source })
      }}
      title={clickable ? 'Open evidence' : undefined}
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap',
        meta.bg,
        meta.text,
        st === 'unknown' && 'border border-dashed border-slate-300',
        size === 'xs' && 'text-[10px] px-1.5 py-0.5',
        size === 'sm' && 'text-[11px] px-2 py-0.5',
        size === 'md' && 'text-xs px-2.5 py-1',
        clickable && 'hover:ring-2 hover:ring-offset-1 hover:ring-brand-300 cursor-pointer',
        className,
      )}
    >
      {source ? source.accessed ? <FileText size={11} /> : <AlertCircle size={11} /> : <FileText size={11} />}
      {label ?? meta.label}
      {clickable && <ExternalLink size={9} className="opacity-60" />}
    </button>
  )
}
