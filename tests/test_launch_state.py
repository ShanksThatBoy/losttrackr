import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import losttrackr_app


class LaunchStateTests(unittest.TestCase):
    def test_first_launch_requests_onboarding(self):
        with tempfile.TemporaryDirectory() as tmp:
            support = Path(tmp)
            with patch.object(losttrackr_app, "app_support_dir", return_value=support):
                api = losttrackr_app.LostTrackrApi()
                state = api.launch_state()

        self.assertTrue(state["showOnboarding"])
        self.assertFalse(state["showWhatsNew"])

    def test_completed_onboarding_is_persisted(self):
        with tempfile.TemporaryDirectory() as tmp:
            support = Path(tmp)
            with patch.object(losttrackr_app, "app_support_dir", return_value=support):
                api = losttrackr_app.LostTrackrApi()
                api.complete_onboarding()
                state = api.launch_state()

        self.assertFalse(state["showOnboarding"])
        self.assertFalse(state["showWhatsNew"])

    def test_update_launch_shows_whats_new_without_onboarding(self):
        with tempfile.TemporaryDirectory() as tmp:
            support = Path(tmp)
            with patch.object(losttrackr_app, "app_support_dir", return_value=support), \
                 patch("losttrackr_app.app_release_notes", return_value=["Inspiration test notes"]):
                losttrackr_app.save_app_state(
                    {
                        "onboardingCompleted": True,
                        "lastSeenVersion": "1.2.5",
                    }
                )
                api = losttrackr_app.LostTrackrApi()
                state = api.launch_state()
    
        self.assertFalse(state["showOnboarding"])
        self.assertTrue(state["showWhatsNew"])
        self.assertIn("Inspiration", " ".join(state["releaseNotes"]))

    def test_acknowledge_launch_state_hides_whats_new(self):
        with tempfile.TemporaryDirectory() as tmp:
            support = Path(tmp)
            with patch.object(losttrackr_app, "app_support_dir", return_value=support):
                losttrackr_app.save_app_state(
                    {
                        "onboardingCompleted": True,
                        "lastSeenVersion": "1.2.5",
                    }
                )
                api = losttrackr_app.LostTrackrApi()
                api.acknowledge_launch_state()
                state = api.launch_state()

        self.assertFalse(state["showOnboarding"])
        self.assertFalse(state["showWhatsNew"])


if __name__ == "__main__":
    unittest.main()
