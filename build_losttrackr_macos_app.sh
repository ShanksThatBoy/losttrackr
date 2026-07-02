#!/usr/bin/env zsh
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -x ".venv-losttrackr-macos/bin/python" ]]; then
  echo "Environnement absent. Creation de .venv-losttrackr-macos..."
  ./setup_losttrackr_macos_env.sh
fi

. .venv-losttrackr-macos/bin/activate
PYTHON=".venv-losttrackr-macos/bin/python"

rm -rf build dist

"$PYTHON" -m PyInstaller \
  --noconfirm \
  --clean \
  --windowed \
  --name LostTrackr \
  --osx-bundle-identifier "com.djshanks.losttrackr" \
  --icon "assets/LostTrackr.icns" \
  --add-data "losttrackr_ui.html:." \
  --add-data "assets:assets" \
  --add-data "css:css" \
  --add-data "js:js" \
  --collect-all webview \
  --collect-all cryptography \
  losttrackr_app.py

PLIST="dist/LostTrackr.app/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName LostTrackr" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string LostTrackr" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString 1.2.1" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleShortVersionString string 1.2.1" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion 1.2.1" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleVersion string 1.2.1" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :LSApplicationCategoryType public.app-category.music" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :LSApplicationCategoryType string public.app-category.music" "$PLIST"

codesign --force --deep --sign - "dist/LostTrackr.app"
codesign --verify --deep --strict "dist/LostTrackr.app"

echo
echo "Build termine : dist/LostTrackr.app"
echo "Note diffusion : signature ad hoc locale, pas encore de notarisation Apple."
