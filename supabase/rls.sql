-- habilita RLS em todas as tabelas sensíveis
alter table usuarios enable row level security;
alter table candidatos enable row level security;
alter table empresas enable row level security;
alter table empresas_rh enable row level security;
alter table documentos_candidato enable row level security;
alter table candidaturas enable row level security;
alter table notificacoes enable row level security;

-- usuario so le a propria linha
create policy "usuario_le_proprio_registro"
  on usuarios for select
  using (auth.uid() = id);

-- candidato so le e edita o proprio perfil
create policy "candidato_le_proprio_perfil"
  on candidatos for select
  using (auth.uid() = usuario_id);

create policy "candidato_edita_proprio_perfil"
  on candidatos for update
  using (auth.uid() = usuario_id);

-- candidato so ve os proprios documentos
create policy "candidato_le_proprios_documentos"
  on documentos_candidato for select
  using (
    exists (
      select 1 from candidatos
      where candidatos.id = documentos_candidato.candidato_id
      and candidatos.usuario_id = auth.uid()
    )
  );

-- candidato so ve as proprias candidaturas
create policy "candidato_le_proprias_candidaturas"
  on candidaturas for select
  using (
    exists (
      select 1 from candidatos
      where candidatos.id = candidaturas.candidato_id
      and candidatos.usuario_id = auth.uid()
    )
  );

-- candidato so le as proprias notificacoes
create policy "candidato_le_proprias_notificacoes"
  on notificacoes for select
  using (
    exists (
      select 1 from candidatos
      where candidatos.id = notificacoes.candidato_id
      and candidatos.usuario_id = auth.uid()
    )
  );

-- empresa so le e edita o proprio registro
create policy "empresa_le_proprio_registro"
  on empresas for select
  using (auth.uid() = usuario_id);

create policy "empresa_edita_proprio_registro"
  on empresas for update
  using (auth.uid() = usuario_id);

-- empresa de rh so le e edita o proprio registro
create policy "empresa_rh_le_proprio_registro"
  on empresas_rh for select
  using (auth.uid() = usuario_id);