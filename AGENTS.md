# AGENTS

## Purpose

This repository contains tooling and reusable assets for PowerPoint generation, with a current focus on a structured template system built around `pptxgenjs`.

The main working template is:
- `templates/diagnostic-core/`

## Repository Layout

- `.codex/skills/`
  Codex-specific skills used to inspect `.pptx` files, design templates, and generate decks.
- `templates/`
  Source-of-truth template folders. Each template should contain its own data, layout spec, generator, and assets.
- `scripts/`
  Project-level setup scripts for local tooling.
- `docs/`
  Short operational documentation for the PPTX toolchain.

## Important Conventions

- Do not treat `.codex/skills/` as a universal agent standard.
  These files are useful reference material, but they are organized for Codex specifically.
- Keep template source files versioned, but do not commit generated deck outputs.
- Template folders should remain directly usable by `pptxgenjs`.
- Prefer changing template behavior through data files first:
  - `template-data.json`
  - `layout-spec.json`
  - `demo-content.json`
  Change generator code only when the data model is not sufficient.

## Current Template

`templates/diagnostic-core/` currently includes:
- `template-brief.md`: human-readable template brief
- `template-data.json`: metadata, palette, typography, layout inventory
- `layout-spec.json`: geometry and reusable tokens
- `demo-content.json`: demo text content
- `build-template.js`: `pptxgenjs` generator

## Common Commands

Install local project tooling:

```powershell
.\scripts\bootstrap-pptx-project.ps1
```

Generate the current demo deck:

```powershell
node templates\diagnostic-core\build-template.js
```

## Guidance For Other Agents

- If you are not Codex, do not assume `.codex/skills/` will auto-load in your runtime.
- You can still read those files as project documentation and workflow guidance.
- If you need a neutral entry point, start with:
  - `AGENTS.md`
  - `docs/pptx-tooling.md`
  - `templates/diagnostic-core/template-brief.md`
  - `templates/diagnostic-core/manifest.json`

## Git Hygiene

- Ignore local environments and generated artifacts.
- Do not reintroduce generated `.pptx` files into version control unless explicitly requested.
- Keep the repository clean and reproducible from source files.
