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

**Fecha:** 2026-09-16 · **Estado:** aceptada · **Reformulada:** 2026-09-16 para coincidir con la tesis; vocabulario alineado a §1 el 2026-09-17 · **Clasificación:** supuesto de diseño

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

# Pendientes

- **P-07 — Recomendaciones y priorización sin caso de uso.** RF-15 y RF-16 no aparecen en la Figura 5 ni tienen caso de prueba. Agregar los casos de uso CU-15 y CU-16, sus casos de prueba, y regenerar la figura.

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

- **Granularidad de bimestre inexistente.** `courses.term` identifica un **cuatrimestre** (1 a 10, hasta 6 materias por columna) y el grafo rotula esas columnas como "Cuatrimestre N". No existe ningún atributo que indique si una materia se dicta en el bimestre A o B. Sin él, el tope de 3 por bimestre no puede evaluarse y el solver podría ubicar cualquier materia en cualquier bimestre. Se necesita un atributo de oferta por bimestre.
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
| 7.2.1 a 7.2.4 | **cargadas** el 2026-09-17: Tabla 7 (casos de uso), Tabla 8 (entidades), Tabla 9 (descripción de los casos centrales), Tabla 10 (colaboración) |
| 7.2.5 Interfaz gráfica | vacía; depende de los mockups |
| 7.3.2 Diseño de casos de pruebas | **cargada** el 2026-09-17: CP-01 a CP-18 (Tabla 6) |
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
- **La Tabla 2 tiene el encabezado sin negrita**, a diferencia de la Tabla 1 y de las tablas 3 a 6. La primera columna sí está en negrita, porque eso proviene del estilo de tabla del documento; lo que falta es la negrita en la fila de encabezado. Inconsistencia de formato, no de contenido.

## Casos de prueba cargados el 2026-09-17

**Tabla 6**, en 7.3.2, con **cuatro columnas** (`ID | Caso | Resultado esperado | Requerimientos`) y **agrupación por tipo de prueba** en cinco filas de grupo: reglas de dominio y solver, API, persistencia y datos, interfaz, y accesibilidad. Total: 18 casos.

Los ocho primeros provienen del borrador. **CP-09 a CP-18 los agregué yo** para cubrir requerimientos que quedaban sin caso. El más importante es **CP-09**, el recálculo de una precorrelativa aprobada y otra no: no estaba en el borrador y está pedido de forma explícita por el objetivo específico 5 de la sección 2.2.

**Apartamiento deliberado de las tablas anteriores.** Las tablas 3, 4 y 5 tienen tres columnas; esta tiene cuatro. La cuarta no es cosmética: 7.3.1 declara que el plan de pruebas debe incluir la relación entre requisito y prueba, y eso no es expresable con tres columnas. Con la columna cargada, la trazabilidad `RF`/`RNF` → `CP` ya existe para los 18 casos.

**Cobertura lograda.** De los 20 requerimientos funcionales quedan con caso 16, y de los 12 no funcionales, 8. Los que no tienen caso propio —RF-01, RF-02, RF-05, RF-09 y RNF-01, RNF-02, RNF-05, RNF-08, RNF-09, RNF-10— se verifican en su mayoría por otros mecanismos ya previstos en 7.3.1: análisis estático, contratos, pruebas unitarias y de integración con Pytest y Hypothesis, y la integración continua.

**Convención de tablas del documento, medida y no supuesta.** La primera columna va en negrita por el estilo de tabla del documento, la fila de encabezado también, y la nota al pie va en cursiva. Conviene saberlo antes de crear cualquier tabla nueva.

## Trazabilidad cargada el 2026-09-17

**Tabla 10** en 7.3.1: `Requerimiento | Casos de uso | Casos de prueba | Verificación cuando no hay caso de prueba`, con una fila por requerimiento. 38 filas, 156 celdas.

**Por qué hacía falta.** Al reemplazar la Tabla 7 por la Figura 5, los casos de uso **perdieron su columna de requerimientos**: la relación entre caso de uso y requerimiento dejó de existir en el texto del documento, y 7.3.1 declara que el plan de pruebas debe incluirla. La matriz la restituye y la completa con los casos de prueba.

**Hallazgos que la matriz deja visibles.**

- **Doce requerimientos no tienen caso de prueba propio.** Nueve tienen un medio alternativo declarado en la cuarta columna (pruebas de integración, verificación manual, análisis estático, protocolo de rendimiento, inspección de datos o la propia integración continua).
- **RF-15 y RF-16 no tienen caso de uso ni caso de prueba.** Son capacidades visibles para el usuario —recomendar materias no seleccionadas y priorizar por impacto en el avance curricular— que §1 compromete y que no están representadas en la Figura 5. Requieren agregar dos casos de uso, sus casos de prueba, y regenerar la figura. Queda como P-07.
- **RF-09, RF-18 y RF-20 no tienen caso de uso** pero sí un medio de verificación. RF-18 y RF-20 tienen caso de prueba; RF-09 no, porque es un requerimiento de infraestructura de datos y no de comportamiento visible.
- Los doce requerimientos no funcionales no tienen caso de uso, como corresponde a atributos de calidad; siete tienen caso de prueba y cinco un medio alternativo.

**Numeración de tablas pendiente.** La Tabla 10 se insertó en 7.3.1, que aparece **antes** de la Tabla 6 en 7.3.2. El documento numera 1, 2, 3, 4, 5, 9, 6, 10, fuera del orden de aparición. Se deja sin tocar por decisión del usuario, que resolverá el formato cerca de la entrega.

## Capítulo 7.2 cargado el 2026-09-17

Cuatro tablas con su párrafo de introducción cada una: **Tabla 7** en 7.2.1, **Tabla 8** en 7.2.2, **Tabla 9** en 7.2.3 y **Tabla 10** en 7.2.4. Otras 97 líneas agregadas y 0 borradas.

> Nota de sincronización: de esas cuatro tablas, las de 7.2.1, 7.2.2 y 7.2.4 fueron **reemplazadas después por las Figuras 2 a 5** del pipeline nuevo (D-09), con la numeración correlativa definitiva. La Tabla 9, de descripción de casos de uso, sigue en el documento como tabla. Y la matriz de trazabilidad que se menciona arriba también se rotuló «Tabla 10», así que ese número está usado dos veces y hay que resolverlo en la pasada de formato.

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
