# Use-case catalog in the thesis

## Goal

Make the use-case inventory of `documento/tesis.md` explicit and self-contained: add a catalog table with all 14 use cases (identifier, name, actor, related requirements), complete the requirement links so the catalog, the descriptions and the traceability matrix state the same relation, and fix the use-case diagram so every use case is associated with its actor.

## Decisions

- The catalog is **Tabla 6**, placed at the start of §7.2.3, before the six existing descriptions. Columns: `CU | Nombre | Actor | Requerimientos`, one row per use case, in identifier order.
- **Requirement semantics: union.** The catalog lists every CU–RF link that already exists in either place: the `Requerimientos` field of the six descriptions and the traceability matrix. The matrix is therefore completed in the five cells where the descriptions already imply the link, so no artifact contradicts another: RF-12 → CU-01, RF-14 → CU-05, RF-19 → CU-05, RF-18 → CU-06, RF-20 → CU-01.
- Names come from existing sources only: the figure source `documento/figuras/figura-2-casos-de-uso.mmd` for the twelve use cases named there, and §7.2.3 for CU-11 and CU-13, whose diagram nodes are shortened. No name is invented.
- The catalog does not claim implementation status. Which use cases the prototype implements is not asserted anywhere in the thesis and is not decided here.
- Inserting a table before Tabla 6 forces in-document renumbering (tables are numbered by order of appearance, the convention already applied in commit `8b0a33a`): descriptions 6→7, traceability 7→8, test cases 8→9, plus the single in-text reference "La Tabla 7 resume la trazabilidad".
- Figure 2 keeps its abbreviated CU-13 node (approved in the previous feature). For CU-11, the diagram label is aligned with the §7.2.3 name only if the rendered figure still meets the 8,5 pt minimum text size; otherwise the short label stays and the difference is reported.
- TDD is disabled for this feature; checks are structural manuscript checks, figure rendering checks, an independent consistency verification and native review.

## Tasks

- [ ] **T1 — Add the use-case catalog and complete the requirement links.** Create Tabla 6 in §7.2.3 with the 14 use cases, adjust the section's introductory sentence, insert the five missing cells in the traceability matrix, and renumber tables 6→7, 7→8, 8→9 together with the in-text reference. Only `documento/tesis.md` is edited.

- [ ] **T2 — Associate every use case with its actor in Figure 2.** Add the missing associations (Estudiante → CU-02, CU-03, CU-04, CU-07, CU-08; institutional actor → CU-11), regenerate only Figure 2 with the documented command, and re-check the render for text size and aspect. Edit surfaces: `documento/figuras/figura-2-casos-de-uso.mmd` and its `.png`.

- [ ] **T3 — Independently verify the candidate.** Read-only verification of the catalog content against both sources, the completed matrix, renumbering completeness, figure associations, text size, and Markdown integrity.

- [ ] **T4 — Propagate the change to the live Google Doc.** Extend `gdocs-api apply-plan` with an anchored table-insertion operation, build the plan, run it in dry-run, apply it, and prove equivalence by extracting the Doc text and requiring an empty diff against `documento/tesis.md`.

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
