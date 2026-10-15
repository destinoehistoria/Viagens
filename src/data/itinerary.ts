import type { Trip, TripDay } from '../types'

/** Fachada da viagem ativa — ver src/data/cities.ts. */
export let itinerary: TripDay[] = []
export let dayByDate: Record<string, TripDay> = {}

export function _setItinerary(t: Trip) {
  itinerary = t.days
  dayByDate = Object.fromEntries(itinerary.map((d) => [d.date, d]))
}
