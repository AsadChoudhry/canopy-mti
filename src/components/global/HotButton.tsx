import { useMemo, useState } from 'react'
import { ArrowRight, Recycle } from 'lucide-react'
import {
  HB_CRITERIA,
  HOT_BUTTON_2025,
  HOT_BUTTON_2026,
  RISK_META,
  SHIRT_2026_META,
  SHIRT_META,
  hbShirt,
  hotButtonChanges,
  shirtBand,
  type HotButton2026Row,
  type HotButtonCriterion,
  type HotButtonRow,
  type Shirt2026,
} from '@/data/hotbutton'
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

/* ------------------------------------------------------------------ */
/* 2026                                                                */
/* ------------------------------------------------------------------ */

export function Shirt2026Dot({ shirt }: { shirt: Shirt2026 }) {
  const m = SHIRT_2026_META[shirt]
  return <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/5" style={{ background: m.colour }} title={`${m.label} (${m.range})`} />
}

const SCORE_2025 = new Map(HOT_BUTTON_2025.map((r) => [r.id, r]))

/** 2026 grid, with the 2025 score kept alongside because 2026 publishes no scores. */
export function HotButton2026Table({ rows, onSelect, selectedId }: { rows: HotButton2026Row[]; onSelect?: (id: string) => void; selectedId?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-x-auto">
      <table className="w-full text-[12px] min-w-[560px]">
        <thead className="bg-cream-100 text-[10px] uppercase tracking-wide text-slate-500">
          <tr>
            <th className="text-left font-semibold px-3 py-2">Producer</th>
            <th className="text-right font-semibold px-3 py-2">% global capacity</th>
            <th className="text-left font-semibold px-3 py-2">Risk status</th>
            <th className="text-center font-semibold px-3 py-2">Next Gen line</th>
            <th className="text-right font-semibold px-3 py-2">2025 score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const old = row.id2025 ? SCORE_2025.get(row.id2025) : undefined
            const d = old ? row.capacityPct - old.capacityPct : null
            return (
              <tr
                key={row.id}
                onClick={() => onSelect?.(row.id)}
                className={cn('border-t border-slate-100', onSelect && 'cursor-pointer hover:bg-cream-50', selectedId === row.id && 'bg-brand-50')}
                title={row.note}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Shirt2026Dot shirt={row.shirt} />
                    <span className="font-medium text-slate-900 truncate">{row.producer}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{row.types.join(', ')}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-700 whitespace-nowrap">
                  {row.capacityPct.toFixed(2)}%
                  {d !== null && Math.abs(d) >= 0.3 && <span className={cn('ml-1 text-[10px] font-semibold', d > 0 ? 'text-amber-600' : 'text-slate-400')}>{d > 0 ? '+' : ''}{d.toFixed(2)}</span>}
                </td>
                <td className="px-3 py-2"><RiskPill risk={row.risk} size="xs" /></td>
                <td className="px-3 py-2 text-center">{row.nextGen ? <Recycle size={14} className="inline text-green-600" aria-label="Has a Next Gen product line" /> : <span className="text-slate-200">·</span>}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-600">{old && old.total !== null ? `${old.total}/40` : <span className="text-slate-400">not scored</span>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const KIND_LABEL: Record<string, string> = { shirt: 'Shirt', risk: 'Risk status', capacity: 'Capacity share', joined: 'Joined', left: 'Not in 2026 grid' }

/** Everything that moved between the 2025 matrix and the 2026 grid, derived rather than typed in. */
export function HotButtonChanges() {
  const changes = useMemo(() => hotButtonChanges(), [])
  const order = ['shirt', 'risk', 'left', 'joined', 'capacity']
  const sorted = [...changes].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))
  return (
    <ul className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
      {sorted.map((c, i) => (
        <li key={`${c.id}-${c.kind}-${i}`} className="flex items-center gap-3 px-3 py-2 text-[12px]">
          <span className={cn('w-[92px] shrink-0 text-[10px] font-semibold uppercase tracking-wide', c.kind === 'left' ? 'text-slate-400' : c.kind === 'capacity' ? 'text-slate-500' : 'text-brand-600')}>{KIND_LABEL[c.kind]}</span>
          <span className="flex-1 min-w-0 font-medium text-slate-900 truncate">{c.producer}</span>
          <span className="shrink-0 flex items-center gap-1.5 text-slate-600 tabular-nums">
            {c.from && <span>{c.from}</span>}
            {c.from && c.to && <ArrowRight size={11} className="text-slate-400" />}
            {c.to && <span className="font-semibold text-slate-900">{c.to}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

type Weights = Record<Exclude<HotButtonCriterion['key'], 'highRisk'>, number>
const DEFAULT_WEIGHTS: Weights = Object.fromEntries(HB_CRITERIA.filter((c) => c.key !== 'highRisk').map((c) => [c.key, c.max])) as Weights

const PRESETS: { label: string; w: Partial<Weights> }[] = [
  { label: 'Current', w: {} },
  { label: 'Next Gen doubled', w: { nextgen: 20 } },
  { label: 'Traceability doubled', w: { traceability: 10 } },
  { label: 'Audits and traceability up', w: { audits: 12, traceability: 8 } },
]

/**
 * Re-weights the 2025 category scores and rescales to 40, then re-bands under the 2026 legend.
 * A way to see which producers a criteria change would move, before the 2027 revision.
 */
export function CriteriaTest() {
  const [w, setW] = useState<Weights>(DEFAULT_WEIGHTS)
  const keys = Object.keys(DEFAULT_WEIGHTS) as (keyof Weights)[]
  const sumMax = keys.reduce((a, k) => a + w[k], 0)

  const result = useMemo(() => {
    const rows = HOT_BUTTON_2026.map((n) => {
      const o = n.id2025 ? SCORE_2025.get(n.id2025) : undefined
      if (!o || o.total === null) return { row: n, now: n.shirt, test: n.shirt, total: null as number | null }
      const raw = keys.reduce((a, k) => {
        const c = HB_CRITERIA.find((x) => x.key === k)!
        return a + ((o.scores[k] ?? 0) / c.max) * w[k]
      }, 0)
      const total = +((raw * 40) / (sumMax || 1) + (o.scores.highRisk ?? 0)).toFixed(1)
      return { row: n, now: n.shirt, test: shirtBand(total, n.risk), total }
    })
    const cleanGreen = (s: Shirt2026) => SHIRT_2026_META[s].green && s !== 'light_green_red'
    const capNow = rows.filter((r) => cleanGreen(r.now)).reduce((a, r) => a + r.row.capacityPct, 0)
    const capTest = rows.filter((r) => cleanGreen(r.test)).reduce((a, r) => a + r.row.capacityPct, 0)
    const moved = rows.filter((r) => r.now !== r.test).sort((a, b) => b.row.capacityPct - a.row.capacityPct)
    return { capNow, capTest, moved, greenNow: rows.filter((r) => cleanGreen(r.now)).length, greenTest: rows.filter((r) => cleanGreen(r.test)).length }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, sumMax])

  const delta = result.capTest - result.capNow

  return (
    <div className="grid xl:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setW({ ...DEFAULT_WEIGHTS, ...p.w })}
              className={cn('rounded-full text-[11px] font-semibold px-2.5 py-1 border', JSON.stringify({ ...DEFAULT_WEIGHTS, ...p.w }) === JSON.stringify(w) ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300')}
            >
              {p.label}
            </button>
          ))}
        </div>
        {keys.map((k) => {
          const c = HB_CRITERIA.find((x) => x.key === k)!
          return (
            <label key={k} className="flex items-center gap-3 py-1.5 text-[12px]">
              <span className="flex-1 min-w-0 text-slate-700 truncate">{c.label}</span>
              <input type="range" min={0} max={20} step={1} value={w[k]} onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })} className="w-[110px] accent-brand-500" aria-label={`Maximum buttons for ${c.label}`} />
              <span className={cn('w-[34px] text-right tabular-nums font-semibold', w[k] !== c.max ? 'text-brand-700' : 'text-slate-900')}>{w[k]}</span>
            </label>
          )
        })}
        <p className="text-[11px] text-slate-400 mt-2">Each producer's 2025 category scores are re-weighted, rescaled to 40 and re-banded. The high-risk deduction is kept as scored. Producers without 2025 scores keep their 2026 shirt.</p>
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[11px] text-slate-500">Green shirt capacity, excluding known risk</div>
            <div className="text-[22px] font-bold tabular-nums text-slate-900 leading-tight">{result.capTest.toFixed(1)}%</div>
            <div className={cn('text-[11px] font-semibold tabular-nums', Math.abs(delta) < 0.05 ? 'text-slate-400' : delta > 0 ? 'text-green-700' : 'text-red-700')}>
              {Math.abs(delta) < 0.05 ? 'No change from 2026' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pts vs 2026 (${result.capNow.toFixed(1)}%)`}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[11px] text-slate-500">Green shirt producers</div>
            <div className="text-[22px] font-bold tabular-nums text-slate-900 leading-tight">{result.greenTest}</div>
            <div className="text-[11px] text-slate-400 tabular-nums">{result.greenNow} in 2026</div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="px-3 py-2 text-[11px] uppercase tracking-wide font-semibold text-slate-400 border-b border-slate-100">Producers whose shirt would change ({result.moved.length})</div>
          {result.moved.length === 0 ? (
            <div className="px-3 py-4 text-[12px] text-slate-400 italic">None. Move a slider or pick a preset.</div>
          ) : (
            <ul className="max-h-[220px] overflow-y-auto scroll-thin divide-y divide-slate-100">
              {result.moved.map((m) => (
                <li key={m.row.id} className="flex items-center gap-2 px-3 py-1.5 text-[12px]">
                  <span className="flex-1 min-w-0 truncate font-medium text-slate-900">{m.row.producer}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums w-[44px] text-right">{m.row.capacityPct.toFixed(2)}%</span>
                  <span className="text-[10px] text-slate-500 tabular-nums w-[34px] text-right">{m.total}</span>
                  <Shirt2026Dot shirt={m.now} />
                  <ArrowRight size={11} className="text-slate-400" />
                  <Shirt2026Dot shirt={m.test} />
                  <span className="text-[11px] text-slate-600 w-[118px] truncate hidden sm:inline">{SHIRT_2026_META[m.test].label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
