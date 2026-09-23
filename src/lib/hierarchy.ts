import type { Evidence, MaterialGrouping, MaterialShare, MaterialStream, CoverageScore } from '@/data/types'
import { HM_STREAMS, HM_EVIDENCE, HM_PATHWAYS, HM_DATA_GAPS } from '@/data/hm'

export interface SelectedMaterial {
  kind: 'material' | 'grouping'
  id: string
  name: string
  sharePct: number // of stream
  shareOfTotalPct: number
  derivedTonnes: Evidence
  forestLinked: boolean
  colour: string
  pathwayId?: string
  traceability?: CoverageScore
  focus?: boolean
  notes?: string
  grouping?: MaterialGrouping
  material?: MaterialShare
  stream: MaterialStream
}

export const TOTAL = HM_EVIDENCE.total_tracked

export function getStream(id?: string | null) {
  return HM_STREAMS.find((s) => s.id === id) ?? null
}

export function resolveMaterial(stream: MaterialStream | null, id?: string | null): SelectedMaterial | null {
  if (!stream || !id) return null
  const g = stream.groupings?.find((x) => x.id === id)
  if (g) {
    return {
      kind: 'grouping',
      id: g.id,
      name: g.name,
      sharePct: g.sharePct,
      shareOfTotalPct: (stream.shareOfTotalPct * g.sharePct) / 100,
      derivedTonnes: g.derivedTonnes,
      forestLinked: g.forestLinked,
      colour: g.colour,
      pathwayId: g.pathwayId,
      traceability: g.traceability,
      focus: g.focus,
      grouping: g,
      stream,
    }
  }
  const m = stream.materials.find((x) => x.id === id)
  if (!m) return null
  return {
    kind: 'material',
    id: m.id,
    name: m.name,
    sharePct: m.sharePct,
    shareOfTotalPct: (stream.shareOfTotalPct * m.sharePct) / 100,
    derivedTonnes: m.derivedTonnes,
    forestLinked: m.forestLinked,
    colour: m.colour,
    pathwayId: m.pathwayId,
    traceability: m.traceability,
    focus: m.focus,
    notes: m.notes,
    material: m,
    stream,
  }
}

export function pathwayFor(sel: SelectedMaterial | null) {
  return sel?.pathwayId ? HM_PATHWAYS[sel.pathwayId] : null
}

export function alternativePathwaysFor(sel: SelectedMaterial | null) {
  const p = pathwayFor(sel)
  return (p?.alternativePathwayIds ?? []).map((id) => HM_PATHWAYS[id]).filter(Boolean)
}

export function gapsFor(ids: string[]) {
  return HM_DATA_GAPS.filter((g) => g.relatedMaterialIds.some((r) => ids.includes(r)))
}

/** Grouping that a member material belongs to (e.g. paper → paper_cardboard). */
export function groupingOf(stream: MaterialStream | null, materialId: string) {
  return stream?.groupings?.find((g) => g.memberIds.includes(materialId)) ?? null
}
