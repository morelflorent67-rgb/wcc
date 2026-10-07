/**
 * Prestations des deux espaces sous une forme unique pour les cartes photo (PhotoCard) et le menu (MenuRail).
 * Les données restent saisies une seule fois dans src/data/ ; ce fichier ne fait que les mettre en forme.
 */
import type { ImageMetadata } from 'astro';
import { photo } from './photos';
import { families, services, serviceHref, quoteHref, pricingOf, type Pricing } from './mecanique';
import { carroServices, carroHref, carroQuoteHref } from './carrosserie';

export interface CardItem {
  key: string;
  name: string;
  /** Petite étiquette au-dessus du titre : famille (mécanique) ou situation du visiteur (carrosserie) */
  label: string;
  /** Identifiant de famille pour les onglets du menu */
  family: string;
  short: string;
  /** Prix (tarif de base, prix remisé, remise) ; null = « Sur devis » ; undefined = aucun prix affiché (carrosserie) */
  price?: Pricing | null;
  href: string;
  quoteHref: string;
  image?: ImageMetadata;
  featured?: boolean;
}

const familyName = Object.fromEntries(families.map((f) => [f.id, f.name]));

export const mecaItems: CardItem[] = services.map((s) => ({
  key: s.slug,
  name: s.name,
  label: familyName[s.family],
  family: s.family,
  short: s.short,
  price: pricingOf(s.priceFrom),
  href: serviceHref(s.slug),
  quoteHref: quoteHref(s.slug),
  image: photo(s.image),
  featured: s.featured,
}));

export const carroItems: CardItem[] = carroServices.map((s) => ({
  key: s.slug,
  name: s.name,
  label: s.problem,
  family: 'interventions',
  short: s.short,
  href: carroHref(s.slug),
  quoteHref: carroQuoteHref(s.intervention),
  image: photo(s.image),
  featured: true,
}));

/** Onglets du menu mécanique : un par famille du catalogue (libellé court pour tenir sur une ligne). */
export const mecaTabs = families.map((f) => ({ id: f.id, label: f.name.split(',')[0].split(' et ')[0] }));
