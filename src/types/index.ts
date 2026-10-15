/**
 * Modelo de dados comum a todas as viagens do app.
 *
 * Cada viagem vive em `src/trips/<slug>/index.ts` e exporta um objeto `Trip`.
 * O conteúdo do roteiro é público (vai para o site). Caderno, fotos pessoais,
 * status editados, checklist e financeiro ficam no Supabase, atrás do login.
 */

/** Grau de confiabilidade de uma informação. */
export type Reliability =
  | 'confirmado' // reservado/comprado ou visita confirmada
  | 'planejado' // previsto no roteiro
  | 'opcional' // alternativa, só se der tempo
  | 'pendente' // falta comprar/decidir
  | 'visitado' // aconteceu, com data
  | 'relatado' // aconteceu, mas sem data exata
  | 'nao-visitado' // cogitado e não feito (viagens concluídas)

/** Status de uma atração, editável pelos viajantes. */
export type AttractionStatus = 'planejada' | 'reservada' | 'visitada' | 'cancelada'

export type Category =
  | 'museu'
  | 'monumento'
  | 'igreja'
  | 'mercado'
  | 'bairro'
  | 'parque'
  | 'natureza'
  | 'praia'
  | 'compras'
  | 'biblioteca'
  | 'mirante'
  | 'gastronomia'
  | 'cultura'
  | 'hotel'
  | 'estacao'
  | 'aeroporto'

export interface LatLng {
  lat: number
  lng: number
}

export interface SourceLink {
  label: string
  url: string
  /** Data em que a fonte foi consultada (AAAA-MM-DD), quando aplicável. */
  consultedAt?: string
}

export interface Photo {
  src: string
  alt: string
  title: string
  author?: string
  license?: string
  licenseUrl?: string
  sourceUrl?: string
  /** true quando é uma foto adicionada pelos viajantes. */
  own?: boolean
}

export interface Attraction {
  /** Único dentro da viagem, em kebab-case. */
  id: string
  cityId: string
  name: string
  category: Category
  /** Coordenadas aproximadas; nunca inventar — omitir se não souber. */
  coords?: LatLng
  description: string
  address?: string
  /** Horário de funcionamento — só quando verificado em fonte oficial. */
  hours?: string
  tickets: string
  icom?: string
  officialUrl?: string
  /** Título do artigo na Wikipédia (en) para foto e coordenadas. */
  wiki?: string
  optional?: boolean
  /** Em viagens concluídas: o que de fato aconteceu. */
  reliability?: Reliability
  tags?: string[]
  photo?: Photo
}

export interface Hotel {
  cityId: string
  name: string
  nights: number
  checkIn: string
  checkOut: string
  address?: string
  coords?: LatLng
  notes?: string[]
}

export interface Climate {
  minC: number
  maxC: number
  daylight: string
  note: string
}

export interface City {
  id: string
  name: string
  country: string
  /** ISO 3166-1 alfa-2 (BR, PT, ES…). */
  countryCode: string
  flag: string
  timezone: string
  coords: LatLng
  zoom: number
  arrival: string
  departure: string
  nights: number
  /** false para bate-voltas e excursões. */
  isBase: boolean
  tagline: string
  summary: string
  history: string[]
  climate?: Climate
  markets?: { name: string; description: string; status: string }[]
  food: string[]
  curiosities: string[]
  gettingAround: string[]
  links: SourceLink[]
  wiki?: string
  /** Cor de destaque (hex). */
  accent: string
  hero?: Photo
  gallery?: Photo[]
  /** Id da atração cuja foto vira a capa da cidade (script de fotos). */
  heroAttraction?: string
  /** Busca extra no Wikimedia Commons para a galeria (ex.: mercado de Natal). */
  photoSearch?: { query: string; title: string; alt: string }
}

export type ItemKind = 'visita' | 'transporte' | 'refeicao' | 'logistica' | 'livre'

export interface DayItem {
  time?: string
  text: string
  kind: ItemKind
  attractionId?: string
  reliability: Reliability
  note?: string
}

export interface TripDay {
  date: string // AAAA-MM-DD
  /** Id de uma cidade da viagem ou 'voo' para dias de deslocamento longo. */
  cityId: string
  timezone: string
  title: string
  items: DayItem[]
  notes?: string[]
}

export type TransportMode = 'aviao' | 'trem' | 'local' | 'onibus' | 'carro' | 'barco'

export interface TransportLeg {
  id: string
  date: string
  from: string
  to: string
  /** Id de cidade da viagem ou de `extraPlaces`. */
  fromCity?: string
  toCity?: string
  mode: TransportMode
  operator?: string
  service?: string
  departure?: string
  arrival?: string
  travelClass?: string
  seats?: string
  status: 'confirmado' | 'pendente'
  notes?: string[]
}

export type TicketStatus =
  | 'nao-pesquisado'
  | 'pendente'
  | 'em-analise'
  | 'reservado'
  | 'pago'
  | 'concluido'
  | 'cancelado'

export interface Ticket {
  id: string
  cityId: string
  attraction: string
  plannedDate?: string
  time?: string
  ticketType?: string
  unitPrice?: string
  people: number
  icomPossible: string
  officialUrl?: string
  status: TicketStatus
  purchaseDate?: string
  notes?: string
  priority?: boolean
}

export interface ChecklistItem {
  id: string
  label: string
  note?: string
  due?: string
}

export interface ChecklistCategory {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface InfoSection {
  title: string
  items: string[]
  links?: SourceLink[]
}

export type Currency = 'BRL' | 'EUR' | 'GBP' | 'USD' | 'ARS' | 'PYG'

export interface Money {
  amount: number
  currency: Currency
}

export interface Trip {
  /** Usado na URL: #/v/<slug>. */
  slug: string
  title: string
  subtitle: string
  /** Frase curta para o card da viagem. */
  tagline: string
  travelers: string[]
  start: string // AAAA-MM-DD
  end: string // AAAA-MM-DD
  /** Fuso de origem (casa). */
  homeTimezone: string
  /** Emoji de bandeiras ou ícone para o card. */
  emoji: string
  accent: string
  cover?: Photo
  /** Texto de abertura (1–3 parágrafos). */
  intro: string[]
  cities: City[]
  attractions: Attraction[]
  days: TripDay[]
  hotels: Hotel[]
  transport: TransportLeg[]
  /** Pontos fora das cidades da viagem (origem/destino de voos). */
  extraPlaces?: Record<string, { name: string; lat: number; lng: number }>
  tickets?: Ticket[]
  checklist?: ChecklistCategory[]
  info?: InfoSection[]
  /** Ideias que ficaram de fora (para outra viagem). */
  futureIdeas?: { name: string; reason: string }[]
  /** Avisos editoriais (ex.: "Coimbra não foi visitada"). */
  editorialNotes?: string[]
  sources?: SourceLink[]
}
export type CityId = string
