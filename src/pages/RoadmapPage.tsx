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
    title: 'India feedstock layer and mill siting',
    quarter: 'Q1',
    built: true,
    to: '/mills',
    remaining: 'District crop production, NASA FIRMS by district, and how much straw is really collectable.',
    decision: 'Which two or three regions, and which kind of mill, the India hub validates first.',
    users: ['India hub', 'Development', 'State governments'],
    data: ['District crop production (data.gov.in)', 'NASA FIRMS', 'PIB paddy straw', 'Fashion for Good Wealth in Waste', 'Canopy India blueprint'],
    owner: 'India hub, with Data & Research',
    measure: '3 candidate regions agreed for validation.',
  },
  {
    title: 'Hot Button tracker and producer links',
    quarter: 'Q1',
    built: true,
    to: '/',
    decision: 'Which MMCF producers could take Next Gen pulp near each candidate region, and their forest risk. Also tests 2027 criteria options.',
    users: ['CanopyStyle', 'India hub'],
    data: ['Hot Button 2025 matrix', 'Hot Button Progress Report 2026'],
    owner: 'CanopyStyle, with Data & Research',
    measure: 'Each candidate region linked to the producers that could buy its pulp.',
  },
  {
    title: '3-brand demand pilot',
    quarter: 'Q1',
    built: true,
    to: '/demand',
    remaining: 'Brand MMCF volumes, shared confidentially; demand is a scenario until then.',
    decision: 'Whether brands will share volumes, and whether brand, producer, pulp, mill and feedstock can be matched.',
    users: ['CanopyStyle', 'Next Gen Solutions'],
    data: ['Brand MMCF volumes (confidential)', 'Hot Button Next Gen lines', 'Textile Exchange Materials Market Report'],
    owner: 'CanopyStyle, with Data & Research',
    measure: '3 brands sharing volumes confidentially. If not, producer expansion plans become the demand signal.',
  },
  {
    title: 'Packaging product tracing',
    quarter: 'Q2',
    built: true,
    to: '/companies',
    remaining: 'More products traced to mill and origin beyond the current three companies.',
    decision: 'Which producer and product to engage, based on traced fibre and origin rather than company averages.',
    users: ['Pack4Good'],
    data: ['Company reports', 'EPD content declarations', 'EUDR origin declarations', 'FAOSTAT'],
    owner: 'Pack4Good, with Data & Research',
    measure: 'Share of engaged producers with a traced product.',
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
    title: 'Pack4Good disclosure coverage',
    quarter: 'Q2',
    built: true,
    to: '/transparency',
    remaining: 'More producers researched to the same depth as Metsä Board; method agreed with Pack4Good.',
    decision: 'Which packaging producers to engage first, and what to ask each to disclose.',
    users: ['Pack4Good', 'Producers'],
    data: ['Product tracing evidence', 'Certification data', 'Company disclosures'],
    owner: 'Pack4Good, with Data & Research',
    measure: '10 producers researched to the same depth.',
  },
  {
    title: 'Demand pilot expanded to 20 brands',
    quarter: 'Q3',
    built: true,
    to: '/demand',
    remaining: 'Volumes and commitment strength from 17 more brands, plus signed offtake where it exists.',
    decision: 'How much committed brand demand exists for Next Gen fibre, and how many mills it justifies.',
    users: ['CanopyStyle', 'Fiber Club', 'Investors'],
    data: ['Brand MMCF volumes', 'Textile Exchange Materials Benchmark', 'CDP Forests', 'Hot Button Next Gen lines'],
    owner: 'Next Gen Solutions, with CanopyStyle',
    measure: 'Next Gen demand in tonnes from 20 brands.',
  },
  {
    title: 'Supply risk overlay',
    quarter: 'Q3',
    built: true,
    to: '/risk',
    remaining: 'ForestMapper and tree cover loss layers, to go from country to forest level.',
    decision: 'Which producers\' fibre sourcing is most exposed to fire, forest loss and trade disruption.',
    users: ['Forest conservation', 'CanopyStyle', 'Pack4Good'],
    data: ['ForestMapper', 'Global Forest Watch tree cover loss', 'NASA FIRMS fires', 'UN Comtrade pulp trade'],
    owner: 'Forest conservation, with Data & Research',
    measure: 'Risk exposure shown for every producer with declared origin.',
  },
  {
    title: 'District-level siting in three regions',
    quarter: 'Q4',
    built: true,
    to: '/mills?region=europe',
    remaining: 'District crop statistics, FIRMS by district, cluster textile waste and provincial straw.',
    decision: 'A site shortlist per region; validated India sites go to investors.',
    users: ['India hub', 'Development', 'Investors', 'State governments'],
    data: ['District crop statistics', 'NASA FIRMS', 'Sorting for Circularity cluster data', 'UN Comtrade HS 470200'],
    owner: 'Next Gen Solutions and regional hubs',
    measure: 'Shortlists for India, Europe and North America; validated India sites taken to investors.',
  },
  {
    title: 'Policy tracker',
    quarter: 'Q4',
    built: true,
    to: '/policy',
    remaining: 'India and North American rules; Official Journal texts to confirm dates.',
    decision: 'Where regulation creates a deadline that makes a transition happen sooner.',
    users: ['Campaigns', 'Brand partners'],
    data: ['EUDR', 'EU Packaging and Packaging Waste Regulation', 'EU textile EPR'],
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
          <p className="text-[15px] text-slate-500 mt-1">Q1 finds where to look in India, Q2 covers packaging, Q3 proves demand, Q4 takes validated sites to investors. Every item has a working view; each card says which data is still to load.</p>
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
