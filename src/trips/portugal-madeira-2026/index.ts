import type {
  Attraction,
  Category,
  City,
  DayItem,
  Hotel,
  ItemKind,
  LatLng,
  Reliability,
  TransportLeg,
  Trip,
  TripDay,
} from '../../types'

/**
 * Portugal & Madeira 2026 — viagem concluída (24/08 a 14/09/2026).
 *
 * Regras editoriais:
 * - `visitado`: aconteceu, com data registrada.
 * - `relatado`: aconteceu, mas sem data exata.
 * - `pendente`: a confirmar (entrada efetiva, data ou nome).
 * - `nao-visitado`: cogitado e não realizado.
 * - Nenhuma data, horário, preço, refeição ou hotel foi inferido: só o que consta
 *   nos registros da viagem. Coordenadas são aproximadas (centro do local).
 * - Coimbra, Amarante, Arrábida/Azeitão e Cascais/Guincho NÃO foram visitados.
 */

const LISBOA_TZ = 'Europe/Lisbon'
const MADEIRA_TZ = 'Atlantic/Madeira'

const LIVRE = 'Espaço público, acesso livre.'
const SEM_INFO = 'Sem informação de ingresso registrada.'
const RESTAURANTE = 'Restaurante — consumo à parte; preços não registrados.'

// ───────────────────────── helpers ─────────────────────────

function a(
  id: string,
  cityId: string,
  name: string,
  category: Category,
  coords: [number, number] | undefined,
  description: string,
  extra: Partial<Attraction> = {},
): Attraction {
  const c: LatLng | undefined = coords ? { lat: coords[0], lng: coords[1] } : undefined
  return { id, cityId, name, category, coords: c, description, tickets: extra.tickets ?? SEM_INFO, ...extra }
}

type I = [text: string, opts?: { t?: string; a?: string; k?: ItemKind; r?: Reliability; n?: string }]

function items(list: I[]): DayItem[] {
  return list.map(([text, o = {}]) => ({
    text,
    time: o.t,
    attractionId: o.a,
    kind: o.k ?? (o.a ? 'visita' : 'logistica'),
    reliability: o.r ?? 'visitado',
    note: o.n,
  }))
}

// ───────────────────────── cidades ─────────────────────────

const cities: City[] = [
  {
    id: 'lisboa',
    name: 'Lisboa',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 38.7108, lng: -9.1394 },
    zoom: 13,
    arrival: '2026-08-24',
    departure: '2026-09-14',
    nights: 11,
    isBase: true,
    tagline: 'Duas estadias: o Chiado na chegada, museus e bairros na despedida',
    summary:
      'Porta de entrada e de saída da viagem, em duas estadias: de 24 a 27/08, no Chiado (Hotel Borges Chiado), e de 06 a 14/09, com o evento de museus de Ricardo e muitos dias de bairros, livrarias, mesas portuguesas e a travessia do Tejo até Cacilhas.',
    history: [
      'Cidade de colinas debruçada sobre o estuário do Tejo, Lisboa foi ocupada por fenícios, romanos (Olisipo) e muçulmanos (al-Ushbuna) antes de ser tomada por D. Afonso Henriques em 1147, com apoio de cruzados.',
      'Capital do reino desde o século XIII, tornou-se o centro do império marítimo português: da Ribeira partiam as naus para a Índia e o Brasil, e a cidade concentrou riqueza, conventos e palácios.',
      'O terramoto de 1 de novembro de 1755, seguido de incêndio e maremoto, destruiu a Baixa. A reconstrução comandada pelo Marquês de Pombal deu à cidade a grelha ortogonal da Baixa Pombalina, entre o Rossio e a Praça do Comércio, enquanto Alfama conserva o traçado medieval que resistiu ao sismo.',
    ],
    food: [
      'Bacalhau em suas muitas versões: assado, pataniscas, à Zé do Pipo',
      'Bitoque — bife com ovo estrelado e batatas fritas — e alheira com ovo',
      'Pastel de nata e a ginjinha das tabernas do Rossio',
      'Vinhos portugueses a copo nas tascas e bares do Bairro Alto e do Chiado',
    ],
    curiosities: [
      'O Chiado deve o nome, segundo a tradição, a um poeta do século XVI conhecido como “o Chiado”; o bairro foi devastado por um incêndio em 1988 e reconstruído sob projeto de Álvaro Siza.',
      'A Casa Fernando Pessoa ocupa o prédio de Campo de Ourique onde o poeta viveu os últimos quinze anos de sua vida.',
      'A Fundação José Saramago funciona na Casa dos Bicos, edifício quinhentista de fachada em pontas de diamante; as cinzas do escritor repousam sob uma oliveira diante dela.',
      'A Feira da Ladra, mercado de usados junto ao Campo de Santa Clara, tem raízes documentadas na Idade Média.',
    ],
    gettingAround: [
      'Metro, elétricos e autocarros da Carris; os elevadores e ascensores vencem as colinas entre a Baixa, o Chiado e o Bairro Alto.',
      'Barcos da Transtejo ligam o Cais do Sodré a Cacilhas, na margem sul — foi assim a travessia de 09/09.',
      'Baixa, Chiado, Bairro Alto e Alfama se exploram melhor a pé, com calçado confortável para a calçada portuguesa.',
    ],
    links: [
      { label: 'Visit Lisboa — turismo oficial', url: 'https://www.visitlisboa.com/' },
      { label: 'Visit Portugal', url: 'https://www.visitportugal.com/' },
    ],
    wiki: 'Lisbon',
    accent: '#A8643F',
  },
  {
    id: 'fatima',
    name: 'Fátima',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 39.6316, lng: -8.6729 },
    zoom: 15,
    arrival: '2026-08-27',
    departure: '2026-08-27',
    nights: 0,
    isBase: false,
    tagline: 'Parada no caminho para Óbidos, no grande santuário mariano',
    summary:
      'Parada sem pernoite em 27/08, no trajeto de carro entre Lisboa e Óbidos. O Santuário de Fátima reúne a Capelinha das Aparições e as basílicas de Nossa Senhora do Rosário e da Santíssima Trindade em torno de uma vasta esplanada.',
    history: [
      'Até 1917, Fátima era uma freguesia rural da serra de Aire. Naquele ano, três crianças pastoras — Lúcia, Francisco e Jacinta — relataram aparições de Nossa Senhora na Cova da Iria, entre maio e outubro.',
      'A pequena capela erguida no local das aparições deu origem a um dos maiores santuários marianos do mundo. A Basílica de Nossa Senhora do Rosário foi consagrada em 1953; a Basílica da Santíssima Trindade, no extremo oposto do recinto, foi dedicada em 2007.',
      'Francisco e Jacinta Marto foram canonizados em 2017, no centenário das aparições, em cerimônia presidida pelo papa Francisco no próprio santuário.',
    ],
    food: ['Sem registro de refeição em Fátima durante a parada.'],
    curiosities: [
      'A Capelinha das Aparições marca o local onde estava a azinheira das aparições.',
      'A esplanada do santuário é uma das maiores áreas abertas de culto da Europa e recebe peregrinações multitudinárias em 12–13 de maio e 12–13 de outubro.',
    ],
    gettingAround: [
      'Parada feita de carro alugado, no trajeto Lisboa → Óbidos.',
      'O recinto do santuário se percorre inteiramente a pé.',
    ],
    links: [{ label: 'Santuário de Fátima', url: 'https://www.fatima.pt/' }],
    wiki: 'Fátima, Portugal',
    accent: '#8A8270',
  },
  {
    id: 'obidos',
    name: 'Óbidos',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 39.3606, lng: -9.1571 },
    zoom: 16,
    arrival: '2026-08-27',
    departure: '2026-08-28',
    nights: 1,
    isBase: true,
    tagline: 'Vila muralhada, ginjinha e livros por toda parte',
    summary:
      'Uma noite dentro da vila medieval, hospedados no The Literary Man. Óbidos é pequena o bastante para ser percorrida a pé entre a Porta da Vila, a Rua Direita, as muralhas e o castelo — e, de noite, ganha outro silêncio.',
    history: [
      'Povoado de origem antiga sobre uma colina junto à lagoa que lhe deu acesso ao mar, Óbidos foi conquistada aos muçulmanos em 1148, no reinado de D. Afonso Henriques.',
      'Em 1282, D. Dinis ofereceu a vila à rainha D. Isabel como presente de casamento. Desde então, durante séculos, Óbidos fez parte da Casa das Rainhas — o que lhe valeu o apelido de “vila das rainhas”.',
      'Mais recentemente, a vila reinventou-se como Vila Literária, integrando a Rede de Cidades Criativas da UNESCO na área de literatura (2015), com livrarias instaladas em igrejas, mercados e adegas.',
    ],
    food: [
      'Ginjinha de Óbidos, licor de ginja tradicionalmente servido em copinho de chocolate',
    ],
    curiosities: [
      'A Porta da Vila, entrada principal da muralha, é revestida de azulejos do século XVIII.',
      'O castelo foi transformado em pousada; o caminho de ronda das muralhas contorna quase toda a vila.',
      'Óbidos sedia anualmente o festival literário FOLIO.',
    ],
    gettingAround: [
      'Chegada de carro alugado vindo de Fátima; a vila histórica é praticamente toda pedonal.',
      'O caminho sobre as muralhas não tem guarda-corpo em vários trechos: atenção redobrada.',
    ],
    links: [{ label: 'Câmara Municipal de Óbidos', url: 'https://www.cm-obidos.pt/' }],
    wiki: 'Óbidos, Portugal',
    accent: '#B38A4E',
  },
  {
    id: 'guimaraes',
    name: 'Guimarães',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 41.4425, lng: -8.2918 },
    zoom: 15,
    arrival: '2026-08-28',
    departure: '2026-08-30',
    nights: 2,
    isBase: true,
    tagline: 'Onde Portugal começou',
    summary:
      'Duas noites no EMAJ Guimarães Boutique Hotel, com o centro histórico — Património Mundial da UNESCO — como cenário: Largo da Oliveira, Praça de Santiago, Rua de Santa Maria e, no alto, o castelo e o Paço dos Duques.',
    history: [
      'No século X, a condessa Mumadona Dias fundou aqui um mosteiro e mandou erguer um castelo para defendê-lo — origem da povoação medieval.',
      'Guimarães foi sede do Condado Portucalense e é tradicionalmente apontada como berço de D. Afonso Henriques. A Batalha de São Mamede, travada nas proximidades em 1128, abriu caminho à independência de Portugal; daí a inscrição “Aqui nasceu Portugal” numa das antigas torres da muralha.',
      'O centro histórico, com casas de granito e varandas de madeira, foi inscrito como Património Mundial em 2001; em 2012, a cidade foi Capital Europeia da Cultura.',
    ],
    food: [
      'Cozinha minhota: rojões, bacalhau, caldo verde',
      'Doces conventuais locais, como o toucinho-do-céu e as tortas de Guimarães',
      'Vinho Verde da região do Minho',
    ],
    curiosities: [
      'O Padrão do Salado, no Largo da Oliveira, é um alpendre gótico do século XIV que comemora a Batalha do Salado (1340).',
      'A Igreja de São Miguel do Castelo é tradicionalmente apontada como local de batismo de D. Afonso Henriques.',
      'O Paço dos Duques de Bragança, do século XV, foi amplamente reconstruído no século XX; suas chaminés de tijolo são marca da silhueta da cidade.',
    ],
    gettingAround: [
      'Chegada de carro alugado vindo de Óbidos; saída direta para o Porto em 30/08.',
      'O centro histórico e a colina do castelo ficam a curta distância a pé.',
    ],
    links: [{ label: 'Câmara Municipal de Guimarães', url: 'https://www.cm-guimaraes.pt/' }],
    wiki: 'Guimarães',
    accent: '#6E7754',
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 41.1496, lng: -8.6109 },
    zoom: 14,
    arrival: '2026-08-30',
    departure: '2026-09-02',
    nights: 3,
    isBase: true,
    tagline: 'Granito, azulejo e o Douro a caminho do mar',
    summary:
      'Três noites no Porto, com devolução do carro na chegada, a Livraria Lello em 31/08, o bate-volta de trem ao Pinhão em 01/09 e o voo cedo para o Funchal em 02/09. Ribeira, Baixa, Clérigos e os Jardins do Palácio de Cristal compõem o mapa da estadia.',
    history: [
      'O povoado romano de Portus Cale, na foz do Douro, acabou dando nome ao próprio país. A cidade medieval cresceu em torno da Sé, no morro da Penaventosa, e desceu até a Ribeira, seu cais mercantil.',
      'Do Porto partiu parte da armada que conquistou Ceuta em 1415 — e os moradores, segundo a tradição, teriam ficado só com as tripas da carne, origem do apelido “tripeiros”. A partir do século XVIII, o comércio do vinho do Douro, exportado sobretudo para a Inglaterra, moldou a economia e as caves de Vila Nova de Gaia, na margem oposta.',
      'Cidade liberal no século XIX, o Porto ganhou a Torre dos Clérigos de Nicolau Nasoni no século XVIII e as pontes metálicas sobre o Douro no século XIX. O centro histórico é Património Mundial desde 1996.',
    ],
    food: [
      'Francesinha, a sanduíche com molho que é símbolo da cidade',
      'Tripas à moda do Porto',
      'Vinho do Porto nas caves de Vila Nova de Gaia',
    ],
    curiosities: [
      'A Livraria Lello, aberta em 1906, é famosa pela escadaria vermelha de ferro e madeira e pelo vitral do teto.',
      'A estação de São Bento tem o átrio revestido por cerca de 20 mil azulejos de Jorge Colaço com cenas da história de Portugal.',
      'A Ponte D. Luís I, inaugurada em 1886, liga o Porto a Vila Nova de Gaia em dois tabuleiros.',
    ],
    gettingAround: [
      'Chegada de carro alugado vindo de Guimarães; o carro foi devolvido no Porto.',
      'Comboios da CP para o Pinhão a partir de São Bento/Campanhã (Linha do Douro).',
      'Metro do Porto e caminhadas pelas ladeiras entre a Baixa e a Ribeira.',
    ],
    links: [
      { label: 'Visit Porto — turismo oficial', url: 'https://visitporto.travel/' },
      { label: 'CP — Comboios de Portugal', url: 'https://www.cp.pt/' },
    ],
    wiki: 'Porto',
    accent: '#3F5E7A',
  },
  {
    id: 'pinhao',
    name: 'Pinhão / Vale do Douro',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: LISBOA_TZ,
    coords: { lat: 41.1906, lng: -7.5463 },
    zoom: 14,
    arrival: '2026-09-01',
    departure: '2026-09-01',
    nights: 0,
    isBase: false,
    tagline: 'De trem pela Linha do Douro, entre socalcos de vinha',
    summary:
      'Bate-volta de trem desde o Porto em 01/09, sem pernoite. A Linha do Douro acompanha o rio até o Pinhão, coração do Alto Douro Vinhateiro; ali, um passeio de barco das 17h às 18h, com saída na Rua da Praia, e retorno noturno ao Porto.',
    history: [
      'O Alto Douro é considerado a mais antiga região vinícola demarcada e regulamentada do mundo: a demarcação foi instituída em 1756, por iniciativa do Marquês de Pombal, para proteger o vinho do Porto.',
      'Os socalcos esculpidos à mão nas encostas de xisto, ao longo de séculos, formam a paisagem cultural do Alto Douro Vinhateiro, inscrita como Património Mundial em 2001.',
      'A Linha do Douro chegou ao Pinhão no fim do século XIX, substituindo em parte os barcos rabelos no transporte do vinho rio abaixo até Vila Nova de Gaia.',
    ],
    food: ['Sem registro de refeição no Pinhão; não houve visita a quinta nem degustação formal registrada.'],
    curiosities: [
      'A estação do Pinhão é decorada com painéis de azulejos que retratam paisagens e trabalhos da vinha no Douro.',
      'O Pinhão fica na confluência do rio Pinhão com o Douro.',
    ],
    gettingAround: [
      'Trem da CP pela Linha do Douro, com ligações conforme os bilhetes (via Régua e Marco de Canaveses no retorno).',
      'A vila se percorre a pé, da estação à margem do rio.',
    ],
    links: [{ label: 'CP — Comboios de Portugal', url: 'https://www.cp.pt/' }],
    wiki: 'Pinhão',
    accent: '#7A4A55',
  },
  {
    id: 'madeira',
    name: 'Madeira / Funchal',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    timezone: MADEIRA_TZ,
    coords: { lat: 32.65, lng: -16.9083 },
    zoom: 11,
    arrival: '2026-09-02',
    departure: '2026-09-06',
    nights: 4,
    isBase: true,
    tagline: 'Picos, falésias e piscinas de lava no meio do Atlântico',
    summary:
      'Quatro noites no Hotel Duas Torres, no Funchal, com carro para explorar a ilha: o centro histórico na chegada, o Pico do Areeiro e a costa norte no dia seguinte, e, em 04/09 — aniversário de André —, o circuito oeste de Cabo Girão a Porto Moniz.',
    history: [
      'Desabitada à chegada dos portugueses, a Madeira foi reconhecida por João Gonçalves Zarco e Tristão Vaz Teixeira por volta de 1419–1420 e colonizada nos anos seguintes. O nome vem da densa floresta que cobria a ilha.',
      'No século XV, o açúcar fez da Madeira uma das economias mais ricas do Atlântico — riqueza visível na Sé do Funchal e nas obras de arte flamenga hoje no Museu de Arte Sacra. Depois, foi a vez do vinho da Madeira, exportado sobretudo para a Inglaterra e as Américas.',
      'No século XIX, a ilha tornou-se destino de convalescença e de inverno da aristocracia europeia. Hoje é Região Autónoma de Portugal, e a sua floresta Laurissilva é Património Mundial desde 1999.',
    ],
    food: [
      'Espetada em pau de louro e bolo do caco com manteiga de alho',
      'Peixe-espada preto, frequentemente servido com banana',
      'Poncha, bebida de aguardente de cana, mel e limão',
      'Vinho da Madeira',
    ],
    curiosities: [
      'O Mercado dos Lavradores, inaugurado em 1940, tem painéis de azulejo na entrada e bancas de frutas tropicais e peixe.',
      'As casas típicas de Santana, triangulares e com telhado de colmo, são um dos símbolos da ilha.',
      'O Cabo Girão está entre os cabos mais altos da Europa, com um miradouro de piso de vidro sobre a falésia.',
      'As piscinas naturais de Porto Moniz foram formadas por rochas vulcânicas junto ao mar.',
    ],
    gettingAround: [
      'Carro alugado na ilha durante a estadia; estradas sinuosas, túneis e grandes desníveis.',
      'O centro do Funchal e a Zona Velha se percorrem a pé.',
    ],
    links: [
      { label: 'Visit Madeira — turismo oficial', url: 'https://www.visitmadeira.com/' },
    ],
    wiki: 'Funchal',
    accent: '#3E7A6E',
  },
]

// ───────────────────────── atrações ─────────────────────────

const attractions: Attraction[] = [
  // ───────────── LISBOA — primeira estadia ─────────────
  a('chiado', 'lisboa', 'Chiado', 'bairro', [38.7107, -9.1426], 'Bairro elegante de cafés históricos, livrarias e teatros entre a Baixa e o Bairro Alto. Foi a base da primeira estadia e voltou ao roteiro em 13/09.', { tickets: LIVRE, wiki: 'Chiado', reliability: 'visitado' }),
  a('baixa', 'lisboa', 'Baixa Pombalina', 'bairro', [38.7114, -9.1376], 'A grelha ortogonal reconstruída após o terramoto de 1755, entre o Rossio e a Praça do Comércio — exemplo pioneiro de urbanismo iluminista e de construção antissísmica.', { tickets: LIVRE, wiki: 'Pombaline Baixa', reliability: 'relatado' }),

  // ───────────── FÁTIMA ─────────────
  a('santuario-fatima', 'fatima', 'Santuário de Fátima', 'igreja', [39.6316, -8.6729], 'O recinto da Cova da Iria, com a grande esplanada, a Capelinha das Aparições e as duas basílicas. Parada de 27/08, a caminho de Óbidos.', { tickets: LIVRE, officialUrl: 'https://www.fatima.pt/', wiki: 'Sanctuary of Fátima', reliability: 'visitado' }),
  a('capelinha-aparicoes', 'fatima', 'Capelinha das Aparições', 'igreja', undefined, 'Pequena capela erguida em 1919 no local das aparições relatadas em 1917; é o coração devocional do santuário.', { tickets: LIVRE, wiki: 'Chapel of the Apparitions', reliability: 'pendente', tags: ['ponto de interesse do conjunto'] }),
  a('basilica-rosario', 'fatima', 'Basílica de Nossa Senhora do Rosário', 'igreja', undefined, 'Basílica neobarroca de torre alta que domina a esplanada; guarda os túmulos dos três pastorinhos.', { tickets: LIVRE, wiki: 'Basilica of Our Lady of the Rosary (Fátima)', reliability: 'pendente', tags: ['ponto de interesse do conjunto'] }),
  a('basilica-trindade', 'fatima', 'Basílica da Santíssima Trindade', 'igreja', undefined, 'Templo contemporâneo dedicado em 2007, de planta circular, no extremo oposto do recinto — uma das maiores igrejas católicas do mundo em capacidade.', { tickets: LIVRE, wiki: 'Basilica of the Holy Trinity (Fátima)', reliability: 'pendente', tags: ['ponto de interesse do conjunto'] }),

  // ───────────── ÓBIDOS ─────────────
  a('vila-obidos', 'obidos', 'Vila medieval de Óbidos', 'bairro', [39.3606, -9.1571], 'Casario branco com barras azuis e amarelas, buganvílias e ruas de pedra dentro de um circuito de muralhas. Percorrida de dia e à noite durante a estadia.', { tickets: LIVRE, wiki: 'Óbidos, Portugal', reliability: 'visitado' }),
  a('porta-da-vila', 'obidos', 'Porta da Vila', 'monumento', [39.3592, -9.1567], 'Entrada principal da vila, em cotovelo, com oratório e revestimento de azulejos setecentistas.', { tickets: LIVRE, reliability: 'relatado' }),
  a('rua-direita-obidos', 'obidos', 'Rua Direita', 'bairro', undefined, 'Eixo principal da vila, da Porta da Vila ao castelo, com lojas, livrarias e bancas de ginjinha.', { tickets: LIVRE, reliability: 'relatado' }),
  a('muralhas-castelo-obidos', 'obidos', 'Muralhas e Castelo de Óbidos', 'monumento', [39.3624, -9.1574], 'Castelo medieval reformado em vários reinados e hoje pousada; o caminho de ronda das muralhas oferece vistas sobre a vila e a planície.', { tickets: LIVRE, wiki: 'Óbidos Castle', reliability: 'pendente', tags: ['subida às muralhas a confirmar'] }),
  a('livraria-santiago', 'obidos', 'Livraria de Santiago', 'cultura', undefined, 'Livraria instalada na antiga Igreja de Santiago, símbolo da Óbidos Vila Literária.', { tickets: LIVRE, reliability: 'pendente', tags: ['visita a confirmar'] }),

  // ───────────── GUIMARÃES ─────────────
  a('centro-historico-guimaraes', 'guimaraes', 'Centro histórico de Guimarães', 'bairro', [41.4431, -8.2938], 'Conjunto medieval de granito, Património Mundial desde 2001, onde se viveu a estadia de 28 a 30/08.', { tickets: LIVRE, wiki: 'Historic Centre of Guimarães', reliability: 'visitado' }),
  a('largo-oliveira', 'guimaraes', 'Largo da Oliveira', 'monumento', [41.4431, -8.2938], 'Praça medieval com a Igreja de Nossa Senhora da Oliveira, o antigo Paço do Concelho sobre arcadas e o Padrão do Salado.', { tickets: LIVRE, reliability: 'relatado' }),
  a('praca-santiago-guimaraes', 'guimaraes', 'Praça de Santiago', 'monumento', [41.4434, -8.2943], 'Praça contígua ao Largo da Oliveira, cercada de casas com varandas de madeira e esplanadas.', { tickets: LIVRE, reliability: 'relatado' }),
  a('rua-santa-maria-guimaraes', 'guimaraes', 'Rua de Santa Maria', 'bairro', undefined, 'Uma das ruas mais antigas da cidade, ligando o núcleo do mosteiro de Mumadona ao castelo, com casas nobres e conventos.', { tickets: LIVRE, reliability: 'relatado' }),
  a('castelo-guimaraes', 'guimaraes', 'Castelo de Guimarães', 'monumento', [41.4479, -8.29], 'Castelo de origem no século X, associado à fundação de Portugal e ícone nacional, no alto da Colina Sagrada.', { wiki: 'Guimarães Castle', reliability: 'pendente', tags: ['entrada a confirmar'] }),
  a('igreja-sao-miguel', 'guimaraes', 'Igreja de São Miguel do Castelo', 'igreja', [41.4475, -8.2903], 'Pequena igreja românica entre o castelo e o paço, tradicionalmente apontada como local de batismo de D. Afonso Henriques.', { reliability: 'pendente', tags: ['entrada a confirmar'] }),
  a('paco-duques', 'guimaraes', 'Paço dos Duques de Bragança', 'museu', [41.4462, -8.2905], 'Residência senhorial do século XV com chaminés de tijolo, reconstruída no século XX; abriga coleções de tapeçarias e mobiliário.', { wiki: 'Palace of the Dukes of Braganza', reliability: 'pendente', tags: ['entrada a confirmar'] }),

  // ───────────── PORTO ─────────────
  a('ribeira-porto', 'porto', 'Ribeira', 'bairro', [41.1406, -8.613], 'Antigo cais mercantil à beira do Douro, de casas estreitas e coloridas, com vista para Vila Nova de Gaia e a Ponte D. Luís I.', { tickets: LIVRE, reliability: 'relatado' }),
  a('baixa-porto', 'porto', 'Baixa do Porto', 'bairro', [41.1466, -8.6111], 'Centro comercial e administrativo em torno da Avenida dos Aliados e da estação de São Bento.', { tickets: LIVRE, reliability: 'relatado' }),
  a('clerigos', 'porto', 'Igreja e Torre dos Clérigos', 'igreja', [41.1457, -8.6146], 'Obra barroca de Nicolau Nasoni no século XVIII; a torre é o marco mais reconhecível do horizonte do Porto.', { officialUrl: 'https://www.torredosclerigos.pt/', wiki: 'Clérigos Church', reliability: 'relatado', tags: ['subida à torre a confirmar'] }),
  a('livraria-lello', 'porto', 'Livraria Lello', 'cultura', [41.1469, -8.6149], 'Livraria de 1906 com fachada neogótica, escadaria vermelha e vitral no teto. Visita com reserva em 31/08.', { officialUrl: 'https://www.livrarialello.pt/', wiki: 'Livraria Lello', reliability: 'visitado', tickets: 'Entrada mediante reserva/bilhete (feita para 31/08); valor não registrado.' }),
  a('palacio-cristal', 'porto', 'Jardins do Palácio de Cristal', 'parque', [41.1484, -8.6252], 'Jardins românticos do século XIX sobre a encosta do Douro, com miradouros para o rio e a foz.', { tickets: LIVRE, reliability: 'relatado' }),
  a('estacao-sao-bento', 'porto', 'Estação de São Bento', 'estacao', [41.1456, -8.6105], 'Estação ferroviária no centro do Porto, célebre pelos painéis de azulejo de Jorge Colaço; ponto de partida possível para a Linha do Douro.', { tickets: LIVRE, wiki: 'São Bento railway station', reliability: 'relatado', tags: ['partida via São Bento ou Campanhã conforme bilhete'] }),

  // ───────────── PINHÃO ─────────────
  a('linha-douro', 'pinhao', 'Linha do Douro', 'natureza', undefined, 'Linha ferroviária que acompanha o rio Douro rumo ao interior, com paisagens de socalcos e quintas. Percorrida de ida e volta em 01/09.', { tickets: 'Bilhetes de trem da CP; valor não registrado.', wiki: 'Douro line', reliability: 'visitado' }),
  a('estacao-pinhao', 'pinhao', 'Estação do Pinhão', 'estacao', [41.1897, -7.5459], 'Pequena estação ferroviária decorada com painéis de azulejo sobre a paisagem e a vinha do Douro.', { tickets: LIVRE, reliability: 'visitado' }),
  a('barco-pinhao', 'pinhao', 'Passeio de barco no Douro', 'natureza', undefined, 'Passeio reservado das 17h às 18h, com saída na Rua da Praia, no Pinhão — o rio visto do nível da água, entre as encostas de vinha.', { address: 'Rua da Praia, Pinhão', tickets: 'Reservado; valor e operador não registrados.', reliability: 'visitado' }),

  // ───────────── MADEIRA ─────────────
  a('museu-arte-sacra-funchal', 'madeira', 'Museu de Arte Sacra do Funchal', 'museu', [32.6503, -16.9088], 'Instalado no antigo Paço Episcopal, reúne pintura flamenga dos séculos XV e XVI encomendada no auge do comércio do açúcar.', { wiki: 'Museum of Sacred Art of Funchal', reliability: 'visitado' }),
  a('praca-municipio-funchal', 'madeira', 'Praça do Município', 'monumento', [32.6495, -16.9085], 'Praça de calçada em padrão de escamas, cercada pela Câmara Municipal, pela Igreja do Colégio e pelo Museu de Arte Sacra.', { tickets: LIVRE, reliability: 'visitado' }),
  a('igreja-colegio-funchal', 'madeira', 'Igreja do Colégio', 'igreja', [32.6497, -16.909], 'Igreja jesuíta do século XVII, de fachada sóbria e interior rico em talha dourada e azulejos.', { reliability: 'visitado' }),
  a('se-funchal', 'madeira', 'Sé do Funchal', 'igreja', [32.648, -16.908], 'Catedral do fim do século XV, com teto de madeira de cedro em estilo mudéjar — testemunho da riqueza do ciclo do açúcar.', { tickets: LIVRE, wiki: 'Funchal Cathedral', reliability: 'visitado' }),
  a('avenida-arriaga', 'madeira', 'Avenida Arriaga', 'bairro', [32.6475, -16.9105], 'Avenida arborizada do centro do Funchal, com jacarandás, o Teatro Baltazar Dias e o Jardim Municipal.', { tickets: LIVRE, reliability: 'visitado' }),
  a('mercado-lavradores', 'madeira', 'Mercado dos Lavradores', 'mercado', [32.6497, -16.9037], 'Mercado municipal de 1940 em estilo Art Déco, com painéis de azulejo, bancas de frutas, flores e peixe.', { tickets: LIVRE, wiki: 'Mercado dos Lavradores', reliability: 'visitado' }),
  a('zona-velha-funchal', 'madeira', 'Rua de Santa Maria / Zona Velha', 'bairro', [32.6485, -16.9015], 'O bairro mais antigo do Funchal, conhecido pelas portas pintadas por artistas ao longo da Rua de Santa Maria.', { tickets: LIVRE, reliability: 'visitado' }),
  a('fortaleza-sao-tiago', 'madeira', 'Fortaleza de São Tiago', 'monumento', [32.6463, -16.8999], 'Fortificação amarela do século XVII à beira-mar, na Zona Velha, erguida para defender a cidade de corsários.', { reliability: 'pendente', tags: ['ponto contextual; entrada efetiva a confirmar'] }),
  a('pico-areeiro', 'madeira', 'Pico do Areeiro', 'mirante', [32.7357, -16.9287], 'Terceiro pico mais alto da ilha, a cerca de 1.800 m, com miradouro sobre o maciço central. Visitado como miradouro, sem percorrer a vereda PR1 integralmente.', { tickets: LIVRE, wiki: 'Pico do Areeiro', reliability: 'visitado' }),
  a('santana', 'madeira', 'Santana e as casas típicas', 'cultura', [32.8047, -16.8826], 'Vila da costa norte conhecida pelas casas triangulares de colmo, símbolo da arquitetura rural madeirense.', { tickets: LIVRE, wiki: 'Santana, Madeira', reliability: 'visitado' }),
  a('miradouro-guindaste', 'madeira', 'Miradouro do Guindaste (Faial)', 'mirante', undefined, 'Miradouro sobre a costa norte, perto do Faial, com vista para a Penha de Águia e o mar.', { tickets: LIVRE, reliability: 'visitado' }),
  a('porto-da-cruz', 'madeira', 'Porto da Cruz', 'natureza', [32.77, -16.827], 'Vila da costa nordeste entre falésias e a Penha de Águia, onde ainda funciona um engenho de cana-de-açúcar.', { tickets: LIVRE, wiki: 'Porto da Cruz', reliability: 'relatado', tags: ['conforme registros'] }),
  a('engenhos-norte', 'madeira', 'Engenhos do Norte', 'cultura', undefined, 'Engenho de Porto da Cruz que produz aguardente de cana com maquinaria a vapor histórica.', { reliability: 'pendente', tags: ['visita a confirmar'] }),
  a('cabo-girao', 'madeira', 'Cabo Girão', 'mirante', [32.656, -17.005], 'Falésia de cerca de 580 m com miradouro de piso de vidro sobre o mar e as fajãs cultivadas. Primeira parada do circuito oeste do aniversário de André.', { tickets: LIVRE, wiki: 'Cabo Girão', reliability: 'visitado' }),
  a('ponta-do-sol', 'madeira', 'Ponta do Sol', 'natureza', [32.68, -17.1], 'Vila da costa sul, das mais soalheiras da ilha, com casario entre a encosta e o mar.', { tickets: LIVRE, wiki: 'Ponta do Sol (Madeira)', reliability: 'visitado' }),
  a('seixal', 'madeira', 'Seixal', 'natureza', undefined, 'Pequena localidade da costa norte, com praia de areia negra e encostas de vinha e cascatas.', { tickets: LIVRE, reliability: 'visitado' }),
  a('porto-moniz', 'madeira', 'Porto Moniz', 'natureza', [32.8667, -17.1667], 'No extremo noroeste da ilha, conhecido pelas piscinas naturais formadas em rocha vulcânica. Ponto final do circuito de 04/09.', { tickets: SEM_INFO, wiki: 'Porto Moniz', reliability: 'visitado' }),
  a('ponta-sao-lourenco', 'madeira', 'Ponta de São Lourenço / Machico', 'natureza', [32.7444, -16.7], 'Península árida no extremo leste da ilha e a vila de Machico, local do desembarque dos primeiros povoadores. Foram cogitadas para o fim da estadia.', { tickets: LIVRE, wiki: 'Ponta de São Lourenço', reliability: 'pendente', tags: ['cogitado; não marcar como realizado sem confirmação'] }),

  // ───────────── LISBOA — segunda estadia: cultura ─────────────
  a('museu-banksy', 'lisboa', 'Museu Banksy', 'museu', undefined, 'Exposição dedicada à obra do artista urbano britânico. Aparece nos registros da viagem; a data exata (possivelmente 08/09) está a confirmar.', { reliability: 'relatado' }),
  a('cacilhas', 'lisboa', 'Cacilhas e o Cais do Ginjal', 'bairro', [38.6866, -9.1489], 'Na margem sul do Tejo: do Farol de Cacilhas, caminhada pelo Cais do Ginjal, de armazéns abandonados junto ao rio, até o Ponto Final, com vista para Lisboa e a Ponte 25 de Abril.', { tickets: LIVRE, wiki: 'Cacilhas', reliability: 'visitado' }),
  a('casa-fernando-pessoa', 'lisboa', 'Casa Fernando Pessoa', 'museu', [38.7159, -9.1623], 'Casa-museu em Campo de Ourique onde o poeta viveu de 1920 a 1935; guarda parte de sua biblioteca pessoal e promove programação literária.', { officialUrl: 'https://www.casafernandopessoa.pt/', wiki: 'Casa Fernando Pessoa', reliability: 'visitado' }),
  a('campo-ourique', 'lisboa', 'Campo de Ourique', 'bairro', [38.7175, -9.165], 'Bairro residencial de traçado regular, com comércio de rua, mercado e vida de bairro — a Rua Ferreira Borges é seu eixo comercial.', { tickets: LIVRE, reliability: 'visitado' }),
  a('livraria-travessa', 'lisboa', 'Livraria da Travessa', 'cultura', undefined, 'Filial lisboeta da livraria carioca, ponto de encontro entre literatura brasileira e portuguesa.', { tickets: LIVRE, reliability: 'visitado' }),
  a('principe-real', 'lisboa', 'Príncipe Real / Jardim Fialho de Almeida', 'parque', undefined, 'Registro de passeio pelo Príncipe Real e jardim, conforme anotação da viagem; local exato a confirmar.', { tickets: LIVRE, reliability: 'visitado', tags: ['conforme registro'] }),
  a('gulbenkian', 'lisboa', 'Museu Calouste Gulbenkian', 'museu', [38.737, -9.1543], 'Coleção do magnata arménio Calouste Gulbenkian — do Egito antigo a René Lalique — em edifício modernista cercado por um jardim celebrado.', { officialUrl: 'https://gulbenkian.pt/', wiki: 'Calouste Gulbenkian Museum', reliability: 'visitado' }),
  a('feira-da-ladra', 'lisboa', 'Feira da Ladra', 'mercado', [38.7148, -9.1255], 'Mercado de usados e antiguidades no Campo de Santa Clara, entre São Vicente de Fora e o Panteão.', { tickets: LIVRE, wiki: 'Feira da Ladra', reliability: 'visitado' }),
  a('panteao-nacional', 'lisboa', 'Panteão Nacional', 'monumento', [38.7148, -9.1247], 'Antiga Igreja de Santa Engrácia, cuja cúpula só foi concluída em 1966; guarda túmulos e cenotáfios de figuras nacionais, de Amália Rodrigues a Eusébio.', { wiki: 'National Pantheon (Portugal)', reliability: 'visitado' }),
  a('alfama', 'lisboa', 'Alfama / Rua dos Remédios', 'bairro', [38.7115, -9.13], 'O bairro mais antigo de Lisboa, de becos e escadinhas que sobreviveram ao terramoto de 1755; a Rua dos Remédios é uma de suas artérias.', { tickets: LIVRE, wiki: 'Alfama', reliability: 'visitado' }),
  a('fundacao-saramago', 'lisboa', 'Fundação José Saramago (Casa dos Bicos)', 'cultura', [38.709, -9.1315], 'Sede da fundação do Nobel de Literatura na Casa dos Bicos, edifício do século XVI de fachada em pontas de diamante.', { officialUrl: 'https://www.josesaramago.org/', wiki: 'Casa dos Bicos', reliability: 'visitado' }),
  a('rua-augusta', 'lisboa', 'Rua Augusta', 'bairro', [38.7101, -9.1373], 'Eixo pedonal da Baixa que termina no Arco da Rua Augusta e na Praça do Comércio. Em 12/09, área de drinks — sem bar identificado.', { tickets: LIVRE, wiki: 'Rua Augusta', reliability: 'visitado', tags: ['área de drinks'] }),
  a('avenida-liberdade', 'lisboa', 'Avenida da Liberdade', 'bairro', [38.7194, -9.145], 'Bulevar oitocentista inspirado nos de Paris, entre os Restauradores e o Marquês de Pombal.', { tickets: LIVRE, wiki: 'Avenida da Liberdade', reliability: 'visitado' }),
  a('largo-carmo', 'lisboa', 'Largo do Carmo', 'monumento', [38.7121, -9.1407], 'Praça diante das ruínas do Convento do Carmo, palco da rendição de Marcelo Caetano em 25 de abril de 1974. Em 13/09, área de drinks — sem bar identificado.', { tickets: LIVRE, reliability: 'visitado', tags: ['área de drinks'] }),
  a('pink-street', 'lisboa', 'Pink Street / Cais do Sodré', 'bairro', [38.7072, -9.144], 'A Rua Nova do Carvalho, de piso pintado de rosa, antigo reduto portuário convertido em polo noturno. Em 09/09, área de drinks — sem bar identificado.', { tickets: LIVRE, reliability: 'visitado', tags: ['área de drinks'] }),

  // ───────────── LISBOA — gastronomia ─────────────
  a('o-portas', 'lisboa', 'O Portas', 'gastronomia', undefined, 'Restaurante na Baixa. Pedido registrado: bacalhau assado. Associado a 07/09 segundo registro anterior.', { address: 'Baixa, Lisboa', tickets: RESTAURANTE, reliability: 'visitado', tags: ['restaurante', 'bacalhau assado'] }),
  a('mezzogiorno', 'lisboa', 'Pizzeria Mezzogiorno', 'gastronomia', undefined, 'Pizzaria de cozinha italiana. Visita confirmada; data e pedido não registrados.', { tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante', 'italiano'] }),
  a('pinoquio', 'lisboa', 'Restaurante Pinóquio', 'gastronomia', [38.7155, -9.1415], 'Restaurante na Praça dos Restauradores. Visita confirmada; data e pedido não registrados.', { address: 'Praça dos Restauradores, Lisboa', tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante'] }),
  a('as-velhas', 'lisboa', 'As Velhas', 'gastronomia', undefined, 'Restaurante na Rua da Conceição da Glória. Visita confirmada; data e pedido não registrados.', { address: 'Rua da Conceição da Glória, Lisboa', tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante'] }),
  a('farta-brutos', 'lisboa', 'Farta Brutos', 'gastronomia', undefined, 'Restaurante de cozinha portuguesa. Visita confirmada; data e pedido não registrados.', { tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante', 'cozinha portuguesa'] }),
  a('time-out-market', 'lisboa', 'Time Out Market Lisboa', 'gastronomia', [38.7068, -9.1458], 'Praça de alimentação no Mercado da Ribeira, no Cais do Sodré. Aparece nos registros da viagem; a data (possivelmente 08/09) está a confirmar.', { address: 'Mercado da Ribeira, Cais do Sodré', tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante', 'mercado'] }),
  a('o-bitoque', 'lisboa', 'O Bitoque', 'gastronomia', undefined, 'Restaurante em Campo de Ourique. Pedido registrado em 10/09: Bitoque à Casa, alheira com ovo e vinho Pousio branco.', { address: 'Campo de Ourique, Lisboa', tickets: RESTAURANTE, reliability: 'visitado', tags: ['restaurante', 'bitoque', 'alheira', 'Pousio branco'] }),
  a('laurentina', 'lisboa', 'Laurentina – O Rei do Bacalhau', 'gastronomia', undefined, 'Restaurante nas Avenidas Novas, perto da Gulbenkian. Almoço de 11/09: pataniscas de bacalhau e bacalhau à Zé do Pipo.', { address: 'Avenidas Novas, Lisboa', tickets: RESTAURANTE, reliability: 'visitado', tags: ['restaurante', 'pataniscas', 'bacalhau à Zé do Pipo'] }),
  a('chiado-garden', 'lisboa', 'Chiado Garden', 'gastronomia', undefined, 'Local gastronômico na Rua da Trindade, no Chiado. Visitado em 13/09; pedido não registrado.', { address: 'Rua da Trindade, Chiado', tickets: RESTAURANTE, reliability: 'visitado', tags: ['restaurante'] }),
  a('bites-tapas', 'lisboa', 'Bites Tapas & Wine', 'gastronomia', undefined, 'Tapas e vinhos na Rua da Barroca, Bairro Alto. Visita confirmada; data não atribuída.', { address: 'Rua da Barroca, Bairro Alto', tickets: RESTAURANTE, reliability: 'relatado', tags: ['restaurante', 'tapas'] }),
  a('restaurante-remedios', 'lisboa', 'Restaurante na Rua dos Remédios (nome a confirmar)', 'gastronomia', undefined, 'Almoço em Alfama em 12/09, em restaurante cujo nome não foi recuperado.', { address: 'Rua dos Remédios, Alfama', tickets: RESTAURANTE, reliability: 'visitado', tags: ['restaurante', 'nome pendente'] }),
  a('shelter-bar', 'lisboa', 'Shelter Bar', 'gastronomia', undefined, 'Bar no Bairro Alto. Visita confirmada; data não atribuída.', { address: 'Bairro Alto, Lisboa', tickets: 'Bar — consumo à parte; preços não registrados.', reliability: 'relatado', tags: ['bar'] }),
]

// ───────────────────────── hospedagens ─────────────────────────

const hotels: Hotel[] = [
  { cityId: 'lisboa', name: 'Hotel Borges Chiado', nights: 3, checkIn: '2026-08-24', checkOut: '2026-08-27', coords: { lat: 38.7107, lng: -9.1421 }, notes: ['Primeira estadia em Lisboa, no Chiado.'] },
  { cityId: 'obidos', name: 'The Literary Man', nights: 1, checkIn: '2026-08-27', checkOut: '2026-08-28', notes: ['Hotel temático literário em Óbidos.'] },
  { cityId: 'guimaraes', name: 'EMAJ Guimarães Boutique Hotel', nights: 2, checkIn: '2026-08-28', checkOut: '2026-08-30' },
  { cityId: 'porto', name: 'HF Ala Sul', nights: 3, checkIn: '2026-08-30', checkOut: '2026-09-02', notes: ['Nome comercial exato a confirmar.', 'Base também para o bate-volta ao Pinhão em 01/09.'] },
  { cityId: 'madeira', name: 'Hotel Duas Torres', nights: 4, checkIn: '2026-09-02', checkOut: '2026-09-06', notes: ['Funchal.'] },
  { cityId: 'lisboa', name: 'SANA Capitol Hotel', nights: 8, checkIn: '2026-09-06', checkOut: '2026-09-14', notes: ['Segunda estadia em Lisboa, durante o evento de museus de Ricardo (07 a 11/09).'] },
]

// ───────────────────────── deslocamentos ─────────────────────────

const transport: TransportLeg[] = [
  { id: 'lis-fat', date: '2026-08-27', from: 'Lisboa', to: 'Fátima', fromCity: 'lisboa', toCity: 'fatima', mode: 'carro', status: 'confirmado', notes: ['Carro alugado.'] },
  { id: 'fat-obi', date: '2026-08-27', from: 'Fátima', to: 'Óbidos', fromCity: 'fatima', toCity: 'obidos', mode: 'carro', status: 'confirmado', notes: ['Carro alugado.'] },
  { id: 'obi-gui', date: '2026-08-28', from: 'Óbidos', to: 'Guimarães', fromCity: 'obidos', toCity: 'guimaraes', mode: 'carro', status: 'confirmado', notes: ['Carro alugado.'] },
  { id: 'gui-opo', date: '2026-08-30', from: 'Guimarães', to: 'Porto', fromCity: 'guimaraes', toCity: 'porto', mode: 'carro', status: 'confirmado', notes: ['Trajeto direto, sem paradas em Amarante ou Coimbra.', 'Carro devolvido no Porto.'] },
  { id: 'opo-pin', date: '2026-09-01', from: 'Porto (São Bento/Campanhã)', to: 'Pinhão', fromCity: 'porto', toCity: 'pinhao', mode: 'trem', operator: 'CP', service: 'Linha do Douro', status: 'confirmado', notes: ['Estação de partida e horários conforme bilhete.'] },
  { id: 'pin-opo', date: '2026-09-01', from: 'Pinhão', to: 'Porto', fromCity: 'pinhao', toCity: 'porto', mode: 'trem', operator: 'CP', service: 'Linha do Douro', status: 'confirmado', notes: ['Retorno noturno, com conexões via Régua e Marco de Canaveses conforme bilhetes.'] },
  { id: 'opo-fnc', date: '2026-09-02', from: 'Porto', to: 'Funchal', fromCity: 'porto', toCity: 'madeira', mode: 'aviao', status: 'confirmado', notes: ['Voo cedo; companhia e horários a confirmar.'] },
  { id: 'carro-madeira', date: '2026-09-02', from: 'Funchal', to: 'Volta pela ilha', fromCity: 'madeira', mode: 'carro', status: 'confirmado', notes: ['Carro alugado na Madeira; último dia de uso em 05/09.'] },
  { id: 'fnc-lis', date: '2026-09-06', from: 'Funchal', to: 'Lisboa', fromCity: 'madeira', toCity: 'lisboa', mode: 'aviao', departure: '08:40', arrival: '10:25', status: 'confirmado' },
  { id: 'cais-cacilhas', date: '2026-09-09', from: 'Cais do Sodré', to: 'Cacilhas', fromCity: 'lisboa', toCity: 'lisboa', mode: 'barco', status: 'confirmado', notes: ['Ida e volta de barco pelo Tejo.'] },
  { id: 'lis-for', date: '2026-09-14', from: 'Lisboa', to: 'Fortaleza', fromCity: 'lisboa', toCity: 'fortaleza', mode: 'aviao', departure: '19:00', status: 'confirmado', notes: ['Companhia e horário de chegada a confirmar.'] },
]

// ───────────────────────── dias ─────────────────────────

const days: TripDay[] = [
  // Lisboa — primeira estadia
  {
    date: '2026-08-24',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Chegada a Lisboa',
    items: items([
      ['Chegada a Lisboa', { k: 'transporte', r: 'visitado', n: 'Detalhes do voo de ida a confirmar.' }],
      ['Check-in no Hotel Borges Chiado', { k: 'logistica' }],
      ['Primeiros passos pelo Chiado', { a: 'chiado', r: 'relatado', n: 'Contexto da estadia; atividades exatas do dia a confirmar.' }],
    ]),
    notes: ['Cartão de diário a completar com as memórias do dia.'],
  },
  {
    date: '2026-08-25',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Lisboa: Chiado e Baixa',
    items: items([
      ['Chiado e Baixa como contexto da estadia', { a: 'baixa', r: 'relatado', n: 'Não há atração específica confirmada para esta data.' }],
    ]),
    notes: ['Cartão de diário a completar com as memórias do dia.'],
  },
  {
    date: '2026-08-26',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Lisboa: último dia no Chiado',
    items: items([
      ['Bairros, cafés e experiências culturais', { k: 'livre', r: 'relatado', n: 'Não há atração específica confirmada para esta data.' }],
    ]),
    notes: ['Cartão de diário a completar com as memórias do dia.'],
  },
  {
    date: '2026-08-27',
    cityId: 'obidos',
    timezone: LISBOA_TZ,
    title: 'Fátima e chegada a Óbidos',
    items: items([
      ['Saída de carro de Lisboa', { k: 'transporte' }],
      ['Parada no Santuário de Fátima', { a: 'santuario-fatima' }],
      ['Capelinha das Aparições e basílicas', { a: 'capelinha-aparicoes', r: 'pendente', n: 'Pontos de interesse do conjunto; entrada em cada edifício a confirmar.' }],
      ['Continuação de carro até Óbidos', { k: 'transporte' }],
      ['Check-in no The Literary Man', { k: 'logistica' }],
      ['Vila medieval: Porta da Vila, Rua Direita e a vila à noite', { a: 'vila-obidos' }],
    ]),
  },
  {
    date: '2026-08-28',
    cityId: 'guimaraes',
    timezone: LISBOA_TZ,
    title: 'De Óbidos a Guimarães',
    items: items([
      ['Manhã em Óbidos: muralhas, castelo e livrarias', { a: 'muralhas-castelo-obidos', r: 'pendente', n: 'Visitas específicas a confirmar.' }],
      ['Viagem de carro para Guimarães', { k: 'transporte' }],
      ['Check-in no EMAJ Guimarães Boutique Hotel', { k: 'logistica' }],
      ['Centro histórico de Guimarães', { a: 'centro-historico-guimaraes' }],
    ]),
  },
  {
    date: '2026-08-29',
    cityId: 'guimaraes',
    timezone: LISBOA_TZ,
    title: 'Guimarães, berço de Portugal',
    items: items([
      ['Centro histórico: Largo da Oliveira, Praça de Santiago, Rua de Santa Maria', { a: 'largo-oliveira', r: 'relatado' }],
      ['Colina do castelo: Castelo, Igreja de São Miguel e Paço dos Duques', { a: 'castelo-guimaraes', r: 'pendente', n: 'Status de visita e entradas a validar.' }],
    ]),
  },
  {
    date: '2026-08-30',
    cityId: 'porto',
    timezone: LISBOA_TZ,
    title: 'Chegada ao Porto',
    items: items([
      ['Saída direta de carro de Guimarães para o Porto', { k: 'transporte', n: 'Sem passagem por Coimbra ou Amarante.' }],
      ['Devolução do carro alugado', { k: 'logistica' }],
      ['Check-in no HF Ala Sul', { k: 'logistica', n: 'Nome comercial exato a confirmar.' }],
    ]),
  },
  {
    date: '2026-08-31',
    cityId: 'porto',
    timezone: LISBOA_TZ,
    title: 'Porto: Livraria Lello e centro histórico',
    items: items([
      ['Livraria Lello, com reserva', { a: 'livraria-lello' }],
      ['Ribeira, Baixa, Clérigos e Jardins do Palácio de Cristal', { a: 'ribeira-porto', r: 'relatado', n: 'Visitados durante a estadia; data exata de cada um não registrada.' }],
    ]),
  },
  {
    date: '2026-09-01',
    cityId: 'pinhao',
    timezone: LISBOA_TZ,
    title: 'De trem ao Pinhão, no Vale do Douro',
    items: items([
      ['Trem pela Linha do Douro: Porto → Pinhão', { a: 'linha-douro', k: 'transporte', n: 'Partida de São Bento/Campanhã conforme bilhete.' }],
      ['Estação do Pinhão e a vila à beira-rio', { a: 'estacao-pinhao' }],
      ['Passeio de barco no Douro, saída na Rua da Praia', { t: '17:00', a: 'barco-pinhao', r: 'visitado', n: 'Reservado das 17h às 18h.' }],
      ['Retorno noturno de trem ao Porto', { k: 'transporte', n: 'Conexões via Régua e Marco de Canaveses conforme bilhetes.' }],
    ]),
    notes: ['Não houve visita a quinta vinícola nem degustação formal registrada.'],
  },
  // Madeira
  {
    date: '2026-09-02',
    cityId: 'madeira',
    timezone: MADEIRA_TZ,
    title: 'Chegada ao Funchal e centro histórico',
    items: items([
      ['Voo cedo Porto → Funchal', { k: 'transporte', n: 'Horários a confirmar.' }],
      ['Check-in no Hotel Duas Torres', { k: 'logistica' }],
      ['Museu de Arte Sacra', { a: 'museu-arte-sacra-funchal' }],
      ['Praça do Município', { a: 'praca-municipio-funchal' }],
      ['Igreja do Colégio', { a: 'igreja-colegio-funchal' }],
      ['Sé do Funchal', { a: 'se-funchal' }],
      ['Avenida Arriaga', { a: 'avenida-arriaga' }],
      ['Mercado dos Lavradores', { a: 'mercado-lavradores' }],
      ['Rua de Santa Maria e Zona Velha', { a: 'zona-velha-funchal' }],
      ['Fortaleza de São Tiago', { a: 'fortaleza-sao-tiago', r: 'pendente', n: 'Ponto contextual; entrada efetiva a verificar.' }],
    ]),
  },
  {
    date: '2026-09-03',
    cityId: 'madeira',
    timezone: MADEIRA_TZ,
    title: 'Pico do Areeiro e a costa norte',
    items: items([
      ['Roteiro paisagístico de carro com pequenas caminhadas', { k: 'transporte' }],
      ['Pico do Areeiro — miradouro', { a: 'pico-areeiro', n: 'Sem percorrer a PR1 integralmente.' }],
      ['Santana e as casas típicas', { a: 'santana' }],
      ['Miradouro do Guindaste, no Faial', { a: 'miradouro-guindaste' }],
      ['Porto da Cruz', { a: 'porto-da-cruz', r: 'relatado', n: 'Conforme registros.' }],
      ['Engenhos do Norte', { a: 'engenhos-norte', r: 'pendente', n: 'Visita a confirmar.' }],
    ]),
  },
  {
    date: '2026-09-04',
    cityId: 'madeira',
    timezone: MADEIRA_TZ,
    title: 'Aniversário de André: circuito oeste',
    items: items([
      ['Cabo Girão', { a: 'cabo-girao' }],
      ['Ponta do Sol', { a: 'ponta-do-sol' }],
      ['Seixal', { a: 'seixal' }],
      ['Porto Moniz e as piscinas naturais', { a: 'porto-moniz' }],
    ]),
    notes: [
      'Dia do aniversário de André, celebrado ao longo da costa oeste da ilha.',
      'Banho nas piscinas, restaurante ou brinde não foram registrados — completar no diário se for o caso.',
    ],
  },
  {
    date: '2026-09-05',
    cityId: 'madeira',
    timezone: MADEIRA_TZ,
    title: 'Último dia de carro na Madeira',
    items: items([
      ['Último dia com o carro alugado e retorno à base no Funchal', { k: 'transporte' }],
      ['Ponta de São Lourenço / Machico', { a: 'ponta-sao-lourenco', r: 'pendente', n: 'Cogitado; não marcar como realizado sem confirmação.' }],
    ]),
  },
  {
    date: '2026-09-06',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'De volta a Lisboa',
    items: items([
      ['Voo Funchal → Lisboa', { t: '08:40', k: 'transporte', n: 'Chegada às 10h25.' }],
      ['Check-in no SANA Capitol Hotel', { k: 'logistica' }],
    ]),
  },
  // Lisboa — segunda estadia
  {
    date: '2026-09-07',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Evento de museus e bacalhau na Baixa',
    items: items([
      ['Evento de museus (Ricardo)', { k: 'logistica', n: 'Evento de 07 a 11/09.' }],
      ['O Portas — bacalhau assado', { a: 'o-portas', k: 'refeicao', n: 'Data segundo registro anterior.' }],
    ]),
  },
  {
    date: '2026-09-08',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Banksy e Time Out Market',
    items: items([
      ['Evento de museus (Ricardo)', { k: 'logistica' }],
      ['Museu Banksy', { a: 'museu-banksy', r: 'relatado', n: 'Associação exata a esta data a confirmar.' }],
      ['Time Out Market Lisboa', { a: 'time-out-market', k: 'refeicao', r: 'relatado', n: 'Associação exata a esta data a confirmar.' }],
    ]),
  },
  {
    date: '2026-09-09',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Travessia do Tejo até Cacilhas',
    items: items([
      ['Barco Cais do Sodré → Cacilhas', { k: 'transporte' }],
      ['Farol de Cacilhas, Cais do Ginjal, Ponto Final e Rua Cândido dos Reis', { a: 'cacilhas' }],
      ['Volta de barco a Lisboa', { k: 'transporte' }],
      ['Drinks na Pink Street', { a: 'pink-street', k: 'refeicao', n: 'Área de drinks; bar não identificado.' }],
    ]),
  },
  {
    date: '2026-09-10',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Pessoa, Campo de Ourique e Príncipe Real',
    items: items([
      ['Casa Fernando Pessoa', { a: 'casa-fernando-pessoa' }],
      ['Campo de Ourique e Rua Ferreira Borges', { a: 'campo-ourique' }],
      ['O Bitoque — Bitoque à Casa, alheira com ovo e vinho Pousio branco', { a: 'o-bitoque', k: 'refeicao' }],
      ['Livraria da Travessa', { a: 'livraria-travessa' }],
      ['Príncipe Real / Jardim Fialho de Almeida', { a: 'principe-real', n: 'Conforme registro.' }],
    ]),
  },
  {
    date: '2026-09-11',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Gulbenkian e o Rei do Bacalhau',
    items: items([
      ['Museu Calouste Gulbenkian', { a: 'gulbenkian' }],
      ['Almoço na Laurentina – O Rei do Bacalhau: pataniscas e bacalhau à Zé do Pipo', { a: 'laurentina', k: 'refeicao' }],
    ]),
    notes: ['Último dia do evento de museus. Bites Tapas & Wine e Shelter Bar foram visitados na estadia, mas sem data atribuída.'],
  },
  {
    date: '2026-09-12',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Feira da Ladra, Alfama e Saramago',
    items: items([
      ['Feira da Ladra', { a: 'feira-da-ladra' }],
      ['Panteão Nacional', { a: 'panteao-nacional' }],
      ['Alfama e Rua dos Remédios', { a: 'alfama' }],
      ['Almoço na Rua dos Remédios', { a: 'restaurante-remedios', k: 'refeicao', n: 'Nome do restaurante a confirmar.' }],
      ['Fundação José Saramago', { a: 'fundacao-saramago' }],
      ['Drinks na Rua Augusta', { a: 'rua-augusta', k: 'refeicao', n: 'Conforme relatos; bar não identificado.' }],
    ]),
  },
  {
    date: '2026-09-13',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Avenida da Liberdade e Chiado',
    items: items([
      ['Avenida da Liberdade', { a: 'avenida-liberdade' }],
      ['Chiado', { a: 'chiado' }],
      ['Chiado Garden, na Rua da Trindade', { a: 'chiado-garden', k: 'refeicao' }],
      ['Drinks no Largo do Carmo', { a: 'largo-carmo', k: 'refeicao', n: 'Conforme relatos; bar não identificado.' }],
    ]),
  },
  {
    date: '2026-09-14',
    cityId: 'lisboa',
    timezone: LISBOA_TZ,
    title: 'Última manhã e voo de volta',
    items: items([
      ['Última manhã em Lisboa', { k: 'livre', r: 'relatado' }],
      ['Check-out do SANA Capitol Hotel', { k: 'logistica' }],
      ['Voo Lisboa → Fortaleza', { t: '19:00', k: 'transporte' }],
    ]),
  },
]

// ───────────────────────── viagem ─────────────────────────

export const trip: Trip = {
  slug: 'portugal-madeira-2026',
  title: 'Portugal & Madeira 2026',
  subtitle: '22 dias de histórias entre o continente e o Atlântico',
  tagline: 'De Lisboa ao Douro e à Madeira, com André e Ricardo',
  travelers: ['André', 'Ricardo'],
  start: '2026-08-24',
  end: '2026-09-14',
  homeTimezone: 'America/Fortaleza',
  emoji: '🇵🇹',
  accent: '#2F5D50',
  intro: [
    'Vinte e dois dias, de 24 de agosto a 14 de setembro de 2026, num percurso que atravessa a história de Portugal de sul a norte e depois salta para o meio do Atlântico: Lisboa, o Santuário de Fátima, a vila muralhada de Óbidos, Guimarães — onde o país começou —, o Porto e o Vale do Douro de trem, e a ilha da Madeira.',
    'A volta terminou em Lisboa, numa segunda estadia marcada pelo evento de museus de Ricardo e por dias de bairros, livrarias, casas de escritores e mesas portuguesas — do bacalhau assado d’O Portas às pataniscas da Laurentina.',
    'Este é o registro da viagem como ela aconteceu: o que foi confirmado aparece como visitado; o que foi relatado sem data, ou ainda depende de confirmação, está sinalizado.',
  ],
  cities,
  attractions,
  days,
  hotels,
  transport,
  extraPlaces: {
    fortaleza: { name: 'Fortaleza', lat: -3.7319, lng: -38.5267 },
  },
  futureIdeas: [
    { name: 'Coimbra', reason: 'Universidade, Biblioteca Joanina e Baixa; cogitada no caminho para o Norte, mas descartada.' },
    { name: 'Amarante', reason: 'Ponte e convento de São Gonçalo; cogitada entre Guimarães e o Porto, mas o trajeto foi direto.' },
    { name: 'Arrábida / Azeitão', reason: 'Serra da Arrábida e Vila Nogueira de Azeitão, ao sul de Lisboa; cogitadas e não visitadas.' },
    { name: 'Cascais / Guincho', reason: 'Costa a oeste de Lisboa; cogitada e não visitada.' },
    { name: 'Ponta de São Lourenço / Machico', reason: 'Leste da Madeira, cogitado para 05/09; visita não confirmada.' },
    { name: 'Vereda PR1', reason: 'O Pico do Areeiro foi visto do miradouro, sem percorrer a vereda até o Pico Ruivo.' },
  ],
  editorialNotes: [
    'Coimbra e Amarante foram descartadas do roteiro e não foram visitadas: o trajeto Guimarães → Porto foi direto.',
    'Arrábida/Azeitão e Cascais/Guincho chegaram a ser cogitados, mas não foram visitados.',
    'O Pinhão foi um bate-volta de trem desde o Porto, sem pernoite; não houve visita a quinta nem degustação formal registrada.',
    'Fátima foi uma parada sem pernoite; a entrada em cada edifício do santuário não está confirmada.',
    'Na Madeira, o leste (Ponta de São Lourenço/Machico) havia sido cogitado para 05/09 e segue a confirmar.',
    'Em Lisboa, Museu Banksy e Time Out Market estão associados a 08/09 de forma provisória; Pizzeria Mezzogiorno, Restaurante Pinóquio, As Velhas, Farta Brutos, Bites Tapas & Wine e Shelter Bar foram visitados, mas sem data atribuída.',
    'O nome do restaurante da Rua dos Remédios (12/09) e o nome comercial exato do hotel do Porto (HF Ala Sul) estão a confirmar.',
    'Pink Street, Rua Augusta e Largo do Carmo são áreas onde houve drinks, não nomes de bares.',
    'Preços, horários de funcionamento e avaliações não foram registrados e não são apresentados.',
  ],
  info: [
    {
      title: 'Como ler os registros',
      items: [
        'Visitado: aconteceu, com data registrada.',
        'Relatado: aconteceu durante a viagem, mas sem data exata.',
        'A confirmar: entrada, data ou nome ainda dependem de verificação.',
        'Não visitado: cogitado e deixado de fora.',
      ],
    },
    {
      title: 'Deslocamentos',
      items: [
        'Carro alugado de Lisboa a Fátima, Óbidos, Guimarães e Porto (devolvido no Porto).',
        'Trem Porto → Pinhão → Porto pela Linha do Douro.',
        'Voo Porto → Funchal; carro alugado na Madeira; voo Funchal → Lisboa.',
        'Barco Cais do Sodré ↔ Cacilhas; voo de retorno Lisboa → Fortaleza.',
      ],
    },
  ],
}
