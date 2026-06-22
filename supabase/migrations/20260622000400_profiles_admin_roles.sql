create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade unique,
  nome text,
  email text not null unique,
  avatar_url text,
  role text not null default 'reader',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('reader', 'author', 'moderator'))
);

alter table public.decantacoes
add column if not exists profile_id uuid references public.profiles(id);

create index if not exists profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists decantacoes_profile_id_idx on public.decantacoes(profile_id);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where auth_user_id = auth.uid()
    and ativo = true
  limit 1
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where auth_user_id = auth.uid()
    and ativo = true
  limit 1
$$;

create or replace function public.current_profile_is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'moderator', false)
$$;

alter table public.profiles enable row level security;

drop policy if exists "Usuario le proprio profile" on public.profiles;
drop policy if exists "Usuario cria profile reader proprio" on public.profiles;
drop policy if exists "Moderadores leem profiles" on public.profiles;
drop policy if exists "Moderadores atualizam profiles" on public.profiles;

create policy "Usuario le proprio profile"
on public.profiles
for select
to authenticated
using (auth_user_id = auth.uid());

create policy "Usuario cria profile reader proprio"
on public.profiles
for insert
to authenticated
with check (
  auth_user_id = auth.uid()
  and role = 'reader'
  and ativo = true
);

create policy "Moderadores leem profiles"
on public.profiles
for select
to authenticated
using (public.current_profile_is_moderator());

create policy "Moderadores atualizam profiles"
on public.profiles
for update
to authenticated
using (public.current_profile_is_moderator())
with check (public.current_profile_is_moderator());

insert into public.profiles (auth_user_id, nome, email, avatar_url, role, ativo, created_at)
select
  auth_user_id,
  nome,
  email,
  avatar_url,
  case
    when role in ('founder', 'editor') then 'author'
    else 'reader'
  end,
  ativo,
  created_at
from public.authors
where auth_user_id is not null
on conflict (auth_user_id) do nothing;

insert into public.profiles (auth_user_id, nome, email, avatar_url, role, ativo, created_at)
select auth_user_id, nome, email, avatar_url, 'reader', true, created_at
from public.readers
where auth_user_id is not null
on conflict (auth_user_id) do nothing;

update public.decantacoes as decantacao
set profile_id = profile.id
from public.authors as author
join public.profiles as profile on profile.auth_user_id = author.auth_user_id
where decantacao.author_id = author.id
  and decantacao.profile_id is null;

drop policy if exists "Autores ativos leem as proprias decantacoes" on public.decantacoes;
drop policy if exists "Autores ativos criam rascunhos proprios" on public.decantacoes;
drop policy if exists "Autores ativos editam rascunhos proprios" on public.decantacoes;
drop policy if exists "Profiles editoriais leem as proprias decantacoes" on public.decantacoes;
drop policy if exists "Profiles editoriais criam rascunhos proprios" on public.decantacoes;
drop policy if exists "Profiles editoriais editam rascunhos proprios" on public.decantacoes;
drop policy if exists "Moderadores leem decantacoes editoriais" on public.decantacoes;
drop policy if exists "Moderadores atualizam decantacoes editoriais" on public.decantacoes;

create policy "Profiles editoriais leem as proprias decantacoes"
on public.decantacoes
for select
to authenticated
using (
  profile_id = public.current_profile_id()
  and public.current_profile_role() in ('author', 'moderator')
);

create policy "Profiles editoriais criam rascunhos proprios"
on public.decantacoes
for insert
to authenticated
with check (
  profile_id = public.current_profile_id()
  and public.current_profile_role() in ('author', 'moderator')
  and status = 'rascunho'
  and publicado_em is null
);

create policy "Profiles editoriais editam rascunhos proprios"
on public.decantacoes
for update
to authenticated
using (
  profile_id = public.current_profile_id()
  and public.current_profile_role() in ('author', 'moderator')
  and status in ('rascunho', 'em_revisao', 'pronta_para_publicar')
  and publicado_em is null
)
with check (
  profile_id = public.current_profile_id()
  and public.current_profile_role() in ('author', 'moderator')
  and status in ('rascunho', 'em_revisao', 'pronta_para_publicar')
  and publicado_em is null
);

create policy "Moderadores leem decantacoes editoriais"
on public.decantacoes
for select
to authenticated
using (public.current_profile_is_moderator());

create policy "Moderadores atualizam decantacoes editoriais"
on public.decantacoes
for update
to authenticated
using (
  public.current_profile_is_moderator()
  and status in ('rascunho', 'em_revisao', 'pronta_para_publicar', 'publicada')
)
with check (
  public.current_profile_is_moderator()
  and status in ('em_revisao', 'pronta_para_publicar', 'publicada', 'arquivada')
);
