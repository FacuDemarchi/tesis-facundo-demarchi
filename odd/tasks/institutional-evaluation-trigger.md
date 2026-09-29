# Disparador de evaluación institucional — el botón en la barra y las etiquetas fuera de la vista

Feature **parkeada por decisión del autor**: vive en la rama `feat/institutional-evaluation-trigger`,
sobre `main` = `7d00eaf`, sin issue y sin PR por ahora.

## Qué entra

1. **El botón «Evaluar distribución global» se muda a la barra de período**, al lado del pill del actor
   (`d0dcaba`). Estaba en un bloque propio que reservaba 74 px de caja más 20 px de margen para un
   disparador de una fila. El bloque conserva sólo el resultado y se pliega mientras no lo haya:
   `#global-evaluation:has(> #global-evaluation-result[hidden]) { display: none }`. **No se toca el JS**:
   `app.js` resuelve el botón por `id` al cargar.
2. **La etiqueta «Elegir período» sale de la vista** (`4c283b5`), con la asociación intacta: el `<label
   for="period-select">` recibe el tratamiento `sr-only` de la hoja, así que el nombre accesible del
   select sigue siendo «Elegir período».
3. **La etiqueta «Período actual» sale de la vista** (este pase). El `<p id="period-kind">` es el
   tercer lugar donde aparecía el mismo dato, después del valor del propio select
   (`Período actual · 1B · 2026`). Sale de la vista, no del marcado: `app.js:324` le escribe
   `textContent` y un `null` rompería el render entero.

## No entra

- **Publicar la rama**: es decisión del autor, y la convención sería issue `enhancement` +
  `status:approved` y PR `type:feature` con merge commit.
- **Los pendientes del critique institucional** anotados en el issue #58: la segunda mención del conteo
  en `comun/demanda-institucional-simulada.js`, la tabla antes/después de los movimientos de aula, los
  blancos de 24 px, y el borde de categoría de 7 px del plano.

## La trampa de `sr-only` que se repite

`sr-only` es una clase de una sola clase de especificidad, y **pierde contra cualquier media query que
fije `width`**. En `styles.css:81` (`≤470 px`) la regla `.topbar-period .period-kind` le da
`grid-column: 1 / -1; width: 100%`. Como el elemento queda `position: absolute`, ese `width: 100%` se
resuelve contra la caja de relleno del contenedor de grilla: la etiqueta «invisible» se estira a todo el
ancho y empuja el documento a desborde horizontal. Es exactamente lo que pasó con «Elegir período», y la
salida es la misma: acotar la regla con `:not(.sr-only)`.

El error no se ve a 1400 px, sólo en pantalla angosta.

## Verificación

Medición renderizada propia (Chrome for Testing 153 por CDP) en 1400×900, 1024×768, 760×900 y 390×844:
alto de la barra, desborde horizontal del documento, caja de la etiqueta y el flujo completo (cambio de
período y evaluación global).

## Unidades del mismo pase, sin commitear (2026-09-29/30)

Todas en el árbol de trabajo porque la sesión de **modo live** (Impeccable) sigue abierta: mientras el
live esté abierto el árbol no se commitea ni se revisa, independientemente del interruptor de RDD
—apagado para este clon por decisión del autor, con el ciclo acordado: al final prender → review →
apagar—.

4. **La píldora del actor pierde su adjetivo**: «Actor provisional: Operador institucional» → «Operador
   institucional». La declaración de que el actor es provisional sigue en `PRODUCT.md`, en D-06 y en
   `institucional-demanda/README.md`, pero ya no está en la vista.
5. **La acción de evaluar se pega al actor**: `.actor` y el botón viven en **`.actor-actions`**, un
   contenedor que envuelve como unidad, así que a 1440 y 1024 quedan en la misma fila (24 px de
   separación) y a 760 y 390 se apilan como antes (píldora pegada a la izquierda, botón a ancho
   completo). Un hermano suelto en una barra `flex-wrap` envuelve solo; agrupar es lo que garantiza la
   adyacencia.
6. **El período deja de ser un desplegable**: el `<select>` y su `<label>` salen del marcado y en su
   lugar queda un `<p id="period-label">` con el texto directo —`1B Mayo-Junio`, `2A
   Agosto-Septiembre`—. Los rangos de meses se declaran **una sola vez** en el calendario académico
   compartido (`comun/datos-simulados.js`, `periodosAcademicos`), que cubre los cuatro bimestres (1A
   Marzo-Abril, 1B Mayo-Junio, 2A Agosto-Septiembre, 2B Octubre-Noviembre); cada período institucional
   referencia su código (`codigo: '1B'` / `'2A'`) y `app.js` compone el rótulo con un `etiquetaDePeriodo`
   que cae a `etiqueta` si el código no está en el calendario. El rótulo del botón quedó en «Evaluar
   distribución» por edición manual del autor, y se respetó.

### Verificación del pase (Chrome for Testing 153, cuatro anchos; detector del proyecto en `[]`)

Sin `<select>` en el DOM; la etiqueta visible en `--fs-title-sm` (16 px, 800, blanco), que es lo que
medía el control al que reemplaza; `#period-kind` sigue en 1×1 para que el anuncio diga el tipo; **cero
`<label>` huérfanos**; el grupo se expone como «Período académico» con su descripción
(`Accessibility.getPartialAXTree`); el flujo de períodos y el de evaluación funcionan en los cuatro
anchos, con el anuncio usando la etiqueta nueva («Período actual: 1B Mayo-Junio. …»). La barra queda en
**86 px** a 1440×725 —una sola fila—, 138 a 1024×768, 236 a 760×900 y 332 a 390×844, sin desborde
horizontal. Humo de las otras cuatro superficies tras tocar la capa compartida: sin errores de consola.

### Documentación alineada en el mismo pase

`DESIGN.md` y `.impeccable/design.json` mueven «etiqueta de período» de `--fs-label` a `--fs-title-sm`
**en las dos copias a la vez** (el sidecar se pudre en silencio cuando se toca una sola), y el README de
la superficie corrige la mención del `select` y un rótulo del botón que ya estaba viejo («Evaluar
resolución»). La etiqueta deja el año afuera: el «· 2026» sigue en el texto de las causas y en el dato,
no en la barra.

7. **La franja de resumen se achica a la mitad**: `.summary` pasó de `padding: 12px` a `padding: 0` vertical, así que la franja mide **25 px** contra los 49 anteriores (56 contra 80 a 390×844). El alto no lo fijaba el texto —20,9 px de línea— sino los botones «i», que miden 24×24 para no romper el blanco mínimo de WCAG 2.2: por eso la mitad exacta (24,5 px) se alcanza con relleno cero y **no** bajando los botones. Costo medido y declarado: el anillo de foco del botón «i» (3 px de contorno + 2 px de separación + 2 px de sombra interior = **5 px de alcance**) asoma 5 px arriba y 4 px abajo, sobre la barra verde y sobre la sección de demanda. Sigue siendo visible —nada lo recorta—, pero cruza el límite de la franja. Si se quiere el anillo contenido, la franja tiene que medir **35 px** (relleno 5 px) y entonces ya no es la mitad: son 29 px con relleno 2 px como punto medio.

8. **Salen el título de la sección y la clave de color**: «Demanda y causas» y «● Alumnos inscriptos fuera de cupo» dejan la vista. El `<h2 id="demand-title">` queda **`sr-only`** porque el `<section class="demand-section" aria-labelledby="demand-title">` depende de él para su nombre accesible: verificado en el árbol de accesibilidad, la región se sigue llamando «Demanda y causas» (misma salida que el `h2` del resumen, que ya era `sr-only`). La clave se **borra** —elemento, su regla CSS y la línea de JS que la ocultaba por período— porque cada tarjeta ya rotula «Alumnos inscriptos fuera de cupo» en su fila: era la tercera mención. Borrar el elemento exige borrar su escritor (`#outside-capacity-key`), igual que pasó con `#period-kind`: dejar un `querySelector` apuntando a la nada rompe el render entero. `.section-heading` desaparece con sus dos reglas (base y la del `≤760`), y la fila cuesta ~44 px: la primera tarjeta sube de ~184 a **140,8 px** a 1440×725.

**Consecuencia declarada**: con los dos `h2` en `sr-only`, **`--fs-display`** (1.35rem, el paso más grande de la escala de lectura) **se queda sin ningún usuario visible** en esta hoja —la jerarquía visible ahora tope en el título de tarjeta, 16 px—. O se retira el paso (con `DESIGN.md` y el sidecar, que van juntos) o se conserva como reservado. Es decisión del autor, no la tomé.

9. **La sección de materias se rediseña como tabla + panel de detalle.** Decisión del autor entre tres
   direcciones propuestas (ficha compacta / tabla / tabla + panel). La tabla compara; el panel explica.

   **El diagnóstico que la motivó, medido sobre la tarjeta anterior**: 422 px de alto a 1440×725, de los
   cuales **136 px eran tres filas apiladas con separador para tres números de dos dígitos** y 71 px la
   cabecera (112 px a 1024, cuando el nombre envuelve en tres líneas). Cinco materias dejaban el documento
   en **1507 px**.

   **Lo que quedó**: `<table>` con una fila por materia —`Materia`, las métricas activas del período y
   `Estado`— y un `<section>` de detalle al costado con nombre completo, chip, secciones, causas y el plan
   simulado. Medido con Chrome for Testing 153: filas **uniformes de 52,5-53 px**, tabla de **303 px**,
   panel de 264,5 px, y a 1440×725 **la página entera entra en la pantalla** (documento 725 = viewport).
   A 1024×768 y 760×900 el panel baja (decide la grilla con `minmax(min(520px, 100%), 1fr)`, no un
   breakpoint nuevo); a 390×844 la columna `Estado` sale de la vista y las filas miden 77-94 px porque el
   nombre envuelve. Cero desborde horizontal en los cuatro anchos.

   **Semántica, con dos mediciones que cambiaron el diseño**:
   - Chrome **no expone `aria-current`** en el botón de la fila: el volcado del árbol de accesibilidad
     muestra `invalid`/`focusable`/`controls` y ninguna propiedad `current`, mientras que el control con
     `aria-expanded` sí muestra `expanded=false` — o sea que el volcado es confiable y el atributo
     realmente no llega. El estado de selección viaja entonces **en el nombre accesible** («… (seleccionada)»),
     verificado: el botón seleccionado se llama «C23 Ética y Deontología Profesional (seleccionada)» y el
     panel es una `region` llamada «C23 Ética y Deontología Profesional ASIGNADO A SECCIÓN».
   - El anillo de foco del botón **no se recorta** contra el contenedor con `overflow: hidden`: medido, el
     botón está a 11 px del borde izquierdo del contenedor y el anillo alcanza 5 px.
   - La selección re-renderiza la tabla y **devuelve el foco** al botón elegido: el `<button>` no puede
     sobrevivir a un `replaceChildren`, y sin la devolución el foco caía al `body`.

   **Dos defectos propios, con su causa medida**: el chip de estado envolvía en dos líneas (43 px) y la
   columna `Estado` se llevaba 165 px, así que los nombres largos envolvían y las filas medían 62,5-63 px
   (desparejas). Se arregló acortando el chip de la tabla (`Pendiente`/`Asignado`, la forma completa queda en
   el panel), `white-space: nowrap` + `width: 1%` en las columnas numéricas, `width: 100%` en la columna del
   nombre y `min-width: 82px` **sólo** en la cabecera de «Fuera de cupo» para que entre en dos líneas.

   **Limpieza**: se fueron `.demand-card`, `.card-header`, `.course-code`, `.category-list`, `.category-row`
   y sus reglas responsive; el resaltado dorado de la tarjeta insatisfecha desapareció y con él la mención
   del «anillo de advertencia» en `DESIGN.md`.
