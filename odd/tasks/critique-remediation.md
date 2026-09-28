# Critique remediation: the five priority issues and the three decisions

## Goal

Close the findings of the first `/critique` of `panel-seleccion/` (29/40, band Good) in the order the
author chose: **system coherence first**, then the legibility decision already taken, then copy, then
the three design decisions answered at the close of the critique.

Branch `fix/critique-remediation`, stacked on `refactor/plan-type-scale`. Every unit is its own commit so
the remediation stays reviewable in slices: this branch is a multi-area change and must not arrive as one
opaque diff.

## The author's decisions (2026-09-28, at the close of the critique)

1. **Priority**: system coherence first.
2. **Card legibility**: the 8px state tag and the 9px metadata **rise to 11px**, together.
3. **The amber confirm button must go green** — it is a confirmation, not an attention state.
4. **The legend** lives in a popover opened from the period bar.
5. **Mobile**: improve the bottom sheet and make it collapsible; do not replace the plan with a list.
6. **The modal**: both — the outcome control moves out to a demonstrator bar, and each alternative's
   weekly grid becomes collapsible.

## Units

### U1 — System coherence (the author's first priority)

**`panel-seleccion/styles.css`**

| Target | From | To |
| --- | --- | --- |
| `.results-actions .results-confirm` | `background:var(--amber-structure)` | `background:var(--green)` |
| `.results-actions .results-confirm:hover:not(:disabled)` | `background:var(--warning-ink)` | `background:var(--green-deep)` |
| `.outcome-summary` | `max-width:var(--measure-prose);margin:14px 0` | `margin:14px 0` (the measure leaves the container) |
| `.outcome-summary p` | no measure | `max-width:var(--measure-prose);` |
| `.outcome-explanation` | carries the measure | loses it (its children are 13px and 16px) |
| `.outcome-causes` | no measure | `max-width:var(--measure-prose);` |
| `.canvas:focus-visible` | browser default `auto 1px` | the documented two-tone, inset so it can never be clipped |

The measure moves because `ch` resolves against the **own** font-size of the element that declares it: on
a 16px container it produced 595px, which is 87 characters at the 13px the paragraph actually renders.
Rendered evidence: the 12px blocks in the same modal already land at 63 and 44 characters per line.

The canvas ring is composed inside the box — gold band 3px at the very edge, ink band 2px inside it —
because the canvas is full-bleed and an outer ring would be clipped by `html,body{overflow:hidden}`. Gold
outside and ink inside is the order `DESIGN.md` requires.

**`DESIGN.md`**: add the canvas to the focus rule as the one full-bleed case.

### U2 — Card legibility (decided)

All four pixel-scale sheets (`mockup/`, `panel-seleccion/`, `periodo-2A/`, `periodo-2B/`):

| Target | From | To |
| --- | --- | --- |
| `.course-state` | `font-size:8px` | `font-size:11px` |
| `.course small` | `font-size:9px` | `font-size:11px` |
| `.course strong` | `line-height:1.25` | `line-height:1.3` |
| `.course.marked::after` (panel only) | `font-size:8px` | `font-size:11px` |

Bounded by the card's own geometry: content box 239×92, worst case a 3-line title at 12px/1.3 = 46.8px,
plus a 13px state line and a 13px metadata line = 73px of 92px. `DESIGN.md`'s ramp and its redundant-floor
rule are rewritten accordingly: the 8px floor is retired and the state tag is no longer an exception.

### U3 — Copy

- **Accents**: the day names are simultaneously the **key** and the **label** (`dia: 'miercoles'`,
  `dayOrder`, `data-unavailable-day`, the button text). The canonical value becomes the accented form
  everywhere, exhaustively, and the rename is verified **functionally** in the browser: the weekly grid
  must still show every day, and marking "miércoles" unavailable must still remove that column.
- **The mixed-unit phrase**: `1A sin datos` becomes `1A sin oferta publicada`, which names the missing
  thing (`PRODUCT.md`: the missing attribute belongs to the offer, not to the course).

### U4 — The legend (decision: popover from the period bar)

A control in the period bar opens a popover with the 8 state names and their symbols, the 4 category
colours of the left border, and the difference between a solid and a dashed correlativity arrow. Real
text, dismissible with `Esc` and a click outside, keyboard reachable, and it does not add permanent
vertical space to a plan that is already tight.

### U5 — Mobile (decision: improve the sheet, make it collapsible)

The bottom sheet at ≤760px becomes collapsible — a handle, a smaller resting height, and a way to fold it
away to see the plan — and the period-period navigation buttons stop **shrinking** their text at a
narrower viewport.

### U6 — The modal (decision: both)

The outcome control leaves the student modal for a demonstrator bar in the surface itself, and each
alternative's weekly grid becomes collapsible so the modal stops being a 1039px wall inside a 796px
window.

### U7 — Final polish

The `edge-flush-cards` finding (6 cards flush against the canvas's right edge at rest), plus a batched
inspection pass over everything above.

## Acceptance criteria

1. Rendered characters per line land inside 45–75 for every prose block in the modal.
2. The rendered detector's `undersized-ui-text` findings reach **zero** on the plan surfaces.
3. The canvas focus ring is the two-tone ring, visible at 1400×900 and at 390×844, and never clipped.
4. The day rename is exhaustive — zero unaccented `miercoles`/`sabado` — and the vocabulary still round-trips:
   the toggle's key, the per-period blocked-day set and the announcement all use the accented form, and the
   grids render the data's days accented. **The grids do not respond to a restriction**, and that is by
   design: the alternatives are fixtures and the solver is simulated through the demonstrator select, so
   the correct check is that the key still matches, not that a column disappears. The first version of this
   criterion assumed the grid would react and was wrong.
5. The four sheets agree on every shared role; no card clips its text, in the worst case the render can
   find.
6. `impeccable detect` introduces no new rule, and each closed rule is reported with its cause.

## Evidence

### U1 — coherence (`92ced08`)

Rendered in Chrome for Testing 153 at 1400×900 and 390×844, driving the real journey by id
(`#primary-action` → mark 3 → `#panel-primary-action`) into the results modal.

| Claim | Rendered evidence |
| --- | --- |
| The confirm button is green | `.results-confirm` computes `background: rgb(4, 99, 83)` = `#046353`, text «Confirmar inscripción» |
| The measure lives on the text | `.outcome-summary p` 13px now computes `max-width: 483.34px` (65ch **at 13px**) and its longest line is 427px ≈ 63 characters. Before the fix the same paragraph rendered 595px wide and ~87 characters per line. |
| Every prose block is inside the band | longest lines: `.results-simulated` 63, `.outcome-summary p` 63, `.results-simulator p` 69, `.results-confirmation-hint` 70, `.alternative-note` 52 |
| The canvas ring is the documented one | `outline: solid 3px rgb(235,163,16)`, `outline-offset: -3px`, `box-shadow: rgb(4,58,49) 0 0 0 5px inset`, `:focus-visible` matched **with real keyboard modality** at both viewports, and `insideViewport: true` in both |
| Nothing else moved | masking the eleven target rules on both sides leaves every other byte of the four stylesheets identical to `7ae7702` |

### U2 — card legibility (`9f321da`, `92ced08`)

| Claim | Rendered evidence |
| --- | --- |
| The card text is legible | 46 cards: `.course-state` 11px, `.course small` 11px, `.course strong` line-height 15.6px (12 × 1.3) |
| Nothing clips | worst case `C01 · Herramientas matemáticas`: card body 114px of 114px, `clipped: false`; **zero** clipped cards of 46 |
| The stamp does not collide | the `MARCADA` stamp is 68px wide at 11px; clearance to the metadata **text** (not its box) is 40px on the marked cards and **31px** for the longest metadata string in the plan («● Sin marcar · Req. SA») |
| The reported text is gone | **the in-page detector went from 98 findings to 2**: the 92 `undersized-ui-text` and the 4 `tight-leading` disappeared. The two that remain are pre-existing: `repeating-stripes-gradient` and `edge-flush-cards` (U7) |
| The ramp simplified | distinct values: 8, 9 and 10px retired; `mockup`/`periodo-2A`/`periodo-2B` → `[11,12,14,15]`; panel → `[11,12,13,14,15,16,22]` |

**Why the CLI comparison is not the proof.** `impeccable detect` reports 11 anti-patterns and 8 advisories both
before and after: the static scan never saw the card text, because the state label and the metadata are
injected by the script. The rule that counted 92 of them only exists in the rendered page. A static scan
that comes back clean says nothing about the legibility of what the runtime builds.

### U3 — copy

| Claim | Evidence |
| --- | --- |
| Exhaustive rename | 15 occurrences replaced (12 `miercoles`, 3 `sabado`) across `comun/datos-simulados.js`, `comun/resultados-simulados.js`, `panel-seleccion/app.js` and `panel-seleccion/index.html`; `grep` for the unaccented forms returns **0**, and `node --check` passes on all three scripts |
| The days render accented | grid headers read «Lunes, Martes, Miércoles, Jueves, Viernes»; the toggles read «Miércoles» and «Sábado» |
| The key still matches | clicking the accented toggle flips `aria-pressed` to `true` and relabels to «Miércoles · no puedo asistir», which is the same round trip the blocked-day set uses |
| No behaviour was broken | zero page errors and zero console errors; the grids read **identically before and after** the restriction (grid 1 `Martes/Jueves`, grid 2 `Martes/Miércoles/Jueves/Viernes`, grid 3 `Lunes…Viernes`) |
| The mixed-unit phrase | `Cuatrimestrales 3/6 · 1A sin datos` → `· 1A sin oferta publicada`, reusing the wording the codebase already uses at `app.js:602` and `resultados-simulados.js:94` |

**A measurement trap worth recording.** An earlier run appeared to show the first alternative losing its
Wednesday column after the restriction, which would have been a real defect. It was not: one snapshot was
taken while the modal was hidden, and `innerText` skips `text-transform` on elements without layout, so the
two snapshots were not comparable. Comparing a hidden render against a visible one is not a comparison.

### U4 — the legend (`bc2a151`)

Rendered at 1400×900 and 390×844.

| Claim | Evidence |
| --- | --- |
| The content matches the code | 8 states, each swatch's computed background resolving to its token (`--approved-bg` #dcfce7 … `--review-bg` #eeeafd) with the symbol and label taken from the `states` map; 4 categories with their border colours (Proceso #046353, Req. SA #be123c, Req. PP #c2410c, General #6d6e71) |
| It opens and closes | opens by click and by `Enter` after Tab; closes with `Esc`, with a click outside and with its own button; `aria-expanded` tracks the state and focus returns to the toggle |
| It is anchored, not loose | panel `top: 81px` (the bar is 73px), `parent: .period-bar`, page `scrollY = 0`, bar `top = 0`; inside the viewport at 1400 (400×574) and at 390 (366×473) |
| The bar is intact | height 73px before and after; the primary action still visible |
| It does not break the plan | a real mouse click on an enabled card still marks it (0 → 1) **with the legend open**, and the legend closes at the same time |
| No noise | zero page errors, zero console errors, `node --check` passes |

**Two defects I introduced and fixed before committing.** The panel was first written as a sibling of the
header, so `top: calc(100% + 8px)` resolved against the viewport: it landed at 908px, and focusing its close
button scrolled the page 582px and pushed the period bar off-screen. It is now a child of the bar. And the
outside-close ran on `click`, which never reaches the document when the click lands on a course card —
that card re-renders itself and the event's target is detached — so the legend stayed open over the plan.
It now runs on `pointerdown` in the capture phase.

### An open finding: the two arrow strokes have no rule

The plan draws 12 continuous and 14 dashed correlativity arrows. Nothing in the repository documents the
difference, and the data does not contain one: `C14→C19` is dashed while `C17→C22` is continuous, with
identical structural signatures (same column gap, same year transition, same vertical offset). Across all
26 edges, both strokes occur at column gaps of 1 and 2 and across the same year transitions.

So the legend labels the strokes as what they are — «Trazo continuo» and «Trazo punteado» — and claims no
meaning, because there is none to claim. Naming the difference would be inventing it. This is a decision
for the author: make the fixture consistent, document a criterion and fix the fixture to match it, or
accept the strokes as visual variety.

### A note on the visual check (U2)

The card-level visual inspection was obstructed: the floating selection panel paints over the plan and
covered the marked card's right corner, which is where the `MARCADA` stamp lives. That is the documented
behaviour («las capas flotan, no reservan») and, at the same time, the extraneous cognitive load A
reported. The clearance was therefore verified geometrically, with the text's real right edge taken from a
`Range` and not from the block's box — the box-level measurement reported a false −65px collision.
