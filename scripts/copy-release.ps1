$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$versionPath = Join-Path $root 'VERSION'
$packageJsonPath = Join-Path $root 'package.json'
$tauriConfigPath = Join-Path $root 'src-tauri\tauri.conf.json'
$cargoTomlPath = Join-Path $root 'src-tauri\Cargo.toml'
$releaseDir = Join-Path $root 'release'

Push-Location -LiteralPath $root
try {
  & npm run tauri:compile
  if ($LASTEXITCODE -ne 0) {
    throw "npm run tauri:compile failed with exit code $LASTEXITCODE"
  }
} finally {
  Pop-Location
}

$version = (Get-Content -LiteralPath $versionPath -Raw).Trim()
if ($version -notmatch '^\d+\.\d+\.\d+$') {
  throw "VERSION must use Major.Minor.Change format, received: $version"
}

$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
$tauriConfig = Get-Content -LiteralPath $tauriConfigPath -Raw | ConvertFrom-Json
$cargoToml = Get-Content -LiteralPath $cargoTomlPath -Raw

$cargoNameMatch = [regex]::Match($cargoToml, '(?m)^\s*name\s*=\s*"([^"]+)"')
if (-not $cargoNameMatch.Success) {
  throw "Could not find package name in $cargoTomlPath"
}

$cargoVersionMatch = [regex]::Match($cargoToml, '(?m)^\s*version\s*=\s*"([^"]+)"')
if (-not $cargoVersionMatch.Success) {
  throw "Could not find package version in $cargoTomlPath"
}

if ($packageJson.version -ne $version) {
  throw "package.json version $($packageJson.version) does not match VERSION $version. Run npm run version:sync."
}

if ($tauriConfig.version -ne $version) {
  throw "src-tauri\tauri.conf.json version $($tauriConfig.version) does not match VERSION $version. Run npm run version:sync."
}

if ($cargoVersionMatch.Groups[1].Value -ne $version) {
  throw "src-tauri\Cargo.toml version $($cargoVersionMatch.Groups[1].Value) does not match VERSION $version. Run npm run version:sync."
}

if (
  $tauriConfig.PSObject.Properties.Name -contains 'bundle' -and
  $tauriConfig.bundle.PSObject.Properties.Name -contains 'active' -and
  $tauriConfig.bundle.active -ne $false
) {
  throw "src-tauri\tauri.conf.json bundle.active must be false for the default no-installer release flow."
}

$productName = $tauriConfig.productName
$cargoName = $cargoNameMatch.Groups[1].Value
$sourceExe = Join-Path $root "src-tauri\target\release\$cargoName.exe"

if (-not (Test-Path -LiteralPath $sourceExe)) {
  throw "Compiled Tauri EXE not found after npm run tauri:compile: $sourceExe"
}

New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null

$destinationExe = Join-Path $releaseDir "$productName $version.exe"
Copy-Item -LiteralPath $sourceExe -Destination $destinationExe -Force

Write-Host "Copied $sourceExe to $destinationExe"
