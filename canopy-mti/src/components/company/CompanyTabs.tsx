import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Shirt, GitBranch, Globe2, Sprout, ClipboardCheck, StickyNote } from 'lucide-react'
import { cn } from '@/lib/cn'

export const COMPANY_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'materials', label: 'Products & Materials', icon: Shirt },
  { id: 'supply-chain', label: 'Supply Chain', icon: GitBranch },
  { id: 'geography', label: 'Geography', icon: Globe2 },
  { id: 'opportunities', label: 'Transition Opportunities', icon: Sprout },
  { id: 'commitments', label: 'Company Commitments', icon: ClipboardCheck },
  { id: 'notes', label: 'Notes / Sources', icon: StickyNote },
] as const

export function CompanyTabs({ companyId }: { companyId: string }) {
  return (
    <div className="border-b border-slate-200 -mx-4 lg:mx-0 px-4 lg:px-0 overflow-x-auto scroll-thin">
      <nav className="flex gap-1 min-w-max">
        {COMPANY_TABS.map(({ id, label, icon: Icon }) => (
          <NavLink
            key={id}
            to={`/companies/${companyId}/${id}`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                isActive ? 'border-brand-700 text-brand-800' : 'border-transparent text-slate-500 hover:text-slate-800',
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
