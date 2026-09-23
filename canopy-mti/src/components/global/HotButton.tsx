import { HB_CRITERIA, RISK_META, SHIRT_META, hbShirt, type HotButtonRow } from '@/data/hotbutton'
import { cn } from '@/lib/cn'

const TONE: Record<string, string> = {
  ok: 'bg-green-100 text-green-700',
  watch: 'bg-amber-100 text-amber-600',
  bad: 'bg-red-50 text-red-700',
  none: 'bg-slate-100 text-slate-500',
}

export function RiskPill({ risk, size = 'sm' }: { risk: HotButtonRow['risk']; size?: 'xs' | 'sm' }) {
  const m = RISK_META[risk]
  return <span className={cn('rounded-full font-semibold whitespace-nowrap', TONE[m.tone], size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5')}>{m.short}</span>
}

export function ShirtDot({ row }: { row: HotButtonRow }) {
  const s = SHIRT_META[hbShirt(row.total, row.risk)]
  return <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.colour }} title={s.label} />
}

/** Producer table for the fashion overview. */
export function HotButtonTable({ rows, onSelect, selectedId }: { rows: HotButtonRow[]; onSelect?: (id: string) => void; selectedId?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-[12px]">
        <thead className="bg-cream-100 text-[10px] uppercase tracking-wide text-slate-500">
          <tr>
            <th className="text-left font-semibold px-3 py-2">Producer</th>
            <th className="text-right font-semibold px-3 py-2">% global capacity</th>
            <th className="text-left font-semibold px-3 py-2">Risk status</th>
            <th className="text-right font-semibold px-3 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelect?.(row.id)}
              className={cn('border-t border-slate-100', onSelect && 'cursor-pointer hover:bg-cream-50', selectedId === row.id && 'bg-brand-50')}
            >
              <td className="px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ShirtDot row={row} />
                  <span className="font-medium text-slate-900 truncate">{row.producer}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{row.types.join(', ')}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-700">{row.capacityPct.toFixed(2)}%</td>
              <td className="px-3 py-2"><RiskPill risk={row.risk} size="xs" /></td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold text-slate-900">{row.total === null ? <span className="text-slate-400 font-normal">not scored</span> : `${row.total}/40`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Per-producer scorecard: what Canopy scores, what the producer earned, where the gap is. */
export function HotButtonScorecard({ row }: { row: HotButtonRow }) {
  const shirt = SHIRT_META[hbShirt(row.total, row.risk)]
  const scored = HB_CRITERIA.filter((c) => c.key !== 'highRisk')
  const deduction = row.scores.highRisk ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
      <div className="flex items-baseline gap-3 py-2.5 border-b border-slate-200">
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: shirt.colour }} />
          <span className="text-[14px] font-semibold text-slate-900 whitespace-nowrap">Hot Button score</span>
          <span className="text-[11px] text-slate-500 whitespace-nowrap hidden sm:inline">{shirt.label}</span>
        </div>
        <RiskPill risk={row.risk} />
        <div className="text-[19px] font-bold text-slate-900 tabular-nums w-[72px] text-right shrink-0">{row.total}/40</div>
      </div>

      {scored.map((c) => {
        const v = row.scores[c.key] ?? 0
        const gap = c.max - v
        return (
          <div key={c.key} className="flex items-baseline gap-3 py-2.5 border-b border-slate-100">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-slate-900">{c.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{c.what}</div>
            </div>
            <div className="w-[56px] shrink-0 hidden sm:block">
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${(v / c.max) * 100}%` }} />
              </div>
            </div>
            <div className="text-[14px] font-bold text-slate-900 tabular-nums w-[50px] text-right shrink-0">{v}/{c.max}</div>
            <div className={cn('text-[11px] tabular-nums w-[52px] text-right shrink-0', gap > 0 ? 'text-amber-600 font-semibold' : 'text-slate-300')}>{gap > 0 ? `gap ${+gap.toFixed(1)}` : 'full'}</div>
          </div>
        )
      })}

      {deduction < 0 && (
        <div className="flex items-baseline gap-3 py-2.5 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-red-700">High risk sourcing deduction</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{HB_CRITERIA.find((c) => c.key === 'highRisk')!.what}</div>
          </div>
          <div className="text-[14px] font-bold text-red-700 tabular-nums w-[50px] text-right shrink-0">{deduction}</div>
          <div className="w-[52px] shrink-0" />
        </div>
      )}

      <p className="text-[11px] text-slate-400 py-2">Scores are Canopy's own. The gap column is the distance to the maximum for that criterion.</p>
    </div>
  )
}
