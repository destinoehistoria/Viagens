import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link, Navigate } from '../components/TripLink'
import { BookHeart, Download, FileJson, FileText, Upload } from 'lucide-react'
import { itinerary, dayByDate } from '../data/itinerary'
import { activeTrip } from '../data/active'
import { attractionById } from '../data/attractions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { longDate, shortDate } from '../utils/dates'
import { downloadFile, readFileAsText } from '../utils/download'
import { photoStore, type OwnPhoto } from '../utils/photoStore'
import { Gallery } from '../components/Gallery'
import { PageHeader } from '../components/ui'
import { dayLabel } from '../components/DayView'

export interface JournalEntry {
  visited: Record<string, boolean>
  extraPlaces: string
  story: string
  restaurants: string
  curiosities: string
  expenses: string
  tickets: string
  differences: string
  updatedAt?: string
}

export type Journal = Record<string, JournalEntry>

const empty = (): JournalEntry => ({ visited: {}, extraPlaces: '', story: '', restaurants: '', curiosities: '', expenses: '', tickets: '', differences: '' })

const fields: { key: keyof Omit<JournalEntry, 'visited' | 'updatedAt'>; label: string; placeholder: string }[] = [
  { key: 'story', label: 'Relato e impressões', placeholder: 'Como foi o dia? O que marcou?' },
  { key: 'extraPlaces', label: 'Outros lugares visitados (fora do roteiro)', placeholder: 'Um por linha' },
  { key: 'restaurants', label: 'Restaurantes e pratos', placeholder: 'Onde comemos, o que pedimos, vale voltar?' },
  { key: 'curiosities', label: 'Curiosidades históricas', placeholder: 'Algo aprendido em um museu, placa ou guia' },
  { key: 'expenses', label: 'Despesas do dia', placeholder: 'ex.: almoço € 38; metrô € 4,30 (lance também no Financeiro, se quiser)' },
  { key: 'tickets', label: 'Ingressos e experiências', placeholder: 'Filas, horários reais, dicas' },
  { key: 'differences', label: 'Diferenças entre planejado e realizado', placeholder: 'O que mudou e por quê' },
]

/** Exporta o caderno em Markdown, separando planejado de efetivamente visitado. */
export function journalToMarkdown(journal: Journal): string {
  const out: string[] = [`# Caderno de Viagem — ${activeTrip?.title ?? ''}`, '']
  for (const d of itinerary) {
    const e = journal[d.date]
    if (!e) continue
    out.push(`## ${shortDate(d.date)} — ${dayLabel(d)}: ${d.title}`, '')
    const planned = d.items.filter((i) => i.attractionId).map((i) => i.attractionId!)
    const visited = planned.filter((id) => e.visited[id])
    const notVisited = planned.filter((id) => !e.visited[id])
    if (visited.length) out.push('**Visitado (real):** ' + visited.map((id) => attractionById[id]?.name ?? id).join(', '), '')
    if (notVisited.length) out.push('**Planejado e não visitado:** ' + notVisited.map((id) => attractionById[id]?.name ?? id).join(', '), '')
    for (const f of fields) if (e[f.key]?.trim()) out.push(`### ${f.label}`, '', e[f.key].trim(), '')
  }
  return out.join('\n')
}

export function JournalPage() {
  const { date } = useParams()
  const [journal, setJournal] = useLocalStorage<Journal>('caderno', {})
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  if (date && !dayByDate[date]) return <Navigate to="/caderno" replace />

  const exportJson = async () => {
    let photos: OwnPhoto[] = []
    try {
      photos = await photoStore.list()
    } catch {
      /* sem IndexedDB */
    }
    downloadFile(`caderno-${activeTrip?.slug}-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ versao: 1, caderno: journal, fotos: photos }, null, 2))
  }

  const importJson = async (f?: File) => {
    if (!f) return
    try {
      const data = JSON.parse(await readFileAsText(f)) as { versao?: number; caderno?: Journal; fotos?: OwnPhoto[] }
      if (data.versao !== 1 || typeof data.caderno !== 'object') throw new Error('Arquivo não reconhecido.')
      if (!confirm('Importar irá mesclar os registros do arquivo com os deste aparelho (o arquivo prevalece em dias repetidos). Continuar?')) return
      setJournal({ ...journal, ...data.caderno })
      for (const p of data.fotos ?? []) await photoStore.put(p)
      setMsg(`Importado: ${Object.keys(data.caderno ?? {}).length} dia(s) e ${(data.fotos ?? []).length} foto(s).`)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Falha ao importar.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const toolbar = (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn btn-ghost btn-sm" onClick={exportJson}>
        <FileJson className="h-4 w-4" aria-hidden /> Exportar JSON (com fotos)
      </button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadFile(`caderno-${activeTrip?.slug}.md`, journalToMarkdown(journal), 'text/markdown')}>
        <FileText className="h-4 w-4" aria-hidden /> Exportar Markdown
      </button>
      <label className="btn btn-ghost btn-sm cursor-pointer">
        <Upload className="h-4 w-4" aria-hidden /> Importar JSON
        <input ref={fileRef} type="file" accept=".json,application/json" className="sr-only" onChange={(e) => importJson(e.target.files?.[0])} />
      </label>
    </div>
  )

  if (!date) {
    return (
      <>
        <PageHeader eyebrow="Caderno de Viagem" title="Do roteiro à memória">
          Registre o que de fato aconteceu em cada dia. O caderno é separado do roteiro planejado. Com login, os dois escrevem e veem tudo sincronizado, inclusive
          as fotos; sem login, fica só neste aparelho.
        </PageHeader>
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
          {toolbar}
          {msg && (
            <p role="status" className="surface rounded-xl p-3 text-sm">
              {msg}
            </p>
          )}
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {itinerary.map((d) => {
              const e = journal[d.date]
              const visitedCount = e ? Object.values(e.visited).filter(Boolean).length : 0
              const has = e && (visitedCount > 0 || fields.some((f) => e[f.key]?.trim()))
              return (
                <li key={d.date}>
                  <Link to={`/caderno/${d.date}`} className={`surface block rounded-2xl p-4 transition hover:border-gold ${has ? 'border-l-4 border-l-gold' : ''}`}>
                    <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                      {shortDate(d.date)} · {dayLabel(d)}
                    </p>
                    <p className="font-display text-xl font-semibold">{d.title}</p>
                    <p className="text-2 mt-1 text-sm">
                      {has ? `${visitedCount} lugar(es) marcados como visitados${e?.story ? ' · com relato' : ''}` : 'Sem registros ainda'}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </>
    )
  }

  const day = dayByDate[date]
  const entry = journal[date] ?? empty()
  const save = (patch: Partial<JournalEntry>) => setJournal({ ...journal, [date]: { ...entry, ...patch, updatedAt: new Date().toISOString() } })
  const planned = day.items.filter((i) => i.attractionId && attractionById[i.attractionId])
  const idx = itinerary.indexOf(day)

  return (
    <>
      <PageHeader eyebrow={`Caderno · ${dayLabel(day)}`} title={day.title}>
        <span className="block first-letter:uppercase">{longDate(day.date)}</span>
      </PageHeader>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link to="/caderno" className="text-accent text-sm underline">
            ← Todos os dias
          </Link>
          <Link to={`/roteiro/${day.date}`} className="text-accent text-sm underline">
            Ver o planejado para este dia
          </Link>
        </div>

        <section className="surface rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <BookHeart className="h-5 w-5 text-gold" aria-hidden /> Lugares efetivamente visitados
          </h2>
          <p className="text-2 mb-3 text-sm">Marque apenas o que foi realmente visitado — o planejado continua no roteiro.</p>
          {planned.length === 0 ? (
            <p className="text-2 text-sm">Nenhuma atração planejada neste dia.</p>
          ) : (
            <ul className="grid gap-1 sm:grid-cols-2">
              {planned.map((i) => (
                <li key={i.attractionId}>
                  <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-1 hover:bg-surface-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-[#176B65]"
                      checked={!!entry.visited[i.attractionId!]}
                      onChange={(e) => save({ visited: { ...entry.visited, [i.attractionId!]: e.target.checked } })}
                    />
                    {attractionById[i.attractionId!].name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        {fields.map((f) => (
          <section key={f.key}>
            <label htmlFor={`f-${f.key}`} className="font-display mb-1 block text-2xl font-semibold">
              {f.label}
            </label>
            <textarea
              id={`f-${f.key}`}
              rows={f.key === 'story' ? 6 : 3}
              value={entry[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => save({ [f.key]: e.target.value } as Partial<JournalEntry>)}
              className="surface w-full rounded-2xl p-4 text-base"
            />
          </section>
        ))}

        <section>
          <h2 className="font-display mb-2 text-2xl font-semibold">Fotografias do dia</h2>
          <Gallery scope={`dia-${day.date}`} licensed={[]} title={day.title} />
        </section>

        {entry.updatedAt && <p className="text-2 text-xs">Salvo automaticamente em {new Date(entry.updatedAt).toLocaleString('pt-BR')}.</p>}

        <div className="flex justify-between">
          {itinerary[idx - 1] ? (
            <Link className="btn btn-ghost btn-sm" to={`/caderno/${itinerary[idx - 1].date}`}>
              ← {shortDate(itinerary[idx - 1].date)}
            </Link>
          ) : (
            <span />
          )}
          {itinerary[idx + 1] && (
            <Link className="btn btn-ghost btn-sm" to={`/caderno/${itinerary[idx + 1].date}`}>
              {shortDate(itinerary[idx + 1].date)} →
            </Link>
          )}
        </div>
        <div className="border-t border-line pt-4">{toolbar}</div>
        <p className="text-2 flex items-center gap-1 text-xs">
          <Download className="h-3.5 w-3.5" aria-hidden /> Dica: exporte o JSON periodicamente durante a viagem como cópia de segurança.
        </p>
      </div>
    </>
  )
}
