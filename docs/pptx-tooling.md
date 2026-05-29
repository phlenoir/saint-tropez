# Tooling `pptx`

## Strategie recommandee

- Global Windows:
  - `LibreOffice` pour `soffice`
  - `Poppler` pour `pdftoppm`
- Local projet:
  - `pptxgenjs`
  - `markitdown[pptx]`
  - `Pillow`
  - `react`, `react-dom`, `react-icons`, `sharp` seulement si tu generes des icones

## Installation globale

Depuis PowerShell:

```powershell
.\scripts\install-pptx-tooling-global.ps1
```

Le script:

- installe `LibreOffice` et `Poppler` avec `winget`
- tente d'ajouter les repertoires utiles au `PATH` utilisateur
- affiche les commandes de verification a relancer dans un nouveau terminal

Options:

```powershell
.\scripts\install-pptx-tooling-global.ps1 -SkipPoppler
.\scripts\install-pptx-tooling-global.ps1 -SkipLibreOffice
```

## Bootstrap d'un projet

Dans le repo cible:

```powershell
.\scripts\bootstrap-pptx-project.ps1
```

Ce script:

- cree un `venv` Python dans `.venv`
- installe `markitdown[pptx]` et `Pillow` dans le `venv`
- initialise `package.json` si besoin
- installe `pptxgenjs` localement
- ne modifie pas `.gitignore`

Option pour le tooling icones:

```powershell
.\scripts\bootstrap-pptx-project.ps1 -InstallIconTooling
```

## Commandes utiles ensuite

```powershell
.\.venv\Scripts\Activate.ps1
python -m markitdown presentation.pptx
node -e "require('pptxgenjs'); console.log('pptxgenjs OK')"
node templates\diagnostic-core\build-template.js
```
