import { useMemo, useState } from 'react'
import { Link } from '../components/TripLink'
import { AlertTriangle, BedDouble, CheckCircle2, Clock3, Pencil, Plane, Plus, RotateCcw, TrainFront, Bus, Car, Ship, Trash2, X } from 'lucide-react'
import { cities, cityById, hotels, TRIP_END, TRIP_START } from '../data/cities'
import { ticketStatusLabel, transport } from '../data/logistics'
import { useTickets } from '../hooks/useAppState'
import { useHashScroll } from '../hooks/useHashScroll'
import { longDate, shortDate } from '../utils/dates'
import { CopyButton, ExternalLink, PageHeader, Pill, SectionTitle, Stat } from '../components/ui'
import type { CityId, Ticket, TicketStatus, TransportLeg } from '../types'

const ticketCls: Record<TicketStatus, string> = {
  'nao-pesquisado': 'bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-100',
  pendente: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100',
  'em-analise': 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100',
  reservado: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100',
  pago: 'bg-emerald-200 text-emerald-950 dark:bg-emerald-800/60 dark:text-emerald-50',
  concluido: 'bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100',
  cancelado: 'bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-100',
}
const OPEN: TicketStatus[] = ['nao-pesquisado', 'pendente', 'em-analise']

function LegIcon({ leg }: { leg: TransportLeg }) {
  const I = leg.mode === 'aviao' ? Plane : leg.mode === 'onibus' ? Bus : leg.mode === 'carro' ? Car : leg.mode === 'barco' ? Ship : TrainFront
  return <I className="h-5 w-5 text-gold" aria-hidden />
}

function LegCard({ leg }: { leg: TransportLeg }) {
  return (
    <li className="surface rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <LegIcon leg={leg} />
        <div className="flex-1">
          <p className="text-2 text-xs font-semibold uppercase tracking-wider">{longDate(leg.date)}</p>
          <p className="font-display text-2xl font-semibold leading-tight">
            {leg.from} → {leg.to}
          </p>
          <p className="text-2 text-sm">
            {[leg.operator, leg.service, leg.travelClass].filter(Boolean).join(' · ') || ({ aviao: 'Voo', onibus: 'Ônibus / excursão', carro: 'Carro', barco: 'Barco', trem: 'Trem', local: 'Transporte local' } as const)[leg.mode]}
          </p>
          {(leg.departure || leg.arrival) && (
            <p className="mt-1 font-mono text-sm font-semibold">
              {leg.departure?.replace(':', 'h') ?? '—'} → {leg.arrival?.replace(':', 'h') ?? 'chegada conforme bilhete'}
            </p>
          )}
          {leg.seats && <p className="mt-1 text-sm">💺 {leg.seats}</p>}
          {leg.notes?.map((n) => (
            <p key={n} className="text-2 mt-1 text-sm">
              {n}
            </p>
          ))}
        </div>
      </div>
    </li>
  )
}

const emptyTicket = (): Ticket => ({
  id: `t-${Date.now().toString(36)}`,
  cityId: 'barcelona',
  attraction: '',
  people: 2,
  icomPossible: 'A confirmar (somente Ricardo)',
  status: 'nao-pesquisado',
})

function TicketForm({ initial, onSave, onCancel }: { initial: Ticket; onSave: (t: Ticket) => void; onCancel: () => void }) {
  const [t, setT] = useState<Ticket>(initial)
  const f = <K extends keyof Ticket>(k: K, v: Ticket[K]) => setT((x) => ({ ...x, [k]: v }))
  const input = 'surface mt-1 block min-h-[44px] w-full rounded-xl px-3'
  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!t.attraction.trim()) return
        onSave(t)
      }}
    >
      <label className="text-sm font-medium md:col-span-2">
        Atração *
        <input required className={input} value={t.attraction} onChange={(e) => f('attraction', e.target.value)} />
      </label>
      <label className="text-sm font-medium">
        Cidade
        <select className={input} value={t.cityId} onChange={(e) => f('cityId', e.target.value as CityId)}>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Status
        <select className={input} value={t.status} onChange={(e) => f('status', e.target.value as TicketStatus)}>
          {(Object.keys(ticketStatusLabel) as TicketStatus[]).map((s) => (
            <option key={s} value={s}>
              {ticketStatusLabel[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Data planejada
        <input type="date" min={TRIP_START} max={TRIP_END} className={input} value={t.plannedDate ?? ''} onChange={(e) => f('plannedDate', e.target.value || undefined)} />
      </label>
      <label className="text-sm font-medium">
        Horário
        <input type="time" className={input} value={t.time ?? ''} onChange={(e) => f('time', e.target.value || undefined)} />
      </label>
      <label className="text-sm font-medium">
        Tipo de ingresso
        <input className={input} value={t.ticketType ?? ''} onChange={(e) => f('ticketType', e.target.value || undefined)} placeholder="ex.: entrada + torre" />
      </label>
      <label className="text-sm font-medium">
        Valor individual (com moeda)
        <input className={input} value={t.unitPrice ?? ''} onChange={(e) => f('unitPrice', e.target.value || undefined)} placeholder="ex.: € 30,00 (consultado em …)" />
      </label>
      <label className="text-sm font-medium">
        Pessoas
        <input type="number" min={1} max={2} className={input} value={t.people} onChange={(e) => f('people', Math.max(1, +e.target.value || 1))} />
      </label>
      <label className="text-sm font-medium">
        Desconto ICOM
        <input className={input} value={t.icomPossible} onChange={(e) => f('icomPossible', e.target.value)} />
      </label>
      <label className="text-sm font-medium">
        Link oficial
        <input type="url" className={input} value={t.officialUrl ?? ''} onChange={(e) => f('officialUrl', e.target.value || undefined)} placeholder="https://" />
      </label>
      <label className="text-sm font-medium">
        Data de compra
        <input type="date" className={input} value={t.purchaseDate ?? ''} onChange={(e) => f('purchaseDate', e.target.value || undefined)} />
      </label>
      <label className="text-sm font-medium md:col-span-2">
        Observações
        <textarea className="surface mt-1 block w-full rounded-xl p-3" rows={2} value={t.notes ?? ''} onChange={(e) => f('notes', e.target.value || undefined)} />
      </label>
      <p className="text-2 text-xs md:col-span-2">
        Regra ICOM: somente Ricardo possui carteirinha. O desconto nunca é aplicado aos dois viajantes e depende de confirmação da instituição. Não salve números de reserva aqui.
      </p>
      <div className="flex gap-2 md:col-span-2">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function BookingsPage() {
  useHashScroll()
  const { tickets, upsert, remove, reset } = useTickets()
  const [cityF, setCityF] = useState<CityId | 'todas'>('todas')
  const [statusF, setStatusF] = useState<'todos' | 'abertos' | TicketStatus>('todos')
  const [editing, setEditing] = useState<Ticket | null>(null)

  const filtered = useMemo(
    () =>
      tickets
        .filter((t) => cityF === 'todas' || t.cityId === cityF)
        .filter((t) => (statusF === 'todos' ? true : statusF === 'abertos' ? OPEN.includes(t.status) : t.status === statusF))
        .sort((a, b) => (a.plannedDate ?? '9').localeCompare(b.plannedDate ?? '9')),
    [tickets, cityF, statusF],
  )
  const open = tickets.filter((t) => OPEN.includes(t.status))
  const priorityOpen = open.filter((t) => t.priority)
  const confirmed = transport.filter((t) => t.status === 'confirmado')
  const pending = transport.filter((t) => t.status === 'pendente')

  return (
    <>
      <PageHeader eyebrow="Reservas e transportes" title="Hotéis, bilhetes e ingressos">
        Dados de reservas sem números de confirmação, valores ou dados pessoais — o site é público. Os vouchers ficam com os viajantes.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:px-8">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Hotéis confirmados" value={hotels.length} hint="23 noites" />
          <Stat label="Deslocamentos confirmados" value={confirmed.length} />
          <Stat label="Deslocamentos pendentes" value={pending.length} hint="comprar ou definir" />
          <Stat label="Ingressos em aberto" value={open.length} hint={`${priorityOpen.length} prioritários`} />
        </section>

        {/* HOTÉIS */}
        <section>
          <SectionTitle eyebrow="Hospedagem" title="Hotéis reservados" />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <li key={h.cityId} className="surface rounded-2xl p-5">
                <p className="text-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
                  <BedDouble className="h-4 w-4 text-gold" aria-hidden /> {cityById[h.cityId].flag} {cityById[h.cityId].name}
                </p>
                <p className="font-display mt-1 text-2xl font-semibold leading-tight">{h.name}</p>
                <p className="mt-1 text-sm">
                  {shortDate(h.checkIn)} → {shortDate(h.checkOut)} · <strong>{h.nights} noites</strong>
                </p>
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Confirmado
                </p>
                {h.address && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    {h.address} <CopyButton text={h.address} label="Copiar" />
                  </div>
                )}
                {h.notes?.map((n) => (
                  <p key={n} className="text-2 mt-1 text-sm">
                    {n}
                  </p>
                ))}
                <Link to={`/cidades/${h.cityId}`} className="text-accent mt-2 inline-block text-sm underline">
                  Ver cidade e mapa
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* TRANSPORTES */}
        <section id="transportes">
          <SectionTitle eyebrow="Deslocamentos" title="Linha do tempo de transportes">
            Somente dados informados pelos viajantes; companhias, aeroportos e horários não informados aparecem como “conforme bilhete”.
          </SectionTitle>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> Confirmados
              </h3>
              <ol className="space-y-3">
                {confirmed.map((l) => (
                  <LegCard key={l.id} leg={l} />
                ))}
              </ol>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                <Clock3 className="h-5 w-5 text-amber-600" aria-hidden /> Pendentes
              </h3>
              <ol className="space-y-3">
                {pending.map((l) => (
                  <LegCard key={l.id} leg={l} />
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* INGRESSOS */}
        <section id="ingressos">
          <SectionTitle eyebrow="Ingressos" title="Controle de ingressos e reservas">
            Edite status, datas e valores conforme comprar. Os dados ficam salvos apenas neste aparelho. Preços só com data e fonte.
          </SectionTitle>

          {priorityOpen.length > 0 && (
            <div role="status" className="mb-4 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-50">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              <p className="text-sm">
                <strong>{priorityOpen.length} ingresso(s) prioritário(s) em aberto:</strong> {priorityOpen.map((t) => t.attraction).join(', ')}.
              </p>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-sm font-medium">
              Cidade
              <select className="surface mt-1 block min-h-[44px] rounded-xl px-3" value={cityF} onChange={(e) => setCityF(e.target.value as CityId | 'todas')}>
                <option value="todas">Todas</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por status">
              <Pill active={statusF === 'todos'} onClick={() => setStatusF('todos')}>
                Todos
              </Pill>
              <Pill active={statusF === 'abertos'} onClick={() => setStatusF('abertos')}>
                Em aberto
              </Pill>
              {(Object.keys(ticketStatusLabel) as TicketStatus[]).map((s) => (
                <Pill key={s} active={statusF === s} onClick={() => setStatusF(s)}>
                  {ticketStatusLabel[s]}
                </Pill>
              ))}
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing(emptyTicket())}>
              <Plus className="h-4 w-4" aria-hidden /> Novo ingresso
            </button>
          </div>

          {editing && (
            <div className="surface mb-4 rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{tickets.some((t) => t.id === editing.id) ? 'Editar ingresso' : 'Novo ingresso'}</h3>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5" onClick={() => setEditing(null)} aria-label="Fechar formulário">
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <TicketForm
                key={editing.id}
                initial={editing}
                onCancel={() => setEditing(null)}
                onSave={(t) => {
                  upsert(t)
                  setEditing(null)
                }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="surface text-2 rounded-xl p-4">Nenhum ingresso com esses filtros.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {filtered.map((t) => (
                <li key={t.id} className="surface rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                        {cityById[t.cityId].name}
                        {t.plannedDate && ` · ${shortDate(t.plannedDate)}`}
                        {t.time && ` · ${t.time}`}
                        {t.priority && ' · prioritário'}
                      </p>
                      <p className="font-display text-xl font-semibold leading-tight">{t.attraction}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ticketCls[t.status]}`}>{ticketStatusLabel[t.status]}</span>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    <dt className="text-2">Pessoas</dt>
                    <dd>{t.people}</dd>
                    <dt className="text-2">Tipo</dt>
                    <dd>{t.ticketType ?? '—'}</dd>
                    <dt className="text-2">Valor individual</dt>
                    <dd>{t.unitPrice ?? 'A confirmar'}</dd>
                    <dt className="text-2">ICOM</dt>
                    <dd>{t.icomPossible}</dd>
                    <dt className="text-2">Compra</dt>
                    <dd>{t.purchaseDate ? shortDate(t.purchaseDate) : '—'}</dd>
                  </dl>
                  {t.notes && <p className="text-2 mt-2 text-sm">{t.notes}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(t)}>
                      <Pencil className="h-4 w-4" aria-hidden /> Editar
                    </button>
                    {t.officialUrl && (
                      <ExternalLink href={t.officialUrl} className="btn btn-ghost btn-sm no-underline">
                        Site oficial
                      </ExternalLink>
                    )}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => confirm(`Remover “${t.attraction}”?`) && remove(t.id)}
                      aria-label={`Remover ${t.attraction}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={() => confirm('Restaurar a lista original de ingressos? Edições serão perdidas.') && reset()}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Restaurar lista original
          </button>
        </section>
      </div>
    </>
  )
}
