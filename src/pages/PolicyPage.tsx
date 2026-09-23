import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Check, Minus, Scale, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { useStore } from '@/store/StoreContext'
import { RULES, RULE_GAPS, daysFrom } from '@/data/policy'
import { cn } from '@/lib/cn'

const START = Date.UTC(2025, 0, 1)
const END = Date.UTC(2030, 6, 1)
const pos = (iso: string) => ((new Date(iso + 'T00:00:00Z').getTime() - START) / (END - START)) * 100
const RULE_COLOUR: Record<string, string> = { ppwr: '#009a7e', eudr: '#6a47ea', wfd_textiles: '#e09a12' }
const STATUS_LABEL = { applies: 'Applies now', in_force: 'In force, schemes pending', upcoming: 'Upcoming' }

export function PolicyPage() {
  const { data } = useStore()
  const today = useMemo(() => new Date(), [])
  const todayIso = today.toISOString().slice(0, 10)
  const companies = data.companies.filter((c) => c.type === 'producer')

  const next = RULES.flatMap((r) => r.milestones.map((m) => ({ r, m, d: daysFrom(today, m.date) }))).filter((x) => x.d >= 0).sort((a, b) => a.d - b.d)[0]

  return (
    <AppShell crumbs={[{ label: 'Policy tracker' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Policy tracker</h1>
          <p className="text-[15px] text-slate-500 mt-1">Rules that put a date on a transition, and the tracked companies each one touches.</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-brand-700">Decision this supports</div>
            <p className="text-[15px] font-semibold text-slate-900 mt-0.5">Which engagement to time around a regulatory deadline, so the producer has a reason to move now?</p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {['Campaigns', 'Pack4Good', 'CanopyStyle', 'Brand partners'].map((u) => <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>)}
          </div>
        </div>

        {next && (
          <Card className="px-5 py-4 flex items-center gap-4">
            <CalendarClock size={28} className="text-brand-600 shrink-0" />
            <div className="flex-1">
              <div className="text-[13px] text-slate-600">Next deadline</div>
              <div className="text-[18px] font-bold text-slate-900">{next.r.short}: {next.m.label}</div>
            </div>
            <div className="text-right">
              <div className="text-[30px] font-bold text-slate-900 tabular-nums leading-none">{next.d}</div>
              <div className="text-[11px] text-slate-500">days, {next.m.date}</div>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader title="Timeline" subtitle="2025 to mid-2030" />
          <div className="px-5 pb-6">
            <div className="relative" style={{ height: RULES.length * 44 + 26 }}>
              {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <div key={y} className="absolute top-0 bottom-0 border-l border-slate-100" style={{ left: `${pos(`${y}-01-01`)}%` }}>
                  <span className="absolute -bottom-0.5 left-1 text-[10px] text-slate-400">{y}</span>
                </div>
              ))}
              <div className="absolute top-0 bottom-4 border-l-2 border-brand-500" style={{ left: `${pos(todayIso)}%` }}>
                <span className="absolute -top-0.5 left-1 text-[10px] font-semibold text-brand-600 whitespace-nowrap">Today</span>
              </div>
              {RULES.map((r, i) => (
                <div key={r.id} className="absolute left-0 right-0" style={{ top: i * 44 + 14 }}>
                  <div className="absolute h-1 rounded-full opacity-30" style={{ left: `${pos(r.milestones[0].date)}%`, right: `${100 - pos(r.milestones[r.milestones.length - 1].date)}%`, top: 10, background: RULE_COLOUR[r.id] }} />
                  {r.milestones.map((m) => (
                    <div key={m.date} className="absolute group" style={{ left: `${pos(m.date)}%`, top: 4 }}>
                      <span className={cn('block w-4 h-4 -ml-2 rounded-full border-2 border-white shadow', daysFrom(today, m.date) < 0 && 'opacity-60')} style={{ background: RULE_COLOUR[r.id] }} tabIndex={0} aria-label={`${r.short}: ${m.label}, ${m.date}`} />
                      <span className="pointer-events-none absolute z-10 left-2 top-5 hidden group-hover:block group-focus-within:block whitespace-nowrap rounded-md bg-charcoal text-white text-[11px] px-2 py-1">{m.date} · {m.label}</span>
                    </div>
                  ))}
                  <span className="absolute -top-2.5 text-[11px] font-semibold" style={{ left: `${pos(r.milestones[0].date)}%`, color: RULE_COLOUR[r.id] }}>{r.short}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4 items-start">
          {RULES.map((r) => {
            const src = data.sources.find((s) => s.id === r.sourceId)
            return (
              <Card key={r.id} className="px-4 py-4 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2"><Scale size={15} style={{ color: RULE_COLOUR[r.id] }} /><span className="text-[15px] font-bold text-slate-900">{r.short}</span></div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.name}</div>
                  </div>
                  {src && <EvidenceBadge source={src} label={src.accessed ? 'Source' : 'Needs review'} size="xs" />}
                </div>
                <div className="flex flex-wrap gap-1"><Pill tone={r.status === 'applies' ? 'forest' : r.status === 'in_force' ? 'inferred' : 'amber'}>{STATUS_LABEL[r.status]}</Pill>{r.streams.map((s) => <Pill key={s}>{s}</Pill>)}</div>
                <p className="text-[12px] text-slate-700">{r.what}</p>
                <div className="rounded-lg bg-cream-100 px-3 py-2 text-[12px] text-slate-700"><b className="text-slate-900">Why Canopy cares.</b> {r.lever}</div>
                <p className="text-[11px] text-slate-500"><b>Data it needs:</b> {r.dataNeeded}</p>
                <ul className="text-[11px] text-slate-600 flex flex-col gap-0.5">
                  {r.milestones.map((m) => {
                    const d = daysFrom(today, m.date)
                    return <li key={m.date} className="flex justify-between gap-2"><span>{m.label}</span><span className={cn('tabular-nums whitespace-nowrap', d < 0 ? 'text-slate-400' : 'font-semibold text-slate-900')}>{d < 0 ? m.date : `in ${d} days`}</span></li>
                  })}
                </ul>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader title="Tracked producers by rule" subtitle="Tagged from mills and headquarters in the evidence store. Add a facility in the Data workspace and the tags update." />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[620px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400">
                <tr><th className="text-left py-2 pr-3 font-semibold">Producer</th>{RULES.map((r) => <th key={r.id} className="text-left py-2 pr-3 font-semibold">{r.short}</th>)}</tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-3"><Link to={`/companies/${c.id}`} className="font-semibold text-slate-900 hover:text-brand-600">{c.name}</Link><div className="text-[11px] text-slate-400">{c.stream ?? 'packaging'} · {c.hq}</div></td>
                    {RULES.map((r) => {
                      const inScope = r.streams.includes(c.stream ?? 'packaging')
                      const why = inScope ? r.appliesTo(c, data) : null
                      return (
                        <td key={r.id} className="py-2 pr-3">
                          {why ? <span className="flex gap-1.5 text-slate-700"><Check size={14} className="text-green-600 shrink-0 mt-0.5" />{why}</span> : <span className="flex gap-1.5 text-slate-400"><Minus size={14} className="shrink-0 mt-0.5" />{inScope ? 'No EU footprint loaded' : 'Not in scope'}</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-3 flex flex-col gap-1 text-[11px] text-slate-500">
              {RULE_GAPS.map((g) => <li key={g.jurisdiction}><b className="text-slate-700">{g.jurisdiction}:</b> {g.text}</li>)}
            </ul>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
