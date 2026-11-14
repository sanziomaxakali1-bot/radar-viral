param([switch]$InstallOptional, [switch]$SemMotor)
$ErrorActionPreference = 'Continue'
$checks = @(
  @{ Name = 'Node.js'; Command = 'node'; Args = @('--version') },
  @{ Name = 'npm/npx'; Command = 'npx'; Args = @('--version') },
  @{ Name = 'FFmpeg'; Command = 'ffmpeg'; Args = @('-version') },
  @{ Name = 'FFprobe'; Command = 'ffprobe'; Args = @('-version') },
  @{ Name = 'Python'; Command = 'py'; Args = @('-3','--version') }
)
Write-Host 'RADAR VIRAL - verificacao de instalacao' -ForegroundColor Cyan
$missing = @()
foreach ($item in $checks) {
  if (Get-Command $item.Command -ErrorAction SilentlyContinue) {
    $v = & $item.Command @($item.Args) 2>$null | Select-Object -First 1
    Write-Host "OK   $($item.Name): $v" -ForegroundColor Green
  } else { Write-Host "FALTA $($item.Name)" -ForegroundColor Yellow; $missing += $item.Name }
}
Write-Host 'Credenciais nao sao instaladas automaticamente.' -ForegroundColor Gray
Write-Host 'Para conectar ElevenLabs: npx -y @elevenlabs/cli@latest onboard init' -ForegroundColor Gray
if ($missing.Count -gt 0) { Write-Host "Pendencias: $($missing -join ', ')" -ForegroundColor Yellow; exit 1 }
Write-Host 'Ambiente basico pronto.' -ForegroundColor Green
# Motor de video (Remotion + three.js): instala as dependencias de motor-video na primeira vez
$motor = Join-Path (Split-Path $PSScriptRoot -Parent) 'motor-video'
if (-not $SemMotor -and (Test-Path (Join-Path $motor 'package.json'))) {
  if (Test-Path (Join-Path $motor 'node_modules')) { Write-Host 'OK   Motor de video (Remotion) ja instalado' -ForegroundColor Green }
  else {
    Write-Host 'Instalando o motor de video (Remotion). Na primeira renderizacao o Remotion tambem baixa o navegador dele (cerca de 200-300 MB).' -ForegroundColor Cyan
    Push-Location $motor; npm install; Pop-Location
  }
}
