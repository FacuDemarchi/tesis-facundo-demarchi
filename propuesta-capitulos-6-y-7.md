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
