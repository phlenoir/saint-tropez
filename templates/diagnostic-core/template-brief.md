# Template Brief

## Identite

- Nom: `diagnostic-core`
- Usage: diagnostic, audit, restitution analytique
- Audience: comite, equipes metier, directions
- Contexte: projection et lecture ecran
- Intention: template generique, sobre, structure, sans marque

## Direction Generale

- Ratio: `LAYOUT_16x9`
- Fond: blanc
- Encre principale: `26235C`
- Structure recurrente: colonne laterale gauche avec coin coupe
- Accent: une couleur par section
- Langage visuel: `100% texte structure`
- Footer: numero de slide uniquement
- Logos: aucun

## Palette

| Role | Hex |
|---|---|
| encre principale | `26235C` |
| colonne neutre | `D9DEE8` |
| accent rose | `F3DADA` |
| accent vert | `CFF5D2` |
| accent jaune | `FFE15A` |
| fond | `FFFFFF` |
| texte secondaire | `7A7A86` |

## Typographie

| Usage | Police | Taille conseillee |
|---|---|---|
| titre cover | `Segoe UI Black` | `28-34 pt` |
| titre de slide | `Segoe UI Black` | `20-24 pt` |
| titre colonne laterale | `Segoe UI Black` | `20-24 pt` |
| corps | `Aptos` | `11-16 pt` |
| footer | `Aptos` | `9-10 pt` |

## Motifs Reutilisables

- colonne laterale gauche pleine avec coin coupe
- filet fin sous certains titres de colonnes
- gros titres bleu nuit
- encarts ou zones teintees selon la section

## Layouts

1. `Title Cover`
2. `Agenda Vertical`
3. `Divider Sidebar`
4. `Conclusion Key Messages`
5. `Three-Column Synthesis`
6. `Findings And Impacts`
7. `Scope Approach Stakeholders`
8. `Improvement Horizons`

## Compatibilite Title / Divider

- meme famille claire
- meme encre `26235C`
- meme paire de polices
- meme logique de colonne laterale
- hierarchie simplement renforcee sur l'intercalaire

## Fichiers Techniques

- `template-data.json`: metadonnees, palette, typo, layouts, politique de variante
- `layout-spec.json`: geometrie precise des layouts en pouces
- `demo-content.json`: contenu de demonstration
- `build-template.js`: generateur `pptxgenjs`
