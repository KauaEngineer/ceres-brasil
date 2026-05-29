'use client';

import { usePathname } from 'next/navigation';
import { CarrinhoDrawer } from '@/components/carrinho/CarrinhoDrawer';
import { DemoAccessButton } from '@/components/dev/DemoAccessButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFloating } from '@/components/layout/WhatsAppFloating';
import { CookieBanner } from '@/components/ui/CookieBanner';

/**
 * Decide a "casca" do site. No /admin não mostramos header/footer/carrinho
 * da loja — o painel tem seu próprio layout. Nas demais rotas, casca pública.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <CarrinhoDrawer />
      <WhatsAppFloating />
      <CookieBanner />
      <DemoAccessButton />
    </>
  );
}
