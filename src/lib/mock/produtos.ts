/**
 * Dados mock dos produtos da Sua Marca.
 * Substituido pela integracao com o Bling na Sprint 4.
 *
 * Dados ilustrativos de produtos (template).
 * Precos sao aproximacao realista (a confirmar com o cliente).
 */

import type { Produto } from '@/types/produto';

const TABELA_PADRAO_MASSA = {
  porcao: '80g (massa crua)',
  calorias: 290,
  carboidratos: 48,
  proteinas: 16,
  gorduras: 3.5,
  gordurasSaturadas: 0.5,
  fibras: 8,
  sodio: 5,
};

const TABELA_PADRAO_FARINHA = {
  porcao: '30g',
  calorias: 110,
  carboidratos: 18,
  proteinas: 6,
  gorduras: 1.5,
  gordurasSaturadas: 0.2,
  fibras: 3.5,
  sodio: 2,
};

const TABELA_PADRAO_GRAO = {
  porcao: '50g (peso seco)',
  calorias: 175,
  carboidratos: 30,
  proteinas: 10,
  gorduras: 1.5,
  fibras: 5,
  sodio: 3,
};

export const produtosMock: Produto[] = [
  // ---------- MASSAS — Grão de Bico ----------
  {
    id: 'mock-1',
    slug: 'talharim-grao-de-bico-tradicional',
    nome: 'Talharim de Grão de Bico — Tradicional 200g',
    descricao: 'Massa artesanal feita 100% com farinha de grão de bico. Rica em proteína vegetal.',
    descricaoLonga:
      'Nosso talharim tradicional é feito apenas com farinha de grão de bico e água. Sem corantes, sem aditivos, sem glúten. Cozinhe em água fervente por 4 a 5 minutos e sirva com o molho de sua preferência. Cada porção entrega o equivalente em proteína a uma porção de carne magra.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 32,
    precoB2C: 22.9,
    precoB2B: 16.5,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    semLactose: true,
    tabelaNutricional: TABELA_PADRAO_MASSA,
    ingredientes: ['Farinha de grão de bico', 'Água'],
    destaque: true,
  },
  {
    id: 'mock-2',
    slug: 'talharim-grao-de-bico-funghi',
    nome: 'Talharim de Grão de Bico — Funghi 200g',
    descricao: 'Talharim de grão de bico com cogumelos funghi desidratados. Sabor terroso e profundo.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 18,
    precoB2C: 26.9,
    precoB2B: 19.5,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    semLactose: true,
    tabelaNutricional: TABELA_PADRAO_MASSA,
    ingredientes: ['Farinha de grão de bico', 'Funghi desidratado', 'Água'],
    destaque: true,
  },
  {
    id: 'mock-3',
    slug: 'talharim-grao-de-bico-tomate-seco',
    nome: 'Talharim de Grão de Bico — Tomate Seco 200g',
    descricao: 'Variante com tomate seco moído na massa. Ótimo com azeite e queijo ralado.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 24,
    precoB2C: 26.9,
    precoB2B: 19.5,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: TABELA_PADRAO_MASSA,
    ingredientes: ['Farinha de grão de bico', 'Tomate seco', 'Água'],
    destaque: true,
  },
  {
    id: 'mock-4',
    slug: 'talharim-grao-de-bico-espinafre',
    nome: 'Talharim de Grão de Bico — Espinafre 200g',
    descricao: 'Talharim com espinafre desidratado, ainda mais rico em ferro.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 15,
    precoB2C: 26.9,
    precoB2B: 19.5,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: TABELA_PADRAO_MASSA,
    ingredientes: ['Farinha de grão de bico', 'Espinafre desidratado', 'Água'],
  },

  // ---------- MASSAS — Lentilha ----------
  {
    id: 'mock-5',
    slug: 'talharim-lentilha-vermelha',
    nome: 'Talharim de Lentilha Vermelha 200g',
    descricao: 'Massa fina feita 100% com farinha de lentilha vermelha. Cor vibrante e sabor delicado.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 26,
    precoB2C: 24.9,
    precoB2B: 17.9,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_MASSA, proteinas: 18, fibras: 7 },
    ingredientes: ['Farinha de lentilha vermelha', 'Água'],
    destaque: true,
  },
  {
    id: 'mock-6',
    slug: 'talharim-lentilha-amarela',
    nome: 'Talharim de Lentilha Amarela 200g',
    descricao: 'Variedade clara de lentilha, sabor mais suave que a vermelha.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 12,
    precoB2C: 24.9,
    precoB2B: 17.9,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_MASSA, proteinas: 18, fibras: 7 },
    ingredientes: ['Farinha de lentilha amarela', 'Água'],
  },
  {
    id: 'mock-7',
    slug: 'fusilli-lentilha-vermelha',
    nome: 'Fusilli de Lentilha Vermelha 200g',
    descricao: 'Formato em espiral, perfeito pra segurar molhos. 100% lentilha vermelha.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 20,
    precoB2C: 24.9,
    precoB2B: 17.9,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_MASSA, proteinas: 18, fibras: 7 },
    ingredientes: ['Farinha de lentilha vermelha', 'Água'],
    destaque: true,
  },
  {
    id: 'mock-8',
    slug: 'fusilli-lentilha-amarela',
    nome: 'Fusilli de Lentilha Amarela 200g',
    descricao: 'Fusilli leve de lentilha amarela, ótimo em saladas frias.',
    categoria: 'massas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 0, // demonstrando estado "esgotado"
    precoB2C: 24.9,
    precoB2B: 17.9,
    pesoGramas: 200,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_MASSA, proteinas: 18, fibras: 7 },
    ingredientes: ['Farinha de lentilha amarela', 'Água'],
  },

  // ---------- FARINHAS ----------
  {
    id: 'mock-9',
    slug: 'farinha-grao-de-bico',
    nome: 'Farinha de Grão de Bico 500g',
    descricao: 'Farinha integral de grão de bico, ideal para panquecas, pães e empanados.',
    categoria: 'farinhas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 40,
    precoB2C: 18.9,
    precoB2B: 13.5,
    pesoGramas: 500,
    vegano: true,
    semGluten: true,
    tabelaNutricional: TABELA_PADRAO_FARINHA,
    ingredientes: ['Grão de bico moído'],
    destaque: true,
  },
  {
    id: 'mock-10',
    slug: 'farinha-lentilha-vermelha',
    nome: 'Farinha de Lentilha Vermelha 500g',
    descricao: 'Farinha clara, ótima pra engrossar caldos e fazer panquecas proteicas.',
    categoria: 'farinhas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 28,
    precoB2C: 19.9,
    precoB2B: 14.5,
    pesoGramas: 500,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_FARINHA, proteinas: 7 },
    ingredientes: ['Lentilha vermelha moída'],
  },
  {
    id: 'mock-11',
    slug: 'mix-de-farinhas-sem-gluten',
    nome: 'Mix de Farinhas Sem Glúten 500g',
    descricao: 'Blend de farinhas para substituir farinha de trigo em receitas tradicionais.',
    categoria: 'farinhas',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 22,
    precoB2C: 21.9,
    precoB2B: 16.0,
    pesoGramas: 500,
    vegano: true,
    semGluten: true,
    tabelaNutricional: TABELA_PADRAO_FARINHA,
    ingredientes: ['Farinha de arroz', 'Farinha de grão de bico', 'Polvilho doce', 'Goma xantana'],
  },

  // ---------- GRÃOS E CEREAIS ----------
  {
    id: 'mock-12',
    slug: 'grao-de-bico-cozido-em-graos-500g',
    nome: 'Grão de Bico Premium 500g',
    descricao: 'Grãos selecionados, calibre uniforme. Para humus, saladas e pratos quentes.',
    categoria: 'graos',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 35,
    precoB2C: 16.9,
    precoB2B: 11.5,
    pesoGramas: 500,
    vegano: true,
    semGluten: true,
    tabelaNutricional: TABELA_PADRAO_GRAO,
    ingredientes: ['Grão de bico'],
  },
  {
    id: 'mock-13',
    slug: 'lentilha-vermelha-500g',
    nome: 'Lentilha Vermelha 500g',
    descricao: 'Lentilha sem casca, cozinha em 10 minutos. Cremosa quando desmancha.',
    categoria: 'graos',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 18,
    precoB2C: 19.9,
    precoB2B: 14.0,
    pesoGramas: 500,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_GRAO, proteinas: 12 },
    ingredientes: ['Lentilha vermelha sem casca'],
  },
  {
    id: 'mock-14',
    slug: 'quinoa-tricolor-300g',
    nome: 'Quinoa Tricolor 300g',
    descricao: 'Mistura de quinoa branca, vermelha e preta. Cereal completo, rico em aminoácidos.',
    categoria: 'graos',
    fotos: ['/produto-exemplo.png'],
    ativo: true,
    estoque: 14,
    precoB2C: 32.9,
    precoB2B: 24.0,
    pesoGramas: 300,
    vegano: true,
    semGluten: true,
    tabelaNutricional: { ...TABELA_PADRAO_GRAO, proteinas: 12, calorias: 195 },
    ingredientes: ['Quinoa branca', 'Quinoa vermelha', 'Quinoa preta'],
  },
];

/* ---------- helpers ---------- */

export function listarProdutos(categoria?: string): Produto[] {
  if (!categoria) return produtosMock.filter((p) => p.ativo);
  return produtosMock.filter((p) => p.ativo && p.categoria === categoria);
}

export function buscarProdutoPorSlug(slug: string): Produto | undefined {
  return produtosMock.find((p) => p.slug === slug);
}

export function listarDestaques(limite = 6): Produto[] {
  return produtosMock.filter((p) => p.ativo && p.destaque).slice(0, limite);
}

export function listarRelacionados(produto: Produto, limite = 4): Produto[] {
  return produtosMock
    .filter((p) => p.ativo && p.id !== produto.id && p.categoria === produto.categoria)
    .slice(0, limite);
}

export function todosSlugs(): string[] {
  return produtosMock.filter((p) => p.ativo).map((p) => p.slug);
}
