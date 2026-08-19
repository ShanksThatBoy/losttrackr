#!/usr/bin/env python3
"""Assemble le .ico Windows de LostTrackr à partir des App Icons de marque.

Appelé par windows/build_windows.ps1 avant PyInstaller. Il tourne sur une
machine Windows où ni Inkscape ni ImageMagick ne sont installés : il se contente
donc de recomposer un .ico multi-résolutions depuis les PNG déjà versionnés dans
`assets/brand/windows/`, produits sur macOS par `tools/generate_brand_assets.sh`.

Les représentations 16 / 24 / 32 px proviennent du master optiquement simplifié
(sillons retirés, orbite et nœud épaissis) : c'est ce qui rend l'icône lisible
dans la barre des tâches et l'explorateur.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets" / "brand" / "windows"
PREBUILT = BRAND / "LostTrackr.ico"
OUTPUT = ROOT / "windows" / "generated" / "LostTrackr.ico"
SIZES = [256, 128, 64, 48, 32, 24, 16]
# Repli si les PNG de marque manquent (dépôt partiel) : App Icon pleine taille.
FALLBACK = ROOT / "assets" / "LostTrackr_Icon.png"


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    frames: list[Image.Image] = []
    for size in SIZES:
        src = BRAND / f"LostTrackr-AppIcon-{size}.png"
        if not src.is_file():
            frames = []
            break
        with Image.open(src) as im:
            frames.append(im.convert("RGBA").copy())

    if frames:
        # Pillow écrit un .ico multi-images à partir de la plus grande frame ;
        # `append_images` conserve les rendus dédiés de chaque taille.
        frames[0].save(
            OUTPUT,
            format="ICO",
            sizes=[(s, s) for s in SIZES],
            append_images=frames[1:],
        )
        print(f"Wrote {OUTPUT} from {len(frames)} brand renders {SIZES}")
        return

    if PREBUILT.is_file():
        OUTPUT.write_bytes(PREBUILT.read_bytes())
        print(f"Wrote {OUTPUT} (copie de {PREBUILT})")
        return

    if not FALLBACK.is_file():
        raise SystemExit(
            f"Aucune source d'icône : ni {BRAND}, ni {PREBUILT}, ni {FALLBACK}"
        )
    with Image.open(FALLBACK) as image:
        image.convert("RGBA").save(
            OUTPUT, format="ICO", sizes=[(s, s) for s in SIZES]
        )
    print(f"Wrote {OUTPUT} from {FALLBACK} (repli)")


if __name__ == "__main__":
    main()
