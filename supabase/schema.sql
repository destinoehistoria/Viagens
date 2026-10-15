-- ============================================================================
-- App Viagens (Destino & História) — estrutura do banco no Supabase
--
-- Como usar: no painel do Supabase, abra "SQL Editor", cole este arquivo inteiro,
-- troque os e-mails no final e clique em "Run". Pode rodar de novo sem problema.
--
-- Segurança: todas as tabelas e o bucket de fotos só aceitam leitura e escrita de
-- quem estiver logado com um e-mail cadastrado em `membros`. Visitantes do site
-- veem apenas os roteiros (que ficam no código do app, não no banco).
-- ============================================================================

-- Quem pode ver e editar os dados privados (caderno, fotos, financeiro…)
create table if not exists public.membros (
  email text primary key,
  nome text
);

-- Estado de cada viagem: uma linha por chave (ex.: 'financeiro', 'caderno/2026-12-04',
-- 'status-atracoes/sagrada-familia'). O app guarda o valor como JSON.
create table if not exists public.estado (
  viagem text not null,
  chave text not null,
  valor jsonb,
  atualizado_em timestamptz not null default now(),
  atualizado_por text default (auth.jwt() ->> 'email'),
  primary key (viagem, chave)
);

-- Fotos dos viajantes (o arquivo fica no bucket "fotos"; aqui vão os dados dela)
create table if not exists public.fotos (
  id text primary key,
  viagem text not null,
  escopo text not null, -- 'dia-2026-12-04' ou 'cidade-paris'
  legenda text,
  caminho text not null, -- caminho no bucket: <viagem>/<escopo>/<id>.jpg
  criado_em timestamptz not null default now(),
  criado_por text default (auth.jwt() ->> 'email')
);
create index if not exists fotos_viagem_escopo on public.fotos (viagem, escopo);

-- Atualiza "atualizado_em/por" a cada gravação
create or replace function public.tocar_estado() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  new.atualizado_por := auth.jwt() ->> 'email';
  return new;
end $$;
drop trigger if exists estado_tocar on public.estado;
create trigger estado_tocar before insert or update on public.estado
  for each row execute function public.tocar_estado();

-- O usuário logado é um dos viajantes?
create or replace function public.eh_membro() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.membros where lower(email) = lower(auth.jwt() ->> 'email'))
$$;
grant execute on function public.eh_membro() to authenticated;

-- Regras de acesso (Row Level Security)
alter table public.membros enable row level security;
alter table public.estado enable row level security;
alter table public.fotos enable row level security;

drop policy if exists "membro ve a lista" on public.membros;
create policy "membro ve a lista" on public.membros for select to authenticated using (public.eh_membro());

drop policy if exists "membros leem e gravam" on public.estado;
create policy "membros leem e gravam" on public.estado for all to authenticated
  using (public.eh_membro()) with check (public.eh_membro());

drop policy if exists "membros leem e gravam" on public.fotos;
create policy "membros leem e gravam" on public.fotos for all to authenticated
  using (public.eh_membro()) with check (public.eh_membro());

-- Bucket privado para as fotos (nada é público; o app usa links temporários)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false;

drop policy if exists "membros acessam fotos" on storage.objects;
create policy "membros acessam fotos" on storage.objects for all to authenticated
  using (bucket_id = 'fotos' and public.eh_membro())
  with check (bucket_id = 'fotos' and public.eh_membro());

-- Atualizações em tempo real (o que um escreve aparece para o outro)
do $$
begin
  alter publication supabase_realtime add table public.estado;
exception when duplicate_object then null;
end $$;

-- ============================================================================
-- TROQUE pelos e-mails de vocês dois (os mesmos que vão usar para entrar no app)
-- ============================================================================
insert into public.membros (email, nome) values
  ('email-do-andre@exemplo.com', 'André'),
  ('email-do-ricardo@exemplo.com', 'Ricardo')
on conflict (email) do update set nome = excluded.nome;
