/**
 * Cria (ou garante) uma conta de demonstração já confirmada no Supabase.
 * Rodar uma vez: node scripts/seed-demo.mjs
 *
 * Usa a SERVICE_ROLE_KEY (pula confirmação de e-mail). Nunca commitar credenciais.
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

const DEMO_EMAIL = 'demo@ceresbrasil.com.br';
const DEMO_SENHA = 'demo12345';

const { data, error } = await admin.auth.admin.createUser({
  email: DEMO_EMAIL,
  password: DEMO_SENHA,
  email_confirm: true,
  user_metadata: { nome: 'Cliente Demonstração', tipo: 'pf' },
});

if (error) {
  if (error.message?.toLowerCase().includes('already')) {
    console.log('Conta demo já existe — ok.');
    process.exit(0);
  }
  console.error('Erro ao criar conta demo:', error.message);
  process.exit(1);
}

console.log('Conta demo criada:', data.user?.email);
