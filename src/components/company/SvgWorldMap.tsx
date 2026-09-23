import { useMemo, useRef, useState } from 'react'
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { FeatureCollection, Geometry } from 'geojson'
import world from 'world-atlas/countries-110m.json'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { MapMarker } from './WorldMap'
import { cn } from '@/lib/cn'

const topo = world as unknown as Topology<{ countries: GeometryCollection }>
const COUNTRIES = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>

/** ISO numeric ids → names we highlight. */
export const COUNTRY_IDS: Record<string, string> = {
  China: '156',
  Bangladesh: '050',
  India: '356',
  USA: '840',
  Vietnam: '704',
  Sweden: '752',
}

export interface MapBubble {
  id: string
  m49: string
  label: string
  sublabel?: string
  radius: number
  colour: string
  showLabel?: boolean
  dashed?: boolean
}

export function countryCentroid(m49: string): [number, number] | null {
  const f = COUNTRIES.features.find((x) => String(x.id) === m49.padStart(3, '0'))
  return f ? (geoCentroid(f) as [number, number]) : null
}

const W = 960
const H = 470
const MIN_K = 1
const MAX_K = 14

export function SvgWorldMap({
  markers,
  bubbles = [],
  highlight = {},
  highlightById = {},
  className,
  onMarkerClick,
  onBubbleClick,
  showLabels = true,
  landColour = '#d9dde3',
  fitToIds,
  zoomable = false,
  selectedId,
}: {
  markers: MapMarker[]
  bubbles?: MapBubble[]
  highlight?: Record<string, string>
  highlightById?: Record<string, string>
  className?: string
  onMarkerClick?: (m: MapMarker) => void
  onBubbleClick?: (b: MapBubble) => void
  showLabels?: boolean
  landColour?: string
  fitToIds?: string[]
  /** Scroll to zoom, drag to pan, buttons to step. */
  zoomable?: boolean
  selectedId?: string | null
}) {
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const { path, projection } = useMemo(() => {
    const projection = geoNaturalEarth1()
    const ids = (fitToIds ?? []).map((i) => i.padStart(3, '0'))
    const feats = ids.length ? COUNTRIES.features.filter((f) => ids.includes(String(f.id))) : []
    if (feats.length) {
      projection.fitExtent(
        [
          [40, 34],
          [W - 40, H - 34],
        ],
        { type: 'FeatureCollection', features: feats } as never,
      )
    } else {
      projection.fitExtent(
        [
          [4, 4],
          [W - 4, H - 4],
        ],
        { type: 'Sphere' },
      )
    }
    return { path: geoPath(projection), projection }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fitToIds)])

  const hl: Record<string, string> = {
    ...Object.fromEntries(Object.entries(highlight).map(([name, colour]) => [COUNTRY_IDS[name], colour]).filter(([id]) => id)),
    ...Object.fromEntries(Object.entries(highlightById).map(([id, c]) => [id.padStart(3, '0'), c])),
  }

  const clamp = (v: { k: number; x: number; y: number }) => {
    const k = Math.min(MAX_K, Math.max(MIN_K, v.k))
    const maxX = (W * (k - 1)) / 2
    const maxY = (H * (k - 1)) / 2
    return { k, x: Math.min(maxX, Math.max(-maxX, v.x)), y: Math.min(maxY, Math.max(-maxY, v.y)) }
  }

  const zoomAt = (factor: number, cx = W / 2, cy = H / 2) => {
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor))
      const scale = k / v.k
      // keep the point under the cursor fixed
      return clamp({ k, x: cx - (cx - v.x) * scale, y: cy - (cy - v.y) * scale })
    })
  }

  const toSvg = (e: React.MouseEvent | React.WheelEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return { x: W / 2, y: H / 2 }
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H }
  }

  const k = view.k
  const labelScale = 1 / Math.sqrt(k)

  return (
    <div className={cn('relative w-full h-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={cn('w-full h-full select-none', zoomable && (drag.current ? 'cursor-grabbing' : 'cursor-grab'))}
        preserveAspectRatio="xMidYMid meet"
        onWheel={
          zoomable
            ? (e) => {
                // Only hijack the wheel when a modifier is held, so the page still scrolls normally.
                if (!e.ctrlKey && !e.metaKey) return
                e.preventDefault()
                const p = toSvg(e)
                zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, p.x, p.y)
              }
            : undefined
        }
        onDoubleClick={zoomable ? (e) => { const p = toSvg(e); zoomAt(1.6, p.x, p.y) } : undefined}
        onMouseDown={
          zoomable
            ? (e) => {
                const p = toSvg(e)
                drag.current = { x: p.x, y: p.y, vx: view.x, vy: view.y }
              }
            : undefined
        }
        onMouseMove={
          zoomable
            ? (e) => {
                if (!drag.current) return
                const p = toSvg(e)
                setView((v) => clamp({ k: v.k, x: drag.current!.vx + (p.x - drag.current!.x), y: drag.current!.vy + (p.y - drag.current!.y) }))
              }
            : undefined
        }
        onMouseUp={() => (drag.current = null)}
        onMouseLeave={() => (drag.current = null)}
      >
        <rect width={W} height={H} fill="#ffffff" />
        <g transform={`translate(${view.x},${view.y}) scale(${k})`}>
          {COUNTRIES.features.map((f) => {
            const id = String(f.id)
            const fill = hl[id] ?? landColour
            const isSel = selectedId && id === selectedId.padStart(3, '0')
            return (
              <path
                key={id}
                d={path(f) ?? ''}
                fill={fill}
                stroke={isSel ? '#6a47ea' : '#ffffff'}
                strokeWidth={(isSel ? 1.6 : 0.6) / k}
                className={onBubbleClick ? 'transition-[fill]' : undefined}
              />
            )
          })}

          {bubbles.map((b) => {
            const c = countryCentroid(b.m49)
            const pt = c ? projection(c) : null
            if (!pt) return null
            const [x, y] = pt
            const sel = selectedId === b.m49
            return (
              <g
                key={b.id}
                transform={`translate(${x},${y})`}
                className={onBubbleClick ? 'cursor-pointer' : ''}
                onClick={(e) => {
                  e.stopPropagation()
                  onBubbleClick?.(b)
                }}
              >
                <title>{[b.label, b.sublabel].filter(Boolean).join(' — ')}</title>
                <circle
                  r={b.radius / Math.sqrt(k)}
                  fill={b.colour}
                  fillOpacity={b.dashed ? 0.15 : sel ? 0.85 : 0.55}
                  stroke={sel ? '#282727' : b.colour}
                  strokeWidth={(b.dashed ? 2 : sel ? 2.5 : 1.5) / k}
                  strokeDasharray={b.dashed ? `${4 / k} ${3 / k}` : undefined}
                />
                <circle r={Math.min(4, b.radius) / Math.sqrt(k)} fill={b.colour} />
                {(b.showLabel || sel) && (
                  <text
                    y={-(b.radius / Math.sqrt(k) + 6 / k)}
                    textAnchor="middle"
                    fontSize={13 * labelScale}
                    fontWeight={600}
                    fill="#282727"
                    stroke="#fff"
                    strokeWidth={3 * labelScale}
                    paintOrder="stroke"
                    style={{ fontFamily: 'Inter, sans-serif', pointerEvents: 'none' }}
                  >
                    {b.label}
                  </text>
                )}
              </g>
            )
          })}

          {markers.map((m) => {
            const pt = projection([m.lng, m.lat])
            if (!pt) return null
            const [x, y] = pt
            const r = (m.kind === 'major' ? 13 : m.kind === 'region' ? 22 : m.kind === 'hq' ? 6 : 8) / Math.sqrt(k)
            return (
              <g key={m.id} transform={`translate(${x},${y})`} className={onMarkerClick ? 'cursor-pointer' : ''} onClick={() => onMarkerClick?.(m)}>
                <title>{[m.label, m.sublabel, m.note].filter(Boolean).join(' — ')}</title>
                {m.overlap && <circle r={r + 8 / k} fill="#00c1c6" opacity={0.45} />}
                {m.kind === 'region' ? (
                  <circle r={r} fill={m.colour} fillOpacity={0.12} stroke={m.colour} strokeWidth={2 / k} strokeDasharray={`${4 / k} ${3 / k}`} />
                ) : m.kind === 'alt' ? (
                  <rect x={-r} y={-r} width={r * 2} height={r * 2} transform="rotate(45)" fill={m.colour} stroke="#fff" strokeWidth={2 / k} />
                ) : (
                  <circle r={r} fill={m.colour} stroke="#fff" strokeWidth={2.5 / k} />
                )}
                {showLabels && (
                  <text
                    y={m.kind === 'alt' ? -(r + 6 / k) : r + 14 / k}
                    textAnchor="middle"
                    fontSize={13 * labelScale}
                    fontWeight={600}
                    fill="#282727"
                    stroke="#fff"
                    strokeWidth={3 * labelScale}
                    paintOrder="stroke"
                    style={{ fontFamily: 'Inter, sans-serif', pointerEvents: 'none' }}
                  >
                    {m.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {zoomable && (
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button onClick={() => zoomAt(1.5)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:border-brand-400" title="Zoom in">
            <Plus size={14} />
          </button>
          <button onClick={() => zoomAt(1 / 1.5)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:border-brand-400" title="Zoom out">
            <Minus size={14} />
          </button>
          <button onClick={() => setView({ k: 1, x: 0, y: 0 })} className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:border-brand-400" title="Reset view">
            <RotateCcw size={12} />
          </button>
        </div>
      )}
      {zoomable && k > 1.05 && (
        <div className="absolute bottom-2 left-2 rounded-md bg-white/90 border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{k.toFixed(1)}×</div>
      )}
    </div>
  )
}
