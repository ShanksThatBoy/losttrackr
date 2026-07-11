#!/usr/bin/env python3
import os
import sys
import shutil
import urllib.request
import tarfile
import zipfile
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
BIN_DIR = PROJECT_ROOT / "bin"

# URLs for fpcalc 1.5.1
MACOS_URL = "https://github.com/acoustid/chromaprint/releases/download/v1.5.1/chromaprint-fpcalc-1.5.1-macos-universal.tar.gz"
WINDOWS_URL = "https://github.com/acoustid/chromaprint/releases/download/v1.5.1/chromaprint-fpcalc-1.5.1-windows-x86_64.zip"

def download_file(url, dest_path):
    print(f"Downloading {url}...")
    with urllib.request.urlopen(url) as response:
        with open(dest_path, "wb") as out_file:
            shutil.copyfileobj(response, out_file)

def main():
    BIN_DIR.mkdir(exist_ok=True)
    
    # 1. macOS fpcalc
    macos_tar = BIN_DIR / "fpcalc-macos.tar.gz"
    try:
        download_file(MACOS_URL, macos_tar)
        print("Extracting macOS fpcalc...")
        with tarfile.open(macos_tar, "r:gz") as tar:
            # Find the fpcalc member
            fpcalc_member = None
            for member in tar.getmembers():
                if member.name.endswith("/fpcalc") or member.name == "fpcalc":
                    fpcalc_member = member
                    break
            
            if fpcalc_member:
                # Extract fpcalc
                with tar.extractfile(fpcalc_member) as source_file:
                    dest_fpcalc = BIN_DIR / "fpcalc"
                    with open(dest_fpcalc, "wb") as target_file:
                        shutil.copyfileobj(source_file, target_file)
                # Make executable
                dest_fpcalc.chmod(0o755)
                print(f"macOS fpcalc installed successfully at {dest_fpcalc}")
            else:
                print("Error: fpcalc binary not found in macOS archive.")
    except Exception as e:
        print(f"Failed to download/extract macOS fpcalc: {e}")
    finally:
        if macos_tar.exists():
            macos_tar.unlink()

    # 2. Windows fpcalc
    windows_zip = BIN_DIR / "fpcalc-windows.zip"
    try:
        download_file(WINDOWS_URL, windows_zip)
        print("Extracting Windows fpcalc...")
        with zipfile.ZipFile(windows_zip, "r") as zip_ref:
            fpcalc_member = None
            for name in zip_ref.namelist():
                if name.endswith("/fpcalc.exe") or name == "fpcalc.exe":
                    fpcalc_member = name
                    break
            
            if fpcalc_member:
                with zip_ref.open(fpcalc_member) as source_file:
                    dest_fpcalc = BIN_DIR / "fpcalc.exe"
                    with open(dest_fpcalc, "wb") as target_file:
                        shutil.copyfileobj(source_file, target_file)
                print(f"Windows fpcalc installed successfully at {dest_fpcalc}")
            else:
                print("Error: fpcalc.exe binary not found in Windows archive.")
    except Exception as e:
        print(f"Failed to download/extract Windows fpcalc: {e}")
    finally:
        if windows_zip.exists():
            windows_zip.unlink()

if __name__ == "__main__":
    main()
