// Génère src/data/brands.json : logos des marques de véhicules prises en charge, dans les vraies couleurs de leur logo.
// - Logos d'une seule couleur (la plupart des logos actuels) : tracé du paquet npm « simple-icons » (CC0), couleur
//   relevée sur le logo officiel actuel (Wikimedia Commons), et non la couleur « de marque » de simple-icons.
// - Logos multicolores (BMW, Mercedes-Benz, Ford, Fiat) : fichiers officiels de tools/brand-sources/ (Wikimedia Commons,
//   indiqués domaine public), copiés dans src/assets/brands/ et affichés tels quels.
// Les marques sont la propriété de leurs détenteurs : présentées comme « marques prises en charge »,
// sans suggérer une concession ou un agrément constructeur.
// Usage : npm run brands
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconDir = join(root, 'node_modules', 'simple-icons', 'icons');
const srcDir = join(root, 'tools', 'brand-sources');
const outDir = join(root, 'src', 'assets', 'brands');

// [nom affiché, source, couleur du logo, fond de la pastille]
// source = identifiant simple-icons (tracé recoloré) ou fichier officiel de tools/brand-sources/ (affiché tel quel)
const BRANDS = [
  ['Renault', 'renault', '#000000'], // losange 2021, noir
  ['Peugeot', 'peugeot', '#000000'], // blason au lion 2021, noir
  ['Citroën', 'citroen', '#000000'], // ovale 2022, noir
  ['Dacia', 'dacia', '#646b52'], // emblème 2021, vert kaki
  ['Volkswagen', 'volkswagen', '#001e50'], // 2019, bleu nuit
  ['Audi', 'audi', '#000000'], // anneaux, noir
  ['BMW', 'file:bmw.svg'], // cercle noir, quartiers bleus et blancs
  ['Mercedes-Benz', 'file:mercedes-benz-star.svg'], // étoile argentée 2022
  ['Toyota', 'toyota', '#eb0a1e'], // rouge Toyota
  ['Ford', 'file:ford.svg'], // ovale bleu
  ['Opel', 'opel', '#000000', '#f7ff14'], // éclair noir sur le jaune Opel
  ['Nissan', 'nissan', '#000000'], // 2020, noir
  ['Fiat', 'file:fiat.svg'], // écusson rouge et chrome
  ['Kia', 'kia', '#05141f'], // 2021, noir nuit
  ['Hyundai', 'hyundai', '#002c5f'], // bleu Hyundai
  ['Škoda', 'skoda', '#0e3a2f'], // vert émeraude 2022
];

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pathsOf = (svg) => [...svg.matchAll(/<path\b[^>]*?\sd="([^"]+)"/g)].map((m) => m[1]);

mkdirSync(outDir, { recursive: true });
const out = BRANDS.map(([name, source, color, bg]) => {
  const slug = slugify(name);
  if (source.startsWith('file:')) {
    const file = `${slug}.svg`;
    copyFileSync(join(srcDir, source.slice(5)), join(outDir, file));
    return { name, slug, file, ...(bg ? { bg } : {}) };
  }
  const svg = readFileSync(join(iconDir, `${source}.svg`), 'utf8');
  return { name, slug, viewBox: '0 0 24 24', path: pathsOf(svg).join(' '), color, ...(bg ? { bg } : {}) };
});

writeFileSync(join(root, 'src', 'data', 'brands.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${out.length} marques -> src/data/brands.json`);
for (const b of out) console.log(' ', b.name.padEnd(14), b.file ? `fichier ${b.file}` : `${b.color}${b.bg ? ` sur ${b.bg}` : ''}`);
