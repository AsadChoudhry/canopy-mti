import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Quantity, Source } from '@/data/model'

export interface EvidenceTarget {
  quantity?: Quantity
  source?: Source
  title?: string
}

interface UIState {
  evidence: EvidenceTarget | null
  openEvidence: (t: EvidenceTarget | null) => void
}

const Ctx = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [evidence, setEvidence] = useState<EvidenceTarget | null>(null)
  const value = useMemo<UIState>(() => ({ evidence, openEvidence: setEvidence }), [evidence])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useUI = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useUI outside provider')
  return c
}
