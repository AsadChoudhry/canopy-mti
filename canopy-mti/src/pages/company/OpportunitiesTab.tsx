import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { HM_OPPORTUNITIES } from '@/data/hm'
import { Card } from '@/components/ui/Card'
import { Pill } from '@/components/ui/Pill'
import { Button } from '@/components/ui/Button'
import { TransitionOpportunityCard } from '@/components/company/TransitionOpportunityCard'
import { useUI } from '@/context/UIContext'

export function OpportunitiesTab() {
  const { openActionPlan } = useUI()
  const [stream, setStream] = useState<'all' | 'packaging' | 'products'>('all')
  const list = HM_OPPORTUNITIES.filter((o) => stream === 'all' || o.stream === stream)

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      <Card className="p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">Transition opportunity engine</h2>
          <p className="text-[13px] text-slate-600 mt-1 max-w-2xl">
            Given what H&M currently uses, where can Canopy realistically cause a material transition? Each opportunity is sized against the company footprint and gated on the data still missing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill active={stream === 'all'} onClick={() => setStream('all')}>All</Pill>
          <Pill active={stream === 'packaging'} onClick={() => setStream('packaging')}>Packaging</Pill>
          <Pill active={stream === 'products'} onClick={() => setStream('products')}>Products</Pill>
          <Button icon={<ArrowRight size={15} />} onClick={() => openActionPlan('Transition opportunities')}>
            Create Action Plan
          </Button>
        </div>
      </Card>
      <div className="grid xl:grid-cols-2 gap-4">
        {list.map((o) => (
          <div key={o.id} id={o.id}>
            <TransitionOpportunityCard opp={o} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
