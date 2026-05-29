import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';

/**
 * Layout das páginas protegidas do admin. Exige login + estar na tabela admins.
 * A página /admin/login fica FORA deste grupo, então não herda esta proteção.
 */
export default async function AdminPainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: admin } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
  if (!admin) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-ceres-cream md:flex">
      <AdminSidebar nome={profile?.nome ?? user.email ?? 'Admin'} />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
