import { ArrowRight } from 'lucide-react'
import type { Confidence, SupplyChainPathway } from '@/data/types'
import { SupplyChainNode } from './SupplyChainNode'
import { useUI } from '@/context/UIContext'
import { cn } from '@/lib/cn'

function Connector({ alternative, dimmed }: { alternative?: boolean; dimmed?: boolean }) {
  return (
    <div className={cn('flex items-center shrink-0 w-7 justify-center', dimmed && 'opacity-25')}>
      <svg width="28" height="12" viewBox="0 0 28 12">
        <line x1="0" y1="6" x2="22" y2="6" stroke={alternative ? '#009da1' : '#9aa3ad'} strokeWidth="1.5" className={alternative ? 'flow-line' : ''} />
        <path d="M20 2 L26 6 L20 10" fill="none" stroke={alternative ? '#009da1' : '#9aa3ad'} strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export function SupplyChainFlow({
  pathway,
  filter,
  size = 'md',
  className,
  label,
}: {
  pathway: SupplyChainPathway
  filter?: Confidence | null
  size?: 'sm' | 'md'
  className?: string
  label?: boolean
}) {
  const { openNode } = useUI()
  const alt = pathway.kind === 'alternative'
  return (
    <div className={cn('relative', className)}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5',
              alt ? 'bg-teal-400 text-brand-900' : 'bg-slate-800 text-white',
            )}
          >
            {alt ? 'Potential transition' : 'Incumbent'}
          </span>
          <span className="text-xs text-slate-500">{pathway.materialLabel}</span>
        </div>
      )}
      <div className="flex items-center overflow-x-auto scroll-thin pb-2 -mx-1 px-1">
        {pathway.nodes.map((n, i) => {
          const dimmed = !!filter && n.confidence !== filter
          return (
            <div key={n.id} className="flex items-center">
              {i > 0 && <Connector alternative={alt} dimmed={dimmed && pathway.nodes[i - 1].confidence !== filter} />}
              <SupplyChainNode node={n} onClick={openNode} dimmed={dimmed} size={size} alternative={alt} />
            </div>
          )
        })}
        {alt && <ArrowRight size={16} className="ml-2 text-teal-600 shrink-0" />}
      </div>
    </div>
  )
}

/** Compact vertical/stepped variant used in the drill-down "material flow" panel. */
export function SupplyChainMini({ pathway, className }: { pathway: SupplyChainPathway; className?: string }) {
  const { openNode } = useUI()
  const alt = pathway.kind === 'alternative'
  return (
    <div className={cn('flex flex-col', className)}>
      {pathway.nodes.map((n, i) => {
        const unknown = n.confidence === 'unknown'
        return (
          <div key={n.id} className="flex flex-col items-center">
            {i > 0 && (
              <svg width="12" height="18" viewBox="0 0 12 18" className="my-0.5">
                <line x1="6" y1="0" x2="6" y2="12" stroke={alt ? '#009da1' : '#c5cad1'} strokeWidth="1.5" className={alt ? 'flow-line' : ''} />
                <path d="M2 10 L6 16 L10 10" fill="none" stroke={alt ? '#009da1' : '#c5cad1'} strokeWidth="1.5" />
              </svg>
            )}
            <button
              type="button"
              onClick={() => openNode(n)}
              className={cn(
                'w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors hover:border-brand-400',
                unknown ? 'border-dashed border-slate-300 bg-slate-50' : alt ? 'border-teal-500/40 bg-teal-300/10' : 'border-slate-200 bg-white',
              )}
            >
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-slate-900 truncate">{n.label}</div>
                {n.sublabel && <div className="text-[10px] text-slate-500 truncate">{n.sublabel}</div>}
              </div>
              <span
                className={cn('text-[10px] font-bold uppercase tracking-wide shrink-0', {
                  'text-brand-600': n.confidence === 'verified',
                  'text-amber-500': n.confidence === 'partial',
                  'text-slate-400': n.confidence === 'unknown',
                  'text-inferred-500': n.confidence === 'inferred',
                })}
              >
                {n.confidence === 'unknown' ? '?' : n.confidence === 'inferred' ? 'Derived' : n.confidence === 'verified' ? 'Known' : 'Partial'}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
