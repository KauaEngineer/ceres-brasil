/**
 * Converte as fotos reais de fotos-originais/ em webp otimizado em
 * public/produtos/<slug>.webp. Rodar: node scripts/process-fotos.mjs
 */
import { readdirSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'fotos-originais';
const norm = (s) =>
  s
    .replace(/\.png$/i, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const map = {
  'talharim de farinha de grao de bico sabor tradicional 200g': 'talharim-grao-de-bico-tradicional',
  'talharim de farinha de grao de bico sabor funghi seco 200g': 'talharim-grao-de-bico-funghi',
  'talharim de farinha de grao de bico sabor tomate 200g': 'talharim-grao-de-bico-tomate',
  'talharim de farinha de grao de bico sabor espinafre 200g': 'talharim-grao-de-bico-espinafre',
  'talharim de farinha de farinha de lentilha amarela 200g': 'talharim-lentilha-amarela',
  'talharim de farinha de farinha de lentilha vermelha 200g': 'talharim-lentilha-vermelha',
  'penne de farinha de lentilha amarela 200g': 'penne-lentilha-amarela',
  'penne de farinha de lentilha vermelha 200g': 'penne-lentilha-vermelha',
  'risoni de farinha de grao de bico sabor espinafre 200g': 'risoni-grao-de-bico-espinafre',
  'risoni de farinha de lentilha amarela 200g': 'risoni-lentilha-amarela',
  'risoni de farinha de lentilha vermelha 200g': 'risoni-lentilha-vermelha',
  'conchiglione de farinha de batata doce purpura 200g': 'conchiglione-batata-doce',
  'conchiglione de farinha de lentilha vermelha 200g': 'conchiglione-lentilha-vermelha',
  'conchiglione de farinha de lentilha vermelha sabor espinafre 200g':
    'conchiglione-lentilha-vermelha-espinafre',
  'farinha de amendoas 150g': 'farinha-de-amendoas',
  'psyllium husk 100g': 'psyllium-husk',
  'ervilha partida seca 400g': 'ervilha-partida',
  'feijao azuki 200g': 'feijao-azuki-200g',
  'feijao azuki 400g': 'feijao-azuki-400g',
  'grao de bico 400g': 'grao-de-bico',
  'lentilha amarela 400g': 'lentilha-amarela',
  'lentilha negra beluga 400g': 'lentilha-negra-beluga',
  'lentilha verde 400g': 'lentilha-verde',
  'painco sem casca 200g': 'painco-sem-casca',
};

let ok = 0;
const semMap = [];
for (const f of readdirSync(SRC)) {
  if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
  const slug = map[norm(f)];
  if (!slug) {
    semMap.push(norm(f));
    continue;
  }
  await sharp(`${SRC}/${f}`)
    .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/produtos/${slug}.webp`);
  ok++;
}
console.log(`Convertidas: ${ok}`);
if (semMap.length) console.log('SEM MAPEAMENTO:', semMap);
