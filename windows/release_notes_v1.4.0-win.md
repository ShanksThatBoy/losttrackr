# LostTrackr v1.4.0 - Windows

- Adds a Windows platform layer for Serato detection, drive discovery, stored path conversion, scan roots, and WebView2 checks.
- Detects the default internal Serato library at `C:\Users\<user>\Music\_Serato_`.
- Detects external Serato libraries at drive roots such as `D:\_Serato_` and `E:\_Serato_`.
- Builds `LostTrackr.exe` with PyInstaller in windowed mode.
- Builds `LostTrackrSetup-v1.4.0-x64.exe` with Inno Setup.
- Adds Start Menu and optional Desktop shortcuts.
- Integrates Style Inspiration and local track matching.
- This release is unsigned. Windows SmartScreen warnings are expected.
- Microsoft Edge WebView2 Runtime is required for the app UI.
