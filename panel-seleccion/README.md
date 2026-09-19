# Mockup del panel de selección

El grafo editable del mockup anterior más el panel de selección de materias. Es el primer mockup que consume la capa de datos simulados compartida, y el que ejercita la etapa de selección completa: abrirla desde la barra de período, marcar materias, ver las comprobaciones locales y cerrarla hacia la optimización.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/panel-seleccion/`.

La página carga `../comun/datos-simulados.js`, así que el servidor tiene que servir **la raíz del repositorio** y no la carpeta del mockup.

## Escenario

El mismo escenario previo a las inscripciones de `2A · 2026`: no hay materias inscriptas, y C19, C20 y C27 son la planificación existente de ese período. C23 figura como `Disponible`, C24 como `Sin cátedra`, y C25 y C26 permanecen `Bloqueadas`.

**Los borradores son por período y no se mezclan.** El de `1B · 2026` arranca vacío, porque ahí no hay nada inscripto. El de `2A · 2026` precarga las tres materias del plan existente como `requerida en esta planificación`, identificadas como cargadas desde el escenario.

## Alcance

El mockup contiene:

- el grafo de 10 cuatrimestres, 46 materias y 26 correlatividades, con los ocho estados visuales;
- una barra de período cuyo botón de entrada cambia de etiqueta según el período: `Iniciar la inscripción` en `1B · 2026` y `Generar alternativas` en `2A · 2026`;
- un panel flotante **no bloqueante**, que se abre con ese botón y no impide seguir marcando tarjetas;
- el contador de carga por bimestre y por cuatrimestre, con la nota de que solo cuenta materias con oferta publicada;
- la intención derivada de cada materia marcada, de solo lectura: el estudiante no la elige;
- las comprobaciones locales: tope, correlatividades, superposiciones de franjas y cupos simulados, siempre como advertencias y nunca como alternativas;
- el botón que cierra la selección y pasa a la optimización, hoy un marcador que enumera los seis resultados pendientes;
- la regla de reposicionamiento del panel y la guarda de foco de teclado.

## Datos simulados

La oferta, los cupos, las franjas, las aulas, las capacidades y los docentes vienen de `comun/datos-simulados.js`, que **no es una fuente institucional**: los nombres, las capacidades y los horarios son inventados y no contienen datos personales reales.

La cobertura es deliberadamente parcial: solo las materias no aprobadas tienen oferta, y C24 no tiene cátedra, para poder ejercitar el estado «datos incompletos». En este escenario hay cinco materias con oferta en `1B · 2026` y cuatro en `2A · 2026`, suficientes para intentar la cuarta materia del bimestre.

El período de cada cátedra **es** su bimestre: `1B · 2026` es el bimestre B del primer cuatrimestre y `2A · 2026` el bimestre A del segundo.

## Edición

Los datos de las materias y las correlatividades siguen en `app.js`, en los arreglos `courses` y `edges`, y la oferta vive en la capa compartida. Los borradores por período se inicializan en `scenarioPlans`; la regla del lado está en `preferredPanelSide` y la guarda en `focusIsClear`.

## Advertencia

Los nombres y estados de las materias se transcribieron visualmente del SVG del repositorio y deben contrastarse con la fuente académica antes de usarlos como reglas de dominio.

El producto principal de este mockup es `discoveries.md`, no el código: contiene las ocho correcciones de la revisión, la funcionalidad que la interfaz necesita y los datos no proveen, y siete requerimientos candidatos derivados.
