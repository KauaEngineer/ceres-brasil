'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/conta/LogoutButton';

const links = [
  { href: '/conta', label: 'Dashboard' },
  { href: '/conta/pedidos', label: 'Meus pedidos' },
  { href: '/conta/dados', label: 'Meus dados' },
  { href: '/conta/enderecos', label: 'Endereços' },
];

export function ContaSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Menu da conta">
      {links.map((l) => {
        // Dashboard só ativo no /conta exato; os outros por prefixo
        const ativo = l.href === '/conta' ? pathname === '/conta' : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              ativo
                ? 'bg-ceres-terracotta-dark text-white'
                : 'text-ceres-dark hover:bg-white'
            }`}
            aria-current={ativo ? 'page' : undefined}
          >
            {l.label}
          </Link>
        );
      })}
      <div className="mt-4 border-t border-ceres-terracotta-dark/15 pt-4">
        <LogoutButton />
      </div>
    </nav>
  );
}
