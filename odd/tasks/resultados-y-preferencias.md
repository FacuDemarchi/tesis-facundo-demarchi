# Resultados y preferencias del panel

**Objetivo.** Extender `panel-seleccion/` con las dos piezas que faltan de la etapa de selección —las preferencias del alumno y las limitaciones por día— y con la etapa de resultados, que hoy es solo un marcador.

**Por qué extender y no crear otro mockup.** El usuario pidió explícitamente **no multiplicar interfaces**: todo vive en la misma página, y los resultados se muestran en un **segundo modal sobre el grafo**, no en una vista propia.

## Decisiones que enmarcan

- **D-02**: las preferencias se declaran en cinco dimensiones —cátedra, profesor, modalidad, franjas y cantidad de días— y cada una es **restricción configurable** o **criterio de optimización**.
- **Limitación por día** (decidida el 2026-09-18): es una **regla dura**. Si no hay forma de armar la cursada sin usar un día bloqueado, el resultado es **infactible** y la explicación señala el día como causa. El alumno puede bajar el nivel a criterio si quiere ver alternativas que lo usen.
- **D-11**: la guarda de foco se mantiene. El **modal de resultados sí puede tapar materias**, porque en esa etapa el grafo no es lo importante; el usuario lo autorizó explícitamente.
- **D-13**: el indicador de granularidad va en el resultado, no en el borrador.
- **D-18**: el cierre ofrece descargar un PDF, con leyenda visible y como requerimiento candidato.

Los seis desenlaces de CP-SAT que la interfaz debe distinguir, y la funcionalidad que falta, están en `panel-seleccion/discoveries.md`.

## Alcance

- El panel gana **dos bloques**: disponibilidad y preferencias de cursado.
- El panel **pierde** su título y su línea de ayuda, para hacer lugar.
- Un **segundo modal** sobre el grafo, abierto por el botón de cierre, con los resultados.

## Tareas

- [x] **T6 — Restricción y preferencia de profesor en el panel.** Bloque **RESTRICCIÓN** visible, con los seis días como alternadores y una línea que declara que es una restricción dura y qué pasa cuando no hay salida. Las comprobaciones locales advierten una materia marcada cuyas cátedras caen solo en días bloqueados. Cada materia marcada contiene una preferencia blanda de profesor, expandible y limitada a los docentes de sus cátedras publicadas del período; no tiene selector de nivel. Se eliminaron las dimensiones de cátedra, modalidad, franjas y cantidad de días, junto con su estado. Validación: TDD desactivado; comprobación Puppeteer y `node --check panel-seleccion/app.js`.

  **Evidencia**: `ecc4c0a` (el nombre de la materia pasa a ser la cabeza del desplegable de profesores) y `ecd1270` (la documentación del panel se alinea con la interfaz simplificada). El segundo corrige la deriva que `f2a649b` introdujo: la sección T6 de `discoveries.md` describía las cuatro dimensiones de preferencia que ese mismo commit había eliminado, y se contradecía con su propia subsección de reducción de alcance. Verificado con 14 aserciones sobre el mockup servido: el `aria-label` que reemplaza al título, los seis días, la ausencia de cualquier `select` u opción de nivel, la ausencia del encabezado y la línea de ayuda retirados, C23 listando D04, C24 cayendo en el estado vacío sin lista fabricada, y el aviso de día bloqueado nombrando C23 y martes.
- [x] **T7a — Modal de resultados: estructura, desenlace simulado y alternativas comparables.** Segundo modal sobre el grafo, abierto por el botón que cierra la selección. Incluye la capa de datos simulados de resultados (`comun/resultados-simulados.js`), el control que recorre los seis desenlaces, las hasta tres alternativas comparables en columnas con su distribución semanal en grilla, el indicador de granularidad (D-13) y la etiqueta de resultado de D-10. Los desenlaces sin alternativas muestran su título y su resumen; su explicación y sus acciones de recuperación son T7b. No simula que el solver exista: los resultados son datos simulados y deben declararlo.

  **Decisiones cerradas con el autor el 2026-09-19**: una corrida simulada con un control que recorre los seis desenlaces, y hasta tres alternativas comparables en columnas lado a lado con la grilla semanal debajo de cada una.

  **Revisión del 2026-09-19 (corrección del autor): la planificación no ejecuta CP-SAT.** El autor corrigió el alcance: en el período de planificación el motor no corre, y las materias marcadas pasan directamente a `Planificada` en ese período. Consecuencias, todas cerradas con el autor:
  1. **El modal de resultados es superficie del período actual** (`Inscribir`), el único que ejecuta CP-SAT. La variante de etiqueta `condicionada` queda sin uso y se retira con los datos de resultado del período de planificación.
  2. **En el período siguiente, `Aceptar` aplica el plan**: las materias del borrador pasan a `Planificada` en el grafo de ese período, el borrador se conserva intacto y la selección sigue abierta. Aceptar reemplaza el plan aceptado de ese período por el borrador vigente.
  3. **La etiqueta de entrada del período siguiente vuelve a `Planificar`**, que es lo que `README.md` ya documentaba mientras `app.js` decía `Generar alternativas`: esta unidad corrige esa deriva.
  4. **La granularidad nombra la materia, no solo su identificador** (`C24 · Sistemas operativos`).

  **Dos defectos encontrados por la verificación independiente y corregidos**: `horas` sin definir en `alternativeMetrics()` (el render de toda alternativa lanzaba `ReferenceError` y el modal quedaba sin contenido) y `!offersFor(...)` sobre un arreglo —siempre verdadero— que dejaba el indicador de granularidad fijo en `cátedra`. El segundo no lo cubría la comprobación del escritor: su script re-derivaba las métricas desde el archivo de datos y nunca ejercitaba el render.

  **Evidencia**: `comun/resultados-simulados.js` (nuevo: seis desenlaces del período actual, con sus alternativas y sus explicaciones), `panel-seleccion/{index.html,app.js,styles.css}` y `decisiones.md` (D-10 revisada). `node --check` pasa en los dos archivos JS; los greps de `Generar alternativas` y `condicionada` sobre `panel-seleccion/` y `comun/` no devuelven nada. **La comprobación de navegador del escritor no llegó a ejecutarse** (su script en `/tmp/escritor-t7a/` no estaba autorizado en esa unidad), así que la evidencia de comportamiento es la verificación independiente.

  **Verificación independiente** (`/tmp/verif-t7/independent-t7b.cjs`, evidencia en `/tmp/verif-t7/evidence-t7b.json`), sobre el mockup servido con Chromium real: once requisitos aprobados. Etiquetas de entrada exactas (`Iniciar la inscripción` / `Planificar`) y `Generar alternativas` ausente de la página renderizada. El modal abre en `1B · 2026` con foco en `#results-close` y etiqueta `válida para inscripción`; en `2A · 2026` ninguna aceptación ejercida abrió modal ni scrim. Las tarjetas marcadas pasaron de `• Disponible` a `P Planificada` con clase `planned`, conservando `aria-pressed="true"`, el contador `Bimestrales 2/3 - Cuatrimestrales 2/6`, el panel abierto y el CTA habilitado. El plan es por período (en `1B` las mismas materias no aparecen planificadas) y reaceptar lo reemplaza (C24 volvió a `Sin cátedra` y C23 siguió `Planificada`). Las tres cadenas de granularidad quedaron medidas, incluida la vuelta a `cátedra` al desmarcar C24, y con C24 marcado el texto es `materias con oferta pendiente: C24 · Sistemas operativos`. Los tres vectores de métricas del período actual son `3/2/10/2`, `3/4/10/0` y `3/5/10/0`, con días y horas rederivados de las grillas de cada alternativa y coincidentes. Cero errores de página y cero de consola, sin `ReferenceError`.

  **Salvedad registrada, y cómo se cerró.** El verificador marcó el requisito 3 como parcial: todas las vías de aceptación que ejercitó dejaron el modal oculto, pero no agotó todas las vías posibles. El orquestador lo cerró por lectura de código, no por medición: `resultsModal.hidden = false` aparece una sola vez, dentro de `openResults()`, y esa función tiene un único llamador, `advanceStage()`, detrás de `currentPeriod().runsSolver`, que es `false` para el período de planificación. Queda como argumento de código, no como medición.

  **Cambio de expectativa que introduce T7b**: la verificación de esta unidad observó que `infactible` y `oferta-pendiente` no renderizan tarjeta ni tabla y muestran la línea declarada de ausencia de alternativas. T7b agrega la explicación y las acciones de recuperación en ese lugar, así que esa observación queda superada por la unidad siguiente, no contradicha.

  **Revisión nativa**: pendiente. T7a y T7b se revisan juntas como un solo candidato, la interfaz de resultados completa.

  **Sin commitear**: pendiente de autorización del autor.
- [x] **T7b — Explicación de los desenlaces no viables y acciones de recuperación.** Infactibilidad explicada con el día restringido como causa nombrada, estado indeterminado por límite temporal con la solución parcial declarada, y oferta pendiente a nivel de materia con las materias sin oferta nombradas. Cada desenlace no viable gana sus acciones de recuperación y su explicación. Cierra además la documentación del mockup (`README.md`, `discoveries.md`) y la evidencia de las dos unidades.

  **Evidencia**: `panel-seleccion/{app.js,styles.css,README.md,discoveries.md}`. `comun/resultados-simulados.js` **no se tocó**: sus explicaciones ya eran consistentes y las acciones son comportamiento, no dato. `node --check` pasa. La comprobación de navegador del escritor (`/tmp/escritor-t7b/check-t7b.cjs`) pasó: los cuatro desenlaces ejercitados, cero errores de página y de consola; su primer intento falló por usar `page.selectOption`, que es API de Playwright y no existe en puppeteer-core.

  **Medición del orquestador** (`/tmp/verif-t7/recovery-probe.cjs` → `probe-out.json`), con interacción real y sin `page.mouse.wheel`: `infactible` muestra la línea declarada, el encabezado `Por qué no hay solución`, dos causas y la acción `Revisar los días restringidos`; al activarla el modal y el scrim quedan ocultos, el panel vuelve con C23 y C24 marcadas y su contador `2/3 - 2/6` intacto, el foco queda en el alternador `lunes` de la restricción y el anuncio es `Volver a la selección para revisar los días restringidos.` `indeterminado` muestra una alternativa con `Parcial, sin garantía de optimalidad`, el encabezado `Qué alcanzó a probar el motor`, dos causas y la acción `Volver a ejecutar el desenlace simulado`; al activarla cambian cero tarjetas, cero tablas, el desenlace y el borrador, y el anuncio declara `La maqueta no ejecuta un motor: se vuelve a mostrar el mismo desenlace simulado (Estado indeterminado por límite temporal).` `oferta-pendiente` con C24 marcada lleva el foco al acordeón de C24, lo expande con `No hay cátedras publicadas para elegir profesor en este período.` y anuncia `C24 no tiene cátedras publicadas en 1B · 2026; el acordeón muestra el estado vacío.`; sin ninguna marcada sin oferta vuelve sin expandir y anuncia `No hay materias marcadas sin oferta publicada en 1B · 2026.` Los desenlaces viables no contienen bloque de explicación ni botones de acción, y sus métricas siguen siendo `3/2/10/2`, `3/4/10/0` y `3/5/10/0`.

  **Cobertura de verificación, con su límite declarado.** La verificación independiente (tarea `mu92qtvj-c-1-vix`, script `/tmp/verif-t7/independent-t7b.cjs`) volvió a aprobar el flujo y el contenido de T7a —etiquetas de entrada, planificación sin modal, plan por período, las tres cadenas de granularidad, los tres vectores de métricas con días y horas rederivados, los cuatro cierres, los seis días, el acordeón, los contadores y la migración de lado— con cero errores de página y de consola. **No midió el comportamiento de las acciones de recuperación**: reutilizó el script de la unidad anterior y su rol le prohíbe autorar instrumentación nueva. Esa parte queda medida solo por el orquestador, y el candidato entra a revisión nativa, que es el control independiente que la cubre.

  **Falso positivo registrado.** El verificador marcó como fallo una lectura literal de la comprobación de honestidad porque el modal contiene, además del aviso de datos simulados, la línea `Control de la maqueta: en el prototipo real el desenlace lo determina CP-SAT, no el estudiante.` Es la etiqueta del control del simulador y no afirma que la maqueta haya ejecutado nada, que es lo que la comprobación perseguía: ningún texto visible declara una corrida real.

  **Revisión nativa**: en curso sobre el candidato completo (T7a + T7b).

  **Sin commitear**: pendiente de autorización del autor.
- [x] **T8 — Segunda pasada del autor sobre el panel.** Cinco cambios en una sola unidad: el encabezado muestra los contadores de carga como una sola línea de texto («Bimestrales n/3 - Cuatrimestrales n/6»), con el límite superado en rojo y sin contador de materias marcadas, y la sección **Carga conocida se retira** para no duplicar el número; se eliminan **seis textos** (el eyebrow, el badge de materias marcadas, la nota de restricción dura, la nota de oferta conocida, la leyenda de preferencia blanda y la nota bajo el botón); el cuadro **Comprobaciones locales se retira con su cálculo**, así que los avisos de día bloqueado, de tope superado y de correlatividad dejan de existir en el mockup por decisión explícita del autor; se elimina el **atenuado y el resaltado** de correlatividades al marcar, porque el autor necesita marcar varias materias a la vez; y el desplegable de profesores pasa a ser un **acordeón real** con indicador visible, colapsado por defecto, encabezado con el nombre de la materia y cuerpo con los nombres de los docentes.

  **Reversión registrada.** El 2026-09-19 el autor revirtió su decisión anterior de que la falta de afordancia fuera deliberada: al ver el panel en el navegador no encontró la funcionalidad, porque el nombre se leía como texto plano. El hallazgo `R3-TOGGLE-AFFORDANCE` tenía razón en la práctica.

  **Evidencia**: revisión nativa `review-f1cbe6f1594f44f1`, riesgo medio, lente de confiabilidad, **aprobada y reconocida** (autoridad quemada). 61 aserciones de aceptación propias sobre el mockup servido, todas pasan; `node --check panel-seleccion/app.js` pasa; cero referencias muertas a los identificadores retirados. Ejecutado por `gentle-ai-worker`. **Sin commitear**: pendiente de autorización del autor.

## Formato de trabajo

**TDD desactivado** (configuración vigente del proyecto): la comprobación de cada unidad es `node --check` sobre los archivos tocados más una verificación independiente sobre el mockup servido en `http://127.0.0.1:8080/panel-seleccion/`, con un Chromium real. El runner disponible es `/tmp/verif-t7/` (puppeteer-core 23.11.1) y el binario está en `~/.cache/puppeteer/chrome/linux-153.0.8010.36/`.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo. El push y el PR quedan a decisión del usuario. El producto de cada tarea es lo que agrega a `discoveries.md`, no el código.

## Fuera de alcance

- **La descarga en PDF (D-18) queda sin efecto por decisión del autor (2026-09-19).**
- **Ejecutar el motor en el período de planificación**: el autor lo excluyó el 2026-09-19. La planificación declara intención y pasa las materias marcadas a `Planificada`; no optimiza.
- Escribir 7.2.5 en el documento de tesis: **el usuario pidió explícitamente no proceder con eso** hasta que lo autorice, y prefiere completar el diseño de todas las interfaces primero.
- La rama institucional (CU-10, CU-11, CU-13, CU-14), que sigue sin diseñar.
- Preferencias como pantalla propia: van en el panel.
