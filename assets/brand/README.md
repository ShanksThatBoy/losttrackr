# Identité LostTrackr — A1 « Lost Orbit / Équilibre »

Le symbole se compose de trois éléments, et de rien d'autre :

    VINYLE  +  ORBITE CYAN  +  POINT DE RECONNEXION

Aucun anneau métallique ne doit entourer le disque : l'orbite passe **derrière**
le vinyle et réapparaît devant, c'est elle qui porte le mouvement.

## Quel fichier utiliser

| Besoin | Fichier |
|---|---|
| **Master du symbole** | `master/losttrackr-mark.svg` |
| Grand format, rendu riche (gradients, relief, glow) | `master/losttrackr-mark-premium.svg` |
| Interfaces sombres (cas principal) | `master/losttrackr-mark-dark.svg` |
| Fonds clairs / blancs | `master/losttrackr-mark-light.svg` |
| Aplat monochrome | `master/losttrackr-mark-white.svg`, `-cyan.svg` |
| **≤ 32 px** (favicon, barre des tâches) | `master/losttrackr-mark-small.svg` |
| **Lockup, fonds sombres** (sidebar, site) | `master/losttrackr-lockup-horizontal-dark.svg` |
| **Lockup, fonds clairs** (fond Finder du DMG) | `master/losttrackr-lockup-horizontal-light.svg` |
| Wordmark seul | `master/losttrackr-wordmark.svg` / `-light.svg` |
| App Icon macOS / Windows | `master/losttrackr-app-icon-{macos,windows}.svg` |

`losttrackr-lockup-horizontal.svg` est un alias de la variante *dark* : sur les
cockpits bleu nuit de LostTrackr, c'est elle la variante principale.

**Mark ≠ App Icon.** Le mark est transparent et sert à l'UI, au label du vinyle,
à l'onboarding, au branding. L'App Icon ajoute la plaque squircle bleu nuit et
ne sert qu'aux icônes système (macOS, Windows, apple-touch-icon). Ne jamais
substituer l'une à l'autre.

## Palette

| | | |
|---|---|---|
| Night 950 | `#020812` | fond le plus profond |
| Night 900 | `#06121E` | fond cockpit |
| Night 800 | `#0A1C2C` | surfaces, wordmark sur fond clair |
| Blue | `#1598FF` | orbite arrière, accents fonds clairs |
| Cyan | `#20DFFF` | orbite avant, point de reconnexion |
| Ice | `#D7E8F4` | liseré du disque |
| White | `#F6FAFF` | « Lost » du wordmark |

Le wordmark utilise **LostTrackr Display Bold**, la fonte propriétaire du projet
(contours originaux détenus par LostTrackr, également utilisée par le site).
Les SVG contiennent les glyphes **convertis en paths** : aucune dépendance à une
fonte installée.

## Régénérer les assets

Une seule commande reconstruit toute la chaîne à partir des SVG :

```bash
./tools/generate_brand_assets.sh
```

    master/*.svg  →  PNG mark  →  PNG lockups  →  iconset macOS  →  .icns
                  →  PNG Windows  →  .ico  →  favicons web
                  →  synchronisation des chemins historiques (app, build, site)

Le script **ne réécrit jamais les SVG**. Retoucher un master dans Inkscape puis
relancer la commande suffit. Il vérifie en fin de course la présence du canal
alpha, les 10 représentations du `.icns` et les 7 tailles du `.ico`.

Outils requis : `inkscape`, `imagemagick` (`brew install --cask inkscape`,
`brew install imagemagick`), `iconutil`/`sips` fournis par macOS. `oxipng` est
optionnel (optimisation PNG sans perte).

`--no-legacy` limite la génération à `assets/brand/` sans toucher aux chemins
historiques ni au dépôt du site.

## Redessiner le symbole

La géométrie est paramétrique (rayons, inclinaison de l'orbite, épaisseurs) :

```bash
python3 tools/brand/build_masters.py
```

⚠️ **Cette commande écrase les SVG masters** — donc toute retouche Inkscape.
Elle n'est utile que pour faire évoluer le dessin lui-même ; pour un simple
réexport, utiliser `generate_brand_assets.sh`.

L'orbite est tracée en **Béziers cubiques explicites** et non avec la commande
SVG `A` : à partir de deux extrémités, `A` peut retenir l'autre centre
d'ellipse possible, ce qui décorrèle le tracé de la paramétrisation utilisée
pour placer le nœud, le dégradé de traîne et les zones masquées par le disque.

## Contrôle visuel

`tools/brand/qa.html` réunit le symbole sur les quatre fonds de référence
(`#020812`, `#06121E`, blanc, damier de transparence), l'échelle 256 → 16 px,
l'App Icon à l'échelle et les contextes réels de l'app (sidebar, label du
vinyle, carte Base de connaissances). Servir la racine du dépôt puis ouvrir
`/tools/brand/qa.html`.

## Où atterrissent les fichiers

```
assets/brand/
├── master/     SVG — seule source de vérité, éditables dans Inkscape
├── marks/      PNG transparents 16 → 1024 + variantes mono/light/premium
├── lockups/    PNG lockups dark & light (800 px et 2000 px) + wordmarks
├── macos/      LostTrackr-AppIcon-1024.png, LostTrackr.icns
├── windows/    LostTrackr-AppIcon-{16…1024}.png, LostTrackr.ico
└── web/        favicon.svg, favicon-{16,32,180}.png, favicon.ico, apple-touch-icon.png
```

Les chemins historiques (`assets/LostTrackr.icns`, `assets/LostTrackr_*.png`,
`assets/losttrackr_icons/clean/logo_losttrackr_*.png`) sont **synchronisés
automatiquement** par le pipeline : le code de l'app, les `.spec` et les scripts
de build continuent de pointer dessus sans modification.

Le `.ico` Windows est réassemblé sur la machine Windows par
`windows/make_windows_icon.py`, à partir des PNG de `assets/brand/windows/`
versionnés ici (ni Inkscape ni ImageMagick ne sont requis côté Windows).
