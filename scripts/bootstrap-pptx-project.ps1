[CmdletBinding()]
param(
    [string]$ProjectRoot = (Get-Location).Path,
    [string]$VenvName = ".venv",
    [switch]$InstallIconTooling
)

$ErrorActionPreference = "Stop"

Push-Location $ProjectRoot
try {
    $venvPath = Join-Path $ProjectRoot $VenvName
    if (-not (Test-Path $venvPath)) {
        Write-Host "Creation du venv Python dans $venvPath" -ForegroundColor Cyan
        python -m venv $venvPath
    } else {
        Write-Host "Venv deja present: $venvPath" -ForegroundColor DarkGray
    }

    $pythonExe = Join-Path $venvPath "Scripts\python.exe"
    if (-not (Test-Path $pythonExe)) {
        throw "Python du venv introuvable: $pythonExe"
    }

    & $pythonExe -m pip install --upgrade pip
    & $pythonExe -m pip install "markitdown[pptx]" Pillow

    if (-not (Test-Path "package.json")) {
        Write-Host "Initialisation du projet Node..." -ForegroundColor Cyan
        npm init -y | Out-Null
    }

    npm install pptxgenjs

    if ($InstallIconTooling) {
        npm install react react-dom react-icons sharp
    }

    Write-Host ""
    Write-Host "Projet PPTX initialise." -ForegroundColor Green
    Write-Host "Activation Python:"
    Write-Host "  .\$VenvName\Scripts\Activate.ps1"
    Write-Host "Verification rapide:"
    Write-Host "  .\$VenvName\Scripts\python.exe -m markitdown --help"
    Write-Host "  node -e `"require('pptxgenjs'); console.log('pptxgenjs OK')`""
}
finally {
    Pop-Location
}
