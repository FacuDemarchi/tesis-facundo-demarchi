---
name: Planificador académico — Ingeniería en Software
description: Sistema visual del prototipo de planificación académica, alineado a la identidad institucional de la universidad del caso de estudio.
colors:
  institutional-green: "#046353"
  institutional-green-deep: "#00523f"
  institutional-green-soft: "#e5f1ef"
  institutional-ink: "#043a31"
  institutional-deep: "#003e34"
  muted-green: "#006c5b"
  institutional-gold: "#eba310"
  institutional-gold-hover: "#f19f26"
  ink-on-gold: "#1e1e1e"
  published-teal: "#007a5e"
  slate-teal: "#98dbce"
  review-magenta: "#6a2482"
  review-magenta-soft: "#eeeafd"
  warning: "#b54708"
  warning-soft: "#fff0df"
  warning-ink: "#8e3608"
  line: "#cad5e2"
  line-strong: "#6d6e71"
  paper: "#f4f7fb"
  panel: "#ffffff"
  approved: "#15803d"
  approved-soft: "#dcfce7"
  available: "#1d4ed8"
  available-soft: "#dbeafe"
  no-offer: "#92400e"
  no-offer-soft: "#fef3c7"
  no-offer-stripe: "#fde7ac"
  blocked: "#b91c1c"
  blocked-soft: "#fee2e2"
  blocked-stripe: "#fcd5d8"
  enrolled: "#7c3aed"
  enrolled-soft: "#ede9fe"
  no-capacity: "#c2410c"
  no-capacity-soft: "#ffedd5"
  planned: "#0369a1"
  planned-soft: "#e0f2fe"
  category-process: "#046353"
  category-sa: "#be123c"
  category-pp: "#c2410c"
  category-general: "#6d6e71"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "29px"
    fontWeight: 800
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "22px"
    fontWeight: 800
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "15px"
    fontWeight: 800
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    lineHeight: 1.4
  body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    fontWeight: 700
  meta:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.06em"
  title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "13px"
  subhead:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 800
  title-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "16px"
    fontWeight: 800
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    fontWeight: 800
    letterSpacing: "0.04em"
  reading-micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".75rem"
    fontWeight: 800
    letterSpacing: "0.06em"
  reading-label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".8rem"
    fontWeight: 700
  reading-body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".84rem"
  reading-body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: ".9rem"
    lineHeight: 1.45
  reading-title-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 800
  reading-value:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.08rem"
    fontWeight: 800
  reading-display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    letterSpacing: "-0.02em"
rounded:
  badge: "4px"
  badge-lg: "5px"
  control-sm: "6px"
  control: "7px"
  action: "8px"
  surface-sm: "9px"
  card: "10px"
  column: "12px"
  overlay: "14px"
  canvas: "17px"
  pill: "999px"
components:
  course-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.institutional-ink}"
    rounded: "{rounded.card}"
    padding: "11px 12px"
    width: "272px"
    height: "118px"
  course-card-marked:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.institutional-ink}"
    rounded: "{rounded.card}"
  button-commit:
    backgroundColor: "{colors.institutional-green}"
    textColor: "{colors.panel}"
    rounded: "{rounded.action}"
    padding: "10px 13px"
  button-commit-hover:
    backgroundColor: "{colors.institutional-green-deep}"
    textColor: "{colors.panel}"
    rounded: "{rounded.action}"
    padding: "10px 13px"
  button-attention:
    backgroundColor: "{colors.institutional-gold}"
    textColor: "{colors.ink-on-gold}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.institutional-ink}"
    rounded: "{rounded.action}"
    padding: "10px 13px"
  chip-status:
    backgroundColor: "{colors.institutional-green-soft}"
    textColor: "{colors.muted-green}"
    rounded: "{rounded.pill}"
    padding: "5px 8px"
---

# Design System: Planificador académico para Ingeniería en Software

## Overview

**Creative North Star: «El plano de correlatividades»**

Este sistema se comporta como un plano de ingeniería: cada materia tiene un lugar, un estado rotulado y
una razón visible. No hay nada decorativo que no esté declarando algo. El grafo es la pieza central y
ocupa el ancho completo porque el plan de estudios **es** el objeto de trabajo, no un fondo sobre el
que se apilan paneles. Las tarjetas se alinean a una grilla de columnas por cuatrimestre y se conectan
con aristas que muestran la correlatividad, de modo que la estructura académica se lee de un vistazo
antes de leer una sola palabra.

La densidad es deliberada y sobria. La jerarquía se construye con estructura y tipografía —tamaño,
peso y mayúsculas espaciadas—, nunca con decoración. El color no es adorno: **cada estado tiene color,
etiqueta y patrón**, porque el vocabulario de estados es el contenido más importante de la interfaz y
no puede depender de una sola señal. El verde institucional confirma y avanza; el dorado llama la
atención; el resto del espectro pertenece a los estados académicos.

**Anti-referencia explícita: un dashboard SaaS genérico.** Nada de gradientes, ni de métricas grandes
con etiqueta chica, ni de un color de acento repartido por cada bloque. El prototipo tampoco debe
parecer el sistema oficial de la universidad: declara en cada superficie que los datos son simulados y
que no es un sistema oficial.

**Key Characteristics:**
- Grafo horizontal con desplazamiento propio como superficie principal; el panel flota por encima sin reservar espacio.
- Ocho estados de materia, cada uno con color de fondo, color de primer plano, etiqueta y símbolo, y dos de ellos con rayado además.
- Densidad de 8 a 13 px en toda la interfaz: es un plano, no un folleto.
- Fondo neutro frío, superficies blancas y verde institucional profundo solo donde hay jerarquía real.
- Profundidad por capas con alpha sobre la tinta institucional, sin `backdrop-filter` y sin animaciones de entrada.

## Colors

La paleta es institucional y contenida: una familia verde que va del casi negro al verde claro, un
dorado de atención, y el espectro de estados académicos que vive por encima de todo eso.

### Primary
- **Verde institucional** (`#046353`): la voz que confirma y avanza. Relleno de la acción primaria del panel, del botón de acción del resultado, del borde de la tarjeta marcada y de las aristas de correlatividad sólidas. Sobre blanco mide 7.20:1.
- **Verde institucional profundo** (`#00523f`): el estado hover de la acción primaria y el texto sobre fondos verde claro. 9.22:1 sobre blanco.
- **Verde institucional claro** (`#e5f1ef`): el fondo suave del sistema. Columna de cuatrimestre, sección de disponibilidad, panel de opciones del acordeón, chip de estado institucional, filas de cabecera de la grilla semanal.

### Secondary
- **Dorado institucional** (`#eba310`): atención y entrada. Es el relleno del CTA de la barra de período —la acción que abre la etapa— y del anillo de foco. **Nunca es texto**: sobre blanco mide 2.15:1, muy por debajo del mínimo. Como relleno lleva tinta oscura encima (`#1e1e1e`, 7.76:1).
- **Dorado hover** (`#f19f26`): el hover del CTA y el anillo de advertencia de la tarjeta institucional insatisfecha.

### Tertiary
- **Magenta de revisión** (`#6a2482`): el estado «Solicitud en revisión», y el borde izquierdo del aviso de datos simulados en la vista institucional. Sobre blanco mide 9.60:1.
- **Verde publicado** (`#007a5e`): el escalón intermedio de la jerarquía verde en la vista institucional, donde el verde profundo ya está tomado por la tinta y el encabezado.
- **Ámbar de advertencia** (`#b54708`): bordes y anillos de advertencia. Su tinta para texto sobre fondos claros es `#8e3608` (6.77:1 sobre el verde claro), nunca el ámbar mismo.

### Neutral
- **Tinta institucional** (`#043a31`): el color de todo el texto principal y de la barra de período. 12.69:1 sobre blanco, 11.81:1 sobre el fondo de papel. Es un verde tan profundo que se lee como negro con temperatura.
- **Verde apagado** (`#006c5b`): texto secundario, metadatos, etiquetas de grilla. 6.37:1 sobre blanco.
- **Línea** (`#cad5e2`): separadores y bordes decorativos entre filas, celdas y secciones.
- **Línea fuerte** (`#6d6e71`): borde de todo control interactivo —botones de navegación, selectores, alternadores de día, acordeón—. Un control necesita 3:1 contra su fondo y la línea clara solo da 1.49:1, así que la línea suave nunca delimita algo con lo que se interactúa.
- **Verde grisáceo de etiqueta** (`#98dbce`): la etiqueta del plan y de la carrera en la barra oscura, y el borde del actor institucional. Es un valor **sólo para fondos oscuros**: sobre blanco mide 1.57:1 y ahí nunca se usa como texto.
- **Papel** (`#f4f7fb`): el fondo del lienzo donde flota el grafo.
- **Panel** (`#ffffff`): tarjetas, panel flotante y modal.

### Estados académicos (vocabulario de datos, no de marca)
| Estado | Etiqueta | Símbolo | Primer plano | Fondo | Patrón |
| --- | --- | --- | --- | --- | --- |
| approved | Aprobada | ✓ | `#15803d` | `#dcfce7` | sólido |
| available | Disponible | • | `#1d4ed8` | `#dbeafe` | sólido |
| no-offer | Sin cátedra | — | `#92400e` | `#fef3c7` | rayado `#fde7ac` |
| blocked | Bloqueada | × | `#b91c1c` | `#fee2e2` | rayado `#fcd5d8` |
| enrolled | Inscripta | I | `#7c3aed` | `#ede9fe` | sólido |
| no-capacity | Sin cupo | 0 | `#c2410c` | `#ffedd5` | sólido |
| planned | Planificada | P | `#0369a1` | `#e0f2fe` | sólido |
| review | Solicitud en revisión | R | `#6a2482` | `#eeeafd` | sólido |

Los ocho pasan AA en texto chico, incluido el peor caso donde un glifo cruza una franja del rayado.
La etiqueta de estado y el nombre usan la tinta institucional sobre el fondo del estado, no el color
del estado: 10.39:1 a 11.56:1 según el relleno.

### Categorías
El borde izquierdo de 7 px de cada tarjeta codifica el área de conocimiento: Procesos `#046353`,
Sistemas y Algoritmos `#be123c`, Programación `#c2410c`, Generales `#6d6e71`.

### Named Rules
**La Regla de las Dos Voces.** El dorado llama la atención y nunca confirma; el verde confirma y nunca
llama la atención. Un control no puede usar las dos.

**La Regla del Foco que no es Relleno.** El anillo de foco tiene su propio token y jamás reutiliza el
relleno de un botón. Un solo tono no alcanza acá: el dorado da 2.15:1 sobre blanco y 1.86:1 sobre el
verde claro, así que el indicador es de dos tonos (ver Elevation & Depth).

**La Regla del Color Declarado.** Ningún color se usa para decir algo que el texto no diga también. Los
estados llevan etiqueta y símbolo; los avisos son texto real, nunca un tooltip.

## Typography

**Display Font:** Inter (con caída a `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`)
**Body Font:** la misma familia

**Character:** Una sola voz tipográfica, de interfaz y de trabajo. Este es un plano que se lee de cerca:
la personalidad la pone la estructura, no la fuente. Inter es la cara de trabajo del sistema y su
elección es deliberada: es una superficie Operate, y la pila cae a las fuentes del sistema si Inter no
está instalada, sin `@font-face` ni descarga de red.

### Hierarchy
- **Display** (800, 29px, tracking .01em): el título de la superficie en las maquetas de escenario.
- **Headline** (800, 22px): el encabezado del modal de resultados.
- **Title large** (800, 16px): el encabezado de una alternativa dentro del modal.
- **Title** (800, 15px): el período académico en la barra.
- **Subhead** (800, 14px): el nombre del plan y de la carrera, dentro del `h1` de la barra de período.
- **Title small** (400–800, 13px): el encabezado y el texto del resumen de desenlace.
- **Body** (400–700, 12px, alto de línea 1.4): el grueso de la interfaz. Es el tamaño dominante del sistema, con 23 usos.
- **Body small** (700, 11px): alternadores de día y encabezados de la grilla semanal.
- **Label** (700, 11px, tracking .06em, mayúsculas): etiquetas de la barra de período, encabezados de sección del panel, encabezados de columna del plano y columnas de la grilla semanal.
- **Meta** (400, 11px): el renglón de cuatrimestre de la tarjeta de materia.
- **Micro** (800, 11px, mayúsculas): la etiqueta de estado de la tarjeta y el sello «MARCADA». Es el piso del sistema.

**Un solo piso, tres roles.** `Body small`, `Meta`, `Label` y `Micro` convergen en **11 px** y se distinguen por
peso, caja, tracking y color, no por tamaño. Es la consecuencia buscada: el sistema perdió su sótano de 8 px
y la rampa en píxeles pasó de diez valores a siete. Un texto que baja de 11 px no está en la rampa, sin
excepción y sin señal redundante que lo rescate.

**El encabezado de columna es etiqueta, no título.** En el plano, los encabezados de columna (`h2`, 11 px) son
más chicos que el título de la tarjeta que contienen (12 px) y que los encabezados de alternativa del modal
(16 px). No es una inversión por descuido y **es una decisión tomada**: el plano es una superficie densa de
operación, la estructura se dice con etiquetas en mayúsculas —posición, caja, tracking y color—, y lo que el
estudiante lee es el contenido de la tarjeta. Un revisor automático lo marca como jerarquía plana; la decisión
de conservarlo es del autor, y pesa además un costo que los números no muestran: **el plano está fotografiado
en el manuscrito y en el documento vivo**, así que subir esos encabezados invalidaría las capturas de las
figuras 6 y 7 y obligaría a rehacerlas.

**Escala de lectura (`rem`).** La vista institucional es una superficie de lectura, así que su rampa se
mide en `rem` sobre una base de 16 px y tiene siete pasos. Cada paso vive como token en el `:root` de
`institucional-demanda/styles.css`, y ningún `font-size` de esa hoja es un literal:

- **`--fs-micro`** (`.75rem`, 12 px, 800, mayúsculas): etiquetas en mayúsculas y piso de la escala — marca, encabezados de sección, chips de estado.
- **`--fs-label`** (`.8rem`, 12.80 px): cromo de control y etiquetas secundarias — etiqueta de período, controles, tooltip, código de materia, filas de detalle del plan global.
- **`--fs-body-sm`** (`.84rem`, 13.44 px): cuerpo chico — prosa secundaria, listas y filas de definición.
- **`--fs-body`** (`.9rem`, 14.40 px): cuerpo de lectura — avisos de datos simulados, línea de resumen, actor.
- **`--fs-title-sm`** (`1rem`, 16 px): título chico — nombre del plan y de la carrera, valores de resumen, título de tarjeta.
- **`--fs-value`** (`1.08rem`, 17.28 px): valor destacado — el número que se escanea en la fila de categoría.
- **`--fs-display`** (`1.35rem`, 21.60 px): display — título de la superficie.

### Named Rules
**La Regla de una Sola Voz.** No hay fuente de display decorativa. Si algo necesita destacarse, sube de
peso o de tamaño, o pasa a mayúsculas espaciadas.

**La Regla del Piso Redundante.** Ningún texto funcional del plano baja de 11 px, sin excepción. La
redundancia sigue siendo obligatoria —cada estado se dice con color, borde, símbolo, caja y patrón— pero ya
no compra tamaño: las cuatro señales hacen legible el estado, no autorizan a encogerlo. Un texto que no
puede leerse no se salva con otras tres señales.

**La Regla de las Dos Escalas.** El plano del estudiante se mide en píxeles y su rampa es deliberada:
siete pasos, de 11 a 22 px, con el 12 px como centro de gravedad y el 11 px como piso de todo texto
funcional. El 10 px y el 8 px quedaron retirados: la rampa empezó con diez valores y un sótano, y terminó
con siete y un solo piso. La vista institucional se mide en `rem` porque es una superficie de lectura, no
un plano: siete pasos, cada uno nombrable por su propósito. Las dos escalas se encuentran en 12 px, y ese
encuentro es lo que sostiene una sola voz entre el plano y la lectura.

**La Regla del Paso Nombrable.** Un paso existe si se puede nombrar por su propósito. La rampa de
lectura llegó a tener quince valores distintos; se consolidó a siete. Los vecinos que se separaban por
0.01 rem —`.82` contra `.83`, `.72` contra `.73`— no eran dos roles sino dos números. Un valor nuevo
que no se pueda nombrar no entra a la escala: entra a un paso existente. Y si dos pasos dejan de
distinguirse en el uso, sobra el que no tenga propósito propio — hoy se sostienen `--fs-label`
(12.80 px) y `--fs-body-sm` (13.44 px), separados por 0.64 px, porque uno es cromo de control y el otro
prosa.

**La Regla del Piso de 12 px.** Ningún texto de la superficie de lectura baja de 12 px. En el plano el
piso funcional es 11 px, y el sótano de 8 px existe solo porque el estado tiene cuatro señales
redundantes; en la lectura no hay señal redundante que rescate a un texto más chico que el piso, así
que el piso sube.

**La Regla de la Medida.** La prosa se mide en caracteres y el dato en píxeles. El texto corrido del
modal de resultados se limita con `--measure-prose` (`65ch`), un solo número para todos sus bloques:
avisos, resumen de desenlace, explicación de causas, nota de simulador y nota al pie de alternativa. La
medida se declara **sobre el elemento que tiene el texto**, nunca sobre su contenedor: `ch` se resuelve
contra el `font-size` del propio elemento, y un `65ch` heredado de un contenedor de 16 px da casi el doble
de caracteres por línea en un párrafo de 13 px. Las tablas, las grillas y las métricas siguen ocupando el
ancho que necesitan: la medida es una regla, no un accidente del layout.

## Layout

El lienzo es un contenedor flexible con desplazamiento propio que ocupa todo el ancho disponible, con
8 px de relleno y el color de papel de fondo. Adentro, el plano se dibuja fijo y grande: una región de
3520 px con borde y esquinas de 17 px, un escenario de 3444 px, y diez columnas de 300 px separadas por
49 px. Cada columna es un cuatrimestre con fondo verde claro y una grilla interna de seis filas de 118
px con 24 px de separación, donde cada materia ocupa su fila mediante `grid-row`.

**El desplazamiento es horizontal por diseño.** El plano no se ajusta al ancho: se recorre. La rueda
vertical pura sobre el grafo se traduce a desplazamiento horizontal con una única animación suavizada,
y se respetan los gestos de trackpad, Shift, Ctrl/Cmd y el desplazamiento nativo dentro del panel y del
modal. **La traducción vale mientras no haya nada escondido abajo:** si el lienzo desborda en vertical,
la rueda conserva su recorrido nativo, que es la única vía a las filas que quedaron fuera de la vista.
Arriba de 760 px el plano entra entero, la condición nunca se cumple y la regla no cambia.

**El plano entra en el alto, salvo en pantallas angostas.** Arriba de 760 px el plano se escala una vez
para entrar en el alto del lienzo —0,80 en 1400×900, 0,65 en 1024×768— y así el año completo se lee de
un vistazo. Abajo de 760 px ese encogido se desactiva y el plano se dibuja a su escala de autor: a
390×844 el encogido lo dejaba al 59 % y el texto de 11 px se dibujaba a 6,49 px, por debajo del piso de
la rampa. El precio declarado es desplazamiento vertical —349 px en 390×844— y su contraparte es el
índice de cuatrimestres: en un teléfono se ve una columna por vez y la orientación se recupera con el
índice, no encogiendo el plano.

**Las capas flotan, no reservan.** La barra de período es una franja superior de 64 px de alto mínimo y
el resto es el lienzo. El panel de selección es fijo, de 360 px de ancho máximo, con 24 px de margen
—12 px en pantallas angostas, donde además pasa a la parte inferior con un máximo de 34 vh—. No reserva
ancho: las tarjetas pueden quedar detrás de él. El modal de resultados se abre sobre un velo que
arranca debajo de la barra.

**Breakpoints observados:** 760 px en el panel de selección y en la vista institucional (que además
colapsa su grilla a una columna en 470 px), y 640 px en la familia de escenarios. En los tres casos la
barra pasa a columna. En 760 px la barra de período se organiza además en tres bandas —contexto,
navegación de períodos e índice de cuatrimestres— y el plano deja de encogerse.

**Ritmo:** los grupos internos son apretados (6 a 10 px de separación) y las secciones se separan con 13
a 16 px y una línea. Siempre hay más aire arriba de un encabezado que abajo.

## Elevation & Depth

El sistema usa sombras suaves y teñidas, con alpha sobre la tinta institucional en vez de negro puro:
es lo que hace que una sombra se lea como parte del plano y no como suciedad. La profundidad tiene tres
niveles y cada uno corresponde a una capa real de la interfaz, no a una decoración. No hay
`backdrop-filter`, no hay desenfoque de fondo y no hay animaciones de entrada.

### Shadow Vocabulary
- **Tarjeta en reposo** (`box-shadow: 0 6px 14px #043a3124`): la materia descansa sobre el plano.
- **Tarjeta en hover** (`box-shadow: 0 10px 22px #043a3130`): sube 2 px y la sombra se abre; es la única respuesta de elevación a un estado.
- **Tarjeta marcada** (`box-shadow: 0 0 0 4px #046353, 0 10px 22px #043a3138`): anillo verde de selección sobre el plano.
- **Panel flotante** (`box-shadow: 0 22px 44px #043a3147`): la capa más alta de trabajo; no lleva borde, la sombra es su único límite.
- **Modal de resultados** (`box-shadow: 0 30px 64px #043a3159`): la capa de decisión, sobre un velo `#043a3166`.
- **Superficies institucionales** (`0 5px 12px #043a310d`, `0 8px 22px #043a310d`): elevaciones ambientales, más suaves porque esa vista es de lectura.

### Named Rules
**La Regla de la Sombra con Papel.** Cada nivel de sombra pertenece a una capa concreta: tarjeta,
panel, modal. Si algo flota y no es una de esas tres cosas, no lleva sombra.

**La Regla del Foco de Dos Tonalidades.** El indicador de foco es dorado por fuera y tinta por dentro:
`outline: 3px solid #eba310; outline-offset: 2px; box-shadow: 0 0 0 2px #043a31`. El anillo interior
aporta el 11.81:1 que el dorado no tiene sobre fondos claros, y el dorado aporta el 5.91:1 que la tinta
no tiene sobre la barra verde profunda. Ninguna regla que declare `box-shadow` sobre un elemento
enfocable puede pisar ese anillo: si necesita su propia sombra, la incluye primero en su lista. El lienzo
del plano es el único caso **full-bleed**: ahí el anillo se compone **dentro** de la caja
(`outline-offset: -3px` más `inset`), porque `html` y `body` recortan con `overflow: hidden` y un anillo
exterior se perdería contra el borde de la ventana. El orden no cambia: dorado contra el borde, tinta por
dentro.

## Shapes

Lenguaje de esquinas suaves y contenidas, con radios elegidos por tamaño de objeto y no por gusto: 4 px
para sellos y marcas chicas, 6 a 7 px para controles, 8 a 9 px para acciones y bloques internos, 10 px
para tarjetas y alternativas, 12 px para la columna del cuatrimestre, 14 px para las capas flotantes, 17
px para el plano y 999 px para chips y píldoras. Un objeto más grande tiene una esquina más suave,
siempre en esa progresión.

Los bordes son finos y funcionan: 1 px para separar filas y celdas, 2 px de color de estado alrededor de
cada tarjeta, 3 a 5 px para las reglas que marcan un bloque de explicación o un aviso. El borde
izquierdo de 7 px de la tarjeta es la única forma pesada del sistema, y existe porque codifica la
categoría de la materia.

### Named Rules
**La Regla del Borde que Informa.** Ningún borde existe solo para decorar. Si un borde se elimina y no
se pierde información, no debería estar: por eso el panel y el modal no tienen borde y se apoyan en su
sombra.

**La Regla del Trazo que Cruza.** Las correlatividades se dibujan con dos trazos y el trazo dice una sola
cosa: si la flecha cruza por encima de otras columnas del plano. `routed` —punteado— une materias
separadas por dos columnas o más; `solid` —continuo— une columnas contiguas, incluida la misma. Cuando
la distinción no tenía regla, catorce de veintiséis flechas iban punteadas y el trazo no significaba
nada; con la regla aplicada quedan tres, y las tres son los tramos largos. Un trazo sin criterio es
decoración con apariencia de dato, y la leyenda del plano lo delata: si no se puede nombrar qué
distingue, hay que dejar de distinguir.

## Components

### Buttons
- **Shape:** esquinas de 7 a 8 px, alto mínimo 32 a 42 px según superficie, texto a 12–13 px en peso 800.
- **Commit (verde):** relleno institucional con texto blanco (`padding: 10px 13px`). Es la acción que avanza: confirmar la etapa, aceptar el plan, confirmar la inscripción simulada. El botón que confirma la inscripción dentro del modal también va en verde: es una confirmación, no una advertencia. Hover a verde profundo. Deshabilitado con opacidad .45 y `cursor: not-allowed`.
- **Attention (dorado):** el CTA que abre la etapa en la barra de período, con tinta oscura encima y texto en peso 800. Hover a dorado claro. Es el único botón dorado de la interfaz.
- **Secondary:** fondo blanco, borde de línea fuerte, tinta institucional. Cancelar, cerrar, volver a ejecutar.
- **Alerta (ámbar):** borde y texto en la familia de advertencia sobre blanco, con hover sobre `#ffedd5`. Son las recuperaciones de un desenlace no viable.
- **Focus:** el anillo de dos tonalidades, en los cinco tipos.

### Cards / Containers
- **Corner Style:** 10 px.
- **Background:** el fondo del estado, con el color del estado en el borde y en los `span` anidados.
- **Shadow Strategy:** ver Elevation & Depth; el hover sube 2 px.
- **Border:** 2 px de color de estado, 7 px en el lado izquierdo para la categoría.
- **Internal Padding:** 11 px vertical y 12 px horizontal, en una caja fija de 272 × 118 px, con la etiqueta de estado alineada a la derecha en la primera línea, el nombre de la materia en el medio y el metadato de intención y categoría abajo.
- **Disabled:** `filter: saturate(.7)` y `cursor: not-allowed`; nunca usan solo la opacidad para decir «no disponible».

### Inputs / Fields
- **Style:** fondo blanco, borde de línea fuerte, radio 6 px, alto mínimo 32 a 42 px, texto en tinta institucional.
- **Focus:** el anillo de dos tonalidades reemplaza al borde; el control no cambia de tamaño.

### Navigation
La barra de período es una franja verde profunda con tres zonas: el contexto del plan a la izquierda
—con las etiquetas en mayúsculas espaciadas y el aviso de datos simulados—, el display del período al
centro, y la navegación a la derecha con botones de 38 px de alto mínimo. Sus flechas se deshabilitan
durante la transacción de selección en lugar de permitir un cambio a mitad de camino.

**En pantallas angostas la barra se apila en tres bandas** —contexto, navegación de períodos e índice de
cuatrimestres— y el contexto deja de apilar la etiqueta y el nombre para ponerlos en un renglón. La
etiqueta del período («Período actual» / «Período siguiente») sale de la vista y queda para el lector de
pantalla: sin ella las dos flechas y el valor del período entran en un renglón, y el botón «Siguiente» no
cae a una fila propia. Los botones de la barra **conservan sus 16 px y sus 38 px de alto mínimo**: bajarlos
a 12 px en pantallas chicas es exactamente lo que se retiró en su momento, y la compresión se hace con
layout, no con tamaño de texto. La barra mide 197 px a 390×844 —23,3 % del alto— contra los 243 px del
apilado anterior, e incluye el índice.

**El índice de cuatrimestres** es la única pieza de la barra que existe sólo abajo de 760 px: un `<nav>`
con diez botones numerados —`1`…`10`, con el nombre accesible «Cuatrimestre N»— agrupados de a dos por
año. Es un salto, no una navegación por pasos: manda el lienzo a esa columna, deja el foco en su cabecera
`h2` para que el recorrido siguiente entre por sus materias, y marca con `aria-current="true"` la columna
más cercana al centro del lienzo, que es la orientación que el plano encogido daba gratis. Arriba de
760 px no existe: `display:none`, sin foco y fuera del árbol de accesibilidad.

### Chip de estado (institucional)
Píldoras de radio 999 px con fondo verde claro y texto verde apagado en mayúsculas en `--fs-micro`
(12 px); cuando la demanda queda insatisfecha pasan al fondo de advertencia con tinta `#8e3608`.

### Aviso de datos simulados
Bloque con regla izquierda de 5 px, fondo `#eeeafd` y tinta `#6a2482` en la vista institucional; línea
compacta en mayúsculas espaciadas dentro del contexto del plan en las superficies del estudiante. Es
texto real del documento, nunca un tooltip, y no desaparece en pantallas angostas.

## Do's and Don'ts

### Do:
- **Do** usá el verde institucional para lo que confirma y avanza, y el dorado solo para atención y foco.
- **Do** acompañá cada estado con etiqueta y símbolo, y sumá rayado cuando el estado pide otra señal además del color.
- **Do** mantené el anillo de foco de dos tonalidades, y si una regla necesita su propia sombra, incluí `0 0 0 2px #043a31` primero en la lista.
- **Do** reservá la línea fuerte `#6d6e71` para delimitar controles y la línea clara `#cad5e2` para separar contenido.
- **Do** dejá que el grafo ocupe el ancho y que las capas floten encima: el panel no reserva espacio.
- **Do** declarar en texto visible que los datos son simulados y que el prototipo no es el sistema oficial de la universidad.

### Don't:
- **Don't** usar el dorado como color de texto sobre fondos claros: 2.15:1. Es relleno o anillo, nunca tinta.
- **Don't** dejar que un color solo cuente algo. Sin etiqueta y símbolo, el vocabulario de estados deja de ser accesible.
- **Don't** reutilizar un token de color en dos fondos opuestos: el mismo valor que funciona sobre el panel blanco puede desaparecer sobre la barra verde profunda.
- **Don't** cambiar los tintes del rayado por el color de primer plano del estado: el rayado es una señal de patrón, no un relleno, y su función es pasar inadvertido mientras dice «acá hay algo distinto».
- **Don't** poner borde a las capas flotantes: el panel y el modal se definen por su sombra.
- **Don't** introducir una fuente decorativa, un gradiente, un `backdrop-filter` o una animación de entrada. Este sistema es un plano, no una landing.
- **Don't** presentar el prototipo como el sistema oficial de la universidad ni usar su nombre como sello.
