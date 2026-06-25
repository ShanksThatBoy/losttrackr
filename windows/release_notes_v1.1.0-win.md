# LostTrackr v1.1.0 Windows

Version officielle 1.1.0 de LostTrackr pour Windows 11 x64.

## Nouveautés
- Refonte graphique complète de l’interface V2, alignée avec la version macOS.
- Interface responsive plein écran/fenêtre réduite, sans boutons visuels macOS sur Windows.
- Aperçu de réparation avec liste complète déroulable des chemins avant/après et scroll synchronisé.
- Bouton “Ouvrir dans Serato” branché côté Windows avec recherche de Serato DJ Pro/Lite dans les emplacements classiques.
- Notification dédiée si aucun dossier source Serato `_Serato_` n’est trouvé.
- Packaging Windows x64 via PyInstaller + Inno Setup.

## Corrections
- Correction du scan qui pouvait classer à tort les fichiers comme ambigus à cause de racines de recherche qui se recoupaient.
- Détection Serato Windows/macOS isolée par plateforme.
- Séparation claire entre résultats fiables, éléments à vérifier et introuvables.

## Notes
- Installateur Windows non signé : SmartScreen peut afficher une alerte attendue.
- La localisation exacte des bibliothèques Serato Windows doit encore être validée sur une vraie installation Serato avant diffusion large.
