import { useMemo, useState } from 'react'
import { Factory, Info, Layers, Wheat, Shirt, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Pill } from '@/components/ui/Pill'
import { SvgWorldMap } from '@/components/company/SvgWorldMap'
import type { MapMarker } from '@/components/company/WorldMap'
import { useStore } from '@/store/StoreContext'
import { INDIA_CANDIDATES, MILL_LAYERS, PATH_META, PILLAR_META, SIGNAL_META, type CandidateRegion, type Pillar } from '@/data/mills'
import { cn } from '@/lib/cn'

const PILLARS: Pillar[] = ['agri', 'textile', 'demand']
const PILLAR_ICON: Record<Pillar, typeof Wheat> = { agri: Wheat, textile: Shirt, demand: Factory }

type Weights = Record<Pillar, number>

function score(r: CandidateRegion, w: Weights) {
  return PILLARS.reduce((a, p) => a + SIGNAL_META[r.pillars[p].signal].points * w[p], 0)
}

export function NextGenMillsPage() {
  const { data } = useStore()
  const Q = (id?: string) => (id ? data.quantities.find((q) => q.id === id) : undefined)
  const S = (id?: string) => (id ? data.sources.find((s) => s.id === id) : undefined)
  const [w, setW] = useState<Weights>({ agri: 1, textile: 1, demand: 1 })
  const [selected, setSelected] = useState<string>(INDIA_CANDIDATES[0].id)

  const ranked = useMemo(() => [...INDIA_CANDIDATES].map((r) => ({ r, s: score(r, w) })).sort((a, b) => b.s - a.s), [w])
  const maxScore = PILLARS.reduce((a, p) => a + 2 * w[p], 0) || 1
  const sel = INDIA_CANDIDATES.find((r) => r.id === selected)!

  const markers: MapMarker[] = INDIA_CANDIDATES.map((r) => ({
    id: r.id,
    lat: r.lat,
    lng: r.lng,
    // Only the selected region is labelled; the three northern candidates sit close together.
    label: r.id === selected ? r.name : '',
    sublabel: `${r.name} · ${PATH_META[r.path].label}`,
    colour: PATH_META[r.path].colour,
    kind: r.id === selected ? 'major' : 'alt',
    overlap: r.id === selected,
  }))

  const textileWaste = Q('q_in_textile_waste')
  const restart = S('src_canopy_ar_2324')

  return (
    <AppShell crumbs={[{ label: 'Next Gen mills' }]}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Where Next Gen mills should go</h1>
            <p className="text-[15px] text-slate-500 mt-1">Matching feedstock to demand, starting with India, the first of Canopy's six scale-up regions.</p>
          </div>
          <div className="flex rounded-xl bg-cream-200 p-1 text-[13px] font-semibold">
            <span className="whitespace-nowrap rounded-lg px-4 py-2 bg-brand-500 text-white shadow-sm">India</span>
            <span className="whitespace-nowrap rounded-lg px-4 py-2 text-slate-400" title="Planned">North America</span>
            <span className="whitespace-nowrap rounded-lg px-4 py-2 text-slate-400" title="Planned">Europe</span>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-brand-700">Decision this supports</div>
            <p className="text-[15px] font-semibold text-slate-900 mt-0.5">Which Indian regions should Canopy put in front of investors first, and for which kind of mill?</p>
            <p className="text-[12px] text-slate-600 mt-1">
              Canopy's Next Gen plan commits to "identify ideal mill site locations". This view makes a first cut from verified data and shows which data would sharpen it.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {['Canopy India hub', 'Investors', 'State governments', 'Producers'].map((u) => (
              <Pill key={u} tone="forest"><Users size={11} /> {u}</Pill>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Context label="Paddy straw, Punjab + Haryana + NCR UP" value="26.2 Mt" sub="Generated, 2021 projection. Not all of it is available." badge={<EvidenceBadge quantity={Q('q_in_paddy_punjab')} label="PIB" size="xs" />} />
          <Context label="Textile waste in India each year" value={textileWaste?.value ? `${textileWaste.value} Mt` : 'unknown'} sub="51% post-consumer · 42% pre-consumer · 7% imported" badge={textileWaste && <EvidenceBadge quantity={textileWaste} size="xs" />} />
          <Context label="Re-START Alliance target" value="1 Mt" sub="Recycled fibre produced in India by 2030. Canopy, IDH, Fashion for Good, Laudes" badge={restart && <EvidenceBadge source={restart} label="Canopy AR 23/24" size="xs" />} />
        </div>

        <div className="grid xl:grid-cols-[1.1fr_1fr] gap-4 items-start">
          <Card>
            <CardHeader title="Candidate regions" subtitle="Colour shows the kind of mill each region suits" />
            <div className="px-5 pb-5">
              <div className="rounded-xl overflow-hidden bg-white border border-slate-200" style={{ height: 380 }}>
                <SvgWorldMap markers={markers} fitToIds={['356']} highlightById={{ '356': '#efe9dc' }} onMarkerClick={(m) => setSelected(m.id)} zoomable />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                {Object.values(PATH_META).map((p) => (
                  <span key={p.label} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: p.colour }} /> {p.label}</span>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Ranking"
              subtitle="Quantified = 2 points, known but not quantified = 1, not loaded = 0. Weight each factor."
              action={<Pill tone="inferred">First cut</Pill>}
            />
            <div className="px-5 pb-5">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 mb-3">
                {PILLARS.map((p) => {
                  const Icon = PILLAR_ICON[p]
                  return (
                    <label key={p} className="flex items-center gap-3 py-1.5 text-[12px]">
                      <Icon size={14} className="text-slate-400 shrink-0" />
                      <span className="flex-1 text-slate-700">{PILLAR_META[p].label}</span>
                      <input type="range" min={0} max={3} step={1} value={w[p]} onChange={(e) => setW({ ...w, [p]: Number(e.target.value) })} className="w-[110px] accent-brand-500" aria-label={`Weight for ${PILLAR_META[p].label}`} />
                      <span className="w-[24px] text-right tabular-nums font-semibold text-slate-900">×{w[p]}</span>
                    </label>
                  )
                })}
              </div>

              <ol className="flex flex-col gap-1.5">
                {ranked.map(({ r, s }, i) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelected(r.id)}
                      className={cn('w-full text-left rounded-xl border px-3 py-2 transition-colors', selected === r.id ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-200')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-[12px] font-bold text-slate-400 tabular-nums">{i + 1}</span>
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PATH_META[r.path].colour }} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-slate-900 truncate">{r.name}</span>
                          <span className="block text-[11px] text-slate-500">{r.state} · {PATH_META[r.path].label}</span>
                        </span>
                        <span className="flex gap-1">
                          {PILLARS.map((p) => (
                            <span key={p} title={`${PILLAR_META[p].label}: ${SIGNAL_META[r.pillars[p].signal].label}`} className={cn('w-2 h-5 rounded-sm', r.pillars[p].signal === 'strong' ? 'bg-green-500' : r.pillars[p].signal === 'present' ? 'bg-amber-400' : 'bg-slate-200')} />
                          ))}
                        </span>
                        <span className="w-[54px] text-right">
                          <span className="block h-1.5 rounded-full bg-slate-100 overflow-hidden"><span className="block h-full bg-brand-500" style={{ width: `${(s / maxScore) * 100}%` }} /></span>
                          <span className="text-[10px] tabular-nums text-slate-500">{s} / {maxScore}</span>
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="text-[11px] text-slate-400 mt-2 flex gap-1.5">
                <Info size={12} className="shrink-0 mt-0.5" />
                The score counts evidence, not suitability. A low score often means data is missing, which is itself a finding.
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: PATH_META[sel.path].colour }} />{sel.name}, {sel.state}</span>}
            subtitle={`${PATH_META[sel.path].label}: ${PATH_META[sel.path].what}`}
          />
          <div className="px-5 pb-5 grid lg:grid-cols-[1.4fr_1fr] gap-4">
            <div className="flex flex-col gap-2">
              {PILLARS.map((p) => {
                const e = sel.pillars[p]
                const Icon = PILLAR_ICON[p]
                const q = Q(e.quantityId)
                const src = S(e.sourceId)
                return (
                  <div key={p} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 flex items-start gap-3">
                    <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-slate-900">{PILLAR_META[p].label}</span>
                        <span className={cn('rounded-full text-[10px] font-semibold px-1.5 py-0.5', SIGNAL_META[e.signal].tone)}>{SIGNAL_META[e.signal].label}</span>
                      </div>
                      <div className="text-[12px] text-slate-600 mt-0.5">{e.text}</div>
                    </div>
                    {q && <EvidenceBadge quantity={q} size="xs" />}
                    {src && !q && <EvidenceBadge source={src} label="Source" size="xs" />}
                  </div>
                )
              })}
              <p className="text-[11px] text-slate-400">"Known, not quantified" marks analyst knowledge with no loaded source. It needs a source before this goes to an investor.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-cream-100 border border-cream-200 px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Why it is on the list</div>
                <p className="text-[13px] text-slate-800 mt-1">{sel.why}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Questions to answer next</div>
                <ul className="mt-1 flex flex-col gap-1 text-[12px] text-slate-700 list-disc pl-4">
                  {sel.openQuestions.map((q) => <li key={q}>{q}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Layers size={16} className="text-brand-600" /> Data layers</span>} subtitle="What is loaded and what would sharpen the ranking, in order" />
          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-[12px] min-w-[640px]">
              <thead className="text-[10px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="text-left font-semibold py-2 pr-3">Layer</th>
                  <th className="text-left font-semibold py-2 pr-3">What it adds</th>
                  <th className="text-left font-semibold py-2 pr-3">Question it answers</th>
                  <th className="text-left font-semibold py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {MILL_LAYERS.map((l) => (
                  <tr key={l.name} className="border-t border-slate-100 align-top">
                    <td className="py-2 pr-3"><div className="font-semibold text-slate-900">{l.name}</div><div className="text-[11px] text-slate-400">{l.publisher}</div></td>
                    <td className="py-2 pr-3 text-slate-600">{l.what}</td>
                    <td className="py-2 pr-3 text-slate-600">{l.answers}</td>
                    <td className="py-2">
                      <span className={cn('rounded-full text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap', l.status === 'loaded' ? 'bg-green-100 text-green-700' : l.status === 'next' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}>
                        {l.status === 'loaded' ? 'Loaded' : l.status === 'next' ? 'Next' : 'Later'}
                      </span>
                    </td>
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

function Context({ label, value, sub, badge }: { label: string; value: string; sub: string; badge?: React.ReactNode }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none tabular-nums">{value}</div>
        {badge}
      </div>
      <div className="text-[13px] text-slate-600 mt-1.5">{label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
    </Card>
  )
}
