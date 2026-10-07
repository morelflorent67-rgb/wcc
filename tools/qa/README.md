# Contrôles qualité (Chrome headless, sans dépendance)

Prérequis : `npm run dev` lancé (http://127.0.0.1:4321) et Chrome installé (chemin dans les scripts). Sous Git Bash, préfixer par `MSYS_NO_PATHCONV=1`.

- `audit.mjs <largeur> <routes.txt> [sortie.json]` : parcourt une liste de routes (une par ligne) avec `audit-page.js` : débordement horizontal, `lang`, un seul `h1`, ordre des titres, `id` en double, noms accessibles (liens, boutons, champs), images sans `alt`, cibles tactiles < 24 px, contraste du texte sur fond uni (ignore les textes sur photo ou dégradé). Mouvement réduit émulé. Liste des routes : `find dist -name index.html | sed 's|^dist||;s|index.html$||'`.
- `kbd.mjs <largeur> <route> [n]` : tabulation au clavier (arrêts, indicateur de focus, pièges). Les cartes photo n'ont pas d'anneau sur le lien : il est dessiné sur la carte.
- `mega.mjs <largeur> <route>` avec `BTN=<sélecteur>` : ouverture du grand menu à Entrée, Échap, retour du focus.
