/**
 * Validações e máscaras reutilizáveis (CPF, CNPJ, e-mail, telefone, senha).
 */

/** Valida CPF pelo dígito verificador. Aceita com ou sem máscara. */
export function validarCPF(cpf: string): boolean {
  const num = cpf.replace(/\D/g, '');
  if (num.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(num)) return false; // todos iguais

  const calcDigito = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDigito(num.slice(0, 9), 10);
  const d2 = calcDigito(num.slice(0, 10), 11);
  return d1 === parseInt(num[9], 10) && d2 === parseInt(num[10], 10);
}

/** Valida CNPJ pelo dígito verificador. Aceita com ou sem máscara. */
export function validarCNPJ(cnpj: string): boolean {
  const num = cnpj.replace(/\D/g, '');
  if (num.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(num)) return false;

  const calc = (base: string) => {
    const pesos =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += parseInt(base[i], 10) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calc(num.slice(0, 12));
  const d2 = calc(num.slice(0, 13));
  return d1 === parseInt(num[12], 10) && d2 === parseInt(num[13], 10);
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Máscara progressiva de CPF: 000.000.000-00 */
export function mascaraCPF(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** Máscara progressiva de CNPJ: 00.000.000/0000-00 */
export function mascaraCNPJ(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/** Máscara de telefone: (00) 00000-0000 */
export function mascaraTelefone(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export interface ForcaSenha {
  pontos: 0 | 1 | 2 | 3 | 4;
  rotulo: 'Muito fraca' | 'Fraca' | 'Média' | 'Forte' | 'Muito forte';
  ok: boolean;
}

/** Avalia força da senha: comprimento, maiúscula, número, símbolo. */
export function forcaSenha(senha: string): ForcaSenha {
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  const rotulos = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'] as const;
  return {
    pontos: pontos as ForcaSenha['pontos'],
    rotulo: rotulos[pontos],
    ok: pontos >= 2 && senha.length >= 8,
  };
}
