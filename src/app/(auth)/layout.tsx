import Link from 'next/link';
import { BRAND } from '@/lib/brand';

/**
 * Layout das páginas de autenticação — card centralizado sobre fundo creme.
 * (auth) é route group: não aparece na URL.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            aria-label={`${BRAND.nome} — página inicial`}
            className="text-2xl font-light tracking-tight text-ceres-dark"
          >
            {BRAND.nome}
          </Link>
        </div>
        <div className="rounded-3xl border border-ceres-sand-soft bg-white p-8 shadow-sm md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
