import unittest

import dj_set


class DjSetPlanTests(unittest.TestCase):
    def test_event_plan_groups_recent_files_by_set_phase(self):
        files = [
            {
                "id": "one",
                "file": "Burna Boy - City Boys.mp3",
                "artist": "Burna Boy",
                "title": "City Boys",
                "genre": "Afro",
                "genreHints": ["Afro"],
                "destinationDisplay": "~/Music/Afro/Burna Boy - City Boys.mp3",
            },
            {
                "id": "two",
                "file": "Peggy Gou - Nanana.mp3",
                "artist": "Peggy Gou",
                "title": "Nanana",
                "genre": "House",
                "genreHints": ["House"],
                "destinationDisplay": "~/Music/House/Peggy Gou - Nanana.mp3",
            },
        ]

        plan = dj_set.build_plan(mode="event", files=files)

        names = {group["name"] for group in plan["groups"]}
        self.assertIn("Groove", names)
        self.assertIn("Peak Time", names)
        self.assertEqual(plan["totals"]["itemCount"], 2)
        self.assertEqual(plan["writeMode"], "backup_required")

    def test_wedding_event_plan_uses_simple_template_names(self):
        files = [
            {
                "id": "one",
                "file": "Mauvais Djo, Kano Choir - Gospel Version.mp3",
                "artist": "Mauvais Djo, Kano Choir",
                "title": "Gospel Version",
                "genre": "Gospel",
                "genreHints": ["Gospel"],
                "destinationDisplay": "~/Music/Gospel/Gospel Version.mp3",
            }
        ]

        plan = dj_set.build_plan(mode="event", event_type="wedding", files=files)

        self.assertEqual(plan["eventType"], "wedding")
        self.assertEqual(plan["groups"][0]["name"], "Cérémonie")
        self.assertIn("mariage", plan["modeLabel"])

    def test_organize_plan_prefers_existing_matching_target(self):
        files = [
            {
                "id": "one",
                "file": "Peggy Gou - Nanana.mp3",
                "artist": "Peggy Gou",
                "title": "Nanana",
                "genre": "House",
                "genreHints": ["House"],
                "destinationDisplay": "~/Music/House/Peggy Gou - Nanana.mp3",
            }
        ]
        targets = [{"name": "House Club", "sampleFiles": ["Peggy Gou - Starry Night.mp3"], "trackCount": 22}]

        plan = dj_set.build_plan(mode="organize", files=files, existing_targets=targets)

        self.assertEqual(plan["groups"][0]["targetType"], "existing")
        self.assertEqual(plan["groups"][0]["name"], "House Club")
        self.assertEqual(plan["groups"][0]["confidence"], "high")

    def test_organize_plan_can_audit_existing_targets_without_recent_files(self):
        targets = [{"name": "Afro Warmup", "sampleFiles": ["Burna Boy - City Boys.mp3"], "trackCount": 18}]

        plan = dj_set.build_plan(mode="organize", files=[], existing_targets=targets)

        self.assertEqual(plan["source"], "library_preview")
        self.assertEqual(plan["groups"][0]["targetType"], "existing")
        self.assertEqual(plan["groups"][0]["trackCount"], 18)

    def test_recent_imports_plan_uses_dedicated_mode(self):
        files = [
            {
                "id": "one",
                "file": "Peggy Gou - Nanana.mp3",
                "artist": "Peggy Gou",
                "title": "Nanana",
                "genre": "House",
                "genreHints": ["House"],
                "destinationDisplay": "~/Music/House/Peggy Gou - Nanana.mp3",
            }
        ]
        targets = [{"name": "House Club", "sampleFiles": ["Peggy Gou - Starry Night.mp3"], "trackCount": 22}]

        plan = dj_set.build_plan(mode="recent_imports", files=files, existing_targets=targets)

        self.assertEqual(plan["mode"], "recent_imports")
        self.assertEqual(plan["source"], "recent_smart_import")
        self.assertEqual(plan["groups"][0]["targetType"], "existing")


    def test_build_style_inspiration_plan(self):
        options = {
            "style": "Afro House",
            "mood": "Club",
            "source": "deezer",
            "limit": 40,
            "localOnly": False
        }
        plan = dj_set.build_style_inspiration_plan(options)
        self.assertEqual(plan["mode"], "style_inspiration")
        self.assertEqual(plan["provider"]["id"], "deezer")
        self.assertEqual(plan["totals"]["total"], 40)
        self.assertEqual(len(plan["items"]), 40)

        # Verify deterministic statuses are set
        statuses = {item["status"] for item in plan["items"]}
        self.assertIn("local", statuses)
        self.assertIn("probable", statuses)
        self.assertIn("review", statuses)
        self.assertIn("missing", statuses)

        # Test localOnly = True
        options_local = dict(options)
        options_local["localOnly"] = True
        plan_local = dj_set.build_style_inspiration_plan(options_local)
        self.assertEqual(plan_local["totals"]["total"], 40)
        self.assertLess(len(plan_local["items"]), 40)
        self.assertEqual(plan_local["totals"]["visible"], len(plan_local["items"]))
        for item in plan_local["items"]:
            self.assertNotEqual(item["status"], "missing")

    def test_analyze_folder_metadata_matches_knowledge_and_sourcing(self):
        from unittest.mock import patch
        from losttrackr_app import LostTrackrApi

        api = LostTrackrApi()

        mock_files = [
            {
                "id": "file1",
                "file": "Suavemente.mp3",
                "source": "/path/to/Suavemente.mp3",
                "artist": "",
                "title": "Suavemente",
                "genre": "Latino",
            },
            {
                "id": "file2",
                "file": "All The Small Things.mp3",
                "source": "/path/to/All The Small Things.mp3",
                "artist": "",
                "title": "All The Small Things",
                "genre": "A verifier",
            }
        ]

        with patch("smart_import.scan_audio_files", return_value=mock_files):
            result = api.analyze_folder_metadata("/path/to/folder")
            
            self.assertTrue(result["ok"])
            tracks = result["tracks"]
            self.assertEqual(len(tracks), 2)
            
            t1 = tracks[0]
            self.assertEqual(t1["title"], "Suavemente")
            self.assertEqual(t1["artist"], "Elvis Crespo")
            self.assertEqual(t1["bpm"], 127.0)
            self.assertEqual(t1["camelot_key"], "4B")
            self.assertEqual(t1["status"], "complete")
            self.assertEqual(t1["source"], "Base de connaissances")
            
            t2 = tracks[1]
            self.assertEqual(t2["title"], "All The Small Things")
            self.assertEqual(t2["artist"], "Blink 182")
            self.assertEqual(t2["bpm"], 76.0)
            self.assertEqual(t2["camelot_key"], "10B")
            self.assertEqual(t2["status"], "probable_suggestion")
            self.assertEqual(t2["source"], "Suggestion KB")


if __name__ == "__main__":
    unittest.main()
