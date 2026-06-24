#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LostTrackr desktop app entrypoint.

The app renders losttrackr_ui.html in a native pywebview window and exposes
scan/apply/restore to JavaScript through window.pywebview.api.
"""

import os
import shutil
import subprocess
import sys
import unicodedata
import csv
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import serato_relocate as serato
import losttrackr_platform as platform


APP_NAME = "LostTrackr"

SKIP_DIR_NAMES = {
    "$RECYCLE.BIN",
    ".DocumentRevisions-V100",
    ".Spotlight-V100",
    ".TemporaryItems",
    ".Trash",
    ".Trashes",
    ".cache",
    ".git",
    ".venv",
    "__pycache__",
    "Applications",
    "AppData",
    "Library",
    "Program Files",
    "Program Files (x86)",
    "ProgramData",
    "System",
    "System Volume Information",
    "Volumes",
    "Windows",
    "node_modules",
}
SKIP_DIR_PREFIXES = (".venv", "venv", "env")


def resource_path(name):
    base = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
    return base / name


def unique_dir(path):
    candidate = Path(path)
    if not candidate.exists():
        return candidate
    i = 2
    while True:
        next_candidate = candidate.with_name(f"{candidate.name}_{i}")
        if not next_candidate.exists():
            return next_candidate
        i += 1


def unique_file(path):
    candidate = Path(path)
    if not candidate.exists():
        return candidate
    i = 2
    while True:
        next_candidate = candidate.with_name(f"{candidate.stem}_{i}{candidate.suffix}")
        if not next_candidate.exists():
            return next_candidate
        i += 1


def filename_key(name):
    return unicodedata.normalize("NFC", name).casefold()


def component_key(name):
    # Case-insensitive and accent-tolerant comparison for macOS user folders.
    decomposed = unicodedata.normalize("NFKD", str(name))
    without_marks = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return unicodedata.normalize("NFC", without_marks).casefold()


def comparable_parts(path_str):
    return tuple(component_key(part) for part in Path(path_str).parts)


def common_prefix_len(a, b):
    n = 0
    for left, right in zip(a, b):
        if left != right:
            break
        n += 1
    return n


def common_suffix_len(a, b):
    n = 0
    for left, right in zip(reversed(a), reversed(b)):
        if left != right:
            break
        n += 1
    return n


def keep_walk_dir(name):
    if name in SKIP_DIR_NAMES:
        return False
    return platform.keep_walk_dir(name)


def walk_dirs(root):
    root = Path(root).expanduser()
    if not root.is_dir():
        return
    for dirpath, dirnames, _filenames in os.walk(root):
        dirnames[:] = [name for name in dirnames if keep_walk_dir(name)]
        yield Path(dirpath)


def list_targets(serato_dir):
    targets = []
    db = serato_dir / "database V2"
    if db.is_file():
        targets.append(db)
    subcrates = serato_dir / "Subcrates"
    if subcrates.is_dir():
        targets.extend(subcrates / name for name in sorted(os.listdir(subcrates)) if name.endswith(".crate"))
    return targets


def iter_tree_paths(nodes):
    for tag, value in nodes:
        if isinstance(value, list):
            yield from iter_tree_paths(value)
        elif tag in serato.PATH_TAGS:
            try:
                yield value.decode("utf-16-be")
            except UnicodeDecodeError:
                continue


def decode_path_value(value):
    try:
        return value.decode("utf-16-be")
    except UnicodeDecodeError:
        return None


def cleanup_tree_missing_references(nodes, cleanup_paths):
    removed_refs = 0
    removed_tracks = set()

    def subtree_paths(child_nodes):
        return [path for path in iter_tree_paths(child_nodes)]

    def mark_removed(paths, count=None):
        nonlocal removed_refs
        removed_refs += len(paths) if count is None else count
        removed_tracks.update(path for path in paths if path in cleanup_paths)

    def walk(child_nodes):
        filtered = []
        for tag, value in child_nodes:
            if isinstance(value, list):
                paths = subtree_paths(value)
                removable = [path for path in paths if path in cleanup_paths]
                if removable and (tag == b"otrk" or set(paths).issubset(cleanup_paths)):
                    mark_removed(removable)
                    continue
                new_children = walk(value)
                filtered.append((tag, new_children))
                continue

            if tag in serato.PATH_TAGS:
                stored = decode_path_value(value)
                if stored in cleanup_paths:
                    mark_removed([stored], 1)
                    continue
            filtered.append((tag, value))
        return filtered

    return walk(nodes), {"referencesRemoved": removed_refs, "removedPaths": removed_tracks}


def volume_root_for(serato_dir):
    return platform.library_volume_root(serato_dir)


def stored_candidates(stored, serato_dir):
    return platform.stored_candidates(stored, serato_dir)


def stored_exists(stored, serato_dir):
    return any(serato.exists_any_norm(path) for path in stored_candidates(stored, serato_dir))


def old_display_path(stored, serato_dir):
    return platform.display_path(stored, serato_dir)


def new_stored_path(old_stored, real_path, serato_dir):
    return platform.new_stored_path(old_stored, real_path, serato_dir)


def build_index(search_roots):
    index = defaultdict(list)
    for root in search_roots:
        root = Path(root).expanduser()
        if not root.is_dir():
            continue
        for dirpath, dirnames, files in os.walk(root):
            dirnames[:] = [name for name in dirnames if keep_walk_dir(name)]
            for filename in files:
                index[filename_key(filename)].append(os.path.join(dirpath, filename))
    return index


def spotlight_candidates(filename, limit=200):
    """Use macOS Spotlight as a fallback for files outside walked roots."""
    if sys.platform != "darwin":
        return []
    try:
        result = subprocess.run(
            ["mdfind", "-name", filename],
            capture_output=True,
            text=True,
            timeout=8,
            check=False,
        )
    except Exception:
        return []

    wanted = filename_key(filename)
    candidates = []
    for line in result.stdout.splitlines():
        path = line.strip()
        if not path or not os.path.isfile(path):
            continue
        if filename_key(os.path.basename(path)) == wanted:
            candidates.append(path)
        if len(candidates) >= limit:
            break
    return candidates


def candidate_score(old_abs, candidate):
    old_parts = comparable_parts(old_abs)
    candidate_parts = comparable_parts(candidate)
    suffix = common_suffix_len(old_parts, candidate_parts)
    prefix = common_prefix_len(old_parts, candidate_parts)
    old_parent = old_parts[-2] if len(old_parts) >= 2 else ""
    candidate_parent = candidate_parts[-2] if len(candidate_parts) >= 2 else ""
    same_parent = int(old_parent == candidate_parent)
    depth_delta = abs(len(candidate_parts) - len(old_parts))
    extra_depth = max(0, len(candidate_parts) - len(old_parts))
    # Bigger is better. Path length/depth break ties toward the closest move.
    return (
        suffix,
        same_parent,
        prefix,
        -depth_delta,
        -extra_depth,
        -len(str(candidate)),
    )


def explain_match(old_abs, candidate, candidate_count):
    suffix = common_suffix_len(comparable_parts(old_abs), comparable_parts(candidate))
    if candidate_count == 1:
        return "nom de fichier unique"
    if suffix >= 3:
        return "meme queue de dossier"
    if suffix >= 2:
        return "meme dossier parent, chemin le plus proche"
    return "meilleur score de chemin"


def resolve_real_path(stored, index, serato_dir):
    old_abs = old_display_path(stored, serato_dir)
    basename = os.path.basename(old_abs)
    candidates = list(index.get(filename_key(basename), []))

    # Spotlight catches files in unusual locations and helps when a walked
    # directory was skipped or not yet indexed by our broad home/volume scan.
    for candidate in spotlight_candidates(basename):
        if candidate not in candidates:
            candidates.append(candidate)

    candidates = [candidate for candidate in candidates if os.path.isfile(candidate)]
    if not candidates:
        return None, {"status": "none", "candidateCount": 0}

    if len(candidates) == 1:
        return candidates[0], {
            "status": "matched",
            "candidateCount": 1,
            "confidence": "medium",
            "method": "nom de fichier unique",
        }

    scored = sorted(
        ((candidate_score(old_abs, candidate), candidate) for candidate in candidates),
        reverse=True,
    )
    best_score, best_candidate = scored[0]
    second_score = scored[1][0] if len(scored) > 1 else None

    if second_score == best_score:
        return None, {
            "status": "ambiguous",
            "candidateCount": len(candidates),
            "reason": f"{len(candidates)} candidats avec le meme score",
            "candidates": [candidate for _score, candidate in scored[:6]],
        }

    method = explain_match(old_abs, best_candidate, len(candidates))
    confidence = "high" if best_score[0] >= 2 else "medium"
    return best_candidate, {
        "status": "matched",
        "candidateCount": len(candidates),
        "confidence": confidence,
        "method": method,
        "alternatives": [candidate for _score, candidate in scored[1:6]],
    }


class LostTrackrApi:
    def __init__(self):
        self.last_scan = None
        self.last_index = None
        self.last_backups = []

    def volume_roots(self):
        return platform.library_roots()

    def discover_libraries(self):
        home = Path.home()
        candidates = [platform.default_serato_dir()]

        if not platform.is_windows():
            for root in [home, *self.volume_roots()]:
                for directory in walk_dirs(root):
                    if directory.name == "_Serato_":
                        candidates.append(directory)

        for volume in self.volume_roots():
            candidates.append(volume / "_Serato_")

        libraries = []
        seen = set()
        for serato_dir in candidates:
            serato_dir = serato_dir.expanduser()
            key = str(serato_dir.resolve()) if serato_dir.exists() else str(serato_dir)
            if key in seen or not serato_dir.is_dir():
                continue
            if not list_targets(serato_dir):
                continue
            seen.add(key)
            parent = serato_dir.parent
            label = platform.library_label(serato_dir)
            libraries.append({"name": label, "seratoDir": str(serato_dir), "root": str(parent)})
        return libraries

    def search_roots(self, libraries):
        return platform.default_search_roots(libraries)

    def scan_library(self, library, index):
        serato_dir = Path(library["seratoDir"])
        broken = {}
        skipped = []
        total_paths = 0

        for target in list_targets(serato_dir):
            try:
                tree = serato.parse_tree(target.read_bytes())
            except Exception as exc:
                skipped.append({"file": target.name, "reason": str(exc)})
                continue
            for stored in iter_tree_paths(tree):
                total_paths += 1
                if stored_exists(stored, serato_dir):
                    continue
                record = broken.setdefault(stored, {"stored": stored, "sources": set()})
                record["sources"].add(target.name)

        matches = []
        missing = []
        for stored, record in broken.items():
            real, info = resolve_real_path(stored, index, serato_dir)
            old_path = old_display_path(stored, serato_dir)
            item = {
                "library": library["name"],
                "file": os.path.basename(old_path) or stored,
                "old": old_path,
                "stored": stored,
                "sources": sorted(record["sources"]),
                "candidateCount": info.get("candidateCount", 0),
            }
            if real:
                item["new"] = str(real)
                item["confidence"] = info.get("confidence", "medium")
                item["method"] = info.get("method", "match")
                item["alternatives"] = info.get("alternatives", [])
                matches.append(item)
            else:
                item["reason"] = info.get("reason") or "aucun candidat fiable sur les disques scannes"
                item["candidates"] = info.get("candidates", [])
                missing.append(item)

        return {
            "name": library["name"],
            "root": library["root"],
            "seratoDir": library["seratoDir"],
            "found": len(matches),
            "missing": len(missing),
            "pathsRead": total_paths,
            "skipped": skipped,
            "matches": matches,
            "missingItems": missing,
        }

    def scan(self):
        if serato.serato_running():
            raise RuntimeError("Serato DJ Pro semble ouvert. Ferme-le completement avant de scanner.")

        libraries = self.discover_libraries()
        if not libraries:
            raise RuntimeError("Aucune bibliotheque _Serato_ detectee sur l'ordinateur ou les disques connectes.")

        roots = self.search_roots(libraries)
        index = build_index(roots)
        scanned = [self.scan_library(library, index) for library in libraries]
        matches = [item for library in scanned for item in library["matches"]]
        missing = [item for library in scanned for item in library["missingItems"]]
        payload = {
            "libraries": [
                {
                    "name": library["name"],
                    "root": library["root"],
                    "found": library["found"],
                    "missing": library["missing"],
                    "pathsRead": library["pathsRead"],
                    "skipped": library["skipped"],
                }
                for library in scanned
            ],
            "totals": {"found": len(matches), "missing": len(missing)},
            "matches": matches,
            "missing": missing,
            "searchRoots": roots,
        }
        self.last_scan = payload
        self.last_index = index
        return payload

    def process_target(self, target, serato_dir, index):
        raw = target.read_bytes()
        tree = serato.parse_tree(raw)
        if serato.serialize(tree) != raw:
            raise RuntimeError(f"{target.name}: re-serialisation differente, fichier ignore")

        changes = []

        def walk(nodes):
            for i, (tag, value) in enumerate(nodes):
                if isinstance(value, list):
                    walk(value)
                elif tag in serato.PATH_TAGS:
                    stored = value.decode("utf-16-be")
                    if stored_exists(stored, serato_dir):
                        continue
                    real, info = resolve_real_path(stored, index, serato_dir)
                    if not real or info.get("status") != "matched":
                        continue
                    replacement = new_stored_path(stored, real, serato_dir)
                    nodes[i] = (tag, replacement.encode("utf-16-be"))
                    changes.append((stored, replacement))

        walk(tree)
        return changes, serato.serialize(tree) if changes else None

    def apply_library(self, library, index):
        serato_dir = Path(library["seratoDir"])
        pending = []
        unique_fixed = set()
        for target in list_targets(serato_dir):
            try:
                changes, new_bytes = self.process_target(target, serato_dir, index)
            except Exception:
                continue
            if changes and new_bytes:
                pending.append((target, new_bytes, changes))
                unique_fixed.update(old for old, _new in changes)

        if not pending:
            return {"fixed": 0, "backupPath": None}

        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = unique_dir(serato_dir.parent / f"_Serato_BACKUP_{stamp}")
        shutil.copytree(serato_dir, backup)
        self.last_backups.append({"seratoDir": str(serato_dir), "backup": str(backup)})

        for target, new_bytes, _changes in pending:
            target.write_bytes(new_bytes)
        return {"fixed": len(unique_fixed), "backupPath": str(backup)}

    def apply(self):
        if serato.serato_running():
            raise RuntimeError("Serato DJ Pro semble ouvert. Ferme-le completement avant de reparer.")
        if not self.last_scan or self.last_index is None:
            self.scan()

        self.last_backups = []
        fixed = 0
        backups = []
        for library in self.discover_libraries():
            result = self.apply_library(library, self.last_index)
            fixed += result["fixed"]
            if result["backupPath"]:
                backups.append(result["backupPath"])

        scan_after = self.scan()
        return {
            "fixed": fixed,
            "missing": scan_after["totals"]["missing"],
            "backupPath": ", ".join(backups) if backups else "aucune sauvegarde necessaire",
            "backups": backups,
        }

    def collect_cleanup_paths(self, library, index):
        serato_dir = Path(library["seratoDir"])
        cleanup_paths = set()
        kept_ambiguous = set()
        skipped = []

        for target in list_targets(serato_dir):
            try:
                tree = serato.parse_tree(target.read_bytes())
            except Exception as exc:
                skipped.append({"file": target.name, "reason": str(exc)})
                continue
            for stored in iter_tree_paths(tree):
                if stored_exists(stored, serato_dir):
                    continue
                real, info = resolve_real_path(stored, index, serato_dir)
                if real:
                    continue
                if info.get("candidateCount", 0) > 0 or info.get("status") == "ambiguous":
                    kept_ambiguous.add(stored)
                    continue
                cleanup_paths.add(stored)

        return cleanup_paths, kept_ambiguous, skipped

    def cleanup_target(self, target, cleanup_paths):
        raw = target.read_bytes()
        tree = serato.parse_tree(raw)
        if serato.serialize(tree) != raw:
            raise RuntimeError(f"{target.name}: re-serialisation differente, fichier ignore")

        cleaned_tree, stats = cleanup_tree_missing_references(tree, cleanup_paths)
        if not stats["referencesRemoved"]:
            return stats, None
        return stats, serato.serialize(cleaned_tree)

    def write_cleanup_report(self, serato_dir, removed_paths, kept_ambiguous):
        if not removed_paths and not kept_ambiguous:
            return None

        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report = unique_file(serato_dir.parent / f"LostTrackr_MISSING_CLEANUP_{stamp}.csv")
        with report.open("w", newline="", encoding="utf-8") as fh:
            writer = csv.writer(fh)
            writer.writerow(["status", "stored_path", "display_path"])
            for stored in sorted(removed_paths):
                writer.writerow(["removed_from_serato", stored, old_display_path(stored, serato_dir)])
            for stored in sorted(kept_ambiguous):
                writer.writerow(["kept_ambiguous_candidate", stored, old_display_path(stored, serato_dir)])
        return str(report)

    def cleanup_library_missing(self, library, index):
        serato_dir = Path(library["seratoDir"])
        cleanup_paths, kept_ambiguous, skipped = self.collect_cleanup_paths(library, index)
        if not cleanup_paths:
            return {
                "removed": 0,
                "referencesRemoved": 0,
                "backupPath": None,
                "reportPath": self.write_cleanup_report(serato_dir, set(), kept_ambiguous),
                "keptForReview": len(kept_ambiguous),
                "skipped": skipped,
            }

        pending = []
        removed_paths = set()
        references_removed = 0
        for target in list_targets(serato_dir):
            try:
                stats, new_bytes = self.cleanup_target(target, cleanup_paths)
            except Exception as exc:
                skipped.append({"file": target.name, "reason": str(exc)})
                continue
            if new_bytes:
                pending.append((target, new_bytes))
                removed_paths.update(stats["removedPaths"])
                references_removed += stats["referencesRemoved"]

        if not pending:
            return {
                "removed": 0,
                "referencesRemoved": 0,
                "backupPath": None,
                "reportPath": self.write_cleanup_report(serato_dir, set(), kept_ambiguous),
                "keptForReview": len(kept_ambiguous),
                "skipped": skipped,
            }

        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = unique_dir(serato_dir.parent / f"_Serato_BACKUP_{stamp}")
        shutil.copytree(serato_dir, backup)
        self.last_backups.append({"seratoDir": str(serato_dir), "backup": str(backup)})

        for target, new_bytes in pending:
            target.write_bytes(new_bytes)

        return {
            "removed": len(removed_paths),
            "referencesRemoved": references_removed,
            "backupPath": str(backup),
            "reportPath": self.write_cleanup_report(serato_dir, removed_paths, kept_ambiguous),
            "keptForReview": len(kept_ambiguous),
            "skipped": skipped,
        }

    def clean_missing(self):
        if serato.serato_running():
            raise RuntimeError("Serato DJ Pro semble ouvert. Ferme-le completement avant de nettoyer.")
        if not self.last_scan or self.last_index is None:
            self.scan()

        self.last_backups = []
        removed = 0
        references_removed = 0
        kept_for_review = 0
        backups = []
        reports = []
        skipped = []
        for library in self.discover_libraries():
            result = self.cleanup_library_missing(library, self.last_index)
            removed += result["removed"]
            references_removed += result["referencesRemoved"]
            kept_for_review += result["keptForReview"]
            skipped.extend({"library": library["name"], **item} for item in result.get("skipped", []))
            if result["backupPath"]:
                backups.append(result["backupPath"])
            if result["reportPath"]:
                reports.append(result["reportPath"])

        scan_after = self.scan()
        return {
            "removed": removed,
            "referencesRemoved": references_removed,
            "missing": scan_after["totals"]["missing"],
            "keptForReview": kept_for_review,
            "backupPath": ", ".join(backups) if backups else "aucune sauvegarde necessaire",
            "backups": backups,
            "reportPath": ", ".join(reports),
            "reports": reports,
            "skipped": skipped,
        }

    def cleanMissing(self):
        return self.clean_missing()

    def restore(self):
        if serato.serato_running():
            raise RuntimeError("Serato DJ Pro semble ouvert. Ferme-le completement avant de restaurer.")

        targets = self.last_backups or [
            {"seratoDir": library["seratoDir"], "backup": None}
            for library in self.discover_libraries()
        ]
        restores = []
        for target in targets:
            result = serato.restore_backup(Path(target["seratoDir"]), target.get("backup"))
            restores.append(result)

        if not restores:
            raise RuntimeError("Aucune sauvegarde LostTrackr a restaurer.")
        return {
            "restoredFrom": ", ".join(item["restoredFrom"] for item in restores),
            "previousMovedTo": ", ".join(filter(None, (item["previousMovedTo"] for item in restores))),
            "restores": restores,
        }


def run():
    if platform.is_windows() and not platform.webview2_runtime_installed():
        platform.show_native_message(
            APP_NAME,
            "Microsoft Edge WebView2 Runtime semble absent.\n\n"
            "LostTrackr peut ne pas s'ouvrir correctement. Installe le runtime WebView2 "
            "depuis Microsoft, puis relance LostTrackr.\n\n"
            "Microsoft Edge WebView2 Runtime appears to be missing.\n"
            "Install it from Microsoft, then restart LostTrackr.",
        )

    try:
        import webview
    except ImportError as exc:
        raise SystemExit("pywebview n'est pas installe. Installe les dependances LostTrackr puis relance.") from exc

    html_path = resource_path("losttrackr_ui.html")
    api = LostTrackrApi()
    webview.create_window(
        APP_NAME,
        str(html_path),
        js_api=api,
        width=1120,
        height=760,
        min_size=(940, 620),
        text_select=True,
    )
    webview.start(debug=False)


if __name__ == "__main__":
    run()
