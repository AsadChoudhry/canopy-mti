import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Info, Layers, Search, Bookmark, BookmarkCheck, FileText, Leaf, MapPin } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { useStore } from '@/store/StoreContext'
import type { Solution } from '@/data/model'
import { cn } from '@/lib/cn'

type Tab = 'EcoPaper' | 'Next Gen providers' | 'ForestMapper'

const CAT_LABEL: Record<Solution['category'], string> = { recycled_paper: 'Recycled', agricultural_residue: 'Next Gen', textile_cellulose: 'Next Gen', nextgen_pulp: 'Next Gen', tool: 'Tool', other: 'Other' }
const ART: Record<Solution['category'], string> = {
  recycled_paper: 'linear-gradient(135deg,#e9e4d6 0%,#cfc8b6 60%,#b9b19e 100%)',
  agricultural_residue: 'linear-gradient(135deg,#f3dfb0 0%,#d9b46a 60%,#b98d3d 100%)',
  textile_cellulose: 'linear-gradient(135deg,#dfe7f2 0%,#b9c8dc 60%,#93a8c4 100%)',
  nextgen_pulp: 'linear-gradient(135deg,#e5dffb 0%,#c4b6f4 60%,#8b70ee 100%)',
  tool: 'linear-gradient(135deg,#d6f6f7 0%,#7fe3e5 60%,#00c1c6 100%)',
  other: 'linear-gradient(135deg,#eceef0 0%,#dde0e4 60%,#c5cad1 100%)',
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-[12px] text-slate-700">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent font-semibold outline-none">
        <option value="All">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export function SolutionsPage() {
  const { data, toggleShortlist } = useStore()
  const [tab, setTab] = useState<Tab>('EcoPaper')
  const [q, setQ] = useState('')
  const [app, setApp] = useState('All')
  const [feed, setFeed] = useState('All')
  const [region, setRegion] = useState('All')
  const [avail, setAvail] = useState('All')

  const list = useMemo(() => {
    return data.solutions.filter((s) => {
      if (s.directory !== tab) return false
      const text = `${s.name} ${s.provider ?? ''} ${s.feedstock} ${s.applications.join(' ')}`.toLowerCase()
      if (q && !text.includes(q.toLowerCase())) return false
      if (app !== 'All' && !s.applications.includes(app)) return false
      if (feed !== 'All' && CAT_LABEL[s.category] !== feed && s.category !== feed) return false
      if (region !== 'All') {
        if (s.geography === 'global') return region === 'Global'
        if (s.geography === 'unknown') return region === 'Unknown'
        if (!s.geography.includes(region)) return false
      }
      if (avail !== 'All' && s.availability !== avail) return false
      return true
    })
  }, [data.solutions, tab, q, app, feed, region, avail])

  const apps = Array.from(new Set(data.solutions.flatMap((s) => s.applications))).sort()
  const regions = ['Global', 'Unknown', ...Array.from(new Set(data.solutions.flatMap((s) => (Array.isArray(s.geography) ? s.geography : [])))).sort()]

  return (
    <AppShell crumbs={[{ label: 'Canopy solutions' }]}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Explore Canopy solutions</h1>
            <p className="text-[15px] text-slate-500 mt-1">Discover materials, technologies and providers.</p>
          </div>
          <Link to="/companies" className="inline-flex items-center gap-2 rounded-xl border border-brand-300 text-brand-700 font-semibold px-4 py-2.5 text-[13px] hover:bg-brand-50">
            Go to companies <ArrowRight size={15} />
          </Link>
        </div>

        <div className="rounded-xl bg-brand-50 border border-brand-100 text-slate-700 text-[13px] px-4 py-3 flex items-center gap-2">
          <Info size={15} className="text-brand-500" /> For a specific transition, open a company and select its product. No generic transition calculator or savings claim lives on this page.
        </div>

        <div className="flex gap-1 border-b border-slate-200">
          {([
            { t: 'EcoPaper', icon: <FileText size={15} /> },
            { t: 'Next Gen providers', icon: <Leaf size={15} /> },
            { t: 'ForestMapper', icon: <MapPin size={15} /> },
          ] as { t: Tab; icon: React.ReactNode }[]).map(({ t, icon }) => (
            <button key={t} onClick={() => setTab(t)} className={cn('inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-px', tab === t ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800')}>
              {icon} {t}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-400">
          <Search size={17} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search materials, applications or providers" className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400" />
        </label>
        <div className="flex flex-wrap gap-2">
          <Select label="Application" value={app} onChange={setApp} options={apps} />
          <Select label="Feedstock" value={feed} onChange={setFeed} options={['Recycled', 'Next Gen', 'Tool', 'Other']} />
          <Select label="Region" value={region} onChange={setRegion} options={regions} />
          <Select label="Availability" value={avail} onChange={setAvail} options={['commercial', 'pilot', 'development', 'unknown']} />
        </div>

        {list.length === 0 ? (
          <Card className="p-8 text-center border-dashed text-[13px] text-slate-500">No entries match. Verified entries are limited to what could be confirmed from Canopy directories; use the links below for the full databases.</Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((s) => {
              const src = data.sources.find((x) => x.id === s.sourceIds[0])
              const short = data.shortlist.includes(s.id)
              return (
                <Card key={s.id} className="overflow-hidden flex flex-col">
                  <div className="h-[150px] relative" style={{ background: ART[s.category] }}>
                    <div className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/90 bg-black/25 rounded px-1.5 py-0.5">{s.status === 'illustrative' ? 'Illustrative category' : s.status === 'listing_supplied' ? 'Listing supplied' : 'Verified directory entry'}</div>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-[18px] font-bold text-slate-900 leading-tight">{s.name}</h3>
                      {s.provider && <div className="text-[12px] text-slate-500">{s.provider}</div>}
                    </div>
                    <span className="self-start rounded-full bg-teal-100 text-teal-600 text-[11px] font-semibold px-2.5 py-0.5">{CAT_LABEL[s.category]}</span>
                    <p className="text-[13px] text-slate-600">{s.note ?? s.feedstock}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
                      <div><span className="text-slate-400">Feedstock</span><div className="text-slate-800">{s.feedstock}</div></div>
                      <div><span className="text-slate-400">Geography</span><div className="text-slate-800">{s.geography === 'global' ? 'Global' : s.geography === 'unknown' ? <i>Unknown</i> : s.geography.join(', ')}</div></div>
                      <div><span className="text-slate-400">Availability</span><div className="text-slate-800 capitalize">{s.availability === 'unknown' ? <i>Unknown</i> : s.availability}</div></div>
                      <div><span className="text-slate-400">Capacity</span><div className="text-slate-800">{s.capacity ?? <i>Unknown</i>}</div></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.applications.slice(0, 4).map((a) => (
                        <span key={a} className="rounded-full bg-cream-200 text-slate-600 text-[11px] px-2.5 py-0.5">{a}</span>
                      ))}
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {src ? <EvidenceBadge source={src} label={src.accessed ? 'Source' : 'Unverified source'} size="xs" /> : <span className="text-[11px] text-slate-400">No source</span>}
                      <div className="flex items-center gap-2">
                        {s.link && (
                          <a href={s.link} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-brand-600 inline-flex items-center gap-1 hover:underline">
                            View resources <ExternalLink size={11} />
                          </a>
                        )}
                        <button onClick={() => toggleShortlist(s.id)} className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-semibold', short ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-cream-200')}>
                          {short ? <BookmarkCheck size={13} /> : <Bookmark size={13} />} {short ? 'Shortlisted' : 'Shortlist'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="rounded-2xl bg-brand-50 border border-brand-100 px-6 py-5 flex flex-col md:flex-row md:items-center gap-4">
          <Layers size={34} className="text-brand-500 shrink-0" />
          <div className="flex-1">
            <div className="text-[18px] font-bold text-brand-700">Build a shortlist, then assess it in context</div>
            <div className="text-[13px] text-slate-600">Match a resource to a company product before assessing suitability or estimating a transition. {data.shortlist.length} shortlisted.</div>
          </div>
          <Link to="/companies/mondi?product=smartkraft_brown&panel=transition" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 text-[13px]">
            Browse companies <ArrowRight size={15} />
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-500 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap gap-5">
            {[
              { l: 'EcoPaper database', u: 'https://canopyplanet.org/tools-and-resources' },
              { l: 'Next Gen providers', u: 'https://canopyplanet.org/next-generation-solutions/next-gen-providers' },
              { l: 'Next Generation Solutions', u: 'https://canopyplanet.org/next-generation-solutions' },
            ].map((x) => (
              <a key={x.u} href={x.u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand-600">{x.l} <ExternalLink size={11} /></a>
            ))}
          </div>
          <span>Concept design · General discovery catalogue</span>
        </div>
      </div>
    </AppShell>
  )
}
