import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet'
import L, { type LatLngExpression, type LatLngBoundsExpression } from 'leaflet'
import type { Photo } from '../types'
import { directionsUrl } from '../utils/download'

export interface MapPoint {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  description?: string
  emoji?: string
  color?: string
  kind?: 'city' | 'poi'
  label?: string
  photo?: Photo
  approx?: boolean
  link?: { href: string; label: string }
}

export interface MapLine {
  id: string
  points: [number, number][]
  color: string
  dash?: string
  label: string
  weight?: number
}

const iconCache = new Map<string, L.DivIcon>()
function poiIcon(emoji: string, color: string) {
  const key = emoji + color
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      L.divIcon({
        className: '',
        html: `<div class="map-pin" style="background:${color}"><span>${emoji}</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
      }),
    )
  }
  return iconCache.get(key)!
}
function cityIcon(label: string) {
  return L.divIcon({ className: '', html: `<div class="map-city">${label}</div>`, iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -16] })
}

function FitTo({ bounds, center, zoom }: { bounds?: LatLngBoundsExpression; center?: LatLngExpression; zoom?: number }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.8 })
    else if (bounds) map.fitBounds(bounds, { padding: [30, 30] })
  }, [map, bounds, center, zoom])
  return null
}

export default function MapView({
  points,
  lines = [],
  center,
  zoom = 13,
  height = 'h-[420px]',
  focus,
  fitPoints = false,
  initialBounds,
}: {
  points: MapPoint[]
  lines?: MapLine[]
  center: [number, number]
  zoom?: number
  height?: string
  focus?: { center: [number, number]; zoom: number }
  fitPoints?: boolean
  /** Enquadramento inicial (ex.: todas as cidades), usado quando não há foco. */
  initialBounds?: [number, number][]
}) {
  const fitted = fitPoints && points.length > 1 ? (points.map((p) => [p.lat, p.lng]) as [number, number][]) : initialBounds
  // Leaflet recusa enquadrar menos de dois pontos ("Bounds are not valid").
  const rawBounds = fitted && fitted.length > 1 ? fitted : undefined
  const boundsKey = JSON.stringify(rawBounds ?? null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bounds: LatLngBoundsExpression | undefined = useMemo(() => rawBounds, [boundsKey])

  return (
    <div className={`${height} w-full overflow-hidden rounded-2xl border border-line`}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full" attributionControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitTo bounds={focus ? undefined : bounds} center={focus?.center} zoom={focus?.zoom} />
        {lines.map((l) => (
          <Polyline key={l.id} positions={l.points} pathOptions={{ color: l.color, weight: l.weight ?? 3, dashArray: l.dash, opacity: 0.85 }}>
            <Tooltip sticky>{l.label}</Tooltip>
          </Polyline>
        ))}
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={p.kind === 'city' ? cityIcon(p.label ?? p.title.slice(0, 2)) : poiIcon(p.emoji ?? '📍', p.color ?? '#176B65')}
            title={p.title}
            alt={p.title}
            zIndexOffset={p.kind === 'city' ? 1000 : 0}
          >
            <Popup maxWidth={260}>
              <div className="w-56">
                {p.photo && <img src={p.photo.src} alt={p.photo.alt} loading="lazy" className="mb-2 h-28 w-full rounded-lg object-cover" />}
                <strong className="block text-base leading-tight">{p.title}</strong>
                {p.subtitle && <span className="block text-xs opacity-70">{p.subtitle}</span>}
                {p.description && <span className="mt-1 block text-xs leading-snug">{p.description}</span>}
                {p.approx && <span className="mt-1 block text-[10px] italic opacity-70">Posição aproximada.</span>}
                <span className="mt-2 flex flex-wrap gap-2 text-xs">
                  <a href={directionsUrl(p.lat, p.lng)} target="_blank" rel="noopener noreferrer">
                    Navegar (Google Maps)
                  </a>
                  {p.link && <a href={p.link.href}>{p.link.label}</a>}
                </span>
                {p.photo?.author && <span className="mt-1 block text-[9px] opacity-60">Foto: {p.photo.author} · {p.photo.license}</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
