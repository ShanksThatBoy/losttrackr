#!/usr/bin/env python3
"""Smart Import planning and move execution for LostTrackr."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import unicodedata
from datetime import datetime
from pathlib import Path

import losttrackr_platform as platform

AUDIO_EXTENSIONS = {
    ".aac",
    ".aif",
    ".aiff",
    ".flac",
    ".m4a",
    ".mp3",
    ".ogg",
    ".wav",
}

MAX_SCAN_FILES = 450
MAX_LIBRARY_FOLDERS = 240
MAX_FOLDER_AUDIO_SAMPLES = 80
CONFIDENCE_LABELS = {
    "high": "Très probable",
    "medium": "Bonne suggestion",
    "review": "À vérifier",
    "low": "À vérifier",
}
SKIP_DIR_NAMES = {
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
    "node_modules",
}
TRANSIT_FOLDER_NAMES = {
    "a classer",
    "a ranger",
    "a trier",
    "a verifier",
    "download",
    "downloads",
    "dl",
    "incoming",
    "new",
    "nouveau",
    "nouveaux",
    "temp",
    "tmp",
    "to sort",
    "tri",
    "trier",
    "telechargement",
    "telechargements",
    "verifier",
}
TRANSIT_FOLDER_TOKEN_HINTS = {
    "download",
    "downloads",
    "incoming",
    "telechargement",
    "telechargements",
}

GENRE_KEYWORDS = {
    "Afro": ("afro", "afrobeats", "afropop", "amapiano", "coupé", "coupe"),
    "Club": ("club", "dance", "edm", "mainstage", "peak", "anthem", "banger", "commercial"),
    "Electro": ("electro", "electronic", "edm", "dance", "future rave"),
    "House": ("house", "deep house", "tech house", "garage", "afro house"),
    "Hip-Hop": ("hip hop", "hip-hop", "rap", "trap", "drill"),
    "Latino": ("latino", "latin", "reggaeton", "dembow", "salsa", "bachata", "merengue"),
    "Brazil": ("brazil", "brasil", "bresil", "brésil", "funk br", "baile", "pagode"),
    "Pop": ("pop", "top 40", "radio", "hit"),
    "Techno": ("techno", "minimal", "hardgroove", "rave"),
    "Disco Funk": ("disco", "funk", "soul", "boogie"),
    "Gospel": ("gospel", "choir", "chorale"),
    "R&B": ("rnb", "r&b", "rn b", "slow jam"),
    "Dancehall": ("dancehall", "shatta", "ragga"),
    "Warmup": ("warmup", "warm up", "opening", "lounge"),
}

ARTIST_GENRE_HINTS = {
    "burna boy": "Afro",
    "daddy yankee": "Latino",
    "mauvais djo": "Afro",
    "kano choir": "Gospel",
    "mariana nolasco": "Brazil",
    "ofenbach": "House",
    "peggy gou": "House",
    "sound of legend": "Club",
    "trinix": "Electro",
}

STOP_TOKENS = {
    "2023",
    "2024",
    "2025",
    "2026",
    "audio",
    "clean",
    "dirty",
    "edit",
    "extended",
    "final",
    "intro",
    "lyrics",
    "mix",
    "music",
    "musique",
    "musiques",
    "official",
    "radio",
    "rang",
    "rangees",
    "rangées",
    "remix",
    "version",
    "video",
}


def default_downloads_dir() -> Path:
    return Path.home() / "Downloads"


def default_clean_destination() -> Path:
    return Path.home() / "Music" / "LostTrackr Smart Import"


def manifest_root() -> Path:
    return Path.home() / "Music" / "LostTrackr Smart Import" / "_manifests"


def normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", str(value or ""))
    without_marks = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", without_marks.casefold()).strip()


def text_tokens(value: str, min_length: int = 3) -> set[str]:
    normalized = normalize_text(value)
    tokens = set(re.findall(r"[a-z0-9]+", normalized))
    return {token for token in tokens if len(token) >= min_length and token not in STOP_TOKENS}


def transit_folder_name(name: str) -> bool:
    normalized = normalize_text(str(name or "").replace("_", " ").replace("-", " "))
    compact = re.sub(r"[^a-z0-9]+", "", normalized)
    tokens = set(re.findall(r"[a-z0-9]+", normalized))
    if normalized in TRANSIT_FOLDER_NAMES or compact in {re.sub(r"[^a-z0-9]+", "", item) for item in TRANSIT_FOLDER_NAMES}:
        return True
    if tokens & TRANSIT_FOLDER_TOKEN_HINTS:
        return True
    if {"a", "trier"}.issubset(tokens) or {"a", "ranger"}.issubset(tokens) or {"to", "sort"}.issubset(tokens):
        return True
    if "dl" in tokens and (len(tokens) == 1 or any(token.isdigit() or token in {"new", "nouveau", "nouveaux", "tri", "trier"} for token in tokens)):
        return True
    return False


def transit_folder_penalty(path: str | Path, name: str = "") -> int:
    candidate = Path(path)
    if transit_folder_name(name or candidate.name):
        return -32
    parent_parts = list(candidate.parts[-4:-1])
    if any(transit_folder_name(part) for part in parent_parts):
        return -14
    return 0


def clean_name(value: str | None, fallback: str = "A verifier") -> str:
    text = re.sub(r"[\\/:*?\"<>|]+", " ", str(value or "")).strip(" .")
    text = re.sub(r"\s+", " ", text)
    return text[:96] or fallback


def path_id(path: Path) -> str:
    return hashlib.sha1(str(path).encode("utf-8", errors="ignore")).hexdigest()[:14]


def stable_id(value: str | Path, prefix: str = "") -> str:
    digest = hashlib.sha1(str(value).encode("utf-8", errors="ignore")).hexdigest()[:12]
    return f"{prefix}{digest}" if prefix else digest


def confidence_label(value: str) -> str:
    return CONFIDENCE_LABELS.get(value, CONFIDENCE_LABELS["low"])


def keep_walk_dir(name: str) -> bool:
    if name in SKIP_DIR_NAMES:
        return False
    return platform.keep_walk_dir(name)


def unique_file(path: Path) -> Path:
    candidate = Path(path)
    if not candidate.exists():
        return candidate
    index = 2
    while True:
        next_candidate = candidate.with_name(f"{candidate.stem}_{index}{candidate.suffix}")
        if not next_candidate.exists():
            return next_candidate
        index += 1


def display_path(path: str | Path) -> str:
    try:
        home = Path.home()
        candidate = Path(path)
        return "~/" + str(candidate.expanduser().relative_to(home))
    except Exception:
        return str(path)


def infer_track_metadata(path: str | Path) -> dict:
    stem = Path(path).stem
    cleaned = re.sub(r"\[[^\]]+\]|\([^\)]*(official|visualizer|lyrics?|audio|video)[^\)]*\)", "", stem, flags=re.I)
    cleaned = re.sub(r"\s+", " ", cleaned.replace("_", " ")).strip(" -")
    year_match = re.search(r"\b(19[7-9]\d|20[0-3]\d)\b", cleaned)
    year = int(year_match.group(1)) if year_match else None
    without_year = re.sub(r"\b(19[7-9]\d|20[0-3]\d)\b", "", cleaned).strip(" -")

    artist = ""
    title = without_year or cleaned or stem
    for separator in (" - ", " – ", " — "):
        if separator in without_year:
            left, right = without_year.split(separator, 1)
            if left.strip() and right.strip():
                artist = left.strip()
                title = right.strip()
                break

    version = ""
    version_match = re.search(r"\(([^)]*(edit|remix|bootleg|mashup|extended|intro|clean|dirty)[^)]*)\)", stem, re.I)
    if version_match:
        version = version_match.group(1).strip()

    return {
        "artist": clean_name(artist, ""),
        "title": clean_name(title, stem),
        "year": year,
        "version": clean_name(version, ""),
    }


def infer_genre(path: Path, metadata: dict) -> str:
    haystack = normalize_text(" ".join([path.stem, str(path.parent), metadata.get("artist", ""), metadata.get("title", "")]))
    for artist, genre in ARTIST_GENRE_HINTS.items():
        if artist in haystack:
            return genre
    for genre, needles in GENRE_KEYWORDS.items():
        if any(needle in haystack for needle in needles):
            return genre
    return "A verifier"


def infer_genres_from_text(value: str) -> set[str]:
    haystack = normalize_text(value)
    genres = set()
    for genre, needles in GENRE_KEYWORDS.items():
        if normalize_text(genre) in haystack or any(needle in haystack for needle in needles):
            genres.add(genre)
    for artist, genre in ARTIST_GENRE_HINTS.items():
        if artist in haystack:
            genres.add(genre)
    return genres


def scan_audio_files(source_dir: str | Path, max_files: int = MAX_SCAN_FILES) -> list[dict]:
    root = Path(source_dir).expanduser()
    if not root.is_dir():
        raise RuntimeError(f"Dossier source introuvable: {root}")

    files: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [name for name in dirnames if keep_walk_dir(name)]
        for filename in sorted(filenames):
            path = Path(dirpath) / filename
            if path.suffix.casefold() not in AUDIO_EXTENSIONS:
                continue
            try:
                stat = path.stat()
            except OSError:
                continue
            metadata = infer_track_metadata(path)
            genre = infer_genre(path, metadata)
            genre_hints = infer_genres_from_text(
                " ".join([path.stem, str(path.parent), metadata.get("artist", ""), metadata.get("title", "")])
            )
            if genre != "A verifier":
                genre_hints.add(genre)
            files.append(
                {
                    "id": path_id(path),
                    "file": path.name,
                    "source": str(path),
                    "sourceDisplay": display_path(path),
                    "extension": path.suffix.casefold(),
                    "sizeBytes": stat.st_size,
                    "artist": metadata["artist"],
                    "title": metadata["title"],
                    "year": metadata["year"],
                    "version": metadata["version"],
                    "genre": genre,
                    "genreHints": sorted(genre_hints),
                    "tokens": sorted(text_tokens(" ".join([path.stem, metadata["artist"], metadata["title"], genre]))),
                }
            )
            if len(files) >= max_files:
                return files
    return files


def scan_library_folders(roots: list[str | Path], limit: int = MAX_LIBRARY_FOLDERS) -> list[dict]:
    folders = []
    seen = set()
    for root in roots:
        root_path = Path(root).expanduser()
        if not root_path.is_dir():
            continue
        for dirpath, dirnames, filenames in os.walk(root_path):
            dirnames[:] = [name for name in dirnames if keep_walk_dir(name)]
            path = Path(dirpath)
            audio_files = [name for name in sorted(filenames) if Path(name).suffix.casefold() in AUDIO_EXTENSIONS]
            audio_count = len(audio_files)
            path_text = " ".join(path.parts[-5:])
            path_genres = infer_genres_from_text(path_text)
            if audio_count <= 0 and not path_genres:
                continue
            key = str(path.resolve())
            if key in seen:
                continue
            seen.add(key)
            samples = audio_files[:MAX_FOLDER_AUDIO_SAMPLES]
            sample_text = " ".join(Path(name).stem for name in samples)
            score_text = normalize_text(" ".join([path_text, sample_text]))
            folder_tokens = text_tokens(" ".join([path_text, sample_text]))
            folder_genres = sorted(path_genres | infer_genres_from_text(sample_text))
            folders.append(
                {
                    "path": str(path),
                    "display": display_path(path),
                    "name": path.name,
                    "audioCount": audio_count,
                    "scoreText": score_text,
                    "tokens": sorted(folder_tokens),
                    "genres": folder_genres,
                }
            )
            if len(folders) >= limit:
                return folders
    return folders


def add_match_reason(reasons: list[dict], code: str, label: str, score: int) -> None:
    for reason in reasons:
        if reason["code"] == code and reason["label"] == label:
            reason["score"] += score
            return
    reasons.append({"code": code, "label": label, "score": score})


def score_folder_match(file_item: dict, folder: dict) -> dict:
    text = folder.get("scoreText", "")
    folder_tokens = set(folder.get("tokens") or [])
    folder_genres = set(folder.get("genres") or [])
    file_tokens = set(file_item.get("tokens") or [])
    artist_tokens = text_tokens(file_item.get("artist", ""))
    title_tokens = text_tokens(file_item.get("title", ""))
    genre = file_item.get("genre", "")
    genre_hints = set(file_item.get("genreHints") or [])
    if genre and genre != "A verifier":
        genre_hints.add(genre)
    score = 0
    reasons: list[dict] = []
    folder_name = folder.get("name") or "ce dossier"
    for hint in genre_hints:
        normalized_genre = normalize_text(hint)
        if hint in folder_genres or normalized_genre in text:
            points = 12 if hint == genre else 10
            score += points
            code = "existing_style_folder" if hint in folder_genres else "folder_name_genre_match"
            label = (
                f"Sous-dossier {folder_name} trouvé dans la bibliothèque"
                if code == "existing_style_folder"
                else "Nom de dossier proche du genre détecté"
            )
            add_match_reason(reasons, code, label, points)
        if any(needle in text for needle in GENRE_KEYWORDS.get(hint, ())):
            score += 6
            add_match_reason(reasons, "genre_detected", f"Indice {hint} détecté dans le titre", 6)

    artist_matches = artist_tokens & folder_tokens
    if artist_matches:
        points = 5 * len(artist_matches)
        score += points
        add_match_reason(reasons, "artist_existing", f"Match artiste déjà présent dans {folder_name}", points)

    title_matches = title_tokens & folder_tokens
    if title_matches:
        points = 2 * len(title_matches)
        score += points
        add_match_reason(reasons, "title_nearby", "Titre proche de fichiers déjà présents", points)

    secondary_matches = (file_tokens - artist_tokens - title_tokens) & folder_tokens
    if secondary_matches:
        points = len(secondary_matches)
        score += points
        add_match_reason(reasons, "secondary_tokens", "Indices secondaires dans le dossier", points)

    if normalize_text(folder.get("name", "")) in {"a verifier", "a-verifier", "a_verifier"}:
        score -= 3
        add_match_reason(reasons, "review_folder_penalty", "Dossier à vérifier moins prioritaire", -3)

    penalty = transit_folder_penalty(folder.get("path", ""), folder.get("name", ""))
    if penalty:
        score += penalty
        add_match_reason(reasons, "transit_folder_penalty", "Dossier de transit évité", penalty)

    return {
        "score": score,
        "folder": folder,
        "reasons": sorted(reasons, key=lambda item: item["score"], reverse=True),
    }


def folder_score(file_item: dict, folder: dict) -> int:
    return score_folder_match(file_item, folder)["score"]


def primary_match_reason(match: dict) -> tuple[str, str]:
    preferred = (
        "artist_existing",
        "existing_style_folder",
        "genre_detected",
        "folder_name_genre_match",
        "title_nearby",
        "secondary_tokens",
    )
    reasons = match.get("reasons") or []
    for code in preferred:
        for reason in reasons:
            if reason.get("code") == code:
                return reason["label"], code
    if reasons:
        return reasons[0]["label"], reasons[0]["code"]
    return "Destination cohérente avec la bibliothèque", "library_match"


def fallback_destination(
    file_item: dict,
    destination_root: Path,
    folder_name: str,
    confidence: str,
    reason: str,
    reason_code: str,
    reasons: list[dict] | None = None,
    score: int = 0,
    second_score: int = 0,
) -> tuple[Path, str, str, dict]:
    fallback_root = destination_root if destination_root.name == "LostTrackr Smart Import" else destination_root / "LostTrackr Smart Import"
    destination = fallback_root / clean_name(folder_name, "A verifier") / file_item["file"]
    match = {
        "score": score,
        "secondScore": second_score,
        "reasonCode": reason_code,
        "reasons": reasons or [{"code": reason_code, "label": reason, "score": score}],
        "matchedFolder": "",
        "matchedFolderDisplay": "",
    }
    return destination, confidence, reason, match


def existing_destination_for(file_item: dict, destination_root: Path, folders: list[dict]) -> tuple[Path, str, str, dict]:
    scored = sorted((score_folder_match(file_item, folder) for folder in folders), key=lambda item: item["score"], reverse=True)
    if scored and scored[0]["score"] >= 5:
        best = scored[0]
        second_score = scored[1]["score"] if len(scored) > 1 else 0
        if second_score >= 5 and second_score >= best["score"] - 2:
            reason = "Plusieurs destinations possibles"
            reasons = [
                {"code": "ambiguous_destination", "label": reason, "score": best["score"]},
                *best.get("reasons", [])[:3],
            ]
            return fallback_destination(
                file_item,
                destination_root,
                "A verifier",
                "review",
                reason,
                "ambiguous_destination",
                reasons=reasons,
                score=best["score"],
                second_score=second_score,
            )

        folder_info = best["folder"]
        folder = Path(folder_info["path"])
        confidence = "high" if best["score"] >= 10 else "medium"
        reason, reason_code = primary_match_reason(best)
        match = {
            "score": best["score"],
            "secondScore": second_score,
            "reasonCode": reason_code,
            "reasons": best.get("reasons", []),
            "matchedFolder": str(folder),
            "matchedFolderDisplay": display_path(folder),
        }
        return folder / file_item["file"], confidence, reason, match

    genre = clean_name(file_item.get("genre"), "A verifier")
    if genre != "A verifier":
        reason = f"Indice {genre} détecté dans le titre"
        return fallback_destination(
            file_item,
            destination_root,
            genre,
            "medium",
            reason,
            "genre_detected",
            score=scored[0]["score"] if scored else 0,
            second_score=scored[1]["score"] if len(scored) > 1 else 0,
        )
    return fallback_destination(
        file_item,
        destination_root,
        "A verifier",
        "review",
        "Score insuffisant",
        "insufficient_score",
        score=scored[0]["score"] if scored else 0,
        second_score=scored[1]["score"] if len(scored) > 1 else 0,
    )


def clean_destination_for(file_item: dict, destination_root: Path) -> tuple[Path, str, str, dict]:
    genre = clean_name(file_item.get("genre"), "A verifier")
    confidence = "medium" if genre != "A verifier" else "review"
    reason = "Structure LostTrackr propre" if genre != "A verifier" else "Score insuffisant"
    reason_code = "clean_structure" if genre != "A verifier" else "insufficient_score"
    return destination_root / genre / file_item["file"], confidence, reason, {
        "score": 6 if genre != "A verifier" else 0,
        "secondScore": 0,
        "reasonCode": reason_code,
        "reasons": [{"code": reason_code, "label": reason, "score": 6 if genre != "A verifier" else 0}],
        "matchedFolder": "",
        "matchedFolderDisplay": "",
    }


def display_group_name(path: str | Path) -> str:
    name = Path(path).name
    if normalize_text(name) in {"a verifier", "a-verifier", "a_verifier"}:
        return "À vérifier"
    return name or "Destination"


def group_confidence(items: list[dict]) -> str:
    confidences = {item.get("confidence") for item in items}
    if "review" in confidences or "low" in confidences:
        return "low"
    if "medium" in confidences:
        return "medium"
    return "high"


def group_reason(items: list[dict]) -> tuple[str, str, list[dict]]:
    totals: dict[tuple[str, str], int] = {}
    for item in items:
        for reason in item.get("reasons") or []:
            key = (reason.get("code", "unknown"), reason.get("label", "Destination proposée"))
            totals[key] = totals.get(key, 0) + int(reason.get("score") or 0)
    if not totals:
        first = items[0] if items else {}
        return first.get("reason", "Destination proposée"), first.get("reasonCode", "library_match"), []
    ordered = sorted(totals.items(), key=lambda entry: entry[1], reverse=True)
    reason_code, label = ordered[0][0]
    reasons = [
        {"code": code, "label": reason_label, "score": score}
        for ((code, reason_label), score) in ordered[:5]
    ]
    return label, reason_code, reasons


def build_suggestion_groups(files: list[dict]) -> tuple[list[dict], dict]:
    grouped: dict[str, list[dict]] = {}
    order: list[str] = []
    for item in files:
        folder = item.get("destinationFolder") or ""
        if folder not in grouped:
            grouped[folder] = []
            order.append(folder)
        grouped[folder].append(item)

    groups = []
    for folder in order:
        items = grouped[folder]
        confidence = group_confidence(items)
        reason, reason_code, reasons = group_reason(items)
        groups.append(
            {
                "id": stable_id(folder or reason, "grp_"),
                "name": display_group_name(folder),
                "trackCount": len(items),
                "confidence": confidence,
                "confidenceLabel": confidence_label(confidence),
                "status": "review" if confidence == "low" else "suggested",
                "reason": reason,
                "reasonCode": reason_code,
                "reasons": reasons,
                "destinationFolder": folder,
                "destinationFolderDisplay": display_path(folder) if folder else "",
                "logoKey": None,
                "items": [item["id"] for item in items],
            }
        )

    groups.sort(key=lambda item: (item["confidence"] == "low", -item["trackCount"], item["name"]))
    reliable_count = sum(group["trackCount"] for group in groups if group["confidence"] in {"high", "medium"})
    review_count = sum(group["trackCount"] for group in groups if group["confidence"] == "low")
    return groups, {
        "totalCount": sum(group["trackCount"] for group in groups),
        "reliableCount": reliable_count,
        "reviewCount": review_count,
        "groupCount": len(groups),
    }


def build_file_plan(
    source_dir: str | Path | None = None,
    destination_mode: str = "existing",
    destination_root: str | Path | None = None,
    library_roots: list[str | Path] | None = None,
    max_files: int = MAX_SCAN_FILES,
) -> dict:
    source = Path(source_dir or default_downloads_dir()).expanduser()
    roots = [Path(root).expanduser() for root in (library_roots or []) if root]
    if destination_root:
        destination_base = Path(destination_root).expanduser()
    elif destination_mode == "clean":
        destination_base = default_clean_destination()
    elif roots:
        destination_base = roots[0]
    else:
        destination_base = default_clean_destination()

    if destination_mode == "existing" and destination_base.is_dir():
        destination_key = str(destination_base.resolve())
        root_keys = {str(root.resolve()) for root in roots if root.exists()}
        if destination_key not in root_keys:
            roots.insert(0, destination_base)

    audio_files = scan_audio_files(source, max_files=max_files)
    library_folders = scan_library_folders(roots) if destination_mode == "existing" else []
    planned = []
    conflicts = 0
    review = 0

    for file_item in audio_files:
        if destination_mode == "existing":
            destination, confidence, reason, match_info = existing_destination_for(file_item, destination_base, library_folders)
        else:
            destination, confidence, reason, match_info = clean_destination_for(file_item, destination_base)

        resolved = unique_file(destination)
        had_conflict = resolved != destination
        conflicts += int(had_conflict)
        review += int(confidence == "review")
        planned.append(
            {
                **file_item,
                "action": "move",
                "destination": str(resolved),
                "destinationDisplay": display_path(resolved),
                "destinationFolder": str(resolved.parent),
                "destinationFolderDisplay": display_path(resolved.parent),
                "confidence": confidence,
                "confidenceLabel": confidence_label(confidence),
                "reason": reason,
                "reasonCode": match_info.get("reasonCode", "library_match"),
                "reasons": match_info.get("reasons", []),
                "score": match_info.get("score", 0),
                "secondScore": match_info.get("secondScore", 0),
                "matchedFolder": match_info.get("matchedFolder", ""),
                "matchedFolderDisplay": match_info.get("matchedFolderDisplay", ""),
                "status": "ready",
                "conflict": had_conflict,
            }
        )

    groups, summary = build_suggestion_groups(planned)
    return {
        "sourceDir": str(source),
        "sourceDisplay": display_path(source),
        "destinationMode": destination_mode,
        "destinationRoot": str(destination_base),
        "destinationRootDisplay": display_path(destination_base),
        "libraryRoots": [str(root) for root in roots],
        "libraryFolders": library_folders[:120],
        "totals": {
            "audio": len(audio_files),
            "ready": len(planned),
            "review": review,
            "conflicts": conflicts,
            "limited": len(audio_files) >= max_files,
        },
        "summary": summary,
        "groups": groups,
        "files": planned,
    }


def crate_name_from_file(path: str | Path) -> str:
    name = Path(path).stem
    return name.replace("%%", "/").replace("_", " ").strip() or "Crate"


def build_dj_plan(file_plan: dict, software_detection: dict | None = None, crates: list[dict] | None = None) -> dict:
    files = file_plan.get("files", [])
    detected = (software_detection or {}).get("softwares", [])
    active = detected[0] if detected else {"id": "serato", "name": "Serato DJ", "containerName": "crate", "containerPlural": "crates"}
    existing_crates = crates or []
    rows = []
    new_targets = set()

    for file_item in files:
        best = None
        best_score = 0
        for crate in existing_crates:
            crate_text = normalize_text(crate.get("name", ""))
            probes = [file_item.get("genre", ""), file_item.get("artist", ""), file_item.get("title", "")]
            score = sum(3 if normalize_text(probe) and normalize_text(probe) in crate_text else 0 for probe in probes)
            if score > best_score:
                best_score = score
                best = crate

        if best and best_score >= 3:
            target_name = best["name"]
            target_type = "existing"
            confidence = "high"
            reason = "Cohérent avec une crate existante"
        else:
            genre = clean_name(file_item.get("genre"), "A verifier")
            target_name = "LostTrackr - Nouveaux sons" if genre == "A verifier" else f"LostTrackr - {genre}"
            target_type = "new"
            confidence = "medium" if genre != "A verifier" else "review"
            reason = "Nouvelle crate proposée pour éviter un mauvais classement"
            new_targets.add(target_name)

        rows.append(
            {
                "fileId": file_item["id"],
                "file": file_item["file"],
                "title": file_item.get("title", file_item["file"]),
                "artist": file_item.get("artist", ""),
                "softwareId": active.get("id", "serato"),
                "softwareName": active.get("name", "Serato DJ"),
                "containerName": active.get("containerName", "crate"),
                "targetType": target_type,
                "targetName": target_name,
                "confidence": confidence,
                "reason": reason,
            }
        )

    return {
        "activeSoftware": active,
        "existingTargets": existing_crates[:24],
        "newTargets": sorted(new_targets),
        "totals": {
            "items": len(rows),
            "existing": sum(1 for row in rows if row["targetType"] == "existing"),
            "new": sum(1 for row in rows if row["targetType"] == "new"),
            "review": sum(1 for row in rows if row["confidence"] == "review"),
        },
        "items": rows,
        "writeMode": "preview",
    }


def build_plan(
    source_dir: str | Path | None = None,
    destination_mode: str = "existing",
    destination_root: str | Path | None = None,
    library_roots: list[str | Path] | None = None,
    software_detection: dict | None = None,
    crates: list[dict] | None = None,
) -> dict:
    file_plan = build_file_plan(source_dir, destination_mode, destination_root, library_roots)
    return {
        **file_plan,
        "metadataOffer": {
            "available": bool(file_plan["files"]),
            "fields": ["artiste", "titre", "annee", "genre", "BPM", "cle Camelot"],
            "source": "Centre de connaissances LostTrackr",
        },
    }


def write_manifest(payload: dict) -> Path:
    root = manifest_root()
    root.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = unique_file(root / f"smart_import_{stamp}.json")
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def apply_move_plan(plan: dict, selected_ids: list[str] | None = None) -> dict:
    wanted = set(selected_ids or [])
    moved = []
    skipped = []
    errors = []

    for item in plan.get("files", []):
        if wanted and item.get("id") not in wanted:
            skipped.append({"id": item.get("id"), "file": item.get("file"), "reason": "non selectionne"})
            continue
        if item.get("action") != "move":
            skipped.append({"id": item.get("id"), "file": item.get("file"), "reason": "action ignoree"})
            continue

        source = Path(item.get("source", "")).expanduser()
        destination = Path(item.get("destination", "")).expanduser()
        if not source.is_file():
            errors.append({"id": item.get("id"), "file": item.get("file"), "reason": "source introuvable"})
            continue
        if source.resolve() == destination.resolve() if destination.exists() else False:
            skipped.append({"id": item.get("id"), "file": item.get("file"), "reason": "source et destination identiques"})
            continue

        destination.parent.mkdir(parents=True, exist_ok=True)
        final_destination = unique_file(destination)
        try:
            shutil.move(str(source), str(final_destination))
        except Exception as exc:
            errors.append({"id": item.get("id"), "file": item.get("file"), "reason": str(exc)})
            continue
        moved.append(
            {
                "id": item.get("id"),
                "file": item.get("file"),
                "from": str(source),
                "to": str(final_destination),
                "fromDisplay": display_path(source),
                "toDisplay": display_path(final_destination),
            }
        )

    manifest = {
        "createdAt": datetime.now().isoformat(timespec="seconds"),
        "operation": "smart_import_move",
        "sourceDir": plan.get("sourceDir"),
        "destinationRoot": plan.get("destinationRoot"),
        "moved": moved,
        "skipped": skipped,
        "errors": errors,
    }
    manifest_path = write_manifest(manifest)
    return {
        "moved": len(moved),
        "skipped": len(skipped),
        "errors": len(errors),
        "items": moved,
        "skippedItems": skipped,
        "errorItems": errors,
        "manifestPath": str(manifest_path),
        "manifestDisplay": display_path(manifest_path),
    }
