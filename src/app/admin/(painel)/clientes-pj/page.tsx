import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatarData } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Clientes PJ — Admin' };

type StatusEmpresa = 'pendente' | 'aprovado' | 'rejeitado';

const TABS: { slug: StatusEmpresa; rotulo: string }[] = [
  { slug: 'pendente', rotulo: 'Pendentes' },
  { slug: 'aprovado', rotulo: 'Aprovados' },
  { slug: 'rejeitado', rotulo: 'Rejeitados' },
];

interface SearchParams {
  status?: string;
  busca?: string;
}

interface ProfileLite {
  nome: string | null;
}

interface EmpresaRow {
  id: string;
  razao_social: string;
  cnpj: string;
  status: StatusEmpresa;
  criado_em: string;
  profiles: ProfileLite | ProfileLite[] | null;
}

export default async function ClientesPJPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const statusAtivo = (sp.status as StatusEmpresa) ?? 'pendente';

  const supabase = await createClient();
  let q = supabase
    .from('empresas')
    .select('id, razao_social, cnpj, status, criado_em, profiles(nome)')
    .eq('status', statusAtivo)
    .order('criado_em', { ascending: false });

  if (sp.busca) {
    q = q.or(`razao_social.ilike.%${sp.busca}%,cnpj.ilike.%${sp.busca}%`);
  }

  const { data } = await q;
  const empresas = (data ?? []) as EmpresaRow[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
        Clientes PJ
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-ceres-terracotta-dark/15">
        {TABS.map((t) => (
          <Link
            key={t.slug}
            href={`/admin/clientes-pj?status=${t.slug}`}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              statusAtivo === t.slug
                ? 'border-ceres-terracotta-dark text-ceres-terracotta-dark'
                : 'border-transparent text-ceres-muted hover:text-ceres-dark'
            }`}
          >
            {t.rotulo}
          </Link>
        ))}
      </div>

      {/* Busca */}
      <form className="flex gap-2 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-3">
        <input type="hidden" name="status" value={statusAtivo} />
        <input
          type="text"
          name="busca"
          placeholder="Buscar razão social ou CNPJ…"
          defaultValue={sp.busca ?? ''}
          className="flex-1 rounded-lg border border-ceres-sand-soft bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-ceres-dark px-4 py-2 text-sm font-medium text-white"
        >
          Buscar
        </button>
      </form>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-2xl border border-ceres-terracotta-dark/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ceres-sand-soft/40 text-xs uppercase tracking-wider text-ceres-muted">
            <tr>
              <th className="px-4 py-3">Razão social</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Solicitado em</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ceres-sand-soft">
            {empresas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ceres-muted">
                  Nenhuma empresa nesta categoria.
                </td>
              </tr>
            ) : (
              empresas.map((e) => {
                const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;
                return (
                  <tr key={e.id} className="hover:bg-ceres-sand-soft/30">
                    <td className="px-4 py-3 font-medium text-ceres-dark">{e.razao_social}</td>
                    <td className="px-4 py-3 font-mono text-xs">{e.cnpj}</td>
                    <td className="px-4 py-3 text-ceres-muted">{profile?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-ceres-muted">{formatarData(e.criado_em)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/clientes-pj/${e.id}`}
                        className="text-sm font-medium text-ceres-terracotta-dark hover:underline"
                      >
                        Analisar
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
