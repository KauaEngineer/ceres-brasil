import 'server-only';
import { createClient } from '@/lib/supabase/server';

export interface DashboardStats {
  pedidosHoje: number;
  receitaHoje: number;
  pedidosPendentes: number;
  pjAguardando: number;
  vendas7dias: { dia: string; total: number }[];
  ultimosPedidos: {
    id: string;
    status: string;
    total: number;
    criado_em: string;
  }[];
}

/**
 * Reúne todas as métricas do dashboard admin numa só passada.
 * Admin vê todos os pedidos/empresas (RLS permite via is_admin).
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const inicioHoje = new Date();
  inicioHoje.setHours(0, 0, 0, 0);

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
  seteDiasAtras.setHours(0, 0, 0, 0);

  const [{ data: pedidos }, { data: empresas }] = await Promise.all([
    supabase.from('pedidos').select('id, status, total, criado_em').order('criado_em', { ascending: false }),
    supabase.from('empresas').select('id, status'),
  ]);

  const todosPedidos = pedidos ?? [];
  const pagos = todosPedidos.filter((p) => p.status !== 'cancelado');

  const pedidosHoje = pagos.filter((p) => new Date(p.criado_em) >= inicioHoje);
  const receitaHoje = pedidosHoje.reduce((s, p) => s + Number(p.total), 0);

  // Vendas dos últimos 7 dias (inclusive hoje)
  const vendas7dias: { dia: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const fim = new Date(d);
    fim.setDate(fim.getDate() + 1);
    const total = pagos
      .filter((p) => {
        const data = new Date(p.criado_em);
        return data >= d && data < fim;
      })
      .reduce((s, p) => s + Number(p.total), 0);
    vendas7dias.push({ dia: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), total });
  }

  return {
    pedidosHoje: pedidosHoje.length,
    receitaHoje,
    pedidosPendentes: todosPedidos.filter((p) => p.status === 'pendente').length,
    pjAguardando: (empresas ?? []).filter((e) => e.status === 'pendente').length,
    vendas7dias,
    ultimosPedidos: todosPedidos.slice(0, 5),
  };
}
