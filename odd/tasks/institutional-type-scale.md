# Institutional type scale: consolidate the reading-surface ramp to seven steps

## Goal

Close the debt `DESIGN.md` declares by name ("La Regla de las Dos Escalas"): the institutional reading
surface carries fifteen distinct `font-size` values in `rem`, several of them separated by 0.01 rem —
`.82` against `.83`, `.72` against `.73`. At a 16 px base those are not two roles, they are two
numbers. Consolidate them to seven steps, each nameable by its purpose, and bind them to role tokens
in `:root` so no `font-size` literal survives outside the token block.

## Why

Three reasons, and only the first is cosmetic:

1. `DESIGN.md` promises seven steps and cannot be read as truthful while the file carries fifteen.
2. The non-navigating detector confirms two of them as real defects: `design-system-font-size` on
   `1.08rem` (`institucional-demanda/styles.css:74`), the only literal off the documented ramp, and
   `tiny-text` on 11.52 px — `.72rem` — which is below the 12 px legibility floor.
3. The palette migration already established the pattern this change follows: primitives and role
   tokens in `:root`, zero literals in the rules. Colour reached zero literals; type never did.

## The seven steps

All values in `rem`, measured against the 16 px base this surface inherits.

| Token | rem | px | Purpose | Absorbs |
| --- | --- | --- | --- | --- |
| `--fs-micro` | `.75rem` | 12.00 | Etiqueta en mayúsculas y piso de la escala: marca, encabezados de sección, chips de estado. | `.7`, `.72`, `.73`, `.75` |
| `--fs-label` | `.8rem` | 12.80 | Cromo de control y etiquetas secundarias: etiqueta de período, controles, tooltip, código de materia, filas de detalle del plan global. | `.77`, `.8`, `.82` |
| `--fs-body-sm` | `.84rem` | 13.44 | Cuerpo chico: prosa secundaria, listas, filas de definición. | `.83`, `.84` |
| `--fs-body` | `.9rem` | 14.40 | Cuerpo de lectura: avisos de datos simulados, línea de resumen, actor. | `.88`, `.9` |
| `--fs-title-sm` | `1rem` | 16.00 | Título chico: nombre del plan y de la carrera, valores de resumen, título de tarjeta. | `1`, `1.03` |
| `--fs-value` | `1.08rem` | 17.28 | Valor destacado: el número que el lector escanea en la fila de categoría. | `1.08` |
| `--fs-display` | `1.35rem` | 21.60 | Display: título de la superficie. | `1.35` |

**Design decisions taken, not inherited:**

- **El piso sube a 12 px.** `.7rem` (11.20 px), `.72rem` (11.52 px) and `.73rem` (11.68 px) all land on
  `.75rem` = 12.00 px. This is the one deliberate visual change of the change: it clears the 12 px
  legibility floor the detector enforces and it moves micro labels onto the same 12 px that is already
  the centre of gravity of the pixel ramp. Both scales now meet at 12 px.
- **El escalón `--fs-label` existe por rol, no por tamaño.** 12.80 px against 13.44 px is 0.64 px apart:
  visually they are neighbours. They stay separate because the role differs — control chrome and
  secondary labels versus prose. If the two ever stop being distinguishable in use, the step that
  goes is `--fs-label`.
- **`--fs-value` no se pliega en `--fs-title-sm`.** Folding it would drop the emphasised category value
  from 17.28 px to 16.00 px and invert it against the card title, which also lands on 16.00 px. A
  dedicated value step preserves the emphasis the surface already had.

**Maximum snap displacement: 0.80 px** (`.7rem` → `.75rem`). Every other move is ≤ 0.48 px, and seven of
the fifteen distinct values — 12 of the 32 declarations — do not move at all. No snap changes the
monotonic order of the scale, and no component gains a size inversion between its own elements.

## Out of scope

- The pixel ramp of `mockup/`, `panel-seleccion/`, `periodo-2A/` and `periodo-2B/`. Those are plan
  surfaces measured in px; they stay as they are. Only `institucional-demanda/styles.css` changes.
- Visual verification in a browser: this machine has no browser and no debug port, so no rendered
  check is possible. Declared as a limitation, not as a passed check.
- A shared token sheet for future reading surfaces. There is only one today, so the tokens live in its
  `:root`; extract them to `comun/` when a second reading surface appears.

## Tasks

- **T1 — Tokens and substitution.** Add the seven `--fs-*` role tokens to `:root` in
  `institucional-demanda/styles.css` and replace all 32 `font-size` declarations per the table above.
  No other rule changes.
- **T2 — Design record.** Rewrite "La Regla de las Dos Escalas" in `DESIGN.md` from declared debt to
  resolved scale, and add the seven steps to its `### Hierarchy`. Update the `.impeccable/design.json`
  sidecar so the ramp the detector reads matches the ramp the CSS uses.
- **T3 — Detector.** Re-run `impeccable detect institucional-demanda/` and require the two findings to
  be gone (`design-system-font-size`, `tiny-text`) with no new finding introduced.
- **T4 — Tracking.** Record the evidence in this document.

## Acceptance criteria

1. Zero `font-size` declarations with a literal `rem` value outside the `:root` token block.
2. Exactly seven `--fs-*` tokens in `:root`, with the seven values of the table.
3. Exactly 32 `font-size` declarations resolve through `var(--fs-*)`.
4. No file other than `institucional-demanda/styles.css` changes in T1.
5. `impeccable detect institucional-demanda/` reports neither `design-system-font-size` nor
   `tiny-text`, and introduces no new finding.

## Evidence

All commands run from the repository root. Base for every comparison: `618e32e`, the tip of `main`
before this branch. Change commit: `89f91f3` (blobs `2bfbbe4` for the stylesheet and `303a6bf` for the
sidecar; an earlier message-only amend did not touch either blob).

### T1 — tokens and substitution

The seven tokens, as they exist on disk in `institucional-demanda/styles.css`:

```
  /* Escala tipográfica de la superficie de lectura (siete pasos) */
  --fs-micro:.75rem; --fs-label:.8rem; --fs-body-sm:.84rem; --fs-body:.9rem; --fs-title-sm:1rem; --fs-value:1.08rem; --fs-display:1.35rem;
```

`font-size` declarations after the migration, by token:

| Token | Uses | Absorbed values |
| --- | --- | --- |
| `--fs-micro` | 8 | `.7`, `.72` ×3, `.73` ×3, `.75` |
| `--fs-label` | 6 | `.77`, `.8`, `.82` ×4 |
| `--fs-body-sm` | 8 | `.83` ×4, `.84` ×4 |
| `--fs-body` | 4 | `.88` ×3, `.9` |
| `--fs-title-sm` | 4 | `1rem` ×3, `1.03` |
| `--fs-value` | 1 | `1.08` |
| `--fs-display` | 1 | `1.35` |
| **Total** | **32** | 15 distinct values |

Reproduce: `grep -o 'font-size:[[:space:]]*[^;]*' institucional-demanda/styles.css | sort | uniq -c`.
Zero literals remain: `grep -o 'font-size:[[:space:]]*[0-9.]*rem' institucional-demanda/styles.css | wc -l`
returns `0`, and the same holds for `px`.

### Snap displacement, computed from the two file versions, not from this table

| Original | px | Token | px | Δ |
| --- | --- | --- | --- | --- |
| `.7rem` | 11.20 | `--fs-micro` | 12.00 | **+0.80** |
| `.72rem` | 11.52 | `--fs-micro` | 12.00 | +0.48 |
| `.73rem` | 11.68 | `--fs-micro` | 12.00 | +0.32 |
| `.75rem` | 12.00 | `--fs-micro` | 12.00 | 0 |
| `.77rem` | 12.32 | `--fs-label` | 12.80 | +0.48 |
| `.8rem` | 12.80 | `--fs-label` | 12.80 | 0 |
| `.82rem` | 13.12 | `--fs-label` | 12.80 | −0.32 |
| `.83rem` | 13.28 | `--fs-body-sm` | 13.44 | +0.16 |
| `.84rem` | 13.44 | `--fs-body-sm` | 13.44 | 0 |
| `.88rem` | 14.08 | `--fs-body` | 14.40 | +0.32 |
| `.9rem` | 14.40 | `--fs-body` | 14.40 | 0 |
| `1rem` | 16.00 | `--fs-title-sm` | 16.00 | 0 |
| `1.03rem` | 16.48 | `--fs-title-sm` | 16.00 | −0.48 |
| `1.08rem` | 17.28 | `--fs-value` | 17.28 | 0 |
| `1.35rem` | 21.60 | `--fs-display` | 21.60 | 0 |

Maximum displacement **0.80 px**. Seven of the fifteen distinct values — `.75`, `.8`, `.84`, `.9`, `1rem`,
`1.08`, `1.35`, which is **12 of the 32 declarations** — do not move at all; the other eight values move,
across 20 declarations.

### No visual change beyond the snap

- **Byte identity.** Beyond the inserted token lines and the `font-size` values, the stylesheet is
  byte-identical to `618e32e`. Removing the two inserted lines and masking only the `font-size` values
  leaves 13 309 bytes on both sides with the same SHA-256,
  `3335025e…643d1`. A reviewer can check the same thing from
  `git diff 618e32e..HEAD -- institucional-demanda/styles.css`: every changed line is either a token
  line or the value of a `font-size`.
- **Order preserved.** The seven steps are strictly increasing (12.00 < 12.80 < 13.44 < 14.40 < 16.00
  < 17.28 < 21.60), and no component gains an internal inversion. Checked pair by pair: the card header
  (`.course-code` 12.80 against `h3` 16.00), the category row (`dt` 13.44 against `dd` 17.28), the
  section details (`h4` 12.00 against `.section-list` 13.44), the global plan (`h4` 12.00, `h5` 12.80,
  explanation 13.44, summary `dt` 12.00 against `dd` 16.00) and the global evaluation (`h3` 14.40
  against `p` 13.44).

### T3 — detector, base against current

```
/home/facundo/.impeccable/bin/0.1.5/impeccable detect .                    # current tree
/home/facundo/.impeccable/bin/0.1.5/impeccable detect /tmp/verify-base    # detached worktree at 618e32e
```

| | Base `618e32e` | Current |
| --- | --- | --- |
| Anti-patterns | 34 | 33 |
| Advisory notes | 9 | 8 |
| `design-system-font-size` | 1 | **0** |
| `tiny-text` | 5 | **4** |
| Every other rule | — | identical count |

The `tiny-text` finding that disappears is the institutional one (11.52 px, `.72rem`); the four
remaining are the 10 px labels of the pixel-scale surfaces, which this change does not touch. No new
finding of any rule appears in any surface.

### Independent verification

A read-only `gentle-ai-verify` round ran against this candidate with its own scripts, its own reads of
both file versions and its own detector runs in a detached base worktree. It confirmed all seven
claimed properties — the seven tokens and their scope, 32 → 32 declarations with zero literals, the
value-by-value mapping and the ≤ 0.80 px displacement, byte identity with a matching SHA-256, the
detector deltas with no new rule, agreement between CSS, `DESIGN.md` frontmatter, prose and sidecar,
and the absence of collateral changes.

It also **refuted two statements in this document**, both now corrected in the change commit:

1. The unchanged count said five values; the correct figure is seven distinct values across 12 of the
   32 declarations. The verifier's arithmetic and an independent recount agree.
2. The purpose list filed the course code under `--fs-micro`; `.course-code` is `.77rem` and lands on
   `--fs-label`, as the mapping table always said. `DESIGN.md` carried the same mistake and was fixed
   with it.

### Limitations

- **No rendered verification.** This machine has no browser and no remote debugging port, so no
  computed-style, layout, wrap or clipping check was performed. The claim that the migration is
  visually inert rests on the arithmetic above, not on looking at it. The 0.80 px ceiling, the byte
  identity and the strict order bound the risk; they do not replace a rendered check.
- **The snapshot verifier is not versioned.** The script that proved byte identity lived in `/tmp` and
  is gone. Its result is reproducible from `git diff 618e32e..HEAD -- institucional-demanda/styles.css`
  plus the token and histogram greps.
- **One reading surface only.** The tokens live in the `:root` of the only reading surface that exists.
  Extract them to `comun/` when a second one appears.
