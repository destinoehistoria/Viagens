import type { City, Hotel, Trip } from '../types'

/**
 * Fachada da viagem ativa. Os valores são `let` e são trocados por
 * `setActiveTrip` (src/data/active.ts) antes de renderizar as páginas da viagem;
 * por serem live bindings de ES modules, quem importa enxerga a viagem atual.
 */
export let cities: City[] = []
export let baseCities: City[] = []
export let cityById: Record<string, City> = {}
export let hotels: Hotel[] = []
export let hotelByCity: Partial<Record<string, Hotel>> = {}
export let TRIP_START = ''
export let TRIP_END = ''
export let TOTAL_NIGHTS = 0

export function _setCities(t: Trip) {
  cities = t.cities
  baseCities = cities.filter((c) => c.isBase)
  cityById = Object.fromEntries(cities.map((c) => [c.id, c]))
  hotels = t.hotels
  hotelByCity = Object.fromEntries(hotels.map((h) => [h.cityId, h]))
  TRIP_START = t.start
  TRIP_END = t.end
  TOTAL_NIGHTS = hotels.reduce((s, h) => s + h.nights, 0)
}
