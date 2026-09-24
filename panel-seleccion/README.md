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

En `1B · 2026`, C19, C20 y C27 conservan su estado base planificado y son seleccionables; C25 y C26 permanecen `Bloqueadas`. En `2A · 2026`, una anulación explícita por período presenta C19, C20 y C23 como `Inscripta`: son contexto de inscripción existente, quedan deshabilitadas y no pertenecen al borrador. La misma anulación presenta C27 como `Disponible` y C25 y C26 como `Sin cátedra`, aunque su estado base para `1B` sea planificado o bloqueado, respectivamente, para que puedan planificarse.

**Los borradores y las inscripciones simuladas son por período y no se mezclan.** Tanto `1B · 2026` como `2A · 2026` empiezan vacíos. La inscripción existente es contexto visual del período, no una entrada de planificación: no aparece en la lista ni consume el máximo por bimestre configurado. En `1B · 2026`, confirmar una alternativa solo acumula como `Inscripta` la intersección entre sus asignaciones y el borrador vigente; limpia ese borrador y sus preferencias de profesor, sin afectar `2A · 2026`. Es un estado local del escenario simulado, no una inscripción institucional oficial. El período de planificación no ejecuta el motor: al aceptar, las materias marcadas pasan a `Planificada` en ese período.

**Una selección es una transacción por período.** Desde que se abre con `Iniciar la inscripción` o `Planificar` y mientras esté abierta la selección o sus resultados, ambos controles de navegación de período quedan deshabilitados y sus manejadores también rechazan llamadas programáticas. El bloqueo persiste al volver desde resultados y durante las recuperaciones. Solo termina al confirmar la inscripción, aceptar el plan o cancelar. `Cancelar` descarta para el período actual el borrador, las preferencias y expansiones de profesor, y los días no disponibles; no modifica inscripciones ni planes ya confirmados.

## Alcance

El mockup contiene:

- el grafo de 10 cuatrimestres, 46 materias y 26 correlatividades, con los ocho estados visuales;
- una barra de período cuyo botón de entrada cambia de etiqueta según el período: `Iniciar la inscripción` en `1B · 2026` y `Planificar` en `2A · 2026`; mientras la transacción de selección está activa, sus dos flechas quedan deshabilitadas;
- un panel flotante **no bloqueante**, que se abre con ese botón y no impide seguir marcando tarjetas;
- durante la selección, las materias aprobadas y bloqueadas permanecen deshabilitadas de forma nativa; `markCourse()` también rechaza agregarlas por llamada programática, mientras los demás estados conservan su comportamiento actual;
- un control etiquetado permite configurar el máximo por bimestre en 1, 2 o 3 materias (3 de forma predeterminada). El límite cuenta todas las marcas, incluida una materia sin cátedra publicada; al alcanzarlo, las demás tarjetas seleccionables se deshabilitan de forma nativa, pero las ya marcadas permanecen habilitadas para quitarlas. `markCourse()` defiende el mismo límite ante llamadas programáticas;
- el bloque **RESTRICCIÓN** de disponibilidad, con los seis días como alternadores de «no puedo asistir»;
- la preferencia de profesor de cada materia marcada: el **nombre de la materia es la cabecera de un acordeón**, contraído de forma predeterminada, cuyo cuerpo lista los docentes de sus cátedras publicadas en el período;
- el contador de carga en el encabezado del panel: el renglón bimestral refleja el total de materias marcadas del borrador actual contra el máximo configurado, incluso si una no tiene oferta publicada; el renglón cuatrimestral declara ese consumo como parcial, usa el límite efectivo `min(6, 2 × máximo configurado)` y nombra el bimestre hermano sin datos, sin presentarlo como un total completo;
- la intención derivada de cada materia marcada, de solo lectura: el estudiante no la elige y, para `no considerar`, sigue determinando el motivo visible fuera de la cabecera;
- el botón que cierra la selección: `Inscribir` abre el modal de resultados del período actual; `Aceptar` aplica directamente el plan del período siguiente, conserva el borrador, cierra la selección y devuelve el foco al CTA `Planificar`;
- el modal de resultados: control del simulador de seis desenlaces, hasta tres alternativas comparables en columnas con su tabla de grilla semanal, radios nativos para elegir una alternativa y un `Confirmar inscripción` separado; este solo se habilita si la alternativa elegida contiene al menos una materia marcada, confirma exclusivamente esa intersección y aclara cuando está vacía, además del indicador de granularidad, la etiqueta del resultado y el aviso de datos simulados; los desenlaces no viables conservan sus causas y las recuperaciones `Revisar los días restringidos` para `infactible`, `Volver a ejecutar el desenlace simulado` para `indeterminado` y `Ver las materias sin oferta` para `oferta-pendiente`;
- un panel modal fijo y flotante sobre el grafo que migra con el desplazamiento horizontal del canvas: empieza a la derecha, pasa a la izquierda desde el 20 % y vuelve a la derecha solo por debajo del 15 %;
- sobre el grafo, una rueda vertical normal desplaza horizontalmente el canvas sin necesitar Shift mediante una única animación suavizada; conserva los gestos horizontales de trackpad, Shift+rueda, Ctrl/Cmd+rueda para el zoom del navegador y el desplazamiento vertical nativo dentro del panel de selección y de la superposición de resultados. Si el sistema solicita movimiento reducido, el desplazamiento se aplica de inmediato.

El panel no tiene título ni línea de ayuda: los retiró para hacer lugar a la restricción y a la preferencia, y conserva su nombre accesible mediante `aria-label`.

## Datos simulados

La oferta, los cupos, las franjas, las aulas, las capacidades y los docentes vienen de `comun/datos-simulados.js`, que **no es una fuente institucional**: los nombres, las capacidades y los horarios son inventados y no contienen datos personales reales.

La cobertura es deliberadamente parcial: solo las materias no aprobadas tienen oferta. C24 no tiene cátedra y C25/C26 tampoco la tienen en `2A · 2026`, para poder ejercitar el estado «datos incompletos». En este escenario hay cinco materias con oferta en `1B · 2026` y cuatro en `2A · 2026`; toda materia marcada sin oferta igualmente cuenta contra el máximo configurable del borrador del bimestre.

El período de cada cátedra **es** su bimestre: `1B · 2026` es el bimestre B del primer cuatrimestre y `2A · 2026` el bimestre A del segundo.

## Edición

Los datos de las materias y las correlatividades siguen en `app.js`, en los arreglos `courses` y `edges`, y la oferta vive en la capa compartida. `periodStateOverrides` aplica estados efectivos por período sin mutar esos datos base. `enrolledByPeriod` conserva por separado las confirmaciones locales del escenario y tiene precedencia sobre el plan aceptado, las anulaciones y el estado base; no representa una inscripción oficial. Los borradores por período siempre empiezan vacíos y solo guardan decisiones de planificación. `acceptedPlanByPeriod` conserva el plan aceptado de cada período: al aceptar, reemplaza el plan aceptado de ese período por el borrador vigente. `scrollRatio` mide el desplazamiento del canvas; `preferredPanelSide` aplica la histéresis —derecha al inicio, izquierda desde el 20 % y vuelta a la derecha solo por debajo del 15 %— y `updatePanelSide` escribe el lado tanto en el panel como en el canvas. `translateVerticalWheelToHorizontalScroll` convierte solo la rueda vertical pura sobre el grafo en un destino acumulado de `scrollLeft`: normaliza líneas a 16 px y páginas al ancho visible, limita el destino a los bordes y una única animación lo aproxima al 25 % por cuadro. Para completar con `scrollLeft` entero, se ajusta al destino cuando falta como máximo 1 px —o cuando un paso redondeado no lo puede mover— y limpia el destino y el cuadro pendiente. Respeta `prefers-reduced-motion: reduce` aplicando el destino de inmediato; deja intactos `deltaX`, Shift, Ctrl/Cmd (zoom) y los orígenes del panel o de resultados, y cancela cualquier animación pendiente antes de devolverlos al navegador. Los listeners pasivos del modal de resultados y de su scrim también cancelan esa animación sin impedir su desplazamiento nativo. Al abrir la selección, el panel es un modal fijo que flota sobre el grafo: no reserva ni reduce la huella del canvas. Por ello, las tarjetas pueden quedar detrás del panel.

## Advertencia

Los nombres y estados de las materias se transcribieron visualmente del SVG del repositorio y deben contrastarse con la fuente académica antes de usarlos como reglas de dominio.

El producto principal de este mockup es `discoveries.md`, no el código: contiene las ocho correcciones de la revisión, la funcionalidad que la interfaz necesita y los datos no proveen, y siete requerimientos candidatos derivados.
