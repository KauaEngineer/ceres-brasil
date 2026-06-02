import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ceres-brasil.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // áreas privadas / técnicas — sem indexação no Google
        disallow: ['/admin', '/conta', '/checkout', '/api', '/aguardando-aprovacao'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
