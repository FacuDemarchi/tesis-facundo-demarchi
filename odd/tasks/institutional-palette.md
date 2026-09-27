# Institutional palette migration across the five surfaces

## Goal

Align the visual material of the five web surfaces with the institutional identity of the case-study
university (deep green + gold), deepen the elevation scale, and replace the single amber token that
currently serves both attention and focus. Composition, topology, controls and behaviour do not
change: this is a durable system change inside an established world, with the palette **pinned by the
brief**, not a new visual world.

## Why

The author answered the Impeccable `document` interview with a pinned palette: replicate the
university's institutional colors. The incumbent palette is already within a few degrees of it — the
mockup teal `#0f766e` against the institutional `#046353`, and the amber `#f59e0b` against the
institutional gold `#eba310` — so the mockups have been drifting toward the brand by accident. This
task finishes the alignment deliberately.

## Provenance of the palette values

- `https://21.edu.ar/` (HTTP 200) and its `template_theme-overrides.css` (178 KB): `#046353` (×45),
  `#007a5e`, `#006c5b`, `#00523f`, `#043a31`, `#003e34`, `#e5f1ef`, `#98dbce`, `#0b9287`, `#35b5ac`,
  `#eba310` (×27), `#f19f26`, `#6a2482`, `#ef6b51`, `#1e1e1e`, `#cad5e2`, `#57ade9`.
- Logo SVG (Wikimedia Commons, studio Shakespear, 2017): `#006655`, `#00a98f`, `#6d6e71`.
- Not verified: no public brand manual was reachable, and `ues21.edu.ar` / `www.ues21.edu.ar` did not
  resolve (curl 000). These values come from the live site and the logo, not an official guide.

Every value below is one of those documented values or an alpha variant of one.

## Decisions

- **The university is never named in the artifacts.** The repository says "la universidad" and the
  institutional elicitation is still open (§4.4.3); the reinforced notices stay generic so they
  introduce no name and no endorsement. The palette is the commitment, not the name.
- **Notices are reinforced, not decorative.** Both the simulated data and the non-official status are
  stated visibly in each surface, never in a tooltip only.
- **Focus becomes two-tone.** Measured: gold `#eba310` alone scores 2.15:1 against white and 1.86:1
  against `#e5f1ef`, below the 3:1 that WCAG 2.2 SC 1.4.11 requires of a focus indicator. The
  incumbent `#f59e0b` has the same defect today. A gold outline plus an ink inner ring passes on both
  light and dark grounds.
- **Two voices, three roles.** `attention` (gold) draws attention and never confirms; `commit`
  (green) confirms and advances; `focus` is its own token and is never a fill.
- **The eight course states are data vocabulary, not brand material.** Their hues stay; three of them
  are darkened to reach AA at their real sizes (8–12 px), which the large-text exception does not
  cover.
- **The three clones stay byte-identical.** `mockup/`, `periodo-2A/` and `periodo-2B/` currently share
  one identical stylesheet; the drift the reconnaissance found (`#d97706`, `#ea580c`, `#64748b`) is
  removed in favour of the canonical values.

## Token table

### Neutrals — all five surfaces

| Token / role | Before | After |
| --- | --- | --- |
| ink (text) | `#0f172a` / `#172033` | `#043a31` |
| muted | `#64748b` / `#5d6b82` | `#006c5b` |
| line | `#cbd5e1` / `#d7deea` | `#cad5e2` |
| line-strong (new; interactive boundaries) | `#94a3b8` | `#6d6e71` |
| paper | `#f7fafc` / `#f4f7fb` | `#f4f7fb` |
| panel | `#fff` | unchanged |
| term column ground | `#f1f5f9` | `#e5f1ef` |
| wells (subject item, simulator) | `#f8fafc` | `#f4f7fb` |
| dark bar / topbar | `#0f172a` / `#10213d` | `#043a31` |
| modal scrim | `#0f172a66` | `#043a3166` |

### Commit (green)

| Role | Before | After |
| --- | --- | --- |
| primary | `#0f766e` | `#046353` |
| primary hover | `#115e59` | `#00523f` |
| soft ground | `#f0fdfa` | `#e5f1ef` |
| text on soft ground | `#115e59` | `#00523f` |
| selection ring | `#99f6e4` | `#98dbce` |
| institutional `--blue` step | `#1769aa` | `#007a5e` |
| institutional `--blue-soft` | `#e6f2fd` | `#e5f1ef` |
| institutional `--teal` | `#087f7b` | `#046353` |
| institutional `--teal-soft` | `#dff5f2` | `#e5f1ef` |

### Attention (gold)

| Role | Before | After |
| --- | --- | --- |
| attention / period CTA | `#f59e0b` | `#eba310` |
| attention hover | `#fbbf24` | `#f19f26` |
| text on attention | `#1f2937` | `#1e1e1e` |
| focus ring (outer) | `#f59e0b` | `#eba310` |

### Focus rule (replaces every single-tone ring)

```css
:focus-visible {
  outline: 3px solid #eba310;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #043a31;
}
```

The ink ring fills the offset gap, so the indicator keeps at least 3:1 against a white panel and
against the deep green bar, where the gold does the work. Apply it to every focusable control on all
five surfaces and delete the old single-tone rings.

### Course states

| State | Label | Before fg | After fg | Ground |
| --- | --- | --- | --- | --- |
| approved | Aprobada | `#15803d` | unchanged | `#dcfce7` |
| available | Disponible | `#2563eb` (4.24:1) | `#1d4ed8` (5.49:1) | `#dbeafe` |
| blocked | Bloqueada | `#dc2626` (3.95:1) | `#b91c1c` (5.30:1) | `#fee2e2` |
| planned | Planificada | `#0284c7` (3.57:1) | `#0369a1` (5.17:1) | `#e0f2fe` |
| review | Solicitud en revisión | `#475569` / `#64748b` | `#6a2482` (8.15:1) | `#eeeafd` |
| enrolled | Inscripta | `#7c3aed` | unchanged | `#ede9fe` |
| no-capacity | Sin cupo | `#c2410c` / `#ea580c` | `#c2410c` | `#ffedd5` |
| no-offer | Sin cátedra | `#b45309` / `#d97706` | `#b45309` | `#fef3c7` |

The hatched fills of `blocked` and `no-offer` keep their existing stripe geometry **and their
unchanged tint stops** (`#fde7ac`, `#fbcdd1`). Only the foreground token changes. An earlier pass
re-pointed the stripe stops at the new foreground values; that destroyed the card labels' legibility
where a stripe crosses a glyph (`#043a31` on `#b91c1c` = 1.96:1) and was reverted. The stripes are a
*pattern alongside colour*, an accessibility feature of the state vocabulary, not decoration.

### Categories, edges, institutional accents

| Role | Before | After |
| --- | --- | --- |
| category process | `#0f766e` | `#046353` |
| category general | `#64748b` | `#6d6e71` |
| category sa / pp | `#be123c` / `#c2410c` | unchanged |
| edge solid | `#0f766e` | `#046353` |
| edge dashed | `#7c3aed` | unchanged |
| institutional `--navy` | `#10213d` | `#043a31` |
| institutional `--violet` | `#6a4bc4` | `#6a2482` |
| institutional `--violet-soft` | `#eeeafd` | unchanged |
| institutional `--warning` / `--warning-soft` | `#b54708` / `#fff0df` | unchanged |

### Elevation — three steps, deepened

| Layer | Before | After |
| --- | --- | --- |
| card at rest | `0 4px 9px #0f172a18` | `0 6px 14px #043a3124` |
| card hover | `0 8px 14px #0f172a25` | `0 10px 22px #043a3130` |
| marked card | `0 0 0 4px #0f766e, 0 8px 18px #0f172a30` | `0 0 0 4px #046353, 0 10px 22px #043a3138` |
| selection panel | `0 16px 32px #0f172a40` | `0 22px 44px #043a3147` |
| results modal | `0 20px 44px #0f172a52` | `0 30px 64px #043a3159` |
| institutional surfaces | `#16284a…` family | same alphas over `#043a31` |

No `backdrop-filter`, no keyframes, no new transition: the incumbent motion stays as it is.

## Notices to add (five surfaces)

One visible line each, in Spanish, contrast-checked against `#043a31`:

> Datos simulados. Prototipo de tesis. No es un sistema oficial de la universidad.

Placement: in the period bar of `mockup/`, `periodo-2A/`, `periodo-2B/`, `panel-seleccion/`, and in
the topbar of `institucional-demanda/`. It must be real text in the document, never a tooltip, and it
must not be the only thing removed by a narrow viewport.

## Constraints (non-negotiable)

- No composition, layout metric, control, or behaviour change. The graph geometry, the floating
  panel's hysteresis (20 % / 15 %), the tab order, the six simulator outcomes, the read-only CU-13
  evaluation and every `aria-*` contract stay exactly as they are.
- No copy change beyond the notice above.
- No new dependency, no build step, no font change: the stack is static HTML/CSS/JS served by
  `python3 -m http.server`.
- Keep the incumbent scale systems: pixels in the student surfaces, rem in the institutional one.
- Every color literal must remain inside the stylesheets; no color enters JS or HTML.
- `mockup/`, `periodo-2A/` and `periodo-2B/` stylesheets must end byte-identical.

- [x] Task 5 — `document`: `DESIGN.md` plus `.impeccable/design.json` written from the built world.
      Frontmatter and sidecar both validated (39 colour tokens, 6 type roles, 10 radii, 7 components;
      valid YAML; valid JSON at `schemaVersion 2` with 8 colour ramps of 8 steps, 10 shadows and 8 named
      rules); the eight canonical sections are present in order.
- [ ] Task 6 — `audit panel-seleccion/` against the new system. Not started: the author should look at
      the rendered result first, and the copy decision the audit will surface (the kicker pattern) is
      theirs.

## Design authority, as delivered

`DESIGN.md` lives at the repository root and its sidecar at `.impeccable/design.json`.

- **Creative North Star: «El plano de correlatividades».** Anti-reference declared: a generic SaaS
  dashboard. The prototype must not read as the university's official system.
- Eight named rules, the load-bearing ones being: two voices (gold attracts, green confirms), the
  two-tone focus ring that no `box-shadow` rule may clobber, the stated-colour rule (no colour says
  anything the text does not), and the border that informs.
- The eight course states are documented as data vocabulary with their measured ratios, including the
  worst case where a glyph crosses a hatch stripe.
- Prose and frontmatter are in Spanish, matching `decisiones.md` and the scenario READMEs, while
  `odd/tasks/*.md` and commit messages stay English.

## Token architecture (audit remediation, 2026-09-27)

The audit found the palette written as raw hex literals inside the rules — 156 literals against 37 `var()`
uses in `panel-seleccion` — even though tokens already existed in `:root`. This is the remediation
spec: extract the palette into a primitive layer plus role aliases, so no colour literal lives outside
`:root`. It is appearance-preserving: no pixel may change.

### Primitive layer (literals live only here)

```css
  /* Primitivas de color */
  --c-green:#046353; --c-green-deep:#00523f; --c-green-soft:#e5f1ef; --c-deep:#003e34;
  --c-ink:#043a31; --c-muted:#006c5b; --c-line:#cad5e2; --c-line-strong:#6d6e71;
  --c-paper:#f4f7fb; --c-white:#fff; --c-slate-teal:#98dbce;
  --c-gold:#eba310; --c-gold-hover:#f19f26; --c-ink-on-gold:#1e1e1e;
  --c-teal:#007a5e; --c-magenta:#6a2482; --c-magenta-soft:#eeeafd; --c-violet:#7c3aed;
  --c-rust:#c2410c; --c-rose:#be123c;
  --c-amber-structure:#b45309; --c-amber-ground:#ffedd5; --c-amber-ink:#431407;
  --c-stripe-no-offer:#fde7ac; --c-stripe-blocked:#fcd5d8;
  --c-warning:#b54708; --c-warning-soft:#fff0df; --c-warning-ink:#8e3608;
  /* Primitivas de sombra (tinta con alpha) */
  --c-shadow-card:#043a3124; --c-shadow-card-hover:#043a3130; --c-shadow-card-marked:#043a3138;
  --c-shadow-panel:#043a3147; --c-shadow-modal:#043a3159; --c-scrim:#043a3166;
  --c-shadow-ambient:#043a310d; --c-shadow-tooltip:#043a3133;
```

### Role layer (what the rules consume)

The four student stylesheets end up with `--ink`, `--muted`, `--line`, `--line-strong`, `--paper`,
`--panel`, `--green`, `--green-deep`, `--green-soft`, `--deep`, `--gold`, `--gold-hover`,
`--ink-on-gold`, `--focus`, `--focus-inner`, `--amber-structure`, `--amber-ground`, `--amber-ink`,
`--stripe-no-offer`, `--stripe-blocked`, `--category-process`, `--category-sa`, `--category-pp`,
`--category-general`, `--edge-dashed`, `--review-soft`, plus the shadow roles `--shadow-card`,
`--shadow-card-hover`, `--shadow-card-marked`, `--shadow-panel`, `--shadow-modal`, `--scrim`,
`--shadow-ambient`, `--shadow-tooltip`. The eight state pairs keep their existing names and their
literal values, except `--review:#6a2482` and `--review-bg:#eeeafd`, which become `var(--c-magenta)`
and `var(--c-magenta-soft)`.

`institucional-demanda` keeps its own names pointed at the same primitives: `--navy:var(--c-ink)`,
`--blue:var(--c-teal)`, `--blue-soft:var(--c-green-soft)`, `--teal:var(--c-green)`,
`--teal-soft:var(--c-green-soft)`, `--violet:var(--c-magenta)`, `--violet-soft:var(--c-magenta-soft)`,
`--warning:var(--c-warning)`, `--warning-soft:var(--c-warning-soft)`, `--warning-ink:var(--c-warning-ink)`.

### Rule-level replacement table

| Literal | Role |
| --- | --- |
| `#043a31` | `var(--ink)` |
| `#006c5b` | `var(--muted)` |
| `#cad5e2` | `var(--line)` |
| `#6d6e71` | `var(--line-strong)` |
| `#f4f7fb` | `var(--paper)` |
| `#fff` in `background` | `var(--panel)` |
| `#fff` in `color` | `var(--c-white)` |
| `#046353` | `var(--green)` |
| `#00523f` | `var(--green-deep)` |
| `#e5f1ef` | `var(--green-soft)` |
| `#003e34` | `var(--deep)` |
| `#eba310` in `outline` | `var(--focus)` |
| `#eba310` elsewhere | `var(--gold)` |
| `#f19f26` | `var(--gold-hover)` |
| `#1e1e1e` | `var(--ink-on-gold)` |
| `#98dbce` | `var(--c-slate-teal)` — light-on-dark accent only, never on white (1.57:1) |
| `#fde7ac` / `#fcd5d8` | `var(--stripe-no-offer)` / `var(--stripe-blocked)` |
| `#b45309` / `#ffedd5` / `#431407` | `var(--amber-structure)` / `var(--amber-ground)` / `var(--amber-ink)` |
| `#b54708` / `#fff0df` / `#8e3608` | `var(--warning)` / `var(--warning-soft)` / `var(--warning-ink)` |
| `#007a5e` | `var(--published)`; in the institutional file `var(--blue)` |
| `#6a2482` / `#eeeafd` | `var(--review)` / `var(--review-soft)`; institutional `var(--violet)` / `var(--violet-soft)` |
| `#7c3aed` on the dashed edge | `var(--edge-dashed)` |
| `#be123c` | `var(--category-sa)` |
| `#c2410c` as a category border | `var(--category-pp)` |
| `#b91c1c` | `var(--blocked)` |
| `#92400e` | `var(--no-offer)` |
| `#dbeafe`, `#dcfce7`, `#fee2e2`, `#fef3c7`, `#e0f2fe`, `#ede9fe` | the matching `--*-bg` state role |
| `#043a3124`, `#043a3130`, `#043a3138`, `#043a3147`, `#043a3159`, `#043a3166`, `#043a310d`, `#043a3133` | the matching `--shadow-*` / `--scrim` role |

### Dead rules to delete (mockup family only)

Verified: `mockup/app.js` emits only `course-state`, `term`, `term-grid`, `category-${course.category}`
and the course classes, and `mockup/index.html` contains none of the selectors below. Delete these
groups in `mockup/`, `periodo-2A/` and `periodo-2B/` **only**: `.graph-header` and `.graph-header p`;
the bare `h1` rule; `.stats`, `.stats div`, `.stats dt`, `.stats dd`; `.legend`, `.legend h2`,
`.legend-grid`, `.legend-item`, `.legend-item b`; `.category-row`, `.category`, `.category::before`,
`.category.process::before`, `.category.sa::before`, `.category.pp::before`, `.line`, `.line.dashed`,
`.note`, `.course.marked`, `.course.marked::after`, `.period-navigation .primary-action`, `.sr-only`,
`.eyebrow`.

Two cautions. **Do not** remove any `.course.category-*` rule: those names are produced by
interpolation and exist at runtime. In `panel-seleccion`, remove only `.subject-origin` from the
grouped selector `.subject-meta,.subject-origin,.subject-motive` — that is the one dead class it has.

Removing that block also removes the two colours that sat outside the palette (`#57ade9`, `#0b9287`),
which lived only in `.stats div`.

## Steps

- [x] Feature document and Engram mirror.
- [x] Task 1 — migrate the four student stylesheets (`panel-seleccion`, `mockup`, `periodo-2A`,
      `periodo-2B`) to the token table, including the focus rule and the deepened elevation.
- [x] Task 2 — migrate `institucional-demanda/styles.css`.
- [x] Task 3 — add the notice to the five `index.html` files.
- [x] Task 4 — verification round one, seven defects found and closed.
- [x] Task 4b — independent verification round two: four more contrast failures and one focus gap
      found and closed.
- [ ] Task 5 — `document`: write `DESIGN.md` plus `.impeccable/design.json` from the built world, once
      the closing verification verdict lands.
- [ ] Task 6 — `audit panel-seleccion/` against the new system.

## Verification round one (2026-09-27)

The first pass reported success; the parent's own inspection and the bundled detector found seven
defects it had not reported. All seven are closed. This is the evidence, in the order it was found.

| # | Defect | Measured | Fix |
| --- | --- | --- | --- |
| 1 | The existing page notice in `institucional-demanda/index.html` was **deleted** and its `.simulation-notice` design gutted; the disclaimer was downgraded from a bordered block to a `.72rem` topbar line | content loss | footer and its design restored; the new topbar line moved to its own `.simulation-notice-inline` class |
| 2 | Warning ink on light grounds: `#b45309` on `#e5f1ef` | 4.34:1 (needs 4.5) | warning **text** → `#8e3608` (6.77:1 on `#e5f1ef`, 7.00:1 on `#fff0df`) in six institutional selectors |
| 3 | The primary CTA label on hover: `.period-navigation button:hover:not(:disabled)` outranks `.period-navigation .primary-action:hover`, so the gold CTA turned deep green while keeping dark ink | 1.81:1 | explicit `button.primary-action:hover:not(:disabled)` override in the four student stylesheets (7.72:1). Pre-existing with `#334155` before the migration |
| 4 | Hatch stripes re-pointed at the new foregrounds, over-applying the spec | `#043a31` on `#b91c1c` = 1.96:1 | tint stops restored (`#fde7ac`, `#fbcdd1`) |
| 5 | `.outcome-explanation` — the infeasibility explanation — was moved onto the commit green, a semantic misuse | legible but wrong meaning | ground restored to `#fff0df` with `#431407` ink (14.0:1) |
| 6 | `.results-confirm:hover` repeated its own base colour, so the confirm button gave no hover feedback | — | hover → `#8e3608` (white on it 7.83:1) |
| 7 | Hairline border plus the deepened 44px/64px shadow on the two overlay layers | detector advisory `gpt-thin-border-wide-shadow` | borders removed from `.selection-panel` and `.results-modal`; the shadow is the single edge |

Post-fix state, measured: `low-contrast` findings **0**; `gpt-thin-border-wide-shadow` back to the
four pre-existing institutional advisories; `sha256sum` identical across the three clones;
`git diff` of `institucional-demanda/index.html` shows **+1 / −0** lines, so nothing else was lost.

Detector findings that remain and are **not** defects of this migration, with the reason each is a
deliberate decision or a false positive:

- `side-tab` (the 7px card stripe, the 3–4px callout rules, the 5px notice rule): the card stripe
  encodes category and is the committed world's device; the callout rules mark explanation blocks.
  The craft floor lists a coloured side border as an earnable default, not a ban, and here it carries
  information.
- `repeating-stripes-gradient`: the hatch is the state pattern that keeps the vocabulary from
  depending on colour alone.
- `dark-glow` on the four student surfaces: it is reading the two-tone focus rule's ink inner ring
  (`0 0 0 2px #043a31`) as a decorative glow. It is a focus indicator, and on the dark bar the gold
  outer ring carries the 5.91:1 contrast.
- `overused-font` (Inter): the incumbent single UI face on an Operate surface, kept deliberately.
  Changing the type voice is not part of a pinned-palette migration.
- `undersized-ui-text` / `tiny-text` (8–12px): inherited density, and the reason the three state
  contrast defects mattered.
- `kicker-above-heading` in `institucional-demanda` («Detalle por materia» above «Demanda y causas»):
  this one **is** a craft-floor ban that no brief earns back, and the same uppercase eyebrow pattern
  appears in the student surfaces. Closing it changes copy and structure, so it belongs to the audit
  and to an explicit decision, not to this migration.
- `gpt-thin-border-wide-shadow` ×4 and `cramped-padding` in `institucional-demanda`: pre-existing,
  left untouched.

Two harness limits shape this round: there is no browser tool, so no screenshot or comp round exists,
and no image generation, so the build is code-led by contract. The final visual confirmation is the
author opening `http://localhost:8080/<surface>/`.

## Verification round two (2026-09-27) — independent review

An independent `gentle-ai-verify` pass over the same ten files found four more contrast failures and
one focus-coverage gap, all now closed. It also confirmed content preservation (`git diff` of the five
pages: five additions, zero removals; the institutional footer byte-identical to HEAD), clone
identity, an empty JS diff, and that every focusable control reaches a two-tone ring.

| # | Defect | Measured | Fix |
| --- | --- | --- | --- |
| 8 | Period-bar uppercase labels on the dark bar: one rule served two opposite grounds, so `#6d6e71` landed on `#043a31` | 2.49:1 (before, `#94a3b8` on `#0f172a`: 6.96:1) | bar labels → `#98dbce` (8.07:1); `.eyebrow` and `.cap-separator` keep `#6d6e71` on light grounds (5.10:1) |
| 9 | The ink focus ring was clobbered: `.course:hover:not(:disabled)` and `.course.marked` override `box-shadow`, leaving only the gold outline | gold alone on the paper: 2.00:1, below SC 1.4.11's 3:1 | `:focus-visible` companions re-include `0 0 0 2px #043a31` first in the stack |
| 10 | No-offer foreground over its own hatch stripe (`#b45309` on `#fde7ac`), and again on the action hover ground `#ffedd5` | 4.11:1 and 4.38:1 | amber **text** → `#92400e` (5.81:1 on the stripe, 6.19:1 on the hover ground, 6.37:1 on the base fill) |
| 11 | Blocked card metadata (`#006c5b`) over its hatch stripe `#fbcdd1` | 4.48:1 | stripe tint → `#fcd5d8` (4.75:1), luminance 7.71 % below the base fill so the pattern stays visible |
| 12 | Institutional period-selector label: `.period-controls label` and `.topbar-period label` tie on specificity, so the later one won and the label rendered in `--muted` on the dark bar | 1.99:1 (pre-existing pair: 2.98:1) | `.period-controls.topbar-period label { color: #e5f1ef }` (10.97:1) |
| 13 | `#demand-list` is the `.skip-link` target and carries `tabindex="-1"`, but no focus rule covered it | WCAG 2.4.7 gap | `#demand-list:focus-visible` with the same two-tone ring |

Final measured state: dead literals **0**; `low-contrast` findings **0**; the three clones share one
hash; every page answers 200; the change is ten files, +142 / −128 lines, uncommitted. `#b45309`
survives deliberately as the explanation's left rule and the confirmation button's fill.

Disabled-control opacity pairs (`opacity: .38` to `.5`) measure below 4.5:1; the reviewer correctly
classified those as numerical rather than violations, since WCAG exempts inactive controls.

## Open items carried to the audit

- `filter: saturate(.7)` on disabled course cards shifts every colour inside them; those transformed
  pairs cannot be bounded statically (UNVERIFIED).
- Whether `:focus-visible` matches a `tabindex="-1"` skip-link target needs rendered behaviour.
- `kicker-above-heading` in `institucional-demanda` is an unearnable craft-floor ban, and the same
  uppercase eyebrow pattern appears in the student surfaces. Closing it changes copy and structure.
- Pre-existing in `institucional-demanda`: four `gpt-thin-border-wide-shadow` advisories and one
  `cramped-padding`.

## Verification available in this harness

There is no browser tool and no image generation here, so no screenshot round and no comps exist.
Verification is programmatic: contrast arithmetic, `sha256sum` on the three clones, `grep` for stale
literals, and `impeccable detect --json`. The final visual confirmation belongs to the author opening
`http://localhost:8080/<surface>/`.

## Audit remediation (2026-09-27)

The audit scored the system 14/20 and produced two P1s, two P2s I could close and a set of P3s. All the
closable ones are closed, in four commits, each one verified before the next.

### What was closed

| Finding | Measure before | After |
| --- | --- | --- |
| **P1** No page had an `h1` | 0 `h1` across five pages | one `h1` per page, with the plan label folded **inside** the heading so no kicker sits above it and no copy changed |
| **P1** Help control below the legal target | `.summary-info` 18×18 px | 24×24 px, the WCAG 2.2 SC 2.5.8 minimum |
| **P2** Palette as literals | 156 hex literals against 37 `var()` uses in `panel-seleccion` | primitives plus role aliases; **0 literals outside `:root`** in all five files; `var()` uses now 211 / 119 / 119 / 119 / 115 |
| **P2** The two kickers | `kicker-above-heading: 1` | deleted with their dead rules; the detector now reports **0** |
| Dead CSS carrying off-palette colours | `#57ade9`, `#0b9287` in `.stats div` | the graph header, stats and legend rule groups removed (119 → 66 colour declarations in each scenario sheet) |

### The proof for the refactor

Every colour declaration was resolved through its `var()` chain and compared against the previous
revision, selector by selector, individual selector inside grouped rules: **zero values changed**, and
every removed declaration belongs to a documented dead group. `panel-seleccion` and
`institucional-demanda` keep identical declaration counts (168 and 105). Two false alarms of my own
checker are worth recording: it first flagged everything as removed because it filtered on `#` in the
value (which the refactor had just removed), and later counted `--course-bg`, `--course-color`,
`--slot` and `--panel-inset` as dangling — those are per-element custom properties set by the state
rules or by JavaScript, not gaps.

### One regression I introduced and the detector caught

Wrapping the label and the name in one heading made the name a `span`, and the label rule targets every
`span` in its container at specificity (0,1,1), which beats a bare class (0,1,0). The career name was
rendering 10 px, uppercase and in the label colour instead of 14 px and white. Fixed by scoping the
name rule to its container (0,2,0). **The detector surfaced it as an uppercase-body-text finding, not as
a size or colour one**: the heading count, the dead-selector grep and the contrast arithmetic were all
green while the title was visibly wrong. That is the argument for running the detector even when every
check you wrote yourself passes.

### Detector movement

54 findings on the migrated state, **78** the moment `DESIGN.md` existed (a new family, `design-system-*`,
compares the code against the record), and **43** after the remediation. Closed to zero:
`low-contrast`, `kicker-above-heading`, `all-caps-body`, `design-system-color`, `design-system-radius`,
and `design-system-font-size` from 29 to **1**.

The 43 that remain are the families already triaged as earned or pre-existing: `side-tab` 10 (the
category stripe and callout rules), `overused-font` 10 (Inter, deliberate), `undersized-ui-text` 8 and
`tiny-text` 5 (the inherited density), `repeating-stripes-gradient` 4 (the accessible state pattern),
`gpt-thin-border-wide-shadow` 4 and `cramped-padding` 1 (pre-existing in the institutional view).

### Still open, and why

- **`font-size: 1.08rem`** (≈17.28 px) in the institutional view is the only value with no neighbour on
the declared ramp. It is part of the same debt as the rem scale below; declaring a 17 px token to
silence a checker would legitimise an arbitrary number.
- **The institutional rem ramp has 15 distinct values**, several neighbours 0.01 rem apart. Recorded in
  `DESIGN.md` as «La Regla de las Dos Escalas» and as debt: consolidating it to seven steps changes the
  visual and needs the author's eyes, so it is a decision, not a cleanup.
- **Focus-strip clipping** is still `UNVERIFIED`: `html, body { overflow: hidden }` may crop the ring on
the cards at the edge of the canvas, and that needs rendered geometry. Only the author can close it.

## Next step

`audit panel-seleccion/` against the system `DESIGN.md` now records, then the finish review. Nothing is
committed: ten modified UI files plus `PRODUCT.md`, `DESIGN.md`, `.impeccable/` and the two feature
documents are in the working tree, on the `docs/figura-5-colaboracion` branch, which belongs to an
unrelated figure task.

## Evidence

- Palette provenance: `https://21.edu.ar/` theme stylesheet and the 2017 logo SVG, values enumerated
  above.
- Contrast arithmetic: measured before writing, table above; the three failing course states and the
  single-tone focus ring are the concrete defects this task closes.
- Reconnaissance: `gentle-ai-explore` task `mukceczc-2-lh9a` (token extraction and the clone
  divergence list) and task `mukcafpo-1-okkn` (product truth).
- Author decisions: palette pinned (2026-09-27), institutional palette with reinforced notices
  (2026-09-27), deeper elevation (2026-09-27), replace now rather than annotate (2026-09-27).
