drop policy if exists "Moderadores atualizam decantacoes editoriais" on public.decantacoes;
drop policy if exists "Moderadores revisam decantacoes editoriais" on public.decantacoes;
drop policy if exists "Moderadores publicam decantacoes prontas" on public.decantacoes;
drop policy if exists "Moderadores arquivam decantacoes publicadas" on public.decantacoes;

create policy "Moderadores revisam decantacoes editoriais"
on public.decantacoes
for update
to authenticated
using (
  public.current_profile_is_moderator()
  and status in ('rascunho', 'em_revisao', 'pronta_para_publicar')
)
with check (
  public.current_profile_is_moderator()
  and status in ('em_revisao', 'pronta_para_publicar', 'arquivada')
  and publicado_em is null
);

create policy "Moderadores publicam decantacoes prontas"
on public.decantacoes
for update
to authenticated
using (
  public.current_profile_is_moderator()
  and status = 'pronta_para_publicar'
)
with check (
  public.current_profile_is_moderator()
  and status = 'publicada'
  and publicado_em is not null
);

create policy "Moderadores arquivam decantacoes publicadas"
on public.decantacoes
for update
to authenticated
using (
  public.current_profile_is_moderator()
  and status = 'publicada'
)
with check (
  public.current_profile_is_moderator()
  and status = 'arquivada'
);
