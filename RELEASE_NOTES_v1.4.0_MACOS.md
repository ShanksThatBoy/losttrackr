# LostTrackr v1.4.0 - macOS

- **Affinage manuel (Drawer latéral)** : Nouveau formulaire d'édition permettant de corriger manuellement l'artiste, le titre, l'année, le genre, le BPM, et la clé, ou de relancer la recherche dans la Base de connaissances.
- **Écriture réelle des métadonnées (Mutagen)** : Possibilité d'enregistrer physiquement les métadonnées validées (BPM, clé, genre, artiste, titre, année) directement dans les tags audio originaux.
- **Pipeline visuel & Waveform Progress** : Remplacement de l'indicateur de chargement par un pipeline en 4 étapes (Scan du dossier, Empreinte acoustique, Identification, Enrichissement) accompagné d'une animation progressive de type forme d'onde (waveform).
- **Fiabilité réseau accrue** : Réduction de la taille des lots de résolution réseau à 8 morceaux (RESOLVE_CHUNK_SIZE) et augmentation du timeout à 45s pour parer aux requêtes lentes. Tolérance aux pannes partielles (les lots en échec n'interrompent pas le scan).
- **Consolidation V2 de l'API** : Intégration complète avec la table consolidée par consensus `recording_canonical` et délégation asynchrone des analyses via le worker Arq.

Build beta privée macOS non notarisé.
