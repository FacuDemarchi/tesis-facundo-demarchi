# The interface section and the pending documentary debt

## Goal

Write §7.2.5 «Interfaz gráfica» — the last empty section of chapter 7 — after settling the
documentary debt that the section cites.

## Decisions

- **T2 is an author decision.** The manuscript describes the planning period as running the engine,
  while the revision of D-10 (2026-09-19) states the opposite: only the current period executes
  CP-SAT, the results screen is its surface with the label `válida para inscripción`, the
  `condicionada` result variant is retired, and accepting a draft in the planning period marks its
  subjects as `Planificada`. Which use case owns engine execution is a product decision, so it is
  asked and not inferred.

## Tasks

- [x] **T1 — Settle the mechanical debt.** `Tabla 5` gained the download candidate as `RC-12`
      (`Descargar la selección simulada del cierre como PDF, con la trazabilidad del escenario.`,
      needed: institutional acceptance of the document as a selection backup), and `mockup/README.md`
      scoped its statement to its own artifact, pointing at `panel-seleccion/` for the selection panel,
      preferences, constraints and engine results (D-18, and the deuda row about `mockup/`).
- [x] **T2 — Align the manuscript with the revised D-10.** Option chosen by the author: `CU-06` moves to the
      inscription period. §1 scopes alternative generation to the current period and states that the
      planning period does not run the engine; §3.3 drops the retired `condicionada` result variant for
      future alternatives; the `CU-05` block gained the alternatives step and `RF-05`; the `CU-06` block
      now targets the inscription period and presents its alternatives as valid for enrolment; the
      catalog row of `CU-05` and the `RF-05` traceability cell credit both use cases; `decisiones.md`
      marks the debt rows resolved.
- [x] **T3 — Write §7.2.5.** Four paragraphs: the floating panel, its entry buttons per period and its
      repositioning rule with the hysteresis and the WCAG 2.2 criterion 2.4.11 case; the panel contents
      (configurable maximum with its counters, the availability constraints, the marked subjects with
      their derived intention and the professor preference); the closing per period, the results screen
      with the granularity indicator and the recovery actions, and the download as a candidate
      requirement `RC-12`; and the institutional branch with the aggregate demand, the explicit global
      reallocation and its projection, and the separate residual evaluation.
- [ ] **T4 — Verification and native review.** Independent read-only verification of the candidate and
      the native review of the committed range.

## Work routing

- Parent (authorized scope): decisions, task tracking, work-unit commits, authorship of the prose
  decisions.
- T1–T3: bounded delegated writer over the manuscript, the mockup README and the decision log.
- T4: independent read-only delegated verification; native review parent-owned.

## Evidence

- §7.2.5 is empty: its heading is at `documento/tesis.md:456` and §7.3 starts on the next line.
- Debt that blocks T3 (`decisiones.md:395`): the `RF-05` matrix row and the missing generation step in
  the `CU-05` flow are entangled with the revised D-10; the download candidate (D-18) and the
  `mockup/README.md` statement are independent of it.
- The contradictions of T2, verified: `documento/tesis.md:74` (both operations generate alternatives),
  the `CU-06` block at `documento/tesis.md:419-425` (the engine runs for the following period), the
  traceability row `RF-05 → CU-06` at `documento/tesis.md:473`, `CP-07` at `documento/tesis.md:532`,
  and §3.3's classification of future alternatives as `condicionadas` at `documento/tesis.md:124`.
  The debt row `RF-05 pasa de CU-06 a CU-05, CU-06` (`decisiones.md:401`) predates the revision.
- The live Google Doc mirror is unreadable (`invalid_grant` since 2026-09-24), so propagation and the
  table-of-contents refresh come after `gdocs-api auth`.
