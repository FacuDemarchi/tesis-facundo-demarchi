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
- **The reading measure inside the results modal** was open when this plan was written, as a
  composition decision for the author. It is closed in **T6** below.
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

## T6 — The reading measure, decided after the floor

The author closed the open composition decision: prose gets a measure. The independent assessment had
measured `.outcome-summary p` at ~130–150 characters per line, `.results-simulated` at ~115–120
(`max-width:820px`) and `.results-confirmation-hint` at ~95–100 (`680px`) — three different widths for
the same job, all of them past the 45–75 band the craft floor asks for.

**One token, six rules**, in `panel-seleccion/styles.css`: `--measure-prose:65ch` in `:root`, carried
by `.results-simulated`, `.results-confirmation-hint`, `.outcome-summary`, `.outcome-explanation`,
`.results-simulator p` and `.alternative-note`. Data keeps the width it needs: tables, grids and metrics
are untouched, and the two hardcoded widths are gone.

**Why 65ch and not 70.** `ch` is the advance width of the digit zero, which in Inter is wider than the
average lowercase letter, so a line of N characters is narrower than N `ch`. Setting the measure at the
bottom of the documented 65–75ch band errs narrow, which is the safe direction for prose, and one value
keeps every prose block in the modal on the same column. This is reasoned from the unit's definition,
**not** measured: with no browser on this machine the rendered character count was never observed.

**This change came after the type floor was approved and its authority burned.** It therefore sits on a
new candidate tree that the burned receipt does not cover, and it needs its own review.

### Evidence

- Arithmetic: masking the token line and the six rule bodies on both sides, **every other byte** of
  `panel-seleccion/styles.css` is identical to `7967f97`. The token is declared exactly once, inside
  `:root`; all six rules carry it; `max-width:820px` and `max-width:680px` have **0** occurrences.
- The other four stylesheets are untouched.
- Detector, before → after this change: **11 + 8 → 11 + 8**, identical per-rule histogram. The measure is
  a craft rule, not a detector rule: it neither closes nor opens a finding, and it is reported as such
  instead of being counted as an improvement.
- Sidecar consistency: `narrative.rules` was carrying **pre-change** text for two rules — the 10px floor,
  and the rem ramp still described as "trabajo pendiente" — stale since the two earlier features. Both
  were rewritten to match the built world, and the measure rule was added.

### Limitations

- No rendered verification, for the same reason as everywhere in this document: no browser. The measure
  was not seen, and neither was the interaction between a 65ch prose column and the modal's wide tables
  and grids.
- `.alternative-note` lives inside an alternative card that can span the whole modal at the
  single-column breakpoint. Constraining the note while the card stays wide is a deliberate consistency
  choice — all prose shares one measure — but it was not seen either.

## Evidence

Base for every comparison: `c1a60a7`, the tip of the parent branch. Change commit: `50508de` (four
stylesheets + `DESIGN.md` + sidecar); waiver commit: `b86ec16` (`.impeccable/config.json`).

### The nine declarations, as they exist on disk

| # | Selector | Result | Surfaces |
| --- | --- | --- | --- |
| 1 | `.period-context span, .period-display span` | `font-size:11px`, `letter-spacing:.06em` | all four |
| 2 | `.year-row span` | `font-size:11px`, `letter-spacing:.03em` | all four |
| 3 | `.term h2` | `font-size:11px`, `letter-spacing:.03em` | all four |
| 4 | `.period-context .simulation-notice` | `font-size:12px`, `letter-spacing:0` | all four |
| 5 | `.course-state` | `font-size:8px`, `letter-spacing:.04em` | all four |
| 6 | `.course.marked::after` | `font-size:8px`, `letter-spacing:.04em` | panel |
| 7 | `.alternative-index` | `font-size:12px`, `letter-spacing:.04em` | panel |
| 8 | `.subject-meta,.subject-motive` | `font-size:11px` | panel |

### Verification, arithmetic

Each of the four stylesheets was compared against its base revision with the target rules masked on
both sides, so property order cannot hide an edit made elsewhere:

- `mockup/`, `periodo-2A/`, `periodo-2B/`: bytes outside the five target rules are **identical** to
  `c1a60a7`.
- `panel-seleccion/`: bytes outside the eight target rules are **identical** to `c1a60a7`.
- `font-size:10px` occurrences: **0** in all four files.
- Distinct `font-size` values, before → after: `[8,9,10,12,14,15]` → `[8,9,11,12,14,15]` in the three
  scenario sheets; `[8,9,10,11,12,13,14,15,16,22]` → `[8,9,11,12,13,14,15,16,22]` in the panel. Nine
  steps in the widest surface, which is what `DESIGN.md` now states.
- Cross-surface agreement: the five shared roles resolve to the same size and tracking in all four
  files. No new drift between surfaces.

### Detector: base against current

```
git worktree add --detach /tmp/base-plan c1a60a7
impeccable detect .                                             # both sides
impeccable detect --scope type mockup/ panel-seleccion/ periodo-2A/ periodo-2B/
```

| | Base `c1a60a7` | Current |
| --- | --- | --- |
| Repository anti-patterns | 33 | **11** |
| Repository advisory notes | 8 | 8 |
| Type findings in the four surfaces (scope `type`) | 20 | **0** |

Per-rule delta over the whole repository, and nothing else moves: `overused-font` **−10** (closed by the
recorded waiver, not by code), `tiny-text` **−4** and `undersized-ui-text` **−8** (closed by the
change). No rule appears that was not there before.

### What the writer caught that this plan missed

The first version of the change table listed eight declarations. `panel-seleccion/` carries **five** 10px
declarations, not four: `.subject-meta,.subject-motive` was absent from the table while the acceptance
criteria already required `font-size:10px` to reach zero. The bounded writer stopped and reported the
contradiction instead of inventing a value; row 9 was added and the file completed by hand. A plan whose
table and whose acceptance criteria disagree is a plan defect, and the acceptance criterion is what
caught it.

### Limitations

- **No rendered verification.** This machine has no browser and no remote debugging port. Nothing here
  was checked in a viewport: no screenshot, no computed style, no overflow measurement. The 20 type
  findings are gone from a static scan and the four files are provably unchanged outside nine
  declarations; that is not the same as having looked at the result.
- **The responsive overrides are untouched on purpose.** `.period-navigation button` still drops to 12px
  at ≤640px (≤760px in the panel). That is text shrinking at a narrower viewport, and every fix changes
  a narrow layout that cannot be verified here.
- **The reading measure of the results modal was still open at this commit.** `.outcome-summary p`
  reached ~150ch, `.results-simulated` ~115–120ch, `.results-confirmation-hint` ~95–100ch at 12px.
  **Closed afterwards in T6**, by the author's decision; this bullet records the state the reviewed
  candidate was in.
- **The 8px state tag and 9px card metadata stay**, by the author's decision, on the strength of the
  fixed 272×118px card and the four redundant state signals.
