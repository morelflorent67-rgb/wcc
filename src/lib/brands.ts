import type { LogoItem } from '../components/LogoMarquee.astro';
import brands from '../data/brands.json';

// Logos officiels multicolores (BMW, Mercedes-Benz, Ford, Fiat) : fichiers de src/assets/brands/ (générés par npm run brands)
const files = import.meta.glob<string>('../assets/brands/*.svg', { query: '?url', import: 'default', eager: true });

interface Brand { name: string; slug: string; viewBox?: string; path?: string; color?: string; bg?: string; file?: string; }

/** Marques de véhicules prises en charge, pour les bandeaux défilants (vraies couleurs des logos) */
export const makes: LogoItem[] = (brands as Brand[]).map((b) => ({
  name: b.name,
  brand: { color: b.color, bg: b.bg },
  ...(b.file
    ? { src: files[`../assets/brands/${b.file}`] }
    : { svg: { viewBox: b.viewBox!, path: b.path! } }),
}));
