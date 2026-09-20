# El grafo sin resaltado de correlatividades

**Objetivo.** Retirar de las tres maquetas del grafo, de forma completa, la interacción que al hacer clic en una materia atenuaba el resto para destacar la materia clickeada y sus correlativas directas.

## Pedido del autor

Decisión explícita del 2026-09-19: **no quiere esa funcionalidad**. Alcance confirmado por el autor en la misma conversación:

1. **Las tres páginas del grafo**: `mockup/`, `periodo-2A/` y `periodo-2B/`, porque comparten el mismo código de grafo y dejar el comportamiento en dos copias agrava la duplicación.
2. **Todo el resaltado y el clic**: se retiran el atenuado, el anillo de la tarjeta clickeada y el resaltado de aristas, y las tarjetas dejan de ser clickeables.

**El panel de selección queda fuera de alcance por pedido explícito**: «no me toques el selector». `panel-seleccion/` ya había retirado ese comportamiento en T8 de `resultados-y-preferencias.md`, así que no requiere cambios.

## Precedente que enmarca

T8 ya había retirado «el atenuado y el resaltado de correlatividades al marcar» del panel `panel-seleccion/`. Esta tarea aplica la misma decisión a las tres maquetas donde el comportamiento sobrevive. La correlatividad deja de destacarse al marcar en todo el repositorio.

## Alcance

Por cada una de las tres carpetas:

- `app.js`: se retiran `let selectedId`, la función `selectCourse`, el registro del evento de clic sobre las tarjetas, el cálculo de `related`/`muted` en `drawConnections`, y la región `#selection-status` con su constante `status`, que existía solo para anunciar esa interacción.
- `index.html`: se retira el elemento `<p id="selection-status">`, que queda sin escritor.
- `styles.css`: se retiran `.course.selected`, `.course.muted`, `.edge.related`, `.edge.muted`, el realce `.course:hover` y la `transition` que ya no anima ningún estado.
- `README.md`: se retira el bullet «interacción para resaltar las relaciones directas de una materia».

## Tareas

- [x] **T1 — Retirar la interacción en las tres maquetas del grafo.** Los cuatro archivos de cada carpeta, en una sola unidad de trabajo.

  **Evidencia**: 12 archivos, `15 insertions(+), 90 deletions(-)`. `node --check` pasa en los tres `app.js`. El grep de referencias muertas sobre las tres carpetas (`selectCourse`, `selectedId`, `selection-status`, `aria-pressed`, `.muted`, `.selected`, `classList.toggle`, `course:hover`) no devuelve nada. Cada `app.js` pasa de 177 a 156 líneas y cada `styles.css` de 67 a 65. Los tres `app.js` siguen difiriendo solo en las líneas de datos y de período preexistentes, y los tres `styles.css` quedan idénticos entre sí. Ejecutado por `gentle-ai-worker`. **Revisión nativa aprobada** (linaje `review-6acfaaedd278d74e`, riesgo medio, una lente de confiabilidad, sin hallazgos) y autoridad quemada. La unidad se revisó en un worktree colocado en el commit previo, con el cambio proyectado como árbol de trabajo, porque el proveedor no aísla un commit intermedio por rango cuando ya hay commits posteriores. **Commiteada** en `9e38336` («feat(mockups): remove the correlativity highlight from the graph»); el plan diferido del árbol quedó registrado aparte, en `8fece39`.
- [x] **T2 — Verificar sobre el mockup servido.** Verificación independiente con un Chromium real por DevTools Protocol sobre las tres páginas servidas.

  **Evidencia**: en las tres páginas, el clic sobre C19 deja idénticos la clase, `opacity` (`1`), `transform` (`none`), `box-shadow` y el `outerHTML` completo del documento; las 46 tarjetas son `ARTICLE`, sin `aria-pressed` y sin manejador de clic; cero elementos `.muted`/`.selected` y cero `path.related`/`path.muted`; 26 aristas dibujadas (12 `solid` y 14 `routed`, con grosor y opacidad intactos); 10 columnas, 46 tarjetas y 5 elementos de `.year-row`; sin `#selection-status`; y la navegación de períodos sigue funcionando en las tres páginas (`1B → 2A`, `2A → 2B`, `2B → 1A · 2027`).

  **Hallazgo de la verificación, corregido**: el `README.md` raíz afirmaba que el mockup «permite alternar entre dos períodos y resaltar las relaciones directas de una materia al seleccionarla», y declaraba anuncios `aria-live` entre las medidas de accesibilidad aplicadas. Las dos afirmaciones describían la interacción retirada y quedaron falsas con este cambio. Corregidas en la misma unidad de trabajo; la segunda corrección es necesaria porque la región `aria-live` retirada era la única de esas tres páginas.

  **Cobertura de la verificación**: el barrido de documentación se limitó a las rutas autorizadas (`README.md` raíz, `odd/**`, `decisiones.md`, `panel-seleccion/**`). No hay afirmación de exhaustividad sobre el resto del repositorio.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo. El push y el PR quedan a decisión del usuario. La verificación es sobre las tres páginas servidas, no sobre una impresión visual.

## Fuera de alcance

- `panel-seleccion/`: pedido explícito del autor.
- La capa de fondo del grafo, los años y los cuatrimestres de fondo (`odd/tasks/grafo-como-arbol.md`, diferido por el autor).
- Cambiar el modelo de datos de materias y correlatividades, los ocho estados visuales o las conexiones dibujadas: las 26 aristas siguen dibujándose igual, sin énfasis por selección.
- Cualquier anuncio alternativo por `aria-live`: la región que se retira anunciaba solo la interacción que se elimina.
