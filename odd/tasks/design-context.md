# Design context: PRODUCT.md, DESIGN.md and the panel-seleccion audit

## Goal

Give this project a durable design authority. Today there is none: no `PRODUCT.md`, no `DESIGN.md`,
and five web surfaces (`mockup/`, `periodo-2A/`, `periodo-2B/`, `panel-seleccion/`,
`institucional-demanda/`) whose visual system lives only in three near-duplicate `styles.css` files
plus `comun/*.js`.

Order is deliberate: `init` captures product truth, `document` records the incumbent visual system,
then `audit` checks the richest Operate surface against it.

## Authorized scope

The author asked for the recommended chain from the Impeccable `context` menu: `init`, then
`document`, then `audit panel-seleccion/`. No surface redesign, no new visual world, no change to
existing copy or behavior.

## Interview answers (recorded 2026-09-27, via the structured question tool)

- **Actors:** "Estudiante ahora, institucional después". The institutional operator (CU-10 demand,
  CU-13 classroom reassignment) stays in the product horizon but subordinated; it earns no durable
  commitments yet, and its views remain demonstrable thesis material.
- **Success bar:** "Prototipo demostrable". The bar is exhibiting the complete journey over simulated
  data without promising anything institutional — not academic traceability as the primary measure,
  not real-world adoption.
- **Data source:** "El plan de estudios oficial sirve". Course names and correlativities may be
  contrasted against a real academic source; the reconstructed-from-SVG dataset in `app.js` is
  therefore validatable rather than permanently fictitious. Offer, capacity, teachers, schedules and
  classrooms stay simulated.

## Constraints carried into the artifacts

- PRODUCT.md and DESIGN.md are written in Spanish: it is the repository's convention for design
  documentation (`decisiones.md`, `discoveries.md`, the scenario READMEs).
- `odd/tasks/*.md` and commit messages stay English, per existing convention in this repository.
- Only confirmed facts and explicitly marked open decisions; nothing invented, no fabricated
  testimonials, benchmarks, integrations or institutional validation.
- No visual recipe in PRODUCT.md; no product strategy in DESIGN.md.

## Steps

- [x] Task 1 — feature document and Engram mirror.
- [ ] Task 2 — `PRODUCT.md` at the repository root (init).
- [ ] Task 3 — `DESIGN.md` plus its sidecar (document).
- [ ] Task 4 — `audit panel-seleccion/` (web/native variant resolution + mechanical detector).
- [ ] Task 5 — close, reporting every finding, skipped check and open item.

## Evidence

- Interview: recorded above with date and exact chosen options.
- Product-truth reconnaissance: `gentle-ai-explore` task `mukcafpo-1-okkn`, quoting
  `documento/tesis.md` §1, §2.1, §3.1, §3.3, §3.4, §4.1, §4.2, §4.4, §5.1, §7.1, §7.2.1;
  `propuesta-capitulos-6-y-7.md` §6.2; `decisiones.md` D-01, D-03, D-04, D-07, D-08, D-09 and the
  document-state table.
- Incumbent visual truth: `mockup/styles.css`, `panel-seleccion/styles.css`,
  `institucional-demanda/styles.css`, `comun/datos-simulados.js`, and each surface's `README.md` /
  `discoveries.md`.

## Known open items (carried, not fixed here)

- §6.1.1, §6.1.3 and §7.2.5 of the manuscript are still empty.
- §4.4.3 institutional AS-IS model waits on institutional interviews; RC-01..RC-12 stay candidates.
- The institutional operator's formal name and authorization level are unvalidated.
- `axe-core` has never been run; the root README admits accessibility is only partially verified.
- The card footer shows `Disponible` regardless of the real course state (`README.md`, next steps
  item 4) — a real defect, out of this task's scope.

## Next step

Resume at the first unchecked step; reconcile this document with `git log` before continuing.
