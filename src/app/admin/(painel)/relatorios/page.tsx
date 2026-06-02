import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarPreco } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Relatórios — Admin' };

interface SearchParams {
  de?: string;
  ate?: string;
}

interface PedidoRel {
  id: string;
  status: string;
  tipo: string;
  total: number | string;
  criado_em: string;
}

interface ItemRel {
  produto_nome: string | null;
  quantidade: number;
  preco_unitario: number | string;
}

function dataPadrao() {
  const ate = new Date();
  const de = new Date();
  de.setDate(de.getDate() - 29); // últimos 30 dias
  return { de: de.toISOString().slice(0, 10), ate: ate.toISOString().slice(0, 10) };
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const padrao = dataPadrao();
  const de = sp.de ?? padrao.de;
  const ate = sp.ate ?? padrao.ate;

  const fim = new Date(ate);
  fim.setDate(fim.getDate() + 1);

  const supabase = await createClient();

  const [{ data: pedidosData }, { data: itensData }, { data: profilesData }, { data: empresasData }] =
    await Promise.all([
      supabase
        .from('pedidos')
        .select('id, status, tipo, total, criado_em')
        .gte('criado_em', de)
        .lt('criado_em', fim.toISOString()),
      supabase
        .from('itens_pedido')
        .select('produto_nome, quantidade, preco_unitario, pedidos!inner(criado_em)')
        .gte('pedidos.criado_em', de)
        .lt('pedidos.criado_em', fim.toISOString()),
      supabase.from('profiles').select('id, tipo'),
      supabase.from('empresas').select('id, status'),
    ]);

  const pedidos = ((pedidosData ?? []) as PedidoRel[]).filter((p) => p.status !== 'cancelado');
  const totalVendido = pedidos.reduce((s, p) => s + Number(p.total), 0);
  const ticketMedio = pedidos.length > 0 ? totalVendido / pedidos.length : 0;
  const receitaB2C = pedidos.filter((p) => p.tipo === 'pf').reduce((s, p) => s + Number(p.total), 0);
  const receitaB2B = pedidos.filter((p) => p.tipo === 'pj').reduce((s, p) => s + Number(p.total), 0);

  // Top 5 produtos por receita
  const itens = (itensData ?? []) as ItemRel[];
  const porProduto = new Map<string, { quantidade: number; receita: number }>();
  for (const it of itens) {
    const nome = it.produto_nome ?? 'Produto';
    const atual = porProduto.get(nome) ?? { quantidade: 0, receita: 0 };
    atual.quantidade += it.quantidade;
    atual.receita += Number(it.preco_unitario) * it.quantidade;
    porProduto.set(nome, atual);
  }
  const topProdutos = [...porProduto.entries()]
    .sort((a, b) => b[1].receita - a[1].receita)
    .slice(0, 5);
  const maxReceita = Math.max(...topProdutos.map((p) => p[1].receita), 1);

  // Clientes
  const profiles = (profilesData ?? []) as { tipo: string }[];
  const empresas = (empresasData ?? []) as { status: string }[];

  const cards = [
    { rotulo: 'Total vendido', valor: formatarPreco(totalVendido) },
    { rotulo: 'Pedidos', valor: String(pedidos.length) },
    { rotulo: 'Ticket médio', valor: formatarPreco(ticketMedio) },
    {
      rotulo: 'B2C / B2B',
      valor: `${pedidos.filter((p) => p.tipo === 'pf').length} / ${pedidos.filter((p) => p.tipo === 'pj').length}`,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Relatórios</h1>

      {/* Filtro de período */}
      <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4">
        <label className="text-sm">
          <span className="block text-xs text-ceres-muted">De</span>
          <input type="date" name="de" defaultValue={de} className="mt-1 rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          <span className="block text-xs text-ceres-muted">Até</span>
          <input type="date" name="ate" defaultValue={ate} className="mt-1 rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="rounded-lg bg-ceres-dark px-4 py-2 text-sm font-medium text-white">
          Aplicar
        </button>
        <Link
          href={`/api/admin/pedidos/export?de=${de}&ate=${ate}`}
          className="ml-auto rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white hover:bg-ceres-terracotta"
        >
          Exportar CSV
        </Link>
      </form>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.rotulo} className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ceres-muted">{c.rotulo}</p>
            <p className="mt-2 text-2xl font-light text-ceres-dark">{c.valor}</p>
          </div>
        ))}
      </div>

      {/* B2C vs B2B */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Receita B2C vs B2B
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-ceres-muted">B2C (Pessoa Física)</p>
            <p className="text-2xl font-light text-ceres-dark">{formatarPreco(receitaB2C)}</p>
            <Barra valor={receitaB2C} maximo={Math.max(receitaB2C, receitaB2B, 1)} cor="bg-ceres-terracotta-dark" />
          </div>
          <div>
            <p className="text-xs text-ceres-muted">B2B (Revendedores)</p>
            <p className="text-2xl font-light text-ceres-dark">{formatarPreco(receitaB2B)}</p>
            <Barra valor={receitaB2B} maximo={Math.max(receitaB2C, receitaB2B, 1)} cor="bg-ceres-gold" />
          </div>
        </div>
      </div>

      {/* Top produtos */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Top 5 produtos (por receita)
        </h2>
        {topProdutos.length === 0 ? (
          <p className="mt-3 text-sm text-ceres-muted">Sem dados no período.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {topProdutos.map(([nome, info], i) => (
              <li key={nome} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-ceres-dark">
                    {i + 1}. {nome}
                  </span>
                  <span className="text-ceres-muted">
                    {info.quantidade} un · {formatarPreco(info.receita)}
                  </span>
                </div>
                <Barra valor={info.receita} maximo={maxReceita} cor="bg-ceres-terracotta-dark" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clientes */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">Clientes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Mini rotulo="Total cadastrados" valor={String(profiles.length)} />
          <Mini rotulo="PF" valor={String(profiles.filter((p) => p.tipo === 'pf').length)} />
          <Mini
            rotulo="PJ aprovadas"
            valor={String(empresas.filter((e) => e.status === 'aprovado').length)}
          />
          <Mini
            rotulo="PJ aguardando"
            valor={String(empresas.filter((e) => e.status === 'pendente').length)}
          />
        </div>
      </div>
    </div>
  );
}

function Barra({ valor, maximo, cor }: { valor: number; maximo: number; cor: string }) {
  const pct = Math.max((valor / maximo) * 100, 2);
  return (
    <div className="mt-2 h-2 w-full rounded-full bg-ceres-sand-soft">
      <div className={`h-2 rounded-full ${cor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Mini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-ceres-terracotta-dark/10 bg-ceres-cream/50 p-3">
      <p className="text-xs text-ceres-muted">{rotulo}</p>
      <p className="mt-1 text-xl font-medium text-ceres-dark">{valor}</p>
    </div>
  );
}
