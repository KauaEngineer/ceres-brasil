/**
 * Reset manual dos dados de demonstração (mesma lógica do cron /api/demo/reset).
 * Útil pra limpar na hora antes de uma apresentação.
 * Uso: node scripts/reset-demo.mjs
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim();

const admin = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAILS = ['demo@ceresbrasil.com.br', 'demo-pj@ceresbrasil.com.br'];
const DEMO_PJ_EMAIL = 'demo-pj@ceresbrasil.com.br';

const { data: lista, error } = await admin.auth.admin.listUsers();
if (error) {
  console.error('Erro ao listar usuários:', error.message);
  process.exit(1);
}

const demos = lista.users.filter((u) => DEMO_EMAILS.includes(u.email));
const ids = demos.map((u) => u.id);
const pjId = demos.find((u) => u.email === DEMO_PJ_EMAIL)?.id;

if (ids.length === 0) {
  console.error('Contas demo não encontradas. Rode os seeds primeiro.');
  process.exit(1);
}

const { error: errPedidos } = await admin.from('pedidos').delete().in('profile_id', ids);
if (errPedidos) {
  console.error('Erro ao apagar pedidos:', errPedidos.message);
  process.exit(1);
}

if (pjId) {
  await admin
    .from('empresas')
    .update({ status: 'aprovado', motivo_rejeicao: null, aprovado_em: new Date().toISOString() })
    .eq('profile_id', pjId);
}

console.log('Dados demo resetados:', demos.map((u) => u.email).join(', '));
