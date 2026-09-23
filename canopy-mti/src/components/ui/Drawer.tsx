import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
  footer,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  width?: 'md' | 'lg' | 'xl'
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  const w = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' }[width]
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brand-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className={cn('relative h-full w-full bg-white shadow-pop flex flex-col animate-slide-in', w)}>
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 leading-snug">{title}</h2>
            {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5 scroll-thin">{children}</div>
        {footer && <footer className="border-t border-slate-200 px-6 py-4 bg-cream-50">{footer}</footer>}
      </aside>
    </div>
  )
}
