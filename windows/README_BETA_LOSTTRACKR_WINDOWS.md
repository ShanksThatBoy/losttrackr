# LostTrackr Windows beta

Version: `v1.2.1`
Target: Windows 11 x64, Pro and Home editions.

## Francais

Cette beta installe LostTrackr comme une application Windows classique avec raccourcis Menu Demarrer et Bureau. La version 1.2.1 ajoute le systeme de mise a jour securise depuis LostTrackr. La detection intelligente Serato DJ, rekordbox, Traktor et VirtualDJ reste incluse. La reparation automatique complete reste active pour Serato DJ.

Avant de scanner ou reparer une bibliotheque Serato :

- ferme completement Serato DJ Pro/Lite ;
- connecte les disques externes contenant tes morceaux ;
- verifie que le dossier `_Serato_` est disponible.

Chemins Serato attendus sur Windows :

- bibliotheque interne : `C:\Users\<toi>\Music\_Serato_` ;
- bibliotheques externes : `_Serato_` a la racine du disque, par exemple `D:\_Serato_` ou `E:\_Serato_`.

LostTrackr cree une sauvegarde complete `_Serato_BACKUP_*` avant toute modification. Une restauration de sauvegarde deplace la version courante vers `_Serato_REPLACED_*` au lieu de la supprimer.

Notes beta :

- l'application n'est pas signee, donc Windows SmartScreen peut afficher une alerte ;
- Microsoft Edge WebView2 Runtime est requis pour l'interface ; il est generalement deja present sur Windows 11 ;
- la localisation exacte des dossiers `_Serato_` Windows doit etre validee sur une vraie installation Serato avant diffusion large.

## English

This beta installs LostTrackr as a standard Windows app with Start Menu and Desktop shortcuts.

Before scanning or repairing a Serato library, close the selected DJ software. In this beta, automatic repair is active for Serato DJ, while rekordbox, Traktor and VirtualDJ are detected for the upcoming adapters.

Before scanning or repairing a Serato library:

- fully close Serato DJ Pro/Lite ;
- connect every external drive that contains your music files ;
- make sure the `_Serato_` folder is available.

Expected Serato locations on Windows:

- internal library: `C:\Users\<you>\Music\_Serato_` ;
- external libraries: `_Serato_` at the drive root, for example `D:\_Serato_` or `E:\_Serato_`.

LostTrackr creates a full `_Serato_BACKUP_*` backup before any write. Restoring a backup moves the current folder to `_Serato_REPLACED_*` instead of deleting it.

Beta notes:

- the app is unsigned, so Windows SmartScreen may warn you ;
- Microsoft Edge WebView2 Runtime is required for the interface ; it is usually already present on Windows 11 ;
- the exact Windows `_Serato_` locations must be validated on a real Serato installation before broad distribution.
