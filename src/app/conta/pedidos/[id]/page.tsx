import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  formatarData,
  formatarPreco,
  STATUS_INFO,
  TIMELINE,
  type StatusPedido,
} from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Detalhe do pedido' };

interface EnderecoEntrega {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, itens_pedido(*)')
    .eq('id', id)
    .maybeSingle();

  if (!pedido) notFound();

  const status = pedido.status as StatusPedido;
  const info = STATUS_INFO[status];
  const cancelado = status === 'cancelado';
  const statusIndex = TIMELINE.indexOf(status);
  const endereco = (pedido.endereco_entrega ?? {}) as EnderecoEntrega;
  const itens = (pedido.itens_pedido ?? []) as Array<{
    id: string;
    quantidade: number;
    preco_unitario: number;
    produto_nome: string | null;
  }>;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/conta/pedidos" className="text-sm text-ceres-muted hover:text-ceres-terracotta-dark">
          ← Voltar aos pedidos
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
            Pedido #{pedido.id.slice(0, 8)}
          </h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${info?.classe ?? ''}`}>
            {info?.rotulo ?? status}
          </span>
        </div>
        <p className="mt-1 text-sm text-ceres-muted">Feito em {formatarData(pedido.criado_em)}</p>
      </div>

      {/* Timeline */}
      {!cancelado && (
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <ol className="flex flex-wrap gap-y-4">
            {TIMELINE.map((etapa, i) => {
              const ativo = i <= statusIndex;
              return (
                <li key={etapa} className="flex flex-1 items-center gap-2 min-w-[120px]">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      ativo ? 'bg-ceres-terracotta-dark text-white' : 'bg-ceres-sand-soft text-ceres-muted'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-xs ${ativo ? 'text-ceres-dark font-medium' : 'text-ceres-muted'}`}>
                    {STATUS_INFO[etapa].rotulo}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {pedido.bling_pedido_id && (
        <p className="text-sm text-ceres-muted">
          Código de rastreamento: <strong>{pedido.bling_pedido_id}</strong>
        </p>
      )}

      {/* Itens */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-lg font-medium text-ceres-dark">Itens</h2>
        <ul className="mt-4 divide-y divide-ceres-sand-soft">
          {itens.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ceres-dark">
                {item.quantidade}× {item.produto_nome ?? 'Produto'}
              </span>
              <span className="text-ceres-muted">
                {formatarPreco(Number(item.preco_unitario) * item.quantidade)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ceres-sand-soft pt-4 text-sm">
          <div className="flex justify-between text-ceres-muted">
            <span>Frete</span>
            <span>{pedido.frete_obs ? 'A combinar' : formatarPreco(Number(pedido.frete_valor ?? 0))}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ceres-dark">
            <span>Total</span>
            <span>{formatarPreco(Number(pedido.total))}</span>
          </div>
          {pedido.frete_obs && (
            <p className="mt-2 rounded-lg bg-ceres-sand-soft/50 p-2 text-xs text-ceres-muted">
              🚚 {pedido.frete_obs}
            </p>
          )}
        </div>
      </div>

      {/* Endereço */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-lg font-medium text-ceres-dark">Endereço de entrega</h2>
        <p className="mt-2 text-sm leading-relaxed text-ceres-muted">
          {endereco.logradouro}, {endereco.numero}
          {endereco.bairro ? ` — ${endereco.bairro}` : ''}
          <br />
          {endereco.cidade} / {endereco.uf} · CEP {endereco.cep}
        </p>
      </div>
    </div>
  );
}
