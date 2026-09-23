import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Evidence, SupplyChainNode } from '@/data/types'
import type { Quantity, Source } from '@/data/model'
import { HM_EVIDENCE } from '@/data/hm'

interface UIState {
  sourceEvidence: Evidence | null
  openSource: (e: Evidence | string) => void
  closeSource: () => void
  actionPlanOpen: boolean
  actionPlanContext?: string
  openActionPlan: (context?: string) => void
  closeActionPlan: () => void
  activeNode: SupplyChainNode | null
  openNode: (n: SupplyChainNode | null) => void
  evidence: EvidenceTarget | null
  openEvidence: (t: EvidenceTarget | null) => void
}

export interface EvidenceTarget {
  quantity?: Quantity
  source?: Source
  title?: string
}

const Ctx = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sourceEvidence, setSourceEvidence] = useState<Evidence | null>(null)
  const [actionPlanOpen, setActionPlanOpen] = useState(false)
  const [actionPlanContext, setActionPlanContext] = useState<string | undefined>()
  const [activeNode, setActiveNode] = useState<SupplyChainNode | null>(null)
  const [evidence, setEvidence] = useState<EvidenceTarget | null>(null)

  const openSource = useCallback((e: Evidence | string) => {
    const ev = typeof e === 'string' ? HM_EVIDENCE[e] : e
    if (ev) setSourceEvidence(ev)
  }, [])

  const value = useMemo<UIState>(
    () => ({
      sourceEvidence,
      openSource,
      closeSource: () => setSourceEvidence(null),
      actionPlanOpen,
      actionPlanContext,
      openActionPlan: (c) => {
        setActionPlanContext(c)
        setActionPlanOpen(true)
      },
      closeActionPlan: () => setActionPlanOpen(false),
      activeNode,
      openNode: setActiveNode,
      evidence,
      openEvidence: setEvidence,
    }),
    [sourceEvidence, openSource, actionPlanOpen, actionPlanContext, activeNode, evidence],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useUI = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useUI outside provider')
  return c
}
