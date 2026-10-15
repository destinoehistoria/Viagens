import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

type Variant = 'icon' | 'ghost' | 'light'

/**
 * Compartilha a página atual (ou `url`). Usa o menu nativo do celular/app instalado
 * (Web Share API) e, quando indisponível, copia o link.
 */
export function ShareButton({ title, text, url, variant = 'ghost', label = 'Compartilhar' }: { title: string; text?: string; url?: string; variant?: Variant; label?: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const link = url ?? window.location.href
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: link })
        return
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copie o link:', link)
    }
  }

  const Icon = copied ? Check : Share2
  if (variant === 'icon') {
    return (
      <button type="button" onClick={share} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label={copied ? 'Link copiado' : `${label}: ${title}`} title={copied ? 'Link copiado' : label}>
        <Icon className="h-5 w-5" aria-hidden />
      </button>
    )
  }
  const cls = variant === 'light' ? 'btn border border-cream/40 text-cream hover:bg-white/10' : 'btn btn-ghost btn-sm'
  return (
    <button type="button" onClick={share} className={cls}>
      <Icon className="h-4 w-4" aria-hidden /> {copied ? 'Link copiado' : label}
      <span role="status" className="sr-only">
        {copied ? 'Link copiado para a área de transferência' : ''}
      </span>
    </button>
  )
}
