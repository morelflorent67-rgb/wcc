import raw from '../data/services-carrosserie.json';

export interface Step { title: string; text: string; }
export interface Faq { q: string; a: string; }

/** Une prestation de carrosserie, avec tout le contenu de sa page (src/data/services-carrosserie.json). */
export interface CarroService {
  slug: string;
  /** Valeur du champ « intervention » du formulaire (api/submit.php) */
  intervention: string;
  name: string;
  /** Situation du visiteur, formulée à la première personne (accueil) */
  problem: string;
  short: string;
  /** Fichier image dans src/assets/illustration/ */
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  need: string[];
  cases: string[];
  steps: Step[];
  /** Paragraphes « Et votre assurance ? » (absent si non pertinent) */
  insurance?: string[];
  priceFactors: string[];
  vehicleInfo: string[];
  faq: Faq[];
  related: string[];
}

export const carroServices = raw.services as CarroService[];
export const carroHome = raw.home as { steps: Step[]; advantages: Step[]; faq: Faq[] };
export const carroAssurances = raw.assurances as { lead: string; steps: Step[]; toPrepare: string[]; faq: Faq[] };

export const carroBySlug = (slug: string) => carroServices.find((s) => s.slug === slug);
export const carroHref = (slug: string) => `/carrosserie/prestations/${slug}/`;

/** Formulaire de devis, avec l'intervention présélectionnée si elle est connue. */
export const carroQuoteHref = (intervention?: string) =>
  intervention ? `/carrosserie/contact/?intervention=${intervention}` : '/carrosserie/contact/';
