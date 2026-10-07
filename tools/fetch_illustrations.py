"""Télécharge les photos d'illustration listées dans design/illustrations.json.

Écrit les fichiers dans src/assets/illustration/ et génère CREDITS.md.
Usage : python tools/fetch_illustrations.py
Ne retélécharge pas un fichier déjà présent (supprimez-le pour le renouveler).
"""
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "design" / "illustrations.json"
OUT = ROOT / "src" / "assets" / "illustration"
WIDTH = 1920


def main() -> int:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for p in data["photos"]:
        dest = OUT / p["file"]
        if dest.exists():
            print("déjà présent :", p["file"])
            total += dest.stat().st_size
            continue
        url = f"https://images.unsplash.com/{p['id']}?w={p.get('w', WIDTH)}&q=78&auto=format&fit=max&fm=jpg"
        req = urllib.request.Request(url, headers={"User-Agent": "WCC-site-build/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            blob = r.read()
        dest.write_bytes(blob)
        total += len(blob)
        print(f"ok  {p['file']}  {len(blob) // 1024} Ko")

    lines = [
        "# Crédits des photos d'illustration",
        "",
        "Photos provisoires, issues d'Unsplash (" + data["license"] + ").",
        data["note"],
        "",
        "| Fichier | Auteur | Source | Usage prévu |",
        "| --- | --- | --- | --- |",
    ]
    for p in data["photos"]:
        lines.append(f"| `{p['file']}` | {p['author']} | [Unsplash]({p['page']}) | {p['use']} |")
    (OUT / "CREDITS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nTotal : {total / 1048576:.1f} Mo")
    return 0


if __name__ == "__main__":
    sys.exit(main())
