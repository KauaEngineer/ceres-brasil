'use client';

import { UNIDADES_POR_CAIXA } from '@/lib/constants';
import { useCarrinho } from '@/hooks/useCarrinho';
import type { Produto } from '@/types/produto';

/**
 * Botão "Adicionar" da loja de revenda (B2B). Diferenças do BotaoAdicionar (B2C):
 * - adiciona no modo 'b2b' (caixa fechada de 12, preço precoB2B × 12)
 * - esgotado = estoque insuficiente para uma caixa inteira
 * - visual teal/charcoal da área B2B
 */
export function BotaoAdicionarB2B({ produto }: { produto: Produto }) {
  const adicionarItem = useCarrinho((s) => s.adicionarItem);
  const esgotado = produto.estoque < UNIDADES_POR_CAIXA;

  return (
    <button
      type="button"
      disabled={esgotado}
      onClick={() => adicionarItem(produto, 1, 'b2b')}
      className="mt-4 w-full rounded-full bg-ceres-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ceres-teal-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {esgotado ? 'Sem caixa disponível' : 'Adicionar caixa'}
    </button>
  );
}
