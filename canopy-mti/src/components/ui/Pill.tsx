import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Pill({
  children,
  active,
  onClick,
  className,
  tone = 'default',
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
  tone?: 'default' | 'lime' | 'amber' | 'grey' | 'forest' | 'inferred'
}) {
  const tones: Record<string, string> = {
    default: 'bg-slate-100 text-slate-600',
    lime: 'bg-teal-300/60 text-brand-800',
    amber: 'bg-amber-100 text-amber-600',
    grey: 'bg-slate-100 text-slate-500 border border-dashed border-slate-300',
    forest: 'bg-brand-100 text-brand-700',
    inferred: 'bg-inferred-100 text-inferred-600',
  }
  const base = 'inline-flex items-center gap-1 rounded-full text-[11px] font-semibold px-2.5 py-1 whitespace-nowrap'
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          'transition-colors border',
          active ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-700',
          className,
        )}
      >
        {children}
      </button>
    )
  }
  return <span className={cn(base, tones[tone], className)}>{children}</span>
}
