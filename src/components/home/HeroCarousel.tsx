'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Banner placeholder (trocar por banner real em public/).
const slides = [{ src: '/banner-hero.webp', alt: 'Sua Marca — destaque', href: '/produtos' }];

const INTERVAL_MS = 6000;

export function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="container-ceres pt-6">
      <div
        className="relative aspect-[5972/2646] w-full overflow-hidden rounded-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
      >
        {slides.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === idx ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={i !== idx}
            tabIndex={i === idx ? 0 : -1}
          >
            <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
          </Link>
        ))}

        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Ir para o banner ${i + 1}`}
                aria-current={i === idx}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? 'w-8 bg-white' : 'w-2 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
