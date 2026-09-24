import { useState } from 'react'
import { Target } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { useStore } from '@/store/StoreContext'
import { cn } from '@/lib/cn'

const START_YEAR = 2024
const END_YEAR = 2033
const W = 480
const H = 180
const PAD = { l: 34, r: 14, t: 22, b: 26 }

/**
 * Canopy's headline goal against its latest reported production.
 * The required path is compound growth from the 2024 figure to the 2033 target;
 * the linear path is shown so the "back-loaded" shape of compound growth is visible.
 */
export function RoadTo60() {
  const { data } = useStore()
  const Q = (id: string) => data.quantities.find((q) => q.id === id)
  const prod = Q('q_ng_production_2024')
  const target = Q('q_ng_target_2033')
  const cagr = Q('q_ng_cagr_needed')
  const invest = Q('q_ng_investment')
  const perT = Q('q_ng_invest_per_t')
  const ghg = Q('q_ng_ghg_2033')
  const capacity = Q('q_global_nextgen_capacity')
  const [hover, setHover] = useState<number | null>(null)

  if (!prod?.value || !target?.value) return null
  const p0 = prod.value
  const p1 = target.value
  const years = END_YEAR - START_YEAR
  const rate = Math.pow(p1 / p0, 1 / years) - 1
  const pts = Array.from({ length: years + 1 }, (_, i) => ({ year: START_YEAR + i, compound: p0 * Math.pow(1 + rate, i), linear: p0 + ((p1 - p0) * i) / years }))

  const x = (yr: number) => PAD.l + ((yr - START_YEAR) / years) * (W - PAD.l - PAD.r)
  const y = (v: number) => H - PAD.b - (v / 65) * (H - PAD.t - PAD.b)
  const line = (k: 'compound' | 'linear') => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.year).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ')
  const hp = hover !== null ? pts[hover] : null

  return (
    <Card>
      <CardHeader
        title={<span className="flex items-center gap-2"><Target size={16} className="text-brand-600" /> Road to 60 Mt</span>}
        subtitle="Canopy's 2033 Next Gen target against 2024 production. Covers paper, packaging and textiles together."
      />
      <div className="px-5 pb-5 grid lg:grid-cols-[minmax(0,560px)_1fr] gap-5 items-start">
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[520px] h-auto" onMouseLeave={() => setHover(null)} role="img" aria-label="Required Next Gen growth path from 8.35 Mt in 2024 to 60 Mt in 2033">
            {[0, 20, 40, 60].map((v) => (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#e5e7eb" strokeWidth={1} />
                <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end" fontSize={12} fill="#94a3b8">{v}</text>
              </g>
            ))}
            {pts.filter((p) => (p.year - START_YEAR) % 3 === 0).map((p) => (
              <text key={p.year} x={x(p.year)} y={H - 6} textAnchor="middle" fontSize={12} fill="#94a3b8">{p.year}</text>
            ))}
            <path d={line('linear')} fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" />
            <path d={line('compound')} fill="none" stroke="#6a47ea" strokeWidth={2.5} />
            {capacity?.value && (
              <g>
                <line x1={x(START_YEAR) - 6} x2={x(START_YEAR) + 6} y1={y(capacity.value)} y2={y(capacity.value)} stroke="#009a7e" strokeWidth={2} />
                <text x={x(START_YEAR) + 10} y={y(capacity.value) - 6} fontSize={12} fill="#009a7e">{capacity.value} Mt capacity</text>
              </g>
            )}
            <circle cx={x(START_YEAR)} cy={y(p0)} r={5} fill="#282727" />
            <circle cx={x(END_YEAR)} cy={y(p1)} r={5} fill="#6a47ea" />
            <text x={x(END_YEAR) - 10} y={y(p1) + 4} textAnchor="end" fontSize={13} fontWeight={600} fill="#6a47ea">60 Mt target</text>
            {pts.map((p, i) => (
              <rect key={p.year} x={x(p.year) - 14} y={PAD.t} width={28} height={H - PAD.t - PAD.b} fill="transparent" onMouseEnter={() => setHover(i)} />
            ))}
            {hp && (
              <g pointerEvents="none">
                <line x1={x(hp.year)} x2={x(hp.year)} y1={PAD.t} y2={H - PAD.b} stroke="#94a3b8" strokeWidth={1} />
                <circle cx={x(hp.year)} cy={y(hp.compound)} r={4} fill="#6a47ea" />
              </g>
            )}
          </svg>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-1">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand-500" /> Required path at {(rate * 100).toFixed(1)}% a year</span>
            <span className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-slate-400" /> Straight line, for comparison</span>
            <span className={cn('ml-auto tabular-nums', hp ? 'text-slate-800 font-semibold' : 'text-slate-400')}>
              {hp ? `${hp.year}: ${hp.compound.toFixed(1)} Mt needed` : 'Hover a year'}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 content-start">
          <Stat label="Produced in 2024" value={`${p0} Mt`} q={prod} />
          <Stat label="Growth needed every year" value={`${cagr?.value ?? (rate * 100).toFixed(1)}%`} q={cagr} />
          <Stat label="Investment Canopy says is needed" value={`$${invest?.value} bn`} q={invest} sub={perT?.value ? `≈ $${perT.value.toLocaleString('en-US')} per tonne of new annual output` : undefined} />
          <Stat label="Emissions avoided at 60 Mt" value={`${ghg?.value} Gt CO2e`} q={ghg} />
        </dl>
      </div>
    </Card>
  )
}

function Stat({ label, value, sub, q }: { label: string; value: string; sub?: string; q?: Parameters<typeof EvidenceBadge>[0]['quantity'] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <dt className="text-[11px] text-slate-500 flex items-center justify-between gap-2">
        {label}
        {q && <EvidenceBadge quantity={q} size="xs" />}
      </dt>
      <dd className="text-[20px] font-bold text-slate-900 tabular-nums leading-tight mt-0.5">{value}</dd>
      {sub && <dd className="text-[10px] text-slate-400">{sub}</dd>}
    </div>
  )
}
