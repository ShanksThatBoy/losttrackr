[CmdletBinding()]
param(
    [string]$Version = "1.2.4",
    [switch]$SkipInstaller
)

$ErrorActionPreference = "Stop"

if (-not $IsWindows) {
    throw "This build script must run on Windows x64. Use GitHub Actions or a Windows 11 machine."
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Resolve-Path (Join-Path $ScriptDir "..")
$VenvDir = Join-Path $ScriptDir ".venv-windows"
$BuildDir = Join-Path $ScriptDir "build"
$DistDir = Join-Path $ScriptDir "dist"
$InstallerDir = Join-Path $DistDir "installer"

Write-Host "LostTrackr Windows build $Version"
Write-Host "Root: $RootDir"

if (-not (Get-Command py -ErrorAction SilentlyContinue)) {
    throw "Python Launcher 'py' was not found. Install Python 3.12 x64 from python.org."
}

if (-not (Test-Path $VenvDir)) {
    & py -3.12 -m venv $VenvDir
}

$Python = Join-Path $VenvDir "Scripts\python.exe"
& $Python -m pip install --upgrade pip
& $Python -m pip install -r (Join-Path $ScriptDir "requirements_windows.txt")

& $Python (Join-Path $ScriptDir "make_windows_icon.py")

Remove-Item -Recurse -Force $BuildDir, $DistDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $InstallerDir | Out-Null

& $Python -m PyInstaller --noconfirm --clean `
    --workpath $BuildDir `
    --distpath $DistDir `
    (Join-Path $ScriptDir "LostTrackr-Windows.spec")

$AppExe = Join-Path $DistDir "LostTrackr\LostTrackr.exe"
if (-not (Test-Path $AppExe)) {
    throw "PyInstaller did not create $AppExe"
}

if ($SkipInstaller) {
    Write-Host "Built app bundle: $AppExe"
    return
}

$InnoCandidates = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe"
) | Where-Object { $_ -and (Test-Path $_) }

$Iscc = $InnoCandidates | Select-Object -First 1
if (-not $Iscc) {
    $IsccCommand = Get-Command ISCC.exe -ErrorAction SilentlyContinue
    if ($IsccCommand) {
        $Iscc = $IsccCommand.Source
    }
}
if (-not $Iscc) {
    throw "Inno Setup 6 was not found. Install it, then rerun this script."
}

$env:LOSTTRACKR_VERSION = $Version
& $Iscc (Join-Path $ScriptDir "installer\LostTrackr.iss")

$SetupExe = Join-Path $InstallerDir "LostTrackrSetup-v$Version-x64.exe"
if (-not (Test-Path $SetupExe)) {
    throw "Inno Setup did not create $SetupExe"
}

Write-Host "Built installer: $SetupExe"
