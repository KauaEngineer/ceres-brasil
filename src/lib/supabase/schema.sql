-- =========================================================================
-- CERES BRASIL — Schema do banco de dados
-- Sprint 1 / Prompt 1.3
-- =========================================================================
-- COMO EXECUTAR:
--   1. Abra https://supabase.com/dashboard
--   2. Selecione o projeto Sua Marca
--   3. No menu lateral, clique em "SQL Editor"
--   4. Clique em "New query"
--   5. Cole TODO o conteudo deste arquivo
--   6. Clique em "Run" (ou Ctrl+Enter)
--   7. Espere "Success. No rows returned"
--
-- Se precisar re-executar, primeiro rode os DROPs no fim do arquivo
-- (secao "RESETAR TUDO" — esta comentada por seguranca).
-- =========================================================================

-- Extensoes necessarias
create extension if not exists "pgcrypto"; -- gera_random_uuid()

-- =========================================================================
-- TIPOS ENUMERADOS
-- =========================================================================
do $$ begin
  create type tipo_pessoa as enum ('pf', 'pj');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_empresa as enum ('pendente', 'aprovado', 'rejeitado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type status_pedido as enum (
    'pendente', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado'
  );
exception when duplicate_object then null; end $$;

-- =========================================================================
-- 1. profiles — perfil do usuario (estende auth.users)
-- =========================================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text not null,
  tipo          tipo_pessoa not null default 'pf',
  telefone      text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists profiles_tipo_idx on public.profiles(tipo);

-- =========================================================================
-- 2. admins — usuarios com acesso ao painel /admin
-- =========================================================================
create table if not exists public.admins (
  id        uuid primary key references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);

-- Funcao auxiliar para checar admin em RLS policies
create or replace function public.is_admin(user_id uuid)
  returns boolean
  language sql
  security definer
  stable
  set search_path = public
as $$
  select exists (select 1 from public.admins where id = user_id);
$$;

-- =========================================================================
-- 3. empresas — dados de cliente PJ (B2B)
-- =========================================================================
create table if not exists public.empresas (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  razao_social    text not null,
  cnpj            text not null unique,
  status          status_empresa not null default 'pendente',
  documentos_url  text[] not null default '{}',
  motivo_rejeicao text,
  aprovado_em     timestamptz,
  criado_em       timestamptz not null default now()
);

create index if not exists empresas_profile_idx on public.empresas(profile_id);
create index if not exists empresas_status_idx on public.empresas(status);

-- Funcao auxiliar — usuario tem PJ aprovada?
create or replace function public.tem_empresa_aprovada(user_id uuid)
  returns boolean
  language sql
  security definer
  stable
  set search_path = public
as $$
  select exists (
    select 1 from public.empresas
    where profile_id = user_id and status = 'aprovado'
  );
$$;

-- =========================================================================
-- 4. produtos — catalogo da loja
-- =========================================================================
create table if not exists public.produtos (
  id                    uuid primary key default gen_random_uuid(),
  bling_id              text unique,
  nome                  text not null,
  descricao             text,
  descricao_nutricional jsonb,
  fotos                 text[] not null default '{}',
  slug                  text not null unique,
  categoria             text,
  ativo                 boolean not null default true,
  criado_em             timestamptz not null default now(),
  atualizado_em         timestamptz not null default now()
);

create index if not exists produtos_categoria_idx on public.produtos(categoria);
create index if not exists produtos_ativo_idx on public.produtos(ativo) where ativo = true;
create index if not exists produtos_slug_idx on public.produtos(slug);

-- =========================================================================
-- 5. precos — preco PF e PJ separados por produto
-- =========================================================================
create table if not exists public.precos (
  id            uuid primary key default gen_random_uuid(),
  produto_id    uuid not null references public.produtos(id) on delete cascade,
  tipo          tipo_pessoa not null,
  valor         numeric(10, 2) not null check (valor > 0),
  atualizado_em timestamptz not null default now(),
  unique (produto_id, tipo)
);

create index if not exists precos_produto_idx on public.precos(produto_id);

-- =========================================================================
-- 6. pedidos — pedidos B2C e B2B
-- =========================================================================
create table if not exists public.pedidos (
  id               uuid primary key default gen_random_uuid(),
  bling_pedido_id  text,
  profile_id       uuid not null references public.profiles(id) on delete restrict,
  tipo             tipo_pessoa not null,
  status           status_pedido not null default 'pendente',
  total            numeric(10, 2) not null check (total >= 0),
  endereco_entrega jsonb not null,
  frete_valor      numeric(10, 2) not null default 0,
  frete_prazo      int,
  pagamento_id     text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

create index if not exists pedidos_profile_idx on public.pedidos(profile_id);
create index if not exists pedidos_status_idx on public.pedidos(status);
create index if not exists pedidos_criado_idx on public.pedidos(criado_em desc);

-- =========================================================================
-- 7. itens_pedido — produtos dentro de cada pedido
-- =========================================================================
create table if not exists public.itens_pedido (
  id             uuid primary key default gen_random_uuid(),
  pedido_id      uuid not null references public.pedidos(id) on delete cascade,
  produto_id     uuid not null references public.produtos(id) on delete restrict,
  quantidade     int not null check (quantidade > 0),
  preco_unitario numeric(10, 2) not null check (preco_unitario > 0)
);

create index if not exists itens_pedido_pedido_idx on public.itens_pedido(pedido_id);

-- =========================================================================
-- TRIGGER — atualizar 'atualizado_em' automaticamente em updates
-- =========================================================================
create or replace function public.tg_set_atualizado_em()
  returns trigger
  language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_atualizado on public.profiles;
create trigger profiles_set_atualizado
  before update on public.profiles
  for each row execute function public.tg_set_atualizado_em();

drop trigger if exists produtos_set_atualizado on public.produtos;
create trigger produtos_set_atualizado
  before update on public.produtos
  for each row execute function public.tg_set_atualizado_em();

drop trigger if exists pedidos_set_atualizado on public.pedidos;
create trigger pedidos_set_atualizado
  before update on public.pedidos
  for each row execute function public.tg_set_atualizado_em();

-- =========================================================================
-- TRIGGER — criar profile automaticamente apos signup em auth.users
-- =========================================================================
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profiles (id, nome, tipo, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'tipo')::tipo_pessoa, 'pf'),
    new.raw_user_meta_data->>'telefone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================================
-- A flag "Enable automatic RLS" do projeto ja liga RLS em tabelas novas,
-- mas reforcamos aqui para garantir.
alter table public.profiles      enable row level security;
alter table public.admins        enable row level security;
alter table public.empresas      enable row level security;
alter table public.produtos      enable row level security;
alter table public.precos        enable row level security;
alter table public.pedidos       enable row level security;
alter table public.itens_pedido  enable row level security;

-- --------- profiles ---------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = id);

-- --------- admins ---------
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins
  for select using (public.is_admin(auth.uid()));

-- --------- empresas ---------
drop policy if exists empresas_select on public.empresas;
create policy empresas_select on public.empresas
  for select using (auth.uid() = profile_id or public.is_admin(auth.uid()));

drop policy if exists empresas_insert on public.empresas;
create policy empresas_insert on public.empresas
  for insert with check (auth.uid() = profile_id);

drop policy if exists empresas_update_admin on public.empresas;
create policy empresas_update_admin on public.empresas
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- --------- produtos (leitura publica de ativos, escrita admin) ---------
drop policy if exists produtos_select on public.produtos;
create policy produtos_select on public.produtos
  for select using (ativo = true or public.is_admin(auth.uid()));

drop policy if exists produtos_all_admin on public.produtos;
create policy produtos_all_admin on public.produtos
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- --------- precos ---------
-- PF (qualquer pessoa, ate anonimo): ve tipo='pf'
drop policy if exists precos_select_pf on public.precos;
create policy precos_select_pf on public.precos
  for select using (tipo = 'pf');

-- PJ aprovada: ve tipo='pj' tambem
drop policy if exists precos_select_pj on public.precos;
create policy precos_select_pj on public.precos
  for select using (
    tipo = 'pj' and (public.tem_empresa_aprovada(auth.uid()) or public.is_admin(auth.uid()))
  );

drop policy if exists precos_all_admin on public.precos;
create policy precos_all_admin on public.precos
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- --------- pedidos ---------
drop policy if exists pedidos_select on public.pedidos;
create policy pedidos_select on public.pedidos
  for select using (auth.uid() = profile_id or public.is_admin(auth.uid()));

drop policy if exists pedidos_insert on public.pedidos;
create policy pedidos_insert on public.pedidos
  for insert with check (auth.uid() = profile_id);

drop policy if exists pedidos_update_admin on public.pedidos;
create policy pedidos_update_admin on public.pedidos
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- --------- itens_pedido (segue regra do pedido pai) ---------
drop policy if exists itens_select on public.itens_pedido;
create policy itens_select on public.itens_pedido
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = itens_pedido.pedido_id
        and (auth.uid() = p.profile_id or public.is_admin(auth.uid()))
    )
  );

drop policy if exists itens_insert on public.itens_pedido;
create policy itens_insert on public.itens_pedido
  for insert with check (
    exists (
      select 1 from public.pedidos p
      where p.id = itens_pedido.pedido_id and auth.uid() = p.profile_id
    )
  );

drop policy if exists itens_all_admin on public.itens_pedido;
create policy itens_all_admin on public.itens_pedido
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- =========================================================================
-- FIM DO SCHEMA
-- =========================================================================
-- Apos rodar, voce vera "Success. No rows returned" no painel.
-- Para criar seu primeiro admin (depois de cadastrar seu usuario no app):
--   insert into public.admins (id) values ('SEU_USER_ID_DO_AUTH_USERS');
-- =========================================================================


-- =========================================================================
-- RESETAR TUDO (em caso de erro — descomente APENAS se quiser apagar tudo)
-- =========================================================================
-- drop table if exists public.itens_pedido cascade;
-- drop table if exists public.pedidos cascade;
-- drop table if exists public.precos cascade;
-- drop table if exists public.produtos cascade;
-- drop table if exists public.empresas cascade;
-- drop table if exists public.admins cascade;
-- drop table if exists public.profiles cascade;
-- drop function if exists public.is_admin(uuid);
-- drop function if exists public.tem_empresa_aprovada(uuid);
-- drop function if exists public.handle_new_user();
-- drop function if exists public.tg_set_atualizado_em();
-- drop type if exists tipo_pessoa cascade;
-- drop type if exists status_empresa cascade;
-- drop type if exists status_pedido cascade;
