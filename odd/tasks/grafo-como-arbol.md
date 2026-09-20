# El grafo como árbol, con años y cuatrimestres de fondo

**Objetivo.** Rediseñar la capa de fondo del grafo —la del mockup original, la primera que hicimos— para que se lea como un árbol, con las conexiones entre materias más presentes y con los números de año y de cuatrimestre integrados al fondo.

## Estado

**Diferido por pedido explícito del autor** (2026-09-19): se retoma **cuando todas las interfaces del prototipo estén terminadas**, no antes. No empezar por estar en el mismo repositorio.

## Pedido del autor

1. Que la interfaz se vea **más como un árbol**.
2. Que las **conexiones entre las materias tengan más presencia**.
3. Que los **números del año y del cuatrimestre estén de fondo**: que no se noten, pero que si se les presta atención se vean.

## Advertencia técnica que hay que resolver antes de diseñar

**El plan no es un árbol, es un DAG.** El grafo tiene 46 materias y 26 correlatividades, y hay materias con más de un requisito. Un árbol estricto no admite nodos con dos padres: para dibujarlo habría que **duplicar materias**, y una materia duplicada rompe la lectura de estado, de borrador y de correlatividad que hoy es única por materia.

Lo que sí es alcanzable, y probablemente lo que el autor tiene en la cabeza, es una **lectura de árbol sin duplicar nodos**: un tronco por año o por cuatrimestre del que salen ramas, con las aristas dibujadas de modo que la dirección del avance sea evidente. Es una decisión de diseño visual, no un cambio de modelo de datos. Hay que confirmarlo con el autor antes de tocar nada.

## Preguntas abiertas

- **Alcance de la propagación.** Cada mockup tiene su propia copia de `courses`, `edges` y `renderColumns` (`mockup/app.js`, `panel-seleccion/app.js`, `periodo-2A/app.js`, `periodo-2B/app.js`). Hay que decidir si el lenguaje visual del grafo se unifica en `comun/` o se replica en cada mockup. La duplicación actual es una deuda que este trabajo puede pagar o agravar.
- **Qué pasa con el `year-row`.** Hoy los años se muestran arriba y a la vista, como encabezado de columnas. El autor los quiere de fondo. ¿El encabezado visible desaparece y se convierte en la capa de fondo, o conviven los dos?
- **Cuatrimestres.** Hoy el cuatrimestre aparece en los encabezados de columna («Cuatrimestre 4»). Si pasa a ser fondo, hay que decidir si se rotula por columna o si se agrupa visualmente por cuatrimestre.
- **Contraste.** Los números de fondo tienen que quedar por debajo de las tarjetas en jerarquía visual, pero por encima del umbral de percepción. Las tarjetas ya usan fondos de color con patrones de rayas para `sin cátedra` y `bloqueada`, así que el fondo no puede competir con ellos. Hay que fijar un valor y medirlo, no estimarlo.
- **Accesibilidad.** La capa de fondo es decorativa y debe llevar `aria-hidden="true"`. La información de año y cuatrimestre tiene que seguir disponible para lectores de pantalla por otra vía, porque hoy llega por los encabezados de columna y por `aria-label` de la región.
- **Presencia de las conexiones.** Las aristas se dibujan en un `svg` con `marker-end` de flecha. Más presencia puede significar más grosor, más contraste o un trazo con dirección explícita. Hay que decidir si eso sobrevive al zoom (`fitGraphToViewport` aplica `transform: scale`) sin engrosarse de más.

## Fuera de alcance

- Cambiar el modelo de datos de materias y correlatividades, o el número de correlatividades.
- Cambiar los ocho estados visuales de las materias.
- Cualquier cambio en el panel de selección.
- Duplicar materias para forzar una forma de árbol.

## Criterio de cierre

El trabajo cierra con la medición del contraste de la capa de fondo y de la presencia de las conexiones sobre el mockup servido, no con una impresión visual. Cada tarea cierra con al menos un commit de unidad de trabajo.
