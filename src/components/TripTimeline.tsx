import { Link } from './TripLink'
import { BedDouble } from 'lucide-react'
import { baseCities } from '../data/cities'
import { shortDate } from '../utils/dates'
import type { CityId } from '../types'

/** Linha do tempo: horizontal no desktop, vertical no celular. */
export function TripTimeline({ currentCity }: { currentCity?: CityId | 'voo' }) {
  return (
    <ol className="relative grid gap-0 md:grid-cols-6 md:gap-3" aria-label="Linha do tempo das hospedagens">
      {baseCities.map((c, i) => {
        const active = currentCity === c.id
        return (
          <li key={c.id} className="relative flex gap-4 pb-6 md:block md:pb-0">
            {/* conector */}
            {i < baseCities.length - 1 && (
              <span aria-hidden className="absolute left-[15px] top-8 h-full w-px bg-gold/50 md:left-8 md:top-[15px] md:h-px md:w-full" />
            )}
            <span
              aria-hidden
              className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-xs font-bold ${
                active ? 'border-gold bg-gold text-navy' : 'border-gold bg-navy text-gold'
              }`}
            >
              {i + 1}
            </span>
            <Link
              to={`/cidades/${c.id}`}
              className={`surface group block flex-1 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lg md:mt-3 ${active ? 'ring-2 ring-gold' : ''}`}
            >
              <p className="text-2 text-xs font-semibold tracking-wider">
                {shortDate(c.arrival)}–{shortDate(c.departure)}
              </p>
              <p className="font-display text-2xl font-semibold leading-tight group-hover:text-[var(--accent-text)]">
                <span aria-hidden>{c.flag} </span>
                {c.name}
              </p>
              <p className="text-2 mt-1 flex items-center gap-1 text-xs">
                <BedDouble className="h-3.5 w-3.5" aria-hidden /> {c.nights} noites
              </p>
              {active && <p className="mt-2 text-xs font-semibold text-accent">Você está aqui</p>}
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
