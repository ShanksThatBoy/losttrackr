#!/usr/bin/env python3
"""Baseline V2 sur une crate Serato : que résout le pipeline actuel, seul ?

Objectif : mesurer, sur la population la plus dure (ex. « DL à Trier »),
combien de morceaux le resolve actuel (empreinte AcoustID + texte MusicBrainz)
identifie SANS la future corrélation communautaire. L'écart restant = ce que
la feature « observations d'identité » devra combler. Le chiffre clé est le
taux de résolution des fichiers SANS tags exploitables (la population
« titre03.mp3 »), car eux n'ont que l'empreinte pour exister.

Effets de bord assumés : appelle l'API de prod (comme un scan normal de
l'app) ; les enregistrements inconnus déclenchent des jobs d'enrichissement
côté worker — c'est voulu, c'est l'enrichissement de la KB par la première
bibliothèque. Ne modifie AUCUN fichier local, n'écrit que le CSV demandé.

    cd losttrackr
    .venv-losttrackr-macos/bin/python tools/baseline_crate_resolve.py \\
        --crate "DL à Trier" --csv /chemin/detail.csv
"""
from __future__ import annotations

import argparse
import csv
import json
import subprocess
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import knowledge_client  # noqa: E402
from serato_scan import (build_basename_index,  # noqa: E402
                         read_paths_from_crates, to_abs)

try:
    from mutagen import File as MutagenFile
except ImportError:  # pragma: no cover
    print("mutagen absent — utiliser .venv-losttrackr-macos", file=sys.stderr)
    sys.exit(2)

FPCALC = Path(__file__).resolve().parent.parent / "bin" / "fpcalc"


def fingerprint(path: Path) -> dict | None:
    """Même appel que l'app : fpcalc -json -length 120."""
    try:
        out = subprocess.run(
            [str(FPCALC), "-json", "-length", "120", str(path)],
            capture_output=True, timeout=30)
        if out.returncode != 0:
            return None
        data = json.loads(out.stdout.decode("utf-8", "replace"))
        if data.get("fingerprint") and data.get("duration"):
            # comme l'app : le serveur attend une durée entière
            return {"fingerprint": data["fingerprint"],
                    "duration": int(data["duration"])}
    except Exception:
        pass
    return None


def read_tags(path: Path) -> tuple[str, str]:
    try:
        audio = MutagenFile(path, easy=True)
    except Exception:
        return "", ""
    if audio is None:
        return "", ""

    def first(key):
        v = audio.get(key)
        return (v[0] if isinstance(v, list) else str(v)).strip() if v else ""

    return first("artist"), first("title")


def has_usable_tags(artist: str, title: str, filename: str) -> bool:
    """Faux si le morceau est un « titre03.mp3 » : pas d'artiste, et un titre
    absent ou égal au nom de fichier (les taggers y recopient souvent le nom)."""
    if artist:
        return True
    stem = Path(filename).stem.lower().strip()
    return bool(title) and title.lower().strip() not in (stem, "")


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--crate", required=True, help="nom exact de la crate")
    ap.add_argument("--serato", type=Path,
                    default=Path.home() / "Music" / "_Serato_")
    ap.add_argument("--limit", type=int, default=0,
                    help="borne le nombre de fichiers (0 = tous)")
    ap.add_argument("--relink-root", type=Path,
                    help="retrouve les chemins morts par nom de fichier sous "
                         "cette racine (même logique que la réparation de l'app)")
    ap.add_argument("--csv", type=Path)
    args = ap.parse_args(argv[1:])

    wanted = [to_abs(p, args.serato)
              for p, crate in read_paths_from_crates(args.serato)
              if crate == args.crate]
    if not wanted:
        print(f"crate introuvable ou vide : {args.crate}", file=sys.stderr)
        return 1

    index = build_basename_index(str(args.relink_root)) if args.relink_root else {}
    existing, relinked, lost = [], 0, 0
    for p in dict.fromkeys(map(str, wanted)):
        if Path(p).exists():
            existing.append(Path(p))
            continue
        cands = index.get(unicodedata.normalize("NFC", Path(p).name), [])
        if cands:
            existing.append(Path(cands[0]))
            relinked += 1
        else:
            lost += 1
    if args.limit:
        existing = existing[:args.limit]
    print(f"crate « {args.crate} » : {len(wanted)} références — "
          f"{len(existing)} fichiers exploitables "
          f"(dont {relinked} retrouvés par nom), {lost} introuvables", flush=True)

    # empreintes + tags
    reqs, meta = [], []
    for i, p in enumerate(existing):
        artist, title = read_tags(p)
        fp = fingerprint(p)
        req = {"client_track_id": str(i)}
        if fp:
            req.update(fp)
        if title:
            req["title"] = title
        if artist:
            req["artist"] = artist
        reqs.append(req)
        meta.append({"path": p, "artist": artist, "title": title,
                     "tagged": has_usable_tags(artist, title, p.name),
                     "has_fp": fp is not None})
        if (i + 1) % 25 == 0:
            print(f"  empreintes {i + 1}/{len(existing)}", flush=True)

    print("resolve en cours (lots de 8)…", flush=True)
    res = knowledge_client.resolve_fingerprints(
        reqs, on_progress=lambda done, total:
        print(f"  lot {done}/{total}", flush=True))
    by_id = {int(r["client_track_id"]): r for r in res.get("results", [])}

    # comptage
    counts = {"matched": 0, "matched_review": 0, "probable": 0, "orphan": 0}
    orphan_untagged = untagged = 0
    with_bpm_key = 0
    rows = []
    for i, m in enumerate(meta):
        r = by_id.get(i) or {}
        status = r.get("status")
        canonical = r.get("canonical") or {}
        if status == "matched" and not canonical.get("needs_review"):
            bucket = "matched"
        elif status == "matched":
            bucket = "matched_review"
        elif status == "probable":
            bucket = "probable"
        else:
            bucket = "orphan"
        counts[bucket] += 1
        if not m["tagged"]:
            untagged += 1
            if bucket == "orphan":
                orphan_untagged += 1
        if canonical.get("bpm") and canonical.get("camelot_key"):
            with_bpm_key += 1
        rows.append({
            "file": m["path"].name, "tagged": int(m["tagged"]),
            "has_fp": int(m["has_fp"]), "status": bucket,
            "artist": canonical.get("artist") or "",
            "title": canonical.get("title") or "",
            "bpm": canonical.get("bpm") or "",
            "camelot": canonical.get("camelot_key") or "",
            "genre": canonical.get("genre") or "",
            "year": canonical.get("year") or "",
        })

    n = len(meta) or 1
    print(f"\n=== Baseline V2 — crate « {args.crate} » ({len(meta)} fichiers)\n")
    print(f"  matched (vert)        {counts['matched']:>5}  {counts['matched']/n:5.1%}")
    print(f"  matched à vérifier    {counts['matched_review']:>5}  {counts['matched_review']/n:5.1%}")
    print(f"  probable (suggestion) {counts['probable']:>5}  {counts['probable']/n:5.1%}")
    print(f"  orphelins             {counts['orphan']:>5}  {counts['orphan']/n:5.1%}")
    print(f"  BPM + Camelot servis  {with_bpm_key:>5}  {with_bpm_key/n:5.1%}")
    print(f"\n  population « titre03.mp3 » (sans tags exploitables) : {untagged}")
    if untagged:
        print(f"  → résolus quand même  {untagged - orphan_untagged:>5}  "
              f"{(untagged - orphan_untagged)/untagged:5.1%}  (l'empreinte seule)")
        print(f"  → orphelins           {orphan_untagged:>5}  "
              f"{orphan_untagged/untagged:5.1%}  ← la cible de la corrélation communautaire")

    if args.csv and rows:
        with open(args.csv, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"\n  → détail : {args.csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
