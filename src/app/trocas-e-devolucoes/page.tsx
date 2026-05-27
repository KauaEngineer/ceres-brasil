import type { Metadata } from 'next';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Trocas e Devoluções',
  description:
    'Política de trocas e devoluções da Ceres Brasil. Direito de arrependimento em até 7 dias conforme o CDC.',
};

const ATUALIZADO_EM = '27 de maio de 2026';

export default function TrocasPage() {
  return (
    <article className="container-ceres py-16 md:py-20">
      <SectionTitle eyebrow="Documento legal" title="Trocas e Devoluções" align="left" />
      <p className="mt-2 text-sm text-ceres-muted">Última atualização: {ATUALIZADO_EM}</p>

      <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-ceres-dark">
        <p>
          Queremos que você fique satisfeito com cada compra na Ceres Brasil. Esta política
          descreve seus direitos e como proceder em caso de troca ou devolução, em conformidade
          com o <strong>Código de Defesa do Consumidor (CDC, Lei 8.078/90)</strong>.
        </p>

        <Section titulo="1. Direito de arrependimento (7 dias)">
          <p>
            Conforme o Art. 49 do CDC, compras realizadas pela internet têm{' '}
            <strong>7 dias corridos</strong> contados a partir do recebimento para arrependimento,
            sem necessidade de justificativa.
          </p>
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>O produto deve estar lacrado e sem indícios de uso.</li>
            <li>A embalagem original deve estar preservada.</li>
            <li>O frete de devolução é por conta da Ceres Brasil neste caso.</li>
          </ul>
        </Section>

        <Section titulo="2. Produto com defeito ou avariado na entrega">
          <p>
            Caso o produto chegue avariado, com prazo de validade vencido ou com defeito de
            fabricação, entre em contato em até <strong>3 dias úteis</strong> após o recebimento.
            Substituiremos sem custo adicional.
          </p>
        </Section>

        <Section titulo="3. Como solicitar troca ou devolução">
          <ol className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-ceres-green-dark">
            <li>
              Envie e-mail para{' '}
              <a
                href="mailto:contato@ceresbrasil.com.br"
                className="font-medium text-ceres-green-dark underline"
              >
                contato@ceresbrasil.com.br
              </a>{' '}
              com o número do pedido e o motivo da solicitação.
            </li>
            <li>
              Anexe fotos do produto e da nota fiscal. Se for defeito, fotos do problema também.
            </li>
            <li>
              Aguarde nosso retorno em até 1 dia útil com as instruções de envio para o endereço
              de retorno.
            </li>
            <li>
              Após recebermos e conferirmos o produto, processamos o reembolso ou enviamos a
              substituição.
            </li>
          </ol>
        </Section>

        <Section titulo="4. Prazo para reembolso">
          <p>O reembolso é feito pelo mesmo meio de pagamento usado na compra:</p>
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>
              <strong>Cartão de crédito</strong>: o estorno aparece na próxima ou na fatura
              seguinte, conforme a operadora.
            </li>
            <li>
              <strong>Pix</strong>: até 5 dias úteis após o recebimento do produto.
            </li>
            <li>
              <strong>Boleto</strong>: até 7 dias úteis, mediante envio dos dados bancários.
            </li>
          </ul>
        </Section>

        <Section titulo="5. Casos não aceitos">
          <ul className="list-disc space-y-2 pl-6 marker:text-ceres-green-dark">
            <li>Produtos abertos, usados ou com lacre rompido (exceto defeito de fabricação).</li>
            <li>Solicitações fora do prazo de 7 dias para arrependimento.</li>
            <li>Produtos personalizados ou feitos sob encomenda.</li>
          </ul>
        </Section>

        <Section titulo="6. Pedidos B2B (revendedores)">
          <p>
            Para pedidos B2B (com CNPJ aprovado), as condições de troca seguem o que foi acordado
            no contrato comercial. Em geral, defeitos de fabricação são substituídos no próximo
            pedido. Consulte o seu representante comercial.
          </p>
        </Section>

        <Section titulo="7. Dúvidas">
          <p>
            Estamos à disposição via WhatsApp <strong>(11) 92477-1165</strong>, Instagram{' '}
            <strong>@ceresbrasil</strong> ou e-mail{' '}
            <a
              href="mailto:contato@ceresbrasil.com.br"
              className="font-medium text-ceres-green-dark underline"
            >
              contato@ceresbrasil.com.br
            </a>
            .
          </p>
        </Section>
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
