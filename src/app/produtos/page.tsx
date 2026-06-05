import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FiltroCategorias } from '@/components/produtos/FiltroCategorias';
import { ProductCard } from '@/components/produtos/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { listarProdutos } from '@/lib/mock/produtos';
import { CATEGORIAS, type CategoriaProduto } from '@/types/produto';

export const metadata: Metadata = {
  title: 'Produtos',
  description:
    'Catálogo completo da Ceres Brasil — massas, farinhas e grãos sem glúten. Frete para todo o Brasil.',
};

function ehCategoriaValida(s: string | undefined): s is CategoriaProduto {
  return !!s && CATEGORIAS.some((c) => c.slug === s);
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  // Next.js 16: searchParams e async
  const { categoria } = await searchParams;
  const filtrarPor = ehCategoriaValida(categoria) ? categoria : undefined;
  const produtos = listarProdutos(filtrarPor);

  const categoriaInfo = CATEGORIAS.find((c) => c.slug === filtrarPor);

  return (
    <div className="container-ceres py-12 md:py-16">
      <SectionTitle
        eyebrow="Catálogo"
        title={categoriaInfo ? categoriaInfo.rotuloPlural : 'Todos os produtos'}
        description="Selecione uma categoria ou explore o catálogo completo."
        align="left"
      />

      <div className="mt-8">
        <Suspense fallback={<div className="h-10" />}>
          <FiltroCategorias />
        </Suspense>
      </div>

      {produtos.length === 0 ? (
        <p className="mt-16 text-center text-ceres-muted">
          Nenhum produto encontrado nessa categoria.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {produtos.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
