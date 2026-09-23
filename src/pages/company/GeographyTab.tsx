import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HM_GEO_LAYERS, HM_GEO_POINTS, HM_EVIDENCE } from '@/data/hm'
import { ECOPAPER_ALTERNATIVES, ECOPAPER_GEO, HM_MAJOR_MARKETS } from '@/data/ecopaper'
import type { GeoLayerId } from '@/data/types'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge'
import { InfoButton } from '@/components/ui/InfoButton'
import { Pill } from '@/components/ui/Pill'
import { WorldMap, type MapMarker } from '@/components/company/WorldMap'
import { cn } from '@/lib/cn'
import { Layers, MapPin } from 'lucide-react'

export function GeographyTab() {
  const [params, setParams] = useSearchParams()
  const altId = params.get('alt')
  const [layers, setLayers] = useState<Set<GeoLayerId>>(new Set(['hm_tier1', 'hm_hq', 'ecopaper_manufacturing']))
  const [selected, setSelected] = useState<MapMarker | null>(null)

  const toggle = (id: GeoLayerId) => {
    const s = new Set(layers)
    s.has(id) ? s.delete(id) : s.add(id)
    setLayers(s)
  }

  const alt = ECOPAPER_ALTERNATIVES.find((a) => a.id === altId) ?? null

  const markers = useMemo<MapMarker[]>(() => {
    const out: MapMarker[] = []
    if (layers.has('hm_tier1'))
      HM_GEO_POINTS.filter((p) => p.layer === 'hm_tier1').forEach((p) =>
        out.push({
          id: p.id,
          lat: p.lat,
          lng: p.lng,
          label: p.label,
          sublabel: p.sublabel,
          colour: p.confidence === 'verified' ? '#282727' : '#00c1c6',
          kind: p.confidence === 'verified' ? 'major' : 'region',
          note: p.note,
          overlap: !!alt && alt.manufacturingCountries !== 'global' && alt.manufacturingCountries.includes(p.label),
        }),
      )
    if (layers.has('hm_hq')) HM_GEO_POINTS.filter((p) => p.layer === 'hm_hq').forEach((p) => out.push({ id: p.id, lat: p.lat, lng: p.lng, label: p.label, sublabel: p.sublabel, colour: '#8b70ee', kind: 'hq' }))
    if (layers.has('ecopaper_manufacturing')) {
      const alts = alt ? [alt] : ECOPAPER_ALTERNATIVES
      alts.forEach((a) => {
        if (a.manufacturingCountries === 'global') return
        a.manufacturingCountries.forEach((c, i) => {
          const g = ECOPAPER_GEO[c]
          if (!g) return
          const major = HM_MAJOR_MARKETS.includes(c)
          out.push({
            id: `${a.id}_${c}`,
            lat: g.lat + (major ? -4 : 0) + (alt ? 0 : i * 0.6),
            lng: g.lng + (major ? 4 : 0) + (alt ? 0 : (a.id === 'punarbhavaa' ? 0 : i * 0.6)),
            label: `${a.provider}: ${c}`,
            sublabel: 'Candidate manufacturing (EcoPaper)',
            colour: a.colour,
            kind: 'alt',
            note: major ? 'Potential geographic overlap with an H&M major production market' : undefined,
          })
        })
      })
    }
    return out
  }, [layers, alt])

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4 animate-fade-up items-start">
      <div className="flex flex-col gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900 mb-2">
            <Layers size={14} /> Layers
          </div>
          <ul className="flex flex-col gap-1">
            {HM_GEO_LAYERS.map((l) => {
              const loaded = l.status !== 'not_loaded'
              return (
                <li key={l.id}>
                  <button
                    disabled={!loaded}
                    onClick={() => toggle(l.id)}
                    className={cn('w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px]', loaded ? 'hover:bg-cream-100' : 'opacity-60 cursor-not-allowed')}
                    title={l.note}
                  >
                    <span className={cn('w-3.5 h-3.5 rounded border flex items-center justify-center', layers.has(l.id) && loaded ? 'bg-brand-700 border-brand-700' : 'border-slate-300 bg-white')}>
                      {layers.has(l.id) && loaded && <span className="w-1.5 h-1.5 bg-white rounded-sm" />}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: l.colour, borderStyle: loaded ? 'solid' : 'dashed' }} />
                    <span className="flex-1 text-slate-700">{l.name}</span>
                    {l.status === 'not_loaded' ? <ConfidenceBadge level="unknown" label="Not loaded" size="xs" /> : l.status === 'partial' ? <ConfidenceBadge level="partial" size="xs" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-[10px] text-slate-400 mt-3">Greyed layers exist in the schema but have no H&M data yet. Loading them is a research task, not a UI task.</p>
        </Card>

        <Card className="p-4">
          <div className="text-[13px] font-semibold text-slate-900 mb-2">EcoPaper candidate overlay</div>
          <div className="flex flex-wrap gap-1.5">
            <Pill active={!altId} onClick={() => setParams({})}>All</Pill>
            {ECOPAPER_ALTERNATIVES.map((a) => (
              <Pill key={a.id} active={altId === a.id} onClick={() => setParams({ alt: a.id })}>
                {a.provider}
              </Pill>
            ))}
          </div>
          {alt && (
            <div className="mt-3 text-[12px] text-slate-600">
              <div className="font-medium text-slate-900">{alt.provider}</div>
              <div>Manufacturing: {alt.manufacturingCountries === 'global' ? 'Global (no specific sites listed)' : alt.manufacturingCountries.join(', ')}</div>
              {alt.manufacturingCountries !== 'global' && alt.manufacturingCountries.some((c) => HM_MAJOR_MARKETS.includes(c)) && (
                <div className="mt-2 rounded-lg bg-teal-300/30 border border-teal-500/40 px-2.5 py-1.5 text-brand-900">
                  <b>Potential geographic overlap</b> — {alt.manufacturingCountries.filter((c) => HM_MAJOR_MARKETS.includes(c)).join(', ')}. Not a confirmed H&M supplier replacement.
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-4 min-w-0">
        <Card className="p-0 overflow-hidden">
          <WorldMap markers={markers} height={520} onMarkerClick={setSelected} className="rounded-2xl border-0" zoom={1.3} center={[50, 28]} highlight={{ China: '#2a6b47', Bangladesh: '#2a6b47', ...(alt && alt.manufacturingCountries !== 'global' ? Object.fromEntries(alt.manufacturingCountries.map((c) => [c, HM_MAJOR_MARKETS.includes(c) ? '#6d9a1f' : '#00c1c6'])) : {}) }} />
        </Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <CardHeader title="What the map shows" className="px-0 pt-0" info={<InfoButton evidence={HM_EVIDENCE.tier1_count} />} />
            <ul className="text-[12px] text-slate-600 flex flex-col gap-1.5">
              <li className="flex gap-2"><span className="w-3 h-3 rounded-full bg-brand-800 shrink-0 mt-0.5" /> China and Bangladesh — disclosed as H&M's largest clothing production markets.</li>
              <li className="flex gap-2"><span className="w-3 h-3 rounded-full border-2 border-dashed border-brand-500 shrink-0 mt-0.5" /> Europe, Asia, North America — regions where H&M discloses Tier 1 factories. Exact country counts not loaded.</li>
              <li className="flex gap-2"><span className="w-3 h-3 rotate-45 bg-teal-500 shrink-0 mt-0.5" /> EcoPaper candidate manufacturing countries (from listings).</li>
              <li className="flex gap-2"><span className="w-3 h-3 rounded-full bg-brand-800 ring-2 ring-teal-400 shrink-0 mt-0.5" /> Potential geographic overlap.</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-3">{HM_EVIDENCE.tier1_count.display} Tier 1 factories · {HM_EVIDENCE.suppliers_count.display} suppliers · list covers 99% of products sold. Points are country/region centroids, not facility locations.</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900 mb-2">
              <MapPin size={14} /> Selected
            </div>
            {selected ? (
              <div className="text-[13px] animate-fade-up">
                <div className="font-semibold text-slate-900">{selected.label}</div>
                {selected.sublabel && <div className="text-slate-500">{selected.sublabel}</div>}
                {selected.note && <p className="text-slate-600 mt-2">{selected.note}</p>}
                {selected.overlap && <div className="mt-2 text-[11px] font-semibold text-brand-800 bg-teal-300/30 rounded-lg px-2 py-1 inline-block">Potential geographic overlap</div>}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400 italic">Click a marker to see its evidence note.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
