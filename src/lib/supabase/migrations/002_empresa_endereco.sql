-- =========================================================================
-- Migration 002 — adiciona inscrição estadual e endereço à tabela empresas
-- Sprint 3 / Prompt 3.2 (cadastro PJ)
-- Rodar no SQL Editor do Supabase.
-- =========================================================================
alter table public.empresas
  add column if not exists inscricao_estadual text,
  add column if not exists endereco jsonb;
