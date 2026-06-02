import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { produtosMock } from '@/lib/mock/produtos';
import { formatarPreco } from '@/lib/utils/pedido';
import { CATEGORIAS, type CategoriaProduto } from '@/types/produto';

export const metadata: Metadata = { title: 'Produtos — Admin' };

interface SearchParams {
  categoria?: string;
  ativo?: string;
  busca?: string;
}

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  let lista = [...produtosMock];
  if (sp.categoria) lista = lista.filter((p) => p.categoria === (sp.categoria as CategoriaProduto));
  if (sp.ativo === 'sim') lista = lista.filter((p) => p.ativo);
  if (sp.ativo === 'nao') lista = lista.filter((p) => !p.ativo);
  if (sp.busca) {
    const termo = sp.busca.toLowerCase();
    lista = lista.filter((p) => p.nome.toLowerCase().includes(termo));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Produtos</h1>
        <button
          type="button"
          disabled
          title="Disponível quando a integração com o Bling for plugada"
          className="cursor-not-allowed rounded-full bg-ceres-dark/40 px-5 py-2 text-sm font-semibold text-white"
        >
          Sincronizar com Bling
        </button>
      </div>

      <div className="rounded-2xl bg-ceres-sand-soft/40 p-4 text-xs text-ceres-muted">
        💡 Catálogo lido do mock local. Edição em tempo real será habilitada quando o Bling estiver
        integrado (credenciais OAuth do cliente). Último sync: <strong>nunca</strong>.
      </div>

      <form className="grid gap-3 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4 md:grid-cols-4">
        <select
          name="categoria"
          defaultValue={sp.categoria ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.rotuloPlural}
            </option>
          ))}
        </select>
        <select
          name="ativo"
          defaultValue={sp.ativo ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        >
          <option value="">Ativos + inativos</option>
          <option value="sim">Só ativos</option>
          <option value="nao">Só inativos</option>
        </select>
        <input
          type="text"
          name="busca"
          placeholder="Buscar por nome…"
          defaultValue={sp.busca ?? ''}
          className="rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm md:col-span-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-ceres-dark px-4 py-2 text-sm font-medium text-white md:col-start-4"
        >
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-ceres-terracotta-dark/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ceres-sand-soft/40 text-xs uppercase tracking-wider text-ceres-muted">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço PF</th>
              <th className="px-4 py-3">Preço PJ</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ceres-sand-soft">
            {lista.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ceres-muted">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              lista.map((p) => (
                <tr key={p.id} className="hover:bg-ceres-sand-soft/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image src={p.fotos[0] ?? '/produto-exemplo.png'} alt="" fill sizes="48px" className="object-contain p-1" />
                      </div>
                      <span className="font-medium text-ceres-dark">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-ceres-muted">{p.categoria}</td>
                  <td className="px-4 py-3 font-medium">{formatarPreco(p.precoB2C)}</td>
                  <td className="px-4 py-3 text-ceres-muted">
                    {p.precoB2B ? formatarPreco(p.precoB2B) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.estoque <= 0 ? 'text-red-600 font-semibold' : ''}>
                      {p.estoque}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produtos/${p.slug}`}
                      className="text-sm font-medium text-ceres-terracotta-dark hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ceres-muted">{lista.length} produto(s).</p>
    </div>
  );
}
