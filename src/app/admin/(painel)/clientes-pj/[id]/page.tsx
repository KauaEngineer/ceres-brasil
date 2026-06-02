import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AcoesEmpresa } from '@/components/admin/AcoesEmpresa';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { formatarData, formatarPreco, STATUS_INFO, type StatusPedido } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Empresa — Admin' };

const STATUS_LABELS = {
  pendente: 'Pendente',
  aprovado: 'Aprovada',
  rejeitado: 'Rejeitada',
} as const;

const STATUS_CLASSES = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
} as const;

interface Endereco {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
}

export default async function EmpresaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: empresa } = await supabase
    .from('empresas')
    .select('*, profiles(nome, telefone)')
    .eq('id', id)
    .maybeSingle();

  if (!empresa) notFound();

  const profile = Array.isArray(empresa.profiles) ? empresa.profiles[0] : empresa.profiles;
  const status = empresa.status as 'pendente' | 'aprovado' | 'rejeitado';
  const endereco = (empresa.endereco ?? {}) as Endereco;

  // Histórico de pedidos B2B do cliente
  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('id, status, total, criado_em')
    .eq('profile_id', empresa.profile_id)
    .eq('tipo', 'pj')
    .order('criado_em', { ascending: false })
    .limit(20);

  // Signed URLs pros documentos (admin client p/ acessar bucket privado)
  const admin = createAdminClient();
  const docs = (empresa.documentos_url ?? []) as string[];
  const documentosAssinados = await Promise.all(
    docs.map(async (path) => {
      const { data } = await admin.storage.from('documentos-pj').createSignedUrl(path, 3600);
      return { path, url: data?.signedUrl, nome: path.split('/').pop() ?? path };
    }),
  );

  return (
    <div className="space-y-6">
      <Link href="/admin/clientes-pj" className="text-sm text-ceres-muted hover:text-ceres-terracotta-dark">
        ← Voltar
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
          {empresa.razao_social}
        </h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Ações */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4">
        <AcoesEmpresa empresaId={empresa.id} status={status} />
        {status === 'rejeitado' && empresa.motivo_rejeicao && (
          <p className="mt-3 text-sm text-red-700">
            <strong>Motivo da rejeição:</strong> {empresa.motivo_rejeicao}
          </p>
        )}
        {status === 'aprovado' && empresa.aprovado_em && (
          <p className="mt-3 text-sm text-green-700">
            Aprovada em {formatarData(empresa.aprovado_em)}
          </p>
        )}
      </div>

      {/* Dados da empresa + responsável */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
            Dados da empresa
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-ceres-muted">CNPJ</dt>
              <dd className="font-mono text-ceres-dark">{empresa.cnpj}</dd>
            </div>
            {empresa.inscricao_estadual && (
              <div>
                <dt className="text-xs text-ceres-muted">Inscrição estadual</dt>
                <dd className="text-ceres-dark">{empresa.inscricao_estadual}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-ceres-muted">Solicitado em</dt>
              <dd className="text-ceres-dark">{formatarData(empresa.criado_em)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
            Responsável
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-xs text-ceres-muted">Nome</dt>
              <dd className="text-ceres-dark">{profile?.nome ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ceres-muted">Telefone</dt>
              <dd className="text-ceres-dark">{profile?.telefone ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Endereço */}
      {endereco.logradouro && (
        <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
            Endereço comercial
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ceres-dark">
            {endereco.logradouro}, {endereco.numero}
            <br />
            {endereco.bairro ? `${endereco.bairro}, ` : ''}
            {endereco.cidade} / {endereco.uf} · CEP {endereco.cep}
          </p>
        </div>
      )}

      {/* Documentos */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Documentos
        </h2>
        {documentosAssinados.length === 0 ? (
          <p className="mt-3 text-sm text-ceres-muted">Nenhum documento enviado.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {documentosAssinados.map((d) => (
              <li key={d.path}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ceres-terracotta-dark hover:underline"
                >
                  📄 {d.nome}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-ceres-muted">
          Links válidos por 1 hora (URL assinada).
        </p>
      </div>

      {/* Histórico de pedidos */}
      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Histórico de pedidos B2B
        </h2>
        {!pedidos || pedidos.length === 0 ? (
          <p className="mt-3 text-sm text-ceres-muted">Nenhum pedido ainda.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ceres-sand-soft">
            {pedidos.map((p) => {
              const info = STATUS_INFO[p.status as StatusPedido];
              return (
                <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <Link
                    href={`/admin/pedidos/${p.id}`}
                    className="font-medium text-ceres-dark hover:text-ceres-terracotta-dark"
                  >
                    #{p.id.slice(0, 8)}
                  </Link>
                  <span className="text-ceres-muted">{formatarData(p.criado_em)}</span>
                  <span className="font-medium">{formatarPreco(Number(p.total))}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${info?.classe ?? ''}`}>
                    {info?.rotulo ?? p.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
