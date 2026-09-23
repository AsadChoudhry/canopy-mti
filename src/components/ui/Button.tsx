import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'lime'; size?: 'sm' | 'md'; icon?: ReactNode }) {
  const variants = {
    primary: 'bg-brand-800 text-white hover:bg-brand-700 shadow-sm',
    lime: 'bg-teal-400 text-brand-900 hover:bg-teal-500 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-brand-400 hover:text-brand-700',
    ghost: 'text-brand-700 hover:bg-brand-50',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50',
        size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
