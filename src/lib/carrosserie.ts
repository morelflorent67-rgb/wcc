import raw from '../data/services-carrosserie.json';
import site from '../data/site.json';

/** Étape d'un déroulement ; icon = symbole de src/components/Icons.astro (facultatif) */
export interface Step { title: string; text: string; icon?: string; }
export interface Faq { q: string; a: string; }
/** Atout de l'espace carrosserie (section « À votre service ») ; highlight = mis en avant (bandeau d'atouts, portail) */
export interface Advantage {
  title: string;
  text: string;
  /** Accroche courte du bandeau d'atouts */
  short?: string;
  /** Symbole de src/components/Icons.astro (sans « i- ») */
  icon?: string;
  /** Fichier image dans src/assets/illustration/ */
  image?: string;
  imageAlt?: string;
  highlight?: boolean;
  /** Extrait mot pour mot d'un avis de src/data/reviews.json */
  quote?: { text: string; author: string };
}

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
/** Atouts communs aux deux espaces (véhicule de prêt, véhicule rendu nettoyé, agréé assurances) : src/data/site.json → atouts */
export interface Atout { id: string; icon: string; title: string; short: string; text: string; }
export const atouts = site.atouts.items as Atout[];

type RawAdvantage = Partial<Advantage> & { atout?: string };
const home = raw.home as { steps: Step[]; advantages: RawAdvantage[]; faq: Faq[] };
/** Avantages de l'accueil carrosserie ; une entrée « atout » reprend le texte de l'atout commun et y ajoute sa photo */
const advantages: Advantage[] = home.advantages.map((a) => {
  if (!a.atout) return a as Advantage;
  const at = atouts.find((x) => x.id === a.atout);
  if (!at) throw new Error(`Atout inconnu dans services-carrosserie.json : ${a.atout}`);
  const { id: _id, ...shared } = at;
  return { ...shared, ...a, highlight: true } as Advantage;
});
export const carroHome = { steps: home.steps, advantages, faq: home.faq };
export const carroAssurances = raw.assurances as { lead: string; steps: Step[]; toPrepare: string[]; faq: Faq[] };

export const carroBySlug = (slug: string) => carroServices.find((s) => s.slug === slug);
export const carroHref = (slug: string) => `/carrosserie/prestations/${slug}/`;

/** Formulaire de devis, avec l'intervention présélectionnée si elle est connue. */
export const carroQuoteHref = (intervention?: string) =>
  intervention ? `/carrosserie/contact/?intervention=${intervention}` : '/carrosserie/contact/';
