import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { useUI } from '@/context/UIContext'
import { HM_ACTION_PLAN } from '@/data/hm'
import { cn } from '@/lib/cn'
import { Download, Target, Users, Database, Handshake, TrendingUp } from 'lucide-react'
import { Pill } from '@/components/ui/Pill'

const CONF_TONE: Record<string, 'forest' | 'amber' | 'grey' | 'inferred'> = { high: 'forest', medium: 'amber', low: 'grey', low_medium: 'amber' }
const STATUS_LABEL: Record<string, string> = { not_started: 'Not started', planned: 'Planned', in_progress: 'In progress', requested: 'Requested', received: 'Received' }

export function ActionPlanDrawer() {
  const { actionPlanOpen, closeActionPlan, actionPlanContext } = useUI()
  return (
    <Drawer
      open={actionPlanOpen}
      onClose={closeActionPlan}
      width="lg"
      title="Action plan — H&M Group material transition"
      subtitle={actionPlanContext ? `Generated from: ${actionPlanContext}` : 'Sequenced interventions derived from current data gaps and opportunities'}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">Every step is gated on data Canopy does not yet hold. Owners are indicative.</p>
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>
            Export plan
          </Button>
        </div>
      }
    >
      <ol className="flex flex-col gap-3">
        {HM_ACTION_PLAN.map((a) => (
          <li key={a.priority} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0',
                  a.priority === 1 ? 'bg-teal-400 text-brand-900' : 'bg-brand-100 text-brand-700',
                )}
              >
                {a.priority}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{a.action}</h4>
                  <Pill tone={a.status === 'not_started' ? 'grey' : 'default'}>{STATUS_LABEL[a.status]}</Pill>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-[12px]">
                  <Field icon={<Users size={12} />} label="Owner" value={a.owner} />
                  <Field icon={<Handshake size={12} />} label="Partner" value={a.partner} />
                  <Field icon={<TrendingUp size={12} />} label="Expected material impact" value={a.expectedImpact} className="sm:col-span-2" />
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                      <Database size={12} /> Data required
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {a.dataRequired.map((d) => (
                        <span key={d} className="rounded-md bg-slate-100 text-slate-600 px-1.5 py-0.5">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  {a.metrics && (
                    <div className="sm:col-span-2">
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                        <Target size={12} /> Metrics
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {a.metrics.map((d) => (
                          <span key={d} className="rounded-md bg-brand-50 text-brand-700 px-1.5 py-0.5">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  Confidence <Pill tone={CONF_TONE[a.confidence]}>{a.confidence.replace('_', '–')}</Pill>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Drawer>
  )
}

function Field({ icon, label, value, className }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold text-slate-400">
        {icon} {label}
      </div>
      <div className="text-slate-700 mt-0.5">{value}</div>
    </div>
  )
}
