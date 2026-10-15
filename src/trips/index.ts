import type { Trip } from '../types'

/**
 * Todas as viagens do app. Para incluir uma nova, crie src/trips/<slug>/index.ts
 * exportando `trip` e acrescente aqui.
 */
const modules = import.meta.glob<{ trip: Trip }>('./*/index.ts', { eager: true })

export const trips: Trip[] = Object.values(modules)
  .map((m) => m.trip)
  .sort((a, b) => b.start.localeCompare(a.start))

export const tripBySlug: Record<string, Trip> = Object.fromEntries(trips.map((t) => [t.slug, t]))
