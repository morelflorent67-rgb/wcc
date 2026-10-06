"""Prépare les variantes du logo WCC à partir du PNG d'origine (fond blanc).

- logo-wcc.png        : logo complet, fond transparent
- logo-wcc-mark.png   : lettres WCC seules (petites tailles)
- logo-wcc.webp / logo-wcc-mark.webp
Affiche aussi des couleurs échantillonnées le long du dégradé.
Usage : python tools/make_logo.py
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design" / "assets" / "logo-original.png"
OUT = ROOT / "design" / "assets"

img = Image.open(SRC).convert("RGB")
a = np.asarray(img).astype(np.int16)
lum = a.mean(axis=2)

# Fond extérieur = pixels quasi blancs reliés aux bords (le liseré blanc interne
# est séparé du fond par le contour noir : il reste donc opaque).
near_white = a.min(axis=2) > 245
labels, _ = ndi.label(near_white)
border_labels = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])))
border_labels.discard(0)
bg = np.isin(labels, list(border_labels))

# Anti-aliasing : la frange autour du fond est du noir sur blanc -> noir + alpha
ring = ndi.binary_dilation(bg, iterations=3) & ~bg
alpha = np.full(lum.shape, 255, dtype=np.float32)
alpha[bg] = 0
alpha[ring] = np.clip(255 - lum[ring], 0, 255)

rgba = np.dstack([a.astype(np.uint8), alpha.astype(np.uint8)])
rgba[ring, 0:3] = 0  # frange = noir pur
out = Image.fromarray(rgba, "RGBA")

# Sous-titre (sans contour noir) : "couleur vers alpha" sur blanc, pour que
# l'intérieur des O soit transparent et que les bords soient propres sur tout fond.
rows_any = (a.min(axis=2) < 235).any(axis=1)
runs, st = [], None
for i, r in enumerate(rows_any):
    if r and st is None: st = i
    if (not r) and st is not None: runs.append((st, i)); st = None
if st is not None: runs.append((st, len(rows_any)))
runs = [r for r in runs if r[1] - r[0] > 8]
sub = runs[-1]  # dernier bloc = sous-titre
print("sous-titre : lignes", sub)
y0, y1 = sub[0] - 6, sub[1] + 6
region = a[y0:y1].astype(np.float32)
al = np.clip((255 - region).max(axis=2) / 255.0, 0, 1)
al = np.where(al < 0.02, 0, al)
safe = np.maximum(al, 1e-3)[..., None]
col = np.clip((region - 255 * (1 - safe)) / safe, 0, 255)
rgba[y0:y1, :, 0:3] = col.astype(np.uint8)
rgba[y0:y1, :, 3] = (al * 255).astype(np.uint8)
alpha = rgba[:, :, 3].astype(np.float32)
out = Image.fromarray(rgba, "RGBA")

# Recadrage serré
ys, xs = np.where(alpha > 0)
pad = 12
box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + pad, out.width), min(ys.max() + pad, out.height))
full = out.crop(box)
full.save(OUT / "logo-wcc.png", optimize=True)
full.save(OUT / "logo-wcc.webp", quality=92, method=6)
print("logo complet :", full.size)

# Séparation lettres / sous-titre : plus grand creux de lignes vides
fa = np.asarray(full)[:, :, 3] > 0
rows = fa.any(axis=1)
gaps, start = [], None
for i, r in enumerate(rows):
    if not r and start is None:
        start = i
    if r and start is not None:
        gaps.append((start, i)); start = None
if gaps:
    g = max(gaps, key=lambda t: t[1] - t[0])
    mark = full.crop((0, 0, full.width, g[0] + 2))
    mark_a = np.asarray(mark)[:, :, 3] > 0
    ys2, xs2 = np.where(mark_a)
    mark = mark.crop((max(xs2.min() - pad, 0), max(ys2.min() - pad, 0), min(xs2.max() + pad, mark.width), min(ys2.max() + pad, mark.height)))
    mark.save(OUT / "logo-wcc-mark.png", optimize=True)
    mark.save(OUT / "logo-wcc-mark.webp", quality=92, method=6)
    print("marque seule :", mark.size, "(coupure ligne", g, ")")

# Échantillonnage du dégradé : pixels saturés (ni noir, ni blanc, ni gris)
rgb = a.astype(np.float32)
mx, mn = rgb.max(axis=2), rgb.min(axis=2)
sat = (mx - mn) > 120
cols = np.where(sat.any(axis=0))[0]
x0, x1 = cols.min(), cols.max()
print("\nÉchantillons du dégradé (gauche -> droite) :")
for p in [0.02, 0.10, 0.20, 0.30, 0.40, 0.50, 0.65, 0.80, 0.92, 0.98]:
    x = int(x0 + p * (x1 - x0))
    col_mask = sat[:, x - 3:x + 4].any(axis=1)
    ys3 = np.where(col_mask)[0]
    if len(ys3) == 0:
        continue
    px = rgb[ys3, x - 3:x + 4].reshape(-1, 3)
    # couleur médiane des pixels saturés de la tranche
    m = np.median(px, axis=0).astype(int)
    print(f"  {int(p*100):3d}%  #{m[0]:02X}{m[1]:02X}{m[2]:02X}")
