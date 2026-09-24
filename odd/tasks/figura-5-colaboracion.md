# Figure 5: redraw the collaboration diagram

## Goal

Replace `documento/figuras/figura-5-colaboracion.mmd`, which is not a collaboration diagram but a
vertical chain of eleven text boxes (`flowchart TB`, one node per message sentence). Redraw it as a
real UML communication diagram: lifelines, links, and numbered messages with their direction.

## Why the current figure fails

- It is a chain of sentences, so there is no participant, no link and no direction — a reader cannot
  tell who talks to whom.
- Its aspect ratio makes it unusable: 472 × 2178 px, so it inserts at 140 pt wide by a full 648 pt
  tall. A narrow ribbon down an entire page, next to figures that read as pages.
- One message (9 · «Explicación · traduce conflictos y exclusiones») has no sender or receiver at all,
  which a collaboration diagram cannot even express.

## Notation, from the sources

- **Frame.** Optional rectangle with the name in a compartment in the upper-left corner; long form
  `interaction`, short form `sd`. Communication diagrams are the free-form counterpart of sequence
  diagrams: no time axis, so order lives in the numbers. (uml-diagrams.org, «UML communication
  diagrams overview»; IBM, «Communication diagrams», RSAS 7.5)
- **Lifeline.** A rectangle with no tail, holding `name [selector] : class-name`; the usual anonymous
  form is `:ClassName`. The whole identification is underlined. (uml-diagrams.org)
- **Link.** One line between two lifelines. **Multiple messages, in both directions, travel along the
  same single link** — there is not one line per message (Larman, *Applying UML and Patterns*, ch. 15.5
  «Basic Communication Diagram Notation», InformIT).
- **Message.** A line with the sequence expression and a small arrow above it, showing direction:
  `sequence: message-name`, with dot-separated nesting (`2`, `2.1`, `2.3b [x>y]`, `*[i=1..n]` for
  iteration, `[guard]` for conditions). (uml-diagrams.org; Larman ch. 15.5)
- **Reading order.** Left to right or top to bottom, always starting from the initiating actor
  (draw.io, «UML communication diagrams»).
- **No native support anywhere in our toolchain.** Mermaid has no communication diagram type (issue
  mermaid-js/mermaid#2647, still open), and PlantUML neither (plantuml#2707), so the honest
  approximation is a `flowchart` with lifeline-shaped nodes and numbered message labels. Underlined
  lifeline identifiers were verified to survive `mmdc` 11.17.0 with our `mermaid-config.json`.

## Decisions

- **Flat numbering 1 to 11.** Larman's guideline is not to number the starting message and to nest the
  rest, and that is the more standard reading; the manuscript narrates a flat sequence and never
  asserts nesting, so inventing it would add information the text does not carry. Kept as the current
  figure has it, and reported as an option for the author.
- **One node per participant, nine participants:** `:Estudiante`, `:Interfaz de selección`, `:API`,
  `:Dominio académico`, `:Planificación de escenarios`, `:Adaptador CP-SAT`, `:Solver CP-SAT`,
  `:Explicación de conflictos`, `:Persistencia`.
- **Message 9 gains its missing endpoints.** The old figure gave none. The translation of conflicts and
  exclusions is attributed to `:Planificación de escenarios` asking `:Explicación de conflictos`, both
  backend modules in Figure 1. Flagged to the author, not presented as a fact of the text.
- **Message wording stays as the manuscript has it**, trimmed to fit the labels.
- **No frame.** Figures 1 to 4 have no frame and the caption already names the collaboration; a frame
  would repeat it. Revisit if the author wants the classic look.

## Geometry budget (from `documento/figuras/verificar-tamanos.py`)

The insertion area is 468 × 648 pt and the verifier computes, with the 17 px font at scale 2:

    ancho_insercion = min(468, 648 x ancho / alto)
    texto_pt        = 34 x ancho_insercion / ancho_px        # minimo 8,5 pt

So the rendered width in pixels is the binding constraint, not the file size: a wider diagram inserts
at a fixed 468 pt and its text shrinks. To read comfortably we want `ancho_px` under ~1700 and an
aspect ratio of at least ~1.4, which lands the figure around 16,5 cm wide by 10-12 cm tall at 9-11 pt.
The old figure's 472 px width is what turned it into a ribbon with a full-page height.

## Tasks

- [ ] **T1 — Redraw the source** `figura-5-colaboracion.mmd` and render the PNG.
- [ ] **T2 — Verify** with `verificar-tamanos.py` (>= 8,5 pt) and by looking at the rendered PNG.
- [ ] **T3 — Propagate to the live Doc** once the author approves the look: replace the inline image in
      §7.2.4 keeping its position and the caption below it, then verify the mirror.

## Out of scope

- Figures 1 to 4, which are not part of this complaint.
- The author's document index.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo en la rama de la funcionalidad. El PNG se
commitea junto a su fuente, como el resto de las figuras.
