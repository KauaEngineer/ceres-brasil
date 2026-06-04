import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Reset dos dados de DEMONSTRAÇÃO. Como o painel admin fica aberto a visitantes,
 * alguém pode mexer nos dados demo (mudar status de pedido, rejeitar a empresa
 * demo). Esta rota restaura o estado limpo:
 *   1. apaga os pedidos das contas demo (itens caem em cascata)
 *   2. re-aprova a empresa do revendedor demo
 *
 * Chamada 1x/dia pelo Vercel Cron (ver vercel.json). Protegida por CRON_SECRET:
 * o Vercel envia automaticamente "Authorization: Bearer $CRON_SECRET" quando a
 * env CRON_SECRET existe. Sem o secret correto, responde 401.
 */
const DEMO_EMAILS = ['demo@ceresbrasil.com.br', 'demo-pj@ceresbrasil.com.br'];
const DEMO_PJ_EMAIL = 'demo-pj@ceresbrasil.com.br';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }
  }

  const admin = createAdminClient();

  // Mapeia e-mail → id das contas demo
  const { data: lista, error: errList } = await admin.auth.admin.listUsers();
  if (errList) {
    return NextResponse.json({ error: errList.message }, { status: 500 });
  }
  const demos = lista.users.filter((u) => u.email && DEMO_EMAILS.includes(u.email));
  const ids = demos.map((u) => u.id);
  const pjId = demos.find((u) => u.email === DEMO_PJ_EMAIL)?.id;

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Contas demo não encontradas.' }, { status: 404 });
  }

  // 1. Apaga os pedidos de teste das contas demo (itens_pedido cai em cascata)
  const { error: errPedidos } = await admin.from('pedidos').delete().in('profile_id', ids);
  if (errPedidos) {
    return NextResponse.json({ error: `Pedidos: ${errPedidos.message}` }, { status: 500 });
  }

  // 2. Garante a empresa do revendedor demo de volta como aprovada
  if (pjId) {
    await admin
      .from('empresas')
      .update({
        status: 'aprovado',
        motivo_rejeicao: null,
        aprovado_em: new Date().toISOString(),
      })
      .eq('profile_id', pjId);
  }

  return NextResponse.json({
    ok: true,
    resetadas: demos.map((u) => u.email),
    em: new Date().toISOString(),
  });
}
