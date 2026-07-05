import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import smart_import
from losttrackr_app import LostTrackrApi


class SmartImportTests(unittest.TestCase):
    def test_infers_artist_title_and_year(self):
        metadata = smart_import.infer_track_metadata("Burna Boy - City Boys 2023.mp3")

        self.assertEqual(metadata["artist"], "Burna Boy")
        self.assertEqual(metadata["title"], "City Boys")
        self.assertEqual(metadata["year"], 2023)

    def test_clean_plan_groups_by_detected_genre(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            destination = root / "Music" / "LostTrackr Smart Import"
            source.mkdir()
            (source / "Peggy Gou - Nanana house edit.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="clean",
                destination_root=destination,
            )

        self.assertEqual(plan["totals"]["audio"], 1)
        self.assertIn("House", plan["files"][0]["destinationDisplay"])
        self.assertEqual(plan["files"][0]["action"], "move")

    def test_existing_plan_uses_matching_library_folder(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            afro = library / "Afro"
            source.mkdir()
            afro.mkdir(parents=True)
            (source / "Afro Burna Boy - City Boys.mp3").write_bytes(b"audio")
            (afro / "reference.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            self.assertEqual(plan["totals"]["audio"], 1)
            self.assertEqual(Path(plan["files"][0]["destinationFolder"]).name, "Afro")
            self.assertEqual(plan["files"][0]["confidence"], "high")

    def test_existing_plan_avoids_dl_as_final_destination(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            dl = library / "DL"
            afro = library / "Afro"
            source.mkdir()
            dl.mkdir(parents=True)
            afro.mkdir(parents=True)
            (source / "Burna Boy - City Boys.mp3").write_bytes(b"audio")
            (dl / "Burna Boy - City Boys afro edit.mp3").write_bytes(b"audio")
            (afro / "reference.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            self.assertEqual(Path(plan["files"][0]["destinationFolder"]).name, "Afro")
            self.assertNotIn("DL", plan["files"][0]["destinationFolder"])

    def test_existing_plan_avoids_a_trier_as_final_destination(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            staging = library / "A trier"
            source.mkdir()
            staging.mkdir(parents=True)
            (source / "Peggy Gou - Nanana house edit.mp3").write_bytes(b"audio")
            (staging / "Peggy Gou - Nanana house edit.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            destination_parts = set(Path(plan["files"][0]["destinationFolder"]).parts)
            self.assertNotIn("A trier", destination_parts)
            self.assertIn("House", plan["files"][0]["destinationFolder"])

    def test_existing_plan_scans_custom_destination_root(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Shanks" / "Musiques Rangees 2025"
            club = library / "Club"
            source.mkdir()
            club.mkdir(parents=True)
            (source / "Sound of Legend - San Francisco (Extended Mix).mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[],
            )

            self.assertEqual(Path(plan["files"][0]["destinationFolder"]).name, "Club")
            self.assertNotIn("A verifier", plan["files"][0]["destination"])

    def test_existing_plan_uses_artists_already_present_in_folder(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            house = library / "House"
            source.mkdir()
            house.mkdir(parents=True)
            (source / "Starsailor, Ofenbach - Four To The Floor (Extended Mix).mp3").write_bytes(b"audio")
            (house / "Ofenbach - Overdrive.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            self.assertEqual(Path(plan["files"][0]["destinationFolder"]).name, "House")
            self.assertEqual(plan["files"][0]["reasonCode"], "artist_existing")
            self.assertIn("artiste", plan["files"][0]["reason"])

    def test_file_plan_builds_review_groups_and_summary(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            afro = library / "Afro"
            source.mkdir()
            afro.mkdir(parents=True)
            (source / "Burna Boy - City Boys.mp3").write_bytes(b"audio")
            (source / "track-07-final.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            groups = {group["name"]: group for group in plan["groups"]}
            self.assertEqual(plan["summary"]["totalCount"], 2)
            self.assertEqual(plan["summary"]["reliableCount"], 1)
            self.assertEqual(plan["summary"]["reviewCount"], 1)
            self.assertEqual(groups["Afro"]["confidence"], "high")
            self.assertEqual(groups["Afro"]["confidenceLabel"], "Très probable")
            self.assertEqual(groups["À vérifier"]["confidence"], "low")
            self.assertEqual(groups["À vérifier"]["status"], "review")

    def test_existing_plan_flags_close_folder_scores_for_review(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            club = library / "Club"
            house = library / "House"
            source.mkdir()
            club.mkdir(parents=True)
            house.mkdir(parents=True)
            (source / "Club House Anthem.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            item = plan["files"][0]
            self.assertEqual(item["reasonCode"], "ambiguous_destination")
            self.assertEqual(item["confidence"], "review")
            self.assertEqual(Path(item["destinationFolder"]).name, "A verifier")
            self.assertEqual(plan["groups"][0]["name"], "À vérifier")

    def test_existing_plan_keeps_secondary_style_hints(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            gospel = library / "Gospel"
            source.mkdir()
            gospel.mkdir(parents=True)
            (source / "Mauvais Djo, Kano Choir - Pilé, Gospel Version (Extended Mix).mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )

            self.assertEqual(Path(plan["files"][0]["destinationFolder"]).name, "Gospel")
            self.assertIn("Gospel", plan["files"][0]["genreHints"])

    def test_existing_plan_without_library_roots_keeps_clean_destination_once(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            destination = root / "Music" / "LostTrackr Smart Import"
            source.mkdir()
            (source / "track-07-final.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=destination,
                library_roots=[],
            )

            destination_text = plan["files"][0]["destination"]
            self.assertEqual(destination_text.count("LostTrackr Smart Import"), 1)

    def test_apply_move_plan_moves_file_and_writes_manifest(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp) / "home"
            source = home / "Downloads"
            destination = home / "Music" / "LostTrackr Smart Import"
            source.mkdir(parents=True)
            track = source / "Dua Lipa - Houdini.mp3"
            track.write_bytes(b"audio")

            with patch.object(Path, "home", return_value=home):
                plan = smart_import.build_file_plan(
                    source_dir=source,
                    destination_mode="clean",
                    destination_root=destination,
                )
                result = smart_import.apply_move_plan(plan)

                self.assertEqual(result["moved"], 1)
                self.assertFalse(track.exists())
                self.assertTrue(Path(result["items"][0]["to"]).is_file())
                self.assertTrue(Path(result["manifestPath"]).is_file())

    def test_apply_move_plan_only_moves_selected_ids(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp) / "home"
            source = home / "Downloads"
            destination = home / "Music" / "LostTrackr Smart Import"
            source.mkdir(parents=True)
            first = source / "Burna Boy - City Boys.mp3"
            second = source / "Peggy Gou - Nanana.mp3"
            first.write_bytes(b"audio")
            second.write_bytes(b"audio")

            with patch.object(Path, "home", return_value=home):
                plan = smart_import.build_file_plan(
                    source_dir=source,
                    destination_mode="clean",
                    destination_root=destination,
                )
                selected_id = plan["files"][0]["id"]
                result = smart_import.apply_move_plan(plan, selected_ids=[selected_id])

                self.assertEqual(result["moved"], 1)
                self.assertEqual(result["skipped"], 1)
                self.assertFalse(first.exists())
                self.assertTrue(second.exists())
                self.assertEqual(result["items"][0]["id"], selected_id)

    def test_api_updates_destination_from_detected_folder_payload(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "Downloads"
            library = root / "DJ Library"
            house = library / "House"
            source.mkdir()
            house.mkdir(parents=True)
            (source / "track-07-final.mp3").write_bytes(b"audio")

            plan = smart_import.build_file_plan(
                source_dir=source,
                destination_mode="existing",
                destination_root=library,
                library_roots=[library],
            )
            api = LostTrackrApi()
            api.last_smart_import_plan = plan
            track_id = plan["files"][0]["id"]

            updated = api.smart_import_choose_destination(
                {"scope": "track", "id": track_id, "destinationFolder": str(house)}
            )

            item = next(row for row in updated["files"] if row["id"] == track_id)
            self.assertEqual(item["destinationFolder"], str(house))
            self.assertEqual(item["confidence"], "medium")
            self.assertEqual(item["reasonCode"], "manual_destination")


if __name__ == "__main__":
    unittest.main()
