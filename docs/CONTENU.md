# Modifier le contenu du site

Rien n'est écrit en double : chaque information vit à un seul endroit, et le site se met à jour partout.
Après une modification, on contrôle avec `npm run dev` (http://127.0.0.1:4321), puis on reconstruit avec `npm run build`
(voir `DEPLOIEMENT.md` pour publier).

Les fichiers de données sont du JSON : respecter les guillemets `"`, les virgules entre éléments (pas après le dernier) et
écrire les apostrophes telles quelles (’ ou '). Un fichier invalide fait échouer `npm run build` avec un message qui indique la ligne.

## Règles de contenu

- Ne rien annoncer qui ne soit pas confirmé par WCC : délai chiffré, garantie, prêt de véhicule gratuit, franchise offerte, note globale ou étoiles
  non vérifiées, affiliation à un réseau ou à un constructeur.
- « À partir de X € » est un prix d'appel, jamais un devis.
- Les photos d'illustration ne doivent pas être présentées comme les locaux ou les réalisations de WCC.

## Coordonnées et horaires

`src/data/site.json` : adresse, téléphone (`display` pour l'affichage, `tel` pour le lien d'appel), horaires (`slots` pour le texte, `schema` pour
Google et pour le tableau de la semaine du bloc « Accès & horaires » : à garder cohérents), coordonnées GPS (`geo`), liens d'itinéraire
Google Maps et Waze.

Le bloc « Accès & horaires » affiche « Ouvert · jusqu'à… » / « Fermé · ouvre à… » d'après `schema`, à l'heure de Paris. Les jours fériés
(calendrier d'Alsace-Moselle) n'affichent pas d'état : « ouverture à confirmer par téléphone ».

**Plan d'accès** : dessiné à partir des données OpenStreetMap par `python tools/build_map.py` (produit `src/assets/map/acces-fond.svg` et
`src/data/map-acces.json`). À relancer seulement si l'adresse change (modifier `LAT0`/`LON0` dans le script, puis
`python tools/build_map.py --download`). Aucun service extérieur n'est appelé par les visiteurs ; la mention « © contributeurs OpenStreetMap »
doit rester visible sur la carte.

## Prix et offre de l'espace mécanique

`src/data/services-mecanique.json` → `services[].priceFrom` = **tarif de base de WCC** en euros (nombre avec point : `139.35`), ou `null`
pour « Sur devis ». C'est ce tarif qui apparaît barré quand l'offre est active.

`src/data/site.json` → `promo` :

| Champ | Effet |
| --- | --- |
| `enabled` | `false` : plus de remise, plus de bande ni de macaron ; les prix redeviennent les tarifs de base |
| `discountPercent` | remise appliquée au tarif de base (20 = −20 %) ; le prix remisé est calculé automatiquement |
| `endDate` | date de fin `"AAAA-MM-JJ"`, facultative ; affichée « valable jusqu'au… » si renseignée |
| `highlight`, `text` | texte de la bande (« 90 points de contrôle offerts » + suite) |
| `sticker` | texte du macaron de l'accueil mécanique |

À savoir : le prix barré doit être le tarif **réellement pratiqué** avant l'offre (règle du prix de référence). Conserver les devis et factures
qui le prouvent. Les conditions de l'offre (contenu des 90 points, durée, exclusions) sont à faire préciser par WCC avant publication.

## Prestations mécanique

- Liste, familles, noms, descriptions courtes, photo : `src/data/services-mecanique.json`.
- Fiche détaillée d'une prestation : `src/data/mecanique-fiches/<slug>.json` (le nom du fichier est le `slug` de la prestation ; la page n'existe que si
  le fichier existe). Champs : titre et description pour Google, introduction, besoin, signes, étapes, ce qui fait varier le prix, informations
  véhicule, questions fréquentes, prestations liées. **Pas de prix dans les textes** : ils viennent du fichier des prestations.
- Pour ajouter une prestation : l'ajouter dans `services-mecanique.json`, créer sa fiche, ajouter sa photo. Menu, catalogue, formulaire et accueil suivent seuls.

## Carrosserie

`src/data/services-carrosserie.json` : les 6 interventions (texte complet de chaque page), les étapes, avantages et questions de l'accueil, la page
Assurances. Aucun prix en carrosserie.

**Atouts communs aux deux espaces** (véhicule de prêt, véhicule rendu nettoyé, agréé assurances) : `src/data/site.json` → `atouts` (titre,
accroche courte, texte, icône). Ils s'affichent dans le bandeau sous l'en-tête carrosserie, dans le panneau « Le service en plus » du portail et
de l'accueil mécanique, et dans les cartes photo « À votre service ».

Avantages (`home.advantages`) : section « À votre service » en cartes photo. Une entrée `atout` (`pret`, `nettoyage`, `assurance`) reprend le
texte de l'atout commun et n'ajoute que sa photo.
`icon` = symbole de `src/components/Icons.astro`, `image` = photo de `src/assets/illustration/`, `quote` = extrait **mot pour mot** d'un avis
de `reviews.json` (il n'est affiché que s'il y figure exactement).

Étapes (« Simple, étape par étape », page Assurances, fiches) : `title`, `text` et `icon` facultatif (symbole de `Icons.astro`, ex. `edit`, `chat`,
`doc`, `key`, `shield`, `phone`, `check`). Les étapes de l'accueil mécanique sont dans `src/pages/mecanique/index.astro`.

## Photos

- **Les deux images principales** (portail et en-tête de chaque espace) : déposer `carrosserie.jpg` et `mecanique.jpg` (ou `.png`, `.webp`) dans
  `src/assets/hero/`. Format conseillé : paysage, 2400 × 1600 px ou plus, sujet au centre (voir le README de ce dossier).
- Dossier `src/assets/illustration/`. **Pour remplacer une photo, enregistrer la nouvelle sous le même nom** (JPEG, 1600 px de large ou plus, moins de 1 Mo si
  possible). Le site fabrique lui-même les versions légères.
- Pour changer la photo d'une prestation, modifier son champ `image` (nom du fichier).
- Les photos actuelles sont des illustrations libres de droits provisoires : crédits dans `src/assets/illustration/CREDITS.md` (à mettre à jour ou supprimer
  quand elles sont remplacées par les vraies photos de WCC).
- Logo : `src/assets/brand/`.

## Logos des assureurs et marques

- Assureurs : `src/data/partners.json` (nom, fichier, `featured` = défile sur le portail) et fichiers de `src/assets/partners/`. Remplacer par les
  fichiers officiels en gardant le nom.
- Marques de véhicules : `src/data/brands.json` est généré par `npm run brands` (icônes simple-icons, licence CC0), avec la couleur officielle de
  chaque marque (`color`) ; `dark: true` = couleur claire posée sur une pastille sombre (Renault, Opel).

## Avis Google

`src/data/reviews.json` : un avis par entrée (`author` « Prénom N. », `date`, `rating`, `highlight`, `text` reproduit à l'identique). Jamais d'avis
inventé. `highlight` = passage surligné dans la carte : il doit être recopié **exactement** depuis `text` (sinon rien n'est surligné).
Mettre à jour `capturedAt` ; les mentions « il y a X mois » vieillissent : préférer une date (« septembre 2026 »).

## Mentions légales et confidentialité

`src/data/legal.json` : tant qu'un champ vaut `null`, la page affiche « à compléter » et reste en `noindex`. Renseigner : dénomination, forme
juridique, SIRET, RCS/RM, TVA, directeur de la publication, e-mail de contact, hébergeur, médiateur de la consommation, durées de conservation des
demandes et des photos.

## Couleurs et polices

`src/styles/tokens.css` (couleurs, tailles, espacements), `src/styles/global.css`. Polices auto-hébergées : aucune requête vers Google.

## Contrôles avant de publier

```bash
npm run check    # types et structure
npm run build    # génère dist/
npm run links    # vérifie les liens internes de dist/
```
