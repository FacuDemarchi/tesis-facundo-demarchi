# Plan type scale: raise the floor of the four pixel-scale surfaces

## Goal

Remove the sub-11px functional text from the four pixel-scale surfaces (`mockup/`, `panel-seleccion/`,
`periodo-2A/`, `periodo-2B/`), implement the tracking the design record already declares but the CSS
never applied, and leave the detector's remaining type findings either fixed or waived with a written
reason. The visual world, the composition and the fixed course-card geometry do not change.

## Why

The mechanical scan (`detect --json --scope type`) reports **20 type findings** across the four
surfaces, in an identical pattern per surface: 2 `undersized-ui-text` on the 10px period-bar labels,
1 `tiny-text` on the 10px simulated-data notice, and 2 `overused-font` on the family. Separately, the
independent typographic assessment found three built-vs-documented drifts that no detector reports.

The author decided the floor on 2026-09-28: **labels rise to 11px, the notice rises to 12px, and the
8px state tag and 9px card metadata inside the fixed 272×118px card stay where they are.** That keeps
`**La Regla del Piso Redundante**` intact — the 8px tag is not the only signal of the state — while
retiring 10px as a functional size.

## Measured ground truth (independent assessment, not the detector)

| Surface | Distinct values | Declarations |
| --- | --- | --- |
| `mockup/`, `periodo-2A/`, `periodo-2B/` | 6 — `[8, 9, 10, 12, 14, 15]` | 11 each, identical |
| `panel-seleccion/` | 10 — `[8, 9, 10, 11, 12, 13, 14, 15, 16, 22]` | 44 |

Slack that bounds the decision: the year pill is `height:20px; padding-top:4px` → 16px of content for a
10px line box, **4px of slack**; at 11px the line box is ~13.2px and 2.8px of slack remain. The
cuatrimestre heading has 22px of slack in its 34px box. The period bar is `min-height`, not a fixed
height, so it grows instead of clipping.

## The change

**`mockup/styles.css`, `periodo-2A/styles.css`, `periodo-2B/styles.css`, `panel-seleccion/styles.css`**

| # | Selector | From | To | Kind |
| --- | --- | --- | --- | --- |
| 1 | `.period-context span, .period-display span` | `10px` | `11px` | floor |
| 2 | `.year-row span` | `10px` | `11px` | floor |
| 3 | `.term h2` | `10px` | `11px` | floor |
| 4 | `.period-context .simulation-notice` | `10px` | `12px` | floor |
| 5 | `.course-state` | no tracking | `letter-spacing:.04em` | declared, unbuilt |
| 6 | `.course.marked::after` (panel only) | no tracking | `letter-spacing:.04em` | declared, unbuilt |
| 7 | `.year-row span` | no tracking | `letter-spacing:.03em` | sibling convention |
| 8 | `.alternative-index` (panel only) | no tracking | `letter-spacing:.04em` | sibling convention |
| 9 | `.subject-meta,.subject-motive` (panel only) | `10px` | `11px` | floor |

Rows 5–8 implement values the design record or the surface's own sibling already establishes; no new
number is invented. Micro (8px) is documented at `0.04em` and `.course-state` is that role; `.term h2`
already carries `.03em`, so the year pill above it takes the same; `.panel-section h2` already carries
`.04em` at 12px uppercase, so `.alternative-index` takes that.

Row 9 was **missing from the first version of this table** and the bounded writer caught it: it stopped
instead of inventing the change. `panel-seleccion/` carries five 10px declarations, not four, and
`.subject-meta,.subject-motive` is the fifth.

**Nothing else changes**: not the 8px state tag, not the 9px card metadata, not a width, not a padding,
not a breakpoint, not the font stack.

**`.impeccable/config.json` (new, committed)**: one value waiver,
`overused-font` = `Inter`, with the reason already written in `DESIGN.md` — the family is a deliberate
single working voice with no network font. This is a waiver, not a fix, and it is reported as such.

**`DESIGN.md` + `.impeccable/design.json`**: `Label` moves from 10px to 11px in the Hierarchy, in the
frontmatter and in the sidecar purpose; the pixel ramp is restated as nine values instead of ten; the
notice is Body at 12px; the redundant-floor rule is restated with the new functional floor.

## Out of scope, with the reason

- **The two sub-11px roles inside the course card** (8px state tag, 9px metadata). The author kept
  them: the card is a fixed 272×118px box with 24px of slack in its worst case, and the state has four
  redundant signals. The detector does not report them either.
- **The responsive overrides** (`.period-navigation button` drops to 12px at ≤640px, ≤760px in the
  panel). Real drift, but every fix is a layout change at a narrow viewport and this machine has no
  browser: unverifiable, therefore not touched.
- **The reading measure inside the results modal**: `.outcome-summary p` reaches ~150ch,
  `.results-simulated` ~115–120ch at `max-width:820px`, `.results-confirmation-hint` ~95–100ch at
  `680px`. Constraining prose to 70ch at 12px means a ~450px column inside a 1140px modal: that is a
  composition decision, not a defect the detector sees, so it stays open for the author.
- **The px ramp is not tokenized.** The rem surface got tokens because it carried fifteen near-identical
  values; this ramp is ten deliberate, documented steps and satisfies `design-system-font-size` already.
  Token extraction belongs to `/extract`, not here.

## Tasks

- **T1 — Floor and tracking.** The eight rows of the table above, in four stylesheets, with no other
  byte changed. Evidence: the detector's two legibility rules reach zero, and the rest of each file is
  byte-identical to `c1a60a7` outside the intended declarations.
- **T2 — Design record.** `DESIGN.md` Hierarchy, frontmatter and the sidecar purpose updated; the two
  typography rules restated with the new floor.
- **T3 — Waiver.** `overused-font` = `Inter` recorded through `impeccable ignores` with its reason.
- **T4 — Verification.** Detector base against current, split into found-by-change and closed-by-waiver;
  arithmetic check that only the intended declarations moved; the four surfaces compared against each
  other so no drift is introduced.
- **T5 — Evidence.** Recorded in this document.

## Acceptance criteria

1. Zero `warnings` from `undersized-ui-text` and `tiny-text` in the four surfaces.
2. Every other rule count unchanged, except `overused-font`, which is waived with a stored reason.
3. In each of the four stylesheets, only the declarations listed above differ from `c1a60a7`.
4. The four surfaces agree on every shared role after the change: no new drift between them.
5. `impeccable ignores list` shows exactly one value waiver, with its reason.

## Evidence

_(filled by T5)_
