#!/usr/bin/env python3
"""
serato_relocate.py — Répare les chemins cassés de la bibliothèque Serato DJ Pro.

GARANTIE DE SÛRETÉ : ce script ne réécrit JAMAIS un chemin sans avoir vérifié,
sur ton disque, que le fichier existe bien à la nouvelle adresse. Pire cas =
un morceau reste "missing" comme avant. Jamais mal pointé.

Sécurités empilées :
  - DRY-RUN par défaut (n'écrit rien). Il faut --apply pour modifier.
  - Refuse de tourner si Serato DJ est ouvert.
  - Backup horodaté de TOUT le dossier _Serato_ avant la moindre écriture.
  - Restauration automatique d'une sauvegarde précédente, sans supprimer
    la version actuelle (elle est déplacée vers _Serato_REPLACED_*).
  - Auto-contrôle d'intégrité : re-sérialise chaque fichier SANS modif et vérifie
    qu'il est octet-pour-octet identique à l'original. Sinon -> abandon du fichier.
  - Re-sérialisation TLV complète : toutes les longueurs (pfil ET conteneur otrk)
    sont recalculées. Pas de patch d'octets en place.
  - Résolution par QUEUE DE CHEMIN (nom + dossiers parents) -> lève l'ambiguïté
    des noms de fichiers en double.
  - Gestion NFC + NFD.
  - Round-trip final : re-scan, combien de chemins résolvent maintenant.

Usage :
    python3 serato_relocate.py                      # dry-run, montre ce qu'il ferait
    python3 serato_relocate.py --apply              # applique (après backup auto)
    python3 serato_relocate.py --restore            # restaure le dernier backup
    python3 serato_relocate.py --restore --backup ~/Music/_Serato_BACKUP_20260624_121500
    python3 serato_relocate.py --search-root ~/Desktop --search-root ~/Music
"""

import argparse
import os
import shutil
import sys
import unicodedata
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import losttrackr_platform as platform

PATH_TAGS = (b"pfil", b"ptrk")


# ----------------------------- TLV : parse / serialize -----------------------------
# Un noeud = (tag: bytes, value) ; value = bytes (feuille) OU list[noeud] (conteneur).
# Conteneur = tag commençant par 'o' (otrk, osrt, ovct...).

def parse_tree(data):
    nodes = []
    off, n = 0, len(data)
    while off + 8 <= n:
        tag = data[off:off + 4]
        length = int.from_bytes(data[off + 4:off + 8], "big")
        start = off + 8
        end = start + length
        if end > n:
            raise ValueError(f"TLV tronqué au tag {tag!r} (offset {off})")
        payload = data[start:end]
        if tag[:1] == b"o":
            nodes.append((tag, parse_tree(payload)))
        else:
            nodes.append((tag, payload))
        off = end
    if off != n:
        raise ValueError(f"Octets résiduels en fin de blob ({n - off})")
    return nodes


def serialize(nodes):
    out = bytearray()
    for tag, value in nodes:
        payload = serialize(value) if isinstance(value, list) else value
        out += tag + len(payload).to_bytes(4, "big") + payload
    return bytes(out)


def iter_tree_paths(nodes):
    for tag, value in nodes:
        if isinstance(value, list):
            yield from iter_tree_paths(value)
        elif tag in PATH_TAGS:
            try:
                yield value.decode("utf-16-be")
            except UnicodeDecodeError:
                continue


def cleanup_tree_missing_references(nodes, cleanup_paths):
    removed_refs = 0
    removed_paths = set()

    def subtree_paths(child_nodes):
        return [path for path in iter_tree_paths(child_nodes)]

    def walk(child_nodes):
        nonlocal removed_refs
        filtered = []
        for tag, value in child_nodes:
            if isinstance(value, list):
                paths = subtree_paths(value)
                removable = [path for path in paths if path in cleanup_paths]
                if removable and (tag == b"otrk" or set(paths).issubset(cleanup_paths)):
                    removed_refs += len(removable)
                    removed_paths.update(removable)
                    continue
                filtered.append((tag, walk(value)))
                continue

            if tag in PATH_TAGS:
                try:
                    stored = value.decode("utf-16-be")
                except UnicodeDecodeError:
                    stored = None
                if stored in cleanup_paths:
                    removed_refs += 1
                    removed_paths.add(stored)
                    continue
            filtered.append((tag, value))
        return filtered

    return walk(nodes), removed_paths, removed_refs


# ----------------------------- résolution disque -----------------------------

def to_abs(stored, serato_dir=None):
    return platform.display_path(stored, serato_dir or platform.default_serato_dir())


def exists_any_norm(abs_path):
    for v in (abs_path,
              unicodedata.normalize("NFC", abs_path),
              unicodedata.normalize("NFD", abs_path)):
        if os.path.exists(v):
            return True
    return False


def build_index(search_roots):
    """basename NFC -> liste de chemins réels. (On désambiguïse ensuite par parents.)"""
    index = defaultdict(list)
    for root in search_roots:
        root = os.path.expanduser(root)
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, files in os.walk(root):
            dirnames[:] = [name for name in dirnames if platform.keep_walk_dir(name)]
            for fn in files:
                index[unicodedata.normalize("NFC", fn)].append(os.path.join(dirpath, fn))
    return index


def _tail(path_str, k):
    """k derniers composants, NFC, en tuple — pour comparer les queues de chemin."""
    parts = Path(unicodedata.normalize("NFC", path_str)).parts
    return tuple(parts[-k:]) if len(parts) >= k else tuple(parts)


def resolve(stored, index, serato_dir=None):
    """Renvoie le chemin réel sur disque (vérifié) ou None. Jamais de devinette."""
    abs_p = to_abs(stored, serato_dir)
    base = unicodedata.normalize("NFC", os.path.basename(abs_p))
    cands = index.get(base, [])
    if not cands:
        return None
    if len(cands) == 1:
        return cands[0] if os.path.exists(cands[0]) else None
    # Plusieurs fichiers de même nom : on désambiguïse par dossiers parents.
    for k in (4, 3, 2):
        want = _tail(abs_p, k)
        narrowed = [c for c in cands if _tail(c, k) == want]
        if len(narrowed) == 1:
            return narrowed[0] if os.path.exists(narrowed[0]) else None
        if narrowed:
            cands = narrowed
    return None  # toujours ambigu -> on ne touche pas


# ----------------------------- traitement d'un fichier -----------------------------

def process_file(path, index, serato_dir=None):
    """Renvoie (n_total_paths, changes:list[(old,new)], new_bytes|None, status)."""
    raw = path.read_bytes()
    try:
        tree = parse_tree(raw)
    except ValueError as e:
        return (0, [], None, f"PARSE KO ({e})")
    # Auto-contrôle d'intégrité : round-trip identitaire obligatoire.
    if serialize(tree) != raw:
        return (0, [], None, "INTÉGRITÉ KO (re-sérialisation != original) -> ignoré")

    changes = []
    total = [0]

    def walk(nodes):
        for i, (tag, value) in enumerate(nodes):
            if isinstance(value, list):
                walk(value)
            elif tag in PATH_TAGS:
                total[0] += 1
                stored = value.decode("utf-16-be")
                if exists_any_norm(to_abs(stored, serato_dir)):
                    continue
                real = resolve(stored, index, serato_dir)
                if real and os.path.exists(real):
                    new_stored = platform.new_stored_path(stored, real, serato_dir or platform.default_serato_dir())
                    nodes[i] = (tag, new_stored.encode("utf-16-be"))
                    changes.append((stored, new_stored))

    walk(tree)
    new_bytes = serialize(tree) if changes else None
    return (total[0], changes, new_bytes, "OK")


def candidate_count(stored, index, serato_dir=None):
    abs_p = to_abs(stored, serato_dir)
    base = unicodedata.normalize("NFC", os.path.basename(abs_p))
    return sum(1 for candidate in index.get(base, []) if os.path.exists(candidate))


def cleanup_file(path, cleanup_paths):
    raw = path.read_bytes()
    try:
        tree = parse_tree(raw)
    except ValueError as e:
        return (set(), 0, None, f"PARSE KO ({e})")
    if serialize(tree) != raw:
        return (set(), 0, None, "INTÉGRITÉ KO (re-sérialisation != original) -> ignoré")

    cleaned_tree, removed_paths, removed_refs = cleanup_tree_missing_references(tree, cleanup_paths)
    new_bytes = serialize(cleaned_tree) if removed_refs else None
    return (removed_paths, removed_refs, new_bytes, "OK")


def serato_running():
    return platform.serato_running()


def latest_backup(serato_dir, explicit_backup=None):
    """Renvoie la sauvegarde à restaurer : explicite ou dernier _Serato_BACKUP_*."""
    if explicit_backup:
        backup = Path(os.path.expanduser(explicit_backup))
        if not backup.is_dir():
            sys.exit(f"[ERREUR] Sauvegarde introuvable : {backup}")
        return backup

    parent = serato_dir.parent
    backups = sorted(
        (p for p in parent.glob("_Serato_BACKUP_*") if p.is_dir()),
        key=lambda p: (p.stat().st_mtime, p.name),
        reverse=True,
    )
    if not backups:
        sys.exit(f"[ERREUR] Aucune sauvegarde _Serato_BACKUP_* trouvée dans {parent}")
    return backups[0]


def unique_replaced_path(serato_dir):
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base = serato_dir.parent / f"_Serato_REPLACED_{stamp}"
    candidate = base
    i = 2
    while candidate.exists():
        candidate = serato_dir.parent / f"{base.name}_{i}"
        i += 1
    return candidate


def restore_backup(serato_dir, explicit_backup=None):
    """Restaure une sauvegarde en conservant la version courante de côté."""
    backup = latest_backup(serato_dir, explicit_backup)
    replaced = None
    if serato_dir.exists():
        replaced = unique_replaced_path(serato_dir)
        shutil.move(str(serato_dir), str(replaced))

    try:
        shutil.copytree(backup, serato_dir)
    except Exception:
        if replaced and replaced.exists() and not serato_dir.exists():
            shutil.move(str(replaced), str(serato_dir))
        raise

    print(f"Sauvegarde restaurée : {backup}")
    if replaced:
        print(f"Version précédente déplacée vers : {replaced}")
    return {"restoredFrom": str(backup), "previousMovedTo": str(replaced) if replaced else None}


def main():
    ap = argparse.ArgumentParser(description="Répare les chemins cassés Serato (sûr).")
    ap.add_argument("--serato", default=str(platform.default_serato_dir()))
    ap.add_argument("--search-root", action="append", default=None,
                    help="Dossier(s) où chercher les fichiers (répétable). Défaut: ~/Desktop")
    ap.add_argument("--apply", action="store_true", help="Écrit réellement (sinon dry-run)")
    ap.add_argument("--remove-missing", action="store_true",
                    help="Retire des fichiers Serato les références introuvables sans candidat fiable")
    ap.add_argument("--restore", action="store_true",
                    help="Restaure une sauvegarde _Serato_BACKUP_* puis met la version actuelle de côté")
    ap.add_argument("--backup", default=None,
                    help="Sauvegarde précise à restaurer avec --restore (sinon dernière sauvegarde)")
    args = ap.parse_args()

    serato_dir = Path(args.serato)
    if args.restore:
        if serato_running():
            sys.exit("[STOP] Serato DJ semble ouvert. Ferme-le complètement puis relance.")
        restore_backup(serato_dir, args.backup)
        return

    if not serato_dir.is_dir():
        sys.exit(f"[ERREUR] _Serato_ introuvable : {serato_dir}")
    roots = args.search_root or [os.path.expanduser("~/Desktop")]

    if args.apply and serato_running():
        sys.exit("[STOP] Serato DJ semble ouvert. Ferme-le complètement puis relance.")

    print(f"_Serato_      : {serato_dir}")
    print(f"Recherche dans: {roots}")
    print("Indexation du disque…")
    index = build_index(roots)
    print(f"  {sum(len(v) for v in index.values())} fichiers indexés\n")

    targets = []
    db = serato_dir / "database V2"
    if db.is_file():
        targets.append(db)
    subc = serato_dir / "Subcrates"
    if subc.is_dir():
        targets += [subc / n for n in sorted(os.listdir(subc)) if n.endswith(".crate")]

    if args.remove_missing:
        if args.apply and serato_running():
            sys.exit("[STOP] Serato DJ semble ouvert. Ferme-le complètement puis relance.")

        cleanup_paths = set()
        kept_ambiguous = set()
        skipped = []
        for t in targets:
            try:
                tree = parse_tree(t.read_bytes())
            except ValueError as e:
                skipped.append((t.name, f"PARSE KO ({e})"))
                continue
            if serialize(tree) != t.read_bytes():
                skipped.append((t.name, "INTÉGRITÉ KO (re-sérialisation != original) -> ignoré"))
                continue
            for stored in iter_tree_paths(tree):
                if exists_any_norm(to_abs(stored, serato_dir)):
                    continue
                if resolve(stored, index, serato_dir):
                    continue
                if candidate_count(stored, index, serato_dir):
                    kept_ambiguous.add(stored)
                    continue
                cleanup_paths.add(stored)

        pending = []
        removed_total = set()
        refs_total = 0
        for t in targets:
            removed_paths, removed_refs, new_bytes, status = cleanup_file(t, cleanup_paths)
            if status != "OK":
                skipped.append((t.name, status))
                continue
            if new_bytes:
                pending.append((t, new_bytes, removed_refs))
                removed_total.update(removed_paths)
                refs_total += removed_refs

        print(f"Références introuvables supprimables : {len(removed_total)}")
        print(f"Entrées Serato à retirer             : {refs_total}")
        print(f"Conservées car ambiguës              : {len(kept_ambiguous)}")
        if skipped:
            print(f"Fichiers ignorés                     : {len(skipped)}")
            for name, why in skipped[:10]:
                print(f"   - {name} : {why}")

        if not args.apply:
            print("\n[DRY-RUN] Rien n'a été écrit.")
            for stored in sorted(removed_total)[:8]:
                print(f"   retirer de Serato seulement : {stored}")
            print("\nPour nettoyer (Serato fermé) :  python3 serato_relocate.py --remove-missing --apply")
            return

        if not pending:
            print("Aucune écriture nécessaire.")
            return

        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = serato_dir.parent / f"_Serato_BACKUP_{stamp}"
        print(f"Backup complet -> {backup}")
        shutil.copytree(serato_dir, backup)
        print("  backup OK\n")

        for t, new_bytes, n in pending:
            t.write_bytes(new_bytes)
            print(f"   nettoyé ({n}) : {t.name}")
        print("\nNettoyage terminé. Aucun fichier audio n'a été supprimé.")
        return

    # --- Backup AVANT toute écriture ---
    if args.apply:
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = serato_dir.parent / f"_Serato_BACKUP_{stamp}"
        print(f"Backup complet -> {backup}")
        shutil.copytree(serato_dir, backup)
        print("  backup OK\n")

    total_fixed, total_paths, skipped = 0, 0, []
    pending = []  # (path, new_bytes, n_changes)
    for t in targets:
        n_paths, changes, new_bytes, status = process_file(t, index, serato_dir)
        total_paths += n_paths
        if status != "OK":
            skipped.append((t.name, status))
            continue
        if changes:
            total_fixed += len(changes)
            pending.append((t, new_bytes, len(changes)))

    print(f"Chemins examinés      : {total_paths}")
    print(f"Chemins réparables    : {total_fixed}")
    if skipped:
        print(f"Fichiers ignorés      : {len(skipped)}")
        for name, why in skipped[:10]:
            print(f"   - {name} : {why}")

    if not args.apply:
        print("\n[DRY-RUN] Rien n'a été écrit. Exemples de réparations prévues :")
        shown = 0
        for t, _nb, _n in pending:
            n_paths, changes, _x, _s = process_file(t, index, serato_dir)
            for old, new in changes:
                print(f"   {os.path.basename(old)}")
                print(f"      ancien: {old}")
                print(f"      nouveau: {new}")
                shown += 1
                if shown >= 8:
                    break
            if shown >= 8:
                break
        print("\nPour appliquer (Serato fermé) :  python3 serato_relocate.py --apply")
        return

    # --- Écriture (backup déjà fait) ---
    for t, new_bytes, n in pending:
        t.write_bytes(new_bytes)
        print(f"   écrit ({n}) : {t.name}")

    # --- Round-trip de validation ---
    print("\nVérification post-écriture…")
    still_broken = 0
    for t in targets:
        try:
            tree = parse_tree(t.read_bytes())
        except ValueError:
            continue

        def check(nodes):
            nonlocal still_broken
            for tag, value in nodes:
                if isinstance(value, list):
                    check(value)
                elif tag in PATH_TAGS:
                    if not exists_any_norm(to_abs(value.decode("utf-16-be"), serato_dir)):
                        still_broken += 1
        check(tree)
    print(f"Chemins encore cassés après réparation : {still_broken}")
    print("(les restants = fichiers réellement absents du disque, à traiter à la main)")


if __name__ == "__main__":
    main()
