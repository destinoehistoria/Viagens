import { useCallback, useEffect, useState } from 'react'
import { activeTrip } from '../data/active'
import { pushChange, registerStorage } from '../lib/sync'

const PREFIX = 'vg:'
const EVENT = 'vg-storage'

/**
 * Chaves que começam com "@" são do aparelho (tema, preferências) e não sincronizam.
 * As demais pertencem à viagem ativa: ficam em "vg:<viagem>:<chave>" e sobem para o
 * Supabase quando há login (ver src/lib/sync.ts).
 */
function fullKey(key: string): string {
  if (key.startsWith('@')) return key
  return `${activeTrip?.slug ?? 'sem-viagem'}:${key}`
}

function readFull<T>(full: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + full)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function writeFull(full: string, value: unknown) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(PREFIX + full)
    else localStorage.setItem(PREFIX + full, JSON.stringify(value))
  } catch (err) {
    console.warn('Não foi possível salvar no localStorage', err)
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: full }))
}

registerStorage({
  read: (full) => readFull(full, undefined),
  write: (full, value) => writeFull(full, value),
})

export function readStorage<T>(key: string, fallback: T): T {
  return readFull(fullKey(key), fallback)
}

export function writeStorage<T>(key: string, value: T) {
  const full = fullKey(key)
  const previous = readFull<unknown>(full, undefined)
  writeFull(full, value)
  if (!key.startsWith('@')) void pushChange(full, value, previous)
}

export function removeStorage(key: string) {
  writeStorage(key, null)
}

/** Estado persistido no aparelho, sincronizado entre componentes, abas e (com login) entre os viajantes. */
export function useLocalStorage<T>(key: string, initial: T) {
  const full = fullKey(key)
  const [value, setValue] = useState<T>(() => readFull(full, initial))

  useEffect(() => {
    setValue(readFull(full, initial))
    const onChange = (e: Event) => {
      const k = e instanceof StorageEvent ? e.key?.replace(PREFIX, '') : (e as CustomEvent<string>).detail
      if (k === full) setValue(readFull(full, initial))
    }
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(readFull(full, initial)) : next
      setValue(resolved)
      writeStorage(key, resolved)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [full],
  )

  return [value, set] as const
}
