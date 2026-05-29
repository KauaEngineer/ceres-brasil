/**
 * Torna um usuário admin (insere na tabela admins).
 * Uso: node scripts/seed-admin.mjs [email]   (default: demo@ceresbrasil.com.br)
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim();

const admin = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = process.argv[2] ?? 'demo@ceresbrasil.com.br';

// Acha o usuário pelo e-mail
const { data: lista, error: errList } = await admin.auth.admin.listUsers();
if (errList) {
  console.error('Erro ao listar usuários:', errList.message);
  process.exit(1);
}
const user = lista.users.find((u) => u.email === email);
if (!user) {
  console.error(`Usuário ${email} não encontrado. Cadastre primeiro.`);
  process.exit(1);
}

const { error } = await admin.from('admins').upsert({ id: user.id }, { onConflict: 'id' });
if (error) {
  console.error('Erro ao tornar admin:', error.message);
  process.exit(1);
}

console.log(`${email} agora é ADMIN (id ${user.id}).`);
