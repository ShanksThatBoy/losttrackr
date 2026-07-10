#!/usr/bin/env python3
"""Create a Windows .ico file from the LostTrackr PNG app icon."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "LostTrackr_Icon.png"
OUTPUT = ROOT / "windows" / "generated" / "LostTrackr.ico"
SIZES = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]


def main() -> None:
    if not SOURCE.is_file():
        raise SystemExit(f"Missing icon source: {SOURCE}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCE) as image:
        image = image.convert("RGBA")
        image.save(OUTPUT, format="ICO", sizes=SIZES)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
