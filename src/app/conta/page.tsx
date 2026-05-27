import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Minha conta' };

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Últimos pedidos (vazio até existir checkout — Sprint 5)
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, status, total, criado_em')
    .order('criado_em', { ascending: false })
    .limit(3);

  const cards = [
    { href: '/conta/pedidos', titulo: 'Meus pedidos', desc: 'Acompanhe status e rastreio' },
    { href: '/conta/dados', titulo: 'Meus dados', desc: 'Nome, telefone e senha' },
    { href: '/conta/enderecos', titulo: 'Endereços', desc: 'Endereços de entrega salvos' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
        Painel da conta
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h2 className="text-base font-medium text-ceres-dark">{c.titulo}</h2>
            <p className="mt-1 text-sm text-ceres-muted">{c.desc}</p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-medium text-ceres-dark">Últimos pedidos</h2>
        {!pedidos || pedidos.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-ceres-terracotta-dark/30 bg-white/50 p-8 text-center">
            <p className="text-sm text-ceres-muted">Você ainda não fez nenhum pedido.</p>
            <Link
              href="/produtos"
              className="mt-4 inline-block rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {pedidos.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/conta/pedidos/${p.id}`}
                  className="flex items-center justify-between rounded-xl border border-ceres-terracotta-dark/15 bg-white px-4 py-3 text-sm transition-shadow hover:shadow-sm"
                >
                  <span className="font-medium text-ceres-dark">#{p.id.slice(0, 8)}</span>
                  <span className="text-ceres-muted">{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
