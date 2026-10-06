# World Car Carrosserie — Plan du site, version 1

Date : 6 octobre 2026. Statut : architecture et direction visuelle validées ; préparation des maquettes autorisée.

Ce document rassemble les décisions du client et la conception validée. La prochaine étape est la maquette du portail WCC et des deux accueils métiers. Le site final sera hébergé par l'utilisateur sur un hébergement externe qu'il choisira et gérera. Aucune publication ni aucun achat ne sont engagés. Les fichiers du dossier sources restent des références en lecture seule.

## 1. Brief confirmé

| Élément | Décision |
| --- | --- |
| Entreprise | World Car Carrosserie — WCC |
| Adresse | 5a avenue de l'Énergie, 67800 Bischheim |
| Téléphone | 03 69 48 44 85 |
| Email des deux formulaires | worldcarcarrosserie@gmail.com |
| Horaires | Du lundi au vendredi, 9 h–12 h et 14 h–18 h |
| Langue | Français |
| Existant | Une fiche Google ; aucun domaine ni réseau social déclaré |
| Activités au lancement | Carrosserie et mécanique, de même importance, avec des parcours autonomes |
| Évolutions | Dépannage et location, hors périmètre de la première version |
| Carrosserie | Tous types d'interventions ; accompagnement assurance ; véhicule de prêt possible ; prise en charge réactive |
| Partenaires | Liste et logos de la référence Acoat Selected confirmés par le client |
| Mécanique | Prestations et prix d'appel AD adoptés par le client ; devis adapté au véhicule |
| Contact | Demande de devis ou d'information ; aucune réservation automatique de rendez-vous |
| Maintenance | Assurée par le créateur du site, avec des modifications simples et rapides |
| Hébergement | Hébergement externe choisi et géré par l'utilisateur ; prestataire et type à préciser |

Les coordonnées ont été confirmées par le client. La [fiche Acoat de WCC](https://www.acoat-selected.fr/?p=19953&post_type=ait-item) fournit le point de départ documentaire. Ses chiffres d'effectif, de surface et de capacité ne sont pas retenus faute de confirmation.

## 2. Organisation : une marque, deux espaces autonomes

Un seul domaine, un portail de marque et deux espaces complets. Un automobiliste arrivant depuis Google sur une prestation entre directement dans le bon espace, sans traverser le portail.

| Espace | Pages prévues | Rôle |
| --- | --- | --- |
| Portail WCC | `/` | Choisir Carrosserie ou Mécanique ; comprendre l'entreprise ; voir les avis et l'accès |
| Carrosserie | `/carrosserie/` | Accueil spécialisé et accès aux réparations |
| Prestations carrosserie | `/carrosserie/prestations/` et pages de détail | Expliquer les interventions et préparer la demande |
| Assurances | `/carrosserie/assurances/` | Présenter les partenaires et l'accompagnement du dossier |
| Formulaire carrosserie | `/carrosserie/contact/` | Sélection des zones, intervention, photos et coordonnées |
| Mécanique | `/mecanique/` | Accueil multimarque, prestations et prix d'appel |
| Prestations mécanique | `/mecanique/prestations/` et pages de détail | Catalogue organisé, prix et explications propres à chaque service |
| Formulaire mécanique | `/mecanique/contact/` | Prestation présélectionnée, véhicule et description du besoin |
| Accès commun | `/acces-horaires/` | Adresse exacte, téléphone, horaires et itinéraire |
| Informations du site | `/mentions-legales/`, `/confidentialite/` | Informations de l'entreprise et traitement des demandes |

### Navigation

Dans Carrosserie : Accueil carrosserie, Prestations, Assurances, Accès, Demander un devis.

Dans Mécanique : Accueil mécanique, Prestations avec grand menu déroulant, Multimarque (section de l'accueil), Accès, Demander un devis.

Chaque espace dispose de ses images, de ses arguments, de son menu et de son formulaire. Le logo accompagné du nom de l'activité ramène à l'accueil de l'espace. Un lien « Tous nos services » ramène au portail ; un commutateur discret permet de passer dans l'autre activité. Les données de contact et les composants communs restent centralisés.

Les futurs espaces Dépannage et Location pourront s'ajouter avec leurs propres adresses et menus. Aucun bouton inactif n'est prévu au lancement.

## 3. Direction visuelle validée

Un univers automobile contemporain, clair et rassurant, fondé sur le logo existant.

- Fonds blanc cassé et gris très clair, texte anthracite, contrastes lisibles.
- Carrosserie : accents orange et rouge issus du logo.
- Mécanique : accents bleu et violet issus du logo.
- Portail : dégradé WCC complet, utilisé avec retenue sur les éléments de marque.
- Titres de caractère, généreux mais lisibles ; texte courant sobre.
- Photographies amples de véhicules, détails de réparation et atelier. Priorité aux images réelles de WCC dès qu'elles sont disponibles.
- Les photos d'illustration devront rester distinctes des réalisations et locaux du garage.
- Cartes et boutons soignés, espaces respirants ; les grandes surfaces sombres restent des accents visuels.

### Interactions

Le portail montre deux panneaux de même importance sur ordinateur et deux grandes cartes sur mobile. Les boutons d'entrée restent toujours visibles. Le survol ou le toucher anime les panneaux sans cacher les informations essentielles.

Au défilement : apparitions progressives, transitions de photos et quelques effets de texte courts. Le défilement reste naturel et le contenu demeure disponible sans animation. Les préférences de réduction des mouvements sont respectées.

Le menu mécanique est organisé par familles, utilisable au clavier et transformé en accordéons sur mobile. Les avis défilent avec commandes de pause et de navigation. Un comparateur avant/après pourra être ajouté lorsque des photographies authentiques seront fournies.

## 4. Composition des pages principales

### Portail WCC

1. Logo, localisation à Bischheim et téléphone.
2. Deux accès Carrosserie et Mécanique à égalité, avec photographies et courtes promesses propres à chaque métier.
3. Côté carrosserie : présentation de l'accompagnement assurance et premiers logos, avec accès à la liste complète.
4. Côté mécanique : entretien multimarque, logos des marques courantes et accès aux prestations.
5. Sélection d'environ dix avis Google authentiques.
6. Adresse, horaires, accès et rappel des deux parcours.

Les marques automobiles seront présentées comme des marques prises en charge, sans suggérer une concession ou un agrément constructeur. Proposition de sélection visuelle : Renault, Peugeot, Citroën, Dacia, Volkswagen, Audi, BMW, Mercedes-Benz, Toyota, Ford, Opel et Nissan.

### Accueil carrosserie

Entrée centrée sur le problème du visiteur : véhicule accidenté, rayure, peinture ou autre dommage. Le bouton principal mène au formulaire de carrosserie. Viennent ensuite les familles de prestations, les partenaires d'assurance, le déroulement de la prise en charge, les avantages confirmés, les réponses aux questions pratiques et l'accès à l'atelier.

Six pages de prestations sont proposées : réparation après accident ; peinture et rayures ; débosselage ; réparation après grêle ; vitrage et pare-brise ; remise en état avant restitution ou vente. Chaque page doit apporter des informations propres à l'intervention.

### Accueil mécanique

Entrée centrée sur l'entretien et la réparation multimarque. Un sélecteur mène vers la bonne prestation. Les principales cartes affichent leur prix d'appel ; les autres services restent disponibles dans le menu et le catalogue complet. Le formulaire est prérempli depuis la prestation choisie.

Le catalogue s'organise en familles : entretien et contrôles ; moteur et transmission ; freinage et tenue de route ; diagnostic, démarrage et électricité ; climatisation et confort. Les 24 prestations du menu AD, ainsi que les pneus et la rénovation d'optiques, forment la base proposée. Le relevé chiffré figure dans l'annexe distincte.

### Contenu d'une page de prestation

Chaque page répond à une intention précise : besoin traité, signes qui peuvent motiver une consultation, déroulement de l'intervention, éléments qui font varier le prix, informations utiles sur le véhicule, questions fréquentes et demande de devis préremplie. Les textes sont rédigés pour WCC. Les prix et intitulés de référence n'impliquent aucune affiliation à AD.

## 5. Formulaires

### Carrosserie

Parcours en trois étapes courtes, avec possibilité de revenir en arrière sans perdre la saisie :

1. Type d'intervention et sélection d'une ou plusieurs des neuf zones du véhicule : avant gauche, avant centre, avant droite, côté gauche, toit, côté droit, arrière gauche, arrière centre et arrière droite. Une liste textuelle offre la même sélection. Choix « Je ne sais pas » disponible.
2. Informations du véhicule et photos : marque, modèle, immatriculation facultative, ajout de plusieurs photos et commentaire. Une photo ne sera pas indispensable pour contacter le garage. Questions utiles facultatives : véhicule roulant, assurance concernée, sinistre déclaré, besoin de véhicule de prêt.
3. Coordonnées et récapitulatif : nom, téléphone, email et demande de contact. L'utilisateur voit clairement les données qu'il envoie et peut consulter l'information sur leur utilisation.

Les limites de nombre, poids et format des fichiers seront fixées lors de la réalisation, adaptées aux photos prises sur téléphone et aux capacités d'hébergement.

### Mécanique

Parcours en trois étapes : prestation(s) ou « Décrire mon problème » ; informations du véhicule (marque, modèle, année, motorisation, kilométrage, immatriculation facultative) et symptômes ; coordonnées et récapitulatif.

Le prix d'appel accompagne la prestation choisie sans être présenté comme le devis définitif du véhicule. La confirmation indique qu'une demande a été envoyée, sans annoncer un rendez-vous réservé ni un délai de réponse non confirmé.

### Réception

Les deux formulaires arrivent à `worldcarcarrosserie@gmail.com`. Les objets identifient l'activité et le véhicule, par exemple « WCC — Carrosserie — Demande client » et « WCC — Mécanique — Demande client ».

Proposition : accusé de réception automatique, envoi côté serveur, protection contre les soumissions abusives et photos conservées dans un espace privé. Le traitement des formulaires, l'envoi des emails et le stockage privé des photos seront adaptés aux capacités de l'hébergement externe de l'utilisateur. La technologie serveur et le mode d'envoi restent ouverts jusqu'à confirmation de ces capacités. La configuration d'envoi et la durée de conservation devront être définies avant la mise en ligne. Le test devra porter sur la réception réelle dans la boîte du garage, avec photos et sans photos.

## 6. Arguments commerciaux et avis

Les messages peuvent mettre en avant : accompagnement dans les démarches d'assurance ; partenaires confirmés ; véhicule de prêt possible selon disponibilité ; prise en charge réactive ; carrosserie et mécanique multimarques ; devis adapté au véhicule.

Le contenu expliquera concrètement le parcours : transmettre le besoin, échanger avec l'atelier, préciser l'intervention puis organiser la prise en charge. Aucun délai chiffré, prêt gratuit systématique, franchise offerte, absence d'avance de frais ou garantie particulière ne sera annoncé sans confirmation.

Les avis seront sélectionnés pour leur précision et leur diversité : qualité de réparation, accueil, suivi, réactivité, mécanique ou carrosserie selon ce que les témoignages réels permettent d'établir. Leurs textes, dates et auteurs seront vérifiés sur la fiche d'origine. Aucun avis n'est sélectionné ou vérifié à ce stade : le lien Google Maps exact reste à fournir.

Une intégration manuelle convient à la première version et n'exige pas de widget payant. Elle sera présentée comme une sélection. Une éventuelle note globale devra correspondre à l'ensemble de la fiche et comporter une date de vérification.

## 7. Référencement local

Priorité proposée : Bischheim, Hœnheim, Schiltigheim et Strasbourg, notamment le secteur nord. Souffelweyersheim, Reichstett, Mundolsheim et Niederhausbergen peuvent compléter la zone selon la provenance des demandes. Il s'agit d'une proposition commerciale, sans promesse de couverture uniforme de 20 km.

Au lancement, les accueils métiers et les pages de prestations portent le travail de référencement. Une page d'accès explique où se trouve réellement le garage et comment le rejoindre. Aucune multiplication automatique de pages par commune n'est prévue. Une future page locale devra apporter un contenu distinct : accès, besoins locaux, réalisations ou services documentés.

Ce choix suit la distinction de Google entre contenu utile et [pages satellites géographiques](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse). La [fiche Google et ses informations exactes](https://support.google.com/business/answer/7091?hl=fr) devront être cohérentes avec le site.

Exigences de réalisation : pages publiques indexables ; titres et descriptions propres ; contenu principal disponible dès le chargement ; liens directs vers les prestations ; plan du site ; adresses canoniques ; données structurées correspondant aux faits ; images optimisées ; navigation mobile et formulaires rapides. Le suivi des recherches, appels et demandes permettra de mesurer les résultats après lancement.

## 8. Maintenance et hébergement

Tous les tarifs, intitulés, textes, logos et coordonnées doivent être enregistrés une seule fois et réutilisés dans le menu, les cartes, les pages et les formulaires.

Proposition pour une gestion simple : des contenus centralisés, faciles à modifier par le créateur du site. Un petit espace privé centré sur les fiches prestations, prix d'appel, descriptions, images, avis et informations pratiques reste une option à évaluer selon l'hébergement choisi. Il n'est pas destiné aux visiteurs ni au client final. Une modification de prix met à jour tous ses emplacements. Le déploiement et le retour à une version précédente doivent rester maîtrisés.

L'utilisateur a choisi d'héberger lui-même le site. L'hébergement Sites et sa publication ne font donc pas partie de la livraison. Le prestataire, le type d'hébergement et ses capacités restent à préciser avant de fixer les choix techniques côté serveur. La maquette visuelle peut avancer indépendamment de cette réponse.

La livraison devra comprendre les sources complètes et portables, les ressources nécessaires, une méthode simple de modification des contenus et une documentation de déploiement adaptée à l'hébergeur retenu. Cette documentation couvrira la construction du site si nécessaire, les paramètres de configuration sans secrets, l'envoi des emails, le traitement des fichiers joints et la sauvegarde/restauration. Le site ne devra pas dépendre d'un service d'hébergement propre à Sites pour fonctionner.

Les formulaires devront être raccordés à une solution compatible avec l'hébergement externe : exécution serveur, service d'envoi des emails et espace privé pour les photos. Aucun langage serveur, service payant ou fournisseur n'est imposé à ce stade. Aucun hébergeur, domaine, abonnement ou service externe n'est acheté, et aucune mise en ligne n'est effectuée.

## 9. Validation et étapes suivantes

1. Architecture et direction visuelle validées par l'utilisateur ; poursuivre avec les maquettes.
2. Première planche des trois accueils produite dans `WCC-maquette-accueils-v1.png`, à examiner avant de développer l'ensemble. Recueillir en parallèle le prestataire et le type d'hébergement envisagés.
3. Confirmer la solution technique compatible avec cet hébergement, puis construire les pages et les deux formulaires, avec le catalogue centralisé et une méthode de modification simple. Le petit espace de gestion privé reste une option proposée.
4. Intégrer les partenaires, marques, avis vérifiés et images disponibles ; préparer les contenus originaux.
5. Vérifier mobile, navigation clavier, animations réduites, affichage des prix, réception des demandes et protection de l'espace privé.
6. Livrer les sources portables et la documentation ; préparer la configuration du domaine, des emails et du stockage privé sur l'hébergement choisi, puis contrôler l'indexabilité. La mise en ligne fera l'objet d'une étape distincte une fois la version validée et la demande de déploiement confirmée.

### Éléments à obtenir progressivement

- Lien exact de la fiche Google Maps : nécessaire à la sélection des avis, sans bloquer le plan.
- Prestataire et type d'hébergement prévus par l'utilisateur : nécessaires pour choisir la technologie serveur et raccorder les formulaires, sans bloquer la maquette visuelle.
- Photos authentiques de l'atelier, de l'équipe ou d'avant/après, si disponibles ; logo transparent ou vectoriel si disponible. Les visuels pourront être préparés pendant la conception.
- Avant publication : choix et disponibilité du domaine, identité juridique et responsable de publication, service d'envoi des emails, conditions WCC des prix d'appel, durée de conservation des demandes et photos.

La prochaine étape est le retour sur la première maquette des trois accueils. Le choix technique côté serveur reste à arrêter après confirmation de l'hébergement externe. La validation du plan autorise cette progression, sans déclencher de publication ni d'achat.
