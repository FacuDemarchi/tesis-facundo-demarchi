# Use-case catalog in the thesis

## Goal

Make the use-case inventory of `documento/tesis.md` explicit and self-contained: add a catalog table with all 14 use cases (identifier, name, actor, related requirements), complete the requirement links so the catalog, the descriptions and the traceability matrix state the same relation, and fix the use-case diagram so every use case is associated with its actor.

## Decisions

- The catalog is **Tabla 6**, placed at the start of §7.2.3, before the six existing descriptions. Columns: `CU | Nombre | Actor | Requerimientos`, one row per use case, in identifier order.
- **Requirement semantics: union.** The catalog lists every CU–RF link that already exists in either place: the `Requerimientos` field of the six descriptions and the traceability matrix. The matrix is therefore completed in the five cells where the descriptions already imply the link, so no artifact contradicts another: RF-12 → CU-01, RF-14 → CU-05, RF-19 → CU-05, RF-18 → CU-06, RF-20 → CU-01.
- Names come from existing sources only: the figure source `documento/figuras/figura-2-casos-de-uso.mmd` for the twelve use cases named there, and §7.2.3 for CU-11 and CU-13, whose diagram nodes are shortened. No name is invented.
- The catalog does not claim implementation status. Which use cases the prototype implements is not asserted anywhere in the thesis and is not decided here.
- Inserting a table before Tabla 6 forces in-document renumbering (tables are numbered by order of appearance, the convention already applied in commit `8b0a33a`): descriptions 6→7, traceability 7→8, test cases 8→9, plus the single in-text reference "La Tabla 7 resume la trazabilidad".
- Figure 2 keeps its abbreviated CU-13 node (approved in the previous feature). The CU-11 node now uses the manuscript name, and the layout was rebuilt so every use case is associated with its actor without breaking the text-size policy (see the figure task).
- Figure 2 layout decision: in `flowchart TB` the ten student associations widened the graph from 1420 to 2154 px, and because the repository checker scales each figure to the manuscript text width, the minimum text size fell from 8,8 to 7,4 pt, below the 8,5 pt minimum. The approved replacement is `flowchart LR` with both actors on the left and the fourteen use cases in one vertical column: it keeps every association at 954 px and 10,1 pt. The group badges and the invisible `~~~` ordering links disappear, so the caption names the two groups instead.
- Google Doc propagation: no new `apply-plan` operation was needed. Every operation must be resolvable against the unmodified document, because in dry-run mode each one is evaluated on the live document before any write; the two renumbering steps that shared a search string were therefore merged into a single operation. The catalog table itself was inserted with the standalone `insert-table` command, which the `apply-plan` extension had left broken (two definitions of `_cell_paragraphs`, the older one shadowed, plus a text index that assumed the old tuple shape). The command was repaired in place and proven end to end in a disposable document.
- TDD is disabled for this feature; checks are structural manuscript checks, figure rendering checks, an independent consistency verification and native review.

## Tasks

- [x] **T1 — Add the use-case catalog and complete the requirement links.** Created Tabla 6 with the fourteen use cases, adjusted the section's introductory sentence, completed six traceability cells and renumbered tables 6→7, 7→8, 8→9 with the in-text reference. Work-unit commit: `08b678e`.

- [x] **T2 — Associate every use case with its actor in Figure 2.** Added the six missing associations, then rebuilt the diagram as described in the layout decision, aligned the CU-11 label, added the caption sentence naming the two groups, and refreshed the figure pipeline record. Work-unit commit: `ea0166a`.

- [x] **T3 — Independently verify the candidate.** Two read-only verifications: the first used the wrong base (`main`, which included the previously approved feature) and its out-of-scope findings were discarded; the second verified the real delta against `d1aadf6`.

- [x] **T4 — Propagate the change to the live Google Doc.** Applied an eleven-operation plan built from the repository file, inserted Tabla 6 with the standalone `insert-table` command after repairing it, and proved equivalence by re-extracting the document text and requiring an empty diff against `documento/tesis.md`.

## Work routing

- Parent (authorized scope): decisions, task tracking, work-unit commits, Doc propagation ownership.
- T1: bounded delegated writer, single file.
- T2: bounded delegated writer, figure source plus rendered PNG.
- T3: independent read-only delegated verifier.
- T4: parent-owned. The target is a single live external document with no git history, so the write stays single-threaded and is verified by re-extraction plus a full-text diff.
- Native review: parent-owned after the committed candidate is complete.

## Evidence

- Pre-work verification: the live Doc was compared with the repository and matched byte for byte before this feature started, so the missing inventory is a manuscript gap and not a failed propagation.
- Requirement-link audit (before): six description blocks and the traceability matrix disagreed on five requirements, summarised in the Decisions section.
- Renumbering audit: the document holds exactly eight numbered tables, in order, with one in-text reference (`documento/tesis.md:443`).
- T1: the writer derived the catalog independently and its table matched the parent's own derivation row by row. `git diff --check` clean; nine table titles in order; each identifier appears exactly once as a catalog row. One asymmetry beyond the five agreed cells was completed under the same union rule: RNF-03 → CU-09, because the CU-09 block already lists RNF-03 while the matrix row was blank.
- T2: the first attempt produced a compliant association set in a non-compliant figure (2154 × 2502 px, 468 × 544 pt, 7,4 pt). The rebuilt figure measures 954 × 2190 px, 282 × 648 pt, 10,1 pt; the checker now reports Figure 3 as the only figure below the minimum, which is its pre-existing debt. The README record was updated in the same commit, including the new design rule that records the TB widening trap and the LR column behaviour.
- T3: catalog rows equal the union of both sources exactly; nine sequential table titles; only the six agreed matrix cells changed inside the delta; every figure node has exactly one actor association; Markdown tables have consistent column counts. Known limitations of this verification: rendered PNG fidelity to the Mermaid source and true glyph-level font size were not verified independently.
- T4: document revisions `ANLCKQnvr6MnTxeoJx…` (before, equal to the repository at that time) → `ANLCKQmC0B2HrKtmZyjt…` (plan applied) → `ANLCKQksV66MRNiFa-Lm…` (catalog table completed). Verification: extracted text equals `documento/tesis.md` byte for byte, 570 lines, empty diff. Backup before writing: `/tmp/doc-catalogo-before.json`; the plan and the table rows were generated from the repository file, not transcribed. Recovery material: the Google Docs revision history.
- T4 limitation: the document keeps table-of-contents page numbers as static text until the author refreshes the TOC in the interface; this change adds a table and paragraphs, so the author should refresh it and, if pagination moved, the manuscript must be re-extracted.
- Follow-ups not done here: `gdocs-api` remains unversioned while it has now been extended twice and repaired once; the CU-06 and CU-11 description blocks still omit requirement links (RF-16 and RF-17) that the catalog and the matrix now state, which the union semantics allows because the blocks are the narrower artifact; and the README's second table still reports Figure 5 as 140 × 646 pt while the checker prints 140 × 648 pt, a pre-existing typo left untouched to keep the diff minimal.
