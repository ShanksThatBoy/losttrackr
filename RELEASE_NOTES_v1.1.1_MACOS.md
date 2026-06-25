# LostTrackr v1.1.1 macOS

Version macOS beta privee non notarisee.

## Pourquoi cette version

- Clarifie que la beta macOS n'est pas signee Developer ID ni notarisee Apple.
- Ajoute une procedure explicite pour ouvrir LostTrackr si Gatekeeper affiche "Element non ouvert".
- Met a jour les builds macOS en `1.1.1` pour distinguer cette livraison beta de `1.1.0`.

## Installation beta macOS

1. Ouvre le DMG.
2. Glisse `LostTrackr.app` dans `Applications`.
3. Si macOS bloque l'ouverture, lance :

```bash
xattr -dr com.apple.quarantine "/Applications/LostTrackr.app"
```

4. Ouvre LostTrackr depuis `Applications`.

## Notes

- DMG et PKG restent non notarises volontairement pour la phase beta.
- Gatekeeper peut afficher une alerte attendue.
- Aucune modification fonctionnelle majeure par rapport a `1.1.0`.
