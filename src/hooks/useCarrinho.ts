'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Produto } from '@/types/produto';

/**
 * Modo do carrinho:
 * - 'b2c' = consumidor final (preço unitário precoB2C)
 * - 'b2b' = revendedor PJ aprovado (caixa fechada de 12 un., preço precoB2B × 12)
 *
 * O carrinho inteiro tem UM modo só — não dá pra misturar caixa fechada de
 * revenda com unidade de varejo no mesmo pedido. Trocar de modo limpa o carrinho.
 */
export type ModoCarrinho = 'b2c' | 'b2b';

export { UNIDADES_POR_CAIXA } from '@/lib/constants';
import { UNIDADES_POR_CAIXA } from '@/lib/constants';

/**
 * Item do carrinho — guardamos só o essencial (não o Produto inteiro) pra:
 * 1) manter o localStorage pequeno
 * 2) evitar dados de produto desatualizados presos no carrinho
 *
 * preco/estoque/nome já vêm "resolvidos" para o modo: no B2B, preco é o da
 * caixa (precoB2B × 12), estoque é em caixas e o nome ganha o prefixo "CX 12".
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

/** Resolve preço/estoque/nome de um produto conforme o modo do carrinho. */
function resolverItem(produto: Produto, modo: ModoCarrinho) {
  if (modo === 'b2b') {
    const precoUnit = produto.precoB2B ?? produto.precoB2C;
    return {
      preco: precoUnit * UNIDADES_POR_CAIXA,
      estoque: Math.floor(produto.estoque / UNIDADES_POR_CAIXA), // em caixas
      nome: `CX ${UNIDADES_POR_CAIXA} — ${produto.nome}`,
    };
  }
  return { preco: produto.precoB2C, estoque: produto.estoque, nome: produto.nome };
}

interface CarrinhoState {
  itens: ItemCarrinho[];
  modo: ModoCarrinho; // modo atual do carrinho (persistido)
  aberto: boolean; // estado do drawer (UI) — NÃO persistido

  // ações de UI
  abrir: () => void;
  fechar: () => void;

  // ações do carrinho
  adicionarItem: (produto: Produto, quantidade?: number, modo?: ModoCarrinho) => void;
  removerItem: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
}

export const useCarrinho = create<CarrinhoState>()(
  persist(
    (set) => ({
      itens: [],
      modo: 'b2c',
      aberto: false,

      abrir: () => set({ aberto: true }),
      fechar: () => set({ aberto: false }),

      adicionarItem: (produto, quantidade = 1, modo = 'b2c') =>
        set((state) => {
          // Trocar de modo (ex.: estava comprando no varejo e entrou na revenda)
          // zera o carrinho — não dá pra misturar B2C e B2B no mesmo pedido.
          const itensBase = state.modo === modo ? state.itens : [];

          const { preco, estoque, nome } = resolverItem(produto, modo);
          const existente = itensBase.find((i) => i.produtoId === produto.id);

          if (existente) {
            // já está no carrinho: soma, mas nunca passa do estoque
            const novaQtd = Math.min(existente.quantidade + quantidade, estoque);
            return {
              aberto: true,
              modo,
              itens: itensBase.map((i) =>
                i.produtoId === produto.id ? { ...i, quantidade: novaQtd } : i,
              ),
            };
          }

          // novo item
          return {
            aberto: true,
            modo,
            itens: [
              ...itensBase,
              {
                produtoId: produto.id,
                slug: produto.slug,
                nome,
                foto: produto.fotos[0] ?? '/produto-exemplo.png',
                preco,
                estoque,
                quantidade: Math.min(quantidade, estoque),
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
      // persiste itens + modo — o estado do drawer (aberto) não deve sobreviver ao reload
      partialize: (state) => ({ itens: state.itens, modo: state.modo }),
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
