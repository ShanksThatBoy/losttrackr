#!/usr/bin/env python3
"""Client du LostTrackr Knowledge API (knowledge.losttrackr.com).

Réservé aux métadonnées nettoyées : jamais de chemins de fichiers, de noms de
dossiers, de crates/playlists, de commentaires ni d'historique. Le serveur
rejette de toute façon tout champ hors allowlist.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request

KNOWLEDGE_BASE_URL = os.environ.get(
    "LOSTTRACKR_KNOWLEDGE_URL", "https://knowledge.losttrackr.com/v1"
)
REQUEST_TIMEOUT_SECONDS = 8
ALLOWED_TRACK_FIELDS = {
    "client_track_id", "title", "artist", "album", "duration_ms",
    "bpm", "camelot_key", "genre", "isrc", "source_app",
}


class KnowledgeError(Exception):
    def __init__(self, message, retryable=True):
        super().__init__(message)
        self.retryable = retryable


def _request(path, payload=None, timeout=None):
    url = f"{KNOWLEDGE_BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "LostTrackr"},
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout or REQUEST_TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        try:
            body = json.loads(exc.read().decode("utf-8"))
            error = body.get("error", {})
            raise KnowledgeError(
                error.get("message", "Le centre de connaissances a refusé la requête."),
                retryable=bool(error.get("retryable", False)),
            ) from exc
        except (ValueError, KeyError):
            raise KnowledgeError("Réponse inattendue du centre de connaissances.") from exc
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        raise KnowledgeError(
            "LostTrackr n'arrive pas à joindre le centre de connaissances."
        ) from exc


def sanitize_track(track):
    """Ne garde que les champs autorisés — filtre privacy côté app."""
    return {k: v for k, v in dict(track or {}).items()
            if k in ALLOWED_TRACK_FIELDS and v not in (None, "")}


def health():
    return _request("/health")


def match_tracks(tracks):
    """Identifie une liste de morceaux (métadonnées nettoyées uniquement)."""
    cleaned = [sanitize_track(t) for t in tracks if t and t.get("title")]
    if not cleaned:
        return {"matches": []}
    results = []
    for start in range(0, len(cleaned), 200):
        chunk = cleaned[start:start + 200]
        response = _request("/catalog/match", {"tracks": chunk})
        results.extend(response.get("matches", []))
    return {"matches": results}


# lt-intelligence — identification par empreinte acoustique + repli texte serveur.
# L'empreinte est dérivée du signal, titre/artiste viennent des tags/nom nettoyés :
# jamais de chemin, dossier, crate ni commentaire.
ALLOWED_FINGERPRINT_FIELDS = {"client_track_id", "fingerprint", "duration", "title", "artist"}


# Un titre jamais vu coûte ~1,5 s côté serveur (AcoustID + MusicBrainz
# rate-limités, séquentiels) : de petits lots gardent chaque requête courte,
# et un timeout généreux absorbe le pire cas d'un lot 100 % froid.
RESOLVE_CHUNK_SIZE = 8
RESOLVE_TIMEOUT_SECONDS = 45


def resolve_fingerprints(tracks, on_progress=None):
    """Identifie des morceaux (empreinte et/ou titre+artiste) via lt-intelligence.

    Le serveur cascade : cache → AcoustID → recherche texte MusicBrainz, renvoie
    l'identité + le canonique consolidé (bpm, clé, genre, année, drapeaux) et
    déclenche l'enrichissement DSP pour les features manquantes.

    Tolérant aux pannes partielles : un lot en échec est ignoré (ses titres
    resteront « Incomplet » pour ce scan) au lieu de faire échouer tout le scan.
    `on_progress(done, total)` est appelé après chaque lot.
    """
    cleaned = [
        {k: v for k, v in dict(t or {}).items()
         if k in ALLOWED_FINGERPRINT_FIELDS and v not in (None, "")}
        for t in tracks
        if t and (t.get("fingerprint") or t.get("title"))
    ]
    if not cleaned:
        return {"results": []}
    results = []
    total = len(cleaned)
    for start in range(0, total, RESOLVE_CHUNK_SIZE):
        chunk = cleaned[start:start + RESOLVE_CHUNK_SIZE]
        try:
            response = _request("/intelligence/resolve", {"tracks": chunk},
                                timeout=RESOLVE_TIMEOUT_SECONDS)
            results.extend(response.get("results", []))
        except KnowledgeError as exc:
            print(f"resolve_fingerprints: lot {start}-{start + len(chunk)} en échec: {exc}")
        if on_progress:
            try:
                on_progress(min(start + len(chunk), total), total)
            except Exception:
                pass
    return {"results": results}
