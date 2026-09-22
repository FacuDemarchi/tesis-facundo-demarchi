# Apply global classroom optimization to the thesis

## Goal

Apply the approved global-classroom-optimization proposal to `documento/tesis.md`, align CU-11/CU-13 requirements, traceability, tests, metrics and boundaries, and regenerate only the affected use-case figure.

## Decisions

- Edit only the demand-related paragraphs/bullets in §§3.3–3.4, not the complete sections.
- Keep `cátedra` as the primary thesis term; use `sección` only where an equivalence is needed.
- Global reassignment fixes schedules and teachers and is not institutional timetabling.
- CP-SAT remains the engine for student-course alternatives; classroom reassignment uses the implemented deterministic exact search. Clarify only sites whose broad wording would conflate both engines.
- Remove contradictory CP-20/CP-21 demand cases and replace their coverage with CP-23–CP-25; CP-22 remains the approval/rejection case.
- Place technical evaluation metrics in §7.3.1 before the traceability table.
- Add CU-13/CU-11 descriptions to the existing use-case description table/section rather than creating a separate institutional table.
- Regenerate Figure 2 only; other figures remain unchanged.
- Preserve institutional-validation caveats and never claim that a classroom reassignment was applied.
- TDD is disabled; use structural manuscript checks, figure rendering checks, independent consistency verification and native review.

## Tasks

- [x] **T1 — Apply the approved manuscript alignment.** Updated scope, limits, functional/technical proposal, RF-23–RF-25, CU-11/CU-13 descriptions, collaboration prose, traceability, test cases, and evaluation metrics. Scoped CP-SAT wording and preserved citations/notes.

- [ ] **T2 — Regenerate the affected use-case figure.** Rename CU-11/CU-13 consistently in the Mermaid source, render Figure 2 using the repository workflow, and update only its figure-status evidence.

- [ ] **T3 — Verify and close the thesis candidate.** Check manuscript terminology, requirement/use-case/test traceability, numerical evidence, no-timetabling/read-only boundaries, figure references/assets, Markdown integrity, unchanged unrelated figures, and native review; record commits and limitations.

## Work routing

- Exploration: delegated before task creation.
- Manuscript writer and figure writer: bounded delegated tasks with narrow surfaces.
- Verification: independent delegated checks.
- Native review: parent-owned after the committed candidate is complete.

## Evidence

- T1: `git diff --check` passed; targeted consistency checks confirmed RF-23–RF-25, CU-11/CU-13, CP-23–CP-25, the base metrics, CP-SAT scope, fixed schedules/teachers, and the absence of CP-20/CP-21 references. No figure files changed.
- Limitation: no table-of-contents page numbers were changed because the repository provides no deterministic pagination source.
