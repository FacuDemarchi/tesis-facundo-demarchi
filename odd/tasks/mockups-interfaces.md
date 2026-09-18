# Mockups de las interfaces nuevas

**Objetivo.** Diseñar los mockups de las interfaces del prototipo **para descubrir funcionalidad no provista**, antes de tocar la tesis. El mockup anterior produjo `RC-UX-01` a `RC-UX-11` partiendo solo del grafo; la misma pasada sobre las interfaces nuevas debe producir lo equivalente para el panel de selección, los resultados, las preferencias y la rama institucional.

**Por qué antes de la tesis.** El usuario pidió explícitamente no escribir nada en `documento/tesis.md` hasta que los mockups revelen qué falta. El documento es el destino, no el taller.

## Alcance

- Una carpeta por interfaz, con `index.html`, `app.js` y `styles.css`, como `mockup/`, `periodo-2A/` y `periodo-2B/`.
- Una capa de datos simulados **compartida**, consumida por todos los mockups.
- Un `discoveries.md` por mockup, con los hallazgos y los requerimientos candidatos derivados.
- Un `README.md` por mockup, con el escenario, el alcance y la advertencia de datos transcritos.

## Fuera de alcance

- Cambios en `documento/tesis.md`. Se hacen después, con los hallazgos a la vista.
- Cambios en `decisiones.md`. Se registran al cerrar cada mockup.
- Resolver §3.4 sobre autenticación institucional: el selector de rol es simulado y sobrevive a cualquier decisión.

## Decisiones que enmarcan

Tomadas el 2026-09-18. Registradas en memoria como `tesis/interfaz-diseno-cerrado` y `tesis/cierre-descarga`:

1. El período actual **genera alternativas**; una sola pantalla de resultados con dos etiquetas.
2. El panel de selección es **flotante y no bloqueante**, anclado a la derecha al inicio y migrando a la izquierda sobre las columnas resueltas. Es cumplimiento de WCAG 2.2 SC 2.4.11.
3. La evaluación institucional es automática al superar el cupo; el traslado se aplica solo si hay aula, y si no se deriva a bedelía.
4. La evaluación de aulas es un **filtro determinista**.
5. La intención del estudiante **transiciona automáticamente** cuando la cátedra se amplía.
6. El botón de entrada va en la **barra de período**, con etiqueta según el período (D-03).
7. El cierre ofrece **descargar un PDF** con leyenda visible, como candidato y como función del cierre.

## Convenciones heredadas del mockup existente

- Sin paso de compilación. Se sirve con `python3 -m http.server 8080` desde la raíz del repositorio.
- Los datos viven en arreglos dentro de `app.js`; el mockup actual usa `courses` y `edges`.
- Modelo de materia del mockup actual: `{ id, term, slot, name, state, category }`.
- Estados visuales ya estilizados: `aprobada`, `disponible`, `planificada`, `sin-catedra`, `bloqueada`, `inscripta`, `sin-cupo`, `revision`.
- Accesibilidad: `aria-live` para anuncios, navegación por teclado, `sr-only` para texto solo para lectores de pantalla.
- Los nombres y estados del mockup actual **se transcribieron visualmente** y deben contrastarse con la fuente académica.

## Tareas

- [x] **T1 — Capa de datos simulados compartida** (`comun/datos-simulados.js`, 179 líneas). Cátedras, franjas horarias, cupos, aulas, capacidades y docentes, marcados como simulados. Deliberadamente **parcial**: solo las materias no aprobadas tienen oferta, y C24 queda sin cátedra para ejercitar ese estado.

  **Evidencia**: `node --check` pasa; doce verificaciones propias pasan, incluidas cinco materias seleccionables con oferta en `1B · 2026` y cuatro en `2A · 2026` (mínimo cuatro para poder intentar la cuarta materia que exige CP-11), C20 con dos cátedras, C27 sin cupo, C24 sin cátedra, una superposición real de franjas entre C19 y C20, y un candidato de traslado de aula.

  **Hallazgo que produjo**: el período **es** el bimestre. Ver abajo.
- [x] **T2 — Mockup del panel de selección sobre el grafo** (`panel-seleccion/`, 422 líneas). El grafo del mockup actual más el panel flotante: materias marcadas, contador contra el tope por bimestre y cuatrimestre, advertencias locales y el botón que cierra la etapa.

  **Corregido tras la revisión del autor**, con seis observaciones: el panel no se muestra hasta apretar el botón de la barra; el clic agrega o quita y no recorre intenciones; el sistema deriva la intención y el estudiante no la elige; el indicador de granularidad salió del panel porque es del resultado (RF-13); el botón del panel dice «Inscribir» en el período actual y «Aceptar» en el siguiente (D-03); y el estado de la tarjeta se deriva del borrador y no del escenario estático.

  **Evidencia**: `node --check` pasa; verificación propia sobre el mockup servido, con los ocho puntos comprobados, incluidos los borradores separados por período y el plan del escenario cargado en el período que se planifica. Revisión nativa aprobada (riesgo medio, lente de confiabilidad) con cuatro hallazgos no bloqueantes.
- [ ] **T3 — Regla de reposicionamiento del panel.** Anclaje a la derecha al inicio, migración a la izquierda sobre las columnas resueltas, en **zonas discretas con transición**, escuchando foco y scroll.
- [x] **T4 — Botón de entrada en la barra de período**, con etiqueta según el período: «Iniciar la inscripción» en el actual, «Generar alternativas» en el siguiente. Entrega junto con T2, porque comparten los mismos archivos.
- [ ] **T5 — Registro de hallazgos y README** (`panel-seleccion/discoveries.md` y `panel-seleccion/README.md`), con los requerimientos candidatos derivados.

## Hallazgos de la capa de datos (T1)

**1. El período es el bimestre, y el documento no lo dice.** El año tiene cuatro períodos, `1A → 1B → 2A → 2B`, dos por cuatrimestre, y el nombre codifica cuatrimestre y bimestre: `1A` es el bimestre A del primer cuatrimestre. §1 y §3.3 hablan de «los períodos 1A, 1B, 2A y 2B», mientras §3.4 y D-04 hablan de «tres materias por **bimestre**». Son la misma unidad con dos nombres, y el documento nunca establece la equivalencia. Un lector —o un escritor de datos, como ocurrió— puede concluir que son dos dimensiones distintas.

**Acción pendiente en la tesis**: o se escribe «tres materias por período», o se agrega una oración que fije que el período académico del prototipo es el bimestre.

**2. Sin oferta publicada no hay bimestre, así que el tope no se puede verificar.** El bimestre es una propiedad de la **oferta**, no de la materia. Una materia sin cátedra no tiene bimestre conocido, de modo que la verificación local del tope de tres solo es evaluable para las materias con oferta publicada. Cuando la oferta está pendiente, el chequeo local se degrada a correlatividades y poco más. Es el mismo terreno que D-05 y RF-13, y el mockup del panel debe mostrarlo en lugar de disimularlo.

**3. CP-11 ya exige este escenario.** «El estudiante intenta seleccionar una cuarta materia en el mismo bimestre» es un caso de prueba existente, así que los datos tienen que permitir llegar a la cuarta materia en los dos períodos. Es la razón por la que la primera versión de la capa de datos fue rechazada.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo en la rama de la funcionalidad, con la documentación junto al comportamiento. El push y el PR quedan a decisión del usuario.

El cierre del mockup es el `discoveries.md`, no el código: lo que valida el trabajo es la lista de funcionalidad no provista que dejó a la vista.
