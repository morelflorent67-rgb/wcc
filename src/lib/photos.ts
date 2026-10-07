import type { ImageMetadata } from 'astro';

// Toutes les photos d'illustration (src/assets/illustration/). Pour changer la photo d'une prestation,
// remplacer le fichier (même nom) ou modifier le champ « image » de la prestation dans src/data/.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/illustration/*.jpg', { eager: true });

export const photo = (name: string): ImageMetadata | undefined => files[`../assets/illustration/${name}`]?.default;
