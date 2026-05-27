import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ceres-sand-soft bg-white">
      {/* Faixa de selos de confianca */}
      <div className="border-b border-ceres-sand-soft bg-ceres-sand-soft/50">
        <div className="container-ceres grid grid-cols-2 gap-6 py-6 md:grid-cols-3">
          <Seal icon={<TruckIcon />} title="Enviamos para todo o Brasil" />
          <Seal icon={<CardIcon />} title="Pague como quiser" />
          <Seal icon={<LockIcon />} title="Compra 100% segura" />
        </div>
      </div>

      <div className="container-ceres grid gap-12 py-14 md:grid-cols-4">
        {/* Coluna marca */}
        <div className="md:col-span-2">
          <Image
            src="/logo-ceres.png"
            alt="Ceres Brasil — Produtos Artesanais"
            width={120}
            height={120}
            className="h-20 w-auto"
          />
          <p className="mt-4 max-w-md text-sm text-ceres-muted">
            Alimentos naturais sem glúten — massas, farinhas e grãos com qualidade nutricional.
            Atendemos consumidores e revendedores em todo o território nacional.
          </p>
        </div>

        {/* Navegacao */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ceres-terracotta-dark">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-ceres-muted transition-colors hover:text-ceres-terracotta-dark">
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/produtos"
                className="text-ceres-muted transition-colors hover:text-ceres-terracotta-dark"
              >
                Produtos
              </Link>
            </li>
            <li>
              <Link
                href="/quem-somos"
                className="text-ceres-muted transition-colors hover:text-ceres-terracotta-dark"
              >
                Quem Somos
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="text-ceres-muted transition-colors hover:text-ceres-terracotta-dark"
              >
                Contato
              </Link>
            </li>
            <li>
              <Link
                href="/seja-revendedor"
                className="text-ceres-muted transition-colors hover:text-ceres-terracotta-dark"
              >
                Seja revendedor
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ceres-terracotta-dark">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ceres-muted">
            <li>
              <a
                href="https://wa.me/5511924771165"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ceres-terracotta-dark"
              >
                <WhatsAppIcon className="h-4 w-4" /> (11) 92477-1165
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/ceresbrasil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ceres-terracotta-dark"
              >
                <InstagramIcon className="h-4 w-4" /> @ceresbrasil
              </a>
            </li>
            <li className="pt-2 leading-relaxed">
              Rua Augusto Farina, 954
              <br /> Butantã, São Paulo SP
            </li>
          </ul>
        </div>
      </div>

      {/* Rodape final */}
      <div className="border-t border-ceres-sand-soft">
        <div className="container-ceres flex flex-col items-center justify-between gap-3 py-5 text-xs text-ceres-muted md:flex-row">
          <p>© {year} Ceres Brasil · CNPJ 12.674.225/0001-02 · Todos os direitos reservados</p>
          <div className="flex gap-5">
            <Link
              href="/politica-de-privacidade"
              className="transition-colors hover:text-ceres-terracotta-dark"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/trocas-e-devolucoes"
              className="transition-colors hover:text-ceres-terracotta-dark"
            >
              Trocas e Devoluções
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Seal({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ceres-terracotta-dark">
        {icon}
      </div>
      <span className="text-sm font-medium text-ceres-dark">{title}</span>
    </div>
  );
}

/* ---------- icones inline ---------- */

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

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 14.4l-2-1c-.3-.1-.5-.2-.8.2l-1 1.4c-.3.3-.4.4-.8.2-2-1-3.4-2.4-4.4-4.4-.2-.3-.1-.5.2-.7l1-.9c.3-.3.2-.6.1-.9l-1-2c-.3-.5-.5-.5-.9-.5-.2 0-.5-.1-.8-.1-.3 0-.7.1-1 .5-.5.5-1.5 1.5-1.5 3.6 0 2.2 1.6 4.3 1.8 4.6.3.3 3.1 5 7.7 7 1.1.5 2 .8 2.6 1 .8.3 1.6.2 2.2.2.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.2-.8-.4M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.3-1.4c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
