# Decisiones de diseño

> Registro único y autoritativo de las decisiones de diseño del prototipo. Cada decisión indica su contexto, las alternativas descartadas y sus consecuencias. Los hallazgos y preguntas abiertas viven en [`discoveries.md`](mockup/discoveries.md), que deberá plegarse a este archivo cuando los escenarios se unifiquen.

Clasificación usada (según la propuesta de los capítulos 6 y 7): **preliminar** (respaldado por el relevamiento), **supuesto de diseño** (necesario para construir y evaluar el prototipo), **pendiente de validación institucional** (requiere confirmación de la universidad) y **no contempla** (excluido explícitamente del alcance del prototipo y declarado en la sección homónima de la tesis).

---

## D-01 — La optimización se dispara con una acción explícita, con verificación local inmediata

**Fecha:** 2026-09-16 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Contexto.** Estaba sin definir si el estudiante "inscribe" materias de a una con retroalimentación inmediata, o si arma la selección completa y ejecuta el solver una sola vez. La decisión condicionaba toda la interfaz de planificación y el momento en que aparecen los estados de CP-SAT.

**Decisión.** Modelo híbrido, con dos caminos de retroalimentación diferenciados por costo:

1. **Verificación local inmediata.** Al marcar o quitar una materia se evalúan al instante las restricciones locales y deterministas (tope de materias, correlatividades, y —cuando existan datos— superposiciones y cupos simulados). Producen **advertencias**, nunca alternativas.
2. **Optimización global explícita.** Una única acción principal ejecuta CP-SAT sobre el escenario completo y produce **alternativas** comparables más la explicación de conflictos.

**Alternativas descartadas.**

- *CP-SAT automático en cada cambio:* la optimización es global y acoplada. Cada corrida operaría sobre un conjunto distinto de materias, de modo que las alternativas dejarían de ser comparables entre sí (RF-08), el costo se multiplicaría por la cantidad de materias contra RNF-01, y el estudiante vería resultados cambiar sin haber pedido nada.
- *Solo acción explícita, sin verificación local:* interfaz más simple, pero el estudiante arma una selección imposible y descubre el problema recién al final, cuando ya invirtió todo el trabajo de configuración.

**Consecuencias.**

- Los seis estados de CP-SAT documentados en `discoveries.md` pertenecen **únicamente** a la corrida explícita. Las advertencias locales son una categoría distinta y deben distinguirse visualmente.
- **El chequeo local y el solver deben derivar de una única definición de restricciones, parametrizada por período.** Si cada camino define las reglas por su cuenta, la interfaz puede informar "sin conflictos" y CP-SAT responder infactible. Es el riesgo de diseño más alto que introduce esta decisión.
- **Un motor con dos modos, no dos motores.** La tesis (§1 "Propuesta de solución general") distingue las restricciones duras por período: para el **período actual** son las correlatividades cumplidas según la normativa institucional, la oferta, los cupos y la incompatibilidad horaria; para el **período siguiente**, la inscripción vigente en una precorrelativa habilita únicamente una *intención condicionada*, que debe recalcularse con los resultados académicos oficiales antes de convertirse en inscripción. La misma definición de restricciones opera con datos definitivos en un caso e hipotéticos en el otro.
- **Dos operaciones, no una.** El prototipo asiste a la inscripción del período actual **y** a la planificación del siguiente (tesis §1, 2.1 y 3.1). D-01 rige para ambas; lo que cambia es la naturaleza de los datos de entrada y la etiqueta del resultado: "válida para inscripción" frente a "condicionada".
- Habilita RF-05 (hasta tres alternativas), RF-06, RF-07 y RNF-01.
- Obliga a registrar el escenario exacto usado en la corrida, con período, versión del plan, origen y fecha de los datos (RC-UX-05).

---

## D-02 — Dos niveles: intención por materia y preferencias de cursado

**Fecha:** 2026-09-16 · **Estado:** aceptada · **Reformulada:** 2026-09-16 para coincidir con la tesis; vocabulario alineado a §1 el 2026-09-17 · **Acotada:** 2026-09-18 · **Clasificación:** supuesto de diseño

**Contexto.** Al incorporar una materia al escenario hay que definir qué compromete esa acción. La formulación original de esta decisión ("marcar una materia declara intención; no fija comisión") resultó **más acotada que lo que la tesis ya compromete**. La sección 3.3 exige "el registro de preferencias obligatorias o deseables de cátedra, profesor, modalidad, días y franjas horarias", y 3.1 habla de "generar combinaciones de cátedras cuando exista oferta suficiente". Como una preferencia *obligatoria* es una restricción dura, la decisión anterior contradecía el documento. El texto normativo está en §1 "Propuesta de solución general": "Las preferencias del estudiante por un profesor, cátedra, modalidad, franja horaria, cantidad de días de cursado y horas libres se tratarán como **restricciones configurables o criterios de optimización**."

**Decisión.** Se distinguen dos niveles que no deben mezclarse:

1. **Intención por materia.** Agregar o quitar una materia declara únicamente intención, con tres valores ya establecidos en `discoveries.md`: *deseada*, *requerida en esta planificación* y *no considerar*. Esta acción **no selecciona comisión**: la combinación de cátedras la resuelve el solver.
2. **Preferencias de cursado.** De forma separada y explícita, el estudiante declara preferencias sobre profesor, cátedra, modalidad, franja horaria, **cantidad de días de cursado** y **horas libres**. Siguiendo el vocabulario de la tesis, cada una se trata como:
   - **restricción configurable** — se incorpora como restricción dura que el solver debe respetar; o
   - **criterio de optimización** — ordena las alternativas válidas sin descartarlas.

   Las dos últimas dimensiones no estaban en la formulación anterior de esta decisión y sí están comprometidas por la tesis.

**Alternativas descartadas.**

- *Seleccionar la comisión al marcar la materia:* mezclaría los dos niveles y haría parecer que elegir una materia compromete una cátedra antes de que el solver busque combinaciones.
- *Prohibir que una preferencia se configure como restricción:* contradice 3.1 y 3.3 y le quitaría al estudiante la capacidad de expresar restricciones reales, como no poder cursar un día determinado.

**Consecuencias.**

- La interfaz necesita dos superficies distinguibles: intención por materia, y preferencias de cursado con su nivel (restricción o criterio).
- Las preferencias configuradas como restricción son duras: si se contradicen, el resultado es infactible y debe explicarse con las restricciones involucradas (RF-07).
- Las restricciones configurables y los criterios de optimización **no comparten camino**: las restricciones entran en el chequeo local y en el solver (D-01); los criterios solo ordenan resultados válidos.
- La comparación de alternativas (RF-08) conserva sentido: dos alternativas pueden diferir en comisiones, no solo en materias.
- Reemplaza la formulación anterior, que dejaba las exigencias de cátedra como capacidad futura. Ese recorte ya no es válido: la tesis lo compromete en el alcance del MVP.

**Acotación del 2026-09-18.** El alcance de las preferencias se redujo por decisión del autor: la interfaz ofrece **una sola preferencia**, la del profesor de cada materia, tratada como criterio de optimización, y **un solo bloque de restricciones**, los días en que el estudiante no puede cursar, tratado como restricción dura. Cátedra, modalidad, franjas horarias y cantidad de días de cursado dejaron de tener dónde declararse, y el autor eligió ajustar el documento antes que conservar capacidades que el prototipo no ofrece. §1 y §3.3 se ajustaron en el mismo sentido; ver «Preferencias acotadas el 2026-09-18».

---

## D-03 — El verbo "inscribir" se reserva para el período actual y nunca describe una intención condicionada

**Fecha:** 2026-09-16 · **Estado:** aceptada · **Acotada:** 2026-09-17 · **Clasificación:** preliminar

**Contexto.** El lenguaje de la interfaz determina si el estudiante cree que ya quedó inscripto. La formulación original prohibía la palabra "inscribir" en toda la fase de planificación, lo que entraba en conflicto innecesario con la tesis, que habla de "la inscripción del período académico actual".

**Decisión.** El vocabulario se separa por período:

- **Período siguiente.** Se habla de *marcar*, *agregar al escenario* o *declarar una intención condicionada*. Nunca "inscribir": una intención condicionada depende de resultados y oferta no confirmados y debe revalidarse antes de cualquier inscripción real.
- **Período actual.** La tesis (§1, 3.1 y 3.3) habla explícitamente de "asistencia a la inscripción del período académico actual", y 3.2 aclara que el prototipo **no efectuará inscripciones definitivas**. El término es legítimo ahí porque nombra aquello a lo que se asiste, no una acción que el prototipo ejecute.
- **Nunca**, en ningún período, una acción del prototipo se presenta como una inscripción ya efectuada.

**Consecuencias.**

- Satisface RC-UX-09 (no ofrecer acciones que puedan confundirse con una inscripción oficial).
- Los estados `Inscripta` y `Solicitud en revisión` del mapa describen la situación académica real del estudiante y no deben reutilizarse como resultado de una planificación.
- No hay contradicción con 3.1: son dos períodos con vocabulario propio, no un mismo vocabulario mal usado.

---

## D-04 — Tope de tres materias por bimestre, seis por cuatrimestre

**Fecha:** 2026-09-16 · **Estado:** aceptada · **Clasificación:** no contempla (sección "No contempla" de la tesis)

**Contexto.** El prototipo no contempla que el estudiante curse más de tres materias por bimestre. La restricción no estaba documentada en la tesis.

**Decisión.** El escenario de planificación admite como máximo **3 materias por bimestre**, equivalente a **6 por cuatrimestre**. Es una restricción obligatoria y se verifica localmente: al intentar marcar la cuarta materia, la interfaz lo impide o advierte antes de cualquier ejecución del solver.

**Texto para la sección "No contempla" de la tesis:**

> El prototipo no contempla inscripciones de más de tres materias por bimestre, equivalentes a seis materias por cuatrimestre. La planificación se limita a ese máximo y no se modelan escenarios con una carga mayor.

Se recomienda conservar esta aclaración a continuación, para no afirmar una regla académica de la que no hay fuente:

> Esta limitación responde al alcance definido para el prototipo y no constituye una afirmación sobre la regla académica vigente en la universidad.

**Verificación contra los datos existentes.** Los tres escenarios simulados ya cumplen el tope: nunca hay más de tres materias `Inscripta` ni más de tres `Planificada`. Además, cada columna del grafo contiene como máximo seis materias, de modo que la capacidad representada es exactamente 6 por cuatrimestre = 2 bimestres × 3 materias.

**Consecuencias.**

- Es la primera restricción local concreta de D-01: no requiere solver y da retroalimentación instantánea.
- Acota fuertemente el espacio de búsqueda del solver.
- La "carga máxima personal" (`discoveries.md`) solo puede **reducir** este tope, nunca ampliarlo.
- **No confundir con RF-05.** RF-05 habla de *hasta tres alternativas de cursado*; este tope habla de *hasta tres materias por bimestre*. Son dos "tres" distintos y la tesis debe nombrarlos de forma inequívoca.
- Clasificada como **no contempla**: se declara en la sección homónima de la tesis, sin afirmar una regla académica de la que no hay fuente. Ver el texto propuesto más arriba.

---

## D-05 — Dos granularidades de resultado según haya oferta publicada

**Fecha:** 2026-09-17 · **Estado:** aceptada · **Clasificación:** preliminar (ya comprometida por la tesis)

**Contexto.** La tesis (§1 "Propuesta de solución general") define dos niveles de resultado posibles, y la interfaz debe soportar ambos:

> Cuando exista oferta publicada, generará alternativas de cátedras sin superposición; en caso contrario, planificará a nivel de materia y señalará que la oferta está pendiente.

**Decisión.** El resultado de una planificación tiene dos granularidades, y la interfaz debe declarar en cuál está operando:

1. **Nivel cátedra**, cuando la oferta del período está publicada: la alternativa indica cátedras concretas y garantiza ausencia de superposición.
2. **Nivel materia**, cuando la oferta todavía no se publicó: la alternativa indica materias y declara explícitamente que la oferta está pendiente; no puede afirmar nada sobre horarios ni cátedras.

**Consecuencias.**

- Una alternativa de nivel materia **no puede presentarse como válida para inscripción**, solo como condicionada.
- La comparación entre alternativas (RF-08) debe impedir o marcar la comparación entre resultados de distinta granularidad: comparar una alternativa con cátedras contra otra sin cátedras no es una comparación significativa.
- La interfaz necesita un indicador visible de granularidad, además de los seis estados de CP-SAT.
- Explica por qué el mockup puede mostrar el grafo completo sin datos de horarios: está operando en nivel materia, y debería decirlo.

---

---

## D-10 — El período actual genera alternativas y hay una sola pantalla de resultados

**Fecha:** 2026-09-18 · **Estado:** aceptada · **revisada el 2026-09-19** · **Clasificación:** preliminar

**Contexto.** El documento se contradecía sobre si el período actual produce alternativas. §3.3 exige que las alternativas presentadas para el período actual respeten correlatividades, cupos y carga; D-01 afirma que el motor rige para las dos operaciones; pero el flujo de CU-05 en la Tabla 6 solo «valida la selección resultante», y la Tabla 7 asocia RF-05 únicamente a CU-06, el caso del período siguiente.

**Decisión.** El período actual **también** genera alternativas con CP-SAT, sobre el escenario cerrado y en una única ejecución explícita. Hay **una sola pantalla de resultados** para los dos modos, y lo que cambia es la etiqueta: «válida para inscripción» en el período actual y «condicionada» en el siguiente.

**Alternativas descartadas.**

- *Que el período actual solo valide una selección que el estudiante arma:* dejaba a §3.3 sin respaldo y obligaba a dos pantallas de resultado, una para validar y otra para comparar.

**Consecuencias.** La Tabla 7 debe corregirse: RF-05 pasa de `CU-06` a `CU-05, CU-06`. El flujo de CU-05 necesita el paso de generación de alternativas. La comparación de alternativas (CU-08) y la granularidad del resultado (D-05) aplican a los dos modos.

**Revisión del 2026-09-19 — la planificación no ejecuta CP-SAT.** El autor corrigió el alcance: el período de planificación (el siguiente) **no ejecuta el motor**. Al aceptar el borrador, las materias marcadas pasan directamente a `Planificada` en ese período, el borrador por período se conserva y el panel de selección se cierra. El CP-SAT y la pantalla de resultados quedan como superficie del **período actual**, el de inscripción, con la etiqueta `válida para inscripción`; la variante `condicionada` queda sin uso y se retira junto con los datos de resultado del período de planificación. El botón de entrada del período siguiente vuelve a `Planificar`, porque ya no genera alternativas.

**Consecuencias de la revisión.**

- **Deja sin efecto la mitad de esta decisión**: la afirmación «el período actual también genera alternativas» sigue vigente; lo que cae es que los dos modos compartan pantalla de resultados, porque la planificación no produce resultados.
- **Tabla 7 vuelve a cambiar.** Con RF-05 ligada solo a CU-05, la corrección de D-10 queda sin efecto: el caso de uso del período siguiente no genera alternativas y no puede requerir el requisito de comparación de alternativas. Es deuda documental abierta, no un cambio aplicado.
- **Los seis desenlaces de CP-SAT y la granularidad del resultado son de la inscripción.** El desenlace de oferta pendiente a nivel de materia pierde su pantalla en el período de planificación: allí la oferta faltante se informa en el panel, no en un resultado.
- **Queda una tensión visible en el mockup**: el estado base `planificado` de las materias del escenario se presenta como `Disponible` —así lo hace también `mockup/`—, mientras que una materia que el estudiante acaba de planificar se presenta como `Planificada`. El motivo es que el estado base describe una planificación de otro período, que la vista actual no puede afirmar. La tensión queda registrada como hallazgo en `panel-seleccion/discoveries.md`.

---

## D-11 — El panel de selección es flotante y su lado lo decide el desplazamiento

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Contexto.** La selección necesita verse mientras se marcan materias, y el grafo es la superficie de entrada. Un panel acoplado al costado reduciría el ancho disponible de un grafo que ya mide 3444 px.

**Decisión.** El panel es **flotante y no bloqueante**: flota sobre el grafo sin interceptar los clics fuera de él, de modo que el estudiante sigue marcando tarjetas con el panel abierto. Su lado lo decide el **desplazamiento horizontal**: a 0 % se ancla a la derecha y desde el 20 % pasa a la izquierda, con histéresis que solo vuelve por debajo del 15 %.

**Alternativas descartadas.**

- *Un modal:* bloquea la página y vuelve inerte el grafo, así que no se puede marcar mientras se ve la selección. Fue el defecto de la primera versión del mockup.
- *Que el lado lo decida la posición de las materias pendientes:* fue la primera implementación y resultó contraintuitiva. El panel arrancaba a la izquierda y se mudaba a la derecha al avanzar, al revés de lo esperable: debe correrse a medida que el estudiante avanza, no empezar en el camino.

**Consecuencias.**

- Queda **una sola guarda**, la del foco de teclado, porque el proyecto cita WCAG 2.2 y su criterio 2.4.11 exige que el componente enfocado no quede totalmente oculto. Los descendientes del propio panel quedan excluidos: enfocar un control del panel no puede ser motivo para que el panel se mueva. Sin esa exclusión el panel se aleja del control que el usuario acaba de enfocar, que es el defecto crítico que abrió la revisión nativa.
- **Costo aceptado:** a 0 % de desplazamiento el panel tapa C23 y C24 en el escenario actual. Se resuelve desplazándose un 20 %, o enfocando cualquiera de esas tarjetas.

---

## D-12 — La intención de cada materia se deriva; el estudiante no la elige

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Contexto.** D-02 define tres valores de intención —`deseada`, `requerida en esta planificación` y `no considerar`—, y la primera versión del mockup los ofrecía como un selector. D-02 dice que agregar o quitar una materia **declara** una intención, no que el estudiante la seleccione de una lista.

**Decisión.** El estudiante marca o desmarca; el sistema deriva la intención. La derivación es conservadora: una materia cargada desde la planificación existente del escenario queda `requerida en esta planificación`; una marcada durante la sesión, `deseada`; una bloqueada, `no considerar`, con su correlatividad pendiente como motivo visible. `disponible`, `sin cátedra` y `sin cupo` entran como `deseada`.

**Alternativas descartadas.**

- *Derivar `requerida` por impacto curricular*, marcando como dura toda materia que habilita otras también marcadas: aprovecha el grafo y RF-16, pero el sistema decidiría solo qué es duro, y una cadena de correlatividades podría volver infactible el problema sin que el estudiante lo haya pedido.

**Consecuencias.**

- Solo es dura la materia que el estudiante ya había comprometido. La flexibilización que describe `discoveries.md` —cambiar una materia de requerida a deseada— sigue disponible en la etapa de optimización.
- RF-19 exige que `no considerar` no sea silencioso: el motivo se muestra en el panel.
- Queda abierto cómo se traduce `no considerar` a restricciones y flexibilizaciones de CP-SAT (`RC-UX-15`).

---

## D-13 — La granularidad pertenece al resultado, no al borrador

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Clasificación:** preliminar

**Contexto.** La primera versión del panel mostraba un indicador de granularidad. RF-13 pide informar la granularidad **del resultado**: nivel de cátedra con oferta publicada y nivel de materia cuando está pendiente. D-05 lo confirma y agrega que la interfaz necesita un indicador visible.

**Decisión.** El indicador sale del borrador y va a la pantalla de resultados de la optimización. En el panel queda solo la nota de que el contador cuenta únicamente materias con oferta publicada, que es lo que el chequeo local necesita.

**Alternativas descartadas.**

- *Dejarlo en el panel:* no informa nada antes de ejecutar el motor, porque la granularidad describe lo que el resultado va a poder afirmar.

**Consecuencias.** El indicador es una obligación de la pantalla de resultados, que todavía no existe. Se registra como pendiente de 7.2.5.

---

## D-14 — Dos botones con trabajos distintos: abrir la etapa y cerrarla

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Clasificación:** preliminar

**Contexto.** La primera versión tenía dos botones con el mismo texto y la misma promesa: el de la barra y el del panel. Ninguno de los dos decía qué cerraba ni qué abría.

**Decisión.** El botón de la **barra de período** abre la etapa de selección, y su etiqueta cambia con el período: «Iniciar la inscripción» en el actual y «Planificar» en el siguiente (D-03). El botón del **panel** queda deshabilitado con el borrador vacío y cierra la selección en ambos períodos. «Inscribir» abre la optimización y los resultados simulados solo para el período actual. «Aceptar» aplica directamente el borrador de planificación: conserva ese borrador, muestra las materias como `Planificada`, cierra el panel y devuelve el foco al CTA «Planificar»; no ejecuta CP-SAT ni abre resultados.

**Alternativas descartadas.**

- *Un solo botón para las dos cosas:* deja al estudiante sin saber si está abriendo un borrador o ejecutando el motor.
- *El mismo texto en los dos períodos:* desaprovecha el vocabulario de D-03 justo donde distingue períodos.

**Consecuencias.** La etapa de optimización y sus seis resultados pendientes solo pertenecen a la inscripción del período actual; el mockup los presenta como resultados simulados, sin ejecutar el solver. La planificación se confirma al aplicar el plan y volver al CTA de entrada con el borrador disponible al reabrirlo. Esta decisión reemplaza la variante anterior en la que aceptar la planificación conservaba el panel abierto.

---

## D-15 — La evaluación institucional se activa explícitamente y no aplica traslados

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Revisada:** implementación demostrativa de CU-13 · **Revisada parcialmente por D-21:** el disparador explícito y la frontera de solo lectura se conservan; el alcance local de la evaluación queda supersedido. · **Clasificación:** pendiente de validación institucional

**Contexto.** La versión original de esta decisión proponía disparar la evaluación automáticamente al cruzar el umbral de demanda y aplicar el traslado en el escenario simulado. Esa formulación conservó la intención de responder temprano a la falta de cupo, pero ocultaba el proceso que el prototipo necesita hacer visible y validar con el operador institucional.

**Decisión.** En el prototipo actual, la evaluación comienza solo cuando el operador activa explícitamente `Evaluar resolución` en una materia del período actual con alumnos fuera de cupo. El resultado es una demostración de solo lectura dentro de la misma tarjeta: evalúa capacidad, tipo de aula y disponibilidad horaria, pero no traslada aulas, no modifica datos compartidos, no altera inscripciones, no asigna alumnos fuera de cupo ni aprueba o abre nada.

El disparador automático al aparecer demanda fuera de cupo queda como **evolución futura**, no como comportamiento actual. También queda fuera del prototipo cualquier aplicación automática, aun sobre el escenario simulado.

**Alternativas descartadas.**

- *Disparo automático al cruzar el umbral:* se conserva como evolución posible, pero en esta etapa reduciría la visibilidad del filtro y dificultaría su validación por el operador.
- *Aplicar el traslado en el escenario simulado:* confundiría evaluar una alternativa con ejecutarla y debilitaría la frontera de solo lectura del caso demostrativo.

**Consecuencias.**

- La interfaz muestra la acción únicamente cuando hay alumnos fuera de cupo en el período actual, y el resultado debe explicar por qué un aula pasa los filtros o indicar que no existe una compatible.
- Si no hay aula compatible, evaluar una sección nueva corresponde a CU-11; la evaluación no crea esa propuesta.
- La formulación histórica automática y de aplicación simulada queda reemplazada por esta revisión. Por lo tanto, no se requiere reformular §3.2, §3.4 ni RF-26 para admitir modificaciones automáticas: el prototipo no las produce.
- El traslado sigue sin necesitar docente nuevo, mientras que una sección nueva sí lo requiere; esa distinción explica por qué CU-13 evalúa primero el traslado y CU-11 trata la apertura por separado.

---

## D-16 — La evaluación de aulas es un filtro determinista, no una corrida del solver

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Revisada parcialmente por D-21:** se conserva que el prototipo no ejecuta CP-SAT; el filtro local por sección y su algoritmo quedan supersedidos por una búsqueda exacta global. · **Clasificación:** supuesto de diseño

**Contexto.** D-15 define en el prototipo actual una evaluación demostrativa que el operador activa explícitamente. Esa evaluación debe comprobar capacidad, tipo de aula y disponibilidad sin ejecutar el solver ni aplicar un traslado.

**Decisión.** La evaluación de aulas es un **filtro**: capacidad suficiente y disponibilidad en la franja horaria de la cátedra. No usa CP-SAT.

**Alternativas descartadas.**

- *El mismo motor que las alternativas:* unificaría el mecanismo y resolvería el caso de varias propuestas compitiendo por las mismas aulas, pero introduciría costo y aislamiento de solver en una evaluación que hoy es determinista y demostrativa.

**Consecuencias.**

- El filtro es explicable, que es lo que pide RNF-03: «esta aula no sirve porque su capacidad es 40 y la demanda es 62».
- Es barato y determinista; esas propiedades sostienen la evaluación explícita actual y dejan abierta una automatización futura si se autoriza.
- Queda como límite conocido: si varias propuestas compiten por las mismas aulas, un filtro deja de alcanzar.

**Nota histórica.** Esta decisión documenta el filtro local implementado originalmente. D-21 reemplaza únicamente ese alcance y algoritmo para el prototipo actual; no modifica la ausencia de CP-SAT, el disparador explícito ni la prohibición de aplicar cambios.

---

## D-17 — Transición futura de la intención ante una ampliación de capacidad aplicada

**Fecha:** 2026-09-18 · **Estado:** pendiente · **Clasificación:** pendiente de validación institucional

**Contexto.** RF-21 conserva la intención de una materia sin cupo con estado `planificada` y motivo `falta de cupo`. Una transición solo sería pertinente si una transferencia de aula, autorizada y aplicada por separado, ampliara efectivamente la capacidad. La evaluación actual de CU-13 es de solo lectura y no aplica traslados ni activa esta transición.

**Decisión.** Si en una evolución futura se autoriza y aplica una transferencia que amplíe la capacidad, la intención podría transicionar a habilitada para inscripción y el estudiante debería verlo en el panel. Esa transición no forma parte del prototipo actual.

**Alternativas descartadas.**

- *Dejarla `planificada` marcada como «cupo liberado» tras una ampliación aplicada:* sería más conservador, pero dejaría dos estados parecidos conviviendo y obligaría al estudiante a realizar un paso que el sistema ya conocería.

**Consecuencias.** No hace falta un requerimiento ni una transición de dominio para el CU-13 actual. Si se autoriza la evolución futura, harán falta un requerimiento nuevo, la transición correspondiente y la definición del consentimiento y aviso que la acompañen.

---

## D-18 — El cierre ofrece descargar un PDF, como requerimiento candidato

**Fecha:** 2026-09-18 · **Estado:** aceptada · **Clasificación:** pendiente de validación institucional

**Contexto.** El prototipo no inscribe (§3.2), así que el recorrido del período actual termina en una selección válida sin efecto. El estudiante necesita algo concreto para llevar al sistema oficial.

**Decisión.** El cierre ofrece **descargar un PDF** con la selección y la trazabilidad del escenario. Entra como **requerimiento candidato**, no como funcionalidad comprometida, y su pendiente es que **la institución acepte el documento** como respaldo de la selección. Se describe en la prosa de 7.2.5 como función del cierre, no como paso numerado del flujo de CU-05.

**Alternativas descartadas.**

- *Solo datos en JSON o CSV:* evita cualquier parecido con una constancia oficial, pero no es lo que un estudiante lleva a bedelía.
- *Entrar como requerimiento funcional comprometido:* una descarga generada en el cliente no tiene dependencia técnica que justifique un candidato, pero tampoco la tiene para exigir un caso de prueba en el MVP.

**Consecuencias.**

- **La leyenda no puede ser una nota al pie**, porque D-03 prohíbe presentar una acción como una inscripción ya efectuada: el documento debe declarar que es una selección simulada y no una inscripción, llevar la trazabilidad de RF-20 —período, versión del plan, origen y fecha de los datos, restricciones y preferencias— y decir que la inscripción se realiza en el sistema oficial. Sin membrete institucional y sin la palabra «comprobante».
- **Un candidato no puede ser un paso numerado del flujo de un caso de uso comprometido.** La prueba está en el propio documento: RC-05 es candidato y no aparece en el flujo de CU-05.
- Se implementa con **hoja de impresión y la exportación a PDF del navegador**: no suma dependencias, no retiene nada en el servidor, y es la misma pantalla de resultados. Descargar no es compartir: compartir sí necesitaría la decisión de privacidad abierta en RC-08.

---

## D-19 — La inscripción simulada exige elegir y confirmar una alternativa

**Fecha:** 2026-09-20 · **Estado:** aceptada · **Clasificación:** preliminar

**Contexto.** Mostrar alternativas como resultado no define si una de ellas cambia el estado del estudiante ni qué materias se trasladan desde un borrador que puede no coincidir con la combinación mostrada. Una selección implícita confundiría la exploración del resultado con una acción de inscripción.

**Decisión.** Cada alternativa viable se elige primero mediante una tarjeta de radio nativa, identificada por el par `desenlace + alternativa`, y la confirmación se realiza con el botón separado `Confirmar inscripción`. Elegir no modifica el estado de ninguna materia. El botón solo se habilita cuando la intersección entre las materias del borrador vigente y las asignaciones de la alternativa elegida no está vacía; la confirmación acumula **solo esa intersección** en un estado local `Inscripta` por período. Si la intersección es vacía, el botón queda deshabilitado con una explicación visible. Las alternativas parciales de un resultado indeterminado siguen siendo elegibles; un desenlace sin alternativas conserva sus acciones de recuperación y no habilita la confirmación.

Al confirmar, el modal y su scrim se cierran sin reabrir la selección, el borrador y sus elecciones/expansiones de profesor se limpian, las restricciones de días se preservan, el canvas y la barra de período dejan de estar inertes y el foco vuelve a `Iniciar la inscripción`. El anuncio debe informar cantidad, período, limpieza del borrador y que el resultado pertenece al escenario simulado, no a una inscripción institucional oficial. Volver, cerrar y Escape no confirman y conservan el borrador.

**Alternativas descartadas.**

- *Inscribir todas las materias de la alternativa:* agrega materias que el estudiante no marcó y convierte el resultado en una decisión unilateral del prototipo.
- *Inscribir todo el borrador:* conserva materias ausentes de la alternativa y afirma una combinación que el resultado no produjo.
- *Reutilizar `periodStateOverrides`:* mezcla contexto fijo del escenario con una decisión local de esta sesión y permite que una confirmación se filtre entre períodos.

**Consecuencias.**

- El estado `Inscripta` confirmado tiene precedencia sobre el plan aceptado, las anulaciones por período y el estado base, pero queda aislado al período que lo originó.
- La elección se reinicia al abrir resultados, cambiar el desenlace o volver a ejecutar el desenlace simulado, para que IDs de alternativas repetidos entre desenlaces no seleccionen otra combinación.
- La interfaz debe exponer radios agrupados, selección por teclado, estado visual, CTA deshabilitado y explicación visible; no basta con que la validación exista solo en código.

## D-20 — La selección bloquea la navegación de período y cancelar descarta solo la transacción vigente

**Fecha:** 2026-09-20 · **Estado:** aceptada · **Clasificación:** preliminar

**Contexto.** El borrador, las restricciones de disponibilidad y las preferencias pertenecen al período activo. Permitir cambiarlo mientras el panel de selección o los resultados están abiertos mezcla una transacción no confirmada con otra vista y deja sin una semántica clara para abandonar el trabajo en curso.

**Decisión.** Abrir `Iniciar la inscripción` o `Planificar` inicia una transacción por período y bloquea ambas flechas de navegación mientras `selectionOpen || resultsOpen`. El bloqueo es nativo en los controles y también se defiende en los manejadores ante llamadas programáticas. Pasar de selección a resultados, regresar con Volver, Cerrar o Escape, y las acciones de recuperación conserva la misma transacción y, por lo tanto, el bloqueo.

La transacción termina únicamente al confirmar la inscripción, aceptar la planificación o elegir `Cancelar` en el panel. Cancelar descarta los datos aún no confirmados del período actual: borrador, preferencias y expansiones de profesor, y días no disponibles. Cierra y oculta el panel, elimina su marcador del canvas, vuelve a renderizar, devuelve el foco al CTA de entrada y anuncia explícitamente el descarte.

**Alternativas descartadas.**

- *Permitir navegar con la selección abierta:* obliga a elegir implícitamente entre trasladar, mezclar o perder entradas no confirmadas al cambiar de período.
- *Cancelar revirtiendo el plan o la inscripción confirmados:* confunde el descarte de una transacción abierta con una operación de reversión que requiere reglas, trazabilidad y confirmación propias.

**Consecuencias.** `enrolledByPeriod` y `acceptedPlanByPeriod` no se modifican al cancelar: son resultados confirmados de transacciones anteriores. Cuando no existe una transacción activa, las flechas conservan su deshabilitación normal en los límites de la lista de períodos.

---

## D-21 — CU-13 optimiza globalmente la reasignación de aulas del período actual

**Fecha:** 2026-09-21 · **Estado:** aceptada · **Clasificación:** supuesto de diseño con validación institucional pendiente

**Contexto.** El filtro local por sección de D-16 no podía resolver la competencia entre secciones por una misma aula ni reutilizar una aula que otra sección libera. El prototipo implementado necesita representar una única decisión coherente para todas las secciones del período actual, sin convertir la evaluación en un cambio operativo.

**Decisión.** CU-13 se inicia solo mediante una acción explícita del operador y ejecuta una búsqueda exacta, determinista y de solo lectura sobre todas las secciones y aulas del período actual. Los horarios y docentes de las secciones permanecen fijos; cada asignación debe respetar el tipo de aula, su capacidad y la incompatibilidad de superposición horaria. El inventario incluye las aulas compatibles que quedan libres por otra reasignación.

La demanda fuera de cupo se conserva agrupada por materia. Para cada materia, las vacantes de las aulas asignadas a sus secciones absorben esa demanda común. La salida simulada distribuye una cantidad incorporable entre secciones en orden canónico de cátedra únicamente para explicar y comprobar la conservación del total; no asigna estudiantes identificables ni modifica inscripciones. Las soluciones válidas se ordenan lexicográficamente por la tupla `(residuo, movimientos, capacidad sin usar, vector canónico de IDs de aula)`. El último componente establece el desempate reproducible. Un movimiento es asignar a una sección un `aulaId` distinto del actual.

CU-13 muestra el resultado global y su proyección en las tarjetas, pero no modifica aulas, horarios, docentes, inscripciones, datos compartidos ni la oferta. Si queda residuo, solo lo informa y deriva su evaluación a CU-11; no crea una propuesta de nueva sección ni la aplica. La búsqueda estática exacta del prototipo no usa CP-SAT; un backend CP-SAT es una evolución futura si la escala o las reglas institucionales lo justifican.

**Relación con decisiones previas.** D-21 supersede únicamente el alcance local y el algoritmo de D-15/D-16. Conserva de D-15 el disparador explícito y la prohibición de mutar o aplicar, y conserva de D-16 la separación respecto de CP-SAT en el prototipo. D-17 permanece intacta: una transición de intención solo sería pertinente tras una ampliación futura, autorizada y aplicada por separado.

**Consecuencias.**

- El resultado base verificable es: 19 estudiantes absorbidos, 0 de residuo, 3 movimientos y 45 asientos libres totales en las aulas propuestas antes de asignar la demanda agrupada fuera de cupo; tras absorber los 19 estudiantes, quedan 26 asientos.
- La explicabilidad debe incluir las restricciones globales y el orden de objetivos, no solo el motivo local de descarte de una aula.
- La tesis debe alinear CU-13, CU-11, RF-23 a RF-25, la trazabilidad, el caso contendido y las métricas de evaluación sin afirmar que se aplicó una reasignación real.

# Pendientes

- **P-07 — Recomendaciones como interacción propia.** Resuelta el 2026-09-17 en lo que respecta a la trazabilidad: RF-15 quedó en CU-04 y CP-13, RF-16 en CU-06 y CP-14. Queda abierto **solo si preferís** que recibir y aceptar recomendaciones sea un caso de uso propio, lo que exigiría agregar CU-15 y regenerar la Figura 2.
- **P-08 — Herramienta de cobertura sin nombrar.** 7.3.1 afirma que la integración continua conservará la cobertura como evidencia, y ninguna sección nombra la herramienta que la produce. Agregarla al stack de 4.2 y a la Tabla 1, o quitar la afirmación.

## Preferencias acotadas el 2026-09-18

§1 y §3.3 enumeraban cinco dimensiones de preferencia —cátedra, profesor, modalidad, días y franjas horarias—, y D-02 las registraba. La interfaz construida ofrece una sola, así que el autor eligió **ajustar el documento a lo que hay** en lugar de conservar capacidades que el prototipo no tiene.

- **§1** ahora dice que la preferencia por un profesor de una materia se trata como criterio de optimización, y que las restricciones de disponibilidad —los días en que no puede cursar— son restricción dura.
- **§3.3** ahora promete selección múltiple, preferencia por un profesor de cada materia y registro de los días en que no puede cursar.

**Consecuencia de método**: el índice del documento se repaginó, porque el texto se acortó 31 caracteres. La verificación por diferencia de líneas dio 37 líneas cambiadas en ambos sentidos, y **todas menos dos son números de página del índice**. Con reajuste de paginación, la regla de «cero líneas borradas» hay que leerla sobre el texto normalizado, no sobre las líneas.

## Deuda documental abierta (2026-09-18)

Cambios que dejan pendientes las decisiones D-10 a D-18. Se aplican antes de escribir 7.2.5, porque la sección los cita.

| Dónde | Qué |
| --- | --- |
| Tabla 7 | RF-05 pasa de `CU-06` a `CU-05, CU-06` (D-10) |
| Tabla 6, CU-05 | Falta el paso de generación de alternativas; hoy solo «valida la selección resultante» (D-10) |
| Tabla 5 | El candidato nuevo de la descarga, con su pendiente de aceptación institucional (D-18) |
| Tabla 6, CU-13 y CU-11 | Alinear el flujo con la reasignación global exacta, explícita y de solo lectura; CU-11 recibe solo el residuo y no crea ni aplica una apertura (D-21) |
| RF-21 y el modelo de dominio | Mantener como evolución futura la transición si una transferencia autorizada y aplicada amplía la capacidad; CU-13 no la activa (D-17) |
| Capítulo 6 | Reemplazar la descripción del filtro local por la reasignación global: horarios/docentes fijos, tipo/capacidad/superposición, demanda agrupada por materia y orden de objetivos; mantener el disparador explícito y la no aplicación (D-21) |
| 7.2.5 | La sección entera: panel flotante y su regla, cierre con descarga, indicador de granularidad en el resultado, rama institucional y la proyección de CU-13 global en las tarjetas (D-11, D-13, D-14, D-18, D-21) |
| `mockup/` | El panel flotante y su regla solo existen en `panel-seleccion/`; el README de `mockup/` sigue diciendo que no contiene paneles de planificación |

Los hallazgos y los requerimientos candidatos de los mockups **no se duplican acá**: viven en `panel-seleccion/discoveries.md`, que es su fuente, según la convención de encabezado de este archivo.

## Decisiones por tomar

- **P-06 — Convivencia del tope de 3 con la carga máxima configurable.** D-04 fija 3 materias por bimestre como límite no contemplado, y la tesis (§1) define la carga máxima como restricción dura si existe un límite institucional validado, o configurable por el estudiante si no. Falta precisar cómo conviven: ¿el límite configurable puede llegar hasta 3 y no más, y qué se muestra cuando el estudiante intenta una cuarta?

## Resueltas

- ~~**P-01 — Clasificación de D-04.**~~ Resuelta el 2026-09-16: se documenta en la sección "No contempla" de la tesis.
- ~~**D-02 contradecía la tesis.**~~ Resuelta el 2026-09-16: D-02 se reformuló con dos niveles (intención por materia y preferencias de cursado), alineada con las secciones 3.1 y 3.3 y con el vocabulario de §1.

## Resueltas por el documento de tesis

Estas cuatro se registraron como pendientes por error: la tesis las resuelve, tres de ellas en §1 "Propuesta de solución general", cuyo cuerpo no había leído. Corregido el 2026-09-17 tras leer el documento completo.

- ~~**P-02 — Rol de la carga máxima personal.**~~ Resuelta por la tesis §1: "La carga académica máxima será una restricción dura cuando exista un límite institucional validado; en ausencia de esa regla, funcionará como límite configurable por el estudiante."
- ~~**P-03 — Dos momentos de uso.**~~ Resuelta por la tesis §1, 2.1 y 3.1: el prototipo "diferencie dos operaciones: la asistencia a la inscripción del período académico actual y la planificación del siguiente período soportado por el MVP". Recogida en D-01 como un motor con dos modos.
- ~~**P-04 — Dónde se define el límite de carga.**~~ Resuelta por la misma oración de §1 que P-02: el límite queda definido por la existencia o no de una regla institucional validada. Lo que queda por decidir es solo su convivencia con D-04, registrada como P-06.
- ~~**P-05 — Tensión de vocabulario.**~~ Resuelta en D-03: "inscribir" es legítimo para el período actual y está vedado para las intenciones condicionadas del siguiente.

## Acceso al documento

Resuelto el 2026-09-16; ubicación de la herramienta actualizada el 2026-09-17. El documento de tesis vive en Google Docs y no está en la máquina ni en el repositorio. El servidor MCP oficial de Docs quedó descartado porque exige inscribir el proyecto en el Google Workspace Developer Preview Program. Se accede llamando a la API de Docs común (`documents.googleapis.com`, servicio GA) con el cliente OAuth ya registrado, a través del CLI `gdocs-api`, invocado por nombre desde el PATH (`/home/facundo/.local/bin/gdocs-api`); ya no se ejecuta con `python3` ni con ruta completa. Las credenciales viven en `~/.pi/agent/mcp.json` y `~/.pi/agent/secrets/`. La primera escritura quedó verificada con `documento/tesis-crudo-antes-2026-09-16.json` como respaldo previo.

## Huecos estructurales detectados

- **Granularidad de bimestre: resuelta el 2026-09-18 en el vocabulario, no en los datos.** `courses.term` identifica un **cuatrimestre** (1 a 10, hasta 6 materias por columna) y el grafo rotula esas columnas como "Cuatrimestre N". El atributo que dice en qué bimestre se ofrece cada materia **no existe en el modelo del mockup**, y sin él el tope de 3 por bimestre no puede evaluarse. §3.3 ahora define que el período **es** el bimestre, así que el atributo ya no hace falta en la materia: es una propiedad de la **oferta**, y la capa de datos simulados lo lleva en el período de cada cátedra (`comun/datos-simulados.js`). Consecuencia de diseño que queda anotada: una materia **sin oferta publicada no tiene bimestre conocido**, de modo que el tope de tres solo es verificable para materias con oferta publicada.
- **Ausencia de comisiones, horarios y cupos.** El modelo actual de cada materia es `id`, `term`, `slot`, `name`, `state`, `category`. No hay horarios ni cupos, por lo que las advertencias de superposición horaria y de cupo simulado no pueden implementarse sin agregar datos simulados y etiquetarlos como tales.
- **Estados sin uso.** `no-capacity` y `review` están definidos y estilizados pero ninguna materia los usa; falta además un estado para "límite de tiempo sin alternativa", exigido por `discoveries.md`.
- **Duplicación de este registro.** El mapa y los datos están replicados en `mockup/`, `periodo-2A/` y `periodo-2B/`. Este archivo es única fuente a propósito: las decisiones no deben duplicarse.
- **Preferencias obligatorias y chequeo local.** D-02 reformulada introduce restricciones duras de cursado (cátedra, profesor, modalidad, días, franjas). Deben entrar en la definición única de restricciones que comparten el chequeo local y CP-SAT (consecuencia de D-01), o la interfaz podrá decir "sin conflictos" y el solver responder infactible.
- **Granularidad de horarios.** Las preferencias por días y franjas exigen datos de horarios y comisiones que hoy no existen en el modelo de los mockups (solo `id`, `term`, `slot`, `name`, `state`, `category`).

---

# Estado del documento de tesis

Leído completo el 2026-09-17. Los capítulos 1 a 5 tienen contenido desarrollado, y el stack tecnológico está completo en 4.2. En cambio:

| Sección | Estado |
| --- | --- |
| 6.1.1 A nivel funcional | vacía |
| 6.1.3 Diagrama de arquitectura | vacía |
| 6.2.1 Requerimientos funcionales | **cargada** el 2026-09-17: RF-01 a RF-20 (Tabla 3) |
| 6.2.2 Requerimientos no funcionales | **cargada** el 2026-09-17: RNF-01 a RNF-12 (Tabla 4) |
| 6.2.3 Requerimientos candidatos | **cargada** el 2026-09-17: RC-01 a RC-08 (Tabla 5) |
| 7.2.1 a 7.2.4 | **cargadas** el 2026-09-17: las tablas de casos de uso, entidades, descripción de los casos centrales y colaboración. De esas cuatro, tres fueron reemplazadas después por las Figuras 2 a 5; la descripción de casos de uso quedó como **Tabla 6** |
| 7.2.5 Interfaz gráfica | vacía; depende de los mockups |
| 7.3.2 Diseño de casos de pruebas | **cargada** el 2026-09-17: CP-01 a CP-22 (**Tabla 8**) |
| Anexo D | **ya estaba completo**: contiene la figura del mapa desde antes de esta revisión |

Es el destino de lo ya redactado en [`propuesta-capitulos-6-y-7.md`](propuesta-capitulos-6-y-7.md): RF-01 a RF-09 en 6.2.1, RNF-01 a RNF-10 en 6.2.2, RC-01 a RC-08 en 6.2.3 y CP-01 a CP-08 en 7.3.2.

**Corrección del 2026-09-17 sobre el Anexo D.** Este registro afirmó durante un rato que el Anexo D estaba vacío. Era falso: **la figura ya estaba insertada** desde antes de esta revisión, y lo que ocurre es que una imagen no aporta texto, y yo medía vacío por el texto extraído. La figura del anexo **no es el SVG del repositorio**: es una versión distinta y más rica, con encabezado propio, leyenda de los ocho estados visuales, badges de categoría y notas al pie. El SVG del repositorio quedó como material de trabajo de los mockups, no como fuente del anexo.

**Lecciones de método que costó este error.**

1. **El vacío no se mide por texto.** Una sección puede tener una figura y no tener una sola letra. Cualquier comprobación de contenido tiene que mirar párrafos, tablas **e imágenes**.
2. **Un párrafo vacío con estilo de encabezado rompe cualquier recorrido por rangos**, porque parte la sección en dos. Eso fue lo que hizo fallar mi segundo intento de verificación, y me llevó a un tercero.
3. **La detección correcta**: 64 encabezados, 10 tablas (las 2 originales más las 8 de esta revisión) y 1 imagen. Las únicas hojas vacías que quedan son **6.1.1**, **6.1.3** y **7.2.5**; los demás encabezados del listado son padres con subsecciones.

## Requerimientos cargados el 2026-09-17

Las tres tablas se insertaron con el CLI `gdocs-api`, replicando la convención del documento: captación en texto normal, título en cursiva, encabezado en negrita y nota en cursiva pegada a la tabla. Verificado por diferencia de texto: 52 líneas agregadas, 0 borradas.

- **Tabla 3** — RF-01 a RF-20. Los nueve primeros provienen del borrador; **RF-10 a RF-20 los agregué yo** para cubrir capacidades que §1, 3.2 y 3.3 ya comprometen y que el borrador no respaldaba: los dos períodos, intenciones condicionadas, estado y motivo por materia, granularidad del resultado, límite de carga, recomendaciones, prioridad por impacto curricular, demanda agregada, estado por límite temporal, prohibición de exclusión silenciosa y trazabilidad del escenario.
- **Tabla 4** — RNF-01 a RNF-12. Los diez primeros provienen del borrador; **RNF-11 y RNF-12 los agregué yo** (reproducibilidad del solver y aislamiento de su ejecución), tomados de §1 y 4.2.
- **Tabla 5** — RC-01 a RC-08, sin cambios respecto del borrador.

**Asignaciones que conviene revisar.** El estado de cada requerimiento nuevo lo completé yo siguiendo el esquema del borrador, salvo RF-05 y RF-09 que lo traían. La mayoría quedó como *Preliminar* por derivar de §1 y 3.3; conviene que confirmes esa clasificación, en particular la de RF-14, cuyo límite institucional sigue pendiente de validación.

**Falta todavía en 6.2.** El borrador incluye un párrafo metodológico de apertura que no inserté, y que advierte que cada requerimiento debería registrar fuente, prioridad, criterio de aceptación y estado. Las tablas cargadas tienen tres columnas y solo cubren el estado: o se agrega una columna de fuente y se redactan los criterios de aceptación, o el párrafo metodológico debe ajustarse para no prometer lo que la tabla no tiene.

**Defectos de texto detectados en el recorrido completo.**

- Seis referencias internas quedaron sin destino: "se documenta en , documento de trabajo", "continúa mediante .", "la encuesta documentada en .", "El documento  concentra el relevamiento", y el campo "Recuperado de " de Demarchi (2026) en Referencias.
- Cifras escritas entre paréntesis —"(45 respuestas)", "(35 estudiantes)", "(11 estudiantes)", "(41 respuestas)"— que se leen como marcadores de plantilla sin limpiar. Lo natural sería "para 35 estudiantes, equivalentes al 77,8 %".
- **La Tabla 2 tiene el encabezado sin negrita**, a diferencia de la Tabla 1 y del resto de las tablas. La primera columna sí está en negrita, porque eso proviene del estilo de tabla del documento; lo que falta es la negrita en la fila de encabezado. Inconsistencia de formato, no de contenido.

## Casos de prueba cargados el 2026-09-17

**Tabla 8**, en 7.3.2, con **cuatro columnas** (`ID | Caso | Resultado esperado | Requerimientos`) y **agrupación por tipo de prueba** en cinco filas de grupo: reglas de dominio y solver, API, persistencia y datos, interfaz, y accesibilidad. Total: 18 casos.

Los ocho primeros provienen del borrador. **CP-09 a CP-18 los agregué yo** para cubrir requerimientos que quedaban sin caso. El más importante es **CP-09**, el recálculo de una precorrelativa aprobada y otra no: no estaba en el borrador y está pedido de forma explícita por el objetivo específico 5 de la sección 2.2.

**Apartamiento deliberado de las tablas anteriores.** Las tablas 3, 4 y 5 tienen tres columnas; esta tiene cuatro. La cuarta no es cosmética: 7.3.1 declara que el plan de pruebas debe incluir la relación entre requisito y prueba, y eso no es expresable con tres columnas. Con la columna cargada, la trazabilidad `RF`/`RNF` → `CP` ya existe para los 18 casos.

**Cobertura lograda.** De los 20 requerimientos funcionales quedan con caso 16, y de los 12 no funcionales, 8. Los que no tienen caso propio —RF-01, RF-02, RF-05, RF-09 y RNF-01, RNF-02, RNF-05, RNF-08, RNF-09, RNF-10— se verifican en su mayoría por otros mecanismos ya previstos en 7.3.1: análisis estático, contratos, pruebas unitarias y de integración con Pytest y Hypothesis, y la integración continua.

**Convención de tablas del documento, medida y no supuesta.** La primera columna va en negrita por el estilo de tabla del documento, la fila de encabezado también, y la nota al pie va en cursiva. Conviene saberlo antes de crear cualquier tabla nueva.

## El período y el bimestre definidos en §3.3, 2026-09-18

**Qué se agregó.** Al final de la viñeta de §3.3 que introduce los períodos, una definición:

> Cada período académico corresponde a un bimestre. Las materias se dictan durante dos meses, de modo que el año académico comprende cuatro bimestres, y el número del período indica el cuatrimestre al que pertenece: el período 1A es el primer bimestre del año, y el 1B el segundo, que conserva el número 1 por continuar dentro del primer cuatrimestre. Los períodos 2A y 2B son, del mismo modo, los dos bimestres del segundo cuatrimestre. En consecuencia, el límite de tres materias por bimestre equivale al límite de tres materias por período.

**Por qué.** El documento usaba **«período»** en §1 y §3.3 («los períodos 1A, 1B, 2A y 2B») y **«bimestre»** en §3.4 y D-04 («tres materias por bimestre»), **para la misma unidad**, sin establecer nunca la equivalencia. El hueco se descubrió al construir la capa de datos simulados de los mockups: el escritor concluyó que eran dos dimensiones distintas y produjo cátedras con `periodo: '1B · 2026'` y `bimestre: 'A'`, que es contradictorio.

**Los dos términos se conservan, y no se unifican.** Decisión del usuario: la facultad nombra así los períodos en su propio sistema, y el vocabulario se hereda de esa fuente. «Bimestre» es además el término preciso para la unidad de dos meses, y CP-11 ya dice «en el mismo bimestre». La oración final de la definición cierra la equivalencia, así que las dos palabras conviven sin ambigüedad en lugar de obligar a renombrar §3.4, D-04 y CP-11.

**Ubicación elegida.** En §3.3 y no en «No contempla», porque es donde el lector se topa con `1A`, `1B`, `2A` y `2B` por primera vez. Ponerla en §3.4 obligaría a leer primero la restricción para entender el vocabulario.

**Verificación.** Una línea cambiada en el documento, y la anterior es prefijo exacto de la nueva: no se perdió contenido. §3.4 y CP-11 quedaron intactos, como se buscaba.

## Declaración de uso de IA actualizada, 2026-09-18

La sección 7.1 declaraba el uso de ChatGPT (modelo Sol). Se reemplazó por la mención de los modelos realmente usados:

- **La declaración** ahora dice que se utilizaron asistentes de programación basados en modelos de lenguaje provistos por **OpenAI, Anthropic (Claude), Google (Gemini) y OpenCode**, coordinados mediante el arnés Gentle-AI que la misma sección describe, y cita cada proveedor.
- **La entrada de referencias de ChatGPT se generalizó** a «OpenAI. (2026). Modelos GPT [Modelo de lenguaje grande]», porque citar un producto que se dejó de usar sería falso.
- **Se agregaron tres entradas nuevas**: Anthropic (Claude), Google (Gemini) y OpenCode. La bibliografía pasó de 17 a 20 entradas.

**Defecto preexistente que apareció de paso: el orden alfabético.** OpenAI figuraba **después** de OWASP, y por APA le corresponde ir **antes** de OpenAPI Initiative: el orden correcto entre esas cuatro es `OpenAI · OpenAPI Initiative · OpenCode · OWASP`. Se corrigió con una rotación a través de un marcador temporal, porque los reemplazos de texto son globales y en el paso intermedio habría habido dos párrafos idénticos. Verificado: 20 entradas, ninguna fuera de orden.

**Direcciones verificadas.** Los cuatro dominios resuelven. `claude.ai` y `openai.com` responden 403 a una consulta automatizada, lo que es protección contra bots y no un enlace roto.

**Redacción propia.** El texto de la declaración lo redacté yo, conservando las cuatro actividades que enumeraba la versión anterior y la misma salvedad sobre responsabilidad autoral. Conviene que lo confirmes.

**Segunda vuelta: los modelos.** La primera versión nombraba cuatro proveedores, y eso dejaba dos imprecisiones. Trataba a **OpenCode como fabricante de modelos** cuando es una vía de acceso, y omitía los modelos que hicieron la mayor parte del trabajo. La configuración real tiene **tres vías**: OpenAI Codex (modelos GPT), un proxy local (Gemini y Claude Opus) y OpenCode (DeepSeek, GLM y MiMo). La declaración ahora las nombra, y aclara que las versiones concretas variaron entre sesiones y quedaron en la configuración versionada del proyecto.

**No se fijan versiones a propósito.** La configuración de modelos cambia: en este mismo proyecto una sesión anterior rebalanceó el perfil mixto de 19/6 a 16/9 roles entre OpenAI y no-OpenAI. Enumerar versiones exactas dejaría la declaración desactualizada en cuanto se toque la configuración, y la tesis debe ser exacta el día de la entrega. Las familias y las vías son estables; las versiones no.

Se agregaron las referencias de **DeepSeek**, **Xiaomi (MiMo)** y **Z.AI (GLM)**, con las cuatro direcciones verificadas, y la bibliografía pasó de 20 a **23 entradas**, sin ninguna fuera de orden.

## Metodología actualizada de SDD a ODD, 2026-09-18

La sección 7.1 describía el proceso con desarrollo dirigido por especificaciones (Spec-Driven Development, SDD). Se reemplazó por el flujo orgánico de desarrollo (Organic Driven Development, ODD), que es el que se aplica:

- **El párrafo de metodología** ahora describe ODD como el flujo que aplica el registro y las verificaciones **en proporción a la complejidad** de cada cambio, y los incrementos de mayor alcance parten de un documento de tareas con objetivo, alcance y lista ordenada de tareas, más las decisiones de diseño.
- **La lista de evidencia formal** decía «las especificaciones versionadas»; ahora dice «los documentos de tareas versionados», porque las especificaciones eran artefactos de SDD. Sin este segundo cambio, la sección habría quedado pidiendo evidencia de un proceso que ya no describe.

Verificación: dos líneas cambiadas y ninguna mención de SDD restante en el documento.

**Matiz que conviene confirmar.** En la definición de ODD, SDD no desaparece: es **una rama dentro de ODD**, que se entra solo por pedido explícito. Si para los incrementos de mayor complejidad se sigue usando la especificación previa, el texto más fiel sería mencionarlo como rama y no borrarlo. La redacción actual lo omite, siguiendo tu indicación. Si preferís la variante, el párrafo puede cerrar con: «Cuando el incremento lo justifique, y por pedido explícito, se aplicará además desarrollo dirigido por especificaciones (Spec-Driven Development, SDD) como rama dentro de ese flujo».

**Sobre la página.** Indicaste la página 31, donde el índice ubica 6.2.2 «Requerimientos no funcionales»; la mención de SDD estaba en 7.1, que el índice ubica en la 34. Cambié la única mención del documento, así que el destino es inequívoco, pero vale que lo confirmes por si tu vista tenía otra paginación.

## Revisión de la Tabla 1, 2026-09-18

La Tabla 1 es la síntesis del stack tecnológico en 4.2. Se revisó contra la prosa que la precede, y aparecieron dos defectos reales.

**1. Contradicción en el verificador de tipos.** La prosa de 4.2 dice «Ruff y **mypy** verificarán el código Python»; la tabla decía «Ruff y **Pyright**». Son dos implementaciones distintas, con configuración y manejo de errores distintos, y la tesis no puede comprometer las dos. Se corrigió **la tabla**, no la prosa, porque la tabla aparece después y sintetiza ese mismo stack: un resumen no puede contradecir su fuente. Si en realidad se prefiere Pyright, el cambio es la palabra inversa en la prosa, y conviene decidirlo antes de implementar.

**2. Una fila que no respondía a su columna.** La última fila decía «Evidencia | Cobertura y resultados automatizados | Trazabilidad de la verificación técnica». La columna se llama **Tecnologías** y las otras dieciséis filas nombran herramientas; esa nombraba artefactos. Se eliminó en lugar de inventar una herramienta, porque nombrar `coverage` o `pytest-cov` sería una decisión de stack que no me corresponde tomar.

**Hueco que la fila dejó al descubierto.** La sección 7.3.1 afirma que la integración continua conservará «la cobertura» entre las evidencias de cada versión, pero **el documento no nombra ninguna herramienta que la produzca**. O se agrega al stack, o la afirmación queda sin respaldo. Queda como P-08.

**Lo que se dejó sin tocar.** «ELK» y «SQLAlchemy 2» son más específicos en la tabla que en la prosa («un algoritmo de disposición jerárquica», «SQLAlchemy»). No son contradicciones: son afirmaciones más fuertes en el cuadro que en el texto. Conviene confirmar que están decididas. Y el orden de las filas mezcla criterios, así que un agrupamiento por bloques mejoraría la lectura; se dejó por ser cosmético y requerir mover filas en el documento.

Verificación: tres líneas cambiadas en el documento, ninguna otra. El formato de la tabla ya era el correcto y es la referencia del resto: encabezado en negrita, primera columna en negrita por el estilo del documento y nota en cursiva.

## Ajustes de coherencia aplicados el 2026-09-17

Seis correcciones de texto para alinear secciones que quedaron atrás cuando se incorporó la gestión de demanda insatisfecha.

| Dónde | Qué se agregó | Por qué |
| --- | --- | --- |
| RF-26 | Que cada decisión registre actor, fecha y motivo | El requerimiento exigía la aprobación institucional pero no dejaba rastro verificable, y la tesis cita la Ley 25.326 |
| 2.1 | La asistencia a la institución en la evaluación de alternativas | El objetivo general solo prometía «información trazable sobre la demanda», no la evaluación |
| 2.2, objetivo 4 | La evaluación asistida de alternativas de resolución | El objetivo específico enumeraba visualización, planificación, demanda y motor, sin la capacidad nueva |
| 5.3 | Las propuestas de cambio de aula o apertura entre las capacidades priorizadas | El diagnóstico priorizaba registrar la demanda, que ahora es solo el insumo de la propuesta |
| 3.2 | Que el prototipo no asignará docentes ni contratará personal | La cláusula se perdió al reescribir el límite sobre decisiones administrativas |
| 4.3 | Que la evaluación de aulas se limita a soportar la decisión institucional | El valor agregado no distinguía esa evaluación del timetabling, y el prototipo ahora toca ese terreno frente a UniTime |

Verificación: seis líneas cambiadas y ninguna otra tocada.

**Definición del vocabulario de demanda.** La sección 3.3 enumera cinco variantes de «demanda» sin definirlas, y en el document aparecen además «insatisfecha», «agregada» y usos informales. Se agregó una oración al final de esa viñeta que fija la relación: la demanda total resulta de sumar la habilitada del período actual, la condicionada del siguiente y la planificada por falta de cupo, y esta última constituye la demanda insatisfecha. Una línea cambiada.

**Corrección de una afirmación propia.** Había listado «el solapamiento entre CU-11 y CU-13» como un defecto a corregir. **No lo es.** RF-25 dice «generar una propuesta de apertura de una nueva cátedra **y simular su impacto** sobre la demanda insatisfecha»: son dos capacidades dentro de un mismo requerimiento, y por eso la trazabilidad lo asocia a dos casos de uso. La matriz lo muestra en la fila RF-25, con `CU-11, CU-13`, y eso es correcto. Si se quisiera una correspondencia uno a uno habría que partir RF-25 en dos requerimientos, lo que renumeraría el capítulo 6 y sus tablas; no vale el costo.

## Trazabilidad cargada el 2026-09-17

**Tabla 7** en 7.3.1: `Requerimiento | Casos de uso | Casos de prueba | Verificación cuando no hay caso de prueba`, con una fila por requerimiento. 38 filas, 156 celdas.

**Por qué hacía falta.** Al reemplazar la tabla de casos de uso por la Figura 2, los casos de uso **perdieron su columna de requerimientos**: la relación entre caso de uso y requerimiento dejó de existir en el texto del documento, y 7.3.1 declara que el plan de pruebas debe incluirla. La matriz la restituye y la completa con los casos de prueba.

**Hallazgos que la matriz deja visibles.**

- **Doce requerimientos no tienen caso de prueba propio.** Diez tienen un medio alternativo declarado en la cuarta columna (pruebas de integración, verificación manual, análisis estático, protocolo de rendimiento, inspección de datos o la propia integración continua).
- **Corrección del 2026-09-17 sobre RF-15 y RF-16.** Este registro afirmó que no tenían caso de uso ni caso de prueba, y era **falso en las dos partes**: la **Tabla 8** los asocia a CP-13 y CP-14, y los casos de uso a los que corresponden son CU-04 para RF-15 y CU-06 para RF-16. El hueco era de este mapeo, escrito a mano, no del modelo de la tesis. La matriz quedó corregida y ya no contiene ninguna celda marcada como pendiente.
- **Mapeo interpretativo que conviene que revises.** RF-15 quedó asociado a CU-04 «Seleccionar materias y declarar intención», bajo la lectura de que la recomendación se incorpora al conjunto de materias que el motor usa para generar alternativas, según §1, y que ese conjunto se arma en la selección. Si preferís que recibir y aceptar recomendaciones sea una interacción propia, corresponde un CU-15 aparte y regenerar la Figura 2; no lo hice por mi cuenta porque agrega un caso de uso al alcance.
- **RF-09, RF-18 y RF-20 no tienen caso de uso**, pero sí un medio de verificación declarado. RF-18 y RF-20 tienen caso de prueba.
- Los doce requerimientos no funcionales no tienen caso de uso, como corresponde a atributos de calidad; siete tienen caso de prueba y cinco un medio alternativo.

**Numeración resuelta el 2026-09-17.** El documento quedó con las tablas de 1 a 8 y las figuras de 1 a 5, ambas series en orden de aparición. El renombrado movió tres tablas: la descripción de casos de uso pasó a **Tabla 6**, la matriz de trazabilidad a **Tabla 7** y la de casos de prueba a **Tabla 8**; también se actualizó la referencia en prosa a la matriz, que nombraba el número viejo. Verificado por diferencia de texto: cuatro líneas cambiadas, ninguna otra.

## Capítulo 7.2 cargado el 2026-09-17

Cuatro tablas con su párrafo de introducción cada una, en 7.2.1, 7.2.2, 7.2.3 y 7.2.4. Otras 97 líneas agregadas y 0 borradas.

> Nota de sincronización: de esas cuatro tablas, las de 7.2.1, 7.2.2 y 7.2.4 fueron **reemplazadas después por las Figuras 2 a 5** del pipeline nuevo (D-09), con la numeración correlativa definitiva. Eso liberó los números 7, 8 y 10 que esas tablas tenían asignados. El número 10 quedó reutilizado por la matriz de trazabilidad y no hubo colisión. La secuencia del documento quedó desordenada en ese momento —1, 2, 3, 4, 5, 9, 10 y 6— y se corrigió después: ver «Numeración resuelta el 2026-09-17».

### D-06 — Actor institucional documentado como provisional

**Fecha:** 2026-09-17 · **Estado:** aceptada · **Clasificación:** pendiente de validación institucional

**Contexto.** El borrador de 7.2.1 proponía un único actor y dejaba fuera a los actores institucionales. Pero la tesis incluye funciones institucionales en el alcance en tres lugares distintos: 3.3 ("Simular la apertura de una cátedra y recalcular cuántos alumnos podrían incorporarse sin conflictos", y "Mostrar por materia la demanda total"), §1 ("consolidar datos de demanda que permitan a la institución reconocer materias sin oferta compatible") y 5.3, que prioriza "registrar demanda y solicitudes de apertura con trazabilidad" entre las cinco capacidades del prototipo.

**Decisión.** El diagrama de casos de uso lleva dos actores. El **estudiante** es el actor confirmado por el relevamiento. Las funciones institucionales se atribuyen provisionalmente a **Coordinación de carrera**, siguiendo la misma convención de nota de avance que el capítulo 4 ya usa: 4.4.1 declara que "la unidad que decide la apertura de cátedras permanecen pendientes de confirmación institucional", y 4.4.2 ya advierte que "su participación exacta en las aperturas debe validarse".

**Alternativas descartadas.**

- *Dejar un solo actor y marcar lo institucional como pendiente:* coherente con el borrador, pero deja sin caso de uso dos capacidades que 3.3, §1 y 5.3 sí incluyen.
- *Sacar lo institucional del alcance:* exigiría editar 3.3, §1 y 5.3, y contradice el diagnóstico del propio capítulo 5.

**Consecuencias.**

- El nombre del área queda declarado como provisional en el texto de la sección; no se afirma nada que la elicitación no haya confirmado.
- Los dos casos institucionales (CU-10 y CU-11) quedan trazables a RF-17.
- Cuando cierre la elicitación institucional, hay que reemplazar el nombre y revisar la sección 4.4.
- El prototipo **no decide** aperturas (3.2); solo las simula.

### D-07 — Modelo de entidades preliminar, con tres agregados y un renombre

**Fecha:** 2026-09-17 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Decisión.** Sobre las 13 entidades del borrador:

- **Renombre con remodelado:** `SeleccionMateria` pasa a **IntencionDeCursado**, con estado y motivo explícitos y unicidad por alumno, materia y período. Es el corazón del dominio según 3.3 y con el nombre anterior quedaba desdibujado.
- **Tres agregados con respaldo textual explícito:** **Oferta** (§1: "Cuando exista oferta publicada… la oferta está pendiente"; RF-13), **DemandaAgregada** (4.2 la nombra literalmente: "…intenciones de cursado y demanda agregada"; RF-17) y **Cupo** (3.3: "no disponible por falta de cátedra o de cupo"; 4.2).
- **Un agregado derivado:** **Docente**, porque 3.3 y §1 incluyen "profesor" entre las dimensiones de preferencia y sin esa entidad la preferencia no es representable.
- **Atributos, no entidades:** la franja horaria es contenido de `Horario` y la revalidación de una intención condicionada es un estado de `IntencionDeCursado`, no una entidad propia.

**Consecuencias.**

- No se derivaron atributos del resto de las entidades: eso es diseño pendiente y corresponde al modelado del esquema de 4.2.
- Sigue faltando el atributo que dice en qué bimestre se ofrece cada materia, sin el cual el tope de D-04 no se evalúa. Queda como hueco estructural.
- Las cuatro secciones tituladas «Diagrama de…» tienen su contenido estructurado en tablas. Las figuras de 7.2.1, 7.2.2 y 7.2.4 siguen pendientes, pero **no por falta de permiso**: la inserción de imágenes ya está resuelta y probada (ver abajo). Lo que falta son los dibujos.

### D-08 — La inserción de figuras requiere publicar la imagen

**Fecha:** 2026-09-17 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Contexto.** Al ampliar el OAuth con `drive.file` se esperaba poder insertar imágenes alojadas en Drive. La verificación mostró que **no alcanza**: `insertInlineImage` busca la imagen **de forma anónima**, sin usar el token del llamador, así que el archivo tiene que ser público. Se probaron seis variantes de URI y todas fallaron con el PNG privado; con un permiso `anyone`/`reader` la URI `uc` es aceptada.

**Decisión.** El procedimiento es: subir el archivo con `drive-upload`, crear el permiso abierto con `drive-share`, insertar con `insert-image`, y **cerrar la publicación después con `drive-unshare`**, porque Docs copia la imagen a su propio host y el documento deja de depender del archivo original.

**Consecuencias.**

- Publicar es un paso intermedio obligatorio, no un efecto permanente: la copia embebida sobrevive al cierre del permiso.
- El permiso del `mapa-correlatividades.png` sigue abierto a la fecha de este registro y se cierra con `gdocs-api drive-unshare 1zZKxDxXlUfgic_svb53ZURSLPr6mXqxx`.
- `drive.file` solo da acceso a lo que crea la propia aplicación, así que no sirve para leer archivos ajenos del Drive del usuario.

### D-09 — Las figuras se generan en Mermaid y se versionan como fuente

**Fecha:** 2026-09-17 · **Estado:** aceptada · **Clasificación:** supuesto de diseño

**Contexto.** Google Docs no acepta SVG, así que las figuras tienen que llegar como raster. Las cuatro figuras que había en el documento se habían generado en Mermaid dentro de una conversación y sus fuentes no existían en disco: eran binarios opacos, no reproducibles, y una de ellas contenía una definición de `Cupo` que contradecía la regla de derivación de D-08.

**Decisión.** Las figuras se generan con Mermaid CLI y **sus fuentes `.mmd` viven en `documento/figuras/`**, junto con la configuración y el script de render. El lazo completo es `mmd → PNG → insert-image`, y el pipeline está documentado en el README de esa carpeta. Las cinco figuras se regeneraron desde el contenido del documento y se renumeraron de forma correlativa por orden de aparición.

**Alternativas descartadas.**

- *Reutilizar las fuentes de Mermaid de la conversación:* no existían en disco y no se podían pedir sin perder la uniformidad con la paleta del documento.
- *Escribir los SVG a mano:* evitaba la instalación, pero dejaba las figuras fuera del flujo reproducible y sin fuentes mantenibles.

**Consecuencias.**

- El render exige `--no-sandbox` en Chromium, por una restricción de AppArmor de la distribución. Está acotado a estas figuras propias y documentado en el README.
- El tamaño aparente del texto depende de la proporción del diagrama, no de su resolución. La fórmula de control y el umbral de 8,5 pt quedaron en el README.
- Las figuras 2 y 3 quedan en el límite inferior de legibilidad; la 5 requiere una inserción angosta de 140 pt para entrar en página.
- Renumerar obligó a revisar cualquier referencia a figuras en el texto.

### Corrección de un defecto propio en las inserciones de tabla

**Fecha:** 2026-09-17

**Qué pasó.** Cada inserción de tabla dejó **dos párrafos vacíos con estilo de encabezado**: uno por el salto de línea del bloque de captación y otro porque `insertTable` parte el párrafo donde se inserta. Fueron **16 párrafos** en las ocho tablas, y cuatro de ellos quedaron como `HEADING_1`, o sea a nivel de capítulo: aparecían en el esquema del documento y habrían aparecido como entradas en blanco si se regeneraba el índice. El respaldo previo tenía cero párrafos de ese tipo, lo que probó que eran todos de esta revisión.

**Corrección.** Los 16 se devolvieron a `NORMAL_TEXT` y el CLI ganó una limpieza automática al final de cada inserción de tabla, para que no vuelva a ocurrir. El texto extraído quedó **idéntico**, lo que confirma que la corrección fue solo de estilo.

**Cómo se detectó.** No lo encontré revisando el documento, sino porque mi propio recuento de secciones no cerraba: contaba 80 encabezados donde el texto extraído mostraba unos 50. La anomalía del instrumento reveló el defecto del documento.
