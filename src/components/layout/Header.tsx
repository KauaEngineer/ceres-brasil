'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { calcularQuantidadeTotal, useCarrinho } from '@/hooks/useCarrinho';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/#sobre', label: 'Quem Somos' },
  { href: '/contato', label: 'Contato' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [montado, setMontado] = useState(false);
  const pathname = usePathname();

  const itens = useCarrinho((s) => s.itens);
  const abrirCarrinho = useCarrinho((s) => s.abrir);
  // guard de hidratação: o carrinho vem do localStorage só no cliente,
  // então só mostramos o contador depois de montar (evita mismatch SSR)
  const cartCount = montado ? calcularQuantidadeTotal(itens) : 0;

  // Carrinho só faz sentido nas páginas de loja
  const mostrarCarrinho = pathname.startsWith('/produtos') || pathname.startsWith('/loja');

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu mobile quando a rota muda (clique em link)
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-sm backdrop-blur-md'
          : 'bg-ceres-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center" aria-label="Ceres Brasil — página inicial">
          <Image
            src="/logo-ceres.png"
            alt="Ceres Brasil — Produtos Artesanais"
            width={120}
            height={120}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-10 md:flex"
          aria-label="Navegação principal"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-ceres-dark transition-colors hover:text-ceres-terracotta-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {mostrarCarrinho && (
            <button
              type="button"
              onClick={abrirCarrinho}
              className="relative rounded-full p-2 transition-colors hover:bg-ceres-sand-soft"
              aria-label={`Carrinho com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
            >
              <CartIcon className="h-5 w-5 text-ceres-dark" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ceres-gold text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <Link
            href="/produtos"
            className="hidden rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta md:inline-flex"
          >
            Loja Online
          </Link>

          <Link
            href="/seja-revendedor"
            className="hidden rounded-full bg-ceres-gold px-5 py-2 text-sm font-semibold text-ceres-dark transition-transform hover:scale-105 lg:inline-flex"
          >
            Seja revendedor
          </Link>

          <Link
            href="/login"
            className="hidden rounded-full border border-ceres-terracotta-dark px-5 py-2 text-sm font-medium text-ceres-dark transition-colors hover:bg-ceres-terracotta-dark hover:text-white lg:inline-flex"
          >
            Entrar
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 transition-colors hover:bg-ceres-sand-soft md:hidden"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav
          className="border-t border-ceres-sand-soft bg-white shadow-lg md:hidden"
          aria-label="Navegação mobile"
        >
          <ul className="container-ceres flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-base font-medium text-ceres-dark transition-colors hover:text-ceres-terracotta-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-ceres-sand-soft pt-3 mt-1 space-y-2">
              <Link
                href="/produtos"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-ceres-terracotta-dark py-3 text-center text-base font-semibold text-white"
              >
                Loja Online
              </Link>
              <Link
                href="/seja-revendedor"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-ceres-gold py-3 text-center text-base font-semibold text-ceres-dark"
              >
                Seja revendedor
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-ceres-terracotta-dark py-3 text-center text-base font-medium text-ceres-dark"
              >
                Entrar
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/* ---------- icones (SVG inline, sem dependencias extras) ---------- */

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 3h2l2.4 12.4a2 2 0 002 1.6h9.2a2 2 0 002-1.6L22 6H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
