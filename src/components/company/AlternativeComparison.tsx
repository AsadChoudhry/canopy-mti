import { ArrowRight, Scale } from 'lucide-react'
import type { AlternativeMaterial, MaterialGrouping } from '@/data/types'
import { HM_MAJOR_MARKETS } from '@/data/ecopaper'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { Button } from '@/components/ui/Button'
import { InfoButton } from '@/components/ui/InfoButton'
import { FIT_META } from '@/lib/confidence'
import { useUI } from '@/context/UIContext'
import { cn } from '@/lib/cn'

function Line({ label, value, unknown, strong }: { label: string; value?: React.ReactNode; unknown?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0 text-[13px]">
      <span className="text-slate-500">{label}</span>
      <span className={cn('text-right', unknown ? 'text-slate-400 italic' : strong ? 'font-semibold text-slate-900' : 'text-slate-800')}>{unknown ? 'Unknown' : value}</span>
    </div>
  )
}

export function AlternativeComparison({ grouping, alt, className }: { grouping: MaterialGrouping; alt: AlternativeMaterial; className?: string }) {
  const { openActionPlan } = useUI()
  const mfg = alt.manufacturingCountries === 'global' ? ['Global'] : alt.manufacturingCountries
  const overlaps = alt.manufacturingCountries !== 'global' ? alt.manufacturingCountries.filter((c) => HM_MAJOR_MARKETS.includes(c)) : []
  const rows: { label: string; key: keyof AlternativeMaterial['fit'] }[] = [
    { label: 'Geography', key: 'geography' },
    { label: 'Material', key: 'material' },
    { label: 'Application', key: 'application' },
    { label: 'Volume', key: 'volume' },
    { label: 'Technical specification', key: 'technical' },
    { label: 'Economics', key: 'economics' },
    { label: 'Supplier qualification', key: 'qualification' },
  ]

  return (
    <div className={cn('grid lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch', className)}>
      {/* LEFT: current state */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 bg-slate-800 text-white">Current state</span>
          <ConfidenceBadge level="partial" size="xs" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">H&M {grouping.name} packaging</h4>
        <div className="mt-2">
          <Line
            label="Volume"
            value={
              <span className="inline-flex items-center gap-1">
                {grouping.derivedTonnes.display}/yr <InfoButton evidence={grouping.derivedTonnes} size={12} />
              </span>
            }
            strong
          />
          <Line label="Recycled" value={`${grouping.recycledPct?.value}%`} />
          <Line label="Non-recycled" value={grouping.recycledPct ? `${100 - grouping.recycledPct.value}%` : undefined} />
          <Line label="Current supplier" unknown />
          <Line label="Paper mill" unknown />
          <Line label="Technical specification" unknown />
          <Line label="Application breakdown" unknown />
        </div>
      </div>

      {/* MIDDLE: match assessment */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 lg:w-[280px] flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-600 mb-3">
          <Scale size={13} /> Match assessment
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          {rows.map((r) => {
            const meta = FIT_META[alt.fit[r.key]]
            return (
              <div key={r.key} className="flex items-center justify-between gap-2 text-[12px]">
                <span className="text-slate-600">{r.label}</span>
                <ConfidenceBadge level={meta.confidence} label={meta.label} size="xs" />
              </div>
            )
          })}
        </div>
        <div className="mt-4 rounded-xl bg-white border border-amber-100 p-3 text-center">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">Overall</div>
          <div className="text-sm font-bold text-brand-800 mt-0.5">{alt.overall === 'promising_lead' ? 'Promising lead' : 'Candidate'}</div>
          <div className="text-[11px] text-amber-600 font-semibold">Not yet qualified</div>
        </div>
      </div>

      {/* RIGHT: candidate */}
      <div className="rounded-2xl border border-teal-500/40 bg-teal-300/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 bg-teal-400 text-brand-900">Candidate alternative</span>
          <ConfidenceBadge level={alt.confidence} size="xs" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">{alt.provider}</h4>
        <div className="text-[11px] text-slate-500">{alt.product}</div>
        <div className="mt-2">
          <Line label="Feedstock" value={alt.feedstock} strong />
          <Line label="Wood fibre" value={alt.woodFibrePct === null ? undefined : `${alt.woodFibrePct}%`} unknown={alt.woodFibrePct === null} />
          <Line
            label="Manufacturing"
            value={mfg.map((c, i) => (
              <span key={c}>
                <span className={cn(overlaps.includes(c) && 'font-semibold text-brand-700')}>{c}</span>
                {i < mfg.length - 1 && ' / '}
              </span>
            ))}
          />
          <Line label="Capacity" value={alt.capacity ?? undefined} unknown={!alt.capacity} />
          <Line label="MOQ" value={alt.moq ?? undefined} unknown={!alt.moq} />
          <Line label="Certification" value={alt.certification ?? undefined} unknown={!alt.certification} />
          <Line label="Applications" value={alt.applications.join(', ')} />
        </div>
      </div>

      {/* NEXT ACTION — spans */}
      <div className="lg:col-span-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-600">Next Canopy action</div>
          <p className="text-sm font-medium text-brand-900 mt-0.5">{alt.nextCanopyAction}</p>
          {overlaps.length > 0 && (
            <p className="text-[11px] text-slate-500 mt-1">
              Potential geographic overlap: {overlaps.join(', ')} — H&M major production market(s). Not a confirmed supplier replacement.
            </p>
          )}
        </div>
        <Button icon={<ArrowRight size={15} />} onClick={() => openActionPlan(`${grouping.name} × ${alt.provider}`)}>
          Create Action
        </Button>
      </div>
    </div>
  )
}
