# Mise en ligne

Rien n'est publié, aucun hébergement ni domaine n'est choisi à ce jour. Ce guide décrit la procédure pour un hébergement mutualisé
**OVH** (Apache + PHP) ; elle vaut avec peu d'adaptations pour tout hébergeur Apache/PHP.

## Ce qu'il faut avoir décidé avant

- Hébergeur et offre (PHP 8.1 ou plus, accès FTP/FTPS, fonction `mail()` ou SMTP).
- Nom de domaine, avec HTTPS actif (le certificat est généralement offert par l'hébergeur).
- Boîte d'envoi du formulaire (adresse du domaine, ex. `formulaire@mon-domaine.fr`) et boîte de réception du garage.
- Identité légale de WCC et durées de conservation (`src/data/legal.json`).
- Conditions de l'offre « 90 points de contrôle » ; sinon mettre `promo.enabled` à `false` dans `src/data/site.json`.
- Vraies photos de l'atelier (voir `CONTENU.md`).

## 1. Construire le site

```bash
SITE_URL=https://www.mon-domaine.fr PUBLIC_INDEXABLE=true npm run build
```

- `SITE_URL` : adresse publique, nécessaire pour les adresses canoniques, le plan du site (`sitemap-index.xml`), le `robots.txt` et l'image de partage.
- `PUBLIC_INDEXABLE=true` : autorise les moteurs de recherche. **Sans cette variable le site se déclare non indexable** (`noindex` + `robots.txt` qui interdit
  tout) : c'est le réglage pour tout essai ou site provisoire.
- Résultat dans `dist/` (HTML, images, `api/` du formulaire, `.htaccess`). `api/config.php` et `api/storage/` n'y sont jamais copiés.

## 2. Préparer le point de réception des formulaires (une seule fois)

Sur l'hébergement, hors du dossier public si possible :

1. Créer un dossier privé, par exemple `/home/<compte>/wcc-prive` (au même niveau que `www`, donc inaccessible depuis le web).
2. Dans `www/api/`, copier `config.example.php` en **`config.php`** et renseigner :
   - `env` : `prod` (en `dev` rien n'est envoyé, les messages restent dans des fichiers) ;
   - `mail_to` : l'adresse qui reçoit les demandes ;
   - `mail_from` : une adresse **du domaine** du site (sinon les messages risquent de finir en courrier indésirable) ;
   - `secret` : une longue chaîne aléatoire (sert à anonymiser les adresses IP) ;
   - `storage_dir` : le dossier privé créé à l'étape 1 (photos, anti-abus) ;
   - `max_files`, `max_file_mb` : à garder cohérents avec le formulaire (6 photos, réduites à ~1600 px avant envoi).
3. Ne jamais publier `config.php` ailleurs que sur le serveur (il est exclu du dépôt et du déploiement).

Réglages PHP à vérifier dans le manager OVH : version 8.1 ou plus, `post_max_size` et `upload_max_filesize` d'au moins 20 Mo.

## 3. Envoyer les fichiers

### Option A — à la main (la plus simple pour commencer)

Avec un client FTPS (FileZilla…), envoyer **le contenu** de `dist/` dans le dossier `www/` de l'hébergement (y compris les fichiers cachés
`.htaccess`, à la racine et dans `api/`). Ne pas écraser `api/config.php`.

### Option B — GitHub Actions (manuel)

Le workflow `.github/workflows/deploy.yml` construit le site et l'envoie en FTPS. Il ne se lance **que sur clic** (« Actions » > « Déployer le site »)
et n'a aucun secret configuré tant qu'on n'en a pas ajouté.

1. Dans le dépôt GitHub : Settings > Secrets and variables > Actions, créer `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (identifiants FTP de l'hébergement).
2. Lancer le workflow une première fois en laissant **« Essai à blanc » coché** : il liste ce qui serait envoyé, sans rien envoyer.
3. Relancer en décochant l'essai à blanc.
4. Le workflow envoie uniquement ce qui a changé et ne touche pas à `api/config.php` ni au dossier privé (ils n'existent pas dans `dist/`).

Le dépôt contient l'adresse Gmail du garage (`docs/`) et des logos tiers : le passer en **privé** avant d'y ajouter des secrets ou de pousser.

## 4. Contrôles après mise en ligne

- Ouvrir le site en HTTPS ; vérifier une page inexistante (page 404 du site) et les deux formulaires.
- **Test de réception réel** : envoyer une demande mécanique, puis une demande carrosserie avec 2-3 photos ; vérifier le message reçu par le garage
  (pièces jointes, objet « WCC — Carrosserie — Demande client — Marque Modèle »), l'accusé de réception du client, et que les photos sont bien rangées
  dans le dossier privé. Contrôler aussi le dossier « courrier indésirable ».
- Vérifier `https://mon-domaine.fr/robots.txt` (doit autoriser) et `https://mon-domaine.fr/sitemap-index.xml`.
- Un accès à `https://mon-domaine.fr/api/config.php` ou `/api/storage/` doit répondre **403/404**.
- Déclarer le plan du site dans la Google Search Console et créer/compléter la fiche Google de l'établissement avec les mêmes coordonnées que le site.

## Retour arrière

- Publication manuelle : conserver une copie du précédent `dist/` (ou le recréer avec `git checkout <commit> && npm run build`) et le renvoyer.
- Avec le dépôt : `git revert <commit>` puis relancer le workflow.
- Pour retirer une page de l'indexation en urgence : remettre `PUBLIC_INDEXABLE` à `false` (ou ne pas le définir), reconstruire et renvoyer.

## Sauvegardes

À sauvegarder côté hébergeur : `www/api/config.php` et le dossier privé des demandes/photos (les durées de conservation sont à décider avec WCC :
`legal.json` et page Confidentialité). Le reste du site se reconstruit depuis le dépôt.

## Fichiers du serveur

| Fichier | Rôle |
| --- | --- |
| `.htaccess` (racine) | page 404, HTTPS, en-têtes de sécurité, mise en cache. Non testé en local (pas d'Apache) : vérifier après la première mise en ligne ; si le serveur renvoie une erreur 500, retirer le bloc `<If>` ou la règle HTTPS |
| `api/submit.php` | réception des formulaires (validation, anti-spam, e-mail, photos) |
| `api/.htaccess`, `api/storage/.htaccess` | interdisent l'accès direct à la configuration et au stockage |
