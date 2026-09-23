import { Drawer } from '@/components/ui/Drawer'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { useUI } from '@/context/UIContext'
import { SOURCES } from '@/data/sources'
import { CONFIDENCE_META } from '@/lib/confidence'
import { AlertTriangle, ArrowRight, CheckCircle2, HelpCircle, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h4 className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-2">
        {icon} {title}
      </h4>
      {children}
    </section>
  )
}

export function NodeDetailPanel() {
  const { activeNode: n, openNode, openActionPlan } = useUI()
  if (!n) return null
  const meta = CONFIDENCE_META[n.confidence]
  const sources = n.sourceIds.map((id) => SOURCES[id]).filter(Boolean)
  return (
    <Drawer
      open
      onClose={() => openNode(null)}
      title={n.label}
      subtitle={n.sublabel}
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">Recommended next research action</div>
          <Button size="sm" icon={<ArrowRight size={14} />} onClick={() => openActionPlan(n.label)}>
            Add to action plan
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-3 rounded-xl border p-3 mb-5" style={{ borderColor: meta.colour + '55', background: meta.colour + '10' }}>
        <div className="text-sm font-medium text-slate-800">Evidence status</div>
        <ConfidenceBadge level={n.confidence} size="md" label={meta.label} />
      </div>

      {n.entityName && (
        <div className="mb-5 text-sm">
          <span className="text-slate-500">Entity: </span>
          <span className="font-semibold">{n.entityName}</span>
        </div>
      )}

      <Section title="What we know" icon={<CheckCircle2 size={12} />}>
        {n.whatWeKnow.length ? (
          <ul className="flex flex-col gap-1.5 text-sm text-slate-700">
            {n.whatWeKnow.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic">Nothing verified at this stage.</p>
        )}
      </Section>

      <Section title="Source & date" icon={<HelpCircle size={12} />}>
        {sources.length ? (
          <ul className="text-[13px] text-slate-700 flex flex-col gap-1">
            {sources.map((s) => (
              <li key={s.id}>
                {s.title}
                {n.sourceDate && <span className="text-slate-400"> · {n.sourceDate}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic">No source — this stage is not evidenced.</p>
        )}
      </Section>

      {n.geography && (
        <Section title="Geography" icon={<MapPin size={12} />}>
          <div className="flex flex-wrap gap-1.5">
            {n.geography.map((g) => (
              <span key={g} className="rounded-full bg-cream-100 border border-cream-200 px-2 py-0.5 text-xs">
                {g}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="What is missing" icon={<AlertTriangle size={12} />}>
        {n.missing.length ? (
          <ul className="flex flex-col gap-1.5">
            {n.missing.map((m, i) => (
              <li key={i} className="text-sm text-slate-700 border border-dashed border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50">
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic">No open gaps for current scope.</p>
        )}
      </Section>

      <Section title="Why it matters" icon={<HelpCircle size={12} />}>
        <p className="text-sm text-slate-700">{n.whyItMatters}</p>
      </Section>

      <Section title="Recommended next action" icon={<ArrowRight size={12} />}>
        <p className="text-sm font-medium text-brand-800 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2">{n.nextAction}</p>
      </Section>
    </Drawer>
  )
}
