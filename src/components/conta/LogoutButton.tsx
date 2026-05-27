'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/lib/auth';

export function LogoutButton() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function handleLogout() {
    setSaindo(true);
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" loading={saindo} onClick={handleLogout}>
      Sair
    </Button>
  );
}
