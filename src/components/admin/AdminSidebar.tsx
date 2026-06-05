'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/lib/auth';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/estoque', label: 'Estoque' },
  { href: '/admin/clientes-pj', label: 'Clientes PJ' },
  { href: '/admin/relatorios', label: 'Relatórios' },
];

export function AdminSidebar({ nome }: { nome: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);

  async function sair() {
    await signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      {/* Topbar mobile */}
      <div className="flex items-center justify-between border-b border-white/10 bg-ceres-charcoal px-4 py-3 text-white md:hidden">
        <span className="font-medium">Sua Marca · Admin</span>
        <button type="button" onClick={() => setAberto((v) => !v)} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <aside
        className={`${aberto ? 'block' : 'hidden'} border-b border-white/10 bg-ceres-charcoal text-white md:block md:min-h-screen md:w-60 md:border-b-0 md:border-r`}
      >
        <div className="hidden px-6 py-5 md:block">
          <p className="text-lg font-medium">Sua Marca · Admin</p>
          <p className="mt-0.5 truncate text-xs text-white/50">{nome}</p>
        </div>

        <nav className="flex flex-col gap-1 p-3" aria-label="Menu admin">
          {links.map((l) => {
            const ativo = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  ativo ? 'bg-ceres-gold text-ceres-charcoal' : 'text-white/80 hover:bg-white/10'
                }`}
                aria-current={ativo ? 'page' : undefined}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={sair}
            className="mt-3 rounded-lg border border-white/20 px-4 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            Sair
          </button>
        </nav>
      </aside>
    </>
  );
}
