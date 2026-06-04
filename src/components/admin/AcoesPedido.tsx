'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import type { StatusPedido } from '@/lib/utils/pedido';

interface Props {
  pedidoId: string;
  status: StatusPedido;
  blingId?: string | null;
  demo?: boolean;
}

export function AcoesPedido({ pedidoId, status, blingId, demo = false }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState(false);
  const [modalRastreio, setModalRastreio] = useState(false);
  const [rastreio, setRastreio] = useState(blingId ?? '');

  async function patch(novoStatus: StatusPedido, extras?: Record<string, unknown>) {
    if (demo) {
      toast('Ação indisponível na versão demo.', 'erro');
      return;
    }
    setCarregando(true);
    const res = await fetch(`/api/admin/pedidos/${pedidoId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus, ...(extras ?? {}) }),
    });
    setCarregando(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Falha' }));
      toast(error ?? 'Não foi possível atualizar.', 'erro');
      return;
    }
    toast('Status atualizado.', 'sucesso');
    router.refresh();
  }

  function confirmarEnvio() {
    if (!rastreio.trim()) {
      toast('Informe o código de rastreio.', 'erro');
      return;
    }
    setModalRastreio(false);
    patch('enviado', { bling_pedido_id: rastreio.trim() });
  }

  const podeCancelar = status !== 'cancelado' && status !== 'entregue';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4">
      {demo && (
        <p className="w-full text-xs text-ceres-muted">
          🔒 Modo demonstração — as ações abaixo estão desativadas.
        </p>
      )}
      {status === 'pendente' && (
        <Button loading={carregando} onClick={() => patch('pago')}>
          Marcar como pago
        </Button>
      )}
      {status === 'pago' && (
        <Button loading={carregando} onClick={() => patch('em_separacao')}>
          Iniciar separação
        </Button>
      )}
      {status === 'em_separacao' && (
        <Button loading={carregando} onClick={() => setModalRastreio(true)}>
          Marcar como enviado
        </Button>
      )}
      {status === 'enviado' && (
        <Button loading={carregando} onClick={() => patch('entregue')}>
          Confirmar entrega
        </Button>
      )}
      {podeCancelar && (
        <Button
          variant="danger"
          loading={carregando}
          onClick={() => {
            if (confirm('Cancelar este pedido?')) patch('cancelado');
          }}
        >
          Cancelar pedido
        </Button>
      )}

      <Modal
        open={modalRastreio}
        onClose={() => setModalRastreio(false)}
        title="Informar código de rastreio"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalRastreio(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarEnvio}>Confirmar envio</Button>
          </>
        }
      >
        <Input
          label="Código de rastreio (Correios / transportadora)"
          value={rastreio}
          onChange={(e) => setRastreio(e.target.value)}
          placeholder="Ex: BR123456789XX"
        />
      </Modal>
    </div>
  );
}
