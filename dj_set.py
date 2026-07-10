#!/usr/bin/env python3
"""DJ set planning for LostTrackr."""

from __future__ import annotations

from pathlib import Path

import smart_import

CONFIDENCE_LABELS = smart_import.CONFIDENCE_LABELS
EVENT_TEMPLATES = {
    "club": {
        "label": "Club",
        "headline": "Structure Club proposée",
        "buckets": [
            {
                "id": "warmup",
                "name": "Warmup",
                "genres": {"Warmup", "R&B", "Disco Funk", "Gospel"},
                "keywords": {"warmup", "warm up", "opening", "lounge", "intro", "slow"},
                "reason": "Phase d'accueil et montée progressive",
            },
            {
                "id": "groove",
                "name": "Groove",
                "genres": {"Afro", "Latino", "Brazil", "Dancehall"},
                "keywords": {"afro", "latino", "latin", "reggaeton", "dancehall", "shatta", "brazil", "brasil"},
                "reason": "Bloc groove pour installer la piste",
            },
            {
                "id": "peak",
                "name": "Peak Time",
                "genres": {"Club", "House", "Electro", "Techno", "Pop", "Hip-Hop"},
                "keywords": {"club", "peak", "anthem", "banger", "house", "edm", "techno", "hit", "rap"},
                "reason": "Moment fort du set",
            },
            {
                "id": "closing",
                "name": "Closing",
                "genres": set(),
                "keywords": {"closing", "last", "final", "end", "outro"},
                "reason": "Fin de set et titres de sortie",
            },
        ],
    },
    "wedding": {
        "label": "Mariage",
        "headline": "Structure Mariage proposée",
        "buckets": [
            {
                "id": "ceremony",
                "name": "Cérémonie",
                "genres": {"Gospel"},
                "keywords": {"ceremonie", "cérémonie", "wedding", "choir", "gospel", "acoustic"},
                "reason": "Moment cérémoniel ou émotionnel",
            },
            {
                "id": "cocktail",
                "name": "Cocktail",
                "genres": {"Warmup", "Disco Funk", "R&B"},
                "keywords": {"cocktail", "lounge", "warmup", "soul", "jazz", "chill"},
                "reason": "Ambiance élégante et progressive",
            },
            {
                "id": "dinner",
                "name": "Dîner",
                "genres": {"Pop", "R&B", "Disco Funk"},
                "keywords": {"dinner", "diner", "dîner", "slow", "love", "radio"},
                "reason": "Fond musical facile à écouter",
            },
            {
                "id": "opening",
                "name": "Ouverture de bal",
                "genres": set(),
                "keywords": {"opening", "first dance", "ouverture", "wedding", "love"},
                "reason": "Temps fort à valider manuellement",
            },
            {
                "id": "dancefloor",
                "name": "Dancefloor",
                "genres": {"Club", "House", "Electro", "Afro", "Latino", "Dancehall", "Hip-Hop"},
                "keywords": {"club", "dancefloor", "party", "peak", "anthem", "latino", "afro", "rap"},
                "reason": "Piste de danse et montée d'énergie",
            },
            {
                "id": "closing",
                "name": "Fin de soirée",
                "genres": set(),
                "keywords": {"closing", "last", "final", "end", "outro"},
                "reason": "Fin de soirée et derniers titres",
            },
        ],
    },
}


def confidence_label(value: str) -> str:
    return CONFIDENCE_LABELS.get(value, CONFIDENCE_LABELS["low"])


def active_software_payload(detection: dict | None = None) -> dict:
    detected = (detection or {}).get("softwares") or []
    if detected:
        return detected[0]
    return {
        "id": "serato",
        "name": "Serato DJ",
        "containerName": "crate",
        "containerPlural": "crates",
        "groupName": "subcrates",
    }


def track_label(file_item: dict) -> str:
    artist = file_item.get("artist") or ""
    title = file_item.get("title") or file_item.get("file") or "Titre"
    return f"{artist} - {title}" if artist else title


def track_text(file_item: dict) -> str:
    values = [
        file_item.get("file", ""),
        file_item.get("artist", ""),
        file_item.get("title", ""),
        file_item.get("genre", ""),
        " ".join(file_item.get("genreHints") or []),
        file_item.get("destinationFolderDisplay", ""),
        file_item.get("destinationDisplay", ""),
    ]
    return " ".join(str(value or "") for value in values)


def event_template(event_type: str | None = None) -> dict:
    return EVENT_TEMPLATES.get(event_type or "club", EVENT_TEMPLATES["club"])


def event_bucket_for(file_item: dict, event_type: str | None = None) -> tuple[dict | None, str]:
    genre = file_item.get("genre")
    hints = set(file_item.get("genreHints") or [])
    if genre and genre != "A verifier":
        hints.add(genre)
    normalized = smart_import.normalize_text(track_text(file_item))
    for bucket in event_template(event_type)["buckets"]:
        if hints & bucket["genres"]:
            return bucket, "high"
        if any(keyword in normalized for keyword in bucket["keywords"]):
            return bucket, "medium"
    return None, "review"


def target_score(file_item: dict, target: dict) -> int:
    target_text = smart_import.normalize_text(" ".join([
        target.get("name", ""),
        " ".join(target.get("sampleFiles") or []),
    ]))
    target_tokens = smart_import.text_tokens(target_text)
    genre = file_item.get("genre") or ""
    hints = set(file_item.get("genreHints") or [])
    if genre and genre != "A verifier":
        hints.add(genre)

    score = 0
    for hint in hints:
        normalized_hint = smart_import.normalize_text(hint)
        if normalized_hint and normalized_hint in target_text:
            score += 8
        if any(needle in target_text for needle in smart_import.GENRE_KEYWORDS.get(hint, ())):
            score += 5

    artist_matches = smart_import.text_tokens(file_item.get("artist", "")) & target_tokens
    title_matches = smart_import.text_tokens(file_item.get("title", "")) & target_tokens
    score += 4 * len(artist_matches)
    score += len(title_matches)
    return score


def best_existing_target(file_item: dict, targets: list[dict]) -> tuple[dict | None, int]:
    scored = sorted(((target_score(file_item, target), target) for target in targets), key=lambda item: item[0], reverse=True)
    if not scored or scored[0][0] <= 0:
        return None, 0
    return scored[0][1], scored[0][0]


def item_payload(file_item: dict, target_name: str, target_type: str, confidence: str, reason: str, software: dict) -> dict:
    return {
        "id": smart_import.stable_id(f"{file_item.get('id')}::{target_name}", "djitem_"),
        "fileId": file_item.get("id"),
        "file": file_item.get("file"),
        "title": file_item.get("title") or file_item.get("file"),
        "artist": file_item.get("artist", ""),
        "trackLabel": track_label(file_item),
        "sourceDisplay": file_item.get("destinationDisplay") or file_item.get("sourceDisplay") or "",
        "targetName": target_name,
        "targetType": target_type,
        "confidence": confidence,
        "confidenceLabel": confidence_label(confidence),
        "reason": reason,
        "softwareId": software.get("id", "serato"),
        "softwareName": software.get("name", "Serato DJ"),
        "containerName": software.get("containerName", "crate"),
    }


def group_items(items: list[dict], software: dict, mode: str) -> list[dict]:
    grouped: dict[str, list[dict]] = {}
    order: list[str] = []
    for item in items:
        target = item["targetName"]
        if target not in grouped:
            grouped[target] = []
            order.append(target)
        grouped[target].append(item)

    groups = []
    for target in order:
        rows = grouped[target]
        confidences = {row.get("confidence") for row in rows}
        confidence = "review" if "review" in confidences else ("medium" if "medium" in confidences else "high")
        target_type = "existing" if any(row.get("targetType") == "existing" for row in rows) else "new"
        reason = rows[0].get("reason") or "Suggestion LostTrackr"
        groups.append(
            {
                "id": smart_import.stable_id(f"{mode}::{target}", "djgrp_"),
                "name": target,
                "targetName": target,
                "targetType": target_type,
                "trackCount": len(rows),
                "confidence": confidence,
                "confidenceLabel": confidence_label(confidence),
                "status": "review" if confidence == "review" else "suggested",
                "reason": reason,
                "softwareName": software.get("name", "Serato DJ"),
                "containerName": software.get("containerName", "crate"),
                "items": [row["id"] for row in rows],
            }
        )
    groups.sort(key=lambda group: (group["confidence"] == "review", group["targetType"] != "existing", -group["trackCount"], group["name"]))
    return groups


def event_skeleton_groups(software: dict, event_type: str | None = None) -> list[dict]:
    groups = []
    for bucket in event_template(event_type)["buckets"]:
        groups.append(
            {
                "id": smart_import.stable_id(f"event::{bucket['id']}", "djgrp_"),
                "name": bucket["name"],
                "targetName": bucket["name"],
                "targetType": "new",
                "trackCount": 0,
                "confidence": "medium",
                "confidenceLabel": confidence_label("medium"),
                "status": "suggested",
                "reason": bucket["reason"],
                "softwareName": software.get("name", "Serato DJ"),
                "containerName": software.get("containerName", "crate"),
                "items": [],
            }
        )
    return groups


def target_audit_groups(targets: list[dict], software: dict) -> list[dict]:
    groups = []
    for target in targets[:12]:
        sample_text = " ".join(target.get("sampleFiles") or [])
        genres = sorted(smart_import.infer_genres_from_text(f"{target.get('name', '')} {sample_text}"))
        reason = "Genre dominant détecté" if genres else "Playlist existante à analyser"
        if genres:
            reason = f"Cohérence {', '.join(genres[:2])} détectée"
        groups.append(
            {
                "id": smart_import.stable_id(f"audit::{target.get('path') or target.get('name')}", "djgrp_"),
                "name": target.get("name") or "Playlist",
                "targetName": target.get("name") or "Playlist",
                "targetType": "existing",
                "trackCount": int(target.get("trackCount") or 0),
                "confidence": "medium" if genres else "review",
                "confidenceLabel": confidence_label("medium" if genres else "review"),
                "status": "suggested" if genres else "review",
                "reason": reason,
                "softwareName": software.get("name", "Serato DJ"),
                "containerName": software.get("containerName", "crate"),
                "items": [],
            }
        )
    return groups


def build_event_plan(files: list[dict], software: dict, event_type: str | None = None) -> tuple[list[dict], list[dict]]:
    items = []
    for file_item in files:
        bucket, confidence = event_bucket_for(file_item, event_type)
        if bucket:
            target_name = bucket["name"]
            reason = bucket["reason"]
            target_type = "new"
        else:
            target_name = "À vérifier"
            reason = "Titre à vérifier avant de l'intégrer à un évènement"
            target_type = "new"
        items.append(item_payload(file_item, target_name, target_type, confidence, reason, software))
    groups = group_items(items, software, f"event:{event_type or 'club'}") if items else event_skeleton_groups(software, event_type)
    return items, groups


def build_organize_plan(files: list[dict], software: dict, existing_targets: list[dict]) -> tuple[list[dict], list[dict]]:
    items = []
    for file_item in files:
        best, score = best_existing_target(file_item, existing_targets)
        if best and score >= 5:
            confidence = "high" if score >= 8 else "medium"
            target_name = best.get("name") or "Playlist existante"
            target_type = "existing"
            reason = f"Cohérent avec {target_name}"
        else:
            genre = smart_import.clean_name(file_item.get("genre"), "A verifier")
            target_name = f"LostTrackr - {genre if genre != 'A verifier' else 'A verifier'}"
            target_type = "new"
            confidence = "medium" if genre != "A verifier" else "review"
            reason = "Nouvelle playlist proposée" if genre != "A verifier" else "Titre à vérifier avant classement"
        items.append(item_payload(file_item, target_name, target_type, confidence, reason, software))
    groups = group_items(items, software, "organize") if items else target_audit_groups(existing_targets, software)
    return items, groups


def build_recent_imports_plan(files: list[dict], software: dict, existing_targets: list[dict]) -> tuple[list[dict], list[dict]]:
    return build_organize_plan(files, software, existing_targets)


def summarize(groups: list[dict], items: list[dict]) -> dict:
    return {
        "groupCount": len(groups),
        "itemCount": len(items),
        "reliableCount": sum(group["trackCount"] for group in groups if group["confidence"] in {"high", "medium"}),
        "reviewCount": sum(group["trackCount"] for group in groups if group["confidence"] == "review"),
        "newTargetCount": sum(1 for group in groups if group["targetType"] == "new"),
        "existingTargetCount": sum(1 for group in groups if group["targetType"] == "existing"),
    }


def build_plan(
    mode: str = "event",
    files: list[dict] | None = None,
    software_detection: dict | None = None,
    existing_targets: list[dict] | None = None,
    event_type: str | None = None,
) -> dict:
    normalized_mode = mode if mode in {"event", "organize", "recent_imports"} else "event"
    normalized_event_type = "wedding" if event_type == "wedding" else "club"
    software = active_software_payload(software_detection)
    source_files = list(files or [])
    targets = list(existing_targets or [])
    if normalized_mode == "organize":
        items, groups = build_organize_plan(source_files, software, targets)
        mode_label = "Organiser mes playlists"
        headline = "Cohérence des playlists"
    elif normalized_mode == "recent_imports":
        items, groups = build_recent_imports_plan(source_files, software, targets)
        mode_label = "Envoyer mes derniers imports dans les crates"
        headline = "Derniers imports à envoyer"
    else:
        template = event_template(normalized_event_type)
        items, groups = build_event_plan(source_files, software, normalized_event_type)
        mode_label = f"Préparer un évènement {template['label'].lower()}"
        headline = template["headline"]

    return {
        "mode": normalized_mode,
        "eventType": normalized_event_type if normalized_mode == "event" else None,
        "modeLabel": mode_label,
        "headline": headline,
        "activeSoftware": software,
        "containerName": software.get("containerName", "crate"),
        "containerPlural": software.get("containerPlural", "crates"),
        "writeMode": "backup_required",
        "requiresBackup": True,
        "source": "recent_smart_import" if source_files else ("no_recent_smart_import" if normalized_mode == "recent_imports" else "library_preview"),
        "totals": summarize(groups, items),
        "groups": groups,
        "items": items,
        "existingTargets": targets[:24],
    }


def display_mock_path(track: dict, style: str) -> str:
    import os
    home = Path.home()
    path = home / "Music" / "LostTrackr Library" / style / f"{track['artist']} - {track['title']}.mp3"
    if os.name != "nt":
        return smart_import.display_path(path)
    return str(path)


def build_style_inspiration_plan(options: dict, local_tracks: list[dict] | None = None) -> dict:
    import re

    from providers.mock_streaming_provider import MockStreamingProvider

    options = options or {}
    style = options.get("style", "Afro House")
    mood = options.get("mood", "Club")
    source = options.get("source", "deezer")
    limit = int(options.get("limit", 40))
    local_only = bool(options.get("localOnly", False) or options.get("local_only", False))

    provider = MockStreamingProvider(provider_id=source, display_name=source.capitalize())
    tracks = provider.search_style_tracks(style=style, mood=mood, limit=limit)

    # Pre-build a map of normalized title/artist for local tracks
    def normalize(s):
        if not s:
            return ""
        return re.sub(r'[^a-z0-9]', '', str(s).lower())

    local_map = {}
    if local_tracks:
        for t in local_tracks:
            title_norm = normalize(t.get("title"))
            artist_norm = normalize(t.get("artist"))
            if title_norm and artist_norm:
                local_map[(title_norm, artist_norm)] = t
                if title_norm not in local_map:
                    local_map[title_norm] = t

    result_items = []
    for index, track in enumerate(tracks):
        track_title = normalize(track["title"])
        track_artist = normalize(track["artist"])

        matched_track = None
        if (track_title, track_artist) in local_map:
            matched_track = local_map[(track_title, track_artist)]
            status = "local"
            match_score = 100
            reason = "Présent dans la bibliothèque"
            local_path = matched_track.get("destination") or matched_track.get("source") or matched_track.get("file")
        elif track_title in local_map:
            matched_track = local_map[track_title]
            status = "probable"
            match_score = 85
            reason = "Nom concordant, artiste à vérifier"
            local_path = matched_track.get("destination") or matched_track.get("source") or matched_track.get("file")
        else:
            # Deterministic mock matching
            mod = index % 4
            if mod == 0:
                status = "local"
                match_score = 100
                reason = "Présent dans la bibliothèque (Aperçu)"
                local_path = display_mock_path(track, style)
            elif mod == 1:
                status = "probable"
                match_score = 85
                reason = "Match probable (Aperçu)"
                local_path = display_mock_path(track, style)
            elif mod == 2:
                status = "missing"
                match_score = 0
                reason = "Non trouvé localement (Aperçu)"
                local_path = None
            else:
                # Mod 3: review or local
                if (index // 4) % 2 == 0:
                    status = "review"
                    match_score = 60
                    reason = "À vérifier (Aperçu)"
                    local_path = display_mock_path(track, style)
                else:
                    status = "local"
                    match_score = 100
                    reason = "Présent dans la bibliothèque (Aperçu)"
                    local_path = display_mock_path(track, style)

        # Determine knowledgeStatus & canonical
        # index % 3 == 0: known, 1: unknown, 2: pending_enrichment
        k_mod = index % 3
        if k_mod == 0:
            knowledge_status = "known"
        elif k_mod == 1:
            knowledge_status = "unknown"
        else:
            knowledge_status = "pending_enrichment"

        canonical = None
        if knowledge_status == "known":
            canonical = {
                "title": track["title"],
                "artist": track["artist"],
                "album": track["album"],
                "isrc": track["isrc"]
            }

        result_items.append({
            "id": f"style_{index + 1}",
            "title": track["title"],
            "artist": track["artist"],
            "trackLabel": f"{track['artist']} - {track['title']}",
            "provider": source,
            "providerTrackId": track["provider_track_id"],
            "sourcePlaylistName": track["source_playlist_name"],
            "status": status,
            "statusLabel": "Présent localement" if status == "local" else ("Match probable" if status == "probable" else ("À vérifier" if status == "review" else "Absent de la bibliothèque")),
            "matchScore": match_score,
            "localPath": local_path,
            "durationMs": track["duration_ms"],
            "isrc": track["isrc"],
            "isSelectable": status in {"local", "probable"},
            "reason": reason,
            "knowledgeStatus": knowledge_status,
            "canonical": canonical
        })

    total = len(result_items)
    local_count = sum(1 for item in result_items if item["status"] == "local")
    probable_count = sum(1 for item in result_items if item["status"] == "probable")
    review_count = sum(1 for item in result_items if item["status"] == "review")
    missing_count = sum(1 for item in result_items if item["status"] == "missing")

    # Filter items if local_only is True
    filtered_items = result_items
    if local_only:
        filtered_items = [item for item in result_items if item["status"] != "missing"]

    visible_count = len(filtered_items)

    return {
        "mode": "style_inspiration",
        "headline": "Inspiration par style",
        "modeLabel": f"Inspiration {style} · {mood}",
        "provider": {
            "id": source,
            "name": "Spotify" if source == "spotify" else ("Apple Music" if source == "apple_music" else "Deezer"),
            "mode": "mock",
            "label": "Mode aperçu"
        },
        "options": {
            "style": style,
            "mood": mood,
            "source": source,
            "limit": limit,
            "localOnly": local_only
        },
        "totals": {
            "total": total,
            "local": local_count,
            "probable": probable_count,
            "review": review_count,
            "missing": missing_count,
            "visible": visible_count
        },
        "items": filtered_items
    }

