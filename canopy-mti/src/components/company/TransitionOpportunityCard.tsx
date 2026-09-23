import { ArrowRight, Link2, Database } from 'lucide-react'
import type { TransitionOpportunity } from '@/data/types'
import { Pill } from '@/components/ui/Pill'
import { InfoButton } from '@/components/ui/InfoButton'
import { cn } from '@/lib/cn'

const IMPACT: Record<TransitionOpportunity['impact'], { label: string; tone: 'lime' | 'amber' | 'grey' | 'inferred' }> = {
  high: { label: 'High impact', tone: 'lime' },
  medium: { label: 'Medium impact', tone: 'amber' },
  low: { label: 'Low impact', tone: 'grey' },
  enabler: { label: 'Enabler', tone: 'inferred' },
}
const CONF_LABEL: Record<TransitionOpportunity['confidence'], string> = { high: 'High', medium: 'Medium', low: 'Low', low_medium: 'Low–Medium' }

const NUM_BG = ['bg-brand-600 text-white', 'bg-amber-400 text-white', 'bg-inferred-500 text-white', 'bg-brand-800 text-white']

export function TransitionOpportunityCard({
  opp,
  compact,
  onOpen,
  className,
}: {
  opp: TransitionOpportunity
  compact?: boolean
  onOpen?: (o: TransitionOpportunity) => void
  className?: string
}) {
  const impact = IMPACT[opp.impact]
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onOpen?.(opp)}
        className={cn('text-left rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-start gap-3 hover:border-brand-400 transition-colors', className)}
      >
        <span className={cn('w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5', NUM_BG[(opp.number - 1) % 4])}>{opp.number}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[13px] font-semibold text-slate-900 leading-snug">{opp.title}</div>
            <Pill tone={impact.tone} className="shrink-0">
              {impact.label}
            </Pill>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{opp.addressableMaterial ?? opp.geographicSignal ?? opp.summary}</div>
        </div>
      </button>
    )
  }

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-4', className)}>
      <div className="flex items-start gap-3">
        <span className={cn('w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0', NUM_BG[(opp.number - 1) % 4])}>{String(opp.number).padStart(2, '0')}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">Opportunity {String(opp.number).padStart(2, '0')}</div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug">{opp.title}</h3>
          <p className="text-[13px] text-slate-600 mt-1">{opp.summary}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Pill tone={impact.tone}>{impact.label}</Pill>
        <Pill tone={opp.confidence === 'high' ? 'forest' : opp.confidence === 'medium' ? 'amber' : 'grey'}>Confidence: {CONF_LABEL[opp.confidence]}</Pill>
        <Pill tone="default">
          <Link2 size={11} /> {opp.linkedTool}
        </Pill>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3 text-[12px]">
        {opp.addressableMaterial && (
          <Field label="Addressable material">
            <span className="font-semibold text-slate-900 inline-flex items-center gap-1">
              {opp.addressableMaterial}
              {opp.addressableEvidenceId && <InfoButton evidence={opp.addressableEvidenceId} size={12} />}
            </span>
          </Field>
        )}
        <Field label="Feasibility">{opp.feasibility}</Field>
        {opp.candidates && <Field label="Potential candidates">{opp.candidates.join(' / ')}</Field>}
        {opp.geographicSignal && <Field label="Geographic signal">{opp.geographicSignal}</Field>}
        {opp.primaryBarrier && <Field label="Primary barrier">{opp.primaryBarrier}</Field>}
        {opp.existingStrength && <Field label="Existing strength">{opp.existingStrength}</Field>}
        {opp.strategicQuestion && (
          <Field label="Strategic question" className="sm:col-span-2">
            <span className="italic text-brand-800">“{opp.strategicQuestion}”</span>
          </Field>
        )}
        <Field label="Primary missing information" className="sm:col-span-2">
          <div className="flex flex-wrap gap-1 mt-0.5">
            {opp.missingInformation.map((m) => (
              <span key={m} className="rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-600 px-1.5 py-0.5 inline-flex items-center gap-1">
                <Database size={10} /> {m}
              </span>
            ))}
          </div>
        </Field>
      </div>

      <div className="rounded-xl bg-brand-50 border border-brand-100 px-3 py-2.5 flex items-start gap-2">
        <ArrowRight size={14} className="text-brand-600 mt-0.5 shrink-0" />
        <div>
          <div className="text-[10px] uppercase tracking-wide font-semibold text-brand-600">Recommended action</div>
          <p className="text-[13px] font-medium text-brand-900">{opp.recommendedAction}</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">{label}</div>
      <div className="text-slate-700 mt-0.5">{children}</div>
    </div>
  )
}
