'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { signUpPF } from '@/lib/auth';
import {
  forcaSenha,
  mascaraCPF,
  mascaraTelefone,
  validarCPF,
  validarEmail,
} from '@/lib/utils/validacao';

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cpf: '',
  });
  const [aceito, setAceito] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const senhaForca = forcaSenha(form.senha);

  // Erros em tempo real (só mostram quando há conteúdo)
  const erros = {
    email: form.email && !validarEmail(form.email) ? 'E-mail inválido' : undefined,
    cpf: form.cpf && !validarCPF(form.cpf) ? 'CPF inválido' : undefined,
    confirmarSenha:
      form.confirmarSenha && form.confirmarSenha !== form.senha
        ? 'As senhas não coincidem'
        : undefined,
  };

  const formValido =
    form.nome.trim().length > 2 &&
    validarEmail(form.email) &&
    validarCPF(form.cpf) &&
    senhaForca.ok &&
    form.senha === form.confirmarSenha &&
    aceito;

  function up(campo: keyof typeof form, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValido) return;
    setCarregando(true);
    const { data, error } = await signUpPF({
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      telefone: form.telefone,
    });
    setCarregando(false);

    if (error) {
      toast(
        error.message.includes('already registered')
          ? 'Este e-mail já está cadastrado.'
          : 'Erro ao cadastrar. Tente novamente.',
        'erro',
      );
      return;
    }

    // Se o Supabase exigir confirmação de e-mail, não há sessão imediata.
    if (data.session) {
      toast('Conta criada! Bem-vindo à Sua Marca.', 'sucesso');
      router.push('/conta');
      router.refresh();
    } else {
      setEnviado(true);
    }
  }

  if (enviado) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ceres-terracotta-dark text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-medium text-ceres-dark">Confirme seu e-mail</h1>
        <p className="mt-2 text-sm text-ceres-muted">
          Enviamos um link de confirmação para <strong>{form.email}</strong>. Clique nele para
          ativar sua conta.
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
      <h1 className="text-2xl font-medium text-ceres-dark">Criar conta</h1>
      <p className="mt-1 text-sm text-ceres-muted">Cadastro de pessoa física.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Nome completo"
          required
          value={form.nome}
          onChange={(e) => up('nome', e.target.value)}
          placeholder="Seu nome"
        />
        <Input
          label="E-mail"
          type="email"
          required
          value={form.email}
          onChange={(e) => up('email', e.target.value)}
          error={erros.email}
          placeholder="voce@email.com"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="CPF"
            required
            value={form.cpf}
            onChange={(e) => up('cpf', mascaraCPF(e.target.value))}
            error={erros.cpf}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
          <Input
            label="Telefone"
            value={form.telefone}
            onChange={(e) => up('telefone', mascaraTelefone(e.target.value))}
            placeholder="(11) 90000-0000"
            inputMode="numeric"
          />
        </div>
        <div>
          <Input
            label="Senha"
            type="password"
            required
            value={form.senha}
            onChange={(e) => up('senha', e.target.value)}
            placeholder="••••••••"
          />
          {form.senha && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < senhaForca.pontos ? corForca(senhaForca.pontos) : 'bg-ceres-sand-soft'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-ceres-muted">Força: {senhaForca.rotulo}</p>
            </div>
          )}
        </div>
        <Input
          label="Confirmar senha"
          type="password"
          required
          value={form.confirmarSenha}
          onChange={(e) => up('confirmarSenha', e.target.value)}
          error={erros.confirmarSenha}
          placeholder="••••••••"
        />

        <label className="flex items-start gap-2 text-sm text-ceres-muted">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ceres-terracotta-dark"
          />
          <span>
            Li e aceito os{' '}
            <Link href="/politica-de-privacidade" className="text-ceres-terracotta-dark underline">
              termos e a política de privacidade
            </Link>
            .
          </span>
        </label>

        <Button type="submit" loading={carregando} disabled={!formValido} className="w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ceres-muted">
        Já tem conta?{' '}
        <Link href="/login" className="font-semibold text-ceres-terracotta-dark hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}

function corForca(pontos: number): string {
  if (pontos <= 1) return 'bg-red-500';
  if (pontos === 2) return 'bg-yellow-500';
  if (pontos === 3) return 'bg-ceres-terracotta';
  return 'bg-green-600';
}
