import { Link } from '../components/TripLink'
import { ArrowRight, CalendarDays, CheckSquare, Gift, Hourglass, NotebookPen, Ticket, TrainFront, Sparkles } from 'lucide-react'
import { baseCities, cities, cityById, hotels, TOTAL_NIGHTS } from '../data/cities'
import { shareUrl } from '../utils/share'
import { itinerary } from '../data/itinerary'
import { transport, checklist } from '../data/logistics'
import { cityHero } from '../data/photos'
import { tripPhase, localTime, longDate, shortDate } from '../utils/dates'
import { requireTrip } from '../data/active'
import { useNow } from '../hooks/useMisc'
import { useChecklist, useTickets } from '../hooks/useAppState'
import { TripTimeline } from '../components/TripTimeline'
import { ShareButton } from '../components/ShareButton'
import { DayView, dayLabel } from '../components/DayView'
import { PhotoView, SectionTitle, Stat } from '../components/ui'

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const dm = (d: string) => `${+d.slice(8, 10)} de ${MONTHS[+d.slice(5, 7) - 1]}`

export function HomePage() {
  const trip = requireTrip()
  const now = useNow()
  const phase = tripPhase(now)
  const { tickets } = useTickets()
  const { done } = useChecklist()
  const pendingTickets = tickets.filter((t) => ['nao-pesquisado', 'pendente', 'em-analise'].includes(t.status)).length
  const pendingTransport = transport.filter((t) => t.status === 'pendente').length
  const allItems = checklist.flatMap((c) => c.items)
  const doneCount = allItems.filter((i) => done[i.id]).length
  const hero = trip.cover ?? cityHero(baseCities[Math.floor(baseCities.length / 2)]?.id ?? cities[0]?.id)
  const countries = [...new Map(cities.map((c) => [c.country, c.flag])).entries()]
  const firstDay = itinerary[0]
  const firstCity = firstDay && firstDay.cityId !== 'voo' ? cityById[firstDay.cityId] : undefined

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0 -z-10">
          {hero ? (
            <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover opacity-55" />
          ) : (
            <div className="twinkle-dots h-full w-full bg-gradient-to-br from-navy via-navy-2 to-petrol" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-16 md:px-8 md:pb-20 md:pt-28">
          <p className="fade-in mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {dm(trip.start)} — {dm(trip.end)} de {trip.end.slice(0, 4)}
          </p>
          <h1 className="fade-in max-w-3xl text-5xl font-semibold leading-[1.02] md:text-7xl">
            {trip.title}
            <span className="block text-3xl italic text-gold md:text-5xl">{trip.subtitle}</span>
          </h1>
          <p className="fade-in mt-3 font-display text-2xl text-cream md:text-3xl">
            <span aria-hidden className="mr-2 text-gold">✦</span>{trip.travelers.join(' & ')}
          </p>
          <p className="fade-in mt-5 max-w-2xl text-lg text-cream/85">
            {trip.intro[0]}
          </p>
          <div className="fade-in mt-7 flex flex-wrap gap-3">
            {phase.phase === 'depois' ? (
              <Link to="/caderno" className="btn bg-gold text-navy hover:bg-[#d6b77f]">
                <NotebookPen className="h-4 w-4" aria-hidden /> Caderno de viagem
              </Link>
            ) : (
              <Link to="/hoje" className="btn bg-gold text-navy hover:bg-[#d6b77f]">
                <Sparkles className="h-4 w-4" aria-hidden /> {phase.phase === 'durante' ? 'Programação de hoje' : 'Como será o dia a dia'}
              </Link>
            )}
            <Link to="/roteiro" className="btn border border-cream/40 text-cream hover:bg-white/10">
              <CalendarDays className="h-4 w-4" aria-hidden /> Roteiro completo
            </Link>
            <ShareButton
              variant="light"
              title={`${trip.title} — ${trip.travelers.join(' & ')}`}
              text={`${trip.tagline} De ${shortDate(trip.start)} a ${shortDate(trip.end)}/${trip.end.slice(0, 4)}.`}
              url={shareUrl('/')}
            />
          </div>
          {hero && <p className="mt-6 text-[10px] text-cream/60">Foto: {hero.author ?? 'ver créditos'} · {hero.license}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-8 md:px-8">
        {/* FASE DA VIAGEM */}
        <section aria-label="Situação da viagem" className="-mt-14 md:-mt-16">
          <div className="surface relative rounded-3xl p-5 shadow-xl md:p-7">
            {phase.phase === 'antes' && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Hourglass className="h-10 w-10 text-gold" aria-hidden />
                  <div>
                    <p className="text-2 text-sm">Faltam</p>
                    <p className="font-display text-5xl font-semibold leading-none">
                      {phase.daysLeft} <span className="text-2xl">{phase.daysLeft === 1 ? 'dia' : 'dias'}</span>
                    </p>
                    <p className="text-2 text-sm">para o início da viagem ({shortDate(trip.start)})</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm md:w-1/2">
                  <Link to="/reservas" className="rounded-xl bg-amber-100 p-3 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                    <Ticket className="mb-1 h-4 w-4" aria-hidden />
                    <strong>{pendingTickets}</strong> ingressos sem compra
                  </Link>
                  <Link to="/reservas#transportes" className="rounded-xl bg-amber-100 p-3 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                    <TrainFront className="mb-1 h-4 w-4" aria-hidden />
                    <strong>{pendingTransport}</strong> deslocamentos pendentes
                  </Link>
                  <Link to="/checklist" className="col-span-2 rounded-xl bg-surface-2 p-3">
                    <CheckSquare className="mb-1 h-4 w-4 text-gold" aria-hidden />
                    Checklist: <strong>{doneCount}</strong> de {allItems.length} itens concluídos
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                      <span className="block h-full bg-petrol" style={{ width: `${allItems.length ? (doneCount / allItems.length) * 100 : 0}%` }} />
                    </span>
                  </Link>
                </div>
              </div>
            )}
            {phase.phase === 'durante' && (
              <div>
                <p className="text-goldx mb-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  Hoje · {dayLabel(phase.day)} · {localTime(now, phase.day.timezone)} (hora local)
                </p>
                <DayView day={phase.day} compact />
                <Link to="/hoje" className="btn btn-primary mt-4">
                  Abrir o dia completo <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            )}
            {phase.phase === 'depois' && (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="h-10 w-10 text-gold" aria-hidden />
                  <div>
                    <p className="font-display text-4xl font-semibold">Viagem concluída</p>
                    <p className="text-2">
                      {itinerary.length} dias, {TOTAL_NIGHTS} noites, {cities.length} {cities.length === 1 ? 'cidade' : 'cidades'}. Hora de transformar o roteiro em memória.
                    </p>
                  </div>
                </div>
                <Link to="/caderno" className="btn btn-primary">
                  <NotebookPen className="h-4 w-4" aria-hidden /> Abrir o Caderno de Viagem
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* NÚMEROS */}
        <section aria-label="Resumo" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Dias" value={itinerary.length} hint={`${shortDate(trip.start)} a ${shortDate(trip.end)}`} />
          <Stat label="Noites" value={TOTAL_NIGHTS} hint={`em ${hotels.length} ${hotels.length === 1 ? 'hospedagem' : 'hospedagens'}`} />
          <Stat label={countries.length === 1 ? 'País' : 'Países'} value={countries.length} hint={countries.map(([c]) => c).join(', ')} />
          <Stat label="Viajantes" value={trip.travelers.length} hint={trip.travelers.join(' & ')} />
        </section>

        {/* LINHA DO TEMPO */}
        <section>
          <SectionTitle eyebrow="Percurso" title={`${baseCities.length} ${baseCities.length === 1 ? 'base' : 'bases'}, ${itinerary.length} dias`}>
            {trip.intro.slice(1).map((p) => (
              <p key={p} className="mb-2">
                {p}
              </p>
            ))}
            {firstCity && <p>Começa em {firstCity.name}, {longDate(firstDay.date)}.</p>}
          </SectionTitle>
          <TripTimeline currentCity={phase.phase === 'durante' ? phase.day.cityId : undefined} />
        </section>

        {/* CIDADES */}
        <section>
          <SectionTitle eyebrow="Destinos" title="As cidades" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <Link key={c.id} to={`/cidades/${c.id}`} className="surface group overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
                <PhotoView photo={cityHero(c.id)} title={c.name} ratio="aspect-[16/10]" showCredit={false} />
                <div className="p-4">
                  <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                    <span aria-hidden>{c.flag}</span> {c.country} · {c.isBase ? `${c.nights} ${c.nights === 1 ? 'noite' : 'noites'}` : 'bate-volta'}
                  </p>
                  <h3 className="text-2xl font-semibold group-hover:text-[var(--accent-text)]">{c.name}</h3>
                  <p className="text-2 mt-1 text-sm">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
          {cities.length > baseCities.length && (
            <p className="text-2 mt-3 text-xs">
              {baseCities.length} {baseCities.length === 1 ? 'base' : 'bases'} de hospedagem + {cities.filter((c) => !c.isBase).map((c) => c.name).join(', ')} como passeio.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
