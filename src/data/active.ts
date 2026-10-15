import type { Trip } from '../types'
import { _setCities } from './cities'
import { _setAttractions } from './attractions'
import { _setItinerary } from './itinerary'
import { _setLogistics } from './logistics'

export let activeTrip: Trip | null = null

/** Troca a viagem cujos dados as páginas leem. Chamada pelo TripRoute antes de renderizar. */
export function setActiveTrip(t: Trip | null) {
  if (activeTrip === t) return
  if (!t) {
    activeTrip = null
    return
  }
  activeTrip = t
  _setCities(t)
  _setAttractions(t)
  _setItinerary(t)
  _setLogistics(t)
}

export function requireTrip(): Trip {
  if (!activeTrip) throw new Error('Nenhuma viagem ativa.')
  return activeTrip
}
