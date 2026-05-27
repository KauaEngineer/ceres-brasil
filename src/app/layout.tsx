import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFloating } from '@/components/layout/WhatsAppFloating';
import { CookieBanner } from '@/components/ui/CookieBanner';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ceres Brasil — Alimentos naturais sem glúten',
    template: '%s | Ceres Brasil',
  },
  description:
    'Massas, farinhas e grãos sem glúten produzidos com qualidade nutricional. Enviamos para todo o Brasil.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ceres-cream text-ceres-dark">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
        <WhatsAppFloating />
        <CookieBanner />
      </body>
    </html>
  );
}
