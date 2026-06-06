import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Quem Somos',
  description:
    'Conheça a história, missão e valores da Ceres Brasil — alimentos naturais sem glúten produzidos com qualidade nutricional desde São Paulo.',
};

const numeros = [
  { valor: '+10', rotulo: 'anos no mercado' },
  { valor: '+5 mil', rotulo: 'clientes atendidos' },
  { valor: '24', rotulo: 'produtos no catálogo' },
  { valor: '100%', rotulo: 'sem glúten' },
];

const valores = [
  {
    icone: <LeafIcon />,
    titulo: 'Natural',
    texto:
      'Ingredientes selecionados e processos limpos. Sem aditivos artificiais, sem conservantes desnecessários.',
  },
  {
    icone: <HeartIcon />,
    titulo: 'Inclusivo',
    texto:
      'Comida boa é direito de todo mundo — inclusive de quem precisa evitar glúten por saúde ou escolha.',
  },
  {
    icone: <ShieldIcon />,
    titulo: 'Confiável',
    texto:
      'Tabelas nutricionais transparentes, lotes rastreáveis e qualidade conferida em cada etapa da produção.',
  },
];

const etapas = [
  {
    icone: <BagIcon />,
    titulo: 'Pedido feito',
    texto: 'Você escolhe os produtos no site e finaliza pelo checkout — Pix, cartão ou boleto.',
  },
  {
    icone: <CheckListIcon />,
    titulo: 'Separação cuidadosa',
    texto: 'Cada pedido é conferido lote a lote antes de ser embalado para envio.',
  },
  {
    icone: <TruckIcon />,
    titulo: 'Envio em até 48h',
    texto: 'Despachamos para todo o Brasil pelos Correios ou transportadora parceira.',
  },
];

export default function QuemSomosPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ceres-terracotta-dark via-ceres-terracotta to-ceres-sand-soft" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-ceres relative py-24 md:py-32">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
              Quem somos
            </p>
            <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight drop-shadow-md md:text-6xl">
              Nossa história começa
              <br />
              numa cozinha de São Paulo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/95 drop-shadow md:text-xl">
              A Ceres Brasil nasceu pra provar que comida sem glúten pode — e deve — ser deliciosa,
              nutritiva e acessível.
            </p>
          </div>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="py-20 md:py-28">
        <div className="container-ceres grid items-start gap-12 md:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="História"
              title="Começou pequena, sempre quis fazer diferente."
              align="left"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ceres-muted md:text-lg">
              <p>
                A Ceres Brasil nasceu de um jeito simples: sem grandes planos, sem estrutura e sem
                imaginar onde aquilo poderia chegar. Tudo começou com uma ideia, vontade de
                empreender e MUITO esforço.
              </p>
              <p>
                Nossa primeira aposta foi uma massa sabor tradicional com farinha de grão de bico.
                Na época, a intenção não era criar um produto fitness, saudável ou sem glúten. A
                verdade é que nem sabíamos o potencial que aquele produto tinha. Aos poucos, fomos
                entendendo que estávamos oferecendo algo diferente: uma massa rica em proteínas,
                fonte de fibras e naturalmente sem glúten.
              </p>
              <p>
                O que começou de forma despretensiosa foi crescendo através da curiosidade, dos
                testes, dos erros e da vontade de fazer dar certo. Cada etapa foi construída na
                prática, aprendendo diariamente sobre ingredientes, processos e sobre o que
                realmente importa: entregar um produto de qualidade.
              </p>
              <p>
                Hoje, a Ceres Brasil produz massas, farinhas e grãos à base de leguminosas como
                grão de bico e lentilha, levando alimentação prática e nutritiva para consumidores
                em todo o Brasil. Mesmo com o crescimento, mantemos a mesma essência do começo:
                criar produtos com ingredientes de verdade, sem exageros e com cuidado em cada
                detalhe.
              </p>
              <p>
                Também abrimos espaço para parceiros e revendedores que acreditam nessa mesma
                visão. Porque mais do que vender alimentos, queremos construir uma marca que nasceu
                pequena, mas sempre teve vontade de fazer diferente.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-ceres-terracotta-dark/20 md:sticky md:top-28">
            <Image
              src="https://images.unsplash.com/photo-1447279506476-3faec8071eee?w=1200&q=80&auto=format&fit=crop"
              alt="Mãos preparando massa artesanal"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* PROPOSTA / VALORES */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="O que defendemos"
            title="Por que produtos sem glúten?"
            description="Não é só sobre intolerância — é sobre oferecer ingredientes nobres, com mais nutrientes por porção e menos peso no estômago."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {valores.map((v) => (
              <article
                key={v.titulo}
                className="rounded-2xl border border-ceres-sand-soft bg-ceres-cream p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ceres-terracotta-dark text-white">
                  {v.icone}
                </div>
                <h3 className="mt-5 text-xl font-medium text-ceres-dark">{v.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ceres-muted">{v.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="Números"
            title="Uma trajetória construída com cuidado"
            description="Cada número aqui representa famílias, refeições e parcerias que confiam na Ceres."
          />
          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
            {numeros.map((n) => (
              <div
                key={n.rotulo}
                className="rounded-2xl bg-white border border-ceres-sand-soft p-6 text-center"
              >
                <p className="text-4xl font-light text-ceres-dark md:text-5xl">{n.valor}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-ceres-muted">
                  {n.rotulo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METAS / VISÃO DE FUTURO */}
      <section className="bg-ceres-terracotta-dark py-20 text-white md:py-28">
        <div className="container-ceres grid items-start gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
              Para onde vamos
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
              Levar a Ceres a cada cozinha brasileira que valoriza o que come.
            </h2>
          </div>
          <ul className="space-y-5 text-base leading-relaxed text-white/90 md:text-lg">
            <li className="flex gap-3">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ceres-gold" />
              <span>Ampliar o catálogo com novas farinhas funcionais e mixes prontos.</span>
            </li>
            <li className="flex gap-3">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ceres-gold" />
              <span>Construir uma rede sólida de revendedores em todas as regiões.</span>
            </li>
            <li className="flex gap-3">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ceres-gold" />
              <span>Compartilhar receitas e educação alimentar de forma acessível.</span>
            </li>
            <li className="flex gap-3">
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-ceres-gold" />
              <span>Trabalhar com produtores locais sempre que possível.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="Processo"
            title="Como seu pedido chega até você"
            description="Simples, transparente e com cuidado em cada etapa."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {etapas.map((e, i) => (
              <article
                key={e.titulo}
                className="relative rounded-2xl border border-ceres-sand-soft bg-white p-8"
              >
                <span className="absolute right-6 top-6 text-5xl font-light text-ceres-sand-soft select-none">
                  {i + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ceres-terracotta-dark text-white">
                  {e.icone}
                </div>
                <h3 className="mt-5 text-xl font-medium text-ceres-dark">{e.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ceres-muted">{e.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="pb-24">
        <div className="container-ceres">
          <div className="rounded-3xl bg-ceres-gold-soft p-10 text-center md:p-16">
            <h2 className="text-3xl font-light text-ceres-dark md:text-4xl">
              Pronto pra experimentar?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-ceres-muted md:text-lg">
              Conheça nosso catálogo de massas, farinhas e grãos sem glúten.
            </p>
            <Link
              href="/produtos"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ceres-terracotta-dark px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Ver produtos
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- ícones inline ---------- */

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M17 8C8 10 5 16 3 21l1.5.5C8 15 11 13 17 12c-3 4-3 6-7 9 5 0 9-2 11-5 3-3 3-9 3-12-3 0-9 1-12 4"
        fill="currentColor"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 21s-7-4.5-9-9c-1-2 0-6 4-6 2 0 4 1 5 3 1-2 3-3 5-3 4 0 5 4 4 6-2 4.5-9 9-9 9z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12l5 5 9-11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
