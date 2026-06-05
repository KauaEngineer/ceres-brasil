/**
 * Configuração central da MARCA (placeholder).
 *
 * Este projeto é um template de e-commerce. Todos os dados abaixo são
 * ilustrativos — troque por uma marca real em um único lugar. Mantido aqui
 * pra não espalhar nome/contatos pelo código.
 */
export const BRAND = {
  nome: 'Sua Marca',
  tagline: 'Template de e-commerce B2C + B2B',
  descricao:
    'Loja modelo (B2C + B2B) — substitua por uma marca real. Projeto de demonstração.',

  // Contatos — valores ilustrativos
  whatsappNumero: '5500000000000', // só dígitos, usado no link wa.me
  whatsappDisplay: '(00) 00000-0000',
  instagramHandle: '@suamarca',
  instagramUrl: 'https://instagram.com/',
  email: 'contato@suamarca.com.br',

  // Endereço — ilustrativo
  enderecoLinha1: 'Sua Rua, 000',
  enderecoLinha2: 'Bairro, Cidade — UF',
  cidade: 'Cidade — UF',
  cnpj: '00.000.000/0000-00',
} as const;

/** Link de WhatsApp já montado, com mensagem opcional. */
export function whatsappLink(mensagem?: string): string {
  const base = `https://wa.me/${BRAND.whatsappNumero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
