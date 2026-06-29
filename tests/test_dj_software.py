import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import dj_software


class DjSoftwareDetectionTests(unittest.TestCase):
    def test_detects_serato_library(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            serato_dir = home / "Music" / "_Serato_"
            (serato_dir / "Subcrates").mkdir(parents=True)
            (serato_dir / "database V2").write_bytes(b"")

            with patch.object(Path, "home", return_value=home), patch.object(dj_software.platform, "library_roots", return_value=[]):
                sources = dj_software.detect_serato()

        self.assertEqual(len(sources), 1)
        self.assertEqual(sources[0]["id"], "serato")
        self.assertTrue(sources[0]["repairSupported"])

    def test_prefers_serato_when_multiple_sources_are_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            serato_dir = home / "Music" / "_Serato_"
            (serato_dir / "Subcrates").mkdir(parents=True)
            (serato_dir / "database V2").write_bytes(b"")
            virtualdj_dir = home / "Documents" / "VirtualDJ"
            virtualdj_dir.mkdir(parents=True)
            (virtualdj_dir / "database.xml").write_text("<VirtualDJ_Database />")

            with patch.object(Path, "home", return_value=home), patch.object(dj_software.platform, "library_roots", return_value=[]):
                detected = dj_software.detect_all()

        ids = {item["id"] for item in detected["softwares"]}
        self.assertEqual(detected["preferredSoftwareId"], "serato")
        self.assertIn("serato", ids)
        self.assertIn("virtualdj", ids)
        self.assertTrue(detected["multipleDetected"])

    def test_detects_rekordbox_master_db_from_options_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            home = Path(tmp)
            db_dir = home / "rekordbox-library"
            db_dir.mkdir()
            (db_dir / "master.db").write_bytes(b"db")
            options_dir = home / "Library" / "Application Support" / "Pioneer" / "rekordboxAgent" / "storage"
            options_dir.mkdir(parents=True)
            (options_dir / "options.json").write_text(json.dumps({"options": [["masterDbDirectory", db_dir.as_posix()]]}))

            with patch.object(Path, "home", return_value=home), patch.object(dj_software.platform, "is_macos", return_value=True), patch.object(dj_software.platform, "library_roots", return_value=[]):
                sources = dj_software.detect_rekordbox()

        kinds = {source["kind"] for source in sources}
        self.assertIn("master.db", kinds)
        self.assertIn("options.json", kinds)


if __name__ == "__main__":
    unittest.main()
