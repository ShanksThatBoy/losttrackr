# LostTrackr macOS 1.2.4 - Beta privee non notarisee

Merci de tester LostTrackr.

LostTrackr est un outil macOS pour aider les DJs a retrouver automatiquement les fichiers audio que leur logiciel DJ marque comme introuvables apres un changement de dossier, de disque ou d'organisation. Dans cette version 1.2.4, LostTrackr ajoute un systeme de mise a jour securise depuis l'application. La detection intelligente reconnait Serato DJ, rekordbox, Traktor et VirtualDJ. La reparation automatique complete reste active pour Serato DJ.

## Important avant de commencer

Cette version 1.2.4 est une beta privee. Elle n'est pas encore signee ni notarisee par Apple avec un certificat Developer ID.

macOS peut donc afficher une alerte du type :

> Apple ne peut pas verifier que cette app ne contient pas de logiciel malveillant.

C'est normal pour cette beta. L'app n'est pas encore distribuee publiquement et ne necessite pas encore de compte Apple Developer payant.

## Comment ouvrir LostTrackr sur macOS

1. Ouvre le fichier `.dmg`.
2. Glisse `LostTrackr.app` dans ton dossier `Applications` si tu veux l'installer, ou lance-la directement depuis le `.dmg` pour tester.
3. Fais un clic droit sur `LostTrackr.app`.
4. Clique sur `Ouvrir`.
5. Confirme a nouveau avec `Ouvrir` si macOS affiche un avertissement.

Si macOS bloque encore l'app :

1. Ouvre `Reglages Systeme`.
2. Va dans `Confidentialite et securite`.
3. Descends jusqu'au message concernant `LostTrackr`.
4. Clique sur `Ouvrir quand meme`.
5. Relance `LostTrackr.app`.

## Ouvrir sans Terminal

La methode recommandee pour cette beta non notarisee :

1. Glisse `LostTrackr.app` dans `Applications`.
2. Dans `Applications`, fais un clic droit ou Ctrl-clic sur `LostTrackr.app`.
3. Clique sur `Ouvrir`.
4. Confirme avec `Ouvrir` si macOS affiche un avertissement.

Si macOS affiche seulement `Placer dans la corbeille` et `Termine`, ouvre `Reglages Systeme` > `Confidentialite et securite`, puis clique sur `Ouvrir quand meme` pour LostTrackr.

## Si macOS affiche "Element non ouvert"

Sur certaines versions de macOS, le clic droit ne suffit pas apres un telechargement depuis GitHub ou Google Drive.

Dans ce cas :

1. Installe `LostTrackr.app` dans `Applications`.
2. Ouvre `Terminal`.
3. Colle cette commande :

```bash
xattr -dr com.apple.quarantine "/Applications/LostTrackr.app"
```

4. Appuie sur Entree.
5. Relance `LostTrackr.app`.

Cette commande retire uniquement le marquage de quarantaine ajoute par macOS au fichier telecharge. Elle ne modifie pas ta bibliotheque Serato.

## Avant de scanner

LostTrackr detecte automatiquement les sources DJ disponibles puis te propose de valider le logiciel a scanner.

Ferme completement le logiciel DJ choisi avant de lancer un scan. Pour cette beta, la reparation automatique complete est active pour Serato DJ Pro/Lite.

Serato garde sa bibliotheque en memoire et peut reecrire ses fichiers quand il se ferme. LostTrackr doit donc scanner et reparer pendant que Serato est ferme.

## Ce que fait LostTrackr

1. LostTrackr cherche tes bibliotheques Serato (`_Serato_`) sur ton Mac et sur tes disques externes.
2. LostTrackr scanne les chemins de fichiers que Serato connait.
3. LostTrackr cherche les fichiers audio correspondants dans ton dossier utilisateur et sur les disques connectes.
4. LostTrackr affiche un apercu des fichiers retrouves.
5. Tu verifies l'aperçu.
6. Tu confirmes la reparation.

LostTrackr ne modifie pas la bibliotheque pendant le scan.

## Sauvegarde automatique

Avant toute reparation, LostTrackr cree une sauvegarde complete du dossier `_Serato_`.

La sauvegarde est nommee comme ceci :

```text
_Serato_BACKUP_*
```

Exemple :

```text
_Serato_BACKUP_20260624_121500
```

## Restauration automatique

LostTrackr propose une restauration automatique de la version precedente.

Si quelque chose ne va pas apres une reparation, utilise le bouton de restauration dans l'app. La version actuelle est deplacee de cote avant restauration, elle n'est pas supprimee.

## Retirer les introuvables de Serato

Apres une reparation, LostTrackr peut proposer de retirer les morceaux encore introuvables des bibliotheques Serato.

Important : cette action ne supprime pas les fichiers audio de ton Mac ou de tes disques. Elle retire seulement les references Serato qui pointent vers des fichiers absents.

LostTrackr cree une nouvelle sauvegarde `_Serato_BACKUP_*` avant ce nettoyage. Les morceaux avec des candidats ambigus sont conserves pour verification manuelle.

## Ce que j'attends de toi comme retour beta

Apres ton test, envoie-moi ces informations :

- Mac utilise : modele et processeur si tu le connais
- Version macOS
- Version Serato DJ Pro
- Tes musiques sont sur disque interne, disque externe, ou les deux
- Nombre de fichiers retrouves par LostTrackr
- Nombre de fichiers encore introuvables
- Si tu as utilise le nettoyage des introuvables : nombre de references retirees
- Est-ce que la reparation a fonctionne dans Serato apres relance
- Erreurs ou comportements bizarres observes
- Capture d'ecran si quelque chose semble confus

Merci. Plus ton retour est concret, plus LostTrackr deviendra fiable pour tous les DJs.
