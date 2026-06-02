import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';

interface ProfileLite {
  nome: string | null;
}

interface PedidoExport {
  id: string;
  status: string;
  tipo: string;
  total: number | string;
  frete_valor: number | string | null;
  criado_em: string;
  profiles: ProfileLite | ProfileLite[] | null;
}

function escapeCSV(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return new Response(guard.mensagem, { status: guard.status });
  }

  const sp = new URL(request.url).searchParams;
  const supabase = await createClient();

  let q = supabase
    .from('pedidos')
    .select('id, status, tipo, total, frete_valor, criado_em, profiles(nome)')
    .order('criado_em', { ascending: false })
    .limit(10000);

  if (sp.get('status')) q = q.eq('status', sp.get('status'));
  if (sp.get('tipo')) q = q.eq('tipo', sp.get('tipo'));
  if (sp.get('de')) q = q.gte('criado_em', sp.get('de')!);
  if (sp.get('ate')) {
    const fim = new Date(sp.get('ate')!);
    fim.setDate(fim.getDate() + 1);
    q = q.lt('criado_em', fim.toISOString());
  }
  if (sp.get('busca')) q = q.ilike('id', `${sp.get('busca')}%`);

  const { data, error } = await q;
  if (error) return new Response(error.message, { status: 500 });

  const linhas = ['ID,Cliente,Tipo,Data,Total,Frete,Status'];
  for (const p of (data ?? []) as PedidoExport[]) {
    const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    linhas.push(
      [
        p.id,
        profile?.nome ?? '',
        p.tipo === 'pj' ? 'B2B' : 'B2C',
        new Date(p.criado_em).toLocaleDateString('pt-BR'),
        Number(p.total).toFixed(2).replace('.', ','),
        Number(p.frete_valor ?? 0).toFixed(2).replace('.', ','),
        p.status,
      ]
        .map(escapeCSV)
        .join(','),
    );
  }

  const csv = linhas.join('\n');
  const filename = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
