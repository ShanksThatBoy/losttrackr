# LostTrackr v1.4.0 - Windows

- **Manual Refinement (Side drawer)**: New edit form to manually correct artist, title, year, genre, BPM, and key, or rerun search in the Knowledge Base.
- **Physical Metadata Writing (Mutagen)**: Allows writing validated metadata (BPM, key, genre, artist, title, year) directly into the original audio files.
- **Visual Pipeline & Waveform Progress**: Replaces spinner with a 4-step progress pipeline (Scan, Fingerprint, Identification, Enrichment) and an animated waveform progress bar.
- **Improved Network Reliability**: Reduced chunk size to 8 tracks (RESOLVE_CHUNK_SIZE) and increased timeout to 45s to prevent query failures on slow/cold queries. Non-blocking error handling for partial chunk failures.
- **Consolidated V2 API Integration**: Queries the consolidated consensus database table `recording_canonical` with an asynchronous worker queueing fallback.
- Builds `LostTrackrSetup-v1.4.0-x64.exe` with Inno Setup.
- This release is unsigned. Windows SmartScreen warnings are expected.
- Microsoft Edge WebView2 Runtime is required for the app UI.
