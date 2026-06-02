import { calcularQuantidadeTotal, calcularTotal, type ItemCarrinho } from './useCarrinho';

function item(over: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return {
    produtoId: 'p1',
    slug: 'produto-um',
    nome: 'Produto 1',
    foto: '/produto-exemplo.png',
    preco: 10,
    estoque: 100,
    quantidade: 1,
    ...over,
  };
}

describe('calcularTotal', () => {
  it('soma preço × quantidade de cada item', () => {
    const itens = [item({ preco: 10, quantidade: 2 }), item({ preco: 25, quantidade: 3 })];
    // 20 + 75 = 95
    expect(calcularTotal(itens)).toBe(95);
  });

  it('retorna 0 para carrinho vazio', () => {
    expect(calcularTotal([])).toBe(0);
  });
});

describe('calcularQuantidadeTotal', () => {
  it('soma quantidades de todos os itens', () => {
    const itens = [item({ quantidade: 2 }), item({ quantidade: 3 })];
    expect(calcularQuantidadeTotal(itens)).toBe(5);
  });
});
