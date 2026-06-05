'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { signIn, signInGoogle } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const destino = params.get('redirect') ?? '/conta';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await signIn(email, senha);
    setCarregando(false);

    if (error) {
      toast(
        error.message.includes('Invalid login')
          ? 'E-mail ou senha incorretos.'
          : 'Não foi possível entrar. Tente novamente.',
        'erro',
      );
      return;
    }
    toast('Bem-vindo de volta!', 'sucesso');
    router.push(destino);
    router.refresh();
  }

  async function handleGoogle() {
    const { error } = await signInGoogle();
    if (error) toast('Google login indisponível (configurar no Supabase).', 'erro');
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-ceres-dark">Entrar</h1>
      <p className="mt-1 text-sm text-ceres-muted">Acesse sua conta Sua Marca.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
        <Input
          label="Senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
        />
        <div className="text-right">
          <Link
            href="/esqueci-senha"
            className="text-sm font-medium text-ceres-terracotta-dark hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" loading={carregando} className="w-full">
          Entrar
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-ceres-sand-soft" />
        <span className="text-xs uppercase tracking-wider text-ceres-muted">ou</span>
        <span className="h-px flex-1 bg-ceres-sand-soft" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-ceres-sand-soft bg-white px-5 py-2.5 text-sm font-medium text-ceres-dark transition-colors hover:bg-ceres-sand-soft"
      >
        <GoogleIcon />
        Entrar com Google
      </button>

      <p className="mt-6 text-center text-sm text-ceres-muted">
        Não tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-ceres-terracotta-dark hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.9C4.1 20.5 7.8 23 12 23z"
      />
      <path fill="#FBBC05" d="M6 14.3c-.2-.7-.4-1.4-.4-2.3s.1-1.6.4-2.3V6.8H2.3C1.5 8.3 1 10.1 1 12s.5 3.7 1.3 5.2L6 14.3z" />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.5 2.3 6.8L6 9.7c.9-2.5 3.2-4.3 6-4.3z"
      />
    </svg>
  );
}
