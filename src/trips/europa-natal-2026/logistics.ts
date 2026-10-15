import type { ChecklistCategory, Ticket, TransportLeg } from '../../types'

/**
 * Deslocamentos. Apenas dados informados pelos viajantes — nenhum aeroporto,
 * companhia, número de trem ou assento foi inferido.
 */
export const transport: TransportLeg[] = [
  { id: 'for-mad', date: '2026-11-26', from: 'Fortaleza', to: 'Madrid', fromCity: 'fortaleza', toCity: 'madrid', mode: 'aviao', operator: 'Iberia', travelClass: 'Executiva', status: 'confirmado', notes: ['Horários conforme bilhete.'] },
  { id: 'mad-bcn', date: '2026-11-27', from: 'Madrid', to: 'Barcelona', fromCity: 'madrid', toCity: 'barcelona', mode: 'trem', operator: 'Iryo', travelClass: 'Infinita', departure: '11:22', arrival: '14:39', status: 'confirmado' },
  { id: 'bcn-par', date: '2026-12-01', from: 'Barcelona', to: 'Paris', fromCity: 'barcelona', toCity: 'paris', mode: 'aviao', departure: '14:10', status: 'confirmado', notes: ['Emitido com Avios. Companhia, aeroportos e horário de chegada: conferir no bilhete.'] },
  { id: 'par-col', date: '2026-12-06', from: 'Paris (Gare de l’Est)', to: 'Colmar', fromCity: 'paris', toCity: 'colmar', mode: 'trem', operator: 'SNCF', service: 'TGV INOUI', departure: '10:43', arrival: '13:06', status: 'confirmado' },
  { id: 'col-sxb', date: '2026-12-09', from: 'Colmar', to: 'Strasbourg', fromCity: 'colmar', toCity: 'strasbourg', mode: 'trem', service: 'TER', status: 'pendente', notes: ['Ainda não comprado. Horário a definir.'] },
  { id: 'sxb-fre', date: '2026-12-12', from: 'Strasbourg', to: 'Freiburg im Breisgau', fromCity: 'strasbourg', toCity: 'freiburg', mode: 'trem', status: 'pendente', notes: ['Via Offenburg, sujeito a horários. Data 12 ou 13/12.'] },
  { id: 'fre-sxb', date: '2026-12-12', from: 'Freiburg im Breisgau', to: 'Strasbourg', fromCity: 'freiburg', toCity: 'strasbourg', mode: 'trem', status: 'pendente', notes: ['Retorno no mesmo dia. Data 12 ou 13/12.'] },
  { id: 'alsacia', date: '2026-12-08', from: 'Colmar', to: 'Eguisheim / Riquewihr', fromCity: 'colmar', mode: 'onibus', status: 'pendente', notes: ['Comparar navetas sazonais, ônibus regulares e excursões. Verificar o calendário de 2026.'] },
  { id: 'sxb-lux', date: '2026-12-14', from: 'Strasbourg', to: 'Luxemburgo', fromCity: 'strasbourg', toCity: 'luxemburgo', mode: 'trem', operator: 'SNCF', service: 'TGV INOUI 9898', departure: '12:31', arrival: '14:15', travelClass: '1ª classe', seats: 'Vagão 11, assentos 174 e 175', status: 'confirmado' },
  { id: 'lux-mad', date: '2026-12-17', from: 'Luxemburgo', to: 'Madrid', fromCity: 'luxemburgo', toCity: 'madrid', mode: 'aviao', operator: 'Ryanair', service: 'FR5055', departure: '20:05', arrival: '22:35', status: 'confirmado', notes: ['Voo direto, já comprado.'] },
  { id: 'mad-gru', date: '2026-12-20', from: 'Madrid', to: 'São Paulo (Guarulhos)', fromCity: 'madrid', toCity: 'saopaulo', mode: 'aviao', status: 'confirmado', notes: ['Horário de saída: conferir no bilhete.'] },
]

/** Coordenadas de referência (centro das cidades) para os pontos de origem/destino fora da Europa. */
export const extraPlaces: Record<string, { name: string; lat: number; lng: number }> = {
  fortaleza: { name: 'Fortaleza', lat: -3.7319, lng: -38.5267 },
  saopaulo: { name: 'São Paulo (Guarulhos)', lat: -23.4356, lng: -46.4731 },
}

/** Ingressos e reservas — sementes iniciais; tudo é editável e salvo no aparelho. */
export const ticketSeeds: Ticket[] = [
  { id: 't-sagrada', cityId: 'barcelona', attraction: 'Sagrada Família', plannedDate: '2026-11-28', people: 2, icomPossible: 'Somente Ricardo, mediante solicitação e confirmação oficial', officialUrl: 'https://sagradafamilia.org/', status: 'pendente', priority: true },
  { id: 't-guell', cityId: 'barcelona', attraction: 'Park Güell — zona monumental', plannedDate: '2026-11-29', people: 2, icomPossible: 'Não presumir', officialUrl: 'https://parkguell.barcelona/', status: 'pendente', priority: true },
  { id: 't-palau', cityId: 'barcelona', attraction: 'Palau de la Música Catalana', plannedDate: '2026-11-30', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://www.palaumusica.cat/', status: 'nao-pesquisado', notes: 'Somente se escolhido.' },
  { id: 't-vicens', cityId: 'barcelona', attraction: 'Casa Vicens ou Casa Batlló', plannedDate: '2026-11-29', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://casavicens.org/', status: 'nao-pesquisado', notes: 'Somente se escolhida.' },
  { id: 't-garnier', cityId: 'paris', attraction: 'Palais Garnier', plannedDate: '2026-12-02', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://www.operadeparis.fr/', status: 'pendente', priority: true },
  { id: 't-grandpalais', cityId: 'paris', attraction: 'Grand Palais (conforme exposição)', plannedDate: '2026-12-03', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://www.grandpalais.fr/', status: 'nao-pesquisado', priority: true },
  { id: 't-unterlinden', cityId: 'colmar', attraction: 'Musée Unterlinden', plannedDate: '2026-12-07', people: 2, icomPossible: 'A confirmar (somente Ricardo)', officialUrl: 'https://www.musee-unterlinden.com/', status: 'pendente', priority: true },
  { id: 't-alsacia', cityId: 'colmar', attraction: 'Passeio aos vilarejos da Alsácia', plannedDate: '2026-12-08', people: 2, icomPossible: 'Não se aplica', status: 'em-analise', priority: true, notes: 'Somente se for contratado.' },
]

export const checklist: ChecklistCategory[] = [
  {
    id: 'documentos',
    title: 'Documentos',
    items: [
      { id: 'passaportes', label: 'Passaportes' },
      { id: 'seguro', label: 'Seguro viagem' },
      { id: 'reservas', label: 'Reservas e bilhetes (cópias offline)' },
      { id: 'migratorio', label: 'Requisitos migratórios vigentes', note: 'Conferir regras de entrada no Espaço Schengen perto da data de partida.' },
      { id: 'icom', label: 'Cartão ICOM do Ricardo' },
    ],
  },
  {
    id: 'ingressos',
    title: 'Ingressos',
    items: [
      { id: 'i-sagrada', label: 'Sagrada Família' },
      { id: 'i-guell', label: 'Park Güell' },
      { id: 'i-garnier', label: 'Palais Garnier' },
      { id: 'i-museus', label: 'Museus selecionados' },
    ],
  },
  {
    id: 'transportes',
    title: 'Transportes',
    items: [
      { id: 'tr-colmar', label: 'Trem Colmar → Strasbourg (09/12)' },
      { id: 'tr-freiburg', label: 'Trens Strasbourg ↔ Freiburg' },
      { id: 'tr-vilarejos', label: 'Transporte para os vilarejos da Alsácia' },
    ],
  },
  {
    id: 'roupas',
    title: 'Roupas e acessórios',
    items: [
      { id: 'termicas', label: 'Roupas térmicas' },
      { id: 'casacos', label: 'Casacos de inverno' },
      { id: 'luvas', label: 'Luvas' },
      { id: 'cachecois', label: 'Cachecóis' },
      { id: 'calcados', label: 'Calçados apropriados' },
      { id: 'gorro', label: 'Gorro de Papai Noel para fotografias natalinas' },
    ],
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    items: [
      { id: 'celulares', label: 'Celulares' },
      { id: 'carregadores', label: 'Carregadores' },
      { id: 'adaptadores', label: 'Adaptadores de tomada' },
      { id: 'powerbank', label: 'Power bank' },
      { id: 'foto', label: 'Equipamentos de fotografia e vídeo' },
    ],
  },
  {
    id: 'tarefas',
    title: 'Outras tarefas',
    items: [
      { id: 'avisar-madrid', label: 'Avisar o chic&basic dot sobre o check-in tardio', due: '2026-12-10', note: 'Sete dias antes da chegada (17/12).' },
      { id: 'horarios-mercados', label: 'Conferir horários dos mercados de Natal' },
      { id: 'clima', label: 'Conferir clima perto da partida' },
      { id: 'mapas-offline', label: 'Baixar mapas offline' },
      { id: 'bagagem', label: 'Verificar regras de bagagem (inclusive Ryanair)' },
    ],
  },
]
