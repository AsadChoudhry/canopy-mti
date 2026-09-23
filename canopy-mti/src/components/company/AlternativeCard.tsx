import { ChevronRight, MapPin, Leaf, Boxes, Gauge } from 'lucide-react'
import type { AlternativeMaterial } from '@/data/types'
import { HM_MAJOR_MARKETS } from '@/data/ecopaper'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { FIT_META } from '@/lib/confidence'
import { cn } from '@/lib/cn'

const OVERALL: Record<AlternativeMaterial['overall'], { label: string; tone: 'lime' | 'amber' | 'grey' }> = {
  promising_lead: { label: 'Promising lead', tone: 'lime' },
  candidate: { label: 'Candidate', tone: 'amber' },
  not_assessed: { label: 'Not assessed', tone: 'grey' },
}

function Unknown() {
  return <span className="text-slate-400 italic">Unknown</span>
}

export function AlternativeCard({
  alt,
  onSelect,
  selected,
  compact,
  className,
}: {
  alt: AlternativeMaterial
  onSelect?: (a: AlternativeMaterial) => void
  selected?: boolean
  compact?: boolean
  className?: string
}) {
  const mfg = alt.manufacturingCountries === 'global' ? ['Global'] : alt.manufacturingCountries
  const overlaps = alt.manufacturingCountries !== 'global' ? alt.manufacturingCountries.filter((c) => HM_MAJOR_MARKETS.includes(c)) : []
  const overall = OVERALL[alt.overall]

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(alt)}
        className={cn(
          'w-full text-left flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-colors hover:border-brand-400',
          selected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200',
          className,
        )}
      >
        <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: alt.colour + '33' }}>
          <Leaf size={18} style={{ color: alt.colour === '#6a47ea' ? '#5f7d0f' : alt.colour }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-semibold text-slate-900">{alt.provider}</span>
            <Pill tone="forest" className="px-1.5 py-0">
              {alt.feedstockShort}
            </Pill>
            <Pill tone="lime" className="px-1.5 py-0">
              {alt.woodFibrePct === null ? 'wood fibre: unknown' : `${alt.woodFibrePct}% wood fibre`}
            </Pill>
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">{alt.applications.slice(0, 4).join(', ')}</div>
          <div className="text-[11px] text-slate-500 truncate">Manufacture: {mfg.join(', ')}</div>
        </div>
        <ChevronRight size={16} className="text-slate-400 shrink-0" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white p-4 flex flex-col gap-3 transition-colors',
        selected ? 'border-brand-500 ring-1 ring-brand-300' : 'border-slate-200',
        onSelect && 'cursor-pointer hover:border-brand-400',
        className,
      )}
      onClick={() => onSelect?.(alt)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: alt.colour + '33' }}>
            <Leaf size={18} style={{ color: alt.colour === '#6a47ea' ? '#5f7d0f' : alt.colour }} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{alt.provider}</div>
            <div className="text-[11px] text-slate-500 truncate">{alt.product}</div>
          </div>
        </div>
        <Pill tone={overall.tone}>{overall.label}</Pill>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
        <Cell label="Material" value={alt.feedstockShort} />
        <Cell label="Wood displacement" value={<span className="capitalize">{alt.woodDisplacementPotential}</span>} />
        <Cell
          label="Wood fibre"
          value={alt.woodFibrePct === null ? <Unknown /> : <span className="font-semibold text-brand-700">{alt.woodFibrePct}%</span>}
        />
        <Cell label="Category" value={alt.category} />
        <Cell
          label="Manufacturing"
          value={
            <span className="inline-flex items-center gap-1 flex-wrap">
              <MapPin size={11} className="text-slate-400" />
              {mfg.map((c) => (
                <span key={c} className={cn(overlaps.includes(c) && 'font-semibold text-brand-700 underline decoration-teal-500 decoration-2 underline-offset-2')}>
                  {c}
                </span>
              ))}
            </span>
          }
          className="col-span-2"
        />
        <Cell label="Applications" value={<span className="inline-flex items-center gap-1"><Boxes size={11} className="text-slate-400" />{alt.applications.join(' · ')}</span>} className="col-span-2" />
        <Cell label="Capacity" value={alt.capacity ? <span className="inline-flex items-center gap-1"><Gauge size={11} className="text-slate-400" />{alt.capacity}</span> : <Unknown />} />
        <Cell label="MOQ" value={alt.moq ?? <Unknown />} />
        <Cell label="Certification" value={alt.certification ?? <Unknown />} />
        <Cell label="Availability" value={alt.regionalAvailability} />
      </div>

      <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-[11px]">
        <Fit label="Geographic overlap" status={alt.fit.geography} />
        <Fit label="Technical fit" status={alt.fit.technical} />
        <Fit label="Commercial fit" status={alt.fit.economics} />
        <Fit label="Volume fit" status={alt.fit.volume} />
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-500">Listing confidence</span>
        <ConfidenceBadge level={alt.confidence} size="xs" />
      </div>
    </div>
  )
}

function Cell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">{label}</div>
      <div className="text-slate-700 mt-0.5 leading-snug">{value}</div>
    </div>
  )
}

function Fit({ label, status }: { label: string; status: AlternativeMaterial['fit']['geography'] }) {
  const meta = FIT_META[status]
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <ConfidenceBadge level={meta.confidence} label={meta.label} size="xs" />
    </div>
  )
}
