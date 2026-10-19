"""Carte du bloc « Accès & horaires », dessinée à partir des données OpenStreetMap.

Données : © contributeurs OpenStreetMap, licence ODbL (https://www.openstreetmap.org/copyright).
La mention est affichée sur la carte. Aucun service tiers n'est appelé par les visiteurs : la carte est
un fichier SVG du site.

Usage :
  python tools/build_map.py --download   télécharge l'extrait OpenStreetMap (Overpass API), une seule fois
  python tools/build_map.py              produit les fichiers ci-dessous à partir de l'extrait

Sorties :
  src/assets/map/acces-fond.svg   fond de carte (verdure, eau, bâtiments, petites rues, voies ferrées)
  src/data/map-acces.json         éléments animés : grands axes, tram, trajet à pied, repère, étiquettes

Les extraits bruts (design/map/osm-*.json, quelques Mo) ne sont pas versionnés.
"""
from __future__ import annotations

import heapq
import json
import math
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "design" / "map"
ZONE = RAW / "osm-zone.json"
MARKS = RAW / "osm-reperes.json"
OUT_SVG = ROOT / "src" / "assets" / "map" / "acces-fond.svg"
OUT_JSON = ROOT / "src" / "data" / "map-acces.json"

# 5a avenue de l'Énergie, 67800 Bischheim (Nominatim, nœud OSM 725901575)
LAT0, LON0 = 48.6289689, 7.7671826
M_LAT = 111_180.0
M_LON = 111_320.0 * math.cos(math.radians(LAT0))

# Cadre de la carte, en mètres (1 unité SVG = 1 m). Le garage est placé en (W * GX, H * GY).
W, H = 1400, 1260
GX, GY = 0.58, 0.45
MARGIN = 120  # géométrie conservée un peu au-delà du cadre
BUILDINGS_RADIUS = 900  # bâtiments dessinés dans ce rayon autour du garage

BBOX_ZONE = (48.6159, 7.7451, 48.6420, 7.7893)
BBOX_MARKS = (48.6100, 7.7350, 48.6480, 7.7990)
UA = "WCC-site-build/1.0 (carte du site vitrine, usage ponctuel)"

QUERY_ZONE = f"""[out:json][timeout:90];
(
  way["highway"]{BBOX_ZONE};
  way["railway"~"rail|tram|light_rail"]{BBOX_ZONE};
  way["waterway"~"river|canal|stream"]{BBOX_ZONE};
  way["natural"="water"]{BBOX_ZONE};
  relation["natural"="water"]{BBOX_ZONE};
  way["landuse"~"forest|grass|meadow|recreation_ground|cemetery|allotments|farmland"]{BBOX_ZONE};
  way["leisure"~"park|pitch|garden|sports_centre"]{BBOX_ZONE};
  way["natural"="wood"]{BBOX_ZONE};
  way["building"](48.6224,7.7560,48.6355,7.7784);
);
out geom qt;"""

QUERY_MARKS = f"""[out:json][timeout:60];
(
  node["railway"~"station|halt|tram_stop"]{BBOX_MARKS};
  node["public_transport"="stop_position"]["tram"="yes"]{BBOX_MARKS};
  node["place"~"town|suburb|village|neighbourhood|quarter"](48.6000,7.7200,48.6600,7.8100);
);
out qt;"""


def download() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    for dest, query in ((ZONE, QUERY_ZONE), (MARKS, QUERY_MARKS)):
        body = urllib.parse.urlencode({"data": query}).encode()
        for wait in (0, 30, 60, 120, 240):
            time.sleep(wait)
            req = urllib.request.Request("https://overpass-api.de/api/interpreter", data=body, headers={"User-Agent": UA})
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    blob = r.read()
            except Exception as exc:  # serveur saturé : nouvel essai plus tard
                print("  échec :", exc)
                continue
            if blob[:1] == b"{":
                dest.write_bytes(blob)
                print(f"ok  {dest.relative_to(ROOT)}  {len(blob) // 1024} Ko")
                break
            print("  serveur occupé, nouvel essai…")
        else:
            sys.exit(f"Téléchargement impossible : {dest.name}")


# --- Géométrie ---------------------------------------------------------------------------------

def proj(p: dict) -> tuple[float, float]:
    return (W * GX + (p["lon"] - LON0) * M_LON, H * GY - (p["lat"] - LAT0) * M_LAT)


def rdp(pts: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy)
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        # contour fermé (premier point = dernier) : distance au premier point
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n if n > 1e-6 else math.dist(pts[i], pts[0])
        if d > dmax:
            dmax, idx = d, i
    if dmax <= eps:
        return [pts[0], pts[-1]]
    return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)


def inside(p: tuple[float, float], m: float = MARGIN) -> bool:
    return -m <= p[0] <= W + m and -m <= p[1] <= H + m


def clip_line(pts: list[tuple[float, float]]) -> list[list[tuple[float, float]]]:
    """Découpe une ligne en morceaux situés dans le cadre élargi (un point extérieur gardé à chaque bout)."""
    parts, cur = [], []
    for i, p in enumerate(pts):
        if inside(p):
            if not cur and i > 0:
                cur.append(pts[i - 1])
            cur.append(p)
        elif cur:
            cur.append(p)
            parts.append(cur)
            cur = []
    if cur:
        parts.append(cur)
    return [c for c in parts if len(c) > 1]


def touches(pts: list[tuple[float, float]]) -> bool:
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return max(xs) >= -MARGIN and min(xs) <= W + MARGIN and max(ys) >= -MARGIN and min(ys) <= H + MARGIN


def enc(pts: list[tuple[float, float]], closed: bool = False) -> str:
    """Tracé compact : premier point absolu, puis déplacements relatifs entiers (arrondis sans dérive)."""
    r = [(round(x), round(y)) for x, y in pts]
    out = [r[0]]
    for q in r[1:]:
        if q != out[-1]:
            out.append(q)
    if len(out) < 2:
        return ""
    s = f"M{out[0][0]} {out[0][1]}"
    s += "l" + " ".join(f"{b[0] - a[0]} {b[1] - a[1]}" for a, b in zip(out, out[1:]))
    s = s.replace(" -", "-")
    return s + ("z" if closed else "")


def rings_from_members(members: list[dict]) -> list[list[tuple[float, float]]]:
    """Assemble les morceaux de contour d'une relation en anneaux fermés."""
    segs = [[proj(p) for p in m["geometry"]] for m in members if m.get("geometry")]
    rings = []
    while segs:
        ring = segs.pop(0)
        changed = True
        while ring[0] != ring[-1] and changed:
            changed = False
            for i, s in enumerate(segs):
                if s[0] == ring[-1]:
                    ring += s[1:]
                elif s[-1] == ring[-1]:
                    ring += s[::-1][1:]
                elif s[-1] == ring[0]:
                    ring = s[:-1] + ring
                elif s[0] == ring[0]:
                    ring = s[::-1][:-1] + ring
                else:
                    continue
                segs.pop(i)
                changed = True
                break
        rings.append(ring)
    return rings


def merge_chains(lines: list[list[tuple[float, float]]]) -> list[list[tuple[float, float]]]:
    """Relie bout à bout les tronçons d'une même rue (tracés plus longs, animation plus fluide)."""
    lines = [l[:] for l in lines]
    merged = True
    while merged:
        merged = False
        for i in range(len(lines)):
            for j in range(len(lines)):
                if i == j:
                    continue
                a, b = lines[i], lines[j]
                if a[-1] == b[0]:
                    lines[i] = a + b[1:]
                elif a[-1] == b[-1]:
                    lines[i] = a + b[::-1][1:]
                elif a[0] == b[-1]:
                    lines[i] = b + a[1:]
                elif a[0] == b[0]:
                    lines[i] = b[::-1] + a[1:]
                else:
                    continue
                lines.pop(j)
                merged = True
                break
            if merged:
                break
    return lines


def length(pts: list[tuple[float, float]]) -> float:
    return sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))


# --- Itinéraire à pied (plus court chemin sur les voies piétonnes) --------------------------------

WALK_EXCLUDE = {"motorway", "motorway_link", "trunk", "trunk_link", "proposed", "construction", "raceway"}


def walk_route(ways: list[dict], start: tuple[float, float], goal: tuple[float, float]) -> list[tuple[float, float]]:
    graph: dict[int, list[tuple[int, float]]] = {}
    pos: dict[int, tuple[float, float]] = {}
    for w in ways:
        t = w.get("tags", {})
        if t.get("highway") in WALK_EXCLUDE or t.get("foot") == "no" or t.get("access") in ("private", "no"):
            continue
        ids, geo = w["nodes"], [proj(p) for p in w["geometry"]]
        for (a, pa), (b, pb) in zip(zip(ids, geo), zip(ids[1:], geo[1:])):
            pos[a], pos[b] = pa, pb
            d = math.dist(pa, pb)
            graph.setdefault(a, []).append((b, d))
            graph.setdefault(b, []).append((a, d))
    nearest = lambda q: min(pos, key=lambda n: math.dist(pos[n], q))
    s, g = nearest(start), nearest(goal)
    dist, prev, heap = {s: 0.0}, {}, [(0.0, s)]
    while heap:
        d, n = heapq.heappop(heap)
        if n == g:
            break
        if d > dist.get(n, math.inf):
            continue
        for m, w in graph.get(n, []):
            nd = d + w
            if nd < dist.get(m, math.inf):
                dist[m], prev[m] = nd, n
                heapq.heappush(heap, (nd, m))
    path, n = [pos[g]], g
    while n != s:
        n = prev[n]
        path.append(pos[n])
    return [start] + path[::-1] + [goal]


# --- Construction ----------------------------------------------------------------------------------

MINOR = {"residential": 6, "living_street": 5, "service": 3.5, "pedestrian": 4}
MAJOR = {"primary": 14, "primary_link": 9, "secondary": 13, "secondary_link": 8, "tertiary": 10, "tertiary_link": 7, "unclassified": 8}
LAND = {"forest", "grass", "meadow", "recreation_ground", "cemetery", "allotments", "park", "garden", "pitch", "sports_centre", "wood"}


def build() -> None:
    zone = json.loads(ZONE.read_text(encoding="utf-8"))["elements"]
    marks = json.loads(MARKS.read_text(encoding="utf-8"))["elements"] if MARKS.exists() else []
    garage = (W * GX, H * GY)

    land, farm, water, streams, bldg, minor, rail = [], [], [], [], [], [], []
    major: dict[tuple[str, str], list] = {}
    tram = []
    for e in zone:
        t = e.get("tags", {})
        if e["type"] == "relation":
            if t.get("natural") == "water":
                rings = rings_from_members(e["members"])
                d = "".join(enc(rdp(r, 2.5), True) for r in rings if len(r) > 3 and touches(r))
                if d:
                    water.append(d)
            continue
        pts = [proj(p) for p in e.get("geometry", [])]
        if len(pts) < 2:
            continue
        closed = pts[0] == pts[-1] and len(pts) > 3
        if "building" in t:
            if closed and math.dist(pts[0], garage) < BUILDINGS_RADIUS:
                bldg.append(enc(rdp(pts, 1.2), True))
        elif t.get("natural") == "water" and closed:
            if touches(pts):
                water.append(enc(rdp(pts, 2.5), True))
        elif t.get("waterway"):
            width = {"canal": 16, "river": 14}.get(t["waterway"], 4)
            for part in clip_line(pts):
                streams.append((width, enc(rdp(part, 2))))
        elif t.get("landuse") == "farmland" and closed:
            if touches(pts):
                farm.append(enc(rdp(pts, 3), True))
        elif (t.get("landuse") in LAND or t.get("leisure") in LAND or t.get("natural") in LAND) and closed:
            if touches(pts):
                land.append(enc(rdp(pts, 2.5), True))
        elif t.get("railway") == "tram":
            for part in clip_line(pts):
                tram.append(part)
        elif t.get("railway"):
            if t.get("service") in ("yard", "siding", "spur"):
                continue
            for part in clip_line(pts):
                rail.append(enc(rdp(part, 2)))
        elif t.get("highway") in MINOR:
            if t["highway"] == "service" and t.get("service") in ("parking_aisle", "driveway"):
                continue
            for part in clip_line(pts):
                minor.append((MINOR[t["highway"]], enc(rdp(part, 1.5))))
        elif t.get("highway") in MAJOR:
            key = (t.get("name") or f"#{e['id']}", t["highway"].replace("_link", ""))
            for part in clip_line(pts):
                major.setdefault(key, []).append(part)

    # Fond de carte (fichier SVG mis en cache par le navigateur)
    by_width: dict[float, list[str]] = {}
    for w, d in minor:
        by_width.setdefault(w, []).append(d)
    stream_w: dict[float, list[str]] = {}
    for w, d in streams:
        stream_w.setdefault(w, []).append(d)
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">',
        "<!-- Données © contributeurs OpenStreetMap (ODbL), généré par tools/build_map.py -->",
        f'<rect width="{W}" height="{H}" fill="#14171c"/>',
        f'<path fill="#171b1c" d="{"".join(farm)}"/>',
        f'<path fill="#16241d" d="{"".join(land)}"/>',
        f'<path fill="#0f2236" fill-rule="evenodd" stroke="#16314f" stroke-width="2" d="{"".join(water)}"/>',
    ]
    for w, ds in sorted(stream_w.items()):
        svg.append(f'<path fill="none" stroke="#12304f" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" d="{"".join(ds)}"/>')
    svg.append(f'<path fill="#1d2027" d="{"".join(bldg)}"/>')
    for w, ds in sorted(by_width.items()):
        svg.append(f'<path fill="none" stroke="#262a32" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" d="{"".join(ds)}"/>')
    svg.append(f'<path fill="none" stroke="#2d3139" stroke-width="5" d="{"".join(rail)}"/>')
    svg.append(f'<path fill="none" stroke="#14171c" stroke-width="2.6" stroke-dasharray="14 14" d="{"".join(rail)}"/>')
    svg.append("</svg>")
    OUT_SVG.parent.mkdir(parents=True, exist_ok=True)
    OUT_SVG.write_text("\n".join(svg) + "\n", encoding="utf-8")

    # Grands axes, du plus proche du garage au plus loin (ordre de l'animation)
    roads = []
    for (name, cls), parts in major.items():
        for chain in merge_chains(parts):
            if length(chain) < 25:
                continue
            near = min(math.dist(p, garage) for p in chain)
            roads.append({"name": None if name.startswith("#") else name, "cls": cls, "w": MAJOR[cls], "near": near, "pts": chain})
    roads.sort(key=lambda r: r["near"])

    def side(pts):  # tracé orienté de gauche à droite, pour que les noms ne soient jamais à l'envers
        return pts if pts[-1][0] >= pts[0][0] else pts[::-1]

    street = next(r for r in roads if r["name"] == "Avenue de l'Énergie")

    # Arrêt de tram le plus proche du garage
    stops = [m for m in marks if m.get("tags", {}).get("railway") == "tram_stop" or m.get("tags", {}).get("public_transport") == "stop_position"]
    stop = min(stops, key=lambda m: math.dist(proj(m), garage)) if stops else None
    route = None
    if stop:
        sp = proj(stop)
        path = walk_route([e for e in zone if e["type"] == "way" and "highway" in e.get("tags", {})], sp, garage)
        route = {"d": enc(rdp(path, 1.5)), "meters": round(length(path) / 10) * 10, "stop": stop["tags"].get("name"), "x": round(sp[0]), "y": round(sp[1])}

    # Étiquettes : position (en % du cadre) et angle du plus long tronçon visible de chaque grand axe nommé
    def label_for(name: str, at: float = 0.5):
        cands = [r for r in roads if r["name"] == name]
        if not cands:
            return None
        pts = side(max(cands, key=lambda r: length([p for p in r["pts"] if inside(p, -60)] or [(0, 0)]))["pts"])
        vis = [p for p in pts if inside(p, -60)]
        if len(vis) < 2:
            return None
        total, acc = length(vis), 0.0
        for a, b in zip(vis, vis[1:]):
            seg = math.dist(a, b)
            if acc + seg >= total * at:
                k = (total * at - acc) / (seg or 1)
                x, y = a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k
                ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
                return {"text": name, "x": round(100 * x / W, 2), "y": round(100 * y / H, 2), "angle": round(ang, 1)}
            acc += seg
        return None

    labels = [l for l in (label_for("Route de la Wantzenau", 0.3), label_for("Avenue de l'Énergie", 0.8)) if l]

    data = {
        "_note": "Généré par tools/build_map.py à partir des données © contributeurs OpenStreetMap (ODbL). Ne pas modifier à la main.",
        "viewBox": f"0 0 {W} {H}",
        "garage": {"x": round(garage[0]), "y": round(garage[1]), "px": round(100 * GX, 2), "py": round(100 * GY, 2)},
        "metersPerUnit": 1,
        "roads": [{"d": enc(rdp(r["pts"], 1.5)), "w": r["w"], "cls": r["cls"], "name": r["name"]} for r in roads],
        "street": enc(rdp(side(street["pts"]), 1.5)),
        "tram": [enc(rdp(p, 1.5)) for p in merge_chains(tram)],
        "route": route,
        "labels": labels,
    }
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"fond : {OUT_SVG.stat().st_size // 1024} Ko ; éléments animés : {OUT_JSON.stat().st_size // 1024} Ko")
    print(f"  {len(bldg)} bâtiments, {len(minor)} petites rues, {len(roads)} grands axes, tram : {len(tram)} tronçons")
    if route:
        print(f"  trajet à pied depuis « {route['stop']} » : {route['meters']} m")


if __name__ == "__main__":
    if "--download" in sys.argv:
        download()
    build()
