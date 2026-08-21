#!/usr/bin/env python3
"""Recensement du gisement Serato — crates (genres) et historique (transitions).

Prolonge tools/census_training_labels.py avec les deux sources que les fichiers
audio ne contiennent pas :

  1. les CRATES (`Subcrates/*.crate`) — l'appartenance à une crate est un
     jugement explicite du DJ : une étiquette de genre FORTE, celle qui
     manquait au premier recensement (grouping ≈ 0 %) ;
  2. l'HISTORIQUE (`History/Sessions/*.session`) — chaque session est une
     suite ordonnée de morceaux réellement joués : la matière première du
     terme « réalité » (w_r) du Moteur de Set.

Lecture seule : ne touche NI _Serato_, NI la base, NI le réseau. À lancer :

    cd losttrackr
    .venv-losttrackr-macos/bin/python tools/census_serato.py \\
        --library "/chemin/vers/ta/bibliotheque"

Options --csv-crates / --csv-transitions pour le détail par ligne.
"""
from __future__ import annotations

import argparse
import csv
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from serato_scan import read_paths_from_crates, to_abs  # noqa: E402
from smart_import import (AUDIO_EXTENSIONS,  # noqa: E402
                          infer_genres_from_text)

try:
    from mutagen import File as MutagenFile
except ImportError:  # pragma: no cover
    print("mutagen absent — utiliser .venv-losttrackr-macos", file=sys.stderr)
    sys.exit(2)

# Bornes de vraisemblance pour un timestamp epoch (2010-2035) — les champs
# numériques d'un bloc adat ne sont pas tous des dates.
_EPOCH_MIN, _EPOCH_MAX = 1_262_304_000, 2_051_222_400


# ---------------------------------------------------------------- sessions --

def _iter_tlv(data: bytes):
    """(tag ascii 4 octets, corps) au fil du buffer — format conteneur Serato."""
    i = 0
    while i + 8 <= len(data):
        tag = data[i:i + 4]
        ln = int.from_bytes(data[i + 4:i + 8], "big")
        if ln < 0 or i + 8 + ln > len(data):
            return
        yield tag, data[i + 8:i + 8 + ln]
        i += 8 + ln


def _parse_adat(body: bytes) -> tuple[str | None, int | None]:
    """(chemin du fichier joué, timestamp) depuis un bloc adat.

    Les champs adat sont (uint32 id, uint32 longueur, données). Plutôt que de
    dépendre d'ids non documentés, on identifie le chemin par son contenu
    (chaîne UTF-16BE finissant par une extension audio) et la date par
    vraisemblance (uint32 dans la plage epoch 2010-2035).
    """
    path, stamp = None, None
    j = 0
    while j + 8 <= len(body):
        ln = int.from_bytes(body[j + 4:j + 8], "big")
        if ln < 0 or j + 8 + ln > len(body):
            break
        chunk = body[j + 8:j + 8 + ln]
        if path is None and ln >= 8 and ln % 2 == 0:
            try:
                text = chunk.decode("utf-16-be").rstrip("\x00")
                if Path(text).suffix.lower() in AUDIO_EXTENSIONS:
                    path = text
            except UnicodeDecodeError:
                pass
        if stamp is None and ln == 4:
            val = int.from_bytes(chunk, "big")
            if _EPOCH_MIN <= val <= _EPOCH_MAX:
                stamp = val
        j += 8 + ln
    return path, stamp


def read_sessions(serato_dir: Path) -> list[dict]:
    """Une entrée par session : {name, tracks (ordonnés), start, end}."""
    sessions = []
    for f in sorted((serato_dir / "History" / "Sessions").glob("*.session"),
                    key=lambda p: int(p.stem) if p.stem.isdigit() else 0):
        tracks, stamps = [], []
        for tag, body in _iter_tlv(f.read_bytes()):
            if tag != b"oent":
                continue
            for t2, b2 in _iter_tlv(body):
                if t2 == b"adat":
                    path, stamp = _parse_adat(b2)
                    if path:
                        # ignorer une relecture immédiate du même fichier
                        if not tracks or tracks[-1] != path:
                            tracks.append(path)
                        if stamp:
                            stamps.append(stamp)
        if tracks:
            sessions.append({
                "name": f.name, "tracks": tracks,
                "start": min(stamps) if stamps else None,
                "end": max(stamps) if stamps else None,
            })
    return sessions


# ------------------------------------------------------------------ crates --

def crate_labels(serato_dir: Path) -> dict[str, dict]:
    """{chemin absolu: {familles issues des noms de crates, crates brutes}}."""
    out: dict[str, dict] = {}
    for stored, crate in read_paths_from_crates(serato_dir):
        abs_path = str(to_abs(stored, serato_dir))
        fams = infer_genres_from_text(crate.replace("%%", " "))
        entry = out.setdefault(abs_path, {"families": set(), "crates": set()})
        entry["families"] |= fams
        entry["crates"].add(crate)
    return out


def _tag_family(path: str) -> set[str]:
    try:
        audio = MutagenFile(path, easy=True)
    except Exception:
        return set()
    if audio is None:
        return set()
    g = audio.get("genre")
    if not g:
        return set()
    return infer_genres_from_text(g[0] if isinstance(g, list) else str(g))


# ------------------------------------------------------------------- main ---

def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--serato", type=Path,
                    default=Path.home() / "Music" / "_Serato_")
    ap.add_argument("--library", type=Path,
                    help="racine de la bibliothèque (croisement dossier)")
    ap.add_argument("--csv-crates", type=Path)
    ap.add_argument("--csv-transitions", type=Path)
    args = ap.parse_args(argv[1:])

    if not args.serato.is_dir():
        print(f"_Serato_ introuvable : {args.serato}", file=sys.stderr)
        return 1

    # --- crates -> étiquettes de genre
    crates = crate_labels(args.serato)
    mapped = {p: e for p, e in crates.items() if e["families"]}
    crate_names = Counter()
    unmapped_names = Counter()
    for e in crates.values():
        for c in e["crates"]:
            crate_names[c] += 1
            if not infer_genres_from_text(c.replace("%%", " ")):
                unmapped_names[c] += 1

    # croisement avec le tag ID3 et le dossier -> « or pur »
    gold = 0
    rows_crates = []
    for path, e in sorted(mapped.items()):
        tag_fams = _tag_family(path)
        folder_fams = set()
        if args.library:
            try:
                rel = Path(path).relative_to(args.library)
                folder_fams = infer_genres_from_text(" ".join(rel.parts[:-1]))
            except ValueError:
                pass
        agree = e["families"] & (tag_fams | folder_fams)
        if agree:
            gold += 1
        rows_crates.append({
            "path": path,
            "crates": "|".join(sorted(e["crates"])),
            "crate_families": "|".join(sorted(e["families"])),
            "tag_families": "|".join(sorted(tag_fams)),
            "folder_families": "|".join(sorted(folder_fams)),
            "agree": "|".join(sorted(agree)),
        })

    # --- sessions -> transitions
    sessions = read_sessions(args.serato)
    pairs = Counter()
    plays = 0
    tracks_seen = set()
    rows_tr = []
    for s in sessions:
        plays += len(s["tracks"])
        tracks_seen |= set(s["tracks"])
        for a, b in zip(s["tracks"], s["tracks"][1:]):
            pairs[(a, b)] += 1
            rows_tr.append({"session": s["name"], "from": a, "to": b})

    exists = sum(1 for t in tracks_seen if Path(t).exists())

    # --- rapport
    print(f"\n=== Gisement Serato — {args.serato}\n")
    print("  CRATES (étiquettes de genre fortes)")
    print(f"    crates lues                 {len(crate_names):>6}")
    print(f"    morceaux dans ≥1 crate      {len(crates):>6}")
    print(f"    → avec famille reconnue     {len(mapped):>6}")
    print(f"    → OR PUR (crate ⨯ tag/dossier) {gold:>6}")
    if unmapped_names:
        print("    crates sans famille (à mapper à la main) :")
        for name, n in unmapped_names.most_common(12):
            print(f"      {name[:40]:<40} {n:>5} morceaux")

    print("\n  HISTORIQUE (transitions réelles)")
    print(f"    sessions exploitables       {len(sessions):>6}")
    print(f"    morceaux joués (total)      {plays:>6}")
    print(f"    transitions A→B             {sum(pairs.values()):>6}")
    print(f"    paires distinctes           {len(pairs):>6}")
    print(f"    rejouées ≥2 fois            {sum(1 for n in pairs.values() if n >= 2):>6}")
    print(f"    morceaux distincts joués    {len(tracks_seen):>6} "
          f"(dont {exists} encore présents sur le disque)")
    for s in sessions:
        span = ""
        if s["start"]:
            span = datetime.fromtimestamp(s["start"]).strftime("  %Y-%m-%d")
        print(f"      {s['name']:<14} {len(s['tracks']):>4} morceaux{span}")

    if args.csv_crates and rows_crates:
        with open(args.csv_crates, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows_crates[0]))
            w.writeheader()
            w.writerows(rows_crates)
        print(f"\n  → détail crates : {args.csv_crates} ({len(rows_crates)} lignes)")
    if args.csv_transitions and rows_tr:
        with open(args.csv_transitions, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows_tr[0]))
            w.writeheader()
            w.writerows(rows_tr)
        print(f"  → détail transitions : {args.csv_transitions} ({len(rows_tr)} lignes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
