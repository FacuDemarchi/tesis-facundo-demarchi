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

- [ ] **T2 — Add the explicit global evaluation UI.** Replace per-card evaluation triggers with one global action and a read-only summary showing demand resolved, residual demand, movements, and unused capacity. Reset the result on period changes and expose accessible announcements.

- [ ] **T3 — Project the global plan into subject cards.** Show current/proposed classroom assignments, incorporable students, explanations, and CU-11 residual handoff within each affected card while preserving every subject and period-specific demand metric.

- [ ] **T4 — Reconcile prototype and thesis-facing documentation.** Update the prototype README and decisions (superseding the local-filter scope of D-15/D-16), and add proposed thesis changes to `propuesta-capitulos-6-y-7.md` without editing `documento/tesis.md` before separate approval.

- [ ] **T5 — Verify and close the integrated candidate.** Independently verify objective optimality, room contention, immutability, determinism, accessibility, 320/1440 layout, period isolation, panel regression, documentation consistency, and native review; record commits and evidence.

## Work routing

- Exploration: delegated to `gentle-ai-explore` before task creation.
- Implementation: delegate bounded multi-file writers task by task with explicit edit surfaces.
- Verification: delegate command-running checks to `gentle-ai-verify`.
- Review: use native review only after the normalized candidate is complete.

## Evidence

- T1 implementation: added `comun/optimizacion-aulas-global.js` with explicit-input deterministic enumeration, immutable plan output, validation, and verification hook. It is loaded before `institucional-demanda/app.js`.
- T1 checks passed: `node --check comun/optimizacion-aulas-global.js`, `node --check institucional-demanda/app.js`, and `git diff --check`. A temporary Node VM/assert harness loaded both simulated-data files and the module, confirmed repeated deep equality and unchanged inputs, assigned all 6 expected sections without overlapping-room conflicts, and reduced residual demand from 19 (baseline) to 0.
