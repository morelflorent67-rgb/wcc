# WCC — notes de reprise

Fichier de reprise pour toute nouvelle session ou après compactage du contexte. À tenir à jour.
Dernière mise à jour : 19 octobre 2026 (retours visuels du client intégrés, voir « Retours client du 19 octobre » ; **poussé sur GitHub le 19 octobre**, aperçu sur Netlify ; reste les informations à obtenir et l'hébergement définitif avec PHP).

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
- **Cartes et menu : direction « A · Affiche » choisie par le client** (7 octobre 2026) pour les DEUX espaces : photo plein cadre, numéro en filaire,
  tag de prix en biais, coin coupé, détail au survol. Le menu « Prestations » est un **rail de cartes photo à défilement horizontal**
  (onglets de famille en mécanique), sur ordinateur et mobile. Prototypes B et C conservés dans `design/prototypes/cartes.html`.
- **Offre « flash info » (mécanique)** voulue par le client : « 90 points de contrôle offerts pour chaque prestation effectuée chez nous ».
  Bande sous l'en-tête de toutes les pages mécanique + macaron sur l'accueil mécanique ; texte dans `src/data/site.json` → `promo`
  (`enabled: false` la retire). **Conditions à obtenir de WCC** (contenu des 90 points, durée, exclusions) avant mise en ligne.
- **Un domaine, un portail, deux espaces autonomes** : `/`, `/carrosserie/…`, `/mecanique/…`, `/acces-horaires/`,
  pages légales. Pas de dépannage ni de location au lancement, aucun bouton inactif.
- **Astro 7 statique** (HTML pur), CSS natif, JS minimal, polices auto-hébergées (@fontsource), pas d'espace d'administration.
- **Contenus centralisés** (un prix, un texte, un logo saisi une seule fois) : voir « Où est quoi ».
- **Formulaires en PHP** (`api/submit.php`), compatible mutualisé OVH, PHP 8.1+.
- **GitHub** : premier push fait le 19 octobre 2026 sur `morelflorent67-rgb/wcc`, laissé **public** par choix explicite de l'utilisateur
  (il contient l'adresse Gmail du garage dans `docs/` et des logos tiers ; lui rappeler qu'il peut le passer en privé). Ne pas pousser
  sans accord explicite.
- **Netlify** : aperçu en ligne https://eclectic-bavarois-ab5706.netlify.app (projet `eclectic-bavarois-ab5706`, équipe
  `morel-florent67`), relié au dépôt GitHub le 19 octobre 2026 : **chaque push sur `main` republie le site automatiquement**. `netlify.toml` :
  build `npx astro build` (sans copier `api/`), Node 24, en-têtes de sécurité. **Netlify n'exécute pas le PHP** : les formulaires
  n'y fonctionnent pas (message d'échec qui invite à appeler) ; le site y reste en `noindex` tant que `PUBLIC_INDEXABLE` n'est pas défini.

## Règles de contenu (ne pas enfreindre)

- Français correct, accents compris. Textes écrits pour WCC, jamais copiés d'AD ni d'Acoat.
- **Rien d'inventé ni de non confirmé** : pas de délai chiffré, pas de prêt gratuit systématique, pas de franchise offerte,
  pas de garantie, pas de note globale ni d'étoiles non confirmées, pas de statistiques Acoat (effectif, surface…).
  **Atouts confirmés par le client (19 octobre 2026)**, en carrosserie **et** en mécanique : véhicule de prêt **systématique pendant la
  réparation** (jamais « gratuit » : non confirmé), véhicule rendu nettoyé, « Agréé assurances » (sans nommer d'assureur). Aucune affiliation AD ni
  constructeur ; marques = « marques prises en charge ».
- Prix : « À partir de X € » = **prix d'appel** (tarif de base WCC, remise éventuelle en plus), jamais un devis ; TTC / pièces / main-d'œuvre non précisés (à clarifier avec WCC).
- Les formulaires ne promettent ni rendez-vous ni délai de réponse.
- Les 26 descriptions courtes et les 26 fiches mécanique sont des **brouillons à faire valider** par WCC.
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
| Deux images principales (portail + en-têtes des espaces) | déposer `carrosserie.*` / `mecanique.*` dans `src/assets/hero/` (README) ; sinon photo d'illustration (`src/lib/hero.ts`) |
| Atouts communs aux deux espaces (prêt, nettoyage, agréé assurances) | texte : `site.json` → `atouts` ; affichés par `Atouts` (bandeau sous l'en-tête carrosserie, panneau « Le service en plus » du portail et de l'accueil mécanique) et par `ServiceBento` (« À votre service » : `services-carrosserie.json` → `home.advantages`, entrées `atout` + photo, `quote` vérifiée mot pour mot) |
| Plan d'accès animé | `tools/build_map.py` (données OpenStreetMap, extraits bruts non versionnés dans `design/map/`) → `src/assets/map/acces-fond.svg` + `src/data/map-acces.json` ; composant `AccessMap` |
| Couleurs, polices | `src/styles/tokens.css`, `src/styles/global.css` |
| Gabarits | `src/layouts/Base.astro` (SEO, noindex, JSON-LD), `SpaceLayout.astro` (en-tête d'espace), `PageStub.astro` (pages provisoires) |
| Composants | `PortalHero`, `SpaceHeader` (menu rail des deux espaces), `PhotoCard` (carte « Affiche », seule carte de prestation), `PhotoRail` (rail horizontal : menu et sections), `FlashInfo` (bande promo), `PromoSticker` (macaron), `LogoMarquee` (marques en couleur sur pastilles, assureurs en gris), `ReviewsCarousel` (pile de cartes, flèches de chaque côté, sans défilement automatique ni initiales, passage surligné `highlight`), `StepsList` (« route de nuit » : panneau sombre, voiture qui avance au défilement jusqu'au drapeau ; slot `head`, prop `cta`, `icon` par étape), `Atouts`, `ServiceBento`, `FaqList`, `CtaBand`, `VehicleZones` (schéma 9 zones + liste), `AccessBlock` (appel, semaine + ouvert/fermé en direct, carte), `AccessMap`, `SiteFooter`, `CallBar`, `Icons` |
| Cartes : données et photos | `src/lib/cards.ts` (met les prestations des deux espaces en forme), `src/lib/photos.ts` ; photo d'une prestation = champ `image` dans `services-mecanique.json` / `services-carrosserie.json` (fichier de `src/assets/illustration/`) ; script du rail : `src/scripts/rail.ts` |
| Offre flash info | `src/data/site.json` → `promo` |
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
npm run build   # astro build (SITE_URL=https://… pour canonical/sitemap/og:image, PUBLIC_INDEXABLE=true pour indexer) + copie sûre de api/ dans dist/api (tools/copy_api.mjs)
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

**Fait le 7 octobre 2026** : accueil mécanique = rail de TOUTES les prestations (onglets de famille) + liste « Par famille » allégée ; catalogue `/mecanique/prestations/` refait en index éditorial avec recherche ; direction A appliquée aux deux espaces (menu rail, accueils, catalogue, fiches « liées »), bande flash info
et macaron mécanique. `ServiceCard` et `ProblemCard` supprimés.

**En suspens (à traiter avant la suite)** :
1. ~~Tarifs mécanique~~ **réglé le 7 octobre 2026** : le client a précisé que son vrai tarif de base est celui de la grille de référence +50 %
   (les prix du catalogue de référence étaient donc 1,5× trop bas). `priceFrom` dans `services-mecanique.json` = tarif de base WCC (déjà ×1,5) ;
   la remise (20 %) se règle dans `site.json` → `promo.discountPercent`, calculée par `src/lib/mecanique.ts` (`pricingOf` : tarif de base barré,
   prix remisé, pourcentage). `promo.enabled: false` ou une `endDate` (AAAA-MM-JJ, affichée « valable jusqu'au… ») pilotent l'offre.
   Rappel client : un prix barré doit être le tarif réellement pratiqué (règle du prix de référence), garder des preuves (devis/factures).
   La mention « Flash info » a été retirée (c'était un exemple de style) : bande = « −20 % sur les prix affichés · 90 points de contrôle offerts… ».
2. ~~Une photo par prestation~~ **faite le 7 octobre 2026** : 21 photos Unsplash ajoutées (`mecanique-<slug>.jpg`, 1200 px, via
   `design/illustrations.json` + `tools/fetch_illustrations.py`, crédits dans `src/assets/illustration/CREDITS.md`), champ `image` de chaque
   prestation. Choix à l'œil sur miniatures ; quelques-unes sont des illustrations approximatives (ex. diagnostic sécurité, filtre d'habitacle,
   purge du liquide de frein) à remplacer par de vraies photos de l'atelier. La recherche Unsplash par script est refusée (401) : passer par le navigateur.

Pas encore fait (ordre conseillé) :
1. ~~Fiches mécanique~~ **faites le 7 octobre 2026** : les 26 prestations ont leur fiche (`src/data/mecanique-fiches/<slug>.json`, 45 pages au build).
   Textes originaux, SANS prix (les prix viennent de `services-mecanique.json`), sans délai ni garantie. Réserves respectées : climatisation
   (type et quantité de fluide, recherche de fuite et suppléments renvoyés au devis, « le prix d'appel ne correspond pas à une recharge
   complète de tous les véhicules »), véhicule électrique (périmètre confirmé au devis, pas de refus d'une marque), précontrôle et diagnostics
   (examens : réparations en devis séparé, ne remplace pas le contrôle technique, aucune gratuité). **À faire valider par WCC** : tous les textes,
   surtout les contenus de prestation que WCC réalise réellement (méthodes de décalaminage et de nettoyage EGR, rénovation d'optiques, pièces
   d'échange pour alternateur/injecteurs, contenu du diagnostic sécurité et de l'écodiagnostic).
2. ~~Espace carrosserie~~ **fait** (voir ci-dessus). Reste à valider avec WCC : tous les textes (brouillons), en particulier « le choix du
   réparateur vous appartient », « selon votre contrat une franchise peut rester à votre charge », « véhicule de prêt possible selon
   disponibilités », « bris de glace : garantie dédiée », méthodes de débosselage/grêle (sans repeinture selon l'état de la peinture),
   et la liste des 31 assureurs présentés comme « partenaires » (liste issue de la fiche Acoat : à confirmer qu'elle correspond à WCC).
   Photos provisoires réutilisées (grêle = cabine de peinture, débosselage = polissage) : à remplacer par de vraies photos.
3. ~~Pages `/acces-horaires/`, `/mentions-legales/`, `/confidentialite/`~~ **faites le 7 octobre 2026** (gabarit `src/layouts/InfoLayout.astro`).
   Identité juridique dans `src/data/legal.json` : tous les champs valent `null` (marqués « à compléter » à l'écran, avertis au build) ; tant
   qu'il en manque, les deux pages légales sont en `noindex` et hors sitemap. **À obtenir de WCC** : dénomination, forme, SIRET, RCS/RM, TVA,
   directeur de publication, e-mail, hébergeur, médiateur de la consommation, durées de conservation (demandes, photos). Le texte de confidentialité décrit
   le fonctionnement réel (aucun cookie ni service tiers, stockage de session du formulaire, IP hachée et supprimée après 1 h : `api/submit.php` purge
   `storage/ratelimit`) : à relire si on ajoute une mesure d'audience ou un service externe. Le texte « Marques, logos et images » dit que les assureurs
   cités sont ceux avec lesquels des dossiers « peuvent être traités » (liste Acoat à confirmer).
4. SEO — **fait en base** : titres/descriptions uniques et de longueur correcte sur toutes les pages (contrôle : script d'audit sur `dist/`), canonical +
   sitemap (sans pages « merci » ni légales) et `og:image` (`public/og.png`, source `design/og/og.html`) seulement si `SITE_URL` est défini au build ;
   `PUBLIC_INDEXABLE=true` pour autoriser l'indexation (sinon `noindex` partout) ; JSON-LD `AutoBodyShop/AutoRepair` sur le portail et `/acces-horaires/`.
   `robots.txt` est produit au build (`src/pages/robots.txt.ts`) : `Disallow: /` sauf si `PUBLIC_INDEXABLE=true` (alors `Allow` + sitemap). Page 404 : `src/pages/404.astro`.
5. Qualité — **premier passage fait le 7 octobre 2026** (scripts dans `tools/qa/`, voir son README) : 45 pages × 375/768/1280 px sans problème sur
   débordement, `lang`, `h1`, ordre des titres, noms accessibles, `alt`, cibles ≥ 24 px, contraste (fond uni) ; clavier : tabulation, grand menu (Entrée/Échap/
   retour du focus) OK ; pause ajoutée aux bandeaux de logos (WCAG 2.2.2). **Reste à faire** : contraste des textes posés sur photo (cartes, héros) à
   contrôler à l'œil ; lecteur d'écran réel ; Lighthouse et axe-core (nécessitent un téléchargement : demander l'accord) ; test sur vrais téléphones.
6. ~~Déploiement (documentation)~~ **fait le 7 octobre 2026** : `docs/DEPLOIEMENT.md` (OVH, config.php, dossier privé, contrôles, retour arrière), `docs/CONTENU.md`,
   `public/.htaccess` (404, HTTPS, en-têtes, cache : **non testé**, pas d'Apache en local), `.github/workflows/deploy.yml` (manuel, essai à blanc par défaut, aucun
   secret configuré ; action FTP-Deploy v4.3.5). Reste : choix de l'hébergeur, test de réception réel (avec/sans photos), premier déploiement.
7. Fin de projet : repasser le dépôt en privé, puis **un seul push**.

**Retours client du 19 octobre 2026 (faits)** : logo sans blanc dans le C du milieu (`tools/make_logo.py`, favicons inchangés car sur pastille
blanche) ; bloc « Accès & horaires » refait (carte d'appel, semaine avec « Aujourd'hui » et état ouvert/fermé, copie de l'adresse, plan animé
OpenStreetMap avec trajet à pied depuis le tram B « Hoenheim Gare », liens Google Maps et Waze, aussi sur `/acces-horaires/`) ; marques en couleur
officielle (assureurs inchangés) ; carrosserie : bandeau des 3 atouts sous l'en-tête, « À votre service » en mosaïque photo (3 photos Unsplash
ajoutées, accord donné) ; panneau « Le service en plus » sur le portail ; « Simple, étape par étape » = trajet interactif (aussi en mécanique,
assurances, fiches carrosserie) ; avis : titre « Ils en parlent mieux que nous. », pile de cartes. Deuxième passe (même jour) : images
principales générées par l'utilisateur déposées (`src/assets/hero/carrosserie.webp`, `mecanique.webp`, 1536 × 1024) ; étapes refaites en
« route de nuit » (choix de l'utilisateur) ; avis : flèches de part et d'autre, plus d'initiales ni de minuteur (donc plus de défilement
automatique). Troisième passe : voiture plus rapide (trajet complet pendant que le panneau est à l'écran) ; atouts déclarés pour les deux
espaces, panneau du portail « Carrosserie et mécanique » (liens vers les deux), panneau bleu sur l'accueil mécanique. Piège rencontré : les noms d'animation CSS (`@keyframes`) sont **globaux** même dans les styles Astro « scoped » : préfixer
par composant (`map-`, `acc-`, `atout-`, `rv-`, `st-`), sinon une animation en écrase une autre (le slogan du portail avait été déplacé).

**Liste complète et numérotée des questions à poser : `docs/QUESTIONS-WCC.md`** (à tenir à jour). Résumé — à obtenir auprès de l'utilisateur / du client : hébergeur confirmé, vraies photos de l'atelier, logos officiels (assureurs,
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
