'use client';

import { useCarrinho } from '@/hooks/useCarrinho';
import type { Produto } from '@/types/produto';

export function BotaoAdicionar({ produto }: { produto: Produto }) {
  const adicionarItem = useCarrinho((s) => s.adicionarItem);
  const esgotado = produto.estoque <= 0;

  return (
    <button
      type="button"
      disabled={esgotado}
      onClick={() => adicionarItem(produto)}
      className="mt-3 w-full rounded-full bg-ceres-terracotta-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ceres-terracotta disabled:cursor-not-allowed disabled:bg-ceres-muted disabled:opacity-60"
    >
      {esgotado ? 'Indisponível' : 'Adicionar'}
    </button>
  );
}
