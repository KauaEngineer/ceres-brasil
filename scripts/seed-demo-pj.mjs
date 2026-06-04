/**
 * Cria (ou garante) uma conta de REVENDEDOR PJ já APROVADA para demonstrar o
 * fluxo B2B sem precisar passar pela aprovação manual no admin.
 * Rodar uma vez: node scripts/seed-demo-pj.mjs
 *
 * Usa a SERVICE_ROLE_KEY (pula confirmação de e-mail e RLS). Nunca commitar credenciais.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim();

const url = get('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = get('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !serviceKey) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAIL = 'demo-pj@ceresbrasil.com.br';
const DEMO_SENHA = 'demo12345';
const RAZAO_SOCIAL = 'Empório Demonstração Ltda';
const CNPJ = '12.345.678/0001-99';

// 1. Cria o usuário (ou recupera o existente)
let userId;
const { data: criado, error: errCreate } = await admin.auth.admin.createUser({
  email: DEMO_EMAIL,
  password: DEMO_SENHA,
  email_confirm: true,
  user_metadata: { nome: 'Revendedor Demonstração', tipo: 'pj' },
});

if (errCreate) {
  if (!errCreate.message?.toLowerCase().includes('already')) {
    console.error('Erro ao criar conta PJ demo:', errCreate.message);
    process.exit(1);
  }
  const { data: lista } = await admin.auth.admin.listUsers();
  userId = lista.users.find((u) => u.email === DEMO_EMAIL)?.id;
  console.log('Conta PJ demo já existia — ok.');
} else {
  userId = criado.user?.id;
  console.log('Conta PJ demo criada:', DEMO_EMAIL);
}

if (!userId) {
  console.error('Não foi possível obter o ID do usuário PJ demo.');
  process.exit(1);
}

// 2. Garante que o profile é do tipo 'pj' (o trigger já cria, mas reforçamos)
const { error: errProfile } = await admin
  .from('profiles')
  .update({ tipo: 'pj' })
  .eq('id', userId);
if (errProfile) console.warn('Aviso ao ajustar profile.tipo:', errProfile.message);

// 3. Cria/atualiza a empresa já APROVADA (upsert pelo CNPJ, que é unique)
const { error: errEmpresa } = await admin.from('empresas').upsert(
  {
    profile_id: userId,
    razao_social: RAZAO_SOCIAL,
    cnpj: CNPJ,
    status: 'aprovado',
    aprovado_em: new Date().toISOString(),
  },
  { onConflict: 'cnpj' },
);
if (errEmpresa) {
  console.error('Erro ao criar empresa aprovada:', errEmpresa.message);
  process.exit(1);
}

console.log(`Revendedor PJ aprovado pronto: ${DEMO_EMAIL} / ${DEMO_SENHA}`);
console.log(`Empresa: ${RAZAO_SOCIAL} (${CNPJ}) — status aprovado.`);
