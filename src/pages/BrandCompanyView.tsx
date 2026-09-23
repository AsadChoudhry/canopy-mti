import { Info } from 'lucide-react'
import { CompanyHeader } from '@/components/company/CompanyHeader'
import { CompanyTabs } from '@/components/company/CompanyTabs'
import { getCompany } from '@/data/companies'
import { OverviewTab } from './company/OverviewTab'
import { SupplyChainTab } from './company/SupplyChainTab'
import { GeographyTab } from './company/GeographyTab'
import { OpportunitiesTab } from './company/OpportunitiesTab'
import { CommitmentsTab } from './company/CommitmentsTab'
import { NotesTab } from './company/NotesTab'
import { MaterialExplorer } from '@/components/company/MaterialExplorer'

/**
 * Brand purchasing view (H&M). Volumes here are material purchases — products and packaging —
 * kept in a separate accounting view from producer output and never added to global producer totals.
 */
export function BrandCompanyView({ companyId, tab }: { companyId: string; tab: string }) {
  const company = getCompany(companyId)
  if (!company) return null
  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="rounded-xl bg-brand-50 border border-brand-100 text-brand-800 text-[12px] px-4 py-2.5 flex items-start gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        <span>
          <b>Brand purchasing view.</b> Tonnes shown are H&M's reported material purchases (products + packaging), not paper production. They sit in a separate accounting view and are not added to the global producer total — the same fibre can pass through several companies.
        </span>
      </div>
      <CompanyHeader company={company} />
      <CompanyTabs companyId={companyId} />
      {tab === 'overview' && <OverviewTab companyId={companyId} />}
      {tab === 'materials' && <MaterialExplorer companyId={companyId} />}
      {tab === 'supply-chain' && <SupplyChainTab />}
      {tab === 'geography' && <GeographyTab />}
      {tab === 'opportunities' && <OpportunitiesTab />}
      {tab === 'commitments' && <CommitmentsTab />}
      {tab === 'notes' && <NotesTab />}
    </div>
  )
}
