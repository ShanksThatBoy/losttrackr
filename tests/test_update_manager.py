import hashlib
import json
import unittest
from pathlib import Path

import update_manager


class UpdateManagerTests(unittest.TestCase):
    def test_compare_versions(self):
        self.assertGreater(update_manager.compare_versions("1.2.1", "1.2.0"), 0)
        self.assertEqual(update_manager.compare_versions("v1.2.1", "1.2.1"), 0)
        self.assertLess(update_manager.compare_versions("1.2.1-beta", "1.2.1"), 0)
        self.assertGreater(update_manager.compare_versions("1.10.0", "1.2.9"), 0)

    def test_rollout_is_stable_for_install_id(self):
        manifest = {"rollout": 20}
        install_id = "stable-install-id"
        self.assertEqual(
            update_manager.rollout_allows(manifest, install_id),
            update_manager.rollout_allows(manifest, install_id),
        )

    def test_canonical_manifest_bytes_is_stable(self):
        left = {"b": 2, "a": {"z": 1}}
        right = json.loads('{"a":{"z":1},"b":2}')
        self.assertEqual(update_manager.canonical_manifest_bytes(left), update_manager.canonical_manifest_bytes(right))

    def test_file_sha256(self):
        path = Path(self._testMethodName + ".bin")
        try:
            path.write_bytes(b"losttrackr")
            self.assertEqual(update_manager.file_sha256(path), hashlib.sha256(b"losttrackr").hexdigest())
        finally:
            path.unlink(missing_ok=True)

    def test_signed_beta_manifest_verifies(self):
        manifest = json.loads(Path("updates/beta/latest.json").read_text(encoding="utf-8"))
        signature = Path("updates/beta/latest.json.sig").read_bytes()
        update_manager.verify_manifest_signature(manifest, signature)


if __name__ == "__main__":
    unittest.main()
