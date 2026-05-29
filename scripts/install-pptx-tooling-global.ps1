[CmdletBinding()]
param(
    [switch]$SkipLibreOffice,
    [switch]$SkipPoppler
)

$ErrorActionPreference = "Stop"

function Assert-Command {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Commande requise introuvable: $Name"
    }
}

function Install-WingetPackage {
    param(
        [string]$Id,
        [string]$Label
    )

    Write-Host "Installation de $Label..." -ForegroundColor Cyan
    winget install --id $Id --exact --accept-package-agreements --accept-source-agreements
}

function Find-Executable {
    param(
        [string[]]$Candidates,
        [string]$LeafName
    )

    foreach ($candidate in $Candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    $roots = @(
        ${env:ProgramFiles},
        ${env:ProgramFiles(x86)},
        $env:LOCALAPPDATA
    ) | Where-Object { $_ -and (Test-Path $_) }

    foreach ($root in $roots) {
        $match = Get-ChildItem -Path $root -Recurse -Filter $LeafName -ErrorAction SilentlyContinue |
            Select-Object -First 1 -ExpandProperty FullName
        if ($match) {
            return $match
        }
    }

    return $null
}

function Add-UserPathEntry {
    param([string]$PathEntry)

    $current = [Environment]::GetEnvironmentVariable("Path", "User")
    $parts = @()
    if ($current) {
        $parts = $current.Split(";") | Where-Object { $_ }
    }

    if ($parts -contains $PathEntry) {
        Write-Host "PATH utilisateur deja configure pour $PathEntry" -ForegroundColor DarkGray
        return
    }

    $newPath = if ($current) { "$current;$PathEntry" } else { $PathEntry }
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    $env:Path = "$env:Path;$PathEntry"
    Write-Host "Ajout au PATH utilisateur: $PathEntry" -ForegroundColor Green
}

Assert-Command -Name "winget"

if (-not $SkipLibreOffice) {
    Install-WingetPackage -Id "TheDocumentFoundation.LibreOffice" -Label "LibreOffice"
}

if (-not $SkipPoppler) {
    Install-WingetPackage -Id "oschwartz10612.Poppler" -Label "Poppler"
}

$soffice = Find-Executable -Candidates @(
    "C:\Program Files\LibreOffice\program\soffice.exe",
    "C:\Program Files (x86)\LibreOffice\program\soffice.exe"
) -LeafName "soffice.exe"

$pdftoppm = Find-Executable -Candidates @(
    "C:\Program Files\poppler\Library\bin\pdftoppm.exe",
    "C:\Program Files\Poppler\Library\bin\pdftoppm.exe",
    "C:\Users\$env:USERNAME\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_*"
) -LeafName "pdftoppm.exe"

if ($soffice) {
    Add-UserPathEntry -PathEntry (Split-Path $soffice -Parent)
} else {
    Write-Warning "Impossible de localiser soffice.exe automatiquement."
}

if ($pdftoppm) {
    Add-UserPathEntry -PathEntry (Split-Path $pdftoppm -Parent)
} else {
    Write-Warning "Impossible de localiser pdftoppm.exe automatiquement."
}

Write-Host ""
Write-Host "Verification conseillee dans un nouveau terminal:" -ForegroundColor Cyan
Write-Host "  soffice --version"
Write-Host "  pdftoppm -h"
