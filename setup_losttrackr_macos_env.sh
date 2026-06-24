#!/usr/bin/env zsh
set -euo pipefail

cd "$(dirname "$0")"

python3 -m venv .venv-losttrackr-macos
. .venv-losttrackr-macos/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements_macos.txt

echo "Environnement LostTrackr pret : .venv-losttrackr-macos"
