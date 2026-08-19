#!/usr/bin/env python3
"""Construit les SVG masters de l'identité LostTrackr « A1 — Lost Orbit / Équilibre ».

C'est un outil d'AUTORAT, pas le pipeline d'export : il (re)génère les SVG
masters de `assets/brand/master/`. Le pipeline d'assets
(`tools/generate_brand_assets.sh`) ne fait que rasteriser ces SVG et ne les
réécrit jamais.

    ATTENTION — relancer ce script écrase les masters. Si les SVG ont été
    retouchés à la main dans Inkscape, ces retouches sont perdues. Pour un
    simple réexport (PNG / ICNS / ICO / favicons), lancer uniquement
    `tools/generate_brand_assets.sh`.

Le symbole est reconstruit géométriquement (primitives + arcs elliptiques),
jamais vectorisé depuis un raster :

    VINYLE + ORBITE CYAN + POINT DE RECONNEXION

Aucun anneau métallique segmenté n'entoure le disque.

Usage :
    python3 tools/brand/build_masters.py [--out assets/brand/master]
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GLYPH_DATA = Path(__file__).resolve().parent / "wordmark_glyphs.json"

# ---------------------------------------------------------------------------
# Palette (planche A1)
# ---------------------------------------------------------------------------

NIGHT_950 = "#020812"
NIGHT_900 = "#06121E"
NIGHT_800 = "#0A1C2C"
BLUE = "#1598FF"
CYAN = "#20DFFF"
ICE = "#D7E8F4"
WHITE = "#F6FAFF"

# Teintes de travail dérivées (matière vinyle / métal froid)
VINYL_HI = "#0E1B29"  # haut-gauche du disque
VINYL_LO = "#01050B"  # bas-droite du disque
VINYL_FLAT = "#0A1726"  # disque en aplat (décollé du noir pur pour tenir sur fond nuit)
GROOVE = "#1B3149"
STEEL_HI = "#CFE1EF"
STEEL_MID = "#9FBACF"
STEEL_LO = "#5A748B"

# ---------------------------------------------------------------------------
# Géométrie du mark — canvas 512 × 512
# ---------------------------------------------------------------------------

SIZE = 512
CX, CY = 254.0, 256.0  # centre du vinyle (calé pour centrer l'encre dans le carré)
R_DISC = 168.0
R_LABEL = 44.0
R_HOLE = 6.5

ORBIT_RX = 218.0  # demi-grand axe de l'orbite
ORBIT_RY = 93.0  # demi-petit axe
ORBIT_TILT = -25.0  # inclinaison, degrés (sens horaire écran)

# L'ellipse coupe le bord du disque vers t = 45 / 135 / 225 / 315°.
# Moitié AVANT (balayage bas, devant le vinyle) : t 0 → 180.
# L'anneau ARRIÈRE est tracé en entier puis masqué par le disque : il ne
# réapparaît que dans les deux lobes extérieurs (droite vers le nœud, gauche).
T_FRONT = (0.0, 180.0)

GROOVES = (158.0, 147.0, 135.0, 121.0, 105.0, 88.0)
GROOVES_SMALL = ()

_A = math.radians(ORBIT_TILT)
_COS_A, _SIN_A = math.cos(_A), math.sin(_A)


def ellipse_point(t_deg: float) -> tuple[float, float]:
    """Point de l'orbite au paramètre `t_deg` (repère SVG, y vers le bas)."""
    t = math.radians(t_deg)
    ex, ey = ORBIT_RX * math.cos(t), ORBIT_RY * math.sin(t)
    return CX + ex * _COS_A - ey * _SIN_A, CY + ex * _SIN_A + ey * _COS_A


def _ellipse_tangent(t_deg: float) -> tuple[float, float]:
    """Dérivée dP/dt (radians) au paramètre `t_deg`."""
    t = math.radians(t_deg)
    ex, ey = -ORBIT_RX * math.sin(t), ORBIT_RY * math.cos(t)
    return ex * _COS_A - ey * _SIN_A, ex * _SIN_A + ey * _COS_A


def arc_path(t0: float, t1: float, close: bool = False) -> str:
    """Arc d'orbite en Béziers cubiques exactes (≤ 90° par segment).

    On n'utilise volontairement PAS la commande SVG `A` : à partir de deux
    points, `A` peut retenir l'autre centre d'ellipse possible et donc un tracé
    différent de la paramétrisation utilisée pour placer le nœud, le dégradé de
    traîne et les zones masquées par le disque.
    """
    span = t1 - t0
    n = max(1, math.ceil(abs(span) / 90.0))
    step = span / n
    k = (4.0 / 3.0) * math.tan(math.radians(step) / 4.0)
    x, y = ellipse_point(t0)
    d = [f"M {x:.2f} {y:.2f}"]
    for i in range(n):
        a, b = t0 + i * step, t0 + (i + 1) * step
        p0, p1 = ellipse_point(a), ellipse_point(b)
        d0, d1 = _ellipse_tangent(a), _ellipse_tangent(b)
        c1 = (p0[0] + k * d0[0], p0[1] + k * d0[1])
        c2 = (p1[0] - k * d1[0], p1[1] - k * d1[1])
        d.append(
            f"C {c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p1[0]:.2f} {p1[1]:.2f}"
        )
    if close:
        d.append("Z")
    return " ".join(d)


NODE_X, NODE_Y = ellipse_point(0.0)
FRONT_D = arc_path(*T_FRONT)
RING_D = arc_path(0.0, 360.0, close=True)

# Fondu de la traîne : x est monotone décroissant sur t ∈ [11°, 180°], donc un
# dégradé horizontal cadre exactement la queue qui se dissout dans l'anneau.
TRAIL_X0 = ellipse_point(0.0)[0] - 10
TRAIL_X1 = ellipse_point(180.0)[0] + 3


# ---------------------------------------------------------------------------
# Helpers SVG
# ---------------------------------------------------------------------------

HEADER = (
    '<svg xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink" '
    'xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" '
    'viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
    'role="img" aria-labelledby="ltTitle">\n'
    "  <title id=\"ltTitle\">{title}</title>\n"
)


def svg(width: float, height: float, title: str, defs: str, body: str) -> str:
    out = HEADER.format(w=width, h=height, title=title)
    if defs.strip():
        out += "  <defs>\n" + defs.rstrip("\n") + "\n  </defs>\n"
    out += body.rstrip("\n") + "\n</svg>\n"
    return out


def g(label: str, body: str, attrs: str = "", indent: str = "  ") -> str:
    a = f" {attrs}" if attrs else ""
    inner = "\n".join(indent + "  " + line for line in body.strip("\n").split("\n"))
    return f'{indent}<g inkscape:label="{label}"{a}>\n{inner}\n{indent}</g>\n'


# ---------------------------------------------------------------------------
# Styles par variante
# ---------------------------------------------------------------------------


def style_for(variant: str) -> dict:
    """Palette et traitement de chaque variante du mark (silhouette identique)."""
    base = {
        "premium": False,
        "mono": None,
        "grooves": GROOVES,
        "groove_w": 2.2,
        "groove_op": 0.30,
        "orbit_w": 23.0,  # moitié avant, lumineuse
        "ring_w": 9.0,  # anneau arrière, fin (perspective)
        "ring_op": 0.55,
        "node_r": 19.0,
        "glow": False,
        "orbit_cyan": CYAN,
        "orbit_blue": BLUE,
        "ring_color": BLUE,
        "node_fill": CYAN,
        "node_core": WHITE,
        "rim": ICE,
        "rim_op": 0.34,
        "rim_w": 2.5,
        "disc_flat": VINYL_FLAT,
        "label_flat": STEEL_MID,
        "label_r": R_LABEL,
    }
    if variant in ("mark", "dark"):
        return base
    if variant == "premium":
        return {**base, "premium": True, "glow": True, "rim_op": 0.34, "ring_op": 0.62}
    if variant == "light":
        # fonds clairs : disque plus dense, cyan basculé vers le bleu électrique
        return {
            **base,
            "disc_flat": NIGHT_800,
            "rim": NIGHT_950,
            "rim_op": 0.45,
            "rim_w": 2.0,
            "orbit_cyan": "#0FB2F7",
            "orbit_blue": BLUE,
            "ring_color": "#2B7FC9",
            "ring_op": 0.75,
            "node_fill": BLUE,
            "groove_op": 0.6,
            "label_flat": "#8FAABF",
        }
    if variant == "small":
        # Simplification optique ≤ 32 px : plus de sillons (bruit pur à cette
        # échelle), disque décollé du fond nuit, orbite et nœud épaissis.
        return {
            **base,
            "grooves": GROOVES_SMALL,
            "orbit_w": 34.0,
            "ring_w": 16.0,
            "ring_op": 0.8,
            "node_r": 38.0,
            "disc_flat": "#14283E",
            "rim": ICE,
            "rim_op": 0.55,
            "rim_w": 7.0,
            "label_r": 40.0,
            "label_flat": "#8FA6B9",
        }
    if variant == "white":
        return {**base, "mono": WHITE, "orbit_w": 26.0, "ring_w": 11.0, "node_r": 22.0}
    if variant == "cyan":
        return {**base, "mono": CYAN, "orbit_w": 26.0, "ring_w": 11.0, "node_r": 22.0}
    raise ValueError(variant)


# ---------------------------------------------------------------------------
# Construction du mark
# ---------------------------------------------------------------------------


def mark_defs(s: dict, uid: str) -> str:
    d = ""
    # Traîne : pleine près du nœud, dissoute dans l'anneau arrière en bout de course.
    d += (
        f'    <linearGradient id="{uid}Trail" gradientUnits="userSpaceOnUse" '
        f'x1="{TRAIL_X0:.1f}" y1="0" x2="{TRAIL_X1:.1f}" y2="0">\n'
        f'      <stop offset="0" stop-color="{s["orbit_cyan"]}" stop-opacity="1"/>\n'
        f'      <stop offset="0.58" stop-color="{s["orbit_cyan"]}" stop-opacity="0.97"/>\n'
        f'      <stop offset="0.84" stop-color="{s["orbit_blue"]}" stop-opacity="0.5"/>\n'
        f'      <stop offset="1" stop-color="{s["orbit_blue"]}" stop-opacity="0"/>\n'
        "    </linearGradient>\n"
    )
    if s["premium"]:
        d += (
            f'    <radialGradient id="{uid}Disc" gradientUnits="userSpaceOnUse" '
            f'cx="{CX - R_DISC * 0.40:.1f}" cy="{CY - R_DISC * 0.44:.1f}" r="{R_DISC * 1.78:.1f}">\n'
            f'      <stop offset="0" stop-color="{VINYL_HI}"/>\n'
            f'      <stop offset="0.55" stop-color="#050D17"/>\n'
            f'      <stop offset="1" stop-color="{VINYL_LO}"/>\n'
            "    </radialGradient>\n"
            f'    <linearGradient id="{uid}Sheen" gradientUnits="userSpaceOnUse" '
            f'x1="{CX - R_DISC:.0f}" y1="{CY - R_DISC:.0f}" x2="{CX + R_DISC * 0.55:.0f}" y2="{CY + R_DISC:.0f}">\n'
            f'      <stop offset="0" stop-color="{ICE}" stop-opacity="0.15"/>\n'
            f'      <stop offset="0.34" stop-color="{ICE}" stop-opacity="0.03"/>\n'
            f'      <stop offset="1" stop-color="{ICE}" stop-opacity="0"/>\n'
            "    </linearGradient>\n"
            f'    <radialGradient id="{uid}Glow" gradientUnits="userSpaceOnUse" '
            f'cx="{NODE_X:.1f}" cy="{NODE_Y:.1f}" r="{s["node_r"] * 1.95:.1f}">\n'
            f'      <stop offset="0" stop-color="{CYAN}" stop-opacity="0.5"/>\n'
            f'      <stop offset="0.5" stop-color="{CYAN}" stop-opacity="0.14"/>\n'
            f'      <stop offset="1" stop-color="{CYAN}" stop-opacity="0"/>\n'
            "    </radialGradient>\n"
        )
    if not s["mono"]:
        # Métal froid du centre (présent dès la version « clean »)
        d += (
            f'    <linearGradient id="{uid}Label" gradientUnits="userSpaceOnUse" '
            f'x1="{CX - R_LABEL:.0f}" y1="{CY - R_LABEL:.0f}" x2="{CX + R_LABEL:.0f}" y2="{CY + R_LABEL:.0f}">\n'
            f'      <stop offset="0" stop-color="{STEEL_HI}"/>\n'
            f'      <stop offset="0.5" stop-color="{s["label_flat"]}"/>\n'
            f'      <stop offset="1" stop-color="{STEEL_LO}"/>\n'
            "    </linearGradient>\n"
        )
    else:
        # Monochrome : le disque est évidé (sillons, centre, passage de l'orbite)
        # pour que tout reste lisible d'un seul aplat.
        gap = s["orbit_w"] + 13
        d += (
            f'    <mask id="{uid}Knock" maskUnits="userSpaceOnUse" x="0" y="0" width="{SIZE}" height="{SIZE}">\n'
            f'      <rect width="{SIZE}" height="{SIZE}" fill="#fff"/>\n'
            f'      <g fill="none" stroke="#000" stroke-linecap="round">\n'
            f'        <path d="{FRONT_D}" stroke-width="{gap:g}"/>\n'
            f'        <path d="{RING_D}" stroke-width="{s["ring_w"] + 12:g}"/>\n'
        )
        for r in GROOVES_SMALL:
            d += f'        <circle cx="{CX:g}" cy="{CY:g}" r="{r:g}" stroke-width="5"/>\n'
        d += (
            f'        <circle cx="{CX:g}" cy="{CY:g}" r="{R_LABEL:g}" stroke-width="9"/>\n'
            f'      </g>\n'
            f'      <circle cx="{CX:g}" cy="{CY:g}" r="{R_HOLE:g}" fill="#000"/>\n'
            "    </mask>\n"
        )
    return d


def mark_body(s: dict, uid: str, indent: str = "  ") -> str:
    """Corps du mark. Z-order : anneau arrière → vinyle → orbite avant → nœud.

    L'anneau arrière est tracé en entier ; le disque le recouvre, si bien qu'il
    ne subsiste que les deux lobes extérieurs — l'orbite passe donc réellement
    DERRIÈRE le vinyle et réapparaît devant.
    """
    # 1. Anneau arrière (fin, en retrait)
    back = (
        f'<path d="{RING_D}" fill="none" stroke="{s["mono"] or s["ring_color"]}" '
        f'stroke-width="{s["ring_w"]:g}" opacity="{s["ring_op"]:g}"/>'
    )
    out = g("orbite-arriere", back, indent=indent)

    # 2. Vinyle
    if s["mono"]:
        out += g(
            "vinyle",
            f'<circle cx="{CX:g}" cy="{CY:g}" r="{R_DISC:g}" fill="{s["mono"]}"/>',
            attrs=f'mask="url(#{uid}Knock)"',
            indent=indent,
        )
    else:
        fill = f"url(#{uid}Disc)" if s["premium"] else s["disc_flat"]
        parts = [f'<circle cx="{CX:g}" cy="{CY:g}" r="{R_DISC:g}" fill="{fill}"/>']
        if s["grooves"]:
            parts.append(
                f'<g inkscape:label="sillons" fill="none" stroke="{GROOVE}" '
                f'stroke-width="{s["groove_w"]:g}" opacity="{s["groove_op"]:g}">'
            )
            for r in s["grooves"]:
                parts.append(f'  <circle cx="{CX:g}" cy="{CY:g}" r="{r:g}"/>')
            parts.append("</g>")
        if s["premium"]:
            parts.append(
                f'<circle cx="{CX:g}" cy="{CY:g}" r="{R_DISC:g}" fill="url(#{uid}Sheen)"/>'
            )
        parts.append(
            f'<circle cx="{CX:g}" cy="{CY:g}" r="{R_DISC - 1:g}" fill="none" '
            f'stroke="{s["rim"]}" stroke-width="{s["rim_w"]:g}" opacity="{s["rim_op"]:g}"/>'
        )
        parts.append(
            f'<circle cx="{CX:g}" cy="{CY:g}" r="{s["label_r"]:g}" fill="url(#{uid}Label)"/>'
        )
        parts.append(
            f'<circle cx="{CX:g}" cy="{CY:g}" r="{s["label_r"]:g}" fill="none" '
            f'stroke="{NIGHT_950}" stroke-width="2" opacity="0.5"/>'
        )
        parts.append(f'<circle cx="{CX:g}" cy="{CY:g}" r="{R_HOLE:g}" fill="{NIGHT_950}"/>')
        out += g("vinyle", "\n".join(parts), indent=indent)

    # 3. Orbite avant (devant le disque, traîne dégradée)
    stroke = s["mono"] or f"url(#{uid}Trail)"
    out += g(
        "orbite-avant",
        f'<path d="{FRONT_D}" fill="none" stroke="{stroke}" '
        f'stroke-width="{s["orbit_w"]:g}" stroke-linecap="round"/>',
        indent=indent,
    )

    # 4. Point de reconnexion
    nr = s["node_r"]
    node = []
    if s["glow"]:
        node.append(
            f'<circle cx="{NODE_X:.2f}" cy="{NODE_Y:.2f}" r="{nr * 1.95:.2f}" '
            f'fill="url(#{uid}Glow)"/>'
        )
    node.append(
        f'<circle cx="{NODE_X:.2f}" cy="{NODE_Y:.2f}" r="{nr:g}" '
        f'fill="{s["mono"] or s["node_fill"]}"/>'
    )
    if not s["mono"]:
        node.append(
            f'<circle cx="{NODE_X - nr * 0.22:.2f}" cy="{NODE_Y - nr * 0.24:.2f}" '
            f'r="{nr * 0.40:.2f}" fill="{s["node_core"]}" opacity="0.92"/>'
        )
    out += g("point-de-reconnexion", "\n".join(node), indent=indent)
    return out


def build_mark(variant: str) -> str:
    s = style_for(variant)
    uid = "m" + variant.capitalize()
    titles = {
        "mark": "LostTrackr — symbole A1 (Lost Orbit)",
        "premium": "LostTrackr — symbole A1 premium",
        "dark": "LostTrackr — symbole A1, fonds sombres",
        "light": "LostTrackr — symbole A1, fonds clairs",
        "white": "LostTrackr — symbole A1 monochrome blanc",
        "cyan": "LostTrackr — symbole A1 monochrome cyan",
        "small": "LostTrackr — symbole A1 simplifié (petites tailles)",
    }
    return svg(SIZE, SIZE, titles[variant], mark_defs(s, uid), mark_body(s, uid))


# ---------------------------------------------------------------------------
# Wordmark
# ---------------------------------------------------------------------------

# Approches optiques (unités fonte, 1000 UPM) : espace entre l'encre du glyphe
# précédent et celle du suivant. Réglé à la main, pas métrique.
KERN = {
    "Lo": 72,
    "os": 66,
    "st": 68,
    "tT": 88,  # articulation Lost | Trackr, volontairement respirante
    "Tr": 30,  # r se glisse sous la traverse du T
    "ra": 52,
    "ac": 70,
    "ck": 68,
    "kr": 58,
}
WORD = "LostTrackr"
SPLIT = 4  # "Lost" | "Trackr"


def _wordmark_layout() -> tuple[list[tuple[str, float]], float, float]:
    data = json.loads(GLYPH_DATA.read_text())
    glyphs = data["glyphs"]
    placed: list[tuple[str, float]] = []
    x = 0.0
    top = 0.0
    for i, ch in enumerate(WORD):
        gi = glyphs[ch]
        if i:
            x += KERN[WORD[i - 1] + ch]
        placed.append((ch, x))
        top = max(top, gi["yMax"])
        x += gi["ink"][1]
    return placed, x, top


def build_wordmark(theme: str = "dark") -> str:
    data = json.loads(GLYPH_DATA.read_text())
    glyphs = data["glyphs"]
    placed, width, top = _wordmark_layout()
    pad = 24.0
    vb_w, vb_h = width + pad * 2, top + pad * 2
    lost = WHITE if theme == "dark" else NIGHT_800
    trackr = CYAN if theme == "dark" else BLUE

    def run(chars, color, label):
        paths = []
        for ch, x in chars:
            # y-down : la baseline est posée à `top`, les contours sont déjà retournés
            paths.append(
                f'<path transform="translate({x + pad:.1f} {top + pad:.1f})" '
                f'd="{glyphs[ch]["d"]}"/>'
            )
        return g(label, "\n".join(paths), attrs=f'fill="{color}"')

    body = run(placed[:SPLIT], lost, "lost")
    body += run(placed[SPLIT:], trackr, "trackr")
    title = f"LostTrackr — wordmark ({'fonds sombres' if theme == 'dark' else 'fonds clairs'})"
    return svg(round(vb_w, 1), round(vb_h, 1), title, "", body)


# ---------------------------------------------------------------------------
# Lockup horizontal
# ---------------------------------------------------------------------------

def _mark_ink_box(orbit_w: float = 23.0, ring_w: float = 9.0, node_r: float = 19.0):
    """Boîte d'encre réelle du mark, dérivée de la géométrie (pas codée en dur).

    Sert au calage du lockup et au centrage de l'App Icon : toute évolution des
    rayons se répercute automatiquement.
    """
    # Demi-étendues de l'ellipse tournée
    ex = math.hypot(ORBIT_RX * _COS_A, ORBIT_RY * _SIN_A)
    ey = math.hypot(ORBIT_RX * _SIN_A, ORBIT_RY * _COS_A)
    half = max(orbit_w, ring_w) / 2.0
    x0 = min(CX - R_DISC, CX - ex - half)
    x1 = max(CX + R_DISC, CX + ex + half, NODE_X + node_r)
    y0 = min(CY - R_DISC, CY - ey - half)
    y1 = max(CY + R_DISC, CY + ey + half)
    return x0, x1, y0, y1


MARK_INK_X0, MARK_INK_X1, MARK_INK_Y0, MARK_INK_Y1 = _mark_ink_box()


def build_lockup(theme: str = "dark") -> str:
    data = json.loads(GLYPH_DATA.read_text())
    glyphs = data["glyphs"]
    placed, word_w, top = _wordmark_layout()
    cap = data["capHeight"]

    # Le mark est calé sur la hauteur de capitale × 2.05 : le disque encadre
    # optiquement le wordmark sans l'écraser.
    mark_h = cap * 2.05
    scale = mark_h / (MARK_INK_Y1 - MARK_INK_Y0)
    mark_w = (MARK_INK_X1 - MARK_INK_X0) * scale
    gap = cap * 0.48
    pad = cap * 0.30

    total_w = pad + mark_w + gap + word_w + pad
    total_h = mark_h + pad * 2
    baseline = pad + mark_h / 2 + cap / 2  # capitales centrées sur l'axe du mark

    s = style_for("mark" if theme == "dark" else "light")
    uid = "lk" + theme.capitalize()
    tx = pad - MARK_INK_X0 * scale
    ty = pad - MARK_INK_Y0 * scale

    body = g(
        "mark",
        mark_body(s, uid, indent="").rstrip("\n"),
        attrs=f'transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})"',
    )
    lost = WHITE if theme == "dark" else NIGHT_800
    trackr = CYAN if theme == "dark" else BLUE
    wx = pad + mark_w + gap

    def run(chars, color, label):
        paths = [
            f'<path transform="translate({wx + x:.1f} {baseline:.1f})" d="{glyphs[ch]["d"]}"/>'
            for ch, x in chars
        ]
        return g(label, "\n".join(paths), attrs=f'fill="{color}"')

    body += g(
        "wordmark",
        (run(placed[:SPLIT], lost, "lost") + run(placed[SPLIT:], trackr, "trackr")).rstrip("\n"),
    )
    label = "fonds sombres" if theme == "dark" else "fonds clairs"
    return svg(
        round(total_w, 1),
        round(total_h, 1),
        f"LostTrackr — lockup horizontal ({label})",
        mark_defs(s, uid),
        body,
    )


# ---------------------------------------------------------------------------
# App icons
# ---------------------------------------------------------------------------


def build_app_icon(platform: str = "macos", small: bool = False) -> str:
    """App Icon = plaque squircle bleu nuit + mark premium. Jamais le mark seul.

    `small=True` monte le mark simplifié sur la même plaque : c'est cette
    version que le pipeline rasterise pour les représentations 16 et 32 px de
    l'iconset, où les sillons ne sont plus que du bruit.
    """
    n = 1024
    if platform == "macos":
        # Grille Big Sur : la plaque occupe 824 px centrés dans 1024.
        plate, radius, mark_w = 824.0, 185.0, 690.0
    else:
        # Windows : pas de masque système, la plaque occupe davantage le canvas.
        plate, radius, mark_w = 936.0, 196.0, 772.0
    off = (n - plate) / 2

    if small:
        s = {**style_for("small"), "premium": True, "glow": True}
    else:
        s = style_for("premium")
    uid = "ai" + platform.capitalize() + ("Sm" if small else "")
    scale = mark_w / (MARK_INK_X1 - MARK_INK_X0)
    ink_cx = (MARK_INK_X0 + MARK_INK_X1) / 2
    ink_cy = (MARK_INK_Y0 + MARK_INK_Y1) / 2
    tx = n / 2 - ink_cx * scale
    ty = n / 2 - ink_cy * scale

    defs = (
        f'    <linearGradient id="{uid}Plate" gradientUnits="userSpaceOnUse" '
        f'x1="{off:.0f}" y1="{off:.0f}" x2="{off + plate:.0f}" y2="{off + plate:.0f}">\n'
        f'      <stop offset="0" stop-color="#0B1B2B"/>\n'
        f'      <stop offset="0.52" stop-color="{NIGHT_900}"/>\n'
        f'      <stop offset="1" stop-color="{NIGHT_950}"/>\n'
        "    </linearGradient>\n"
        f'    <radialGradient id="{uid}Halo" gradientUnits="userSpaceOnUse" '
        f'cx="{n / 2:.0f}" cy="{n / 2:.0f}" r="{plate * 0.62:.0f}">\n'
        f'      <stop offset="0" stop-color="{BLUE}" stop-opacity="0.17"/>\n'
        f'      <stop offset="1" stop-color="{BLUE}" stop-opacity="0"/>\n'
        "    </radialGradient>\n"
        f'    <clipPath id="{uid}Clip">\n'
        f'      <rect x="{off:.0f}" y="{off:.0f}" width="{plate:.0f}" height="{plate:.0f}" '
        f'rx="{radius:.0f}" ry="{radius:.0f}"/>\n'
        "    </clipPath>\n"
    ) + mark_defs(s, uid)

    body = g(
        "plaque",
        f'<rect x="{off:.0f}" y="{off:.0f}" width="{plate:.0f}" height="{plate:.0f}" '
        f'rx="{radius:.0f}" ry="{radius:.0f}" fill="url(#{uid}Plate)"/>\n'
        f'<rect x="{off:.0f}" y="{off:.0f}" width="{plate:.0f}" height="{plate:.0f}" '
        f'rx="{radius:.0f}" ry="{radius:.0f}" fill="url(#{uid}Halo)"/>\n'
        f'<rect x="{off + 1:.1f}" y="{off + 1:.1f}" width="{plate - 2:.0f}" height="{plate - 2:.0f}" '
        f'rx="{radius - 1:.0f}" ry="{radius - 1:.0f}" fill="none" '
        f'stroke="{ICE}" stroke-width="2" opacity="0.10"/>',
    )
    body += g(
        "mark-premium",
        mark_body(s, uid, indent="").rstrip("\n"),
        attrs=(
            f'clip-path="url(#{uid}Clip)" '
            f'transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})"'
        ),
    )
    label = "macOS" if platform == "macos" else "Windows"
    suffix = " (petites tailles)" if small else ""
    return svg(n, n, f"LostTrackr — App Icon {label}{suffix}", defs, body)


# ---------------------------------------------------------------------------

TARGETS = {
    "losttrackr-mark.svg": lambda: build_mark("mark"),
    "losttrackr-mark-premium.svg": lambda: build_mark("premium"),
    "losttrackr-mark-dark.svg": lambda: build_mark("dark"),
    "losttrackr-mark-light.svg": lambda: build_mark("light"),
    "losttrackr-mark-white.svg": lambda: build_mark("white"),
    "losttrackr-mark-cyan.svg": lambda: build_mark("cyan"),
    "losttrackr-mark-small.svg": lambda: build_mark("small"),
    "losttrackr-wordmark.svg": lambda: build_wordmark("dark"),
    "losttrackr-wordmark-light.svg": lambda: build_wordmark("light"),
    "losttrackr-lockup-horizontal.svg": lambda: build_lockup("dark"),
    "losttrackr-lockup-horizontal-dark.svg": lambda: build_lockup("dark"),
    "losttrackr-lockup-horizontal-light.svg": lambda: build_lockup("light"),
    "losttrackr-app-icon-macos.svg": lambda: build_app_icon("macos"),
    "losttrackr-app-icon-macos-small.svg": lambda: build_app_icon("macos", small=True),
    "losttrackr-app-icon-windows.svg": lambda: build_app_icon("windows"),
    "losttrackr-app-icon-windows-small.svg": lambda: build_app_icon("windows", small=True),
}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", default=str(ROOT / "assets/brand/master"))
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in TARGETS.items():
        (out / name).write_text(fn(), encoding="utf-8")
        print(f"  {name}")
    print(f"{len(TARGETS)} masters SVG écrits dans {out}")
    print(f"  nœud de reconnexion : ({NODE_X:.1f}, {NODE_Y:.1f})")


if __name__ == "__main__":
    main()
