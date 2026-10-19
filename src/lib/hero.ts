import type { ImageMetadata } from 'astro';
import carroFallback from '../assets/illustration/carrosserie-polissage-orange.jpg';
import mecaFallback from '../assets/illustration/mecanique-moteur-capot.jpg';

// Les deux images principales du site (portail + en-tête des deux espaces).
// Pour les changer : déposer « carrosserie.jpg » et « mecanique.jpg » (ou .png, .webp, .avif) dans
// src/assets/hero/ (voir le README de ce dossier). Sans fichier, la photo d'illustration actuelle est utilisée.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/hero/*.{jpg,jpeg,png,webp,avif}', { eager: true });

const pick = (name: string, fallback: ImageMetadata): ImageMetadata => {
  const hit = Object.entries(files).find(([path]) => path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase() === name);
  return hit ? hit[1].default : fallback;
};

export const heroCarrosserie = pick('carrosserie', carroFallback);
export const heroMecanique = pick('mecanique', mecaFallback);
