import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type RequireAdminResult =
  | { ok: true; userId: string }
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

  return { ok: true, userId: user.id };
}
