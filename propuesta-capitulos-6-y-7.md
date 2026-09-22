# Propuesta de avance para los capítulos 6 y 7

> **Estado:** propuesta pendiente de aprobación. Ninguno de estos cambios fue aplicado a la tesis.
>
> **Contexto:** la elicitación con representantes de la universidad todavía no está terminada. Por lo tanto, la propuesta distingue entre comportamientos preliminares, supuestos técnicos y decisiones pendientes de validación institucional.

## Criterio general

Se propone avanzar con la arquitectura interna, el comportamiento principal del prototipo, los modelos preliminares y la estrategia de verificación. No deben presentarse como definitivos los procesos, permisos, integraciones ni reglas que dependan de la universidad.

Los elementos deberán clasificarse con uno de estos estados:

- **Preliminar:** respaldado por el relevamiento y los objetivos actuales.
- **Supuesto de diseño:** necesario para construir y evaluar el prototipo.
- **Pendiente de validación institucional:** requiere confirmación de la universidad.

---

# 6. Propuesta de solución

## 6.1. Descripción general de la propuesta

Agregar debajo del encabezado:

> La solución presentada constituye un diseño preliminar del prototipo, elaborado a partir del relevamiento estudiantil, los objetivos del proyecto y la documentación disponible. La propuesta permite definir la arquitectura interna y los principales comportamientos del sistema, pero no presupone mecanismos de integración, reglas excepcionales ni decisiones operativas de la universidad. Los elementos que dependen de información institucional se identifican como requerimientos candidatos y deberán validarse antes de considerarse definitivos.

## 6.1.1. A nivel funcional

Agregar:

> A nivel funcional, el prototipo asistirá al estudiante en la consulta de su plan de estudios y en la planificación de alternativas de cursado. La interfaz permitirá visualizar materias, correlatividades y estados académicos; seleccionar un período; indicar materias de interés; registrar preferencias horarias y solicitar alternativas compatibles con las restricciones representadas.
>
> El sistema validará las restricciones obligatorias antes de presentar una alternativa. Cuando exista más de una combinación factible, podrá mostrar hasta tres opciones ordenadas según las preferencias ingresadas. Cada alternativa indicará las materias y cátedras seleccionadas, su distribución semanal y los criterios considerados durante su generación.
>
> Cuando no sea posible construir una combinación completa, el prototipo no se limitará a informar que la solicitud es infactible. Deberá señalar las materias, superposiciones, correlatividades, cupos simulados u otras restricciones que hayan impedido obtenerla y, cuando sea posible, sugerir qué preferencias podrían flexibilizarse.
>
> El prototipo utilizará datos simulados, seudonimizados o preparados específicamente para el caso de estudio. La consulta de información oficial, la actualización de cupos y la inscripción efectiva en sistemas universitarios quedarán fuera del alcance hasta que sus mecanismos sean relevados y autorizados institucionalmente.

## 6.1.2. A nivel técnico

Conservar el contenido actual y agregar al final:

> La arquitectura propuesta define los componentes internos del prototipo, pero no establece todavía un mecanismo concreto de conexión con sistemas universitarios. Las fuentes oficiales de datos, los formatos de intercambio, la autenticación, los permisos y la frecuencia de actualización deberán definirse mediante la elicitación institucional. Hasta entonces, estas dependencias se representarán mediante interfaces y adaptadores sustituibles.

## 6.1.3. Diagrama de arquitectura

Incorporar un diagrama lógico con esta estructura:

```text
┌─────────────────────────────────────────────┐
│              Frontend React                │
│                                             │
│ Grafo curricular · Preferencias · Calendario│
└──────────────────────┬──────────────────────┘
                       │ REST / OpenAPI
                       ▼
┌─────────────────────────────────────────────┐
│              Backend FastAPI               │
│                                             │
│  API                                        │
│   ├── Dominio académico                     │
│   ├── Planificación                         │
│   ├── Explicación de conflictos             │
│   ├── Adaptador de optimización             │
│   └── Persistencia                          │
└───────────────┬──────────────────┬──────────┘
                │                  │
                ▼                  ▼
       ┌────────────────┐  ┌────────────────┐
       │ OR-Tools CP-SAT│  │   PostgreSQL   │
       └────────────────┘  └────────────────┘

          ┌────────────────────────────────┐
          │ Integración institucional futura│
          │ Pendiente de relevamiento       │
          └────────────────────────────────┘
```

Texto asociado:

> **Figura X.** Arquitectura lógica preliminar del prototipo.  
> **Nota.** Elaboración propia. Las integraciones institucionales se representan como una dependencia futura debido a que sus contratos, permisos y fuentes de datos todavía no fueron relevados.

---

## 6.2. Requerimientos

Agregar una introducción metodológica:

> Los requerimientos se clasifican según su grado de validación. Los requerimientos preliminares se derivan del relevamiento estudiantil, los objetivos del proyecto y las necesidades técnicas del prototipo. Los requerimientos candidatos dependen de procesos, datos o decisiones institucionales todavía no confirmados. Cada requerimiento deberá registrar su fuente, prioridad, criterio de aceptación y estado de validación para mantener su trazabilidad.

### 6.2.1. Requerimientos funcionales preliminares

| ID | Requerimiento | Estado |
|---|---|---|
| RF-01 | El sistema deberá permitir consultar las materias y correlatividades del plan de estudios utilizado como caso de estudio. | Preliminar |
| RF-02 | El sistema deberá distinguir visualmente el estado de las materias representadas. | Preliminar |
| RF-03 | El estudiante deberá poder indicar las materias y preferencias consideradas para un período académico. | Preliminar |
| RF-04 | El sistema deberá detectar superposiciones horarias y restricciones obligatorias incumplidas. | Preliminar |
| RF-05 | El sistema deberá generar hasta tres alternativas factibles cuando exista más de una combinación válida. | Supuesto de diseño |
| RF-06 | Cada alternativa deberá mostrar su distribución semanal y las preferencias consideradas. | Preliminar |
| RF-07 | Cuando no exista una alternativa completa, el sistema deberá explicar los principales conflictos detectados. | Preliminar |
| RF-08 | El estudiante deberá poder comparar las alternativas generadas antes de seleccionar una. | Preliminar |
| RF-09 | Los datos académicos utilizados por el prototipo deberán poder cargarse mediante un mecanismo desacoplado de la fuente institucional definitiva. | Supuesto de diseño |

> **Aclaración:** “Preliminar” no significa “aprobado por la universidad”.

### 6.2.2. Requerimientos no funcionales preliminares

| ID | Atributo | Requerimiento |
|---|---|---|
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

Los umbrales que todavía no tengan evidencia deberán quedar expresamente marcados como pendientes.

### 6.2.3. Requerimientos candidatos

| ID | Requerimiento candidato | Información necesaria |
|---|---|---|
| RC-01 | Obtener materias y correlatividades desde una fuente institucional. | Fuente, formato, responsable y frecuencia de actualización |
| RC-02 | Consultar cátedras, horarios y cupos vigentes. | Sistema propietario, permisos y disponibilidad |
| RC-03 | Autenticar al estudiante con su identidad universitaria. | Proveedor de identidad y protocolo autorizado |
| RC-04 | Consultar el historial académico del estudiante. | Consentimiento, permisos y reglas de privacidad |
| RC-05 | Registrar una inscripción desde el prototipo. | Flujo oficial y responsabilidades institucionales |
| RC-06 | Administrar planes, períodos y oferta académica. | Roles administrativos y reglas de autorización |
| RC-07 | Enviar alertas de cupos o cambios de horarios. | Canales permitidos y política de comunicaciones |
| RC-08 | Conservar información de uso y preferencias. | Finalidad, retención, eliminación y acceso |

---

## Alineación propuesta para la reasignación global de aulas (CU-13)

> **Estado de esta sección:** texto propuesto para evaluación y aprobación. No modifica `documento/tesis.md` ni afirma la aplicación de reasignaciones reales. La asignación de responsabilidades, la oferta institucional y cualquier operación sobre aulas permanecen pendientes de validación institucional.

### Reemplazo propuesto para §3.3

> Para el período académico actual, el prototipo podrá presentar una evaluación de reasignación de aulas cuando exista demanda agregada fuera de cupo. La evaluación se inicia mediante una acción explícita del operador institucional provisional y considera conjuntamente todas las secciones y aulas del período. Conserva fijos los horarios y docentes de las secciones; solo analiza asignaciones de aulas compatibles por tipo y capacidad, sin superposiciones horarias en una misma aula. La demanda fuera de cupo se mantiene agrupada por materia y puede ser absorbida por las vacantes resultantes de las aulas asignadas a las secciones de esa materia.
>
> El resultado es una recomendación simulada, explicable y de solo lectura. No modifica la asignación real de aulas, los horarios, los docentes, las inscripciones, la oferta académica ni los datos compartidos. La apertura de una nueva sección se analiza por separado y solo cuando subsiste demanda fuera de cupo.

### Reemplazo propuesto para §3.4

> La evaluación de aulas no constituye una operación de generación de horarios ni de asignación de personal. Se trata exclusivamente de una reasignación de aulas para secciones ya existentes: sus horarios y docentes permanecen fijos. Para cada escenario controlado, el prototipo busca una solución global factible que minimice, en este orden, los estudiantes fuera de cupo residuales, la cantidad de movimientos de aula y la capacidad sin utilizar. Ante empate, utiliza un vector canónico de identificadores de aula para obtener un resultado reproducible.
>
> La búsqueda exacta estática del prototipo es un supuesto técnico de demostración. Una futura implementación de backend podría evaluar CP-SAT u otra técnica si la escala y las reglas validadas institucionalmente lo requieren; esa evolución no forma parte del comportamiento actual ni autoriza cambios automáticos.

### Adición propuesta para §6.1

Agregar al final de la descripción general:

> Como capacidad institucional preliminar, el prototipo incluye la evaluación global de reasignación de aulas para el período actual. Esta capacidad recibe secciones, aulas, tipos, capacidades y franjas horarias simuladas; preserva horarios y docentes; y presenta una alternativa determinista de solo lectura. Su propósito es hacer visible el efecto de restricciones físicas sobre la demanda agregada, no gestionar la programación académica ni ejecutar cambios sobre recursos reales. La validación institucional deberá definir responsables, fuentes de datos, permisos y el tratamiento operativo de cualquier recomendación.

### Reemplazo propuesto para RF-23 a RF-25

| ID | Requerimiento | Estado |
|---|---|---|
| RF-23 | El sistema deberá permitir que el operador institucional provisional inicie explícitamente una evaluación global de reasignación de aulas para todas las secciones del período actual con demanda fuera de cupo. | Pendiente de validación institucional |
| RF-24 | La evaluación deberá mantener fijos los horarios y docentes, respetar tipo y capacidad de aula y evitar que se asignen a una misma aula secciones con superposición horaria. Deberá ordenar las soluciones por residuo de demanda, movimientos de aula, capacidad sin utilizar y desempate canónico. | Supuesto de diseño |
| RF-25 | El sistema deberá mostrar el resultado global y su proyección por materia; cuando subsista demanda fuera de cupo, deberá derivarla a CU-11 sin crear, aprobar ni aplicar una apertura de sección. | Pendiente de validación institucional |

### Reemplazo propuesto para las descripciones de CU-13 y CU-11

**CU-13 — Evaluar reasignación global de aulas.** El operador institucional provisional activa una acción explícita para evaluar las secciones y aulas del período actual. El sistema calcula una alternativa global exacta y determinista con horarios y docentes fijos, restricciones de tipo, capacidad y superposición, y demanda fuera de cupo agrupada por materia. Presenta el resumen y el detalle por materia en modo de solo lectura. No aplica traslados, no modifica datos ni inscripciones y no abre secciones.

**CU-11 — Evaluar apertura de nueva sección ante residuo.** Cuando CU-13 informa demanda residual, el operador puede iniciar por separado la evaluación de una nueva sección. CU-11 recibe únicamente el residuo informado; no se activa por una reasignación sin residuo y no es creado, aprobado ni aplicado automáticamente por CU-13.

### Adición propuesta para trazabilidad y casos de prueba

Agregar a la matriz de trazabilidad la relación `RF-23 → CU-13 → CP-23`, `RF-24 → CU-13 → CP-24` y `RF-25 → CU-13/CU-11 → CP-25`.

| ID | Caso | Resultado esperado | Requerimientos |
|---|---|---|---|
| CP-23 | El operador activa la evaluación global en un período actual con demanda fuera de cupo. | La evaluación se ejecuta solo por acción explícita, muestra un resultado de solo lectura y no altera aulas, horarios, docentes, inscripciones ni datos de entrada. | RF-23, RF-25 |
| CP-24 | Dos secciones compatibles compiten por una misma aula y una de ellas puede liberar otra aula compatible. | La solución considera el intercambio global, reutiliza el aula liberada cuando corresponde y selecciona el óptimo lexicográfico; no conserva una decisión local que aumente el residuo. | RF-24 |
| CP-25 | Tras la reasignación global queda demanda fuera de cupo. | El sistema informa el residuo agrupado por materia y ofrece únicamente la derivación de evaluación a CU-11, sin crear ni aplicar una nueva sección. | RF-25 |

### Adición propuesta para métricas de evaluación

> La evaluación técnica utilizará escenarios sintéticos, reproducibles y sin datos personales. Para cada escenario se registrarán: estudiantes fuera de cupo iniciales, estudiantes absorbidos, demanda residual, cantidad de movimientos de aula, capacidad total sin utilizar antes de asignar la demanda agrupada fuera de cupo, tiempo de ejecución y repetibilidad del resultado ante entradas idénticas. Se verificará además que horarios y docentes permanezcan fijos y que ninguna aula concentre secciones con superposición horaria. En el escenario base controlado, la evidencia esperada es la absorción de 19 estudiantes, residuo 0, 3 movimientos y 45 asientos libres totales en las aulas propuestas antes de asignar la demanda agrupada fuera de cupo; tras absorber los 19 estudiantes, quedan 26 asientos. Estos valores describen datos simulados del prototipo y no una intervención institucional.

# 7. Desarrollo del prototipo

## 7.1. Metodología y proceso de construcción asistido por IA

Mantener el contenido actual. No convertir los verbos al pasado ni afirmar que existen comprobantes, pruebas o incrementos que todavía no hayan sido producidos.

Agregar al final:

> Las evidencias generadas durante la construcción —especificaciones, pruebas, resultados de integración continua y comprobantes de revisión— se incorporarán progresivamente. La descripción de la metodología no implica por sí misma que una actividad haya sido ejecutada; cada resultado deberá estar respaldado por un artefacto verificable.

---

## 7.2. Análisis y diseño

Agregar una introducción:

> Los modelos presentados en esta sección describirán el diseño preliminar del prototipo. Se concentrarán en el recorrido del estudiante y en los componentes internos que pueden definirse con la información disponible. Los actores, intercambios de datos y operaciones que dependan de sistemas universitarios se marcarán como pendientes de validación institucional.

### 7.2.1. Diagrama de casos de uso

Incluir inicialmente un único actor confirmado:

- **Estudiante**

Casos de uso propuestos:

- consultar el plan de estudios;
- consultar el estado de una materia;
- configurar preferencias;
- seleccionar materias;
- solicitar alternativas;
- visualizar el calendario;
- comparar alternativas;
- consultar explicaciones de conflictos.

Los actores institucionales deberán quedar fuera del diagrama o identificados expresamente como pendientes.

### 7.2.2. Diagrama de clases / entidad-relación

Modelar provisionalmente:

- `PlanDeEstudios`;
- `Materia`;
- `Correlatividad`;
- `PeriodoAcademico`;
- `Catedra`;
- `Comision`;
- `Horario`;
- `Preferencia`;
- `SolicitudPlanificacion`;
- `Alternativa`;
- `SeleccionMateria`;
- `Restriccion`;
- `ExplicacionConflicto`.

No incluir todavía entidades relacionadas con usuarios institucionales, inscripciones oficiales o personal administrativo.

### 7.2.3. Descripción de casos de uso

Desarrollar inicialmente tres casos centrales:

1. Consultar el plan de estudios.
2. Generar alternativas de cursado.
3. Consultar una explicación de infactibilidad.

Cada descripción deberá incluir:

- objetivo;
- actor;
- precondiciones;
- flujo principal;
- flujos alternativos;
- postcondiciones;
- requerimientos relacionados.

### 7.2.4. Diagrama de colaboración

Representar el escenario **“Generar alternativas de cursado”**:

```text
Estudiante
   → Interfaz
   → API
   → Servicio de planificación
   → Adaptador CP-SAT
   → Solver
   → Servicio de explicación
   → API
   → Interfaz
```

### 7.2.5. Interfaz gráfica

Preparar bocetos claramente identificados como tales para:

- grafo curricular;
- selector de período y materias;
- configuración de preferencias;
- comparación de alternativas;
- calendario semanal;
- explicación de conflictos;
- estados de carga, error e infactibilidad.

No presentarlos como capturas del producto terminado.

---

## 7.3. Verificación y validación

Agregar una introducción:

> La verificación evaluará si el prototipo satisface los requerimientos técnicos definidos, mientras que la validación analizará si la solución resulta comprensible y útil para sus usuarios. Las pruebas automatizadas podrán avanzar con datos controlados, pero la validación institucional y la evaluación con participantes requerirán autorización, criterios y procedimientos todavía pendientes de definición.

### 7.3.1. Plan de pruebas

Ampliar el contenido actual con:

- alcance de cada nivel de prueba;
- entorno y versiones utilizadas;
- origen de los datos;
- criterios de aprobación;
- tratamiento de resultados inconclusos;
- ubicación de las evidencias;
- relación entre requisito y prueba.

### 7.3.2. Diseño de casos de pruebas

| ID | Caso | Resultado esperado |
|---|---|---|
| CP-01 | Dos materias poseen horarios superpuestos. | No se genera una alternativa que contenga ambas comisiones. |
| CP-02 | Una materia tiene una correlatividad obligatoria incumplida. | La materia se excluye y se informa la correlatividad. |
| CP-03 | No existe una combinación completa. | Se informa la infactibilidad y sus restricciones principales. |
| CP-04 | El solver alcanza el límite temporal. | Se devuelve un estado explícito sin presentar un resultado inválido como definitivo. |
| CP-05 | La solicitud de la API no respeta el contrato. | La API rechaza la solicitud con una respuesta validada. |
| CP-06 | Se aplica una migración sobre una base vacía. | El esquema resultante coincide con la versión esperada. |
| CP-07 | El estudiante solicita y compara alternativas. | El recorrido puede completarse sin errores de interfaz. |
| CP-08 | Se analiza una pantalla principal con axe-core. | No se detectan infracciones automáticas consideradas bloqueantes. |

Estos casos deberán utilizar escenarios sintéticos para no depender todavía de datos institucionales.

1. Alcance de la planificación

> El prototipo no contempla inscripciones de más de tres materias por bimestre, equivalentes a seis materias por cuatrimestre. La planificación se limita a ese máximo y no se modelan escenarios con una carga mayor.
>
> Esta limitación responde al alcance definido para el prototipo y no constituye una afirmación sobre la regla académica vigente en la universidad.

Corresponde a la decisión **D-04** de [`decisiones.md`](decisiones.md), donde se registra el contexto. La segunda oración evita presentar el tope como una regla de la universidad sin fuente que la respalde.

**No confundir con RF-05.** RF-05 establece *hasta tres alternativas de cursado*; este tope establece *hasta tres materias por bimestre*. Conviene nombrarlos de forma inequívoca en todo el documento.

---

# Elementos que deben permanecer pendientes

No completar ni presentar todavía como resultados definitivos:

- resultados observados de las pruebas;
- porcentajes de aprobación;
- conclusiones de validación;
- roles y permisos administrativos;
- autenticación universitaria;
- integración con sistemas reales;
- inscripción efectiva;
- reglas académicas excepcionales;
- tratamiento definitivo de datos personales;
- capturas presentadas como producto terminado;
- restricciones institucionales de infraestructura y despliegue.

# Próximo paso sugerido

Cuando finalice la elicitación institucional:

1. contrastar cada requerimiento candidato con la evidencia obtenida;
2. aprobarlo, modificarlo o descartarlo;
3. actualizar actores, integraciones y reglas del dominio;
4. revisar los diagramas afectados;
5. convertir los criterios aceptados en casos de prueba trazables;
6. aplicar en la tesis únicamente los cambios confirmados.
