import { HM_COMMITMENTS } from '@/data/hm'
import { SOURCES } from '@/data/sources'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { cn } from '@/lib/cn'

const STATUS: Record<string, { label: string; tone: 'forest' | 'lime' | 'inferred' | 'grey' }> = {
  reported: { label: 'Reported', tone: 'forest' },
  committed: { label: 'Committed', tone: 'lime' },
  partner_programme: { label: 'Canopy programme', tone: 'inferred' },
  not_loaded: { label: 'Not loaded', tone: 'grey' },
}

export function CommitmentsTab() {
  return (
    <Card className="animate-fade-up">
      <CardHeader title="Company commitments & reported performance" subtitle="Only commitments with a source are shown. Anything else is marked not loaded." />
      <ul className="px-5 pb-5 grid md:grid-cols-2 gap-3">
        {HM_COMMITMENTS.map((c) => (
          <li key={c.id} className={cn('rounded-xl border p-4', c.status === 'not_loaded' ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 bg-white')}>
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900">{c.title}</div>
              <Pill tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Pill>
            </div>
            <p className="text-[13px] text-slate-600 mt-1">{c.detail}</p>
            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
              <span>
                {SOURCES[c.sourceId]?.title}
                {c.year && ` · ${c.year}`}
              </span>
              <ConfidenceBadge level={c.confidence} size="xs" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
