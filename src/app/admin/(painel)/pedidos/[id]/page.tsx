import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcoesPedido } from '@/components/admin/AcoesPedido';
import { createClient } from '@/lib/supabase/server';
import {
  formatarData,
  formatarPreco,
  STATUS_INFO,
  TIMELINE,
  type StatusPedido,
} from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Pedido — Admin' };

interface EnderecoEntrega {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export default async function AdminPedidoDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, itens_pedido(*), profiles(nome, telefone, tipo)')
    .eq('id', id)
    .maybeSingle();

  if (!pedido) notFound();

  const status = pedido.status as StatusPedido;
  const info = STATUS_INFO[status];
  const statusIndex = TIMELINE.indexOf(status);
  const cancelado = status === 'cancelado';
  const endereco = (pedido.endereco_entrega ?? {}) as EnderecoEntrega;
  const profile = Array.isArray(pedido.profiles) ? pedido.profiles[0] : pedido.profiles;
  const itens = (pedido.itens_pedido ?? []) as Array<{
    id: string;
    produto_nome: string | null;
    quantidade: number;
    preco_unitario: number;
  }>;

  return (
    <div className="space-y-6">
      <Link href="/admin/pedidos" className="text-sm text-ceres-muted hover:text-ceres-terracotta-dark">
        ← Voltar
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
          Pedido #{pedido.id.slice(0, 8)}
        </h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${info?.classe ?? ''}`}>
          {info?.rotulo ?? status}
        </span>
        <span className="text-xs uppercase tracking-wider text-ceres-muted">
          {pedido.tipo === 'pj' ? 'B2B' : 'B2C'}
        </span>
      </div>
      <p className="text-sm text-ceres-muted">Feito em {formatarData(pedido.criado_em)}</p>

      {/* Ações (client) */}
      <AcoesPedido pedidoId={pedido.id} status={status} blingId={pedido.bling_pedido_id} />

      {/* Timeline */}
      {!cancelado && (
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
            Andamento
          </h2>
          <ol className="mt-4 flex flex-wrap gap-y-4">
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
                  <span className={`text-xs ${ativo ? 'font-medium text-ceres-dark' : 'text-ceres-muted'}`}>
                    {STATUS_INFO[etapa].rotulo}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cliente */}
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">Cliente</h2>
          <p className="mt-3 font-medium text-ceres-dark">{profile?.nome ?? '—'}</p>
          {profile?.telefone && <p className="text-sm text-ceres-muted">{profile.telefone}</p>}
        </div>

        {/* Endereço */}
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">Entrega</h2>
          <p className="mt-3 text-sm leading-relaxed text-ceres-dark">
            {endereco.logradouro}, {endereco.numero}
            {endereco.complemento ? ` — ${endereco.complemento}` : ''}
            <br />
            {endereco.bairro ? `${endereco.bairro}, ` : ''}
            {endereco.cidade} / {endereco.uf}
            <br />
            CEP {endereco.cep}
          </p>
        </div>
      </div>

      {/* Itens */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">Itens</h2>
        <ul className="mt-4 divide-y divide-ceres-sand-soft">
          {itens.map((it) => (
            <li key={it.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ceres-dark">
                {it.quantidade}× {it.produto_nome ?? 'Produto'}
              </span>
              <span className="text-ceres-muted">
                {formatarPreco(Number(it.preco_unitario) * it.quantidade)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ceres-sand-soft pt-4 text-sm">
          <div className="flex justify-between text-ceres-muted">
            <span>Frete</span>
            <span>{formatarPreco(Number(pedido.frete_valor ?? 0))}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ceres-dark">
            <span>Total</span>
            <span>{formatarPreco(Number(pedido.total))}</span>
          </div>
          {pedido.pagamento_id && (
            <p className="mt-2 text-xs text-ceres-muted">Pagamento: {pedido.pagamento_id}</p>
          )}
        </div>
      </div>
    </div>
  );
}
