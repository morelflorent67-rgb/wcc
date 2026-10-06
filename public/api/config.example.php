<?php
/**
 * Configuration du point de réception des formulaires.
 * Copier ce fichier en « config.php » sur le serveur et renseigner les valeurs.
 * config.php ne doit JAMAIS être versionné ni écrasé par un déploiement (voir .gitignore).
 */
return [
    // 'dev' : écrit les messages dans storage/outbox/*.eml (aucun envoi réel). 'prod' : envoi par mail().
    'env' => 'dev',

    // Destinataire des demandes (adresse du garage)
    'mail_to' => 'worldcarcarrosserie@gmail.com',

    // Expéditeur : doit appartenir au domaine du site pour être bien délivré (SPF/DKIM de l'hébergeur)
    'mail_from' => 'formulaire@exemple.fr',
    'mail_from_name' => 'World Car Carrosserie',

    // Accusé de réception automatique au client
    'auto_reply' => true,
    'reply_signature' => '',

    // Espace privé (idéalement HORS du dossier public du site, ex. /home/compte/wcc-prive).
    // Par défaut : dossier storage/ à côté de ce fichier, protégé par .htaccess.
    // 'storage_dir' => '/chemin/absolu/vers/wcc-prive',

    // Protection contre les envois abusifs
    'secret' => 'changer-cette-valeur',   // sert à anonymiser les adresses IP (hachage)
    'min_seconds' => 4,                    // délai minimal entre l'ouverture du formulaire et l'envoi
    'max_per_hour' => 6,                   // demandes par adresse IP et par heure

    // Photos (carrosserie)
    'max_files' => 6,
    'max_file_mb' => 8,
    'attach_budget_mb' => 18,              // poids total joint au message (le reste reste dans l'espace privé)
];
