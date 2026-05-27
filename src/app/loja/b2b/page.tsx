import type { Metadata } from 'next';
import Link from 'next/link';
import { B2BProductCard } from '@/components/produtos/B2BProductCard';
import { listarProdutos } from '@/lib/mock/produtos';
import { CATEGORIAS } from '@/types/produto';

export const metadata: Metadata = {
  title: 'Loja B2B — Catálogo de Revenda',
  description:
    'Catálogo exclusivo para revendedores Ceres Brasil. Preços sob consulta, caixas fechadas, suporte dedicado.',
};

export default function LojaB2BPage() {
  const produtos = listarProdutos();
  const porCategoria = CATEGORIAS.map((c) => ({
    info: c,
    itens: produtos.filter((p) => p.categoria === c.slug),
  }));

  return (
    <div className="bg-ceres-charcoal text-white">
      {/* Header da área B2B */}
      <section className="border-b border-white/10 bg-black/20 py-12 md:py-16">
        <div className="container-ceres flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
              Portal de revenda
            </p>
            <h1 className="mt-2 text-3xl font-light tracking-tight md:text-5xl">
              Catálogo B2B
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
              Caixas fechadas com 12 unidades. Preços negociados conforme volume.
            </p>
          </div>
          <Link
            href="/seja-revendedor"
            className="rounded-full border border-ceres-gold px-5 py-2.5 text-sm font-medium text-ceres-gold transition-colors hover:bg-ceres-gold hover:text-ceres-charcoal"
          >
            Quero ser revendedor
          </Link>
        </div>
      </section>

      {/* Aviso temporário (sem auth ainda) */}
      <section className="border-b border-white/10 bg-ceres-teal/10 py-3">
        <div className="container-ceres text-center text-xs text-white/70">
          ⚠️ Demo de portfólio. Em produção, esta área exige cadastro PJ aprovado (Sprint 3).
        </div>
      </section>

      {/* Catálogo por categoria */}
      <section className="container-ceres py-12 md:py-16">
        <div className="space-y-16">
          {porCategoria.map(({ info, itens }) => (
            <div key={info.slug}>
              <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-light tracking-tight md:text-3xl">
                  {info.rotuloPlural}
                </h2>
                <span className="text-xs text-white/50">
                  {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {itens.map((p) => (
                  <B2BProductCard key={p.id} produto={p} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA contato comercial */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-10 text-center md:p-16">
          <h3 className="text-2xl font-light md:text-3xl">Precisa de uma cotação personalizada?</h3>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Nosso comercial responde em até 1 dia útil com tabela de preços e condições.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/5511924771165?text=Ol%C3%A1!%20Tenho%20interesse%20em%20revenda%20Ceres%20Brasil."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ceres-teal px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-teal-dark"
            >
              WhatsApp comercial
            </a>
            <Link
              href="/contato"
              className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-ceres-gold hover:text-ceres-gold"
            >
              Formulário de contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
