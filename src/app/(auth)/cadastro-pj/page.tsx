'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { signUpPJ } from '@/lib/auth';
import { buscarCEP, mascaraCEP } from '@/lib/utils/cep';
import {
  forcaSenha,
  mascaraCNPJ,
  mascaraTelefone,
  validarCNPJ,
  validarEmail,
} from '@/lib/utils/validacao';

type Etapa = 1 | 2;

export default function CadastroPJPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [etapa, setEtapa] = useState<Etapa>(1);
  const [carregando, setCarregando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Etapa 1 — conta
  const [conta, setConta] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar: '',
    telefone: '',
  });

  // Etapa 2 — empresa
  const [empresa, setEmpresa] = useState({
    razaoSocial: '',
    cnpj: '',
    inscricaoEstadual: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const [cartao, setCartao] = useState<File | null>(null);
  const [contrato, setContrato] = useState<File | null>(null);

  const forca = forcaSenha(conta.senha);

  const errosConta = {
    email: conta.email && !validarEmail(conta.email) ? 'E-mail inválido' : undefined,
    confirmar:
      conta.confirmar && conta.confirmar !== conta.senha ? 'As senhas não coincidem' : undefined,
  };
  const etapa1Valida =
    conta.nome.trim().length > 2 &&
    validarEmail(conta.email) &&
    forca.ok &&
    conta.senha === conta.confirmar;

  const errosEmpresa = {
    cnpj: empresa.cnpj && !validarCNPJ(empresa.cnpj) ? 'CNPJ inválido' : undefined,
  };
  const etapa2Valida =
    empresa.razaoSocial.trim().length > 2 &&
    validarCNPJ(empresa.cnpj) &&
    empresa.cep.length === 9 &&
    empresa.numero.trim().length > 0 &&
    !!cartao &&
    !!contrato;

  function upConta(c: keyof typeof conta, v: string) {
    setConta((s) => ({ ...s, [c]: v }));
  }
  function upEmpresa(c: keyof typeof empresa, v: string) {
    setEmpresa((s) => ({ ...s, [c]: v }));
  }

  async function handleCep(valor: string) {
    const masked = mascaraCEP(valor);
    upEmpresa('cep', masked);
    if (masked.length === 9) {
      setBuscandoCep(true);
      const end = await buscarCEP(masked);
      setBuscandoCep(false);
      if (end) {
        setEmpresa((s) => ({
          ...s,
          logradouro: end.logradouro,
          bairro: end.bairro,
          cidade: end.localidade,
          uf: end.uf,
        }));
      } else {
        toast('CEP não encontrado. Preencha o endereço manualmente.', 'erro');
      }
    }
  }

  function validarArquivo(file: File | null): boolean {
    if (!file) return false;
    if (file.type !== 'application/pdf') {
      toast('O arquivo precisa ser PDF.', 'erro');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('O arquivo excede 5MB.', 'erro');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!etapa2Valida) return;
    setCarregando(true);

    // 1) cria usuário PJ no Supabase Auth
    const { data, error } = await signUpPJ({
      nome: conta.nome,
      email: conta.email,
      senha: conta.senha,
      telefone: conta.telefone,
    });

    if (error || !data.user) {
      setCarregando(false);
      toast(
        error?.message.includes('already registered')
          ? 'Este e-mail já está cadastrado.'
          : 'Erro ao criar conta. Tente novamente.',
        'erro',
      );
      return;
    }

    // 2) envia empresa + documentos pra API (service role)
    const fd = new FormData();
    fd.append('userId', data.user.id);
    fd.append('razaoSocial', empresa.razaoSocial);
    fd.append('cnpj', empresa.cnpj);
    fd.append('inscricaoEstadual', empresa.inscricaoEstadual);
    fd.append(
      'endereco',
      JSON.stringify({
        cep: empresa.cep,
        logradouro: empresa.logradouro,
        numero: empresa.numero,
        complemento: empresa.complemento,
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        uf: empresa.uf,
      }),
    );
    fd.append('cartaoCnpj', cartao!);
    fd.append('contratoSocial', contrato!);

    const res = await fetch('/api/cadastro-pj', { method: 'POST', body: fd });
    setCarregando(false);

    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      toast(`Conta criada, mas falhou ao registrar empresa: ${msg}`, 'erro');
      return;
    }

    router.push('/aguardando-aprovacao');
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Passo n={1} atual={etapa} rotulo="Conta" />
        <span className="h-px flex-1 bg-ceres-sand-soft" />
        <Passo n={2} atual={etapa} rotulo="Empresa" />
      </div>

      <h1 className="text-2xl font-medium text-ceres-dark">Cadastro de revendedor</h1>
      <p className="mt-1 text-sm text-ceres-muted">
        {etapa === 1 ? 'Dados do responsável pela conta.' : 'Dados da empresa e documentos.'}
      </p>

      {etapa === 1 ? (
        <div className="mt-6 space-y-4">
          <Input
            label="Nome do responsável"
            required
            value={conta.nome}
            onChange={(e) => upConta('nome', e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={conta.email}
            onChange={(e) => upConta('email', e.target.value)}
            error={errosConta.email}
          />
          <Input
            label="Telefone"
            value={conta.telefone}
            onChange={(e) => upConta('telefone', mascaraTelefone(e.target.value))}
            placeholder="(11) 90000-0000"
            inputMode="numeric"
          />
          <Input
            label="Senha"
            type="password"
            required
            value={conta.senha}
            onChange={(e) => upConta('senha', e.target.value)}
          />
          {conta.senha && <p className="text-xs text-ceres-muted">Força: {forca.rotulo}</p>}
          <Input
            label="Confirmar senha"
            type="password"
            required
            value={conta.confirmar}
            onChange={(e) => upConta('confirmar', e.target.value)}
            error={errosConta.confirmar}
          />
          <Button
            type="button"
            disabled={!etapa1Valida}
            onClick={() => setEtapa(2)}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Razão social"
            required
            value={empresa.razaoSocial}
            onChange={(e) => upEmpresa('razaoSocial', e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="CNPJ"
              required
              value={empresa.cnpj}
              onChange={(e) => upEmpresa('cnpj', mascaraCNPJ(e.target.value))}
              error={errosEmpresa.cnpj}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
            />
            <Input
              label="Inscrição estadual (opcional)"
              value={empresa.inscricaoEstadual}
              onChange={(e) => upEmpresa('inscricaoEstadual', e.target.value)}
            />
          </div>

          <Input
            label="CEP"
            required
            value={empresa.cep}
            onChange={(e) => handleCep(e.target.value)}
            placeholder="00000-000"
            inputMode="numeric"
          />
          {buscandoCep && <p className="text-xs text-ceres-muted">Buscando endereço...</p>}

          <Input
            label="Logradouro"
            required
            value={empresa.logradouro}
            onChange={(e) => upEmpresa('logradouro', e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Número"
              required
              value={empresa.numero}
              onChange={(e) => upEmpresa('numero', e.target.value)}
            />
            <Input
              label="Complemento"
              value={empresa.complemento}
              onChange={(e) => upEmpresa('complemento', e.target.value)}
            />
          </div>
          <Input
            label="Bairro"
            value={empresa.bairro}
            onChange={(e) => upEmpresa('bairro', e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Cidade"
              value={empresa.cidade}
              onChange={(e) => upEmpresa('cidade', e.target.value)}
            />
            <Input
              label="UF"
              value={empresa.uf}
              onChange={(e) => upEmpresa('uf', e.target.value.toUpperCase().slice(0, 2))}
            />
          </div>

          <ArquivoInput
            label="Cartão CNPJ (PDF, máx 5MB)"
            file={cartao}
            onChange={(f) => validarArquivo(f) && setCartao(f)}
          />
          <ArquivoInput
            label="Contrato Social (PDF, máx 5MB)"
            file={contrato}
            onChange={(f) => validarArquivo(f) && setContrato(f)}
          />

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setEtapa(1)} className="flex-1">
              Voltar
            </Button>
            <Button
              type="submit"
              loading={carregando}
              disabled={!etapa2Valida}
              className="flex-1"
            >
              Enviar cadastro
            </Button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ceres-muted">
        Já tem conta?{' '}
        <Link href="/login" className="font-semibold text-ceres-terracotta-dark hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}

function Passo({ n, atual, rotulo }: { n: Etapa; atual: Etapa; rotulo: string }) {
  const ativo = atual >= n;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          ativo ? 'bg-ceres-terracotta-dark text-white' : 'bg-ceres-sand-soft text-ceres-muted'
        }`}
      >
        {n}
      </span>
      <span className={`text-xs font-medium ${ativo ? 'text-ceres-dark' : 'text-ceres-muted'}`}>
        {rotulo}
      </span>
    </div>
  );
}

function ArquivoInput({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ceres-dark">{label}</label>
      <label className="mt-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-ceres-sand-soft bg-white px-4 py-3 text-sm transition-colors hover:border-ceres-terracotta-dark">
        <span className={file ? 'text-ceres-dark' : 'text-ceres-muted'}>
          {file ? file.name : 'Selecionar arquivo PDF'}
        </span>
        <span className="rounded-full bg-ceres-sand-soft px-3 py-1 text-xs font-medium text-ceres-terracotta-dark">
          Escolher
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
