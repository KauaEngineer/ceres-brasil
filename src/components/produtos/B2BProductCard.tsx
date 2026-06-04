import Image from 'next/image';
import Link from 'next/link';
import { BotaoAdicionarB2B } from '@/components/carrinho/BotaoAdicionarB2B';
import { UNIDADES_POR_CAIXA } from '@/hooks/useCarrinho';
import { formatarPreco } from '@/lib/utils/pedido';
import type { Produto } from '@/types/produto';

/**
 * Card de produto para a area B2B (revendedores).
 * Diferencas em relacao ao ProductCard normal:
 * - Nome no formato "CX 12 [Nome]" (caixa fechada)
 * - Visual mais sobrio / profissional
 *
 * `liberado` = usuário é PJ aprovada. Quando true, mostra o preço da caixa e o
 * botão de adicionar; quando false, mostra "Sob Consulta" com CTA de cadastro.
 */
export function B2BProductCard({
  produto,
  liberado = false,
}: {
  produto: Produto;
  liberado?: boolean;
}) {
  const precoCaixa = (produto.precoB2B ?? produto.precoB2C) * UNIDADES_POR_CAIXA;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-ceres-teal/60">
      <Link href={`/produtos/${produto.slug}`} className="block">
        <div className="relative aspect-square bg-white">
          <Image
            src={produto.fotos[0] ?? '/produto-exemplo.png'}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-3"
          />
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
          CX {UNIDADES_POR_CAIXA} {produto.nome}
        </Link>

        {liberado ? (
          <>
            <div className="mt-3">
              <p className="text-lg font-semibold text-white">{formatarPreco(precoCaixa)}</p>
              <p className="text-[10px] text-white/50">
                caixa c/ {UNIDADES_POR_CAIXA} un. ·{' '}
                {formatarPreco(precoCaixa / UNIDADES_POR_CAIXA)}/un.
              </p>
            </div>
            <BotaoAdicionarB2B produto={produto} />
          </>
        ) : (
          <Link
            href="/seja-revendedor"
            className="mt-4 block w-full rounded-full bg-ceres-teal px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-ceres-teal-dark"
          >
            Sob Consulta
          </Link>
        )}

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
