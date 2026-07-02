# LostTrackr v1.2.1

Version pont pour installer le systeme de mise a jour integre a LostTrackr.

## Nouveautes

- Ajout d'une verification de mise a jour au lancement de l'application.
- Ajout d'une banniere "Mise a jour disponible" dans l'interface.
- Telechargement de l'installateur macOS ou Windows depuis l'application.
- Verification SHA256 de l'installateur avant lancement.
- Verification Ed25519 du manifest de mise a jour avant toute confiance dans les URLs.
- Support des canaux `beta` et `stable` via `updates.losttrackr.com`.
- Scripts pour generer et signer les manifests de release.

## Notes

- Cette version reste non signee/non notarisee pour la beta.
- L'installation reste assistee : LostTrackr lance l'installateur, l'utilisateur confirme.
- Les fonctions compte gratuit/payant seront ajoutees dans une version ulterieure.
