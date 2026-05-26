import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Le e escreve cookies para manter a sessao do usuario sincronizada com o servidor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignorado quando chamado de Server Component (sem permissao de escrita).
            // O middleware refresh-a a sessao em cada request, entao esta tudo bem.
          }
        },
      },
    },
  );
}
