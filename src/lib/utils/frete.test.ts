import { calcularFreteMock } from './frete';

describe('calcularFreteMock', () => {
  it('retorna lista vazia para CEP inválido', () => {
    expect(calcularFreteMock('123', 100)).toEqual([]);
    expect(calcularFreteMock('', 100)).toEqual([]);
  });

  it('retorna PAC e SEDEX para CEP válido', () => {
    const ops = calcularFreteMock('05501000', 50);
    expect(ops).toHaveLength(2);
    const ids = ops.map((o) => o.id);
    expect(ids).toContain('pac');
    expect(ids).toContain('sedex');
  });

  it('PAC é grátis quando o subtotal atinge o limite', () => {
    const ops = calcularFreteMock('05501000', 250);
    const pac = ops.find((o) => o.id === 'pac');
    expect(pac?.valor).toBe(0);
  });

  it('SEDEX é mais rápido (prazo menor) e mais caro que PAC', () => {
    const ops = calcularFreteMock('05501000', 50);
    const pac = ops.find((o) => o.id === 'pac')!;
    const sedex = ops.find((o) => o.id === 'sedex')!;
    expect(sedex.prazoDias).toBeLessThan(pac.prazoDias);
    expect(sedex.valor).toBeGreaterThan(pac.valor);
  });
});
