import { mascaraCEP } from './cep';

describe('mascaraCEP', () => {
  it('formata 00000-000', () => {
    expect(mascaraCEP('05501000')).toBe('05501-000');
  });

  it('mantém parcial quando ainda não tem 6 dígitos', () => {
    expect(mascaraCEP('123')).toBe('123');
  });

  it('descarta caracteres não-numéricos e corta no 8º dígito', () => {
    expect(mascaraCEP('05501-000xyz999')).toBe('05501-000');
  });
});
