-- =========================================================================
-- Migration 003 — tabela de endereços de entrega do cliente
-- Sprint 3 / Prompt 3.3 (área do cliente)
-- Rodar no SQL Editor do Supabase.
-- =========================================================================
create table if not exists public.enderecos (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  apelido     text,
  cep         text not null,
  logradouro  text not null,
  numero      text not null,
  complemento text,
  bairro      text,
  cidade      text not null,
  uf          text not null,
  padrao      boolean not null default false,
  criado_em   timestamptz not null default now()
);

create index if not exists enderecos_profile_idx on public.enderecos(profile_id);

alter table public.enderecos enable row level security;

drop policy if exists enderecos_select on public.enderecos;
create policy enderecos_select on public.enderecos
  for select using (auth.uid() = profile_id);

drop policy if exists enderecos_insert on public.enderecos;
create policy enderecos_insert on public.enderecos
  for insert with check (auth.uid() = profile_id);

drop policy if exists enderecos_update on public.enderecos;
create policy enderecos_update on public.enderecos
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists enderecos_delete on public.enderecos;
create policy enderecos_delete on public.enderecos
  for delete using (auth.uid() = profile_id);
