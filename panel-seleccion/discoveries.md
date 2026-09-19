# Hallazgos del panel de selección

> Documento de trabajo. Este mockup usa datos simulados y no representa una inscripción oficial ni decisiones institucionales cerradas.

## Correcciones de la revisión

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

### 8. El desplazamiento decide el lado y la guarda protege el foco — **regla de posicionamiento**

El lado del panel lo decide el desplazamiento horizontal del grafo: a 0 % se ancla a la **derecha**, y desde el **20 %** pasa a la **izquierda**. Con histéresis, solo vuelve a la derecha por debajo del **15 %**, para que no salte de lado cuando el estudiante va y viene sobre el límite. El denominador es `scrollLeft / (scrollWidth - clientWidth)`, el rango realmente desplazable: cubre todas las posiciones válidas sin mezclar el ancho visible.

**La versión anterior tenía el criterio invertido.** El lado se calculaba desde los datos, evitando tapar tarjetas seleccionables, y eso hacía que el panel arrancara a la izquierda y se mudara a la derecha al avanzar. El panel debe correrse a medida que el estudiante avanza, no empezar en el camino.

Queda una sola guarda, y es de accesibilidad: el panel no debe tapar el elemento que tiene el foco de teclado, porque el proyecto cita WCAG 2.2 y su criterio 2.4.11 lo exige. Si el lado preferido cubriría el elemento enfocado, el panel usa el otro. Los descendientes del propio panel quedan excluidos de esa comprobación, porque enfocar un control del panel no puede ser motivo para que el panel se mueva.

**Consecuencia conocida y aceptada**: a 0 % de desplazamiento el panel tapa C23 y C24 en el escenario actual. No es una regresión, es el costo de que el lado lo fije el desplazamiento. Alcanza con desplazarse un 20 % para que se corra, y enfocar cualquiera de esas tarjetas lo mueve de inmediato.

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
- El grafo mantiene botones, acceso por teclado y anuncios `aria-live`, y la guarda de la sección 8 evita que el panel tape el elemento enfocado. Lo que falta es una lista o tabla completa como alternativa semántica al mapa de 46 tarjetas.
- La regla de reposicionamiento está implementada y documentada en la sección 8: el desplazamiento decide el lado y la guarda de foco lo corrige. Lo que falta no es el movimiento sino su contraparte semántica, la lista o tabla navegable.

## Preferencias y disponibilidad (T6)

### Decisiones que exigieron los nuevos bloques

- La disponibilidad queda separada y antes de las preferencias: los seis días son alternadores de “no puedo asistir” y la propia interfaz declara que son una **restricción dura**. La separación evita que una ausencia olvidada se lea como un criterio que el optimizador podría sacrificar.
- La disponibilidad y las preferencias se conservan por período, como los borradores. Cambiar de `1B · 2026` a `2A · 2026` no traslada una imposibilidad ni una preferencia sin que el estudiante la haya declarado para ese período.
- Cada dimensión de D-02 tiene siempre el mismo selector visible: `restricción` o `criterio`. La leyenda del bloque explica que la primera puede volver el resultado infactible y la segunda solo ordena alternativas válidas.
- Las opciones de cátedra y profesor salen exclusivamente de las cátedras de las materias actualmente marcadas. Cátedra muestra su identificador y materia; profesor resuelve el identificador `docente` contra el catálogo compartido. Sin materias con oferta, ambos muestran estado vacío. Las selecciones de una materia que se quite se conservan en la preferencia del período, pero no afectan advertencias ni se muestran hasta que la materia vuelva a estar marcada.
- Franjas usa las franjas publicadas de esas mismas cátedras. Para cantidad de días, el mockup interpreta el valor elegido como el máximo de días que puede ocupar una cátedra individual; no afirma que haya validado una combinación de varias materias. Modalidad permanece visible como dimensión, pero declara que no tiene opciones porque el dato compartido no publica modalidades.

### Detección local de una imposibilidad por día bloqueado

Para cada materia activa con cátedras publicadas, la comprobación advierte cuando **cada** cátedra tiene todas sus franjas en días bloqueados. En ese caso esa materia no tiene ninguna cátedra individual que evite los días declarados y el aviso nombra tanto la materia como los días. Esto es una advertencia local, no una alternativa ni una ejecución de CP-SAT: que cada materia tenga una cátedra posible por separado no demuestra que exista una combinación compatible entre todas.

Si el estudiante bloquea un día después de marcar materias, el borrador no se borra ni se modifica. Se recalculan de inmediato las comprobaciones locales y puede aparecer el aviso de imposibilidad; al desbloquearlo, el aviso desaparece si deja de aplicar. El resultado global futuro sigue siendo el único lugar que podrá explicar la infactibilidad de una combinación completa.

### Preferencia de profesor por materia marcada — **reducción de alcance registrada**

La interfaz conserva una única preferencia blanda: profesor, dentro de cada materia marcada y limitada a los docentes de sus cátedras publicadas en el período actual. La elección ordena alternativas válidas y no vuelve infactible un resultado; por eso no tiene selector de nivel. Cátedra, modalidad, franjas horarias y cantidad de días, junto con sus estados y selectores, se retiraron del panel. La restricción por días se mantiene separada porque es dura.

La sección 3.3 de la tesis se compromete con cinco dimensiones de preferencia, mientras que esta interfaz ofrece una. La diferencia queda registrada en lugar de reinterpretar silenciosamente el texto de la tesis: hace falta decidir si la tesis se actualiza o si las cuatro dimensiones retiradas regresan en otra interfaz o etapa.

### Funcionalidad que estos bloques necesitan y los datos o requisitos no proveen

- No hay una definición de dominio para el valor de cada preferencia: si varias cátedras, profesores o franjas seleccionadas se interpretan como alternativas permitidas, requisitos simultáneos o prioridades ordenadas; ni cómo se ponderan los `criterio` entre sí.
- No hay modalidades en `DATOS_SIMULADOS`, ni contrato que indique valores, relación con una cátedra o cómo una restricción de modalidad debe validarse. El panel no fabrica modalidades y advierte que esa restricción no puede comprobarse.
- Falta el modelo CP-SAT que combine cátedras de varias materias. Por eso la cantidad de días se verifica solo por cátedra individual y los avisos de cátedra, profesor y franja detectan que una materia no tiene opción local, no que toda la selección sea o no factible.
- Falta especificar si la disponibilidad es por período, permanente, por semana concreta o por franja horaria; el mockup eligió conservarla por período para no mezclar borradores, pero esa persistencia requiere decisión de producto.
- No hay semántica para una cátedra sin franjas, una franja excepcional, cambios de oferta ni una causa prioritaria cuando se superponen varias restricciones. La futura explicación de infactibilidad necesita esos contratos y trazabilidad de la oferta.

## Requerimientos candidatos derivados

- **RC-UX-12:** distinguir selección a nivel materia de selección a nivel cátedra e informar la consecuencia sobre horarios, cupos y promesas del sistema, en el resultado de optimización.
- **RC-UX-13:** conservar y explicar el origen, vigencia y completitud de cada oferta usada para validar un borrador.
- **RC-UX-14:** evaluar los topes solo con bimestres conocidos y declarar explícitamente la parte del cuatrimestre que falta conocer.
- **RC-UX-15:** definir formalmente la traducción de `no considerar` a restricciones y flexibilizaciones de optimización.
- **RC-UX-16:** separar visual y semánticamente advertencias locales de alternativas producidas por una ejecución global.
- **RC-UX-17:** ofrecer una alternativa navegable al grafo que mantenga selección, intención y avisos sincronizados.
- **RC-UX-18:** modelar el período y el origen de cada compromiso preexistente del borrador.
