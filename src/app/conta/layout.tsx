import { redirect } from 'next/navigation';
import { ContaSidebar } from '@/components/conta/ContaSidebar';
import { createClient } from '@/lib/supabase/server';

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
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
    <div className="container-ceres py-10 md:py-14">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ceres-terracotta-dark">
              Minha conta
            </p>
            <p className="mt-1 text-lg font-medium text-ceres-dark">Olá, {primeiroNome}</p>
            <p className="text-xs text-ceres-muted">
              {profile?.tipo === 'pj' ? 'Conta empresarial' : 'Pessoa física'}
            </p>
          </div>
          <ContaSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
