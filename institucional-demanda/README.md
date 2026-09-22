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

Outside-capacity counts remain at the subject level. They are deliberately not attributed to a `catedraId` or `aulaId`. CU-13 evaluates each existing section as a possible transfer target but does not assign students, make a transfer proposal, or mutate the simulated scenario.

The shared data model validates the metric set, preserved subject count, total rule, and current-period section-snapshot rule when it loads. A mismatch stops rendering rather than showing a misleading total.

## Behavior

- The period select and previous/next controls deterministically render one of the two fixed simulated periods.
- The summary and every subject card show only the metrics that apply to the selected period; irrelevant metrics are hidden rather than rendered as zero.
- Current-period cards list each simulated section ID, assigned classroom, and `Cupo`, and identify outside-capacity students as pending section assignment. Following-period cards identify registered future demand without treating it as current enrollment or showing a section/classroom/capacity block.
- Only a current-period card with students outside capacity exposes the native `Evaluar resolución` button. It is keyboard-operable; its result expands inside that same card, has an accessible name, and is announced politely. Changing periods clears expanded results.
- Navigation uses native keyboard-operable controls, visible focus treatment, accessible help tooltips, a skip link, and polite live announcements after a period change.
- The mockup has a responsive layout for narrow screens.

### Demonstrative CU-13 algorithm

The page loads `../comun/datos-simulados.js` with the institutional demand snapshot. Activating `Evaluar resolución` recalculates a read-only result for every existing section of that subject:

1. Required capacity is the section's assigned students plus all subject-level students outside capacity.
2. The evaluation excludes the current classroom and retains only classrooms with the same type (`aula` or `laboratorio`) and enough capacity.
3. A retained room must be free in every section time slot. Availability is calculated from other current-period sections assigned to that room; following-period assignments are ignored, and overlapping day/time ranges make a room unavailable.
4. Each section keeps its least-capacity compatible classroom, resolving capacity ties by classroom ID. The displayed section is the result with the smallest such classroom, resolving ties by section ID.
5. `estudiantes incorporables = min(alumnos fuera de cupo, capacidad del aula compatible - alumnos asignados a la sección)`.

If no compatible classroom exists, the card says so and directs evaluation of a new section to CU-11. It does not create that proposal. Repeated activation recomputes and toggles only the visible result; neither the demand model nor `window.DATOS_SIMULADOS` is mutated.

Automatic triggering when outside-capacity demand appears is a future evolution. The prototype deliberately keeps the explicit operator action so that the deterministic filter and its result can be seen and validated.

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
