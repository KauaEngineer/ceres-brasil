import type { MetadataRoute } from 'next';
import { todosSlugs } from '@/lib/mock/produtos';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ceres-brasil.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const fixas: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: agora, priority: 1, changeFrequency: 'weekly' },
    { url: `${BASE}/produtos`, lastModified: agora, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/quem-somos`, lastModified: agora, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE}/contato`, lastModified: agora, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/seja-revendedor`, lastModified: agora, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE}/politica-de-privacidade`, lastModified: agora, priority: 0.3 },
    { url: `${BASE}/trocas-e-devolucoes`, lastModified: agora, priority: 0.3 },
  ];

  const produtos: MetadataRoute.Sitemap = todosSlugs().map((slug) => ({
    url: `${BASE}/produtos/${slug}`,
    lastModified: agora,
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  return [...fixas, ...produtos];
}
