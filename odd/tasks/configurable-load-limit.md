# Configurable load limit and the three open decisions

## Goal

Close the three open decisions of `decisiones.md` (P-06, P-07, P-08) and, for P-06, implement the
configurable per-bimester maximum in the validated selection mockup, including the cuatrimestre cap
that today announces a limit it cannot evaluate.

## Decisions taken by the author

- **P-06 — implemented in the prototype.** The per-bimester maximum becomes configurable in the
  selection panel (1 to 3, default 3). The configured value is the student's own maximum; when an
  institutionally validated limit exists, the lower of the two applies, so the configuration can only
  be stricter than the scenario, never looser. Exceeding the applicable limit is blocked and the limit
  in force is named. The six-per-cuatrimestre cap must be evaluated only with known bimesters and must
  declare explicitly which part of the cuatrimestre is unknown (candidate `RC-UX-14`).
- **P-07 — no `CU-15`.** Receiving and accepting recommendations stays inside `CU-04`: the
  recommendation enters the set only after the student's explicit acceptance. §7.2.3 gains one
  sentence making that step explicit. No new use case and no Figure 2 regeneration.
- **P-08 — the tool is named.** `pytest-cov` (coverage.py) is added to §4.2 and to `Tabla 1`, so the
  continuous-integration evidence claim in §7.3.1 names its producer instead of asserting an unnamed
  one.

## Tasks

- [x] **T1 — Configurable per-bimester maximum in the selection mockup.** The fixed cap became a
      labelled `#bimester-limit` control (1, 2 or 3; 3 by default) and every consumer uses it: the
      bimester counter, its over-cap flag, the card disabling and the over-cap announcement. The
      cuatrimestre line now reports known consumption against `min(6, 2 × configured)` and names the
      sibling bimester without data. Singular agreement was fixed in the copy (`1 materia`). Panel
      README and the discoveries record were updated, including the residual institutional dependency
      of `RC-UX-14`.

      Known limitation of the mockup: it models only the student's own configuration, so the
      institutional validated limit of the decision is not simulated here.
- [ ] **T2 — Manuscript: state how the caps coexist (P-06).** §3.3 and RF-14 state the 1–3 range, the
      lower-limit-wins rule and the blocked fourth attempt with the applicable limit named; a new test
      case covers lowering the maximum, and the traceability matrix links it.
- [ ] **T3 — Manuscript: recommendations inside CU-04 (P-07).** One sentence in the `CU-04` block of
      §7.2.3 making the acceptance step explicit; `decisiones.md` records the resolution.
- [ ] **T4 — Manuscript: name the coverage tool (P-08).** §4.2 and `Tabla 1` name `pytest-cov`;
      `decisiones.md` records the resolution.
- [ ] **T5 — Verification and native review.** Independent read-only verification of the candidate and
      the native review of the committed range.

## Work routing

- Parent (authorized scope): decisions, task tracking, work-unit commits, the exact wording of the
  resolved decisions, verification runner setup.
- T1: bounded delegated writer, mockup only.
- T2–T4: bounded delegated writer, manuscript and decision log.
- T5: independent read-only delegated verification; native review parent-owned.

## Evidence

- Baseline before T1, measured on the served mockup with the cached headless Chrome:
  `Bimestrales 0/3` and `Cuatrimestrales 0/6`. The cuatrimestre line is the defect: it reuses the
  bimester count and ignores that the sibling bimester of the same cuatrimestre is not modelled by the
  panel, which is exactly candidate `RC-UX-14`.
- Verification runner: `python3 -m http.server 8080` from the repository root, then
  `chrome-headless-shell --headless --disable-gpu --no-sandbox --virtual-time-budget=4000 --dump-dom
  http://127.0.0.1:8080/panel-seleccion/`. Interaction checks use the same cached Chrome with
  `--remote-debugging-port=9222` and CDP over Node's global `WebSocket`; the scripts live outside the
  repository (`/tmp/verif-carga/panel-limit.cjs`, `panel-overflow.cjs`, `panel-limit1.cjs`).
- T1 interaction evidence, observed on the served mockup with a fresh profile (so nothing is cached):
  - `1B · 2026` at rest: `Bimestrales 0/3` and `Cuatrimestrales 0/6 · 1A sin datos`.
  - Selecting 2: `Bimestrales 0/2` and `Cuatrimestrales 0/4 · 1A sin datos`, with the announcement
    `Máximo por bimestre actualizado a 2 materias.`
  - Selecting 1: `Bimestrales 1/1` and `Cuatrimestrales 1/2 · 1A sin datos`; a second subject is
    blocked with `Solo se pueden marcar hasta 1 materia: es el máximo que configuraste.` and the
    draft stays at one.
  - Three subjects marked with the limit at 3: no unmarked selectable card stays enabled, the three
    marked cards remain enabled, and a fourth attempt is blocked with
    `Solo se pueden marcar hasta 3 materias: es el máximo que configuraste.`
  - Lowering the limit below the draft (3 marked, limit 2) shows `Bimestrales 3/2` with
    `data-over-cap="true"`; unmarking one returns to `2/2`.
  - Moving to `2A · 2026` declares the sibling as `2B`: `Cuatrimestrales 0/6 · 2B sin datos`.
  - `node --check panel-seleccion/app.js` passes.
