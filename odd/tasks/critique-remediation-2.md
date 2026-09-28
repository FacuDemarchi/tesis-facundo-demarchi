# Feature: `critique-remediation-2`

**Estado**: abierta.
**Origen**: segunda corrida de `/impeccable critique` sobre `panel-seleccion/` (2026-09-28T21-09-55Z, **31/40**,
banda «Good»; la primera fue 29/40). Snapshot: `.impeccable/critique/2026-09-28T21-09-55Z__panel-seleccion.md`.
**Autorización**: el autor eligió prioridad («los dos P1 primero»), alcance («los cinco + `DESIGN.md`») y la forma de la
confirmación («franja visible en la barra de período»).
**Rama**: `fix/critique-round-2`, sobre `main` = `7ea9734`.
**No entra**: el ítem P2 del plano angosto queda **bloqueado por decisión del autor** (ver T4); la caja del demostrador
(`#demo-strip`) dentro del modal del estudiante no fue autorizada.

## Objetivo

Cerrar los cinco problemas prioritarios del segundo critique y corregir la deriva de autoridad de `DESIGN.md`, con
verificación renderizada —no con el reporte del que escribe— en cada tarea.

## Decisiones tomadas

1. **La confirmación se hace visible con el canal que ya existe, sin clasificar mensajes.** `announceSelection()`
   alimenta **20 sitios de llamada** (`app.js:343`) y todos salen por `#selection-status`, que hoy es `.sr-only`.
   Promover solo la confirmación exigiría partir ese canal en dos y mantener la clasificación: es exactamente la
   duplicación que ya se pudrió una vez en este repositorio (`narrative.rules` del sidecar). **Un solo mecanismo,
   visible.** La franja es silenciosa a propósito (una línea, sobre la barra oscura, sin caja ni animación) para que los
   anuncios de rutina no griten.
2. **Nada de `text-overflow: ellipsis`** en el arreglo del contador: la información no se tapa, se reordena.
3. **`DESIGN.md` se corrige a mano, no se regenera** en esta feature: `/impeccable document` reescribe el archivo entero
   y merece su propia revisión.

## Tareas

### T1 — La confirmación de la inscripción pasa a ser visible  ·  P1
- **Problema**: el mensaje «Se confirmaron N materia(s)…» vive en `#selection-status`, que es `.sr-only`; no hay ningún
  recibo visible (`anyVisibleConfirmationBanner: []` medido). Es el clímax del recorrido que la tesis quiere demostrar.
- **Archivos**: `panel-seleccion/index.html`, `panel-seleccion/app.js`, `panel-seleccion/styles.css`.
- **Esperado**: la franja es visible en la barra de período, muestra el texto completo del último anuncio, conserva
  `aria-live="polite"`, y no obliga a ningún paso nuevo. No desaparece en pantallas angostas.
- **Evidencia de cierre**: medición renderizada tras confirmar, en 1400×900 y 390×844.

### T2 — El contador de capacidad deja de cortarse  ·  P1
- **Problema**: el contenedor recibe 324 px y su contenido mide 363 (39 px de desborde). Cada `.cap-inline` es más
  angosto que su texto (266 contra 227; 93 contra 79) con `white-space: nowrap`, y el panel tiene `overflow-x: auto`.
- **Archivos**: `panel-seleccion/index.html` (si el marcado necesita una fila más), `panel-seleccion/styles.css`.
- **Esperado**: los dos contadores se leen completos, sin scroll horizontal y sin recorte.
- **Evidencia de cierre**: `scrollWidth <= clientWidth` en el contenedor y en cada `span`, a 1400×900 y 390×844, con 0 y
  con 3 materias marcadas.

### T3 — El control de días declara su polaridad antes del clic  ·  P2
- **Problema**: encabezado visible «Restricción», botones `lunes`…`sábado`; la semántica («Días en los que no puede
  asistir») está en un `aria-label` sobre un `div` sin rol, así que no se expone.
- **Archivos**: `panel-seleccion/index.html`.
- **Esperado**: el encabezado visible dice la polaridad y el contenedor la expone como grupo. El texto del botón y su
  estado no cambian.
- **Evidencia de cierre**: lectura renderizada del encabezado y del rol.

### T4 — El plano en pantallas angostas  ·  P2  ·  BLOQUEADA
- **Problema**: 3520 px de lienzo sin buscador, minimapa ni zoom; a 390 px la barra de período mide 243 px (29 % del
  alto) y las 46 tarjetas no son alcanzables con el teclado hasta abrir la etapa.
- **Bloqueo**: decisión de producto pendiente. El autor contestó «no sé» a si el lienzo angosto es una decisión de
  diseño o un pendiente. Sin esa respuesta no se toca: las tres salidas (dejar el lienzo; convertirlo en lista por
  cuatrimestre; mantenerlo con índice de 10 anclas y barra baja) cambian el producto, no el acabado.
- **Siguiente paso**: proponer las tres con su costo y esperar.

### T5 — El borde dorado sobre el relleno verde  ·  P3
- **Problema**: `panel-seleccion/styles.css:53` combina `background: var(--green-soft)` con `border: 1px solid
  var(--gold)`: viola «La Regla de las Dos Voces» de `DESIGN.md`.
- **Archivos**: `panel-seleccion/styles.css`.
- **Esperado**: el dorado deja de decorar; el lavado verde que agrupa la sección se conserva.
- **Evidencia de cierre**: estilo computado del borde en la página.

### T6 — `DESIGN.md` dice la verdad sobre la tarjeta  ·  deriva de autoridad
- **Problema**: `DESIGN.md` describe «el nombre arriba y la etiqueta de estado abajo a la derecha»; la tarjeta real es
  `display: flex` con la etiqueta **arriba a la derecha** (top 11 px), el nombre en el medio (top 35) y el metadato
  abajo (top 74). La caja de 272 × 118 px y el padding de 11 × 12 px sí coinciden.
- **Archivos**: `DESIGN.md`.
- **Evidencia de cierre**: el texto del documento coincide con `panel-seleccion/styles.css:49` y con la medición.

## Registro de commits

| Tarea | Commit | Verificación |
| --- | --- | --- |
| T1 · confirmación visible | `9a118e0` | Medición renderizada: franja visible tras confirmar, 12px, `--green-soft` sobre la barra oscura a **10,97:1**, 1 línea en 1400×900 y 3 líneas envueltas en 390×844 sin recorte ni scroll horizontal, y `display:none` en reposo (`barHeight` 73 en escritorio y 243 en móvil, sin cambio respecto de antes de la feature). |
| T2 · contador sin corte | `5f2d3bc` | Medición renderizada: contenedor 324/324 en 1400×900 y 322/322 en 390×844, sin recorte en ningún estado, sin scroll horizontal en el panel, los dos contadores en filas de 17 px, y el estado de exceso intacto (`Bimestrales 3/1` en `rgb(185,28,28)` con el tope en 1). El separador `-` ya no está en el DOM. |
| T3 · polaridad de días | — | (pendiente) |
| T4 · plano angosto | — | **bloqueada por decisión del autor** |
| T5 · borde dorado | — | (pendiente) |
| T6 · `DESIGN.md` | — | (pendiente) |

## Efectos medidos que quedan abiertos

- **La barra crece cuando aparece un anuncio**: 73 → 114 px en 1400×900 (una línea) y 243 → 301 px en 390×844 (tres líneas). El salto ocurre una sola vez en escritorio (los mensajes miden una línea) y **oscila en móvil** entre 1 y 3 líneas según el mensaje. Las dos salidas son reservar la línea siempre (barra más alta y estable, sin espacio muerto cuando no hay mensaje) o dejarlo como está (barra más baja, salto de una línea al aparecer el primer anuncio). Es una decisión de presupuesto de la barra y se resuelve junto con **T4**, que es la dueña de ese presupuesto en pantallas angostas.
