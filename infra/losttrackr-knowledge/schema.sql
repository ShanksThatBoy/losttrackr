-- LostTrackr Knowledge DB v0.1
-- PostgreSQL schema for the central music knowledge service.
-- This database stores catalog metadata and cleaned opt-in observations only.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE SCHEMA IF NOT EXISTS knowledge;

CREATE TABLE knowledge.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    musicbrainz_artist_id UUID UNIQUE,
    display_name TEXT NOT NULL,
    sort_name TEXT,
    normalized_name TEXT NOT NULL,
    country_code TEXT,
    artist_type TEXT,
    begin_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    musicbrainz_recording_id UUID UNIQUE,
    canonical_title TEXT NOT NULL,
    normalized_title TEXT NOT NULL,
    primary_artist_id UUID REFERENCES knowledge.artists(id) ON DELETE SET NULL,
    duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms > 0),
    first_release_date DATE,
    explicit_flag BOOLEAN,
    source_priority TEXT NOT NULL DEFAULT 'musicbrainz',
    confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000 CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.recording_artists (
    recording_id UUID NOT NULL REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES knowledge.artists(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 1,
    join_phrase TEXT,
    PRIMARY KEY (recording_id, artist_id, position)
);

CREATE TABLE knowledge.releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    musicbrainz_release_id UUID UNIQUE,
    title TEXT NOT NULL,
    normalized_title TEXT NOT NULL,
    release_group_id UUID,
    release_date DATE,
    country_code TEXT,
    label_name TEXT,
    barcode TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.release_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES knowledge.releases(id) ON DELETE CASCADE,
    recording_id UUID NOT NULL REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    medium_position INTEGER,
    track_position INTEGER,
    track_number TEXT,
    track_title TEXT,
    duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.isrc_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID NOT NULL REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    isrc TEXT NOT NULL,
    source_name TEXT NOT NULL DEFAULT 'musicbrainz',
    confidence NUMERIC(5,4) NOT NULL DEFAULT 0.9000 CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (recording_id, isrc)
);

CREATE TABLE knowledge.external_ids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES knowledge.artists(id) ON DELETE CASCADE,
    release_id UUID REFERENCES knowledge.releases(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (
        (recording_id IS NOT NULL)::int
        + (artist_id IS NOT NULL)::int
        + (release_id IS NOT NULL)::int = 1
    ),
    UNIQUE (provider, provider_id)
);

CREATE TABLE knowledge.audio_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID NOT NULL REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_kind TEXT NOT NULL CHECK (source_kind IN ('musicbrainz', 'local_analysis', 'user_observation', 'admin', 'aggregated')),
    bpm NUMERIC(7,3) CHECK (bpm IS NULL OR (bpm >= 30 AND bpm <= 260)),
    musical_key TEXT,
    camelot_key TEXT,
    genre_primary TEXT,
    genre_secondary TEXT[],
    energy NUMERIC(5,4) CHECK (energy IS NULL OR (energy >= 0 AND energy <= 1)),
    danceability NUMERIC(5,4) CHECK (danceability IS NULL OR (danceability >= 0 AND danceability <= 1)),
    vocalness NUMERIC(5,4) CHECK (vocalness IS NULL OR (vocalness >= 0 AND vocalness <= 1)),
    confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000 CHECK (confidence >= 0 AND confidence <= 1),
    analysed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.contribution_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contributor_ref UUID,
    consent_version TEXT NOT NULL,
    source_app TEXT NOT NULL CHECK (source_app IN ('serato', 'rekordbox', 'traktor', 'virtualdj', 'file_tags', 'losttrackr')),
    app_version TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('macos', 'windows')),
    privacy_filter_version TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '6 months'),
    aggregated_at TIMESTAMPTZ,
    item_count INTEGER NOT NULL DEFAULT 0 CHECK (item_count >= 0)
);

CREATE TABLE knowledge.metadata_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES knowledge.contribution_batches(id) ON DELETE CASCADE,
    matched_recording_id UUID REFERENCES knowledge.recordings(id) ON DELETE SET NULL,
    observed_title TEXT NOT NULL,
    observed_artist TEXT NOT NULL,
    observed_album TEXT,
    observed_remix TEXT,
    normalized_title TEXT NOT NULL,
    normalized_artist TEXT NOT NULL,
    duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms > 0),
    bpm NUMERIC(7,3) CHECK (bpm IS NULL OR (bpm >= 30 AND bpm <= 260)),
    musical_key TEXT,
    camelot_key TEXT,
    genre TEXT,
    year INTEGER CHECK (year IS NULL OR (year >= 1850 AND year <= 2200)),
    isrc TEXT,
    source_confidence NUMERIC(5,4) NOT NULL DEFAULT 0.5000 CHECK (source_confidence >= 0 AND source_confidence <= 1),
    accepted_for_training BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.playlist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    min_bpm NUMERIC(7,3),
    max_bpm NUMERIC(7,3),
    camelot_keys TEXT[],
    genres TEXT[],
    min_energy NUMERIC(5,4),
    max_energy NUMERIC(5,4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge.recording_playlist_scores (
    recording_id UUID NOT NULL REFERENCES knowledge.recordings(id) ON DELETE CASCADE,
    playlist_profile_id UUID NOT NULL REFERENCES knowledge.playlist_profiles(id) ON DELETE CASCADE,
    score NUMERIC(5,4) NOT NULL CHECK (score >= 0 AND score <= 1),
    explanation JSONB NOT NULL DEFAULT '{}'::jsonb,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (recording_id, playlist_profile_id)
);

CREATE TABLE knowledge.sync_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (channel IN ('beta', 'stable')),
    platform TEXT NOT NULL CHECK (platform IN ('macos', 'windows', 'all')),
    package_version TEXT NOT NULL,
    min_app_version TEXT NOT NULL,
    catalog_snapshot_at TIMESTAMPTZ NOT NULL,
    object_url TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (channel, platform, package_version)
);

CREATE INDEX idx_artists_normalized_name_trgm
    ON knowledge.artists USING gin (normalized_name gin_trgm_ops);

CREATE INDEX idx_recordings_normalized_title_trgm
    ON knowledge.recordings USING gin (normalized_title gin_trgm_ops);

CREATE INDEX idx_recordings_primary_artist
    ON knowledge.recordings (primary_artist_id);

CREATE INDEX idx_release_tracks_recording
    ON knowledge.release_tracks (recording_id);

CREATE INDEX idx_isrc_codes_isrc
    ON knowledge.isrc_codes (isrc);

CREATE INDEX idx_audio_features_recording_confidence
    ON knowledge.audio_features (recording_id, confidence DESC);

CREATE INDEX idx_observations_match_fields
    ON knowledge.metadata_observations (normalized_artist, normalized_title, duration_ms);

CREATE INDEX idx_batches_retention
    ON knowledge.contribution_batches (expires_at, aggregated_at);

CREATE VIEW knowledge.public_recording_features AS
SELECT
    r.id AS recording_id,
    r.canonical_title,
    a.display_name AS primary_artist,
    r.duration_ms,
    r.first_release_date,
    af.bpm,
    af.musical_key,
    af.camelot_key,
    af.genre_primary,
    af.genre_secondary,
    af.energy,
    af.danceability,
    af.confidence AS feature_confidence
FROM knowledge.recordings r
LEFT JOIN knowledge.artists a ON a.id = r.primary_artist_id
LEFT JOIN LATERAL (
    SELECT *
    FROM knowledge.audio_features af_inner
    WHERE af_inner.recording_id = r.id
    ORDER BY af_inner.confidence DESC, af_inner.created_at DESC
    LIMIT 1
) af ON TRUE;

CREATE OR REPLACE FUNCTION knowledge.normalize_text(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT lower(regexp_replace(unaccent(coalesce(input, '')), '\s+', ' ', 'g'));
$$;

CREATE OR REPLACE FUNCTION knowledge.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER touch_artists_updated_at
BEFORE UPDATE ON knowledge.artists
FOR EACH ROW EXECUTE FUNCTION knowledge.touch_updated_at();

CREATE TRIGGER touch_recordings_updated_at
BEFORE UPDATE ON knowledge.recordings
FOR EACH ROW EXECUTE FUNCTION knowledge.touch_updated_at();

CREATE TRIGGER touch_releases_updated_at
BEFORE UPDATE ON knowledge.releases
FOR EACH ROW EXECUTE FUNCTION knowledge.touch_updated_at();

CREATE TRIGGER touch_playlist_profiles_updated_at
BEFORE UPDATE ON knowledge.playlist_profiles
FOR EACH ROW EXECUTE FUNCTION knowledge.touch_updated_at();
