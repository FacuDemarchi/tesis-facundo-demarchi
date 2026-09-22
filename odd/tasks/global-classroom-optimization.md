# Global classroom optimization

## Goal

Evolve the institutional-demand prototype from independent per-subject classroom checks to one explicit, deterministic, read-only optimization of all current-period sections and classrooms. Preserve schedules and teachers, minimize unmet demand first, classroom moves second, and unused capacity third; hand residual demand to CU-11 without creating or applying a proposal.

## Product decisions

- Scope: every section and classroom in the current period.
- Trigger: one explicit global action; no automatic execution.
- Output: global summary plus per-subject/per-section detail in the existing cards.
- Mutation boundary: simulation only; no room, enrollment, schedule, teacher, proposal, or official-offer mutation.
- Fixed constraints: section schedules and teachers; classroom type compatibility; no overlapping sections may share a classroom.
- Movements: one movement means a section receives a classroom different from its current `aulaId`.
- Objective tuple: unmet students, movement count, total unused capacity across assigned rooms, canonical room-id vector.
- Inventory: every compatible classroom may be reassigned, including a classroom vacated by another section.
- Demand: outside-capacity students remain pooled by subject and are absorbed by the summed free seats of that subject's assigned classrooms.
- Residual: display count and CU-11 handoff only; do not create an opening proposal.
- Algorithm: deterministic exact search with pruning in the static prototype; CP-SAT remains a future backend option.
- TDD: disabled by project configuration; use pure-function assertions, syntax/diff checks, independent Chromium verification, and native review.

## Tasks

- [x] **T1 — Implement the pure global optimizer.** Added a shared browser module that enumerates valid current-period classroom assignments, enforces type and overlap constraints, computes subject-level residual demand, and returns the lexicographically optimal deterministic plan without mutating inputs. Exported `window.CU10_GLOBAL_CLASSROOM_OPTIMIZER` for verification.

- [x] **T2 — Add the explicit global evaluation UI.** Replaced per-card evaluation triggers with one global action and a read-only summary showing demand resolved, residual demand, movements, and unused capacity. Reset the result on period changes and expose accessible announcements.

- [x] **T3 — Project the global plan into subject cards.** Added expanded-only, accessible per-subject plan details with current/proposed classroom assignments, deterministic section allocations, residual CU-11 handoff language, and responsive card styling while preserving every subject and period-specific demand metric.

- [x] **T4 — Reconcile prototype and thesis-facing documentation.** Updated the prototype README and decisions, superseding only the local-filter scope/algorithm of D-15/D-16 through D-21 while preserving explicit read-only evaluation. Added proposed thesis wording to `propuesta-capitulos-6-y-7.md` without editing `documento/tesis.md`.

- [ ] **T5 — Verify and close the integrated candidate.** Independently verify objective optimality, room contention, immutability, determinism, accessibility, 320/1440 layout, period isolation, panel regression, documentation consistency, and native review; record commits and evidence.

## Work routing

- Exploration: delegated to `gentle-ai-explore` before task creation.
- Implementation: delegate bounded multi-file writers task by task with explicit edit surfaces.
- Verification: delegate command-running checks to `gentle-ai-verify`.
- Review: use native review only after the normalized candidate is complete.

## Evidence

- T1 implementation: added `comun/optimizacion-aulas-global.js` with explicit-input deterministic enumeration, immutable plan output, validation, and verification hook. It is loaded before `institucional-demanda/app.js`.
- T1 checks passed: `node --check comun/optimizacion-aulas-global.js`, `node --check institucional-demanda/app.js`, and `git diff --check`. A temporary Node VM/assert harness loaded both simulated-data files and the module, confirmed repeated deep equality and unchanged inputs, assigned all 6 expected sections without overlapping-room conflicts, and reduced residual demand from 19 (baseline) to 0.
- T2 checks passed: `node --check institucional-demanda/app.js`, `node --check comun/optimizacion-aulas-global.js`, and `git diff --check`. A temporary browser-free DOM harness confirmed one optimizer invocation, second-click collapse without recomputation, required read-only summary fields, and period-reset isolation.
- T3 checks passed: `node --check comun/optimizacion-aulas-global.js`, `node --check institucional-demanda/app.js`, and `git diff --check`. A temporary Node VM/assert harness confirmed repeated equal output, unchanged optimizer inputs, frozen output, canonical cátedra-order allocation, per-section capacity-bounded incorporation, and section/subject residual conservation. Source and diff inspection confirmed expanded-only card projection, period-state gating, concise non-card announcements, semantic labels, CU-11 read-only residual language, and the narrow-screen layout rule. No browser verification was claimed.
- T4 checks passed: `git diff --check`; source consistency inspection for D-15/D-16/D-17/D-21, CU-11/CU-13, RF-23–RF-25, CP-23–CP-25, CP-SAT, and the no-application boundary; and exact diff inspection. The feature-facing changes are limited to the three documentation files; this task record contains the completion evidence. `documento/tesis.md` was not edited.
