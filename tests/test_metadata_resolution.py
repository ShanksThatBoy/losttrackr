import unittest
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock

import losttrackr_app
import knowledge_client

class MetadataResolutionTests(unittest.TestCase):
    @patch("mutagen.File")
    def test_read_audio_tags_success(self, mock_mutagen_file):
        # Mock mutagen file tags
        mock_audio = MagicMock()
        mock_audio.tags = {
            "artist": ["Daft Punk"],
            "title": ["One More Time"],
            "album": ["Discovery"],
            "genre": ["House"],
            "date": ["2001-03-12"]
        }
        mock_mutagen_file.return_value = mock_audio
        
        tags = losttrackr_app.read_audio_tags(Path("dummy.mp3"))
        self.assertEqual(tags["artist"], "Daft Punk")
        self.assertEqual(tags["title"], "One More Time")
        self.assertEqual(tags["album"], "Discovery")
        self.assertEqual(tags["genre"], "House")
        self.assertEqual(tags["year"], 2001)

    @patch("subprocess.run")
    @patch("losttrackr_app.get_fpcalc_path", return_value="fpcalc")
    def test_compute_audio_fingerprint_success(self, mock_get_path, mock_subprocess):
        # Mock subprocess run output
        mock_process = MagicMock()
        mock_process.stdout = '{"duration": 240, "fingerprint": "AQAAAA"}'
        mock_subprocess.return_value = mock_process
        
        fp = losttrackr_app.compute_audio_fingerprint(Path("dummy.mp3"))
        self.assertIsNotNone(fp)
        self.assertEqual(fp["duration"], 240)
        self.assertEqual(fp["fingerprint"], "AQAAAA")

    @patch("subprocess.run", side_effect=Exception("error"))
    def test_compute_audio_fingerprint_failure(self, mock_subprocess):
        fp = losttrackr_app.compute_audio_fingerprint(Path("dummy.mp3"))
        self.assertIsNone(fp)

    @patch("smart_import.scan_audio_files")
    @patch("losttrackr_app.read_audio_tags")
    @patch("losttrackr_app.compute_audio_fingerprint")
    @patch("knowledge_client.resolve_fingerprints")
    def test_analyze_folder_metadata_cascade(
        self, mock_resolve, mock_fingerprint, mock_tags, mock_scan
    ):
        # Mock audio file scan
        mock_scan.return_value = [
            {
                "id": "1",
                "file": "track1.mp3",
                "source": "folder/track1.mp3",
                "artist": "Artist1",
                "title": "Title1",
                "year": 2020,
                "genre": "Genre1",
                "version": "Remix"
            },
            {
                "id": "2",
                "file": "track2.mp3",
                "source": "folder/track2.mp3",
                "artist": "Artist2",
                "title": "Title2",
                "year": None,
                "genre": None,
                "version": ""
            }
        ]
        
        # Mock tags reading (empty to force fallback to inferred)
        mock_tags.return_value = {
            "artist": "",
            "title": "",
            "album": "",
            "year": None,
            "genre": ""
        }
        
        # Mock fingerprint computation
        mock_fingerprint.side_effect = [
            {"duration": 180, "fingerprint": "FP1"},
            {"duration": 200, "fingerprint": "FP2"}
        ]
        
        # Mock resolve_fingerprints (AcoustID) - Track 1 matches, Track 2 matches as suggestion
        mock_resolve.return_value = {
            "results": [
                {
                    "client_track_id": "0",
                    "status": "matched",
                    "canonical": {
                        "artist": "Canonical Artist 1",
                        "title": "Canonical Title 1",
                        "bpm": 120.0,
                        "camelot_key": "8A",
                        "genre": "Deep House",
                        "duration_ms": 180000
                    }
                },
                {
                    "client_track_id": "1",
                    "status": "probable",
                    "canonical": {
                        "artist": "Canonical Artist 2",
                        "title": "Canonical Title 2",
                        "bpm": 100.0,
                        "camelot_key": "4A",
                        "genre": "Hip-Hop",
                        "duration_ms": 195000
                    }
                }
            ]
        }
        
        api = losttrackr_app.LostTrackrApi()
        result = api.analyze_folder_metadata("folder")
        self.assertTrue(result["ok"])
        tracks = result["tracks"]
        
        self.assertEqual(len(tracks), 2)
        
        # Assert Track 1 (matched via fingerprint)
        self.assertEqual(tracks[0]["artist"], "Canonical Artist 1")
        self.assertEqual(tracks[0]["title"], "Canonical Title 1")
        self.assertEqual(tracks[0]["bpm"], 120.0)
        self.assertEqual(tracks[0]["camelot_key"], "8A")
        self.assertEqual(tracks[0]["genre"], "Deep House")
        self.assertEqual(tracks[0]["status"], "complete")
        self.assertEqual(tracks[0]["source"], "Base de connaissances")
        self.assertTrue(tracks[0]["is_edit_detected"])  # duration is 180s vs 180s but version is "Remix"
        
        # Assert Track 2 (matched via text search suggestion)
        self.assertEqual(tracks[1]["artist"], "Canonical Artist 2")
        self.assertEqual(tracks[1]["title"], "Canonical Title 2")
        self.assertEqual(tracks[1]["bpm"], 100.0)
        self.assertEqual(tracks[1]["camelot_key"], "4A")
        self.assertEqual(tracks[1]["genre"], "Hip-Hop")
        self.assertEqual(tracks[1]["status"], "probable_suggestion")
        self.assertEqual(tracks[1]["source"], "Suggestion KB")

    @patch("losttrackr_app.write_audio_tags")
    @patch("pathlib.Path.exists", return_value=True)
    def test_save_tracks_metadata_success(self, mock_exists, mock_write_tags):
        api = losttrackr_app.LostTrackrApi()
        tracks = [
            {
                "path": "track1.mp3",
                "file": "track1.mp3",
                "artist": "Artist1",
                "title": "Title1",
                "year": 2020,
                "genre": "Genre1",
                "bpm": 120.0,
                "camelot_key": "8A",
                "status": "complete"
            },
            {
                "path": "track2.mp3",
                "file": "track2.mp3",
                "artist": "Artist2",
                "title": "Title2",
                "year": 2021,
                "genre": "Genre2",
                "bpm": 100.0,
                "camelot_key": "4A",
                "status": "probable_suggestion"
            },
            {
                "path": "track3.mp3",
                "file": "track3.mp3",
                "artist": "Artist3",
                "title": "Title3",
                "status": "incomplete"
            }
        ]
        
        result = api.save_tracks_metadata(tracks)
        self.assertTrue(result["ok"])
        self.assertEqual(result["saved_count"], 2)
        
        # Verify write_audio_tags called for track1 and track2, but NOT track3
        self.assertEqual(mock_write_tags.call_count, 2)
        mock_write_tags.assert_any_call(
            Path("track1.mp3"),
            {
                "artist": "Artist1",
                "title": "Title1",
                "year": 2020,
                "genre": "Genre1",
                "bpm": 120.0,
                "camelot_key": "8A"
            }
        )
        mock_write_tags.assert_any_call(
            Path("track2.mp3"),
            {
                "artist": "Artist2",
                "title": "Title2",
                "year": 2021,
                "genre": "Genre2",
                "bpm": 100.0,
                "camelot_key": "4A"
            }
        )

    @patch("mutagen.id3.ID3")
    def test_write_audio_tags_mp3(self, mock_id3_class):
        mock_id3 = MagicMock()
        mock_id3_class.return_value = mock_id3
        
        from losttrackr_app import write_audio_tags
        write_audio_tags(Path("test.mp3"), {
            "artist": "Elvis",
            "title": "Love Me Tender",
            "bpm": 80.0,
            "camelot_key": "11B"
        })
        
        # Verify we initialized and added tags
        mock_id3_class.assert_called_once_with("test.mp3")
        self.assertTrue(mock_id3.add.called)
        mock_id3.save.assert_called_once_with("test.mp3")

if __name__ == "__main__":
    unittest.main()
