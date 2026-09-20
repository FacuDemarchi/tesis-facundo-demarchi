# Mockup del panel de selección

El grafo editable del mockup anterior más el panel de selección de materias. Es el primer mockup que consume la capa de datos simulados compartida, y el que ejercita la etapa de selección completa: abrirla desde la barra de período, marcar materias, consultar el contador de carga y cerrarla hacia el modal de resultados en el período actual o hacia el plan directo en el período de planificación.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/panel-seleccion/`.

La página carga `../comun/datos-simulados.js`, así que el servidor tiene que servir **la raíz del repositorio** y no la carpeta del mockup.

## Escenario

En `1B · 2026`, C19, C20 y C27 conservan su estado base planificado y son seleccionables; C25 y C26 permanecen `Bloqueadas`. En `2A · 2026`, una anulación explícita por período presenta C19, C20 y C27 como `Inscripta`: son contexto de inscripción existente, quedan deshabilitadas y no pertenecen al borrador. La misma anulación presenta C25 y C26 como `Sin cátedra`, aunque su estado base para `1B` sea bloqueado, para que puedan planificarse.

**Los borradores son por período y no se mezclan.** Tanto `1B · 2026` como `2A · 2026` empiezan vacíos. La inscripción existente es contexto visual del período, no una entrada de planificación: no aparece en la lista ni consume el máximo de tres materias. El período de planificación no ejecuta el motor: al aceptar, las materias marcadas pasan a `Planificada` en ese período.

## Alcance

El mockup contiene:

- el grafo de 10 cuatrimestres, 46 materias y 26 correlatividades, con los ocho estados visuales;
- una barra de período cuyo botón de entrada cambia de etiqueta según el período: `Iniciar la inscripción` en `1B · 2026` y `Planificar` en `2A · 2026`;
- un panel flotante **no bloqueante**, que se abre con ese botón y no impide seguir marcando tarjetas;
- durante la selección, las materias aprobadas y bloqueadas permanecen deshabilitadas de forma nativa; `markCourse()` también rechaza agregarlas por llamada programática, mientras los demás estados conservan su comportamiento actual;
- cada borrador del bimestre actual admite como máximo tres materias marcadas. El límite cuenta todas las marcas, incluida una materia sin cátedra publicada; al llegar a tres, las demás tarjetas seleccionables se deshabilitan de forma nativa, pero las tres marcadas permanecen habilitadas para quitarlas. `markCourse()` defiende el mismo límite ante llamadas programáticas;
- el bloque **RESTRICCIÓN** de disponibilidad, con los seis días como alternadores de «no puedo asistir»;
- la preferencia de profesor de cada materia marcada: el **nombre de la materia es la cabecera de un acordeón**, contraído de forma predeterminada, cuyo cuerpo lista los docentes de sus cátedras publicadas en el período;
- el contador de carga en el encabezado del panel, por bimestre y por cuatrimestre, que refleja el total de materias marcadas del borrador actual, incluso si una no tiene oferta publicada;
- la intención derivada de cada materia marcada, de solo lectura: el estudiante no la elige y, para `no considerar`, sigue determinando el motivo visible fuera de la cabecera;
- el botón que cierra la selección: `Inscribir` abre el modal de resultados del período actual; `Aceptar` aplica directamente el plan del período siguiente, conserva el borrador y mantiene abierta la selección;
- el modal de resultados: control del simulador de seis desenlaces, hasta tres alternativas comparables en columnas con su tabla de grilla semanal, indicador de granularidad, etiqueta del resultado y aviso de datos simulados; los desenlaces no viables explican sus causas y ofrecen las recuperaciones `Revisar los días restringidos` para `infactible`, `Volver a ejecutar el desenlace simulado` para `indeterminado` y `Ver las materias sin oferta` para `oferta-pendiente`;
- un panel modal fijo y flotante sobre el grafo que migra con el desplazamiento horizontal del canvas: empieza a la derecha, pasa a la izquierda desde el 20 % y vuelve a la derecha solo por debajo del 15 %.

El panel no tiene título ni línea de ayuda: los retiró para hacer lugar a la restricción y a la preferencia, y conserva su nombre accesible mediante `aria-label`.

## Datos simulados

La oferta, los cupos, las franjas, las aulas, las capacidades y los docentes vienen de `comun/datos-simulados.js`, que **no es una fuente institucional**: los nombres, las capacidades y los horarios son inventados y no contienen datos personales reales.

La cobertura es deliberadamente parcial: solo las materias no aprobadas tienen oferta. C24 no tiene cátedra y C25/C26 tampoco la tienen en `2A · 2026`, para poder ejercitar el estado «datos incompletos». En este escenario hay cinco materias con oferta en `1B · 2026` y cuatro en `2A · 2026`; toda materia marcada sin oferta igualmente cuenta entre las tres materias máximas del borrador del bimestre.

El período de cada cátedra **es** su bimestre: `1B · 2026` es el bimestre B del primer cuatrimestre y `2A · 2026` el bimestre A del segundo.

## Edición

Los datos de las materias y las correlatividades siguen en `app.js`, en los arreglos `courses` y `edges`, y la oferta vive en la capa compartida. `periodStateOverrides` aplica estados efectivos por período sin mutar esos datos base; los borradores por período siempre empiezan vacíos y solo guardan decisiones de planificación. `acceptedPlanByPeriod` conserva el plan aceptado de cada período: al aceptar, reemplaza el plan aceptado de ese período por el borrador vigente. `scrollRatio` mide el desplazamiento del canvas; `preferredPanelSide` aplica la histéresis —derecha al inicio, izquierda desde el 20 % y vuelta a la derecha solo por debajo del 15 %— y `updatePanelSide` escribe el lado tanto en el panel como en el canvas. Al abrir la selección, el panel es un modal fijo que flota sobre el grafo: no reserva ni reduce la huella del canvas. Por ello, las tarjetas pueden quedar detrás del panel.

## Advertencia

Los nombres y estados de las materias se transcribieron visualmente del SVG del repositorio y deben contrastarse con la fuente académica antes de usarlos como reglas de dominio.

El producto principal de este mockup es `discoveries.md`, no el código: contiene las ocho correcciones de la revisión, la funcionalidad que la interfaz necesita y los datos no proveen, y siete requerimientos candidatos derivados.
