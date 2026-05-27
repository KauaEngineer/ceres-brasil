'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContatoForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    // TODO Sprint 3: chamar route handler /api/contato que envia via Resend
    await new Promise((r) => setTimeout(r, 700));
    setStatus('sent');
    setForm({ nome: '', email: '', assunto: '', mensagem: '' });
  }

  function update<K extends keyof typeof form>(field: K, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-ceres-sand-soft bg-ceres-sand-soft/40 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ceres-terracotta-dark text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <path
              d="M5 12l5 5 9-11"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-ceres-terracotta-dark">Mensagem enviada!</h3>
        <p className="mt-2 text-sm text-ceres-muted">
          Recebemos sua mensagem. Vamos responder em até 1 dia útil.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-medium text-ceres-terracotta-dark underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome completo" name="nome" value={form.nome} onChange={update} required />
        <Field
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          required
        />
      </div>
      <Field label="Assunto" name="assunto" value={form.assunto} onChange={update} required />
      <div>
        <label
          htmlFor="mensagem"
          className="block text-sm font-medium text-ceres-dark"
        >
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          required
          value={form.mensagem}
          onChange={(e) => update('mensagem', e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-ceres-sand-soft bg-white px-4 py-3 text-sm text-ceres-dark placeholder:text-ceres-muted focus:border-ceres-terracotta-dark focus:outline-none focus:ring-2 focus:ring-ceres-terracotta-dark/30"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta disabled:opacity-60 md:w-auto md:min-w-[200px]"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
      <p className="text-xs text-ceres-muted">
        Ao enviar, você concorda com nossa{' '}
        <a href="/politica-de-privacidade" className="underline hover:text-ceres-terracotta-dark">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: 'nome' | 'email' | 'assunto';
  value: string;
  onChange: (field: 'nome' | 'email' | 'assunto', value: string) => void;
  required?: boolean;
  type?: string;
}

function Field({ label, name, value, onChange, required, type = 'text' }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ceres-dark">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="mt-1.5 w-full rounded-full border border-ceres-sand-soft bg-white px-4 py-3 text-sm text-ceres-dark placeholder:text-ceres-muted focus:border-ceres-terracotta-dark focus:outline-none focus:ring-2 focus:ring-ceres-terracotta-dark/30"
      />
    </div>
  );
}
