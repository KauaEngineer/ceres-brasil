import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Conta de admin usada na demonstração pública. No modo demo o painel é
 * "somente leitura": dá pra navegar e ver tudo, mas as ações que alteram
 * dados ficam desativadas (no servidor e na tela). Em produção, com o admin
 * real do cliente, tudo funciona normalmente.
 */
export const EMAIL_ADMIN_DEMO = 'demo@ceresbrasil.com.br';

export function ehContaDemo(email?: string | null): boolean {
  return !!email && email.toLowerCase() === EMAIL_ADMIN_DEMO;
}

export type RequireAdminResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; status: 401 | 403; mensagem: string };

/**
 * Garante que o usuário logado é admin. Use no início de route handlers /api/admin/*.
 * Não lança — retorna um objeto que você pode usar pra montar a resposta.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, status: 401, mensagem: 'Não autenticado.' };

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!admin) return { ok: false, status: 403, mensagem: 'Acesso negado.' };

  return { ok: true, userId: user.id, email: user.email ?? null };
}

/** True se o admin logado é a conta de demonstração (painel somente leitura). */
export async function ehAdminDemo(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return ehContaDemo(user?.email);
}
