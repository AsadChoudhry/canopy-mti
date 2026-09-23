import { NavLink } from 'react-router-dom'
import { Globe2, Building2, Leaf, Database, Factory, Map, ShieldCheck, ShieldAlert, Scale, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/', label: 'Global overview', icon: Globe2, end: true },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/transparency', label: 'Producer transparency', icon: ShieldCheck },
  { to: '/risk', label: 'Supply risk', icon: ShieldAlert },
  { to: '/solutions', label: 'Canopy solutions', icon: Leaf },
  { to: '/mills', label: 'Next Gen mills', icon: Factory },
  { to: '/demand', label: 'Demand and supply', icon: ArrowLeftRight },
  { to: '/policy', label: 'Policy tracker', icon: Scale },
  { to: '/roadmap', label: 'Year-one roadmap', icon: Map },
  { to: '/workspace', label: 'Data workspace', icon: Database },
]

export function Wordmark({ className, size = 30, light = true }: { className?: string; size?: number; light?: boolean }) {
  return (
    <span className={cn('font-extrabold tracking-tight inline-flex items-center gap-1.5 leading-none', light ? 'text-white' : 'text-charcoal', className)} style={{ fontSize: size }}>
      <svg viewBox="0 0 24 24" width={size * 0.8} height={size * 0.8} aria-hidden>
        <path d="M4 18 C 6 8, 14 4, 21 4 C 20 12, 14 19, 4 18 Z" fill="#009a7e" />
        <path d="M5 18 C 9 13, 13 10, 18 7" stroke="#00c1c6" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
      canopy
    </span>
  )
}

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-charcoal/50 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed z-40 inset-y-0 left-0 w-[210px] bg-charcoal text-white flex flex-col transition-transform lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 overflow-hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-5 pt-6 pb-5">
          <Wordmark />
          <p className="text-[12px] text-slate-300 mt-1.5">Material Transition</p>
        </div>

        <nav className="px-3 flex flex-col gap-1 mt-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-200 hover:bg-charcoal-700 hover:text-white',
                )
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-5 pb-6">
          <p className="text-[13px] font-medium leading-snug text-slate-200">
            Forests.
            <br />
            Markets.
            <br />
            A brighter tomorrow.
          </p>
          <p className="text-[10px] text-slate-400 mt-4 leading-snug">
            Concept design ·<br />
            Illustrative data where marked
          </p>
        </div>
      </aside>
    </>
  )
}
