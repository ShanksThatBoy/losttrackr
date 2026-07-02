#!/usr/bin/env zsh
# Construit LostTrackr.app puis empaquette un .dmg propre pour macOS.
set -euo pipefail
cd "$(dirname "$0")"

APP_NAME="LostTrackr"
APP_VERSION="1.2.1"
APP_BUILD="1.2.1"
BUNDLE_ID="com.djshanks.losttrackr"
VOL_NAME="${APP_NAME} ${APP_VERSION}"
DMG_NAME="${1:-${APP_NAME}-v${APP_BUILD}.dmg}"
APP_PATH="dist/${APP_NAME}.app"

if [[ ! -x ".venv-losttrackr-macos/bin/python" ]]; then
  echo "Environnement absent. Creation de .venv-losttrackr-macos..."
  ./setup_losttrackr_macos_env.sh
fi

. .venv-losttrackr-macos/bin/activate
PYTHON=".venv-losttrackr-macos/bin/python"

rm -rf build dist
"$PYTHON" -m PyInstaller \
  --noconfirm --clean --windowed --name "$APP_NAME" \
  --osx-bundle-identifier "$BUNDLE_ID" \
  --icon "assets/LostTrackr.icns" \
  --add-data "losttrackr_ui.html:." \
  --add-data "assets:assets" \
  --add-data "css:css" \
  --add-data "js:js" \
  --collect-all webview \
  --collect-all cryptography \
  losttrackr_app.py

PLIST="${APP_PATH}/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName ${APP_NAME}" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleDisplayName string ${APP_NAME}" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleName ${APP_NAME}" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleName string ${APP_NAME}" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier ${BUNDLE_ID}" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleIdentifier string ${BUNDLE_ID}" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${APP_VERSION}" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleShortVersionString string ${APP_VERSION}" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${APP_BUILD}" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :CFBundleVersion string ${APP_BUILD}" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :LSApplicationCategoryType public.app-category.music" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :LSApplicationCategoryType string public.app-category.music" "$PLIST"
/usr/libexec/PlistBuddy -c "Set :NSHighResolutionCapable true" "$PLIST" 2>/dev/null || /usr/libexec/PlistBuddy -c "Add :NSHighResolutionCapable bool true" "$PLIST"

codesign --force --deep --sign - "$APP_PATH"
codesign --verify --deep --strict "$APP_PATH"
xattr -cr "$APP_PATH" 2>/dev/null || true

TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/losttrackr-dmg.XXXXXX")"
STAGE="${TMP_ROOT}/stage"
RW_DMG="${TMP_ROOT}/${APP_NAME}-rw.dmg"
MOUNT_DIR="${TMP_ROOT}/mnt"
VERIFY_MOUNT="${TMP_ROOT}/verify"

cleanup() {
  hdiutil detach "$MOUNT_DIR" -quiet 2>/dev/null || true
  hdiutil detach "$VERIFY_MOUNT" -quiet 2>/dev/null || true
  rm -rf "$TMP_ROOT"
}
trap cleanup EXIT

mkdir -p "$STAGE/.background"
ditto "$APP_PATH" "$STAGE/${APP_NAME}.app"
ln -s /Applications "$STAGE/Applications"
cp README_BETA_LOSTTRACKR_MACOS.md "$STAGE/"
cp OUVRIR_LOSTTRACKR_MACOS_BETA.txt "$STAGE/"
cp assets/LostTrackr.icns "$STAGE/.VolumeIcon.icns"

LOGO_TMP="${TMP_ROOT}/logo.png"
BG_PATH="$STAGE/.background/background.png"
sips --resampleWidth 470 "assets/LostTrackr_FullLogo_transparent.png" --out "$LOGO_TMP" >/dev/null
sips --padToHeightWidth 420 620 --padColor F7F8FB "$LOGO_TMP" --out "$BG_PATH" >/dev/null

SetFile -a V "$STAGE/.background" || true

hdiutil create \
  -volname "$VOL_NAME" \
  -srcfolder "$STAGE" \
  -format UDRW \
  -fs HFS+ \
  -fsargs "-c c=64,a=16,e=16" \
  -ov "$RW_DMG"

mkdir -p "$MOUNT_DIR"
hdiutil attach "$RW_DMG" -readwrite -noverify -noautoopen -mountpoint "$MOUNT_DIR"
SetFile -a C "$MOUNT_DIR" || true
SetFile -a V "$MOUNT_DIR/.background" || true

osascript "packaging/dmg_layout.applescript" "$MOUNT_DIR" "${MOUNT_DIR}/.background/background.png"
sync
hdiutil detach "$MOUNT_DIR"

rm -f "$DMG_NAME"
hdiutil convert "$RW_DMG" -format UDZO -imagekey zlib-level=9 -o "$DMG_NAME"
hdiutil verify "$DMG_NAME"

mkdir -p "$VERIFY_MOUNT"
hdiutil attach "$DMG_NAME" -readonly -noverify -noautoopen -mountpoint "$VERIFY_MOUNT"
test -d "$VERIFY_MOUNT/${APP_NAME}.app"
test -L "$VERIFY_MOUNT/Applications"
test -f "$VERIFY_MOUNT/README_BETA_LOSTTRACKR_MACOS.md"
hdiutil detach "$VERIFY_MOUNT"

echo
echo "DMG cree : $DMG_NAME"
echo "Contenu : ${APP_NAME}.app v${APP_VERSION}, raccourci Applications, README beta, fond Finder personnalise."
echo "Signature : ad hoc locale. Notarisation Apple non incluse."
