# Institutional demand view (CU-10)

A standalone, read-only mockup for the provisional actor **Operador institucional**. It presents aggregated simulated demand and an explicit, demonstrative CU-13 classroom evaluation; it does not transfer classrooms, change shared data, alter enrollment, assign students, or approve/open anything.

## URL

Serve the repository root and open:

```text
http://localhost:8080/institucional-demanda/
```

For example:

```bash
python3 -m http.server 8080
```

The page loads `../comun/demanda-institucional-simulada.js`, so the web server must use the repository root rather than this directory as its document root.

## Scenario and metric rules

All displayed values are simulated aggregated records. They contain no student data, personal data, or institutional source data. The actor is explicitly provisional until institutional validation assigns responsibilities.

The view separates its metrics by period:

- **Período actual (`1B · 2026`)** shows exactly **Total**, **Alumnos inscriptos**, and **Alumnos inscriptos fuera de cupo**. `Total = alumnos inscriptos + alumnos inscriptos fuera de cupo`. Enrolled students are assigned to simulated sections; students outside capacity are pending section assignment and are not silently allocated. Its aggregate total is `114 = 95 + 19`.
- **Período siguiente (`2A · 2026`)** shows exactly **Total** and **Demanda futura**. `Total = demanda futura`. Future demand represents students who want to take the subject in that following period and are not current enrollments. Its aggregate total is `36 = 36`.

The initial current-period scenario preserves:

- **C20**, with two full sections (`12 + 14`) and 8 students outside capacity pending section assignment.
- **C27**, with one full 19-seat section and 6 students outside capacity pending section assignment.

### Capacity and attribution boundary

`../comun/datos-simulados.js` is the single source of physical classroom capacity. Every current-period CU-10 section uses its `catedraId` and `aulaId` to link to that shared model; its declared `cupo`, the referenced classroom capacity, and the assigned enrolled count must be equal. The demand snapshot repeats the display value only as a simulated read-only snapshot, not as a second capacity authority.

Input outside-capacity demand remains pooled at the subject level, with no actual student-to-section assignment. The simulated output deterministically allocates an incorporable count across sections in `catedra` order for explanation and conservation only; it does not assign identifiable students or mutate enrollment. CU-13 evaluates a global reassignment of the current-period sections and classrooms, but it does not create a proposal or mutate the simulated scenario.

The shared data model validates the metric set, preserved subject count, total rule, and current-period section-snapshot rule when it loads. A mismatch stops rendering rather than showing a misleading total.

## Behavior

- The period label and the previous/next controls deterministically render one of the two fixed simulated periods. The visible label —`1B Mayo-Junio`, `2A Agosto-Septiembre`— comes from the shared academic calendar in `../comun/datos-simulados.js`.
- The demand table shows one row per subject with only the metrics that apply to the selected period; an irrelevant metric is absent as a column rather than rendered as zero.
- Current-period rows carry their simulated section IDs, assigned classroom, and `Cupo` in the detail panel, and identify outside-capacity students as pending section assignment. Following-period rows identify registered future demand without treating it as current enrollment and without a section/classroom/capacity block.
- Selecting a row opens the detail panel — keyboard operable and announced politely — with the subject's sections, causes, and the applicable global plan details. Only the current period with students outside capacity exposes the native `Evaluar distribución` button; its read-only global result is announced politely. Changing periods clears expanded results.
- Navigation uses native keyboard-operable controls, visible focus treatment, accessible help tooltips, a skip link, and polite live announcements after a period change.
- The mockup has a responsive layout for narrow screens.

### Demonstrative CU-13 algorithm

The page loads `../comun/datos-simulados.js` with the institutional demand snapshot. Activating the explicit global `Evaluar resolución` action runs a read-only, exact and deterministic search over **all** current-period sections and classrooms; it is not an independent filter for each card.

The search keeps every section schedule and teacher fixed, assigns every section a type-compatible classroom (`aula` or `laboratorio`) with capacity for its enrolled students, and forbids two sections with overlapping day/time ranges from sharing a classroom. Every compatible classroom is available to the search, including one vacated by another section. Students outside capacity remain pooled by subject: the free seats of the classrooms assigned to that subject absorb that subject's outside-capacity demand. The displayed simulated output deterministically allocates the incorporable count across sections in `catedra` order for explanation and conservation only; it does not assign identifiable students or mutate enrollment.

Valid assignments are compared lexicographically in this order:

1. residual students outside capacity;
2. number of classroom movements from the current `aulaId`;
3. total free seats in proposed rooms before allocating the pooled outside-capacity demand;
4. canonical classroom-ID vector, to break remaining ties reproducibly.

For the fixed baseline scenario, the exact result absorbs **19** students, leaves **0** residual students, makes **3** classroom movements, and has **45** total free seats in proposed rooms before allocating the pooled outside-capacity demand (**26** remain after absorbing the 19 students). The summary is projected into the existing subject cards; card details describe the global plan rather than a separate per-card calculation.

A residual is displayed and handed off only to CU-11 for evaluation of a new section. CU-13 neither creates that proposal nor applies a reassignment. Repeated activation collapses the cached visible result; reopening shows the same plan without recomputation. Neither the demand model nor `window.DATOS_SIMULADOS` is mutated.

Automatic triggering when outside-capacity demand appears is a future evolution. This static exact search is deliberately distinct from a future backend CP-SAT implementation: the prototype uses deterministic enumeration with pruning, while CP-SAT remains an option only if the backend scenario later requires it.

## Out of scope

This view does not provide or imply:

- classroom transfers, shared-data changes, enrollment changes, outside-capacity assignment, or any approval/opening action;
- opening a new section (CU-11);
- approval or rejection of proposals (CU-14);
- authentication, permissions, integrations, or persistence;
- student-level or personal data.

## Files

- `../comun/demanda-institucional-simulada.js`: shared simulated aggregated demand model.
- `index.html`, `styles.css`, and `app.js`: standalone CU-10 interface.
