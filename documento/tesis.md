1. Introducción	3
Escenario tecnológico	3
Problemática y limitaciones técnicas	4
Propuesta de solución general	4
1.1. Justificación	5
Eficiencia computacional y rendimiento	6
Escalabilidad y confiabilidad	6
Mantenibilidad y calidad del código	7
Viabilidad económica	7
2. Delimitación del proyecto	7
2.1. Objetivo general	7
2.2. Objetivos específicos	8
3. Delimitación del sistema de información	8
3.1. Objetivo del sistema	8
3.2. Límites del sistema	8
3.3. Alcances del sistema	9
3.4. No contempla	10
4. Elicitación	11
4.1. Actividad del cliente	12
4.2. TIC	12
Lenguajes de programación y runtimes	13
Frameworks y librerías principales	13
Bases de datos y almacenamiento	13
Arquitectura y despliegue	14
Entornos de desarrollo y control de versiones	15
4.3. Competencia	16
4.4. Relevamiento de la organización	18
4.4.1. Relevamiento estructural	18
4.4.2. Relevamiento funcional	18
4.4.3. Procesos de negocio	19
5. Diagnóstico	20
5.1. Cierre y alcance del relevamiento a estudiantes	20
5.2. Resultados finales y conclusiones	20
5.2.1. Visibilidad de la oferta e incertidumbre	20
5.2.2. Restricciones de planificación y oferta académica	20
5.2.3. Carga operativa y dependencia de asistencia	21
5.2.4. Diferencias según el avance en la carrera	21
5.3. Conclusión diagnóstica e implicancias para el prototipo	21
6. Propuesta de solución	22
6.1. Descripción general de la propuesta	22
6.1.1. A nivel funcional	22
6.1.2. A nivel técnico	22
6.1.3. Diagrama de arquitectura	22
6.2. Requerimientos	22
6.2.1. Requerimientos funcionales	22
6.2.2. Requerimientos no funcionales	22
6.2.3. Requerimientos candidatos	22
7. Desarrollo del prototipo	22
7.1. Metodología y proceso de construcción asistido por IA	22
7.2. Análisis y Diseño	24
7.2.1. Diagrama de casos de uso	24
7.2.2. Diagrama de clases / Entidad relación	24
7.2.3. Descripción de casos de uso	24
7.2.4. Diagrama de colaboración	24
7.2.5. Interfaz gráfica	24
7.3. Proceso de V&V	24
7.3.1. Plan de pruebas	24
7.3.2. Diseño de casos de pruebas	24
8. Referencias	24
9. Anexos	26
Anexo A. Registro de elicitación	26
Anexo B. Instrumentos de relevamiento	26
Anexo C. Evidencias del proceso actual	26
Anexo D. Mapa horizontal de correlatividades de Ingeniería en Software	26
# 1. Introducción
### Escenario tecnológico
Los sistemas de información constituyen el soporte de la gestión académica universitaria, centralizando elementos esenciales como planes de estudio, correlatividades, períodos académicos, oferta de cátedras, horarios, cupos e inscripciones. Desde la perspectiva del estudiante, el canal principal de interacción es un portal web autenticado que permite examinar la oferta vigente y seleccionar las asignaturas que se desean cursar. En este dominio confluyen diversos actores institucionales: estudiantes, Bedelía, coordinación de carrera, autoridades académicas, docentes y administradores de sistemas.
El caso de estudio corresponde a Ingeniería en Software durante 2027. El MVP permitirá operar sobre el período vigente y planificar únicamente el siguiente, según la secuencia 1A → 1B → 2A → 2B → 1A del año siguiente. El plan de estudios y sus correlatividades se consideran insumos disponibles. La solución se proyecta como una aplicación web desacoplada, con una interfaz orientada a componentes, una API REST documentada y una base de datos relacional. El núcleo de decisión se modelará como un problema de satisfacción y optimización de restricciones, enfoque apropiado para combinar reglas obligatorias y preferencias del alumno.
### Problemática y limitaciones técnicas
El relevamiento estudiantil realizado indica que, después de seleccionar un período académico, el portal muestra únicamente las materias disponibles para inscripción. Por lo tanto, una materia puede no aparecer sin que el alumno disponga de una vista consolidada que explique si está bloqueada por correlatividad, falta de cátedra, falta de cupo, ausencia de oferta en el período o una apertura todavía no publicada.
La información fragmentada impide registrar de manera persistente la intención de cursado y obliga al alumno a consultar reiteradamente el portal para detectar cambios. También traslada al usuario la comparación manual de cátedras, profesores, modalidades y horarios. Este procedimiento incrementa la cantidad de decisiones, expone al alumno a combinaciones incompatibles y mantiene la incertidumbre respecto de si podrá cursar todas las materias deseadas.
Desde la ingeniería de software, el problema no se define como una mera deficiencia visual. Se identifican cuatro limitaciones del sistema de información: cobertura incompleta del estado curricular visible; ausencia de persistencia y trazabilidad de materias deseadas todavía no inscribibles; inexistencia de un mecanismo automático que genere combinaciones válidas bajo restricciones; y separación entre la demanda estudiantil y el trámite institucional de apertura de cátedra. Las métricas de línea base —tiempo de planificación, reingresos, dificultad e incertidumbre— fueron medidas mediante el relevamiento estudiantil y se analizan en la sección 5. Diagnóstico.
Cierre del relevamiento estudiantil. El relevamiento cuantitativo a estudiantes se cerró con (45 respuestas) y se documenta en , documento de trabajo que concentra los instrumentos y las evidencias del proceso actual. Los resultados y sus limitaciones se presentan en la sección 5. Diagnóstico.
### Propuesta de solución general
Se propone diseñar y evaluar un prototipo web que diferencie dos operaciones: la asistencia a la inscripción del período académico actual y la planificación del siguiente período soportado por el MVP. El sistema representará el plan de estudios como un grafo curricular (véase Anexo D), mostrará el estado y el motivo de disponibilidad de cada materia y permitirá registrar para el período siguiente intenciones de cursado condicionadas, sin tratarlas como inscripciones ni asumir la aprobación de materias todavía en curso. Cuando exista oferta publicada, generará alternativas de cátedras sin superposición; en caso contrario, planificará a nivel de materia y señalará que la oferta está pendiente.
Para el período actual, el motor considerará como restricciones duras las correlatividades cumplidas según la normativa institucional, la oferta, los cupos y la incompatibilidad horaria. Para el período siguiente, la inscripción vigente en una materia precorrelativa podrá habilitar únicamente una intención condicionada como hipótesis de diseño pendiente de validación institucional; antes de convertirla en una inscripción deberá recalcularse con los resultados académicos oficiales. La carga académica máxima será una restricción dura cuando exista un límite institucional validado; en ausencia de esa regla, funcionará como límite configurable por el estudiante. Las preferencias del estudiante por un profesor, cátedra, modalidad, franja horaria, cantidad de días de cursado y horas libres se tratarán como restricciones configurables o criterios de optimización.
Entre las materias seleccionadas y habilitadas para cursar, el sistema priorizará aquellas cuya aprobación produzca un mayor impacto en el avance curricular. Este impacto se medirá primero por la cantidad de materias pendientes que quedarían habilitadas directamente; ante un empate, se considerará la cantidad de materias descendientes aún pendientes en el grafo y, luego, el grado de satisfacción de las preferencias configuradas por el estudiante. Esta prioridad se implementará como un criterio de optimización.
Además, el sistema podrá recomendar materias que el estudiante no haya seleccionado, siempre que estén habilitadas, formen parte de la oferta del período y su aprobación contribuya al avance curricular, especialmente cuando permita desbloquear otras materias pendientes. Cada recomendación deberá incluir una justificación y solo podrá incorporarse al conjunto de materias utilizado por el motor para generar alternativas de cursado después de la aceptación expresa del estudiante.
Cuando no exista una solución completa, el sistema deberá identificar los conflictos y proponer modificaciones explícitas, sin excluir materias de manera silenciosa.
Como aporte institucional, el prototipo registrará intenciones de cursado condicionadas y solicitudes de apertura para consolidar la demanda por materia y período. Cada registro conservará su estado y motivo; esta información se presentará de forma agregada, sin ejecutar inscripciones reales, reservar vacantes ni decidir automáticamente la apertura de cátedras.
## 1.1. Justificación
El diseño propuesto resulta adecuado porque el problema combina dependencias curriculares, restricciones horarias, capacidad limitada y preferencias heterogéneas. Resolverlo mediante reglas dispersas en la interfaz produciría alto acoplamiento y dificultaría comprobar la corrección. En cambio, separar la representación curricular, el motor de restricciones, la persistencia y la experiencia de usuario permite evaluar cada componente de forma independiente.
### Eficiencia computacional y rendimiento
La búsqueda exhaustiva de todas las combinaciones de cátedras crece de manera combinatoria a medida que aumentan las materias y alternativas. Por ello se utilizará CP-SAT de OR-Tools, que permite representar variables enteras y booleanas, restricciones obligatorias, preferencias ponderadas y una función objetivo, y devuelve estados explícitos como óptimo, factible, infactible o desconocido (Google, 2024).
La ejecución del solver se aislará del procesamiento principal de la API mediante un proceso de ejecución acotado, con un límite temporal configurable. Si el solver alcanza dicho límite, el sistema informará el estado obtenido sin presentar una alternativa inválida como solución definitiva.
Las restricciones relevantes se identificarán de manera trazable y se complementarán con una capa de explicación perteneciente al dominio. Esta capa traducirá los conflictos detectados a mensajes comprensibles para el usuario y permitirá indicar qué materias, horarios, cupos o reglas académicas impiden obtener una combinación completa.
El objetivo preliminar será resolver en cinco segundos o menos al menos el 95 % de las ejecuciones de escenarios controlados. Para evaluar esta meta se documentarán la composición de los escenarios, el hardware utilizado, la versión y configuración de OR-Tools, la semilla, la cantidad de procesos de trabajo, el número de ejecuciones por escenario y el tratamiento del estado UNKNOWN. El indicador principal será el percentil 95 del tiempo de resolución.
### Escalabilidad y confiabilidad
El monolito modular delimitará el cliente web, la API, el motor de optimización y la persistencia, lo que facilitará una futura separación de los módulos que concentren carga sin exigirla en el prototipo. Las operaciones de persistencia se apoyarán en transacciones y restricciones de integridad de PostgreSQL. El motor deberá producir resultados reproducibles bajo una configuración controlada del solver, fijando la versión, la semilla y el número de trabajadores. Cuando existan múltiples soluciones equivalentes, no se asumirá que siempre devolverá la misma alternativa. Cada propuesta conservará trazabilidad sobre las restricciones y preferencias utilizadas. Si el solver alcanza su límite temporal o no encuentra una combinación, el sistema deberá comunicar el estado sin presentar una alternativa inválida.
### Mantenibilidad y calidad del código
La arquitectura modular separará la representación del dominio académico, la planificación, la optimización, la explicación de conflictos, la persistencia y la presentación. Los contratos de la API se documentarán mediante OpenAPI, lo que permitirá generar documentación, validar las solicitudes y respuestas y producir tipos TypeScript para el frontend a partir de una fuente común (OpenAPI Initiative, 2021).
La integración continua verificará automáticamente los contratos, las migraciones de datos, el análisis estático, la compilación del frontend y las pruebas automatizadas. Los requerimientos se redactarán de forma única, medible y verificable siguiendo los principios de ISO/IEC/IEEE 29148:2018, mientras que los atributos de calidad se organizarán con ISO/IEC 25010:2023 (International Organization for Standardization [ISO], 2018, 2023).
### Viabilidad económica
El prototipo utilizará tecnologías de código abierto y podrá ejecutarse inicialmente en un entorno local. React, FastAPI, PostgreSQL y OR-Tools no requieren licencias por usuario. Esta decisión reduce el costo directo de licenciamiento y evita condicionar la investigación a la compra de una plataforma institucional completa.
Cuando las pruebas con usuarios requieran acceso remoto, el prototipo podrá desplegarse en una infraestructura de nube de bajo costo. El proveedor y el mecanismo de despliegue se seleccionarán durante la implementación, considerando la facilidad técnica, los costos y las políticas institucionales relevadas, sin que formen parte de los requisitos funcionales del sistema. Una eventual puesta en producción deberá considerar costos de integración, seguridad, soporte, monitoreo y mantenimiento.
# 2. Delimitación del proyecto
## 2.1. Objetivo general
Diseñar, desarrollar y evaluar un prototipo web de planificación académica anticipada, basado en un grafo curricular y un modelo de satisfacción y optimización de restricciones, para asistir a los alumnos de Ingeniería en Software en la inscripción del período académico actual y en la planificación condicionada del siguiente período soportado por el MVP durante el caso de estudio 2027, y aportar información trazable sobre la demanda de materias.
## 2.2. Objetivos específicos
Relevar y modelar el proceso actual de inscripción, las reglas académicas, los actores, la oferta, los cupos, los horarios y el trámite de apertura de cátedra.
Especificar requerimientos funcionales y no funcionales verificables, diferenciando restricciones obligatorias de preferencias deseables.
Diseñar la arquitectura modular, el modelo de datos, el grafo de correlatividades, los contratos de API y la interfaz del prototipo.
Implementar la visualización curricular, la planificación de materias, el registro de demanda y el motor CP-SAT para generar y ordenar alternativas.
Verificar el sistema mediante pruebas unitarias, de integración y de escenarios factibles e infactibles, incluyendo casos en los que una materia precorrelativa cursada resulte aprobada o no aprobada, el recálculo correspondiente y mediciones de corrección y tiempo de respuesta.
Validar el prototipo con alumnos mediante tareas comparativas y evaluar de manera exploratoria la utilidad de la información institucional con personal de la universidad.
Documentar los resultados, las limitaciones y las condiciones necesarias para una futura integración institucional.
# 3. Delimitación del sistema de información
## 3.1. Objetivo del sistema
La finalidad del sistema es asistir al alumno en dos momentos: la inscripción del período académico actual y la planificación condicionada del siguiente período soportado por el MVP. Para ello deberá ofrecer una vista completa del plan de estudios, explicar el estado de cada materia, distinguir una opción habilitada de una intención condicionada, conservar las intenciones de cursado y generar combinaciones de cátedras cuando exista oferta suficiente. Paralelamente, deberá consolidar la demanda insatisfecha y asistir a la institución en la evaluación de alternativas de cambio de aula o apertura de cátedra, sin reemplazar la decisión administrativa ni ejecutar modificaciones sobre el sistema académico oficial.
## 3.2. Límites del sistema
La validez de las propuestas del período actual dependerá de que el plan de estudios, las correlatividades, los horarios, los cupos, las modalidades y las reglas del período hayan sido cargados correctamente. Las propuestas del período siguiente deberán identificarse como condicionadas mientras dependan de resultados académicos u oferta todavía no confirmados.
El prototipo no reemplazará al sistema académico institucional ni efectuará inscripciones definitivas.
No reservará cupos; una intención de cursado condicionada para el período siguiente será informativa, deberá revalidarse antes de una inscripción real y no representará una vacante garantizada ni un derecho adquirido.
No adoptará ni ejecutará decisiones administrativas sobre cambios de aula o apertura de cátedras. Podrá generar propuestas y simulaciones, pero su aprobación y aplicación corresponderán al actor institucional autorizado.
El motor podrá devolver una solución óptima, factible, infactible o indeterminada por límite temporal; nunca deberá presentar como válida una combinación que infrinja una restricción dura.
La evaluación se limitará a Ingeniería en Software y a datos del caso de estudio 2027, simulados o anonimizados cuando contengan información personal. Para verificar la continuidad de la secuencia operativa soportada, se incluirá la transición desde 2B hacia 1A del año académico siguiente únicamente como escenario límite simulado.
La interfaz se orientará a navegadores modernos de escritorio y diseño web adaptable; no se garantizará compatibilidad con navegadores descontinuados.
Las notificaciones se simularán dentro del prototipo y no implicarán un servicio productivo de correo electrónico o notificaciones push.
## 3.3. Alcances del sistema
Representar el 100 % de las materias del plan de Ingeniería en Software y sus correlatividades disponibles para el caso de estudio.
Representar y permitir consultar los períodos 1A, 1B, 2A y 2B, sin modificar la posición estructural de las materias en el grafo. Para las acciones de inscripción y planificación, el MVP aplicará una ventana móvil formada por el período actual y el siguiente dentro de la secuencia operativa soportada: 1A → 1B → 2A → 2B → 1A del año académico siguiente. Los demás períodos soportados continuarán visibles para consulta, oferta, antecedentes y reportes, pero sin acciones operativas habilitadas.
Calcular y explicar el estado de cada materia: aprobada, habilitada para inscripción, condicionada para el período siguiente, bloqueada por correlatividad o no disponible por falta de cátedra o de cupo. Cuando el estudiante seleccione una materia sin cupo del período actual, podrá incorporarla a su planificación con estado planificada y motivo falta de cupo.
Permitir la selección múltiple de materias y el registro de preferencias obligatorias o deseables de cátedra, profesor, modalidad, días y franjas horarias.
Generar hasta tres alternativas ordenadas cuando existan combinaciones válidas; si existen menos, mostrar todas las disponibles.
Garantizar en los casos de prueba que el 100 % de las alternativas presentadas para el período actual respete correlatividades, cupos, período, el límite de carga aplicable y la ausencia de superposición; las alternativas futuras que aún dependan de una precorrelativa cursada u oferta no confirmada deberán quedar clasificadas como condicionadas y no como válidas para inscripción.
Resolver en cinco segundos o menos al menos el 95 % de las ejecuciones de escenarios controlados, conforme al protocolo de evaluación definido para el caso de estudio.
Detectar escenarios infactibles e identificar las restricciones, materias y cátedras involucradas.
Registrar una única intención vigente por alumno, materia y período, con estado y motivo explícitos, incluyendo las intenciones planificadas por falta de cupo y evitando duplicaciones en la demanda.
Mostrar por materia la demanda total, la demanda habilitada para el período actual, la demanda condicionada del período siguiente, la demanda planificada por falta de cupo y las causas correspondientes.
Cuando una cátedra del período actual no posea cupo, conservar la materia en la planificación del estudiante con estado planificada y motivo falta de cupo, sin confirmar una inscripción ni reservar una vacante.
Consolidar esas intenciones como demanda insatisfecha y evaluar si una cátedra existente puede trasladarse a un aula disponible de mayor capacidad.
Cuando no exista un aula compatible, generar una propuesta de apertura de una nueva cátedra y recalcular cuántos estudiantes podrían incorporarse, sujeta a aprobación institucional.
## 3.4. No contempla
Integración productiva con el sistema académico de la universidad.
Autenticación institucional, inicio de sesión único o gestión real de permisos.
Confirmación legal o administrativa de inscripciones.
Reserva, asignación o liberación real de cupos.
Aplicación automática de cambios sobre la oferta académica institucional. El prototipo podrá generar propuestas de traslado de aula o apertura de cátedra, pero no ejecutarlas ni contratar o asignar profesores.
Notificaciones productivas por correo, SMS o aplicaciones móviles.
Desarrollo de aplicaciones móviles nativas para iOS o Android.
Migración histórica de expedientes o datos académicos.
El prototipo se implementará y evaluará exclusivamente para la carrera Ingeniería en Software y el período académico definido como caso de estudio. No se contempla la carga, administración ni visualización de otras carreras, ni la gestión de equivalencias entre planes de estudio o reformas curriculares. Sin embargo, el modelo de datos y la arquitectura evitarán dependencias exclusivas con esta carrera para permitir una futura ampliación.
Operación de alta disponibilidad, acuerdos de nivel de servicio o despliegue institucional definitivo.
Asignación institucional real de aulas y horarios a las cátedras. El prototipo podrá simular un traslado y generar una propuesta sujeta a autorización.
Programación institucional completa de aulas y docentes: asignación de docentes a cátedras y detección de conflictos entre cátedras que el prototipo no gestiona. El prototipo sí verificará que el aula propuesta esté disponible en la franja horaria de la cátedra, según los datos de oferta que recibe.
Administración productiva del inventario de aulas, su disponibilidad física y otros recursos institucionales. El prototipo utilizará datos simulados o provistos por la universidad para evaluar escenarios.
Período académico de Verano, ubicado entre 2B y 1A del año académico siguiente. Su oferta, reglas especiales, correlatividades e inscripción quedan fuera del MVP actual, aunque su incorporación se considera una evolución futura del sistema.
El prototipo no contempla inscripciones de más de tres materias por bimestre, equivalentes a seis materias por cuatrimestre. La planificación se limita a ese máximo y no se modelan escenarios con una carga mayor. Esta limitación responde al alcance definido para el prototipo y no constituye una afirmación sobre la regla académica vigente en la universidad.
Estas exclusiones se refieren a la operación productiva de los sistemas y recursos institucionales. El prototipo podrá modelar aulas y cátedras con datos simulados o provistos mediante un mecanismo desacoplado, generar propuestas y registrar decisiones en un escenario de prueba; no aplicará cambios reales sobre la oferta académica. También comprobará que las cátedras seleccionadas para un mismo estudiante no presenten superposiciones horarias.
# 4. Elicitación
La elicitación se realizará mediante revisión documental, observación del portal, pruebas de caja negra, encuesta cuantitativa, entrevistas semiestructuradas con alumnos y entrevistas con personal universitario. Los resultados se convertirán en reglas de negocio, historias de usuario, restricciones, criterios de aceptación y modelos AS-IS y TO-BE.
La especificación tomará como referencia ISO/IEC/IEEE 29148:2018 para definir requerimientos trazables y verificables, e ISO/IEC 25010:2023 para clasificar atributos de calidad. El diseño web considerará WCAG 2.2, nivel AA, para no depender exclusivamente del color y mantener navegación por teclado y mensajes comprensibles (World Wide Web Consortium [W3C], 2024).
En seguridad se aplicará el OWASP Top 10:2025 como guía inicial para controles de acceso, validación de entradas, configuración, componentes y registro de eventos (OWASP Foundation, 2025). El tratamiento de datos personales deberá ajustarse a la Ley 25.326, aplicando minimización, finalidad definida, consentimiento cuando corresponda, anonimización de evidencias y acceso restringido (Congreso de la Nación Argentina, 2000).
La comunicación entre componentes utilizará HTTP conforme a RFC 9110 y contratos OpenAPI 3.1. El transporte productivo deberá cifrarse mediante HTTPS. Los recursos de la API representarán materias, cátedras, períodos, reglas, preferencias, propuestas y registros de demanda, con códigos de estado coherentes y validación de esquemas (Fielding, Nottingham, & Reschke, 2022; OpenAPI Initiative, 2021).
Nota de avance. El relevamiento a estudiantes se encuentra finalizado; la elicitación con representantes de la universidad continúa mediante . El documento distingue entre los resultados descriptivos del relevamiento estudiantil y los datos institucionales pendientes de validación.
## 4.1. Actividad del cliente
El actor principal es el alumno de Ingeniería en Software que planifica e intenta confirmar su cursado. A partir de la evidencia disponible, el flujo AS-IS preliminar es el siguiente:
Ingresar al portal académico con sus credenciales.
Seleccionar la opción de inscripción a materias.
Seleccionar el período académico disponible.
Consultar la lista de materias que el sistema considera inscribibles en ese momento.
Abrir cada materia para revisar cátedras, horarios, modalidad y profesor, cuando esa información se encuentra publicada.
Elegir una cátedra y revisar las validaciones de correlatividad, cupo, carga académica y superposición.
Modificar manualmente la selección cuando el sistema informa un conflicto.
Confirmar las materias que permanecen válidas.
Reingresar en otro momento para comprobar si se habilitaron materias, cátedras o cupos que antes no aparecían.
Presentarse en Bedelía cuando necesita solicitar la apertura de una cátedra no disponible, según el procedimiento institucional vigente.
Los vacíos operativos observados son la falta de una vista completa del plan, la ausencia de explicación uniforme para materias no visibles, la imposibilidad de conservar todas las materias deseadas, el armado manual de horarios y la falta de seguimiento integrado de solicitudes de apertura.
Cierre del relevamiento estudiantil. La frecuencia y magnitud observadas se analizaron mediante la encuesta documentada en . El corte final reúne (45 respuestas); debido al carácter intencional y no probabilístico de la muestra, no se afirma representatividad estadística ni se generalizan los hallazgos a toda la población estudiantil.
## 4.2. TIC
Las decisiones tecnológicas se consideran una línea base para el prototipo y podrán ajustarse si la elicitación institucional identifica restricciones de infraestructura o integración.
### Lenguajes de programación y runtimes
TypeScript se utilizará en el frontend para representar de forma explícita las entidades, los estados de interfaz y los contratos generados desde la especificación OpenAPI. Su sistema de tipos permitirá detectar durante el desarrollo cambios incompatibles entre el cliente y la API.
Python se utilizará en el backend debido a su integración directa con FastAPI, Pydantic y OR-Tools. Esta elección permitirá implementar la API, las reglas del dominio académico, la capa de explicación y el modelo CP-SAT dentro de un mismo entorno de ejecución, manteniendo separados sus respectivos módulos.
### Frameworks y librerías principales
React y TypeScript se utilizarán para construir el grafo curricular, el selector de períodos, los paneles de detalle, la configuración de preferencias y el calendario semanal como componentes reutilizables (React Team, s. f.). Vite se utilizará como herramienta de desarrollo y construcción del frontend, mientras que TanStack Query administrará las consultas, la actualización y el estado remoto proveniente de la API.
La visualización del plan de estudios se implementará mediante React Flow y un algoritmo de disposición jerárquica, dado que las materias requieren nodos personalizados, estados visuales, explicaciones y acciones interactivas.
FastAPI proveerá los endpoints REST, la validación de solicitudes y respuestas y la generación automática de la especificación OpenAPI (FastAPI, s. f.). Pydantic representará los contratos y la configuración de la aplicación.
OR-Tools CP-SAT implementará las restricciones obligatorias, las preferencias ponderadas, los límites temporales y la generación de alternativas. El solver permanecerá desacoplado de la API mediante una interfaz perteneciente al dominio, de modo que pueda probarse independientemente y compararse con estrategias deterministas.
SQLAlchemy se utilizará para el acceso a los datos y Alembic para administrar migraciones versionadas del esquema de PostgreSQL.
### Bases de datos y almacenamiento
PostgreSQL almacenará los planes de estudio, materias, correlatividades, períodos académicos, cátedras, horarios, cupos, aulas y su disponibilidad, preferencias, intenciones de cursado, demanda agregada, propuestas de resolución de demanda y decisiones institucionales. Se selecciona por su soporte transaccional, integridad referencial, consultas relacionales y madurez.
Las correlatividades se representarán como relaciones entre materias y podrán recorrerse mediante consultas recursivas. Debido al alcance acotado del prototipo, no se incorporará una base de datos de grafos adicional.
SQLAlchemy proporcionará la capa de acceso a datos y Alembic administrará las modificaciones versionadas del esquema. Los datos utilizados durante el desarrollo serán simulados o seudonimizados y no contendrán credenciales académicas reales. La eventual validación con usuarios deberá definir mecanismos de autorización, retención y eliminación de los datos recolectados.
### Arquitectura y despliegue
Se adoptará una arquitectura formada por una aplicación web React y un backend modular desarrollado con FastAPI. El backend se mantendrá como un monolito modular y separará la API, el dominio académico, la planificación, la explicación de conflictos, el adaptador de optimización y la persistencia.
Esta organización reduce la complejidad operativa frente a una arquitectura de microservicios y permite verificar cada módulo de manera independiente. El solver CP-SAT se ejecutará mediante un proceso acotado para evitar que una operación intensiva en CPU bloquee el procesamiento normal de la API.
El modelo de datos separará las entidades estudiante, carrera, plan de estudios, materia y correlatividad. Esta separación permitirá que, en una evolución futura, el sistema identifique la carrera y el plan de estudios asociados al estudiante y genere el grafo curricular correspondiente. La operación simultánea con múltiples carreras no forma parte de los entregables ni de los criterios de evaluación del prototipo actual.
Durante el desarrollo, el frontend, el backend y PostgreSQL podrán ejecutarse localmente mediante Docker Compose. La configuración se suministrará mediante variables de entorno y los secretos no se almacenarán en el repositorio. Las modificaciones de la base de datos se gestionarán mediante migraciones versionadas.
La arquitectura evitará dependencias exclusivas de un proveedor de infraestructura. El mecanismo de despliegue para las pruebas con usuarios se seleccionará considerando la facilidad de implementación, el costo, el cifrado de las comunicaciones, la administración de secretos y las políticas institucionales identificadas durante el relevamiento.
### Entornos de desarrollo y control de versiones
Git y GitHub se utilizarán para el control de versiones y la revisión de cambios. GitHub Actions ejecutará la integración continua y verificará la instalación reproducible de dependencias, las migraciones, el análisis estático, las pruebas automatizadas y la compilación del frontend.
Pytest verificará las reglas del dominio, la persistencia, la API y los escenarios del solver. Hypothesis permitirá comprobar propiedades generales, como la ausencia de superposiciones y el cumplimiento de las restricciones obligatorias. HTTPX y Schemathesis verificarán la API y su correspondencia con la especificación OpenAPI.
Playwright cubrirá un conjunto acotado de recorridos completos de la interfaz y se complementará con axe-core para detectar problemas básicos de accesibilidad. Ruff y mypy verificarán el código Python, mientras que TypeScript y ESLint verificarán el frontend.
Las herramientas manuales de consulta de la API podrán utilizarse durante la exploración, pero no constituirán la evidencia principal de verificación. El entorno de desarrollo no dependerá de un editor específico: la reproducción del proyecto estará determinada por sus archivos de configuración, versiones, contenedores y comandos documentados.
Tabla 1
Síntesis del stack tecnológico propuesto
| Área | Tecnologías | Finalidad |
| Frontend | React, TypeScript y Vite | Construcción y compilación de la interfaz web |
| Gestión de datos remotos | TanStack Query | Consulta, actualización y sincronización con la API |
| Grafo curricular | React Flow y ELK | Visualización jerárquica e interactiva del plan de estudios |
| Contratos del cliente | Tipos TypeScript generados desde OpenAPI | Mantener sincronizados frontend y backend |
| Backend | Python, FastAPI y Pydantic | Implementación de la API, validación y contratos |
| Persistencia | SQLAlchemy 2 y Alembic | Acceso a datos y migraciones versionadas |
| Optimización | OR-Tools CP-SAT | Generación y evaluación de alternativas de cursado |
| Base de datos | PostgreSQL | Persistencia relacional e integridad de la información |
| Pruebas del backend | Pytest, Hypothesis y HTTPX | Verificación del dominio, propiedades y API |
| Contratos de API | Schemathesis | Pruebas automáticas derivadas de OpenAPI |
| Interfaz y accesibilidad | Playwright y axe-core | Verificación de flujos completos y accesibilidad |
| Calidad del backend | Ruff y Pyright | Análisis estático, formato y verificación de tipos |
| Calidad del frontend | ESLint y TypeScript | Análisis estático y verificación de tipos |
| Infraestructura local | Docker Compose | Ejecución reproducible de los componentes |
| Control e integración | Git, GitHub y GitHub Actions | Versionado, revisión e integración continua |
| Configuración | Variables de entorno y secretos externos | Separación segura entre código y configuración |
| Evidencia | Cobertura y resultados automatizados | Trazabilidad de la verificación técnica |
Nota. Elaboración propia.
## 4.3. Competencia
Se compararon tres soluciones que cubren partes del problema: un planificador orientado al alumno, una plataforma universitaria de horarios y una suite institucional comercial. La comparación se basa en información pública de cada proveedor y no sustituye una prueba de integración.
Tabla 2
Comparación técnica de soluciones relacionadas
| Solución analizada | Características técnicas relevantes | Limitaciones identificadas | Valor agregado del proyecto |
| Coursicle | Planificador web y móvil; calendario semanal; horarios alternativos; seguimiento y alertas de cupos. | Depende del catálogo y soporte de cada institución; la inscripción sigue en el portal externo; no modela el trámite local de apertura. | Grafo curricular completo, explicación de estados, optimización con reglas locales y consolidación de demanda institucional. |
| UniTime | Plataforma web de código abierto; timetabling de cursos y exámenes; student scheduling; algoritmos de optimización. | Mayor amplitud y complejidad de configuración e integración; requiere adaptar datos y procesos; no prioriza la incertidumbre del alumno en este caso local. | Prototipo acotado a una carrera, interfaz explicativa en español, validación controlada y trazabilidad de conflictos y demanda. |
| Ellucian Smart Planning & Registration | Suite comercial de gestión estudiantil; planificación, reglas de asesoría y registro integrado. | Dependencia del proveedor, licenciamiento e integración institucional; alcance superior al necesario para el prototipo. | Arquitectura abierta y modular, adaptación al proceso relevado y ausencia de licencias por usuario para la investigación. |
Nota. Coursicle permite construir y comparar horarios y ofrece alertas de cupos; UniTime integra timetabling y student scheduling con algoritmos de optimización; Ellucian Smart Planning & Registration integra planificación y registro dentro de una suite institucional (Coursicle, s. f.; Ellucian, s. f.; UniTime, s. f.).
Ninguna alternativa invalida el proyecto. Coursicle resuelve planificación personal y alertas, pero no se orienta al trámite institucional local ni a la demanda para apertura. UniTime posee mayor profundidad de timetabling, aunque su alcance y complejidad exceden el prototipo acotado y requieren adaptación al plan y al proceso local. Ellucian ofrece integración institucional amplia, pero es una plataforma comercial y cerrada cuyo costo, parametrización e integración deben negociarse. El diferencial defendible es ofrecer un prototipo acotado y adaptable al proceso local, con un grafo curricular completo, explicación causal del estado de cada materia, recomendaciones justificadas, optimización de cátedras, consolidación de la demanda y evaluación empírica con estudiantes.
## 4.4. Relevamiento de la organización
El entorno objetivo es una universidad que administra carreras, planes de estudio, períodos académicos, oferta de cátedras e inscripciones. El sistema propuesto se ubicaría como apoyo a la planificación del alumno y como fuente complementaria de demanda para las áreas académicas.
Nota de avance. El relevamiento estructural, funcional y de procesos de la universidad se encuentra en curso mediante entrevistas documentadas en . Los nombres de áreas, responsables, reglas, plazos y canales indicados a continuación son provisionales y deberán reemplazarse por la estructura validada antes del cierre de la sección 4.4.
### 4.4.1. Relevamiento estructural
Organigrama provisional del ámbito involucrado:
Autoridades universitarias.
Gestión académica.
Coordinación de la carrera Ingeniería en Software.
Bedelía o área de atención y administración académica.
Docentes y responsables de cátedra.
Alumnos de Ingeniería en Software.
La relación exacta entre estas dependencias, su jerarquía formal y la unidad que decide la apertura de cátedras permanecen pendientes de confirmación institucional.
### 4.4.2. Relevamiento funcional
Alumno: consulta la oferta, selecciona materias y cátedras, expresa preferencias, resuelve conflictos y confirma o solicita alternativas.
Bedelía o gestión académica: recibe las solicitudes de estudiantes cuando una cátedra alcanza su cupo, registra cada caso mediante un ticket en el CRM institucional y utiliza esas solicitudes para conocer la demanda adicional. El circuito posterior del ticket, sus estados y responsables todavía deben relevarse.
Coordinación de carrera: analiza necesidades académicas, oferta, correlatividades y disponibilidad de recursos; su participación exacta en las aperturas debe validarse.
Autoridad académica competente: autoriza o rechaza cambios de oferta y apertura de cátedras conforme a criterios institucionales todavía en relevamiento.
Docente o responsable de cátedra: aporta disponibilidad, modalidad, horarios y condiciones de cursado cuando corresponda.
Administrador del sistema: mantiene parámetros, períodos, catálogos, roles y trazabilidad técnica; este rol pertenece a la solución propuesta y no implica que exista con igual alcance en el proceso actual.
### 4.4.3. Procesos de negocio
El relevamiento permitió confirmar parcialmente el tratamiento de la demanda que excede el cupo de una cátedra. El cupo se determina por la capacidad del aula asignada y la inscripción se cierra automáticamente cuando se alcanza. Los estudiantes interesados solicitan su incorporación a través de Bedelía, que registra cada caso como un ticket en el CRM institucional.
A partir de la cantidad de solicitudes recibidas, se verifica si existe un aula disponible con capacidad suficiente. Cuando existe, la cátedra se traslada a esa aula y se amplía el cupo. Si no existe un aula adecuada, se gestiona la apertura de una nueva cátedra.
Permanecen pendientes de confirmación el área y los responsables que evalúan y autorizan cada alternativa, las reglas complementarias sobre disponibilidad docente y horarios, y el circuito detallado del ticket en el CRM.
Hasta finalizar la elicitación, los responsables, actividades, reglas, estados, plazos, criterios de decisión, sistemas y mecanismos de seguimiento no se considerarán definitivos. Los instrumentos y resultados se documentan en el documento de trabajo  (Demarchi, 2026), pestaña Entrevista a la universidad. Una vez validados institucionalmente, se incorporará en este apartado el modelo AS-IS correspondiente.
Aspectos pendientes de relevamiento:
Áreas responsables de definir, crear, modificar, publicar, mantener y cerrar materias, cátedras o comisiones y su oferta académica.
Actividades, entradas, salidas, validaciones y puntos de decisión de cada etapa del proceso.
Reglas académicas y administrativas para la oferta, la apertura, los cupos, los horarios y la disponibilidad docente.
Estados, plazos, niveles de aprobación, excepciones, trazabilidad y mecanismos de seguimiento.
Sistemas, fuentes de datos, integraciones, responsables de actualización y controles de calidad de la información.
Uso de la demanda estudiantil y de las solicitudes de apertura en la planificación y el mantenimiento de la oferta.
# 5. Diagnóstico
## 5.1. Cierre y alcance del relevamiento a estudiantes
El relevamiento cuantitativo a estudiantes se dio por finalizado con (45 respuestas) válidas. Todas las personas participantes declararon cursar actualmente Ingeniería en Software. La muestra fue intencional y no probabilística; por lo tanto, los resultados se interpretan como evidencia exploratoria para identificar patrones y orientar el diagnóstico, sin pretender estimar su prevalencia en toda la población estudiantil.
La composición de la muestra presenta una concentración temporal: (41 respuestas) corresponden a inscripciones realizadas en 2026 y (37 respuestas) al período 2A. Además, se detectaron (9 respuestas) con discrepancias entre la cantidad declarada de materias deseadas, la cantidad de inscripciones logradas y la respuesta final sobre si se alcanzó el plan pretendido. Por esta razón, las conclusiones priorizan las preguntas directas sobre cada dificultad y emplean la autopercepción de éxito como una variable separada.
## 5.2. Resultados finales y conclusiones
### 5.2.1. Visibilidad de la oferta e incertidumbre
La falta de visibilidad de las materias deseadas aparece como la principal fricción del proceso. Al menos una materia pretendida no estuvo disponible en el portal para (35 estudiantes), equivalentes al 77,8 % de la muestra. A su vez, (22 estudiantes), el 48,9 %, debieron ingresar seis o más veces para comprobar disponibilidad, cupos o aperturas. El nivel medio de incertidumbre fue de 3,80 sobre 5.
Entre quienes declararon no haber logrado inscribirse en todas las materias pretendidas (19 estudiantes), la incertidumbre media ascendió a 4,42 sobre 5 y (11 estudiantes) seleccionaron el valor máximo. Esto indica que la necesidad no se limita al acto de inscripción: también comprende la anticipación, el seguimiento de cambios y la explicación del estado de cada materia.
### 5.2.2. Restricciones de planificación y oferta académica
En la pregunta de selección múltiple sobre causas, las menciones más frecuentes fueron que la materia no aparecía disponible (31 menciones), la superposición horaria (19 menciones) y la falta de cupo (18 menciones). Los problemas de correlatividades (8 menciones) y los errores técnicos (7 menciones) también estuvieron presentes, aunque con menor frecuencia. Como las opciones no eran excluyentes, estos valores describen concurrencia de obstáculos y no categorías independientes.
La pregunta específica sobre horarios refuerza este hallazgo: (39 estudiantes), el 86,7 %, encontraron al menos una superposición entre materias o cátedras que querían cursar. En conjunto, la evidencia sitúa la planificación de la oferta, la compatibilidad horaria y la disponibilidad efectiva por encima de una explicación exclusivamente técnica del problema.
### 5.2.3. Carga operativa y dependencia de asistencia
Las dificultades también trasladan trabajo al estudiante y a las áreas de soporte. (31 estudiantes), el 68,9 %, debieron reingresar al menos una vez por errores, bloqueos o fallas técnicas; (19 estudiantes), el 42,2 %, consultaron a Bedelía tres o más veces; y (13 estudiantes), el 28,9 %, presentaron una solicitud formal de apertura de cátedra. Estos resultados sugieren que parte de la falta de información y seguimiento del sistema se compensa mediante consultas y trámites manuales.
### 5.2.4. Diferencias según el avance en la carrera
La dificultad media declarada fue mayor en el tramo inicial (3,00 sobre 5; 5 estudiantes) que en el intermedio (2,67; 15 estudiantes) y el avanzado (2,32; 25 estudiantes). Sin embargo, la incertidumbre fue más alta en el tramo avanzado (3,92), seguido por el intermedio (3,73) y el inicial (3,40). Debido al tamaño reducido y desigual de los grupos, estas diferencias son descriptivas y no permiten afirmar una relación estadística entre avance, dificultad e incertidumbre.
## 5.3. Conclusión diagnóstica e implicancias para el prototipo
El relevamiento cerrado no demuestra que las proporciones observadas representen a todos los estudiantes, pero sí aporta evidencia consistente de un patrón recurrente entre las personas participantes: información incompleta sobre la oferta, necesidad de monitoreo reiterado, conflictos horarios y dependencia de asistencia administrativa. Por lo tanto, respalda la necesidad de mejorar la etapa de planificación e información previa a la inscripción y justifica avanzar con el relevamiento institucional para comprender sus causas operativas.
Para el prototipo, el diagnóstico prioriza cinco capacidades: visualizar el plan completo y el motivo de disponibilidad de cada materia; conservar intenciones de cursado aunque la oferta aún no esté publicada; notificar cambios relevantes; generar alternativas sin superposición; y registrar demanda y solicitudes de apertura con trazabilidad. Las reglas, responsables, fuentes de datos e integraciones necesarias deberán validarse con las áreas de la universidad antes de considerar estas capacidades como una solución institucional definitiva.
El relevamiento institucional permitió identificar que los tickets del CRM representan una fuente de demanda insatisfecha. Su incorporación conceptual al prototipo permite conservar la intención del estudiante, consolidar la demanda y asistir a la institución en la evaluación de un cambio de aula o de la apertura de una nueva cátedra. La automatización se limita al análisis, la generación de propuestas y la trazabilidad; la decisión y la ejecución permanecen bajo responsabilidad institucional.
# 6. Propuesta de solución
## 6.1. Descripción general de la propuesta
### 6.1.1. A nivel funcional
Cuando el estudiante seleccione una materia cuyas cátedras no posean cupo, el sistema conservará la materia con estado planificada y motivo falta de cupo. Esta acción no confirmará la inscripción ni reservará una vacante, pero incorporará la intención a la demanda agregada de la materia y el período.
Cuando la demanda supere la capacidad disponible, el prototipo evaluará si existe un aula disponible con capacidad suficiente para trasladar la cátedra y ampliar su cupo. Si no encuentra una alternativa compatible, generará una propuesta de apertura de una nueva cátedra y calculará cuántos estudiantes podrían incorporarse.
La propuesta quedará sujeta a revisión y aprobación institucional. El MVP registrará la decisión y recalculará el escenario, pero no modificará automáticamente la oferta ni el sistema académico oficial.
### 6.1.2. A nivel técnico
El prototipo se implementará como una aplicación web desacoplada compuesta por un frontend React con TypeScript, una API REST desarrollada con FastAPI y una base de datos PostgreSQL. La API publicará sus contratos mediante OpenAPI y mantendrá separados los módulos de dominio académico, planificación, explicación, optimización y persistencia.
El modelo CP-SAT de OR-Tools recibirá una representación validada del escenario académico y devolverá hasta tres alternativas junto con su estado de factibilidad y la información necesaria para explicar restricciones y conflictos. Su ejecución estará sujeta a límites temporales y se aislará del procesamiento principal de la API.
El entorno local se reproducirá mediante contenedores y migraciones versionadas. La integración continua verificará el análisis estático, los contratos, las pruebas del dominio, los escenarios del solver y los flujos críticos de la interfaz.
### 6.1.3. Diagrama de arquitectura
Figura 1. Arquitectura lógica del prototipo.
Nota. Elaboración propia.
## 6.2. Requerimientos
### 6.2.1. Requerimientos funcionales
Tabla 3
Requerimientos funcionales preliminares
| ID | Requerimiento | Estado |
| RF-01 | El sistema deberá permitir consultar las materias y correlatividades del plan de estudios utilizado como caso de estudio. | Preliminar |
| RF-02 | El sistema deberá distinguir visualmente el estado de las materias representadas. | Preliminar |
| RF-03 | El estudiante deberá poder indicar las materias y preferencias consideradas para un período académico. | Preliminar |
| RF-04 | El sistema deberá detectar superposiciones horarias y restricciones obligatorias incumplidas. | Preliminar |
| RF-05 | El sistema deberá generar hasta tres alternativas factibles cuando exista más de una combinación válida. | Supuesto de diseño |
| RF-06 | Cada alternativa deberá mostrar su distribución semanal y las preferencias consideradas. | Preliminar |
| RF-07 | Cuando no exista una alternativa completa, el sistema deberá explicar los principales conflictos detectados. | Preliminar |
| RF-08 | El estudiante deberá poder comparar las alternativas generadas antes de seleccionar una. | Preliminar |
| RF-09 | Los datos académicos utilizados por el prototipo deberán poder cargarse mediante un mecanismo desacoplado de la fuente institucional definitiva. | Supuesto de diseño |
| RF-10 | El sistema deberá distinguir y operar dos períodos: la asistencia a la inscripción del período académico actual y la planificación del período siguiente, dentro de la ventana móvil definida en el alcance. | Preliminar |
| RF-11 | El sistema deberá registrar y conservar intenciones de cursado condicionadas para el período siguiente, con estado y motivo explícitos, sin tratarlas como inscripciones. | Preliminar |
| RF-12 | El sistema deberá calcular y explicar el estado y el motivo de disponibilidad de cada materia, según los estados definidos en el alcance. | Preliminar |
| RF-13 | El sistema deberá indicar la granularidad del resultado: nivel de cátedra cuando la oferta esté publicada, o nivel de materia señalando que la oferta está pendiente cuando no lo esté. | Preliminar |
| RF-14 | El sistema deberá aplicar la carga académica máxima como restricción dura cuando exista un límite institucional validado, o como límite configurable por el estudiante en su ausencia. | Preliminar |
| RF-15 | El sistema deberá poder recomendar materias no seleccionadas, con su justificación, e incorporarlas al conjunto considerado solo después de la aceptación expresa del estudiante. | Preliminar |
| RF-16 | El sistema deberá priorizar las materias por impacto en el avance curricular: primero las que habilitan más materias pendientes, luego los descendientes pendientes en el grafo y finalmente las preferencias configuradas. | Preliminar |
| RF-17 | El sistema deberá registrar la demanda agregada por materia y período y utilizarla para generar propuestas institucionales, sin ejecutar inscripciones, reservar vacantes ni aplicar decisiones sobre la oferta oficial. | Preliminar |
| RF-18 | El sistema deberá informar el estado del resultado sin presentar como definitivo el obtenido por límite temporal. | Preliminar |
| RF-19 | El sistema no deberá excluir materias de forma silenciosa: toda exclusión deberá explicarse y ofrecer alternativas de flexibilización. | Preliminar |
| RF-20 | El sistema deberá preservar la trazabilidad del escenario utilizado, incluyendo período, versión del plan, origen y fecha de los datos, restricciones y preferencias. | Preliminar |
| RF-21 | Cuando una materia del período actual no disponga de cátedras con cupo, el sistema deberá conservar la intención del estudiante con estado planificada y motivo falta de cupo, sin confirmarla como inscripción ni reservar una vacante. | Preliminar |
| RF-22 | El sistema deberá incorporar las intenciones planificadas por falta de cupo al cálculo de demanda agregada de la materia y el período. | Preliminar |
| RF-23 | Cuando la demanda supere el cupo disponible, el sistema deberá evaluar si existe un aula disponible cuya capacidad permita ampliar la cátedra sin generar incompatibilidades. | Preliminar |
| RF-24 | Cuando exista un aula adecuada, el sistema deberá generar una propuesta de traslado de la cátedra e informar la nueva capacidad y la cantidad estimada de estudiantes incorporables. | Preliminar |
| RF-25 | Cuando no exista un aula adecuada, el sistema deberá generar una propuesta de apertura de una nueva cátedra y simular su impacto sobre la demanda insatisfecha. | Preliminar |
| RF-26 | Las propuestas deberán quedar pendientes de aprobación por un actor institucional autorizado y no producirán modificaciones automáticas en los sistemas oficiales. | Preliminar |
Nota. Elaboración propia.
### 6.2.2. Requerimientos no funcionales
Tabla 4
Requerimientos no funcionales preliminares
| ID | Atributo | Requerimiento |
| RNF-01 | Rendimiento | El 95 % de los escenarios controlados deberá resolverse en cinco segundos o menos bajo las condiciones documentadas de evaluación. |
| RNF-02 | Corrección | Ninguna alternativa deberá incumplir las restricciones obligatorias representadas en el escenario. |
| RNF-03 | Explicabilidad | Una solicitud infactible deberá producir una explicación comprensible y trazable hacia las restricciones involucradas. |
| RNF-04 | Interoperabilidad | La API deberá publicar sus contratos mediante OpenAPI. |
| RNF-05 | Mantenibilidad | Dominio, optimización, explicación, persistencia y presentación deberán permanecer separados en módulos verificables. |
| RNF-06 | Reproducibilidad | El entorno local deberá poder reproducirse mediante configuración versionada y Docker Compose. |
| RNF-07 | Accesibilidad | Los recorridos principales deberán evaluarse tomando WCAG 2.2 como referencia. |
| RNF-08 | Privacidad | El prototipo no deberá almacenar credenciales académicas reales y utilizará datos simulados o seudonimizados. |
| RNF-09 | Seguridad | Los secretos y datos sensibles de configuración no deberán almacenarse en el repositorio. |
| RNF-10 | Verificabilidad | Los cambios deberán pasar análisis estático, pruebas automatizadas y compilación reproducible en integración continua. |
| RNF-11 | Reproducibilidad del solver | Las ejecuciones del solver deberán ser reproducibles bajo una configuración controlada, fijando su versión, la semilla y la cantidad de trabajadores, y documentando el tratamiento del estado indeterminado por límite temporal. |
| RNF-12 | Aislamiento de la ejecución | La ejecución del solver deberá aislarse del procesamiento principal de la API mediante un proceso acotado, de modo que una operación intensiva en CPU no bloquee el servicio. |
Nota. Elaboración propia.
### 6.2.3. Requerimientos candidatos
Tabla 5
Requerimientos candidatos
| ID | Requerimiento candidato | Información necesaria |
| RC-01 | Obtener materias y correlatividades desde una fuente institucional. | Fuente, formato, responsable y frecuencia de actualización |
| RC-02 | Consultar cátedras, horarios y cupos vigentes. | Sistema propietario, permisos y disponibilidad |
| RC-03 | Autenticar al estudiante con su identidad universitaria. | Proveedor de identidad y protocolo autorizado |
| RC-04 | Consultar el historial académico del estudiante. | Consentimiento, permisos y reglas de privacidad |
| RC-05 | Registrar una inscripción desde el prototipo. | Flujo oficial y responsabilidades institucionales |
| RC-06 | Administrar planes, períodos y oferta académica. | Roles administrativos y reglas de autorización |
| RC-07 | Enviar alertas de cupos o cambios de horarios. | Canales permitidos y política de comunicaciones |
| RC-08 | Conservar información de uso y preferencias. | Finalidad, retención, eliminación y acceso |
| RC-09 | Consultar aulas, capacidades y disponibilidad. | Fuente institucional, identificadores, horarios, modalidad y frecuencia de actualización |
| RC-10 | Consultar disponibilidad docente y restricciones para abrir una nueva cátedra. | Área responsable, reglas de asignación y permisos |
| RC-11 | Integrar el flujo con el CRM institucional. | Estructura del ticket, estados y mecanismos de consulta y actualización |
Nota. Elaboración propia.
# 7. Desarrollo del prototipo
## 7.1. Metodología y proceso de construcción asistido por IA
El desarrollo del prototipo se organizará mediante un proceso de ingeniería asistido por agentes de inteligencia artificial. Gentle-AI se utilizará como la única herramienta de apoyo para configurar y coordinar el flujo de desarrollo, gestionar el trabajo entre agentes y conservar la trazabilidad del proceso. Su utilización no sustituirá la responsabilidad del autor sobre las decisiones de análisis, diseño, implementación, verificación y validación (Gentleman Programming, 2026).
Dentro del flujo coordinado por Gentle-AI se conservarán entre sesiones las decisiones de diseño, las convenciones del proyecto, los problemas identificados, las soluciones adoptadas y el estado de avance. Esta continuidad permitirá recuperar el contexto relevante sin depender exclusivamente del historial inmediato de conversación.
Para los cambios de mayor complejidad se aplicará desarrollo dirigido por especificaciones (Spec-Driven Development, SDD). Cada incremento partirá de una propuesta, una especificación de requisitos y escenarios, decisiones de diseño y una lista ordenada de tareas. Los artefactos resultantes se versionarán junto con el código para mantener la trazabilidad entre la necesidad identificada, la especificación, la implementación y su verificación (Gentleman Programming, 2026).
La implementación se complementará con desarrollo dirigido por pruebas (Test-Driven Development, TDD), siguiendo ciclos en los que primero se define una prueba que representa el comportamiento esperado, luego se implementa la solución mínima necesaria para satisfacerla y finalmente se refactoriza el código manteniendo las pruebas aprobadas (Beck, 2002).
Una vez completado cada incremento relevante, se aplicará desarrollo dirigido por comprobantes (Receipt-Driven Development, RDD). Este mecanismo permitirá congelar el cambio evaluado, ejecutar una revisión independiente basada en el nivel de riesgo y conservar evidencia sobre los hallazgos, las correcciones efectuadas y el resultado final de la revisión (Gentleman Programming, 2026).
Gentle-AI proporcionará soporte operativo para la continuidad y la coordinación del proceso, pero sus registros no se considerarán por sí mismos evidencia suficiente de V&V. La evidencia formal estará compuesta por las especificaciones versionadas, los resultados de las pruebas automatizadas, el historial del repositorio, los registros de integración continua y los comprobantes producidos mediante RDD.
Declaración sobre el uso de inteligencia artificial generativa. Durante la elaboración de este trabajo se utilizó ChatGPT (modelo Sol) como apoyo para revisar la redacción, organizar contenidos, explorar alternativas y asistir en tareas técnicas (OpenAI, 2026). Las respuestas generadas fueron evaluadas, contrastadas y, cuando correspondió, modificadas por el autor. La herramienta no tomó decisiones autónomas ni sustituyó la responsabilidad autoral, el análisis crítico, la verificación de las fuentes o la validación de los resultados.
## 7.2. Análisis y Diseño
### 7.2.1. Diagrama de casos de uso
El diagrama distingue al estudiante y a un actor institucional autorizado. Bedelía queda identificada como responsable de registrar en el CRM las solicitudes originadas por falta de cupo. La evaluación y aprobación de cambios de aula o aperturas se atribuyen provisionalmente a un actor institucional, cuya denominación y nivel de autorización deberán confirmarse mediante la elicitación pendiente.
Figura 2. Casos de uso del sistema.
Nota. Elaboración propia.
### 7.2.2. Diagrama de clases / Entidad relación
Las entidades se presentan como un modelo preliminar del dominio, derivado de los requerimientos del capítulo 6 y del alcance definido en 3.3. Además del recorrido del estudiante, se incorporan las entidades necesarias para modelar aulas, disponibilidad y propuestas de resolución de demanda. No se representan inscripciones oficiales ni personal administrativo nominal; el actor institucional se modela mediante un rol provisional hasta completar la elicitación. El cupo de una cátedra se deriva de la capacidad del aula asignada, según lo relevado en 4.4.3, y mientras no exista aula asignada se conserva como capacidad declarada. Esta regla evita que la capacidad del aula y el cupo de la cátedra funcionen como dos fuentes de verdad independientes.
Figura 3. Entidades del dominio y relaciones principales.
Nota. Elaboración propia.
Figura 4. Entidades de planificación y gestión de demanda.
Nota. Elaboración propia.
### 7.2.3. Descripción de casos de uso
Se describen los cuatro casos de uso centrales del recorrido del estudiante. Cada uno registra los siete campos previstos en el diseño: objetivo, actor, precondiciones, flujo principal, flujos alternativos, postcondiciones y requerimientos relacionados.
Tabla 9
Descripción de los casos de uso centrales
| Campo | Contenido |
| CU-01 · Consultar el plan de estudios |  |
| Objetivo | Conocer la estructura del plan, las correlatividades y el estado de cada materia |
| Actor | Estudiante |
| Precondiciones | Plan de estudios cargado y situación académica del alumno disponible |
| Flujo principal | 1. El estudiante abre la vista del plan. 2. El sistema representa el grafo curricular. 3. Calcula y muestra el estado de cada materia con su motivo. 4. El estudiante consulta el detalle de una materia y sus relaciones |
| Flujos alternativos | Datos incompletos o desactualizados: el sistema lo advierte e indica su origen y fecha. Sin situación académica: ofrece solo la estructura del plan |
| Postcondiciones | El estudiante conoce su situación curricular y el motivo de cada estado |
| Requerimientos | RF-01, RF-02, RF-12, RF-20 |
| CU-05 · Asistir a la inscripción del período académico actual |  |
| Objetivo | Construir una selección válida para el período vigente |
| Actor | Estudiante |
| Precondiciones | Oferta del período publicada, con correlatividades, cupos y horarios cargados |
| Flujo principal | 1. El estudiante indica las materias que quiere cursar. 2. El sistema verifica correlatividades, cupos, límite de carga y superposición. 3. El estudiante configura preferencias y restricciones. 4. El sistema valida la selección resultante |
| Flujos alternativos | Restricción incumplida: se informa en el momento. Selección imposible: se explican los conflictos y se proponen flexibilizaciones |
| Postcondiciones | Selección válida para el período actual, sin inscripción efectiva |
| Requerimientos | RF-10, RF-04, RF-14, RF-19 |
| CU-06 · Solicitar alternativas de cursado |  |
| Objetivo | Obtener alternativas compatibles para el período siguiente |
| Actor | Estudiante |
| Precondiciones | Intenciones declaradas y preferencias configuradas |
| Flujo principal | 1. El estudiante confirma el escenario. 2. El sistema ejecuta el motor una única vez. 3. El motor devuelve hasta tres alternativas con su estado. 4. El sistema indica la granularidad y presenta las alternativas |
| Flujos alternativos | Oferta pendiente: el resultado se presenta a nivel de materia. Límite temporal: se informa el estado sin presentarlo como definitivo. Infactible: se explican las restricciones involucradas |
| Postcondiciones | Alternativas disponibles para comparación, con su escenario registrado |
| Requerimientos | RF-05, RF-06, RF-13, RF-18 |
| CU-09 · Consultar la explicación de conflictos |  |
| Objetivo | Comprender por qué no se obtuvo una combinación completa |
| Actor | Estudiante |
| Precondiciones | Existe una solicitud ejecutada sin solución completa |
| Flujo principal | 1. El estudiante solicita la explicación. 2. El sistema identifica las restricciones activas. 3. Traduce el conflicto a un mensaje comprensible. 4. Señala qué preferencias podrían flexibilizarse |
| Flujos alternativos | Sin flexibilización posible: se declara explícitamente. Exclusión de materias: se explica cada una, nunca en silencio |
| Postcondiciones | El estudiante comprende el conflicto y sus opciones de flexibilización |
| Requerimientos | RF-07, RF-19, RNF-03 |
Nota. Elaboración propia.
Para la rama institucional, el caso de uso central será Gestionar demanda insatisfecha. El actor institucional consultará la demanda acumulada, solicitará la evaluación de capacidad, revisará la propuesta de cambio de aula o apertura de cátedra y registrará su decisión. La aplicación conservará la trazabilidad de los datos y del resultado, pero no ejecutará cambios en el sistema académico oficial.
### 7.2.4. Diagrama de colaboración
La colaboración representa el escenario Solicitar alternativas de cursado e incorpora el camino de verificación local inmediata previsto para la selección y el registro de demanda agregada al cierre.
Figura 5. Colaboración del escenario «Solicitar alternativas de cursado».
Nota. Elaboración propia.
La gestión asistida de demanda insatisfecha incorporará un segundo escenario de colaboración: el módulo de demanda consolidará las intenciones planificadas por falta de cupo; el dominio institucional evaluará aulas compatibles y, según el resultado, generará una propuesta de traslado o de apertura; finalmente, el actor institucional registrará su decisión y el sistema recalculará el escenario sin modificar la oferta oficial.
### 7.2.5. Interfaz gráfica
## 7.3. Proceso de V&V
### 7.3.1. Plan de pruebas
Las pruebas producidas mediante TDD y los comprobantes generados por RDD formarán parte de la evidencia de verificación técnica del prototipo (Beck, 2002; Gentleman Programming, 2026). La integración continua conservará los resultados de las pruebas, el análisis estático, la cobertura y la compilación de cada versión evaluada.
Pytest verificará las reglas del dominio, la persistencia, la API y los escenarios controlados del solver. Hypothesis comprobará invariantes generales de las alternativas generadas. Schemathesis verificará los contratos publicados mediante OpenAPI y Playwright cubrirá los recorridos críticos de la interfaz, incluyendo verificaciones automáticas y manuales de accesibilidad.
La verificación técnica no reemplazará la validación con estudiantes y representantes de la universidad. Esta validación estará orientada a determinar si las explicaciones son comprensibles, si las alternativas resultan útiles y si el prototipo responde a las necesidades identificadas.
### 7.3.2. Diseño de casos de pruebas
Tabla 6
Diseño de casos de prueba
| ID | Caso | Resultado esperado | Requerimientos |
| Reglas de dominio y solver |  |  |  |
| CP-01 | Dos materias poseen horarios superpuestos. | No se genera una alternativa que contenga ambas comisiones. | RF-04, RNF-02 |
| CP-02 | Una materia tiene una correlatividad obligatoria incumplida. | La materia se excluye y se informa la correlatividad incumplida. | RF-04, RF-12 |
| CP-03 | No existe una combinación completa. | Se informa la infactibilidad y las restricciones principales involucradas. | RF-07, RNF-03 |
| CP-04 | El solver alcanza el límite temporal. | Se devuelve un estado explícito sin presentar un resultado inválido como definitivo. | RF-18, RNF-11 |
| CP-09 | Una materia precorrelativa cursada resulta aprobada y otra no. | La intención condicionada se recalcula: la primera habilita su correlativa y la segunda queda bloqueada con su motivo. | RF-11, RF-12 |
| CP-11 | El estudiante intenta seleccionar una cuarta materia en el mismo bimestre. | El sistema impide la selección e informa el límite de carga aplicable. | RF-14, RF-04 |
| CP-12 | La oferta del período todavía no está publicada. | El resultado se presenta a nivel de materia y declara que la oferta está pendiente; ninguna alternativa se ofrece como válida para inscripción. | RF-13, RF-11 |
| CP-13 | Existe una materia habilitada no seleccionada que desbloquea otras pendientes. | Se presenta como recomendación con su justificación y no se incorpora hasta la aceptación expresa del estudiante. | RF-15 |
| CP-14 | Se comparan dos escenarios con distinto avance curricular. | Las alternativas se ordenan priorizando las materias que habilitan más materias pendientes y el criterio aplicado queda explícito. | RF-16 |
| CP-16 | Un escenario no permite incluir todas las materias requeridas. | El sistema explica cada materia excluida y propone flexibilizaciones, sin exclusiones silenciosas. | RF-19, RF-07 |
| CP-17 | Se repite la ejecución con la misma versión, semilla y cantidad de trabajadores. | El estado y las mediciones de la corrida son reproducibles, y el estado indeterminado se informa como tal. | RNF-11, RNF-12 |
| API |  |  |  |
| CP-05 | La solicitud a la API no respeta el contrato. | La API rechaza la solicitud con una respuesta validada contra la especificación. | RNF-04 |
| Persistencia y datos |  |  |  |
| CP-06 | Se aplica una migración sobre una base vacía. | El esquema resultante coincide con la versión esperada. | RNF-06 |
| CP-10 | El estudiante registra una intención de cursado para el período siguiente. | La intención se conserva con estado y motivo explícitos y se presenta como condicionada, nunca como inscripción. | RF-10, RF-11 |
| CP-15 | Se registran intenciones de varios estudiantes para una materia sin oferta compatible. | La demanda agregada por materia y período queda registrada sin inscribir, reservar vacantes ni decidir aperturas. | RF-17 |
| Interfaz |  |  |  |
| CP-07 | El estudiante solicita y compara alternativas. | El recorrido puede completarse sin errores de interfaz. | RF-06, RF-08 |
| CP-18 | Se consulta una planificación ya generada. | El sistema muestra el período, la versión del plan, el origen y la fecha de los datos, y las restricciones y preferencias usadas. | RF-20 |
| Accesibilidad |  |  |  |
| CP-08 | Se analiza una pantalla principal con axe-core. | No se detectan infracciones automáticas consideradas bloqueantes. | RNF-07 |
| Gestión de demanda |  |  |  |
| CP-19 | Todas las cátedras de una materia alcanzaron su cupo y el estudiante conserva su intención. | La materia queda planificada con motivo falta de cupo y la intención se incorpora una sola vez a la demanda agregada. | RF-21, RF-22 |
| CP-20 | La demanda supera el cupo y existe un aula compatible de mayor capacidad. | El sistema propone el traslado, informa la capacidad resultante y calcula los estudiantes incorporables, sin aplicar el cambio. | RF-23, RF-24 |
| CP-21 | La demanda supera el cupo y no existe un aula compatible. | El sistema genera una propuesta de nueva cátedra y simula su impacto sobre la demanda insatisfecha. | RF-25 |
| CP-22 | El actor institucional aprueba o rechaza una propuesta. | La decisión queda registrada y el escenario se recalcula sin modificar el sistema académico oficial. | RF-26 |
Nota. Elaboración propia.
# 8. Referencias
Beck, K. (2002). Test driven development: By example. Boston, MA: Addison-Wesley Professional.
Congreso de la Nación Argentina. (2000). Ley 25.326 de protección de los datos personales. Recuperado de https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790/actualizacion
Coursicle. (s. f.). College schedule maker. Recuperado de https://www.coursicle.com/college-schedule-maker/
Demarchi, F. (2026). Fase 1—Definición y relevamiento [Documento de trabajo no publicado]. Recuperado de 
Ellucian. (s. f.). Smart Planning & Registration. Recuperado de https://www.ellucian.com/en-gb/products/smart-planning-registration
FastAPI. (s. f.). Features. Recuperado de https://fastapi.tiangolo.com/features/
Fielding, R., Nottingham, M., & Reschke, J. (2022). RFC 9110: HTTP semantics. Internet Engineering Task Force. Recuperado de https://www.rfc-editor.org/rfc/rfc9110.html
Gentleman Programming. (2026). Gentle-AI (versión 2.3.0) [Software]. Recuperado de https://github.com/Gentleman-Programming/gentle-ai
Google. (2024). CP-SAT solver. Google for Developers. Recuperado de https://developers.google.com/optimization/cp/cp_solver
International Organization for Standardization. (2018). ISO/IEC/IEEE 29148:2018: Systems and software engineering—Life cycle processes—Requirements engineering. Recuperado de https://www.iso.org/standard/72089.html
International Organization for Standardization. (2023). ISO/IEC 25010:2023: Systems and software engineering—Systems and software Quality Requirements and Evaluation (SQuaRE)—Product quality model. Recuperado de https://www.iso.org/standard/78176.html
OpenAPI Initiative. (2021). OpenAPI Specification v3.1.0. Recuperado de https://spec.openapis.org/oas/v3.1.0.html
OWASP Foundation. (2025). OWASP Top 10:2025. Recuperado de https://owasp.org/Top10/2025/
OpenAI. (2026). ChatGPT (modelo Sol) [Modelo de lenguaje grande]. Recuperado de https://chatgpt.com/
React Team. (s. f.). React. Recuperado de https://react.dev/
UniTime. (s. f.). UniTime highlights. Recuperado de https://www.unitime.org/present/unitime-highlights.pdf
World Wide Web Consortium. (2024). Web Content Accessibility Guidelines (WCAG) 2.2. Recuperado de https://www.w3.org/TR/WCAG22/
# 9. Anexos
## Anexo A. Registro de elicitación
El documento  concentra el relevamiento del proceso actual, la descripción del trámite presencial, los instrumentos para alumnos, la entrevista institucional, el problema, la hipótesis y los indicadores. Los resultados del relevamiento estudiantil se incorporan en la sección 5. Diagnóstico; el relevamiento institucional permanece en curso.
## Anexo B. Instrumentos de relevamiento
Se incluyen como instrumentos en desarrollo una encuesta cuantitativa sobre la experiencia de inscripción y una guía de entrevista cualitativa orientada a comprender causas, decisiones y consecuencias. La aplicación debe registrar consentimiento, preservar la confidencialidad y separar datos descriptivos de interpretaciones.
## Anexo C. Evidencias del proceso actual
Las capturas de la interfaz, matrices de validación y observaciones AS-IS se mantienen en el documento de elicitación. Antes de incorporarlas a la versión final se eliminarán datos personales y se añadirá para cada evidencia un título, una fuente y una explicación de su relevancia.
## Anexo D. Mapa horizontal de correlatividades de Ingeniería en Software
