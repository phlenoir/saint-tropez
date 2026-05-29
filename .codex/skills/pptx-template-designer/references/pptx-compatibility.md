# PPTX Compatibility Checklist

Use this checklist before handing the template brief to the `pptx` skill.

## Structural Minimum

- Confirm the target slide ratio.
- Confirm 3-6 base colors with raw hex values and no `#`.
- Confirm title and body fonts.
- Confirm the full ordered list of layouts.
- Confirm all mandatory layouts are present:
  - title
  - agenda / sommaire
  - divider / chapter title / intercalaire
  - conclusion / key takeaways / a retenir

## Layout Definition Minimum

For every layout, specify:
- name
- purpose
- approximate geometry
- placeholder types
- expected visual element
- notes for overflow risk if the layout is text-heavy

## `pptx` Design Constraints To Preserve

- Prefer varied layouts across a deck.
- Avoid text-only slides.
- Keep body text left-aligned by default.
- Plan for bold titles and section headers.
- Do not use decorative accent lines under titles.
- Maintain at least 0.5" margins.
- Maintain roughly 0.3-0.5" between major blocks.
- Keep one dominant color and one accent; do not weight all colors equally.

## Build Handoff Minimum

When the user wants an actual template file, the brief must also say:
- which layouts become masters
- whether demo content slides should be included
- whether the template needs logo placeholders
- how page numbering and footer metadata should appear
- whether charts, tables, and icon treatments need preset styling

## Reference Deck Handling

If a reference `.pptx` exists:
- distinguish direct observations from inferred recommendations
- preserve the spirit, not the exact clone
- present at least one close variant and one evolution variant
