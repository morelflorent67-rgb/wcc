# WCC — notes de reprise

Fichier de reprise pour toute nouvelle session ou après compactage du contexte. À tenir à jour.
Dernière mise à jour : 6 octobre 2026.

## Le projet en bref

Site vitrine de **World Car Carrosserie (WCC)**, garage de Bischheim (carrosserie et mécanique multimarque, de même
importance). Objectif : générer des **demandes de devis** (pas de réservation), via le référencement local.
L'utilisateur est le créateur du site (le client est WCC) ; il héberge lui-même (OVH mutualisé probable, pas encore
choisi). **Aucune publication, aucun achat** (hébergeur, domaine, abonnement) sans son accord explicite.

Conception validée : `docs/conception/WCC-plan-site-v1.md` (brief, routes, navigation, formulaires, SEO, maintenance),
`docs/conception/WCC-catalogue-mecanique-reference.md` (prix d'appel). Les coordonnées de l'entreprise sont au §1 du plan
et dans `src/data/site.json`. En cas de doute, le plan fait foi.

## Décisions déjà prises

- **Direction visuelle : prototype C « Plein cadre »** (`design/prototypes/c.html`, référence figée ; A et B écartés).
  Fonds clairs, Barlow / Barlow Condensed (titres en capitales), orange = carrosserie, bleu = mécanique, dégradé du logo.
- **Un domaine, un portail, deux espaces autonomes** : `/`, `/carrosserie/…`, `/mecanique/…`, `/acces-horaires/`,
  pages légales. Pas de dépannage ni de location au lancement, aucun bouton inactif.
- **Astro 7 statique** (HTML pur), CSS natif, JS minimal, polices auto-hébergées (@fontsource), pas d'espace d'administration.
- **Contenus centralisés** (un prix, un texte, un logo saisi une seule fois) : voir « Où est quoi ».
- **Formulaires en PHP** (`api/submit.php`), compatible mutualisé OVH, PHP 8.1+.
- **Pousser sur GitHub une seule fois, à la fin.** Dépôt `morelflorent67-rgb/wcc` actuellement **public** : le passer
  en **privé avant** de pousser (il contient l'adresse Gmail du garage dans `docs/` et des logos tiers).
  Des commits locaux existent déjà ; ne pas pousser sans accord explicite.

## Règles de contenu (ne pas enfreindre)

- Français correct, accents compris. Textes écrits pour WCC, jamais copiés d'AD ni d'Acoat.
- **Rien d'inventé ni de non confirmé** : pas de délai chiffré, pas de prêt gratuit systématique, pas de franchise offerte,
  pas de garantie, pas de note globale ni d'étoiles non fournies, pas de statistiques Acoat (effectif, surface…).
  Véhicule de prêt : « possible » seulement. Aucune affiliation AD ni constructeur ; marques = « marques prises en charge ».
- Prix : « À partir de X € » = **prix d'appel**, jamais un devis ; TTC / pièces / main-d'œuvre non précisés (à clarifier avec WCC).
- Les formulaires ne promettent ni rendez-vous ni délai de réponse.
- Les 26 descriptions courtes et la fiche Freinage sont des **brouillons à faire valider** par WCC.
- Photos actuelles = illustrations Unsplash provisoires (`src/assets/illustration/CREDITS.md`), à ne jamais présenter comme
  les locaux ou réalisations de WCC ; l'utilisateur les remplacera lui-même (même nom de fichier).
- Logos assureurs = fichiers **provisoires** de la fiche Acoat (31, 250×188 px) ; marques = icônes simple-icons (CC0) +
  étoile Mercedes redessinée. Remplacer par les fichiers officiels dès que possible.
- Avis Google : 10 avis réels fournis par l'utilisateur (texte verbatim, auteurs abrégés « Prénom N. », durées traduites,
  relevés le 6 octobre 2026), sans note ni étoiles. Jamais d'avis inventé.

## Où est quoi

| Contenu | Fichier |
| --- | --- |
| Adresse, téléphone, horaires, itinéraire | `src/data/site.json` |
| 26 prestations mécanique, 5 familles, prix d'appel, textes courts | `src/data/services-mecanique.json` |
| Fiche détaillée d'une prestation (la page n'existe que si le fichier existe) | `src/data/mecanique-fiches/<slug>.json` (type `ServiceDetail` dans `src/lib/mecanique.ts`) |
| 31 assureurs (nom, logo, `featured` = défile sur le portail) | `src/data/partners.json` + `src/assets/partners/*.webp` (script `tools/fetch_partners.py`) |
| 16 marques de véhicules (icônes) | `src/data/brands.json` (généré : `npm run brands`) |
| Avis Google | `src/data/reviews.json` (`capturedAt`, `items[]`) |
| Couleurs, polices | `src/styles/tokens.css`, `src/styles/global.css` |
| Gabarits | `src/layouts/Base.astro` (SEO, noindex, JSON-LD), `SpaceLayout.astro` (en-tête d'espace), `PageStub.astro` (pages provisoires) |
| Composants | `PortalHero`, `SpaceHeader` (grand menu), `LogoMarquee`, `ReviewsCarousel`, `ServiceCard`, `AccessBlock`, `SiteFooter`, `CallBar`, `Icons` |
| Formulaire en étapes | `src/scripts/quote-form.ts` (générique), `src/styles/form.css`, page `src/pages/mecanique/contact/` |
| Point de réception | `api/submit.php`, `api/config.example.php` (`config.php` et `storage/` ne sont jamais versionnés ni copiés) |

Conventions : `?prestation=<slug>` présélectionne une prestation du formulaire ; classe `.reveal` / `.is-in` pour les apparitions
au défilement (désactivées si mouvement réduit) ; `hidden` + CSS pour les menus ; styles Astro « scoped » (utiliser `:global`
pour les `<img>` produits par `<Image>`).

## Commandes

```bash
npm run dev     # site : http://127.0.0.1:4321 (proxy /api -> 8081)
npm run php     # PHP local : http://127.0.0.1:8081 (racine du dépôt, config tools/php-dev.ini)
npm run build   # astro build + copie sûre de api/ dans dist/api (tools/copy_api.mjs)
npm run check   # astro check (TypeScript 6 requis : TS 7 non pris en charge)
```

PHP 8.3 installé par winget : `C:\Users\flo\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe`
(le PATH n'est pris en compte que dans les nouveaux terminaux). Pour tester : `api/config.php` en mode `dev` écrit les
messages dans `api/storage/outbox/*.eml` ; supprimer ce dossier après les tests.

## État d'avancement (6 octobre 2026)

Fait et vérifié :
- Portail `/` : hero plein cadre, bandeaux de logos (12 assureurs, 16 marques), 10 avis défilants (pause, précédent, suivant,
  « Lire la suite »), accès et horaires.
- Espace mécanique : accueil (`/mecanique/`), grand menu clavier/mobile, catalogue (26 cartes), fiche **Freinage** rédigée,
  formulaire de devis en 3 étapes (`/mecanique/contact/`) + page « merci ».
- `api/submit.php` testé en local (PHP 8.3) : validation, champ piège, délai minimal, limite par IP (6/h), injection d'en-têtes
  neutralisée, accusé de réception, photos carrosserie (type réel vérifié, espace privé, pièce jointe), sujets
  « WCC — Mécanique|Carrosserie — Demande client — Marque Modèle ». Test de bout en bout navigateur → PHP → .eml réussi.
- `astro check` : 0 erreur ; build : 12 pages.

Pas encore fait (ordre conseillé) :
1. **25 fiches mécanique** à rédiger (priorité : révision-vidange, distribution, embrayage, climatisation, amortisseurs,
   diagnostic-electronique, pneumatiques), puis les autres. Respecter les réserves du catalogue : climatisation (type et quantité
   de gaz, ≈250 g, suppléments), forfait électrique (89 € hors Tesla chez AD ≠ refus des Tesla), aucun précontrôle gratuit promis,
   diagnostics sans réparations consécutives.
2. **Espace carrosserie** : accueil (entrée par le problème : accident, rayure, peinture…), 6 pages de prestations (accident,
   peinture et rayures, débosselage, grêle, vitrage, remise en état), page Assurances (31 logos + déroulement du dossier),
   formulaire avec **sélecteur de 9 zones** en SVG vue de dessus + liste équivalente + « Je ne sais pas », photos multiples
   redimensionnées côté navigateur (~1600 px). `SpaceHeader` gère déjà `space="carrosserie"` ; `submit.php` gère déjà
   `type=carrosserie` (champs : intervention, zones[], marque, modele, roulant, assurance, sinistre, pret, commentaire, photos[]).
3. Pages `/acces-horaires/`, `/mentions-legales/`, `/confidentialite/` (identité juridique, SIRET, responsable de publication,
   durée de conservation : informations à obtenir ; ne pas les inventer).
4. SEO : sitemap (variable `SITE_URL`), JSON-LD par page, image Open Graph, vérification des titres/descriptions uniques.
5. Qualité : Lighthouse, axe, navigation clavier, réduction des animations, mobile, liens internes.
6. Déploiement : documentation `DEPLOIEMENT.md` (OVH : dossier `www`, espace privé hors webroot pour `storage_dir`, SMTP/mail(),
   secrets), guide `CONTENU.md`, workflow GitHub Actions → FTPS **manuel et sans secrets** tant que rien n'est validé. Test réel
   de réception dans la boîte du garage avec et sans photos : seulement une fois l'hébergement choisi.
7. Fin de projet : repasser le dépôt en privé, puis **un seul push**.

À obtenir auprès de l'utilisateur / du client : hébergeur confirmé, vraies photos de l'atelier, logos officiels (assureurs,
éventuellement marques), identité légale, service d'envoi d'e-mails, conditions des prix d'appel, durée de conservation des
demandes et photos, domaine.

## Pièges rencontrés

- **Google bloque l'accès automatisé (reCAPTCHA)** : ne jamais tenter de le contourner ; demander à l'utilisateur de coller
  les contenus.
- Téléchargements : demander l'accord avant (liste, source, poids). Déjà approuvés : photos Unsplash, logos Acoat, PHP 8.3.
- Windows verrouille `public/` tant que le serveur de développement tourne (arrêter le processus du port 4321 avant de
  déplacer des dossiers). Ne pas modifier un fichier pendant une capture d'écran : le rechargement à chaud réinitialise la page.
- Pour contrôler visuellement les blocs `.reveal`, injecter une feuille de style qui force `opacity:1;transform:none` (les
  captures prennent parfois du retard dans le volet navigateur).
- Les gros blocs de texte avec guillemets passent mal dans le shell : écrire les fichiers avec l'outil d'écriture.
- `public/` est copié entièrement dans `dist/` : n'y mettre aucun secret ni donnée de test (c'est pourquoi `api/` est à la racine).
- Les fichiers du dossier miroir ChatGPT (`C:\Users\flo\.codex\.chatgpt-projects\…`) sont en lecture seule et ne servent plus.
