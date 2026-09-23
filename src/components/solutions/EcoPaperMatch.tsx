import { useMemo, useState } from 'react'
import { CheckCircle2, Circle, Crosshair } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { useStore } from '@/store/StoreContext'
import { fieldCoverage, matchListings, productRegion } from '@/lib/match'
import { cn } from '@/lib/cn'

/** Rank EcoPaper listings against one traced packaging product. */
export function EcoPaperMatch() {
  const { data } = useStore()
  const products = useMemo(() => data.products.filter((p) => data.companies.find((c) => c.id === p.companyId)?.stream !== 'fashion'), [data])
  const [pid, setPid] = useState(products[0]?.id ?? '')
  const product = products.find((p) => p.id === pid)
  const results = useMemo(() => (product ? matchListings(product, data).slice(0, 4) : []), [product, data])
  const cov = fieldCoverage(data)
  if (!product) return null
  const company = data.companies.find((c) => c.id === product.companyId)

  return (
    <Card>
      <CardHeader
        title={<span className="flex items-center gap-2"><Crosshair size={16} className="text-brand-600" /> Match listings to a traced product</span>}
        subtitle="EcoPaper as structured data: grade, geography and evidence scored against the product, with the missing fields shown"
      />
      <div className="px-5 pb-5 grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="flex flex-col gap-2.5 min-w-0">
          <label className="flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
            Product
            <select value={pid} onChange={(e) => setPid(e.target.value)} className="w-full sm:w-auto max-w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[13px] font-semibold text-slate-800">
              {products.map((p) => <option key={p.id} value={p.id}>{data.companies.find((c) => c.id === p.companyId)?.name} · {p.name}</option>)}
            </select>
            <span className="text-slate-400">{product.application} · {productRegion(product, data) || 'region unknown'}</span>
          </label>
          <ol className="flex flex-col gap-2">
            {results.map((r, i) => (
              <li key={r.s.id} className={cn('rounded-xl border px-3 py-2.5', i === 0 && r.score >= 5 ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white')}>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-slate-400 w-4">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold text-slate-900 truncate">{r.s.provider ?? r.s.name}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{r.s.name}</span>
                  </span>
                  <span className="text-[13px] font-bold tabular-nums text-slate-900">{r.score}<span className="text-slate-400 font-normal">/8</span></span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[11px]">
                  {r.reasons.map((x) => (
                    <span key={x.text} className={cn('flex items-center gap-1', x.ok ? 'text-green-700' : 'text-slate-400')}>
                      {x.ok ? <CheckCircle2 size={11} /> : <Circle size={11} />} {x.text}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-amber-600 mt-1">Missing: {r.missing.join(', ')}</div>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-slate-400">A lead for {company?.name}'s buyers, not a verified substitute: grade performance and volume still need checking with the supplier.</p>
        </div>
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 self-start">
          <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">Field coverage, {cov.n} real listings loaded</div>
          <table className="w-full text-[12px] mt-1.5">
            <tbody>
              {cov.rows.map((r) => (
                <tr key={r.field} className="border-t border-slate-100">
                  <td className="py-1.5 text-slate-700">{r.field}</td>
                  <td className="py-1.5 w-[90px]">
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-brand-500" style={{ width: `${cov.n ? (r.have / cov.n) * 100 : 0}%` }} /></div>
                  </td>
                  <td className="py-1.5 pl-2 text-right tabular-nums text-slate-500">{r.have}/{cov.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-slate-500 mt-2">The full EcoPaper database (1,400+ listings) is not public as data. With Canopy's export, import it through the Data workspace and the matcher ranks every listing. Minimum order and certification need new fields in the listing form.</p>
        </div>
      </div>
    </Card>
  )
}
