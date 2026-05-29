'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { signIn, signOut } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    const { data, error } = await signIn(email, senha);
    if (error || !data.user) {
      setCarregando(false);
      toast('E-mail ou senha incorretos.', 'erro');
      return;
    }

    // Verifica se o usuário é admin de verdade
    const supabase = createClient();
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();

    if (!admin) {
      await signOut();
      setCarregando(false);
      toast('Acesso não autorizado. Esta conta não é administradora.', 'erro');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ceres-charcoal px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
          Ceres Brasil
        </p>
        <h1 className="mt-2 text-2xl font-medium text-ceres-dark">Painel administrativo</h1>
        <p className="mt-1 text-sm text-ceres-muted">Acesso restrito a administradores.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="E-mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit" loading={carregando} className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
