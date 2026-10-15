import { useState, type ReactNode } from 'react'
import { Check, Copy, ExternalLink as ExtIcon, ImageOff } from 'lucide-react'
import type { AttractionStatus, Photo, Reliability } from '../types'

export const reliabilityMeta: Record<Reliability, { label: string; cls: string; help: string }> = {
  confirmado: { label: 'Confirmado', cls: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100', help: 'Hotel, voo ou trem efetivamente reservado.' },
  planejado: { label: 'Planejado', cls: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100', help: 'Incluído no roteiro, sem reserva.' },
  opcional: { label: 'Opcional', cls: 'bg-stone-200 text-stone-800 dark:bg-stone-700/60 dark:text-stone-100', help: 'Alternativa de passeio.' },
  pendente: { label: 'Pendente', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100', help: 'Exige compra, confirmação ou pesquisa.' },
  visitado: { label: 'Visitado', cls: 'bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100', help: 'Registrado após a experiência real.' },
  relatado: { label: 'Relatado', cls: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-100', help: 'Aconteceu, mas sem data exata registrada.' },
  'nao-visitado': { label: 'Não visitado', cls: 'bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-100', help: 'Cogitado, mas não fez parte da viagem realizada.' },
}

export function ReliabilityBadge({ value }: { value: Reliability }) {
  const m = reliabilityMeta[value]
  return (
    <span title={m.help} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${m.cls}`}>
      {m.label}
    </span>
  )
}

export const statusMeta: Record<AttractionStatus, { label: string; cls: string }> = {
  planejada: { label: 'Planejada', cls: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100' },
  reservada: { label: 'Reservada', cls: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100' },
  visitada: { label: 'Visitada', cls: 'bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100' },
  cancelada: { label: 'Cancelada', cls: 'bg-rose-100 text-rose-900 line-through dark:bg-rose-900/50 dark:text-rose-100' },
}

export function StatusSelect({ value, onChange, label }: { value: AttractionStatus; onChange: (v: AttractionStatus) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span className="sr-only">Status de {label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AttractionStatus)}
        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${statusMeta[value].cls}`}
      >
        {(Object.keys(statusMeta) as AttractionStatus[]).map((s) => (
          <option key={s} value={s}>
            {statusMeta[s].label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function SectionTitle({ eyebrow, title, children, id }: { eyebrow?: string; title: string; children?: ReactNode; id?: string }) {
  return (
    <header className="mb-5" id={id}>
      {eyebrow && <p className="text-goldx mb-1 text-xs font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
      {children && <div className="text-2 mt-2 max-w-3xl">{children}</div>}
    </header>
  )
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="twinkle-dots relative overflow-hidden bg-navy px-4 pb-10 pt-10 text-cream md:px-8 md:pt-14">
      <div className="mx-auto max-w-6xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
        {children && <div className="mt-3 max-w-3xl text-cream/85">{children}</div>}
      </div>
    </header>
  )
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="surface flex flex-col items-center rounded-2xl px-6 py-10 text-center">
      {icon && <div className="text-goldx mb-3">{icon}</div>}
      <p className="font-display text-2xl font-semibold">{title}</p>
      {children && <div className="text-2 mt-2 max-w-md text-sm">{children}</div>}
    </div>
  )
}

export function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`text-accent inline-flex items-center gap-1 underline-offset-2 hover:underline ${className}`}>
      {children}
      <ExtIcon aria-hidden className="h-3.5 w-3.5" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  )
}

export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setOk(true)
          setTimeout(() => setOk(false), 1500)
        } catch {
          window.prompt('Copie o texto:', text)
        }
      }}
      aria-label={`${label}: ${text}`}
    >
      {ok ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {ok ? 'Copiado' : label}
    </button>
  )
}

/** Fotografia com crédito; sem foto licenciada, mostra um placeholder elegante. */
export function PhotoView({
  photo,
  title,
  className = '',
  ratio = 'aspect-[4/3]',
  showCredit = true,
  eager = false,
}: {
  photo?: Photo
  title: string
  className?: string
  ratio?: string
  showCredit?: boolean
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (!photo || failed) {
    return (
      <div
        role="img"
        aria-label={`${title}: imagem pendente`}
        className={`twinkle-dots relative flex ${ratio} w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-2 to-petrol p-4 text-center ${className}`}
      >
        <ImageOff className="mb-2 h-6 w-6 text-gold/80" aria-hidden />
        <span className="font-display text-xl leading-tight text-cream">{title}</span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold/90">Imagem licenciada pendente</span>
      </div>
    )
  }
  return (
    <figure className={`relative ${ratio} w-full overflow-hidden ${className}`}>
      <img
        src={photo.src}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {showCredit && <PhotoCredit photo={photo} />}
    </figure>
  )
}

export function PhotoCredit({ photo }: { photo: Photo }) {
  return (
    <figcaption className="absolute bottom-0 right-0 max-w-full truncate rounded-tl-lg bg-black/55 px-2 py-0.5 text-[10px] text-white/90">
      {photo.own ? (
        'Foto dos viajantes'
      ) : (
        <>
          {photo.author ? `Foto: ${photo.author}` : 'Autor na fonte'}
          {photo.license && <> · {photo.license}</>}
          {photo.sourceUrl && (
            <>
              {' · '}
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                fonte
              </a>
            </>
          )}
        </>
      )}
    </figcaption>
  )
}

export function Pill({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[36px] whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition ${
        active ? 'border-petrol bg-petrol text-white' : 'border-line surface hover:border-gold'
      }`}
    >
      {children}
    </button>
  )
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="surface rounded-2xl p-4">
      <p className="text-2 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="font-display mt-1 text-3xl font-semibold leading-none">{value}</p>
      {hint && <p className="text-2 mt-1 text-xs">{hint}</p>}
    </div>
  )
}
