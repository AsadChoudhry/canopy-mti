import { Drawer } from '@/components/ui/Drawer'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { useUI } from '@/context/UIContext'
import { SOURCES, SOURCE_TYPE_LABEL } from '@/data/sources'
import { fmtDate, fmtNum } from '@/lib/format'
import { Calculator, FileText, Link2 } from 'lucide-react'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2.5 border-b border-slate-100 last:border-0 text-sm">
      <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 pt-0.5">{label}</div>
      <div className="text-slate-800">{children}</div>
    </div>
  )
}

export function SourceDrawer() {
  const { sourceEvidence: ev, closeSource } = useUI()
  if (!ev) return null
  const src = SOURCES[ev.sourceId]
  const underlying = (ev.underlyingSourceIds ?? []).map((id) => SOURCES[id]).filter(Boolean)
  const display = ev.display ?? (typeof ev.value === 'number' ? `${fmtNum(ev.value)}${ev.unit ? ` ${ev.unit}` : ''}` : String(ev.value))

  return (
    <Drawer open onClose={closeSource} title="Source & provenance" subtitle={ev.label}>
      <div className="rounded-xl bg-cream-100 border border-cream-200 p-4 mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{display}</div>
          <div className="text-xs text-slate-500 mt-1">{ev.label}</div>
        </div>
        <ConfidenceBadge level={ev.confidence} size="md" label={ev.confidence === 'inferred' ? 'Derived' : undefined} />
      </div>

      <Row label="Source">
        <div className="flex items-start gap-2">
          <FileText size={15} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-medium">{src?.title ?? ev.sourceId}</div>
            {src?.publisher && <div className="text-xs text-slate-500">{src.publisher}</div>}
          </div>
        </div>
      </Row>
      <Row label="Source type">{src ? SOURCE_TYPE_LABEL[src.type] : '—'}</Row>
      {ev.calculation && (
        <Row label="Calculation">
          <div className="flex items-start gap-2">
            <Calculator size={15} className="text-inferred-500 mt-0.5 shrink-0" />
            <code className="text-[13px] bg-inferred-50 text-inferred-600 rounded px-1.5 py-0.5">{ev.calculation}</code>
          </div>
        </Row>
      )}
      {underlying.length > 0 && (
        <Row label="Underlying source">
          {underlying.map((u) => (
            <div key={u.id} className="flex items-center gap-2">
              <Link2 size={13} className="text-slate-400" />
              <span>{u.title}</span>
            </div>
          ))}
        </Row>
      )}
      <Row label="Reporting year">{ev.reportingYear ?? src?.reportingYear ?? '—'}</Row>
      <Row label="Last checked">{src ? fmtDate(src.lastChecked) : '—'}</Row>
      <Row label="Confidence">
        <div className="flex flex-col gap-1">
          <span className="capitalize font-medium">{ev.confidence === 'inferred' ? 'Derived / inferred' : ev.confidence}</span>
          {ev.confidenceNote && <span className="text-xs text-slate-500">{ev.confidenceNote}</span>}
        </div>
      </Row>
      {(ev.notes || src?.notes) && (
        <Row label="Notes">
          <div className="flex flex-col gap-1.5 text-[13px] text-slate-600">
            {ev.notes && <p>{ev.notes}</p>}
            {src?.notes && <p className="text-slate-500">{src.notes}</p>}
          </div>
        </Row>
      )}
      {ev.confidence === 'inferred' && (
        <p className="mt-4 text-[12px] text-inferred-600 bg-inferred-50 border border-inferred-100 rounded-lg px-3 py-2">
          This is a calculated estimate, not a reported value. Treat as approximate.
        </p>
      )}
    </Drawer>
  )
}
