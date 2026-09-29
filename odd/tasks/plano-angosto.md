# Plano angosto — el plano de correlatividades en pantallas angostas

Feature que cierra el ítem **T4 del critique #2** (`odd/tasks/critique-remediation-2.md`), que quedó
bloqueado por decisión del autor y que el autor delegó el 2026-09-29 con «procede, toma las decisiones
para este t4».

Rama: `feat/narrow-plan-navigation`, sobre `main` = `7e493b9`.

## Qué entra

1. Un **índice de los diez cuatrimestres** en la barra de período, sólo en pantallas angostas, que salta
   al cuatrimestre y dice en cuál estás.
2. La **barra angosta comprimida a dos bandas**, con el contexto del plan —título y aviso de datos simulados— fuera de la vista.
3. El plano **completo en el alto en todo ancho**: el ajuste al alto se conserva, y la guarda de rueda que
   lo acompaña queda como red de seguridad.
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

**D3 · El plano entra completo en el alto, en todo ancho.** Decisión del autor del 2026-09-29 que
**revierte la primera versión de esta feature**: «no quiero desplazamiento vertical para el grafo, tiene
que mostrarse verticalmente completo. No saques el desplazamiento horizontal por defecto.» El ajuste al
alto se conserva, así que el grafo nunca se desplaza en vertical y la rueda sigue traduciendo a horizontal
como comportamiento de por defecto. La consecuencia se declara: el piso de 11 px se dibuja por debajo de su
valor, y eso es un zoom de vista, no un paso de la rampa. **Lo que la feature sí aporta acá es que el
encogido sea menos severo**: la barra comprimida libera alto de lienzo, y con eso la escala sube de 0,5897
a **0,6976** a 390×844 —texto dibujado **7,08/6,49 → 8,37/7,67 px**— y de 0,7641 a **0,8004** a 760×900,
sin desplazamiento vertical en ningún ancho.

**D4 · La rueda traduce por defecto, con una guarda que la vuelve segura.**
`translateVerticalWheelToHorizontalScroll()` convierte la rueda vertical pura en desplazamiento horizontal,
y eso es seguro **porque el plano entra completo en el alto: nunca hay filas escondidas**. La guarda
(`planOverflowsVertically`) acota la traducción al caso en que el lienzo sí desborde en vertical, para que
el atajo no encierre al lector si algún día el plano deja de entrar. Con D3 esa condición no se cumple
nunca; se probó a propósito con la invariante rota (plano forzado a escala 1): la guarda responde y la
rueda conserva su ruta vertical.

**D5 · La barra angosta, dos bandas.** Navegación de períodos e índice. Medido a 390×844: **243 → 136 px**
(28,79 % → 16,11 %; con mensaje de estado visible 268 → 158,8 px, 18,81 %). A 760×900 queda en 90 contra
126. La franja de confirmación de T1 sigue visible: es una regla con nombre del sistema, no cromo
opcional.

**D5b · La compresión es de layout, no de tamaño de texto.** La primera versión bajaba los botones de la
barra al paso `Body` (12 px, 34 px de alto mínimo) y daba 185 px. **Estaba revirtiendo una decisión del
repositorio:** `3e9dc2a` («buttons that stop shrinking») había sacado justamente el override de 12 px de
las cuatro media queries para que los botones conserven sus 16 px, y `DESIGN.md` documenta 38 px de alto
mínimo. Con los 16 px intactos y sólo layout, el wrap partía las flechas y dejaba «Leyenda» sola. La
salida la indicó el autor: **sacar de la vista la etiqueta «Período actual» del header angosto** —sigue en
el árbol de accesibilidad, así que la región viva del período lo sigue anunciando y el valor `1B · 2026`
queda visible— con lo que las dos flechas y el período entran en un renglón. Resultado: **197 px con los
16 px intactos** y la decisión previa respetada.

**D5c · El contexto del plan también sale de la vista angosta, y eso tensiona una regla del sistema.**
Segunda instrucción del autor el mismo día: «saca lo del plan académico… y la leyenda de datos simulados».
Con el título y el aviso fuera, la barra baja a **136 px a 390×844 (16,11 %)** y a **90 px a 760×900**,
contra los 243/126 de antes de la feature; el `h1`, el aviso y la etiqueta del período siguen en el árbol
de accesibilidad. **La tensión queda declarada, no legitimada:** `DESIGN.md` pide en su «Do» declarar en
texto visible que los datos son simulados y que el prototipo no es el sistema oficial, y el componente
«Aviso de datos simulados» decía por escrito «no desaparece en pantallas angostas». En reposo, la pantalla
angosta ya no lo declara; la declaración visible sobrevive en la barra de escritorio y en el modal de
resultados. La hoja queda anotada con el pendiente: relajar el «Do», o recuperar una línea en el teléfono
—17 px de alto a 12 px de tamaño—.

**D6 · Cerrada por la decisión de D3.** El encogido en escritorio y en ventanas bajas queda como está: es
el mecanismo que garantiza el plano completo en el alto. Medido:

| Pantalla | Escala | Título dibujado (autor 12) | Metadato dibujado (autor 11) |
| --- | --- | --- | --- |
| 1920×1080 | 0,984 | 11,81 px | 10,82 px |
| 1440×900 | 0,802 | 9,63 px | 8,83 px |
| 1366×768 | 0,669 | 8,03 px | 7,36 px |
| 1024×768 | 0,652 | 7,83 px | 7,17 px |

Queda escrito en `DESIGN.md` como zoom de vista, y la tensión con el piso de 11 px queda declarada en vez de
silenciada.

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
- **Esperado**: a 390×844 la barra baja de 243 px a ~136 px sin perder la franja de confirmación y con
  los botones en sus 16 px; a 760×900 baja a ~90 px; a 1400×900 queda igual (73 px).
- **Evidencia de cierre**: alturas de la barra y de cada banda medidas en 390, 760 y 1400, en reposo y con
  mensaje de estado.

### T3 — El plano completo en el alto y la guarda de la rueda  ·  D3, D4
- **Archivos**: `panel-seleccion/app.js`.
- **Esperado**: el plano entra completo en el alto en todo ancho (cero desplazamiento vertical del grafo) y
  la rueda vertical traduce a horizontal por defecto; la guarda conserva la ruta nativa si el plano dejara
  de entrar.
- **Evidencia de cierre**: escala y texto dibujado en 390, 760 y 1400; desplazamiento vertical del lienzo en
  cero en los tres; rueda medida con el ajuste al alto (traduce, 0 → 120 px) y con la invariante rota a
  propósito (no traduce, conserva la ruta vertical).

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
| Barra de período | **243 → 136 px** (16,11 %) | 126 → 90 px (10 %) | **73 px, sin cambio** |
| Bandas de la barra | navegación 86 + índice 28 (contexto fuera de la vista, 1 px) | 40 + 28 (contexto fuera) | 55 + 45 (sin índice) |
| Escala del plano | **0,5897 → 0,6976** | **0,7641 → 0,8004** | 0,8024, sin cambio |
| Título de tarjeta dibujado (autor 12 px) | **7,08 → 8,37 px** | **9,17 → 9,60 px** | 9,63 px (D6) |
| Metadato dibujado (autor 11 px) | **6,49 → 7,67 px** | **8,41 → 8,80 px** | 8,83 px (D6) |
| Desplazamiento del lienzo (X / Y) | 2082 / **0** | 2074 / **0** | 1441 / **0**, sin cambio |
| Índice | visible, 10 botones, **una fila**, sin desborde | igual | **`display:none`**, 0 paradas nuevas |
| Salto al cuatrimestre 7 | borde izquierdo a **0 px**, columna entera visible, foco en `term-7` (`h2`, `tabindex="-1"`, «Cuatrimestre 7»), `aria-current` = 7 | igual | no aplica |
| `aria-current` en los extremos | 1 al inicio, 9 al final | 1 / 9 | no aplica (índice ausente) |
| Orden de foco | 3 paradas + 10 del índice | igual | 3 paradas, sin índice |
| Rueda vertical sobre el plano | maxY 0 → **`preventDefault` `true`**, 0 → 120 px (el atajo por defecto, intacto) | igual | igual |
| Diálogo de resultados abierto | barra `inert`, índice dentro del subárbol inerte, **0 botones alcanzables** | — | — |
| Consola del navegador | **sin excepciones ni errores** | — | **sin excepciones ni errores** |
| Detector del proyecto | **`[]` (0 hallazgos)** | — | — |

**Guarda de la rueda, probada en los dos estados** (el ajuste al alto garantiza el plano completo, así que
la guarda es una red de seguridad: se rompió la invariante a propósito para verla responder).

| Estado | ¿Desborda en vertical? | `preventDefault` | ¿Movió el lienzo en horizontal? |
| --- | --- | --- | --- |
| Ajuste al alto (lo que se entrega), 390 y 1400 | no | `true` | sí, 0 → 120 px |
| Plano forzado a escala 1, 390 y 1400 | sí | `false` | no: conserva su ruta vertical |

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
- **El aviso de datos simulados fuera de la vista angosta** (D5c): `DESIGN.md` lo pide visible y el
  componente decía «no desaparece en pantallas angostas». La hoja quedó anotada con ese pendiente y el
  aviso sigue visible en la barra de escritorio y en el modal de resultados. **Decisión abierta del autor.**
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
| T2 · barra angosta en tres bandas | `3209b61` | 243 → 197 px a 390×844 (23,34 %) y 268 → 219,8 con mensaje; 126 → 134 a 760×900; 73 px sin cambio a 1400×900. |
| T2b · el contexto fuera de la vista angosta | `922dc79` | 197 → **136 px** a 390×844 (16,11 %) y 134 → **90 px** a 760×900, con el `h1`, el aviso y la etiqueta del período todavía en el árbol de accesibilidad. |
| T3 · plano completo en el alto y guarda de rueda | `3209b61`, revertido en `ad5eb4c` | La primera versión dibujaba el plano a escala 1 abajo de 760 px y abría 300 px de desplazamiento vertical: **revertida por decisión del autor**. Estado final (`ad5eb4c`): escala 0,5897 → **0,6976** a 390 y 0,7641 → **0,8004** a 760, **cero desplazamiento vertical** en los tres anchos, texto dibujado 7,08/6,49 → **8,37/7,67 px**; rueda `preventDefault` `true` y 0 → 120 px en todo ancho, y la guarda probada con la invariante rota a propósito. |
| T4 · documentación | `3209b61` | `DESIGN.md` (Layout y Navigation), `README.md` (Alcance y Edición) y las dos entradas del sidecar dicen lo medido; la deriva de 48 vh → 34 vh corregida en las dos copias. |

## Decisiones del autor registradas

- 2026-09-28: ante el bloqueo de T4, «no sé» dos veces. Queda sin tocar.
- 2026-09-29: **«procede, toma las decisiones para este t4»** — el autor delega las decisiones de diseño
  de T4 en el padre. Las decisiones D1-D5 son de esta sesión; **D6 queda explícitamente devuelta al autor**.
- 2026-09-29, durante la implementación: **«sacale el período actual en el header para que no se baje el
  botón de siguiente»** — cierra D5b sin bajar el texto de los botones y sin perder el valor del período.
- 2026-09-29, después: **«saca lo del plan académico… y la leyenda de datos simulados»** — D5c, con la
  tensión contra el «Do» del aviso declarada en la hoja y devuelta como decisión abierta.
- 2026-09-29, al cerrar: **«no quiero desplazamiento vertical para el grafo, tiene que mostrarse
  verticalmente completo. No saques el desplazamiento horizontal por defecto»** — revierte la primera
  versión de D3 y cierra D6: el ajuste al alto se queda en todo ancho, el atajo de la rueda queda como
  comportamiento por defecto, y el zoom de vista queda declarado en `DESIGN.md`.

## Desvío de ruteo, declarado

Igual que en `critique-remediation-2`: no hay ficha nativa `Agent` usable en este runtime y la rol
`gentle-ai-worker` viene fallando en este repositorio (reporta `files_changed: none` con los cambios en
disco). El mapeo del código se delegó a `gentle-ai-explore` (read-only); **la escritura y la verificación
las hace el padre**, con medición propia en el navegador, nunca con el reporte de un writer.
