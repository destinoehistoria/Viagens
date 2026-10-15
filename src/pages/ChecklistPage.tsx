import { activeTrip } from '../data/active'
import { useId, useState } from 'react'
import { CalendarClock, Plus, Trash2 } from 'lucide-react'
import { checklist } from '../data/logistics'
import { useChecklist } from '../hooks/useAppState'
import { useNow } from '../hooks/useMisc'
import { daysBetween, localDate, shortDate } from '../utils/dates'
import { PageHeader } from '../components/ui'

function AddItem({ onAdd }: { onAdd: (label: string) => void }) {
  const [v, setV] = useState('')
  const id = useId()
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (v.trim()) {
          onAdd(v.trim())
          setV('')
        }
      }}
    >
      <label className="sr-only" htmlFor={id}>
        Novo item
      </label>
      <input id={id} value={v} onChange={(e) => setV(e.target.value)} placeholder="Adicionar item…" className="surface min-h-[44px] flex-1 rounded-xl px-3 text-sm" />
      <button className="btn btn-ghost btn-sm" type="submit" aria-label="Adicionar item">
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </form>
  )
}

export function ChecklistPage() {
  const { done, toggle, custom, addCustom, removeCustom } = useChecklist()
  const now = useNow()
  const today = localDate(now, activeTrip?.homeTimezone ?? 'America/Sao_Paulo')
  const all = [...checklist.flatMap((c) => c.items), ...Object.values(custom).flat()]
  const doneCount = all.filter((i) => done[i.id]).length
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0

  return (
    <>
      <PageHeader eyebrow="Preparativos" title="Checklist de viagem">
        Marque o que já foi resolvido. Com login, o progresso aparece para os dois viajantes; sem login, fica só neste aparelho.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="surface mb-6 rounded-2xl p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl font-semibold">
              {doneCount} de {all.length}
            </p>
            <p className="text-2 text-sm">{pct}% concluído</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do checklist">
            <div className="h-full bg-petrol transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checklist.map((cat) => {
            const items = [...cat.items, ...(custom[cat.id] ?? [])]
            const n = items.filter((i) => done[i.id]).length
            return (
              <section key={cat.id} className="surface rounded-2xl p-5" aria-labelledby={`cat-${cat.id}`}>
                <h2 id={`cat-${cat.id}`} className="flex items-baseline justify-between text-2xl font-semibold">
                  {cat.title}
                  <span className="text-2 font-sans text-xs font-medium">
                    {n}/{items.length}
                  </span>
                </h2>
                <ul className="mt-3 space-y-1">
                  {items.map((it) => {
                    const due = 'due' in it ? (it as { due?: string }).due : undefined
                    const note = 'note' in it ? (it as { note?: string }).note : undefined
                    const isCustom = (custom[cat.id] ?? []).some((c) => c.id === it.id)
                    const daysToDue = due ? daysBetween(today, due) : null
                    return (
                      <li key={it.id} className="flex items-start gap-2">
                        <label className="flex min-h-[44px] flex-1 cursor-pointer items-start gap-3 rounded-lg px-1 py-2 hover:bg-surface-2">
                          <input type="checkbox" checked={!!done[it.id]} onChange={() => toggle(it.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#176B65]" />
                          <span className={done[it.id] ? 'text-2 line-through' : ''}>
                            {it.label}
                            {note && <span className="text-2 block text-xs">{note}</span>}
                            {due && (
                              <span
                                className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  !done[it.id] && daysToDue !== null && daysToDue <= 3
                                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100'
                                    : 'bg-surface-2'
                                }`}
                              >
                                <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Prazo: {shortDate(due)}
                                {!done[it.id] && daysToDue !== null && (daysToDue >= 0 ? ` (em ${daysToDue} dias)` : ' (atrasado)')}
                              </span>
                            )}
                          </span>
                        </label>
                        {isCustom && (
                          <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-2" aria-label={`Remover ${it.label}`} onClick={() => removeCustom(cat.id, it.id)}>
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
                <AddItem onAdd={(l) => addCustom(cat.id, l)} />
              </section>
            )
          })}
        </div>
        <p className="text-2 mt-6 text-sm">
          O app mostra prazos, mas não envia notificações automáticas. Para itens com prazo, crie também um lembrete no celular.
        </p>
      </div>
    </>
  )
}
