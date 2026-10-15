# Viagens — Destino & História

App de viagens de André & Ricardo: os roteiros de todas as viagens, com mapa, dias,
cidades, reservas, checklist, financeiro e o **caderno de viagem** (o que de fato
aconteceu, com fotos), sincronizado entre os dois.

React + TypeScript + Vite, publicado no GitHub Pages. Login, caderno, fotos e
financeiro ficam no **Supabase** (plano grátis).

## Viagens

| Viagem | Período | Pasta |
|---|---|---|
| Europa Natal 2026 | 26/11 a 20/12/2026 | `src/trips/europa-natal-2026/` |
| Portugal & Madeira | 24/08 a 14/09/2026 | `src/trips/portugal-madeira-2026/` |
| Rio, Paraty (FLIP) & Vale do Café | 20/07 a 03/08/2026 | `src/trips/rio-paraty-vale-cafe-2026/` |
| Curitiba, Morretes & Foz do Iguaçu | 05 a 14/06/2026 | `src/trips/curitiba-foz-2026/` |

Cada viagem é um arquivo TypeScript que exporta um objeto `Trip` (modelo em
`src/types/index.ts`). Para incluir uma nova, crie `src/trips/<slug>/index.ts`;
ela aparece sozinha na página inicial (`src/trips/index.ts` lê todas as pastas).
`npm test` confere datas, noites, cidades e atrações de todas as viagens.

## O que é público e o que é privado

- **Público (vai para o site):** os roteiros, cidades, atrações, hotéis e transportes
  escritos em `src/trips/`. Não coloque ali números de reserva, valores ou documentos.
- **Privado (Supabase, só com login de um dos viajantes):** caderno, fotos próprias,
  status das atrações, checklist, ingressos, notas e financeiro.
  As regras de acesso (RLS) estão em `supabase/schema.sql`: só os e-mails da tabela
  `membros` leem e gravam. A URL e a chave "anon" do Supabase são públicas por natureza.
- Sem login, o app funciona como antes: o que for marcado fica só no aparelho.
  Ao entrar, o que foi feito no aparelho sobe para a conta da viagem.

## Configurar o Supabase (uma vez)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com) (plano Free).
2. No projeto, abra **SQL Editor**, cole `supabase/schema.sql`, troque os dois e-mails
   no final e clique em **Run**.
3. Em **Authentication → URL Configuration**, ponha o endereço do app em *Site URL*
   (ex.: `https://destinoehistoria.github.io/Viagens/`) e também em *Redirect URLs*.
4. (Opcional, recomendado para o app instalado no celular) Em **Authentication → Emails →
   Magic Link**, acrescente `{{ .Token }}` ao texto do e-mail, para que ele traga também
   um código de 6 dígitos.
5. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*
   (ou *publishable*). Elas entram no app de um destes jeitos:
   - variáveis do repositório no GitHub (Settings → Secrets and variables → Actions →
     **Variables**): `SUPABASE_URL` e `SUPABASE_ANON_KEY`; ou
   - escritas em `src/config.ts`.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173/Viagens/
npm test          # testes (dados de todas as viagens, datas/fusos, financeiro, interface)
npm run build     # build de produção em dist/
npm run enrich    # baixa fotos (Wikimedia Commons) e coordenadas (Wikipédia)
```

Para rodar localmente com o Supabase, crie `.env.local` com
`VITE_SUPABASE_URL=…` e `VITE_SUPABASE_ANON_KEY=…`.

## Publicação

O workflow `.github/workflows/deploy.yml` publica no GitHub Pages a cada push na
`main`: baixa as fotos, roda os testes e faz o build. Na primeira vez, ative em
**Settings → Pages → Source: GitHub Actions**.

## Como o código se organiza

- `src/trips/` — os dados de cada viagem.
- `src/data/` — "fachada" da viagem ativa: as páginas importam `cities`, `itinerary`
  etc. daqui, e `setActiveTrip` (chamado pela rota `#/v/<slug>/…`) troca o conteúdo.
- `src/components/TripLink.tsx` — `Link`/`NavLink`/`Navigate` que colocam os caminhos
  das páginas (`/roteiro`, `/mapa`…) dentro da viagem ativa.
- `src/hooks/useLocalStorage.ts` + `src/lib/sync.ts` — estado salvo no aparelho e
  sincronizado com a tabela `estado` do Supabase, em tempo real.
- `src/utils/photoStore.ts` — fotos no Supabase Storage (com login) ou no IndexedDB.
