on run argv
  set mountPath to item 1 of argv
  set bgPath to item 2 of argv
  set targetFolder to POSIX file mountPath as alias

  tell application "Finder"
    open targetFolder
    delay 1

    set targetWindow to container window of targetFolder
    set current view of targetWindow to icon view
    set toolbar visible of targetWindow to false
    set statusbar visible of targetWindow to false
    set bounds of targetWindow to {120, 120, 760, 560}

    set viewOptions to icon view options of targetWindow
    set arrangement of viewOptions to not arranged
    set icon size of viewOptions to 92
    set text size of viewOptions to 12
    set background picture of viewOptions to POSIX file bgPath

    set position of item "LostTrackr.app" of targetFolder to {170, 245}
    set position of item "Applications" of targetFolder to {470, 245}
    set position of item "README_BETA_LOSTTRACKR_MACOS.md" of targetFolder to {320, 350}

    close targetWindow
    open targetFolder
    update targetFolder without registering applications
    delay 1
  end tell
end run
