/**
 * Tipos do dominio "produto". Espelha (em parte) o schema da tabela produtos
 * em src/lib/supabase/schema.sql. Quando integrarmos com o Bling (Sprint 4),
 * trocamos a fonte mas mantemos esse contrato.
 */

export type CategoriaProduto = 'massas' | 'farinhas' | 'graos';

export interface CategoriaInfo {
  slug: CategoriaProduto;
  rotulo: string;
  rotuloPlural: string;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { slug: 'massas', rotulo: 'Massa', rotuloPlural: 'Massas' },
  { slug: 'farinhas', rotulo: 'Farinha', rotuloPlural: 'Farinhas' },
  { slug: 'graos', rotulo: 'Grão', rotuloPlural: 'Grãos e Cereais' },
];

/**
 * Tabela nutricional padrao ANVISA (porcao + macros + sodio + fibras).
 * Valores em gramas, exceto calorias (kcal) e sodio (mg).
 */
export interface TabelaNutricional {
  porcao: string;
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
  gordurasSaturadas?: number;
  fibras: number;
  sodio: number;
}

export interface Produto {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  descricaoLonga?: string;
  categoria: CategoriaProduto;
  fotos: string[]; // urls; placeholder ate ter fotos reais
  ativo: boolean;
  estoque: number;
  precoB2C: number; // em reais
  precoB2B?: number; // preco para revendedores (PJ aprovada)
  pesoGramas: number;
  vegano: boolean;
  semGluten: boolean;
  semLactose?: boolean;
  tabelaNutricional: TabelaNutricional;
  ingredientes: string[];
  destaque?: boolean; // aparece na home
}
