create extension if not exists pgcrypto;

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  avatar_url text,
  bio text,
  role text not null default 'guest',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint authors_role_check check (role in ('founder', 'editor', 'guest'))
);

create table public.decantacoes (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  titulo text not null,
  slug text not null unique,
  subtitulo text,
  trecho text not null,
  conteudo text not null,
  tempo_leitura integer not null,
  status text not null default 'rascunho',
  author_id uuid references public.authors(id),
  publicado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint decantacoes_status_check check (
    status in ('rascunho', 'em_revisao', 'pronta_para_publicar', 'publicada', 'arquivada')
  )
);

create table public.readers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  nome text,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.comentarios (
  id uuid primary key default gen_random_uuid(),
  decantacao_id uuid not null references public.decantacoes(id) on delete cascade,
  reader_id uuid not null references public.readers(id) on delete cascade,
  conteudo text not null,
  status text not null default 'publicado',
  created_at timestamptz not null default now(),
  constraint comentarios_status_check check (status in ('publicado', 'oculto', 'em_moderacao'))
);

create table public.favoritos (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references public.readers(id) on delete cascade,
  decantacao_id uuid not null references public.decantacoes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (reader_id, decantacao_id)
);

create index decantacoes_slug_idx on public.decantacoes(slug);
create index decantacoes_status_idx on public.decantacoes(status);
create index decantacoes_numero_idx on public.decantacoes(numero);
create index decantacoes_publicado_em_idx on public.decantacoes(publicado_em);
create index authors_auth_user_id_idx on public.authors(auth_user_id);
create index readers_auth_user_id_idx on public.readers(auth_user_id);

create or replace function public.set_decantacoes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_decantacoes_updated_at
before update on public.decantacoes
for each row
execute function public.set_decantacoes_updated_at();

alter table public.authors enable row level security;
alter table public.decantacoes enable row level security;
alter table public.readers enable row level security;
alter table public.comentarios enable row level security;
alter table public.favoritos enable row level security;

create policy "Autores ativos podem ser lidos publicamente"
on public.authors
for select
using (ativo = true);

create policy "Decantacoes publicadas podem ser lidas publicamente"
on public.decantacoes
for select
using (status = 'publicada');

create policy "Leitores autenticados leem o proprio perfil"
on public.readers
for select
to authenticated
using (auth_user_id = auth.uid());

create policy "Leitores autenticados leem os proprios favoritos"
on public.favoritos
for select
to authenticated
using (
  exists (
    select 1
    from public.readers
    where readers.id = favoritos.reader_id
      and readers.auth_user_id = auth.uid()
  )
);

create policy "Leitores autenticados leem os proprios comentarios"
on public.comentarios
for select
to authenticated
using (
  exists (
    select 1
    from public.readers
    where readers.id = comentarios.reader_id
      and readers.auth_user_id = auth.uid()
  )
);
