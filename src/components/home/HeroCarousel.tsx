'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
  {
    eyebrow: 'Alimentos naturais',
    title: 'Sabor sem glúten,\nnutrição em cada porção',
    description: 'Massas, farinhas e grãos cuidadosamente selecionados.',
    cta: { label: 'Ver produtos', href: '/produtos' },
    gradient: 'from-ceres-terracotta-dark via-ceres-terracotta to-ceres-sand-soft',
  },
  {
    eyebrow: 'Para revendedores',
    title: 'Preços de fábrica\npara revenda',
    description: 'Cadastre seu CNPJ e tenha acesso ao portal B2B exclusivo.',
    cta: { label: 'Seja revendedor', href: '/seja-revendedor' },
    gradient: 'from-ceres-gold via-ceres-gold-soft to-ceres-sand-soft',
  },
  {
    eyebrow: 'Entrega para todo Brasil',
    title: 'Receba em casa\nem poucos dias',
    description: 'Cálculo de frete na hora e despacho em até 48h úteis.',
    cta: { label: 'Conheça a Ceres', href: '/quem-somos' },
    gradient: 'from-ceres-terracotta via-ceres-sand-soft to-ceres-cream',
  },
];

const INTERVAL_MS = 6000;

export function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused]);

  const current = slides[idx];

  return (
    <div
      className="relative h-[480px] overflow-hidden md:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={i !== idx}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="container-ceres relative flex h-full items-center">
            <div className="max-w-xl text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
                {s.eyebrow}
              </p>
              <h1 className="mt-4 whitespace-pre-line text-4xl font-light leading-tight tracking-tight drop-shadow-md md:text-5xl lg:text-6xl">
                {s.title}
              </h1>
              <p className="mt-5 max-w-md text-base text-white/95 drop-shadow md:text-lg">
                {s.description}
              </p>
              <Link
                href={s.cta.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ceres-dark transition-transform hover:scale-105"
              >
                {s.cta.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === idx}
            className={`h-2 rounded-full transition-all ${
              i === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
