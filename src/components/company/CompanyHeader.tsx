import { Share2, Download, Plus, Leaf } from 'lucide-react'
import type { Company } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function CompanyHeader({ company }: { company: Company }) {
  return (
    <Card className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-5">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl italic tracking-tight bg-white border border-slate-200"
          style={{ color: company.logoColour }}
        >
          {company.logoText}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{company.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[13px] text-slate-500">
            <span>{company.sector}</span>
            <span className="text-slate-300">|</span>
            <span>{company.hq}</span>
            {company.relationship && (
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-300 bg-brand-50 text-brand-700 px-2.5 py-0.5 text-[11px] font-semibold">
                <Leaf size={12} /> {company.relationship.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {company.tagline && (
        <div className="hidden xl:block border-l border-slate-200 pl-5 max-w-[300px]">
          <div className="text-[15px] font-semibold text-slate-900">{company.tagline}</div>
          <div className="text-xs text-slate-500 mt-0.5">Working together to move beyond ancient and endangered forests.</div>
        </div>
      )}

      <div className="lg:ml-auto flex items-center gap-2 flex-wrap">
        <Button variant="secondary" size="sm" icon={<Share2 size={14} />}>
          Share
        </Button>
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>
          Export
        </Button>
        <Button size="sm" icon={<Plus size={14} />}>
          Add to Portfolio
        </Button>
      </div>
    </Card>
  )
}
