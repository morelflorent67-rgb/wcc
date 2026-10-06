# Site World Car Carrosserie (WCC)

Site vitrine statique de WCC (Bischheim) : un portail et deux espaces, Carrosserie et Mécanique.
Construit avec [Astro](https://astro.build) : le résultat est du HTML pur, hébergeable partout.

La conception validée est dans `docs/conception/` (plan du site, catalogue mécanique, maquettes).
Les trois prototypes visuels comparés sont dans `design/prototypes/` (le **C** a été retenu).

## Commandes

```bash
npm install        # une seule fois
npm run dev        # développement : http://127.0.0.1:4321
npm run build      # génère le site dans dist/
npm run preview    # prévisualise le build
npm run check      # vérifie le code
```

Node 22.12 ou plus récent.

## Où modifier quoi

Rien n'est écrit en double : chaque information vit à un seul endroit.

| Je veux changer… | Fichier |
| --- | --- |
| Adresse, téléphone, horaires, lien d'itinéraire | `src/data/site.json` |
| Les logos des assureurs (nom, ordre, lesquels défilent sur le portail) | `src/data/partners.json` et `src/assets/partners/` |
| Les marques de véhicules affichées | `tools/build_brands.mjs`, puis `npm run brands` |
| Les avis Google | `src/data/reviews.json` (liste vide = cartes « à intégrer ») |
| Une photo | remplacer le fichier de `src/assets/illustration/` en gardant son nom |
| Couleurs, polices | `src/styles/tokens.css` |

### Avis Google

Dans `src/data/reviews.json`, un avis par entrée (les avis doivent être authentiques) :

```json
[
  { "author": "Prénom N.", "date": "septembre 2026", "rating": 5, "text": "Texte de l'avis." }
]
```

### Logos des assureurs

Les logos actuels viennent de la fiche Acoat Selected de WCC (liste confirmée par le client) et sont
**provisoires**. Pour les remplacer par les fichiers officiels, déposez-les dans `src/assets/partners/`
sous le même nom (`axa.webp`, `allianz.webp`…) ; pour en ajouter, complétez `src/data/partners.json`.

### Photos

Les photos actuelles sont des illustrations libres de droits (Unsplash), voir
`src/assets/illustration/CREDITS.md`. Ne pas les présenter comme les locaux ou les réalisations de WCC.

## Mise en ligne

Pas encore configurée. Variables au moment du build (voir `.env.example`) :

- `SITE_URL` : adresse publique, pour les balises canoniques et le plan du site ;
- `PUBLIC_INDEXABLE=true` : autorise l'indexation. Sans elle, toutes les pages portent `noindex`.

À la mise en ligne, remplacer aussi `public/robots.txt` (voir son contenu).

## État d'avancement

- [x] Portail (hero plein cadre, logos partenaires et marques, avis défilants, accès)
- [ ] Espace Mécanique : accueil, catalogue, fiches prestations, formulaire
- [ ] Espace Carrosserie : accueil, prestations, assurances, formulaire avec zones du véhicule
- [ ] Pages d'information (accès, mentions légales, confidentialité) : pages provisoires
- [ ] Formulaires côté serveur, déploiement, documentation d'hébergement
