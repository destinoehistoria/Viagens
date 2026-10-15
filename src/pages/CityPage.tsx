import { lazy, Suspense, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link, Navigate } from '../components/TripLink'
import { BedDouble, CalendarDays, Cloud, Landmark, Lightbulb, MapPin, Snowflake, TrainFront, Utensils, ChevronLeft, ChevronRight, Sun } from 'lucide-react'
import { cities, cityById, hotelByCity } from '../data/cities'
import { activeTrip } from '../data/active'
import { attractionsByCity, isLogistics, futureIdeas } from '../data/attractions'
import { itinerary } from '../data/itinerary'
import { cityGallery, cityHero, attractionPhoto } from '../data/photos'
import { longDate, shortDate } from '../utils/dates'
import { useAttractionStatus, useCityNotes } from '../hooks/useAppState'
import { useHashScroll } from '../hooks/useHashScroll'
import { AttractionCard } from '../components/AttractionCard'
import { ShareButton } from '../components/ShareButton'
import { shareUrl } from '../utils/share'
import { Gallery } from '../components/Gallery'
import { CopyButton, ExternalLink, Pill, PhotoCredit, SectionTitle } from '../components/ui'
import { attractionPoint, hotelPoints } from '../utils/mapData'
import type { AttractionStatus, CityId, Photo } from '../types'

const MapView = lazy(() => import('../components/MapView'))

export function CityPage() {
  const { id } = useParams()
  useHashScroll()
  const city = id ? cityById[id as CityId] : undefined
  const { get } = useAttractionStatus()
  const [filter, setFilter] = useState<'todas' | AttractionStatus | 'opcionais'>('todas')
  const [notes, setNotes] = useCityNotes(id ?? 'x')

  const list = useMemo(() => (city ? attractionsByCity(city.id).filter((a) => !isLogistics(a)) : []), [city])
  if (!city) return <Navigate to="/cidades" replace />

  const days = itinerary.filter((d) => d.cityId === city.id)
  const hotel = hotelByCity[city.id]
  const hero = cityHero(city.id)
  const idx = cities.indexOf(city)
  const prev = cities[idx - 1]
  const next = cities[idx + 1]

  const filtered = list.filter((a) => {
    if (filter === 'todas') return true
    if (filter === 'opcionais') return a.optional
    return get(a.id) === filter
  })
  const counts = {
    visitada: list.filter((a) => get(a.id) === 'visitada').length,
    reservada: list.filter((a) => get(a.id) === 'reservada').length,
  }

  const licensed: Photo[] = [
    ...cityGallery(city.id),
    ...list.map((a) => attractionPhoto(a.id)).filter((p): p is Photo => !!p),
  ].filter((p, i, arr) => arr.findIndex((x) => x.src === p.src) === i)

  const points = [...attractionsByCity(city.id).filter((a) => a.category !== 'hotel').map(attractionPoint), ...hotelPoints().filter((h) => h.id === `hotel-${city.id}`)].filter(
    (p): p is NonNullable<typeof p> => !!p,
  )

  return (
    <article>
      {/* Cabeçalho panorâmico */}
      <header className="relative isolate overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0 -z-10">
          {hero ? (
            <figure className="h-full w-full">
              <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover opacity-60" />
              <PhotoCredit photo={hero} />
            </figure>
          ) : (
            <div className="twinkle-dots h-full w-full" style={{ background: `linear-gradient(135deg, #152638 0%, ${city.accent} 140%)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-8 md:pt-28">
          <Link to="/cidades" className="text-sm text-cream/80 hover:underline">
            ← Todas as cidades
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <span aria-hidden>{city.flag}</span> {city.country}
          </p>
          <h1 className="text-5xl font-semibold md:text-7xl">{city.name}</h1>
          <p className="mt-2 max-w-2xl text-lg italic text-cream/90">{city.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1.5">
              <CalendarDays className="mr-1 inline h-4 w-4" aria-hidden />
              {city.isBase ? `${shortDate(city.arrival)} → ${shortDate(city.departure)}` : `${shortDate(city.arrival)} (bate-volta, data a confirmar entre 12 e 13/12)`}
            </span>
            {city.isBase && (
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                <BedDouble className="mr-1 inline h-4 w-4" aria-hidden />
                {city.nights} noites
              </span>
            )}
            {hotel && <span className="rounded-full bg-white/10 px-3 py-1.5">🏨 {hotel.name}</span>}
          </div>
          <div className="mt-5">
            <ShareButton variant="light" title={`${city.name} — ${activeTrip?.title ?? ''}`} text={city.tagline} url={shareUrl(`/cidades/${city.id}`)} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:px-8">
        {/* Resumo, clima, hotel */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle eyebrow="História e cultura" title="Resumo histórico-cultural" />
            <p className="text-lg leading-relaxed">{city.summary}</p>
            <div className="mt-4 space-y-3 leading-relaxed">
              {city.history.map((h) => (
                <p key={h} className="text-2">
                  {h}
                </p>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            {city.climate && (
            <div className="surface rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Snowflake className="h-5 w-5 text-gold" aria-hidden /> Clima típico no período
              </h3>
              <p className="font-display mt-2 text-4xl">
                {city.climate.minC}° <span className="text-2 text-2xl">a</span> {city.climate.maxC}°C
              </p>
              <p className="text-2 mt-1 flex items-center gap-1 text-sm">
                <Sun className="h-4 w-4" aria-hidden /> {city.climate.daylight}
              </p>
              <p className="text-2 mt-2 flex gap-1 text-sm">
                <Cloud className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {city.climate.note}
              </p>
              <p className="mt-3 rounded-lg bg-surface-2 p-2 text-xs">
                <strong>Estimativa climatológica</strong> (médias históricas aproximadas), não previsão. Conferir a previsão perto da viagem.
              </p>
            </div>
            )}
            {hotel && (
              <div className="surface rounded-2xl p-5">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                  <BedDouble className="h-5 w-5 text-gold" aria-hidden /> Hotel reservado
                </h3>
                <p className="mt-2 font-semibold">{hotel.name}</p>
                <p className="text-2 text-sm">
                  Check-in {shortDate(hotel.checkIn)} · Check-out {shortDate(hotel.checkOut)}
                </p>
                {hotel.address ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gold" aria-hidden /> {hotel.address}
                    <CopyButton text={hotel.address} label="Copiar" />
                  </div>
                ) : (
                  <p className="text-2 mt-2 text-sm">Endereço: conferir no voucher.</p>
                )}
                {hotel.notes?.map((n) => (
                  <p key={n} className="text-2 mt-1 text-sm">
                    {n}
                  </p>
                ))}
              </div>
            )}
          </aside>
        </section>

        {/* Programação */}
        <section>
          <SectionTitle eyebrow="Programação" title={`${days.length} ${days.length === 1 ? 'dia' : 'dias'} em ${city.name}`} />
          <ol className="grid gap-3 md:grid-cols-2">
            {days.map((d) => (
              <li key={d.date}>
                <Link to={`/roteiro/${d.date}`} className="surface block rounded-2xl p-4 transition hover:border-gold">
                  <p className="text-goldx text-xs font-semibold uppercase tracking-wider">{longDate(d.date)}</p>
                  <p className="font-display text-2xl font-semibold">{d.title}</p>
                  <p className="text-2 mt-1 line-clamp-2 text-sm">{d.items.map((i) => i.text).join(' · ')}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Atrações */}
        <section>
          <SectionTitle eyebrow="Atrações" title="O que visitar">
            Marque cada atração como planejada, reservada, visitada ou cancelada. {counts.visitada} visitada(s), {counts.reservada} reservada(s) de {list.length}.
          </SectionTitle>
          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar atrações">
            {(['todas', 'planejada', 'reservada', 'visitada', 'cancelada', 'opcionais'] as const).map((f) => (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f[0].toUpperCase() + f.slice(1)}
              </Pill>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-2 surface rounded-xl p-4">Nenhuma atração com esse filtro.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <AttractionCard key={a.id} attraction={a} />
              ))}
            </div>
          )}
        </section>

        {/* Mapa */}
        <section>
          <SectionTitle eyebrow="Mapa" title={`Mapa de ${city.name}`}>
            Posições aproximadas até a verificação automática pelas fontes; toque em um marcador para navegar.
          </SectionTitle>
          <Suspense fallback={<div className="surface h-[380px] animate-pulse rounded-2xl" />}>
            <MapView points={points} center={[city.coords.lat, city.coords.lng]} zoom={city.zoom} height="h-[380px]" fitPoints />
          </Suspense>
        </section>

        {/* Mercados, gastronomia, curiosidades */}
        <section className="grid gap-4 md:grid-cols-3">
          {city.markets?.length ? (
          <div className="surface rounded-2xl p-5">
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">🧺 Mercados e feiras</h3>
            {city.markets.map((m) => (
              <div key={m.name} className="mb-3">
                <p className="font-semibold">{m.name}</p>
                <p className="text-2 text-sm">{m.description}</p>
                <p className="mt-1 rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">{m.status}</p>
              </div>
            ))}
          </div>
          ) : null}
          <div className="surface rounded-2xl p-5">
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Utensils className="h-5 w-5 text-gold" aria-hidden /> Gastronomia
            </h3>
            <ul className="text-2 list-disc space-y-1 pl-5 text-sm">
              {city.food.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Lightbulb className="h-5 w-5 text-gold" aria-hidden /> Curiosidades
            </h3>
            <ul className="text-2 list-disc space-y-1 pl-5 text-sm">
              {city.curiosities.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Deslocamento e links */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="surface rounded-2xl p-5">
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <TrainFront className="h-5 w-5 text-gold" aria-hidden /> Como se deslocar
            </h3>
            <ul className="text-2 list-disc space-y-1 pl-5 text-sm">
              {city.gettingAround.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Landmark className="h-5 w-5 text-gold" aria-hidden /> Links oficiais
            </h3>
            <ul className="space-y-2 text-sm">
              {city.links.map((l) => (
                <li key={l.url}>
                  <ExternalLink href={l.url}>{l.label}</ExternalLink>
                </li>
              ))}
            </ul>
            {city.id === 'paris' && (
              <p className="text-2 mt-3 text-xs">
                Fora desta viagem: {futureIdeas.map((f) => f.name).join(', ')} — ver “Ideias para futuras viagens” em Informações.
              </p>
            )}
          </div>
        </section>

        {/* Galeria */}
        <section>
          <SectionTitle eyebrow="Galeria" title={`Fotografias de ${city.name}`}>
            Fotografias reais com licença livre (Wikimedia Commons), com autor, licença e fonte, e as fotos de vocês. Fotos de arquivo nunca são apresentadas como desta viagem.
          </SectionTitle>
          <Gallery scope={`cidade-${city.id}`} licensed={licensed} title={city.name} />
        </section>

        {/* Notas */}
        <section>
          <SectionTitle eyebrow="Observações" title="Notas e experiências">
            Anotações livres sobre {city.name}. Salvas automaticamente neste aparelho. Para relatos por dia, use o <Link className="text-accent underline" to="/caderno">Caderno de Viagem</Link>.
          </SectionTitle>
          <label htmlFor="notas-cidade" className="sr-only">
            Notas sobre {city.name}
          </label>
          <textarea
            id="notas-cidade"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder={`Impressões, dicas, restaurantes a lembrar em ${city.name}…`}
            className="surface w-full rounded-2xl p-4 text-base"
          />
        </section>

        <nav className="flex justify-between gap-2" aria-label="Outras cidades">
          {prev ? (
            <Link to={`/cidades/${prev.id}`} className="btn btn-ghost">
              <ChevronLeft className="h-4 w-4" aria-hidden /> {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/cidades/${next.id}`} className="btn btn-ghost">
              {next.name} <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}

export function CitiesPage() {
  return (
    <>
      <header className="twinkle-dots bg-navy px-4 pb-10 pt-10 text-cream md:px-8 md:pt-14">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Destinos</p>
          <h1 className="text-4xl font-semibold md:text-5xl">Cidades</h1>
          <p className="mt-3 max-w-2xl text-cream/85">Seis bases de hospedagem e um bate-volta à Alemanha.</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {cities.map((c) => {
          const n = attractionsByCity(c.id).filter((a) => !isLogistics(a)).length
          return (
            <Link key={c.id} to={`/cidades/${c.id}`} className="surface group overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative">
                {cityHero(c.id) ? (
                  <img src={cityHero(c.id)!.src} alt={cityHero(c.id)!.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="twinkle-dots grid aspect-[16/10] place-items-center" style={{ background: `linear-gradient(135deg, #152638 0%, ${c.accent} 150%)` }}>
                    <span className="font-display text-4xl text-cream">{c.name}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                  <span aria-hidden>{c.flag}</span> {c.country} · {c.isBase ? `${shortDate(c.arrival)}–${shortDate(c.departure)} · ${c.nights} noites` : 'bate-volta 12 ou 13/12'}
                </p>
                <h2 className="text-3xl font-semibold group-hover:text-[var(--accent-text)]">{c.name}</h2>
                <p className="text-2 mt-1 text-sm">{c.tagline}</p>
                <p className="text-goldx mt-3 text-xs font-semibold">{n} atrações · {hotelByCity[c.id]?.name ?? 'sem pernoite'}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
