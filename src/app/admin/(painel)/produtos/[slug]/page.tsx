import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buscarProdutoPorSlug } from '@/lib/mock/produtos';
import { formatarPreco } from '@/lib/utils/pedido';

export const metadata: Metadata = { title: 'Produto — Admin' };

export default async function AdminProdutoDetalhe({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produto = buscarProdutoPorSlug(slug);
  if (!produto) notFound();

  const t = produto.tabelaNutricional;

  return (
    <div className="space-y-6">
      <Link href="/admin/produtos" className="text-sm text-ceres-muted hover:text-ceres-terracotta-dark">
        ← Voltar
      </Link>

      <div className="rounded-2xl bg-ceres-sand-soft/40 p-4 text-xs text-ceres-muted">
        💡 Edição em tempo real será habilitada quando o Bling estiver integrado.
      </div>

      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">
        {produto.nome}
      </h1>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="relative aspect-square rounded-2xl border border-ceres-terracotta-dark/15 bg-white">
          <Image src={produto.fotos[0] ?? '/produto-exemplo.png'} alt="" fill sizes="260px" className="object-contain p-4" />
        </div>

        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <Linha rotulo="Slug" valor={produto.slug} />
          <Linha rotulo="Categoria" valor={produto.categoria} />
          <Linha rotulo="Preço PF" valor={formatarPreco(produto.precoB2C)} />
          <Linha rotulo="Preço PJ" valor={produto.precoB2B ? formatarPreco(produto.precoB2B) : '—'} />
          <Linha rotulo="Estoque" valor={String(produto.estoque)} />
          <Linha rotulo="Peso" valor={`${produto.pesoGramas} g`} />
          <Linha rotulo="Ativo" valor={produto.ativo ? 'Sim' : 'Não'} />
          <Linha
            rotulo="Atributos"
            valor={[
              produto.semGluten && 'Sem glúten',
              produto.vegano && 'Vegano',
              produto.semLactose && 'Sem lactose',
            ]
              .filter(Boolean)
              .join(' · ')}
          />
        </dl>
      </div>

      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">Descrição</h2>
        <p className="mt-3 text-sm leading-relaxed text-ceres-dark">{produto.descricao}</p>
        {produto.descricaoLonga && (
          <p className="mt-3 text-sm leading-relaxed text-ceres-muted">{produto.descricaoLonga}</p>
        )}
      </div>

      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Ingredientes
        </h2>
        <p className="mt-2 text-sm text-ceres-dark">{produto.ingredientes.join(', ')}.</p>
      </div>

      <div className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-muted">
          Tabela nutricional
        </h2>
        <p className="mt-2 text-xs text-ceres-muted">Porção: {t.porcao}</p>
        <table className="mt-4 w-full text-left text-sm">
          <tbody className="divide-y divide-ceres-sand-soft">
            <Nutri rotulo="Valor energético" valor={`${t.calorias} kcal`} />
            <Nutri rotulo="Carboidratos" valor={`${t.carboidratos} g`} />
            <Nutri rotulo="Proteínas" valor={`${t.proteinas} g`} />
            <Nutri rotulo="Gorduras totais" valor={`${t.gorduras} g`} />
            {t.gordurasSaturadas != null && (
              <Nutri rotulo="Gorduras saturadas" valor={`${t.gordurasSaturadas} g`} />
            )}
            <Nutri rotulo="Fibras" valor={`${t.fibras} g`} />
            <Nutri rotulo="Sódio" valor={`${t.sodio} mg`} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-ceres-terracotta-dark/10 bg-white p-3">
      <dt className="text-xs uppercase tracking-wider text-ceres-muted">{rotulo}</dt>
      <dd className="mt-1 text-ceres-dark">{valor || '—'}</dd>
    </div>
  );
}

function Nutri({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <tr>
      <td className="py-2 text-ceres-dark">{rotulo}</td>
      <td className="py-2 text-right font-medium text-ceres-dark">{valor}</td>
    </tr>
  );
}
