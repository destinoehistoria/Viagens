import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, NotebookPen, Plus } from 'lucide-react'
import { trips } from '../trips'
import { tripCover } from '../data/photos'
import { localDate, shortDate } from '../utils/dates'
import { PhotoView, SectionTitle } from '../components/ui'
import type { Trip } from '../types'

function status(t: Trip, today: string): { label: string; cls: string } {
  if (today < t.start) return { label: 'Próxima', cls: 'bg-gold text-navy' }
  if (today > t.end) return { label: 'Realizada', cls: 'bg-white/85 text-navy' }
  return { label: 'Acontecendo agora', cls: 'bg-petrol text-white' }
}

function TripCard({ trip, today, big = false }: { trip: Trip; today: string; big?: boolean }) {
  const st = status(trip, today)
  const bases = trip.cities.filter((c) => c.isBase)
  const cover = tripCover(trip.slug, trip.cover, bases[0]?.id)
  return (
    <Link
      to={`/v/${trip.slug}`}
      className={`surface group relative flex flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl ${big ? 'md:col-span-2 md:flex-row' : ''}`}
    >
      <div className={`relative ${big ? 'md:w-3/5' : ''}`}>
        <PhotoView photo={cover} title={trip.title} ratio={big ? 'aspect-[16/10] md:aspect-auto md:h-full' : 'aspect-[16/10]'} showCredit={false} eager={big} />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
      </div>
      <div className={`flex flex-1 flex-col p-5 ${big ? 'md:p-8' : ''}`}>
        <p className="text-2 text-xs font-semibold uppercase tracking-wider">
          <span aria-hidden>{trip.emoji}</span>
        </p>
        <h2 className={`mt-1 font-semibold leading-tight group-hover:text-[var(--accent-text)] ${big ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>{trip.title}</h2>
        <p className="text-2 mt-2">{trip.tagline}</p>
        <div className="text-2 mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-gold" aria-hidden /> {shortDate(trip.start)} a {shortDate(trip.end)}/{trip.end.slice(0, 4)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gold" aria-hidden /> {trip.cities.map((c) => c.name).join(' · ')}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function TripsPage() {
  const today = localDate(new Date(), 'America/Sao_Paulo')
  const upcoming = trips.filter((t) => t.end >= today).sort((a, b) => a.start.localeCompare(b.start))
  const past = trips.filter((t) => t.end < today)
  const [next, ...later] = upcoming

  return (
    <>
      <section className="twinkle-dots relative overflow-hidden bg-navy px-4 pb-16 pt-14 text-cream md:px-8 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Destino &amp; História</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] md:text-7xl">Nossas viagens</h1>
          <p className="mt-3 font-display text-2xl md:text-3xl">
            <span aria-hidden className="mr-2 text-gold">✦</span>André &amp; Ricardo
          </p>
          <p className="mt-5 max-w-2xl text-lg text-cream/85">
            Roteiros, mapas, reservas e o caderno de cada viagem, com o que planejamos e o que de fato vivemos.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-10 md:px-8">
        {upcoming.length > 0 && (
          <section>
            <SectionTitle eyebrow="Em breve" title={upcoming.length === 1 ? 'Próxima viagem' : 'Próximas viagens'} />
            <div className="grid gap-5 md:grid-cols-2">
              {next && <TripCard trip={next} today={today} big />}
              {later.map((t) => (
                <TripCard key={t.slug} trip={t} today={today} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <SectionTitle eyebrow="Memórias" title="Viagens realizadas">
              Abra uma viagem e registre no Caderno o que de fato aconteceu, com fotos.
            </SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((t) => (
                <TripCard key={t.slug} trip={t} today={today} />
              ))}
            </div>
          </section>
        )}

        <section className="surface flex flex-col gap-3 rounded-3xl p-6 md:flex-row md:items-center">
          <Plus className="h-8 w-8 shrink-0 text-gold" aria-hidden />
          <div className="flex-1">
            <p className="font-display text-2xl font-semibold">Nova viagem</p>
            <p className="text-2 text-sm">Mande o roteiro (PDF, texto, planilha) na conversa do projeto e ele vira uma nova viagem aqui, com mapa, dias e caderno.</p>
          </div>
          <NotebookPen className="hidden h-8 w-8 text-gold/60 md:block" aria-hidden />
        </section>
      </div>
    </>
  )
}
