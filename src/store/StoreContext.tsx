import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Collection, Store } from '@/data/model'
import { SEED_STORE } from '@/data/seed'

/**
 * Local persistence for the prototype.
 * LIMITATIONS: data lives in this browser's localStorage only — no sync, no auth, no history.
 * Clearing site data or switching browsers loses edits. Use Export JSON to keep a copy.
 */
const KEY = 'canopy-mti-store-v1'

type WithId = { id: string }

interface StoreApi {
  data: Store
  seeded: boolean
  lastSaved: string | null
  upsert: <C extends Collection>(collection: C, record: Store[C][number]) => void
  remove: (collection: Collection, id: string) => void
  toggleShortlist: (solutionId: string) => void
  resetToSeed: () => void
  exportJson: () => string
  importJson: (text: string) => { ok: boolean; error?: string }
  get: <C extends Collection>(collection: C, id: string | undefined | null) => Store[C][number] | undefined
}

const Ctx = createContext<StoreApi | null>(null)

function load(): { data: Store; seeded: boolean } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Store
      if (parsed && parsed.version === SEED_STORE.version) {
        // Merge in any seed records added since the user's copy was saved, without
        // touching records they have edited (matched by id).
        const merged = { ...parsed } as Store
        ;(Object.keys(SEED_STORE) as (keyof Store)[]).forEach((k) => {
          if (k === 'version' || k === 'shortlist') return
          const seedList = SEED_STORE[k] as WithId[]
          const userList = (merged[k] as WithId[]) ?? []
          const ids = new Set(userList.map((r) => r.id))
          ;(merged[k] as WithId[]) = [...userList, ...seedList.filter((r) => !ids.has(r.id))]
        })
        return { data: merged, seeded: false }
      }
    }
  } catch {
    /* fall through */
  }
  return { data: structuredClone(SEED_STORE), seeded: true }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const initial = useRef(load())
  const [data, setData] = useState<Store>(initial.current.data)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
      setLastSaved(new Date().toISOString())
    } catch {
      /* storage unavailable */
    }
  }, [data])

  const upsert = useCallback(<C extends Collection>(collection: C, record: Store[C][number]) => {
    setData((d) => {
      const list = d[collection] as WithId[]
      const idx = list.findIndex((r) => r.id === (record as WithId).id)
      const next = idx >= 0 ? list.map((r, i) => (i === idx ? record : r)) : [...list, record]
      return { ...d, [collection]: next }
    })
  }, [])

  const remove = useCallback((collection: Collection, id: string) => {
    setData((d) => ({ ...d, [collection]: (d[collection] as WithId[]).filter((r) => r.id !== id) }))
  }, [])

  const toggleShortlist = useCallback((id: string) => {
    setData((d) => ({ ...d, shortlist: d.shortlist.includes(id) ? d.shortlist.filter((x) => x !== id) : [...d.shortlist, id] }))
  }, [])

  const api = useMemo<StoreApi>(
    () => ({
      data,
      seeded: initial.current.seeded,
      lastSaved,
      upsert,
      remove,
      toggleShortlist,
      resetToSeed: () => setData(structuredClone(SEED_STORE)),
      exportJson: () => JSON.stringify(data, null, 2),
      importJson: (text) => {
        try {
          const parsed = JSON.parse(text) as Partial<Store>
          const required: Collection[] = ['sources', 'quantities', 'companies', 'products', 'facilities', 'origins', 'relationships', 'solutions', 'scenarios']
          for (const c of required) if (!Array.isArray(parsed[c])) return { ok: false, error: `Missing collection "${c}"` }
          setData({ ...structuredClone(SEED_STORE), ...parsed, version: SEED_STORE.version } as Store)
          return { ok: true }
        } catch (e) {
          return { ok: false, error: (e as Error).message }
        }
      },
      get: (collection, id) => (id ? (data[collection] as WithId[]).find((r) => r.id === id) : undefined) as never,
    }),
    [data, lastSaved, upsert, remove, toggleShortlist],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore outside StoreProvider')
  return c
}
