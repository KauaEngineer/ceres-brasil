import { formatarPreco, formatarData, STATUS_INFO, TIMELINE } from './pedido';

describe('formatarPreco', () => {
  it('formata em BRL', () => {
    //   é o "non-breaking space" que o Intl usa entre R$ e o número em pt-BR
    expect(formatarPreco(22.9)).toBe('R$ 22,90');
    expect(formatarPreco(0)).toBe('R$ 0,00');
    expect(formatarPreco(1234.5)).toBe('R$ 1.234,50');
  });
});

describe('formatarData', () => {
  it('formata uma data ISO em dd/MM/yyyy', () => {
    expect(formatarData('2026-05-27T12:00:00Z')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('STATUS_INFO + TIMELINE', () => {
  it('tem rótulo e classe pra cada status do enum', () => {
    for (const s of TIMELINE) {
      expect(STATUS_INFO[s]).toBeDefined();
      expect(STATUS_INFO[s].rotulo).toBeTruthy();
    }
  });

  it('TIMELINE tem 5 etapas (pendente → entregue), cancelado fora', () => {
    expect(TIMELINE).toHaveLength(5);
    expect(TIMELINE).not.toContain('cancelado');
  });
});
