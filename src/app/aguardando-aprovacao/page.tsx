import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aguardando aprovação',
  description: 'Seu cadastro de revendedor foi recebido e está em análise.',
};

export default function AguardandoAprovacaoPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-ceres-sand-soft bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ceres-gold-soft text-ceres-terracotta-dark">
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-light tracking-tight text-ceres-dark">
          Cadastro recebido!
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ceres-muted">
          Sua solicitação de revenda está em análise. Nossa equipe confere os documentos e responde
          em <strong>até 2 dias úteis</strong>. Você receberá um e-mail assim que a conta for
          aprovada.
        </p>

        <div className="mt-8 rounded-2xl bg-ceres-sand-soft/50 p-5 text-left text-sm text-ceres-muted">
          <p className="font-semibold text-ceres-dark">Enquanto isso:</p>
          <ul className="mt-2 space-y-1">
            <li>· Verifique sua caixa de entrada (e spam).</li>
            <li>· Tenha em mãos seus dados bancários para o primeiro pedido.</li>
            <li>· Dúvidas? Fale com nosso comercial.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="https://wa.me/5511924771165?text=Ol%C3%A1!%20Acabei%20de%20me%20cadastrar%20como%20revendedor."
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ceres-terracotta"
          >
            Falar no WhatsApp
          </a>
          <Link
            href="/"
            className="rounded-full border border-ceres-sand-soft px-6 py-3 text-sm font-medium text-ceres-dark transition-colors hover:border-ceres-terracotta-dark"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
