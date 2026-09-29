# Plano angosto — el plano de correlatividades en pantallas angostas

Feature que cierra el ítem **T4 del critique #2** (`odd/tasks/critique-remediation-2.md`), que quedó
bloqueado por decisión del autor y que el autor delegó el 2026-09-29 con «procede, toma las decisiones
para este t4».

Rama: `feat/narrow-plan-navigation`, sobre `main` = `7e493b9`.

## Qué entra

1. Un **índice de los diez cuatrimestres** en la barra de período, sólo en pantallas angostas, que salta
   al cuatrimestre y dice en cuál estás.
2. La **barra angosta comprimida** a tres bandas.
3. El plano **a su escala de autor** en pantallas angostas (deja de encogerse), con la guarda de rueda
   que eso exige.
4. La documentación que diga la verdad sobre las tres cosas: `DESIGN.md` y `panel-seleccion/README.md`.

## No entra

- **Convertir el plano en lista por cuatrimestre**: reescribe el producto y contradice el norte de
  `DESIGN.md` («El plano de correlatividades»; «El plano no se ajusta al ancho: se recorre»).
- **Buscador, minimapa o zoom propio**: el critique pidió expresamente «un índice de 10 anclas antes que
  un buscador completo». Queda como trabajo posterior si el índice no alcanza.
- **La alternativa semántica al mapa** (`discoveries.md:103-104`, `RC-UX-17`): sigue faltando, es otra
  decisión y otro trabajo.
- **El encogido del plano en escritorio y en ventanas bajas**: medido y reportado abajo, no tocado.

## Objetivo

Que en un teléfono el plano se pueda **leer** y se pueda **recorrer**. Hoy no se puede ninguna de las dos
cosas, y lo segundo es consecuencia de lo primero.

## El hallazgo que cambió el diagnóstico

El critique #2 describió el problema como «3520 px de plano sin buscador, minimapa ni zoom; a 390 px la
barra se come 243 px (29 % del alto)». La medición del render agrega un mecanismo que nadie había medido:

`fitGraphToViewport()` (`panel-seleccion/app.js:381-393`) **escala el plano para que entre en el alto del
lienzo**: `scale = min(1, (canvas.clientHeight - paddingVertical) / region.offsetHeight)`. El plano mide
992 px de alto y el lienzo del teléfono 601 px, así que el plano se dibuja al **58,97 %**. La consecuencia
nadie la había medido: **el texto se dibuja por debajo del piso tipográfico del propio sistema.**

| Viewport | Escala | Título de tarjeta (autor 12 px) | Metadato (autor 11 px) | Regla del Piso Redundante |
| --- | --- | --- | --- | --- |
| 390×844 | 0,5897 | **7,08 px** | **6,49 px** | violada |
| 760×900 | 0,7641 | 9,17 px | 8,41 px | violada |
| 1024×768 | 0,6522 | 7,83 px | 7,17 px | violada |
| 1400×900 | 0,8024 | 9,63 px | 8,83 px | violada |

`DESIGN.md:314` dice «**La Regla del Piso Redundante.** Ningún texto funcional del plano baja de 11 px, sin
excepción». El censo del critique contó **tamaños computados** (11 y 12 px, correctos) y por eso no lo vio:
el piso se cumple en los tokens y no en los píxeles. Y `DESIGN.md:347-355` describe el plano como «fijo y
grande», «no se ajusta al ancho: se recorre»: **el encogido por alto no está documentado en ningún lado**,
ni en `DESIGN.md` ni en `panel-seleccion/README.md` ni en `discoveries.md`. Es una deriva silenciosa.

## Decisiones tomadas

**D1 · El plano sigue siendo un plano.** Se conserva el lienzo con desplazamiento horizontal. La salida
«lista agrupada por cuatrimestre» reescribiría el objeto de trabajo de la tesis, y el norte de diseño lo
prohíbe por escrito.

**D2 · Índice de diez anclas, sólo en pantallas angostas.** Es la recomendación que el critique ya había
escrito (`[P2]`, «un salto por cuatrimestre —un índice de 10 anclas— antes que un buscador completo») y es
la salida más barata al recorrido a ciegas: 3146 px de rango horizontal en 390 px de ancho.
- **En la barra**, como última banda: una sola zona de cromo, y el plano queda con el plano y nada más.
- **Marcado estático** de diez botones, igual que la fila de años (`index.html:60-62`) es estática: los
  diez cuatrimestres son un hecho fijo del diseño (`repeat(10,300px)`), no un dato dinámico.
- **Numerados con nombre exacto**: el texto visible es `1`…`10` y el nombre accesible es
  «Cuatrimestre N», la misma palabra que usan las cabeceras de columna (`app.js:196`).
- **Salta y deja el foco**: el botón manda el lienzo a la columna, mueve el foco a la cabecera
  `h2#term-N` de esa columna (foco programático, `tabindex="-1"`) y el recorrido siguiente entra por las
  materias de esa columna, no por las de la primera.
- **Dice dónde estás**: `aria-current="true"` sigue a la columna visible, sincronizado con el
  desplazamiento. Es lo que reemplaza la orientación que daba el plano encogido.
- **Sólo abajo de 760 px, medido**: en escritorio agregar la fila cuesta 34 px de barra y 3,9 % de escala
  del plano (0,8024 → 0,7707), donde el hallazgo no existe, la barra de desplazamiento es visible y el
  plano se lee. Es una decisión reversible: una línea de media query.

**D3 · Abajo de 760 px el plano se dibuja a su escala de autor y el lienzo se recorre en los dos ejes.**
El encogido es lo que hace ilegible el plano en un teléfono, y el piso tipográfico del sistema no es
negociable. Medido en el navegador, con la barra candidata: `scale` 0,5897 → **1**, tarjeta 160×70 px →
**272×118**, título **7,08 → 12 px**, metadato **6,49 → 11 px**. Costo honesto: aparece desplazamiento
vertical de 347 px en 390×844 (antes 0) y el rango horizontal sube de 1702 a 3146 px — eso es exactamente
lo que el índice de D2 resuelve por salto.

**D4 · La rueda conserva su ruta vertical cuando el plano desborda en vertical.** D3 sin esto sería una
trampa: `translateVerticalWheelToHorizontalScroll()` (`app.js:242-258`) convierte la rueda vertical pura
en desplazamiento horizontal, y mientras el plano entraba entero en el alto eso era seguro porque **nunca
había filas escondidas**. Al dibujar el plano a escala 1 sí las hay, así que la regla se acota con el
estado real: la traducción vale **mientras el plano no desborde en vertical**; cuando desborda, la rueda
vertical mantiene su ruta nativa y las filas de abajo siguen alcanzables. Arriba de 760 px el plano sigue
encogido, no desborda y la regla documentada no cambia ni un píxel.

**D5 · La barra angosta, tres bandas.** Contexto (título y aviso de datos simulados), navegación de
períodos, índice. Medido a 390×844: **243 → 197 px** (28,79 % → 23,34 %; con mensaje de estado visible
268 → 219,8 px, 26,04 %). A 760×900 queda en 134 contra 126: la barra crece 8 px y a cambio entra el
índice. El aviso de datos simulados y la franja de confirmación de T1 siguen visibles: son reglas con
nombre del sistema, no cromo opcional.

**D5b · La compresión es de layout, no de tamaño de texto.** La primera versión bajaba los botones de la
barra al paso `Body` (12 px, 34 px de alto mínimo) y daba 185 px. **Estaba revirtiendo una decisión del
repositorio:** `3e9dc2a` («buttons that stop shrinking») había sacado justamente el override de 12 px de
las cuatro media queries para que los botones conserven sus 16 px, y `DESIGN.md` documenta 38 px de alto
mínimo. Con los 16 px intactos y sólo layout, el wrap partía las flechas y dejaba «Leyenda» sola. La
salida la indicó el autor: **sacar de la vista la etiqueta «Período actual» del header angosto** —sigue en
el árbol de accesibilidad, así que la región viva del período lo sigue anunciando y el valor `1B · 2026`
queda visible— con lo que las dos flechas y el período entran en un renglón. Resultado: **197 px con los
16 px intactos** y la decisión previa respetada.

**D6 · Fuera de alcance, medido y reportado.** El mismo encogido deja el plano por debajo del piso en
escritorio y en ventanas bajas (1024×768: 7,83/7,17 px; 1366×768: 0,667 → 8,00/7,34 px). En una defensa
proyectada en 1024×768 o en una notebook de 768 px de alto, el plano se vería así. Arreglarlo en todo
ancho exige **D4 aplicado en todo ancho** (la rueda dejaría de traducir en esas ventanas) y cuesta
desplazamiento vertical: 196 px en 1400×900, 330 px en 1024×768. Es un intercambio que cambia el
comportamiento que el autor ya vio y aprobó en escritorio: **decisión del autor, no de esta feature.**

## Tareas

### T1 — El índice de cuatrimestres  ·  D2
- **Archivos**: `panel-seleccion/index.html`, `panel-seleccion/styles.css`, `panel-seleccion/app.js`.
- **Esperado**: diez botones en una fila a 390 px, con nombre accesible «Cuatrimestre N» y el año
  agrupado de a dos; el clic y el Enter mandan el lienzo a esa columna y el foco queda en su cabecera; el
  `aria-current` sigue a la columna visible; arriba de 760 px el índice no existe (ni foco ni árbol de
  accesibilidad).
- **Evidencia de cierre**: medición renderizada a 390×844 (una fila, sin desborde) y a 1400×900
  (`display:none`, sin paradas de tabulación nuevas); salto medido (borde izquierdo de la columna dentro
  del lienzo) y foco en la cabecera; `aria-current` correcto en los dos extremos del recorrido.

### T2 — La barra angosta en tres bandas  ·  D5, D5b
- **Archivos**: `panel-seleccion/styles.css`.
- **Esperado**: a 390×844 la barra baja de 243 px a ~197 px sin perder el aviso de datos simulados ni la
  franja de confirmación, con los botones en sus 16 px; a 760×900 no crece más que el índice; a 1400×900
  queda igual (73 px).
- **Evidencia de cierre**: alturas de la barra y de cada banda medidas en 390, 760 y 1400, en reposo y con
  mensaje de estado.

### T3 — Escala de autor y guarda de rueda  ·  D3, D4
- **Archivos**: `panel-seleccion/app.js`.
- **Esperado**: a ≤760 px el plano se dibuja a escala 1 y el lienzo se recorre en los dos ejes; arriba de
  760 px el encogido sigue igual; la rueda vertical traduce a horizontal cuando el plano no desborda y
  conserva su ruta vertical cuando desborda.
- **Evidencia de cierre**: escala y tamaño renderizado del texto (título y metadato) en 390, 760 y 1400;
  rueda vertical medida en los dos estados (¿cambió `scrollTop`? ¿cambió `scrollLeft`?).

### T4 — Documentación  ·  D1-D5
- **Archivos**: `DESIGN.md`, `panel-seleccion/README.md`.
- **Esperado**: `DESIGN.md` describe el modo angosto, el índice y la regla de la rueda; deja de estar
  callado sobre el encogido del alto; `README.md` describe el comportamiento del índice y su alcance.
- **Evidencia de cierre**: lectura contra el código y la medición; sin afirmaciones sin medición detrás.

## Verificación (medición, no reporte)

Chrome for Testing 153 por CDP propio, sobre el árbol final, en tres anchos. A/B de la rueda con página
recién cargada en cada ancho.

| Qué | 390×844 | 760×900 | 1400×900 |
| --- | --- | --- | --- |
| Barra de período | **243 → 197 px** (23,34 %) | 126 → 134 px (14,89 %) | **73 px, sin cambio** |
| Bandas de la barra | contexto 55 + navegación 86 + índice 28 | 38 + 40 + 28 | 55 + 45 (sin índice) |
| Escala del plano | **0,5897 → 1** | 0,7641 → 1 | **0,8024, sin cambio** |
| Título de tarjeta dibujado (autor 12 px) | **7,08 → 12 px** | 9,17 → 12 px | 9,63 px (D6) |
| Metadato dibujado (autor 11 px) | **6,49 → 11 px** | 8,41 → 11 px | 8,83 px (D6) |
| Desplazamiento del lienzo (X / Y) | 3146 / 361 | 2776 / 242 | 1441 / 0, sin cambio |
| Índice | visible, 10 botones, **una fila**, sin desborde | igual | **`display:none`**, 0 paradas nuevas |
| Salto al cuatrimestre 7 | borde izquierdo a **0 px**, columna entera visible, foco en `term-7` (`h2`, `tabindex="-1"`, «Cuatrimestre 7»), `aria-current` = 7 | igual | no aplica |
| `aria-current` en los extremos | 1 al inicio, 10 al final | 1 / 9 (a 760 se ven dos columnas) | no aplica |
| Orden de foco | 3 paradas + 10 del índice | igual | 3 paradas, sin índice |
| Rueda vertical sobre el plano | maxY 349 → **`preventDefault` `false`**, no mueve el lienzo | igual | maxY 0 → **`preventDefault` `true`**, 0 → 120 px, idéntico a la línea base |
| Diálogo de resultados abierto | barra `inert`, índice dentro del subárbol inerte, **0 botones alcanzables** | — | — |
| Consola del navegador | **sin excepciones ni errores** | — | **sin excepciones ni errores** |
| Detector del proyecto | **`[]` (0 hallazgos)** | — | — |

## Hallazgos laterales (medidos; no corregidos fuera de alcance)

- **Deriva de documentación, corregida:** `DESIGN.md` y `.impeccable/design.json` declaraban que el panel
  angosto se limita a **48 vh**; el CSS renderiza **34 vh** y la medición da 286,95 px sobre 844. Se
  corrigieron las dos copias para que digan lo que se dibuja.
- **Hallazgo del detector, introducido y cerrado en esta misma feature:** la primera versión de la barra
  bajaba el aviso de datos simulados a 11 px; el detector lo marcó (`tiny-text`) y además violaba «La Regla
  del Piso de 12 px», que rige las superficies de lectura. Corregido: el aviso se queda en 12 px. El
  detector vuelve a **0 hallazgos**. La lección vale para el resto de la feature: **no se puede invocar el
  piso tipográfico para justificar una decisión y romper la rampa en otra parte.**
- **El encogido del plano en escritorio y ventanas bajas** (D6): sigue midiendo 9,63/8,83 px a 1400×900 y
  7,83/7,17 px a 1024×768. Devuelto al autor con el costo de arreglarlo.
- **El 16 px heredado de los botones de la barra** (D5b): no es un paso de la rampa con rol declarado,
  pero **se conserva** porque es lo que decidió `3e9dc2a` al retirar el override de 12 px. No se toca.
- **`?v=20` en `index.html`:** el cache-busting no se mantiene desde `d9338a2` —los commits posteriores de
  estos mismos archivos no lo bumpearon— así que no se bumpea acá.
- **El catálogo de componentes de `.impeccable/design.json`** no se amplió con el índice: son 8 piezas
  curadas con su propio escenario `ds-*` y no es exhaustivo (no lista la barra de período, el modal ni los
  alternadores de día). Sí se corrigieron las dos afirmaciones que quedaban incompletas o falsas:
  `extensions.breakpoints` y `extensions.motion`.

## Registro de commits

| Tarea | Commit | Verificación |
| --- | --- | --- |
| Doc de seguimiento | `fa7d262` | — |
| T1 · índice de cuatrimestres | `3209b61` | Índice visible a 390 y 760 en una fila sin desborde, 10 botones en el orden de foco, `display:none` y 0 paradas nuevas a 1400; salto con el borde izquierdo de la columna a 0 px, foco en `term-7` y `aria-current` correcto en los extremos. |
| T2 · barra angosta en tres bandas | `3209b61` | 243 → 185 px a 390×844 (21,92 %) y 268 → 207,8 con mensaje; 126 → 128 a 760×900; 73 px sin cambio a 1400×900. |
| T3 · escala de autor y guarda de rueda | `3209b61` | Escala 0,5897 → 1 y texto dibujado 7,08/6,49 → 12/11 px a 390; sin cambio a 1400 (0,8024 y 9,63/8,83 px, D6). Rueda: `preventDefault` `false` y sin movimiento donde hay desborde vertical (349 px), `true` y 0 → 120 px donde no lo hay. |
| T4 · documentación | `3209b61` | `DESIGN.md` (Layout y Navigation), `README.md` (Alcance y Edición) y las dos entradas del sidecar dicen lo medido; la deriva de 48 vh → 34 vh corregida en las dos copias. |

## Decisiones del autor registradas

- 2026-09-28: ante el bloqueo de T4, «no sé» dos veces. Queda sin tocar.
- 2026-09-29: **«procede, toma las decisiones para este t4»** — el autor delega las decisiones de diseño
  de T4 en el padre. Las decisiones D1-D5 son de esta sesión; **D6 queda explícitamente devuelta al autor**.
- 2026-09-29, durante la implementación: **«sacale el período actual en el header para que no se baje el
  botón de siguiente»** — cierra D5b sin bajar el texto de los botones y sin perder el valor del período.

## Desvío de ruteo, declarado

Igual que en `critique-remediation-2`: no hay ficha nativa `Agent` usable en este runtime y la rol
`gentle-ai-worker` viene fallando en este repositorio (reporta `files_changed: none` con los cambios en
disco). El mapeo del código se delegó a `gentle-ai-explore` (read-only); **la escritura y la verificación
las hace el padre**, con medición propia en el navegador, nunca con el reporte de un writer.
