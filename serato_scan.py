#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
serato_scan.py — Scanner READ-ONLY de la bibliothèque Serato DJ Pro.

Ce script NE MODIFIE RIEN. Il se contente de :
  1. parser `database V2` + tous les `.crate` (Subcrates),
  2. résoudre chaque chemin de fichier sur le disque,
  3. lister ceux qui sont cassés (introuvables),
  4. les grouper par "préfixe cassé" (l'endroit où le chemin arrête de résoudre),
  5. proposer le nouvel emplacement quand un fichier du même nom est trouvé
     dans le dossier de recherche (--search-root), de façon UNIQUE.

Aucune écriture dans _Serato_. Le seul fichier produit est le rapport CSV.

Usage typique (macOS) :
    python3 serato_scan.py
    python3 serato_scan.py --search-root ~/Desktop/"DJ Shanks"
    python3 serato_scan.py --serato ~/Music/_Serato_ --report ~/Desktop/rapport.csv
"""

import argparse
import csv
import os
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

# --- Tags Serato (format TLV : 4o tag ASCII + 4o longueur big-endian + payload) ---
# Les conteneurs commencent par 'o' (otrk, osrt, ovct...).
# pfil (database V2) et ptrk (.crate) contiennent le chemin, encodé en UTF-16BE.
PATH_TAGS = (b"pfil", b"ptrk")


def parse_tlv(data, want_path_tags=PATH_TAGS):
    """Générateur récursif : yield chaque chemin (str) trouvé dans un blob TLV."""
    offset = 0
    n = len(data)
    while offset + 8 <= n:
        tag = data[offset:offset + 4]
        length = int.from_bytes(data[offset + 4:offset + 8], "big")
        start = offset + 8
        end = start + length
        if end > n:  # blob tronqué / corrompu : on s'arrête proprement
            break
        payload = data[start:end]
        if tag.startswith(b"o"):  # conteneur -> on descend
            yield from parse_tlv(payload, want_path_tags)
        elif tag in want_path_tags:
            try:
                yield payload.decode("utf-16-be")
            except UnicodeDecodeError:
                pass
        offset = end


def read_paths_from_db(serato_dir):
    """Chemins (pfil) de database V2. Renvoie liste de (chemin, 'database V2')."""
    db = serato_dir / "database V2"
    out = []
    if db.is_file():
        data = db.read_bytes()
        for p in parse_tlv(data):
            out.append((p, "database V2"))
    return out


def read_paths_from_crates(serato_dir):
    """Chemins (ptrk) de chaque .crate. Renvoie liste de (chemin, nom_crate)."""
    out = []
    subcrates = serato_dir / "Subcrates"
    if not subcrates.is_dir():
        return out
    # os.listdir plutôt que glob : robuste aux accents / NFD dans les noms de crate.
    for name in os.listdir(subcrates):
        if not name.endswith(".crate"):
            continue
        try:
            data = (subcrates / name).read_bytes()
        except OSError:
            continue
        crate_label = name[:-len(".crate")]
        for p in parse_tlv(data):
            out.append((p, crate_label))
    return out


def to_abs(stored_path):
    """Serato stocke les chemins du volume de boot sans slash de tête."""
    return stored_path if stored_path.startswith("/") else "/" + stored_path


def exists_any_norm(abs_path):
    """Teste l'existence en tolérant NFC/NFD (macOS stocke en NFD)."""
    for variant in (abs_path,
                    unicodedata.normalize("NFC", abs_path),
                    unicodedata.normalize("NFD", abs_path)):
        if os.path.exists(variant):
            return True
    return False


def broken_at(abs_path):
    """Remonte le chemin et renvoie le 1er composant manquant (= préfixe cassé)."""
    parts = Path(abs_path).parts
    cur = Path(parts[0])
    for part in parts[1:]:
        cur = cur / part
        if not os.path.exists(cur):
            return str(cur)
    return None  # tout existe (ne devrait pas arriver pour un cassé)


def build_basename_index(search_root):
    """basename NFC -> [chemins absolus]. Sert à proposer le nouvel emplacement."""
    index = defaultdict(list)
    if not search_root or not os.path.isdir(search_root):
        return index
    for dirpath, _dirnames, filenames in os.walk(search_root):
        for fn in filenames:
            key = unicodedata.normalize("NFC", fn)
            index[key].append(os.path.join(dirpath, fn))
    return index


def infer_mapping(old_abs, new_abs):
    """Déduit (ancien_prefixe, nouveau_prefixe) via le plus long suffixe commun."""
    a, b = Path(old_abs).parts, Path(new_abs).parts
    i = 0
    while i < len(a) and i < len(b) and a[-1 - i] == b[-1 - i]:
        i += 1
    old_p = os.path.join(*a[:len(a) - i]) if len(a) - i > 0 else ""
    new_p = os.path.join(*b[:len(b) - i]) if len(b) - i > 0 else ""
    return old_p, new_p


def main():
    ap = argparse.ArgumentParser(description="Scanner READ-ONLY de bibliothèque Serato.")
    ap.add_argument("--serato", default=os.path.expanduser("~/Music/_Serato_"),
                    help="Dossier _Serato_ (défaut: ~/Music/_Serato_)")
    ap.add_argument("--search-root", default=os.path.expanduser("~/Desktop"),
                    help="Dossier où chercher les fichiers déplacés (défaut: ~/Desktop)")
    ap.add_argument("--report", default=os.path.expanduser("~/Desktop/serato_scan_report.csv"),
                    help="Chemin du rapport CSV à écrire")
    ap.add_argument("--no-candidates", action="store_true",
                    help="Ne pas chercher les nouveaux emplacements (plus rapide)")
    args = ap.parse_args()

    serato_dir = Path(args.serato)
    if not serato_dir.is_dir():
        sys.exit(f"[ERREUR] Dossier _Serato_ introuvable : {serato_dir}")

    print(f"Lecture de   : {serato_dir}")
    entries = read_paths_from_db(serato_dir) + read_paths_from_crates(serato_dir)
    print(f"Entrées lues : {len(entries)} références de pistes (database + crates)")

    # --- Résolution : on ne garde que les cassés, en dédupliquant par chemin ---
    broken = {}  # chemin_stocké -> {"abs":..., "sources": set(), "prefix":...}
    for stored, source in entries:
        abs_p = to_abs(stored)
        if exists_any_norm(abs_p):
            continue
        rec = broken.setdefault(stored, {"abs": abs_p, "sources": set(), "prefix": None})
        rec["sources"].add(source)

    if not broken:
        print("\n✅ Aucun fichier cassé. Ta bibliothèque résout à 100 %.")
        return

    for stored, rec in broken.items():
        rec["prefix"] = broken_at(rec["abs"]) or "(inconnu)"

    # --- Index pour proposer les nouveaux emplacements ---
    index = {} if args.no_candidates else build_basename_index(args.search_root)
    if not args.no_candidates:
        print(f"Index disque : {sum(len(v) for v in index.values())} fichiers sous {args.search_root}")

    # --- Calcul candidat + mapping de préfixe par fichier ---
    mapping_votes = defaultdict(int)   # (old_prefix, new_prefix) -> nb fichiers
    prefix_stats = defaultdict(lambda: {"total": 0, "unique": 0, "ambig": 0, "none": 0})
    rows = []
    for stored, rec in broken.items():
        abs_p = rec["abs"]
        basename = unicodedata.normalize("NFC", os.path.basename(abs_p))
        cands = index.get(basename, []) if index else []
        if len(cands) == 1:
            status, new_abs = "unique", cands[0]
            old_p, new_p = infer_mapping(abs_p, new_abs)
            mapping_votes[(old_p, new_p)] += 1
            prefix_stats[rec["prefix"]]["unique"] += 1
        elif len(cands) > 1:
            status, new_abs = "ambigu", ""
            prefix_stats[rec["prefix"]]["ambig"] += 1
        else:
            status, new_abs = "introuvable", ""
            prefix_stats[rec["prefix"]]["none"] += 1
        prefix_stats[rec["prefix"]]["total"] += 1
        rows.append({
            "statut": status,
            "prefixe_casse": rec["prefix"],
            "chemin_serato": abs_p,
            "nouvel_emplacement_propose": new_abs,
            "nb_candidats": len(cands),
            "sources": "; ".join(sorted(rec["sources"])),
        })

    # --- Résumé console ---
    print(f"\n⚠️  {len(broken)} fichiers cassés (uniques).\n")
    print("--- Par préfixe cassé ---")
    for prefix, s in sorted(prefix_stats.items(), key=lambda kv: -kv[1]["total"]):
        print(f"  {s['total']:>5}  {prefix}")
        if not args.no_candidates:
            print(f"          → {s['unique']} matchés uniques, "
                  f"{s['ambig']} ambigus, {s['none']} introuvables")

    if mapping_votes:
        print("\n--- Renommages déduits (ancien → nouveau) ---")
        for (old_p, new_p), count in sorted(mapping_votes.items(), key=lambda kv: -kv[1]):
            print(f"  {count:>5}  {old_p}")
            print(f"         →  {new_p}")

    # --- Rapport CSV ---
    with open(args.report, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(sorted(rows, key=lambda r: (r["prefixe_casse"], r["statut"])))
    print(f"\n📄 Rapport détaillé écrit : {args.report}")
    print("   (rien n'a été modifié dans _Serato_)")


if __name__ == "__main__":
    main()
