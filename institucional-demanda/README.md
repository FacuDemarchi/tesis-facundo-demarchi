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

## Scenario

All displayed values are simulated aggregated records. They contain no student data, personal data, or institutional source data. The actor is explicitly provisional until institutional validation assigns responsibilities.

The initial `1B · 2026` scenario includes:

- **C20**, where total demand is 42 and the reference capacity of Aula A-101 is 24; 8 planned records remain due to lack of capacity.
- **C27**, where the published class has no available capacity; 6 planned records remain due to lack of capacity.

Every subject record follows thesis §3.3 exactly:

```text
Total demand = current-period eligible + next-period conditional + planned due to no capacity
```

The data model validates this relation when it loads. A mismatch stops rendering rather than showing a misleading total.

## Behavior

- The period select and previous/next controls deterministically render one of the two fixed simulated periods.
- The summary and every subject card expose the four thesis categories: total, current-period eligible, next-period conditional, and planned due to no capacity.
- Cards with planned demand due to no capacity receive a visible warning border and `Sin satisfacer` status; the causes remain visible in each card.
- Navigation uses native keyboard-operable controls, visible focus treatment, a skip link, and polite live announcements after a period change.
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
