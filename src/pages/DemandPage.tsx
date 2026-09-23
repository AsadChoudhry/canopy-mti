import { useMemo, useState } from 'react'
import { Handshake, Info, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { useStore } from '@/store/StoreContext'
import { HB_2026_HEADLINES, HOT_BUTTON_2026 } from '@/data/hotbutton'
import { PIPELINE } from '@/data/mills'
import { cn } from '@/lib/cn'

/** Offtake and demand signals found so far. None gives a committed tonnage. */
const OFFTAKE = [
  { who: 'Circulose, Sundsvall', signal: 'Volume commitments from 11 brands behind the 2026 restart.', gap: 'Brand names and tonnes not published.', sourceId: 'src_circulose_ortviken' },
  { who: 'Aditya Birla (Birla Cellulose)', signal: 'Cooperation agreement with Circulose announced December 2025; LIVA Reviva already uses Circulose pulp.', gap: 'No tonnage.', sourceId: 'src_hotbutton_2026' },
  { who: 'Red Leaf Pulp, Regina', signal: 'Packaging maker Dart provided most of Red Leaf\'s funding.', gap: 'Offtake share not confirmed in the text read.', sourceId: 'src_redleaf_ck' },
  { who: 'Canopy brand partners', signal: '950+ brands with forest policies; 2.4 trillion USD combined revenue.', gap: 'Policies commit to Next Gen in principle, not to tonnes.', sourceId: 'src_canopy_ar_2425' },
]

export function DemandPage() {
  const { data } = useStore()
  const Q = (id: string) => data.quantities.find((q) => q.id === id)
  const S = (id: string) => data.sources.find((s) => s.id === id)
  const mmcf = Q('q_mmcf_production_2024')
  const recShare = Q('q_mmcf_recycled_share_2024')
  const recT = Q('q_mmcf_recycled_t_2024')
  const total = mmcf?.value ?? 8.4

  const ngProducers = HOT_BUTTON_2026.filter((r) => r.nextGen)
  const ngCapPct = ngProducers.reduce((a, r) => a + r.capacityPct, 0)
  const textilePipeline = PIPELINE.filter((p) => p.path === 'textile' || (p.path === 'retrofit' && p.region !== 'china')).reduce((a, p) => a + p.tonnes, 0) / 1e6

  const [share, setShare] = useState(10)
  const [millKt, setMillKt] = useState(60)
  const need = (total * share) / 100
  const current = recT?.value ?? 0.09
  const gap = Math.max(0, need - current - textilePipeline)
  const mills = Math.ceil((gap * 1000) / millKt)

  const ladder = useMemo(
    () => [
      { label: 'All MMCF produced, 2024', v: total, colour: '#282727', q: mmcf },
      { label: 'Capacity share of producers selling a Next Gen line', v: (total * ngCapPct) / 100, colour: '#009a7e', note: `${ngCapPct.toFixed(1)}% of capacity × 8.4 Mt; an approximation that mixes capacity share with output` },
      { label: `Your demand scenario: ${share}% Next Gen`, v: need, colour: '#8b70ee' },
      { label: 'Named European textile-to-textile pipeline', v: textilePipeline, colour: '#6a47ea' },
      { label: 'MMCF from recycled feedstock, 2024', v: current, colour: '#35207c', q: recT },
    ],
    [total, ngCapPct, share, need, textilePipeline, current, mmcf, recT],
  )
  const max = Math.max(...ladder.map((l) => l.v))

  return (
    <AppShell crumbs={[{ label: 'Demand and supply' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Next Gen demand and supply, fashion</h1>
          <p className="text-[15px] text-slate-500 mt-1">How much Next Gen MMCF brands would need, against what exists and what is being built.</p>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-brand-700">Decision this supports</div>
            <p className="text-[15px] font-semibold text-slate-900 mt-0.5">How big is the gap between brand ambition and Next Gen supply, and how many mills does it justify?</p>
            <p className="text-[12px] text-slate-600 mt-1">Investors need offtake to fund a mill. This view shows the supply side from sources and treats demand as a scenario until brand tonnes are collected.</p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {['CanopyStyle', 'Next Gen Solutions', 'Investors'].map((u) => <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>)}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Stat value={`${total} Mt`} label="MMCF produced, 2024" badge={mmcf && <EvidenceBadge quantity={mmcf} size="xs" />} />
          <Stat value={`${recShare?.value ?? '?'}%`} label="Made from recycled feedstock" badge={recShare && <EvidenceBadge quantity={recShare} size="xs" />} sub="0.7% in 2023" />
          <Stat value={String(HB_2026_HEADLINES.nextGenLines)} label="Next Gen lines on the market" badge={S('src_hotbutton_2026') && <EvidenceBadge source={S('src_hotbutton_2026')} label="HB 2026" size="xs" />} sub={`${HB_2026_HEADLINES.nextGenLinesChina} from Chinese producers; ${HB_2026_HEADLINES.nextGenLines2025} in 2025`} />
          <Stat value={`${ngProducers.length} of ${HOT_BUTTON_2026.length}`} label="Producers offering a Next Gen line" sub={`${ngCapPct.toFixed(0)}% of global capacity`} />
        </div>

        <Card>
          <CardHeader title="Supply ladder" subtitle="Million tonnes a year. Set a demand scenario to see the gap." />
          <div className="px-5 pb-5 grid lg:grid-cols-[1.5fr_1fr] gap-5">
            <div className="flex flex-col gap-2.5">
              {ladder.map((l) => (
                <div key={l.label}>
                  <div className="flex justify-between gap-2 text-[12px]">
                    <span className="text-slate-700 flex items-center gap-1.5">{l.label} {l.q && <EvidenceBadge quantity={l.q} size="xs" label="" className="px-1" />}</span>
                    <span className="tabular-nums font-semibold text-slate-900">{l.v < 1 ? l.v.toFixed(2) : l.v.toFixed(1)} Mt</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(0.6, (l.v / max) * 100)}%`, background: l.colour }} />
                  </div>
                  {l.note && <div className="text-[10px] text-slate-400 mt-0.5">{l.note}</div>}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <div className="flex justify-between items-center text-[12px] font-semibold text-slate-800">Next Gen share of MMCF brands ask for <Pill tone="grey">Scenario</Pill></div>
                <div className="flex items-center gap-3 mt-1.5">
                  <input type="range" min={1} max={50} value={share} onChange={(e) => setShare(Number(e.target.value))} className="flex-1 accent-brand-500" aria-label="Next Gen share of MMCF" />
                  <span className="w-[40px] text-right font-bold tabular-nums">{share}%</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[12px] text-slate-600">
                  Mill size
                  {[30, 60, 120].map((k) => <Pill key={k} active={millKt === k} onClick={() => setMillKt(k)}>{k} kt</Pill>)}
                </div>
              </div>
              <div className={cn('rounded-xl px-3 py-3 border', gap > 0 ? 'bg-brand-50 border-brand-200' : 'bg-green-50 border-green-200')}>
                <div className="text-[11px] text-slate-500">Gap after today's supply and the named pipeline</div>
                <div className="text-[28px] font-bold text-slate-900 tabular-nums leading-tight">{gap.toFixed(2)} Mt</div>
                <div className="text-[13px] text-slate-700">≈ <b>{mills}</b> textile-to-textile mills of {millKt} kt</div>
              </div>
              <p className="text-[11px] text-slate-400 flex gap-1.5"><Info size={12} className="shrink-0 mt-0.5" /> Fibre and pulp tonnes are treated as equal, which overstates supply slightly. Agricultural residue MMCF is not in the recycled figure.</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Handshake size={16} className="text-brand-600" /> Offtake signals</span>} subtitle="What demand evidence exists, and what is missing before it can go in an investment case" />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[620px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="text-left py-2 pr-3 font-semibold">Where</th><th className="text-left py-2 pr-3 font-semibold">Signal</th><th className="text-left py-2 pr-3 font-semibold">Missing</th><th className="py-2" /></tr></thead>
              <tbody>
                {OFFTAKE.map((o) => {
                  const src = S(o.sourceId)
                  return (
                    <tr key={o.who} className="border-t border-slate-100 align-top">
                      <td className="py-2 pr-3 font-semibold text-slate-900">{o.who}</td>
                      <td className="py-2 pr-3 text-slate-700">{o.signal}</td>
                      <td className="py-2 pr-3 text-amber-600">{o.gap}</td>
                      <td className="py-2 text-right">{src && <EvidenceBadge source={src} size="xs" label="Source" />}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-[11px] text-slate-500 mt-3"><b className="text-slate-700">To collect next:</b> brand MMCF volumes and Next Gen targets from the Textile Exchange Materials Benchmark and CDP Forests, and signed offtake tonnes from Fiber Club members. That turns the scenario slider into a measured number.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

function Stat({ value, label, sub, badge }: { value: string; label: string; sub?: string; badge?: React.ReactNode }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[26px] font-bold text-slate-900 tabular-nums leading-none">{value}</div>
        {badge}
      </div>
      <div className="text-[13px] text-slate-600 mt-1.5">{label}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </Card>
  )
}
