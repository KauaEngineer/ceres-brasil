/**
 * Cria o bucket privado "documentos-pj" para guardar Cartão CNPJ + Contrato Social.
 * Rodar uma vez: node scripts/seed-storage.mjs
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, 'm'))?.[1]?.trim();

const admin = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { error } = await admin.storage.createBucket('documentos-pj', {
  public: false,
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['application/pdf'],
});

if (error) {
  if (error.message?.toLowerCase().includes('already exists')) {
    console.log('Bucket documentos-pj já existe — ok.');
    process.exit(0);
  }
  console.error('Erro ao criar bucket:', error.message);
  process.exit(1);
}
console.log('Bucket documentos-pj criado (privado, PDF, máx 5MB).');
