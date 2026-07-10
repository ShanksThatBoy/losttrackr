#!/usr/bin/env python3
"""Sign a LostTrackr update manifest with the local Ed25519 private key."""

from __future__ import annotations

import argparse
import base64
import json
from pathlib import Path

from cryptography.hazmat.primitives import serialization


def canonical_manifest_bytes(manifest):
    return json.dumps(manifest, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def main():
    parser = argparse.ArgumentParser(description="Sign a LostTrackr update manifest.")
    parser.add_argument("manifest", type=Path)
    parser.add_argument(
        "--private-key",
        type=Path,
        default=Path("updates/private/losttrackr_update_ed25519_private.pem"),
    )
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    private_key = serialization.load_pem_private_key(args.private_key.read_bytes(), password=None)
    signature = private_key.sign(canonical_manifest_bytes(manifest))
    output = args.out or args.manifest.with_suffix(args.manifest.suffix + ".sig")
    output.write_text(base64.b64encode(signature).decode("ascii") + "\n", encoding="utf-8")
    print(f"Signed {args.manifest} -> {output}")


if __name__ == "__main__":
    main()
