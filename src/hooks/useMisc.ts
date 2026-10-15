import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { appNow } from '../utils/dates'

/** "Agora" do app, atualizado a cada minuto; respeita ?data=AAAA-MM-DD. */
export function useNow() {
  const { search } = useLocation()
  const [now, setNow] = useState(() => appNow(search.slice(1)))
  useEffect(() => {
    setNow(appNow(search.slice(1)))
    const t = setInterval(() => setNow(appNow(search.slice(1))), 60_000)
    return () => clearInterval(t)
  }, [search])
  return now
}

export function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}
