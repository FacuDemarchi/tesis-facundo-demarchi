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
- [x] **T2 — Manuscript: state how the caps coexist (P-06).** §1 and RF-14 now state the configurable
      range, that the configuration can only be stricter, that the lower of the two rules governs and
      that the blocked attempt names the applicable limit; §3.4 records that the prototype's scenario
      admits three and models no validated institutional limit; the new case `CP-26` covers lowering the
      maximum and `Tabla 8` links it to RF-14. `decisiones.md` moves P-06 to its resolved list and drops
      the cross-reference that pointed at it from P-04.
- [x] **T3 — Manuscript: recommendations inside CU-04 (P-07).** §7.2.3 gained one sentence in prose:
      recommendations belong to CU-04 and enter the set used by the engine only after the student's
      explicit acceptance. It is prose and not a field of the `CU-04` block because that block does not
      exist: `Tabla 7` details CU-01, CU-05, CU-06, CU-09, CU-13 and CU-11 only, while CU-04 lives in the
      catalog and the traceability matrix. The first attempt appended the step to `CU-05`'s flow and was
      reverted: the matrix maps RF-15 to CU-04. `decisiones.md` moves P-07 to its resolved list.
- [x] **T4 — Manuscript: name the coverage tool (P-08).** §4.2 states that test coverage is measured
      with `pytest-cov` (coverage.py) and kept as evidence, and `Tabla 1` gained the row
      `Cobertura de pruebas | pytest-cov (coverage.py) | Medición de la cobertura de las pruebas como
      evidencia de verificación`. `decisiones.md` moves P-08 to its resolved list and updates the stale
      historical mention that had left the gap open.
- [x] **T5 — Verification and native review.** Independent read-only verification of the committed range
      plus the parent's extended interaction pass; native review of the candidate afterwards.

      Verifier verdicts: claims 2, 3, 4, 6, 8, 9, 10, 11 and 12 PASS; claims 1 and 5 PARTIAL; claim 7
      FAIL literally. Claim 7 is a claim-wording artifact and not a defect: RF-14 deliberately says
      `dentro del máximo admitido por el escenario` and §3.4 pins the prototype's three, so the range is
      stated by the manuscript pair and not by the requirement alone. Claims 1 and 5 were closed by the
      parent pass below. The verifier also reported that it reused an existing server on port 8080 whose
      repository root it could not establish; provenance was re-established separately: fresh server on
      port 8099 serving the repository root, all five panel files fetched over HTTP and byte-compared
      against the committed tree, clean worktree, fresh browser profile and a distinct debug port (9233).

      Parent's extended pass (`/tmp/verif-carga/panel-extended.cjs`): the limit control is focusable and
      responds to the keyboard (`ArrowUp` moved 3 to 2, and both counters and the announcement followed);
      per-period drafts stay isolated (cancelling `1B` discards its draft, `2A` starts empty and
      returning to `1B` shows none of `2A`'s); the professor preference accordion offers two radios that
      respond and are announced; with a non-empty draft the primary action opens the results modal for
      `1B · 2026` with its granularity line, and closing it preserves the draft.

      Not verified anywhere: the accordion's `aria-expanded` value (the node is re-rendered, so the stale
      reference is inconclusive), and the enrollment confirmation and following-period plan acceptance,
      which this candidate does not touch.

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
  repository (`/tmp/verif-carga/panel-limit.cjs`, `panel-overflow.cjs`, `panel-limit1.cjs`,
  `panel-extended.cjs`). Always kill by pid file: `pkill -f "http.server"` matches the shell's own
  command line and kills the session.
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

## Follow-ups not done here

- **The manuscript contradicts the revised D-10 about who executes the motor.** The revision of
  2026-09-19 recorded in `decisiones.md` states that the planning period does not run the engine and
  that CP-SAT and the results screen belong to the current period, but the manuscript still describes
  the opposite for the planning period: §1 at `documento/tesis.md:74` (both operations generate
  alternatives), the `CU-06` block at `documento/tesis.md:425` (`2. El sistema ejecuta el motor una
  única vez. 3. El motor devuelve hasta tres alternativas…`), the traceability row `RF-05 → CU-06` at
  `documento/tesis.md:473` and `CP-07` at `documento/tesis.md:532`. The `deuda documental` row
  `RF-05 pasa de CU-06 a CU-05, CU-06` (`decisiones.md:401`) predates that revision and is now stale.
  Which use case owns engine execution is an author decision, so this is recorded and not applied.
- Table-of-contents page numbers: this candidate adds lines to `documento/tesis.md`, so the static TOC
  in the repository and the one in the live Google Doc need a refresh after propagation.
- The propagation itself is blocked: the `gdocs-api` refresh token was revoked or expired on
  2026-09-24 (`invalid_grant`), so the Doc mirror cannot be read or written until `gdocs-api auth` runs
  again.
