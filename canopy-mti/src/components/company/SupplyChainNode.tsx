import { TreePine, Factory, Scroll, Cog, Boxes, Shirt, Truck, Store, User, Recycle, Wheat, Beaker, Sprout, FlaskConical, ShieldQuestion } from 'lucide-react'
import type { SupplyChainNode as NodeT, SupplyChainStage } from '@/data/types'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { CONFIDENCE_META } from '@/lib/confidence'
import { cn } from '@/lib/cn'

export const STAGE_ICON: Record<SupplyChainStage, typeof TreePine> = {
  feedstock: TreePine,
  pulp: Scroll,
  mill: Factory,
  processor: Cog,
  converter: Boxes,
  tier1: Shirt,
  distribution: Truck,
  brand: Store,
  customer: User,
  end_of_life: Recycle,
  alt_feedstock: Wheat,
  alt_fibre: Beaker,
  alt_producer: Sprout,
  alt_application: FlaskConical,
  alt_validation: ShieldQuestion,
}

export function SupplyChainNode({
  node,
  onClick,
  dimmed,
  size = 'md',
  alternative,
}: {
  node: NodeT
  onClick?: (n: NodeT) => void
  dimmed?: boolean
  size?: 'sm' | 'md'
  alternative?: boolean
}) {
  const Icon = STAGE_ICON[node.stage]
  const meta = CONFIDENCE_META[node.confidence]
  const unknown = node.confidence === 'unknown'
  return (
    <button
      type="button"
      onClick={() => onClick?.(node)}
      className={cn(
        'group relative flex flex-col items-center text-center rounded-xl border bg-white transition-all shrink-0',
        size === 'md' ? 'w-[148px] px-3 py-3.5' : 'w-[124px] px-2 py-3',
        unknown ? 'border-dashed border-slate-300 bg-slate-50/60' : 'border-slate-200',
        alternative && !unknown && 'bg-teal-300/10 border-teal-500/40',
        dimmed ? 'opacity-25 grayscale' : 'hover:shadow-pop hover:-translate-y-0.5 hover:border-brand-400',
      )}
      style={{ boxShadow: dimmed ? undefined : `inset 0 3px 0 ${meta.colour}` }}
    >
      <div className={cn('text-[12px] font-semibold text-slate-900 leading-tight min-h-[30px] flex items-center', size === 'sm' && 'text-[11px]')}>{node.label}</div>
      <div
        className={cn(
          'my-2 w-11 h-11 rounded-full flex items-center justify-center',
          unknown ? 'bg-slate-100 text-slate-400' : alternative ? 'bg-teal-300/40 text-brand-800' : 'bg-brand-50 text-brand-700',
        )}
      >
        {unknown ? <span className="text-lg font-bold">?</span> : <Icon size={20} />}
      </div>
      <ConfidenceBadge level={node.confidence} size="xs" />
      {node.sublabel && <div className="text-[10px] text-slate-500 mt-1.5 leading-tight">{node.sublabel}</div>}
      {node.entityName && <div className="text-[10px] font-semibold text-brand-800 mt-1">{node.entityName}</div>}
    </button>
  )
}
