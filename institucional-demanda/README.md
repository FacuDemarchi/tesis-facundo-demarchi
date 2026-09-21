# Institutional demand view (CU-10)

A standalone, read-only mockup for the provisional actor **Operador institucional**. It presents aggregated simulated demand before any classroom evaluation, transfer, opening, approval, or rejection flow.

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

Outside-capacity counts remain at the subject level. They are deliberately not attributed to a `catedraId` or `aulaId` until a later CU-13 decision assigns a section, transfer, or opening; this view does not make any of those proposals.

The shared data model validates the metric set, preserved subject count, total rule, and current-period section-snapshot rule when it loads. A mismatch stops rendering rather than showing a misleading total.

## Behavior

- The period select and previous/next controls deterministically render one of the two fixed simulated periods.
- The summary and every subject card show only the metrics that apply to the selected period; irrelevant metrics are hidden rather than rendered as zero.
- Current-period cards list each simulated section ID, assigned classroom, and `Cupo`, and identify outside-capacity students as pending section assignment. Following-period cards identify registered future demand without treating it as current enrollment or showing a section/classroom/capacity block.
- Navigation uses native keyboard-operable controls, visible focus treatment, accessible help tooltips, a skip link, and polite live announcements after a period change.
- The mockup has a responsive layout for narrow screens.

## Out of scope

This view only consults demand. It does not provide or imply:

- classroom evaluation or transfer proposals (CU-13);
- opening a new section (CU-11);
- approval or rejection of proposals (CU-14);
- authentication, permissions, integrations, or persistence;
- student-level or personal data.

## Files

- `../comun/demanda-institucional-simulada.js`: shared simulated aggregated demand model.
- `index.html`, `styles.css`, and `app.js`: standalone CU-10 interface.
