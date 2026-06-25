#define AppName "LostTrackr"
#define AppPublisher "DJ Shanks"
#define AppExeName "LostTrackr.exe"
#define AppVersion GetEnv("LOSTTRACKR_VERSION")
#if AppVersion == ""
#define AppVersion "1.0.1"
#endif
#define InstallerName "LostTrackrSetup-v" + AppVersion + "-x64"

[Setup]
AppId={{D5B69F7A-DB8B-4B18-A881-8BC4B9B780D5}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL=https://github.com/ShanksThatBoy/losttrackr
AppSupportURL=https://github.com/ShanksThatBoy/losttrackr/issues
AppUpdatesURL=https://github.com/ShanksThatBoy/losttrackr/releases
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputDir=..\dist\installer
OutputBaseFilename={#InstallerName}
SetupIconFile=..\generated\LostTrackr.ico
UninstallDisplayIcon={app}\{#AppExeName}
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce

[Files]
Source: "..\dist\LostTrackr\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\README_BETA_LOSTTRACKR_WINDOWS.md"; DestDir: "{app}"; DestName: "README_BETA_WINDOWS.md"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#AppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(AppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
const
  WebView2ClientGuid = '{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}';

function WebView2RuntimeInstalled(): Boolean;
var
  Version: String;
begin
  Result :=
    RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\EdgeUpdate\Clients\' + WebView2ClientGuid, 'pv', Version) or
    RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\' + WebView2ClientGuid, 'pv', Version) or
    RegQueryStringValue(HKCU, 'SOFTWARE\Microsoft\EdgeUpdate\Clients\' + WebView2ClientGuid, 'pv', Version) or
    RegQueryStringValue(HKCU, 'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\' + WebView2ClientGuid, 'pv', Version);
end;

procedure InitializeWizard();
begin
  if not WebView2RuntimeInstalled() then
  begin
    MsgBox(
      'LostTrackr uses Microsoft Edge WebView2 Runtime to display its interface.' + #13#10 + #13#10 +
      'If the app window does not open after installation, install WebView2 Runtime from Microsoft, then launch LostTrackr again.' + #13#10 + #13#10 +
      'LostTrackr utilise Microsoft Edge WebView2 Runtime pour afficher son interface.' + #13#10 +
      'Si la fenetre ne s''ouvre pas apres installation, installe WebView2 Runtime depuis Microsoft, puis relance LostTrackr.',
      mbInformation,
      MB_OK
    );
  end;
end;
