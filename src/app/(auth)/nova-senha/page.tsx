'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { updatePassword } from '@/lib/auth';
import { forcaSenha } from '@/lib/utils/validacao';

export default function NovaSenhaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [carregando, setCarregando] = useState(false);

  const forca = forcaSenha(senha);
  const erroConfirmar = confirmar && confirmar !== senha ? 'As senhas não coincidem' : undefined;
  const valido = forca.ok && senha === confirmar;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    setCarregando(true);
    const { error } = await updatePassword(senha);
    setCarregando(false);
    if (error) {
      toast('Não foi possível atualizar. O link pode ter expirado.', 'erro');
      return;
    }
    toast('Senha atualizada com sucesso!', 'sucesso');
    router.push('/conta');
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-ceres-dark">Nova senha</h1>
      <p className="mt-1 text-sm text-ceres-muted">Defina uma nova senha para sua conta.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Nova senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
        />
        {senha && <p className="text-xs text-ceres-muted">Força: {forca.rotulo}</p>}
        <Input
          label="Confirmar nova senha"
          type="password"
          required
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          error={erroConfirmar}
          placeholder="••••••••"
        />
        <Button type="submit" loading={carregando} disabled={!valido} className="w-full">
          Salvar nova senha
        </Button>
      </form>
    </>
  );
}
