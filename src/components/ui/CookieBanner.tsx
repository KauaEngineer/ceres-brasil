'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ceres-cookie-consent';

type Consent = 'all' | 'essential' | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [montado, setMontado] = useState(false);

  // Carrega preferencia salva — so apos hidratacao (evita mismatch SSR/cliente)
  useEffect(() => {
    setMontado(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Consent;
    if (saved === 'all' || saved === 'essential') setConsent(saved);
  }, []);

  function decidir(escolha: 'all' | 'essential') {
    localStorage.setItem(STORAGE_KEY, escolha);
    setConsent(escolha);
  }

  // So renderiza apos montar (evita flash) e quando ainda nao houver decisao
  if (!montado || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 md:bottom-6 md:left-1/2 md:right-auto md:max-w-2xl md:-translate-x-1/2"
    >
      <div className="rounded-2xl border border-ceres-sand-soft bg-white p-5 shadow-2xl md:p-6">
        <div className="flex items-start gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ceres-sand-soft text-ceres-dark md:flex">
            <CookieIcon />
          </div>
          <div className="flex-1">
            <h2 id="cookie-banner-title" className="text-sm font-semibold text-ceres-dark">
              Usamos cookies pra melhorar sua experiência
            </h2>
            <p id="cookie-banner-desc" className="mt-1 text-xs text-ceres-muted">
              Cookies essenciais são necessários pro site funcionar (login, carrinho). Os demais
              só com seu consentimento.{' '}
              <Link
                href="/politica-de-privacidade"
                className="font-medium text-ceres-dark underline"
              >
                Ver política
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decidir('all')}
                className="rounded-full bg-ceres-terracotta-dark px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
              >
                Aceitar todos
              </button>
              <button
                type="button"
                onClick={() => decidir('essential')}
                className="rounded-full border border-ceres-sand-soft px-5 py-2 text-sm font-medium text-ceres-dark transition-colors hover:border-ceres-terracotta-dark"
              >
                Apenas essenciais
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2a10 10 0 109.5 13c-2-.5-3.5-2-3.5-4 0-3 3-3 3-5 0-2-2-2-2-4-2 0-2 1-4 1-2 0-3-1-3-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="currentColor" />
      <circle cx="10" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
