# LostTrackr Knowledge DB

This folder defines the first production-oriented data foundation for the
LostTrackr music knowledge service.

The goal is to build a private LostTrackr database inspired by public music
metadata services, enriched by MusicBrainz data and by opt-in cleaned metadata
observations from LostTrackr Pro users.

## Scope

The service stores and exposes:

- canonical track, artist, release, duration, ISRC, and external ID metadata;
- DJ-oriented audio metadata such as BPM, musical key, Camelot key, genre,
  energy, and confidence scores;
- cleaned user observations collected only after explicit user validation;
- sync package metadata so the desktop app can keep an offline cache.

The service must never store:

- complete local file paths;
- exact user folder names;
- private crate or playlist names;
- private comments;
- playback history;
- machine names;
- user emails in contribution rows;
- raw Serato, rekordbox, Traktor, or VirtualDJ database files;
- audio files.

## Target Infrastructure

Initial beta deployment:

- `pve2` hosts the knowledge database and API because it is currently the least
  loaded Proxmox node.
- PostgreSQL stays private and is never exposed to the internet.
- LostTrackr desktop apps call the API over HTTPS through Cloudflare Tunnel.
- Administration happens through WireGuard and/or Cloudflare Access, not through
  open database ports.

Recommended first services:

- `lt-db-prod`: PostgreSQL, native install, private network only.
- `lt-api-prod`: FastAPI, Redis, workers, Cloudflare Tunnel connector.
- Optional later: `lt-db-staging` and `lt-api-staging` for import and migration
  tests before production.

## Sizing

For the first version:

- target catalog: 50,000 to 200,000 tracks;
- recommended DB disk: 100 GB minimum;
- comfortable MusicBrainz ETL staging: 200 GB or more;
- API disk: 30 GB;
- database RAM: 8 to 12 GB;
- API RAM: 4 GB.

50 GB is enough for a curated 50k-track LostTrackr DB, but it is tight once
MusicBrainz imports, indexes, backups, and staging data are included.

## Data Flow

1. ETL imports a safe subset of MusicBrainz core data.
2. LostTrackr Pro scans local DJ software libraries.
3. The user validates contribution from the app.
4. The app submits only allowlisted cleaned metadata.
5. The API stores observations for up to six months.
6. Aggregation jobs promote reliable observations into stable audio features.
7. The app syncs a compact offline knowledge package.

## Files

- `schema.sql`: first PostgreSQL schema for the knowledge database.
- `api-v1.md`: HTTP API contract for the desktop app.
- `deployment-plan.md`: Proxmox, network, security, backup, and rollout plan.
