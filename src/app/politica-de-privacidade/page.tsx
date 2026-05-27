import type { Metadata } from 'next';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de privacidade da Ceres Brasil — como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.',
};

const ATUALIZADO_EM = '27 de maio de 2026';

export default function PoliticaPrivacidadePage() {
  return (
    <article className="container-ceres py-16 md:py-20">
      <SectionTitle eyebrow="Documento legal" title="Política de Privacidade" align="left" />
      <p className="mt-2 text-sm text-ceres-muted">Última atualização: {ATUALIZADO_EM}</p>

      <div className="prose-ceres mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-ceres-dark">
        <p>
          A Ceres Brasil (CNPJ 12.674.225/0001-02), com sede na Rua Augusto Farina, 954, Butantã,
          São Paulo — SP, valoriza a privacidade dos seus dados pessoais. Esta política descreve
          como tratamos as informações dos visitantes e clientes do site{' '}
          <strong>ceresbrasil.com.br</strong>, em conformidade com a{' '}
          <strong>Lei nº 13.709/2018 (LGPD)</strong>.
        </p>

        <Section titulo="1. Dados que coletamos">
          <p>Coletamos dados pessoais nas seguintes situações:</p>
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>
              <strong>Cadastro</strong>: nome completo, CPF/CNPJ, e-mail, telefone e endereço.
            </li>
            <li>
              <strong>Compras</strong>: dados de pagamento (processados via Mercado Pago — não
              armazenamos cartões), histórico de pedidos.
            </li>
            <li>
              <strong>Navegação</strong>: endereço IP, tipo de dispositivo, páginas visitadas e
              cookies (essenciais e de análise).
            </li>
            <li>
              <strong>Contato</strong>: mensagens enviadas via formulário, WhatsApp ou e-mail.
            </li>
          </ul>
        </Section>

        <Section titulo="2. Como usamos seus dados">
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>Processar pedidos, pagamentos e entregas.</li>
            <li>Emitir notas fiscais.</li>
            <li>Comunicar atualizações sobre seu pedido e atendimento de suporte.</li>
            <li>Enviar comunicações de marketing apenas com consentimento expresso.</li>
            <li>Cumprir obrigações legais e fiscais.</li>
            <li>Melhorar nossos produtos e a experiência no site.</li>
          </ul>
        </Section>

        <Section titulo="3. Compartilhamento com terceiros">
          <p>
            Compartilhamos dados apenas com parceiros necessários à operação da loja:
            transportadoras (para entrega), Mercado Pago (pagamentos), Bling (gestão de estoque e
            nota fiscal), Frenet (cálculo de frete) e Resend (envio de e-mails transacionais).
            Nenhum dado é vendido a terceiros.
          </p>
        </Section>

        <Section titulo="4. Armazenamento e segurança">
          <p>
            Seus dados ficam em servidores administrados pela Supabase (hospedada nos EUA, com
            criptografia em repouso e em trânsito) e Vercel. Aplicamos controles técnicos e
            administrativos para prevenir acessos não autorizados, alteração e exclusão indevida.
          </p>
        </Section>

        <Section titulo="5. Cookies">
          <p>O site usa três categorias de cookies:</p>
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>
              <strong>Essenciais</strong>: necessários para login, carrinho e checkout funcionarem.
            </li>
            <li>
              <strong>Analíticos</strong>: nos ajudam a entender uso agregado (sem identificar
              pessoas).
            </li>
            <li>
              <strong>Marketing</strong>: usados apenas se você consentir, para personalizar
              ofertas.
            </li>
          </ul>
          <p className="mt-3">
            Você pode gerenciar suas preferências no banner de cookies exibido na primeira visita.
          </p>
        </Section>

        <Section titulo="6. Seus direitos (LGPD)">
          <p>Você tem direito a, a qualquer momento:</p>
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>Confirmar se tratamos seus dados.</li>
            <li>Acessar uma cópia dos dados que armazenamos.</li>
            <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar anonimização, bloqueio ou eliminação.</li>
            <li>Portar seus dados para outro fornecedor.</li>
            <li>Revogar o consentimento.</li>
          </ul>
          <p className="mt-3">
            Para exercer qualquer desses direitos, envie um e-mail para{' '}
            <a
              href="mailto:contato@ceresbrasil.com.br"
              className="font-medium text-ceres-green-dark underline"
            >
              contato@ceresbrasil.com.br
            </a>
            .
          </p>
        </Section>

        <Section titulo="7. Retenção">
          <p>
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades acima e
            obrigações legais (por exemplo, 5 anos para registros fiscais). Após esse prazo, os
            dados são anonimizados ou excluídos.
          </p>
        </Section>

        <Section titulo="8. Alterações desta política">
          <p>
            Esta política pode ser atualizada periodicamente. A data de última atualização aparece
            no topo do documento. Em caso de mudanças significativas, comunicaremos por e-mail aos
            clientes cadastrados.
          </p>
        </Section>

        <Section titulo="9. Contato">
          <p>
            Encarregado pelo Tratamento de Dados (DPO):{' '}
            <a
              href="mailto:contato@ceresbrasil.com.br"
              className="font-medium text-ceres-green-dark underline"
            >
              contato@ceresbrasil.com.br
            </a>
          </p>
        </Section>
      </div>

      <div className="mt-12 rounded-2xl bg-ceres-gold-soft p-5 text-sm text-ceres-dark">
        <strong>Atenção:</strong> este documento é um modelo gerado pelo desenvolvedor. Antes do
        go-live oficial, recomendamos revisão por um advogado especialista em LGPD.
      </div>
    </article>
  );
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-medium text-ceres-green-dark md:text-2xl">{titulo}</h2>
      <div className="mt-3 text-ceres-muted">{children}</div>
    </section>
  );
}
