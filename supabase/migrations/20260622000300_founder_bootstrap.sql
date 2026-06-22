create policy "Usuario autenticado cria primeiro founder"
on public.authors
for insert
to authenticated
with check (
  auth_user_id = auth.uid()
  and role = 'founder'
  and ativo = true
  and not exists (
    select 1
    from public.authors
    where role = 'founder'
      and ativo = true
  )
);
