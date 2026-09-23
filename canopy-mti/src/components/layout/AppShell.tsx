import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar, type Crumb } from './TopBar'
import { SourceDrawer } from '@/components/company/SourceDrawer'
import { ActionPlanDrawer } from '@/components/company/ActionPlanDrawer'
import { NodeDetailPanel } from '@/components/company/NodeDetailPanel'
import { EvidenceDrawer } from '@/components/company/EvidenceDrawer'

export function AppShell({ crumbs, children, back }: { crumbs: Crumb[]; children: ReactNode; back?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar crumbs={crumbs} onMenu={() => setOpen(true)} back={back} />
        <main className="flex-1 px-4 lg:px-7 py-6 max-w-[1500px] w-full mx-auto">{children}</main>
      </div>
      <SourceDrawer />
      <ActionPlanDrawer />
      <NodeDetailPanel />
      <EvidenceDrawer />
    </div>
  )
}
