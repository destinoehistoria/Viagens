import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { EmptyState, PageHeader } from '../components/ui'

export function LoginPage() {
  const { available, loading, email, member, sendLink, verifyCode, signOut } = useAuth()
  const [address, setAddress] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setMsg(null)
    try {
      await fn()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  if (!available) {
    return (
      <>
        <PageHeader eyebrow="Conta" title="Entrar" />
        <div className="mx-auto max-w-xl px-4 py-10">
          <EmptyState icon={<Cloud className="h-8 w-8" />} title="Login ainda não configurado">
            Os roteiros já funcionam. A sincronização do caderno, das fotos e do financeiro entre os dois viajantes começa quando o Supabase for conectado.
          </EmptyState>
        </div>
      </>
    )
  }

  if (loading) return <div className="mx-auto max-w-xl px-4 py-20 text-center">Carregando…</div>

  if (email) {
    return (
      <>
        <PageHeader eyebrow="Conta" title="Você está conectado" />
        <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
          <div className="surface rounded-2xl p-5">
            <p className="text-2 text-sm">E-mail</p>
            <p className="font-display text-2xl font-semibold">{email}</p>
            {member ? (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-100 p-3 text-sm text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-50">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> Caderno, fotos, checklist, reservas e financeiro estão sincronizando entre os viajantes.
              </p>
            ) : (
              <p className="mt-3 rounded-xl bg-amber-100 p-3 text-sm text-amber-950 dark:bg-amber-900/40 dark:text-amber-50">
                Este e-mail ainda não está na lista de viajantes, então nada é sincronizado. Peça para incluí-lo na tabela de membros.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="btn btn-primary">
              Ver as viagens
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => run(signOut)} disabled={busy}>
              <LogOut className="h-4 w-4" aria-hidden /> Sair
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow="Conta" title="Entrar">
        Para escrever o caderno, guardar fotos e ver o financeiro, entre com o seu e-mail. Não há senha: chega um link (e um código) no e-mail.
      </PageHeader>
      <div className="mx-auto max-w-xl px-4 py-10">
        {!sent ? (
          <form
            className="surface space-y-4 rounded-2xl p-5"
            onSubmit={(e) => {
              e.preventDefault()
              void run(async () => {
                await sendLink(address.trim())
                setSent(true)
              })
            }}
          >
            <label className="block text-sm font-medium">
              E-mail
              <input
                type="email"
                required
                autoComplete="email"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3 text-base"
                placeholder="voce@exemplo.com"
              />
            </label>
            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              <Mail className="h-4 w-4" aria-hidden /> Enviar link de acesso
            </button>
          </form>
        ) : (
          <form
            className="surface space-y-4 rounded-2xl p-5"
            onSubmit={(e) => {
              e.preventDefault()
              void run(() => verifyCode(address.trim(), code.trim()))
            }}
          >
            <p>
              Enviamos um e-mail para <strong>{address}</strong>. Abra o link neste aparelho, ou digite abaixo o código que veio no e-mail (útil no app instalado na tela
              inicial).
            </p>
            <label className="block text-sm font-medium">
              Código
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="surface mt-1 block min-h-[44px] w-full rounded-xl px-3 text-base tracking-[0.3em]"
                placeholder="123456"
              />
            </label>
            <button type="submit" className="btn btn-primary w-full" disabled={busy || code.trim().length < 6}>
              Entrar com o código
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSent(false)}>
              Usar outro e-mail
            </button>
          </form>
        )}
        {msg && (
          <p role="alert" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {msg}
          </p>
        )}
      </div>
    </>
  )
}
