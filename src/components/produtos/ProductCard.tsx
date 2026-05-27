import Link from 'next/link';
import type { Produto } from '@/types/produto';

/**
 * Card de produto reutilizavel — usado na listagem, destaques da home e relacionados.
 * Server Component (sem interatividade no card em si; o botao "Adicionar" sera plugado
 * com useCarrinho na Sprint 4).
 */
export function ProductCard({ produto }: { produto: Produto }) {
  const esgotado = produto.estoque <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ceres-sand-soft bg-white transition-shadow hover:shadow-lg">
      <Link href={`/produtos/${produto.slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-ceres-sand-soft to-ceres-gold-soft">
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ceres-dark">
            Sem glúten
          </span>
          {esgotado && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-ceres-dark">
                Esgotado
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-ceres-gold">
          {categoriaLabel(produto.categoria)}
        </p>
        <Link
          href={`/produtos/${produto.slug}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-ceres-dark transition-colors hover:text-ceres-terracotta-dark md:text-base"
        >
          {produto.nome}
        </Link>
        <p className="mt-auto pt-3 text-lg font-bold text-ceres-dark md:text-xl">
          {formatarPreco(produto.precoB2C)}
        </p>
        <button
          type="button"
          disabled={esgotado}
          className="mt-3 w-full rounded-full bg-ceres-terracotta-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ceres-terracotta disabled:cursor-not-allowed disabled:bg-ceres-muted disabled:opacity-60"
        >
          {esgotado ? 'Indisponível' : 'Adicionar'}
        </button>
      </div>
    </article>
  );
}

function categoriaLabel(c: Produto['categoria']) {
  if (c === 'massas') return 'Massas sem glúten';
  if (c === 'farinhas') return 'Farinhas';
  return 'Grãos e cereais';
}

export function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
