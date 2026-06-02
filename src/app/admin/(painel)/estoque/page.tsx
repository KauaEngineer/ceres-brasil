import type { Metadata } from 'next';
import Link from 'next/link';
import { produtosMock } from '@/lib/mock/produtos';

export const metadata: Metadata = { title: 'Estoque — Admin' };

const ESTOQUE_MINIMO_PADRAO = 10;

export default function AdminEstoquePage() {
  const ativos = produtosMock.filter((p) => p.ativo);
  const baixos = ativos.filter((p) => p.estoque < ESTOQUE_MINIMO_PADRAO);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Estoque</h1>
        <button
          type="button"
          disabled
          title="Disponível quando a integração com o Bling for plugada"
          className="cursor-not-allowed rounded-full bg-ceres-dark/40 px-5 py-2 text-sm font-semibold text-white"
        >
          Sincronizar tudo
        </button>
      </div>

      <div className="rounded-2xl bg-ceres-sand-soft/40 p-4 text-xs text-ceres-muted">
        💡 Estoque virá do Bling em tempo real (estoque_minimo configurável por produto).
        Por enquanto, alerta visual para qualquer produto abaixo de {ESTOQUE_MINIMO_PADRAO} unidades.
      </div>

      {baixos.length > 0 && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <strong>{baixos.length} produto(s) com estoque baixo:</strong>{' '}
          {baixos.map((p) => p.nome).join(', ')}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ceres-terracotta-dark/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ceres-sand-soft/40 text-xs uppercase tracking-wider text-ceres-muted">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Estoque atual</th>
              <th className="px-4 py-3">Estoque mínimo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ceres-sand-soft">
            {ativos.map((p) => {
              const esgotado = p.estoque <= 0;
              const baixo = p.estoque < ESTOQUE_MINIMO_PADRAO;
              return (
                <tr key={p.id} className="hover:bg-ceres-sand-soft/30">
                  <td className="px-4 py-3 font-medium text-ceres-dark">{p.nome}</td>
                  <td className="px-4 py-3 capitalize text-ceres-muted">{p.categoria}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        esgotado ? 'font-bold text-red-600' : baixo ? 'font-semibold text-amber-700' : ''
                      }
                    >
                      {p.estoque}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ceres-muted">{ESTOQUE_MINIMO_PADRAO}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        esgotado
                          ? 'bg-red-100 text-red-700'
                          : baixo
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {esgotado ? 'Esgotado' : baixo ? 'Baixo' : 'OK'}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
