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

- [x] **T2 — Regenerate the affected use-case figure.** Renamed CU-11 and shortened the Figure 2 CU-13 node to its identifier, with the CU-13 clarification placed immediately below Figure 2 in the manuscript. Rendered only Figure 2 with `mmdc -i figura-2-casos-de-uso.mmd -o figura-2-casos-de-uso.png -w 1600 -b white -p puppeteer-config.json -c mermaid-config.json --scale 2`; `python3 verificar-tamanos.py` reports 1420 × 2502 px, 368 × 648 pt, and 8,8 pt for Figure 2. The checker flags only the documented Figure 3 8,3 pt debt; `git diff --check` passed and no other figure source or PNG changed.

- [x] **T4 — Propagate the approved alignment to the live Google Doc.** The repository copy and the Google Doc diverged: the Doc still held the pre-alignment text, so the author could not see any change. Applied the same approved content to document `17_nx4EL6yTPMK1bVl5iuHcGsOD_JO3zfP52L-ADPNSQ` through the GA Docs API (`gdocs-api`, not the Developer Preview-gated MCP server). Equivalence proven by extracting the Doc text and requiring an empty diff against `documento/tesis.md`. Work-unit commit: `docs(tasks)` closure commit on this branch.

- [x] **T3 — Verify and close the thesis candidate.** Verified manuscript terminology, requirement/use-case/test traceability, numerical evidence, no-timetabling/read-only boundaries, figure references/assets, Markdown integrity, unchanged unrelated figures, and native review. Work-unit commits: `d3db2d8`, `e3ec149`.

## Work routing

- Exploration: delegated before task creation.
- Manuscript writer and figure writer: bounded delegated tasks with narrow surfaces.
- Verification: independent delegated checks.
- Native review: parent-owned after the committed candidate is complete.
- Google Doc propagation (T4): parent-owned. The target is a single live external document with no git history, so the write stays single-threaded and is verified by re-extraction plus a full-text diff.

## Evidence

- T1: `git diff --check` passed; targeted consistency checks confirmed RF-23–RF-25, CU-11/CU-13, CP-23–CP-25, the base metrics, CP-SAT scope, fixed schedules/teachers, and the absence of CP-20/CP-21 references. No figure files changed.
- Limitation: no table-of-contents page numbers were changed because the repository provides no deterministic pagination source.
- T2 independent verification confirmed the regenerated Figure 2 at 1420 × 2502 px, 368 × 648 pt and 8,8 pt; only the unchanged Figure 3 remains below the 8,5 pt policy threshold. The CU-13 node is intentionally concise and its full meaning is stated immediately below Figure 2.
- T3 independent verification passed for §§3.3/3.4/6.1, RF-23–RF-25, CU-11/CU-13, CP-23–CP-25, metrics `19/19/0/3/45/26`, CP-SAT scope, fixed schedules/teachers, read-only boundaries, figure assets and unchanged unrelated figures. Changed text budget before this closure was 116 lines plus the Figure 2 binary. Known limitations: pre-existing Figure 3 text-size debt, no deterministic pagination/TOC verification, and no independent runtime reproduction of the already verified optimizer metrics.
- Native review `review-d0bf2a785c7e2a71` approved and was acknowledged. Informational finding `R3-001` at `documento/tesis.md:416` did not open a correction.
- T4: the Doc baseline was proven equal to `git show d3db2d8^:documento/tesis.md` (pre-alignment text), so the whole difference was the 8 approved hunks. `gdocs-api` gained an `apply-plan` command (anchored, index-free operations: `replace`, `insert-paragraph-after`, `set-cell`, `delete-table-rows`, `append-table-rows`) because inserting and deleting rows inside existing tables was not previously possible. The 30-operation plan resolved uniquely in dry-run (every anchor matched exactly once) and then applied; the Doc moved from revision `ANLCKQkTf9vqxCP1O-...` to `ANLCKQnvr6MnTxeoJx...`. Verification: extracted text equals `documento/tesis.md` byte for byte (551 lines, 85 390 characters), tables stay 8 with row counts 33→49 and 29→30, inline figures stay 6, lists stay 10, the table of contents stays intact, new table rows inherit the neighbouring bold/italic cell styles, inserted paragraphs are `NORMAL_TEXT` without bullets, and the replaced §3.3/§3.4 items keep their bullets. Recovery material: `/tmp/tesis-doc-before.json` plus the Google Docs revision history.
- T4 limitation: Google Docs keeps table-of-contents page numbers as static text until the TOC is refreshed in the UI. This change adds paragraphs, so the author should refresh the TOC and, if pagination moved, re-extract `documento/tesis.md`.
