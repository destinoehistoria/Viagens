import { Link } from '../components/TripLink'
import { CalendarClock, Hourglass, NotebookPen } from 'lucide-react'
import { itinerary } from '../data/itinerary'
import { cityById, hotels } from '../data/cities'
import { tripPhase, localTime, shortDate } from '../utils/dates'
import { useNow } from '../hooks/useMisc'
import { DayView } from '../components/DayView'
import { EmptyState, PageHeader } from '../components/ui'

export function TodayPage() {
  const now = useNow()
  const phase = tripPhase(now)

  if (phase.phase === 'antes') {
    return (
      <>
        <PageHeader eyebrow="Hoje" title="A viagem ainda não começou" />
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
          <EmptyState icon={<Hourglass className="h-8 w-8" />} title={`Faltam ${phase.daysLeft} dias`}>
            Durante a viagem, esta tela mostra automaticamente o dia, a cidade e a programação, no fuso horário local.
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link to={`/roteiro/${itinerary[0].date}`} className="btn btn-primary btn-sm">
                Ver o primeiro dia
              </Link>
              <Link to={`/hoje?data=${itinerary[Math.min(2, itinerary.length - 1)].date}`} className="btn btn-ghost btn-sm">
                <CalendarClock className="h-4 w-4" aria-hidden /> Simular {shortDate(itinerary[Math.min(2, itinerary.length - 1)].date)}
              </Link>
            </div>
          </EmptyState>
        </div>
      </>
    )
  }

  if (phase.phase === 'depois') {
    return (
      <>
        <PageHeader eyebrow="Hoje" title="Viagem concluída" />
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
          <EmptyState icon={<NotebookPen className="h-8 w-8" />} title="Que tal revisar o Caderno de Viagem?">
            Registre o que foi visitado de fato, exporte em Markdown ou JSON e guarde as memórias.
            <div className="mt-4">
              <Link to="/caderno" className="btn btn-primary btn-sm">
                Abrir o Caderno
              </Link>
            </div>
          </EmptyState>
        </div>
      </>
    )
  }

  const { day } = phase
  const city = day.cityId === 'voo' ? undefined : cityById[day.cityId]
  const hotel = hotels.find((h) => h.checkIn <= day.date && day.date < h.checkOut)
  return (
    <>
      <PageHeader eyebrow={`Hoje · ${localTime(now, day.timezone)} hora local`} title={city ? `${city.flag} ${city.name}` : '✈︎ Em trânsito'}>
        {hotel && <p>Hospedagem: {hotel.name}</p>}
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <DayView day={day} />
      </div>
    </>
  )
}
