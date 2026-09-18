# Hallazgos del panel de selección

> Documento de trabajo. Este mockup usa datos simulados y no representa una inscripción oficial ni decisiones institucionales cerradas.

## Correcciones de la revisión de la autora

### 1. La barra de período abre la etapa de selección — **bug de ciclo de vida**

El panel estaba presente desde la carga y el CTA de la barra coexistía con él como una segunda acción global. La corrección separa las etapas: el panel empieza oculto; `Iniciar la inscripción` (`1B · 2026`) o `Generar alternativas` (`2A · 2026`) abre la selección. Mientras la selección está abierta, el botón de entrada se oculta: no representa una acción que pueda coexistir con su propia etapa. Al cerrar la selección, la maqueta pasa a la etapa de optimización pendiente.

### 2. Una tarjeta alterna entre agregar y quitar — **bug de interacción**

El ciclo de cuatro clics convertía una operación de pertenencia al borrador en un selector de políticas oculto. Ahora el primer clic agrega y el segundo quita. La relación directa de correlatividades se resalta al agregar, se conservan los anuncios `aria-live` y el estado vuelve al del escenario al quitar.

### 3. La intención es derivada y de solo lectura — **bug de modelo de interacción; regla de negocio decidida**

El `<select>` permitía al estudiante declarar una intención que el escenario debe derivar. La regla conservadora acordada es: una materia cargada desde la planificación existente es `requerida en esta planificación`; una materia marcada durante esta sesión es `deseada`; una materia bloqueada marcada en el borrador es `no considerar`, con su correlatividad pendiente como motivo visible. Una materia disponible, sin cátedra o sin cupo entra como `deseada`. No se infiere impacto curricular ni se convierte una preferencia en restricción dura.

**Pregunta abierta:** el mockup no define todavía cómo se representa en CP-SAT la exclusión `no considerar` ni qué alternativa de flexibilización ofrece RF-19.

### 4. La granularidad pertenece al resultado — **decisión mal ubicada**

El bloque de granularidad se eliminó del borrador. RF-13 pide informar la granularidad **del resultado**: nivel de cátedra con oferta publicada y nivel de materia con oferta pendiente. Ese dato debe aparecer en la futura pantalla de resultados de la optimización, no antes de ejecutar el motor. La nota de oferta conocida se conserva solo para limitar correctamente el contador local.

### 5. El CTA del panel cierra la selección — **bug de transición; vocabulario de D-03**

El CTA interno ya no duplica el de entrada ni pretende generar alternativas desde la selección. Dice `Inscribir` en `1B · 2026` y `Aceptar` en `2A · 2026`; queda deshabilitado cuando el borrador está vacío. Al activarlo cierra el panel y muestra una transición explícita a la optimización CP-SAT.

La transición enumera como pendientes los seis resultados documentados: alternativas de cursado, solución óptima, solución factible, infactibilidad explicada, estado indeterminado por límite temporal y oferta pendiente a nivel de materia. No simula que el solver exista.

**Pregunta abierta:** falta especificar la pantalla y el contrato de datos que materializarán esos seis resultados, incluidos su orden, acciones de recuperación y trazabilidad.

### 6. La marca visual nace en el borrador — **bug de fuente de verdad**

Las tarjetas `planificada` leían un estado estático del escenario mientras el borrador era otro `Map`; por eso el grafo y el panel se contradecían. Cada período mantiene ahora su propio borrador. La planificación existente del escenario se carga de forma explícita en el borrador de `2A · 2026`, se muestra como `requerida en esta planificación` y se identifica como cargada desde el escenario. Una tarjeta solo aparece marcada si pertenece al borrador activo; al quitarla revierte.

**Pregunta abierta:** el modelo de dominio deberá proveer el período de cada compromiso previo en lugar de inferirlo de un estado visual. En este escenario, la pertenencia a `2A · 2026` proviene explícitamente de `mockup/README.md`.

### 7. La planificación previa pertenece al período que se planifica — **hallazgo de escenario**

El escenario previo a las inscripciones de `2A · 2026` ubica C19, C20 y C27 en el borrador de ese período y deja vacío el de `1B · 2026`, donde no hay materias inscriptas. Mezclar ambos períodos hace que el estudiante lea como propias marcas que pertenecen a la planificación futura. Por eso `scenarioPlans` solo precarga esas materias en `2A · 2026`; la nota de origen y la intención derivada `requerida en esta planificación` se conservan para identificarlas.

## Funcionalidad que la interfaz necesita y los datos o requisitos no proveen

### Oferta, comisiones y cupos

- Falta una fecha de publicación, versión, fuente y vigencia de la oferta. El panel puede saber que una cátedra existe, pero no puede explicar cuán confiable es ni si cambió desde que se generó un borrador.
- Falta distinguir explícitamente “sin oferta todavía”, “oferta no publicada para este período”, “oferta cancelada” y “error de carga”. Todos terminan pareciéndose a oferta pendiente.
- `cupo` es un número simulado sin semántica definida: no queda establecido si representa vacantes actuales, cupo total, lista de espera o una foto retrasada. Tampoco existe una regla para el cupo entre varias cátedras de la misma materia.
- No existen modalidades, sedes, requisitos de aula, actividades paralelas ni relaciones entre comisiones. Por eso el chequeo de agenda solo puede comparar franjas de una cátedra aislada; no puede prometer una combinación completa.

### Reglas académicas y selección

- El grafo transcribe correlatividades, pero no especifica el tipo de requisito: aprobada, regularizada, cursada simultánea, equivalencia, excepción o condición de período. El aviso local es deliberadamente conservador y no sustituye una validación académica.
- El tope de seis por cuatrimestre necesita conocer también el otro bimestre. Una planificación para `1B` solo conoce el consumo de `1B`; si no recibe el borrador o la inscripción de `1A`, no puede declarar que el límite cuatrimestral está disponible.
- Una materia sin oferta publicada no tiene bimestre conocido. No puede contarse contra el límite de tres ni de seis sin inventar un período. El panel muestra esa indeterminación en lugar de convertirla en cero.
- Falta una regla para materias anuales, intensivas, equivalencias y actividades que ocupan más de un bimestre; el modelo actual presupone que una oferta pertenece a un período.

### Operación, accesibilidad y continuidad

- Falta un estado de ejecución, cancelación, tiempo límite, error y reintento de la optimización. El placeholder solo declara el límite del mockup.
- Falta persistencia: identidad, duración, recuperación del borrador, conflicto entre pestañas y qué ocurre si la oferta cambia después de seleccionar.
- El grafo mantiene botones, acceso por teclado y anuncios `aria-live`, pero aún se necesita una lista o tabla completa como alternativa semántica al mapa de 46 tarjetas y una estrategia para que el foco no quede oculto detrás del panel móvil.
- La regla de reposicionamiento requerida por la decisión del proyecto no está implementada en esta tarea. El CSS deja un ancla fija explícita (`top/right`) para que la tarea posterior pueda moverla sin reestructurar el panel.

## Requerimientos candidatos derivados

- **RC-UX-12:** distinguir selección a nivel materia de selección a nivel cátedra e informar la consecuencia sobre horarios, cupos y promesas del sistema, en el resultado de optimización.
- **RC-UX-13:** conservar y explicar el origen, vigencia y completitud de cada oferta usada para validar un borrador.
- **RC-UX-14:** evaluar los topes solo con bimestres conocidos y declarar explícitamente la parte del cuatrimestre que falta conocer.
- **RC-UX-15:** definir formalmente la traducción de `no considerar` a restricciones y flexibilizaciones de optimización.
- **RC-UX-16:** separar visual y semánticamente advertencias locales de alternativas producidas por una ejecución global.
- **RC-UX-17:** ofrecer una alternativa navegable al grafo que mantenga selección, intención y avisos sincronizados.
- **RC-UX-18:** modelar el período y el origen de cada compromiso preexistente del borrador.
