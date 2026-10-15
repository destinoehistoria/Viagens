import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, X } from 'lucide-react'
import type { Photo } from '../types'
import { photoStore, type OwnPhoto } from '../utils/photoStore'
import { resizeImage } from '../utils/download'
import { PhotoView } from './ui'

/** Galeria: fotos licenciadas + fotos próprias dos viajantes (Supabase com login; senão, só neste aparelho). */
export function Gallery({ scope, licensed, title }: { scope: string; licensed: Photo[]; title: string }) {
  const [own, setOwn] = useState<OwnPhoto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [viewer, setViewer] = useState<Photo | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const load = useCallback(() => {
    photoStore
      .list(scope)
      .then(setOwn)
      .catch(() => setOwn([]))
  }, [scope])
  useEffect(load, [load])
  useEffect(() => {
    window.addEventListener('vg-sync', load)
    return () => window.removeEventListener('vg-sync', load)
  }, [load])
  const shared = photoStore.isShared()

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    try {
      for (const f of Array.from(files)) {
        const dataUrl = await resizeImage(f)
        await photoStore.put({ id: `${scope}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, scope, caption: f.name.replace(/\.[^.]+$/, ''), dataUrl, createdAt: new Date().toISOString() })
      }
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível adicionar a foto.')
    }
    if (input.current) input.current.value = ''
  }

  const all: (Photo & { ownId?: string })[] = [
    ...licensed,
    ...own.map((o) => ({ src: o.dataUrl, alt: `Foto dos viajantes: ${o.caption}`, title: o.caption, own: true, ownId: o.id })),
  ]

  return (
    <div>
      {all.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <PhotoView key={i} title={title} />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {all.map((p, i) => (
            <li key={p.src + i} className="group relative overflow-hidden rounded-xl">
              <button type="button" className="block w-full" onClick={() => setViewer(p)} aria-label={`Ampliar: ${p.title}`}>
                <PhotoView photo={p} title={p.title} />
              </button>
              <span className="pointer-events-none absolute left-0 top-0 max-w-full truncate rounded-br-lg bg-black/55 px-2 py-0.5 text-[11px] text-white">{p.title}</span>
              {p.ownId && (
                <button
                  type="button"
                  className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white opacity-90"
                  aria-label={`Remover foto ${p.title}`}
                  onClick={async () => {
                    if (confirm(shared ? 'Remover esta foto para os dois viajantes?' : 'Remover esta foto deste aparelho?')) {
                      await photoStore.remove(p.ownId!)
                      load()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="btn btn-ghost btn-sm cursor-pointer">
          <ImagePlus className="h-4 w-4" aria-hidden /> Adicionar fotos próprias
          <input ref={input} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
        </label>
        <p className="text-2 text-xs">
          {shared ? 'As fotos ficam guardadas na conta da viagem e aparecem para os dois viajantes.' : 'Sem login, as fotos ficam só neste aparelho. Entre para compartilhá-las.'}
        </p>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </p>
      )}
      {viewer && (
        <div role="dialog" aria-modal="true" aria-label={viewer.title} className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={() => setViewer(null)}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Fechar" onClick={() => setViewer(null)} autoFocus>
            <X className="h-6 w-6" aria-hidden />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={viewer.src} alt={viewer.alt} className="max-h-[80vh] w-auto rounded-lg" />
            <figcaption className="mt-2 text-center text-sm text-white/85">
              {viewer.title}
              {!viewer.own && viewer.author && ` — Foto: ${viewer.author}`}
              {viewer.license && ` · ${viewer.license}`}
              {viewer.sourceUrl && (
                <>
                  {' · '}
                  <a className="underline" href={viewer.sourceUrl} target="_blank" rel="noopener noreferrer">
                    fonte
                  </a>
                </>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}
