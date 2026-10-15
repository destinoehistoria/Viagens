import type { City, Hotel } from '../../types'

/**
 * Cidades da viagem. Valores de clima são ESTIMATIVAS climatológicas aproximadas
 * para dezembro (médias históricas), não previsões para 2026.
 */
export const cities: City[] = [
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Espanha',
    countryCode: 'ES',
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    coords: { lat: 41.3874, lng: 2.1686 },
    zoom: 13,
    arrival: '2026-11-27',
    departure: '2026-12-01',
    nights: 4,
    isBase: true,
    tagline: 'Modernismo, Mediterrâneo e o Natal da Fira de Santa Llúcia',
    summary:
      'Capital da Catalunha, Barcelona combina o labirinto medieval do Bairro Gótico com a ousadia modernista de Gaudí, Domènech i Montaner e Puig i Cadafalch no Eixample.',
    history: [
      'Fundada como colônia romana (Barcino) no século I a.C., a cidade conserva trechos de muralha e templos romanos sob o Bairro Gótico, visíveis no subsolo do MUHBA, na Plaça del Rei.',
      'Na Idade Média, foi centro da Coroa de Aragão e potência comercial do Mediterrâneo — época da Catedral e de Santa Maria del Mar, joia do gótico catalão.',
      'O Plano Cerdà (1859) criou o Eixample em grade ortogonal; ali floresceu o Modernisme, movimento que deu à cidade a Sagrada Família, a Casa Batlló, a Pedrera e o Palau de la Música.',
    ],
    climate: {
      minC: 6,
      maxC: 15,
      daylight: '≈ 9h de luz natural',
      note: 'Inverno ameno e seco em relação ao norte da Europa; noites frescas e úmidas perto do mar.',
    },
    markets: [
      {
        name: 'Fira de Santa Llúcia',
        description:
          'Mercado tradicional diante da Catedral, com figuras de presépio, musgo, árvores e o curioso caganer catalão. Realizado há mais de dois séculos.',
        status: 'Datas da edição 2026 a confirmar no site da prefeitura.',
      },
    ],
    food: [
      'Tapas e vermut em El Born e Gràcia',
      'Pa amb tomàquet, croquetas e bombas da Barceloneta',
      'Escudella i carn d’olla, prato tradicional do inverno e do Natal catalão',
      'Torrons e neules, doces natalinos catalães',
    ],
    curiosities: [
      'O caganer, figura agachada escondida nos presépios catalães, é tradição desde o século XVIII.',
      'O Tió de Nadal, tronco sorridente coberto por uma manta, “entrega” doces às crianças na noite de Natal.',
      'A Sagrada Família está em construção desde 1882; Gaudí está sepultado na cripta.',
    ],
    gettingAround: [
      'Metrô e ônibus da TMB; cartões de viagens múltiplas costumam compensar para estadias de vários dias (consultar tarifas vigentes em tmb.cat).',
      'O centro histórico (Gótico, El Born) é melhor explorado a pé.',
      'Park Güell fica em uma encosta: considerar ônibus ou metrô até perto e subir a pé.',
    ],
    links: [
      { label: 'Turismo oficial de Barcelona', url: 'https://www.barcelonaturisme.com/' },
      { label: 'Prefeitura — Natal em Barcelona', url: 'https://www.barcelona.cat/' },
      { label: 'Transporte público (TMB)', url: 'https://www.tmb.cat/' },
    ],
    wiki: 'Barcelona',
    accent: '#B5703D',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'França',
    countryCode: 'FR',
    flag: '🇫🇷',
    timezone: 'Europe/Paris',
    coords: { lat: 48.8625, lng: 2.3425 },
    zoom: 13,
    arrival: '2026-12-01',
    departure: '2026-12-06',
    nights: 5,
    isBase: true,
    tagline: 'Uma Paris literária, de passagens cobertas e vitrines iluminadas',
    summary:
      'Para quem já conhece os cartões-postais, esta Paris privilegia bibliotecas, passagens cobertas do século XIX, o Marais aristocrático e o Quartier Latin das livrarias.',
    history: [
      'De Lutécia galo-romana na Île de la Cité à capital dos Capetos, Paris cresceu em anéis sucessivos de muralhas, ainda legíveis no traçado dos boulevards.',
      'O Marais concentrou os hôtels particuliers da nobreza nos séculos XVI e XVII, em torno da Place Royale — hoje Place des Vosges.',
      'As passagens cobertas (Vivienne, Panoramas) foram os primeiros shoppings do mundo, no início do século XIX; o Segundo Império de Haussmann redesenhou a cidade com os grandes boulevards e a Ópera Garnier.',
    ],
    climate: {
      minC: 4,
      maxC: 8,
      daylight: '≈ 8h15 de luz natural',
      note: 'Céu frequentemente encoberto, garoa e vento; neve é ocasional.',
    },
    markets: [
      {
        name: 'Mercados de Natal de Paris',
        description:
          'Paris tem vários mercados sazonais cujas localizações mudam de ano para ano. As vitrines animadas das Galeries Lafayette e do Printemps são uma tradição consolidada.',
        status: 'Locais e datas de 2026 a confirmar perto da viagem (parisjetaime.com).',
      },
    ],
    food: [
      'Bistrôs e brasseries clássicos; jantar em uma passagem coberta',
      'Falafel e doces judaicos na Rue des Rosiers',
      'Bûche de Noël e chocolates artesanais de temporada',
      'Vin chaud nos mercados',
    ],
    curiosities: [
      'A Galerie Vivienne (1823) conserva mosaicos e o piso original; abriga uma livraria fundada no século XIX.',
      'A Salle Ovale da BnF, reaberta ao público após a restauração do site Richelieu, tem acesso livre em horários definidos.',
      'Victor Hugo viveu de 1832 a 1848 no nº 6 da Place des Vosges, onde escreveu parte de Os Miseráveis.',
    ],
    gettingAround: [
      'Metrô, RER e ônibus da RATP; verificar tarifas e passes vigentes em ratp.fr.',
      'O hotel (Rue Caumartin) fica a poucos minutos a pé da Ópera Garnier e dos grandes magazines.',
      'Para trechos entre Marais, Île Saint-Louis e Quartier Latin, caminhar pelas margens do Sena é o melhor caminho.',
    ],
    links: [
      { label: 'Paris je t’aime — turismo oficial', url: 'https://parisjetaime.com/' },
      { label: 'RATP — transporte público', url: 'https://www.ratp.fr/' },
    ],
    wiki: 'Paris',
    accent: '#4B5D7A',
  },
  {
    id: 'colmar',
    name: 'Colmar',
    country: 'França',
    countryCode: 'FR',
    flag: '🇫🇷',
    timezone: 'Europe/Paris',
    coords: { lat: 48.0778, lng: 7.3584 },
    zoom: 15,
    arrival: '2026-12-06',
    departure: '2026-12-09',
    nights: 3,
    isBase: true,
    tagline: 'Enxaimel colorido, canais e vários mercados de Natal',
    summary:
      'Pequena joia da Alsácia, Colmar preserva casas em enxaimel, a Petite Venise às margens do Lauch e o Musée Unterlinden com o Retábulo de Issenheim.',
    history: [
      'Cidade livre do Sacro Império e membro da Decápole alsaciana, Colmar prosperou com o comércio de vinho — o Koïfhus (antiga alfândega) é testemunho desse período.',
      'Passou da soberania alemã para a francesa em 1648 e alternou entre os dois países até 1945, o que explica a mistura de nomes e tradições.',
      'É a terra natal de Frédéric Auguste Bartholdi, escultor da Estátua da Liberdade.',
    ],
    climate: {
      minC: -1,
      maxC: 5,
      daylight: '≈ 8h20 de luz natural',
      note: 'Um dos climas mais secos da França, mas frio; geadas são comuns.',
    },
    markets: [
      {
        name: 'Mercados de Natal de Colmar',
        description:
          'Tradicionalmente distribuídos em várias praças do centro (Dominicains, Ancienne Douane, Jeanne d’Arc, Petite Venise e outras), cada um com temática própria.',
        status: 'Datas, horários e praças da edição 2026 a confirmar em noel-colmar.com / tourisme-colmar.com.',
      },
    ],
    food: [
      'Choucroute garnie e baeckeoffe',
      'Tarte flambée (flammekueche)',
      'Bredele, biscoitos natalinos alsacianos',
      'Vinhos da Alsácia: riesling, gewurztraminer, crémant',
    ],
    curiosities: [
      'Uma réplica da Estátua da Liberdade recebe quem chega pela estrada ao norte da cidade, em homenagem a Bartholdi.',
      'O nome Maison des Têtes vem das mais de cem cabeças esculpidas na fachada.',
    ],
    gettingAround: [
      'O centro histórico é compacto e percorrido a pé.',
      'Para os vilarejos (Eguisheim, Riquewihr, Kaysersberg), comparar ônibus regionais, navetas sazonais e excursões — calendário de 2026 a verificar.',
    ],
    links: [
      { label: 'Turismo de Colmar', url: 'https://www.tourisme-colmar.com/' },
      { label: 'Natal em Colmar', url: 'https://www.noel-colmar.com/' },
    ],
    wiki: 'Colmar',
    accent: '#A35A4A',
  },
  {
    id: 'strasbourg',
    name: 'Strasbourg',
    country: 'França',
    countryCode: 'FR',
    flag: '🇫🇷',
    timezone: 'Europe/Paris',
    coords: { lat: 48.5822, lng: 7.7470 },
    zoom: 14,
    arrival: '2026-12-09',
    departure: '2026-12-14',
    nights: 5,
    isBase: true,
    tagline: 'A “Capital do Natal” e sua catedral de arenito rosa',
    summary:
      'Strasbourg reúne a Grande Île medieval, patrimônio mundial da UNESCO, e a Neustadt imperial alemã, também inscrita pela UNESCO em 2017.',
    history: [
      'Fundada como acampamento romano (Argentoratum), tornou-se cidade livre imperial e centro do humanismo — Gutenberg trabalhou aqui antes de Mainz.',
      'A Catedral de Notre-Dame, com sua flecha de 142 m, foi o edifício mais alto do mundo entre os séculos XVII e XIX.',
      'Anexada ao Império Alemão em 1871, ganhou a Neustadt; reintegrada à França, tornou-se sede de instituições europeias após 1949.',
    ],
    climate: {
      minC: 0,
      maxC: 5,
      daylight: '≈ 8h15 de luz natural',
      note: 'Frio continental, nevoeiros frequentes junto ao Reno.',
    },
    markets: [
      {
        name: 'Christkindelsmärik',
        description:
          'Um dos mais antigos mercados de Natal da Europa, com origem documentada em 1570, tradicionalmente na Place Broglie e ao redor da Catedral, além de vários outros pontos da cidade.',
        status: 'Datas e horários de 2026 a confirmar em noel.strasbourg.eu.',
      },
    ],
    food: [
      'Winstubs tradicionais: choucroute, spaetzle, presunto em crosta',
      'Pain d’épices (pão de mel) e bredele',
      'Vin chaud branco alsaciano',
      'Kougelhopf',
    ],
    curiosities: [
      'O relógio astronômico da Catedral apresenta um desfile de autômatos diariamente; o horário exato deve ser conferido no local.',
      'A Marselhesa foi composta em Strasbourg, em 1792, por Rouget de Lisle.',
    ],
    gettingAround: [
      'Rede de bondes (tram) da CTS; Grande Île é praticamente toda pedonal.',
      'Freiburg im Breisgau é acessível de trem, em geral com conexão em Offenburg.',
    ],
    links: [
      { label: 'Visit Strasbourg', url: 'https://www.visitstrasbourg.fr/' },
      { label: 'Strasbourg, Capitale de Noël', url: 'https://noel.strasbourg.eu/' },
      { label: 'Museus de Strasbourg', url: 'https://www.musees.strasbourg.eu/' },
    ],
    wiki: 'Strasbourg',
    accent: '#8A4F5E',
  },
  {
    id: 'freiburg',
    name: 'Freiburg im Breisgau',
    country: 'Alemanha',
    countryCode: 'DE',
    flag: '🇩🇪',
    timezone: 'Europe/Berlin',
    coords: { lat: 47.9959, lng: 7.8522 },
    zoom: 15,
    arrival: '2026-12-12',
    departure: '2026-12-12',
    nights: 0,
    isBase: false,
    tagline: 'Bate-volta à Floresta Negra: catedral gótica e os canais Bächle',
    summary:
      'Cidade universitária às portas da Floresta Negra, Freiburg tem uma das mais belas catedrais góticas da Alemanha e pequenos canais (Bächle) que correm pelas ruas.',
    history: [
      'Fundada em 1120 pelos duques de Zähringen, foi por séculos território dos Habsburgo.',
      'A torre da Catedral foi chamada pelo historiador Jacob Burckhardt de “a mais bela torre da cristandade”.',
      'Bombardeada em 1944, teve o centro reconstruído preservando o traçado medieval.',
    ],
    climate: {
      minC: 0,
      maxC: 6,
      daylight: '≈ 8h20 de luz natural',
      note: 'Uma das cidades mais ensolaradas da Alemanha, mas fria em dezembro.',
    },
    markets: [
      {
        name: 'Freiburger Weihnachtsmarkt',
        description: 'Mercado tradicional no centro histórico, em torno da Rathausplatz e ruas vizinhas.',
        status: 'Datas de 2026 a confirmar em visit.freiburg.de.',
      },
    ],
    food: ['Schwarzwälder Kirschtorte (bolo Floresta Negra)', 'Lange Rote, salsicha típica da Münsterplatz', 'Glühwein'],
    curiosities: ['Diz a tradição local que quem pisa sem querer em um Bächle acabará se casando com alguém de Freiburg.'],
    gettingAround: ['O centro é compacto e pedonal; bondes da VAG ligam a estação ao centro.'],
    links: [{ label: 'Turismo de Freiburg', url: 'https://visit.freiburg.de/' }],
    wiki: 'Freiburg im Breisgau',
    accent: '#5E6B3F',
  },
  {
    id: 'luxemburgo',
    name: 'Luxemburgo',
    country: 'Luxemburgo',
    countryCode: 'LU',
    flag: '🇱🇺',
    timezone: 'Europe/Luxembourg',
    coords: { lat: 49.6110, lng: 6.1310 },
    zoom: 14,
    arrival: '2026-12-14',
    departure: '2026-12-17',
    nights: 3,
    isBase: true,
    tagline: 'Fortaleza sobre vales, casamatas e os mercados Winterlights',
    summary:
      'A capital do Grão-Ducado se ergue sobre penhascos acima dos vales do Alzette e do Pétrusse; suas antigas fortificações e bairros históricos são patrimônio da UNESCO.',
    history: [
      'A cidade nasceu em 963, quando o conde Sigefroi adquiriu o rochedo do Bock e ali ergueu um castelo.',
      'Conhecida como “Gibraltar do Norte”, a fortaleza foi disputada por espanhóis, franceses, austríacos e prussianos e desmantelada após o Tratado de Londres de 1867.',
      'Hoje é sede de instituições europeias, como o Tribunal de Justiça da União Europeia.',
    ],
    climate: {
      minC: 0,
      maxC: 4,
      daylight: '≈ 8h de luz natural',
      note: 'Frio, úmido e frequentemente nublado.',
    },
    markets: [
      {
        name: 'Winterlights',
        description:
          'Festival de inverno com mercados de Natal em várias praças do centro, como Place d’Armes e Place de la Constitution.',
        status: 'Datas e locais de 2026 a confirmar em luxembourg-city.com.',
      },
    ],
    food: ['Bouneschlupp, sopa luxemburguesa de feijão-verde', 'Gromperekichelcher, bolinhos de batata dos mercados', 'Crémant de Luxembourg e vinhos do Mosela'],
    curiosities: [
      'O transporte público nacional (ônibus, bondes e trens em segunda classe) é gratuito desde 2020.',
      'O elevador panorâmico do Pfaffenthal liga a cidade alta ao vale com vista envidraçada.',
    ],
    gettingAround: [
      'Transporte público doméstico gratuito na segunda classe, conforme as regras vigentes (mobiliteit.lu); a primeira classe dos trens é paga.',
      'Bonde liga a estação central, o centro e Kirchberg; o centro histórico é percorrido a pé.',
    ],
    links: [
      { label: 'Luxembourg City Tourist Office', url: 'https://www.luxembourg-city.com/' },
      { label: 'Mobilidade — horários e regras', url: 'https://www.mobiliteit.lu/' },
    ],
    wiki: 'Luxembourg City',
    accent: '#3F6E7A',
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Espanha',
    countryCode: 'ES',
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    coords: { lat: 40.4168, lng: -3.7038 },
    zoom: 14,
    arrival: '2026-12-17',
    departure: '2026-12-20',
    nights: 3,
    isBase: true,
    tagline: 'Luzes da Gran Vía, Plaza Mayor e o Barrio de las Letras',
    summary:
      'Capital espanhola desde 1561, Madrid encerra a viagem com o mercado natalino da Plaza Mayor, a iluminação das grandes avenidas e o bairro dos escritores do Século de Ouro.',
    history: [
      'Origem em uma fortaleza muçulmana do século IX (Mayrit), da qual restam vestígios perto da Catedral de la Almudena.',
      'Felipe II instalou a corte em Madrid em 1561, impulsionando a Madrid dos Áustrias em torno da Plaza Mayor.',
      'O Barrio de las Letras reuniu Cervantes, Lope de Vega e Quevedo; citações literárias estão gravadas no calçamento.',
    ],
    climate: {
      minC: 2,
      maxC: 11,
      daylight: '≈ 9h15 de luz natural',
      note: 'Seco e ensolarado com frequência, mas frio à noite.',
    },
    markets: [
      {
        name: 'Mercado de Navidad de la Plaza Mayor',
        description: 'Mercado tradicional com artigos de presépio, decoração e fantasias, realizado há gerações na Plaza Mayor.',
        status: 'Datas de 2026 a confirmar em esmadrid.com.',
      },
    ],
    food: ['Bocadillo de calamares na Plaza Mayor', 'Chocolate con churros', 'Tapas no Barrio de las Letras e La Latina', 'Turrón e mazapán de Natal'],
    curiosities: [
      'O marco do Quilômetro Zero das estradas radiais espanholas fica na Puerta del Sol.',
      'O sorteio da Lotería de Navidad, “El Gordo”, ocorre em 22 de dezembro — logo após a partida.',
    ],
    gettingAround: [
      'Metrô e ônibus da EMT/Consorcio; verificar tarifas vigentes em crtm.es.',
      'Centro histórico (Sol, Plaza Mayor, Letras) é compacto e caminhável.',
    ],
    links: [
      { label: 'esMADRID — turismo oficial', url: 'https://www.esmadrid.com/' },
      { label: 'Consorcio de Transportes de Madrid', url: 'https://www.crtm.es/' },
    ],
    wiki: 'Madrid',
    accent: '#9C6B2E',
  },
]

/**
 * Hotéis reservados. Sem números de confirmação, valores ou dados pessoais —
 * esses ficam fora do site público (ver privado/LEIA-ME.md).
 */
export const hotels: Hotel[] = [
  { cityId: 'barcelona', name: 'BYPILLOW Mothern', nights: 4, checkIn: '2026-11-27', checkOut: '2026-12-01', notes: ['Endereço e horários de check-in/out: conferir no voucher.'] },
  {
    cityId: 'paris',
    name: 'Aparthotel Adagio Paris Opéra',
    nights: 5,
    checkIn: '2026-12-01',
    checkOut: '2026-12-06',
    address: '43 Rue Caumartin, 75009 Paris, França',
    coords: { lat: 48.8728, lng: 2.3283 },
    notes: ['A poucos passos do Boulevard Haussmann e da Ópera Garnier.'],
  },
  { cityId: 'colmar', name: 'Mercure Colmar Centre Unterlinden', nights: 3, checkIn: '2026-12-06', checkOut: '2026-12-09', notes: ['Endereço e horários: conferir no voucher.'] },
  {
    cityId: 'strasbourg',
    name: 'ibis Strasbourg Centre Historique',
    nights: 5,
    checkIn: '2026-12-09',
    checkOut: '2026-12-14',
    notes: ['Reserva com pagamento no estabelecimento.', 'Endereço e horários: conferir no voucher.'],
  },
  { cityId: 'luxemburgo', name: 'City Hotel', nights: 3, checkIn: '2026-12-14', checkOut: '2026-12-17', notes: ['Endereço e horários: conferir no voucher.'] },
  {
    cityId: 'madrid',
    name: 'chic&basic dot',
    nights: 3,
    checkIn: '2026-12-17',
    checkOut: '2026-12-20',
    notes: ['Chegada prevista após 22h35: avisar o hotel sobre o check-in tardio até 10/12/2026.', 'Endereço: conferir no voucher.'],
  },
]

