import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown } from 'lucide-react'
import { useStore } from '@/store/StoreContext'
import { cn } from '@/lib/cn'

type SortKey = 'volume' | 'coverage' | 'name'

export function CompanyList({ activeId }: { activeId?: string }) {
  const { data } = useStore()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('coverage')

  const rows = useMemo(() => {
    const list = data.companies
      .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.sector.toLowerCase().includes(q.toLowerCase()))
      .map((c) => {
        const out = data.quantities.find((x) => x.id === c.totalOutputQuantityId)
        const coverage = [c.mapping.supplierIdentified, c.mapping.millIdentified, c.mapping.originTraced].filter((s) => s === 'confirmed').length
        const mapped = data.products
          .filter((p) => p.companyId === c.id)
          .reduce((a, p) => a + (data.quantities.find((q) => q.id === p.shareOfCompanyQuantityId)?.value ?? 0), 0)
        return { c, out, coverage, mapped }
      })
    list.sort((a, b) => {
      if (sort === 'name') return a.c.name.localeCompare(b.c.name)
      if (sort === 'volume') return (b.out?.value ?? -1) - (a.out?.value ?? -1)
      // Default: best-evidenced first, then by how much of the company is mapped to products.
      return b.coverage - a.coverage || b.mapped - a.mapped || (b.out?.value ?? -1) - (a.out?.value ?? -1)
    })
    return list
  }, [data, q, sort])

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Companies</h2>
        
      </div>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-400">
        <Search size={14} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search companies…" className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400" />
      </label>
      <div className="flex items-center gap-1 text-[11px] text-slate-500">
        <ArrowUpDown size={11} /> Sort:
        {(['volume', 'coverage', 'name'] as SortKey[]).map((k) => (
          <button key={k} onClick={() => setSort(k)} className={cn('rounded-md px-1.5 py-0.5 capitalize', sort === k ? 'bg-brand-100 text-brand-700 font-semibold' : 'hover:text-slate-800')}>
            {k === 'coverage' ? 'mapping' : k}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-1 border-t border-slate-200 pt-2">
        {rows.map(({ c, out, coverage, mapped }) => (
          <li key={c.id}>
            <Link
              to={`/companies/${c.id}`}
              className={cn('flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13px] transition-colors border-l-2', activeId === c.id ? 'bg-brand-50 border-brand-500 text-brand-800' : 'border-transparent hover:bg-cream-100 text-slate-800')}
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-[10px] text-slate-400">
                  {c.type === 'brand' ? 'Brand · purchases' : 'Producer'} · mapping {coverage}/3
                  {mapped > 0 && ` · ${mapped.toFixed(1)}% mapped`}
                </div>
              </div>
              <span className={cn('text-[12px] font-semibold tabular-nums shrink-0', activeId === c.id ? 'text-brand-700' : 'text-slate-500')}>
                {c.type === 'brand' ? '—' : out && out.value !== null ? `${out.value} ${out.unit}` : 'Unknown'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
