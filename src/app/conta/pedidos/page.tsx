import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarData, formatarPreco, STATUS_INFO, type StatusPedido } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Meus pedidos' };

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, status, total, criado_em')
    .order('criado_em', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
        Meus pedidos
      </h1>

      {!pedidos || pedidos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ceres-terracotta-dark/30 bg-white/50 p-10 text-center">
          <p className="text-sm text-ceres-muted">
            Você ainda não fez nenhum pedido. Quando comprar, o histórico aparece aqui.
          </p>
          <Link
            href="/produtos"
            className="mt-4 inline-block rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((p) => {
            const info = STATUS_INFO[p.status as StatusPedido];
            return (
              <li key={p.id}>
                <Link
                  href={`/conta/pedidos/${p.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-medium text-ceres-dark">Pedido #{p.id.slice(0, 8)}</p>
                    <p className="text-xs text-ceres-muted">{formatarData(p.criado_em)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-ceres-dark">
                      {formatarPreco(Number(p.total))}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${info?.classe ?? ''}`}
                    >
                      {info?.rotulo ?? p.status}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
