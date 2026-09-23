import { NavLink } from 'react-router-dom'
import { Globe2, Building2, Leaf, Database, Factory, Map, ShieldCheck, ShieldAlert, Scale, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/', label: 'Global overview', icon: Globe2, end: true },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/transparency', label: 'Disclosure coverage', icon: ShieldCheck },
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
          <div className="flex items-center gap-2">
            <FoxBadge size={38} />
            <div className="leading-tight">
              <div className="text-[12px] font-semibold text-[#f08a3a] whitespace-nowrap">Agent Curious Fox</div>
              <div className="text-[11px] text-slate-400">Data &amp; Research</div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 leading-snug">
            Concept design ·<br />
            Illustrative data where marked
          </p>
        </div>
      </aside>
    </>
  )
}

/** Agent Curious Fox: the Data & Research Lead's mascot. */
function FoxBadge({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      <path d="M22 50 L30 10 L52 38 Z" fill="#e8742a" />
      <path d="M98 50 L90 10 L68 38 Z" fill="#e8742a" />
      <path d="M29 42 L32 20 L45 37 Z" fill="#3a2a22" />
      <path d="M91 42 L88 20 L75 37 Z" fill="#3a2a22" />
      <path d="M16 52 Q18 32 60 30 Q102 32 104 52 Q104 74 60 104 Q16 74 16 52 Z" fill="#f08a3a" />
      <path d="M18 58 Q34 62 48 76 Q56 86 60 104 Q40 90 26 74 Q19 66 18 58 Z" fill="#fff7ee" />
      <path d="M102 58 Q86 62 72 76 Q64 86 60 104 Q80 90 94 74 Q101 66 102 58 Z" fill="#fff7ee" />
      <path d="M48 76 Q60 70 72 76 Q66 92 60 104 Q54 92 48 76 Z" fill="#fff7ee" />
      <ellipse cx="44" cy="58" rx="4" ry="4.6" fill="#2b1d16" />
      <ellipse cx="76" cy="58" rx="4" ry="4.6" fill="#2b1d16" />
      <circle cx="45.4" cy="56.4" r="1.3" fill="#fff" />
      <circle cx="77.4" cy="56.4" r="1.3" fill="#fff" />
      <circle cx="44" cy="58" r="11" fill="rgba(255,255,255,0.18)" stroke="#1c1b1b" strokeWidth="3" />
      <circle cx="76" cy="58" r="11" fill="rgba(255,255,255,0.18)" stroke="#1c1b1b" strokeWidth="3" />
      <path d="M55 57 Q60 53 65 57" fill="none" stroke="#1c1b1b" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 55 L20 50" stroke="#1c1b1b" strokeWidth="3" strokeLinecap="round" />
      <path d="M87 55 L100 50" stroke="#1c1b1b" strokeWidth="3" strokeLinecap="round" />
      <path d="M55 92 Q60 88 65 92 Q60 98 55 92 Z" fill="#1c1b1b" />
      <path d="M60 97 Q56 101 52 99 M60 97 Q64 101 68 99" fill="none" stroke="#1c1b1b" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
