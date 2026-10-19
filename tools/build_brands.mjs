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
// Couleur officielle de chaque marque, telle que référencée par simple-icons (champ « hex »)
const iconData = JSON.parse(readFileSync(join(root, 'node_modules', 'simple-icons', 'data', 'simple-icons.json'), 'utf8'));
const iconList = Array.isArray(iconData) ? iconData : iconData.icons;
const slugOf = (title) => title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const colorOf = (icon) => {
  const hit = iconList.find((i) => (i.slug ?? slugOf(i.title)) === icon);
  return hit ? `#${hit.hex}` : null;
};
// Couleur claire sur fond blanc (Renault, Opel) : le logo est posé sur une pastille sombre pour rester lisible
const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const needsDark = (hex) => 1.05 / (luminance(hex) + 0.05) < 1.8;

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
    const color = colorOf(icon) ?? '#2c3038';
    return { name, slug: slugify(name), viewBox: '0 0 24 24', path: pathsOf(svg).join(' '), color, dark: needsDark(color) };
  }
  // Mercedes-Benz : le fichier source est un dégradé métallique (25 tracés). On conserve l'anneau
  // (1er tracé) et on redessine l'étoile à trois branches en monochrome : simplification
  // géométrique à remplacer par le fichier officiel de la marque si vous en disposez.
  const svg = readFileSync(join(root, 'tools', 'brand-sources', 'mercedes-benz-star.svg'), 'utf8');
  const ring = pathsOf(svg)[0];
  const c = 32, R = 29.4, r = 5.3;
  const pt = (rad, deg) => `${(c + rad * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(c + rad * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  const star = `M${pt(R, -90)}L${pt(r, -30)}L${pt(R, 30)}L${pt(r, 90)}L${pt(R, 150)}L${pt(r, 210)}Z`;
  // Couleur : gris argent de l'étoile (aucune couleur de référence dans simple-icons)
  return { name, slug: slugify(name), viewBox: '0 0 64 64', path: `${ring}${star}`, color: '#6b7079', dark: false };
});

writeFileSync(join(root, 'src', 'data', 'brands.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${out.length} marques -> src/data/brands.json`);
for (const b of out) console.log(' ', b.name.padEnd(14), b.viewBox, b.color, b.dark ? 'pastille sombre' : '', `${b.path.length} car.`);
