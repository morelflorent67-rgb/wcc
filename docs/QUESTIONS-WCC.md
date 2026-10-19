# Questions restantes pour finaliser le site

État au 19 octobre 2026 (retours du client intégrés : logo, accès, marques en couleur, atouts carrosserie, étapes, avis). Le site est construit ; il reste des informations que seuls WCC (partie 2) et vous (partie 1) peuvent fournir.
Tant qu'une réponse manque, le site ne dit rien d'inventé : le champ concerné reste « à compléter », ou le contenu reste un brouillon.

**Priorité** : 🔴 bloque la mise en ligne · 🟠 à régler avant ou juste après · 🟢 amélioration.

---

## Partie 1 — À décider par vous (créateur du site)

| | Question | Pourquoi / conséquence |
| --- | --- | --- |
| 🔴 | **Hébergeur et offre** : OVH mutualisé confirmé ? Quelle offre (PHP 8.1 ou plus, FTPS, envoi d'e-mails) ? | Détermine `DEPLOIEMENT.md`, l'envoi des formulaires et l'accès FTP. |
| 🔴 | **Nom de domaine** : lequel, qui le détient, est-il déjà acheté ? HTTPS actif ? | Adresse publique (`SITE_URL`), sitemap, e-mail d'expédition. Rien ne sera acheté sans votre accord. |
| 🔴 | **Envoi des e-mails** : `mail()` de l'hébergeur ou compte SMTP ? Quelle adresse d'expédition du domaine (ex. `formulaire@…`) ? | Évite le courrier indésirable ; test de réception réel obligatoire avant ouverture. |
| 🔴 | **Dépôt GitHub** : OK pour le passer en **privé** puis faire **un seul push** à la fin ? Déploiement : à la main (FTP) ou via le workflow manuel ? | Le dépôt contient l'adresse Gmail du garage et des logos tiers. Aucun push sans votre accord. |
| 🟠 | **Qui valide** les textes côté WCC, et comment (relecture du site local, document, signature) ? | Les 26 fiches, les 6 pages carrosserie et la page Assurances sont des brouillons. |
| 🟠 | **Suivi des visites** (statistiques, suivi des appels) : souhaité ? | Aujourd'hui aucun cookie ni service tiers (pas de bandeau nécessaire). Un outil de mesure changerait la page Confidentialité et pourrait imposer un bandeau. |
| 🟢 | **Maintenance** : qui modifiera prix, photos et avis après la mise en ligne (vous, WCC) ? | Guide prêt : `CONTENU.md`. |

---

## Partie 2 — À demander à WCC

### A. Identité légale (mentions légales et confidentialité) 🔴
À reporter dans `src/data/legal.json`. Tant que c'est vide, ces deux pages restent en `noindex`.

1. Dénomination sociale exacte et forme juridique (SARL, SAS, entreprise individuelle…).
2. Capital social (si société).
3. SIRET, numéro RCS ou répertoire des métiers (ville d'immatriculation), numéro de TVA intracommunautaire.
4. Nom du **directeur de la publication** (personne responsable du contenu du site).
5. Adresse e-mail de contact pour les mentions légales et pour l'exercice des droits sur les données.
6. **Médiateur de la consommation** auquel WCC adhère (nom, adresse, site) — obligation légale vis-à-vis des particuliers.
7. Assurance professionnelle ou autre mention obligatoire propre au métier : y en a-t-il à afficher ?

### B. Données des clients 🔴
8. **Durée de conservation** des demandes de devis (coordonnées, véhicule, description) : combien de temps souhaitez-vous les garder ?
9. Durée de conservation des **photos** envoyées (carrosserie) ?
10. Qui, chez WCC, lit les demandes et a accès à la boîte de réception ? Une seule adresse (`worldcarcarrosserie@gmail.com`) ou plusieurs ?
11. Les demandes doivent-elles aller vers une autre adresse selon l'activité (une pour la mécanique, une pour la carrosserie) ?

### C. L'offre de l'espace mécanique (−20 % et « 90 points de contrôle offerts ») 🔴
12. **Les 90 points de contrôle** : quelle liste exacte (document à fournir) ? Réalisés sur quel type de véhicule ? Un compte rendu est-il remis au client ?
13. Pour quelles prestations l'offre s'applique-t-elle : **toutes** (y compris diagnostic, précontrôle, pneumatiques) ou certaines seulement ? Des exclusions (véhicule électrique, prestation sur devis…) ?
14. **Durée** de l'offre : date de début et de fin (le site peut afficher « valable jusqu'au… ») ? Sans limite de durée ?
15. La remise de 20 % est-elle **cumulable** avec d'autres remises ou offres ? Applicable aux pièces comme à la main-d'œuvre ?
16. Les **tarifs de base** (prix barrés) : confirmer qu'il s'agit de prix **réellement pratiqués** avant l'offre, et conserver les devis/factures qui le prouvent. Les montants sont-ils en **TTC** ?
17. Faut-il afficher une mention sous les prix (« TTC », « pièces comprises/non comprises », « main-d'œuvre comprise ») ? Ce que le prix « à partir de » inclut exactement, prestation par prestation.

### D. Contenu des prestations mécanique (26 fiches à valider) 🟠
Pour chacune, dire ce que WCC fait réellement et corriger le texte si besoin. Points précis où je n'ai pas pu savoir :

18. **Climatisation** : type de gaz (R134a, R1234yf), quantité comprise dans le prix d'appel, recherche de fuite incluse ou non, véhicules électriques/hybrides pris en charge ?
19. **Décalaminage** et **vanne EGR** : quelle méthode (produit, machine à hydrogène, démontage et nettoyage) ? Les textes parlent de « nettoyage » sans promettre de résultat.
20. **Rénovation d'optiques** : quelle technique (polissage, vernis de protection) ?
21. **Alternateur, injecteurs** : réparation, échange standard, remplacement par pièce neuve ?
22. **Diagnostic sécurité** et **écodiagnostic** : quels contrôles exacts et quelle restitution au client ?
23. **Forfait d'entretien véhicule électrique** : contenu précis, marques acceptées (aucun refus annoncé aujourd'hui).
24. **Précontrôle technique** : réalisé comment, avec quelle restitution ? (Le site précise déjà qu'il ne remplace pas le contrôle technique officiel et qu'il n'est pas gratuit.)
25. **Pneumatiques** : montage seul, vente de pneus, géométrie ? Marques de pneus ?
26. Les **5 familles** et les **26 prestations** : en manque-t-il ? en faut-il retirer ?
27. Y a-t-il des prestations pour lesquelles WCC **ne travaille pas** sur certaines marques ou motorisations (à indiquer honnêtement) ?

### E. Carrosserie 🟠
28. **Choix du réparateur** : confirmer que WCC peut dire que « le choix du réparateur appartient à l'assuré » et réaliser les réparations quel que soit l'assureur.
29. **Assureurs** : la liste des **31** assureurs/loueurs affichée comme « partenaires » vient de la fiche Acoat Selected. Est-elle exacte ? Quels sont les **accords ou agréments réels** (agréé, réseau, convention) ? Le site doit-il employer « partenaires », « dossiers pris en charge » ou autre chose ? **Depuis le 19 octobre, le site affiche « Agréé assurances »** (demande du client) : par quels assureurs WCC est-il agréé ? (Utile pour la liste des logos et pour la phrase des mentions légales « aucune affiliation ».)
30. **Acoat Selected** (ou autre réseau/label) : WCC en est-il membre et a-t-il le droit de l'afficher ? Si oui, fournir logo et conditions d'usage. (Aujourd'hui aucune affiliation n'est annoncée.)
31. **Véhicule de prêt** — *réglé le 19 octobre 2026* : le site annonce un véhicule de prêt **pendant la réparation**, en carrosserie et en mécanique, sans réserve (confirmé). Reste à préciser : est-il **gratuit** (le site ne le dit pas) ? Conditions (permis, caution, carburant, franchise en cas de sinistre) ? Un avis client évoque un véhicule apporté à domicile : est-ce un service proposé ?
31 bis. **Véhicule rendu nettoyé** (affiché depuis le 19 octobre, carrosserie et mécanique) : intérieur, extérieur ou les deux ?
32. **Franchise** : le site dit « selon votre contrat, une franchise peut rester à votre charge ». Confirmer qu'aucune franchise n'est offerte.
33. **Bris de glace** : confirmer la mention d'une « garantie dédiée » du contrat d'assurance, et si WCC pose lui-même les pare-brise ou passe par un partenaire.
34. **Débosselage et grêle** : méthodes (débosselage sans peinture, avec peinture selon l'état) à valider.
35. **Remise en état avant restitution ou vente** (leasing, location) : prestations réellement proposées.
36. Y a-t-il d'autres interventions à présenter (ex. lustrage, covering, jantes, esthétique) ?
37. **Marques prises en charge** : les 16 marques affichées sont-elles correctes ? Des marques à ajouter ou à exclure ?

### F. Horaires et accès 🟠
38. Horaires actuels (lun–ven 9 h–12 h / 14 h–18 h) **exacts** ? Samedi, jours fériés, fermetures annuelles à signaler ? (Le site affiche désormais en direct « Ouvert / Fermé » d'après ces horaires ; les jours fériés, il renvoie au téléphone.)
39. Peut-on se rendre à l'atelier sans rendez-vous pour une première estimation, ou faut-il appeler ? (Le site ne promet pas de rendez-vous.)
40. **Accès** : stationnement, transports, repères utiles pour trouver l'atelier ?
41. Un numéro mobile ou WhatsApp, une adresse e-mail publique à afficher ? (Aujourd'hui : un téléphone fixe.)
42. Le formulaire annonce « nous revenons vers vous » sans délai : WCC veut-il s'engager sur un **délai de réponse** (sinon rien n'est affiché) ?

### G. Photos, logos et réputation 🟠
42 bis. **Les deux images principales** (portail et en-tête des espaces) : vous les générez ; à déposer dans `src/assets/hero/` (`carrosserie.jpg`, `mecanique.jpg`, voir le README du dossier).
43. **Vraies photos** de l'atelier : extérieur, intérieur, équipe, cabine de peinture, véhicules en cours de travail (accord des clients si visibles ou plaques). Formats : JPEG, 1600 px de large ou plus. Elles remplaceront les illustrations Unsplash (liste dans `src/assets/illustration/CREDITS.md`).
44. Photos **avant/après** de réparations : à utiliser avec l'accord des clients ?
45. **Logo officiel** de WCC en haute définition (fichier vectoriel si possible).
46. **Logos officiels** des assureurs et marques, ou autorisation de les utiliser (les fichiers actuels sont provisoires).
47. **Avis Google** : confirmer l'accord pour afficher les 10 avis actuels (texte repris à l'identique, prénom + initiale). Qui les mettra à jour, et à quel rythme ? Lien de la fiche Google à afficher ?
48. **Fiche Google Business Profile** et réseaux sociaux (Facebook, Instagram) : existent-ils ? Mêmes coordonnées que le site ?

### H. Futur 🟢
49. Dépannage et location sont prévus plus tard (aucun bouton inactif aujourd'hui) : calendrier envisagé ?
50. Prise de rendez-vous en ligne souhaitée un jour ? (Le site ne fait que des demandes de devis.)

---

## Ce que je fais dès réception des réponses

- Parties A–B : renseigner `src/data/legal.json` (les pages Mentions légales et Confidentialité se complètent et deviennent indexables).
- Partie C : régler `promo` dans `src/data/site.json` (remise, date de fin, texte des 90 points) et préciser les mentions de prix.
- Parties D–E : corriger les fiches (`src/data/mecanique-fiches/`, `services-carrosserie.json`).
- Partie G : remplacer les images (même nom de fichier), logos et avis.
- Partie 1 : build avec `SITE_URL` et `PUBLIC_INDEXABLE=true`, premier déploiement en essai à blanc, test de réception réel avec et sans photos, puis passage du dépôt en privé et push unique **sur votre accord explicite**.
