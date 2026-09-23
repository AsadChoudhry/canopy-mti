import { ChevronDown, ChevronRight, Package, Shirt, TreePine } from 'lucide-react'
import type { MaterialStream } from '@/data/types'
import { HM_STREAMS } from '@/data/hm'
import { TOTAL } from '@/lib/hierarchy'
import { fmtNum } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * Expandable hierarchy: Company → stream → material. The denominator is always shown.
 */
export function FootprintTree({
  streamId,
  materialId,
  onCompany,
  onStream,
  onMaterial,
}: {
  streamId: string | null
  materialId: string | null
  onCompany: () => void
  onStream: (id: MaterialStream['id']) => void
  onMaterial: (streamId: MaterialStream['id'], id: string) => void
}) {
  return (
    <div className="card p-3 text-[13px]">
      <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 px-2 pb-2">Footprint navigator</div>
      <button
        onClick={onCompany}
        className={cn('w-full flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-cream-100', !streamId && 'bg-brand-50 text-brand-800')}
      >
        <span className="font-semibold">H&M Group</span>
        <span className="text-slate-500 text-[12px]">{fmtNum(TOTAL.value)} t</span>
      </button>
      <ul className="mt-1 ml-2 border-l border-slate-200 pl-2 flex flex-col gap-0.5">
        {HM_STREAMS.map((s) => {
          const open = streamId === s.id
          const Icon = s.icon === 'shirt' ? Shirt : Package
          return (
            <li key={s.id}>
              <button
                onClick={() => onStream(s.id)}
                className={cn('w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-cream-100', open && !materialId && 'bg-brand-50 text-brand-800')}
              >
                {open ? <ChevronDown size={13} className="text-slate-400" /> : <ChevronRight size={13} className="text-slate-400" />}
                <Icon size={13} className="text-slate-500" />
                <span className="font-medium flex-1 text-left">{s.id === 'products' ? 'Products' : 'Packaging'}</span>
                <span className="text-slate-500 text-[12px]">{s.shareOfTotalPct}%</span>
              </button>
              {open && (
                <ul className="ml-3 border-l border-slate-200 pl-2 mt-0.5 flex flex-col gap-0.5 animate-fade-up">
                  {s.groupings?.map((g) => (
                    <li key={g.id}>
                      <button
                        onClick={() => onMaterial(s.id, g.id)}
                        className={cn(
                          'w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-cream-100',
                          materialId === g.id && 'bg-brand-50 text-brand-800',
                          g.focus && 'ring-1 ring-teal-400/70',
                        )}
                      >
                        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: g.colour }} />
                        <span className="flex-1 text-left font-medium">{g.name}</span>
                        <TreePine size={12} className="text-brand-600" />
                        <span className="text-slate-500 text-[12px]">{g.sharePct}%</span>
                      </button>
                    </li>
                  ))}
                  {s.materials
                    .filter((m) => !s.groupings?.some((g) => g.memberIds.includes(m.id)))
                    .map((m) => (
                      <li key={m.id}>
                        <button
                          onClick={() => onMaterial(s.id, m.id)}
                          className={cn(
                            'w-full flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-cream-100',
                            materialId === m.id && 'bg-brand-50 text-brand-800',
                            m.focus && 'ring-1 ring-teal-400/70',
                          )}
                        >
                          <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: m.colour }} />
                          <span className="flex-1 text-left">{m.shortName ?? m.name}</span>
                          {m.forestLinked && <TreePine size={12} className="text-brand-600" />}
                          <span className="text-slate-500 text-[12px]">{m.sharePct}%</span>
                        </button>
                      </li>
                    ))}
                  {s.groupings && (
                    <li className="px-2 pt-1 text-[10px] text-slate-400">
                      {s.groupings.map((g) => `${g.name} = ${g.memberIds.map((id) => s.materials.find((m) => m.id === id)?.name).join(' + ')}`).join('; ')}
                    </li>
                  )}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
