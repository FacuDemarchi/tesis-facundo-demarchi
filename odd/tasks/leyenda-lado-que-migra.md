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

## Ancho de la leyenda: 400 → 320 px (pedido del autor, el mismo día)

«Achicame el ancho de la leyenda.» El ancho no era un número elegido: `min(400px, calc(100vw - 32px))`.
Se midieron siete candidatos **antes de elegir**, con el contrafáctico de cobertura ya montado (18 casos
anchos) más la salud del layout:

| Ancho | toca | centros | alto | ítems envueltos | desborde |
| --- | --- | --- | --- | --- | --- |
| 400 | 184 | 92 | 549 | 0 | 0 |
| 380 | 184 | 78 | 549 | 0 | 0 |
| 360 | 176 | 85 | 566 | 1 | 0 |
| 340 | 176 | 82 | 566 | 1 | 0 |
| **320** | **165** | 82 | 566 | 1 | 0 |
| 300 | 159 | 84 | 583 | 2 | 0 |
| 280 | 141 | 84 | 566 | 2 | 0 |

**Elegido 320 px**: 20 % menos de ancho, la cobertura baja de 184 a 165 tarjetas tocadas (92 → 82 centros),
sólo envuelve la etiqueta más larga —«Trazo punteado: cruza por encima de otras columnas», que ya envolvía
a 360—, cero desborde horizontal en los cuatro anchos, y el popover no necesita scroll propio.

Dos cosas que la tabla deja ver y que hay que decir:

- **«Centros» no es monótona con el ancho**: a 380 da 78, mejor que los 82 de 320. No es ruido: el borde del
  overlay cae entre límites de tarjeta distintos y el conteo salta. La métrica que decide es «toca», que sí
  es monótona. Elegir por «centros» habría sido elegir por una discontinuidad.
- **El alto del contenido sube 549 → 566 px** por esa línea envuelta. Abajo de 760 px no cambia nada en
  especie: la hoja fija ya venía recortada a `56vh` y con scroll propio (549 > 504 también antes).

**Verificación después del cambio**: ancho computado **320** en 1600×900, 1440×900 y 1024×768; a 760×900 y
390×844 sigue siendo la hoja de ancho completo (736 y 366 px) sin cambio; detector de Impeccable
**14 anti-patrones + 1 aviso**, idéntico al baseline de `panel-seleccion` (ninguna regla nueva); regresión
del régimen de cursada **736/736** en 16 renders. `styles.css?v=23` → `?v=24`.

**Desvío de ruteo declarado**: esta edición es de un solo valor en tres archivos (el ancho en la hoja, el
`?v=` y el número en `DESIGN.md`), así que se aplicó **inline** en vez de delegarla a un writer; el briefing
habría sido más largo que el cambio. La unidad anterior sí se delegó.
