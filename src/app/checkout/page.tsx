'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { calcularTotal, useCarrinho } from '@/hooks/useCarrinho';
import { createClient } from '@/lib/supabase/client';
import { buscarCEP, mascaraCEP } from '@/lib/utils/cep';
import { calcularFreteMock, type OpcaoFrete } from '@/lib/utils/frete';
import { formatarPreco } from '@/lib/utils/pedido';

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
}

type Pagamento = 'pix' | 'cartao' | 'boleto';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const { itens, modo, limparCarrinho } = useCarrinho();
  const ehB2B = modo === 'b2b';

  const [montado, setMontado] = useState(false);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [user, setUser] = useState<{ email: string; nome: string } | null>(null);

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoId, setEnderecoId] = useState<string | null>(null);
  const [novo, setNovo] = useState({ cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '' });
  const [usarNovo, setUsarNovo] = useState(false);

  const [freteOpcoes, setFreteOpcoes] = useState<OpcaoFrete[]>([]);
  const [freteId, setFreteId] = useState<string | null>(null);
  const [pagamento, setPagamento] = useState<Pagamento>('pix');
  const [processando, setProcessando] = useState(false);

  // Frete B2B — por conta do destinatário (não cobrado no checkout)
  type FreteB2BTipo = 'transportadora_propria' | 'cotacao_ceres';
  const [freteB2BTipo, setFreteB2BTipo] = useState<FreteB2BTipo>('transportadora_propria');
  const [transportadora, setTransportadora] = useState('');
  const [transpObs, setTranspObs] = useState('');

  const subtotal = calcularTotal(itens);
  const freteSel = freteOpcoes.find((f) => f.id === freteId);
  // No B2B o frete é "a combinar" (R$ 0 no fechamento); no B2C soma o frete escolhido.
  const total = subtotal + (ehB2B ? 0 : (freteSel?.valor ?? 0));

  useEffect(() => {
    setMontado(true);
    (async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (u) {
        const { data: p } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', u.id)
          .maybeSingle();
        setUser({ email: u.email ?? '', nome: p?.nome ?? '' });
        const { data: ends } = await supabase
          .from('enderecos')
          .select('*')
          .order('padrao', { ascending: false });
        const lista = (ends as Endereco[]) ?? [];
        setEnderecos(lista);
        if (lista[0]) setEnderecoId(lista[0].id);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalcula frete quando o endereço/CEP muda
  function calcularFrete(cep: string) {
    const ops = calcularFreteMock(cep, subtotal);
    setFreteOpcoes(ops);
    setFreteId(ops[0]?.id ?? null);
  }

  async function handleCepNovo(valor: string) {
    const masked = mascaraCEP(valor);
    setNovo((n) => ({ ...n, cep: masked }));
    if (masked.length === 9) {
      const end = await buscarCEP(masked);
      if (end) {
        setNovo((n) => ({
          ...n,
          logradouro: end.logradouro,
          bairro: end.bairro,
          cidade: end.localidade,
          uf: end.uf,
        }));
      }
      calcularFrete(masked);
    }
  }

  function avancarEntrega() {
    const end = usarNovo ? novo : enderecos.find((e) => e.id === enderecoId);
    if (!end || !end.cep || end.cep.replace(/\D/g, '').length !== 8) {
      toast('Informe um endereço com CEP válido.', 'erro');
      return;
    }
    if (ehB2B) {
      if (freteB2BTipo === 'transportadora_propria' && !transportadora.trim()) {
        toast('Informe o nome da transportadora.', 'erro');
        return;
      }
    } else if (freteOpcoes.length === 0) {
      calcularFrete(end.cep);
    }
    setEtapa(3);
  }

  /** Texto legível do frete B2B, guardado no pedido para o admin acionar. */
  function montarFreteObs(): string {
    if (freteB2BTipo === 'transportadora_propria') {
      const base = `Transportadora do cliente: ${transportadora.trim()}`;
      return transpObs.trim() ? `${base} — ${transpObs.trim()}` : base;
    }
    return 'Cotação Ceres — aguardando opção mais econômica para aprovação do cliente.';
  }

  async function finalizar() {
    const end = usarNovo ? novo : enderecos.find((e) => e.id === enderecoId);
    if (!end || (!ehB2B && !freteSel)) {
      toast('Endereço ou frete não selecionado.', 'erro');
      return;
    }
    setProcessando(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itens: itens.map((i) => ({ nome: i.nome, slug: i.slug, preco: i.preco, quantidade: i.quantidade })),
        endereco: end,
        // B2B: frete a combinar (valor 0) + observação de como será arranjado
        frete: ehB2B ? { valor: 0, prazoDias: null } : freteSel,
        freteObs: ehB2B ? montarFreteObs() : undefined,
        pagamento,
        modo,
      }),
    });
    setProcessando(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Erro' }));
      toast(error ?? 'Falha ao finalizar o pedido.', 'erro');
      return;
    }
    const { id } = await res.json();
    limparCarrinho();
    router.push(`/pedido-confirmado?id=${id}`);
  }

  // Carrinho vazio
  if (montado && itens.length === 0) {
    return (
      <div className="container-ceres py-20 text-center">
        <h1 className="text-2xl font-light text-ceres-dark">Seu carrinho está vazio</h1>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  // Precisa estar logado (checkout simplificado da demo)
  if (montado && !user) {
    return (
      <div className="container-ceres py-20 text-center">
        <h1 className="text-2xl font-light text-ceres-dark">Entre para finalizar a compra</h1>
        <p className="mt-2 text-sm text-ceres-muted">
          Você precisa estar logado para concluir o pedido.
        </p>
        <Link
          href="/login?redirect=/checkout"
          className="mt-6 inline-block rounded-full bg-ceres-terracotta-dark px-6 py-3 text-sm font-semibold text-white"
        >
          Fazer login
        </Link>
      </div>
    );
  }

  return (
    <div className="container-ceres py-10 md:py-14">
      {ehB2B && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-ceres-teal/40 bg-ceres-teal/10 px-4 py-3 text-sm text-ceres-dark">
          <span className="rounded-full bg-ceres-teal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Revenda
          </span>
          Pedido de revenda (B2B) — caixas fechadas com preço de atacado.
        </div>
      )}

      {/* Barra de progresso */}
      <div className="mb-8 flex items-center gap-2">
        {['Identificação', 'Entrega', 'Pagamento'].map((rotulo, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const ativo = etapa >= n;
          return (
            <div key={rotulo} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  ativo ? 'bg-ceres-terracotta-dark text-white' : 'bg-white text-ceres-muted'
                }`}
              >
                {n}
              </span>
              <span className={`text-xs ${ativo ? 'font-medium text-ceres-dark' : 'text-ceres-muted'}`}>
                {rotulo}
              </span>
              {i < 2 && <span className="h-px flex-1 bg-ceres-terracotta-dark/15" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* ETAPA 1 — Identificação */}
          {etapa === 1 && (
            <section className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
              <h2 className="text-lg font-medium text-ceres-dark">Identificação</h2>
              <p className="mt-3 text-sm text-ceres-muted">
                Logado como <strong className="text-ceres-dark">{user?.nome || user?.email}</strong>
                <br />
                {user?.email}
              </p>
              <Button className="mt-5" onClick={() => setEtapa(2)}>
                Continuar
              </Button>
            </section>
          )}

          {/* ETAPA 2 — Entrega */}
          {etapa === 2 && (
            <section className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
              <h2 className="text-lg font-medium text-ceres-dark">Endereço de entrega</h2>

              <div className="mt-4 space-y-2">
                {enderecos.map((e) => (
                  <label
                    key={e.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                      !usarNovo && enderecoId === e.id
                        ? 'border-ceres-terracotta-dark bg-ceres-sand-soft/40'
                        : 'border-ceres-sand-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name="endereco"
                      checked={!usarNovo && enderecoId === e.id}
                      onChange={() => {
                        setUsarNovo(false);
                        setEnderecoId(e.id);
                        calcularFrete(e.cep);
                      }}
                      className="mt-1 accent-ceres-terracotta-dark"
                    />
                    <span className="text-sm text-ceres-dark">
                      {e.apelido ? `${e.apelido} — ` : ''}
                      {e.logradouro}, {e.numero} · {e.cidade}/{e.uf} · {e.cep}
                    </span>
                  </label>
                ))}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ceres-sand-soft p-3">
                  <input
                    type="radio"
                    name="endereco"
                    checked={usarNovo}
                    onChange={() => setUsarNovo(true)}
                    className="accent-ceres-terracotta-dark"
                  />
                  <span className="text-sm text-ceres-dark">Usar um novo endereço</span>
                </label>
              </div>

              {usarNovo && (
                <div className="mt-4 space-y-3">
                  <Input label="CEP" value={novo.cep} onChange={(e) => handleCepNovo(e.target.value)} placeholder="00000-000" inputMode="numeric" />
                  <Input label="Logradouro" value={novo.logradouro} onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Número" value={novo.numero} onChange={(e) => setNovo({ ...novo, numero: e.target.value })} />
                    <Input label="Cidade" value={novo.cidade} onChange={(e) => setNovo({ ...novo, cidade: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Frete B2B — por conta do destinatário */}
              {ehB2B ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-ceres-dark">Frete</h3>
                  <p className="mt-1 text-xs text-ceres-muted">
                    Pedidos de revenda são enviados pela transportadora do cliente (frete por
                    conta do destinatário).
                  </p>

                  <div className="mt-3 space-y-2">
                    {/* Opção 1 — transportadora própria */}
                    <label
                      className={`block cursor-pointer rounded-xl border p-3 ${
                        freteB2BTipo === 'transportadora_propria'
                          ? 'border-ceres-terracotta-dark bg-ceres-sand-soft/40'
                          : 'border-ceres-sand-soft'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <input
                          type="radio"
                          name="freteB2B"
                          checked={freteB2BTipo === 'transportadora_propria'}
                          onChange={() => setFreteB2BTipo('transportadora_propria')}
                          className="accent-ceres-terracotta-dark"
                        />
                        <span>
                          <span className="font-medium text-ceres-dark">Já tenho transportadora</span>
                          <span className="block text-xs text-ceres-muted">
                            Acionamos a transportadora e solicitamos a coleta.
                          </span>
                        </span>
                      </span>

                      {freteB2BTipo === 'transportadora_propria' && (
                        <div className="mt-3 space-y-3 pl-7">
                          <Input
                            label="Nome da transportadora"
                            value={transportadora}
                            onChange={(e) => setTransportadora(e.target.value)}
                            placeholder="Ex.: Braspress, Jamef…"
                          />
                          <Input
                            label="Observações (opcional)"
                            value={transpObs}
                            onChange={(e) => setTranspObs(e.target.value)}
                            placeholder="Nº de cadastro, condições combinadas…"
                          />
                        </div>
                      )}
                    </label>

                    {/* Opção 2 — cotação pela Ceres */}
                    <label
                      className={`block cursor-pointer rounded-xl border p-3 ${
                        freteB2BTipo === 'cotacao_ceres'
                          ? 'border-ceres-terracotta-dark bg-ceres-sand-soft/40'
                          : 'border-ceres-sand-soft'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <input
                          type="radio"
                          name="freteB2B"
                          checked={freteB2BTipo === 'cotacao_ceres'}
                          onChange={() => setFreteB2BTipo('cotacao_ceres')}
                          className="accent-ceres-terracotta-dark"
                        />
                        <span>
                          <span className="font-medium text-ceres-dark">
                            Quero que a Ceres cote o frete
                          </span>
                          <span className="block text-xs text-ceres-muted">
                            Cotamos com nossas parceiras e enviamos a opção mais econômica para
                            sua aprovação antes de despachar.
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                freteOpcoes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-ceres-dark">Frete</h3>
                    <div className="mt-2 space-y-2">
                      {freteOpcoes.map((f) => (
                        <label
                          key={f.id}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${
                            freteId === f.id ? 'border-ceres-terracotta-dark bg-ceres-sand-soft/40' : 'border-ceres-sand-soft'
                          }`}
                        >
                          <span className="flex items-center gap-3 text-sm text-ceres-dark">
                            <input
                              type="radio"
                              name="frete"
                              checked={freteId === f.id}
                              onChange={() => setFreteId(f.id)}
                              className="accent-ceres-terracotta-dark"
                            />
                            {f.transportadora} · {f.prazoDias} dias úteis
                          </span>
                          <span className="text-sm font-semibold text-ceres-dark">
                            {f.valor === 0 ? 'Grátis' : formatarPreco(f.valor)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="ghost" onClick={() => setEtapa(1)}>
                  Voltar
                </Button>
                <Button onClick={avancarEntrega}>Continuar</Button>
              </div>
            </section>
          )}

          {/* ETAPA 3 — Pagamento */}
          {etapa === 3 && (
            <section className="rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6">
              <h2 className="text-lg font-medium text-ceres-dark">Pagamento</h2>
              <p className="mt-1 text-xs text-ceres-muted">
                Pagamento simulado nesta demo. Integração Mercado Pago quando houver conta.
              </p>

              <div className="mt-4 space-y-2">
                {(
                  [
                    { id: 'pix', label: 'Pix', desc: 'Aprovação na hora' },
                    { id: 'cartao', label: 'Cartão de crédito', desc: 'Em até 12x' },
                    { id: 'boleto', label: 'Boleto', desc: 'Vence em 3 dias' },
                  ] as const
                ).map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                      pagamento === m.id ? 'border-ceres-terracotta-dark bg-ceres-sand-soft/40' : 'border-ceres-sand-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pagamento"
                      checked={pagamento === m.id}
                      onChange={() => setPagamento(m.id)}
                      className="accent-ceres-terracotta-dark"
                    />
                    <span className="text-sm">
                      <span className="font-medium text-ceres-dark">{m.label}</span>
                      <span className="block text-xs text-ceres-muted">{m.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="ghost" onClick={() => setEtapa(2)}>
                  Voltar
                </Button>
                <Button loading={processando} onClick={finalizar}>
                  Finalizar pedido
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Resumo do carrinho */}
        <aside className="h-fit rounded-2xl border border-ceres-terracotta-dark/15 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-medium text-ceres-dark">Resumo</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {itens.map((i) => (
              <li key={i.produtoId} className="flex justify-between gap-2 text-ceres-muted">
                <span>
                  {i.quantidade}× {i.nome}
                </span>
                <span className="shrink-0">{formatarPreco(i.preco * i.quantidade)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-ceres-sand-soft pt-4 text-sm">
            <div className="flex justify-between text-ceres-muted">
              <span>Subtotal</span>
              <span>{formatarPreco(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ceres-muted">
              <span>Frete</span>
              <span>
                {ehB2B
                  ? 'A combinar'
                  : freteSel
                    ? freteSel.valor === 0
                      ? 'Grátis'
                      : formatarPreco(freteSel.valor)
                    : '—'}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold text-ceres-dark">
              <span>Total</span>
              <span>{formatarPreco(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
