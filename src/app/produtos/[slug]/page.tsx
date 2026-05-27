import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard, formatarPreco } from '@/components/produtos/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  buscarProdutoPorSlug,
  listarRelacionados,
  todosSlugs,
} from '@/lib/mock/produtos';

type Props = {
  params: Promise<{ slug: string }>;
};

// SSG — gera HTML estatico de todos os produtos no build
export async function generateStaticParams() {
  return todosSlugs().map((slug) => ({ slug }));
}

// SEO dinamico por produto
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = buscarProdutoPorSlug(slug);
  if (!produto) {
    return { title: 'Produto não encontrado' };
  }
  return {
    title: produto.nome,
    description: produto.descricao,
    openGraph: {
      title: produto.nome,
      description: produto.descricao,
      type: 'website',
    },
  };
}

export default async function ProdutoDetalhePage({ params }: Props) {
  const { slug } = await params;
  const produto = buscarProdutoPorSlug(slug);
  if (!produto) notFound();

  const relacionados = listarRelacionados(produto);
  const esgotado = produto.estoque <= 0;
  const t = produto.tabelaNutricional;

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-ceres pt-8">
        <nav className="text-xs text-ceres-muted" aria-label="Navegação">
          <Link href="/" className="hover:text-ceres-terracotta-dark">
            Início
          </Link>
          {' / '}
          <Link href="/produtos" className="hover:text-ceres-terracotta-dark">
            Produtos
          </Link>
          {' / '}
          <span className="text-ceres-dark">{produto.nome}</span>
        </nav>
      </div>

      {/* Detalhe principal */}
      <section className="container-ceres py-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Galeria (placeholder com gradiente — substituir por fotos reais na Sprint 4) */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-ceres-sand-soft via-ceres-cream to-ceres-gold-soft">
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ceres-terracotta-dark">
                Sem glúten
              </span>
              {esgotado && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white px-5 py-2 text-sm font-bold uppercase tracking-wider text-ceres-dark">
                    Esgotado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info + compra */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-ceres-gold">
              {categoriaRotulo(produto.categoria)}
            </p>
            <h1 className="mt-2 text-3xl font-light tracking-tight text-ceres-terracotta-dark md:text-4xl">
              {produto.nome}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {produto.semGluten && <Tag>Sem glúten</Tag>}
              {produto.vegano && <Tag>Vegano</Tag>}
              {produto.semLactose && <Tag>Sem lactose</Tag>}
            </div>

            <p className="mt-6 text-base leading-relaxed text-ceres-muted">{produto.descricao}</p>
            {produto.descricaoLonga && (
              <p className="mt-4 text-base leading-relaxed text-ceres-muted">
                {produto.descricaoLonga}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-ceres-sand-soft bg-white p-6">
              <p className="text-3xl font-light text-ceres-terracotta-dark md:text-4xl">
                {formatarPreco(produto.precoB2C)}
              </p>
              <p className="mt-1 text-xs text-ceres-muted">
                {esgotado ? 'Indisponível no momento' : `${produto.estoque} unidades em estoque`}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-full border border-ceres-sand-soft">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    disabled
                    className="px-4 py-2 text-ceres-muted hover:text-ceres-terracotta-dark disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold">1</span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    disabled
                    className="px-4 py-2 text-ceres-muted hover:text-ceres-terracotta-dark disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  disabled={esgotado}
                  className="flex-1 rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta disabled:cursor-not-allowed disabled:bg-ceres-muted disabled:opacity-60"
                >
                  {esgotado ? 'Indisponível' : 'Adicionar ao carrinho'}
                </button>
              </div>
              <p className="mt-3 text-xs text-ceres-muted">
                Seletor + carrinho serão plugados na Sprint 4.
              </p>
            </div>

            {/* Ingredientes */}
            {produto.ingredientes.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ceres-terracotta-dark">
                  Ingredientes
                </h2>
                <p className="mt-2 text-sm text-ceres-muted">{produto.ingredientes.join(', ')}.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabela nutricional */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-ceres max-w-3xl">
          <SectionTitle
            eyebrow="Informações nutricionais"
            title="Tabela nutricional"
            description={`Porção de referência: ${t.porcao}.`}
            align="left"
          />
          <div className="mt-8 overflow-hidden rounded-2xl border border-ceres-sand-soft">
            <table className="w-full text-left text-sm">
              <thead className="bg-ceres-sand-soft text-ceres-terracotta-dark">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nutriente</th>
                  <th className="px-5 py-3 text-right font-semibold">Quantidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ceres-sand-soft">
                <Linha label="Valor energético" valor={`${t.calorias} kcal`} />
                <Linha label="Carboidratos" valor={`${t.carboidratos} g`} />
                <Linha label="Proteínas" valor={`${t.proteinas} g`} />
                <Linha label="Gorduras totais" valor={`${t.gorduras} g`} />
                {t.gordurasSaturadas != null && (
                  <Linha label="Gorduras saturadas" valor={`${t.gordurasSaturadas} g`} />
                )}
                <Linha label="Fibras alimentares" valor={`${t.fibras} g`} />
                <Linha label="Sódio" valor={`${t.sodio} mg`} />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-ceres">
            <SectionTitle
              eyebrow="Você também pode gostar"
              title={`Outras opções em ${categoriaRotulo(produto.categoria)}`}
              align="left"
            />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relacionados.map((p) => (
                <ProductCard key={p.id} produto={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-ceres-sand-soft px-3 py-1 text-xs font-semibold text-ceres-terracotta-dark">
      {children}
    </span>
  );
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <tr>
      <td className="px-5 py-3 text-ceres-dark">{label}</td>
      <td className="px-5 py-3 text-right font-medium text-ceres-dark">{valor}</td>
    </tr>
  );
}

function categoriaRotulo(c: string) {
  if (c === 'massas') return 'Massas sem glúten';
  if (c === 'farinhas') return 'Farinhas';
  return 'Grãos e cereais';
}
