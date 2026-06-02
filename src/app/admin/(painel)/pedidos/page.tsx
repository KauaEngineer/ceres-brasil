import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarData, formatarPreco, STATUS_INFO, type StatusPedido } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Pedidos — Admin' };

const PAGE_SIZE = 20;

const STATUS_OPCOES: StatusPedido[] = [
  'pendente',
  'pago',
  'em_separacao',
  'enviado',
  'entregue',
  'cancelado',
];

interface SearchParams {
  status?: string;
  tipo?: string;
  busca?: string;
  de?: string;
  ate?: string;
  pagina?: string;
}

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const pagina = Math.max(1, Number(sp.pagina ?? 1));
  const offset = (pagina - 1) * PAGE_SIZE;

  const supabase = await createClient();

  let q = supabase
    .from('pedidos')
    .select('id, status, tipo, total, criado_em, profile_id, profiles(nome, tipo)', {
      count: 'exact',
    })
    .order('criado_em', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (sp.status) q = q.eq('status', sp.status);
  if (sp.tipo) q = q.eq('tipo', sp.tipo);
  if (sp.de) q = q.gte('criado_em', sp.de);
  if (sp.ate) {
    // inclui o dia inteiro do "ate"
    const fim = new Date(sp.ate);
    fim.setDate(fim.getDate() + 1);
    q = q.lt('criado_em', fim.toISOString());
  }
  if (sp.busca) q = q.ilike('id', `${sp.busca}%`);

  const { data: pedidos, count } = await q;
  const total = count ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Monta query string preservando filtros para os links de paginação
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v && k !== 'pagina') params.set(k, String(v));
  }
  const linkPagina = (p: number) => {
    const np = new URLSearchParams(params);
    np.set('pagina', String(p));
    return `?${np.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Pedidos</h1>
        <Link
          href={`/api/admin/pedidos/export?${params.toString()}`}
          className="rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
        >
          Exportar CSV
        </Link>
      </div>

      {/* Filtros (GET form, server-side) */}
      <form className="grid gap-3 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4 md:grid-cols-5">
        <select
          name="status"
          defaultValue={sp.status ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos os status</option>
          {STATUS_OPCOES.map((s) => (
            <option key={s} value={s}>
              {STATUS_INFO[s].rotulo}
            </option>
          ))}
        </select>
        <select
          name="tipo"
          defaultValue={sp.tipo ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        >
          <option value="">B2C + B2B</option>
          <option value="pf">B2C (PF)</option>
          <option value="pj">B2B (PJ)</option>
        </select>
        <input
          type="date"
          name="de"
          defaultValue={sp.de ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        />
        <input
          type="date"
          name="ate"
          defaultValue={sp.ate ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="busca"
            placeholder="ID do pedido…"
            defaultValue={sp.busca ?? ''}
            className="flex-1 rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-ceres-dark px-4 py-2 text-sm font-medium text-white"
          >
            Filtrar
          </button>
        </div>
      </form>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-2xl border border-ceres-terracotta-dark/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ceres-sand-soft/40 text-xs uppercase tracking-wider text-ceres-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ceres-sand-soft">
            {!pedidos || pedidos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ceres-muted">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              pedidos.map((p) => {
                const info = STATUS_INFO[p.status as StatusPedido];
                const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
                return (
                  <tr key={p.id} className="hover:bg-ceres-sand-soft/30">
                    <td className="px-4 py-3 font-mono text-xs">#{p.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{profile?.nome ?? '—'}</td>
                    <td className="px-4 py-3 uppercase text-xs text-ceres-muted">
                      {p.tipo === 'pj' ? 'B2B' : 'B2C'}
                    </td>
                    <td className="px-4 py-3 text-ceres-muted">{formatarData(p.criado_em)}</td>
                    <td className="px-4 py-3 font-medium">{formatarPreco(Number(p.total))}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${info?.classe ?? ''}`}>
                        {info?.rotulo ?? p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${p.id}`}
                        className="text-sm font-medium text-ceres-terracotta-dark hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-ceres-muted">
            Página {pagina} de {totalPaginas} · {total} pedidos
          </p>
          <div className="flex gap-2">
            {pagina > 1 && (
              <Link href={linkPagina(pagina - 1)} className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-1.5">
                ← Anterior
              </Link>
            )}
            {pagina < totalPaginas && (
              <Link href={linkPagina(pagina + 1)} className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-1.5">
                Próxima →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
