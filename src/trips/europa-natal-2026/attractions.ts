import type { Attraction, Category, LatLng } from '../../types'

/**
 * Atrações do roteiro.
 *
 * Regras de confiabilidade:
 * - `coords` são aproximadas (conhecimento geral do local) até serem verificadas pelo
 *   script `npm run enrich`, que consulta a Wikipédia/Wikidata e grava em
 *   src/data/generated/enrichment.json. O site indica quando a coordenada é aproximada.
 * - `hours` só é preenchido quando conferido em fonte oficial — por isso está vazio.
 * - Preços não são informados: consultar o link oficial.
 * - ICOM: somente Ricardo possui carteirinha; benefício nunca é presumido.
 */

const ICOM_PADRAO = 'A confirmar com a instituição. Somente Ricardo possui carteirinha ICOM; o outro viajante usa ingresso regular.'
const LIVRE = 'Espaço público, acesso livre.'

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
  return { id, cityId, name, category, coords: c, description, tickets: extra.tickets ?? 'A confirmar no site oficial.', ...extra }
}

export const attractions: Attraction[] = [
  // ───────────── BARCELONA ─────────────
  a('placa-catalunya', 'barcelona', 'Plaça de Catalunya', 'monumento', [41.387, 2.1701], 'Praça central que separa a cidade velha do Eixample; ponto de partida natural para a Rambla e o Portal de l’Àngel.', { tickets: LIVRE, wiki: 'Plaça de Catalunya' }),
  a('bairro-gotico', 'barcelona', 'Bairro Gótico', 'bairro', [41.3833, 2.1765], 'Núcleo medieval sobre a antiga Barcino romana: ruelas, pátios góticos, a Pont del Bisbe e vestígios do templo de Augusto.', { tickets: LIVRE, wiki: 'Gothic Quarter, Barcelona' }),
  a('catedral-bcn', 'barcelona', 'Catedral de Barcelona', 'igreja', [41.384, 2.1762], 'Catedral gótica da Santa Cruz e Santa Eulália, com claustro onde vivem 13 gansos brancos. Em frente acontece a Fira de Santa Llúcia.', { officialUrl: 'https://catedralbcn.org/', wiki: 'Barcelona Cathedral', icom: ICOM_PADRAO }),
  a('placa-del-rei', 'barcelona', 'Plaça del Rei', 'monumento', [41.3842, 2.1774], 'Praça do antigo Palau Reial Major, com o Saló del Tinell e a capela de Santa Àgata.', { tickets: LIVRE, wiki: 'Plaça del Rei' }),
  a('muhba', 'barcelona', 'Museu de História de Barcelona (MUHBA)', 'museu', [41.3841, 2.1777], 'Percurso subterrâneo pelas ruínas romanas de Barcino e visita ao conjunto do Palau Reial Major.', { officialUrl: 'https://www.barcelona.cat/museuhistoria/', wiki: 'Barcelona City History Museum', icom: ICOM_PADRAO, tags: ['alternativa ao Museu Picasso'] }),
  a('el-born', 'barcelona', 'El Born', 'bairro', [41.385, 2.182], 'Bairro medieval de mercadores, hoje cheio de ateliês, bares de tapas e lojas independentes; o antigo mercado abriga o El Born Centre de Cultura i Memòria.', { tickets: LIVRE }),
  a('santa-maria-del-mar', 'barcelona', 'Basílica de Santa Maria del Mar', 'igreja', [41.3837, 2.182], 'Obra-prima do gótico catalão (1329–1383), construída pelos próprios moradores do bairro da Ribera; interior de proporções extraordinárias.', { officialUrl: 'https://www.santamariadelmarbarcelona.org/', wiki: 'Santa Maria del Mar, Barcelona', icom: ICOM_PADRAO }),
  a('museu-picasso', 'barcelona', 'Museu Picasso', 'museu', [41.3852, 2.181], 'Instalado em cinco palácios medievais da Carrer de Montcada, reúne sobretudo obras de formação do artista e a série Las Meninas.', { officialUrl: 'https://museupicasso.bcn.cat/', wiki: 'Museu Picasso', icom: ICOM_PADRAO }),
  a('palau-musica', 'barcelona', 'Palau de la Música Catalana', 'monumento', [41.3876, 2.1753], 'Sala de concertos modernista de Lluís Domènech i Montaner (1908), patrimônio da UNESCO, com claraboia de vitral invertida. Visita guiada ou concerto.', { officialUrl: 'https://www.palaumusica.cat/', wiki: 'Palau de la Música Catalana', icom: ICOM_PADRAO, tickets: 'Ingresso pendente, se escolhido. Visitas guiadas com horário marcado.' }),
  a('sagrada-familia', 'barcelona', 'Sagrada Família', 'igreja', [41.4036, 2.1744], 'Basílica de Antoni Gaudí, em construção desde 1882. Floresta de colunas, vitrais que tingem a luz e as fachadas do Nascimento e da Paixão.', { officialUrl: 'https://sagradafamilia.org/', wiki: 'Sagrada Família', tickets: 'Ingresso pendente — compra antecipada fortemente recomendada, com horário marcado.', icom: 'Benefício ICOM para Ricardo deve ser SOLICITADO e CONFIRMADO oficialmente pela basílica. O outro viajante usa ingresso regular.' }),
  a('sant-pau', 'barcelona', 'Recinte Modernista de Sant Pau', 'monumento', [41.4113, 2.1744], 'Antigo hospital modernista de Domènech i Montaner, com pavilhões de cerâmica e mosaicos; patrimônio da UNESCO.', { officialUrl: 'https://santpaubarcelona.org/', wiki: 'Hospital de la Santa Creu i Sant Pau', icom: ICOM_PADRAO }),
  a('passeig-gracia', 'barcelona', 'Passeig de Gràcia', 'bairro', [41.3917, 2.1649], 'Grande avenida do Eixample com a “Manzana de la Discordia” e luminárias-banco de Pere Falqués.', { tickets: LIVRE, wiki: 'Passeig de Gràcia' }),
  a('casa-batllo', 'barcelona', 'Casa Batlló', 'monumento', [41.3916, 2.165], 'Fachada ondulante de Gaudí, com telhado em “dorso de dragão”. Planejada ao menos pelo exterior.', { officialUrl: 'https://www.casabatllo.es/', wiki: 'Casa Batlló', tickets: 'Exterior livre. Visita interna: ingresso pendente, se escolhida.', icom: ICOM_PADRAO }),
  a('la-pedrera', 'barcelona', 'La Pedrera (Casa Milà)', 'monumento', [41.3954, 2.1619], 'Último edifício civil de Gaudí, com fachada de pedra ondulada e terraço de chaminés escultóricas.', { officialUrl: 'https://www.lapedrera.com/', wiki: 'Casa Milà', icom: ICOM_PADRAO }),
  a('park-guell', 'barcelona', 'Park Güell — zona monumental', 'parque', [41.4145, 2.1527], 'Parque de Gaudí com a escadaria do dragão, a Sala Hipóstila e o banco ondulado de trencadís com vista para a cidade.', { officialUrl: 'https://parkguell.barcelona/', wiki: 'Park Güell', tickets: 'Ingresso pendente para a zona monumental, com horário marcado.', icom: 'NÃO presumir benefício ICOM no Park Güell.' }),
  a('gracia', 'barcelona', 'Bairro de Gràcia', 'bairro', [41.4036, 2.1567], 'Antiga vila independente, com praças animadas (Sol, Virreina, Revolució), cafés e lojas independentes.', { tickets: LIVRE, wiki: 'Gràcia' }),
  a('casa-vicens', 'barcelona', 'Casa Vicens', 'monumento', [41.4035, 2.1508], 'Primeira casa projetada por Gaudí (1883–1885), de inspiração mourisca, com azulejos de cravos-de-defunto.', { officialUrl: 'https://casavicens.org/', wiki: 'Casa Vicens', optional: true, tickets: 'Ingresso pendente, se escolhida.', icom: ICOM_PADRAO }),
  a('montjuic', 'barcelona', 'Montjuïc', 'mirante', [41.3636, 2.1586], 'Colina com o MNAC, a Fundació Joan Miró, o castelo e jardins com vista para o porto. Alternativa conforme disponibilidade.', { wiki: 'Montjuïc', optional: true, tickets: 'Espaços abertos livres; museus com ingresso próprio.' }),
  a('fira-santa-llucia', 'barcelona', 'Fira de Santa Llúcia', 'mercado', [41.3838, 2.1758], 'Mercado de Natal diante da Catedral, dedicado ao presépio e às tradições catalãs.', { tickets: LIVRE + ' Datas de 2026 a confirmar.' }),

  // ───────────── PARIS ─────────────
  a('boulevard-haussmann', 'paris', 'Boulevard Haussmann', 'bairro', [48.8735, 2.332], 'Eixo dos grandes magazines, símbolo da Paris do Segundo Império.', { tickets: LIVRE }),
  a('galeries-lafayette', 'paris', 'Galeries Lafayette Haussmann', 'compras', [48.8737, 2.332], 'Cúpula Art Nouveau de vitral (1912) e a grande árvore de Natal sob ela; terraço com vista para a Ópera.', { officialUrl: 'https://haussmann.galerieslafayette.com/', wiki: 'Galeries Lafayette', tickets: 'Entrada livre na loja.' }),
  a('printemps', 'paris', 'Printemps Haussmann', 'compras', [48.874, 2.3283], 'Grande magazine de 1865, famoso pelas vitrines animadas de Natal e pela cúpula de vitral.', { officialUrl: 'https://www.printemps.com/', wiki: 'Printemps', tickets: 'Entrada livre na loja.' }),
  a('place-vendome', 'paris', 'Place Vendôme', 'monumento', [48.8675, 2.3294], 'Praça octogonal de Jules Hardouin-Mansart, com a coluna de bronze e as joalherias decoradas para as festas.', { tickets: LIVRE, wiki: 'Place Vendôme' }),
  a('palais-garnier', 'paris', 'Palais Garnier', 'monumento', [48.872, 2.3316], 'Ópera de Charles Garnier (1875): grande escadaria, foyer dourado, teto de Chagall e a biblioteca-museu da Ópera.', { officialUrl: 'https://www.operadeparis.fr/', wiki: 'Palais Garnier', tickets: 'Ingresso prioritário pendente (visita autoguiada ou guiada).', icom: ICOM_PADRAO }),
  a('bnf-richelieu', 'paris', 'BnF — site Richelieu e Salle Ovale', 'biblioteca', [48.8679, 2.339], 'Berço histórico da Biblioteca Nacional da França, reaberto após longa restauração. A Salle Ovale, sala de leitura de 1932 com cúpula de vidro, é aberta ao público; o museu exibe tesouros das coleções.', { officialUrl: 'https://www.bnf.fr/', icom: ICOM_PADRAO, tickets: 'Salle Ovale: acesso livre conforme regras vigentes. Museu: verificar ingresso no site.' }),
  a('galerie-vivienne', 'paris', 'Galerie Vivienne', 'compras', [48.8664, 2.3399], 'A mais elegante das passagens cobertas (1823), com mosaicos, claraboias e a livraria Jousseaume.', { tickets: LIVRE, wiki: 'Galerie Vivienne' }),
  a('passage-panoramas', 'paris', 'Passage des Panoramas', 'compras', [48.8712, 2.3417], 'Uma das mais antigas passagens cobertas de Paris (1799), com restaurantes, filatelistas e antiquários.', { tickets: LIVRE, wiki: 'Passage des Panoramas' }),
  a('palais-royal', 'paris', 'Palais-Royal', 'monumento', [48.8638, 2.3372], 'Jardim cercado de arcadas e as colunas listradas de Daniel Buren no pátio de honra.', { tickets: LIVRE, wiki: 'Palais-Royal' }),
  a('petit-palais', 'paris', 'Petit Palais', 'museu', [48.866, 2.3146], 'Museu de Belas-Artes da Cidade de Paris, construído para a Exposição Universal de 1900, com jardim interno e café. Coleção permanente gratuita.', { officialUrl: 'https://www.petitpalais.paris.fr/', wiki: 'Petit Palais', tickets: 'Coleções permanentes com acesso gratuito; exposições temporárias pagas — confirmar.' , icom: ICOM_PADRAO }),
  a('grand-palais', 'paris', 'Grand Palais', 'museu', [48.8661, 2.3125], 'Monumental nave de vidro e aço de 1900, reaberta após restauração. Programação conforme exposição em cartaz.', { officialUrl: 'https://www.grandpalais.fr/', wiki: 'Grand Palais', tickets: 'Ingresso prioritário conforme exposição — pendente.', icom: ICOM_PADRAO }),
  a('pont-alexandre-iii', 'paris', 'Pont Alexandre III', 'monumento', [48.8639, 2.3136], 'Ponte Belle Époque com candelabros e estátuas douradas, ligando os Champs-Élysées aos Invalides.', { tickets: LIVRE, wiki: 'Pont Alexandre III' }),
  a('invalides', 'paris', 'Les Invalides', 'monumento', [48.8566, 2.3125], 'Complexo de Luís XIV com a Esplanada e a cúpula dourada; abriga o Musée de l’Armée e o túmulo de Napoleão.', { officialUrl: 'https://www.musee-armee.fr/', wiki: 'Les Invalides', icom: ICOM_PADRAO, tickets: 'Região e esplanada livres; museu pago — confirmar.' }),
  a('nanna-peniche', 'paris', 'Biblioteca flutuante — candidata 1: Nanna (péniche literária)', 'biblioteca', [48.8523, 2.3487], 'Barcaça literária com biblioteca de cerca de 5.000 livros usados, de consulta e empréstimo, e bar, atracada no Port de Montebello, diante da Notre-Dame (ancorada desde maio de 2026, segundo a Sortiraparis). Os viajantes devem confirmar se é esta a “biblioteca flutuante” mencionada.', { tickets: 'Acesso livre segundo a fonte; horários a confirmar.', tags: ['A confirmar'], optional: true, officialUrl: 'https://www.sortiraparis.com/en/where-to-eat-in-paris/bars-cafes/articles/337914-nanna-the-cozy-literary-barge-with-a-library-and-a-bar-at-the-foot-of-notre-dame-cathedral' }),
  a('eau-et-reves', 'paris', 'Biblioteca flutuante — candidata 2: L’Eau et les Rêves', 'biblioteca', [48.889, 2.38], 'Livraria instalada em uma péniche no Canal de l’Ourcq (9 Quai de l’Oise, 19º arrondissement). Alternativa caso a “biblioteca flutuante” seja esta.', { address: '9 Quai de l’Oise, 75019 Paris', tickets: 'Livraria, entrada livre; horários a confirmar.', tags: ['A confirmar'], optional: true, officialUrl: 'https://theearfultower.com/2022/03/16/meet-the-man-with-the-floating-paris-bookshop/' }),
  a('carnavalet', 'paris', 'Musée Carnavalet', 'museu', [48.8575, 2.3625], 'Museu da história de Paris em dois hôtels particuliers do Marais: letreiros antigos, salões reconstituídos e o quarto de Proust. Coleções permanentes gratuitas.', { officialUrl: 'https://www.carnavalet.paris.fr/', wiki: 'Musée Carnavalet', tickets: 'Coleções permanentes gratuitas; confirmar reserva de horário.', icom: ICOM_PADRAO }),
  a('place-des-vosges', 'paris', 'Place des Vosges', 'monumento', [48.8556, 2.3655], 'A mais antiga praça planejada de Paris (1612), com 36 pavilhões simétricos de tijolo e pedra.', { tickets: LIVRE, wiki: 'Place des Vosges' }),
  a('maison-victor-hugo', 'paris', 'Maison de Victor Hugo', 'museu', [48.8549, 2.3662], 'Apartamento onde Victor Hugo viveu de 1832 a 1848, com a sala chinesa decorada pelo próprio escritor. Coleção permanente gratuita.', { officialUrl: 'https://www.maisonsvictorhugo.paris.fr/', wiki: 'Maison de Victor Hugo', tickets: 'Coleção permanente gratuita; confirmar reserva.', icom: ICOM_PADRAO }),
  a('rue-des-rosiers', 'paris', 'Rue des Rosiers — Le Marais', 'gastronomia', [48.8572, 2.359], 'Coração do antigo bairro judeu do Marais, famoso pelos falafels e pelas padarias.', { tickets: LIVRE }),
  a('hotel-soubise', 'paris', 'Musée des Archives Nationales — Hôtel de Soubise', 'museu', [48.86, 2.358], 'Palácio com salões rococó de Boffrand e documentos históricos dos Arquivos Nacionais.', { officialUrl: 'https://www.archives-nationales.culture.gouv.fr/', wiki: 'Hôtel de Soubise', icom: ICOM_PADRAO }),
  a('ile-saint-louis', 'paris', 'Île Saint-Louis e margens do Sena', 'bairro', [48.8517, 2.3567], 'Ilha residencial do século XVII, com hôtels particuliers, sorvetes e vistas para a abside da Notre-Dame.', { tickets: LIVRE, wiki: 'Île Saint-Louis' }),
  a('quartier-latin', 'paris', 'Quartier Latin', 'bairro', [48.849, 2.347], 'Bairro universitário desde a Idade Média, em torno da Sorbonne; ruelas, cinemas de arte e livrarias.', { tickets: LIVRE, wiki: 'Latin Quarter, Paris' }),
  a('shakespeare-co', 'paris', 'Shakespeare and Company', 'biblioteca', [48.8526, 2.3471], 'Livraria anglófona histórica diante da Notre-Dame, herdeira do espírito de Sylvia Beach.', { officialUrl: 'https://shakespeareandcompany.com/', wiki: 'Shakespeare and Company (bookstore)', tickets: 'Entrada livre; filas são comuns.' }),
  a('jardin-luxembourg', 'paris', 'Jardin du Luxembourg', 'parque', [48.8462, 2.3372], 'Jardim do Palácio do Luxemburgo (Senado), com a Fonte Médici e estátuas das rainhas da França.', { tickets: LIVRE, wiki: 'Jardin du Luxembourg' }),
  a('pantheon', 'paris', 'Panthéon', 'monumento', [48.8462, 2.3464], 'Templo neoclássico que abriga os túmulos de Voltaire, Rousseau, Hugo, Zola, Marie Curie e outros. Ao menos pelo exterior.', { officialUrl: 'https://www.paris-pantheon.fr/', wiki: 'Panthéon', icom: ICOM_PADRAO }),
  a('cluny', 'paris', 'Musée de Cluny — Museu da Idade Média', 'museu', [48.8505, 2.344], 'Termas galo-romanas e palácio gótico; lar das tapeçarias A Dama e o Unicórnio.', { officialUrl: 'https://www.musee-moyenage.fr/', wiki: 'Musée de Cluny', optional: true, icom: ICOM_PADRAO }),
  a('butte-aux-cailles', 'paris', 'Butte-aux-Cailles', 'bairro', [48.827, 2.35], 'Colina de aspecto de vila, com casas baixas, street art e bistrôs.', { tickets: LIVRE, wiki: 'Butte-aux-Cailles', optional: true }),
  a('canal-saint-martin', 'paris', 'Canal Saint-Martin', 'bairro', [48.871, 2.365], 'Canal com eclusas e passarelas de ferro, margeado por cafés e lojas.', { tickets: LIVRE, wiki: 'Canal Saint-Martin', optional: true }),
  a('coulee-verte', 'paris', 'Coulée verte René-Dumont', 'parque', [48.849, 2.377], 'Passeio elevado sobre antiga ferrovia, precursor do High Line de Nova York, acima do Viaduc des Arts.', { tickets: LIVRE, wiki: 'Coulée verte René-Dumont', optional: true }),
  a('vie-romantique', 'paris', 'Musée de la Vie Romantique', 'museu', [48.8813, 2.3335], 'Casa-ateliê de Ary Scheffer, onde se reuniam George Sand, Chopin e Delacroix. Coleção permanente gratuita.', { officialUrl: 'https://museevieromantique.paris.fr/', wiki: 'Musée de la Vie romantique', optional: true, icom: ICOM_PADRAO, tags: ['extra'] }),
  a('arts-et-metiers', 'paris', 'Musée des Arts et Métiers', 'museu', [48.8665, 2.3555], 'Museu de invenções em um priorado medieval: o pêndulo de Foucault, o avião de Ader e a máquina de calcular de Pascal.', { officialUrl: 'https://www.arts-et-metiers.net/', wiki: 'Musée des Arts et Métiers', optional: true, icom: ICOM_PADRAO, tags: ['extra'] }),
  a('bernardins', 'paris', 'Collège des Bernardins', 'monumento', [48.849, 2.353], 'Colégio cisterciense do século XIII, com nave gótica e sacristia restauradas; centro cultural.', { officialUrl: 'https://www.collegedesbernardins.fr/', wiki: 'Collège des Bernardins', optional: true, tags: ['extra'] }),

  // ───────────── COLMAR ─────────────
  a('maison-des-tetes', 'colmar', 'Maison des Têtes', 'monumento', [48.0796, 7.3555], 'Casa renascentista de 1609 com mais de cem cabeças e máscaras esculpidas na fachada.', { tickets: 'Exterior livre.', wiki: 'Maison des Têtes' }),
  a('maison-pfister', 'colmar', 'Maison Pfister', 'monumento', [48.076, 7.3584], 'Casa de 1537 com galeria de madeira, afrescos e torre octogonal — ícone da cidade.', { tickets: 'Exterior livre.', wiki: 'Maison Pfister' }),
  a('koifhus', 'colmar', 'Koïfhus (Antiga Alfândega)', 'monumento', [48.0757, 7.3592], 'Edifício mais antigo de uso público de Colmar (1480), com telhado de telhas vidradas; em volta acontecem mercados de Natal.', { tickets: 'Exterior livre.', wiki: 'Koïfhus' }),
  a('petite-venise', 'colmar', 'Petite Venise', 'bairro', [48.073, 7.36], 'Bairro de casas coloridas às margens do Lauch, com passeios de barco sazonais e o mercado infantil de Natal.', { tickets: LIVRE }),
  a('unterlinden', 'colmar', 'Musée Unterlinden e Retábulo de Issenheim', 'museu', [48.0797, 7.3555], 'Convento dominicano do século XIII ampliado por Herzog & de Meuron. Guarda o Retábulo de Issenheim (1512–1516), de Grünewald e Nikolaus de Haguenau.', { officialUrl: 'https://www.musee-unterlinden.com/', wiki: 'Unterlinden Museum', tickets: 'Ingresso prioritário pendente.', icom: ICOM_PADRAO }),
  a('place-dominicains', 'colmar', 'Place des Dominicains', 'mercado', [48.0782, 7.3578], 'Praça diante da igreja dos Dominicanos, onde está a Virgem do Roseiral de Schongauer; local tradicional de mercado de Natal.', { tickets: LIVRE }),
  a('place-ancienne-douane', 'colmar', 'Place de l’Ancienne Douane', 'mercado', [48.0756, 7.3588], 'Praça da Fonte Schwendi (de Bartholdi), junto ao Koïfhus; tradicional ponto de mercado natalino.', { tickets: LIVRE }),
  a('eguisheim', 'colmar', 'Eguisheim', 'bairro', [48.0425, 7.3063], 'Vilarejo circular em torno de um castelo, entre os mais bonitos da França; berço do papa Leão IX.', { wiki: 'Eguisheim', tickets: 'Vilarejo de acesso livre; transporte a definir.' }),
  a('riquewihr', 'colmar', 'Riquewihr', 'bairro', [48.1667, 7.2978], 'Vilarejo vinhateiro murado, com a torre Dolder e casas renascentistas; célebre loja de Natal o ano todo.', { wiki: 'Riquewihr', tickets: 'Vilarejo de acesso livre; transporte a definir.' }),
  a('kaysersberg', 'colmar', 'Kaysersberg', 'bairro', [48.1389, 7.2639], 'Vilarejo com castelo em ruínas e ponte fortificada, terra natal de Albert Schweitzer. Alternativa.', { wiki: 'Kaysersberg', optional: true, tickets: 'Vilarejo de acesso livre; transporte a definir.' }),

  // ───────────── STRASBOURG ─────────────
  a('petite-france', 'strasbourg', 'Petite France', 'bairro', [48.5809, 7.74], 'Antigo bairro de curtidores e moleiros, com casas em enxaimel debruçadas sobre os canais do Ill.', { tickets: LIVRE }),
  a('ponts-couverts', 'strasbourg', 'Ponts Couverts', 'monumento', [48.5795, 7.739], 'Pontes e torres das antigas fortificações medievais do século XIII.', { tickets: LIVRE, wiki: 'Ponts Couverts' }),
  a('barrage-vauban', 'strasbourg', 'Barrage Vauban', 'mirante', [48.579, 7.7375], 'Represa defensiva do século XVII com terraço panorâmico sobre a Petite France e a Catedral.', { tickets: LIVRE + ' Horário do terraço a confirmar.', wiki: 'Barrage Vauban' }),
  a('place-kleber', 'strasbourg', 'Place Kléber', 'monumento', [48.5834, 7.7458], 'Praça principal, onde tradicionalmente se ergue a Grande Árvore de Natal.', { tickets: LIVRE, wiki: 'Place Kléber' }),
  a('place-broglie', 'strasbourg', 'Christkindelsmärik — Place Broglie', 'mercado', [48.5845, 7.749], 'Local histórico do Christkindelsmärik, o mercado de Natal mais antigo da cidade.', { tickets: LIVRE + ' Datas de 2026 a confirmar.' }),
  a('cathedrale-strasbourg', 'strasbourg', 'Cathédrale Notre-Dame de Strasbourg', 'igreja', [48.5818, 7.7509], 'Fachada de renda de arenito rosa dos Vosges, vitrais medievais e plataforma no alto da torre.', { wiki: 'Strasbourg Cathedral', tickets: 'Nave de acesso livre; plataforma e relógio com regras próprias — confirmar.', icom: ICOM_PADRAO }),
  a('horloge-astronomique', 'strasbourg', 'Relógio astronômico', 'monumento', [48.5816, 7.7509], 'Relógio renascentista com mecanismo do século XIX e desfile diário dos apóstolos. Acesso e horário da apresentação a confirmar.', { wiki: 'Strasbourg astronomical clock' }),
  a('maison-kammerzell', 'strasbourg', 'Maison Kammerzell', 'monumento', [48.5817, 7.7497], 'Casa de 1427, com fachada de madeira esculpida e janelas em vidro redondo; hoje restaurante.', { tickets: 'Exterior livre.', wiki: 'Maison Kammerzell' }),
  a('palais-rohan', 'strasbourg', 'Palais Rohan', 'museu', [48.581, 7.752], 'Palácio barroco dos príncipes-bispos com três museus: Artes Decorativas, Belas-Artes e Arqueológico.', { officialUrl: 'https://www.musees.strasbourg.eu/', wiki: 'Palais Rohan, Strasbourg', icom: ICOM_PADRAO }),
  a('oeuvre-notre-dame', 'strasbourg', 'Musée de l’Œuvre Notre-Dame', 'museu', [48.5813, 7.7505], 'Esculturas originais e vitrais da Catedral, além de arte medieval e renascentista do Alto Reno.', { officialUrl: 'https://www.musees.strasbourg.eu/', wiki: 'Musée de l\'Œuvre Notre-Dame', icom: ICOM_PADRAO }),
  a('neustadt', 'strasbourg', 'Neustadt', 'bairro', [48.587, 7.755], 'Bairro imperial alemão (1871–1918), com avenidas e edifícios historicistas e Art Nouveau; patrimônio UNESCO.', { tickets: LIVRE }),
  a('palais-du-rhin', 'strasbourg', 'Palais du Rhin', 'monumento', [48.5874, 7.7546], 'Antigo palácio imperial de Guilherme I, voltado para a Place de la République.', { tickets: 'Exterior livre.', wiki: 'Palais du Rhin' }),
  a('place-republique', 'strasbourg', 'Place de la République', 'monumento', [48.5867, 7.7536], 'Praça-jardim circular cercada por palácios da Neustadt.', { tickets: LIVRE }),
  a('bnu', 'strasbourg', 'Biblioteca Nacional e Universitária (BNU)', 'biblioteca', [48.5866, 7.756], 'Uma das maiores bibliotecas da França, em edifício imperial com cúpula renovada.', { officialUrl: 'https://www.bnu.fr/', tickets: 'Condições de acesso para visitantes a confirmar.' }),
  a('orangerie', 'strasbourg', 'Parc de l’Orangerie', 'parque', [48.5918, 7.7745], 'O parque mais antigo da cidade, desenhado no estilo de Le Nôtre, com o pavilhão Joséphine.', { tickets: LIVRE, wiki: 'Parc de l\'Orangerie' }),
  a('instituicoes-europeias', 'strasbourg', 'Instituições europeias', 'monumento', [48.597, 7.77], 'Parlamento Europeu, Conselho da Europa e Tribunal Europeu dos Direitos Humanos. Visitas conforme acesso e calendário.', { officialUrl: 'https://visiting.europarl.europa.eu/', tickets: 'Acesso a confirmar.', optional: true }),

  // ───────────── FREIBURG ─────────────
  a('freiburger-munster', 'freiburg', 'Catedral de Freiburg (Freiburger Münster)', 'igreja', [47.9955, 7.8529], 'Catedral gótica de arenito vermelho com torre rendada de 116 m, concluída por volta de 1330.', { wiki: 'Freiburg Minster', tickets: 'Nave de acesso livre; torre com regras próprias — confirmar.', icom: ICOM_PADRAO }),
  a('munsterplatz', 'freiburg', 'Münsterplatz', 'monumento', [47.9958, 7.8522], 'Praça da catedral, cercada pela Kaufhaus vermelha (Historisches Kaufhaus) de 1532.', { tickets: LIVRE }),
  a('rathausplatz', 'freiburg', 'Rathausplatz', 'mercado', [47.9963, 7.8494], 'Praça das prefeituras antiga e nova; coração do mercado de Natal.', { tickets: LIVRE }),
  a('bachle', 'freiburg', 'Canais Bächle', 'bairro', [47.994, 7.851], 'Pequenos canais de água que correm pelas ruas do centro desde a Idade Média.', { tickets: LIVRE, wiki: 'Bächle' }),

  // ───────────── LUXEMBURGO ─────────────
  a('avenue-liberte', 'luxemburgo', 'Avenue de la Liberté', 'bairro', [49.606, 6.13], 'Avenida da Belle Époque que liga a estação ao centro, com fachadas Art Nouveau.', { tickets: LIVRE }),
  a('pont-adolphe', 'luxemburgo', 'Pont Adolphe', 'monumento', [49.61, 6.127], 'Ponte de pedra de 1903 sobre o vale do Pétrusse; tem passarela suspensa para pedestres e ciclistas.', { tickets: LIVRE, wiki: 'Adolphe Bridge' }),
  a('place-constitution', 'luxemburgo', 'Place de la Constitution (Gëlle Fra)', 'mirante', [49.6094, 6.1294], 'Mirante sobre o vale do Pétrusse, com o Monumento da Lembrança (Gëlle Fra); local de mercado do Winterlights.', { tickets: LIVRE, wiki: 'Monument of Remembrance' }),
  a('place-armes', 'luxemburgo', 'Winterlights — Place d’Armes', 'mercado', [49.6113, 6.13], 'Praça central de cafés e coreto, tradicionalmente um dos pontos do Winterlights.', { tickets: LIVRE + ' Datas de 2026 a confirmar.' }),
  a('place-guillaume', 'luxemburgo', 'Place Guillaume II', 'monumento', [49.6105, 6.131], 'A “Knuedler”, praça da prefeitura com a estátua equestre de Guilherme II.', { tickets: LIVRE, wiki: 'Place Guillaume II' }),
  a('cathedrale-lux', 'luxemburgo', 'Catedral Notre-Dame de Luxemburgo', 'igreja', [49.6097, 6.1317], 'Antiga igreja jesuíta do século XVII com elementos góticos tardios; cripta com túmulos da família grão-ducal.', { wiki: 'Notre-Dame Cathedral, Luxembourg', tickets: 'Acesso livre fora de celebrações — confirmar.' }),
  a('palais-grand-ducal', 'luxemburgo', 'Palais Grand-Ducal', 'monumento', [49.6114, 6.1323], 'Residência oficial do Grão-Duque, fachada renascentista flamenga. Visita pelo exterior.', { tickets: 'Exterior livre.', wiki: 'Grand Ducal Palace, Luxembourg' }),
  a('corniche', 'luxemburgo', 'Chemin de la Corniche', 'mirante', [49.6107, 6.136], 'Chamada de “a mais bela varanda da Europa”, sobre as muralhas e o vale do Alzette.', { tickets: LIVRE, wiki: 'Chemin de la Corniche' }),
  a('bock', 'luxemburgo', 'Rochedo do Bock e casamatas', 'monumento', [49.6118, 6.1378], 'Promontório onde nasceu a cidade em 963, perfurado por galerias defensivas. Abertura das casamatas no inverno a confirmar.', { tickets: 'A confirmar (as casamatas costumam ter temporada).' }),
  a('grund', 'luxemburgo', 'Bairro de Grund', 'bairro', [49.6085, 6.1375], 'Bairro às margens do Alzette, com a Abadia de Neumünster e pubs tradicionais.', { tickets: LIVRE, wiki: 'Grund, Luxembourg' }),
  a('city-museum', 'luxemburgo', 'Lëtzebuerg City Museum', 'museu', [49.6102, 6.1336], 'Museu da história da cidade em casas antigas interligadas, com elevador panorâmico de vidro.', { officialUrl: 'https://citymuseum.lu/', wiki: 'Luxembourg City History Museum', icom: ICOM_PADRAO }),
  a('drai-eechelen', 'luxemburgo', 'Musée Dräi Eechelen', 'museu', [49.617, 6.14], 'Museu da fortaleza, de história e identidade, no Forte Thüngen. Alternativa.', { officialUrl: 'https://m3e.public.lu/', optional: true, icom: ICOM_PADRAO }),
  a('pfaffenthal', 'luxemburgo', 'Pfaffenthal', 'bairro', [49.616, 6.133], 'Bairro do vale do Alzette, sob a ponte vermelha Grande-Duchesse Charlotte.', { tickets: LIVRE, wiki: 'Pfaffenthal' }),
  a('ascenseur-pfaffenthal', 'luxemburgo', 'Elevador panorâmico do Pfaffenthal', 'mirante', [49.615, 6.1305], 'Elevador envidraçado de 2016 ligando a cidade alta ao Pfaffenthal, com piso de vidro e vista do vale.', { tickets: 'Gratuito segundo regras vigentes; horário a confirmar.' }),

  // ───────────── MADRID ─────────────
  a('puerta-del-sol', 'madrid', 'Puerta del Sol', 'monumento', [40.4169, -3.7035], 'Praça do relógio da Casa de Correos, do Quilômetro Zero e do Urso e o Medronheiro.', { tickets: LIVRE, wiki: 'Puerta del Sol' }),
  a('plaza-mayor', 'madrid', 'Plaza Mayor e mercado de Natal', 'mercado', [40.4155, -3.7074], 'Praça porticada do século XVII que recebe o tradicional mercado de Natal.', { tickets: LIVRE + ' Datas do mercado 2026 a confirmar.', wiki: 'Plaza Mayor, Madrid' }),
  a('plaza-oriente', 'madrid', 'Plaza de Oriente', 'parque', [40.4183, -3.712], 'Praça-jardim entre o Palácio Real e o Teatro Real, com estátuas de reis visigodos e espanhóis.', { tickets: LIVRE, wiki: 'Plaza de Oriente' }),
  a('palacio-real', 'madrid', 'Palacio Real', 'monumento', [40.418, -3.7143], 'Maior palácio real da Europa Ocidental em área construída. Visita planejada pelo exterior.', { officialUrl: 'https://www.patrimonionacional.es/', wiki: 'Royal Palace of Madrid', tickets: 'Exterior livre; visita interna paga, se escolhida.', icom: ICOM_PADRAO }),
  a('gran-via', 'madrid', 'Gran Vía iluminada', 'bairro', [40.42, -3.7058], 'Avenida de 1910 com edifícios como o Metrópolis e a Telefónica; iluminação de Natal à noite.', { tickets: LIVRE, wiki: 'Gran Vía (Madrid)' }),
  a('barrio-letras', 'madrid', 'Barrio de las Letras', 'bairro', [40.414, -3.698], 'Bairro de Cervantes, Lope de Vega e Quevedo; citações literárias no calçamento da Calle Huertas.', { tickets: LIVRE, wiki: 'Barrio de las Letras' }),
  a('ateneo', 'madrid', 'Ateneo de Madrid', 'biblioteca', [40.4148, -3.6987], 'Instituição cultural de 1835 com biblioteca histórica e galeria de retratos. Visitas guiadas conforme calendário.', { officialUrl: 'https://www.ateneodemadrid.com/', wiki: 'Ateneo de Madrid', tickets: 'Condições de visita a confirmar.' }),
  a('caixaforum', 'madrid', 'CaixaForum Madrid', 'museu', [40.4111, -3.6934], 'Centro cultural de Herzog & de Meuron em antiga usina elétrica, com o célebre jardim vertical.', { officialUrl: 'https://caixaforum.org/es/madrid', wiki: 'CaixaForum Madrid', icom: ICOM_PADRAO }),
  a('prado', 'madrid', 'Museo del Prado', 'museu', [40.4138, -3.6921], 'Velázquez, Goya, Bosch, El Greco e Rubens. Opcional.', { officialUrl: 'https://www.museodelprado.es/', wiki: 'Museo del Prado', optional: true, icom: ICOM_PADRAO }),
  a('thyssen', 'madrid', 'Museo Nacional Thyssen-Bornemisza', 'museu', [40.416, -3.6949], 'Panorama da pintura ocidental do século XIII ao XX. Opcional.', { officialUrl: 'https://www.museothyssen.org/', wiki: 'Thyssen-Bornemisza Museum', optional: true, icom: ICOM_PADRAO }),
  a('romantismo', 'madrid', 'Museo del Romanticismo', 'museu', [40.4258, -3.6987], 'Palacete que recria o ambiente doméstico da burguesia romântica do século XIX. Alternativa.', { officialUrl: 'https://www.cultura.gob.es/mromantico/', wiki: 'Museo del Romanticismo', optional: true, icom: ICOM_PADRAO }),

  // ───────────── LOGÍSTICA (estações, aeroportos, hotel com endereço conhecido) ─────────────
  a('hotel-adagio', 'paris', 'Aparthotel Adagio Paris Opéra', 'hotel', [48.8728, 2.3283], 'Hospedagem em Paris, 01/12 a 06/12.', { address: '43 Rue Caumartin, 75009 Paris', tickets: 'Reserva confirmada.' }),
  a('gare-est', 'paris', 'Gare de l’Est', 'estacao', [48.8768, 2.3592], 'Partida do TGV INOUI para Colmar em 06/12, às 10h43.', { wiki: 'Gare de l\'Est', tickets: 'Bilhete confirmado.' }),
  a('gare-colmar', 'colmar', 'Estação de Colmar', 'estacao', [48.0735, 7.347], 'Chegada do TGV em 06/12 (13h06) e partida do TER para Strasbourg em 09/12 (bilhete pendente).', { tickets: 'Ver Transportes.' }),
  a('gare-strasbourg', 'strasbourg', 'Estação de Strasbourg', 'estacao', [48.585, 7.7344], 'Partida do TGV INOUI 9898 para Luxemburgo em 14/12, às 12h31; trens para Freiburg via Offenburg.', { tickets: 'Ver Transportes.' }),
  a('gare-luxembourg', 'luxemburgo', 'Estação de Luxemburgo', 'estacao', [49.6, 6.134], 'Chegada do TGV de Strasbourg em 14/12, às 14h15.', { wiki: 'Luxembourg railway station', tickets: 'Ver Transportes.' }),
  a('aeroporto-lux', 'luxemburgo', 'Aeroporto de Luxemburgo (Findel)', 'aeroporto', [49.6266, 6.2115], 'Partida do voo Ryanair FR5055 para Madrid em 17/12, às 20h05.', { wiki: 'Luxembourg Airport', tickets: 'Voo confirmado.' }),
]

/** Ideias para viagens futuras — fora do roteiro ativo e fora do mapa. */
export const futureIdeas = [
  {
    name: 'Mont-Saint-Michel',
    reason: 'Retirado deliberadamente desta viagem: exige cerca de cinco horas de deslocamento em cada sentido a partir de Paris.',
  },
]
