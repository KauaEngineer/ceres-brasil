'use client';

import { useState } from 'react';
import { useCarrinho } from '@/hooks/useCarrinho';
import type { Produto } from '@/types/produto';

/**
 * Bloco de compra da página de detalhe: seletor de quantidade + adicionar.
 */
export function CompraDetalhe({ produto }: { produto: Produto }) {
  const adicionarItem = useCarrinho((s) => s.adicionarItem);
  const [qtd, setQtd] = useState(1);
  const esgotado = produto.estoque <= 0;

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-ceres-terracotta-dark/20 bg-white">
        <button
          type="button"
          aria-label="Diminuir quantidade"
          disabled={esgotado || qtd <= 1}
          onClick={() => setQtd((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-ceres-muted hover:text-ceres-terracotta-dark disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-[2rem] text-center text-sm font-semibold">{qtd}</span>
        <button
          type="button"
          aria-label="Aumentar quantidade"
          disabled={esgotado || qtd >= produto.estoque}
          onClick={() => setQtd((q) => Math.min(produto.estoque, q + 1))}
          className="px-4 py-2 text-ceres-muted hover:text-ceres-terracotta-dark disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={esgotado}
        onClick={() => adicionarItem(produto, qtd)}
        className="flex-1 rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta disabled:cursor-not-allowed disabled:bg-ceres-muted disabled:opacity-60"
      >
        {esgotado ? 'Indisponível' : 'Adicionar ao carrinho'}
      </button>
    </div>
  );
}
