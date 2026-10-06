"""Contrôle des liens internes du site construit (dist/). À lancer après `npm run build`.

Vérifie que chaque lien interne (href commençant par « / ») pointe vers un fichier présent dans dist/.
Les adresses d'API (/api/…) sont ignorées : elles sont servies par PHP, pas par le site statique.
"""
import glob
import os
import re
import sys
from urllib.parse import urlsplit

DIST = 'dist'
bad = set()
total = 0

for page in glob.glob(f'{DIST}/**/*.html', recursive=True):
    html = open(page, encoding='utf-8').read()
    for href in re.findall(r'href="([^"]+)"', html):
        if href.startswith(('http', 'mailto:', 'tel:', '#', 'data:')):
            continue
        path = urlsplit(href).path
        if not path.startswith('/') or path.startswith('/api/'):
            continue
        total += 1
        base = DIST + path
        candidates = [base + 'index.html'] if path.endswith('/') else [base, base + '/index.html']
        if not any(os.path.isfile(c) for c in candidates):
            bad.add((page.replace(os.sep, '/'), href))

print(f'{total} liens internes testés')
for page, href in sorted(bad):
    print(f'CASSÉ  {href}   (dans {page})')
sys.exit(1 if bad else 0)
