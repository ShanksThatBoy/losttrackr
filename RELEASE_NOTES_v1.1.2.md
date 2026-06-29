# LostTrackr v1.1.2

Version propre de consolidation macOS + Windows.

## Commun aux deux versions

- Interface externalisee en `losttrackr_ui.html`, `css/app.css` et `js/app.js`.
- Packaging mis a jour pour inclure les dossiers `css/` et `js/`.
- Projet clarifie avec `pyproject.toml`.
- Aucun changement backend majeur par rapport a v1.1.x : scan, reparation, restauration et ouverture Serato restent alignes.

## macOS

- Version bundle macOS : `1.1.2`.
- DMG beta non notarise, signe ad hoc localement.
- README et note visible dans le DMG avec ouverture sans Terminal : clic droit / Ctrl-clic > Ouvrir, puis option `Ouvrir quand meme` dans Reglages Systeme si besoin.
- Commande `xattr` conservee uniquement comme solution de secours.

## Windows

- Installateur Windows x64 : `LostTrackrSetup-v1.1.2-x64.exe`.
- Build GitHub Actions Windows via PyInstaller + Inno Setup.
- Version Windows non signee : SmartScreen peut afficher une alerte attendue.

## Limite connue macOS

Sans compte Apple Developer et notarisation Apple, macOS peut toujours bloquer une app telechargee. LostTrackr propose donc un parcours beta sans Terminal quand macOS l'autorise, mais le comportement final depend de Gatekeeper.

SHA-256 DMG : `1ba6b1e69872edfc48bdf33fc083ef51ec15fd211c09a0f1440733b0c8c2918a`
