import { useEffect, type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { tripBySlug } from '../trips'
import { setActiveTrip } from '../data/active'
import { useAuth } from '../lib/auth'
import { startSync } from '../lib/sync'

/** Ativa a viagem da URL (#/v/<slug>/…) antes de renderizar as páginas dela e liga a sincronização. */
export function TripRoute({ children }: { children: ReactNode }) {
  const { slug } = useParams()
  const trip = slug ? tripBySlug[slug] : undefined
  const { member } = useAuth()
  if (trip) setActiveTrip(trip)

  useEffect(() => {
    if (!trip) return
    document.title = `${trip.title} — Viagens de André & Ricardo`
    void startSync(member ? trip.slug : null)
  }, [trip, member])

  if (!trip) return <Navigate to="/" replace />
  return <>{children}</>
}
