import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Finaliza o cadastro PJ: faz upload dos documentos no Storage e cria o
 * registro em empresas com status='pendente'. Roda com service role
 * (ignora RLS) — funciona mesmo antes da confirmação de e-mail.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const userId = form.get('userId')?.toString();
  const razaoSocial = form.get('razaoSocial')?.toString();
  const cnpj = form.get('cnpj')?.toString();
  const inscricaoEstadual = form.get('inscricaoEstadual')?.toString() || null;
  const enderecoRaw = form.get('endereco')?.toString();
  const cartao = form.get('cartaoCnpj') as File | null;
  const contrato = form.get('contratoSocial') as File | null;

  if (!userId || !razaoSocial || !cnpj || !enderecoRaw) {
    return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 });
  }

  // Valida arquivos (PDF, até 5MB)
  for (const [nome, file] of [
    ['Cartão CNPJ', cartao],
    ['Contrato Social', contrato],
  ] as const) {
    if (!file) {
      return NextResponse.json({ error: `${nome} é obrigatório.` }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: `${nome} precisa ser PDF.` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `${nome} excede 5MB.` }, { status: 400 });
    }
  }

  const admin = createAdminClient();

  // Upload dos documentos
  const documentos: string[] = [];
  for (const [slug, file] of [
    ['cartao-cnpj', cartao!],
    ['contrato-social', contrato!],
  ] as const) {
    const path = `${userId}/${slug}.pdf`;
    const { error } = await admin.storage
      .from('documentos-pj')
      .upload(path, file, { contentType: 'application/pdf', upsert: true });
    if (error) {
      return NextResponse.json(
        { error: `Falha no upload (${slug}): ${error.message}` },
        { status: 500 },
      );
    }
    documentos.push(path);
  }

  // Cria a empresa (status pendente)
  const { error: insertError } = await admin.from('empresas').insert({
    profile_id: userId,
    razao_social: razaoSocial,
    cnpj,
    inscricao_estadual: inscricaoEstadual,
    endereco: JSON.parse(enderecoRaw),
    documentos_url: documentos,
    status: 'pendente',
  });

  if (insertError) {
    return NextResponse.json(
      { error: `Falha ao registrar empresa: ${insertError.message}` },
      { status: 500 },
    );
  }

  // TODO Sprint 8: enviar e-mail de confirmação ao cliente + notificação ao admin (Resend)

  return NextResponse.json({ ok: true });
}
