# WCC — notes de reprise

Fichier de reprise pour toute nouvelle session ou après compactage du contexte. À tenir à jour.
Dernière mise à jour : 6 octobre 2026 (5 commits locaux, rien de poussé ; espace carrosserie livré).

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
  pas de garantie, pas de note globale ni d'étoiles non confirmées, pas de statistiques Acoat (effectif, surface…).
  Véhicule de prêt : « possible » seulement. Aucune affiliation AD ni constructeur ; marques = « marques prises en charge ».
- Prix : « À partir de X € » = **prix d'appel**, jamais un devis ; TTC / pièces / main-d'œuvre non précisés (à clarifier avec WCC).
- Les formulaires ne promettent ni rendez-vous ni délai de réponse.
- Les 26 descriptions courtes et la fiche Freinage sont des **brouillons à faire valider** par WCC.
- Photos actuelles = illustrations Unsplash provisoires (`src/assets/illustration/CREDITS.md`), à ne jamais présenter comme
  les locaux ou réalisations de WCC ; l'utilisateur les remplacera lui-même (même nom de fichier).
- Logos assureurs = fichiers **provisoires** de la fiche Acoat (31, 250×188 px) ; marques = icônes simple-icons (CC0) +
  étoile Mercedes redessinée. Remplacer par les fichiers officiels dès que possible.
- Avis Google : 10 avis réels fournis par l'utilisateur (texte verbatim, auteurs abrégés « Prénom N. », durées traduites,
  relevés le 6 octobre 2026). **5 étoiles sur chacun** (confirmé par l'utilisateur : les étoiles n'avaient pas pu être
  copiées). Aucune note globale ni `aggregateRating` : seulement les étoiles par avis. Jamais d'avis inventé.

## Où est quoi

| Contenu | Fichier |
| --- | --- |
| Adresse, téléphone, horaires, itinéraire | `src/data/site.json` |
| 26 prestations mécanique, 5 familles, prix d'appel, textes courts | `src/data/services-mecanique.json` |
| Fiche détaillée d'une prestation (la page n'existe que si le fichier existe) | `src/data/mecanique-fiches/<slug>.json` (type `ServiceDetail` dans `src/lib/mecanique.ts`) |
| 31 assureurs (nom, logo, `featured` = défile sur le portail) | `src/data/partners.json` + `src/assets/partners/*.webp` (script `tools/fetch_partners.py`) |
| 16 marques de véhicules (icônes) | `src/data/brands.json` (généré : `npm run brands`) |
| Avis Google | `src/data/reviews.json` (`capturedAt`, `items[]`) |
| Espace carrosserie : 6 prestations (texte complet de chaque page), textes de l'accueil (étapes, avantages, FAQ) et de la page Assurances | `src/data/services-carrosserie.json` (types dans `src/lib/carrosserie.ts`) ; pages générées par `src/pages/carrosserie/prestations/[slug].astro` |
| Couleurs, polices | `src/styles/tokens.css`, `src/styles/global.css` |
| Gabarits | `src/layouts/Base.astro` (SEO, noindex, JSON-LD), `SpaceLayout.astro` (en-tête d'espace), `PageStub.astro` (pages provisoires) |
| Composants | `PortalHero`, `SpaceHeader` (grand menu des deux espaces), `LogoMarquee`, `ReviewsCarousel`, `ServiceCard` (mécanique), `ProblemCard` (carrosserie), `StepsList`, `FaqList`, `CtaBand`, `VehicleZones` (schéma 9 zones + liste), `AccessBlock`, `SiteFooter`, `CallBar`, `Icons` |
| Formulaires en étapes | `src/scripts/quote-form.ts` (générique : règles `data-require`, préremplissage `?prestation=` / `?intervention=`), `src/styles/form.css`, pages `mecanique/contact/` et `carrosserie/contact/` |
| Formulaire carrosserie : zones, photos | `src/scripts/zone-picker.ts` (schéma ↔ cases à cocher), `src/scripts/photo-upload.ts` (réduction ~1600 px dans le navigateur, 6 photos max : garder cohérent avec `max_files` / `max_file_mb` de `api/config.php`) |
| Point de réception | `api/submit.php`, `api/config.example.php` (`config.php` et `storage/` ne sont jamais versionnés ni copiés) |

Conventions : `?prestation=<slug>` présélectionne une prestation du formulaire mécanique, `?intervention=<valeur>` (accident, peinture,
debosselage, grele, vitrage, remise-en-etat, autre) une intervention du formulaire carrosserie ; `--wrap` (tokens.css) = conteneur
dont le contenu s'aligne sur les blocs « marge seule » ; classe `.reveal` / `.is-in` pour les apparitions
au défilement (désactivées si mouvement réduit) ; `hidden` + CSS pour les menus ; styles Astro « scoped » (utiliser `:global`
pour les `<img>` produits par `<Image>`).

## Commandes

```bash
npm run dev     # site : http://127.0.0.1:4321 (proxy /api -> 8081)
npm run php     # PHP local : http://127.0.0.1:8081 (racine du dépôt, config tools/php-dev.ini)
npm run build   # astro build + copie sûre de api/ dans dist/api (tools/copy_api.mjs)
npm run check   # astro check (TypeScript 6 requis : TS 7 non pris en charge)
npm run links   # après un build : vérifie les liens internes de dist/ (tools/check_links.py)
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
- **Espace carrosserie** (`/carrosserie/…`) : accueil (entrée par le problème : 6 cartes, partenaires assurance, déroulement, avantages
  confirmés, marques, FAQ), `/prestations/` + 6 pages (accident, peinture-rayures, debosselage, reparation-grele, vitrage-pare-brise,
  remise-en-etat), `/assurances/` (31 logos, déroulement d'un dossier, documents à préparer, FAQ), formulaire en 3 étapes avec schéma
  des 9 zones (vue de dessus) + liste équivalente + « Je ne sais pas » (exclusif), photos multiples réduites dans le navigateur,
  page « merci », grand menu des interventions. Testé en navigateur : validations, zones, photos (483 Ko → 125 Ko), envoi de bout
  en bout vers PHP (e-mail au garage avec 3 pièces jointes + accusé, photos dans l'espace privé). Aucun prix d'appel en carrosserie.
- `astro check` : 0 erreur ; build : 20 pages ; 1022 liens internes valides.

**En attente de décision de l'utilisateur (priorité avant les 25 fiches)** : il veut (1) un menu « Prestations » en **rail de cartes photo à
défilement horizontal** (comme le carrousel du site AD qu'il a montré en capture), pour la mécanique ET la carrosserie, et (2) des cartes
de prestations au design **vraiment unique** (mes cartes blanches actuelles, `ServiceCard` / `ProblemCard`, « font trop Claude Code »).
Prototype interactif : `design/prototypes/cartes.html` (serveur `wcc-prototypes`, http://localhost:4173/design/prototypes/cartes.html ;
paramètres `?v=a|b|c&s=mecanique|carrosserie&menu=1`) avec 3 directions : **A Affiche** (photo plein cadre, chiffres en filaire, tag de prix
en biais, détail au survol), **B Étiquette** (fiche d'atelier, ombre franche, photo en bichromie, pastille de prix), **C Panneau** (grande
photo + panneau en biais aux couleurs de l'espace). Une fois la direction choisie : remplacer le grand menu de `SpaceHeader` par le rail,
refaire `ServiceCard` / `ProblemCard`, et prévoir **une photo par prestation** (26 mécanique : il manque ~20 photos libres de droits ;
téléchargement à faire approuver avant).

Pas encore fait (ordre conseillé) :
1. **25 fiches mécanique** à rédiger (prochain chantier conseillé) (priorité : révision-vidange, distribution, embrayage, climatisation, amortisseurs,
   diagnostic-electronique, pneumatiques), puis les autres. Respecter les réserves du catalogue : climatisation (type et quantité
   de gaz, ≈250 g, suppléments), forfait électrique (89 € hors Tesla chez AD ≠ refus des Tesla), aucun précontrôle gratuit promis,
   diagnostics sans réparations consécutives.
2. ~~Espace carrosserie~~ **fait** (voir ci-dessus). Reste à valider avec WCC : tous les textes (brouillons), en particulier « le choix du
   réparateur vous appartient », « selon votre contrat une franchise peut rester à votre charge », « véhicule de prêt possible selon
   disponibilités », « bris de glace : garantie dédiée », méthodes de débosselage/grêle (sans repeinture selon l'état de la peinture),
   et la liste des 31 assureurs présentés comme « partenaires » (liste issue de la fiche Acoat : à confirmer qu'elle correspond à WCC).
   Photos provisoires réutilisées (grêle = cabine de peinture, débosselage = polissage) : à remplacer par de vraies photos.
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
- Si le volet navigateur est masqué, la page est mesurée avec une largeur nulle (`innerWidth` = 0) : les mesures JS (ex. « Lire la
  suite ») sont alors fausses ; rouvrir le volet et recharger avant de conclure à un bug.
- Captures fiables : le volet navigateur est souvent masqué (captures périmées/expirées). Alternative : Chrome headless
  (`chrome.exe --headless=new --force-prefers-reduced-motion --window-size=1440,6000 --screenshot=… <url>` : page entière, animations
  d'apparition désactivées, largeur minimale ≈ 500 px) ; pour tester une interaction, piloter Chrome par le protocole DevTools
  (WebSocket intégré à Node). Sous Git Bash, préfixer par `MSYS_NO_PATHCONV=1` tout argument commençant par `/` passé à un programme
  Windows (sinon `/carrosserie/` devient `C:/Program Files/Git/carrosserie/`).
- Les gros blocs de texte avec guillemets passent mal dans le shell : écrire les fichiers avec l'outil d'écriture.
- `public/` est copié entièrement dans `dist/` : n'y mettre aucun secret ni donnée de test (c'est pourquoi `api/` est à la racine).
- Les fichiers du dossier miroir ChatGPT (`C:\Users\flo\.codex\.chatgpt-projects\…`) sont en lecture seule et ne servent plus.
