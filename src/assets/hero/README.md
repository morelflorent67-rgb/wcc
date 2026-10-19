# Images principales du site

Ce dossier contient les deux grandes images du site : elles s'affichent sur le **portail** (moitié gauche et moitié
droite) et en **tête de l'accueil de chaque espace**.

| Fichier à déposer ici | Utilisé pour |
| --- | --- |
| `carrosserie.jpg` (ou `.png`, `.webp`, `.avif`) | Moitié « Carrosserie » du portail, en-tête de `/carrosserie/` |
| `mecanique.jpg` (ou `.png`, `.webp`, `.avif`) | Moitié « Mécanique » du portail, en-tête de `/mecanique/` |

Tant qu'un fichier manque, la photo d'illustration actuelle est utilisée (`src/assets/illustration/`).
Un seul fichier par nom : ne pas laisser `carrosserie.jpg` **et** `carrosserie.png`.

## Format conseillé

- **Paysage, au moins 2400 × 1600 px** (rapport 3:2), JPEG ou PNG. Le site produit lui-même les tailles réduites (WebP).
- **Sujet au centre** : la même image est recadrée en portrait sur le portail (moitié d'écran) et en bandeau large
  dans l'espace. Ce qui dépasse sur les bords peut être coupé.
- **Bas de l'image calme et assez sombre** : le titre blanc et un dégradé orange (carrosserie) ou bleu (mécanique) s'y posent.
- Aucun texte, logo, plaque d'immatriculation lisible ni visage reconnaissable.
- Images générées ou d'illustration : ne jamais les présenter comme les locaux ou les réalisations de WCC.

Après dépôt : relancer `npm run dev` (ou `npm run build`). Le cadrage se règle si besoin avec `object-position`
dans `src/components/PortalHero.astro` et dans les pages `src/pages/carrosserie/index.astro` / `src/pages/mecanique/index.astro`.
