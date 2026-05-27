import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com SERVICE ROLE — ignora RLS. SÓ pode ser usado em código
 * de servidor (route handlers, server actions). O import 'server-only' garante
 * que ele nunca vá pro bundle do cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
