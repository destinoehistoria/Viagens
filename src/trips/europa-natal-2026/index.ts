import type { Trip } from '../../types'
import { attractions, futureIdeas } from './attractions'
import { cities, hotels } from './cities'
import { itinerary } from './itinerary'
import { checklist, extraPlaces, ticketSeeds, transport } from './logistics'

/** Capa e busca de fotos de mercados de Natal (edições anteriores) por cidade. */
const photoHints: Record<string, { hero: string; market: string }> = {
  barcelona: { hero: 'sagrada-familia', market: 'Fira de Santa Llúcia Barcelona' },
  paris: { hero: 'palais-garnier', market: 'Marché de Noël Paris' },
  colmar: { hero: 'maison-pfister', market: 'Colmar marché de Noël' },
  strasbourg: { hero: 'cathedrale-strasbourg', market: 'Christkindelsmärik Strasbourg' },
  freiburg: { hero: 'freiburger-munster', market: 'Freiburg Weihnachtsmarkt' },
  luxemburgo: { hero: 'corniche', market: 'Luxembourg marché de Noël' },
  madrid: { hero: 'plaza-mayor', market: 'Mercado de Navidad Plaza Mayor Madrid' },
}

export const trip: Trip = {
  slug: 'europa-natal-2026',
  title: 'Europa Natal 2026',
  subtitle: 'Destino & História',
  tagline: 'Mercados de Natal entre Espanha, França, Alemanha e Luxemburgo.',
  travelers: ['André', 'Ricardo'],
  start: '2026-11-26',
  end: '2026-12-20',
  homeTimezone: 'America/Fortaleza',
  emoji: '🇪🇸 🇫🇷 🇩🇪 🇱🇺',
  accent: '#C6A56B',
  intro: [
    'Uma viagem entre cidades históricas, mercados de Natal, arquitetura, cultura e gastronomia — Espanha, França, Alemanha e Luxemburgo.',
    'Chegada por Madrid, trem até Barcelona e, de lá, Paris, Alsácia, Luxemburgo e o retorno a Madrid. Freiburg entra como bate-volta a partir de Strasbourg.',
  ],
  cities: cities.map((c) => ({
    ...c,
    heroAttraction: photoHints[c.id]?.hero,
    photoSearch: photoHints[c.id] && {
      query: photoHints[c.id].market,
      title: 'Mercado de Natal — foto de arquivo',
      alt: `Mercado de Natal em ${c.name} (edição anterior, não 2026)`,
    },
  })),
  attractions,
  days: itinerary,
  hotels,
  transport,
  extraPlaces,
  tickets: ticketSeeds,
  checklist,
  futureIdeas,
  info: [
    {
      title: 'Fuso horário',
      items: [
        'Espanha, França, Alemanha e Luxemburgo usam o Horário da Europa Central (CET, UTC+1) em dezembro — 4 horas à frente de Fortaleza e de Brasília (UTC−3).',
        'O app calcula o “hoje” pelo fuso local de cada cidade.',
      ],
    },
    {
      title: 'Moeda',
      items: [
        'Euro (€) nos quatro países. Cartões por aproximação são amplamente aceitos, mas leve algum dinheiro para barracas de mercados de Natal.',
        'Algumas compras (ex.: o trem Strasbourg → Luxemburgo) foram feitas em libras (£); valores ficam registrados na moeda original.',
      ],
    },
    { title: 'Tomadas', items: ['Tomadas europeias dos tipos C e F, 230 V / 50 Hz. Leve adaptador e confira se os carregadores são bivolt.'] },
    { title: 'Emergências', items: ['112 — número único de emergência na União Europeia, válido nos quatro países.'] },
    {
      title: 'Entrada no Espaço Schengen',
      items: ['Regras de entrada para brasileiros (registro EES, autorização ETIAS e documentos exigidos) podem mudar. Verifique perto da partida.'],
      links: [{ label: 'travel-europe.europa.eu', url: 'https://travel-europe.europa.eu/' }],
    },
    {
      title: 'Luxemburgo: transporte gratuito',
      items: ['O transporte público doméstico (ônibus, bonde, funicular e trens em 2ª classe) é gratuito, conforme as regras vigentes. A 1ª classe nos trens é paga.'],
      links: [{ label: 'mobiliteit.lu', url: 'https://www.mobiliteit.lu/' }],
    },
    {
      title: 'Mercados de Natal',
      items: [
        'As edições de 2026 ainda precisam ser confirmadas nas fontes oficiais de cada cidade (links nas páginas das cidades). Fotografias de mercados são de edições anteriores.',
      ],
    },
    {
      title: 'A “biblioteca flutuante” de Paris',
      items: [
        'Pesquisa feita em 14/10/2026. Foram encontradas duas candidatas; o nome não foi presumido e os viajantes devem confirmar qual é a mencionada.',
        'Nanna — péniche literária com cerca de 5.000 livros usados para leitura no local e empréstimo, e bar, no Port de Montebello (5º arr.), diante da Notre-Dame; atracada desde maio de 2026, segundo a fonte.',
        'L’Eau et les Rêves — livraria em uma péniche no Canal de l’Ourcq, 9 Quai de l’Oise (19º arr.).',
      ],
      links: [
        {
          label: 'Sortiraparis — Nanna (atualizado em 21/05/2026)',
          url: 'https://www.sortiraparis.com/en/where-to-eat-in-paris/bars-cafes/articles/337914-nanna-the-cozy-literary-barge-with-a-library-and-a-bar-at-the-foot-of-notre-dame-cathedral',
        },
        { label: 'The Earful Tower — L’Eau et les Rêves (2022)', url: 'https://theearfultower.com/2022/03/16/meet-the-man-with-the-floating-paris-bookshop/' },
      ],
    },
  ],
  editorialNotes: [
    'Horários de funcionamento, preços, datas de mercados e benefícios ICOM não verificados aparecem como “a confirmar”, com link para a fonte oficial.',
    'Somente Ricardo possui carteirinha ICOM; o benefício nunca é presumido.',
  ],
}
