'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Início', destaque: false },
  { href: '/produtos', label: 'Loja Online', destaque: true },
  { href: '/#sobre', label: 'Quem Somos', destaque: false },
  { href: '/contato', label: 'Contato', destaque: false },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = 0; // TODO: substituir por useCarrinho na Sprint 4

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
      <div className="container-ceres flex h-16 items-center justify-between md:h-20">
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

        <nav className="hidden items-center gap-2 md:flex md:gap-3 lg:gap-6" aria-label="Navegação principal">
          {navLinks.map((link) =>
            link.destaque ? (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-ceres-terracotta-soft px-4 py-1.5 text-sm font-semibold text-ceres-terracotta-dark transition-colors hover:bg-ceres-terracotta-dark hover:text-white"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 text-sm font-medium text-ceres-dark transition-colors hover:text-ceres-terracotta-dark"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
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

          <Link
            href="/seja-revendedor"
            className="hidden rounded-full bg-ceres-gold px-5 py-2 text-sm font-semibold text-ceres-dark transition-transform hover:scale-105 lg:inline-flex"
          >
            Seja revendedor
          </Link>

          <Link
            href="/login"
            className="hidden rounded-full border border-ceres-terracotta-dark px-5 py-2 text-sm font-medium text-ceres-terracotta-dark transition-colors hover:bg-ceres-terracotta-dark hover:text-white md:inline-flex"
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
                href="/seja-revendedor"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full bg-ceres-gold py-3 text-center text-base font-semibold text-ceres-dark"
              >
                Seja revendedor
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-ceres-terracotta-dark py-3 text-center text-base font-medium text-ceres-terracotta-dark"
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
