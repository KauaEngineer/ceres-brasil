import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarPreco } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Pedido confirmado' };

export default async function PedidoConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const supabase = await createClient();

  const { data: pedido } = id
    ? await supabase
        .from('pedidos')
        .select('id, total, frete_prazo, itens_pedido(produto_nome, quantidade)')
        .eq('id', id)
        .maybeSingle()
    : { data: null };

  return (
    <div className="container-ceres flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border border-ceres-terracotta-dark/15 bg-white p-8 text-center md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
            <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-light tracking-tight text-ceres-dark">Pedido confirmado!</h1>

        {pedido ? (
          <>
            <p className="mt-2 text-sm text-ceres-muted">
              Pedido <strong className="text-ceres-dark">#{pedido.id.slice(0, 8)}</strong> recebido.
              {pedido.frete_prazo ? ` Previsão de entrega: ${pedido.frete_prazo} dias úteis.` : ''}
            </p>

            <div className="mt-6 rounded-2xl bg-ceres-sand-soft/50 p-5 text-left text-sm">
              <p className="font-semibold text-ceres-dark">Você comprou:</p>
              <ul className="mt-2 space-y-1 text-ceres-muted">
                {(pedido.itens_pedido as Array<{ produto_nome: string; quantidade: number }>).map(
                  (it, idx) => (
                    <li key={idx}>
                      {it.quantidade}× {it.produto_nome}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-3 border-t border-ceres-terracotta-dark/10 pt-2 font-semibold text-ceres-dark">
                Total: {formatarPreco(Number(pedido.total))}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-ceres-muted">Seu pedido foi registrado com sucesso.</p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/conta/pedidos"
            className="rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
          >
            Ver meus pedidos
          </Link>
          <Link
            href="/produtos"
            className="rounded-full border border-ceres-terracotta-dark/30 px-6 py-3 text-sm font-medium text-ceres-dark transition-colors hover:bg-ceres-sand-soft"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
