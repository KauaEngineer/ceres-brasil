'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { createClient } from '@/lib/supabase/client';
import { buscarCEP, mascaraCEP } from '@/lib/utils/cep';

interface Endereco {
  id: string;
  apelido: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  uf: string;
  padrao: boolean;
}

const FORM_VAZIO = {
  apelido: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
};

export default function EnderecosPage() {
  const { toast } = useToast();
  const supabase = createClient();

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);

  const carregar = useCallback(async () => {
    const { data } = await supabase
      .from('enderecos')
      .select('*')
      .order('padrao', { ascending: false })
      .order('criado_em', { ascending: false });
    setEnderecos((data as Endereco[]) ?? []);
    setCarregando(false);
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function up(c: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [c]: v }));
  }

  async function handleCep(valor: string) {
    const masked = mascaraCEP(valor);
    up('cep', masked);
    if (masked.length === 9) {
      const end = await buscarCEP(masked);
      if (end) {
        setForm((f) => ({
          ...f,
          logradouro: end.logradouro,
          bairro: end.bairro,
          cidade: end.localidade,
          uf: end.uf,
        }));
      }
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const primeiro = enderecos.length === 0;
    const { error } = await supabase.from('enderecos').insert({
      profile_id: user.id,
      apelido: form.apelido || null,
      cep: form.cep,
      logradouro: form.logradouro,
      numero: form.numero,
      complemento: form.complemento || null,
      bairro: form.bairro || null,
      cidade: form.cidade,
      uf: form.uf,
      padrao: primeiro, // primeiro endereço vira padrão automaticamente
    });
    setSalvando(false);
    if (error) {
      toast('Erro ao salvar endereço.', 'erro');
      return;
    }
    toast('Endereço adicionado!', 'sucesso');
    setForm(FORM_VAZIO);
    setMostrarForm(false);
    carregar();
  }

  async function definirPadrao(id: string) {
    // zera todos e marca o escolhido
    await supabase.from('enderecos').update({ padrao: false }).neq('id', id);
    await supabase.from('enderecos').update({ padrao: true }).eq('id', id);
    carregar();
  }

  async function excluir(id: string) {
    const { error } = await supabase.from('enderecos').delete().eq('id', id);
    if (error) toast('Erro ao excluir.', 'erro');
    else {
      toast('Endereço removido.', 'info');
      carregar();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-tight text-ceres-dark md:text-3xl">Endereços</h1>
        {!mostrarForm && (
          <Button size="sm" onClick={() => setMostrarForm(true)}>
            Adicionar
          </Button>
        )}
      </div>

      {mostrarForm && (
        <form
          onSubmit={salvar}
          className="space-y-4 rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6"
        >
          <Input label="Apelido (ex: Casa, Trabalho)" value={form.apelido} onChange={(e) => up('apelido', e.target.value)} />
          <Input label="CEP" required value={form.cep} onChange={(e) => handleCep(e.target.value)} placeholder="00000-000" inputMode="numeric" />
          <Input label="Logradouro" required value={form.logradouro} onChange={(e) => up('logradouro', e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Número" required value={form.numero} onChange={(e) => up('numero', e.target.value)} />
            <Input label="Complemento" value={form.complemento} onChange={(e) => up('complemento', e.target.value)} />
          </div>
          <Input label="Bairro" value={form.bairro} onChange={(e) => up('bairro', e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Cidade" required value={form.cidade} onChange={(e) => up('cidade', e.target.value)} />
            <Input label="UF" required value={form.uf} onChange={(e) => up('uf', e.target.value.toUpperCase().slice(0, 2))} />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setMostrarForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando}>
              Salvar endereço
            </Button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-sm text-ceres-muted">Carregando...</p>
      ) : enderecos.length === 0 && !mostrarForm ? (
        <div className="rounded-2xl border border-dashed border-ceres-terracotta-dark/30 bg-white/50 p-10 text-center">
          <p className="text-sm text-ceres-muted">Nenhum endereço cadastrado ainda.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {enderecos.map((e) => (
            <li
              key={e.id}
              className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 font-medium text-ceres-dark">
                    {e.apelido || 'Endereço'}
                    {e.padrao && (
                      <span className="rounded-full bg-ceres-terracotta-dark px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Padrão
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-ceres-muted">
                    {e.logradouro}, {e.numero}
                    {e.complemento ? ` — ${e.complemento}` : ''}
                    {e.bairro ? `, ${e.bairro}` : ''}
                    <br />
                    {e.cidade} / {e.uf} · CEP {e.cep}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                {!e.padrao && (
                  <button
                    type="button"
                    onClick={() => definirPadrao(e.id)}
                    className="font-medium text-ceres-terracotta-dark hover:underline"
                  >
                    Tornar padrão
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => excluir(e.id)}
                  className="font-medium text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
