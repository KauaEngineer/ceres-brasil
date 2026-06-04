import { NextResponse } from 'next/server';
import { ehContaDemo, requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';

const STATUS_VALIDOS = ['pendente', 'pago', 'em_separacao', 'enviado', 'entregue', 'cancelado'] as const;
type StatusValido = (typeof STATUS_VALIDOS)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.mensagem }, { status: guard.status });
  }
  if (ehContaDemo(guard.email)) {
    return NextResponse.json({ error: 'Ação indisponível na versão demo.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as StatusValido | undefined;

  if (!status || !STATUS_VALIDOS.includes(status)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
  }

  const supabase = await createClient();
  const update: Record<string, unknown> = { status };
  if (typeof body.bling_pedido_id === 'string' && body.bling_pedido_id) {
    update.bling_pedido_id = body.bling_pedido_id;
  }

  const { error } = await supabase.from('pedidos').update(update).eq('id', id);
  if (error) {
    return NextResponse.json({ error: `Falha ao atualizar: ${error.message}` }, { status: 500 });
  }

  // TODO Sprint 8: enviar e-mail ao cliente (em separação / enviado com rastreio / entregue) via Resend
  return NextResponse.json({ ok: true });
}
