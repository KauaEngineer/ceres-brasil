import type { ReactNode } from 'react';

type BadgeVariant = 'estoque' | 'esgotado' | 'destaque' | 'info' | 'neutro';

const variants: Record<BadgeVariant, string> = {
  estoque: 'bg-green-100 text-green-800',
  esgotado: 'bg-gray-200 text-gray-600',
  destaque: 'bg-ceres-gold-soft text-ceres-dark',
  info: 'bg-ceres-sand-soft text-ceres-terracotta-dark',
  neutro: 'bg-ceres-sand-soft text-ceres-dark',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutro', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
