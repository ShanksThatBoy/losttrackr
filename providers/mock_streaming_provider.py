"""Mock streaming provider for testing locally without actual APIs."""

from providers.base_provider import StreamingProvider


class MockStreamingProvider(StreamingProvider):
    def __init__(self, provider_id: str = "deezer", display_name: str = "Deezer"):
        self.provider_id = provider_id
        self.display_name = display_name

    def search_style_tracks(self, style: str, mood: str = None, limit: int = 40) -> list[dict]:
        # Datasets by style
        datasets = {
            "Afro House": [
                {"artist": "Adam Port, Stryv, Keinemusik", "title": "Move"},
                {"artist": "Rampa", "title": "Les Gout"},
                {"artist": "Black Coffee", "title": "Drive"},
                {"artist": "&ME", "title": "The Rapture Pt.III"},
                {"artist": "Francis Mercier", "title": "Premier Gaou"},
                {"artist": "MoBlack", "title": "Yamore"}
            ],
            "Amapiano": [
                {"artist": "Uncle Waffles", "title": "Tanzania"},
                {"artist": "Tyler ICU", "title": "Mnike"},
                {"artist": "Kabza De Small", "title": "Imithandazo"},
                {"artist": "Focalistic", "title": "Ke Star"}
            ],
            "Reggaeton": [
                {"artist": "Daddy Yankee", "title": "Gasolina"},
                {"artist": "Bad Bunny", "title": "Tití Me Preguntó"},
                {"artist": "Karol G", "title": "Provenza"},
                {"artist": "Feid", "title": "Luna"}
            ],
            "Baile Funk": [
                {"artist": "MC Fioti", "title": "Bum Bum Tam Tam"},
                {"artist": "DJ GBR", "title": "Let’s Go 4"},
                {"artist": "Anitta", "title": "Envolver"},
                {"artist": "DENNIS", "title": "Tá OK"}
            ],
            "Latino": [
                {"artist": "Elvis Crespo", "title": "Suavemente"},
                {"artist": "Marc Anthony", "title": "Vivir Mi Vida"},
                {"artist": "Shakira", "title": "Hips Don’t Lie"},
                {"artist": "Don Omar", "title": "Danza Kuduro"}
            ],
            "Tech House": [
                {"artist": "Fisher", "title": "Losing It"},
                {"artist": "John Summit", "title": "Where You Are"},
                {"artist": "Chris Lake", "title": "Turn Off The Lights"},
                {"artist": "Mau P", "title": "Drugs From Amsterdam"}
            ],
            "Rap FR": [
                {"artist": "Ninho", "title": "Jefe"},
                {"artist": "Gazo", "title": "Die"},
                {"artist": "Damso", "title": "Macarena"},
                {"artist": "Tiakola", "title": "Meuda"}
            ],
            "R&B": [
                {"artist": "Usher", "title": "Yeah!"},
                {"artist": "Chris Brown", "title": "Under The Influence"},
                {"artist": "SZA", "title": "Snooze"},
                {"artist": "The Weeknd", "title": "Earned It"}
            ],
            "Afrobeats": [
                {"artist": "Burna Boy", "title": "City Boys"},
                {"artist": "Rema", "title": "Calm Down"},
                {"artist": "Wizkid", "title": "Essence"},
                {"artist": "Tyla", "title": "Water"}
            ],
            "Hardtech": [
                {"artist": "Sefa", "title": "Muzika"},
                {"artist": "Dr. Peacock", "title": "Trip to Ireland"},
                {"artist": "Billx", "title": "Halalal"},
                {"artist": "Angerfist", "title": "Solid Decline"}
            ],
            "Techno": [
                {"artist": "Charlotte de Witte", "title": "Overdrive"},
                {"artist": "Amelie Lens", "title": "Hypnotized"},
                {"artist": "Enrico Sangiuliano", "title": "Astral Projection"},
                {"artist": "Adam Beyer", "title": "Your Mind"}
            ],
            "Rock": [
                {"artist": "AC/DC", "title": "Back In Black"},
                {"artist": "Queen", "title": "Bohemian Rhapsody"},
                {"artist": "Nirvana", "title": "Smells Like Teen Spirit"},
                {"artist": "Pink Floyd", "title": "Another Brick In The Wall"}
            ],
            "Métal": [
                {"artist": "Metallica", "title": "Master of Puppets"},
                {"artist": "Slipknot", "title": "Duality"},
                {"artist": "System of a Down", "title": "Chop Suey!"},
                {"artist": "Iron Maiden", "title": "The Trooper"}
            ],
            "Soul": [
                {"artist": "Aretha Franklin", "title": "Respect"},
                {"artist": "Marvin Gaye", "title": "What's Going On"},
                {"artist": "Otis Redding", "title": "(Sittin' On) The Dock of the Bay"},
                {"artist": "Ray Charles", "title": "Georgia on My Mind"}
            ],
            "Jazz": [
                {"artist": "Miles Davis", "title": "So What"},
                {"artist": "John Coltrane", "title": "My Favorite Things"},
                {"artist": "Dave Brubeck", "title": "Take Five"},
                {"artist": "Louis Armstrong", "title": "What a Wonderful World"}
            ],
            "Disco": [
                {"artist": "ABBA", "title": "Dancing Queen"},
                {"artist": "Bee Gees", "title": "Stayin' Alive"},
                {"artist": "Donna Summer", "title": "I Feel Love"},
                {"artist": "Chic", "title": "Le Freak"}
            ],
            "Pop": [
                {"artist": "Michael Jackson", "title": "Billie Jean"},
                {"artist": "Taylor Swift", "title": "Cruel Summer"},
                {"artist": "Billie Eilish", "title": "Bad Guy"},
                {"artist": "Harry Styles", "title": "As It Was"}
            ],
            "Electro": [
                {"artist": "Daft Punk", "title": "One More Time"},
                {"artist": "Justice", "title": "D.A.N.C.E."},
                {"artist": "Kavinsky", "title": "Nightcall"},
                {"artist": "The Prodigy", "title": "Firestarter"}
            ],
            "Dubstep": [
                {"artist": "Skrillex", "title": "Scary Monsters and Nice Sprites"},
                {"artist": "Flux Pavilion", "title": "I Can't Stop"},
                {"artist": "Zomboy", "title": "Like a Bitch"},
                {"artist": "Knife Party", "title": "Bonfire"}
            ],
            "Drum & Bass": [
                {"artist": "Chase & Status", "title": "Baddadan"},
                {"artist": "Sub Focus", "title": "Desire"},
                {"artist": "Pendulum", "title": "Watercolour"},
                {"artist": "Wilkinson", "title": "Afterglow"}
            ],
            "Généraliste": [
                {"artist": "Dua Lipa", "title": "Houdini"},
                {"artist": "David Guetta", "title": "Titanium"},
                {"artist": "Rihanna", "title": "We Found Love"},
                {"artist": "Beyoncé", "title": "Crazy In Love"}
            ]
        }

        base_tracks = datasets.get(style, datasets["Afro House"])
        general_tracks = datasets.get("Généraliste", [])

        # Combine base tracks + other tracks to make a larger pool if limit > len(base_tracks)
        combined = list(base_tracks)

        # Add general tracks and other genres to combined pool to avoid exact duplicates
        for genre, tracks_in_genre in datasets.items():
            if genre != style and genre != "Généraliste":
                combined.extend(tracks_in_genre)
        combined.extend(general_tracks)

        prefixes = ["", " (Extended Mix)", " (Remix)", " (Radio Edit)", " (Club Mix)", " (Dub Mix)", " (VIP Edit)"]

        results = []
        for i in range(limit):
            # Select track from pool deterministically based on index to keep it stable
            base_track = combined[i % len(combined)]
            prefix_index = (i // len(combined)) % len(prefixes)
            suffix = prefixes[prefix_index]

            title = base_track["title"] + suffix
            artist = base_track["artist"]

            results.append({
                "provider": self.provider_id,
                "provider_track_id": f"track_{self.provider_id}_{1000 + i}",
                "title": title,
                "artist": artist,
                "album": f"{style} {mood} Hits",
                "duration_ms": 180000 + (i * 2000),
                "isrc": f"FRMOCK{1000000 + i}",
                "external_url": f"https://www.{self.provider_id}.com/track/{1000 + i}",
                "preview_url": f"https://www.{self.provider_id}.com/preview/{1000 + i}.mp3",
                "source_playlist_name": f"Mock {style} {mood}",
                "style": style,
                "mood": mood
            })

        return results

    def search_track(self, title: str, artist: str = None) -> list[dict]:
        import re

        def normalize(s):
            if not s:
                return ""
            return re.sub(r'[^a-z0-9]', '', str(s).lower())

        title_norm = normalize(title)
        artist_norm = normalize(artist) if artist else ""

        # Typical metadata by style
        style_meta = {
            "Afro House": {"bpm": 120.0, "camelot_key": "8A", "genre": "Afro House"},
            "Amapiano": {"bpm": 115.0, "camelot_key": "10A", "genre": "Amapiano"},
            "Reggaeton": {"bpm": 96.0, "camelot_key": "11B", "genre": "Reggaeton"},
            "Baile Funk": {"bpm": 130.0, "camelot_key": "4A", "genre": "Baile Funk"},
            "Latino": {"bpm": 127.0, "camelot_key": "4B", "genre": "Latino"},
            "Tech House": {"bpm": 126.0, "camelot_key": "5A", "genre": "Tech House"},
            "Rap FR": {"bpm": 92.0, "camelot_key": "6A", "genre": "Rap"},
            "R&B": {"bpm": 85.0, "camelot_key": "1A", "genre": "R&B"},
            "Afrobeats": {"bpm": 108.0, "camelot_key": "2A", "genre": "Afrobeats"},
            "Hardtech": {"bpm": 155.0, "camelot_key": "9A", "genre": "Hardcore"},
            "Techno": {"bpm": 128.0, "camelot_key": "7A", "genre": "Techno"},
            "Rock": {"bpm": 120.0, "camelot_key": "11A", "genre": "Rock"},
            "Métal": {"bpm": 140.0, "camelot_key": "10A", "genre": "Metal"},
            "Soul": {"bpm": 90.0, "camelot_key": "3A", "genre": "Soul"},
            "Jazz": {"bpm": 110.0, "camelot_key": "5A", "genre": "Jazz"},
            "Disco": {"bpm": 120.0, "camelot_key": "4B", "genre": "Disco"},
            "Pop": {"bpm": 118.0, "camelot_key": "3B", "genre": "Pop"},
            "Electro": {"bpm": 125.0, "camelot_key": "9A", "genre": "Electro"},
            "Dubstep": {"bpm": 140.0, "camelot_key": "2A", "genre": "Dubstep"},
            "Drum & Bass": {"bpm": 174.0, "camelot_key": "11A", "genre": "Drum & Bass"},
            "Généraliste": {"bpm": 118.0, "camelot_key": "8B", "genre": "Pop"}
        }

        # Datasets by style
        datasets = {
            "Afro House": [
                {"artist": "Adam Port, Stryv, Keinemusik", "title": "Move"},
                {"artist": "Rampa", "title": "Les Gout"},
                {"artist": "Black Coffee", "title": "Drive"},
                {"artist": "&ME", "title": "The Rapture Pt.III"},
                {"artist": "Francis Mercier", "title": "Premier Gaou"},
                {"artist": "MoBlack", "title": "Yamore"}
            ],
            "Amapiano": [
                {"artist": "Uncle Waffles", "title": "Tanzania"},
                {"artist": "Tyler ICU", "title": "Mnike"},
                {"artist": "Kabza De Small", "title": "Imithandazo"},
                {"artist": "Focalistic", "title": "Ke Star"}
            ],
            "Reggaeton": [
                {"artist": "Daddy Yankee", "title": "Gasolina"},
                {"artist": "Bad Bunny", "title": "Tití Me Preguntó"},
                {"artist": "Karol G", "title": "Provenza"},
                {"artist": "Feid", "title": "Luna"}
            ],
            "Tech House": [
                {"artist": "Fisher", "title": "Losing It"},
                {"artist": "John Summit", "title": "Where You Are"},
                {"artist": "Chris Lake", "title": "Turn Off The Lights"},
                {"artist": "Mau P", "title": "Drugs From Amsterdam"}
            ],
            "Pop": [
                {"artist": "Michael Jackson", "title": "Billie Jean"},
                {"artist": "Taylor Swift", "title": "Cruel Summer"},
                {"artist": "Billie Eilish", "title": "Bad Guy"},
                {"artist": "Harry Styles", "title": "As It Was"}
            ],
            "Electro": [
                {"artist": "Daft Punk", "title": "One More Time"},
                {"artist": "Justice", "title": "D.A.N.C.E."},
                {"artist": "Kavinsky", "title": "Nightcall"},
                {"artist": "The Prodigy", "title": "Firestarter"}
            ]
        }

        # Check for a match in our datasets
        found_track = None
        found_style = "Généraliste"
        
        for style, tracks in datasets.items():
            for t in tracks:
                t_title_norm = normalize(t["title"])
                t_artist_norm = normalize(t["artist"])
                
                # Check match
                title_match = (title_norm in t_title_norm) or (t_title_norm in title_norm)
                artist_match = not artist_norm or (artist_norm in t_artist_norm) or (t_artist_norm in artist_norm)
                
                if title_match and artist_match:
                    found_track = t
                    found_style = style
                    break
            if found_track:
                break

        # Fallback details if not found in dataset
        if found_track:
            res_title = found_track["title"]
            res_artist = found_track["artist"]
        else:
            # Reconstruct title/artist from query
            res_title = title or "Unknown Title"
            res_artist = artist or "Unknown Artist"
            
            # Simple heuristic for fallback style/genre based on title/artist text
            full_haystack = normalize(res_title + " " + res_artist)
            for style, keywords in style_meta.items():
                if normalize(style) in full_haystack:
                    found_style = style
                    break

        meta = style_meta.get(found_style, style_meta["Généraliste"])

        return [{
            "provider": self.provider_id,
            "provider_track_id": f"track_{self.provider_id}_{abs(hash(res_title + res_artist)) % 10000}",
            "title": res_title,
            "artist": res_artist,
            "album": f"{found_style} Hits",
            "duration_ms": 200000,
            "isrc": f"FRMOCK{abs(hash(res_title)) % 1000000:06d}",
            "external_url": f"https://www.{self.provider_id}.com/track/mock",
            "preview_url": f"https://www.{self.provider_id}.com/preview/mock.mp3",
            "bpm": meta["bpm"],
            "camelot_key": meta["camelot_key"],
            "genre": meta["genre"]
        }]
