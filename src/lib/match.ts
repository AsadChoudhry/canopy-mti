import type { Product, Solution, Store } from '@/data/model'

/**
 * Match EcoPaper listings to a traced product by grade, geography and evidence.
 * Works on any listing in the store, so a full EcoPaper import slots straight in.
 */

const GRADE_KEYWORDS: { test: RegExp; fits: RegExp; label: string }[] = [
  { test: /containerboard|corrugat|liner|fluting/i, fits: /corrugat|box|shipping|packag/i, label: 'corrugated and boxes' },
  { test: /boxboard|fbb|carton|folding/i, fits: /box|carton|card|packag|point of sale/i, label: 'cartons and boxes' },
  { test: /kraft|sack|bag/i, fits: /bag|sack|wrap|packag/i, label: 'bags and wraps' },
  { test: /food|cup|service/i, fits: /food|cup|tray|packag/i, label: 'food service' },
]

const EUROPE = /austria|belgium|czech|denmark|estonia|finland|france|germany|ireland|italy|latvia|lithuania|netherlands|norway|poland|portugal|slovakia|spain|sweden|uk|united kingdom|europe/i

export interface MatchResult {
  s: Solution
  score: number
  reasons: { ok: boolean; text: string }[]
  missing: string[]
}

export function productRegion(p: Product, store: Store) {
  const mill = store.facilities.find((f) => f.id === p.millFacilityId)
  return mill?.country ?? p.productionRegion?.text ?? ''
}

export function matchListings(p: Product, store: Store): MatchResult[] {
  const gradeText = `${p.application} ${p.category ?? ''} ${p.name}`
  const grade = GRADE_KEYWORDS.find((g) => g.test.test(gradeText))
  const where = productRegion(p, store)
  const inEurope = EUROPE.test(where)

  return store.solutions
    .filter((s) => s.directory === 'EcoPaper')
    .map((s) => {
      const reasons: MatchResult['reasons'] = []
      let score = 0
      const apps = s.applications.join(' ')
      const gradeFit = grade ? grade.fits.test(apps) : /packag|box/i.test(apps)
      if (gradeFit) score += 3
      reasons.push({ ok: gradeFit, text: gradeFit ? `Grade fits ${grade?.label ?? 'packaging'}` : 'Grade not matched' })

      let geoFit = false
      if (s.geography === 'global') geoFit = true
      else if (Array.isArray(s.geography)) geoFit = s.geography.some((g) => (inEurope ? EUROPE.test(g) : where.toLowerCase().includes(g.toLowerCase())))
      if (geoFit) score += 2
      reasons.push({ ok: geoFit, text: geoFit ? `Supplies ${s.geography === 'global' ? 'globally' : where || 'the region'}` : `No supply listed near ${where || 'unknown region'}` })

      const ev = s.status === 'verified' ? 2 : s.status === 'listing_supplied' ? 1 : 0
      score += ev
      reasons.push({ ok: ev > 0, text: s.status === 'verified' ? 'Verified listing' : s.status === 'listing_supplied' ? 'Listing supplied, not checked' : 'Illustrative category' })

      if (s.capacity) score += 1
      const missing = [!s.capacity && 'capacity', 'minimum order', 'recycled or Next Gen %', 'certification', s.geography === 'unknown' && 'geography'].filter(Boolean) as string[]
      return { s, score, reasons, missing }
    })
    .sort((a, b) => b.score - a.score)
}

/** Fields a structured EcoPaper record needs, and how many loaded listings have them. */
export function fieldCoverage(store: Store) {
  const list = store.solutions.filter((s) => s.directory === 'EcoPaper' && s.status !== 'illustrative')
  const has = (f: (s: Solution) => boolean) => list.filter(f).length
  return {
    n: list.length,
    rows: [
      { field: 'Grade / application', have: has((s) => s.applications.length > 0) },
      { field: 'Feedstock and fibre content', have: has((s) => /\d+%/.test(s.feedstock)) },
      { field: 'Geography', have: has((s) => s.geography !== 'unknown') },
      { field: 'Capacity, t a year', have: has((s) => !!s.capacity) },
      { field: 'Minimum order', have: 0 },
      { field: 'Certification', have: 0 },
    ],
  }
}
