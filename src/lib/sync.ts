import { supabase } from './supabase'

/**
 * Sincronização do estado da viagem (status, checklist, ingressos, notas, caderno,
 * financeiro) com a tabela `estado` do Supabase.
 *
 * O app continua lendo e gravando no localStorage (funciona offline). Quando há
 * um membro logado, cada gravação também sobe para o Supabase e as alterações do
 * outro viajante chegam em tempo real.
 *
 * Chaves "divididas" guardam um objeto { subchave: valor } e viram uma linha por
 * subchave (ex.: caderno/2026-12-04), para que duas pessoas editando dias ou itens
 * diferentes não sobrescrevam uma à outra.
 */
const SPLIT_KEYS = new Set(['caderno', 'status-atracoes', 'checklist', 'checklist-extra'])
const PENDING = '@pendentes'

type Hooks = {
  read: (fullKey: string) => unknown
  write: (fullKey: string, value: unknown, fromRemote: boolean) => void
}

let hooks: Hooks | null = null
let enabledFor: string | null = null
let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null

export function registerStorage(h: Hooks) {
  hooks = h
}

/** Chave completa do localStorage: "<viagem>:<chave>". */
export const tripKey = (slug: string, key: string) => `${slug}:${key}`

function splitFull(fullKey: string) {
  const i = fullKey.indexOf(':')
  return { slug: fullKey.slice(0, i), key: fullKey.slice(i + 1) }
}

function pending(): Record<string, true> {
  return (hooks?.read(PENDING) as Record<string, true>) ?? {}
}
function setPending(p: Record<string, true>) {
  hooks?.write(PENDING, p, true)
}

type Row = { viagem: string; chave: string; valor: unknown }

function rowsFor(slug: string, key: string, value: unknown, previous: unknown): { upsert: Row[]; remove: string[] } {
  if (!SPLIT_KEYS.has(key)) return { upsert: [{ viagem: slug, chave: key, valor: value ?? null }], remove: [] }
  const next = (value ?? {}) as Record<string, unknown>
  const prev = (previous ?? {}) as Record<string, unknown>
  const upsert = Object.entries(next)
    .filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(prev[k]))
    .map(([k, v]) => ({ viagem: slug, chave: `${key}/${k}`, valor: v }))
  const remove = Object.keys(prev)
    .filter((k) => !(k in next))
    .map((k) => `${key}/${k}`)
  return { upsert, remove }
}

/** Último valor enviado por este aparelho, por chave remota — para ignorar o "eco" do tempo real. */
const lastSent = new Map<string, string>()
/** Gravações aguardando o intervalo de digitação (debounce), com o valor anterior à primeira mudança. */
const timers = new Map<string, { timer: ReturnType<typeof setTimeout>; previous: unknown }>()
const DEBOUNCE_MS = 900

/** Viagem com sincronização ligada (membro logado), ou null. */
export const syncEnabledFor = () => enabledFor

/** Chamado pelo useLocalStorage depois de gravar uma chave da viagem. */
export function pushChange(fullKey: string, _value: unknown, previous: unknown) {
  if (!supabase || !hooks) return
  const { slug } = splitFull(fullKey)
  if (enabledFor !== slug) return
  const t = timers.get(fullKey)
  if (t) clearTimeout(t.timer)
  const first = t ? t.previous : previous
  timers.set(fullKey, {
    previous: first,
    timer: setTimeout(() => {
      timers.delete(fullKey)
      void send(fullKey, hooks?.read(fullKey), first)
    }, DEBOUNCE_MS),
  })
}

async function send(fullKey: string, value: unknown, previous: unknown) {
  if (!supabase || !hooks) return
  const { slug, key } = splitFull(fullKey)
  const { upsert, remove } = rowsFor(slug, key, value, previous)
  for (const r of upsert) lastSent.set(r.chave, JSON.stringify(r.valor))
  try {
    if (upsert.length) {
      const { error } = await supabase.from('estado').upsert(upsert)
      if (error) throw error
    }
    for (const chave of remove) {
      const { error } = await supabase.from('estado').delete().match({ viagem: slug, chave })
      if (error) throw error
    }
  } catch (err) {
    console.warn('Sem conexão com o Supabase; a alteração será enviada depois.', err)
    setPending({ ...pending(), [fullKey]: true })
  }
}

async function flushPending(slug: string) {
  const p = pending()
  const mine = Object.keys(p).filter((k) => splitFull(k).slug === slug)
  if (!mine.length || !supabase || !hooks) return
  for (const fullKey of mine) {
    const { key } = splitFull(fullKey)
    const value = hooks.read(fullKey)
    // Para chaves divididas, reenvia todas as subchaves (sem apagar nada remoto).
    const { upsert } = rowsFor(slug, key, value, undefined)
    if (upsert.length) {
      const { error } = await supabase.from('estado').upsert(upsert)
      if (error) return
    }
    delete p[fullKey]
  }
  setPending(p)
}

function applyRemote(slug: string, chave: string, valor: unknown, deleted = false) {
  if (!hooks) return
  const slash = chave.indexOf('/')
  const base = slash > 0 ? chave.slice(0, slash) : chave
  const fullKey = tripKey(slug, base)
  // Eco da própria gravação, ou chave sendo editada agora neste aparelho: ignora.
  if (!deleted && lastSent.get(chave) === JSON.stringify(valor)) return
  if (timers.has(fullKey)) return
  if (SPLIT_KEYS.has(base) && slash > 0) {
    const sub = chave.slice(slash + 1)
    const cur = { ...((hooks.read(fullKey) as Record<string, unknown>) ?? {}) }
    if (deleted) delete cur[sub]
    else cur[sub] = valor
    hooks.write(fullKey, cur, true)
  } else if (!SPLIT_KEYS.has(base)) {
    hooks.write(fullKey, deleted ? null : valor, true)
  }
}

/**
 * Liga a sincronização de uma viagem: envia o que ficou pendente, baixa o estado
 * remoto e escuta mudanças em tempo real. Chame com null para desligar.
 */
export async function startSync(slug: string | null): Promise<void> {
  try {
    await doStartSync(slug)
  } finally {
    window.dispatchEvent(new CustomEvent('vg-sync', { detail: slug }))
  }
}

async function doStartSync(slug: string | null): Promise<void> {
  if (channel) {
    await supabase?.removeChannel(channel)
    channel = null
  }
  enabledFor = slug
  if (!slug || !supabase || !hooks) return
  await flushPending(slug)
  const { data, error } = await supabase.from('estado').select('chave, valor').eq('viagem', slug)
  if (error || enabledFor !== slug) return
  // Remonta as chaves divididas a partir das linhas.
  const split: Record<string, Record<string, unknown>> = {}
  for (const row of data ?? []) {
    const slash = row.chave.indexOf('/')
    const base = slash > 0 ? row.chave.slice(0, slash) : row.chave
    if (SPLIT_KEYS.has(base) && slash > 0) (split[base] ??= {})[row.chave.slice(slash + 1)] = row.valor
    else if (!SPLIT_KEYS.has(base)) hooks.write(tripKey(slug, base), row.valor, true)
  }
  for (const base of SPLIT_KEYS) {
    const local = (hooks.read(tripKey(slug, base)) as Record<string, unknown>) ?? {}
    const remote = split[base] ?? {}
    // Itens só locais (feitos antes do login) sobem; o remoto prevalece nos demais.
    const onlyLocal = Object.fromEntries(Object.entries(local).filter(([k]) => !(k in remote)))
    hooks.write(tripKey(slug, base), { ...local, ...remote }, true)
    if (Object.keys(onlyLocal).length) await send(tripKey(slug, base), { ...remote, ...onlyLocal }, remote)
  }
  channel = supabase
    .channel(`estado-${slug}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'estado', filter: `viagem=eq.${slug}` }, (payload) => {
      const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as Partial<Row>
      if (row.chave) applyRemote(slug, row.chave, row.valor, payload.eventType === 'DELETE')
    })
    .subscribe()
}
