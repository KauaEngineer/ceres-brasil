'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

/**
 * Pagina de demonstracao dos componentes UI (Storybook caseiro).
 * Util durante o desenvolvimento — pode ser removida antes do go-live.
 */
export default function UIDemoPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const { toast } = useToast();

  return (
    <div className="container-ceres space-y-16 py-16">
      <header>
        <h1 className="text-4xl font-light tracking-tight text-ceres-dark">Biblioteca de UI</h1>
        <p className="mt-2 text-ceres-muted">
          Componentes reutilizáveis da Ceres Brasil. Página de teste interno.
        </p>
      </header>

      {/* BUTTONS */}
      <Secao titulo="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
          <Button loading>Carregando</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </Secao>

      {/* INPUTS */}
      <Secao titulo="Input">
        <div className="grid max-w-xl gap-4">
          <Input label="Nome completo" placeholder="Seu nome" />
          <Input label="E-mail" type="email" placeholder="voce@email.com" />
          <Input label="Com erro" placeholder="Campo inválido" error="Este campo é obrigatório" />
        </div>
      </Secao>

      {/* BADGES */}
      <Secao titulo="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge variant="estoque">Em estoque</Badge>
          <Badge variant="esgotado">Esgotado</Badge>
          <Badge variant="destaque">Destaque</Badge>
          <Badge variant="info">Sem glúten</Badge>
          <Badge variant="neutro">Neutro</Badge>
        </div>
      </Secao>

      {/* CARDS */}
      <Secao titulo="Card">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-medium text-ceres-dark">Card simples</h3>
            <p className="mt-2 text-sm text-ceres-muted">Padding médio padrão.</p>
          </Card>
          <Card hover>
            <h3 className="font-medium text-ceres-dark">Card com hover</h3>
            <p className="mt-2 text-sm text-ceres-muted">Passe o mouse pra ver a sombra.</p>
          </Card>
          <Card padding="lg" className="bg-ceres-sand-soft">
            <h3 className="font-medium text-ceres-dark">Card customizado</h3>
            <p className="mt-2 text-sm text-ceres-muted">Padding grande + fundo bege.</p>
          </Card>
        </div>
      </Secao>

      {/* SPINNER */}
      <Secao titulo="LoadingSpinner">
        <div className="flex items-center gap-8">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </Secao>

      {/* MODAL */}
      <Secao titulo="Modal">
        <Button onClick={() => setModalAberto(true)}>Abrir modal</Button>
        <Modal
          open={modalAberto}
          onClose={() => setModalAberto(false)}
          title="Confirmar ação"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setModalAberto(false);
                  toast('Ação confirmada!', 'sucesso');
                }}
              >
                Confirmar
              </Button>
            </>
          }
        >
          <p>Tem certeza que deseja continuar? Essa é só uma demonstração do componente Modal.</p>
        </Modal>
      </Secao>

      {/* TOAST */}
      <Secao titulo="Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => toast('Tudo certo!', 'sucesso')}>
            Toast sucesso
          </Button>
          <Button variant="danger" onClick={() => toast('Algo deu errado.', 'erro')}>
            Toast erro
          </Button>
          <Button variant="outline" onClick={() => toast('Informação útil.', 'info')}>
            Toast info
          </Button>
        </div>
      </Secao>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-ceres-sand-soft pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ceres-terracotta-dark">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
