"""Récupère les logos des partenaires assurance listés sur la fiche Acoat Selected de WCC.

Source : https://www.acoat-selected.fr/?p=19953&post_type=ait-item (section « Nos agréments »),
liste et logos confirmés par le client (docs/conception/WCC-plan-site-v1.md, §1).
Les fichiers sont recadrés sur leur contenu et enregistrés dans src/assets/partners/.
Écrit src/data/partners.json (source unique : menu, accueils, page Assurances).

Ces logos sont PROVISOIRES : remplacez-les par les fichiers officiels (SVG/PNG) des assureurs
dès que vous les avez, en gardant le même nom de fichier.

Usage : python tools/fetch_partners.py
"""
import io
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "partners"
DATA = ROOT / "src" / "data" / "partners.json"
BASE = "https://www.acoat-selected.fr/wp-content/uploads/2017/03/Agrements-Fr_60x{n}.jpg"

# (numéro de fichier, nom affiché, identifiant, mis en avant sur le portail)
PARTNERS = [
    (4557, "Arval", "arval", True),
    (4512, "Pacifica", "pacifica", True),
    (4518, "AXA", "axa", True),
    (4529, "Allianz", "allianz", True),
    (4536, "MACSF", "macsf", True),
    (4537, "AREAS Assurances", "areas", True),
    (4513, "Generali", "generali", True),
    (4519, "Direct Assurance", "direct-assurance", True),
    (4543, "Caisse d’Epargne", "caisse-d-epargne", True),
    (4558, "ALD Automotive", "ald-automotive", False),
    (4546, "Gras Savoye", "gras-savoye", False),
    (4530, "Calypso", "calypso", False),
    (4514, "Abeille Assurances", "abeille", False),
    (4559, "Parcours", "parcours", False),
    (4538, "Mutuelle de Poitiers Assurances", "mutuelle-de-poitiers", True),
    (4544, "Elexia", "elexia", False),
    (4531, "AllSecur", "allsecur", False),
    (4548, "Marsh", "marsh", False),
    (4515, "Eurofil", "eurofil", False),
    (4539, "Swiss Life", "swisslife", True),
    (4535, "Suravenir", "suravenir", False),
    (4560, "LeasePlan", "leaseplan", False),
    (4540, "MFA Assurances", "mfa", False),
    (4549, "Verspieren", "verspieren", False),
    (4516, "Sogessur", "sogessur", False),
    (4541, "Monceau Assurances", "monceau", False),
    (4517, "Thélem assurances", "thelem", False),
    (4550, "Verlingue", "verlingue", False),
    (4551, "Assu 2000", "assu-2000", False),
    (4552, "Maxance", "maxance", False),
    (4565, "Natixis", "natixis", True),
]


def crop_to_content(im: Image.Image, pad: int = 6) -> Image.Image:
    """Retire le liseré gris des fichiers sources, puis recadre sur le contenu."""
    margin = 8 if im.width > 150 else 3
    inner = im.crop((margin, margin, im.width - margin, im.height - margin))
    a = np.asarray(inner.convert("RGB")).astype(np.int16)
    mask = a.min(axis=2) < 228
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return inner
    p = pad if im.width > 150 else 2
    box = (max(xs.min() - p, 0), max(ys.min() - p, 0), min(xs.max() + p + 1, inner.width), min(ys.max() + p + 1, inner.height))
    return inner.crop(box)


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for n, name, slug, featured in PARTNERS:
        dest = OUT / f"{slug}.webp"
        if not dest.exists():
            req = urllib.request.Request(BASE.format(n=n), headers={"User-Agent": "WCC-site-build/1.0"})
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
            im = crop_to_content(Image.open(io.BytesIO(raw)).convert("RGB"))
            im.save(dest, "WEBP", quality=92, method=6)
            print(f"ok  {slug:22s} {im.width}x{im.height}")
        else:
            im = Image.open(dest)
            print(f"déjà présent : {slug}")
        rows.append({"name": name, "slug": slug, "file": f"{slug}.webp", "width": im.width, "height": im.height, "featured": featured})
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(rows)} partenaires -> {DATA.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
