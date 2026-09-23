import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { CompanyList } from '@/components/producer/CompanyList'
import { ProductPanel } from '@/components/producer/ProductPanel'
import { TransitionPanel } from '@/components/producer/TransitionPanel'
import { CompanyOverview } from '@/components/producer/CompanyOverview'
import { CompanyFibreOverview } from '@/components/producer/CompanyFibreOverview'
import { HotButtonScorecard } from '@/components/global/HotButton'
import { HOT_BUTTON_2025 } from '@/data/hotbutton'
import { ProductList } from '@/components/producer/ProductList'
import { ProductProfile } from '@/components/producer/ProductProfile'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Card } from '@/components/ui/Card'
import { useStore } from '@/store/StoreContext'
import type { Company, Product } from '@/data/model'
import { cn } from '@/lib/cn'

export function CompaniesPage() {
  const { companyId } = useParams()
  const [params, setParams] = useSearchParams()
  const { data } = useStore()

  const company = data.companies.find((c) => c.id === companyId)
  if (companyId && !company) return <Navigate to="/companies" replace />

  const productId = params.get('product')
  const product = data.products.find((p) => p.id === productId && p.companyId === companyId)
  const panel = params.get('panel') === 'transition'
  const ptab = (params.get('tab') as 'alternatives' | 'scenario' | 'evidence') || 'alternatives'

  const set = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    setParams(p)
  }

  const crumbs = [{ label: 'Companies', to: company ? '/companies' : undefined }, ...(company ? [{ label: company.name, to: product ? `/companies/${company.id}` : undefined }] : []), ...(product ? [{ label: product.name.replace('ProVantage ', '') }] : [])]

  const hbRow = HOT_BUTTON_2025.find((h) => h.id === companyId)
  const out = data.quantities.find((q) => q.id === company?.totalOutputQuantityId)
  const share = data.quantities.find((q) => q.id === company?.globalComparisonQuantityId)

  return (
    <AppShell crumbs={crumbs}>
      <div className={cn('grid gap-5 items-start', !company ? 'lg:grid-cols-[240px_minmax(0,1fr)]' : panel ? 'lg:grid-cols-[190px_minmax(0,1fr)]' : 'lg:grid-cols-[200px_225px_minmax(0,1fr)]')}>
        <div className="lg:sticky lg:top-20">
          <CompanyList activeId={companyId} />
        </div>

        {company && !panel && (
          <div className="lg:sticky lg:top-20">
            <ProductList company={company} activeId={product?.id} onSelect={(id) => set({ product: id, panel: null })} />
          </div>
        )}

        {!company ? (
          <Card className="p-10 text-center border-dashed">
            <div className="text-base font-semibold text-slate-700">Select a company</div>
            <p className="text-[13px] text-slate-500 mt-1">Choose a producer or a brand from the list.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4 min-w-0">
            {product && panel ? (
              <>
                <ProductPanelHeader company={company} product={product} onBack={() => set({ panel: null })} />
                <div className="grid xl:grid-cols-[360px_minmax(0,1fr)] gap-4 items-start">
                  <ProductPanel company={company} product={product} panelOpen onExplore={() => set({ panel: null })} />
                  <TransitionPanel company={company} product={product} tab={ptab} onTab={(t) => set({ tab: t })} />
                </div>
              </>
            ) : product ? (
              <ProductProfile company={company} product={product} onOpenTransition={() => set({ panel: 'transition' })} />
            ) : (
              <>
                {/* Company header */}
                <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-[88px] h-14 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-[18px] tracking-tight" style={{ color: company.logoColour }}>
                      {company.logoText}
                    </div>
                    <div>
                      <h1 className="text-[26px] font-bold text-slate-900 leading-tight whitespace-nowrap">{company.name}</h1>
                      <div className="text-[14px] text-slate-500">{company.sector}</div>
                    </div>
                  </div>
                  <div className="flex items-stretch divide-x divide-slate-200 shrink-0">
                    {out && out.value !== null && (
                      <div className="px-5 first:pl-0">
                        <div className="text-[24px] font-bold text-slate-900 leading-none whitespace-nowrap">{out.value} {out.unit}</div>
                        <div className="text-[12px] text-slate-500 mt-1.5 flex items-center gap-2">
                          Output, {out.period} <EvidenceBadge quantity={out} size="xs" label={out.status === 'calculated' ? 'Calculated' : 'Reported'} />
                        </div>
                      </div>
                    )}
                    <div className="px-5">
                      <div className="text-[24px] font-bold text-slate-900 leading-none">{share && share.value !== null ? `~${share.value}%` : 'Unknown'}</div>
                      <div className="text-[12px] text-slate-500 mt-1.5 flex items-center gap-2">
                        {hbRow ? 'of global MMCF capacity' : 'of global packaging'} {share && <EvidenceBadge quantity={share} size="xs" label="" className="px-1" />}
                      </div>
                    </div>
                  </div>
                </div>
                {company.description && <p className="text-[13px] text-slate-600 max-w-3xl -mt-1">{company.description}</p>}

                {hbRow ? (
                  <>
                    <HotButtonScorecard row={hbRow} />
                    {company.notes && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-slate-700">
                        <div className="font-semibold text-slate-900 mb-1">What Canopy asks for next</div>
                        {company.notes}
                      </div>
                    )}
                  </>
                ) : (
                  <CompanyFibreOverview company={company} />
                )}
                <CompanyOverview company={company} />
              </>
            )}

          </div>
        )}
      </div>
    </AppShell>
  )
}

function ProductPanelHeader({ company, product, onBack }: { company: Company; product: Product; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-[12px] text-slate-500">{company.name}</div>
        <h1 className="text-[22px] font-bold text-slate-900 leading-tight">Transition assessment: {product.name}</h1>
      </div>
      <button onClick={onBack} className="text-[12px] font-semibold text-brand-600 hover:underline">← Back to product profile</button>
    </div>
  )
}
