import { useParams } from 'react-router-dom'
import { Link, Navigate } from '../components/TripLink'
import { itinerary, dayByDate } from '../data/itinerary'
import { cityById } from '../data/cities'
import { shortDate, weekdayShort, tripPhase } from '../utils/dates'
import { DayView } from '../components/DayView'
import { PageHeader } from '../components/ui'
import { useNow } from '../hooks/useMisc'

export function ItineraryPage() {
  const { date } = useParams()
  const now = useNow()
  const phase = tripPhase(now)
  if (date && !dayByDate[date]) return <Navigate to="/roteiro" replace />

  return (
    <>
      <PageHeader eyebrow="Roteiro diário" title={`${itinerary.length} dias, dia a dia`}>
        Programação cronológica completa. Cada item mostra se está <strong>confirmado</strong>, <strong>planejado</strong>, é <strong>opcional</strong> ou ainda
        está <strong>pendente</strong>.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <nav aria-label="Dias da viagem" className="-mx-4 mb-8 overflow-x-auto px-4 pb-2">
          <ol className="flex gap-2">
            {itinerary.map((d) => {
              const active = date === d.date
              const today = phase.phase === 'durante' && phase.day.date === d.date
              const city = d.cityId === 'voo' ? null : cityById[d.cityId]
              return (
                <li key={d.date}>
                  <Link
                    to={`/roteiro/${d.date}`}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-w-[70px] flex-col items-center rounded-xl border px-2 py-2 text-center transition ${
                      active ? 'border-petrol bg-petrol text-white' : 'surface hover:border-gold'
                    } ${today ? 'ring-2 ring-gold' : ''}`}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-80">{weekdayShort(d.date)}</span>
                    <span className="font-display text-xl font-semibold leading-none">{shortDate(d.date)}</span>
                    <span className="mt-1 max-w-[70px] truncate text-[10px]">{city ? city.name : '✈︎ voo'}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>

        {date ? (
          <DayView day={dayByDate[date]} />
        ) : (
          <div className="space-y-12">
            {itinerary.map((d) => (
              <DayView key={d.date} day={d} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
