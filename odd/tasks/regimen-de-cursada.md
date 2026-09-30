# Régimen de cursada — que el borde de la tarjeta diga cuánto dura la materia

Unidad pedida por el autor el 2026-09-30, sobre la rama `feat/correlatividades-legibles` (no se abre rama
nueva: es la continuación del mismo pase sobre el plano). Reemplaza el concepto del borde izquierdo de la
tarjeta: deja de codificar el **área de conocimiento** (`Req. SA`, `Req. PP`, `Proceso`, `General`) y pasa a
codificar el **régimen de cursada**.

Pedido textual del autor: «no me gustan las categorías de las materias pero sin ellas las cards de las
materias quedarían muy limpias… cambiemos el concepto a esto, haz que las de color verde sean las
bimestrales, azules las cuatrimestrales, dorado anuales… todas las ingles son anuales… los seminarios, las
prácticas son cuatrimestrales… las demás son bimestrales. Si tenés una mejor combinación de colores hacémelo
saber».

## El concepto

| Régimen | Color | Etiqueta en la tarjeta | Materias |
| --- | --- | --- | --- |
| Bimestral | verde `--c-green` `#046353` | «Bimestral» | **36** |
| Cuatrimestral | azul `--available` `#1d4ed8` | «Cuatrimestral» | **4**: C29, C44, C45, C46 |
| Anual | dorado `--c-gold` `#eba310` | «Anual» | **6**: C06, C11, C17, C22, C28, C33 |

36 + 4 + 6 = 46: la partición cubre las cuarenta y seis materias, sin resto.

Decisiones explícitas del autor que no se deducen del nombre de la materia:

- Los cinco «Taller de…» (**C15**, **C20**, **C26**, **C30**, **C39**) son **bimestrales**, no
  cuatrimestrales. Es la trampa de esta tabla: son materias prácticas y la regla «las prácticas son
  cuatrimestrales» invitaría a clasificarlas mal.
- La etiqueta dice sólo el régimen: **sin** la aclaración («una sola materia»), pedido textual.
- Tres colores y la palabra distingue. Se descartó un cuarto tono: el ámbar de la paleta está a ~6° de tono
  del dorado y la pantalla ya usa tres ámbar.

Los tres colores son tokens existentes (`--c-green`, `--available`, `--c-gold`): no entra ningún color
nuevo. `--c-rose` y `--c-rust` quedan **sin uso** al retirar `--category-sa` y `--category-pp`.

## Colisión que hay que declarar (hallazgo de esta sesión, medido sobre los datos)

El borde de la tarjeta ya estaba tomado por el **estado**: `.course` pinta `2 px` de `currentColor` y el
`currentColor` es el color del estado (`--course-color`). El régimen reusa el `border-left` de 7 px, así que
los dos significados comparten el borde. Contado sobre las 46 materias del escenario:

| Régimen / estado | Materias | Qué pasa con la banda de 7 px |
| --- | --- | --- |
| cuatrimestral / available | **2** (C29, C45) | **Mismo color exacto** (`#1d4ed8`): la banda desaparece, se lee como un borde azul más grueso |
| bimestral / approved | 16 | Verde `#046353` sobre borde verde `#15803d`: se distinguen, pero es el par más flojo |
| cuatrimestral / blocked | 2 | Azul sobre rojo rayado: se lee |
| bimestral / available, blocked, planned, no-offer | 20 | Se lee |
| anual / approved | 6 | Dorado sobre verde: se lee |

**No se pierde información**: el metadato de la tarjeta siempre dice el régimen con la palabra, y **La Regla
del Color Declarado** de `DESIGN.md` («ningún color se usa para decir algo que el texto no diga también»)
hace que la redundancia sea la situación prevista, no una excepción. Queda declarado como consecuencia
medida: en C29 y C45 la señal es sólo textual. Si el autor quiere que la banda se vea en las cuatro
cuatrimestrales, la salida es cambiar el azul del régimen por uno que no sea el color del estado
`available`; no se hizo porque el autor eligió ese azul y el pedido no autoriza cambiar el estado.

## Alcance de archivos

Los cuatro `app.js` (renombre de campo y de valor, y el render de la tarjeta), **las dos** hojas del plano
—`comun/escenario.css` **y** la copia propia de `panel-seleccion/styles.css`; cargan archivos distintos y
hay que tocar las dos—, la leyenda de `panel-seleccion/index.html` con el `?v=21` → `?v=22`, y la autoridad
de diseño en sus tres copias vivas (`DESIGN.md`, `.impeccable/design.json`, `.impeccable/config.json`).

## Tareas

- [x] **T1 — El campo y el dato en las cuatro copias del escenario.** `category` → `regimen` y los valores
  `sa|pp|process|general` → `bimestral|cuatrimestral|anual` según la tabla. Dos sintaxis: array en
  `panel-seleccion/app.js` (tuplas), objeto en `mockup/`, `periodo-2A/` y `periodo-2B/`.
- [x] **T2 — El render de la tarjeta en las cuatro copias.** `category-${…}` → `regimen-${…}` y el ternario
  `'Req. SA'|'Req. PP'|'Proceso'|'General'` → `'Bimestral'|'Cuatrimestral'|'Anual'`.
- [x] **T3 — Las dos hojas del plano.** Tokens `--category-process|sa|pp|general` →
  `--regimen-bimestral|cuatrimestral|anual` y las reglas `.course.category-*` → `.course.regimen-*`.
- [x] **T4 — La leyenda.** `panel-seleccion/index.html`: «Categoría de la materia» → «Régimen de cursada»,
  cuatro entradas → tres, y `.legend-category.category-*` → `.legend-regimen.regimen-*` en HTML y CSS.
  Cache-bust `styles.css?v=21` → `?v=22`.
- [x] **T5 — La autoridad de diseño y los registros que la citan.** `DESIGN.md` (front matter `colors`,
  «### Categorías» → «### Régimen de cursada», la forma pesada del borde y la ficha de la tarjeta),
  `.impeccable/design.json` (la tarjeta del sistema), `.impeccable/config.json` (las dos razones de
  exención que nombran la categoría), los tres `README.md` de los escenarios y las dos menciones del campo
  en `decisiones.md`.
- [x] **T6 — Verificación renderizada.** Con Chrome for Testing 153 por CDP: las 46 tarjetas con el color de
  borde izquierdo computado esperado y su etiqueta de régimen, la leyenda con tres entradas, cero
  excepciones de consola, en cuatro anchos y en las cuatro superficies.

## Ruteo

La regla de escritura multiarchivo disparó: la edición va a **un** `gentle-ai-worker` con las superficies
declaradas, y la verificación renderizada a `gentle-ai-verify`. El padre escribe el guion de navegador y
controla el resultado con aritmética propia (la partición 36/4/6 y la igualdad de `regimen` por materia
entre las cuatro copias), porque el reporte del que escribe no es evidencia.

## Verificación

### Control aritmético (del padre, independiente del reporte del writer)

Se releyeron los cuatro `app.js` y se comparó **cada** `id` contra la tabla de arriba, construida desde la regla del autor y no desde
lo que el writer escribió:

| Archivo | Materias | Bimestral | Cuatrimestral | Anual | Discrepancias |
| --- | --- | --- | --- | --- | --- |
| `panel-seleccion/app.js` | 46 | 36 | 4 | 6 | 0 |
| `mockup/app.js` | 46 | 36 | 4 | 6 | 0 |
| `periodo-2A/app.js` | 46 | 36 | 4 | 6 | 0 |
| `periodo-2B/app.js` | 46 | 36 | 4 | 6 | 0 |

`grep` de `category` y de los cuatro valores viejos en los catorce archivos tocados: **cero coincidencias**. Los dos JSON siguen
parseando.

### Verificación renderizada (Chrome for Testing 153 por CDP)

`16 renders` = 4 superficies × 4 anchos (1600×900, 1440×900, 1024×768, 390×844), 46 tarjetas por render. Para las 736 tarjetas
renderizadas se comprobó la clase `regimen-*`, la etiqueta de la tarjeta y el **color computado** de `border-left`:

| Comprobación | Resultado |
| --- | --- |
| Clase `regimen-<esperado>` en la tarjeta | 736/736 |
| Etiqueta «Bimestral»/«Cuatrimestral»/«Anual» | 736/736 |
| `border-left-color` = verde `rgb(4,99,83)` / azul `rgb(29,78,216)` / dorado `rgb(235,163,16)` | 736/736 |
| `border-left-width: 7 px` | 736/736 |
| Elementos con clase `*category*` | 0 |
| Leyenda: encabezado «Régimen de cursada» y 3 muestras con su color | 4/4 anchos |

La colisión declarada apareció medida y **exactamente** donde se predijo: 24 renders (C29 y C45, en las tres superficies donde su
estado es `available` × 4 anchos) con la banda igual al borde de estado. En `periodo-2B`, donde esas dos materias tienen otro estado,
no aparece: 2 × 4 × 3 = 24 ✓.

Console: **un** 404, el de `/favicon.ico`, **preexistente y ajeno a este cambio**: `panel-seleccion/index.html` ya declara
`<link rel="icon" href="data:,">` y los tres `index.html` de los escenarios no declaran ninguno (0 coincidencias de `rel="icon"` en
ellos en HEAD también). Ningún otro error ni excepción.

### Detector de Impeccable: consecuencia declarada, no resuelta

Corrido en URL con el Chrome del caché de puppeteer (necesita `--no-sandbox`: el detector no lo pasa y muere sin él), sobre las cuatro
superficies **antes y después**, contra un worktree en el commit previo:

| Superficie | Antes | Después |
| --- | --- | --- |
| `panel-seleccion` | dark-glow 1 · edge-flush-cards 1 · low-contrast 12 · repeating-stripes 1 | **idéntico** |
| `mockup`, `periodo-2A`, `periodo-2B` | edge-flush-cards 1 · low-contrast 1 · repeating-stripes 1 · **side-tab 33** | **side-tab 46** |

No aparece ninguna regla nueva: la única diferencia es el conteo de `side-tab` en los tres escenarios, **33 → 46**. La causa se probó
con un experimento controlado sobre el árbol previo: cambiando **sólo** `--category-general` del gris neutro `#6d6e71` al verde
`#046353` y sin tocar nada más, el detector pasa de 33 a 46. O sea: la regla **saltea los bordes de un solo lado que son neutros**, y
el delta es exactamente **13**, el número de materias que en HEAD tenían `category:'general'` (26 `sa` + 13 `general` + 4 `process` +
3 `pp` = 46; 46 − 13 = 33). No es un elemento de diseño nuevo: es el mismo borde de 7 px que ya estaba, que pasó de gris a
cromático.

**No se agregó ninguna exención**, a propósito: silenciar el detector es una decisión del autor. Queda anotado que las dos entradas
`side-tab` de `.impeccable/config.json` (globs `*/index.html` y `*/*.css`) **nunca alcanzaron a los escenarios**: la regla no dispara en
`panel-seleccion` porque sus tarjetas son `<button>` y sí en los escenarios porque son `<article>` — borrando las dos entradas en un
worktree, `panel-seleccion` sigue en 0 y `mockup` sigue en 46. Arreglo si el autor lo quiere: extender el glob de esa razón a los tres
`index.html` de los escenarios.
