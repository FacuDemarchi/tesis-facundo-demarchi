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
| `--fs-micro` | `.75rem` | 12.00 | Etiqueta en mayúsculas y piso de la escala: marca, encabezados de sección, chips de estado, código de materia. | `.7`, `.72`, `.73`, `.75` |
| `--fs-label` | `.8rem` | 12.80 | Cromo de control y etiquetas secundarias: etiqueta de período, controles, tooltip, filas de detalle del plan global. | `.77`, `.8`, `.82` |
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

**Maximum snap displacement: 0.80 px** (`.7rem` → `.75rem`). Every other move is ≤ 0.48 px, and five of
the fifteen values do not move at all. No snap changes the monotonic order of the scale, and no
component gains a size inversion between its own elements.

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

_(filled by T4)_
