import { attractions } from '../data/attractions'
import { cities } from '../data/cities'
import { attractionPhoto, cityGallery, cityHero, enrichmentDate } from '../data/photos'
import { ExternalLink, PageHeader, SectionTitle } from '../components/ui'
import type { Photo } from '../types'

export function CreditsPage() {
  const photos: Photo[] = []
  for (const c of cities) {
    const h = cityHero(c.id)
    if (h) photos.push(h)
    photos.push(...cityGallery(c.id))
  }
  for (const a of attractions) {
    const p = attractionPhoto(a.id)
    if (p) photos.push(p)
  }
  const unique = photos.filter((p, i) => photos.findIndex((x) => x.src === p.src) === i)
  const pending = attractions.filter((a) => !attractionPhoto(a.id) && a.category !== 'hotel' && a.category !== 'estacao' && a.category !== 'aeroporto')

  return (
    <>
      <PageHeader eyebrow="Créditos" title="Fotografias, mapas e fontes" />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 md:px-8">
        <section>
          <SectionTitle eyebrow="Fotografias" title={`${unique.length} fotografias licenciadas`}>
            Fotografias reais obtidas do Wikimedia Commons, somente com licenças livres (CC0, domínio público, CC BY, CC BY-SA), selecionadas a partir dos artigos da
            Wikipédia de cada local.
            {enrichmentDate() ? ` Última atualização: ${new Date(enrichmentDate()!).toLocaleDateString('pt-BR')}.` : ' Ainda não foram baixadas: rode `npm run enrich` (ou publique pelo GitHub Actions, que faz isso automaticamente).'}
          </SectionTitle>
          {unique.length > 0 && (
            <ul className="divide-y divide-[var(--line)] text-sm">
              {unique.map((p) => (
                <li key={p.src} className="flex flex-wrap gap-x-3 gap-y-1 py-2">
                  <strong>{p.title}</strong>
                  <span className="text-2">{p.author ?? 'autor na fonte'}</span>
                  <span>{p.licenseUrl ? <ExternalLink href={p.licenseUrl}>{p.license ?? 'licença'}</ExternalLink> : p.license}</span>
                  {p.sourceUrl && <ExternalLink href={p.sourceUrl}>Wikimedia Commons</ExternalLink>}
                </li>
              ))}
            </ul>
          )}
          {pending.length > 0 && (
            <details className="surface mt-4 rounded-2xl p-4 text-sm">
              <summary className="cursor-pointer font-semibold">{pending.length} atrações com imagem pendente (placeholder)</summary>
              <p className="text-2 mt-2">{pending.map((a) => a.name).join(' · ')}</p>
            </details>
          )}
        </section>
        <section>
          <SectionTitle eyebrow="Mapas e dados" title="Outras fontes" />
          <ul className="text-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Mapas: © <ExternalLink href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</ExternalLink>, via Leaflet.
            </li>
            <li>Coordenadas verificadas: Wikipédia/Wikidata (quando indicado). Demais coordenadas são aproximadas.</li>
            <li>Ícones: Lucide (licença ISC). Tipografia: Cormorant Garamond e Inter (Google Fonts, SIL Open Font License).</li>
            <li>Reservas, horários de transporte e valores: informados pelos viajantes.</li>
          </ul>
        </section>
      </div>
    </>
  )
}
