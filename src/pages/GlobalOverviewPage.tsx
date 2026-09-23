import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Info, Leaf, MapPin, Package, Shirt, TreePine } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardHeader } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { SvgWorldMap, type MapBubble } from '@/components/company/SvgWorldMap'
import { PackagingComposition } from '@/components/global/PackagingComposition'
import { HotButtonTable, RiskPill } from '@/components/global/HotButton'
import { MmcfScope } from '@/components/global/MmcfScope'
import { HOT_BUTTON_2025, HB_CRITERIA, RISK_META, capacityByRisk, type RiskStatus } from '@/data/hotbutton'
import { useStore } from '@/store/StoreContext'
import { FIBRE_META, type Quantity } from '@/data/model'
import faoPkg from '@/data/fao_packaging_2024.json'
import { cn } from '@/lib/cn'

type Sector = 'packaging' | 'fashion'
type MapView = 'production' | 'origin'

function KpiCard({ icon, iconBg, value, label, sub, quantity }: { icon: React.ReactNode; iconBg: string; value: React.ReactNode; label: string; sub?: React.ReactNode; quantity?: Quantity }) {
  return (
    <Card className="px-5 py-5 flex items-center gap-4">
      <div className={cn('w-14 h-14 rounded-full flex items-center justify-center shrink-0', iconBg)}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">{value}</div>
        <div className="text-[13px] text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
          <span>{label}</span>
          {quantity && <EvidenceBadge quantity={quantity} size="xs" />}
        </div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </Card>
  )
}

export function GlobalOverviewPage() {
  const { data } = useStore()
  const [sector, setSector] = useState<Sector>('packaging')
  const [mapView, setMapView] = useState<MapView>('production')
  const [demo, setDemo] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const Q = (id: string) => data.quantities.find((q) => q.id === id)
  const packaging = Q('q_global_packaging_2024')!
  const pkgRecycled = Q('q_global_pkg_recycled_t')!
  const pkgVirgin = Q('q_global_pkg_virgin_t')!
  const pkgCertified = Q('q_global_pkg_certified_t')!
  const pkgNextGen = Q('q_global_pkg_nextgen_t')!
  const pkgNonFibre = Q('q_global_pkg_nonfibre_t')!
  const ngCapacity = Q('q_global_nextgen_capacity')!
  const faoSource = data.sources.find((s) => s.id === 'src_faostat_grades_2024')

  const total = faoPkg.worldTonnes
  const rows = faoPkg.countries
  const clean = (n: string) =>
    n
      .replace('United States of America', 'USA')
      .replace('China, mainland', 'China')
      .replace('Russian Federation', 'Russia')
      .replace('United Kingdom of Great Britain and Northern Ireland', 'UK')
      .replace('Republic of Korea', 'South Korea')
      .replace('China, Taiwan Province of', 'Taiwan')
      .replace('Iran (Islamic Republic of)', 'Iran')
      .replace('Netherlands (Kingdom of the)', 'Netherlands')
      .replace('Türkiye', 'Turkey')

  const productionBubbles = useMemo<MapBubble[]>(() => {
    const max = rows[0].tonnes
    return rows.slice(0, 30).map((c, i) => ({
      id: c.m49,
      m49: c.m49,
      label: clean(c.area),
      sublabel: `${(c.tonnes / 1e6).toFixed(1)} Mt · ${((c.tonnes / total) * 100).toFixed(1)}% of world packaging · FAO flag ${c.flag} (${c.flagDescription})`,
      radius: 6 + 40 * Math.sqrt(c.tonnes / max),
      colour: '#6a47ea',
      showLabel: i < 5,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, total])

  const originBubbles = useMemo<MapBubble[]>(
    () => data.origins.filter((o) => o.m49).map((o) => ({ id: o.id, m49: o.m49!, label: o.name, sublabel: o.note, radius: 11, colour: '#009a7e', showLabel: true, dashed: true })),
    [data.origins],
  )

  const bubbles = mapView === 'production' ? productionBubbles : originBubbles
  const selectedRow = rows.find((r) => r.m49 === selected)
  const selectedOrigin = data.origins.find((o) => o.m49 === selected)

  const demoSlices = [
    { key: 'virginWoodPct', v: 50 },
    { key: 'recycledPct', v: 35 },
    { key: 'nextGenPct', v: 10 },
    { key: 'unknownPct', v: 5 },
  ] as const

  return (
    <AppShell crumbs={[{ label: 'Global overview' }]}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">A global view of material transition</h1>
            <p className="text-[15px] text-slate-500 mt-1">Understand the scale. Find the opportunities.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-cream-200 p-1">
              {(['packaging', 'fashion'] as Sector[]).map((s) => (
                <button key={s} onClick={() => setSector(s)} className={cn('rounded-lg px-4 py-2 text-[13px] font-semibold capitalize transition-colors', sector === s ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900')}>
                  {s}
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700">2024</div>
          </div>
        </div>

        {sector === 'fashion' ? (
          <FashionOverview />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              <KpiCard icon={<Package size={24} />} iconBg="bg-brand-100 text-brand-600" value="277.9 Mt" label="Packaging paper & board · FAO 2024" sub="Case materials, cartonboard, wrapping and other packaging papers" quantity={packaging} />
              <KpiCard icon={<TreePine size={24} />} iconBg="bg-slate-100 text-slate-700" value="~92 Mt" label="Virgin wood fibre in packaging" sub="Estimated" quantity={pkgVirgin} />
              <KpiCard icon={<Leaf size={24} />} iconBg="bg-green-100 text-green-600" value="11.9 Mt" label="Next Gen capacity (all applications)" sub="Capacity, not output. Packaging share unknown" quantity={ngCapacity} />
            </div>

            <div className="grid xl:grid-cols-[1fr_1.35fr] gap-4 items-start">
              <Card>
                <CardHeader
                  title={<span>Packaging fibre composition{demo && <span className="text-slate-400 font-normal"> (demo)</span>}</span>}
                  subtitle={demo ? 'Demo mix. Not real global data.' : 'What the 277.9 Mt is made of'}
                  action={
                    <Pill active={demo} onClick={() => setDemo(!demo)}>
                      {demo ? 'Exit demo' : 'Demo mode'}
                    </Pill>
                  }
                />
                <div className="px-5 pb-5">
                  {demo ? (
                    <div className="animate-fade-up">
                      <div className="rounded-lg bg-brand-50 border border-brand-100 text-brand-700 text-[12px] px-3 py-2 mb-3 flex items-center gap-2">
                        <Info size={13} /> Illustrative composition. Not a verified global estimate.
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-[180px] h-[180px] shrink-0">
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie data={demoSlices.map((d) => ({ name: d.key, value: d.v }))} dataKey="value" innerRadius="58%" outerRadius="100%" paddingAngle={1} strokeWidth={0} startAngle={90} endAngle={-270} animationDuration={500}>
                                {demoSlices.map((d) => (
                                  <Cell key={d.key} fill={FIBRE_META[d.key].colour} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center text-center text-[13px] font-semibold text-slate-700 leading-tight">
                            Illustrative
                            <br />
                            mix
                          </div>
                        </div>
                        <ul className="flex-1 flex flex-col gap-2 text-[13px]">
                          {demoSlices.map((d) => (
                            <li key={d.key} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ background: FIBRE_META[d.key].colour }} />
                              <span className="flex-1 text-slate-700">{FIBRE_META[d.key].label}</span>
                              <span className="font-semibold">{d.v}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-up">
                      <PackagingComposition total={packaging} recycled={pkgRecycled} virgin={pkgVirgin} certified={pkgCertified} nextGen={pkgNextGen} nonFibre={pkgNonFibre} nextGenCapacity={ngCapacity} />
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Where production happens"
                  subtitle={mapView === 'production' ? 'Packaging paper & board production by country · FAO 2024' : 'Fibre origin, where sourcing evidence exists'}
                  action={
                    <div className="flex rounded-xl bg-cream-200 p-1">
                      {(['production', 'origin'] as MapView[]).map((v) => (
                        <button key={v} onClick={() => { setMapView(v); setSelected(null) }} className={cn('rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors', mapView === v ? 'bg-brand-500 text-white' : 'text-slate-600')}>
                          {v === 'production' ? 'Production' : 'Fibre origin'}
                        </button>
                      ))}
                    </div>
                  }
                />
                <div className="px-5 pb-5">
                  <div className="rounded-xl overflow-hidden bg-white border border-slate-200" style={{ height: 300 }}>
                    <SvgWorldMap
                      markers={[]}
                      bubbles={bubbles}
                      onBubbleClick={(b) => setSelected(selected === b.m49 ? null : b.m49)}
                      landColour="#dcdfe4"
                      zoomable
                      selectedId={selected}
                      highlightById={selected ? { [selected]: mapView === 'production' ? '#c4b6f4' : '#99d7c8' } : {}}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-slate-400">
                    <span>Drag to pan · double-click or + / − to zoom · ⌘/Ctrl + scroll</span>
                    {faoSource && mapView === 'production' && <EvidenceBadge source={faoSource} label="FAOSTAT 2024" size="xs" />}
                  </div>

                  {/* country ranking fills the card and gives a clickable alternative to small countries */}
                  <div className="mt-3 grid sm:grid-cols-[1fr_200px] gap-3 items-start">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 mb-1.5">
                        {mapView === 'production' ? 'Top producing countries' : 'Declared sourcing countries'}
                      </div>
                      <ul className="flex flex-col gap-0.5 max-h-[168px] overflow-y-auto scroll-thin pr-1">
                        {mapView === 'production'
                          ? rows.slice(0, 15).map((c) => {
                              const pct = (c.tonnes / total) * 100
                              const isSel = selected === c.m49
                              return (
                                <li key={c.m49}>
                                  <button
                                    onClick={() => setSelected(isSel ? null : c.m49)}
                                    className={cn('w-full flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] transition-colors', isSel ? 'bg-brand-50 text-brand-800' : 'hover:bg-cream-100 text-slate-700')}
                                  >
                                    <span className="w-[92px] text-left truncate font-medium">{clean(c.area)}</span>
                                    <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                      <span className="block h-full rounded-full" style={{ width: `${(c.tonnes / rows[0].tonnes) * 100}%`, background: isSel ? '#6a47ea' : '#ab97f1' }} />
                                    </span>
                                    <span className="w-[54px] text-right tabular-nums text-slate-600">{(c.tonnes / 1e6).toFixed(1)} Mt</span>
                                    <span className="w-[34px] text-right tabular-nums font-semibold">{pct.toFixed(1)}%</span>
                                  </button>
                                </li>
                              )
                            })
                          : data.origins.map((o) => {
                              const isSel = selected === o.m49
                              return (
                                <li key={o.id}>
                                  <button
                                    onClick={() => setSelected(isSel ? null : o.m49 ?? null)}
                                    className={cn('w-full flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] transition-colors', isSel ? 'bg-green-50 text-green-800' : 'hover:bg-cream-100 text-slate-700')}
                                  >
                                    <MapPin size={11} className="text-green-600 shrink-0" />
                                    <span className="flex-1 text-left truncate font-medium">{o.name}</span>
                                    <span className="text-[10px] text-slate-400">declared</span>
                                  </button>
                                </li>
                              )
                            })}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-cream-100 border border-cream-200 px-3 py-2.5 min-h-[100px]">
                      {selectedRow && mapView === 'production' ? (
                        <div className="animate-fade-up text-[12px]">
                          <div className="font-semibold text-slate-900 text-[13px]">{clean(selectedRow.area)}</div>
                          <div className="text-[20px] font-bold text-slate-900 leading-tight mt-1">{(selectedRow.tonnes / 1e6).toFixed(1)} Mt</div>
                          <div className="text-slate-600">{((selectedRow.tonnes / total) * 100).toFixed(1)}% of world packaging output</div>
                          <div className="text-slate-500 mt-1.5">FAO flag {selectedRow.flag}: {selectedRow.flagDescription}</div>
                          <div className="text-[10px] text-slate-400 mt-1.5">Manufacturing location, not forest origin.</div>
                        </div>
                      ) : selectedOrigin && mapView === 'origin' ? (
                        <div className="animate-fade-up text-[12px]">
                          <div className="font-semibold text-slate-900 text-[13px]">{selectedOrigin.name}</div>
                          <div className="text-slate-600 mt-1">{selectedOrigin.note}</div>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-400 italic">
                          {mapView === 'production' ? 'Select a country for its tonnage and FAO flag.' : 'Origin countries come from company disclosures.'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <div className="text-[13px] text-slate-600">
                <span className="font-semibold text-slate-900">Producers are researched company by company.</span>
              </div>
              <Link to="/companies" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 text-[13px] shrink-0">
                Explore companies <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}

/* ------------------------------------------------------------------ */
/* Fashion: man-made cellulosic fibre, scoped by the Hot Button Report */
/* ------------------------------------------------------------------ */

function FashionOverview() {
  const { data } = useStore()
  const [selected, setSelected] = useState<string | null>(null)
  const Q = (id: string) => data.quantities.find((q) => q.id === id)
  const byRisk = capacityByRisk()
  const rows = [...HOT_BUTTON_2025].sort((a, b) => b.capacityPct - a.capacityPct)
  const hbSource = data.sources.find((s) => s.id === 'src_hotbutton_2025')

  const riskOrder: RiskStatus[] = ['KR', 'RP', 'AR', 'IP', 'NA', 'LR', 'NK']

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard icon={<Shirt size={24} />} iconBg="bg-brand-100 text-brand-600" value="8.4 Mt" label="Man-made cellulosic fibre, 2024" sub="Viscose, lyocell, modal, acetate and cupro" quantity={Q('q_fibre_mmcf_2024')} />
        <KpiCard icon={<Leaf size={24} />} iconBg="bg-green-100 text-green-600" value={`${Q('q_mmcf_green')?.value}%`} label="MMCF capacity in green shirt producers" sub={`Excludes known risk. Including it, ${Q('q_mmcf_green_all')?.value}% scores 20 buttons or more`} quantity={Q('q_mmcf_green')} />
        <KpiCard icon={<TreePine size={24} />} iconBg="bg-red-50 text-red-700" value={`${Q('q_mmcf_known_risk')?.value}%`} label="Capacity at known risk" sub={`Plus ${Q('q_mmcf_audit_required')?.value}% requiring an audit`} quantity={Q('q_mmcf_known_risk')} />
      </div>

      <Card>
        <CardHeader title="What MMCF is made from" subtitle="Textile Exchange, 2024" />
        <div className="px-5 pb-5">
          <MmcfScope mmcf={Q('q_fibre_mmcf_2024')!} certified={Q('q_fibre_mmcf_certified')!} recycled={Q('q_fibre_mmcf_recycled')!} />
        </div>
      </Card>

      <div className="grid xl:grid-cols-[1fr_1.35fr] gap-4 items-start">
        <Card>
          <CardHeader title="What Canopy scores" subtitle="The Hot Button criteria define the scope for MMCF" />
          <div className="px-5 pb-5">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
              {HB_CRITERIA.map((c) => (
                <div key={c.key} className="flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-slate-900">{c.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.what}</div>
                  </div>
                  <div className={cn('text-[15px] font-bold tabular-nums w-[52px] text-right shrink-0', c.key === 'highRisk' ? 'text-red-700' : 'text-slate-900')}>
                    {c.key === 'highRisk' ? `${c.min}` : c.max}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex gap-1.5">
              <Info size={12} className="shrink-0 mt-0.5" />
              40 buttons in total. {hbSource && <EvidenceBadge source={hbSource} label="Hot Button 2025" size="xs" className="ml-1" />}
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Global MMCF capacity by forest risk" subtitle="Share of world capacity in each Hot Button risk status" />
          <div className="px-5 pb-5">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-1.5">
              {riskOrder.map((k) => (
                <div key={k} className="flex items-baseline gap-3 py-2.5 border-b border-slate-100 last:border-0">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <RiskPill risk={k} size="xs" />
                    <span className="text-[12px] text-slate-500 truncate">{RISK_META[k].label}</span>
                  </div>
                  <div className={cn('text-[17px] font-bold tabular-nums w-[62px] text-right shrink-0', byRisk[k] === 0 ? 'text-slate-300' : 'text-slate-900')}>{byRisk[k].toFixed(1)}%</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Calculated from the per-producer capacity shares in the 2025 matrix. Canopy reports capacity share and publishes no global tonnage, so these percentages are not multiplied by the 8.4 Mt production figure above.</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Producers"
          subtitle="Ranked by share of global MMCF capacity"
          action={<Link to="/companies/lenzing" className="text-[12px] font-semibold text-brand-600 hover:underline">Open Lenzing</Link>}
        />
        <div className="px-5 pb-5">
          <HotButtonTable rows={rows} onSelect={setSelected} selectedId={selected} />
          <p className="text-[11px] text-slate-400 mt-2">Lenzing is the only producer with a company record loaded.</p>
        </div>
      </Card>
    </div>
  )
}
