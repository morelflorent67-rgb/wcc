<?php
declare(strict_types=1);

/**
 * Réception des demandes de devis WCC (mécanique et carrosserie).
 *
 * - Valide et nettoie les champs, filtre les envois abusifs (champ piège, délai, limite par adresse IP).
 * - Envoie la demande à l'adresse du garage et un accusé de réception au client.
 * - Carrosserie : enregistre les photos dans un espace privé et les joint au message (dans la limite fixée).
 * - Mode « dev » : écrit les messages dans storage/outbox/*.eml au lieu de les envoyer.
 *
 * Configuration : copier config.example.php en config.php (jamais versionné) et l'adapter.
 */

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, int $status, array $payload, bool $json, string $okUrl, string $errUrl): never
{
    if ($json) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok] + $payload, JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: ' . ($ok ? $okUrl : $errUrl), true, 303);
    }
    exit;
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    error_log('WCC submit.php : config.php manquant');
    respond(false, 500, ['error' => 'server'], $wantsJson, '/', '/?erreur=1');
}
/** @var array<string, mixed> $config */
$config = require $configFile;

$type = ($_POST['type'] ?? '') === 'carrosserie' ? 'carrosserie' : 'mecanique';
$okUrl = "/{$type}/contact/merci/";
$errUrl = "/{$type}/contact/?erreur=1";

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 405, ['error' => 'method'], $wantsJson, $okUrl, $errUrl);
}
if (empty($_POST) && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    // Corps supérieur à post_max_size : PHP vide $_POST
    respond(false, 413, ['error' => 'too_large'], $wantsJson, $okUrl, $errUrl);
}

// ───── Utilitaires ─────
function clean(mixed $v, int $max = 200): string
{
    if (!is_string($v)) {
        return '';
    }
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    $v = trim($v);
    return mb_substr($v, 0, $max);
}
function oneLine(string $v): string
{
    return trim(preg_replace('/[\r\n\t]+/', ' ', $v) ?? '');
}
/** @return list<string> */
function cleanList(mixed $v, int $maxItems, int $maxLen, string $pattern): array
{
    $out = [];
    foreach ((array) $v as $item) {
        $s = clean($item, $maxLen);
        if ($s !== '' && preg_match($pattern, $s) === 1) {
            $out[] = $s;
        }
        if (count($out) >= $maxItems) {
            break;
        }
    }
    return array_values(array_unique($out));
}
function mimeHeader(string $s): string
{
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

// ───── Champ piège et délai minimal ─────
if (clean($_POST['website'] ?? '') !== '') {
    // Robot probable : on répond « succès » sans rien envoyer
    respond(true, 200, [], $wantsJson, $okUrl, $errUrl);
}
$ts = (int) ($_POST['ts'] ?? 0);
if ($ts > 0) {
    $elapsed = (int) (time() - intdiv($ts, 1000));
    if ($elapsed < (int) ($config['min_seconds'] ?? 4) || $elapsed > 7200) {
        respond(false, 429, ['error' => 'timing'], $wantsJson, $okUrl, $errUrl);
    }
}

// ───── Espace de stockage et limite par adresse IP ─────
$storage = rtrim((string) ($config['storage_dir'] ?? (__DIR__ . '/storage')), '/\\');
foreach (['ratelimit', 'outbox', 'uploads'] as $d) {
    if (!is_dir("$storage/$d")) {
        @mkdir("$storage/$d", 0750, true);
    }
}
$ipKey = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . ($config['secret'] ?? 'wcc'));
$rlFile = "$storage/ratelimit/$ipKey.json";
$now = time();
// Nettoyage : les empreintes de plus d'une heure n'ont plus d'utilité pour la limite par IP
foreach ((array) glob("$storage/ratelimit/*.json") as $old) {
    if (is_file($old) && filemtime($old) < $now - 3600) {
        @unlink($old);
    }
}
$hits = is_file($rlFile) ? (json_decode((string) file_get_contents($rlFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, static fn ($t) => is_int($t) && $t > $now - 3600));
if (count($hits) >= (int) ($config['max_per_hour'] ?? 6)) {
    respond(false, 429, ['error' => 'rate'], $wantsJson, $okUrl, $errUrl);
}

// ───── Champs communs ─────
$errors = [];
$nom = oneLine(clean($_POST['nom'] ?? '', 100));
$tel = oneLine(clean($_POST['telephone'] ?? '', 25));
$email = oneLine(clean($_POST['email'] ?? '', 150));
$consent = ($_POST['consent'] ?? '') === '1';
$marque = oneLine(clean($_POST['marque'] ?? '', 60));
$modele = oneLine(clean($_POST['modele'] ?? '', 80));
$immat = strtoupper(oneLine(clean($_POST['immatriculation'] ?? '', 15)));
$contactPref = in_array($_POST['contact_pref'] ?? '', ['telephone', 'email'], true) ? $_POST['contact_pref'] : '';

if ($nom === '') {
    $errors['nom'] = 'required';
}
if (preg_match('/^[0-9 +().\-]{8,25}$/', $tel) !== 1) {
    $errors['telephone'] = 'invalid';
}
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'invalid';
}
if (!$consent) {
    $errors['consent'] = 'required';
}
if ($marque === '') {
    $errors['marque'] = 'required';
}
if ($modele === '') {
    $errors['modele'] = 'required';
}
if ($immat !== '' && preg_match('/^[A-Z0-9 \-]{4,15}$/', $immat) !== 1) {
    $errors['immatriculation'] = 'invalid';
}

$lines = [];   // corps du message : [libellé, valeur]
$attachments = [];

if ($type === 'mecanique') {
    $prestations = cleanList($_POST['prestations'] ?? [], 12, 60, '/^[a-z0-9\-]{2,60}$/');
    $probleme = clean($_POST['probleme'] ?? '', 2000);
    $annee = clean($_POST['annee'] ?? '', 4);
    $motorisation = oneLine(clean($_POST['motorisation'] ?? '', 40));
    $km = preg_replace('/\D/', '', clean($_POST['kilometrage'] ?? '', 9)) ?? '';
    $symptomes = clean($_POST['symptomes'] ?? '', 2000);
    $labels = (array) ($_POST['prestations_labels'] ?? []);

    if (!$prestations && $probleme === '') {
        $errors['prestations'] = 'required';
    }
    if ($annee !== '' && (preg_match('/^\d{4}$/', $annee) !== 1 || (int) $annee < 1950 || (int) $annee > (int) date('Y') + 1)) {
        $errors['annee'] = 'invalid';
    }

    $names = [];
    foreach ($prestations as $slug) {
        $names[] = $slug === 'autre' ? 'Décrire mon problème' : oneLine(clean($labels[$slug] ?? $slug, 80));
    }
    $lines = [
        ['Prestation(s) demandée(s)', implode(', ', $names)],
        ['Description du problème', $probleme],
        ['Véhicule', trim("$marque $modele")],
        ['Année', $annee],
        ['Motorisation', $motorisation],
        ['Kilométrage', $km !== '' ? $km . ' km' : ''],
        ['Immatriculation', $immat],
        ['Symptômes / précisions', $symptomes],
    ];
    $activite = 'Mécanique';
} else {
    $zonesAllowed = ['avant-gauche', 'avant-centre', 'avant-droite', 'cote-gauche', 'toit', 'cote-droit', 'arriere-gauche', 'arriere-centre', 'arriere-droite', 'inconnu'];
    $zoneNames = [
        'avant-gauche' => 'Avant gauche', 'avant-centre' => 'Avant centre', 'avant-droite' => 'Avant droite',
        'cote-gauche' => 'Côté gauche', 'toit' => 'Toit', 'cote-droit' => 'Côté droit',
        'arriere-gauche' => 'Arrière gauche', 'arriere-centre' => 'Arrière centre', 'arriere-droite' => 'Arrière droite',
        'inconnu' => 'Je ne sais pas',
    ];
    $interventionsAllowed = [
        'accident' => 'Réparation après accident', 'peinture' => 'Peinture et rayures', 'debosselage' => 'Débosselage',
        'grele' => 'Réparation après grêle', 'vitrage' => 'Vitrage et pare-brise', 'remise-en-etat' => 'Remise en état avant restitution ou vente',
        'autre' => 'Autre / je ne sais pas',
    ];
    $intervention = (string) ($_POST['intervention'] ?? '');
    $zones = array_values(array_intersect($zonesAllowed, cleanList($_POST['zones'] ?? [], 10, 30, '/^[a-z\-]{3,30}$/')));
    $commentaire = clean($_POST['commentaire'] ?? '', 2000);
    $tri = static fn (string $k): string => match ($_POST[$k] ?? '') { 'oui' => 'Oui', 'non' => 'Non', 'nsp' => 'Ne sait pas', default => '' };

    if (!isset($interventionsAllowed[$intervention])) {
        $errors['intervention'] = 'required';
    }
    if (!$zones) {
        $errors['zones'] = 'required';
    }
    $lines = [
        ['Type d’intervention', $interventionsAllowed[$intervention] ?? ''],
        ['Zone(s) concernée(s)', implode(', ', array_map(static fn ($z) => $zoneNames[$z], $zones))],
        ['Véhicule', trim("$marque $modele")],
        ['Immatriculation', $immat],
        ['Véhicule roulant', $tri('roulant')],
        ['Assurance concernée', $tri('assurance')],
        ['Sinistre déclaré', $tri('sinistre')],
        ['Véhicule de prêt souhaité', $tri('pret')],
        ['Commentaire', $commentaire],
    ];
    $activite = 'Carrosserie';

    // ───── Photos (facultatives) ─────
    $maxFiles = (int) ($config['max_files'] ?? 6);
    $maxBytes = (int) ($config['max_file_mb'] ?? 8) * 1024 * 1024;
    $files = $_FILES['photos'] ?? null;
    $saved = [];
    if (is_array($files) && is_array($files['name'] ?? null)) {
        $count = min(count($files['name']), $maxFiles);
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        $dir = null;
        for ($i = 0; $i < $count; $i++) {
            if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                continue;
            }
            if (($files['error'][$i] ?? 1) !== UPLOAD_ERR_OK || ($files['size'][$i] ?? 0) > $maxBytes || !is_uploaded_file($files['tmp_name'][$i])) {
                $errors['photos'] = 'invalid';
                continue;
            }
            $mime = (string) $finfo->file($files['tmp_name'][$i]);
            if (!isset($allowed[$mime]) || @getimagesize($files['tmp_name'][$i]) === false) {
                $errors['photos'] = 'invalid';
                continue;
            }
            $saved[] = ['tmp' => $files['tmp_name'][$i], 'ext' => $allowed[$mime], 'mime' => $mime];
        }
    }
}

if ($errors) {
    respond(false, 422, ['error' => 'validation', 'fields' => $errors], $wantsJson, $okUrl, $errUrl);
}

// ───── Composition du message ─────
$ref = date('Ymd-His') . '-' . bin2hex(random_bytes(2));

if ($type === 'carrosserie' && !empty($saved)) {
    $dir = "$storage/uploads/$ref";
    @mkdir($dir, 0750, true);
    $budget = (int) ($config['attach_budget_mb'] ?? 18) * 1024 * 1024;
    foreach ($saved as $n => $f) {
        $dest = sprintf('%s/photo-%02d.%s', $dir, $n + 1, $f['ext']);
        if (@move_uploaded_file($f['tmp'], $dest)) {
            $size = (int) filesize($dest);
            if ($size <= $budget) {
                $attachments[] = ['path' => $dest, 'name' => basename($dest), 'mime' => $f['mime']];
                $budget -= $size;
            }
        }
    }
}

$subjectVehicle = oneLine(trim("$marque $modele"));
$subject = "WCC — {$activite} — Demande client — {$subjectVehicle}";
$body = "Nouvelle demande de devis ({$activite})\nRéférence : {$ref}\n\n";
foreach ($lines as [$label, $value]) {
    if ($value !== '') {
        $body .= $label . " :\n" . $value . "\n\n";
    }
}
$body .= "— Coordonnées —\nNom : {$nom}\nTéléphone : {$tel}\nEmail : {$email}\n";
if ($contactPref !== '') {
    $body .= 'Contact souhaité par : ' . ($contactPref === 'telephone' ? 'téléphone' : 'email') . "\n";
}
if ($type === 'carrosserie') {
    $body .= "\nPhotos : " . (count($attachments) ? count($attachments) . ' jointe(s)' : 'aucune jointe') . (!empty($saved) ? " ({$ref} dans l'espace privé)" : '') . "\n";
}
$body .= "\nCette demande a été envoyée depuis le site. Elle ne constitue pas une réservation.\n";

// ───── Envoi ─────
/**
 * @param list<array{path:string,name:string,mime:string}> $files
 */
function sendMail(array $config, string $storage, string $to, string $subject, string $text, ?string $replyTo, array $files, string $ref, string $tag): bool
{
    $from = (string) ($config['mail_from'] ?? 'noreply@localhost');
    $fromName = mimeHeader((string) ($config['mail_from_name'] ?? 'World Car Carrosserie'));
    $boundary = 'wcc_' . bin2hex(random_bytes(8));
    $headers = [
        'MIME-Version: 1.0',
        "From: {$fromName} <{$from}>",
        'Date: ' . date('r'),
        'Message-ID: <' . $ref . '.' . $tag . '@wcc>',
    ];
    if ($replyTo !== null) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    if ($files) {
        $headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";
        $body = "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($text)) . "\r\n";
        foreach ($files as $f) {
            $body .= "--{$boundary}\r\nContent-Type: {$f['mime']}; name=\"{$f['name']}\"\r\nContent-Transfer-Encoding: base64\r\n"
                . "Content-Disposition: attachment; filename=\"{$f['name']}\"\r\n\r\n"
                . chunk_split(base64_encode((string) file_get_contents($f['path']))) . "\r\n";
        }
        $body .= "--{$boundary}--\r\n";
    } else {
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
        $body = chunk_split(base64_encode($text));
    }

    if (($config['env'] ?? 'prod') === 'dev') {
        $eml = implode("\r\n", $headers) . "\r\nTo: {$to}\r\nSubject: " . mimeHeader($subject) . "\r\n\r\n" . $body;
        return file_put_contents("{$storage}/outbox/{$ref}-{$tag}.eml", $eml) !== false;
    }
    return mail($to, mimeHeader($subject), $body, implode("\r\n", $headers), '-f' . $from);
}

$sent = sendMail($config, $storage, (string) $config['mail_to'], $subject, $body, $email, $attachments, $ref, 'garage');
if (!$sent) {
    error_log("WCC submit.php : échec d'envoi {$ref}");
    respond(false, 502, ['error' => 'mail'], $wantsJson, $okUrl, $errUrl);
}

// Accusé de réception au client (sans promesse de délai ni de rendez-vous)
if (($config['auto_reply'] ?? true) === true) {
    $reply = "Bonjour {$nom},\n\nNous avons bien reçu votre demande concernant votre véhicule ({$subjectVehicle}). "
        . "Elle a été transmise à l'atelier, qui l'examinera et reviendra vers vous.\n\n"
        . "Cet accusé de réception ne constitue pas une réservation.\n\nWorld Car Carrosserie\n"
        . ($config['reply_signature'] ?? '');
    sendMail($config, $storage, $email, 'WCC — Nous avons bien reçu votre demande', $reply, (string) $config['mail_to'], [], $ref, 'client');
}

$hits[] = $now;
file_put_contents($rlFile, json_encode($hits), LOCK_EX);

respond(true, 200, ['ref' => $ref], $wantsJson, $okUrl, $errUrl);
