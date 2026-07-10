"""Base class for streaming providers."""

class StreamingProvider:
    provider_id: str
    display_name: str

    def search_style_tracks(self, style: str, mood: str = None, limit: int = 40) -> list[dict]:
        """Search tracks from the streaming platform based on style and mood.

        Returns a list of track metadata dicts.
        """
        raise NotImplementedError

    def search_track(self, title: str, artist: str = None) -> list[dict]:
        """Search for a specific track by title and optional artist.

        Returns a list of matching track metadata dicts.
        """
        raise NotImplementedError
