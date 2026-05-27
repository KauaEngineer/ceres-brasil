import Link from 'next/link';

export function CarrinhoVazio({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ceres-sand-soft text-ceres-terracotta-dark">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
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
      </div>
      <h3 className="mt-4 text-lg font-medium text-ceres-dark">Seu carrinho está vazio</h3>
      <p className="mt-1 text-sm text-ceres-muted">Que tal dar uma olhada nos nossos produtos?</p>
      <Link
        href="/produtos"
        onClick={onFechar}
        className="mt-6 rounded-full bg-ceres-terracotta-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
      >
        Ver produtos
      </Link>
    </div>
  );
}
