import { cn } from '@/lib/cn'

export function ProgressBar({
  segments,
  height = 10,
  className,
  rounded = true,
}: {
  segments: { pct: number; colour: string; label?: string; pattern?: 'hatched' }[]
  height?: number
  className?: string
  rounded?: boolean
}) {
  return (
    <div className={cn('w-full flex overflow-hidden bg-slate-100', rounded && 'rounded-full', className)} style={{ height }}>
      {segments.map((s, i) => (
        <div
          key={i}
          title={s.label}
          style={{
            width: `${s.pct}%`,
            background:
              s.pattern === 'hatched'
                ? `repeating-linear-gradient(135deg, ${s.colour} 0 4px, transparent 4px 8px)`
                : s.colour,
          }}
          className="h-full transition-all duration-500"
        />
      ))}
    </div>
  )
}
