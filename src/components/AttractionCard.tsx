import { useState } from 'react'
import { BadgeInfo, Clock, MapPin, Navigation, Ticket } from 'lucide-react'
import type { Attraction } from '../types'
import { attractionCoords, attractionPhoto } from '../data/photos'
import { useAttractionStatus } from '../hooks/useAppState'
import { CopyButton, ExternalLink, PhotoView, StatusSelect } from './ui'
import { directionsUrl, osmUrl } from '../utils/download'
import { categoryMeta } from './categories'

export function AttractionCard({ attraction: a }: { attraction: Attraction }) {
  const { get, set } = useAttractionStatus()
  const [open, setOpen] = useState(false)
  const status = get(a.id)
  const { coords, verified } = attractionCoords(a)
  const cat = categoryMeta[a.category]

  return (
    <article id={`atracao-${a.id}`} className={`surface fade-in flex flex-col overflow-hidden rounded-2xl ${status === 'cancelada' ? 'opacity-60' : ''}`}>
      <PhotoView photo={attractionPhoto(a.id)} title={a.name} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
            <span aria-hidden>{cat.emoji}</span> {cat.label}
          </span>
          {a.optional && <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-800 dark:bg-stone-700 dark:text-stone-100">Opcional</span>}
          {a.tags?.map((t) => (
            <span key={t} className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-semibold leading-tight">{a.name}</h3>
        <p className="text-2 mt-2 text-sm leading-relaxed">{a.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusSelect value={status} onChange={(s) => set(a.id, s)} label={a.name} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? 'Menos detalhes' : 'Detalhes práticos'}
          </button>
        </div>

        {open && (
          <dl className="mt-3 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex gap-2">
              <dt className="sr-only">Ingressos</dt>
              <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <dd>{a.tickets}</dd>
            </div>
            {a.icom && (
              <div className="flex gap-2">
                <dt className="sr-only">ICOM</dt>
                <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd>
                  <strong>ICOM:</strong> {a.icom}
                </dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="sr-only">Horário</dt>
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <dd>{a.hours ?? 'Horário de funcionamento: a confirmar no site oficial.'}</dd>
            </div>
            {a.address && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="sr-only">Endereço</dt>
                <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd className="flex-1">{a.address}</dd>
                <CopyButton text={a.address} label="Copiar endereço" />
              </div>
            )}
            {coords && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="sr-only">Coordenadas</dt>
                <Navigation className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <dd className="text-2 text-xs">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} {verified ? '(fonte: Wikipédia)' : '(aproximadas — conferir no mapa)'}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {coords && (
            <>
              <a className="btn btn-primary btn-sm" href={directionsUrl(coords.lat, coords.lng)} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" aria-hidden /> Rota no Google Maps
              </a>
              <a className="btn btn-ghost btn-sm" href={osmUrl(coords.lat, coords.lng)} target="_blank" rel="noopener noreferrer">
                OpenStreetMap
              </a>
            </>
          )}
          {a.officialUrl && (
            <ExternalLink href={a.officialUrl} className="btn btn-ghost btn-sm no-underline">
              {a.tags?.includes('A confirmar') ? 'Fonte' : 'Site oficial'}
            </ExternalLink>
          )}
        </div>
      </div>
    </article>
  )
}
