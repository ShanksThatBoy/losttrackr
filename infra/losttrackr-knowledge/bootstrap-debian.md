# Debian Bootstrap Checklist

This checklist prepares the first `lt-db-prod` VM on Proxmox.

It assumes:

- Debian stable;
- a private LAN IP;
- no public PostgreSQL exposure;
- administration over WireGuard or Cloudflare Access only.

## 1. Create the VM

Recommended first sizing:

```text
Name: lt-db-prod
Node: pve2
CPU: 2 vCPU
RAM: 8192-12288 MB
Disk: 100 GB minimum
Network: private LAN bridge
```

Use 200 GB if you want to stage larger MusicBrainz imports directly on the same
VM. Otherwise keep MusicBrainz staging separate later.

## 2. Base system

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y postgresql postgresql-contrib ufw curl ca-certificates
```

## 3. Firewall

Replace the IP ranges with the real API VM and admin VPN ranges.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from <WIREGUARD_SUBNET> to any port 22 proto tcp
sudo ufw allow from <LT_API_PROD_IP> to any port 5432 proto tcp
sudo ufw enable
sudo ufw status verbose
```

Do not allow PostgreSQL from `0.0.0.0/0`.

## 4. PostgreSQL database and users

Run as the `postgres` system user.

```bash
sudo -iu postgres
createuser --pwprompt losttrackr_api_rw
createuser --pwprompt losttrackr_etl_rw
createuser losttrackr_readonly
createdb losttrackr_knowledge
psql -d losttrackr_knowledge
```

Inside `psql`:

```sql
REVOKE ALL ON DATABASE losttrackr_knowledge FROM PUBLIC;
GRANT CONNECT ON DATABASE losttrackr_knowledge TO losttrackr_api_rw;
GRANT CONNECT ON DATABASE losttrackr_knowledge TO losttrackr_etl_rw;
GRANT CONNECT ON DATABASE losttrackr_knowledge TO losttrackr_readonly;
```

Apply the schema from this repository:

```bash
psql -d losttrackr_knowledge -f infra/losttrackr-knowledge/schema.sql
```

Then grant schema permissions:

```sql
GRANT USAGE ON SCHEMA knowledge TO losttrackr_api_rw, losttrackr_etl_rw, losttrackr_readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA knowledge TO losttrackr_api_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA knowledge TO losttrackr_etl_rw;
GRANT SELECT ON ALL TABLES IN SCHEMA knowledge TO losttrackr_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA knowledge GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO losttrackr_api_rw;
ALTER DEFAULT PRIVILEGES IN SCHEMA knowledge GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO losttrackr_etl_rw;
ALTER DEFAULT PRIVILEGES IN SCHEMA knowledge GRANT SELECT ON TABLES TO losttrackr_readonly;
```

## 5. PostgreSQL network binding

Keep PostgreSQL private.

In `postgresql.conf`, bind only to the VM private IP or private bridge:

```text
listen_addresses = '<LT_DB_PROD_PRIVATE_IP>'
```

In `pg_hba.conf`, allow only the API VM and admin VPN if needed:

```text
host losttrackr_knowledge losttrackr_api_rw <LT_API_PROD_IP>/32 scram-sha-256
host losttrackr_knowledge losttrackr_etl_rw <LT_API_PROD_IP>/32 scram-sha-256
host losttrackr_knowledge losttrackr_readonly <WIREGUARD_SUBNET> scram-sha-256
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

## 6. Backup smoke test

Create the first dump manually before any import.

```bash
mkdir -p ~/losttrackr-backups
pg_dump -Fc losttrackr_knowledge > ~/losttrackr-backups/losttrackr_knowledge_empty.dump
```

Verify that the dump exists and is not empty:

```bash
ls -lh ~/losttrackr-backups/losttrackr_knowledge_empty.dump
```

## 7. Next VM

After `lt-db-prod` is ready, create `lt-api-prod` and expose only FastAPI
through Cloudflare Tunnel. The API VM is the only production service allowed to
talk to PostgreSQL.
