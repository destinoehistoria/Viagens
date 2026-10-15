import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthState {
  /** false enquanto o Supabase não estiver configurado. */
  available: boolean
  loading: boolean
  session: Session | null
  email: string | null
  /** O e-mail está na lista de membros (pode ler e gravar os dados privados). */
  member: boolean
  sendLink: (email: string) => Promise<void>
  verifyCode: (email: string, code: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function redirectUrl() {
  return window.location.href.split('#')[0].split('?')[0]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [member, setMember] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      // Remove ?code=… da barra de endereço depois do login por link.
      if (s && window.location.search.includes('code=')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash)
      }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) {
      setMember(false)
      return
    }
    let alive = true
    supabase.rpc('eh_membro').then(({ data, error }) => {
      if (alive) setMember(!error && data === true)
    })
    return () => {
      alive = false
    }
  }, [session])

  const value: AuthState = {
    available: Boolean(supabase),
    loading,
    session,
    email: session?.user.email ?? null,
    member,
    sendLink: async (email) => {
      if (!supabase) throw new Error('Login ainda não configurado.')
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl() } })
      if (error) throw error
    },
    verifyCode: async (email, code) => {
      if (!supabase) throw new Error('Login ainda não configurado.')
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
      if (error) throw error
    },
    signOut: async () => {
      await supabase?.auth.signOut()
    },
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora do AuthProvider')
  return ctx
}
