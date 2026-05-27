'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { updatePassword } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import { forcaSenha, mascaraTelefone } from '@/lib/utils/validacao';

export default function DadosPage() {
  const { toast } = useToast();
  const supabase = createClient();

  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const forca = forcaSenha(senha);
  const erroConfirmar = confirmar && confirmar !== senha ? 'As senhas não coincidem' : undefined;

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('nome, telefone')
        .eq('id', user.id)
        .maybeSingle();
      if (data) {
        setNome(data.nome ?? '');
        setTelefone(data.telefone ?? '');
      }
      setCarregandoPerfil(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoPerfil(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ nome, telefone })
      .eq('id', user.id);
    setSalvandoPerfil(false);
    toast(error ? 'Erro ao salvar dados.' : 'Dados atualizados!', error ? 'erro' : 'sucesso');
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    if (!forca.ok || senha !== confirmar) return;
    setSalvandoSenha(true);
    const { error } = await updatePassword(senha);
    setSalvandoSenha(false);
    if (error) {
      toast('Erro ao atualizar senha.', 'erro');
      return;
    }
    toast('Senha atualizada!', 'sucesso');
    setSenha('');
    setConfirmar('');
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Meus dados</h1>

      <form
        onSubmit={salvarPerfil}
        className="max-w-md space-y-4 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6"
      >
        <h2 className="text-lg font-medium text-ceres-dark">Dados pessoais</h2>
        <Input
          label="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={carregandoPerfil}
        />
        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
          disabled={carregandoPerfil}
        />
        <Button type="submit" loading={salvandoPerfil} disabled={carregandoPerfil}>
          Salvar dados
        </Button>
      </form>

      <form
        onSubmit={salvarSenha}
        className="max-w-md space-y-4 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6"
      >
        <h2 className="text-lg font-medium text-ceres-dark">Alterar senha</h2>
        <Input
          label="Nova senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {senha && <p className="text-xs text-ceres-muted">Força: {forca.rotulo}</p>}
        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          error={erroConfirmar}
        />
        <Button type="submit" loading={salvandoSenha} disabled={!forca.ok || senha !== confirmar}>
          Atualizar senha
        </Button>
      </form>
    </div>
  );
}
