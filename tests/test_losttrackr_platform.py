import os
import sys
import unittest
from unittest.mock import patch

import losttrackr_platform as platform


class LostTrackrPlatformTests(unittest.TestCase):
    def test_windows_absolute_paths(self):
        self.assertTrue(platform.is_windows_absolute(r"C:\Users\Remy\track.mp3"))
        self.assertTrue(platform.is_windows_absolute(r"\\NAS\Music\track.mp3"))
        self.assertFalse(platform.is_windows_absolute(r"Music\track.mp3"))

    def test_windows_relative_stored_candidates_prefer_serato_drive(self):
        with patch.object(sys, "platform", "win32"), patch.dict(os.environ, {"SystemDrive": "C:"}, clear=False):
            candidates = platform.stored_candidates(r"Music\Track.mp3", r"D:\_Serato_")

        self.assertEqual(candidates[0], r"D:\Music\Track.mp3")
        self.assertIn(r"C:\Music\Track.mp3", candidates)

    def test_windows_new_stored_path_keeps_relative_external_path(self):
        with patch.object(sys, "platform", "win32"), patch.dict(os.environ, {"SystemDrive": "C:"}, clear=False):
            stored = platform.new_stored_path(r"Music\Track.mp3", r"D:\Music\Track.mp3", r"D:\_Serato_")
            absolute = platform.new_stored_path(r"C:\Old\Track.mp3", r"D:\Music\Track.mp3", r"D:\_Serato_")

        self.assertEqual(stored, r"Music\Track.mp3")
        self.assertEqual(absolute, r"D:\Music\Track.mp3")


if __name__ == "__main__":
    unittest.main()
