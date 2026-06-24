# LostTrackr v1.4.0-beta-win

Windows beta focused on Windows 11 x64 packaging and Serato path handling.

## Highlights

- Adds a Windows platform layer for Serato detection, drive discovery, stored path conversion, scan roots, and WebView2 checks.
- Detects the default internal Serato library at `C:\Users\<user>\Music\_Serato_`.
- Detects external Serato libraries at drive roots such as `D:\_Serato_` and `E:\_Serato_`.
- Builds `LostTrackr.exe` with PyInstaller in windowed mode.
- Builds `LostTrackrSetup-v1.4.0-beta-win-x64.exe` with Inno Setup.
- Adds Start Menu and optional Desktop shortcuts.
- Adds a GitHub Actions workflow to build and attach the installer to a GitHub Release.

## Beta notes

- This beta is unsigned. Windows SmartScreen warnings are expected.
- Microsoft Edge WebView2 Runtime is required for the app UI.
- Serato Windows library locations still need validation on a real Windows Serato installation before broad distribution.
