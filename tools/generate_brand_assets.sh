#!/usr/bin/env bash
# Régénère TOUS les assets de marque LostTrackr à partir des SVG masters.
#
#   assets/brand/master/*.svg   ← seule source de vérité (éditable dans Inkscape)
#        ↓
#   PNG mark ─ PNG lockups ─ iconset macOS ─ .icns ─ .ico Windows ─ favicons web
#        ↓
#   synchronisation des chemins historiques utilisés par l'app, le build et le site
#
# Ce script ne réécrit JAMAIS les SVG : retoucher un master dans Inkscape puis
# relancer cette commande suffit à reconstruire toute la chaîne.
# (Pour redessiner le symbole depuis la géométrie paramétrique, voir
#  tools/brand/build_masters.py — outil d'autorat, il écrase les masters.)
#
# Usage :
#   ./tools/generate_brand_assets.sh            # tout régénérer
#   ./tools/generate_brand_assets.sh --no-legacy  # masters + assets/brand/ seulement
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"

SYNC_LEGACY=1
[[ "${1:-}" == "--no-legacy" ]] && SYNC_LEGACY=0

M="assets/brand/master"
B="assets/brand"

# --- outils ----------------------------------------------------------------
need() { command -v "$1" >/dev/null 2>&1 || { echo "Outil manquant : $1 ($2)" >&2; exit 1; }; }
need inkscape "brew install --cask inkscape"
need magick   "brew install imagemagick"
need iconutil "fourni par macOS"
HAVE_OXIPNG=0
command -v oxipng >/dev/null 2>&1 && HAVE_OXIPNG=1

mkdir -p "$B"/{marks,lockups,macos,windows,web}

# Rasterise un SVG en PNG sRGB à fond transparent.
#   png <master.svg> <sortie.png> <largeur> [hauteur]
#   La largeur peut valoir "" pour un rendu piloté par la seule hauteur
#   (lockups : la CSS de l'app les dimensionne en height/width:auto).
png() {
  local src="$M/$1" out="$2" w="${3:-}" h="${4:-}"
  local -a dim=()
  [[ -n "$w" ]] && dim+=(-w "$w")
  [[ -n "$h" ]] && dim+=(-h "$h")
  [[ ${#dim[@]} -gt 0 ]] || { echo "png: ni largeur ni hauteur pour $src" >&2; exit 1; }
  inkscape "$src" "${dim[@]}" -o "$out" >/dev/null 2>&1
  [[ -s "$out" ]] || { echo "Échec du rendu : $src -> $out" >&2; exit 1; }
}

echo "==> Mark (PNG transparents, safe zone conservée)"
# ≤ 32 px : master optiquement simplifié (sillons retirés, orbite et nœud épaissis)
for s in 1024 512 256 128 64; do
  png losttrackr-mark.svg "$B/marks/losttrackr-mark-$s.png" "$s" "$s"
done
for s in 32 16; do
  png losttrackr-mark-small.svg "$B/marks/losttrackr-mark-$s.png" "$s" "$s"
done
png losttrackr-mark-premium.svg "$B/marks/losttrackr-mark-premium-1024.png" 1024 1024
png losttrackr-mark-white.svg   "$B/marks/losttrackr-mark-white-512.png"    512 512
png losttrackr-mark-cyan.svg    "$B/marks/losttrackr-mark-cyan-512.png"     512 512
png losttrackr-mark-light.svg   "$B/marks/losttrackr-mark-light-512.png"    512 512

echo "==> Lockups horizontaux"
png losttrackr-lockup-horizontal-dark.svg  "$B/lockups/losttrackr-lockup-horizontal-dark-2000.png"  2000
png losttrackr-lockup-horizontal-light.svg "$B/lockups/losttrackr-lockup-horizontal-light-2000.png" 2000
png losttrackr-lockup-horizontal-dark.svg  "$B/lockups/losttrackr-lockup-horizontal-dark.png"        800
png losttrackr-lockup-horizontal-light.svg "$B/lockups/losttrackr-lockup-horizontal-light.png"       800
png losttrackr-wordmark.svg       "$B/lockups/losttrackr-wordmark-dark-1600.png"  1600
png losttrackr-wordmark-light.svg "$B/lockups/losttrackr-wordmark-light-1600.png" 1600

echo "==> App Icon macOS + .icns"
png losttrackr-app-icon-macos.svg "$B/macos/LostTrackr-AppIcon-1024.png" 1024 1024
ICONSET="$(mktemp -d)/LostTrackr.iconset"
mkdir -p "$ICONSET"
# name:pixels — les représentations ≤ 32 px viennent du master simplifié
for spec in 16x16:16 16x16@2x:32 32x32:32 32x32@2x:64 \
            128x128:128 128x128@2x:256 256x256:256 256x256@2x:512 \
            512x512:512 512x512@2x:1024; do
  name="${spec%%:*}"; px="${spec##*:}"
  src=losttrackr-app-icon-macos.svg
  [[ "$px" -le 32 ]] && src=losttrackr-app-icon-macos-small.svg
  png "$src" "$ICONSET/icon_$name.png" "$px" "$px"
done
iconutil -c icns "$ICONSET" -o "$B/macos/LostTrackr.icns"
rm -rf "$(dirname "$ICONSET")"

echo "==> App Icon Windows + .ico"
for px in 256 128 64 48 32 24 16; do
  src=losttrackr-app-icon-windows.svg
  [[ "$px" -le 32 ]] && src=losttrackr-app-icon-windows-small.svg
  png "$src" "$B/windows/LostTrackr-AppIcon-$px.png" "$px" "$px"
done
png losttrackr-app-icon-windows.svg "$B/windows/LostTrackr-AppIcon-1024.png" 1024 1024
magick "$B/windows/LostTrackr-AppIcon-256.png" "$B/windows/LostTrackr-AppIcon-128.png" \
       "$B/windows/LostTrackr-AppIcon-64.png"  "$B/windows/LostTrackr-AppIcon-48.png" \
       "$B/windows/LostTrackr-AppIcon-32.png"  "$B/windows/LostTrackr-AppIcon-24.png" \
       "$B/windows/LostTrackr-AppIcon-16.png" "$B/windows/LostTrackr.ico"

echo "==> Web (favicons)"
cp "$M/losttrackr-app-icon-macos.svg" "$B/web/favicon.svg"
png losttrackr-app-icon-macos-small.svg "$B/web/favicon-32.png" 32 32
png losttrackr-app-icon-macos-small.svg "$B/web/favicon-16.png" 16 16
png losttrackr-app-icon-macos.svg       "$B/web/favicon-180.png" 180 180
png losttrackr-app-icon-macos.svg       "$B/web/apple-touch-icon.png" 180 180
magick "$B/web/favicon-32.png" "$B/web/favicon-16.png" "$B/web/favicon.ico"

# --- optimisation lossless -------------------------------------------------
if [[ "$HAVE_OXIPNG" == "1" ]]; then
  echo "==> Optimisation PNG (oxipng, sans perte)"
  find "$B" -name '*.png' -print0 | xargs -0 oxipng -o 3 -q --strip safe 2>/dev/null || true
fi

if [[ "$SYNC_LEGACY" == "1" ]]; then
  echo "==> Synchronisation des chemins historiques (app, build, site)"
  # -- icône applicative macOS consommée par LostTrackr.spec et les scripts de build
  cp "$B/macos/LostTrackr.icns" assets/LostTrackr.icns

  # -- assets racine
  cp "$B/windows/LostTrackr-AppIcon-1024.png" assets/LostTrackr_Icon.png
  cp "$B/marks/losttrackr-mark-1024.png"      assets/LostTrackr_Icon_transparent.png
  # Le fond Finder du DMG est clair (#F7F8FB) : ce lockup DOIT rester la variante claire.
  cp "$B/lockups/losttrackr-lockup-horizontal-light-2000.png" assets/LostTrackr_FullLogo_transparent.png
  cp "$B/lockups/losttrackr-lockup-horizontal-light-2000.png" assets/LostTrackr_FullLogo.png

  # -- assets d'interface (cockpit sombre)
  C="assets/losttrackr_icons/clean"
  png losttrackr-mark.svg "$C/logo_losttrackr_mark_ui.png" 320 320
  png losttrackr-lockup-horizontal-dark.svg "$C/logo_losttrackr_lockup_ui.png" "" 272
  png losttrackr-mark.svg "$C/logo_losttrackr_v2_clean.png"      512 512
  png losttrackr-mark.svg "$C/logo_losttrackr_mark_v2_clean.png" 512 512
  png losttrackr-lockup-horizontal-dark.svg "$C/logo_losttrackr_full_v2_clean.png" 1600

  # -- site vitrine (dépôt losttrackr-website, à côté de celui-ci)
  SITE="$ROOT/../losttrackr-website"
  if [[ -d "$SITE/src/assets" ]]; then
    cp "$B/lockups/losttrackr-lockup-horizontal-dark-2000.png" "$SITE/src/assets/LostTrackr_FullLogo_transparent.png"
    cp "$B/web/favicon-180.png"      "$SITE/public/favicon.png"
    cp "$B/web/favicon.svg"          "$SITE/public/favicon.svg"
    cp "$B/web/favicon-32.png"       "$SITE/public/favicon-32.png"
    cp "$B/web/favicon-16.png"       "$SITE/public/favicon-16.png"
    cp "$B/web/apple-touch-icon.png" "$SITE/public/apple-touch-icon.png"
    echo "    site mis à jour : $SITE"
  else
    echo "    (dépôt du site introuvable en $SITE — étape ignorée)"
  fi
fi

# --- vérifications ---------------------------------------------------------
echo "==> Vérifications"
fail=0
check_alpha() {
  local f="$1"
  [[ -f "$f" ]] || { echo "  MANQUANT  $f"; fail=1; return; }
  if [[ "$(magick identify -format '%[channels]' "$f")" != *a* ]]; then
    echo "  SANS ALPHA  $f"; fail=1
  fi
}
while IFS= read -r -d '' f; do check_alpha "$f"; done \
  < <(find "$B/marks" "$B/lockups" "$B/web" -name '*.png' -print0)
if [[ "$SYNC_LEGACY" == "1" ]]; then
  for f in assets/LostTrackr_Icon_transparent.png assets/LostTrackr_FullLogo_transparent.png \
           assets/losttrackr_icons/clean/logo_losttrackr_mark_ui.png \
           assets/losttrackr_icons/clean/logo_losttrackr_lockup_ui.png; do
    check_alpha "$f"
  done
fi
# Le .icns doit être relisible et contenir ses 10 représentations
CHK="$(mktemp -d)/chk.iconset"
if iconutil -c iconset "$B/macos/LostTrackr.icns" -o "$CHK" 2>/dev/null; then
  reps=$(find "$CHK" -name '*.png' | wc -l | tr -d ' ')
  echo "  .icns : $(du -h "$B/macos/LostTrackr.icns" | cut -f1), $reps/10 représentations"
  [[ "$reps" == "10" ]] || { echo "  .icns INCOMPLET" >&2; fail=1; }
else
  echo "  .icns ILLISIBLE" >&2; fail=1
fi
rm -rf "$(dirname "$CHK")"
icos=$(magick identify "$B/windows/LostTrackr.ico" | wc -l | tr -d ' ')
echo "  .ico  : $icos/7 tailles"
[[ "$icos" == "7" ]] || { echo "  .ico INCOMPLET" >&2; fail=1; }
[[ "$fail" == "0" ]] && echo "  transparence : OK" || { echo "  transparence : ÉCHEC" >&2; exit 1; }

echo
echo "Assets de marque régénérés depuis $M"
