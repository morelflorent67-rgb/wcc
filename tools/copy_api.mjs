// Copie dans dist/api uniquement les fichiers du point de réception destinés au serveur.
// config.php (secrets) et storage/ (données de test ou privées) ne sont JAMAIS copiés.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'api');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'storage'), { recursive: true });
for (const f of ['submit.php', 'config.example.php', '.htaccess']) cpSync(join(root, 'api', f), join(out, f));
cpSync(join(root, 'api', 'storage', '.htaccess'), join(out, 'storage', '.htaccess'));
console.log('api -> dist/api (submit.php, config.example.php, .htaccess, storage/.htaccess)');
