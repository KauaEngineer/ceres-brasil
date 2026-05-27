-- =========================================================================
-- Migration 004 — snapshot de produto no item do pedido
-- Sprint 5 / Prompt 5.1 (checkout)
-- Rodar no SQL Editor do Supabase.
--
-- Por quê: o item do pedido deve guardar o NOME e PREÇO do produto no
-- momento da compra (snapshot). Assim, se o produto mudar de preço ou for
-- removido depois, o pedido histórico continua correto. Também permite
-- criar pedidos antes de termos os produtos sincronizados do Bling.
-- =========================================================================
alter table public.itens_pedido
  alter column produto_id drop not null;

alter table public.itens_pedido
  add column if not exists produto_nome text,
  add column if not exists produto_slug text;
