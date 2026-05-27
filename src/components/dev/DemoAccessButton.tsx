'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { signIn } from '@/lib/auth';

/**
 * Botão de ACESSO DE TESTE — entra com a conta demo sem precisar de cadastro.
 * Visualmente marcado como TESTE pra o cliente entender que é temporário.
 * Remover antes do go-live de produção.
 */
const DEMO_EMAIL = 'demo@ceresbrasil.com.br';
const DEMO_SENHA = 'demo12345';

export function DemoAccessButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState(false);

  async function entrarDemo() {
    setCarregando(true);
    const { error } = await signIn(DEMO_EMAIL, DEMO_SENHA);
    setCarregando(false);
    if (error) {
      toast('Conta demo indisponível. Rode: node scripts/seed-demo.mjs', 'erro');
      return;
    }
    toast('Entrou como cliente demonstração.', 'sucesso');
    router.push('/conta');
    router.refresh();
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-[15rem]">
      <button
        type="button"
        onClick={entrarDemo}
        disabled={carregando}
        className="flex w-full flex-col items-start gap-1 rounded-2xl border-2 border-dashed border-ceres-gold bg-white/95 px-4 py-3 text-left shadow-lg backdrop-blur transition-transform hover:scale-105 disabled:opacity-60"
      >
        <span className="rounded-full bg-ceres-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ceres-dark">
          🔧 Teste / Demo
        </span>
        <span className="text-sm font-semibold text-ceres-dark">
          {carregando ? 'Entrando...' : 'Entrar como cliente'}
        </span>
        <span className="text-[11px] leading-tight text-ceres-muted">
          Acesso temporário pra demonstração durante o desenvolvimento.
        </span>
      </button>
    </div>
  );
}
