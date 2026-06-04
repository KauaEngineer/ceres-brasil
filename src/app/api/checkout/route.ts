import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ItemCheckout {
  nome: string;
  slug: string;
  preco: number;
  quantidade: number;
}

/**
 * Cria o pedido + itens no banco. Requer login (RLS: o usuário só cria
 * pedido para si). Pagamento é SIMULADO nesta versão (status 'pago' direto).
 * Quando o Mercado Pago for integrado, o status nasce 'pendente' e vira
 * 'pago' via webhook.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Faça login para finalizar.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.itens?.length || !body.endereco || !body.frete) {
    return NextResponse.json({ error: 'Dados do pedido incompletos.' }, { status: 400 });
  }

  const itens = body.itens as ItemCheckout[];
  const subtotal = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const freteValor = Number(body.frete.valor) || 0;
  const total = subtotal + freteValor;

  const ehB2B = body.modo === 'b2b';

  // Pedido de revenda só é aceito se o usuário tiver empresa APROVADA.
  // Checagem no servidor — não confiamos no que o cliente mandou no body.
  if (ehB2B) {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('profile_id', user.id)
      .eq('status', 'aprovado')
      .maybeSingle();

    if (!empresa) {
      return NextResponse.json(
        { error: 'Pedido de revenda exige cadastro PJ aprovado.' },
        { status: 403 },
      );
    }
  }

  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert({
      profile_id: user.id,
      tipo: ehB2B ? 'pj' : 'pf',
      status: 'pago', // simulado — viraria 'pendente' com gateway real
      total,
      endereco_entrega: body.endereco,
      frete_valor: freteValor,
      frete_prazo: body.frete.prazoDias ?? null,
      pagamento_id: `SIMULADO-${body.pagamento ?? 'pix'}-${Date.now()}`,
    })
    .select('id')
    .single();

  if (error || !pedido) {
    return NextResponse.json(
      { error: `Falha ao criar pedido: ${error?.message ?? 'desconhecido'}` },
      { status: 500 },
    );
  }

  const itensInsert = itens.map((i) => ({
    pedido_id: pedido.id,
    produto_id: null, // mock não está na tabela produtos; usamos snapshot
    produto_nome: i.nome,
    produto_slug: i.slug,
    quantidade: i.quantidade,
    preco_unitario: i.preco,
  }));

  const { error: itensError } = await supabase.from('itens_pedido').insert(itensInsert);
  if (itensError) {
    return NextResponse.json({ error: `Falha nos itens: ${itensError.message}` }, { status: 500 });
  }

  return NextResponse.json({ id: pedido.id });
}
