'use client';

import { createClient } from '@/lib/supabase/client';

export interface DadosCadastroPF {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface DadosContaPJ {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

/**
 * Cria o usuário PJ no Supabase Auth. O trigger handle_new_user cria o profile
 * com tipo='pj'. A criação da empresa + upload de documentos acontece depois,
 * via /api/cadastro-pj (service role).
 */
export async function signUpPJ({ nome, email, senha, telefone }: DadosContaPJ) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, tipo: 'pj', telefone: telefone ?? null },
      emailRedirectTo: `${window.location.origin}/aguardando-aprovacao`,
    },
  });
}

/** Login com e-mail e senha. */
export async function signIn(email: string, senha: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password: senha });
}

/**
 * Cadastro de Pessoa Física. Os metadados (nome, tipo, telefone) sao lidos
 * pelo trigger handle_new_user() que cria o registro em profiles.
 */
export async function signUpPF({ nome, email, senha, telefone }: DadosCadastroPF) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, tipo: 'pf', telefone: telefone ?? null },
      emailRedirectTo: `${window.location.origin}/conta`,
    },
  });
}

/** Login social com Google (requer provider configurado no Supabase). */
export async function signInGoogle() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/conta` },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

/** Envia e-mail com link para redefinir senha. */
export async function resetPassword(email: string) {
  const supabase = createClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nova-senha`,
  });
}

/** Define nova senha (usado na página /nova-senha apos clicar no link do e-mail). */
export async function updatePassword(novaSenha: string) {
  const supabase = createClient();
  return supabase.auth.updateUser({ password: novaSenha });
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
