// Génère src/data/brands.json : icônes vectorielles des marques de véhicules prises en charge.
// Sources : paquet npm « simple-icons » (CC0) pour la plupart ; anneau Mercedes-Benz extrait de
// tools/brand-sources/mercedes-benz-star.svg (Wikimedia Commons, « Mercedes-Benz Star 2022 »).
// Les marques sont la propriété de leurs détenteurs : présentées comme « marques prises en charge »,
// sans suggérer une concession ou un agrément constructeur.
// Usage : npm run brands
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconDir = join(root, 'node_modules', 'simple-icons', 'icons');

// [nom affiché, identifiant simple-icons ou null pour source locale]
const BRANDS = [
  ['Renault', 'renault'],
  ['Peugeot', 'peugeot'],
  ['Citroën', 'citroen'],
  ['Dacia', 'dacia'],
  ['Volkswagen', 'volkswagen'],
  ['Audi', 'audi'],
  ['BMW', 'bmw'],
  ['Mercedes-Benz', null],
  ['Toyota', 'toyota'],
  ['Ford', 'ford'],
  ['Opel', 'opel'],
  ['Nissan', 'nissan'],
  ['Fiat', 'fiat'],
  ['Kia', 'kia'],
  ['Hyundai', 'hyundai'],
  ['Škoda', 'skoda'],
];

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pathsOf = (svg) => [...svg.matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)].map((m) => m[1]);

const out = BRANDS.map(([name, icon]) => {
  if (icon) {
    const svg = readFileSync(join(iconDir, `${icon}.svg`), 'utf8');
    return { name, slug: slugify(name), viewBox: '0 0 24 24', path: pathsOf(svg).join(' ') };
  }
  // Mercedes-Benz : le fichier source est un dégradé métallique (25 tracés). On conserve l'anneau
  // (1er tracé) et on redessine l'étoile à trois branches en monochrome : simplification
  // géométrique à remplacer par le fichier officiel de la marque si vous en disposez.
  const svg = readFileSync(join(root, 'tools', 'brand-sources', 'mercedes-benz-star.svg'), 'utf8');
  const ring = pathsOf(svg)[0];
  const c = 32, R = 29.4, r = 5.3;
  const pt = (rad, deg) => `${(c + rad * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(c + rad * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  const star = `M${pt(R, -90)}L${pt(r, -30)}L${pt(R, 30)}L${pt(r, 90)}L${pt(R, 150)}L${pt(r, 210)}Z`;
  return { name, slug: slugify(name), viewBox: '0 0 64 64', path: `${ring}${star}` };
});

writeFileSync(join(root, 'src', 'data', 'brands.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${out.length} marques -> src/data/brands.json`);
for (const b of out) console.log(' ', b.name.padEnd(14), b.viewBox, `${b.path.length} car.`);
