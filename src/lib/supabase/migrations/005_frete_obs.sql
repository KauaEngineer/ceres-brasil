-- =========================================================================
-- Migration 005 — observação de frete (usada no fluxo B2B / revenda)
-- Sprint 6 (fluxo B2B)
-- Rodar no SQL Editor do Supabase.
--
-- Por quê: no B2B o frete é por conta do destinatário. O pedido não cobra
-- frete (frete_valor = 0); em vez disso guardamos aqui, em texto legível,
-- como o frete será arranjado — a transportadora do cliente ou uma cotação
-- a ser feita pela loja. O admin lê isso para acionar a coleta.
-- =========================================================================
alter table public.pedidos
  add column if not exists frete_obs text;
