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
