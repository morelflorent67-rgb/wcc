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

## Formulaires de devis

Le formulaire mécanique (`/mecanique/contact/`) est en 3 étapes ; `?prestation=freinage` présélectionne
une prestation (c'est ce que font les boutons « Demander un devis »). Sans JavaScript, il reste un
formulaire HTML classique.

Les demandes sont traitées par `public/api/submit.php` (PHP 8.1 ou plus, hébergement mutualisé OVH
compatible) :

1. copier `public/api/config.example.php` en `public/api/config.php` et renseigner l'expéditeur,
   le secret et passer `env` à `prod` (ce fichier n'est jamais versionné ni écrasé au déploiement) ;
2. en développement (`env` = `dev`), les messages sont écrits dans `public/api/storage/outbox/*.eml`
   au lieu d'être envoyés ;
3. test local : `php -S 127.0.0.1:8081 -t public` dans un terminal, puis `npm run dev` dans un autre
   (les appels à `/api` sont redirigés vers PHP).

Protection contre les envois abusifs : champ piège, délai minimal, limite par adresse IP (hachée).
L'envoi réel dépend de l'hébergeur (service d'e-mail à choisir) : à valider par un test de réception
dans la boîte du garage avant la mise en ligne.

## Mise en ligne

Pas encore configurée. Variables au moment du build (voir `.env.example`) :

- `SITE_URL` : adresse publique, pour les balises canoniques et le plan du site ;
- `PUBLIC_INDEXABLE=true` : autorise l'indexation. Sans elle, toutes les pages portent `noindex`.

À la mise en ligne, remplacer aussi `public/robots.txt` (voir son contenu).

## État d'avancement

- [x] Portail (hero plein cadre, logos partenaires et marques, avis défilants, accès)
- [x] Espace Mécanique : accueil, grand menu, catalogue, fiche Freinage, formulaire (interface)
- [ ] Mécanique : 25 fiches prestations à rédiger (une page n'existe que si `src/data/mecanique-fiches/<slug>.json` existe)
- [ ] Formulaire : test du point de réception PHP et de l'envoi réel
- [ ] Espace Carrosserie : accueil, prestations, assurances, formulaire avec zones du véhicule
- [ ] Pages d'information (accès, mentions légales, confidentialité) : pages provisoires
- [ ] Formulaires côté serveur, déploiement, documentation d'hébergement
