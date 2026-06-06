# Ceres Brasil — E-commerce B2C + B2B

E-commerce completo para uma marca real de alimentos sem glúten, com **loja para consumidor final (B2C)** e **portal de revenda atacadista (B2B)** no mesmo sistema — dois modelos de negócio, uma única base de código.

🔗 **[Ver demo ao vivo →](https://ceres-brasil.vercel.app)**

![Home — catálogo e categorias](https://github.com/user-attachments/assets/51680c7e-11b9-420d-b858-fc43f0f18508)

> **Contexto:** build de portfólio baseado na identidade de uma marca real (com autorização do dono). Pagamento, frete e integrações com ERP estão **simulados** — o objetivo é demonstrar arquitetura, modelagem de regras de negócio e UX completo, não processar transações reais.

---

## Screenshots

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/12086398-3ea3-425b-a2bc-ce6305ec0771" alt="Checkout B2B — frete FOB e desconto Pix"/><br/><sub>Checkout B2B — frete FOB e desconto Pix</sub></td>
    <td><img src="https://github.com/user-attachments/assets/9fbd967a-a34e-450e-9214-b59184c82701" alt="Painel administrativo"/><br/><sub>Painel administrativo</sub></td>
  </tr>
</table>

---

## O que tem de diferente aqui

A maioria dos projetos de portfólio é uma loja B2C simples com CRUD. Este vai além: implementa **dois modelos de negócio com regras distintas convivendo no mesmo app**.

### Gate de acesso B2B (a decisão mais interessante)
O catálogo é público para qualquer visitante. Mas **preços de revenda e botão de compra B2B só aparecem para empresas com cadastro aprovado** — verificado no servidor a cada request, reforçado por Row Level Security no Postgres. A UI esconde, mas a API e o banco decidem: um cliente mal-intencionado que burlar o front ainda leva um 403.

### Carrinho com modo B2C/B2B
O mesmo hook `useCarrinho` (Zustand) opera em dois modos. No B2B, os itens são vendidos em caixa fechada (12 un.), com preço de atacado e nome prefixado. Trocar de modo limpa o carrinho — não dá pra misturar varejo com revenda.

### Frete FOB no checkout B2B
No varejo, o frete é calculado por CEP (Correios). Na revenda, a lógica é diferente: o comprador informa a transportadora própria ou solicita cotação — espelhando como o atacado funciona de verdade. O campo `frete_obs` fica registrado no pedido para o admin.

### Demo que não quebra
O painel admin é totalmente visível na demo, mas as ações que modificam dados retornam 403 no servidor e mostram um toast explicativo. Reset diário automático via Vercel Cron mantém o banco limpo. Resultado: qualquer recrutador ou visitante consegue explorar o sistema sem estragar o estado.

---

## Funcionalidades

**Loja B2C**
- Catálogo com filtro por categoria + busca, página de produto com tabela nutricional
- ISR (revalidação a cada 10 min), SSG para as 24 páginas de produto
- Checkout em 3 etapas: endereço → frete (Correios) → pagamento (Pix / Cartão / Boleto)
- Área do cliente: histórico de pedidos com timeline, endereços (CRUD), dados da conta

**Portal B2B**
- Cadastro PJ em 2 etapas com upload de documentos (CNPJ, contrato social)
- Gate de acesso por aprovação manual — catálogo público, preços protegidos
- Venda em caixa fechada (12 un.) com preço de atacado
- Condições de pagamento: Pix com 5% de desconto ou boleto 28 dias corridos
- Frete FOB: transportadora própria ou solicitação de cotação

**Painel administrativo** (`/admin`)
- Dashboard com métricas e gráficos (pedidos, receita, clientes)
- Gestão de pedidos: atualização de status, rastreio, exportação CSV
- Aprovação / rejeição de clientes PJ com visualização de documentos (signed URLs)
- Relatórios: comparativo B2C × B2B, top produtos

---

## 🔐 Acessar a demo

| Perfil | E-mail | Senha | O que explorar |
|--------|--------|-------|----------------|
| **Cliente B2C** | `demo@ceresbrasil.com.br` | `demo12345` | Loja, carrinho, checkout, conta |
| **Revendedor B2B** | `demo-pj@ceresbrasil.com.br` | `demo12345` | Preços de atacado, caixa fechada, frete FOB |
| **Admin** | `demo@ceresbrasil.com.br` | `demo12345` | Painel em `/admin` — mesma conta, também é admin |

---

## Stack

| Camada | Tecnologia | Decisão |
|--------|-----------|---------|
| Framework | **Next.js 16** (App Router + Server Components) | SSR/ISR/SSG por rota, proteção via `proxy.ts` |
| Linguagem | **TypeScript** (strict, zero `any`) | Contratos explícitos entre UI, API e domínio |
| Estilo | **Tailwind CSS 4** | Paletas distintas: terracota (B2C) e charcoal/teal (B2B) |
| Banco | **Supabase** (Postgres + Auth + Storage + RLS) | Segurança no banco, não só na aplicação |
| Estado | **Zustand** | Carrinho leve com modo B2C/B2B e persistência em localStorage |
| Testes | **Jest + Testing Library** | Regras de negócio: validação, cálculo de frete, lógica do carrinho |
| Deploy | **Vercel** + Cron Jobs | CI/CD automático + reset diário da demo |

---

## Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env.local
# preencha: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# 3. Schema no Supabase
# SQL Editor → rode src/lib/supabase/schema.sql
# depois as migrations em src/lib/supabase/migrations/ (ordem numérica)

# 4. Contas de demo (opcional)
node scripts/seed-demo.mjs       # cliente B2C
node scripts/seed-demo-pj.mjs    # revendedor B2B aprovado
node scripts/seed-admin.mjs      # promove conta a admin

# 5. Iniciar
npm run dev        # http://localhost:3000
npm test           # testes unitários
npm run build      # build de produção
```

---

## Estrutura

```
src/
├── app/              # rotas Next.js: loja, checkout, conta, admin, api
├── components/       # componentes por domínio: carrinho, produtos, admin, layout, ui
├── hooks/            # useCarrinho (Zustand), useToast
├── lib/              # supabase (client/server/admin), utils, mock, admin auth
├── types/            # contratos de domínio (Produto, Pedido, Empresa…)
└── proxy.ts          # proteção de rotas privadas + refresh de sessão (Next.js 16)
```

---

## Escopo do portfólio

Este projeto demonstra arquitetura e regras de negócio. O que ficaria para uma versão de produção real:

- **Pagamento real** — integração Mercado Pago / Pix dinâmico (chaves já no `.env.example`)
- **Frete real** — Frenet API para cálculo por transportadora (também no `.env.example`)
- **ERP** — sincronização de estoque com Bling
- **E-mails transacionais** — confirmação de pedido, aprovação B2B (Resend)
- **Testes de integração** — cobertura das rotas de API e fluxos de autenticação
