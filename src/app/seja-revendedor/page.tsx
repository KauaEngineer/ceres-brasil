import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seja Revendedor',
  description:
    'Torne-se um revendedor Ceres Brasil. Preços de fábrica, suporte comercial dedicado e entrega para todo o país. Cadastre seu CNPJ.',
};

const beneficios = [
  {
    titulo: 'Preço de fábrica',
    texto: 'Até 30% abaixo do varejo. Sua margem é nossa prioridade.',
    icon: <TagIcon />,
  },
  {
    titulo: 'Suporte dedicado',
    texto: 'Um representante comercial pra cuidar do seu cadastro e dos seus pedidos.',
    icon: <HeadsetIcon />,
  },
  {
    titulo: 'Entrega prioritária',
    texto: 'Despacho em até 24h úteis e logística otimizada pra revendedores.',
    icon: <TruckIcon />,
  },
  {
    titulo: 'Material de divulgação',
    texto: 'Fotos, descrições e tabela nutricional prontas para usar.',
    icon: <ImageIcon />,
  },
];

const passos = [
  { numero: '01', titulo: 'Preencha o cadastro', texto: 'CNPJ, contato e dados da empresa.' },
  { numero: '02', titulo: 'Envie os documentos', texto: 'Cartão CNPJ + contrato social em PDF.' },
  { numero: '03', titulo: 'Aguarde a aprovação', texto: 'Resposta em até 2 dias úteis.' },
  { numero: '04', titulo: 'Faça seus pedidos', texto: 'Acesso liberado ao portal de revenda.' },
];

const faq = [
  {
    q: 'Qual o pedido mínimo inicial?',
    a: 'O pedido mínimo de abertura é de R$ 500. Pedidos subsequentes não têm valor mínimo.',
  },
  {
    q: 'Vocês atendem em todo o Brasil?',
    a: 'Sim — entregamos para todo o território nacional via transportadoras parceiras.',
  },
  {
    q: 'Posso revender em marketplaces?',
    a: 'Sim, desde que cumpra a política de preço sugerido para preservar a marca.',
  },
  {
    q: 'Quais formas de pagamento?',
    a: 'Pix à vista (com desconto), boleto bancário (à vista ou 30 dias para clientes aprovados).',
  },
];

export default function SejaRevendedorPage() {
  return (
    <div className="bg-ceres-charcoal text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ceres-charcoal via-ceres-terracotta-dark to-ceres-charcoal" />
        <div className="container-ceres relative py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ceres-gold">
              Portal de revenda
            </p>
            <h1 className="mt-5 text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Seja um revendedor
              <br />
              <span className="text-ceres-gold">Ceres Brasil.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
              Preço de fábrica, suporte humano e logística prioritária para quem leva nossos
              produtos pra mais gente.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/cadastro-pj"
                className="rounded-full bg-ceres-gold px-8 py-4 text-sm font-semibold text-ceres-charcoal transition-transform hover:scale-105"
              >
                Quero ser revendedor
              </Link>
              <Link
                href="/loja/b2b"
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-medium text-white transition-colors hover:border-ceres-gold hover:text-ceres-gold"
              >
                Ver catálogo de revenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20 md:py-28">
        <div className="container-ceres">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
              Por que revender
            </p>
            <h2 className="mt-3 text-3xl font-light leading-tight md:text-5xl">
              Mais que um fornecedor,
              <br />
              um parceiro de crescimento.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <article
                key={b.titulo}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ceres-gold text-ceres-charcoal">
                  {b.icon}
                </div>
                <h3 className="mt-5 text-lg font-medium text-white">{b.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{b.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-white/10 bg-black/20 py-20 md:py-28">
        <div className="container-ceres">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
            Como funciona
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-light leading-tight md:text-5xl">
            Quatro passos pra começar a revender.
          </h2>

          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {passos.map((p) => (
              <li key={p.numero} className="relative pl-6">
                <span className="absolute left-0 top-0 text-4xl font-light text-ceres-gold">
                  {p.numero}
                </span>
                <h3 className="ml-8 text-lg font-medium text-white">{p.titulo}</h3>
                <p className="ml-8 mt-2 text-sm leading-relaxed text-white/70">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* REQUISITOS */}
      <section className="py-20 md:py-28">
        <div className="container-ceres grid items-start gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
              Requisitos
            </p>
            <h2 className="mt-3 text-3xl font-light leading-tight md:text-5xl">
              O que você precisa pra começar.
            </h2>
          </div>
          <ul className="space-y-4 text-base text-white/85">
            <Requisito>CNPJ ativo (qualquer porte — MEI, ME, EPP, LTDA).</Requisito>
            <Requisito>Cartão CNPJ recente (até 90 dias).</Requisito>
            <Requisito>Contrato social ou requerimento de empresário.</Requisito>
            <Requisito>Pedido mínimo inicial de R$ 500.</Requisito>
            <Requisito>Aceite das condições comerciais (preço sugerido, marca).</Requisito>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-black/20 py-20 md:py-28">
        <div className="container-ceres max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
            Dúvidas frequentes
          </p>
          <h2 className="mt-3 text-3xl font-light leading-tight md:text-5xl">
            Quase tudo respondido.
          </h2>

          <dl className="mt-12 space-y-6">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <dt className="text-lg font-medium text-white">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/75">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28">
        <div className="container-ceres text-center">
          <h2 className="mx-auto max-w-3xl text-3xl font-light leading-tight md:text-5xl">
            Pronto pra levar a Ceres pra mais gente?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70 md:text-lg">
            Cadastro em 5 minutos. Resposta em até 2 dias úteis.
          </p>
          <Link
            href="/cadastro-pj"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ceres-gold px-10 py-4 text-base font-semibold text-ceres-charcoal transition-transform hover:scale-105"
          >
            Quero ser revendedor
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-6 text-sm text-white/50">
            Cadastro PJ estará disponível na Sprint 3 (sistema de autenticação).
          </p>
        </div>
      </section>
    </div>
  );
}

function Requisito({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ceres-gold text-ceres-charcoal">
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden="true">
          <path
            d="M5 12l5 5 9-11"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </li>
  );
}

/* ---------- ícones ---------- */

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M20 12l-8 8-9-9V4h7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 13a8 8 0 1116 0v4a2 2 0 01-2 2h-2v-6h4M4 13v4a2 2 0 002 2h2v-6H4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="2" fill="currentColor" />
      <path d="M3 17l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
