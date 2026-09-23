import { Link } from 'react-router-dom'
import { ChevronRight, HelpCircle, Menu, Search, ChevronDown, ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export interface Crumb {
  label: ReactNode
  to?: string
}

export function TopBar({ crumbs, onMenu, back }: { crumbs: Crumb[]; onMenu: () => void; back?: string }) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 lg:px-6 bg-cream-100/90 backdrop-blur border-b border-cream-200 sticky top-0 z-20">
      <button className="lg:hidden p-1.5 rounded-lg hover:bg-cream-200" onClick={onMenu} aria-label="Menu">
        <Menu size={18} />
      </button>
      {back && (
        <Link to={back} className="text-slate-500 hover:text-brand-700 p-1 -ml-1" aria-label="Back">
          <ArrowLeft size={16} />
        </Link>
      )}
      <nav className="flex items-center gap-1.5 text-[13px] min-w-0 overflow-hidden">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
            {c.to ? (
              <Link to={c.to} className="text-slate-500 hover:text-brand-700 truncate">
                {c.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold truncate">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <label className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 w-[300px] xl:w-[360px] text-slate-400 text-[13px]">
          <Search size={15} />
          <input className="bg-transparent outline-none flex-1 text-slate-700 placeholder:text-slate-400" placeholder="Search companies, products, solutions…" />
        </label>
        <button className="text-slate-500 hover:text-brand-700" aria-label="Help">
          <HelpCircle size={18} />
        </button>
        <button className="flex items-center gap-1">
          <span className="w-8 h-8 rounded-full bg-brand-800 text-white text-xs font-bold flex items-center justify-center">AC</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </div>
    </header>
  )
}
