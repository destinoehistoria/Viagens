import { lazy, Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Crosshair, Route } from 'lucide-react'
import { cities, cityById } from '../data/cities'
import { attractions } from '../data/attractions'
import { itinerary, dayByDate } from '../data/itinerary'
import { attractionCoords } from '../data/photos'
import { useAttractionStatus } from '../hooks/useAppState'
import { attractionPoint, cityPoints, hotelPoints, tripLines } from '../utils/mapData'
import { categoryMeta } from '../components/categories'
import { PageHeader, Pill, statusMeta } from '../components/ui'
import { shortDate } from '../utils/dates'
import type { AttractionStatus, Category, CityId } from '../types'
import type { MapLine } from '../components/MapView'

const MapView = lazy(() => import('../components/MapView'))
const allCityBounds = cities.map((c) => [c.coords.lat, c.coords.lng] as [number, number])

export function MapPage() {
  const [params, setParams] = useSearchParams()
  const { get } = useAttractionStatus()
  const [city, setCity] = useState<CityId | 'todas'>('todas')
  const [cats, setCats] = useState<Category[]>([])
  const [status, setStatus] = useState<AttractionStatus | 'todos'>('todos')
  const [showTrip, setShowTrip] = useState(true)
  const day = params.get('dia') ?? ''
  const selectedDay = day ? dayByDate[day] : undefined

  const focus = useMemo(() => {
    if (selectedDay && selectedDay.cityId !== 'voo') {
      const c = cityById[selectedDay.cityId]
      return { center: [c.coords.lat, c.coords.lng] as [number, number], zoom: c.zoom }
    }
    if (city !== 'todas') {
      const c = cityById[city]
      return { center: [c.coords.lat, c.coords.lng] as [number, number], zoom: c.zoom }
    }
    return undefined
  }, [city, selectedDay])

  const dayIds = useMemo(() => new Set(selectedDay?.items.map((i) => i.attractionId).filter(Boolean) as string[]), [selectedDay])

  const points = useMemo(() => {
    const list = attractions
      .filter((a) => a.category !== 'hotel')
      .filter((a) => (selectedDay ? dayIds.has(a.id) : true))
      .filter((a) => (city === 'todas' || selectedDay ? true : a.cityId === city))
      .filter((a) => (cats.length ? cats.includes(a.category) : true))
      .filter((a) => (status === 'todos' ? true : get(a.id) === status))
      .map(attractionPoint)
      .filter((p): p is NonNullable<typeof p> => !!p)
    const hotels = cats.length === 0 || cats.includes('hotel') ? hotelPoints() : []
    return [...cityPoints(), ...list, ...hotels]
  }, [selectedDay, dayIds, city, cats, status, get])

  const lines = useMemo(() => {
    const out: MapLine[] = showTrip ? tripLines() : []
    if (selectedDay) {
      const pts = selectedDay.items
        .map((i) => (i.attractionId ? attractions.find((a) => a.id === i.attractionId) : undefined))
        .filter((a): a is NonNullable<typeof a> => !!a && a.category !== 'estacao' && a.category !== 'aeroporto')
        .map((a) => attractionCoords(a).coords)
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => [c.lat, c.lng] as [number, number])
      if (pts.length > 1)
        out.push({ id: 'rota-dia', points: pts, color: '#7C3AED', dash: '4 6', weight: 4, label: `Ordem de visita de ${shortDate(selectedDay.date)} — esquemática, não é o caminho a pé real` })
    }
    return out
  }, [showTrip, selectedDay])

  const toggleCat = (c: Category) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))

  return (
    <>
      <PageHeader eyebrow="Mapa interativo" title="Destinos, atrações e deslocamentos">
        Linhas entre cidades são <strong>esquemáticas</strong>: indicam a sequência e o meio de transporte, não o traçado real de ferrovias ou rotas aéreas.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-8">
        <div className="surface space-y-3 rounded-2xl p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm font-medium">
              Cidade
              <select
                className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value as CityId | 'todas')
                  if (day) setParams({})
                }}
              >
                <option value="todas">Todas as cidades</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Roteiro a pé do dia
              <select
                className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3"
                value={day}
                onChange={(e) => setParams(e.target.value ? { dia: e.target.value } : {})}
              >
                <option value="">Nenhum dia selecionado</option>
                {itinerary
                  .filter((d) => d.cityId !== 'voo')
                  .map((d) => (
                    <option key={d.date} value={d.date}>
                      {shortDate(d.date)} — {d.title}
                    </option>
                  ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Status
              <select className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3" value={status} onChange={(e) => setStatus(e.target.value as AttractionStatus | 'todos')}>
                <option value="todos">Todos</option>
                {(Object.keys(statusMeta) as AttractionStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {statusMeta[s].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por categoria">
            <Pill active={cats.length === 0} onClick={() => setCats([])}>
              Todas
            </Pill>
            {(Object.keys(categoryMeta) as Category[]).map((c) => (
              <Pill key={c} active={cats.includes(c)} onClick={() => toggleCat(c)}>
                <span aria-hidden>{categoryMeta[c].emoji}</span> {categoryMeta[c].label}
              </Pill>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2 text-xs font-semibold uppercase tracking-wider">Centralizar:</span>
            {cities.map((c) => (
              <button key={c.id} type="button" className="btn btn-ghost btn-sm" onClick={() => setCity(c.id)}>
                <Crosshair className="h-3.5 w-3.5" aria-hidden /> {c.name}
              </button>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCity('todas')}>
              Todas
            </button>
            <label className="ml-auto inline-flex min-h-[44px] items-center gap-2 text-sm">
              <input type="checkbox" checked={showTrip} onChange={(e) => setShowTrip(e.target.checked)} className="h-5 w-5 accent-[#176B65]" />
              <Route className="h-4 w-4" aria-hidden /> Sequência da viagem
            </label>
          </div>
        </div>

        <Suspense fallback={<div className="surface h-[70vh] animate-pulse rounded-2xl" />}>
          <MapView points={points} lines={lines} center={[46.5, 4.5]} zoom={5} height="h-[70vh] min-h-[420px]" focus={focus} initialBounds={allCityBounds} />
        </Suspense>

        <div className="surface grid gap-2 rounded-2xl p-4 text-sm md:grid-cols-2">
          <p className="flex items-center gap-2">
            <span className="inline-block h-0 w-10 border-t-4 border-dashed border-[#176B65]" /> Trem confirmado (esquemático)
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-0 w-10 border-t-4 border-dashed border-[#B45309]" /> Trem pendente (esquemático)
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-0 w-10 border-t-4 border-dotted border-[#C6A56B]" /> Voo (esquemático)
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-0 w-10 border-t-4 border-dashed border-[#7C3AED]" /> Ordem de visita do dia
          </p>
          <p className="text-2 md:col-span-2">
            Marcadores numerados: as bases em ordem de chegada; letras indicam bate-voltas e passeios. Atrações sem verificação automática aparecem em posição aproximada.
            Os voos de ida e volta de casa não são desenhados para manter o mapa legível.
          </p>
        </div>
      </div>
    </>
  )
}
