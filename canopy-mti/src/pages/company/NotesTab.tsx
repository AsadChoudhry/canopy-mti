import { HM_NOTES, HM_EVIDENCE } from '@/data/hm'
import { SOURCES, SOURCE_TYPE_LABEL } from '@/data/sources'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { useUI } from '@/context/UIContext'
import { fmtDate, fmtNum } from '@/lib/format'

export function NotesTab() {
  const { openSource } = useUI()
  const evidence = Object.values(HM_EVIDENCE)
  return (
    <div className="grid xl:grid-cols-[1fr_360px] gap-4 animate-fade-up items-start">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader title="Evidence register" subtitle="Every number on the company pages, with its provenance. Click a row for full details." />
          <div className="px-5 pb-5 overflow-x-auto scroll-thin">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-200">
                  <th className="py-2 pr-3 font-semibold">Value</th>
                  <th className="py-2 pr-3 font-semibold">Label</th>
                  <th className="py-2 pr-3 font-semibold">Source</th>
                  <th className="py-2 pr-3 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((e) => (
                  <tr key={e.id} onClick={() => openSource(e)} className="border-b border-slate-100 hover:bg-cream-100 cursor-pointer">
                    <td className="py-2 pr-3 font-semibold text-slate-900 whitespace-nowrap tabular-nums">{e.display ?? `${fmtNum(e.value)} ${e.unit ?? ''}`}</td>
                    <td className="py-2 pr-3 text-slate-700">{e.label}</td>
                    <td className="py-2 pr-3 text-slate-500">{SOURCES[e.sourceId]?.title}</td>
                    <td className="py-2 pr-3"><ConfidenceBadge level={e.confidence} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardHeader title="Source registry" />
          <ul className="px-5 pb-5 grid md:grid-cols-2 gap-3">
            {Object.values(SOURCES).map((s) => (
              <li key={s.id} className="rounded-xl border border-slate-200 p-3 text-[12px]">
                <div className="font-semibold text-slate-900">{s.title}</div>
                <div className="flex items-center gap-2 mt-1 text-slate-500">
                  <Pill tone="default">{SOURCE_TYPE_LABEL[s.type]}</Pill>
                  {s.reportingYear && <span>FY {s.reportingYear}</span>}
                  <span>· checked {fmtDate(s.lastChecked)}</span>
                </div>
                {s.notes && <p className="text-slate-500 mt-1.5">{s.notes}</p>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <CardHeader title="Research notes" subtitle="Internal — Canopy teams" />
        <ul className="px-5 pb-5 flex flex-col gap-3">
          {HM_NOTES.map((n) => (
            <li key={n.id} className="rounded-xl bg-cream-100 border border-cream-200 p-3 text-[12px]">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-medium text-slate-800">{n.author}</span>
                <span>{fmtDate(n.date)}</span>
              </div>
              <p className="text-slate-700 mt-1.5">{n.text}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">#{t}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
