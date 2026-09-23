import { useState } from 'react'
import { Equal, Handshake, Info, Minus, Users, X } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { useStore } from '@/store/StoreContext'
import { HB_2026_HEADLINES } from '@/data/hotbutton'
import { PIPELINE, STAGE_META } from '@/data/mills'
import { cn } from '@/lib/cn'

/** Who has promised to buy Next Gen, and what is missing before it counts as demand. None gives tonnes. */
const OFFTAKE = [
  { who: 'Circulose, Sundsvall', signal: '11 brands have committed to buy from the 2026 restart.', gap: 'Brand names and tonnes not published.', sourceId: 'src_circulose_ortviken' },
  { who: 'Aditya Birla (Birla Cellulose)', signal: 'Agreement with Circulose (December 2025); its LIVA Reviva line already uses Circulose pulp.', gap: 'No tonnage.', sourceId: 'src_hotbutton_2026' },
  { who: 'Red Leaf Pulp, Regina', signal: 'Packaging maker Dart provided most of Red Leaf\'s funding.', gap: 'How much pulp Dart will buy is not stated.', sourceId: 'src_redleaf_ck' },
  { who: 'Canopy brand partners', signal: '950+ brands have forest policies that favour Next Gen.', gap: 'Policies are commitments in principle, not tonnes.', sourceId: 'src_canopy_ar_2425' },
]

const fmt = (v: number) => (v < 1 ? v.toFixed(2) : v.toFixed(1))

export function DemandPage() {
  const { data } = useStore()
  const Q = (id: string) => data.quantities.find((q) => q.id === id)
  const S = (id: string) => data.sources.find((s) => s.id === id)
  const mmcf = Q('q_mmcf_production_2024')
  const recShare = Q('q_mmcf_recycled_share_2024')
  const recT = Q('q_mmcf_recycled_t_2024')
  const total = mmcf?.value ?? 8.4
  const today = recT?.value ?? 0.09

  // Textile-to-textile projects outside China named in the mills pipeline.
  // Operating projects are already inside the 2024 output figure, so only new capacity is subtracted:
  // committed (restarting or under construction) by default, permitted projects only if switched on.
  const textile = PIPELINE.filter((p) => p.path === 'textile' || (p.path === 'retrofit' && p.region !== 'china'))
  const operating = textile.filter((p) => p.stage === 'operating')
  const committed = textile.filter((p) => p.stage === 'restarting' || p.stage === 'construction')
  const permitted = textile.filter((p) => p.stage === 'permitted' || p.stage === 'announced')
  const [includePermitted, setIncludePermitted] = useState(false)
  const building = includePermitted ? [...committed, ...permitted] : committed
  const buildingMt = building.reduce((a, p) => a + p.tonnes, 0) / 1e6

  const [share, setShare] = useState(10)
  const [millKt, setMillKt] = useState(60)
  const wanted = (total * share) / 100
  const gap = Math.max(0, wanted - today - buildingMt)
  const mills = Math.ceil((gap * 1000) / millKt - 1e-9) // guard against floating-point overshoot
  const supplied = today + buildingMt
  const coveredPct = wanted > 0 ? Math.min(100, (supplied / wanted) * 100) : 100

  return (
    <AppShell crumbs={[{ label: 'Demand and supply' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">How many Next Gen fibre mills does fashion need?</h1>
          <p className="text-[15px] text-slate-500 mt-1 max-w-3xl">
            Viscose, lyocell and other fabrics made from wood pulp are called MMCF. Next Gen versions are made from old clothes instead of trees. This page asks: if brands wanted a share of their MMCF to be Next Gen, how much is missing, and how many mills would fill the gap?
          </p>
        </div>

        <Card>
          <CardHeader title="The calculation" subtitle="Move the slider. The other inputs are sourced figures or stated assumptions (mill size, which projects count, pulp and fibre tonnes treated as equal)." />
          <div className="px-5 pb-5 flex flex-col gap-4">
            <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-[14px] font-semibold text-slate-900">
                <span>What share of MMCF should be Next Gen?</span>
                <span className="text-[22px] tabular-nums text-brand-700">{share}%</span>
              </div>
              <input type="range" min={1} max={50} value={share} onChange={(e) => setShare(Number(e.target.value))} className="w-full accent-brand-500 mt-1" aria-label="Next Gen share of MMCF" />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1%</span>
                <span>This is a scenario, not a measured brand commitment</span>
                <span>50%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-2">
              <Step n="1" title="Fibre wanted" value={`${fmt(wanted)} Mt`} sub={<span className="inline-flex items-center gap-1">{share}% of the {total} Mt MMCF made in 2024 {mmcf && <EvidenceBadge quantity={mmcf} size="xs" label="" className="px-1" />}</span>} tone="brand" />
              <Op icon={<Minus size={16} />} />
              <Step n="2" title="Made today" value={`${fmt(today)} Mt`} sub={<span className="inline-flex items-center gap-1">MMCF from recycled material in 2024 ({recShare?.value}%) {recT && <EvidenceBadge quantity={recT} size="xs" label="" className="px-1" />}</span>} />
              <Op icon={<Minus size={16} />} />
              <Step
                n="3"
                title="New capacity since 2024"
                value={`${fmt(buildingMt)} Mt`}
                sub={
                  <span className="flex flex-col gap-1">
                    <span>{building.map((p) => `${p.operator} ${p.tonnes / 1000} kt, ${STAGE_META[p.stage].label.toLowerCase()}`).join(' · ')}</span>
                    {permitted.length > 0 && (
                      <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={includePermitted} onChange={(e) => setIncludePermitted(e.target.checked)} className="accent-brand-500" />
                        Include if built: {permitted.map((p) => `${p.operator} ${p.tonnes / 1000} kt`).join(', ')}
                      </label>
                    )}
                    {operating.length > 0 && <span className="text-slate-400">Not counted again: {operating.map((p) => `${p.operator} ${p.tonnes / 1000} kt`).join(', ')}, already running in 2024.</span>}
                  </span>
                }
              />
              <Op icon={<Equal size={16} />} />
              <Step n="4" title="Still missing" value={`${fmt(gap)} Mt`} sub={gap > 0 ? 'Not covered by 2024 output or the capacity included in this scenario' : 'Covered by 2024 output and the capacity included in this scenario'} tone={gap > 0 ? 'alert' : 'ok'} />
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <div className="flex items-center gap-2 text-[13px] text-slate-600 flex-wrap">
                  <X size={14} className="text-slate-400" /> Divide the missing amount by the size of one mill:
                  {[30, 60, 120].map((k) => <Pill key={k} active={millKt === k} onClick={() => setMillKt(k)}>{k} kt</Pill>)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">60 kt is Circulose's restarted mill in Sweden; 30 kt is Infinited Fiber's planned mill in Finland.</p>
              </div>
              <div className="text-right">
                <div className="text-[36px] font-bold text-slate-900 tabular-nums leading-none">{mills}</div>
                <div className="text-[12px] text-slate-500">mills, in this scenario</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] text-slate-600">
                <span>How much of the wanted fibre is covered by 2024 output and new capacity</span>
                <span className="font-semibold text-slate-900 tabular-nums">{coveredPct < 1 ? coveredPct.toFixed(1) : coveredPct.toFixed(0)}%</span>
              </div>
              <div className="h-3 rounded-full bg-brand-100 overflow-hidden mt-1 flex">
                <div className="h-full bg-brand-700" style={{ width: `${Math.min(100, (today / Math.max(wanted, 1e-9)) * 100)}%` }} title="Made today" />
                <div className="h-full bg-brand-400" style={{ width: `${Math.max(0, coveredPct - Math.min(100, (today / Math.max(wanted, 1e-9)) * 100))}%` }} title="New capacity" />
              </div>
              <div className="flex gap-4 mt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-700" /> Made today</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-400" /> New capacity since 2024</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-100" /> Missing</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 flex gap-1.5">
              <Info size={12} className="shrink-0 mt-0.5" />
              Rough on purpose. Projects already running in 2024 sit inside "made today", so they are not subtracted again; Circulose is counted as new because the mill stopped in 2024 and restarts in 2026. Pulp and fibre tonnes are treated as equal, and fibre from farm waste is not in "made today". The point is the size of the gap, not the exact number.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="px-5 py-4">
            <div className="text-[13px] text-slate-500">Who uses this</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">{['CanopyStyle', 'Next Gen Solutions', 'Investors'].map((u) => <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>)}</div>
            <p className="text-[13px] text-slate-700 mt-2">Investors will only fund a mill if someone promises to buy its fibre. This page sizes the opportunity; the table below shows how little of that demand is written down yet.</p>
          </Card>
          <Card className="px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[13px] text-slate-500">Next Gen fabrics on sale today</div>
              {S('src_hotbutton_2026') && <EvidenceBadge source={S('src_hotbutton_2026')} label="Hot Button 2026" size="xs" />}
            </div>
            <div className="text-[28px] font-bold text-slate-900 tabular-nums leading-tight">{HB_2026_HEADLINES.nextGenLines} product lines</div>
            <p className="text-[13px] text-slate-700">Up from {HB_2026_HEADLINES.nextGenLines2025} in 2025; {HB_2026_HEADLINES.nextGenLinesChina} are from Chinese producers. Products exist, but in small volumes.</p>
          </Card>
        </div>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Handshake size={16} className="text-brand-600" /> Who has promised to buy?</span>} subtitle="Signs of demand found so far, and what is missing before they count in an investment case" />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[620px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400"><tr><th className="text-left py-2 pr-3 font-semibold">Where</th><th className="text-left py-2 pr-3 font-semibold">What we know</th><th className="text-left py-2 pr-3 font-semibold">What is missing</th><th className="py-2" /></tr></thead>
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
            <p className="text-[12px] text-slate-600 mt-3"><b className="text-slate-800">Next step:</b> collect how much MMCF each brand buys and what share they want as Next Gen (Textile Exchange Materials Benchmark, CDP Forests, Fiber Club offtake agreements). Then the slider becomes a measured number.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

function Step({ n, title, value, sub, tone }: { n: string; title: string; value: string; sub: React.ReactNode; tone?: 'brand' | 'alert' | 'ok' }) {
  return (
    <div className={cn('rounded-xl border px-3 py-3', tone === 'brand' ? 'border-brand-200 bg-brand-50' : tone === 'alert' ? 'border-amber-200 bg-amber-50' : tone === 'ok' ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white')}>
      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] grid place-items-center">{n}</span>{title}</div>
      <div className="text-[26px] font-bold text-slate-900 tabular-nums leading-tight mt-1">{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
    </div>
  )
}

function Op({ icon }: { icon: React.ReactNode }) {
  return <div className="hidden md:grid place-items-center text-slate-400">{icon}</div>
}
