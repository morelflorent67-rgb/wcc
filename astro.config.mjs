// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site (ex. https://www.mon-domaine.fr). Définie au moment du build :
//   SITE_URL=https://www.mon-domaine.fr npm run build
// Tant qu'elle est absente, ni plan de site ni balises canoniques ne sont générés.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: site ? [sitemap()] : [],
  devToolbar: { enabled: false },
});
