create or replace function public.set_decantacao_numero()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    select coalesce(max(numero), 0) + 1
    into new.numero
    from public.decantacoes;
  end if;

  return new;
end;
$$;

drop trigger if exists set_decantacao_numero on public.decantacoes;

create trigger set_decantacao_numero
before insert on public.decantacoes
for each row
execute function public.set_decantacao_numero();

create policy "Autores ativos leem as proprias decantacoes"
on public.decantacoes
for select
to authenticated
using (
  exists (
    select 1
    from public.authors
    where authors.id = decantacoes.author_id
      and authors.auth_user_id = auth.uid()
      and authors.ativo = true
  )
);

create policy "Autores ativos criam rascunhos proprios"
on public.decantacoes
for insert
to authenticated
with check (
  status = 'rascunho'
  and publicado_em is null
  and exists (
    select 1
    from public.authors
    where authors.id = decantacoes.author_id
      and authors.auth_user_id = auth.uid()
      and authors.ativo = true
  )
);

create policy "Autores ativos editam rascunhos proprios"
on public.decantacoes
for update
to authenticated
using (
  status in ('rascunho', 'em_revisao', 'pronta_para_publicar')
  and publicado_em is null
  and exists (
    select 1
    from public.authors
    where authors.id = decantacoes.author_id
      and authors.auth_user_id = auth.uid()
      and authors.ativo = true
  )
)
with check (
  status in ('rascunho', 'em_revisao', 'pronta_para_publicar')
  and publicado_em is null
  and exists (
    select 1
    from public.authors
    where authors.id = decantacoes.author_id
      and authors.auth_user_id = auth.uid()
      and authors.ativo = true
  )
);
