import { Link } from './TripLink'
import { ChevronLeft, ChevronRight, Navigation, NotebookPen, Plane, TrainFront, Utensils, MapPin, Coffee, Map as MapIcon } from 'lucide-react'
import type { DayItem, TripDay } from '../types'
import { itinerary } from '../data/itinerary'
import { activeTrip } from '../data/active'
import { attractionById } from '../data/attractions'
import { cityById } from '../data/cities'
import { attractionCoords } from '../data/photos'
import { longDate, shortDate } from '../utils/dates'
import { directionsUrl } from '../utils/download'
import { ReliabilityBadge, statusMeta } from './ui'
import { useAttractionStatus } from '../hooks/useAppState'
import { ShareButton } from './ShareButton'
import { shareUrl } from '../utils/share'

function kindIcon(item: DayItem) {
  if (item.kind === 'transporte') return /voo|ryanair|iberia/i.test(item.text) ? Plane : TrainFront
  if (item.kind === 'refeicao') return Utensils
  if (item.kind === 'livre') return Coffee
  return MapPin
}

export function dayLabel(day: TripDay) {
  return day.cityId === 'voo' ? 'Em voo' : cityById[day.cityId].name
}

export function DayView({ day, compact = false }: { day: TripDay; compact?: boolean }) {
  const idx = itinerary.indexOf(day)
  const prev = itinerary[idx - 1]
  const next = itinerary[idx + 1]
  const { get } = useAttractionStatus()

  return (
    <section aria-labelledby={`dia-${day.date}`} className="fade-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-goldx text-xs font-semibold uppercase tracking-[0.2em]">
            Dia {idx + 1} de {itinerary.length} · {dayLabel(day)}
          </p>
          <h2 id={`dia-${day.date}`} className="text-3xl font-semibold md:text-4xl">
            {day.title}
          </h2>
          <p className="text-2 first-letter:uppercase">{longDate(day.date)}</p>
        </div>
        {!compact && (
          <div className="flex flex-wrap gap-2">
            <Link to={`/mapa?dia=${day.date}`} className="btn btn-ghost btn-sm">
              <MapIcon className="h-4 w-4" aria-hidden /> Ver no mapa
            </Link>
            <ShareButton title={`${dayLabel(day)} · ${shortDate(day.date)} — ${day.title}`} text={`Programação do dia — ${activeTrip?.title ?? ''}`} url={shareUrl(`/roteiro/${day.date}`)} />
            <Link to={`/caderno/${day.date}`} className="btn btn-ghost btn-sm">
              <NotebookPen className="h-4 w-4" aria-hidden /> Caderno do dia
            </Link>
          </div>
        )}
      </div>

      <ol className="relative space-y-3 border-l-2 border-gold/40 pl-5">
        {day.items.map((item, i) => {
          const Icon = kindIcon(item)
          const att = item.attractionId ? attractionById[item.attractionId] : undefined
          const coords = att ? attractionCoords(att).coords : undefined
          const st = att && att.category !== 'hotel' && att.category !== 'estacao' && att.category !== 'aeroporto' ? get(att.id) : undefined
          return (
            <li key={i} className="surface relative rounded-xl p-3">
              <span aria-hidden className="absolute -left-[31px] top-4 grid h-5 w-5 place-items-center rounded-full border-2 border-gold bg-[var(--bg)]">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.time && <span className="font-mono text-sm font-semibold">{item.time.replace(':', 'h')}</span>}
                    <span className={`font-medium ${st === 'cancelada' ? 'line-through opacity-60' : ''}`}>
                      {att && day.cityId !== 'voo' ? (
                        <Link className="hover:underline" to={`/cidades/${att.cityId}#atracao-${att.id}`}>
                          {item.text}
                        </Link>
                      ) : (
                        item.text
                      )}
                    </span>
                  </div>
                  {item.note && <p className="text-2 mt-0.5 text-sm">{item.note}</p>}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <ReliabilityBadge value={st === 'visitada' ? 'visitado' : st === 'reservada' ? 'confirmado' : item.reliability} />
                    {st && st !== 'planejada' && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusMeta[st].cls}`}>{statusMeta[st].label}</span>
                    )}
                    {coords && (
                      <a
                        className="text-accent inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold"
                        href={directionsUrl(coords.lat, coords.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-3.5 w-3.5" aria-hidden /> Ir até lá
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {day.notes && (
        <div className="mt-4 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm">
          {day.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      )}

      {!compact && (
        <div className="mt-6 flex justify-between gap-2">
          {prev ? (
            <Link to={`/roteiro/${prev.date}`} className="btn btn-ghost btn-sm">
              <ChevronLeft className="h-4 w-4" aria-hidden /> {shortDate(prev.date)}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/roteiro/${next.date}`} className="btn btn-ghost btn-sm">
              {shortDate(next.date)} <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
