#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

python3 -m venv .venv-losttrackr-macos
. .venv-losttrackr-macos/bin/activate
PYTHON=".venv-losttrackr-macos/bin/python"
"$PYTHON" -m pip install --upgrade pip
"$PYTHON" -m pip install -r requirements_macos.txt

echo "Environnement LostTrackr pret : .venv-losttrackr-macos"
