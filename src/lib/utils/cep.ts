/**
 * Busca de endereço por CEP via ViaCEP (API pública gratuita).
 */

export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string; // cidade
  uf: string;
}

export function mascaraCEP(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/** Retorna o endereço ou null se CEP inválido / não encontrado. */
export async function buscarCEP(cep: string): Promise<EnderecoViaCEP | null> {
  const num = cep.replace(/\D/g, '');
  if (num.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${num}/json/`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      cep: data.cep,
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      localidade: data.localidade ?? '',
      uf: data.uf ?? '',
    };
  } catch {
    return null;
  }
}
