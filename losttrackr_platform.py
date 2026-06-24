#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Platform helpers for LostTrackr macOS and Windows builds."""

from __future__ import annotations

import csv
import os
import re
import string
import subprocess
import sys
from pathlib import Path, PureWindowsPath


WINDOWS_SERATO_PROCESS_PREFIXES = ("serato dj", "seratodj")

WINDOWS_SKIP_DIR_NAMES = {
    "$RECYCLE.BIN",
    "AppData",
    "Config.Msi",
    "Intel",
    "Microsoft",
    "OneDriveTemp",
    "PerfLogs",
    "Program Files",
    "Program Files (x86)",
    "ProgramData",
    "Recovery",
    "System Volume Information",
    "Windows",
}

COMMON_SKIP_DIR_NAMES = {".cache", ".git", ".venv", "__pycache__", "node_modules"}


def is_windows() -> bool:
    return sys.platform.startswith("win")


def is_macos() -> bool:
    return sys.platform == "darwin"


def is_windows_absolute(path_str: str) -> bool:
    return bool(re.match(r"^[A-Za-z]:[\\/]", str(path_str))) or str(path_str).startswith("\\\\")


def windows_drive_from_path(path_str: str) -> str | None:
    match = re.match(r"^([A-Za-z]:)[\\/]", str(path_str))
    if match:
        return match.group(1).upper()
    return None


def system_drive() -> str:
    drive = os.environ.get("SystemDrive") or windows_drive_from_path(str(Path.home())) or "C:"
    return drive.rstrip("\\/")


def default_serato_dir() -> Path:
    return Path.home() / "Music" / "_Serato_"


def _windows_drive_type(root: str) -> int:
    if not is_windows():
        return 0
    try:
        import ctypes

        return int(ctypes.windll.kernel32.GetDriveTypeW(root))
    except Exception:
        return 0


def windows_drive_roots(include_cdrom: bool = False) -> list[Path]:
    if not is_windows():
        return []

    roots: list[Path] = []
    try:
        import ctypes

        mask = int(ctypes.windll.kernel32.GetLogicalDrives())
        for index, letter in enumerate(string.ascii_uppercase):
            if not mask & (1 << index):
                continue
            root = f"{letter}:\\"
            drive_type = _windows_drive_type(root)
            if drive_type == 5 and not include_cdrom:
                continue
            roots.append(Path(root))
    except Exception:
        roots.append(Path(f"{system_drive()}\\"))

    return list(dict.fromkeys(roots))


def macos_volume_roots() -> list[Path]:
    volumes = Path("/Volumes")
    if not volumes.is_dir():
        return []
    return [volume for volume in volumes.iterdir() if volume.is_dir()]


def library_roots() -> list[Path]:
    if is_windows():
        return windows_drive_roots()
    if is_macos():
        return macos_volume_roots()
    return []


def library_label(serato_dir: Path) -> str:
    if is_windows():
        drive = windows_drive_from_path(str(serato_dir))
        return drive or "Windows"

    parent = serato_dir.parent
    if parent.parent == Path("/Volumes"):
        return parent.name
    return "Macintosh HD"


def library_volume_root(serato_dir: Path | str) -> Path:
    if is_windows():
        drive = windows_drive_from_path(str(serato_dir)) or system_drive()
        return Path(f"{drive}\\")

    resolved = Path(serato_dir).resolve()
    if resolved.parent.parent == Path("/Volumes"):
        return resolved.parent
    return Path("/")


def user_search_roots() -> list[Path]:
    home = Path.home()
    roots = [home / "Music", home / "Desktop", home / "Documents", home / "Downloads"]
    if not is_windows():
        roots.insert(0, home)
    return [root for root in dict.fromkeys(roots) if root.is_dir()]


def default_search_roots(libraries: list[dict]) -> list[str]:
    roots = list(user_search_roots())

    if is_windows():
        current_system_drive = system_drive().upper()
        for root in windows_drive_roots():
            drive = windows_drive_from_path(str(root))
            if drive and drive.upper() != current_system_drive:
                roots.append(root)
    else:
        for library in libraries:
            root = Path(library["root"])
            if root.is_dir() and root.parent == Path("/Volumes"):
                roots.append(root)

    return [str(root) for root in dict.fromkeys(roots)]


def keep_walk_dir(name: str) -> bool:
    if name in COMMON_SKIP_DIR_NAMES:
        return False
    if is_windows() and name in WINDOWS_SKIP_DIR_NAMES:
        return False
    if name.startswith("."):
        return False
    if name.startswith((".venv", "venv", "env")):
        return False
    if name.endswith((".app", ".framework", ".photoslibrary")):
        return False
    return True


def stored_candidates(stored: str, serato_dir: Path | str) -> list[str]:
    stored_text = str(stored)
    if is_windows():
        normalized = stored_text.replace("/", "\\")
        if is_windows_absolute(normalized):
            return [normalized]

        relative = normalized.lstrip("\\/")
        roots = [library_volume_root(serato_dir), Path(f"{system_drive()}\\")]
        candidates = [str(PureWindowsPath(str(root)) / relative) for root in roots]
        return list(dict.fromkeys(candidates))

    if stored_text.startswith("/"):
        return [stored_text]

    candidates = ["/" + stored_text]
    volume_root = library_volume_root(serato_dir)
    if volume_root != Path("/"):
        candidates.insert(0, str(volume_root / stored_text))
    return list(dict.fromkeys(candidates))


def display_path(stored: str, serato_dir: Path | str) -> str:
    candidates = stored_candidates(stored, serato_dir)
    return candidates[0] if candidates else str(stored)


def new_stored_path(old_stored: str, real_path: str | Path, serato_dir: Path | str) -> str:
    if is_windows():
        old_normalized = str(old_stored).replace("/", "\\")
        real = PureWindowsPath(str(real_path))
        if is_windows_absolute(old_normalized):
            return str(real)

        volume_root = PureWindowsPath(str(library_volume_root(serato_dir)))
        try:
            return str(real.relative_to(volume_root))
        except ValueError:
            return str(real)

    real = Path(real_path)
    if str(old_stored).startswith("/"):
        return str(real)

    volume_root = library_volume_root(serato_dir)
    if volume_root != Path("/"):
        try:
            return str(real.relative_to(volume_root))
        except ValueError:
            pass
    return str(real).lstrip("/")


def serato_running() -> bool:
    if is_windows():
        try:
            result = subprocess.run(
                ["tasklist", "/FO", "CSV", "/NH"],
                capture_output=True,
                text=True,
                timeout=6,
                check=False,
            )
        except Exception:
            return False

        for row in csv.reader(result.stdout.splitlines()):
            if not row:
                continue
            image_name = row[0].strip().lower()
            if any(image_name.startswith(prefix) for prefix in WINDOWS_SERATO_PROCESS_PREFIXES):
                return True
        return False

    try:
        out = subprocess.run(["pgrep", "-f", "Serato DJ"], capture_output=True, text=True)
        pids = [p for p in out.stdout.split() if p and int(p) != os.getpid()]
        return bool(pids)
    except Exception:
        return False


def webview2_runtime_installed() -> bool:
    if not is_windows():
        return True

    try:
        import winreg
    except Exception:
        return True

    client_guid = r"{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
    roots = (winreg.HKEY_LOCAL_MACHINE, winreg.HKEY_CURRENT_USER)
    subkeys = (
        rf"SOFTWARE\Microsoft\EdgeUpdate\Clients\{client_guid}",
        rf"SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{client_guid}",
    )

    for root in roots:
        for subkey in subkeys:
            try:
                with winreg.OpenKey(root, subkey) as key:
                    version, _kind = winreg.QueryValueEx(key, "pv")
                    if version:
                        return True
            except OSError:
                continue
    return False


def show_native_message(title: str, message: str) -> None:
    if not is_windows():
        return
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(None, message, title, 0x40)
    except Exception:
        return
