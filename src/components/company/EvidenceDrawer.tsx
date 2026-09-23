import { Calculator, ExternalLink, FileText, AlertTriangle, ClipboardList } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { useUI } from '@/context/UIContext'
import { useStore } from '@/store/StoreContext'
import { EVIDENCE_STATUS_META, type Source } from '@/data/model'
import { fmtDate } from '@/lib/format'
import { cn } from '@/lib/cn'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2.5 border-b border-slate-100 last:border-0 text-sm">
      <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 pt-0.5">{label}</div>
      <div className="text-slate-800 min-w-0">{children}</div>
    </div>
  )
}

function SourceBlock({ s }: { s: Source }) {
  return (
    <div className={cn('rounded-xl border p-3 text-[13px]', s.accessed ? 'border-slate-200 bg-white' : 'border-dashed border-amber-400 bg-amber-50')}>
      <div className="flex items-start gap-2">
        <FileText size={15} className="text-brand-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900">{s.title}</div>
          <div className="text-xs text-slate-500">{s.publisher}</div>
          {s.url && (
            <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1 mt-1 break-all">
              {s.url.replace(/^https?:\/\//, '').slice(0, 70)}
              {s.url.length > 78 && '…'} <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 text-xs">
        <div><span className="text-slate-400">Page / section</span><div className="text-slate-700">{s.page ?? '—'}</div></div>
        <div><span className="text-slate-400">Accessed</span><div className={cn('text-slate-700', !s.accessed && 'text-amber-600 font-semibold')}>{s.accessed ? fmtDate(s.accessDate) : 'Not accessed — unverified'}</div></div>
        <div><span className="text-slate-400">Review</span><div className="text-slate-700 capitalize">{s.reviewStatus.replace('_', ' ')}</div></div>
        <div><span className="text-slate-400">Type</span><div className="text-slate-700 capitalize">{s.kind.replace(/_/g, ' ')}</div></div>
      </div>
      {s.passage && (
        <blockquote className="mt-3 border-l-2 border-brand-300 pl-3 text-[12px] text-slate-700 italic">{s.passage}</blockquote>
      )}
      {s.limitations && (
        <div className="mt-2 flex gap-2 text-[12px] text-amber-700">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {s.limitations}
        </div>
      )}
      {s.reviewerNotes && (
        <div className="mt-2 flex gap-2 text-[12px] text-slate-500">
          <ClipboardList size={13} className="shrink-0 mt-0.5" /> {s.reviewerNotes}
        </div>
      )}
    </div>
  )
}

export function EvidenceDrawer() {
  const { evidence, openEvidence } = useUI()
  const { data } = useStore()
  if (!evidence) return null
  const q = evidence.quantity
  const sources: Source[] = q ? q.sourceIds.map((id) => data.sources.find((s) => s.id === id)).filter((s): s is Source => !!s) : evidence.source ? [evidence.source] : []
  const meta = q ? EVIDENCE_STATUS_META[q.status] : null

  return (
    <Drawer open onClose={() => openEvidence(null)} title="Evidence" subtitle={q ? q.metric : evidence.source?.title}>
      {q && (
        <>
          <div className="rounded-xl bg-cream-100 border border-cream-200 p-4 mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">{q.value === null ? 'Unknown' : `${q.value.toLocaleString('en-US')} ${q.unit}`}</div>
              <div className="text-xs text-slate-500 mt-1">{q.metric}</div>
            </div>
            {meta && <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', meta.bg, meta.text)}>{meta.label}</span>}
          </div>
          <Row label="Period">{q.period}</Row>
          <Row label="Scope">{q.scope}</Row>
          <Row label="Basis"><span className="capitalize">{q.basis}</span></Row>
          {q.denominator && <Row label="Denominator">{q.denominator}</Row>}
          {q.formula && (
            <Row label="Formula">
              <div className="flex items-start gap-2">
                <Calculator size={15} className="text-inferred-500 mt-0.5 shrink-0" />
                <code className="text-[13px] bg-inferred-50 text-inferred-600 rounded px-1.5 py-0.5">{q.formula}</code>
              </div>
              {q.inputs && (
                <ul className="mt-2 text-xs text-slate-600 flex flex-col gap-0.5">
                  {q.inputs.map((i) => (
                    <li key={i.label} className="flex justify-between gap-3"><span>{i.label}</span><span className="font-medium text-slate-800">{i.value}</span></li>
                  ))}
                </ul>
              )}
            </Row>
          )}
          {q.note && <Row label="Limitations">{q.note}</Row>}
          {q.value === null && (
            <p className="mt-3 text-[12px] text-slate-600 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-3 py-2">Recorded as unknown, not as zero.</p>
          )}
        </>
      )}
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-2">{sources.length === 1 ? 'Source' : `Sources (${sources.length})`}</div>
        {sources.length ? (
          <div className="flex flex-col gap-3">{sources.map((s) => <SourceBlock key={s.id} s={s} />)}</div>
        ) : (
          <p className="text-sm text-slate-400 italic">No source attached.</p>
        )}
      </div>
    </Drawer>
  )
}
