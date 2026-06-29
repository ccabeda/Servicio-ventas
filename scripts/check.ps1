$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$solutionPath = Join-Path $repoRoot "SERVICIO VENTAS/SERVICIO VENTAS.sln"
$frontendPath = Join-Path $repoRoot "SERVICIO VENTAS/frontend"

Write-Host "==> Verificando formato .NET"
dotnet format $solutionPath --verify-no-changes

Write-Host "==> Compilando solución .NET"
dotnet build $solutionPath --no-restore

Write-Host "==> Ejecutando tests .NET"
dotnet test $solutionPath --no-build

Write-Host "==> Compilando frontend"
npm --prefix $frontendPath run build

Write-Host "==> Check completo"
