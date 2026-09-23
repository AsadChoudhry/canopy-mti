import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronDown, Circle, Info, MessageSquareText, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { useStore } from '@/store/StoreContext'
import { T_BAND_META, T_CRITERIA, T_MAX, packagingProducers, transparencyScore } from '@/lib/transparency'
import { cn } from '@/lib/cn'

const SEG = ['#35207c', '#462ba2', '#5737c8', '#6a47ea', '#009a7e', '#009da1', '#00c1c6']

export function Pack4GoodPage() {
  const { data } = useStore()
  const results = useMemo(() => packagingProducers(data).map((c) => transparencyScore(c, data)).sort((a, b) => b.total - a.total), [data])
  const [open, setOpen] = useState<string | null>(results[0]?.company.id ?? null)
  const leading = results.filter((r) => r.band === 'leading').length

  // Which criterion is most often missed: the sector-wide ask.
  const missed = T_CRITERIA.map((c) => ({ c, n: results.filter((r) => r.points[c.key] < c.max * 0.5).length })).sort((a, b) => b.n - a.n)

  return (
    <AppShell crumbs={[{ label: 'Producer transparency' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Packaging producer transparency</h1>
          <p className="text-[15px] text-slate-500 mt-1">A Hot Button-style score for Pack4Good, built from the evidence already traced in this tool.</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-brand-700">Decision this supports</div>
            <p className="text-[15px] font-semibold text-slate-900 mt-0.5">Which packaging producers do brand partners reward, and what does Pack4Good ask the rest for?</p>
            <p className="text-[12px] text-slate-600 mt-1">Hot Button moved the viscose sector by scoring it in public. Packaging has no equivalent yet. The score recalculates whenever evidence is added in the Data workspace.</p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {['Pack4Good', 'Brand partners', 'Producers'].map((u) => <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>)}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="px-5 py-4">
            <div className="text-[26px] font-bold text-slate-900 tabular-nums leading-none">{leading} of {results.length}</div>
            <div className="text-[13px] text-slate-600 mt-1.5">Producers scored Leading</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Scores run 0 to {T_MAX}. Leading is 22 or more.</div>
          </Card>
          <Card className="px-5 py-4">
            <div className="text-[18px] font-bold text-slate-900 leading-tight">{missed[0]?.c.label}</div>
            <div className="text-[13px] text-slate-600 mt-1.5">Most often missing ({missed[0]?.n} of {results.length})</div>
            <div className="text-[11px] text-slate-400 mt-0.5">The sector-wide ask for the next Pack4Good letter.</div>
          </Card>
          <Card className="px-5 py-4">
            <div className="text-[13px] text-slate-600 flex gap-1.5"><Info size={14} className="shrink-0 mt-0.5 text-slate-400" /> Scores disclosure, not forest outcomes. A Leading producer can still source from high-risk forests; that is the Supply risk view.</div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Ranking" subtitle="Each bar segment is one criterion. Click a producer for the evidence and the ask." />
          <div className="px-5 pb-5 flex flex-col gap-2">
            {results.map((r, i) => {
              const b = T_BAND_META[r.band]
              const isOpen = open === r.company.id
              return (
                <div key={r.company.id} className={cn('rounded-xl border bg-white', isOpen ? 'border-brand-300' : 'border-slate-200')}>
                  <button className="w-full text-left px-3 py-2.5 flex items-center gap-3" onClick={() => setOpen(isOpen ? null : r.company.id)} aria-expanded={isOpen}>
                    <span className="w-5 text-[12px] font-bold text-slate-400 tabular-nums">{i + 1}</span>
                    <span className="w-[96px] sm:w-[170px] shrink-0 min-w-0">
                      <span className="block text-[13px] font-semibold text-slate-900 truncate">{r.company.name}</span>
                      <span className="block text-[11px] text-slate-500 truncate">{r.company.hq}</span>
                    </span>
                    <span className="flex-1 flex h-4 rounded-md overflow-hidden bg-slate-100" title={`${r.total} of ${T_MAX}`}>
                      {T_CRITERIA.map((c, k) => (
                        <span key={c.key} style={{ width: `${(r.points[c.key] / T_MAX) * 100}%`, background: SEG[k] }} title={`${c.label}: ${r.points[c.key]} of ${c.max}`} />
                      ))}
                    </span>
                    <span className="w-[36px] sm:w-[52px] text-right text-[14px] font-bold tabular-nums text-slate-900">{r.total}</span>
                    <span className="hidden sm:inline-block w-[76px] shrink-0 rounded-full text-[10px] font-semibold px-2 py-0.5 text-white text-center" style={{ background: b.colour }}>{b.label}</span>
                    <ChevronDown size={14} className={cn('text-slate-400 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 grid lg:grid-cols-[1.4fr_1fr] gap-3 border-t border-slate-100 pt-3">
                      <ul className="flex flex-col gap-1.5">
                        {T_CRITERIA.map((c, k) => {
                          const full = r.points[c.key] >= c.max
                          return (
                            <li key={c.key} className="flex items-start gap-2 text-[12px]">
                              {full ? <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" /> : <Circle size={14} className="text-slate-300 mt-0.5 shrink-0" />}
                              <span className="w-2 h-2 rounded-sm mt-1.5 shrink-0" style={{ background: SEG[k] }} />
                              <span className="flex-1 min-w-0">
                                <span className="font-semibold text-slate-800">{c.label}</span> <span className="text-slate-400 tabular-nums">{r.points[c.key]} / {c.max}</span>
                                <span className="block text-slate-500">{r.detail[c.key]}</span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="flex flex-col gap-2">
                        <div className="rounded-xl bg-cream-100 border border-cream-200 px-3 py-2.5">
                          <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 flex items-center gap-1.5"><MessageSquareText size={12} /> Engagement ask</div>
                          {T_CRITERIA.filter((c) => r.points[c.key] < c.max).length ? (
                            <ol className="mt-1 list-decimal pl-4 text-[12px] text-slate-700 flex flex-col gap-1">
                              {T_CRITERIA.filter((c) => r.points[c.key] < c.max)
                                .sort((a, b) => b.max - r.points[b.key] - (a.max - r.points[a.key]))
                                .map((c) => <li key={c.key}>{c.ask} <span className="text-slate-400">(+{+(c.max - r.points[c.key]).toFixed(1)})</span></li>)}
                            </ol>
                          ) : (
                            <p className="text-[12px] text-slate-700 mt-1">Full marks on disclosure. Next step is Next Gen share and forest risk.</p>
                          )}
                        </div>
                        <Link to={`/companies/${r.company.id}${r.bestProduct ? `?product=${r.bestProduct}` : ''}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:underline">
                          Open company evidence <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-500">
              {T_CRITERIA.map((c, k) => <span key={c.key} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: SEG[k] }} />{c.label} ({c.max})</span>)}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Method" subtitle="What each criterion checks, so producers can see how to move up" />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[560px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="text-left py-2 pr-3 font-semibold">Criterion</th><th className="text-right py-2 pr-3 font-semibold">Points</th><th className="text-left py-2 font-semibold">Checks</th></tr></thead>
              <tbody>
                {T_CRITERIA.map((c) => (
                  <tr key={c.key} className="border-t border-slate-100"><td className="py-2 pr-3 font-semibold text-slate-900">{c.label}</td><td className="py-2 pr-3 text-right tabular-nums">{c.max}</td><td className="py-2 text-slate-600">{c.what}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-slate-400 mt-2">A draft method for consultation with Pack4Good and brand partners before anything is published. Bands: {Object.values(T_BAND_META).map((b) => `${b.label} ${b.range}`).join(' · ')}.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
