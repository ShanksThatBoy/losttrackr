#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Create a LostTrackr update manifest from release artifacts."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def asset(url_base, path, installer_type):
    return {
        "installer_type": installer_type,
        "url": f"{url_base.rstrip('/')}/{path.name}",
        "sha256": sha256(path),
        "size_bytes": path.stat().st_size,
    }


def main():
    parser = argparse.ArgumentParser(description="Create a LostTrackr update manifest.")
    parser.add_argument("--version", required=True)
    parser.add_argument("--channel", choices=["beta", "stable"], default="beta")
    parser.add_argument("--release-url-base", required=True)
    parser.add_argument("--notes-url", required=True)
    parser.add_argument("--macos-pkg", type=Path, required=True)
    parser.add_argument("--windows-exe", type=Path, required=True)
    parser.add_argument("--macos-dmg", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--mandatory", action="store_true")
    parser.add_argument("--rollout", type=int, default=100)
    args = parser.parse_args()

    manifest = {
        "schema": 1,
        "channel": args.channel,
        "latest": args.version.lstrip("v"),
        "minimum_supported": "1.2.1",
        "mandatory": bool(args.mandatory),
        "rollout": args.rollout,
        "summary": "Mise a jour LostTrackr disponible.",
        "notes_url": args.notes_url,
        "macos": asset(args.release_url_base, args.macos_pkg, "pkg"),
        "windows": asset(args.release_url_base, args.windows_exe, "exe"),
    }
    if args.macos_dmg:
        manifest["macos"]["alternate_dmg"] = asset(args.release_url_base, args.macos_dmg, "dmg")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
