import enrichment from './generated/enrichment.json'
import type { Attraction, LatLng, Photo } from '../types'
import { activeTrip } from './active'
import { attractionById } from './attractions'
import { cityById } from './cities'

interface EnrichedAttraction {
  coords?: LatLng
  coordsSource?: string
  photo?: Photo
}
interface EnrichedCity {
  hero?: Photo
  gallery?: Photo[]
}
interface TripEnrichment {
  generatedAt: string | null
  attractions: Record<string, EnrichedAttraction>
  cities: Record<string, EnrichedCity>
}

const all = (enrichment as unknown as { trips?: Record<string, TripEnrichment> }).trips ?? {}
const empty: TripEnrichment = { generatedAt: null, attractions: {}, cities: {} }
const data = () => (activeTrip && all[activeTrip.slug]) || empty

export function enrichmentDate(slug = activeTrip?.slug): string | null {
  return (slug && all[slug]?.generatedAt) || null
}

/** Resolve caminhos relativos de /public considerando o `base` do Vite. */
export function withBase(p: Photo): Photo {
  if (/^(https?:|data:|blob:)/.test(p.src)) return p
  return { ...p, src: import.meta.env.BASE_URL + p.src.replace(/^\//, '') }
}

export function attractionPhoto(id: string): Photo | undefined {
  const p = attractionById[id]?.photo ?? data().attractions[id]?.photo
  return p ? withBase(p) : undefined
}

export function cityHero(cityId: string): Photo | undefined {
  const p = cityById[cityId]?.hero ?? data().cities[cityId]?.hero
  return p ? withBase(p) : undefined
}

export function cityGallery(cityId: string): Photo[] {
  return [...(cityById[cityId]?.gallery ?? []), ...(data().cities[cityId]?.gallery ?? [])].map(withBase)
}

/** Capa de uma viagem (para a lista de viagens), mesmo sem ela estar ativa. */
export function tripCover(slug: string, cover?: Photo, firstCityId?: string): Photo | undefined {
  const p = cover ?? (firstCityId ? all[slug]?.cities[firstCityId]?.hero : undefined) ?? Object.values(all[slug]?.cities ?? {}).find((c) => c.hero)?.hero
  return p ? withBase(p) : undefined
}

/** Coordenadas: verificadas (Wikipédia) quando disponíveis, senão aproximadas do cadastro. */
export function attractionCoords(a: Attraction): { coords?: LatLng; verified: boolean; source?: string } {
  const e = data().attractions[a.id]
  if (e?.coords) return { coords: e.coords, verified: true, source: e.coordsSource }
  return { coords: a.coords, verified: false }
}
