'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIAS } from '@/types/produto';

export function FiltroCategorias() {
  const params = useSearchParams();
  const atual = params.get('categoria') ?? 'todas';

  const filtros = [{ slug: 'todas', rotuloPlural: 'Todas' }, ...CATEGORIAS] as const;

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtro por categoria">
      {filtros.map((f) => {
        const ativo = atual === f.slug;
        const href = f.slug === 'todas' ? '/produtos' : `/produtos?categoria=${f.slug}`;
        return (
          <Link
            key={f.slug}
            href={href}
            scroll={false}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              ativo
                ? 'bg-ceres-terracotta-dark text-white'
                : 'bg-white text-ceres-dark border border-ceres-sand-soft hover:border-ceres-terracotta-dark'
            }`}
            aria-current={ativo ? 'page' : undefined}
          >
            {f.rotuloPlural}
          </Link>
        );
      })}
    </nav>
  );
}
