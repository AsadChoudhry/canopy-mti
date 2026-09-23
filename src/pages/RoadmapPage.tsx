import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Database, Hourglass, Target, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

interface Item {
  title: string
  quarter: Quarter
  built?: boolean
  /** Built as a working view; this data is still to be loaded. */
  remaining?: string
  to?: string
  decision: string
  users: string[]
  data: string[]
  owner: string
  measure: string
}

/** Year-one plan. Built items are live in this prototype; the rest are proposals. */
const ITEMS: Item[] = [
  {
    title: 'Evidence model and product tracing',
    quarter: 'Q1',
    built: true,
    decision: 'Which producer and product to engage, based on traced fibre and origin rather than company averages.',
    users: ['Pack4Good', 'CanopyStyle'],
    data: ['Company reports', 'EPD content declarations', 'EUDR origin declarations', 'FAOSTAT'],
    owner: 'Data & Research, with campaign leads',
    measure: 'Share of engaged producers with a traced product (8 of 8 evidence checks).',
  },
  {
    title: 'Hot Button tracker and 2027 criteria test',
    quarter: 'Q1',
    built: true,
    decision: 'How a criteria change shifts shirt colours and green shirt capacity, before the 2027 consultation closes.',
    users: ['CanopyStyle', 'Brand partners'],
    data: ['Hot Button 2025 matrix', 'Hot Button Progress Report 2026'],
    owner: 'CanopyStyle, with Data & Research',
    measure: 'Criteria options tested with producers and brands before the 2027 report.',
  },
  {
    title: 'Road to 60 Mt and mill siting, India',
    quarter: 'Q1',
    built: true,
    to: '/mills',
    decision: 'Which regions and mill types to bring to investors first.',
    users: ['India hub', 'Development', 'Investors'],
    data: ['Canopy annual reports', 'PIB paddy straw', 'Fashion for Good Wealth in Waste'],
    owner: 'India hub, with Development',
    measure: 'Candidate sites in investor conversations.',
  },
  {
    title: 'EcoPaper as structured data',
    quarter: 'Q2',
    built: true,
    to: '/solutions',
    remaining: 'Canopy\'s full listing export (1,400+), plus minimum order and certification fields.',
    decision: 'Which vetted alternative fits a traced product, by grade, geography and volume.',
    users: ['Pack4Good', 'Brand partners'],
    data: ['EcoPaper Database, 1,400+ listings'],
    owner: 'Pack4Good',
    measure: 'Transition panel shows real leads instead of illustrative ones.',
  },
  {
    title: 'Pack4Good producer transparency score',
    quarter: 'Q2',
    built: true,
    to: '/transparency',
    remaining: 'More producers traced to the same depth as Metsä Board; consultation on weights.',
    decision: 'Which packaging producers lead or lag, as Hot Button does for viscose.',
    users: ['Pack4Good', 'Brand partners', 'Producers'],
    data: ['Evidence checks from product tracing', 'Certification data', 'Company disclosures'],
    owner: 'Pack4Good, with Data & Research',
    measure: 'First scored list of packaging producers published to brand partners.',
  },
  {
    title: 'Brand demand against Next Gen supply',
    quarter: 'Q3',
    built: true,
    to: '/demand',
    remaining: 'Brand MMCF volumes and signed offtake tonnes; demand is a scenario until then.',
    decision: 'How much committed brand demand exists for Next Gen fibre, and the gap that justifies new mills.',
    users: ['CanopyStyle', 'Fiber Club', 'Investors'],
    data: ['Textile Exchange Materials Benchmark', 'CDP Forests', 'Brand disclosures', 'Hot Button Next Gen lines'],
    owner: 'Next Gen Solutions, with CanopyStyle',
    measure: 'Demand signal quoted in offtake and investment discussions.',
  },
  {
    title: 'Supply risk overlay',
    quarter: 'Q3',
    built: true,
    to: '/risk',
    remaining: 'ForestMapper and tree cover loss layers, to go from country to forest level.',
    decision: 'Which producers\' fibre sourcing is most exposed to fire, forest loss and trade disruption.',
    users: ['CanopyStyle', 'Pack4Good', 'Brand partners'],
    data: ['ForestMapper', 'Global Forest Watch tree cover loss', 'NASA FIRMS fires', 'UN Comtrade pulp trade'],
    owner: 'Forest conservation, with Data & Research',
    measure: 'Risk exposure shown for every producer with declared origin.',
  },
  {
    title: 'Mill siting v2, and North America and Europe',
    quarter: 'Q4',
    built: true,
    to: '/mills?region=europe',
    remaining: 'District crop statistics, FIRMS by district, cluster textile waste and provincial straw.',
    decision: 'A ranked site list per scale-up region, backed by district-level feedstock data.',
    users: ['India hub', 'Development', 'Investors', 'State governments'],
    data: ['NASA FIRMS', 'District crop statistics', 'Sorting for Circularity cluster data', 'UN Comtrade HS 470200'],
    owner: 'Next Gen Solutions and regional hubs',
    measure: 'Site shortlists for three regions.',
  },
  {
    title: 'Policy tracker',
    quarter: 'Q4',
    built: true,
    to: '/policy',
    remaining: 'India and North American rules; Official Journal texts to confirm dates.',
    decision: 'Where regulation creates a deadline that makes a transition happen sooner.',
    users: ['Policy and campaigns', 'Brand partners'],
    data: ['EUDR', 'EU Packaging and Packaging Waste Regulation', 'India EPR rules'],
    owner: 'Campaigns, with Data & Research',
    measure: 'Each tracked company tagged with the rules that apply to it.',
  },
]

const QUARTERS: { q: Quarter; label: string }[] = [
  { q: 'Q1', label: 'Months 1 to 3' },
  { q: 'Q2', label: 'Months 4 to 6' },
  { q: 'Q3', label: 'Months 7 to 9' },
  { q: 'Q4', label: 'Months 10 to 12' },
]

export function RoadmapPage() {
  return (
    <AppShell crumbs={[{ label: 'Year-one roadmap' }]}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Year-one roadmap</h1>
          <p className="text-[15px] text-slate-500 mt-1">Every item now has a working view. What remains is data: each card says which.</p>
        </div>

        <div className="flex flex-wrap gap-4 text-[12px] text-slate-600">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-600" /> Working view in this prototype</span>
          <span className="flex items-center gap-1.5"><Hourglass size={14} className="text-slate-400" /> Data still to load</span>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {QUARTERS.map(({ q, label }) => (
            <div key={q} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 px-1">
                <span className="text-[18px] font-bold text-slate-900">{q}</span>
                <span className="text-[12px] text-slate-500">{label}</span>
              </div>
              {ITEMS.filter((i) => i.quarter === q).map((i) => (
                <Card key={i.title} className={cn('px-4 py-3.5', i.built && 'ring-1 ring-green-200')}>
                  <div className="flex items-start gap-2">
                    {i.built ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" /> : <Circle size={16} className="text-slate-300 shrink-0 mt-0.5" />}
                    <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">{i.title}</h3>
                  </div>
                  <p className="text-[12px] text-slate-700 mt-2">{i.decision}</p>
                  <dl className="mt-3 flex flex-col gap-2 text-[11px]">
                    <Row icon={<Users size={12} />} label="Used by">{i.users.join(' · ')}</Row>
                    <Row icon={<Database size={12} />} label="Data">{i.data.join(' · ')}</Row>
                    <Row icon={<Users size={12} />} label="Owner">{i.owner}</Row>
                    <Row icon={<Target size={12} />} label="Success looks like">{i.measure}</Row>
                    {i.remaining && <Row icon={<Hourglass size={12} />} label="Data still to load">{i.remaining}</Row>}
                  </dl>
                  {i.to && (
                    <Link to={i.to} className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-600 hover:underline">
                      Open <ArrowRight size={12} />
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <dt className="text-slate-400 uppercase tracking-wide text-[9px] font-semibold">{label}</dt>
        <dd className="text-slate-600">{children}</dd>
      </div>
    </div>
  )
}
