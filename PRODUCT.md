# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Estudiante de Ingeniería en Software — actor principal.** Situación: cursa un plan con
  correlatividades densas y decide su cursado dos veces por año, hoy sin visibilidad anticipada del
  impacto de cada decisión. Trabajo: examinar el plan, declarar qué materias quiere cursar,
  registrar restricciones y preferencias, obtener alternativas factibles y resolver los conflictos
  que aparecen cuando no hay solución completa. *(`documento/tesis.md` §4.1: «El actor principal es
  el alumno de Ingeniería en Software que planifica e intenta confirmar su cursado.»)*
- **Operador institucional — actor provisional, subordinado.** Superficie demostrativa, no un
  compromiso durable: consulta de demanda agregada (CU-10), evaluación de reasignación global de
  aulas (CU-13) y evaluación de apertura ante residuo (CU-11). Su denominación y su nivel de
  autorización están pendientes de validación institucional *(`documento/tesis.md` §7.2.1: «La
  evaluación y aprobación de cambios de aula o aperturas se atribuyen provisionalmente a un actor
  institucional...»)*. Decisión del autor del 2026-09-27: entra al horizonte del producto, pero
  todavía sin compromisos.
- **Otros actores del proceso real, sin rol interactivo**: Bedelía, coordinación de carrera,
  autoridades académicas, docentes y administradores de sistemas *(`documento/tesis.md` §1, §7.2.1)*.

## Product Purpose

Asistir al alumno en dos momentos: la inscripción del período académico actual y la planificación
condicionada del siguiente *(`documento/tesis.md` §3.1)*. El sistema registra intenciones de cursado
condicionadas sin tratarlas como inscripciones, y cuando no existe una solución completa identifica
los conflictos y propone modificaciones explícitas, sin excluir materias de forma silenciosa
*(§1)*.

**Vara de éxito acordada por el autor el 2026-09-27: prototipo demostrable.** El trabajo está bien
hecho cuando exhibe el recorrido completo sobre datos simulados, sin prometer nada institucional. No
la vara principal: la trazabilidad académica como fin en sí mismo, ni la adopción real por parte de
estudiantes.

Evidencia con la que la tesis mide ese prototipo, que sigue vigente como vara técnica:

- 95 % de los escenarios controlados resueltos en cinco segundos o menos (RNF-01, `§1.1`).
- 100 % de las alternativas presentadas respetando correlatividades, cupos, período y el límite de
  carga aplicable (`§3.3`).
- Explicación comprensible y trazable hacia las restricciones involucradas cuando la solicitud es
  infactible (RNF-03).
- Línea base diagnóstica del relevamiento estudiantil: 45 respuestas válidas, muestra intencional y
  no probabilística, sin validez estadística fuera de ese corte (`§5.1`).

## Positioning

El mecanismo que un producto vecino no podría copiar honestamente es la combinación de tres piezas
que este prototipo sí declara: **el chequeo local y el solver derivan de una única definición de
restricciones** (D-01), **la infactibilidad se explica en lugar de resolverse excluyendo materias en
silencio** *(`§1.1`: «Esta capa traducirá los conflictos detectados a mensajes comprensibles para el
usuario y permitirá indicar qué materias, horarios, cupos o reglas académicas impiden...»)* y **la
priorización curricular es objetiva**: se favorecen las materias cuya aprobación habilita más
materias pendientes *(`§1`)*.

La reasignación global de aulas (CU-13) extiende esa misma disciplina al actor institucional: se
activa por acción explícita, se evalúa de forma exacta y determinista, y no aplica nada
*(`§3.3`, D-21)*. CP-SAT permanece como opción de backend, no como promesa del prototipo.

## Operating Context

- **Manuscrito**: `documento/tesis.md` es la fuente autoritativa del producto; vive además en Google
  Docs y se accede por el CLI `gdocs-api`. Respaldo previo a la primera escritura:
  `documento/tesis-crudo-antes-2026-09-16.json`.
- **Figuras**: fuentes Mermaid en `documento/figuras/*.mmd`, exportadas a PNG e insertadas en el
  documento; `documento/figuras/verificar-tamanos.py` verifica el área de inserción.
- **Maquetas**: servidor estático sin paso de compilación — `python3 -m http.server 8080` desde la
  raíz del repositorio. Abrir `http://localhost:8080/<superficie>/`.
- **Capa de datos simulados compartida**: `comun/datos-simulados.js` y
  `comun/demanda-institucional-simulada.js`. La página carga `../comun/...`, así que el servidor debe
  servir la raíz y no la carpeta de la maqueta.
- **Registros de trabajo**: `decisiones.md` es el registro autoritativo de decisiones de diseño; los
  hallazgos y requerimientos candidatos de cada maqueta viven en su `discoveries.md`, que es su
  fuente y no se duplica en `decisiones.md`.
- **Método**: flujo ODD con seguimiento en `odd/tasks/*.md` y memoria persistente.
- **Idioma**: tesis y documentación de diseño en español rioplatense; artefactos técnicos —código,
  `odd/tasks`, mensajes de commit— en inglés.

## Capabilities and Constraints

**Existe hoy en las maquetas**: grafo curricular con 46 materias y 26 correlatividades; tres
escenarios que difieren solo en el estado académico simulado (`mockup/`, `periodo-2A/`,
`periodo-2B/`); panel de selección flotante no bloqueante con tope configurable de 1 a 3 materias por
bimestre, restricción de días no disponibles y preferencia de docente por materia; contador de carga
bimestral y cuatrimestral; modal de resultados con seis desenlaces simulados y hasta tres
alternativas comparables; confirmación de inscripción **local y en memoria**, que no representa una
inscripción oficial; vista CU-10 de demanda agregada y evaluación determinista CU-13 de solo lectura.

**Solo comprometido en texto, no implementado**: backend FastAPI con PostgreSQL, SQLAlchemy y
Alembic; motor OR-Tools CP-SAT real aislado por proceso con límite de tiempo (RNF-12); grafo
dinámico con React Flow y diagramación ELK; recomendaciones automáticas justificadas (RF-15)
*(`documento/tesis.md` §4.2)*. La maqueta usa HTML, CSS y JavaScript sin dependencias ni build.

**Límites duros de alcance** *(`§3.4`, sección «No contempla»)*: sin integración productiva con el
sistema académico de la universidad; sin autenticación institucional, inicio de sesión único ni
gestión real de permisos; sin confirmación legal o administrativa de inscripciones; sin reserva,
asignación o liberación real de cupos; sin aplicación automática de cambios sobre la oferta
institucional; sin período académico de Verano. Nada de lo que ocurre en el prototipo muta el estado
institucional, y la interfaz debe declararlo.

**Datos**: los nombres de materias y las 26 correlatividades fueron transcritos visualmente desde el
SVG de referencia y **sí pueden contrastarse contra el plan de estudios oficial** (respuesta del
autor del 2026-09-27); hasta que ese contraste ocurra no son reglas de dominio válidas. Oferta,
cupos, docentes, horarios, aulas y capacidades son inventados, no son fuente institucional y deben
declararse como simulados en la propia interfaz.

**Terminología que no se negocia**: «inscribir» describe únicamente el período actual y nunca una
intención condicionada (D-03); cada período académico **es** un bimestre (1A → 1B → 2A → 2B); el
tope por defecto es 3 materias por bimestre, equivalente a 6 por cuatrimestre, configurable entre 1 y
3 (D-04, P-06); «alternativa» es el conjunto factible que produce el motor, e «infactible» es el
estado formal del problema.

**Deuda conocida del modelo**: falta el atributo que dice en qué bimestre se ofrece cada materia —
pertenece a la oferta, no a la materia, de modo que una materia sin oferta publicada no tiene
bimestre conocido; no existen horarios ni comisiones en el modelo, así que las advertencias de
superposición y cupo no pueden implementarse sin datos nuevos; los estados `no-capacity` y `review`
están estilizados pero ninguna materia los usa; las dimensiones de preferencia quedaron acotadas a
profesor (optimización) y días (restricción dura) desde el 2026-09-18.

## Brand Commitments

- **Nombre**: «Planificador académico para Ingeniería en Software» es el descriptor de la tesis y del
  prototipo. No hay logotipo, identidad visual ni nombre de producto registrado.
- **Paleta institucional (decidida el 2026-09-27)**: el material visual del prototipo adopta la
  identidad de la universidad del caso de estudio —verde profundo `#046353` y su familia, con dorado
  `#eba310` como color de atención— replicada desde el sitio institucional y el logotipo, no desde un
  manual de marca. La universidad **no se nombra** en los artefactos: el repositorio dice «la
  universidad» y su elicitación institucional sigue abierta, así que la marca aporta el color, no el
  nombre ni una atribución de respaldo.
- **Los avisos son obligatorios y visibles**: cada superficie declara en texto real, no en un tooltip,
  que los datos son simulados, que es un prototipo de tesis y que no es un sistema oficial de la
  universidad.
- **Prohibición de atribución institucional**: aunque adopte su paleta, el prototipo no debe
  presentarse como sistema oficial ni sugerir respaldo, integración o validez administrativa que no
  existe. No hay validación institucional de procesos, reglas, permisos ni interfaces, y el
  logotipo o el nombre de la universidad no se usan como sello.
- **Prohibición de datos personales reales**: no se almacenan credenciales académicas reales; todo
  dato es simulado o seudonimizado (RNF-08). Los nombres de docentes y las capacidades son
  inventados.

## Evidence on Hand

- **Manuscrito** `documento/tesis.md`: capítulos 1 a 5 desarrollados y stack completo en §4.2.
  §6.1.1 «A nivel funcional», §6.1.3 «Diagrama de arquitectura» y §7.2.5 «Interfaz gráfica» siguen
  vacías.
- **Figuras** 1 a 5 en `documento/figuras/`. La figura del Anexo D es una versión más rica que el
  SVG del repositorio: el SVG es material de trabajo de las maquetas, no la fuente del anexo.
- **Maquetas ejecutables**: `mockup/`, `periodo-2A/`, `periodo-2B/`, `panel-seleccion/`,
  `institucional-demanda/`, todas con servidor estático y sin build.
- **Datos simulados**: `comun/datos-simulados.js`, `comun/demanda-institucional-simulada.js`.
- **Relevamiento estudiantil**: 45 respuestas válidas, muestra intencional y no probabilística.
- **Identidad institucional del caso de estudio**: valores extraídos del sitio institucional vivo
  (`https://21.edu.ar/` y su hoja `template_theme-overrides.css`) y del logotipo institucional de
  2017: `#046353`, `#007a5e`, `#006c5b`, `#00523f`, `#043a31`, `#003e34`, `#e5f1ef`, `#98dbce`,
  `#0b9287`, `#35b5ac`, `#eba310`, `#f19f26`, `#6a2482`, `#cad5e2`, `#6d6e71`, texto `#1e1e1e`. No
  hay manual de marca público alcanzable; la fuente es el sitio y el logotipo, no una guía oficial.
- **Registro autoritativo de decisiones**: `decisiones.md` (D-01 a D-21, con las resueltas y las
  superadas marcadas).

**Ausencias que el trabajo futuro no debe fabricar**: validación institucional de procesos, reglas,
permisos o interfaces; el modelo AS-IS institucional formal de §4.4.3, que espera entrevistas;
existencia de API, integración o conexión con SIU Guaraní o cualquier sistema universitario; validez
estadística del relevamiento fuera del corte de 45 casos; testimonios, métricas de uso, adopción,
benchmarks de competidores o pricing.

## Product Principles

1. **Explicitar antes que excluir.** Si no hay solución completa, el sistema nombra los conflictos y
   propone cambios explícitos. Excluir una materia en silencio es la falla que este producto existe
   para evitar.
2. **Un motor, dos momentos.** La inscripción del período actual y la planificación del siguiente
   comparten restricciones, datos y explicación; no son dos productos.
3. **Nada se aplica.** Toda acción del prototipo es de solo lectura sobre lo institucional: evalúa,
   explica y muestra, no inscribe, no reserva cupos, no mueve aulas.
4. **El dato declarado.** Un dato sin fuente institucional se muestra como simulado, en la interfaz y
   en el documento. La falta de dato es un estado visible, no un cero.
5. **La terminología es parte del dominio.** «Inscribir», «bimestre», «intención» y «alternativa»
   tienen un único significado; el vocabulario no se estira para que la interfaz suene mejor.

## Accessibility & Inclusion

El diseño web toma WCAG 2.2 nivel AA como referencia para no depender exclusivamente del color y
mantener navegación por teclado y mensajes comprensibles *(`§4`; RNF-07)*. Lo implementado hasta hoy:
foco visible, enlace de salto, controles nativos operables por teclado, anuncios educados tras un
cambio de período, patrones visuales además del color, alternativa textual por estado y respeto de
`prefers-reduced-motion: reduce`.

**Brecha admitida**: la verificación con herramientas automatizadas —por ejemplo `axe-core`— nunca
se ejecutó (`README.md`).
