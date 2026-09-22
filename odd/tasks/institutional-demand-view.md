# Institutional demand view

**Goal.** Add the first institutional mockup for CU-10 so a provisional institutional operator can inspect aggregated demand before evaluating resolution proposals.

## Closed decisions

- The visible actor is **Operador institucional**, intentionally generic until institutional validation assigns responsibilities.
- CU-10 is read-only and precedes CU-13, CU-11, and CU-14.
- Demand is shown using the four thesis categories: total, current-period eligible, next-period conditional, and planned due to no capacity.
- Every value is explicitly simulated; the interface contains no real student or institutional data.
- Thesis section 7.2.5 remains deferred until all interfaces are complete.

## Tasks

- [x] **T1 — Simulated demand model and CU-10 interface.** Create a shared simulated institutional-demand dataset and a standalone institutional view that lets the operator inspect demand by subject and period, distinguish all four demand categories, see causes, and identify unsatisfied demand without initiating resolution or approval actions. Reuse established visual/accessibility patterns where appropriate and document the mockup contract.

  **Acceptance:** data totals are internally consistent; C20 exercises capacity pressure and C27 exercises no-capacity demand; period filtering is deterministic; simulated-data and provisional-actor disclosures are visible; keyboard navigation and live announcements work; no CU-11/CU-13/CU-14 mutation is presented.

  **Evidence:** `comun/demanda-institucional-simulada.js` and `institucional-demanda/{index.html,styles.css,app.js,README.md}`. The view contains nine balanced records over two periods; summaries are `143 = 95 + 29 + 19` and `105 = 60 + 36 + 9`. C20 renders capacity pressure against A-101 (capacity 24), while C27 renders unavailable capacity and six unsatisfied intentions. Commit: `a47f9fd` (`feat(mockups): add institutional demand view`).

- [x] **T2 — Independent verification and review closure.** Run syntax/static checks and independent browser verification, correct any confirmed acceptance gaps, complete native review when enabled, and record evidence plus the work-unit commit.

  **Evidence:** the first Chromium pass found two concrete gaps: a missing root favicon produced a console 404, and status badges clipped at 320 px. Both were corrected with a self-contained favicon and narrow-layout header wrapping. Independent re-verification passed with HTTP 200, zero page errors, zero console warnings/errors, full badge text at 320 px without viewport overflow, visible 4 px keyboard focus, deterministic mouse/keyboard period filtering (`5 → 4 → 5` cards and `143 → 105 → 143` totals), live announcements, and no CU-11/CU-13/CU-14 mutation controls. `node --check` passes for both JavaScript files and `git diff --check` is clean. Native review `review-4c6bbe99bfda4739` approved the candidate and was acknowledged; informational finding `R3-001` did not open a correction.

- [x] **T3 — Separate current enrollment from future demand.** Preserve all subjects but make metrics period-specific. The current period shows only `Total`, `Alumnos inscriptos`, and `Alumnos inscriptos fuera de cupo`, with total equal to enrolled plus outside capacity. The following period shows only `Total` and `Demanda futura`, with total equal to future demand. Update simulated data semantics, card labels, aggregate summary, help copy, causes, and announcements consistently.

  **Evidence:** current period keeps five subjects and renders exactly `114 = 95 + 19`, with C20 retaining 8 and C27 retaining 6 students outside capacity. Following period keeps four subjects and renders exactly `36 = 36` as future demand. The first browser pass found that author CSS overrode the native `[hidden]` behavior, leaving irrelevant metrics visible and accessible; the correction added a scoped hidden rule. The second pass found a trailing separator and a stale hidden value; both were corrected. Final Chromium verification passed at 1440 and 320 px over repeated mouse/keyboard round trips, with no overflow, duplicate IDs, page errors, or console warnings/errors. Native review `review-7145eeea87ef5d6d` approved and was acknowledged; `R3-001` is informational. Commit: `0112eba` (`feat(mockups): separate current and future demand`).

- [x] **T4 — Evaluate assigned-classroom capacity for CU-13.** After T3 is accepted, map each current-period subject to its assigned section/classroom and assess whether displaying classroom capacity helps the operator identify intervention candidates. Produce a recommendation and unresolved decisions before implementing CU-13 resolution behavior.

  **Evaluation:** do **not** display physical classroom capacity yet. The current simulated offer contradicts the thesis single-source rule: C19 has 18 enrolled against declared `cupo: 6` in a 48-seat room; C27 has `cupo: 0` in a 60-seat laboratory despite 19 enrolled and 6 outside capacity; C20 has two sections and aggregated outside-capacity demand without section attribution. Showing physical capacity now would create misleading intervention signals. CU-10 may later show section count, assigned classroom name, and explicitly simulated declared cupo as context, but capacity comparison, compatible-room filtering, incorporable-student calculation, transfer/opening proposals, and intention transition belong to CU-13.

  **Prerequisites for CU-13:** canonical period IDs; demand attributed by `catedraId` or an explicit unattributed bucket; one defined `cupo` semantic and multi-section rule; reconciliation of `cupo` with classroom capacity; removal/reconciliation of C20's orphan `demanda: 42`; correction of C19/C27 cause text; and simulated classroom availability or a declared derivation over room/time assignments.

- [x] **T5 — Normalize section capacity and display it per section.** Correct the simulated offer so each current-period section's declared `cupo` equals its assigned classroom's physical capacity, enrollment does not exceed that capacity, and subject-level outside-capacity counts remain explicitly unattributed until CU-13 assigns them. Preserve multiple sections and display each section, assigned classroom, and capacity inside the current-period subject card. Keep future-period demand free of current classroom-capacity claims.

  **Evidence:** current 1B sections use distinct simulated classroom assignments with `cupo = capacidad física = alumnos asignados`: C19 18; C20 12+14; C23 18; C27 19; C29 14. C20's orphan `demanda: 42` was removed. The CU-10 card lists every section, classroom and cupo; C20 lists two sections. The 19 students outside capacity remain at subject level and explicitly pending section assignment. Commit: `f328602` (`feat(mockups): show normalized section capacity`).

- [x] **T6 — Verify the capacity bridge and define CU-13 entry.** Independently verify consistency across shared offer data, institutional demand data, the student-facing selection mockup, and the CU-10 browser UI. Complete native review, record commits, then define the first CU-13 product decision from the normalized model without implementing resolution actions yet.

  **Evidence:** independent source/runtime verification joined all six current snapshots by section, classroom, subject and canonical period; confirmed exact vectors C19 `[23,18,5;18]`, C20 `[34,26,8;12+14]`, C23 `[18,18,0;18]`, C27 `[25,19,6;19]`, C29 `[14,14,0;14]`; and preserved future demand `[7,15,9,5] = 36`. Chromium passed CU-10 at 1440/320 and a focused `panel-seleccion/` regression with 46 courses in both periods, working navigation, selection, and professor offers. Native review `review-c3dcc5098acb9b25` approved and was acknowledged; `R3-capacity-bridge` is informational.

  **CU-13 entry decision:** the normalized model can now evaluate resolution, but the first product decision is whether evaluation runs automatically when outside-capacity demand appears (current D-15) and presents its result, or whether the operator explicitly starts evaluation from the subject card. No CU-13 action is implemented until that choice is confirmed.

## Work routing

- Implementation: delegated bounded writer because the unit spans multiple non-trivial files.
- Verification: independent `gentle-ai-verify` browser pass.
- TDD: disabled by current project configuration; use focused static checks plus Chromium behavior verification.

## Out of scope

- Classroom evaluation and transfer proposals (CU-13).
- Opening a new section (CU-11).
- Approving or rejecting proposals (CU-14).
- Productive authentication, permissions, or institutional integrations.
- Writing thesis section 7.2.5.
