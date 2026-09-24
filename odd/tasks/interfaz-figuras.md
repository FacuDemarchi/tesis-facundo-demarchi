# Interface figures: captions and in-text explanation

## Goal

Make §7.2.5 «Interfaz gráfica» explain the four interface screenshots the author placed in the
live Google Doc: one caption per figure, following the manuscript's own convention, and an in-text
reference so each screenshot is cited where its surface is described.

## Decisions

- **Figure numbers continue the series.** Figures 1 to 5 already exist; the four screenshots become
  `Figura 6` to `Figura 9`, in the document order the author gave them: the curriculum graph with its
  entry button, the floating selection panel, the results screen, and the institutional demand view.
- **Captions follow the manuscript convention**, verified against figures 1 to 5: `NORMAL_TEXT`,
  left-aligned, no bold or italic, a nominal phrase closed with a period, followed by the centred
  italic `Nota. Elaboración propia.` that every figure in the document carries.
- **The canonical text lives in `documento/tesis.md`**, which is what the feature branch versions;
  the live Doc receives the same text so the mirror holds. The direction is the established one:
  repo first, then propagation.
- **The four screenshots map 1:1 to the four existing paragraphs of §7.2.5**, so each paragraph can
  cite its own figure without restructuring the section.
- **Own elaboration.** The screenshots are of the project's own navigable mockup with simulated data,
  so the note is `Nota. Elaboración propia.` and not a third-party source.
- **The citations are added in the author's voice, not invented as facts:** the opening paragraph
  enumerates what the four figures document, and each following paragraph cites its figure at the
  sentence that describes the surface shown.

## Out of scope

- Moving or reordering the screenshots. The author laid them out by hand; the current order already
  matches the prose.
- The document index, which is the author's manual task.
- Adding in-text citations to figures 1 to 5. The manuscript has never cited a figure from the prose;
  changing that convention is a separate editorial decision.
- The `Nota. Elaboración propia.` lines could be dropped for screenshots if the author prefers; the
  convention is kept for consistency.

## Tasks

- [ ] **T1 — Write the captions and the in-text references** in `documento/tesis.md`.
- [ ] **T2 — Propagate the same text to the live Doc** and verify the mirror: four caption-plus-note
      pairs below their images, four prose citations, and an empty text diff against the manuscript.

## Work routing

- Parent (authorized scope): the prose, the task tracking, the work-unit commit, the propagation.
- T1: parent, small and mechanical once the wording is fixed.
- T2: parent, one-off script over the Docs API; the checked-in `gdocs-api` op set cannot target an
  empty image paragraph, so this reuses its module functions instead of extending the unversioned
  script a fifth time.

## Evidence

- The four images sit at paragraph indices 75767-75775 of the live Doc (revision `ANLCKQlB26-…`), each
  paragraph holding only the inline object plus its newline, so the caption insertion index is
  `startIndex + 1` for every one of them.
- Sizes and fit, measured: 16.4 × 8.2, 16.5 × 14.7, 16.1 × 10.7 and 16.5 × 8.5 cm against a 16.51 cm
  text column, all inside the 22.86 cm usable height.
- Image content verified by fetching each public `contentUri`: «Plan académico» graph with the
  «Iniciar la inscripción» button, the floating selection panel, «Alternativas de cursado», and
  «Consulta de demanda institucional» with its evaluation action.
- Style of the existing captions and notes read from the Doc JSON: caption `NORMAL_TEXT` left-aligned
  plain; note `NORMAL_TEXT`, italic, centred.
- **Finding while verifying the institutional screenshot:** `institucional-demanda/index.html:64`
  renders `Evaluar distribución global`, while `institucional-demanda/README.md:48,54` still declares
  `Evaluar resolución`. Commit `68804da` renamed the label and left the README stating the old one —
  the same class of defect a reviewer opened as CRITICAL in `mockups-interfaces.md` T3. Reported, not
  fixed here.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo en la rama de la funcionalidad, con la
documentación junto al texto. El push y el PR quedan a decisión del usuario.
