#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Secure update checks for LostTrackr.

The updater is intentionally installer-driven: it detects, downloads, verifies,
and launches the platform installer. It does not silently replace files.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path


APP_VERSION = "1.4.0"
DEFAULT_CHANNEL = os.environ.get("LOSTTRACKR_UPDATE_CHANNEL", "beta")
DEFAULT_MANIFEST_URL = os.environ.get(
    "LOSTTRACKR_UPDATE_MANIFEST_URL",
    f"https://updates.losttrackr.com/{DEFAULT_CHANNEL}/latest.json",
)
REQUEST_TIMEOUT_SECONDS = 8
DOWNLOAD_TIMEOUT_SECONDS = 45

UPDATE_PUBLIC_KEY_PEM = b"""-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAIF5XhW90rQ4dvyNXu/T9sPgBCKiCUPlCKFWfgqJqdvc=
-----END PUBLIC KEY-----
"""


class UpdateError(RuntimeError):
    """Raised when update data cannot be trusted or installed."""


def platform_key():
    if sys.platform == "darwin":
        return "macos"
    if sys.platform.startswith("win"):
        return "windows"
    return sys.platform


def cache_dir():
    if sys.platform == "darwin":
        root = Path.home() / "Library" / "Caches" / "LostTrackr" / "Updates"
    elif sys.platform.startswith("win"):
        root = Path(os.environ.get("LOCALAPPDATA", tempfile.gettempdir())) / "LostTrackr" / "Updates"
    else:
        root = Path(os.environ.get("XDG_CACHE_HOME", Path.home() / ".cache")) / "losttrackr" / "updates"
    root.mkdir(parents=True, exist_ok=True)
    return root


def install_id_path():
    if sys.platform == "darwin":
        root = Path.home() / "Library" / "Application Support" / "LostTrackr"
    elif sys.platform.startswith("win"):
        root = Path(os.environ.get("APPDATA", tempfile.gettempdir())) / "LostTrackr"
    else:
        root = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config")) / "losttrackr"
    root.mkdir(parents=True, exist_ok=True)
    return root / "install_id"


def get_install_id():
    path = install_id_path()
    try:
        existing = path.read_text(encoding="utf-8").strip()
        if existing:
            return existing
    except OSError:
        pass
    value = str(uuid.uuid4())
    try:
        path.write_text(value, encoding="utf-8")
    except OSError:
        pass
    return value


def parse_version(version):
    cleaned = str(version or "").strip().lower().lstrip("v")
    main, _, suffix = cleaned.partition("-")
    numbers = [int(part) for part in re.findall(r"\d+", main)[:4]]
    while len(numbers) < 3:
        numbers.append(0)
    prerelease = 0 if not suffix else -1
    return (*numbers, prerelease, suffix)


def compare_versions(left, right):
    parsed_left = parse_version(left)
    parsed_right = parse_version(right)
    return (parsed_left > parsed_right) - (parsed_left < parsed_right)


def canonical_manifest_bytes(manifest):
    return json.dumps(manifest, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")


def request_bytes(url, timeout=REQUEST_TIMEOUT_SECONDS):
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json,*/*",
            "User-Agent": f"LostTrackr/{APP_VERSION} updater",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read()
    except urllib.error.URLError as exc:
        raise UpdateError(f"Impossible de joindre le serveur de mise a jour: {exc}") from exc


def load_manifest(manifest_url=DEFAULT_MANIFEST_URL):
    manifest_bytes = request_bytes(manifest_url)
    try:
        manifest = json.loads(manifest_bytes.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise UpdateError("Manifest de mise a jour illisible.") from exc

    signature_url = f"{manifest_url}.sig"
    signature = request_bytes(signature_url)
    verify_manifest_signature(manifest, signature)
    return manifest


def verify_manifest_signature(manifest, signature):
    try:
        from cryptography.exceptions import InvalidSignature
        from cryptography.hazmat.primitives import serialization
    except ImportError as exc:
        raise UpdateError("Module de verification cryptographique absent.") from exc

    public_key = serialization.load_pem_public_key(UPDATE_PUBLIC_KEY_PEM)
    raw_signature = signature.strip()
    try:
        raw_signature = base64.b64decode(raw_signature, validate=True)
    except Exception:
        pass
    try:
        public_key.verify(raw_signature, canonical_manifest_bytes(manifest))
    except InvalidSignature as exc:
        raise UpdateError("Signature du manifest de mise a jour invalide.") from exc


def rollout_allows(manifest, install_id=None):
    rollout = int(manifest.get("rollout", 100))
    if rollout >= 100:
        return True
    if rollout <= 0:
        return False
    install_id = install_id or get_install_id()
    digest = hashlib.sha256(install_id.encode("utf-8")).digest()
    bucket = int.from_bytes(digest[:2], "big") % 100
    return bucket < rollout


def validate_asset(manifest, platform=None):
    platform = platform or platform_key()
    asset = manifest.get(platform)
    if not isinstance(asset, dict):
        raise UpdateError(f"Aucun installateur disponible pour {platform}.")
    url = asset.get("url")
    sha256 = asset.get("sha256")
    if not url or not sha256:
        raise UpdateError("Manifest incomplet: URL ou SHA256 manquant.")
    if not re.fullmatch(r"[0-9a-fA-F]{64}", str(sha256)):
        raise UpdateError("Manifest invalide: SHA256 incorrect.")
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https":
        raise UpdateError("Manifest invalide: l'installateur doit utiliser HTTPS.")
    return asset


def check_for_update(current_version=APP_VERSION, manifest_url=DEFAULT_MANIFEST_URL):
    manifest = load_manifest(manifest_url)
    latest = str(manifest.get("latest") or "").lstrip("v")
    if not latest:
        raise UpdateError("Manifest incomplet: version absente.")

    minimum_supported = str(manifest.get("minimum_supported") or latest).lstrip("v")
    update_available = compare_versions(latest, current_version) > 0
    forced = compare_versions(current_version, minimum_supported) < 0 or bool(manifest.get("mandatory", False))
    allowed = rollout_allows(manifest)

    asset = None
    if update_available and allowed:
        asset = validate_asset(manifest)

    return {
        "ok": True,
        "currentVersion": current_version,
        "latestVersion": latest,
        "channel": manifest.get("channel", DEFAULT_CHANNEL),
        "updateAvailable": bool(update_available and allowed),
        "rolloutAllowed": bool(allowed),
        "mandatory": bool(forced),
        "notesUrl": manifest.get("notes_url"),
        "summary": manifest.get("summary") or "",
        "asset": asset,
    }


def file_sha256(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def download_update(asset):
    url = asset["url"]
    expected = asset["sha256"].lower()
    parsed = urllib.parse.urlparse(url)
    filename = Path(parsed.path).name or "LostTrackr-update"
    destination = cache_dir() / filename
    tmp_destination = destination.with_suffix(destination.suffix + ".part")

    request = urllib.request.Request(url, headers={"User-Agent": f"LostTrackr/{APP_VERSION} updater"})
    try:
        with urllib.request.urlopen(request, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response, tmp_destination.open("wb") as fh:
            while True:
                chunk = response.read(1024 * 512)
                if not chunk:
                    break
                fh.write(chunk)
    except urllib.error.URLError as exc:
        raise UpdateError(f"Telechargement de la mise a jour impossible: {exc}") from exc

    actual = file_sha256(tmp_destination)
    if actual.lower() != expected:
        try:
            tmp_destination.unlink()
        except OSError:
            pass
        raise UpdateError("Le fichier telecharge ne correspond pas au SHA256 attendu.")

    tmp_destination.replace(destination)
    return destination


def launch_installer(installer_path):
    installer = Path(installer_path)
    if sys.platform == "darwin":
        subprocess.Popen(["open", str(installer)])
    elif sys.platform.startswith("win"):
        os.startfile(str(installer))  # type: ignore[attr-defined]
    else:
        subprocess.Popen([str(installer)])
    return {"launched": True, "path": str(installer)}


def install_latest_update(current_version=APP_VERSION, manifest_url=DEFAULT_MANIFEST_URL):
    result = check_for_update(current_version=current_version, manifest_url=manifest_url)
    if not result["updateAvailable"]:
        return {**result, "launched": False, "message": "LostTrackr est deja a jour."}
    installer = download_update(result["asset"])
    launch = launch_installer(installer)
    return {**result, **launch, "installerPath": str(installer)}
