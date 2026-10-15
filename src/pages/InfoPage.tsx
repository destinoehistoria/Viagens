import { Link } from '../components/TripLink'
import { Info, ShieldCheck, TrainFront, WifiOff, Lightbulb, BookMarked } from 'lucide-react'
import { requireTrip } from '../data/active'
import { cities } from '../data/cities'
import { futureIdeas } from '../data/attractions'
import { ExternalLink, PageHeader, ReliabilityBadge, SectionTitle, reliabilityMeta } from '../components/ui'
import { useHashScroll } from '../hooks/useHashScroll'
import type { Reliability } from '../types'

export function InfoPage() {
  useHashScroll()
  const trip = requireTrip()
  return (
    <>
      <PageHeader eyebrow="Informações úteis" title="Antes de sair do hotel">
        Documentos, transporte urbano, clima, moedas e dicas práticas.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:px-8">
        <section id="confiabilidade">
          <SectionTitle eyebrow="Como ler este guia" title="Legenda de confiabilidade" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(reliabilityMeta) as Reliability[]).map((r) => (
              <li key={r} className="surface rounded-2xl p-4">
                <ReliabilityBadge value={r} />
                <p className="text-2 mt-2 text-sm">{reliabilityMeta[r].help}</p>
              </li>
            ))}
          </ul>
          <p className="text-2 mt-3 text-sm">
            Horários de funcionamento, preços, datas e benefícios ICOM não verificados aparecem como <strong>“a confirmar”</strong>, com link para a fonte oficial.
            Coordenadas sem verificação automática aparecem como aproximadas.
          </p>
        </section>

        {trip.editorialNotes?.length ? (
          <section className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <ShieldCheck className="h-5 w-5 text-gold" aria-hidden /> Notas sobre este roteiro
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {trip.editorialNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {trip.info?.length ? (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trip.info.map((sec) => (
              <div key={sec.title} className="surface rounded-2xl p-5">
                <h3 className="flex items-center gap-2 text-2xl font-semibold">
                  <Info className="h-5 w-5 text-gold" aria-hidden /> {sec.title}
                </h3>
                {sec.items.map((it) => (
                  <p key={it} className="text-2 mt-2 text-sm">
                    {it}
                  </p>
                ))}
                {sec.links?.map((l) => (
                  <p key={l.url} className="mt-2 text-sm">
                    <ExternalLink href={l.url}>{l.label}</ExternalLink>
                  </p>
                ))}
              </div>
            ))}
            <div className="surface rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-2xl font-semibold">
                <WifiOff className="h-5 w-5 text-gold" aria-hidden /> Uso sem internet
              </h3>
              <p className="text-2 mt-2 text-sm">
                Depois da primeira visita, o app funciona offline: roteiro, cidades, reservas, checklist e caderno. O que for registrado sem internet sincroniza quando a
                conexão voltar. Mapas e fotografias precisam de conexão. Instale o app na tela inicial pelo menu do navegador (“Adicionar à tela inicial”).
              </p>
            </div>
          </section>
        ) : null}

        <section>
          <SectionTitle eyebrow="Transporte urbano" title="Como se deslocar em cada cidade" />
          <div className="grid gap-4 md:grid-cols-2">
            {cities.map((c) => (
              <div key={c.id} className="surface rounded-2xl p-5">
                <h3 className="flex items-center gap-2 text-2xl font-semibold">
                  <TrainFront className="h-5 w-5 text-gold" aria-hidden /> {c.flag} {c.name}
                </h3>
                <ul className="text-2 mt-2 list-disc space-y-1 pl-5 text-sm">
                  {c.gettingAround.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                {c.climate && (
                  <p className="mt-2 text-sm">
                    Clima: {c.climate.minC}° a {c.climate.maxC}°C (estimativa), {c.climate.daylight}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          {futureIdeas.length > 0 && <SectionTitle eyebrow="Para depois" title="Ideias para futuras viagens" />}
          <ul className="space-y-2">
            {futureIdeas.map((f) => (
              <li key={f.name} className="surface flex gap-3 rounded-2xl p-4">
                <Lightbulb className="h-5 w-5 shrink-0 text-gold" aria-hidden />
                <p>
                  <strong>{f.name}</strong> — <span className="text-2">{f.reason}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle eyebrow="Dica" title="Testar a visão “Hoje”" />
          <p className="text-2 text-sm">
            Para ver como o site se comporta durante a viagem, acrescente <code>?data=AAAA-MM-DD</code> ao endereço da página Hoje — por exemplo,{' '}
            <Link className="text-accent underline" to={`/hoje?data=${trip.days[Math.floor(trip.days.length / 2)]?.date ?? trip.start}`}>
              um dia no meio da viagem
            </Link>
            .
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <BookMarked className="h-4 w-4 text-gold" aria-hidden />
            <Link className="text-accent underline" to="/creditos">
              Créditos das fotografias, mapas e fontes
            </Link>
          </p>
        </section>
      </div>
    </>
  )
}
