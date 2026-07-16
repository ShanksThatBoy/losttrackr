#!/usr/bin/env python3
"""
LostTrackr desktop app entrypoint.

The app renders losttrackr_ui.html in a native pywebview window and exposes
scan/apply/restore to JavaScript through window.pywebview.api.
"""

import csv
import json
import os
import shutil
import subprocess
import sys
import unicodedata
import webbrowser
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import dj_set
import dj_software
import knowledge_client
import losttrackr_platform as platform

# lt-intelligence helpers for audio tagging and fingerprinting
def get_fpcalc_path() -> str:
    import sys
    from pathlib import Path
    
    if hasattr(sys, "_MEIPASS"):
        base_path = Path(sys._MEIPASS)
    else:
        base_path = Path(__file__).resolve().parent

    binary_name = "fpcalc.exe" if platform.is_windows() else "fpcalc"
    bundled_path = base_path / "bin" / binary_name
    if bundled_path.exists():
        return str(bundled_path)
    
    local_path = Path(__file__).resolve().parent / "bin" / binary_name
    if local_path.exists():
        return str(local_path)
        
    return binary_name

def compute_audio_fingerprint(file_path: Path) -> dict | None:
    import subprocess
    import json
    
    fpcalc_path = get_fpcalc_path()
    try:
        res = subprocess.run(
            [fpcalc_path, "-json", "-length", "120", str(file_path)],
            capture_output=True,
            text=True,
            check=True,
            timeout=10
        )
        data = json.loads(res.stdout)
        return {
            "fingerprint": data.get("fingerprint"),
            "duration": int(data.get("duration") or 0)
        }
    except Exception:
        return None

SAMPLE_MAX_BYTES = 900_000
SAMPLE_MIN_BYTES = 64_000
SAMPLE_MAX_PER_SCAN = 8

def extract_audio_excerpt(file_path: Path, max_bytes: int = SAMPLE_MAX_BYTES) -> bytes | None:
    """Tranche brute (~900 Ko) du fichier EXACT pour /intelligence/sample.

    mp3 uniquement : les frames MPEG s'auto-synchronisent, donc une tranche
    prise en plein milieu du fichier reste décodable côté worker sans
    ré-encodage (aucun ffmpeg embarqué dans l'app). L'en-tête ID3v2 est sauté
    pour ne pas gaspiller le budget en octets non audio.
    """
    try:
        if file_path.suffix.lower() != ".mp3":
            return None
        size = file_path.stat().st_size
        with open(file_path, "rb") as fh:
            header = fh.read(10)
            audio_start = 0
            if header[:3] == b"ID3" and len(header) == 10:
                syncsafe = header[6:10]
                if all(b < 0x80 for b in syncsafe):
                    audio_start = 10 + ((syncsafe[0] << 21) | (syncsafe[1] << 14)
                                        | (syncsafe[2] << 7) | syncsafe[3])
            audio_size = size - audio_start
            if audio_size < SAMPLE_MIN_BYTES:
                return None
            if audio_size <= max_bytes:
                fh.seek(audio_start)
                return fh.read(max_bytes)
            # Tranche au premier tiers de l'audio : passé l'intro, avant l'outro.
            fh.seek(audio_start + (audio_size - max_bytes) // 3)
            return fh.read(max_bytes)
    except OSError:
        return None

def collect_sample_candidates(tracks, results_by_idx, limit=SAMPLE_MAX_PER_SCAN):
    """Choisit les titres dont un extrait audio mérite l'analyse serveur.

    Priorité : version suspecte (version_mismatch / needs_review) > features
    manquantes (bpm ou clé) > identité seulement probable. mp3 uniquement.
    """
    scored = []
    for i, t in enumerate(tracks):
        r = results_by_idx.get(i) or {}
        ref = r.get("recording_ref")
        if not ref or not str(t.get("path") or "").lower().endswith(".mp3"):
            continue
        canonical = r.get("canonical") or {}
        suspect = bool(canonical.get("version_mismatch") or canonical.get("needs_review"))
        missing = t.get("bpm") is None or t.get("camelot_key") is None
        probable = r.get("status") == "probable"
        if not (suspect or missing or probable):
            continue
        rank = 0 if suspect else (1 if missing else 2)
        duration_ms = t.get("duration_ms")
        scored.append((rank, i, {
            "ref": ref,
            "path": t.get("path"),
            "duration_s": int(duration_ms / 1000) if duration_ms else None,
        }))
    scored.sort(key=lambda x: (x[0], x[1]))
    return [c for _, _, c in scored[:limit]]

def upload_samples_background(candidates):
    """Envoie les extraits en tâche de fond (fire-and-forget).

    Le serveur ne fait que mettre en file (Redis TTL 15 min) : les résultats
    AudD/DSP arrivent au prochain scan via le cache d'empreintes.
    """
    import threading
    import knowledge_client

    def run():
        for c in candidates:
            data = extract_audio_excerpt(Path(c["path"]))
            if not data:
                continue
            try:
                knowledge_client.upload_sample(c["ref"], data, c.get("duration_s"))
            except Exception as exc:
                print(f"upload_sample: {c['path']}: {exc}")

    threading.Thread(target=run, daemon=True, name="lt-sample-upload").start()

def read_audio_tags(file_path: Path) -> dict:
    from mutagen import File as MutagenFile
    
    tags = {
        "artist": "",
        "title": "",
        "album": "",
        "year": None,
        "genre": ""
    }
    
    try:
        audio = MutagenFile(file_path, easy=True)
        if audio is not None and audio.tags:
            tags["artist"] = audio.tags.get("artist", [""])[0]
            tags["title"] = audio.tags.get("title", [""])[0]
            tags["album"] = audio.tags.get("album", [""])[0]
            tags["genre"] = audio.tags.get("genre", [""])[0]
            
            date_val = audio.tags.get("date", [""])[0] or audio.tags.get("year", [""])[0]
            if date_val:
                import re
                match = re.search(r"\b(19\d\d|20\d\d)\b", date_val)
                if match:
                    tags["year"] = int(match.group(1))
    except Exception:
        pass
        
    return tags

def write_audio_tags(file_path: Path, tags: dict):
    ext = file_path.suffix.casefold()
    if ext == ".mp3":
        from mutagen.id3 import ID3, TPE1, TIT2, TALB, TDRC, TCON, TBPM, TKEY
        try:
            try:
                audio = ID3(str(file_path))
            except Exception:
                audio = ID3()
            
            if tags.get("artist"):
                audio.add(TPE1(encoding=3, text=[tags["artist"]]))
            if tags.get("title"):
                audio.add(TIT2(encoding=3, text=[tags["title"]]))
            if tags.get("album"):
                audio.add(TALB(encoding=3, text=[tags["album"]]))
            if tags.get("year"):
                audio.add(TDRC(encoding=3, text=[str(tags["year"])]))
            if tags.get("genre"):
                audio.add(TCON(encoding=3, text=[tags["genre"]]))
            if tags.get("bpm"):
                audio.add(TBPM(encoding=3, text=[str(tags["bpm"])]))
            if tags.get("camelot_key"):
                audio.add(TKEY(encoding=3, text=[tags["camelot_key"]]))
            
            audio.save(str(file_path))
        except Exception as e:
            print(f"Error writing MP3 tags: {e}")
            raise
            
    elif ext == ".flac":
        from mutagen.flac import FLAC
        try:
            audio = FLAC(str(file_path))
            if tags.get("artist"):
                audio["artist"] = tags["artist"]
            if tags.get("title"):
                audio["title"] = tags["title"]
            if tags.get("album"):
                audio["album"] = tags["album"]
            if tags.get("year"):
                audio["date"] = str(tags["year"])
            if tags.get("genre"):
                audio["genre"] = tags["genre"]
            if tags.get("bpm"):
                audio["bpm"] = str(tags["bpm"])
            if tags.get("camelot_key"):
                audio["key"] = tags["camelot_key"]
            audio.save()
        except Exception as e:
            print(f"Error writing FLAC tags: {e}")
            raise
            
    elif ext in (".m4a", ".mp4"):
        from mutagen.mp4 import MP4
        try:
            audio = MP4(str(file_path))
            if tags.get("artist"):
                audio["\xa9ART"] = [tags["artist"]]
            if tags.get("title"):
                audio["\xa9nam"] = [tags["title"]]
            if tags.get("album"):
                audio["\xa9alb"] = [tags["album"]]
            if tags.get("year"):
                audio["\xa9day"] = [str(tags["year"])]
            if tags.get("genre"):
                audio["\xa9gen"] = [tags["genre"]]
            if tags.get("bpm"):
                try:
                    audio["tmpo"] = [int(float(tags["bpm"]))]
                except ValueError:
                    pass
            if tags.get("camelot_key"):
                audio["----:com.apple.iTunes:initialkey"] = [tags["camelot_key"].encode("utf-8")]
            audio.save()
        except Exception as e:
            print(f"Error writing M4A tags: {e}")
            raise

import serato_relocate as serato
import smart_import
import update_manager

APP_NAME = "LostTrackr"
APP_VERSION = update_manager.APP_VERSION

RELEASE_NOTES = {
    "1.4.0": [
        "Nouveau drawer d'affinage manuel pour corriger ou relancer la recherche d'un titre.",
        "Écriture des métadonnées (BPM, clé, etc.) directement dans les fichiers physiques.",
        "Barre de progression visuelle en temps réel (Pipeline visual) avec animation Waveform.",
        "Robustesse accrue : tolérance aux pannes réseau par lots (chunking).",
    ],
    "1.3.5": [
        "Nouvelle page « Analyser les métadonnées » dans l'espace DJ Set.",
        "Détection des données manquantes : artiste, titre, BPM, clé Camelot, genre.",
        "Enrichissement via la Base de connaissances LostTrackr (repli sources externes).",
        "Résultats classés par statut : identifiés, suggestions probables, non identifiés.",
        "Refonte premium de l'interface d'analyse et corrections diverses.",
    ],
    "1.3.1": [
        "Inspiration de style DJ Set disponible pour générer de nouvelles idées de sets.",
        "Sourcing de titres automatisé basé sur Deezer (suggestions intelligentes).",
        "Comparaison avec la bibliothèque locale (morceaux présents vs absents).",
        "Export CSV des morceaux absents pour faciliter les recherches extérieures.",
        "Améliorations esthétiques et fluidité accrue dans l'espace DJ Set.",
    ],
    "1.3.0": [
        "Smart Import devient disponible dans Ranger mes titres.",
        "Aperçu obligatoire avant déplacement des nouveaux sons.",
        "Analyse des sous-dossiers existants pour proposer une destination plus propre.",
        "Préparer mon DJ Set arrive comme espace dédié aux crates et playlists.",
        "Enrichissement des métadonnées via la base de connaissance LostTrackr.",
    ],
}

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


def app_support_dir():
    if platform.is_macos():
        root = Path.home() / "Library" / "Application Support" / APP_NAME
    elif platform.is_windows():
        root = Path(os.environ.get("APPDATA", Path.home())) / APP_NAME
    else:
        root = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config")) / APP_NAME.lower()
    root.mkdir(parents=True, exist_ok=True)
    return root


def app_state_path():
    return app_support_dir() / "app_state.json"


def load_app_state():
    path = app_state_path()
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def save_app_state(state):
    path = app_state_path()
    current = load_app_state()
    current.update(state)
    current["updatedAt"] = datetime.now().isoformat(timespec="seconds")
    path.write_text(json.dumps(current, ensure_ascii=False, indent=2), encoding="utf-8")
    return current


def app_release_notes(version=APP_VERSION):
    return RELEASE_NOTES.get(version, [])


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
    seen_by_key = defaultdict(set)
    for root in search_roots:
        root = Path(root).expanduser()
        if not root.is_dir():
            continue
        for dirpath, dirnames, files in os.walk(root):
            dirnames[:] = [name for name in dirnames if keep_walk_dir(name)]
            for filename in files:
                key = filename_key(filename)
                path = os.path.join(dirpath, filename)
                real_key = os.path.realpath(os.path.normcase(path))
                if real_key in seen_by_key[key]:
                    continue
                seen_by_key[key].add(real_key)
                index[key].append(path)
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
    seen_candidates = {os.path.realpath(os.path.normcase(path)) for path in candidates}

    # Spotlight catches files in unusual locations and helps when a walked
    # directory was skipped or not yet indexed by our broad home/volume scan.
    for candidate in spotlight_candidates(basename):
        candidate_key = os.path.realpath(os.path.normcase(candidate))
        if candidate_key not in seen_candidates:
            seen_candidates.add(candidate_key)
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
        self.last_smart_import_plan = None
        self.last_smart_import_result = None
        self.selected_software_id = None
        self.window = None

    def set_window(self, window):
        self.window = window

    def setWindow(self, window):
        self.set_window(window)

    def volume_roots(self):
        return platform.library_roots()

    def detect_software(self):
        return dj_software.detect_all()

    def detectSoftware(self):
        return self.detect_software()

    def active_software_id(self, detection=None):
        detection = detection or self.detect_software()
        detected_ids = {software["id"] for software in detection.get("softwares", [])}
        if self.selected_software_id in detected_ids:
            return self.selected_software_id
        if self.selected_software_id in dj_software.PROFILES:
            return self.selected_software_id
        return detection.get("preferredSoftwareId") or "serato"

    def software_payload(self, software_id, detection=None):
        detection = detection or self.detect_software()
        for software in detection.get("softwares", []):
            if software["id"] == software_id:
                return software
        profile = dj_software.PROFILES.get(software_id, dj_software.PROFILES["serato"])
        return {**dj_software.profile_payload(profile), "sources": []}

    def select_software(self, software_id):
        if software_id not in dj_software.PROFILES:
            raise RuntimeError(f"Logiciel DJ inconnu : {software_id}")
        self.selected_software_id = software_id
        return self.preflight()

    def selectSoftware(self, software_id):
        return self.select_software(software_id)

    def discover_libraries(self):
        candidates = [platform.default_serato_dir()]

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

    def preflight(self):
        detection = self.detect_software()
        active_id = self.active_software_id(detection)
        active_software = self.software_payload(active_id, detection)
        libraries = self.discover_libraries()
        roots = self.search_roots(libraries) if libraries else platform.default_search_roots([])
        active_sources = active_software.get("sources", [])
        repair_supported = bool(active_software.get("repairSupported"))
        can_scan = active_id == "serato" and bool(libraries)
        if can_scan:
            message = None
        elif active_sources and not repair_supported:
            message = (
                f"{active_software['name']} a ete detecte. "
                "La reparation automatique de ce logiciel sera branchee dans la suite de la v1.2.0."
            )
        else:
            message = (
                f"Aucun dossier source {active_software['name']} n'a ete trouve. "
                "Ouvre ton logiciel DJ au moins une fois ou branche le disque qui contient ta bibliotheque, puis relance la detection."
            )
        return {
            "libraryFound": bool(active_sources or can_scan),
            "canScan": can_scan,
            "repairSupported": repair_supported,
            "activeSoftwareId": active_id,
            "activeSoftware": active_software,
            "softwareDetection": detection,
            "libraries": libraries,
            "searchRoots": roots,
            "defaultSeratoDir": str(platform.default_serato_dir()),
            "message": message,
        }

    def smart_music_roots(self, libraries=None, detection=None):
        libraries = libraries if libraries is not None else self.discover_libraries()
        detection = detection if detection is not None else self.detect_software()
        weighted = defaultdict(int)

        for library in libraries:
            root = Path(library["root"]).expanduser()
            if root.is_dir():
                weighted[str(root)] += 5

            serato_dir = Path(library["seratoDir"])
            paths_seen = 0
            for target in list_targets(serato_dir):
                try:
                    tree = serato.parse_tree(target.read_bytes())
                except Exception:
                    continue
                for stored in iter_tree_paths(tree):
                    paths_seen += 1
                    for candidate in stored_candidates(stored, serato_dir)[:1]:
                        parent = Path(candidate).expanduser().parent
                        if parent.is_dir():
                            weighted[str(parent)] += 2
                            if parent.parent.is_dir():
                                weighted[str(parent.parent)] += 1
                    if paths_seen >= 1200:
                        break
                if paths_seen >= 1200:
                    break

        for software in detection.get("softwares", []):
            for source in software.get("sources", []):
                root = Path(source.get("root") or source.get("path") or "").expanduser()
                if root.is_file():
                    root = root.parent
                if root.is_dir():
                    weighted[str(root)] += 3

        music_dir = Path.home() / "Music"
        if music_dir.is_dir():
            weighted[str(music_dir)] += 4

        roots = []
        seen = set()
        for path, _score in sorted(weighted.items(), key=lambda item: (-item[1], len(item[0]))):
            key = os.path.realpath(os.path.normcase(path))
            if key in seen:
                continue
            seen.add(key)
            roots.append(path)
            if len(roots) >= 8:
                break
        return roots

    def discover_serato_crates(self, libraries=None):
        crates = []
        libraries = libraries if libraries is not None else self.discover_libraries()
        for library in libraries:
            subcrates = Path(library["seratoDir"]) / "Subcrates"
            if not subcrates.is_dir():
                continue
            for crate_path in sorted(subcrates.glob("*.crate"))[:160]:
                track_count = 0
                sample_files = []
                try:
                    tree = serato.parse_tree(crate_path.read_bytes())
                    for stored in iter_tree_paths(tree):
                        track_count += 1
                        if len(sample_files) < 12:
                            sample_files.append(Path(stored).name)
                except Exception:
                    track_count = 0
                    sample_files = []
                crates.append(
                    {
                        "name": smart_import.crate_name_from_file(crate_path),
                        "path": str(crate_path),
                        "library": library["name"],
                        "trackCount": track_count,
                        "sampleFiles": sample_files,
                        "genres": sorted(smart_import.infer_genres_from_text(" ".join([crate_path.stem, *sample_files]))),
                    }
                )
        return crates

    def smart_import_preflight(self):
        detection = self.detect_software()
        libraries = self.discover_libraries()
        library_roots = self.smart_music_roots(libraries, detection)
        crates = self.discover_serato_crates(libraries)
        downloads = smart_import.default_downloads_dir()
        clean_destination = smart_import.default_clean_destination()
        return {
            "defaultSourceDir": str(downloads),
            "defaultSourceDisplay": smart_import.display_path(downloads),
            "sourceExists": downloads.is_dir(),
            "defaultDestinationDir": str(clean_destination),
            "defaultDestinationDisplay": smart_import.display_path(clean_destination),
            "libraryRoots": library_roots,
            "libraryRootDisplays": [smart_import.display_path(root) for root in library_roots],
            "softwareDetection": detection,
            "crates": crates,
            "moveOnly": True,
        }

    def smartImportPreflight(self):
        return self.smart_import_preflight()

    def smart_import_scan(self, options=None):
        options = options or {}
        source_dir = options.get("sourceDir") or smart_import.default_downloads_dir()
        destination_mode = options.get("destinationMode") or "existing"
        destination_root = options.get("destinationRoot")
        library_roots = options.get("libraryRoots")

        preflight = self.smart_import_preflight()
        plan = smart_import.build_file_plan(
            source_dir=source_dir,
            destination_mode=destination_mode,
            destination_root=destination_root,
            library_roots=library_roots or preflight["libraryRoots"],
        )
        plan["metadataOffer"] = {
            "available": bool(plan["files"]),
            "fields": ["artiste", "titre", "annee", "genre", "BPM", "cle Camelot"],
            "source": "Centre de connaissances LostTrackr",
        }
        self.last_smart_import_plan = plan
        self.last_smart_import_result = None
        return plan

    def smartImportScan(self, options=None):
        return self.smart_import_scan(options)

    def smart_import_apply(self, selected_ids=None):
        if not self.last_smart_import_plan:
            raise RuntimeError("Aucun plan Smart Import a appliquer.")
        result = smart_import.apply_move_plan(self.last_smart_import_plan, selected_ids)
        self.last_smart_import_result = result
        return result

    def smartImportApply(self, selectedIds=None):
        return self.smart_import_apply(selectedIds)

    def smart_import_metadata(self, selected_ids=None):
        if not self.last_smart_import_plan:
            return {"ok": False, "error": "Aucun plan Smart Import à enrichir."}

        wanted = {str(item) for item in (selected_ids or []) if item}
        files = [
            item for item in self.last_smart_import_plan.get("files", [])
            if not wanted or str(item.get("id")) in wanted
        ]
        if not files:
            return {
                "ok": True,
                "source": "Centre de connaissances LostTrackr",
                "records": [],
                "totals": {"complete": 0, "suggestion": 0, "incomplete": 0, "total": 0},
            }

        tracks = []
        for item in files[:200]:
            title = str(item.get("title") or Path(item.get("file", "")).stem).strip()
            if not title:
                continue
            track = {
                "client_track_id": str(item.get("id")),
                "title": title,
                "source_app": "smart_import",
            }
            artist = str(item.get("artist") or "").strip()
            genre = str(item.get("genre") or "").strip()
            if artist:
                track["artist"] = artist
            if genre and genre != "A verifier":
                track["genre"] = genre
            tracks.append(track)

        try:
            result = knowledge_client.match_tracks(tracks)
        except knowledge_client.KnowledgeError as exc:
            return {"ok": False, "error": str(exc), "retryable": exc.retryable}
        except Exception:
            return {
                "ok": False,
                "error": "LostTrackr n'arrive pas à joindre le centre de connaissances.",
                "retryable": True,
            }

        matches_by_id = {
            str(item.get("client_track_id")): item
            for item in result.get("matches", [])
            if item.get("client_track_id") is not None
        }
        records = []
        totals = {"complete": 0, "suggestion": 0, "incomplete": 0, "total": len(files)}

        for item in files:
            match = matches_by_id.get(str(item.get("id")), {})
            raw_status = str(match.get("status") or "unmatched").lower()
            canonical = match.get("canonical") or match.get("recording") or {}
            if raw_status in {"matched", "known", "complete", "exact"}:
                status = "complete"
                source = "Base de connaissances"
                totals["complete"] += 1
            elif raw_status in {"probable", "uncertain", "suggestion", "probable_suggestion", "enriched_sourcing"}:
                status = "probable_suggestion"
                source = "Suggestion KB"
                totals["suggestion"] += 1
            else:
                status = "incomplete"
                source = "Non identifié"
                totals["incomplete"] += 1

            record = {
                "id": item.get("id"),
                "file": item.get("file"),
                "title": canonical.get("title") or item.get("title") or item.get("file"),
                "artist": canonical.get("artist") or item.get("artist") or "",
                "year": canonical.get("year") or match.get("year"),
                "bpm": canonical.get("bpm") or match.get("bpm"),
                "camelot_key": canonical.get("camelot_key") or match.get("camelot_key"),
                "genre": canonical.get("genre") or item.get("genre") or "A verifier",
                "status": status,
                "source": source,
                "confidence": match.get("confidence"),
                "destinationDisplay": item.get("destinationDisplay"),
            }
            item["metadata"] = record
            records.append(record)

        return {
            "ok": True,
            "source": "Centre de connaissances LostTrackr",
            "records": records,
            "totals": totals,
        }

    def smartImportMetadata(self, selectedIds=None):
        return self.smart_import_metadata(selectedIds)

    def update_smart_item_destination(self, item, destination_folder):
        folder = Path(destination_folder).expanduser()
        destination = smart_import.unique_file(folder / item["file"])
        item["destination"] = str(destination)
        item["destinationDisplay"] = smart_import.display_path(destination)
        item["destinationFolder"] = str(destination.parent)
        item["destinationFolderDisplay"] = smart_import.display_path(destination.parent)
        item["confidence"] = "medium"
        item["confidenceLabel"] = smart_import.confidence_label("medium")
        item["reason"] = "Destination choisie manuellement"
        item["reasonCode"] = "manual_destination"
        item["reasons"] = [{"code": "manual_destination", "label": "Destination choisie manuellement", "score": 7}]
        item["matchedFolder"] = str(destination.parent)
        item["matchedFolderDisplay"] = smart_import.display_path(destination.parent)

    def rebuild_smart_import_groups(self):
        if not self.last_smart_import_plan:
            return
        groups, summary = smart_import.build_suggestion_groups(self.last_smart_import_plan.get("files", []))
        self.last_smart_import_plan["groups"] = groups
        self.last_smart_import_plan["summary"] = summary
        self.last_smart_import_plan["totals"]["review"] = sum(
            1 for item in self.last_smart_import_plan.get("files", []) if item.get("confidence") == "review"
        )

    def smart_import_choose_destination(self, payload=None):
        if not self.last_smart_import_plan:
            raise RuntimeError("Aucun plan Smart Import a modifier.")
        payload = payload or {}
        scope = payload.get("scope")
        target_id = payload.get("id")
        if scope not in {"group", "track"} or not target_id:
            raise RuntimeError("Destination a modifier introuvable.")

        destination_folder = payload.get("destinationFolder")
        if not destination_folder:
            result = self.choose_folder("Choisir le dossier de destination")
            destination_folder = result.get("path") if isinstance(result, dict) else None
        if not destination_folder:
            return self.last_smart_import_plan
        if not Path(destination_folder).expanduser().is_dir():
            raise RuntimeError("Dossier de destination introuvable.")

        file_ids = set()
        if scope == "track":
            file_ids.add(target_id)
        else:
            for group in self.last_smart_import_plan.get("groups", []):
                if group.get("id") == target_id:
                    file_ids.update(group.get("items") or [])
                    break
        if not file_ids:
            raise RuntimeError("Aucun titre trouve pour cette destination.")

        for item in self.last_smart_import_plan.get("files", []):
            if item.get("id") in file_ids:
                self.update_smart_item_destination(item, destination_folder)
        self.rebuild_smart_import_groups()
        return self.last_smart_import_plan

    def smartImportChooseDestination(self, payload=None):
        return self.smart_import_choose_destination(payload)

    def dj_set_recent_files(self, require_moved=False):
        if not self.last_smart_import_plan:
            return []
        moved_by_id = {
            item.get("id"): item
            for item in (self.last_smart_import_result or {}).get("items", [])
            if item.get("id")
        }
        only_moved = bool(moved_by_id)
        if require_moved and not only_moved:
            return []
        files = []
        for file_item in self.last_smart_import_plan.get("files", []):
            file_id = file_item.get("id")
            if only_moved and file_id not in moved_by_id:
                continue
            clone = dict(file_item)
            moved = moved_by_id.get(file_id)
            if moved:
                clone["source"] = moved.get("to") or clone.get("destination")
                clone["sourceDisplay"] = moved.get("toDisplay") or clone.get("destinationDisplay")
                clone["destination"] = moved.get("to") or clone.get("destination")
                clone["destinationDisplay"] = moved.get("toDisplay") or clone.get("destinationDisplay")
            files.append(clone)
        return files

    def dj_set_preflight(self):
        detection = self.detect_software()
        libraries = self.discover_libraries()
        active_id = self.active_software_id(detection)
        active_software = self.software_payload(active_id, detection)
        existing_targets = self.discover_serato_crates(libraries) if active_id == "serato" else []
        return {
            "activeSoftwareId": active_id,
            "activeSoftware": active_software,
            "softwareDetection": detection,
            "existingTargets": existing_targets,
            "recentFilesCount": len(self.dj_set_recent_files(require_moved=True)),
            "writeMode": "backup_required",
            "modes": [
                {"id": "event", "label": "Préparer un nouvel évènement"},
                {"id": "organize", "label": "Organiser mes playlists"},
                {"id": "recent_imports", "label": "Envoyer mes derniers imports dans les crates"},
            ],
            "eventTypes": [
                {"id": "club", "label": "Club"},
                {"id": "wedding", "label": "Mariage"},
            ],
        }

    def djSetPreflight(self):
        return self.dj_set_preflight()

    def dj_set_plan(self, options=None):
        options = options or {}
        preflight = self.dj_set_preflight()
        mode = options.get("mode") or "event"
        return dj_set.build_plan(
            mode=mode,
            files=self.dj_set_recent_files(require_moved=(mode == "recent_imports")),
            software_detection=preflight["softwareDetection"],
            existing_targets=preflight["existingTargets"],
            event_type=options.get("eventType"),
        )

    def djSetPlan(self, options=None):
        return self.dj_set_plan(options)

    def dj_set_style_inspiration_plan(self, options=None):
        options = options or {}
        self.dj_set_preflight()
        recent_files = self.dj_set_recent_files(require_moved=False)
        return dj_set.build_style_inspiration_plan(
            options=options,
            local_tracks=recent_files
        )

    def djSetStyleInspirationPlan(self, options=None):
        return self.dj_set_style_inspiration_plan(options)

    def choose_folder(self, title="Choisir un dossier"):
        try:
            import webview

            if not webview.windows:
                return {"path": None}
            window = webview.windows[0]
            result = window.create_file_dialog(
                webview.FOLDER_DIALOG,
                directory=str(Path.home()),
                allow_multiple=False,
            )
            if not result:
                return {"path": None}
            path = result[0] if isinstance(result, (list, tuple)) else result
            return {"path": str(path), "title": title}
        except Exception as exc:
            return {"path": None, "error": str(exc)}

    def chooseFolder(self, title="Choisir un dossier"):
        return self.choose_folder(title)

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
        review = []
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
            elif info.get("candidateCount", 0) > 0 or info.get("status") == "ambiguous":
                item["reason"] = info.get("reason") or "candidat a verifier avant reparation"
                item["candidates"] = info.get("candidates", [])
                review.append(item)
            else:
                item["reason"] = info.get("reason") or "aucun candidat fiable sur les disques scannes"
                item["candidates"] = info.get("candidates", [])
                missing.append(item)

        return {
            "name": library["name"],
            "root": library["root"],
            "seratoDir": library["seratoDir"],
            "found": len(matches),
            "review": len(review),
            "missing": len(missing),
            "pathsRead": total_paths,
            "skipped": skipped,
            "matches": matches,
            "reviewItems": review,
            "missingItems": missing,
        }

    def scan(self):
        detection = self.detect_software()
        active_id = self.active_software_id(detection)
        active_software = self.software_payload(active_id, detection)
        if active_id != "serato":
            raise RuntimeError(
                f"{active_software['name']} est bien detecte, mais la reparation automatique "
                "sera activee lorsque son adaptateur sera branche. Choisis Serato DJ pour scanner avec le moteur actuel."
            )

        if serato.serato_running():
            raise RuntimeError("Serato DJ Pro semble ouvert. Ferme-le completement avant de scanner.")

        libraries = self.discover_libraries()
        if not libraries:
            raise RuntimeError(
                "Aucun dossier source Serato (_Serato_) n'a ete trouve. "
                "LostTrackr cherche dans le dossier Musique de l'utilisateur et a la racine des disques connectes. "
                "Ouvre Serato au moins une fois ou branche le disque qui contient ta bibliotheque, puis relance le scan."
            )

        roots = self.search_roots(libraries)
        index = build_index(roots)
        scanned = [self.scan_library(library, index) for library in libraries]
        matches = [item for library in scanned for item in library["matches"]]
        review = [item for library in scanned for item in library["reviewItems"]]
        missing = [item for library in scanned for item in library["missingItems"]]
        payload = {
            "activeSoftwareId": active_id,
            "activeSoftware": active_software,
            "libraries": [
                {
                    "name": library["name"],
                    "root": library["root"],
                    "found": library["found"],
                    "review": library["review"],
                    "missing": library["missing"],
                    "pathsRead": library["pathsRead"],
                    "skipped": library["skipped"],
                }
                for library in scanned
            ],
            "totals": {"found": len(matches), "review": len(review), "missing": len(missing)},
            "matches": matches,
            "review": review,
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

    def open_serato(self):
        if platform.is_macos():
            app_names = ["Serato DJ Pro", "Serato DJ Lite", "Serato DJ"]
            for app_name in app_names:
                result = subprocess.run(["open", "-a", app_name], capture_output=True, text=True, check=False)
                if result.returncode == 0:
                    return {"opened": True, "app": app_name}
            raise RuntimeError("Serato DJ Pro/Lite est introuvable dans Applications.")

        if platform.is_windows():
            program_roots = [
                os.environ.get("ProgramFiles"),
                os.environ.get("ProgramFiles(x86)"),
                os.environ.get("LOCALAPPDATA"),
            ]
            relative_paths = [
                Path("Serato") / "Serato DJ Pro" / "Serato DJ Pro.exe",
                Path("Serato") / "Serato DJ Lite" / "Serato DJ Lite.exe",
                Path("Serato") / "Serato DJ" / "Serato DJ.exe",
            ]
            for root in filter(None, program_roots):
                for relative in relative_paths:
                    candidate = Path(root) / relative
                    if candidate.is_file():
                        os.startfile(str(candidate))  # type: ignore[attr-defined]
                        return {"opened": True, "app": str(candidate)}
            try:
                subprocess.Popen(["cmd", "/c", "start", "", "Serato DJ Pro"], shell=False)
                return {"opened": True, "app": "Serato DJ Pro"}
            except Exception as exc:
                raise RuntimeError("Serato DJ Pro/Lite est introuvable sur ce Windows.") from exc

        raise RuntimeError("Ouverture de Serato non disponible sur cette plateforme.")

    def openSerato(self):
        return self.open_serato()

    def app_info(self):
        return {
            "name": APP_NAME,
            "version": APP_VERSION,
            "platform": update_manager.platform_key(),
            "updateChannel": update_manager.DEFAULT_CHANNEL,
            "launchState": self.launch_state(),
        }

    def getAppInfo(self):
        return self.app_info()

    def launch_state(self):
        state = load_app_state()
        onboarding_completed = bool(state.get("onboardingCompleted"))
        last_seen_version = str(state.get("lastSeenVersion") or "")
        show_whats_new = (
            onboarding_completed
            and last_seen_version != APP_VERSION
            and bool(app_release_notes(APP_VERSION))
        )
        return {
            "showOnboarding": not onboarding_completed,
            "showWhatsNew": show_whats_new,
            "currentVersion": APP_VERSION,
            "previousVersion": last_seen_version or None,
            "releaseNotes": app_release_notes(APP_VERSION),
        }

    def getLaunchState(self):
        return self.launch_state()

    def complete_onboarding(self):
        save_app_state(
            {
                "onboardingCompleted": True,
                "onboardingCompletedAt": datetime.now().isoformat(timespec="seconds"),
                "lastSeenVersion": APP_VERSION,
            }
        )
        return self.launch_state()

    def completeOnboarding(self):
        return self.complete_onboarding()

    def acknowledge_launch_state(self):
        save_app_state({"lastSeenVersion": APP_VERSION})
        return self.launch_state()

    def acknowledgeLaunchState(self):
        return self.acknowledge_launch_state()

    def check_update(self):
        try:
            return update_manager.check_for_update(current_version=APP_VERSION)
        except Exception as exc:
            return {
                "ok": False,
                "currentVersion": APP_VERSION,
                "updateAvailable": False,
                "error": str(exc),
            }

    def checkUpdate(self):
        return self.check_update()

    def install_update(self):
        result = update_manager.install_latest_update(current_version=APP_VERSION)
        if result.get("launched"):
            # L'installateur remplace le bundle sur disque mais le processus en
            # cours resterait l'ancienne version : on quitte pour que la
            # prochaine ouverture soit forcément la nouvelle version.
            result["quitting"] = True
            self._schedule_quit_for_update()
        return result

    def _schedule_quit_for_update(self, delay_seconds=2.5):
        import threading
        import time

        import webview

        def _quit():
            time.sleep(delay_seconds)
            try:
                for window in list(webview.windows):
                    window.destroy()
            except Exception:
                pass
            os._exit(0)

        threading.Thread(target=_quit, daemon=True).start()

    def installUpdate(self):
        return self.install_update()

    def knowledge_match(self, tracks):
        try:
            result = knowledge_client.match_tracks(tracks or [])
            return {"ok": True, **result}
        except knowledge_client.KnowledgeError as exc:
            return {"ok": False, "error": str(exc), "retryable": exc.retryable}
        except Exception:
            return {
                "ok": False,
                "error": "LostTrackr n'arrive pas à joindre le centre de connaissances.",
                "retryable": True,
            }

    def knowledgeMatch(self, tracks):
        return self.knowledge_match(tracks)

    def analyze_folder_metadata(self, folder_path, options=None):
        import os
        from pathlib import Path
        import re
        import smart_import
        import knowledge_client

        try:
            files = smart_import.scan_audio_files(folder_path)
        except Exception as exc:
            return {"ok": False, "error": f"Erreur lors du scan du dossier : {str(exc)}"}

        if not files:
            return {"ok": True, "tracks": []}

        tracks = []
        for f in files:
            file_path = Path(f.get("source"))
            
            # Read real tags with mutagen
            tags = read_audio_tags(file_path)
            
            # Merge with inferred metadata from filename
            artist = tags["artist"].strip() or f.get("artist") or ""
            title = tags["title"].strip() or f.get("title") or ""
            year = tags["year"] or f.get("year")
            genre = tags["genre"].strip() or f.get("genre") or "A verifier"
            
            track_meta = {
                "id": f.get("id"),
                "file": f.get("file"),
                "path": str(file_path),
                "artist": artist,
                "title": title,
                "year": year,
                "bpm": None,
                "camelot_key": None,
                "genre": genre,
                "status": "incomplete",
                "source": "Fichier",
                "version": f.get("version") or "",
                "is_edit_detected": False,
                "duration_ms": None
            }
            tracks.append(track_meta)

        # 1. Empreinte + tags par fichier → une seule requête batch lt-intelligence.
        #    Le serveur cascade lui-même : cache → AcoustID → texte MusicBrainz,
        #    et renvoie le canonique consolidé (bpm/clé/genre/année/drapeaux).
        resolve_reqs = []
        total_tracks = len(tracks)
        for i, t in enumerate(tracks):
            fp_data = compute_audio_fingerprint(Path(t["path"]))
            req = {"client_track_id": str(i)}
            if t["title"]:
                req["title"] = t["title"]
            if t["artist"]:
                req["artist"] = t["artist"]
            if fp_data and fp_data.get("fingerprint") and fp_data.get("duration"):
                req["fingerprint"] = fp_data["fingerprint"]
                req["duration"] = fp_data["duration"]
                t["duration_ms"] = fp_data["duration"] * 1000
            resolve_reqs.append(req)

            # Progression (0% → 75% : calcul des empreintes)
            if self.window:
                progress = int((i + 1) / total_tracks * 75)
                self.window.evaluate_js(f"if (window.updateMetadataProgress) window.updateMetadataProgress({progress});")

        def _resolve_progress(done, total):
            # 75% → 95% : résolution par lots côté serveur
            if self.window and total:
                progress = 75 + int(done / total * 20)
                self.window.evaluate_js(f"if (window.updateMetadataProgress) window.updateMetadataProgress({progress});")

        results_by_idx = {}
        try:
            res = knowledge_client.resolve_fingerprints(resolve_reqs, on_progress=_resolve_progress)
            for r in res.get("results", []):
                results_by_idx[int(r["client_track_id"])] = r
        except Exception as e:
            print(f"Error resolving tracks: {e}")

        # 2. Application : identité + canonique. Un "matched" marqué needs_review
        #    par le consensus est rétrogradé en "À vérifier" (jamais de fausse
        #    certitude affichée).
        EDIT_WORDS = ("edit", "remix", "bootleg", "extended", "mix", "mashup", "vip", "intro")
        for i, t in enumerate(tracks):
            r = results_by_idx.get(i)
            status = (r or {}).get("status")
            canonical = (r or {}).get("canonical") or {}
            recording = (r or {}).get("recording") or {}

            if status in ("matched", "probable"):
                t["artist"] = canonical.get("artist") or recording.get("artist") or t["artist"]
                t["title"] = canonical.get("title") or recording.get("title") or t["title"]
                t["bpm"] = canonical.get("bpm")
                t["camelot_key"] = canonical.get("camelot_key")
                t["genre"] = canonical.get("genre") or t["genre"]
                t["year"] = canonical.get("year") or recording.get("year") or t["year"]
                if status == "matched" and not canonical.get("needs_review"):
                    t["status"] = "complete"
                    t["source"] = "Base de connaissances"
                else:
                    t["status"] = "probable_suggestion"
                    t["source"] = "Suggestion KB"
            else:
                t["status"] = "incomplete"
                t["source"] = "Non identifié"

            version = (t["version"] or "").lower()
            t["is_edit_detected"] = bool(canonical.get("version_mismatch")) or any(
                w in version for w in EDIT_WORDS)

        # 3. S1 : extraits du fichier EXACT (mp3, max 8/scan) envoyés en tâche
        #    de fond — identification commerciale + DSP sur la vraie version
        #    côté worker ; résultats visibles au prochain scan (cache).
        try:
            candidates = collect_sample_candidates(tracks, results_by_idx)
            if candidates:
                upload_samples_background(candidates)
        except Exception as exc:
            print(f"sample upload: {exc}")

        # Send progress (100%)
        if self.window:
            self.window.evaluate_js("if (window.updateMetadataProgress) window.updateMetadataProgress(100);")

        return {"ok": True, "tracks": tracks}

    def analyzeFolderMetadata(self, folder_path, options=None):
        return self.analyze_folder_metadata(folder_path, options)

    def refine_track_metadata(self, path=None, title=None, artist=None):
        """Re-résout UN titre avec les infos corrigées par l'utilisateur.

        Volontairement SANS empreinte : si l'utilisateur corrige, c'est que
        l'identification acoustique s'est trompée — la re-inclure resservirait
        la même erreur. Le texte corrigé fait autorité.
        """
        title = str(title or "").strip()
        artist = str(artist or "").strip()
        if not title:
            return {"ok": False, "error": "Un titre est nécessaire pour relancer la recherche."}
        req = {"client_track_id": "manual-refine", "title": title}
        if artist:
            req["artist"] = artist
        try:
            res = knowledge_client.resolve_fingerprints([req])
            results = res.get("results", [])
        except Exception:
            return {"ok": False, "error": "Le centre de connaissances est injoignable."}
        if not results or results[0].get("status") not in ("matched", "probable"):
            return {"ok": True, "status": "unmatched"}
        r = results[0]
        return {
            "ok": True,
            "status": r.get("status"),
            "method": r.get("method"),
            "recording": r.get("recording") or {},
            "canonical": r.get("canonical") or {},
        }

    def refineTrackMetadata(self, path=None, title=None, artist=None):
        return self.refine_track_metadata(path, title, artist)

    def save_tracks_metadata(self, tracks):
        from pathlib import Path
        
        saved_count = 0
        errors = []
        
        for t in tracks or []:
            if t.get("status") not in ("complete", "probable_suggestion"):
                continue
                
            file_path = Path(t["path"])
            if not file_path.exists():
                errors.append(f"Fichier introuvable : {t['file']}")
                continue
                
            try:
                write_audio_tags(file_path, {
                    "artist": t.get("artist"),
                    "title": t.get("title"),
                    "year": t.get("year"),
                    "genre": t.get("genre"),
                    "bpm": t.get("bpm"),
                    "camelot_key": t.get("camelot_key"),
                })
                saved_count += 1
            except Exception as e:
                errors.append(f"Erreur d'ecriture pour {t['file']} : {str(e)}")
                
        if errors:
            return {"ok": False, "saved_count": saved_count, "error": "\n".join(errors[:5])}
        return {"ok": True, "saved_count": saved_count}

    def saveTracksMetadata(self, tracks):
        return self.save_tracks_metadata(tracks)

    def open_external_url(self, url):
        parsed = str(url or "")
        if not (parsed.startswith("https://") or parsed.startswith("http://")):
            raise RuntimeError("Lien externe invalide.")
        webbrowser.open(parsed)
        return {"opened": True, "url": parsed}

    def openExternalUrl(self, url):
        return self.open_external_url(url)


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
    window = webview.create_window(
        APP_NAME,
        str(html_path),
        js_api=api,
        width=1672,
        height=941,
        min_size=(1180, 720),
        fullscreen=platform.is_macos(),
        maximized=platform.is_windows(),
        text_select=True,
    )
    api.set_window(window)
    webview.start(debug=False)


if __name__ == "__main__":
    run()
