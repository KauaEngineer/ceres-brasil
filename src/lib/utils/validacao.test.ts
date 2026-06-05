import {
  forcaSenha,
  mascaraCNPJ,
  mascaraCPF,
  mascaraTelefone,
  validarCNPJ,
  validarCPF,
  validarEmail,
} from './validacao';

describe('validarCPF', () => {
  it('aceita CPFs válidos (com e sem máscara)', () => {
    expect(validarCPF('123.456.789-09')).toBe(true);
    expect(validarCPF('12345678909')).toBe(true);
    expect(validarCPF('529.982.247-25')).toBe(true);
  });

  it('rejeita CPFs com todos os dígitos iguais', () => {
    expect(validarCPF('111.111.111-11')).toBe(false);
    expect(validarCPF('000.000.000-00')).toBe(false);
  });

  it('rejeita CPFs com tamanho errado ou dígito inválido', () => {
    expect(validarCPF('123')).toBe(false);
    expect(validarCPF('123.456.789-00')).toBe(false);
    expect(validarCPF('')).toBe(false);
  });
});

describe('validarCNPJ', () => {
  it('aceita CNPJs válidos', () => {
    expect(validarCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validarCNPJ('11222333000181')).toBe(true);
  });

  it('rejeita CNPJs inválidos', () => {
    expect(validarCNPJ('00.000.000/0000-00')).toBe(false);
    expect(validarCNPJ('123')).toBe(false);
    expect(validarCNPJ('11.222.333/0001-00')).toBe(false);
  });
});

describe('validarEmail', () => {
  it('aceita e-mails válidos', () => {
    expect(validarEmail('a@b.co')).toBe(true);
    expect(validarEmail('contato@ceresbrasil.com.br')).toBe(true);
  });

  it('rejeita e-mails inválidos', () => {
    expect(validarEmail('semarroba.com')).toBe(false);
    expect(validarEmail('a@b')).toBe(false);
    expect(validarEmail('')).toBe(false);
    expect(validarEmail('com espaço@email.com')).toBe(false);
  });
});

describe('máscaras', () => {
  it('mascaraCPF formata progressivamente', () => {
    expect(mascaraCPF('12345678909')).toBe('123.456.789-09');
    expect(mascaraCPF('123')).toBe('123');
    expect(mascaraCPF('12345')).toBe('123.45');
  });

  it('mascaraCNPJ formata progressivamente', () => {
    expect(mascaraCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    expect(mascaraCNPJ('1122')).toBe('11.22');
  });

  it('mascaraTelefone formata celular brasileiro', () => {
    expect(mascaraTelefone('11924771165')).toBe('(11) 92477-1165');
    // máscara só dispara a partir de 3 dígitos
    expect(mascaraTelefone('11')).toBe('11');
    expect(mascaraTelefone('119')).toBe('(11) 9');
  });

  it('máscaras descartam não-dígitos e respeitam o tamanho máximo', () => {
    expect(mascaraCPF('abc12345678909999')).toBe('123.456.789-09');
    expect(mascaraTelefone('(11) abc')).toBe('11');
  });
});

describe('forcaSenha', () => {
  it('senha curta é fraca e não-ok', () => {
    const r = forcaSenha('123');
    expect(r.pontos).toBeLessThanOrEqual(1);
    expect(r.ok).toBe(false);
  });

  it('senha com 8+ caracteres + maiúsc/minúsc é considerada ok', () => {
    const r = forcaSenha('SenhaForte');
    expect(r.ok).toBe(true);
  });

  it('senha forte com tudo (8+, maiusc, número, símbolo) atinge 4 pontos', () => {
    const r = forcaSenha('Senha@123');
    expect(r.pontos).toBe(4);
    expect(r.rotulo).toBe('Muito forte');
  });
});
