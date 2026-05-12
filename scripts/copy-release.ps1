$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$packageJsonPath = Join-Path $root 'package.json'
$tauriConfigPath = Join-Path $root 'src-tauri\tauri.conf.json'
$cargoTomlPath = Join-Path $root 'src-tauri\Cargo.toml'
$releaseDir = Join-Path $root 'release'

$packageJson = Get-Content -LiteralPath $packageJsonPath -Raw | ConvertFrom-Json
$tauriConfig = Get-Content -LiteralPath $tauriConfigPath -Raw | ConvertFrom-Json
$cargoToml = Get-Content -LiteralPath $cargoTomlPath -Raw

$cargoNameMatch = [regex]::Match($cargoToml, '(?m)^\s*name\s*=\s*"([^"]+)"')
if (-not $cargoNameMatch.Success) {
  throw "Could not find package name in $cargoTomlPath"
}

$productName = $tauriConfig.productName
$version = $packageJson.version
$cargoName = $cargoNameMatch.Groups[1].Value
$sourceExe = Join-Path $root "src-tauri\target\release\$cargoName.exe"

if (-not (Test-Path -LiteralPath $sourceExe)) {
  throw "Compiled Tauri EXE not found: $sourceExe. Run npm run tauri:compile first."
}

New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null

$destinationExe = Join-Path $releaseDir "$productName $version.exe"
Copy-Item -LiteralPath $sourceExe -Destination $destinationExe -Force

Write-Host "Copied $sourceExe to $destinationExe"
