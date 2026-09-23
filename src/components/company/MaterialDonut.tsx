import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TreePine } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DonutSlice {
  id: string
  name: string
  pct: number
  colour: string
  forestLinked?: boolean
  focus?: boolean
  tonnesLabel?: string
}

export function MaterialDonut({
  slices,
  centreValue,
  centreLabel,
  onSelect,
  selectedId,
  height = 220,
  legend = true,
  className,
}: {
  slices: DonutSlice[]
  centreValue: string
  centreLabel: string
  onSelect?: (id: string) => void
  selectedId?: string | null
  height?: number
  legend?: boolean
  className?: string
}) {
  const [hover, setHover] = useState<string | null>(null)
  const active = hover ?? selectedId ?? null

  return (
    <div className={cn('flex flex-col sm:flex-row items-center gap-4', className)}>
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="pct"
              nameKey="name"
              innerRadius="64%"
              outerRadius="100%"
              paddingAngle={1.5}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              animationDuration={600}
              onClick={(d) => onSelect?.((d as unknown as DonutSlice).id)}
              onMouseEnter={(d) => setHover((d as unknown as DonutSlice).id)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: onSelect ? 'pointer' : 'default', outline: 'none' }}
            >
              {slices.map((s) => (
                <Cell
                  key={s.id}
                  fill={s.colour}
                  opacity={active && active !== s.id ? 0.35 : 1}
                  stroke={s.focus ? '#00c1c6' : 'none'}
                  strokeWidth={s.focus ? 3 : 0}
                  style={{ transition: 'opacity 150ms', outline: 'none' }}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                const p = payload?.[0]?.payload as DonutSlice | undefined
                if (!p) return null
                return (
                  <div className="bg-white rounded-lg shadow-pop border border-slate-200 px-3 py-2 text-xs">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-slate-500">
                      {p.pct}% {p.tonnesLabel && `· ${p.tonnesLabel}`}
                    </div>
                    {p.forestLinked && <div className="text-brand-700 font-medium mt-0.5">Forest-linked</div>}
                    {onSelect && <div className="text-slate-400 mt-1">Click to drill down</div>}
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xl font-bold text-slate-900 leading-none">{centreValue}</div>
          <div className="text-[11px] text-slate-500 mt-1">{centreLabel}</div>
        </div>
      </div>

      {legend && (
        <ul className="flex-1 w-full flex flex-col gap-1 min-w-0">
          {slices.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(s.id)}
                  onMouseEnter={() => setHover(s.id)}
                  onMouseLeave={() => setHover(null)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors text-left',
                    onSelect && 'hover:bg-cream-100 cursor-pointer',
                    isActive && 'bg-cream-100',
                    s.focus && 'ring-1 ring-teal-400/70 bg-teal-300/15',
                  )}
                >
                  <span className="w-3.5 h-3.5 rounded-[4px] shrink-0" style={{ background: s.colour }} />
                  <span className="flex-1 truncate text-slate-700 font-medium">{s.name}</span>
                  {s.forestLinked && <TreePine size={13} className="text-brand-600 shrink-0" />}
                  <span className="font-semibold text-slate-900 tabular-nums">{s.pct}%</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
