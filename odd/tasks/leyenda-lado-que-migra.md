# Leyenda con la regla de lado del panel — que el popover no se quede tapando la columna que se lee

Pedido del autor el 2026-09-30, sobre la rama `feat/correlatividades-legibles`: «haz que la leyenda siga la
regla de desplazamiento del panel de inscripción para que no tape las materias».

Sólo toca `panel-seleccion/` (los tres escenarios no tienen leyenda).

## El diagnóstico, medido antes de tocar

La leyenda es un popover `absolute` anclado al borde **derecho** de la barra (`right:0`), así que se queda
siempre sobre las columnas del extremo derecho del lienzo —las que el lector todavía no leyó—. El panel de
selección tiene desde antes una regla de lado: `preferredPanelSide()` con histéresis (20 % para cruzar a la
izquierda, 15 % para volver), aplicada a `.selection-panel[data-side]`. La leyenda no participaba.

Medido con Chrome for Testing 153 por CDP en 30 combinaciones (5 anchos × 6 posiciones de desplazamiento),
contando las tarjetas cuyo rectángulo se solapa con el del overlay:

| Ancho | Leyenda (antes) | Panel |
| --- | --- | --- |
| 1600×900 | 3 a 9 de 46 | 7 a 8 |
| 1440×900 | 3 a 9 | 6 a 8 |
| 1024×768 | 5 a 17 | 7 a 11 |
| 760×900 | 7 a 18 | 3 a 6 |
| 390×844 | 3 a 14 | 2 a 8 |
| **Total** | **284** | **199** |

Dos hechos que la tabla deja ver y que hay que decir:

- **Ancho es distinto de ancho completo.** A 760 y 390 px la leyenda es una hoja fija de ancho completo
  (`left:12px; right:12px`, regla de `≤760 px`), y por eso tapa más que el panel: el lado no la arregla.
  La regla de lado sólo puede mejorar de 761 px para arriba.
- **Ninguna de las dos capas reserva ancho.** El panel tampoco tapa cero: tapa 2 a 11. Lo que compra la
  regla no es «no tapar» sino **tapar el lado por el que el lector ya pasó** (`DESIGN.md` ya decía «las
  tarjetas pueden quedar detrás de él»). El pedido se implementa como la regla compartida; el número no
  llega a cero y no puede.

## Qué cambia

Un solo estado de lado para los dos overlays. `updatePanelSide()` pasa a `updateOverlaySide()` y escribe
`data-side` en los tres destinos —panel, **leyenda** y lienzo— con la misma `preferredOverlaySide()`. La
leyenda se corre al borde opuesto con el mismo umbral y la misma histéresis que el panel, así que los dos
nunca se contradicen.

En CSS la leyenda sólo necesita el caso izquierdo, y **acotado a `min-width:761px`**: abajo de 761 px la
hoja de ancho completo tiene que seguir ganando, y `.legend-panel[data-side="left"]` (0,2,0) le ganaría a
`.legend-panel` de la media query (0,1,0) por especificidad.

`DESIGN.md` ya documentaba la migración **sólo en el sidecar** (`.impeccable/design.json`, componente
«Panel de selección flotante»: «migra de lado según el desplazamiento del lienzo»); la prosa de `DESIGN.md`
no la nombraba. Se cierra esa deriva con una regla con nombre, en las dos copias.

## Tareas

- [x] **T1 — Un solo estado de lado.** `panel-seleccion/app.js`: `panelSide` → `overlaySide`,
  `preferredPanelSide` → `preferredOverlaySide`, `updatePanelSide()` → `updateOverlaySide()` (definición y
  cuatro llamadas), y la escritura de `data-side` en la leyenda. Los tres elementos de la leyenda suben al
  bloque de lookups: `updateOverlaySide()` corre en la línea 778 y los `const` de la leyenda están en la
  826, así que hoy sería un `ReferenceError` por zona muerta temporal.
- [x] **T2 — La regla de lado en CSS.** `panel-seleccion/styles.css`: `@media(min-width:761px)` con el
  caso izquierdo, y `styles.css?v=22` → `?v=23`.
- [x] **T3 — La autoridad de diseño.** `DESIGN.md` (el párrafo «Las capas flotan, no reservan» nombra la
  leyenda y la regla compartida; regla con nombre nueva) y `.impeccable/design.json` (`narrative.rules` +
  la descripción del panel).
- [x] **T4 — Verificación renderizada.** Las 30 combinaciones de nuevo: el lado de la leyenda tiene que ser
  igual al del panel en todas, la leyenda no puede tapar más que antes en ninguna, y a 760 y 390 px tiene
  que seguir siendo la hoja de ancho completo (el `data-side` no puede tener efecto ahí).

## Verificación

### Lo pedido, cumplido y medido

| Comprobación | Resultado |
| --- | --- |
| El lado de la leyenda es el mismo que el del panel | **30/30** combinaciones (5 anchos × 6 desplazamientos) |
| Abajo de 761 px, la leyenda sigue siendo la hoja de ancho completo | **12/12** casos con los mismos números que antes, `data-side` sin efecto |
| El panel de selección no cambió de conducta | La secuencia de lados es **idéntica** en los 26 casos comparables (sólo se renombró) |
| El régimen de cursada sigue intacto | 16 renders, **736/736** tarjetas; único problema de consola: el 404 preexistente de `/favicon.ico` |

### El hallazgo que cambia la decisión: la regla del panel NO reduce lo que tapa

Se midió el contrafáctico —el mismo overlay forzado a cada lado, en las 18 combinaciones anchas— con dos
métricas: *toca* (el rectángulo de la tarjeta toca el del overlay) y *centro* (el centro de la tarjeta cae
debajo, o sea tapada de verdad).

| Overlay | Métrica | Siempre a la derecha | **La regla del panel** | Mínimo posible por lado |
| --- | --- | --- | --- | --- |
| Leyenda (ahora con la regla) | toca | 150 | **184** | 139 |
| Leyenda | centros | 79 | **92** | 67 |
| Panel (ya tenía la regla) | toca | 115 | **136** | 112 |
| Panel | centros | 54 | **66** | 49 |

O sea: **la regla de lado del panel no es una regla de «no tapar»**. Es una regla de *correrse al lado por
el que el lector ya pasó*, y en este plano el lado izquierdo es el más denso (al final del recorrido, las
columnas 9 y 10 tienen 2 materias cada una contra 9 del lado izquierdo), así que por conteo **tapa más**
que quedarse siempre a la derecha — y el panel ya lo hacía antes de esta unidad.

**Consecuencia honesta**: hacer que la leyenda siga la regla del panel cumple el pedido al pie de la letra
y empeora la métrica del propósito declarado («para que no tape las materias»): la leyenda pasa de 150 a
184 tarjetas tocadas. Es una decisión abierta del autor, no un defecto de implementación.

Las tres salidas posibles, con su número:

1. **Dejarlo como está** (la regla del panel, el pedido literal): leyenda 184, panel 136; los dos nunca se
   contradicen de lado.
2. **Regla nueva para los dos: el lado con menos tarjetas** —leyenda 139, panel 112—. Se puede calcular sin
   leer layout en cada evento de scroll, con el mismo método que ya usa el índice de cuatrimestres
   (`measureTermCenters()` mide una vez por render y por redimensionado). Cambia la conducta del panel,
   que es anterior a esta unidad.
3. **Sólo la leyenda elige el lado con menos tarjetas** (139) y el panel queda como está (136): los dos
   pueden quedar en lados distintos, que es justo lo que el pedido quería evitar.

## Estado

**Decisión del autor: queda como está** (la regla del panel, el pedido literal). Entre las tres salidas con
su número eligió la primera: las dos capas comparten una sola regla de lado y nunca se contradicen, aun
sabiendo que por conteo tapa más que la alternativa. Lo que no se hace, y queda escrito: la regla codiciosa
(139 para la leyenda, 112 para el panel) no se implementa.

## Deriva preexistente, no tocada

`DESIGN.md` tiene **15** reglas con nombre y `.impeccable/design.json` **13**: faltan en el sidecar
`La Regla del Paso Nombrable` y `La Regla del Piso de 12 px`. Es preexistente (14/12 en HEAD) y esta unidad
sumó una a cada copia (15/13), así que no lo empeoró.

## Commit de unidad

**`d3656e6`** — `feat(panel): give the legend the panel's side rule`, sobre `cffb2a0`, en
`feat/correlatividades-legibles`. Sin empujar, sin PR: la publicación es decisión del autor.
