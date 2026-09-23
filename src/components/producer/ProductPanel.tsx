import { ArrowRight, AlertTriangle, Info } from 'lucide-react'
import type { Company, LinkStatus, Product } from '@/data/model'
import { useStore } from '@/store/StoreContext'
import { useUI } from '@/context/UIContext'
import { Card } from '@/components/ui/Card'
import { FibreBar } from '@/components/ui/FibreBar'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn } from '@/lib/cn'

const LINK_LABEL: Record<LinkStatus, string> = { confirmed: 'Confirmed', unresolved: 'To verify', not_applicable: 'n/a' }

function ChainStep({ label, value, status, last }: { label: string; value: string; status: LinkStatus | 'unknown'; last?: boolean }) {
  const colour = status === 'confirmed' ? 'bg-green-500' : status === 'unresolved' ? 'bg-slate-300' : 'bg-slate-200'
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={cn('w-3 h-3 rounded-full mt-1', colour)} />
        {!last && <span className="w-px flex-1 bg-slate-200 my-1" />}
      </div>
      <div className="pb-4">
        <div className="text-[13px] font-semibold text-slate-900">{label}</div>
        <div className={cn('text-[13px]', status === 'confirmed' ? 'text-slate-700' : 'text-slate-500')}>{value}</div>
      </div>
    </div>
  )
}

export function ProductPanel({ company, product, onExplore, panelOpen }: { company: Company; product: Product; onExplore: () => void; panelOpen: boolean }) {
  const { data } = useStore()
  const { openEvidence } = useUI()
  const volume = data.quantities.find((q) => q.id === product.volumeQuantityId)
  const rels = data.relationships.filter((r) => r.fromType === 'product' && r.fromId === product.id)
  const millRel = rels.find((r) => r.kind === 'produced_at')
  const originRel = rels.find((r) => r.kind === 'sourced_from')
  const mill = data.facilities.find((f) => f.id === millRel?.toId)
  const origin = data.origins.find((o) => o.id === originRel?.toId)
  const compSource = data.sources.find((s) => s.id === product.composition.sourceIds[0])

  const gaps: { label: string; value: string }[] = [
    { label: 'Product tonnage', value: volume && volume.value !== null ? `${volume.value} ${volume.unit}` : 'Unknown' },
    { label: 'Mill allocation', value: mill ? mill.name : millRel?.status === 'unresolved' ? 'To verify' : 'Unknown' },
    { label: 'Fibre origin', value: origin ? origin.name : 'Unknown' },
    { label: 'Customer relationships', value: 'Unknown' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <div className="text-[13px] text-slate-500">Selected product</div>
        <h3 className="text-[22px] font-bold text-slate-900 leading-tight mt-1">{product.name}</h3>
        <div className="text-[13px] text-slate-500">{product.application}</div>

        <div className="mt-4">
          <FibreBar composition={product.composition} height={32} />
          <div className="flex items-center justify-between mt-2 text-[13px]">
            <span className="text-slate-700">
              {product.composition.virginWoodPct ?? '?'}% virgin / {product.composition.recycledPct ?? '?'}% recycled
              {(product.composition.nextGenPct ?? 0) > 0 && ` / ${product.composition.nextGenPct}% Next Gen`}
            </span>
            {compSource && <EvidenceBadge source={compSource} label={product.composition.status === 'reported' ? 'Company-reported' : product.composition.status} size="xs" />}
          </div>
          {product.composition.basis && <p className="text-[11px] text-slate-400 mt-1">{product.composition.basis}</p>}
        </div>

        <div className="mt-4">
          <div className="text-[13px] text-slate-500">Annual product volume</div>
          <div className="flex items-center gap-2">
            <span className={cn('text-lg font-semibold', volume?.value === null || !volume ? 'text-slate-500' : 'text-slate-900')}>{volume && volume.value !== null ? `${volume.value.toLocaleString()} ${volume.unit}` : 'Unknown'}</span>
            {volume && (
              <button onClick={() => openEvidence({ quantity: volume })} className="text-slate-400 hover:text-brand-600">
                <Info size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 mt-4 pt-4">
          <div className="text-[14px] font-semibold text-slate-900 mb-3">Supply-chain context</div>
          <ChainStep label="Producer" value={company.name} status={company.mapping.supplierIdentified} />
          <ChainStep label="Mill" value={mill ? `${mill.name} (${mill.country})` : millRel?.note ?? 'To verify'} status={millRel?.status ?? 'unknown'} />
          <ChainStep label="Fibre origin" value={origin ? origin.name : originRel?.note ?? 'Unknown'} status={originRel?.status ?? 'unknown'} last />
          {product.productionRegion && <p className="text-[11px] text-slate-400 -mt-2">{product.productionRegion.text}</p>}
        </div>

        <button
          onClick={onExplore}
          className={cn('mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors', panelOpen ? 'bg-brand-100 text-brand-700' : 'bg-brand-500 text-white hover:bg-brand-600')}
        >
          <ArrowRight size={16} /> {panelOpen ? 'Transition options open' : 'Explore transition options'}
        </button>
        
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-900 mb-3">
          Evidence gaps <Info size={13} className="text-slate-400" />
        </div>
        <ul className="flex flex-col gap-2">
          {gaps.map((g) => (
            <li key={g.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-cream-50 px-3 py-2 text-[13px]">
              <span className="inline-flex items-center gap-2 text-slate-800"><AlertTriangle size={13} className="text-slate-400" /> {g.label}</span>
              <span className={cn(g.value === 'Unknown' || g.value === 'To verify' ? 'text-slate-500' : 'text-slate-800 font-medium')}>{g.value}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-[11px] text-slate-500">
          Mapping: supplier <b>{LINK_LABEL[company.mapping.supplierIdentified]}</b> · mill <b>{LINK_LABEL[millRel?.status ?? 'unresolved']}</b> · origin <b>{LINK_LABEL[originRel?.status ?? 'unresolved']}</b>. These are never collapsed into a single "fully mapped" badge.
        </div>
      </Card>
    </div>
  )
}
