import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { ToastProvider } from '@/hooks/useToast';
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
    <html lang="pt-BR" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col bg-ceres-cream text-ceres-dark">
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
