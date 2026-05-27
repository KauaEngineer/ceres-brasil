import Link from 'next/link';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Newsletter } from '@/components/home/Newsletter';
import { SectionTitle } from '@/components/ui/SectionTitle';

const produtosDestaque = [
  {
    nome: 'Talharim de Grão de Bico — Tradicional',
    categoria: 'Massas sem glúten',
    preco: 'R$ 22,90',
  },
  {
    nome: 'Talharim de Lentilha Vermelha',
    categoria: 'Massas sem glúten',
    preco: 'R$ 24,90',
  },
  {
    nome: 'Fusilli de Lentilha Amarela',
    categoria: 'Massas sem glúten',
    preco: 'R$ 24,90',
  },
  {
    nome: 'Talharim de Grão de Bico — Funghi',
    categoria: 'Massas sem glúten',
    preco: 'R$ 26,90',
  },
  {
    nome: 'Farinha de Grão de Bico',
    categoria: 'Farinhas',
    preco: 'R$ 18,90',
  },
  {
    nome: 'Talharim de Grão de Bico — Tomate Seco',
    categoria: 'Massas sem glúten',
    preco: 'R$ 26,90',
  },
];

const trustBadges = [
  { icon: <FreteIcon />, title: 'Frete para todo Brasil', text: 'Despachamos em até 48h' },
  { icon: <CardIcon />, title: 'Pague como quiser', text: 'Cartão, Pix ou boleto' },
  { icon: <ShieldIcon />, title: 'Compra segura', text: 'Site protegido com SSL' },
  { icon: <ChatIcon />, title: 'Atendimento humano', text: 'WhatsApp 11 92477-1165' },
];

export default function Home() {
  return (
    <>
      {/* HERO — carrossel */}
      <section aria-label="Banners destaque">
        <HeroCarousel />
      </section>

      {/* DESTAQUES */}
      <section className="py-16 md:py-24">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="Catálogo"
            title="Produtos em destaque"
            description="Massas, farinhas e grãos sem glúten produzidos com qualidade nutricional."
          />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
            {produtosDestaque.map((p) => (
              <article
                key={p.nome}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ceres-green-soft bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square bg-gradient-to-br from-ceres-green-soft to-ceres-gold-soft">
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ceres-green-dark">
                    Sem glúten
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-ceres-gold">
                    {p.categoria}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ceres-dark md:text-base">
                    {p.nome}
                  </h3>
                  <p className="mt-3 text-lg font-bold text-ceres-green-dark md:text-xl">
                    {p.preco}
                  </p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-full bg-ceres-green-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ceres-green"
                  >
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ceres-green-dark px-6 py-3 text-sm font-semibold text-ceres-green-dark transition-colors hover:bg-ceres-green-dark hover:text-white"
            >
              Ver catálogo completo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SELOS DE CONFIANCA */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-ceres">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-4 md:text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ceres-green-soft text-ceres-green-dark">
                  {b.icon}
                </div>
                <div className="mt-3 md:mt-0">
                  <h3 className="text-sm font-semibold text-ceres-dark">{b.title}</h3>
                  <p className="mt-1 text-xs text-ceres-muted">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 md:py-24">
        <Newsletter />
      </section>
    </>
  );
}

/* ---------- icones dos selos ---------- */

function FreteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
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

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
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

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M21 12a8 8 0 11-15-4l-2 5 5-2a8 8 0 0012 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
