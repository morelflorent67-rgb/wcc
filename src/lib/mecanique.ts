import raw from '../data/services-mecanique.json';

export interface Family { id: string; name: string; blurb: string; }
export interface Service {
  slug: string;
  name: string;
  family: string;
  /** Prix d'appel en euros ; null = « Sur devis » */
  priceFrom: number | null;
  featured?: boolean;
  short: string;
}

/** Contenu détaillé d'une fiche prestation (src/data/mecanique-fiches/<slug>.json). */
export interface ServiceDetail {
  /** Titre de la page (balise title) */
  seoTitle: string;
  seoDescription: string;
  /** Accroche affichée sous le titre */
  lead: string;
  /** Besoin traité : paragraphes */
  need: string[];
  /** Signes qui peuvent motiver une consultation */
  signs: string[];
  /** Déroulement de l'intervention */
  steps: { title: string; text: string }[];
  /** Éléments qui font varier le prix */
  priceFactors: string[];
  /** Informations utiles à préparer sur le véhicule */
  vehicleInfo: string[];
  /** Questions fréquentes */
  faq: { q: string; a: string }[];
  /** Prestations liées (slugs) */
  related: string[];
  /** Fichier image dans src/assets/illustration/ */
  image: string;
  imageAlt?: string;
}

export const families = raw.families as Family[];
export const services = raw.services as Service[];

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

/** « 92,90 € » ou null si sur devis. */
export const formatPrice = (p: number | null) => (p === null ? null : eur.format(p).replace(/ | /g, ' '));

/** Libellé court : « À partir de 92,90 € » ou « Sur devis ». */
export const priceLabel = (s: Service) => (s.priceFrom === null ? 'Sur devis' : `À partir de ${formatPrice(s.priceFrom)}`);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const byFamily = (id: string) => services.filter((s) => s.family === id);
export const featuredServices = services.filter((s) => s.featured);

// Fiches détaillées existantes : une page n'est générée que pour les prestations qui en ont une.
const detailFiles = import.meta.glob<{ default: ServiceDetail }>('../data/mecanique-fiches/*.json', { eager: true });
export const details: Record<string, ServiceDetail> = Object.fromEntries(
  Object.entries(detailFiles).map(([path, mod]) => [path.split('/').pop()!.replace('.json', ''), mod.default]),
);
export const hasPage = (slug: string) => slug in details;

/** Adresse de la prestation : sa fiche si elle existe, sinon le formulaire prérempli. */
export const serviceHref = (slug: string) => (hasPage(slug) ? `/mecanique/prestations/${slug}/` : `/mecanique/contact/?prestation=${slug}`);
export const quoteHref = (slug?: string) => (slug ? `/mecanique/contact/?prestation=${slug}` : '/mecanique/contact/');
