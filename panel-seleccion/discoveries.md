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

## Restricción de disponibilidad y preferencia de profesor (T6)

### Decisiones que exigieron los nuevos bloques

- La disponibilidad queda separada de la preferencia y **antes** que ella: los seis días son alternadores de “no puedo asistir” y la propia interfaz declara que son una **restricción dura**. La separación evita que una ausencia olvidada se lea como un criterio que el optimizador podría sacrificar.
- La disponibilidad y la preferencia de profesor se conservan por período, como los borradores. Cambiar de `1B · 2026` a `2A · 2026` no traslada una imposibilidad ni una preferencia sin que el estudiante la haya declarado para ese período.
- **No existe ningún selector de nivel `restricción` / `criterio`.** El panel perdió las cuatro dimensiones de preferencia que lo tenían —cátedra, modalidad, franjas horarias y cantidad de días— y con ellas su estado. La única preferencia que queda, la del profesor de cada materia, es blanda por construcción: ordena alternativas válidas y nunca vuelve infactible el resultado, así que un selector de nivel no tendría nada que elegir. La distinción entre lo duro y lo blando se lee por el lugar y la etiqueta, no por un control.
- Las opciones de profesor salen exclusivamente de las cátedras publicadas de las materias actualmente marcadas, y se resuelven contra el catálogo de docentes de la capa compartida. Una materia sin cátedras publicadas muestra estado vacío en lugar de una lista fabricada. La elección de una materia que se quite se conserva en la preferencia del período, pero no afecta advertencias ni se muestra hasta que la materia vuelva a estar marcada.
- El bloque de disponibilidad y la preferencia de profesor son los **dos únicos bloques de entrada** que el panel agregó. El título «Selección» y la línea de ayuda se retiraron para hacerles lugar, y el panel conserva su nombre accesible mediante `aria-label` en lugar del encabezado visual.

### El nombre de la materia es la cabeza del desplegable de profesores — **intencional, no intuitivo**

El nombre de cada materia marcada **es** el control que despliega su lista de profesores: no existe un botón aparte rotulado «Preferencia de profesor». El autor lo pidió así y confirmó el 2026-09-19 que la falta de afordancia es **deliberada**: el nombre debe leerse como texto y **no** se le agrega chevron ni ningún otro indicador de control.

El revisor de la revisión nativa había abierto `R3-TOGGLE-AFFORDANCE` señalando que un nombre que se lee como texto puede no descubrirse como desplegable, y proponiendo un indicador visible. Esa propuesta queda **rechazada por decisión del autor**, no pendiente de corrección: no debe reabrirse como hallazgo. Lo que sí se conserva es la semántica, y por eso el costo está acotado: el control es un `button` real con `aria-expanded` y `aria-controls`, así que teclado y lector de pantalla lo anuncian como control expandible, y lo que se pierde es solo la descubribilidad visual con ratón. El nombre, los metadatos de oferta y la intención derivada siguen dentro del control; la nota de origen y el motivo de exclusión quedan fuera, porque explican en lugar de etiquetar.

### Detección local de una imposibilidad por día bloqueado

Para cada materia activa con cátedras publicadas, la comprobación advierte cuando **cada** cátedra tiene todas sus franjas en días bloqueados. En ese caso esa materia no tiene ninguna cátedra individual que evite los días declarados y el aviso nombra tanto la materia como los días. Esto es una advertencia local, no una alternativa ni una ejecución de CP-SAT: que cada materia tenga una cátedra posible por separado no demuestra que exista una combinación compatible entre todas.

Si el estudiante bloquea un día después de marcar materias, el borrador no se borra ni se modifica. Se recalculan de inmediato las comprobaciones locales y puede aparecer el aviso de imposibilidad; al desbloquearlo, el aviso desaparece si deja de aplicar. El resultado global futuro sigue siendo el único lugar que podrá explicar la infactibilidad de una combinación completa.

### Preferencia de profesor por materia marcada — **reducción de alcance registrada**

La interfaz conserva una única preferencia blanda: profesor, dentro de cada materia marcada y limitada a los docentes de sus cátedras publicadas en el período actual. La elección ordena alternativas válidas y no vuelve infactible un resultado; por eso no tiene selector de nivel. Cátedra, modalidad, franjas horarias y cantidad de días, junto con sus estados y selectores, se retiraron del panel. La restricción por días se mantiene separada porque es dura.

La tensión con el documento **quedó resuelta el 2026-09-18**, y por eso no es deuda abierta: §1 y §3.3 ya no enumeran cinco dimensiones, sino «la preferencia por un profesor de cada materia y el registro de los días en que el estudiante no puede cursar», y D-02 quedó acotada en el mismo sentido (sección «Preferencias acotadas el 2026-09-18» de `decisiones.md`). El autor eligió ajustar el documento a lo que el prototipo ofrece antes que conservar capacidades sin interfaz. Las cuatro dimensiones retiradas no quedan esperando regreso: si vuelven, vuelven con una decisión nueva.

### Funcionalidad que estos bloques necesitan y los datos o requisitos no proveen

- No hay una definición de dominio para el valor de la preferencia de profesor: si elegir un docente entre las cátedras publicadas significa una alternativa permitida, un requisito simultáneo o una prioridad ordenada; ni cómo se pondera cuando varias materias marcadas declaran la suya. El panel la conserva y la declara blanda, pero no puede prometer cómo la va a resolver el optimizador.
- Las cuatro dimensiones retiradas carecen de datos y de contrato en `DATOS_SIMULADOS`: no hay modalidades, ni relación declarada entre una modalidad y una cátedra, ni semántica para franjas horarias o cantidad de días como preferencia. No es un defecto del panel, que ya no las ofrece, sino una condición a resolver antes de reintroducirlas.
- Falta el modelo CP-SAT que combine cátedras de varias materias. Por eso la preferencia de profesor solo se puede contrastar contra las cátedras publicadas de una materia, y el aviso de superposición detecta que una combinación de comisiones es incompatible, no que toda la selección sea o no factible.
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
