import Image from 'next/image';
import Link from 'next/link';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { Newsletter } from '@/components/home/Newsletter';
import { ProductCard } from '@/components/produtos/ProductCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { listarDestaques } from '@/lib/mock/produtos';
import { CATEGORIAS } from '@/types/produto';

const fotoCategoria: Record<string, string> = {
  massas:
    'https://images.unsplash.com/photo-1612966893103-790e549a2ab1?w=800&q=80&auto=format&fit=crop',
  graos:
    'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=800&q=80&auto=format&fit=crop',
  farinhas:
    'https://images.unsplash.com/photo-1749169439872-7cee08d9a71b?w=800&q=80&auto=format&fit=crop',
};

const trustBadges = [
  { icon: <FreteIcon />, title: 'Frete para todo Brasil', text: 'Despachamos em até 48h' },
  { icon: <CardIcon />, title: 'Pague como quiser', text: 'Cartão, Pix ou boleto' },
  { icon: <ShieldIcon />, title: 'Compra segura', text: 'Site protegido com SSL' },
  { icon: <ChatIcon />, title: 'Atendimento humano', text: 'WhatsApp 11 92477-1165' },
];

const pilares = [
  {
    titulo: 'Natural de verdade',
    texto:
      'Sem corantes, sem conservantes desnecessários. A lista de ingredientes do verso da embalagem é curta de propósito.',
    icon: <LeafIcon />,
  },
  {
    titulo: 'Inclusivo no sabor',
    texto:
      'Quem evita glúten merece massa que cozinha al dente, farinha que rende e grão que dá refeição completa.',
    icon: <HeartIcon />,
  },
  {
    titulo: 'Confiável em cada lote',
    texto:
      'Tabela nutricional transparente, rastreabilidade da matéria-prima e qualidade conferida sempre.',
    icon: <ShieldCheckIcon />,
  },
];

export default function Home() {
  const destaques = listarDestaques(4);

  return (
    <>
      {/* 1. HERO */}
      <section aria-label="Banners destaque">
        <HeroCarousel />
      </section>

      {/* 2. PILARES — o que nos move */}
      <section className="py-20 md:py-28">
        <div className="container-ceres">
          <SectionTitle
            eyebrow="O que nos move"
            title="Comida boa começa antes da prateleira."
            description="Três princípios que guiam cada lote produzido — da escolha do ingrediente ao envio do pedido."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pilares.map((p) => (
              <article
                key={p.titulo}
                className="rounded-2xl border border-ceres-sand-soft bg-white p-8 transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ceres-terracotta-dark text-white">
                  {p.icon}
                </div>
                <h3 className="mt-5 text-xl font-medium text-ceres-dark">{p.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ceres-muted">{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOBRE A CERES — teaser institucional */}
      <section id="sobre" className="scroll-mt-24 py-20 md:py-28">
        <div className="container-ceres grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-ceres-terracotta-dark/20 md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1447279506476-3faec8071eee?w=1200&q=80&auto=format&fit=crop"
              alt="Mãos preparando massa artesanal"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="md:order-1">
            <SectionTitle
              eyebrow="Quem somos"
              title="Uma história que começa numa cozinha de São Paulo."
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
                Aos poucos, fomos entendendo que estávamos oferecendo algo diferente: uma massa
                rica em proteínas, fonte de fibras e naturalmente sem glúten.
              </p>
            </div>
            <Link
              href="/quem-somos"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-ceres-dark transition-colors hover:bg-ceres-terracotta-dark hover:text-white"
            >
              Conheça nossa história completa
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIAS — cards visuais */}
      <section className="py-20 md:py-28">
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
                className="group relative aspect-4/5 overflow-hidden rounded-3xl"
              >
                <Image
                  src={fotoCategoria[c.slug] ?? `/produtos/${c.slug}.webp`}
                  alt={c.rotuloPlural}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                    Categoria
                  </p>
                  <h3 className="mt-2 text-2xl font-light tracking-tight md:text-3xl">{c.rotuloPlural}</h3>
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
              className="inline-flex items-center gap-2 rounded-full bg-ceres-terracotta-dark px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Ver catálogo completo
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SELOS DE CONFIANÇA */}
      <section className="py-12 md:py-16">
        <div className="container-ceres">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBadges.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-4 md:text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ceres-sand-soft text-ceres-dark">
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

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
