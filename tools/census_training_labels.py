#!/usr/bin/env python3
"""Recensement du gisement d'étiquettes de genre — socle du futur modèle maison.

Objectif : répondre à UNE question avant d'écrire la moindre ligne de S2 —
combien de paires (morceau, genre) possède-t-on déjà, gratuitement, sans avoir
rien collecté ? Ce chiffre décide si le modèle de genre maison est un sprint
ou un marathon.

Trois sources d'étiquettes, par ordre de fiabilité décroissante :
  1. tag ID3 « genre » (TCON) — l'intention explicite du DJ
  2. tag « grouping » / « comment » — là où Serato/Rekordbox rangent parfois
     la crate ou une note de style
  3. le chemin du dossier — étiquette faible mais massive (ta biblio est déjà
     rangée par genre)

Chaque source est mappée sur la taxonomie de fait de l'app (les 14 familles de
smart_import.GENRE_KEYWORDS). On mesure aussi l'ACCORD entre sources : deux
sources indépendantes qui disent la même chose = une étiquette de confiance,
la matière première idéale pour l'entraînement.

Lecture seule. Ne touche NI la base, NI le réseau, NI les fichiers. À lancer
sur le Mac :

    cd losttrackr
    .venv-losttrackr-macos/bin/python tools/census_training_labels.py \\
        "/chemin/vers/ta/bibliotheque"

Option --csv <chemin> pour écrire le détail par morceau (utile pour préparer
un premier lot d'entraînement plus tard).
"""
from __future__ import annotations

import argparse
import csv
import sys
from collections import Counter
from pathlib import Path

# Le script vit dans tools/ ; la racine du repo (où est smart_import) doit être
# sur le chemin d'import quel que soit le cwd d'appel.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Réutilise la logique de l'app plutôt que de la réinventer : même mapping,
# mêmes familles, cohérence garantie avec ce que voit l'utilisateur.
from smart_import import (AUDIO_EXTENSIONS, GENRE_KEYWORDS,  # noqa: E402
                          infer_genres_from_text)

try:
    from mutagen import File as MutagenFile
except ImportError:  # pragma: no cover
    print("mutagen absent — utiliser .venv-losttrackr-macos, pas le python "
          "système", file=sys.stderr)
    sys.exit(2)

# Clés de tag « grouping » selon le conteneur (ID3, MP4/M4A, Vorbis).
_GROUPING_KEYS = ("grouping", "©grp", "TIT1", "grp1", "contentgroup")
_COMMENT_KEYS = ("comment", "©cmt", "COMM", "description")


def _read_tag_labels(path: Path) -> tuple[set[str], set[str]]:
    """(familles depuis le tag genre, familles depuis grouping/comment)."""
    try:
        audio = MutagenFile(path, easy=True)
    except Exception:
        return set(), set()
    if audio is None:
        return set(), set()

    def _first(keys) -> str:
        for k in keys:
            v = audio.get(k)
            if v:
                return v[0] if isinstance(v, list) else str(v)
        return ""

    genre_raw = _first(("genre", "TCON", "©gen"))
    grouping_raw = " ".join(filter(None, (
        _first(_GROUPING_KEYS), _first(_COMMENT_KEYS))))
    return (infer_genres_from_text(genre_raw) if genre_raw else set(),
            infer_genres_from_text(grouping_raw) if grouping_raw else set())


def census(root: Path, csv_path: Path | None = None) -> dict:
    total = 0
    labeled = 0                      # au moins une source donne une famille
    high_conf = 0                    # >= 2 sources indépendantes concordent
    per_family = Counter()           # familles distinctes vues (toutes sources)
    per_source = Counter()           # combien de morceaux couverts par source
    agree_pairs = Counter()          # accords entre paires de sources
    raw_id3_genres = Counter()       # genres ID3 bruts, même hors taxonomie

    rows = []
    for path in sorted(root.rglob("*")):
        if path.suffix.lower() not in AUDIO_EXTENSIONS:
            continue
        total += 1

        # Source 3 : le chemin relatif (dossiers), hors nom du fichier lui-même
        folder_text = " ".join(path.relative_to(root).parts[:-1])
        folder_fams = infer_genres_from_text(folder_text)
        # Sources 1 & 2 : tags
        genre_fams, group_fams = _read_tag_labels(path)

        # trace des genres ID3 bruts pour évaluer l'écart avec notre taxonomie
        try:
            a = MutagenFile(path, easy=True)
            g = a.get("genre") if a else None
            if g:
                raw_id3_genres[(g[0] if isinstance(g, list) else str(g)).strip()] += 1
        except Exception:
            pass

        sources = {
            "genre_tag": genre_fams,
            "grouping": group_fams,
            "folder": folder_fams,
        }
        present = {name: fams for name, fams in sources.items() if fams}
        for name in present:
            per_source[name] += 1
        union = set().union(*present.values()) if present else set()
        for fam in union:
            per_family[fam] += 1
        if union:
            labeled += 1

        # accord = deux sources partagent au moins une famille
        names = list(present)
        confident = False
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                inter = present[names[i]] & present[names[j]]
                if inter:
                    agree_pairs[tuple(sorted((names[i], names[j])))] += 1
                    confident = True
        if confident:
            high_conf += 1

        if csv_path:
            rows.append({
                "path": str(path.relative_to(root)),
                "genre_tag": "|".join(sorted(genre_fams)),
                "grouping": "|".join(sorted(group_fams)),
                "folder": "|".join(sorted(folder_fams)),
                "consensus": "|".join(sorted(union)),
                "high_confidence": int(confident),
            })

    if csv_path and rows:
        with open(csv_path, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)

    return {
        "total": total, "labeled": labeled, "high_conf": high_conf,
        "per_family": per_family, "per_source": per_source,
        "agree_pairs": agree_pairs, "raw_id3_genres": raw_id3_genres,
        "csv_rows": len(rows) if csv_path else 0,
    }


def _bar(n: int, total: int, width: int = 32) -> str:
    filled = round(width * n / total) if total else 0
    return "█" * filled + "·" * (width - filled)


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("root", type=Path, help="dossier racine de la bibliothèque")
    ap.add_argument("--csv", type=Path, help="écrit le détail par morceau")
    args = ap.parse_args(argv[1:])

    if not args.root.is_dir():
        print(f"introuvable : {args.root}", file=sys.stderr)
        return 1

    r = census(args.root, args.csv)
    t = r["total"] or 1

    print(f"\n=== Recensement — {r['total']} fichiers audio sous {args.root.name}\n")
    print(f"  Étiquetés (≥1 source)   {r['labeled']:>5}  "
          f"{r['labeled'] / t:5.1%}  {_bar(r['labeled'], r['total'])}")
    print(f"  Confiance (≥2 sources)  {r['high_conf']:>5}  "
          f"{r['high_conf'] / t:5.1%}  {_bar(r['high_conf'], r['total'])}")

    print("\n  Couverture par source :")
    for name in ("genre_tag", "grouping", "folder"):
        n = r["per_source"][name]
        print(f"    {name:<11} {n:>5}  {n / t:5.1%}")

    print("\n  Accords entre sources (= étiquettes de confiance) :")
    if r["agree_pairs"]:
        for pair, n in r["agree_pairs"].most_common():
            print(f"    {' + '.join(pair):<24} {n:>5}")
    else:
        print("    (aucun — sources trop pauvres ou taxonomie à élargir)")

    print("\n  Répartition par famille (toutes sources) :")
    fam_total = sum(r["per_family"].values()) or 1
    for fam in sorted(GENRE_KEYWORDS):
        n = r["per_family"].get(fam, 0)
        print(f"    {fam:<12} {n:>5}  {_bar(n, max(r['per_family'].values(), default=1), 24)}")

    top_raw = r["raw_id3_genres"].most_common(15)
    if top_raw:
        print("\n  Top genres ID3 bruts (pour jauger l'écart avec la taxonomie) :")
        for g, n in top_raw:
            print(f"    {g[:28]:<28} {n:>5}")

    print(f"\n  → {r['high_conf']} morceaux à étiquette de confiance sont "
          f"exploitables dès aujourd'hui pour un premier entraînement.")
    if r["csv_rows"]:
        print(f"  → détail par morceau écrit ({r['csv_rows']} lignes).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
