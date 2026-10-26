# Référencement WCC — état, référencement local, suivi

Mis à jour le 26 octobre 2026.

## 1. État technique (vérifié sur le site en ligne le 26 octobre 2026)

- Adresse canonique : **https://www.world-car-carrosserie.fr/** (identique à `SITE_URL`). Le domaine nu et `http://` sont redirigés en **301, en une seule étape**, vers `https://www.…` (`public/.htaccess`). Certificat valide sur les deux noms.
- `robots.txt` : `Allow: /`, `Disallow: /api/`, `Sitemap: …/sitemap-index.xml` (`PUBLIC_INDEXABLE=true` depuis le 26 octobre 2026).
- Toutes les pages (sauf les deux pages « merci » et la 404) : `index, follow`, canonical, titre et description uniques (46 pages, contrôlées sur le build). Pages « merci » et 404 : `noindex`.
- JSON-LD `AutoBodyShop` + `AutoRepair` (nom, téléphone, adresse, coordonnées, horaires) sur l'accueil et `/acces-horaires/`. Aucune note ni `aggregateRating` (voulu).
- `og:image` 1200 × 630, sitemap-index → `sitemap-0.xml`.
- PageSpeed Insights, accueil, mobile (26 octobre 2026) : Performances 99, Accessibilité 96, Bonnes pratiques 100, SEO 100 ; FCP 1,5 s, LCP 2,0 s, TBT 0 ms, CLS 0. Points relevés en accessibilité : listes contenant autre chose que des `<li>`, arborescence d'accessibilité mal formée (à corriger, mineur). Autres pages non mesurées.

## 2. Google Search Console

- Propriété **Domaine** `world-car-carrosserie.fr` (couvre www, sans www, http, https), validée le 26 octobre 2026 par un enregistrement **TXT** à la racine de la zone OVH (`google-site-verification=…`). **Ne jamais supprimer cet enregistrement.** MX et SPF intacts.
- Sitemap `https://www.world-car-carrosserie.fr/sitemap-index.xml` envoyé le 26 octobre 2026. Premier état : « Impossible de récupérer le sitemap » (fréquent juste après l'envoi, le fichier répond pourtant en 200) : revérifier sous 24 à 48 h ; sinon, renvoyer `sitemap-0.xml` directement.
- Indexation demandée (inspection d'URL) le 26 octobre 2026 : accueil, `/carrosserie/`, `/mecanique/`, `/acces-horaires/`, `/carrosserie/assurances/`, `/mecanique/prestations/`. Le quota est limité : le reste suit par le sitemap.

## 3. Fiche d'établissement Google

- **Une fiche existe déjà** : « WORLD CAR / WCC / CARROSSERIE STRASBOURG », 5 A avenue de l'Énergie, 67800 Bischheim, 03 69 48 44 85, 5,0 (269 avis au 26 octobre 2026). Elle est animée par un propriétaire (réponses aux avis, photos) mais **n'est pas dans le compte Google de l'utilisateur** (celui-ci gère « FR Services » et « TH Dépannage »).
- Le **site web de la fiche pointe vers `acoat-selected.fr`**, pas vers le nouveau site.
- À faire par **WCC (propriétaire de la fiche)** ou en demandant l'accès propriétaire/gestionnaire : remplacer le site web par `https://www.world-car-carrosserie.fr/` ; vérifier horaires (lun.–ven. 9 h–12 h, 14 h–18 h), téléphone, adresse. Le nom actuel (avec « CARROSSERIE STRASBOURG ») diffère du nom du site : Google sanctionne les noms surchargés ; décision à prendre par WCC (nom officiel : « World Car Carrosserie »). Ne rien déclarer de non confirmé (catégories, services). Pas d'avis inventés ni de note ajoutée au site.

## 4. Cohérence NAP (à reproduire à l'identique partout)

| Élément | Valeur (source `src/data/site.json`) |
| --- | --- |
| Nom | World Car Carrosserie (WCC) |
| Adresse | 5a avenue de l'Énergie, 67800 Bischheim |
| Téléphone | 03 69 48 44 85 |
| Horaires | Du lundi au vendredi, 9 h–12 h et 14 h–18 h |
| Site | https://www.world-car-carrosserie.fr/ |
| Activité | Carrosserie et mécanique multimarque |

## 5. Annuaires et liens à renseigner (rien n'a été créé : accord de l'utilisateur d'abord)

À renseigner avec le tableau du §4, sans rien ajouter de non confirmé :
1. Google Business Profile (§3), prioritaire.
2. Bing Places (import possible depuis Google).
3. Apple Plans (Apple Business Connect).
4. Pages Jaunes (fiche gratuite de base).
5. Waze / OpenStreetMap (vérifier l'adresse sur la carte).
6. Annuaires auto fiables : Facebook (page entreprise) si WCC en a une, Yelp, Mappy, Cylex.
7. Liens à obtenir : site d'Acoat (si WCC en fait partie, lien vers le site), assureurs ou partenaires qui listent WCC, mairie / CCI / associations de Bischheim.
Éviter les annuaires payants ou de liens en masse.

## 6. Suivi

**À 1 semaine (≈ 2 novembre 2026)**
- Search Console → Sitemaps : état « Réussite », nombre de pages découvertes (≈ 44, hors merci/404).
- Pages : combien indexées, motifs d'exclusion.
- Inspection d'URL de l'accueil : « L'URL est sur Google ».
- Recherche `site:world-car-carrosserie.fr`.

**À 1 mois (≈ 26 novembre 2026)**
- Performances : impressions et clics ; requêtes à surveiller : « carrosserie Bischheim », « garage Bischheim », « mécanique Bischheim », « carrosserie Strasbourg », « devis carrosserie Strasbourg », « réparation grêle », « climatisation voiture Bischheim », nom de la marque.
- Pages : erreurs (404, redirections, « explorée, non indexée »), Core Web Vitals, Expérience.
- Contrôler que le sitemap et le canonical restent sur `www`.
- Fiche Google : appels, itinéraires, clics vers le site.

**À 3 mois (≈ 26 janvier 2027)**
- Position moyenne des requêtes locales ; pages qui reçoivent les impressions.
- Ajuster titres/descriptions des pages à fort nombre d'impressions et faible taux de clic.
- Vérifier les annuaires (NAP identique) et les nouveaux liens.
- Rappel : le médiateur de la consommation reste à fournir (section masquée tant que `legal.json` → `mediator.name` est vide).
