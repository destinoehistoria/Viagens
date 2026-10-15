import { lazy, Suspense, useRef, useState } from 'react'
import { Download, Eye, EyeOff, FileUp, Lock, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { activeTrip } from '../data/active'
import { useAuth } from '../lib/auth'
import { Link as RootLink } from 'react-router-dom'
import {
  consolidatedBRL,
  expectedCashback,
  expectedPoints,
  formatMoney,
  formatNumber,
  groupLabel,
  netCost,
  parseFinanceFile,
  pointsUsedByProgram,
  totalsByCurrency,
  type ExchangeRate,
  type FinanceData,
  type FinanceEntry,
} from '../utils/finance'
import { downloadFile, readFileAsText } from '../utils/download'
import { EmptyState, PageHeader, SectionTitle } from '../components/ui'
import type { Currency } from '../types'

const FinanceChart = lazy(() => import('../components/FinanceChart'))
const CURRENCIES: Currency[] = ['BRL', 'EUR', 'GBP', 'USD', 'ARS', 'PYG']

function newEntry(): FinanceEntry {
  return { id: `l-${Date.now().toString(36)}`, grupo: 'alimentacao', descricao: '', moeda: activeTrip?.cities.every((c) => c.countryCode === 'BR') ? 'BRL' : 'EUR', bruto: 0, dinheiroPago: 0, dinheiroAPagar: 0, data: new Date().toISOString().slice(0, 10) }
}

function EntryForm({ initial, onSave, onCancel }: { initial: FinanceEntry; onSave: (e: FinanceEntry) => void; onCancel: () => void }) {
  const [e, setE] = useState(initial)
  const set = <K extends keyof FinanceEntry>(k: K, v: FinanceEntry[K]) => setE((x) => ({ ...x, [k]: v }))
  const num = (k: keyof FinanceEntry, label: string, hint?: string) => (
    <label className="text-sm font-medium">
      {label}
      <input
        type="number"
        step="0.01"
        inputMode="decimal"
        className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3"
        value={(e[k] as number | undefined) ?? ''}
        onChange={(ev) => set(k, (ev.target.value === '' ? undefined : Number(ev.target.value)) as never)}
      />
      {hint && <span className="text-2 text-xs">{hint}</span>}
    </label>
  )
  const inp = 'surface mt-1 block min-h-[44px] w-full rounded-xl px-3'
  return (
    <form
      className="grid gap-3 md:grid-cols-3"
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!e.descricao.trim()) return
        onSave({ ...e, bruto: e.bruto ?? 0, dinheiroPago: e.dinheiroPago ?? 0, dinheiroAPagar: e.dinheiroAPagar ?? 0 })
      }}
    >
      <label className="text-sm font-medium md:col-span-2">
        Descrição *
        <input required className={inp} value={e.descricao} onChange={(ev) => set('descricao', ev.target.value)} />
      </label>
      <label className="text-sm font-medium">
        Categoria
        <select className={inp} value={e.grupo} onChange={(ev) => set('grupo', ev.target.value as FinanceEntry['grupo'])}>
          {Object.entries(groupLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Data
        <input type="date" className={inp} value={e.data ?? ''} onChange={(ev) => set('data', ev.target.value || undefined)} />
      </label>
      <label className="text-sm font-medium">
        Moeda
        <select className={inp} value={e.moeda} onChange={(ev) => set('moeda', ev.target.value as Currency)}>
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      {num('bruto', 'Valor bruto *')}
      {num('desconto', 'Desconto aplicado')}
      {num('credito', 'Crédito utilizado')}
      {num('dinheiroPago', 'Dinheiro pago')}
      {num('dinheiroAPagar', 'Dinheiro a pagar')}
      {num('pontosUtilizados', 'Pontos utilizados')}
      {num('pontosPrevistos', 'Pontos previstos', 'Deixe vazio para estimar pela taxa.')}
      {num('pontosCreditados', 'Pontos creditados')}
      {num('cashbackPrevisto', 'Cashback previsto', 'Vazio = estimativa pelo percentual.')}
      {num('cashbackRecebido', 'Cashback recebido', 'Só informe quando cair na conta.')}
      <label className="text-sm font-medium md:col-span-3">
        Observações
        <input className={inp} value={e.observacoes ?? ''} onChange={(ev) => set('observacoes', ev.target.value || undefined)} />
      </label>
      <div className="flex gap-2 md:col-span-3">
        <button className="btn btn-primary" type="submit">
          Salvar
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export function FinancePage() {
  const auth = useAuth()
  if (auth.available && !auth.member) {
    return (
      <>
        <PageHeader eyebrow="Financeiro" title="Gastos, pontos e cashback" />
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
          <EmptyState icon={<Lock className="h-8 w-8" />} title="Área privada">
            <p>Os valores da viagem só aparecem para os viajantes, depois do login.</p>
            <div className="mt-4">
              <RootLink to="/entrar" className="btn btn-primary">
                Entrar
              </RootLink>
            </div>
          </EmptyState>
        </div>
      </>
    )
  }
  return <FinanceContent />
}

function FinanceContent() {
  const { member } = useAuth()
  const [data, setData] = useLocalStorage<FinanceData | null>('financeiro', null)
  const [hidden, setHidden] = useLocalStorage<boolean>('@financeiro-oculto', false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<FinanceEntry | null>(null)
  const [rate, setRate] = useState<ExchangeRate>({ moeda: 'EUR', valorEmBRL: 0, data: new Date().toISOString().slice(0, 10) })
  const fileRef = useRef<HTMLInputElement>(null)

  const importFile = async (f?: File) => {
    if (!f) return
    setError(null)
    try {
      setData(parseFinanceFile(await readFileAsText(f)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao importar.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const m = (v: number, c: Currency) => (hidden ? '•••••' : formatMoney(v, c))
  const pts = (v: number) => (hidden ? '•••' : formatNumber(v))

  const header = (
    <PageHeader eyebrow="Financeiro" title="Gastos, pontos e cashback">
      Módulo privado: os valores <strong>não fazem parte do site publicado</strong>.{' '}
      {member ? 'Ficam guardados na conta da viagem, visíveis só para os viajantes.' : 'Sem login, ficam somente neste navegador.'}
    </PageHeader>
  )

  const importButton = (
    <label className="btn btn-primary cursor-pointer">
      <FileUp className="h-4 w-4" aria-hidden /> Importar arquivo
      <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => importFile(e.target.files?.[0])} />
    </label>
  )

  if (!data) {
    return (
      <>
        {header}
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
          <EmptyState icon={<Lock className="h-8 w-8" />} title="Nenhum lançamento ainda">
            <p>Lance as despesas uma a uma ou importe um arquivo financeiro (.json) já existente, como o da Europa Natal.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {importButton}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setData({ versao: 1, taxas: [], lancamentos: [] })}
              >
                Começar do zero
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
                {error}
              </p>
            )}
            <p className="mt-4 text-xs">Não registre números de cartão, de reservas ou de documentos.</p>
          </EmptyState>
        </div>
      </>
    )
  }

  const entries = data.lancamentos
  const totals = totalsByCurrency(entries)
  const usedPoints = pointsUsedByProgram(entries)
  const expectedByProgram: Record<string, { value: number; credited: number; estimated: boolean }> = {}
  for (const e of entries) {
    if (!e.pontosPrograma) continue
    const ep = expectedPoints(e)
    const cur = (expectedByProgram[e.pontosPrograma] ??= { value: 0, credited: 0, estimated: false })
    cur.value += ep.value
    cur.credited += e.pontosCreditados ?? 0
    cur.estimated ||= ep.estimated
  }
  const consolidated = consolidatedBRL(totals, data.taxas, 'liquido')
  const update = (next: FinanceData) => setData(next)

  return (
    <>
      {header}
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-8">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => setHidden(!hidden)} aria-pressed={hidden}>
            {hidden ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />} {hidden ? 'Mostrar valores' : 'Ocultar valores'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setEditing(newEntry())}>
            <Plus className="h-4 w-4" aria-hidden /> Nova despesa
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => downloadFile('financeiro.json', JSON.stringify(data, null, 2))}>
            <Download className="h-4 w-4" aria-hidden /> Exportar
          </button>
          {importButton}
          <button type="button" className="btn btn-ghost" onClick={() => confirm('Apagar os dados financeiros deste aparelho?') && setData(null)}>
            <Trash2 className="h-4 w-4" aria-hidden /> Apagar deste aparelho
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">
            {error}
          </p>
        )}

        {editing && (
          <section className="surface rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{entries.some((x) => x.id === editing.id) ? 'Editar lançamento' : 'Nova despesa'}</h2>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-full" onClick={() => setEditing(null)} aria-label="Fechar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <EntryForm
              key={editing.id}
              initial={editing}
              onCancel={() => setEditing(null)}
              onSave={(e) => {
                const exists = entries.some((x) => x.id === e.id)
                update({ ...data, lancamentos: exists ? entries.map((x) => (x.id === e.id ? e : x)) : [...entries, e] })
                setEditing(null)
              }}
            />
          </section>
        )}

        {/* Totais por moeda */}
        <section>
          <SectionTitle eyebrow="Resumo" title="Totais por moeda">
            Valores em moedas diferentes nunca são somados entre si. Um total consolidado em reais só aparece quando houver taxa de câmbio informada, com data, para cada
            moeda.
          </SectionTitle>
          {Object.keys(totals).length === 0 ? (
            <p className="surface text-2 rounded-xl p-4">Nenhum lançamento ainda.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.entries(totals) as [Currency, NonNullable<(typeof totals)[Currency]>][]).map(([cur, t]) => (
                <div key={cur} className="surface rounded-2xl p-5">
                  <p className="text-goldx text-xs font-semibold uppercase tracking-[0.2em]">
                    {cur} · {t.count} lançamento(s)
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                    <dt className="text-2">Valor bruto</dt>
                    <dd className="text-right font-semibold">{m(t.bruto, cur)}</dd>
                    <dt className="text-2">Descontos (pontos)</dt>
                    <dd className="text-right">{m(t.desconto, cur)}</dd>
                    <dt className="text-2">Créditos utilizados</dt>
                    <dd className="text-right">{m(t.credito, cur)}</dd>
                    <dt className="text-2">Dinheiro pago</dt>
                    <dd className="text-right text-emerald-700 dark:text-emerald-300">{m(t.pago, cur)}</dd>
                    <dt className="text-2">Dinheiro a pagar</dt>
                    <dd className="text-right text-amber-700 dark:text-amber-300">{m(t.aPagar, cur)}</dd>
                    <dt className="text-2">Cashback previsto (pendente)</dt>
                    <dd className="text-right">{m(t.cashbackPrevisto, cur)}</dd>
                    <dt className="text-2">Cashback recebido</dt>
                    <dd className="text-right">{m(t.cashbackRecebido, cur)}</dd>
                    <dt className="border-t border-line pt-1 font-semibold">Custo líquido estimado</dt>
                    <dd className="border-t border-line pt-1 text-right font-display text-2xl font-semibold">{m(t.liquido, cur)}</dd>
                  </dl>
                </div>
              ))}
            </div>
          )}
          <p className="text-2 mt-3 text-sm">
            Custo líquido = dinheiro pago + a pagar − cashback <em>recebido</em>. Cashback pendente não é tratado como dinheiro.
            {consolidated !== null && Object.keys(totals).length > 1 && (
              <>
                {' '}
                Total consolidado em BRL (com as taxas abaixo): <strong>{m(consolidated, 'BRL')}</strong>.
              </>
            )}
          </p>
        </section>

        {/* Pontos */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="surface rounded-2xl p-5">
            <h3 className="text-2xl font-semibold">Pontos utilizados</h3>
            {Object.keys(usedPoints).length === 0 ? (
              <p className="text-2 text-sm">Nenhum.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(usedPoints).map(([p, v]) => (
                  <li key={p} className="flex justify-between">
                    <span>{p}</span>
                    <strong>{pts(v)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="surface rounded-2xl p-5">
            <h3 className="text-2xl font-semibold">Pontos a receber</h3>
            {Object.keys(expectedByProgram).length === 0 ? (
              <p className="text-2 text-sm">Nenhum.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(expectedByProgram).map(([p, v]) => (
                  <li key={p} className="flex justify-between gap-2">
                    <span>{p}</span>
                    <span>
                      previstos <strong>{pts(v.value)}</strong>
                      {v.estimated && <em className="text-2"> (estimativa)</em>} · creditados <strong>{pts(v.credited)}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-2 mt-2 text-xs">Estimativas = taxa do programa × valor em dinheiro; sujeitas às regras e à elegibilidade de cada compra.</p>
          </div>
        </section>

        {totals.BRL && (
          <section>
            <SectionTitle eyebrow="Gráfico" title="Hospedagens: valor bruto × dinheiro (BRL)" />
            {hidden ? (
              <p className="surface text-2 rounded-xl p-4">Valores ocultos.</p>
            ) : (
              <Suspense fallback={<div className="surface h-72 animate-pulse rounded-2xl" />}>
                <FinanceChart entries={entries.filter((e) => e.grupo === 'hospedagem' && e.moeda === 'BRL')} />
              </Suspense>
            )}
          </section>
        )}

        {/* Lançamentos */}
        <section>
          <SectionTitle eyebrow="Detalhamento" title="Lançamentos" />
          <div className="space-y-3">
            {entries.map((e) => {
              const ep = expectedPoints(e)
              const ec = expectedCashback(e)
              return (
                <article key={e.id} className="surface rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-2 text-xs font-semibold uppercase tracking-wider">
                        {groupLabel[e.grupo]} · {e.moeda}
                        {e.data && ` · ${e.data.split('-').reverse().join('/')}`}
                      </p>
                      <h3 className="text-xl font-semibold leading-tight">{e.descricao}</h3>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        e.dinheiroAPagar > 0 ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100'
                      }`}
                    >
                      {e.dinheiroAPagar > 0 ? 'A pagar' : 'Pago'}
                    </span>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:grid-cols-4">
                    <dt className="text-2">Bruto</dt>
                    <dd>{m(e.bruto, e.moeda)}</dd>
                    <dt className="text-2">Desconto</dt>
                    <dd>
                      {e.desconto ? m(e.desconto, e.moeda) : '—'}
                      {e.descontoDescricao && <span className="text-2 block text-xs">{e.descontoDescricao}</span>}
                    </dd>
                    <dt className="text-2">Crédito</dt>
                    <dd>
                      {e.credito ? m(e.credito, e.moeda) : '—'}
                      {e.creditoDescricao && <span className="text-2 block text-xs">{e.creditoDescricao}</span>}
                    </dd>
                    <dt className="text-2">Pago</dt>
                    <dd>{m(e.dinheiroPago, e.moeda)}</dd>
                    <dt className="text-2">A pagar</dt>
                    <dd>{m(e.dinheiroAPagar, e.moeda)}</dd>
                    <dt className="text-2">Pontos usados</dt>
                    <dd>{e.pontosUtilizados ? `${pts(e.pontosUtilizados)} ${e.pontosUtilizadosPrograma ?? ''}` : '—'}</dd>
                    <dt className="text-2">Pontos previstos</dt>
                    <dd>
                      {e.pontosPrograma ? (
                        <>
                          {pts(ep.value)} {e.pontosPrograma}
                          {ep.estimated && <span className="text-2 block text-xs">estimativa · {e.pontosTaxa} pts/{e.moeda === 'BRL' ? 'R$' : e.moeda} 1</span>}
                          {e.pontosStatus && <span className="text-2 block text-xs">{e.pontosStatus}</span>}
                        </>
                      ) : (
                        '—'
                      )}
                    </dd>
                    <dt className="text-2">Pontos creditados</dt>
                    <dd>{e.pontosCreditados ? pts(e.pontosCreditados) : '—'}</dd>
                    <dt className="text-2">Cashback previsto</dt>
                    <dd>
                      {e.cashbackPrograma ? (
                        <>
                          {m(ec.value, e.moeda)} {e.cashbackPrograma}
                          <span className="text-2 block text-xs">
                            {ec.estimated && `estimativa · ${e.cashbackPercentual}% · `}
                            {e.cashbackStatus ?? 'pendente'}
                          </span>
                        </>
                      ) : (
                        '—'
                      )}
                    </dd>
                    <dt className="text-2">Cashback recebido</dt>
                    <dd>{e.cashbackRecebido ? m(e.cashbackRecebido, e.moeda) : '—'}</dd>
                    <dt className="text-2 font-semibold">Custo líquido</dt>
                    <dd className="font-semibold">{m(netCost(e), e.moeda)}</dd>
                  </dl>
                  {e.observacoes && <p className="text-2 mt-2 text-sm">{e.observacoes}</p>}
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(e)}>
                      <Pencil className="h-4 w-4" aria-hidden /> Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      aria-label={`Excluir ${e.descricao}`}
                      onClick={() => confirm(`Excluir “${e.descricao}”?`) && update({ ...data, lancamentos: entries.filter((x) => x.id !== e.id) })}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Taxas de câmbio */}
        <section>
          <SectionTitle eyebrow="Câmbio" title="Taxas de conversão informadas">
            Opcional. Informe a taxa e a data de referência para ver um total consolidado em reais. Sem taxa, os valores ficam em suas moedas originais.
          </SectionTitle>
          {data.taxas.length > 0 && (
            <ul className="mb-3 space-y-1 text-sm">
              {data.taxas.map((r, i) => (
                <li key={i} className="surface flex items-center justify-between rounded-xl px-3 py-2">
                  <span>
                    1 {r.moeda} = R$ {r.valorEmBRL.toFixed(4)} em {r.data.split('-').reverse().join('/')} {r.fonte && `(${r.fonte})`}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label="Remover taxa"
                    onClick={() => update({ ...data, taxas: data.taxas.filter((_, j) => j !== i) })}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!rate.valorEmBRL || !rate.data) return
              update({ ...data, taxas: [...data.taxas.filter((x) => x.moeda !== rate.moeda), rate] })
            }}
          >
            <label className="text-sm font-medium">
              Moeda
              <select className="surface mt-1 block min-h-[44px] rounded-xl px-3" value={rate.moeda} onChange={(e) => setRate({ ...rate, moeda: e.target.value as ExchangeRate['moeda'] })}>
                <option>EUR</option>
                <option>GBP</option>
                <option>USD</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Valor em R$
              <input
                type="number"
                step="0.0001"
                min="0"
                required
                className="surface mt-1 block min-h-[44px] w-32 rounded-xl px-3"
                value={rate.valorEmBRL || ''}
                onChange={(e) => setRate({ ...rate, valorEmBRL: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm font-medium">
              Data de referência
              <input type="date" required className="surface mt-1 block min-h-[44px] rounded-xl px-3" value={rate.data} onChange={(e) => setRate({ ...rate, data: e.target.value })} />
            </label>
            <label className="text-sm font-medium">
              Fonte
              <input className="surface mt-1 block min-h-[44px] rounded-xl px-3" value={rate.fonte ?? ''} onChange={(e) => setRate({ ...rate, fonte: e.target.value || undefined })} placeholder="ex.: Banco Central" />
            </label>
            <button className="btn btn-primary" type="submit">
              Salvar taxa
            </button>
          </form>
          <p className="text-2 mt-3 text-xs">
            Não duplique benefícios: se uma compra não permite acumular portal de cashback e pontos, registre apenas o benefício efetivamente válido.
          </p>
        </section>
      </div>
    </>
  )
}
