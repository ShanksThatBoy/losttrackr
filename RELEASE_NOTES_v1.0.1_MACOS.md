# LostTrackr v1.0.1 macOS

Release corrective for the V2 interface and source detection.

## Changes

- Adds a specific notification when no Serato source folder (`_Serato_`) is found.
- Keeps the existing Serato-open warning separate from the missing-source warning.
- Makes the V2 interface fill fullscreen windows while adapting to reduced window sizes.
- Keeps the scan flow safe: home screen, scan-prep screen, then real scan only after confirmation.

## Notes

- macOS build is ad-hoc signed locally and not notarized.
- LostTrackr still requires Serato to have created a `_Serato_` folder, or an external drive containing `_Serato_` to be connected.
