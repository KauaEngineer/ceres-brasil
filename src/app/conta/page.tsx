import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/conta/LogoutButton';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Minha conta',
};

const atalhos = [
  { href: '/conta/pedidos', titulo: 'Meus pedidos', desc: 'Acompanhe status e rastreio' },
  { href: '/conta/dados', titulo: 'Meus dados', desc: 'Nome, telefone e senha' },
  { href: '/conta/enderecos', titulo: 'Endereços', desc: 'Endereços de entrega salvos' },
];

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/conta');

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, tipo')
    .eq('id', user.id)
    .maybeSingle();

  const primeiroNome = (profile?.nome ?? 'Cliente').split(' ')[0];

  return (
    <div className="container-ceres py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ceres-terracotta-dark">
            Minha conta
          </p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-ceres-dark md:text-4xl">
            Olá, {primeiroNome} 👋
          </h1>
          <p className="mt-1 text-sm text-ceres-muted">
            {profile?.tipo === 'pj' ? 'Conta empresarial (B2B)' : 'Conta pessoa física'} ·{' '}
            {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {atalhos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-2xl border border-ceres-sand-soft bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-medium text-ceres-dark">{a.titulo}</h2>
            <p className="mt-1 text-sm text-ceres-muted">{a.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ceres-terracotta-dark">
              Acessar <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-ceres-sand-soft/50 p-6 text-sm text-ceres-muted">
        Esta área será expandida no Prompt 3.3 (lista de pedidos, edição de dados, endereços com
        busca por CEP).
      </div>
    </div>
  );
}
