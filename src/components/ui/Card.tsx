import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card min-w-0', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  info,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  info?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-4 pb-2', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">{title}</h3>
          {info}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
