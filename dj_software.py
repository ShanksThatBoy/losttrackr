#!/usr/bin/env python3
"""DJ software detection profiles for LostTrackr."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path

import losttrackr_platform as platform


@dataclass(frozen=True)
class DjSoftwareProfile:
    id: str
    name: str
    vendor: str
    library_name: str
    container_name: str
    container_plural: str
    group_name: str
    repair_supported: bool
    beta_label: str


PROFILES = {
    "serato": DjSoftwareProfile(
        id="serato",
        name="Serato DJ",
        vendor="Serato",
        library_name="bibliothèque Serato",
        container_name="crate",
        container_plural="crates",
        group_name="subcrates",
        repair_supported=True,
        beta_label="Réparation active",
    ),
    "rekordbox": DjSoftwareProfile(
        id="rekordbox",
        name="rekordbox",
        vendor="AlphaTheta / Pioneer DJ",
        library_name="Collection rekordbox",
        container_name="playlist",
        container_plural="playlists",
        group_name="dossiers de playlists",
        repair_supported=False,
        beta_label="Détection prête",
    ),
    "traktor": DjSoftwareProfile(
        id="traktor",
        name="Traktor",
        vendor="Native Instruments",
        library_name="collection Traktor",
        container_name="playlist",
        container_plural="playlists",
        group_name="collection",
        repair_supported=False,
        beta_label="Détection prête",
    ),
    "virtualdj": DjSoftwareProfile(
        id="virtualdj",
        name="VirtualDJ",
        vendor="Atomix",
        library_name="database VirtualDJ",
        container_name="playlist",
        container_plural="playlists",
        group_name="smart folders",
        repair_supported=False,
        beta_label="Détection prête",
    ),
}


def profile_payload(profile: DjSoftwareProfile) -> dict:
    return {
        "id": profile.id,
        "name": profile.name,
        "vendor": profile.vendor,
        "libraryName": profile.library_name,
        "containerName": profile.container_name,
        "containerPlural": profile.container_plural,
        "groupName": profile.group_name,
        "repairSupported": profile.repair_supported,
        "betaLabel": profile.beta_label,
    }


def _source(profile_id: str, path: Path, kind: str, confidence: str = "high", detail: str | None = None) -> dict:
    profile = PROFILES[profile_id]
    return {
        **profile_payload(profile),
        "path": str(path),
        "root": str(path.parent),
        "kind": kind,
        "confidence": confidence,
        "detail": detail or kind,
    }


def _dedupe_sources(sources: list[dict]) -> list[dict]:
    seen = set()
    out = []
    for source in sources:
        key = (source["id"], source["path"], source["kind"])
        if key in seen:
            continue
        seen.add(key)
        out.append(source)
    return out


def _candidate_user_dirs(*parts: str) -> list[Path]:
    home = Path.home()
    candidates = [home.joinpath(*parts)]
    if platform.is_windows():
        for env_name in ("APPDATA", "LOCALAPPDATA", "USERPROFILE"):
            value = os.environ.get(env_name)
            if value:
                candidates.append(Path(value).joinpath(*parts))
    return list(dict.fromkeys(candidates))


def detect_serato() -> list[dict]:
    candidates = [platform.default_serato_dir()]
    for root in platform.library_roots():
        candidates.append(root / "_Serato_")

    sources = []
    for serato_dir in candidates:
        if not serato_dir.is_dir():
            continue
        has_database = (serato_dir / "database V2").is_file()
        has_crates = (serato_dir / "Subcrates").is_dir()
        if has_database or has_crates:
            detail = "database V2 + crates" if has_database and has_crates else "dossier _Serato_"
            sources.append(_source("serato", serato_dir, "Dossier _Serato_", "high", detail))
    return _dedupe_sources(sources)


def _read_rekordbox_options_json(path: Path) -> list[Path]:
    if not path.is_file():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []

    values = []
    if isinstance(data, dict):
        raw_options = data.get("options", [])
        if isinstance(raw_options, list):
            for item in raw_options:
                if not isinstance(item, (list, tuple)) or len(item) < 2:
                    continue
                key, value = item[0], item[1]
                if isinstance(key, str) and "db" in key.lower():
                    values.append(value)
        values.extend(value for key, value in data.items() if isinstance(key, str) and "db" in key.lower())

    paths = []
    for value in values:
        if not isinstance(value, str):
            continue
        candidate = Path(value).expanduser()
        if candidate.name.lower() == "master.db":
            paths.append(candidate)
        else:
            paths.append(candidate / "master.db")
    return paths


def detect_rekordbox() -> list[dict]:
    candidates = []
    for base in _candidate_user_dirs("Pioneer"):
        candidates.extend(
            [
                base / "rekordbox" / "master.db",
                base / "rekordbox6" / "master.db",
                base / "rekordbox7" / "master.db",
                base / "rekordboxAgent" / "storage" / "options.json",
            ]
        )

    if platform.is_macos():
        candidates.extend(
            [
                Path.home() / "Library" / "Application Support" / "Pioneer" / "rekordbox" / "master.db",
                Path.home() / "Library" / "Application Support" / "Pioneer" / "rekordboxAgent" / "storage" / "options.json",
            ]
        )

    sources = []
    for candidate in list(dict.fromkeys(candidates)):
        if candidate.name == "options.json":
            for db_path in _read_rekordbox_options_json(candidate):
                if db_path.is_file():
                    sources.append(_source("rekordbox", db_path, "master.db", "high", "Chemin lu dans options.json"))
            if candidate.is_file():
                sources.append(_source("rekordbox", candidate, "options.json", "medium", "Configuration rekordboxAgent"))
            continue
        if candidate.is_file():
            sources.append(_source("rekordbox", candidate, "master.db", "high", "Base maitre rekordbox"))

    for root in platform.library_roots():
        pioneer_dir = root / "PIONEER"
        if pioneer_dir.is_dir():
            sources.append(_source("rekordbox", pioneer_dir, "Export USB PIONEER", "medium", "Device Library / USB export"))
    return _dedupe_sources(sources)


def detect_traktor() -> list[dict]:
    candidates = []
    native_root = Path.home() / "Documents" / "Native Instruments"
    if native_root.is_dir():
        candidates.extend(native_root.glob("Traktor*/collection.nml"))
    for base in _candidate_user_dirs("Native Instruments"):
        candidates.extend(base.glob("Traktor*/collection.nml") if base.is_dir() else [])

    return _dedupe_sources(
        [_source("traktor", path, "collection.nml", "high", "Collection Traktor") for path in candidates if path.is_file()]
    )


def detect_virtualdj() -> list[dict]:
    candidates = []
    for base in [Path.home() / "Documents" / "VirtualDJ", Path.home() / "VirtualDJ"]:
        candidates.append(base / "database.xml")
        candidates.append(base)

    for root in platform.library_roots():
        candidates.extend([root / "VirtualDJ" / "database.xml", root / "VirtualDJ"])

    sources = []
    for candidate in list(dict.fromkeys(candidates)):
        if candidate.name == "database.xml" and candidate.is_file():
            sources.append(_source("virtualdj", candidate, "database.xml", "high", "Database VirtualDJ"))
        elif candidate.is_dir() and (candidate / "database.xml").is_file():
            sources.append(_source("virtualdj", candidate / "database.xml", "database.xml", "high", "Database VirtualDJ"))
    return _dedupe_sources(sources)


def detect_all() -> dict:
    sources = detect_serato() + detect_rekordbox() + detect_traktor() + detect_virtualdj()
    detected = {}
    for source in sources:
        detected.setdefault(source["id"], {**profile_payload(PROFILES[source["id"]]), "sources": []})
        detected[source["id"]]["sources"].append(source)

    softwares = list(detected.values())
    softwares.sort(key=lambda item: (not item["repairSupported"], item["name"].lower()))
    preferred = softwares[0]["id"] if softwares else "serato"
    return {
        "softwares": softwares,
        "preferredSoftwareId": preferred,
        "multipleDetected": len(softwares) > 1,
        "profiles": [profile_payload(profile) for profile in PROFILES.values()],
    }
