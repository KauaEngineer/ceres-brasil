import Link from 'next/link';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Newsletter } from '@/components/home/Newsletter';
import { ProductCard } from '@/components/produtos/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { listarDestaques } from '@/lib/mock/produtos';
import { CATEGORIAS } from '@/types/produto';

const trustBadges = [
  { icon: <FreteIcon />, title: 'Frete para todo Brasil', text: 'Despachamos em até 48h' },
  { icon: <CardIcon />, title: 'Pague como quiser', text: 'Cartão, Pix ou boleto' },
  { icon: <ShieldIcon />, title: 'Compra segura', text: 'Site protegido com SSL' },
  { icon: <ChatIcon />, title: 'Atendimento humano', text: 'WhatsApp 11 92477-1165' },
];

// Imagens placeholder por categoria — gradientes ate ter fotos reais
const gradientesCategoria: Record<string, string> = {
  massas: 'from-ceres-green-dark via-ceres-green to-ceres-green-soft',
  farinhas: 'from-ceres-gold via-ceres-gold-soft to-ceres-cream',
  graos: 'from-ceres-green to-ceres-gold-soft',
};

export default function Home() {
  const destaques = listarDestaques(4);

  return (
    <>
      {/* 1. HERO */}
      <section aria-label="Banners destaque">
        <HeroCarousel />
      </section>

      {/* 2. SOBRE A CERES — teaser institucional */}
      <section className="py-20 md:py-28">
        <div className="container-ceres grid items-center gap-12 md:grid-cols-2">
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-ceres-green-soft via-ceres-cream to-ceres-gold-soft md:order-2" />
          <div className="md:order-1">
            <SectionTitle
              eyebrow="Nossa história"
              title="Comida boa não precisa ter glúten."
              align="left"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ceres-muted md:text-lg">
              <p>
                A Ceres Brasil nasceu em São Paulo da inquietação de quem queria comer bem sem
                abrir mão de sabor e nutrição. Trabalhamos com farinhas de leguminosas — grão de
                bico, lentilha, ervilha — pra entregar massas, farinhas e grãos que rendem
                refeições completas.
              </p>
              <p>
                Cada lote é cuidado de perto. Sem aditivos artificiais, sem complicação. Só
                ingrediente bom virando comida boa.
              </p>
            </div>
            <Link
              href="/quem-somos"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ceres-green-dark px-6 py-3 text-sm font-semibold text-ceres-green-dark transition-colors hover:bg-ceres-green-dark hover:text-white"
            >
              Conheça nossa história
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIAS — cards visuais */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="O que produzimos"
            title="Nossas categorias"
            description="Três famílias de produtos pra compor refeições nutritivas no dia a dia."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {CATEGORIAS.map((c) => (
              <Link
                key={c.slug}
                href={`/produtos?categoria=${c.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradientesCategoria[c.slug]} transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                    Categoria
                  </p>
                  <h3 className="mt-2 text-2xl font-bold md:text-3xl">{c.rotuloPlural}</h3>
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium">
                    Explorar
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DESTAQUES — curadoria pequena */}
      <section className="py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="Vitrine"
            title="Em destaque agora"
            description="Quatro produtos selecionados pra começar."
          />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {destaques.map((p) => (
              <ProductCard key={p.id} produto={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 rounded-full bg-ceres-green-dark px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Ver catálogo completo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SELOS DE CONFIANÇA */}
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

      {/* 6. NEWSLETTER */}
      <section className="py-16 md:py-24">
        <Newsletter />
      </section>
    </>
  );
}

/* ---------- ícones dos selos ---------- */

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
