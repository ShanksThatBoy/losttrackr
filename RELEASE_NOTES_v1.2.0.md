# LostTrackr v1.2.0

Version produit orientee onboarding intelligent et detection multi-logiciels DJ.

## Nouveautes communes macOS et Windows

- Ajout d'une detection automatique des logiciels DJ installes ou connectes : Serato DJ, rekordbox, Traktor et VirtualDJ.
- Nouvelle selection de logiciel dans l'ecran de preparation : LostTrackr propose le logiciel detecte et permet de valider un logiciel prefere si plusieurs sources existent.
- Adaptation automatique des textes UI selon le logiciel choisi : bibliotheque, crates, playlists, collection, dossiers de playlists, etc.
- Ajout d'un moteur de profils logiciels qui separe la detection, le vocabulaire produit et les capacites de reparation.
- Serato reste le moteur de reparation complet et stable : scan, preview, backup, application, nettoyage des introuvables et restauration.
- rekordbox, Traktor et VirtualDJ sont maintenant detectables et prepares pour les prochains adaptateurs de reparation.

## macOS

- Version bundle macOS : `1.2.0`.
- DMG beta non notarise, avec README d'ouverture Gatekeeper conserve.
- Detection locale des sources Serato et des indices rekordbox/Traktor/VirtualDJ sur le Mac.

## Windows

- Installateur Windows x64 : `LostTrackrSetup-v1.2.0-x64.exe`.
- Workflow GitHub Actions mis a jour pour produire la version 1.2.0.
- Detection Windows preparee pour les sources DJ classiques via les dossiers utilisateur, AppData et disques connectes.

## Notes importantes

- La reparation automatique est active pour Serato dans cette version.
- Les autres logiciels sont detectes et validables dans l'interface, mais leur ecriture automatique sera activee apres branchement de leurs adaptateurs dedies.
- La beta macOS reste non notarisee : utiliser clic droit / Ctrl-clic > Ouvrir si Gatekeeper affiche un avertissement.
