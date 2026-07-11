#!/usr/bin/env bash
# Construit un installateur .pkg macOS pour LostTrackr.
set -euo pipefail
cd "$(dirname "$0")"

APP_NAME="LostTrackr"
APP_VERSION="1.4.0"
BUNDLE_ID="com.djshanks.losttrackr"
APP_PATH="dist/${APP_NAME}.app"
PKG_NAME="${1:-${APP_NAME}-v${APP_VERSION}-macos.pkg}"

if [[ ! -d "$APP_PATH" ]]; then
  ./build_dmg_macos.sh "${APP_NAME}-v${APP_VERSION}-macos.dmg"
fi

rm -f "$PKG_NAME"
pkgbuild \
  --component "$APP_PATH" \
  --install-location "/Applications" \
  --identifier "$BUNDLE_ID" \
  --version "$APP_VERSION" \
  "$PKG_NAME"

pkgutil --payload-files "$PKG_NAME" >/dev/null
echo "PKG cree : $PKG_NAME"
echo "Signature/notarisation Apple non incluses."
