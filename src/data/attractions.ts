import type { Attraction, Trip } from '../types'

/** Fachada da viagem ativa — ver src/data/cities.ts. */
export let attractions: Attraction[] = []
export let attractionById: Record<string, Attraction> = {}
export let futureIdeas: { name: string; reason: string }[] = []

export const attractionsByCity = (cityId: string) => attractions.filter((x) => x.cityId === cityId)

export const isLogistics = (x: Attraction) => x.category === 'hotel' || x.category === 'estacao' || x.category === 'aeroporto'

export function _setAttractions(t: Trip) {
  attractions = t.attractions
  attractionById = Object.fromEntries(attractions.map((x) => [x.id, x]))
  futureIdeas = t.futureIdeas ?? []
}
