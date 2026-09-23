import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ShieldAlert, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { SvgWorldMap, type MapBubble } from '@/components/company/SvgWorldMap'
import { useStore } from '@/store/StoreContext'
import { EXPOSURE_META, RISK_LAYERS, TIER_META, riskRow, type Exposure } from '@/lib/risk'
import { cn } from '@/lib/cn'

const ORDER: Exposure[] = ['high', 'watch', 'unknown', 'low']

export function RiskPage() {
  const { data } = useStore()
  const rows = useMemo(
    () => data.companies.filter((c) => c.type === 'producer').map((c) => riskRow(c, data)).sort((a, b) => ORDER.indexOf(a.exposure) - ORDER.indexOf(b.exposure)),
    [data],
  )
  const [focus, setFocus] = useState<string | null>(null)
  const bench = data.sources.find((s) => s.id === 'src_eudr_benchmark')
  const hbSrc = data.sources.find((s) => s.id === 'src_hotbutton_2026')

  const bubbles = useMemo<MapBubble[]>(() => {
    const byCountry = new Map<string, { m49: string; tier?: keyof typeof TIER_META; companies: string[]; mill: boolean }>()
    rows
      .filter((r) => !focus || r.company.id === focus)
      .forEach((r) =>
        r.places.forEach((p) => {
          if (!p.m49) return
          const e = byCountry.get(p.country) ?? { m49: p.m49, tier: p.tier, companies: [], mill: true }
          e.companies.push(r.company.name)
          e.mill = e.mill && p.kind === 'mill'
          byCountry.set(p.country, e)
        }),
      )
    return [...byCountry.entries()].map(([country, e]) => ({
      id: country,
      m49: e.m49,
      label: country,
      sublabel: `${e.companies.join(', ')}${e.mill ? ' (mill country)' : ''}`,
      radius: 6 + e.companies.length * 3,
      colour: e.tier ? TIER_META[e.tier].colour : '#9aa3ad',
      showLabel: !!focus,
      dashed: e.mill,
    }))
  }, [rows, focus])

  const counts = ORDER.map((x) => ({ x, n: rows.filter((r) => r.exposure === x).length }))

  return (
    <AppShell crumbs={[{ label: 'Supply risk' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Supply risk overlay</h1>
          <p className="text-[15px] text-slate-500 mt-1">Where tracked producers source, and which risk layers say something about it.</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-brand-700">Decision this supports</div>
            <p className="text-[15px] font-semibold text-slate-900 mt-0.5">Which producers' fibre is most exposed, so brands shift volume and Canopy prioritises audits?</p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {['Forest conservation', 'CanopyStyle', 'Pack4Good', 'Brand partners'].map((u) => <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {counts.map(({ x, n }) => (
            <Card key={x} className="px-4 py-3">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: EXPOSURE_META[x].colour }} /><span className="text-[13px] font-semibold text-slate-800">{EXPOSURE_META[x].label}</span></div>
              <div className="text-[26px] font-bold tabular-nums text-slate-900 leading-tight">{n}</div>
              <div className="text-[11px] text-slate-400">{EXPOSURE_META[x].why}</div>
            </Card>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1fr_1.1fr] gap-4 items-start">
          <Card>
            <CardHeader
              title="Sourcing and mill countries"
              subtitle="Colour is the EUDR country tier. Dashed means mill country only, wood origin not declared."
              action={bench && <EvidenceBadge source={bench} label="EUDR tiers" size="xs" />}
            />
            <div className="px-5 pb-5">
              <div className="rounded-xl overflow-hidden bg-white border border-slate-200" style={{ height: 340 }}>
                <SvgWorldMap markers={[]} bubbles={bubbles} zoomable showLabels />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                {Object.values(TIER_META).map((t) => <span key={t.label} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.colour }} /> {t.label} risk</span>)}
                {focus && <button className="ml-auto text-brand-600 underline" onClick={() => setFocus(null)}>Show all producers</button>}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Producers by exposure" subtitle="Click a row to show only its countries on the map" action={hbSrc && <EvidenceBadge source={hbSrc} label="Hot Button 2026" size="xs" />} />
            <div className="px-5 pb-5 flex flex-col gap-2">
              {rows.map((r) => {
                const m = EXPOSURE_META[r.exposure]
                return (
                  <div key={r.company.id} role="button" tabIndex={0} aria-pressed={focus === r.company.id} onClick={() => setFocus(focus === r.company.id ? null : r.company.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFocus(focus === r.company.id ? null : r.company.id) } }} className={cn('text-left rounded-xl border px-3 py-2.5 transition-colors cursor-pointer', m.bg, focus === r.company.id && 'ring-2 ring-brand-300')}>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-900 flex-1">{r.company.name}</span>
                      <span className="rounded-full text-[10px] font-semibold px-2 py-0.5 text-white" style={{ background: m.colour }}>{m.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.places.map((p) => (
                        <span key={p.country} className={cn('text-[10px] rounded-full px-1.5 py-0.5 bg-white border', p.kind === 'mill' && 'border-dashed')} style={{ borderColor: p.tier ? TIER_META[p.tier].colour : '#c5cad1', color: p.tier ? TIER_META[p.tier].colour : '#6c7783' }}>
                          {p.country}{p.review ? '*' : ''}
                        </span>
                      ))}
                      {!r.places.length && <span className="text-[11px] text-slate-400">No origin or mill country loaded</span>}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1.5 flex flex-wrap gap-x-3">
                      {r.hb && <span>Hot Button: <b>{r.hb.label}</b></span>}
                      <span>Certified: <b>{r.certifiedPct !== null ? `${r.certifiedPct}%` : 'unknown'}</b></span>
                    </div>
                    {r.flags.length > 0 && (
                      <ul className="mt-1 text-[11px] text-slate-700 flex flex-col gap-0.5">
                        {r.flags.map((f) => <li key={f} className="flex gap-1"><AlertTriangle size={11} className="text-amber-500 mt-0.5 shrink-0" />{f}</li>)}
                      </ul>
                    )}
                    <Link to={`/companies/${r.company.id}`} onClick={(e) => e.stopPropagation()} className="text-[11px] text-brand-600 font-semibold hover:underline inline-block mt-1">Open company</Link>
                  </div>
                )
              })}
              <p className="text-[11px] text-slate-400">* South Africa's low-risk tier comes from secondary summaries and needs review. A low-risk country tier says nothing about a specific forest; ForestMapper is the next layer for that.</p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><ShieldAlert size={16} className="text-brand-600" /> Risk layers</span>} subtitle="Loaded now, and what would turn country-level risk into forest-level risk" />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[560px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="text-left py-2 pr-3 font-semibold">Layer</th><th className="text-left py-2 pr-3 font-semibold">Adds</th><th className="text-left py-2 font-semibold">Status</th></tr></thead>
              <tbody>
                {RISK_LAYERS.map((l) => (
                  <tr key={l.name} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-3"><div className="font-semibold text-slate-900">{l.name}</div><div className="text-[11px] text-slate-400">{l.publisher}</div></td>
                    <td className="py-2 pr-3 text-slate-600">{l.what}</td>
                    <td className="py-2"><span className={cn('rounded-full text-[10px] font-semibold px-2 py-0.5', l.status === 'loaded' ? 'bg-green-100 text-green-700' : l.status === 'next' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}>{l.status === 'loaded' ? 'Loaded' : l.status === 'next' ? 'Next' : 'Later'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
