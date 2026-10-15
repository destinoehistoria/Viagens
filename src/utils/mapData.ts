import { tripHref } from '../components/TripLink'
import { attractions } from '../data/attractions'
import { cities, hotels } from '../data/cities'
import { transport, extraPlaces } from '../data/logistics'
import { attractionCoords, attractionPhoto } from '../data/photos'
import { categoryMeta } from '../components/categories'
import type { MapLine, MapPoint } from '../components/MapView'
import type { Attraction, CityId } from '../types'

export function attractionPoint(a: Attraction): MapPoint | null {
  const { coords, verified } = attractionCoords(a)
  if (!coords) return null
  const cat = categoryMeta[a.category]
  return {
    id: a.id,
    lat: coords.lat,
    lng: coords.lng,
    title: a.name,
    subtitle: cat.label,
    description: a.description.length > 140 ? a.description.slice(0, 137) + '…' : a.description,
    emoji: cat.emoji,
    color: cat.color,
    photo: attractionPhoto(a.id),
    approx: !verified,
    link: a.category === 'estacao' || a.category === 'aeroporto' || a.category === 'hotel' ? undefined : { href: tripHref(`/cidades/${a.cityId}#atracao-${a.id}`), label: 'Ver ficha' },
  }
}

export function cityPoints(): MapPoint[] {
  const bases = cities.filter((c) => c.isBase)
  return cities.map((c) => ({
    id: `cidade-${c.id}`,
    lat: c.coords.lat,
    lng: c.coords.lng,
    title: `${c.flag} ${c.name}`,
    subtitle: c.isBase ? `${c.nights} noites` : 'Bate-volta',
    description: c.tagline,
    kind: 'city' as const,
    label: c.isBase ? String(bases.indexOf(c) + 1) : c.name.charAt(0).toUpperCase(),
    link: { href: tripHref(`/cidades/${c.id}`), label: 'Abrir cidade' },
  }))
}

const placeCoords = (id: string | undefined): [number, number] | null => {
  if (!id) return null
  if (extraPlaces[id]) return [extraPlaces[id].lat, extraPlaces[id].lng]
  const c = cities.find((x) => x.id === id)
  return c ? [c.coords.lat, c.coords.lng] : null
}

/**
 * Linhas da sequência da viagem. SÃO ESQUEMÁTICAS: ligam os centros das cidades
 * e não representam o traçado real de ferrovias ou rotas aéreas.
 */
export function tripLines(includeIntercontinental = false): MapLine[] {
  return transport
    .filter((t) => t.toCity && t.fromCity)
    .filter((t) => includeIntercontinental || (!extraPlaces[t.fromCity!] && !extraPlaces[t.toCity!]))
    .map((t) => {
      const a = placeCoords(t.fromCity)
      const b = placeCoords(t.toCity)
      if (!a || !b) return null
      const plane = t.mode === 'aviao'
      return {
        id: t.id,
        points: [a, b],
        color: plane ? '#C6A56B' : t.status === 'pendente' ? '#B45309' : '#176B65',
        dash: plane ? '2 8' : t.status === 'pendente' ? '8 8' : '10 6',
        label: `${({ aviao: '✈︎ Voo', trem: '🚆 Trem', onibus: '🚌 Ônibus', carro: '🚗 Carro', barco: '⛴️ Barco', local: '🚶 Local' } as const)[t.mode]} ${t.from} → ${t.to} (${t.status}) — linha esquemática, não é o traçado real`,
      }
    })
    .filter(Boolean) as MapLine[]
}

export function hotelPoints(): MapPoint[] {
  return hotels
    .filter((h) => h.coords)
    .map((h) => ({
      id: `hotel-${h.cityId}`,
      lat: h.coords!.lat,
      lng: h.coords!.lng,
      title: h.name,
      subtitle: `Hotel · ${h.nights} noites`,
      description: h.address,
      emoji: categoryMeta.hotel.emoji,
      color: categoryMeta.hotel.color,
      approx: true,
    }))
}

export function attractionsForMap(cityId?: CityId) {
  return attractions.filter((a) => (cityId ? a.cityId === cityId : true) && a.category !== 'hotel')
}
