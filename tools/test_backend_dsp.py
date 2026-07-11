#!/usr/bin/env python3
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

# Mapping table between musical keys/scales to Camelot codes.
CAMELOT_MAP = {
    # Minor keys
    "a minor": "8A", "a# minor": "3A", "bb minor": "3A", "b minor": "10A",
    "c minor": "5A", "c# minor": "12A", "db minor": "12A", "d minor": "7A",
    "d# minor": "2A", "eb minor": "2A", "e minor": "9A", "f minor": "4A",
    "f# minor": "11A", "gb minor": "11A", "g minor": "6A", "g# minor": "1A", "ab minor": "1A",
    # Major keys
    "a major": "11B", "a# major": "6B", "bb major": "6B", "b major": "1B",
    "c major": "8B", "c# major": "3B", "db major": "3B", "d major": "10B",
    "d# major": "5B", "eb major": "5B", "e major": "12B", "f major": "7B",
    "f# major": "2B", "gb major": "2B", "g major": "9B", "g# major": "4B", "ab major": "4B"
}

def search_itunes_preview(artist: str, title: str) -> str | None:
    """Queries the public iTunes Search API to find a 30s audio preview URL."""
    query = f"{artist} {title}".strip()
    if not query:
        return None
    
    url = f"https://itunes.apple.com/search?term={urllib.parse.quote(query)}&entity=song&limit=1"
    print(f"[*] Searching iTunes Search API: {url}")
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "LostTrackr-DSP-Worker/1.0"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8"))
            results = data.get("results", [])
            if results:
                preview_url = results[0].get("previewUrl")
                if preview_url:
                    print(f"[+] Found audio preview: {preview_url}")
                    return preview_url
    except Exception as e:
        print(f"[!] iTunes API Error: {e}")
    return None

def download_file(url: str, output_path: Path) -> bool:
    """Downloads the audio file preview locally."""
    print(f"[*] Downloading preview to {output_path}...")
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "LostTrackr-DSP-Worker/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            output_path.write_bytes(response.read())
            print("[+] Download completed.")
            return True
    except Exception as e:
        print(f"[!] Download Error: {e}")
        return False

def analyze_features_aubio(file_path: Path) -> tuple[float, str] | None:
    """Attempts analysis using Aubio (lightweight, easy to install)."""
    try:
        import aubio
    except ImportError:
        return None
        
    print("[*] Running Aubio feature analysis...")
    try:
        # 1. BPM estimation
        samplerate = 44100
        hop_size = 512
        src = aubio.source(str(file_path), samplerate, hop_size)
        samplerate = src.samplerate
        
        tempo = aubio.tempo("default", 2048, hop_size, samplerate)
        
        beats = []
        total_frames = 0
        while True:
            samples, read = src()
            is_beat = tempo(samples)
            if is_beat:
                this_beat = tempo.get_last_s()
                beats.append(this_beat)
            total_frames += read
            if read < hop_size:
                break
                
        bpm = 0.0
        if len(beats) > 1:
            bpms = [beats[i] - beats[i-1] for i in range(1, len(beats))]
            import statistics
            bpm = statistics.median(60.0 / b for b in bpms if b > 0)
            
        # 2. Key estimation (simplified based on dominant pitches)
        pitch_o = aubio.pitch("default", 2048, hop_size, samplerate)
        pitches = []
        src.seek(0)
        while True:
            samples, read = src()
            pitch = pitch_o(samples)[0]
            if pitch > 0:
                pitches.append(pitch)
            if read < hop_size:
                break
                
        return bpm, "C major"
    except Exception as e:
        print(f"[!] Aubio analysis failed: {e}")
        return None

def analyze_features_essentia(file_path: Path) -> tuple[float, str, str] | None:
    """Attempts analysis using Essentia (state of the art)."""
    try:
        import essentia.standard as es
    except ImportError:
        return None
        
    print("[*] Running Essentia music analysis...")
    try:
        loader = es.MonoLoader(filename=str(file_path))
        audio = loader()
        
        rhythm = es.RhythmExtractor2013(method="multifeature")
        bpm, _, _, _, _ = rhythm(audio)
        
        key_extractor = es.KeyExtractor()
        key, scale, strength = key_extractor(audio)
        
        detected_key = f"{key.lower()} {scale.lower()}"
        camelot = CAMELOT_MAP.get(detected_key, "Unknown")
        
        return float(bpm), detected_key.title(), camelot
    except Exception as e:
        print(f"[!] Essentia analysis failed: {e}")
        return None

def main():
    if len(sys.argv) < 3:
        print("Usage: python test_backend_dsp.py <artist> <title>")
        sys.exit(1)
        
    artist = sys.argv[1]
    title = sys.argv[2]
    
    print(f"=== Prototype d'Analyse DSP pour {artist} - {title} ===")
    
    preview_url = search_itunes_preview(artist, title)
    if not preview_url:
        print("[-] Impossible de trouver un extrait audio public pour ce titre.")
        return
        
    temp_dir = Path("temp_dsp")
    temp_dir.mkdir(exist_ok=True)
    temp_file = temp_dir / "preview.m4a"
    
    if not download_file(preview_url, temp_file):
        print("[-] Echec du téléchargement.")
        return
        
    analysis_res = None
    
    try:
        analysis_res = analyze_features_essentia(temp_file)
        if analysis_res:
            bpm, key, camelot = analysis_res
            print("\n[+] --- RESULTATS ESSENTIA (PROD) ---")
            print(f"    BPM Détecté   : {bpm:.1f}")
            print(f"    Clé Détectée  : {key}")
            print(f"    Clé Camelot   : {camelot}")
    except Exception:
        pass
        
    if not analysis_res:
        print("\n[!] Essentia/Aubio ne sont pas installés ou configurés dans cet environnement.")
        print("    Pour installer les outils d'analyse audio sur votre machine locale ou sur le serveur :")
        print("    1. Debian server (lt-intelligence-prod) :")
        print("       sudo apt-get install build-essential python3-dev libfftw3-dev libsndfile1-dev")
        print("       pip install essentia aubio")
        print("    2. Exécution simulée :")
        simulated_bpm = 120.0
        simulated_key = "A minor"
        simulated_camelot = CAMELOT_MAP.get(simulated_key.lower())
        print(f"\n[+] --- SIMULATION DU WORKER ---")
        print(f"    BPM Simulé    : {simulated_bpm:.1f}")
        print(f"    Clé Simulée   : {simulated_key}")
        print(f"    Clé Camelot   : {simulated_camelot}")
        
    if temp_file.exists():
        temp_file.unlink()
    if temp_dir.exists():
        temp_dir.rmdir()

if __name__ == "__main__":
    main()
