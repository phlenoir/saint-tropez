---
name: pptx-template-designer
description: Design a new PowerPoint template system and produce a template brief or starter template that is compatible with the `pptx` skill. Use when the user asks to create a new template, theme, slide master, layout system, masque PowerPoint, or reusable presentation style from scratch; when a reference `.pptx` should be analyzed to derive palette, fonts, and layouts; or when Codex must interview the user step by step to define a reusable presentation template before building slides.
---

# PPTX Template Designer

Design the template before building slides. Drive the work as a guided interview, not a blank-page brainstorming session.

## Workflow

1. Confirm whether the user wants:
   - a template brief only,
   - a starter `.pptx` template,
   - or both.
2. If the user supplied a `.pptx` example, also use the `pptx` skill in the same turn to inspect it.
3. Ask one short question at a time. Always present a compact list of compatible options first.
4. Refine the template progressively until all required decisions are locked.
5. Produce a final template spec that the `pptx` skill can execute directly.
6. If the user wants an actual `.pptx`, hand off immediately to the `pptx` workflow and build from the approved spec.
7. Materialize the approved template under `templates/<template-name>/` with the brief, structured data, and any collected assets.
8. Always include a precise geometric layout spec so the `pptx` skill can modify the template without editing the generator code.

## Interview Rules

- Ask questions sequentially. Do not dump the whole questionnaire at once.
- Prefer 2-4 concrete options per question. Keep a freeform fallback only if the user rejects the offered options.
- Reuse the user's previous choices to narrow later options.
- When the user is undecided, recommend one option and explain it in one sentence.
- Keep every proposed option compatible with the `pptx` skill's working style and constraints.
- If the user asks for a new template in French, keep the interview in French.
- Give each template a distinctive hyphen-case name early in the process. Avoid generic names like `template-1` or `deck-standard`.
- When presenting color options, show a real color swatch plus the color names and hex values side by side. Prefer visible swatches in markdown or inline HTML, not hex codes alone.
- Ask explicitly whether one or several logos must be integrated, on which layouts, and where the source files are located.
- Treat templates as versionable design systems: they may be edited in place for small changes or duplicated for heavier experiments before validation.
- When palette selection would benefit from a visual aid, generate a temporary palette preview image outside the template folder so the template assets stay clean.

## If A Reference `.pptx` Is Provided

Inspect the example before asking design questions.

1. Extract text with `python -m markitdown reference.pptx`.
2. Generate slide thumbnails with `python scripts/thumbnail.py reference.pptx`.
3. Identify:
   - dominant and accent colors,
   - apparent title and body fonts,
   - recurring layout families,
   - slide ratio and overall density,
   - visual motifs such as cards, image crops, sidebars, or stat blocks.
4. Present derived options as variants, not copies:
   - "stay close to the reference",
   - "same structure with fresher colors",
   - "same tone with lighter typography",
   - "same palette with bolder layouts".
5. Call out what is inferred versus what is directly observed.
6. If the reference contains logos, note their likely placements and ask whether to preserve, replace, or remove them.

## Required Decisions

Do not finalize the template until every item below is explicit.

### 1. Format

Lock:
- slide ratio: `LAYOUT_16x9`, `LAYOUT_16x10`, `LAYOUT_4x3`, or `LAYOUT_WIDE`
- visual density: airy, balanced, or dense
- tone: corporate, editorial, premium, bold, minimal, or playful
- distinctive template name in hyphen-case

### 2. Color System

Define a base palette with:
- minimum 3 colors
- maximum 6 colors
- hex values without `#`
- one dominant color
- one or two support colors
- one accent color

When asking the question, format options like:
- `Bleu nuit <span style="display:inline-block;width:12px;height:12px;background:#1E2761;border:1px solid #999;"></span> (1E2761) / sable <span style="display:inline-block;width:12px;height:12px;background:#E7E8D1;border:1px solid #999;"></span> (E7E8D1) / cuivre <span style="display:inline-block;width:12px;height:12px;background:#B85042;border:1px solid #999;"></span> (B85042)`

If the chat UI cannot render visible swatches cleanly, also generate a temporary palette preview image:
- outside `templates/<template-name>/`
- with one row per option
- with large labeled swatches and hex values
- only for review during the interview, not as a collected template asset by default

Read [references/question-bank.md](references/question-bank.md) for palette families to offer.

### 3. Typography

Define:
- title font
- body font
- optional third font only if strongly justified
- relative emphasis rules for titles, section headers, body, captions, and callouts

Only propose common PowerPoint-safe fonts unless the user explicitly provides branded fonts.

### 4. Layout Inventory

Define:
- number of layouts
- name of each layout
- purpose of each layout
- geometry of each layout
- exact coordinates and sizes of reusable blocks in inches
- per-placeholder style tokens that can be changed without editing JS
- placeholder types per layout: title, subtitle, body, bullets, image, icon, chart, table, quote, KPI, footer
- preferred shape language: rectangle, rounded rectangle, circle, line, pill, or full-bleed image zones

Mandatory layouts:
- title
- agenda / sommaire
- divider / chapter title / intercalaire
- conclusion / key takeaways / a retenir

Divider layouts must remain visually compatible with the title layout:
- same dark or light family unless the user explicitly wants a contrast break
- same title font family
- same text box colors unless a justified variant is chosen
- same motif family with adjusted hierarchy only

Recommended optional layouts are listed in [references/question-bank.md](references/question-bank.md).

### 5. Visual Motif

Choose one reusable motif and repeat it consistently. Examples:
- left color band
- top banner
- icon in colored circle
- offset photo block
- card grid
- oversized page number
- footer strip

Also lock whether the motif appears on:
- title only
- dividers only
- all content slides
- a subset of KPI-centric layouts

### 6. Content Mechanics Required By `pptx`

Bake these rules into the template spec:
- every slide needs a meaningful visual element, not plain title + bullets
- layouts must vary; avoid one repeated text-heavy structure
- body text should be left-aligned unless there is a clear exception
- allow at least 0.5" outer margins
- preserve 0.3-0.5" spacing between major blocks
- title styling must rely on spacing, contrast, or background treatment, never accent lines under titles
- titles and section headers should support bold treatment cleanly
- bullet slides must use proper bullet formatting, never literal unicode bullets
- geometry and style decisions must live in data files that the generator reads

Read [references/pptx-compatibility.md](references/pptx-compatibility.md) before finalizing the spec.

## Question Order

Use this progression unless the user already answered a later item:

1. Template goal and audience
2. Reference `.pptx` or no reference
3. Slide ratio and overall tone
4. Palette family
5. Typography pairing
6. Layout count range
7. Mandatory layout variants
8. Additional layout families
9. Shape language and motif
10. Footer, numbering, logo, and recurring metadata
11. Logo policy, logo file locations, and layout placements
12. Review and lock the final spec

## How To Ask Questions

For each step:

1. Summarize the current state in one sentence.
2. Ask one focused question.
3. Provide options in a short list.
4. Mark one option as recommended when helpful.
5. After the answer, update the working template spec before moving on.

Example style:

```text
On a un template plutot premium et aere en 16:9. Pour la palette de base, je te propose :
1. Bleu nuit (1E2761) / sable (E7E8D1) / cuivre (B85042)
2. Vert sapin (2C5F2D) / sauge (84B59F) / creme (F5F5F5)
3. Anthracite (36454F) / ivoire (F2F2F2) / rouge profond (990011)

Je recommande 1 si le deck doit rester tres business.
```

## Final Output Contract

End with a template spec that the `pptx` skill can execute without re-interviewing the user.

Include:
- distinctive template name
- objective and target audience
- slide ratio
- palette table with 3-6 hex colors
- typography table
- visual motif
- ordered layout inventory
- mandatory layouts confirmation
- placeholder map per layout
- geometric specification per layout in inches
- reusable style tokens and component definitions
- reusable components: footer, page numbers, logo zone, section markers, icon treatment
- do/don't rules specific to this template

When the user wants a buildable template, add:
- which layouts should become slide masters versus regular reusable slides
- what the first template `.pptx` should contain
- which layouts should be showcased as filled demo slides
- whether the existing template should be updated in place or duplicated into a variant folder

Store the result in `templates/<template-name>/` with at least:
- a primary brief file
- a machine-friendly structured data file
- a geometric layout spec file
- a generator entry file for `pptxgenjs`
- optional demo content file
- an `assets/` folder containing any source assets or a note describing what was and was not collected

Organize the folder so it is directly usable by `pptxgenjs`:
- keep the generator and data files inside the template folder
- keep output in `templates/<template-name>/output/`
- keep logos and reusable media in `templates/<template-name>/assets/`
- ensure the generator can be rerun after editing only the data files
- allow duplication of the whole folder to test heavy redesigns safely

## Guardrails

- Do not finalize with fewer than 3 colors or more than 6.
- Do not omit any mandatory layout.
- Do not recommend exotic fonts by default.
- Do not leave layout names vague; each one needs a purpose and geometry.
- Do not leave geometry trapped only inside JS constants.
- Do not clone a reference deck blindly; derive compatible variants instead.
- Do not hand off to `pptx` until the spec is complete enough to build.
