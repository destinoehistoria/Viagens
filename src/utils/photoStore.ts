import { activeTrip } from '../data/active'
import { supabase } from '../lib/supabase'
import { syncEnabledFor } from '../lib/sync'

/**
 * Fotos dos viajantes.
 * - Com login de membro: Supabase Storage (bucket privado "fotos") + tabela `fotos`,
 *   compartilhadas entre os viajantes e todos os aparelhos.
 * - Sem login: IndexedDB do navegador (somente neste aparelho).
 * O `scope` é a cidade ou o dia do caderno; a viagem ativa é acrescentada aqui.
 */
export interface OwnPhoto {
  id: string
  /** cidade ou data do caderno à qual a foto pertence */
  scope: string
  caption: string
  /** data: URL (local) ou URL assinada temporária (Supabase) */
  dataUrl: string
  createdAt: string
  author?: string
}

const DB = 'vg-fotos'
const STORE = 'fotos'
const BUCKET = 'fotos'

const slug = () => activeTrip?.slug ?? 'sem-viagem'
const remote = () => (supabase && syncEnabledFor() === slug() ? supabase : null)

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB indisponível neste navegador.'))
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      const s = req.result.createObjectStore(STORE, { keyPath: 'id' })
      s.createIndex('scope', 'scope')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const r = fn(t.objectStore(STORE))
        r.onsuccess = () => resolve(r.result)
        r.onerror = () => reject(r.error)
      }),
  )
}

const local = {
  list: (scope?: string) =>
    tx<OwnPhoto[]>('readonly', (s) => (scope ? s.index('scope').getAll(`${slug()}/${scope}`) : s.getAll())).then((l) =>
      l
        .filter((p) => p.scope.startsWith(`${slug()}/`))
        .map((p) => ({ ...p, scope: p.scope.slice(slug().length + 1) }))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    ),
  put: (p: OwnPhoto) => tx('readwrite', (s) => s.put({ ...p, scope: `${slug()}/${p.scope}` })),
  remove: (id: string) => tx('readwrite', (s) => s.delete(id)),
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob()
}

type FotoRow = { id: string; escopo: string; legenda: string | null; caminho: string; criado_em: string; criado_por: string | null }

export const photoStore = {
  /** true quando as fotos estão indo para a nuvem (compartilhadas). */
  isShared: () => Boolean(remote()),

  async list(scope?: string): Promise<OwnPhoto[]> {
    const sb = remote()
    if (!sb) return local.list(scope)
    let q = sb.from('fotos').select('id, escopo, legenda, caminho, criado_em, criado_por').eq('viagem', slug()).order('criado_em')
    if (scope) q = q.eq('escopo', scope)
    const { data, error } = await q
    if (error) throw error
    const rows = (data ?? []) as FotoRow[]
    if (!rows.length) return []
    const { data: signed } = await sb.storage.from(BUCKET).createSignedUrls(
      rows.map((r) => r.caminho),
      60 * 60 * 6,
    )
    const urls = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]))
    return rows.map((r) => ({
      id: r.id,
      scope: r.escopo,
      caption: r.legenda ?? '',
      dataUrl: urls.get(r.caminho) ?? '',
      createdAt: r.criado_em,
      author: r.criado_por ?? undefined,
    }))
  },

  async put(p: OwnPhoto): Promise<void> {
    const sb = remote()
    if (!sb) {
      await local.put(p)
      return
    }
    const caminho = `${slug()}/${p.scope}/${p.id}.jpg`
    const blob = /^data:/.test(p.dataUrl) ? await dataUrlToBlob(p.dataUrl) : await (await fetch(p.dataUrl)).blob()
    const up = await sb.storage.from(BUCKET).upload(caminho, blob, { contentType: blob.type || 'image/jpeg', upsert: true })
    if (up.error) throw up.error
    const { error } = await sb.from('fotos').upsert({ id: p.id, viagem: slug(), escopo: p.scope, legenda: p.caption, caminho, criado_em: p.createdAt })
    if (error) throw error
  },

  async remove(id: string): Promise<void> {
    const sb = remote()
    if (!sb) {
      await local.remove(id)
      return
    }
    const { data } = await sb.from('fotos').select('caminho').eq('id', id).maybeSingle()
    if (data?.caminho) await sb.storage.from(BUCKET).remove([data.caminho])
    const { error } = await sb.from('fotos').delete().eq('id', id)
    if (error) throw error
  },

  /** Fotos guardadas só neste aparelho (para enviar à nuvem depois do login). */
  listLocal: (scope?: string) => local.list(scope).catch(() => [] as OwnPhoto[]),
  removeLocal: (id: string) => local.remove(id),
}
