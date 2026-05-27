import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js 16 renomeou "middleware" para "proxy". Mesmo comportamento — roda antes
 * de cada request, da pra modificar resposta, fazer redirect, ler/escrever cookies.
 *
 * Aqui usamos para:
 * 1. Manter a sessao do Supabase viva (refresh do token)
 * 2. Proteger /admin/* — requer login + flag de admin
 * 3. Proteger /loja/b2b/* — requer login
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protege /admin/* — login + flag admin (tabela criada na Sprint 1.3)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!admin) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch {
      // Tabela 'admins' ainda nao existe (criada na Sprint 1.3)
    }
  }

  // Protege /loja/b2b/* — DESATIVADO ate Sprint 3 (sem /login ainda).
  // Quando o fluxo de auth existir, descomentar abaixo:
  // if (pathname.startsWith('/loja/b2b')) {
  //   if (!user) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/login';
  //     url.searchParams.set('redirect', pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
