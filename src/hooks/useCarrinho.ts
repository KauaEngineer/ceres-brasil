'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Produto } from '@/types/produto';

/**
 * Item do carrinho — guardamos só o essencial (não o Produto inteiro) pra:
 * 1) manter o localStorage pequeno
 * 2) evitar dados de produto desatualizados presos no carrinho
 */
export interface ItemCarrinho {
  produtoId: string;
  slug: string;
  nome: string;
  foto: string;
  preco: number;
  estoque: number;
  quantidade: number;
}

interface CarrinhoState {
  itens: ItemCarrinho[];
  aberto: boolean; // estado do drawer (UI) — NÃO persistido

  // ações de UI
  abrir: () => void;
  fechar: () => void;

  // ações do carrinho
  adicionarItem: (produto: Produto, quantidade?: number) => void;
  removerItem: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

export const useCarrinho = create<CarrinhoState>()(
  persist(
    (set) => ({
      itens: [],
      aberto: false,

      abrir: () => set({ aberto: true }),
      fechar: () => set({ aberto: false }),

      adicionarItem: (produto, quantidade = 1) =>
        set((state) => {
          const existente = state.itens.find((i) => i.produtoId === produto.id);

          if (existente) {
            // já está no carrinho: soma, mas nunca passa do estoque
            const novaQtd = Math.min(existente.quantidade + quantidade, produto.estoque);
            return {
              aberto: true,
              itens: state.itens.map((i) =>
                i.produtoId === produto.id ? { ...i, quantidade: novaQtd } : i,
              ),
            };
          }

          // novo item
          return {
            aberto: true,
            itens: [
              ...state.itens,
              {
                produtoId: produto.id,
                slug: produto.slug,
                nome: produto.nome,
                foto: produto.fotos[0] ?? '/produto-exemplo.png',
                preco: produto.precoB2C,
                estoque: produto.estoque,
                quantidade: Math.min(quantidade, produto.estoque),
              },
            ],
          };
        }),

      removerItem: (produtoId) =>
        set((state) => ({ itens: state.itens.filter((i) => i.produtoId !== produtoId) })),

      atualizarQuantidade: (produtoId, quantidade) =>
        set((state) => ({
          itens: state.itens
            .map((i) =>
              i.produtoId === produtoId
                ? { ...i, quantidade: Math.max(1, Math.min(quantidade, i.estoque)) }
                : i,
            )
            .filter((i) => i.quantidade > 0),
        })),

      limparCarrinho: () => set({ itens: [] }),
    }),
    {
      name: 'ceres-carrinho',
      // só persiste os itens — o estado do drawer (aberto) não deve sobreviver ao reload
      partialize: (state) => ({ itens: state.itens }),
    },
  ),
);

/* ---------- seletores derivados (calculados a partir dos itens) ---------- */

export function calcularTotal(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
}

export function calcularQuantidadeTotal(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, i) => soma + i.quantidade, 0);
}
