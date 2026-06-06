/**
 * Gera imagens ILUSTRATIVAS por categoria (placeholder enquanto não há fotos
 * reais de cada produto). Visual com a paleta Ceres pra parecer intencional.
 * Rodar: node scripts/gen-placeholders.mjs
 */
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

mkdirSync(new URL('../public/produtos', import.meta.url), { recursive: true });

const W = 1200;
const H = 1200;

const cats = [
  { slug: 'massas', label: 'Massas', c1: '#c4654c', c2: '#8e4530' },
  { slug: 'farinhas', label: 'Farinhas', c1: '#d4a04a', c2: '#a9762f' },
  { slug: 'graos', label: 'Grãos & Cereais', c1: '#b9613f', c2: '#d4a04a' },
];

function svg({ label, c1, c2 }) {
  label = label.replace(/&/g, '&amp;');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${W - 120}" cy="160" r="320" fill="#ffffff" opacity="0.06"/>
  <circle cx="160" cy="${H - 120}" r="220" fill="#ffffff" opacity="0.05"/>
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="34" letter-spacing="10"
        fill="#ffffff" fill-opacity="0.75" text-anchor="middle">CERES BRASIL</text>
  <text x="50%" y="52%" font-family="Georgia, 'Times New Roman', serif" font-size="104"
        fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <rect x="${W / 2 - 40}" y="60%" width="80" height="3" fill="#ffffff" opacity="0.8"/>
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="30" letter-spacing="4"
        fill="#ffffff" fill-opacity="0.7" text-anchor="middle">SEM GLÚTEN</text>
</svg>`);
}

await Promise.all(
  cats.map((c) => sharp(svg(c)).webp({ quality: 86 }).toFile(`public/produtos/${c.slug}.webp`)),
);

console.log('Placeholders de categoria gerados em public/produtos/');
