import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Rola até o elemento indicado após o segundo “#” da URL (ex.: #/cidades/paris#atracao-x). */
export function useHashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        el.classList.add('ring-2', 'ring-gold')
        setTimeout(() => el.classList.remove('ring-2', 'ring-gold'), 2000)
      }
    }, 80)
    return () => clearTimeout(t)
  }, [hash, pathname])
}
