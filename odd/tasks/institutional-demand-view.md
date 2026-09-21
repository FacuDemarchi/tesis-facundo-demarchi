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
