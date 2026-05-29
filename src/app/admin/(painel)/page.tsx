import type { Metadata } from 'next';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin/stats';
import { formatarData, formatarPreco, STATUS_INFO, type StatusPedido } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Dashboard — Admin' };

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const maxVenda = Math.max(...stats.vendas7dias.map((v) => v.total), 1);

  const cards = [
    { rotulo: 'Pedidos hoje', valor: String(stats.pedidosHoje) },
    { rotulo: 'Receita hoje', valor: formatarPreco(stats.receitaHoje) },
    { rotulo: 'Pedidos pendentes', valor: String(stats.pedidosPendentes) },
    { rotulo: 'PJ aguardando', valor: String(stats.pjAguardando) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.rotulo} className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ceres-muted">{c.rotulo}</p>
            <p className="mt-2 text-3xl font-light text-ceres-dark">{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Gráfico simples de vendas (7 dias) */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-lg font-medium text-ceres-dark">Vendas dos últimos 7 dias</h2>
        <div className="mt-6 flex h-40 items-end justify-between gap-2">
          {stats.vendas7dias.map((v) => (
            <div key={v.dia} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-ceres-terracotta-dark transition-all"
                style={{ height: `${Math.max((v.total / maxVenda) * 100, 2)}%` }}
                title={formatarPreco(v.total)}
              />
              <span className="text-[10px] text-ceres-muted">{v.dia}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos pedidos */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-ceres-dark">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm font-medium text-ceres-terracotta-dark hover:underline">
            Ver todos
          </Link>
        </div>
        {stats.ultimosPedidos.length === 0 ? (
          <p className="mt-4 text-sm text-ceres-muted">Nenhum pedido ainda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ceres-sand-soft">
            {stats.ultimosPedidos.map((p) => {
              const info = STATUS_INFO[p.status as StatusPedido];
              return (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium text-ceres-dark">#{p.id.slice(0, 8)}</span>
                  <span className="text-ceres-muted">{formatarData(p.criado_em)}</span>
                  <span className="font-medium text-ceres-dark">{formatarPreco(Number(p.total))}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info?.classe ?? ''}`}>
                    {info?.rotulo ?? p.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
