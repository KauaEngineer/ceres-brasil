'use client';

import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    // TODO: integrar com Resend / Mailchimp na Sprint 8
    setTimeout(() => {
      setStatus('sent');
      setEmail('');
    }, 600);
  }

  return (
    <div className="container-ceres">
      <div className="overflow-hidden rounded-3xl bg-ceres-green-dark p-8 md:p-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ceres-gold">
              Newsletter
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">
              Receba receitas e lançamentos
            </h2>
            <p className="mt-3 text-base text-white/80">
              Cadastre seu e-mail para receber novidades, cupons e ideias de receitas sem glúten.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Seu melhor e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 rounded-full border-2 border-transparent bg-white px-5 py-3 text-sm text-ceres-dark placeholder:text-ceres-muted focus:border-ceres-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-full bg-ceres-gold px-6 py-3 text-sm font-semibold text-ceres-dark transition-colors hover:bg-ceres-gold-soft disabled:opacity-60"
            >
              {status === 'sending' ? 'Enviando...' : status === 'sent' ? 'Obrigado!' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
