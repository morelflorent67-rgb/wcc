import type { APIRoute } from 'astro';

// robots.txt produit au build : interdit tout tant que PUBLIC_INDEXABLE n'est pas « true »
// (même règle que la balise noindex des pages), sinon autorise et déclare le plan du site.
export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const lines = ['User-agent: *'];
  if (indexable) {
    lines.push('Allow: /', 'Disallow: /api/');
    if (site) lines.push('', `Sitemap: ${new URL('/sitemap-index.xml', site).href}`);
  } else {
    lines.push('Disallow: /');
  }
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
