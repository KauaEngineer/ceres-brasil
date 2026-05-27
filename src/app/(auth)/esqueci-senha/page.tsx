'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { resetPassword } from '@/lib/auth';
import { validarEmail } from '@/lib/utils/validacao';

export default function EsqueciSenhaPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarEmail(email)) return;
    setCarregando(true);
    const { error } = await resetPassword(email);
    setCarregando(false);
    if (error) {
      toast('Não foi possível enviar o e-mail. Tente novamente.', 'erro');
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-medium text-ceres-dark">Verifique seu e-mail</h1>
        <p className="mt-2 text-sm text-ceres-muted">
          Se houver uma conta para <strong>{email}</strong>, enviamos um link para redefinir a
          senha.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-ceres-terracotta-dark hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-ceres-dark">Recuperar senha</h1>
      <p className="mt-1 text-sm text-ceres-muted">
        Informe seu e-mail e enviaremos um link de redefinição.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
        <Button type="submit" loading={carregando} className="w-full">
          Enviar link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ceres-muted">
        Lembrou a senha?{' '}
        <Link href="/login" className="font-semibold text-ceres-terracotta-dark hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
