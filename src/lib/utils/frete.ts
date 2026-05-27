/**
 * Cálculo de frete SIMULADO (mock). Substituir pela Frenet quando houver token.
 * Mantém o mesmo formato de retorno que a Frenet usaria, pra a troca ser fácil.
 */

export interface OpcaoFrete {
  id: string;
  transportadora: string;
  prazoDias: number;
  valor: number;
}

const FRETE_GRATIS_ACIMA_DE = 200;

/**
 * Retorna opções de frete a partir do CEP e do subtotal.
 * Hoje é mock determinístico; a Frenet retornaria algo equivalente.
 */
export function calcularFreteMock(cepDestino: string, subtotal: number): OpcaoFrete[] {
  const num = cepDestino.replace(/\D/g, '');
  if (num.length !== 8) return [];

  // Varia um pouco pelo "início" do CEP só pra parecer real
  const regiao = Number(num[0]);
  const base = 16 + regiao * 1.5;

  const gratis = subtotal >= FRETE_GRATIS_ACIMA_DE;

  return [
    {
      id: 'pac',
      transportadora: 'Correios PAC',
      prazoDias: 7 + (regiao > 5 ? 3 : 0),
      valor: gratis ? 0 : Math.round(base * 100) / 100,
    },
    {
      id: 'sedex',
      transportadora: 'Correios SEDEX',
      prazoDias: 3 + (regiao > 5 ? 2 : 0),
      valor: Math.round(base * 1.8 * 100) / 100,
    },
  ];
}
