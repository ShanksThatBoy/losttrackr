# -*- mode: python ; coding: utf-8 -*-

from pathlib import Path

from PyInstaller.utils.hooks import collect_all


ROOT = Path(SPECPATH).parent
ICON = ROOT / "windows" / "generated" / "LostTrackr.ico"

webview_datas, webview_binaries, webview_hiddenimports = collect_all("webview")

datas = [
    (str(ROOT / "losttrackr_ui.html"), "."),
    (str(ROOT / "assets"), "assets"),
    (str(ROOT / "css"), "css"),
    (str(ROOT / "js"), "js"),
]
datas += webview_datas

a = Analysis(
    [str(ROOT / "losttrackr_app.py")],
    pathex=[str(ROOT)],
    binaries=webview_binaries,
    datas=datas,
    hiddenimports=webview_hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="LostTrackr",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch="x86_64",
    codesign_identity=None,
    entitlements_file=None,
    icon=str(ICON),
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="LostTrackr",
)
