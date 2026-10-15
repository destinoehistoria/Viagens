import { itinerary } from '../data/itinerary'
import type { TripDay } from '../types'
import { TRIP_END, TRIP_START } from '../data/cities'

/** Data local (AAAA-MM-DD) de um instante em um fuso horário IANA. */
export function localDate(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function localTime(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone, hour: '2-digit', minute: '2-digit' }).format(now)
}

export type TripPhase =
  | { phase: 'antes'; daysLeft: number }
  | { phase: 'durante'; day: TripDay; dayNumber: number }
  | { phase: 'depois' }

/**
 * Determina a fase da viagem respeitando o fuso de cada dia do roteiro:
 * o dia de partida no fuso de casa, depois o fuso local de cada cidade.
 */
export function tripPhase(now: Date): TripPhase {
  for (let i = 0; i < itinerary.length; i++) {
    const d = itinerary[i]
    if (localDate(now, d.timezone) === d.date) return { phase: 'durante', day: d, dayNumber: i + 1 }
  }
  const first = itinerary[0]
  const today = localDate(now, first.timezone)
  if (today < TRIP_START) {
    return { phase: 'antes', daysLeft: daysBetween(today, TRIP_START) }
  }
  const last = itinerary[itinerary.length - 1]
  if (localDate(now, last.timezone) > TRIP_END) return { phase: 'depois' }
  // Caso limítrofe (virada de fuso entre dias): considerar o dia mais próximo já iniciado.
  const started = itinerary.filter((d) => localDate(now, d.timezone) >= d.date)
  const day = started[started.length - 1] ?? first
  return { phase: 'durante', day, dayNumber: itinerary.indexOf(day) + 1 }
}

/** Diferença em dias entre duas datas AAAA-MM-DD. */
export function daysBetween(a: string, b: string): number {
  const ms = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))
  return Math.round(ms / 86_400_000)
}

const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

function parts(date: string) {
  const y = +date.slice(0, 4)
  const m = +date.slice(5, 7)
  const d = +date.slice(8, 10)
  return { y, m, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }
}

/** "27/11" */
export function shortDate(date: string): string {
  const { m, d } = parts(date)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}

/** "sexta-feira, 27 de novembro" */
export function longDate(date: string): string {
  const { m, d, wd } = parts(date)
  return `${WEEKDAYS[wd]}, ${d} de ${MONTHS[m - 1]}`
}

/** "sex" */
export function weekdayShort(date: string): string {
  return WEEKDAYS[parts(date).wd].slice(0, 3)
}

/**
 * Data “agora” do app. Permite simular uma data via ?data=AAAA-MM-DD
 * (útil para testar a visão “Hoje” antes da viagem).
 */
export function appNow(search = typeof window !== 'undefined' ? window.location.hash.split('?')[1] ?? '' : ''): Date {
  const sim = new URLSearchParams(search).get('data')
  if (sim && /^\d{4}-\d{2}-\d{2}$/.test(sim)) return new Date(`${sim}T12:00:00Z`)
  return new Date()
}
