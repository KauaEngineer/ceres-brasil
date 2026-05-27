import Link from 'next/link';
import type { Produto } from '@/types/produto';

/**
 * Card de produto para a area B2B (revendedores).
 * Diferencas em relacao ao ProductCard normal:
 * - Nome no formato "CX 12 [Nome]" (caixa fechada)
 * - Botao "Sob Consulta" em teal (preco negociado, nao publico)
 * - Visual mais sobrio / profissional
 */
export function B2BProductCard({ produto }: { produto: Produto }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-ceres-teal/60">
      <Link href={`/produtos/${produto.slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-white/20 to-white/5">
          <span className="absolute left-3 top-3 rounded-full bg-ceres-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ceres-charcoal">
            Revenda
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ceres-gold">
          {categoriaLabel(produto.categoria)}
        </p>
        <Link
          href={`/produtos/${produto.slug}`}
          className="mt-1.5 line-clamp-2 text-sm font-medium text-white transition-colors hover:text-ceres-gold"
        >
          CX 12 {produto.nome}
        </Link>

        <button
          type="button"
          className="mt-4 w-full rounded-full bg-ceres-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ceres-teal-dark"
        >
          Sob Consulta
        </button>

        <p className="mt-2 text-center text-[10px] text-white/50">
          Oferta de 1% de cashback
        </p>
      </div>
    </article>
  );
}

function categoriaLabel(c: Produto['categoria']) {
  if (c === 'massas') return 'Massas';
  if (c === 'farinhas') return 'Farinhas';
  return 'Grãos';
}
