'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { CarrinhoVazio } from '@/components/carrinho/CarrinhoVazio';
import { calcularTotal, useCarrinho } from '@/hooks/useCarrinho';
import { formatarPreco } from '@/lib/utils/pedido';

export function CarrinhoDrawer() {
  const { itens, aberto, fechar, removerItem, atualizarQuantidade } = useCarrinho();

  // Fecha com ESC + trava scroll do body quando aberto
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [aberto, fechar]);

  const total = calcularTotal(itens);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={fechar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col bg-ceres-cream shadow-2xl transition-transform duration-300 ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
      >
        <header className="flex items-center justify-between border-b border-ceres-terracotta-dark/15 px-5 py-4">
          <h2 className="text-lg font-medium text-ceres-dark">Seu carrinho</h2>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar carrinho"
            className="rounded-full p-2 text-ceres-muted transition-colors hover:bg-white hover:text-ceres-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {itens.length === 0 ? (
          <CarrinhoVazio onFechar={fechar} />
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {itens.map((item) => (
                <li
                  key={item.produtoId}
                  className="flex gap-3 border-b border-ceres-terracotta-dark/10 py-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image src={item.foto} alt={item.nome} fill sizes="80px" className="object-contain p-1" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produtos/${item.slug}`}
                        onClick={fechar}
                        className="line-clamp-2 text-sm font-medium text-ceres-dark hover:text-ceres-terracotta-dark"
                      >
                        {item.nome}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removerItem(item.produtoId)}
                        aria-label={`Remover ${item.nome}`}
                        className="shrink-0 rounded-full p-1 text-ceres-muted hover:text-red-600"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ceres-terracotta-dark/20 bg-white">
                        <button
                          type="button"
                          onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                          aria-label="Diminuir"
                          className="px-3 py-1 text-ceres-muted hover:text-ceres-terracotta-dark"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                          {item.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                          disabled={item.quantidade >= item.estoque}
                          aria-label="Aumentar"
                          className="px-3 py-1 text-ceres-muted hover:text-ceres-terracotta-dark disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ceres-dark">
                        {formatarPreco(item.preco * item.quantidade)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-ceres-terracotta-dark/15 px-5 py-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-ceres-muted">Subtotal</span>
                <span className="font-semibold text-ceres-dark">{formatarPreco(total)}</span>
              </div>
              <p className="mt-1 text-xs text-ceres-muted">Frete calculado no checkout.</p>
              <Link
                href="/checkout"
                onClick={fechar}
                className="mt-4 block rounded-full bg-ceres-terracotta-dark py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
              >
                Ir para o checkout
              </Link>
              <button
                type="button"
                onClick={fechar}
                className="mt-2 w-full rounded-full border border-ceres-terracotta-dark/30 py-3 text-sm font-medium text-ceres-dark transition-colors hover:bg-white"
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
