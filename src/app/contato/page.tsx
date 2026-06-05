import type { Metadata } from 'next';
import { ContatoForm } from '@/components/contato/ContatoForm';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BRAND, whatsappLink } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Sua Marca. Atendimento via WhatsApp, Instagram e formulário online.',
};

const infoContato = [
  {
    icon: <WhatsAppIcon />,
    titulo: 'WhatsApp',
    valor: BRAND.whatsappDisplay,
    href: whatsappLink(),
  },
  {
    icon: <InstagramIcon />,
    titulo: 'Instagram',
    valor: BRAND.instagramHandle,
    href: BRAND.instagramUrl,
  },
  {
    icon: <MailIcon />,
    titulo: 'E-mail',
    valor: BRAND.email,
    href: `mailto:${BRAND.email}`,
  },
];

export default function ContatoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ceres-terracotta-dark via-ceres-terracotta to-ceres-sand-soft" />
        <div className="absolute inset-0 bg-black/15" />
        <div className="container-ceres relative py-16 md:py-20">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
              Atendimento
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
              Vamos conversar.
            </h1>
            <p className="mt-4 text-base text-white/95 md:text-lg">
              Dúvidas, sugestões, parcerias, revenda — escolha o canal que preferir.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="container-ceres py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Coluna esquerda — info de contato */}
          <div className="md:col-span-2">
            <SectionTitle eyebrow="Onde nos achar" title="Canais oficiais" align="left" />

            <ul className="mt-8 space-y-4">
              {infoContato.map((c) => (
                <li key={c.titulo}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-2xl border border-ceres-sand-soft bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ceres-sand-soft text-ceres-dark">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ceres-muted">
                        {c.titulo}
                      </p>
                      <p className="text-sm font-medium text-ceres-dark">{c.valor}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            {/* Endereço */}
            <div className="mt-8 rounded-2xl border border-ceres-sand-soft bg-ceres-sand-soft/40 p-6">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ceres-dark">
                  <PinIcon />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ceres-muted">
                    Endereço
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ceres-dark">
                    {BRAND.enderecoLinha1}
                    <br />
                    {BRAND.enderecoLinha2}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <div className="md:col-span-3">
            <SectionTitle
              eyebrow="Formulário"
              title="Mande uma mensagem"
              description="Respondemos em até 1 dia útil pelo e-mail que você informar."
              align="left"
            />
            <div className="mt-8">
              <ContatoForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mapa — placeholder ilustrativo */}
      <section className="pb-20">
        <div className="container-ceres">
          <h2 className="sr-only">Como chegar</h2>
          <div className="flex h-[300px] items-center justify-center rounded-3xl border-2 border-dashed border-ceres-sand-soft bg-ceres-sand-soft/30">
            <span className="text-sm font-medium uppercase tracking-wider text-ceres-muted">
              Mapa / localização
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- ícones inline ---------- */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.5 14.4l-2-1c-.3-.1-.5-.2-.8.2l-1 1.4c-.3.3-.4.4-.8.2-2-1-3.4-2.4-4.4-4.4-.2-.3-.1-.5.2-.7l1-.9c.3-.3.2-.6.1-.9l-1-2c-.3-.5-.5-.5-.9-.5-.2 0-.5-.1-.8-.1-.3 0-.7.1-1 .5-.5.5-1.5 1.5-1.5 3.6 0 2.2 1.6 4.3 1.8 4.6.3.3 3.1 5 7.7 7 1.1.5 2 .8 2.6 1 .8.3 1.6.2 2.2.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.2-.8-.4M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
