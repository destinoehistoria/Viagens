import type { ChecklistCategory, Ticket, TransportLeg, Trip } from '../types'

/** Fachada da viagem ativa — ver src/data/cities.ts. */
export let transport: TransportLeg[] = []
export let extraPlaces: Record<string, { name: string; lat: number; lng: number }> = {}
export let ticketSeeds: Ticket[] = []
export let checklist: ChecklistCategory[] = []

export const ticketStatusLabel: Record<Ticket['status'], string> = {
  'nao-pesquisado': 'Não pesquisado',
  pendente: 'Pendente',
  'em-analise': 'Em análise',
  reservado: 'Reservado',
  pago: 'Pago',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export function _setLogistics(t: Trip) {
  transport = t.transport
  extraPlaces = t.extraPlaces ?? {}
  ticketSeeds = t.tickets ?? []
  checklist = t.checklist ?? []
}
