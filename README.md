# Ceres Brasil — E-commerce B2C + B2B

E-commerce institucional completo para uma marca de massas, farinhas e grãos **sem glúten**, com loja para **consumidor final (B2C)** e **portal de revenda (B2B)** no mesmo sistema.

🔗 **Demo ao vivo:** https://ceres-brasil.vercel.app

> **Sobre este projeto:** é um build independente de **portfólio**, feito a partir da identidade de uma marca real. Pagamento, frete e integrações externas (Bling, Mercado Pago, Frenet) estão **simulados** — o foco é demonstrar arquitetura, modelagem de regras de negócio e UX de ponta a ponta, não processar transações reais.

---

## ✨ Destaques

O que diferencia este projeto de um CRUD de loja qualquer é a **modelagem de dois modelos de negócio** convivendo no mesmo código:

### Loja B2C (varejo)
- Catálogo com filtro por categoria, página de produto com tabela nutricional, ISR (revalidação a cada 10 min)
- Carrinho persistente (Zustand + localStorage)
- Checkout em 3 etapas com cálculo de frete por CEP (ViaCEP) e múltiplas formas de pagamento
- Área do cliente: pedidos com timeline, endereços (CRUD), dados da conta

### Portal B2B (revenda) — o coração do projeto
- **Gate de acesso por aprovação:** o catálogo é público, mas **preços de revenda só aparecem para PJ com cadastro aprovado** (checado no servidor, reforçado por Row Level Security no banco)
- **Venda em caixa fechada** (12 unidades) com preço de atacado
- **Frete FOB** (por conta do destinatário): o revendedor informa a transportadora própria *ou* solicita cotação — espelhando como o atacado funciona de verdade
- **Condições B2B:** Pix com 5% de desconto, boleto com 28 dias corridos
- Cadastro PJ em 2 etapas com upload de documentos e fluxo de aprovação

### Painel administrativo
- Dashboard com métricas e gráficos
- Gestão de pedidos (status, rastreio, exportação CSV)
- Aprovação/rejeição de clientes PJ (com documentos via signed URLs)
- Catálogo, estoque e relatórios (B2C × B2B, top produtos)

---

## 🔐 Acesso à demonstração

Use as contas abaixo na [tela de login](https://ceres-brasil.vercel.app/login):

| Perfil | E-mail | Senha | O que mostra |
|--------|--------|-------|--------------|
| **Cliente (B2C)** | `demo@ceresbrasil.com.br` | `demo12345` | Compra de varejo, conta, pedidos |
| **Revendedor (B2B)** | `demo-pj@ceresbrasil.com.br` | `demo12345` | Preços de revenda, caixa fechada, frete FOB |
| **Admin** | `demo@ceresbrasil.com.br` | `demo12345` | Painel em `/admin` (mesma conta, também é admin) |

---

## 🧱 Stack & decisões técnicas

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Framework | **Next.js 16** (App Router, Server Components) | Renderização no servidor, rotas com proteção via `proxy`, ISR |
| Linguagem | **TypeScript** | Contratos de tipo entre front, API e domínio |
| Estilo | **Tailwind CSS 4** | Paletas distintas B2C (terracota) e B2B (charcoal/teal) |
| Backend | **Supabase** (Postgres + Auth + Storage) | Banco relacional com **Row Level Security**, autenticação e upload de documentos |
| Estado | **Zustand** | Carrinho persistente leve, com modo B2C/B2B |
| Testes | **Jest + Testing Library** | Unidades de regra de negócio (validação, frete, carrinho) |
| Deploy | **Vercel** | CI/CD automático a cada push |

**Segurança em camadas:** toda regra sensível (acesso B2B, desconto, aprovação) é validada **no servidor e no banco (RLS)** — nunca apenas na interface. A UI esconde; a API e o Postgres decidem.

---

## 🚀 Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# preencha NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY

# 3. Criar o schema no Supabase
# rode src/lib/supabase/schema.sql e as migrations em src/lib/supabase/migrations/ (em ordem) no SQL Editor

# 4. (Opcional) Criar contas de demonstração
node scripts/seed-demo.mjs       # cliente PF
node scripts/seed-demo-pj.mjs    # revendedor PJ aprovado
node scripts/seed-admin.mjs      # promove a conta a admin

# 5. Subir o servidor
npm run dev        # http://localhost:3000

# Outros
npm test           # testes unitários
npm run build      # build de produção
```

---

## 📁 Estrutura

```
src/
├── app/              # rotas (App Router): loja, checkout, conta, admin, api
├── components/       # UI reutilizável (carrinho, produtos, admin, layout, ui)
├── hooks/            # useCarrinho (Zustand), useToast
├── lib/              # supabase (client/server/admin), utils, mock, admin
├── types/            # contratos de domínio (Produto, etc.)
└── proxy.ts          # proteção de rotas (/admin, /conta) + refresh de sessão
```

---

## 📌 Status

Projeto funcionalmente completo (B2C + B2B + admin). Integrações reais de pagamento (Mercado Pago), frete (Frenet) e ERP (Bling) ficam para a versão de produção, caso o projeto seja contratado pela marca.
