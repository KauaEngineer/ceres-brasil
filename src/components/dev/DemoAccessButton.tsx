'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { signIn } from '@/lib/auth';

/**
 * Widget de ACESSO DE DEMONSTRAÇÃO — entra com as contas demo sem cadastro,
 * direto no contexto certo (cliente, revendedor ou admin).
 * Marcado como demo pra deixar claro que é temporário. Remover no go-live real.
 */
const CLIENTE = { email: 'demo@ceresbrasil.com.br', senha: 'demo12345' };
const REVENDEDOR = { email: 'demo-pj@ceresbrasil.com.br', senha: 'demo12345' };

type Papel = 'cliente' | 'revendedor' | 'admin';

export function DemoAccessButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState<Papel | null>(null);

  async function entrar(papel: Papel) {
    const conta = papel === 'revendedor' ? REVENDEDOR : CLIENTE;
    const destino = papel === 'revendedor' ? '/loja/b2b' : papel === 'admin' ? '/admin' : '/conta';

    setCarregando(papel);
    const { error } = await signIn(conta.email, conta.senha);
    setCarregando(null);

    if (error) {
      const seed = papel === 'revendedor' ? 'seed-demo-pj.mjs' : 'seed-demo.mjs';
      toast(`Conta demo indisponível. Rode: node scripts/${seed}`, 'erro');
      return;
    }
    toast('Acesso de demonstração liberado.', 'sucesso');
    router.push(destino);
    router.refresh();
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 w-56 rounded-2xl border-2 border-dashed border-ceres-gold bg-white/95 p-3 shadow-lg backdrop-blur">
      <span className="rounded-full bg-ceres-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ceres-dark">
        🔧 Acesso demo
      </span>
      <p className="mt-2 text-[11px] leading-tight text-ceres-muted">
        Entre sem cadastro para explorar cada área:
      </p>

      <div className="mt-2 space-y-1.5">
        <DemoBtn label="Entrar como cliente" hint="Loja B2C" loading={carregando === 'cliente'} onClick={() => entrar('cliente')} />
        <DemoBtn label="Entrar como revendedor" hint="Portal B2B" loading={carregando === 'revendedor'} onClick={() => entrar('revendedor')} />
        <DemoBtn label="Entrar como admin" hint="Painel" loading={carregando === 'admin'} onClick={() => entrar('admin')} />
      </div>
    </div>
  );
}

function DemoBtn({
  label,
  hint,
  loading,
  onClick,
}: {
  label: string;
  hint: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-between gap-2 rounded-lg bg-ceres-dark px-3 py-2 text-left text-xs font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
    >
      <span>{loading ? 'Entrando…' : label}</span>
      <span className="text-[9px] font-normal uppercase tracking-wider text-white/60">{hint}</span>
    </button>
  );
}
