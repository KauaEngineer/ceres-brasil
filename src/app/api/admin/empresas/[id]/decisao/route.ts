import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.mensagem }, { status: guard.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const decisao = body?.decisao as 'aprovar' | 'rejeitar' | undefined;
  const motivo = typeof body?.motivo === 'string' ? body.motivo : null;

  if (decisao !== 'aprovar' && decisao !== 'rejeitar') {
    return NextResponse.json({ error: 'Decisão inválida.' }, { status: 400 });
  }
  if (decisao === 'rejeitar' && !motivo) {
    return NextResponse.json({ error: 'Motivo obrigatório ao rejeitar.' }, { status: 400 });
  }

  const supabase = await createClient();
  const update =
    decisao === 'aprovar'
      ? { status: 'aprovado' as const, aprovado_em: new Date().toISOString(), motivo_rejeicao: null }
      : { status: 'rejeitado' as const, motivo_rejeicao: motivo };

  const { error } = await supabase.from('empresas').update(update).eq('id', id);
  if (error) {
    return NextResponse.json({ error: `Falha: ${error.message}` }, { status: 500 });
  }

  // TODO Sprint 8: enviar e-mail ao cliente (aprovação ou rejeição com motivo) via Resend
  return NextResponse.json({ ok: true });
}
