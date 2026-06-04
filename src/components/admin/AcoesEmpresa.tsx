'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

export function AcoesEmpresa({
  empresaId,
  status,
  demo = false,
}: {
  empresaId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  demo?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [carregando, setCarregando] = useState(false);
  const [modal, setModal] = useState(false);
  const [motivo, setMotivo] = useState('');

  async function decidir(decisao: 'aprovar' | 'rejeitar', motivoTexto?: string) {
    if (demo) {
      toast('Ação indisponível na versão demo.', 'erro');
      return;
    }
    setCarregando(true);
    const res = await fetch(`/api/admin/empresas/${empresaId}/decisao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisao, motivo: motivoTexto }),
    });
    setCarregando(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Falha' }));
      toast(error ?? 'Não foi possível atualizar.', 'erro');
      return;
    }
    toast(decisao === 'aprovar' ? 'Empresa aprovada.' : 'Empresa rejeitada.', 'sucesso');
    router.refresh();
  }

  function confirmarRejeicao() {
    if (!motivo.trim()) {
      toast('Informe o motivo da rejeição.', 'erro');
      return;
    }
    setModal(false);
    decidir('rejeitar', motivo.trim());
  }

  if (status !== 'pendente') {
    return (
      <p className="text-sm text-ceres-muted">
        Empresa já foi {status === 'aprovado' ? 'aprovada' : 'rejeitada'}. Sem ações pendentes.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {demo && (
        <p className="w-full text-xs text-ceres-muted">
          🔒 Modo demonstração — aprovar/rejeitar está desativado.
        </p>
      )}
      <Button loading={carregando} onClick={() => decidir('aprovar')}>
        Aprovar
      </Button>
      <Button variant="danger" loading={carregando} onClick={() => setModal(true)}>
        Rejeitar
      </Button>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Motivo da rejeição"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarRejeicao}>
              Confirmar rejeição
            </Button>
          </>
        }
      >
        <p className="mb-3 text-xs text-ceres-muted">
          O cliente receberá este motivo por e-mail.
        </p>
        <Input
          label="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex: Documentação incompleta…"
        />
      </Modal>
    </div>
  );
}
