# LostTrackr v1.0.1 Windows

Release corrective for the V2 interface, Windows presentation, and source detection.

## Changes

- Adds a specific notification when no Serato source folder (`_Serato_`) is found.
- Keeps the existing Serato-open warning separate from the missing-source warning.
- Hides macOS-style visual window controls on Windows.
- Makes the V2 interface fill fullscreen windows while adapting to reduced window sizes.
- Keeps the Windows installer flow with Start Menu and Desktop shortcuts.

## Notes

- This Windows beta is unsigned, so Windows SmartScreen warnings are expected.
- Microsoft Edge WebView2 Runtime is required for the app UI.
- LostTrackr expects `_Serato_` in the user Music folder or at the root of a connected drive.
