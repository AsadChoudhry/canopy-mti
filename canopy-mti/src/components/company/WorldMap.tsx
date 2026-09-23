import { useEffect, useRef, useState } from 'react'
import { Map as MLMap, Marker, NavigationControl } from 'maplibre-gl'
import { cn } from '@/lib/cn'
import { SvgWorldMap } from './SvgWorldMap'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  label: string
  sublabel?: string
  colour: string
  kind: 'major' | 'region' | 'hq' | 'alt'
  overlap?: boolean
  note?: string
}

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'
const LOAD_TIMEOUT_MS = 7000

function markerEl(m: MapMarker, onClick?: (m: MapMarker) => void) {
  const el = document.createElement('div')
  el.className = 'cursor-pointer select-none'
  const size = m.kind === 'major' ? 30 : m.kind === 'region' ? 48 : m.kind === 'hq' ? 14 : 18
  const dot = document.createElement('div')
  dot.style.width = `${size}px`
  dot.style.height = `${size}px`
  dot.style.borderRadius = m.kind === 'alt' ? '4px' : '50%'
  dot.style.transform = m.kind === 'alt' ? 'rotate(45deg)' : ''
  dot.style.margin = '0 auto'
  if (m.kind === 'region') {
    dot.style.border = `2px dashed ${m.colour}`
    dot.style.background = `${m.colour}18`
  } else {
    dot.style.background = m.colour
    dot.style.boxShadow = `0 0 0 4px ${m.colour}33, 0 2px 6px rgba(0,0,0,0.2)`
    dot.style.border = '2px solid #fff'
  }
  if (m.overlap) dot.style.boxShadow = `0 0 0 4px #00c1c6, 0 0 0 8px #00c1c655, 0 2px 6px rgba(0,0,0,0.2)`
  const label = document.createElement('div')
  label.textContent = m.label
  label.style.cssText =
    'font: 600 11px Inter, sans-serif; color:#171b20; background:rgba(255,255,255,0.9); padding:1px 6px; border-radius:6px; margin-top:4px; white-space:nowrap; text-align:center; box-shadow:0 1px 2px rgba(0,0,0,0.1)'
  el.appendChild(dot)
  el.appendChild(label)
  el.title = [m.sublabel, m.note].filter(Boolean).join(' — ')
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    onClick?.(m)
  })
  return el
}

/**
 * Real basemap (MapLibre + OpenFreeMap vector tiles) with an SVG world map as the
 * always-available fallback. If tiles cannot load (offline, blocked), the SVG stays.
 */
export function WorldMap({
  markers,
  className,
  height = 320,
  onMarkerClick,
  interactive = true,
  center = [40, 25],
  zoom = 1.1,
  highlight,
  basemap = 'auto',
  showLabels = true,
}: {
  markers: MapMarker[]
  className?: string
  height?: number | string
  onMarkerClick?: (m: MapMarker) => void
  interactive?: boolean
  center?: [number, number]
  zoom?: number
  highlight?: Record<string, string>
  basemap?: 'auto' | 'svg'
  showLabels?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const markerRefs = useRef<Marker[]>([])
  const onClickRef = useRef(onMarkerClick)
  onClickRef.current = onMarkerClick
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>(basemap === 'svg' ? 'failed' : 'loading')

  useEffect(() => {
    if (basemap === 'svg' || !ref.current || mapRef.current) return
    const map = new MLMap({
      container: ref.current,
      style: STYLE_URL,
      center,
      zoom,
      interactive,
      attributionControl: { compact: true },
      renderWorldCopies: false,
    })
    if (interactive) map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    const timer = window.setTimeout(() => setStatus((s) => (s === 'loading' ? 'failed' : s)), LOAD_TIMEOUT_MS)
    map.once('idle', () => {
      window.clearTimeout(timer)
      setStatus('ready')
    })
    map.on('error', () => {
      /* keep SVG fallback */
    })
    mapRef.current = map
    if (import.meta.env.DEV) ((window as unknown as { __maps: MLMap[] }).__maps ??= []).push(map)
    return () => {
      window.clearTimeout(timer)
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markerRefs.current.forEach((m) => m.remove())
    markerRefs.current = markers.map((m) => new Marker({ element: markerEl(m, (mm) => onClickRef.current?.(mm)), anchor: 'center' }).setLngLat([m.lng, m.lat]).addTo(map))
  }, [markers])

  const showSvg = status !== 'ready'
  return (
    <div className={cn('relative rounded-xl overflow-hidden bg-[#eef3f6] border border-slate-200', className)} style={{ height }}>
      {showSvg && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SvgWorldMap markers={markers} highlight={highlight} onMarkerClick={onMarkerClick} showLabels={showLabels} />
        </div>
      )}
      {basemap !== 'svg' && <div ref={ref} className={cn('w-full h-full transition-opacity duration-500', showSvg ? 'opacity-0 pointer-events-none' : 'opacity-100')} />}
      {status === 'failed' && basemap !== 'svg' && (
        <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 bg-white/80 rounded px-1.5 py-0.5">Basemap tiles unavailable — showing schematic map</div>
      )}
    </div>
  )
}
