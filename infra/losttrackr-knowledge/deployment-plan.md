# LostTrackr Knowledge Deployment Plan

This plan matches the current home infrastructure:

- two Proxmox nodes: `pve1` and `pve2`;
- Freebox Revolution;
- fixed public IP;
- Cloudflare DNS;
- Cloudflare Tunnel preferred because inbound port opening is restricted;
- current single LAN;
- WireGuard already available for remote access;
- no RAID and no UPS yet.

## Initial Placement

Use `pve2` for the knowledge stack. It has more available CPU headroom and is
less loaded than `pve1`.

### VM: lt-db-prod

Purpose: private PostgreSQL database.

Recommended initial sizing:

```text
Node:          pve2
OS:            Debian stable
vCPU:          2
RAM:           8-12 GB
Disk:          100 GB minimum, 200 GB preferred before full MusicBrainz ETL
Network:       LAN only
Public access: none
```

PostgreSQL must listen only on the private LAN or a private VM bridge. It must
not be exposed through Cloudflare Tunnel.

### VM: lt-api-prod

Purpose: FastAPI service, Redis, background workers, and Cloudflare Tunnel.

Recommended initial sizing:

```text
Node:          pve2
OS:            Debian stable
vCPU:          2
RAM:           4 GB
Disk:          30 GB
Network:       LAN + tunnel outbound
Public access: HTTPS through Cloudflare Tunnel only
```

Run application services with Docker Compose because it is easier to inspect,
restart, and troubleshoot than a Kubernetes setup at this stage.

## DNS and Tunnel

Cloudflare DNS:

```text
knowledge.losttrackr.com         -> Cloudflare Tunnel
knowledge-staging.losttrackr.com -> Cloudflare Tunnel, later
```

No direct `A` record should point to the home public IP for the API.

Cloudflare Access should protect admin-only routes and any SSH browser access.
Public app API routes remain protected by app tokens and rate limits.

## Firewall Rules

Minimum rules:

```text
Internet -> PostgreSQL: blocked
Internet -> Proxmox UI: blocked
Internet -> SSH: blocked

lt-api-prod -> lt-db-prod: PostgreSQL allowed
lt-db-prod -> lt-api-prod: established/related only
WireGuard clients -> Proxmox UI: allowed
WireGuard clients -> lt-db-prod SSH: allowed
WireGuard clients -> lt-api-prod SSH: allowed
```

When OPNsense is added later, move these rules from the Freebox/Proxmox layer to
OPNsense and split the stack into VLANs.

## Security Baseline

Before beta users connect:

1. Enable 2FA on Cloudflare.
2. Enable 2FA on Proxmox.
3. Use SSH keys only; disable password SSH.
4. Create a non-root admin user.
5. Keep PostgreSQL private.
6. Store secrets in KeePassXC or another password manager.
7. Use separate database users:
   - `losttrackr_api_rw`
   - `losttrackr_etl_rw`
   - `losttrackr_readonly`
8. Rotate API secrets before the first public beta.

## Backups

The accepted risk target is:

```text
Maximum data loss: 24h
Maximum downtime: 12h
```

Initial backup policy:

```text
Daily:
- pg_dump custom format from lt-db-prod
- copy encrypted dump to pve1
- Proxmox snapshot of lt-db-prod

Retention:
- 7 daily backups
- 4 weekly backups
```

Add an external backup disk before commercial launch. Add a UPS before making
availability promises.

## Production and Staging

Even early, keep environment names clear:

```text
prod:
- knowledge.losttrackr.com
- real beta/pro users

staging:
- knowledge-staging.losttrackr.com
- test imports and migrations
```

Do not test MusicBrainz import migrations directly on production once users are
contributing data.

## Rollout Order

1. Create `lt-db-prod`.
2. Install PostgreSQL and apply `schema.sql`.
3. Create `lt-api-prod`.
4. Deploy health endpoint only.
5. Expose `knowledge.losttrackr.com` through Cloudflare Tunnel.
6. Add catalog search endpoint.
7. Import a small MusicBrainz subset.
8. Add match endpoint.
9. Add Pro contribution endpoint behind feature flag.
10. Add sync package endpoint for offline app cache.

## Later Improvements

- OPNsense HA and VLAN separation.
- External encrypted backups.
- UPS.
- Staging VM pair.
- Meilisearch if PostgreSQL trigram/full-text search becomes too slow.
- Object storage for sync packages and large dumps.
