# Hallazgos del panel de selección

> Documento de trabajo. Este mockup usa datos simulados y no representa una inscripción oficial ni decisiones institucionales cerradas.

## Correcciones de la revisión

### 1. La barra de período abre la etapa de selección — **bug de ciclo de vida**

El panel estaba presente desde la carga y el CTA de la barra coexistía con él como una segunda acción global. La corrección separa las etapas: el panel empieza oculto; `Iniciar la inscripción` (`1B · 2026`) o `Planificar` (`2A · 2026`) abre la selección. Mientras la selección está abierta, el botón de entrada se oculta: no representa una acción que pueda coexistir con su propia etapa. Al cerrar la selección, la maqueta pasa a la etapa de optimización pendiente.

### 2. Una tarjeta alterna entre agregar y quitar — **bug de interacción**

El ciclo de cuatro clics convertía una operación de pertenencia al borrador en un selector de políticas oculto. Ahora el primer clic agrega y el segundo quita. Marcar no resalta correlatividades ni atenúa otras tarjetas: el autor necesita poder marcar varias materias a la vez. Se conservan los anuncios `aria-live` y el estado vuelve al del escenario al quitar.

### 2.1. Aprobadas y bloqueadas no son marcables — **regla del autor**

Durante la selección, las materias aprobadas y bloqueadas permanecen deshabilitadas de forma nativa. En `2A · 2026`, C19, C20 y C23 también quedan deshabilitadas como inscripciones existentes. `markCourse()` rechaza su incorporación por llamadas programáticas según el estado efectivo del período; los demás estados conservan el comportamiento existente.

### 2.2. El borrador del bimestre usa un máximo configurable — **regla explícita del autor**

El estudiante puede configurar el máximo estricto por bimestre en 1, 2 o 3 materias; el valor predeterminado es 3. El conteo se toma del borrador completo, no de la oferta publicada: una materia sin cátedra, como C24, ocupa uno de esos lugares. Al alcanzar el máximo vigente, toda tarjeta no marcada que de otro modo sería seleccionable queda deshabilitada de forma nativa; las ya marcadas siguen habilitadas para que se pueda quitar una y liberar el lugar de inmediato. `markCourse()` conserva primero la operación de quitar y, para una incorporación, defiende el tope después de rechazar los estados aprobada y bloqueada, también frente a llamadas programáticas. Bajar el máximo por debajo de un borrador ya marcado no lo recorta: el exceso queda a la vista —el contador bimestral se marca en rojo— y confirmar la etapa en ese estado queda bloqueado con un aviso que informa cuántas materias hay y cuál es el límite vigente, de modo que el lugar se libera a mano y nunca se avanza con una carga por encima de la configurada.

### 3. La intención es derivada y de solo lectura — **bug de modelo de interacción; regla de negocio decidida**

El `<select>` permitía al estudiante declarar una intención que el escenario debe derivar. La regla conservadora acordada es: una materia marcada durante esta sesión es `deseada`; una materia bloqueada solo queda como `no considerar` cuando su estado efectivo para el período sigue siendo bloqueado. Una materia disponible, sin cátedra o sin cupo entra como `deseada`. No se infiere impacto curricular ni se convierte una preferencia en restricción dura.

**Pregunta abierta:** el mockup no define todavía cómo se representa en CP-SAT la exclusión `no considerar` ni qué alternativa de flexibilización ofrece RF-19.

### 4. La granularidad pertenece al resultado — **decisión mal ubicada**

El bloque de granularidad se eliminó del borrador. RF-13 pide informar la granularidad **del resultado**: nivel de cátedra con oferta publicada y nivel de materia con oferta pendiente. Ese dato debe aparecer en la futura pantalla de resultados de la optimización, no antes de ejecutar el motor. El contador del encabezado refleja todas las materias marcadas del borrador, incluida una con oferta pendiente; el máximo estricto configurable se aplica sobre ese mismo total.

### 5. El CTA del panel cierra la selección — **bug de transición; vocabulario de D-03**

El CTA interno ya no duplica el de entrada ni pretende generar alternativas desde la selección. Dice `Inscribir` en `1B · 2026` y `Aceptar` en `2A · 2026`; queda deshabilitado cuando el borrador está vacío. `Inscribir` cierra el panel y abre la etapa de resultados simulados del período actual. `Aceptar` aplica directamente el borrador de planificación: las materias pasan a `Planificada`, el borrador se conserva, el panel se cierra y el foco vuelve a `Planificar`.

La planificación no ejecuta CP-SAT ni abre el modal de resultados. Los seis resultados documentados —alternativas de cursado, solución óptima, solución factible, infactibilidad explicada, estado indeterminado por límite temporal y oferta pendiente a nivel de materia— pertenecen solamente a la inscripción. No simula que el solver exista.

**Pregunta abierta:** falta especificar la pantalla y el contrato de datos que materializarán esos seis resultados de inscripción, incluidos su orden, acciones de recuperación y trazabilidad.

### 6. El estado efectivo depende del período — **corrección de fuente de verdad**

`courses` conserva el estado base del grafo. `periodStateOverrides` aplica la excepción sin mutarlo: en `2A · 2026`, C19, C20 y C23 son `Inscripta`, C27 es `Disponible` y C25/C26 son `Sin cátedra`; en `1B · 2026` todos vuelven a su estado base. La selección, las clases CSS, la intención y los rechazos de `markCourse()` consultan el mismo estado efectivo.

### 7. La inscripción existente no pertenece al borrador — **semántica de escenario**

C19, C20 y C23 son contexto de inscripción existente de `2A · 2026`, no decisiones de planificación. Por eso el borrador de ese período empieza vacío, no las lista ni las cuenta contra el máximo configurable por bimestre; sus tarjetas quedan deshabilitadas. C27 queda `Disponible`; C25 y C26, en cambio, pueden entrar como materias `deseada` aunque no tengan cátedras publicadas, y el acordeón informa ese estado vacío.

### 8. El panel migra como modal flotante sobre el grafo — **corrección de interacción revisada por el autor**

La implementación anterior superponía el panel al grafo. Con el grafo al 0 % de desplazamiento, el panel flotante tapaba C23 y C24: un clic dirigido a C23 caía dentro del panel, no marcaba la materia y activaba por accidente el alternador de `miércoles`, agregando silenciosamente una restricción dura que el autor no había pedido. Se probó una columna fija que reservaba la huella del panel para evitar esa superposición y se recuperó la migración lateral.

El autor rechazó después la solución de columna reservada porque convertía el modal en una sección de pantalla: estrechaba y desplazaba el canvas como si el panel ocupara una región permanente. El comportamiento actual aceptado vuelve a ser un modal fijo y flotante sobre el grafo. La migración conserva la histéresis: el panel empieza a la derecha, pasa a la izquierda desde el 20 % del desplazamiento horizontal del canvas y solo vuelve a la derecha por debajo del 15 %. El canvas conserva todo su ancho y las tarjetas pueden quedar detrás del panel.

El cambio de fondo blanco se revirtió: «gris» se refería a la sección aparentemente reservada, no a los colores de las tarjetas ni del panel. La guarda de foco permanece ausente; no se restauran los helpers de foco ni de solapamiento. Esto actualiza la sustitución de la regla de panel flotante registrada como D-11 en `decisiones.md`; ese documento se conserva como historial de la decisión deliberada, medida, retirada y corregida por el autor.

### 9. La rueda vertical del grafo se traduce a desplazamiento horizontal — **mejora de navegación**

Sobre el canvas del grafo, una rueda vertical pura actualiza un único destino acumulado de `scrollLeft` sin requerir Shift. La conversión conserva la unidad del evento: píxeles sin cambio, líneas por 16 px y páginas por el ancho visible del canvas. Una sola animación de `requestAnimationFrame` aproxima cada cuadro el 25 % de la distancia pendiente y siempre limita el destino a los extremos; no se crea una cola por cada notch. Para funcionar también donde `scrollLeft` se redondea a enteros, completa al faltar como máximo 1 px o si el paso calculado ya no cambia la posición, y limpia el destino y el cuadro pendiente. El listener existente de `scroll` sigue migrando el panel durante ese movimiento.

Con `prefers-reduced-motion: reduce`, el destino se aplica de inmediato. Los gestos con `deltaX` distinto de cero —incluidos los trackpads horizontales—, Shift+rueda y Ctrl/Cmd+rueda siguen su ruta nativa; los últimos preservan el zoom del navegador. Tampoco se intercepta la rueda que nace en `#selection-panel`, `#results-modal` o `#results-scrim`, para que esos contenedores mantengan su desplazamiento vertical nativo. La ruta del panel, listeners pasivos explícitos en el modal y el scrim de resultados, y una interacción directa de puntero sobre el canvas cancelan cualquier animación pendiente sin impedir el desplazamiento nativo, para que no compita con el desplazamiento, el zoom, las superposiciones ni la barra de desplazamiento.

### 10. La alternativa se confirma explícitamente y solo en su intersección — **regla de cierre simulada**

Las alternativas viables son tarjetas de radio nativas: elegir una es reversible, no modifica las materias ni el borrador y se identifica por el par `desenlace + alternativa`, porque `ALT-1` se repite entre desenlaces. La elección se limpia al abrir resultados, cambiar desenlace o volver a ejecutar el desenlace simulado. El modal conserva `Volver`, cerrar y Escape como salidas no confirmativas que devuelven el borrador intacto.

`Confirmar inscripción` es una acción separada. Solo se habilita cuando la alternativa elegida comparte al menos una materia con el borrador; si no comparte ninguna, el aviso visible explica por qué sigue deshabilitado. Al confirmar, la maqueta acumula exclusivamente esa intersección en un estado `Inscripta` local por período, limpia el borrador y las preferencias/expansiones de profesor, restaura el canvas y la barra de período, y devuelve el foco a `Iniciar la inscripción`. Las restricciones de días no se limpian. El anuncio y el modal declaran que se trata del escenario simulado, no de una inscripción institucional oficial.

La confirmación no reutiliza `periodStateOverrides`: las inscripciones simuladas tienen precedencia sobre el estado base, las anulaciones y el plan aceptado, y no se trasladan a `2A · 2026`. El desenlace `indeterminado` conserva su alternativa parcial seleccionable; los desenlaces sin alternativas mantienen el CTA deshabilitado junto con su explicación y acciones de recuperación.

### 11. La selección bloquea el período y se puede cancelar como transacción — **regla de continuidad**

Abrir `Iniciar la inscripción` o `Planificar` inicia una transacción para el período visible. Mientras `selectionOpen || resultsOpen`, ambas flechas de navegación quedan deshabilitadas de forma nativa y sus manejadores no cambian de período si se los invoca programáticamente. El bloqueo no se libera al pasar al modal de resultados ni al regresar mediante Volver, Cerrar, Escape o una acción de recuperación: esas rutas conservan el borrador y vuelven a la selección.

La transacción solo termina al confirmar la inscripción, aceptar el plan o usar el nuevo `Cancelar` secundario del panel. Cancelar limpia exclusivamente los datos en progreso del período actual —borrador, preferencias y expansiones de profesor, y días no disponibles—; oculta el panel, elimina su marcador del canvas, vuelve a renderizar, devuelve el foco al CTA de entrada y anuncia el descarte. No revierte `enrolledByPeriod` ni `acceptedPlanByPeriod`: esos estados ya fueron confirmados y pertenecen a una transacción anterior.

## Funcionalidad que la interfaz necesita y los datos o requisitos no proveen

### Oferta, comisiones y cupos

- Falta una fecha de publicación, versión, fuente y vigencia de la oferta. El panel puede saber que una cátedra existe, pero no puede explicar cuán confiable es ni si cambió desde que se generó un borrador.
- Falta distinguir explícitamente “sin oferta todavía”, “oferta no publicada para este período”, “oferta cancelada” y “error de carga”. Todos terminan pareciéndose a oferta pendiente.
- `cupo` es un número simulado sin semántica definida: no queda establecido si representa vacantes actuales, cupo total, lista de espera o una foto retrasada. Tampoco existe una regla para el cupo entre varias cátedras de la misma materia.
- No existen modalidades, sedes, requisitos de aula, actividades paralelas ni relaciones entre comisiones. El mockup no puede evaluar ni prometer una combinación completa de agenda.

### Reglas académicas y selección

- El grafo transcribe correlatividades, pero no especifica el tipo de requisito: aprobada, regularizada, cursada simultánea, equivalencia, excepción o condición de período. No sustituye una validación académica.
- El tope de seis por cuatrimestre necesita conocer también el otro bimestre. Una planificación para `1B` solo conoce el consumo de `1B`; si no recibe el borrador o la inscripción de `1A`, no puede declarar que el límite cuatrimestral está disponible. La maqueta ahora muestra el consumo conocido contra `min(6, 2 × máximo configurado)` y declara por nombre el bimestre hermano sin datos (`1A` para `1B`, `2B` para `2A`), en vez de presentar el conteo como completo.
- Una materia sin oferta publicada no tiene bimestre conocido para una futura validación académica completa. Aun así, la regla explícita del autor para este borrador cuenta toda materia marcada, incluida esa materia, contra el máximo estricto configurable; el mockup no usa esa marca para afirmar una validación institucional del límite de seis.
- Falta una regla para materias anuales, intensivas, equivalencias y actividades que ocupan más de un bimestre; el modelo actual presupone que una oferta pertenece a un período.

### Operación, accesibilidad y continuidad

- Falta un estado de ejecución, cancelación, tiempo límite, error y reintento de la optimización. El placeholder solo declara el límite del mockup.
- Falta persistencia: identidad, duración, recuperación del borrador, conflicto entre pestañas y qué ocurre si la oferta cambia después de seleccionar.
- El grafo mantiene botones, acceso por teclado y anuncios `aria-live`; el panel flotante puede cubrir tarjetas, incluso si reciben el foco. Lo que falta es una lista o tabla completa como alternativa semántica al mapa de 46 tarjetas.
- El panel fijo migra entre lados sin reservar una franja del canvas. Sigue faltando su contraparte semántica, la lista o tabla navegable.

## Restricción de disponibilidad y preferencia de profesor (T6)

### Decisiones que exigieron los nuevos bloques

- La disponibilidad queda separada de la preferencia y **antes** que ella: los seis días son alternadores de “no puedo asistir”. La separación evita que una ausencia olvidada se lea como un criterio que el optimizador podría sacrificar.
- La disponibilidad y la preferencia de profesor se conservan por período, como los borradores. Cambiar de `1B · 2026` a `2A · 2026` no traslada una imposibilidad ni una preferencia sin que el estudiante la haya declarado para ese período.
- **No existe ningún selector de nivel `restricción` / `criterio`.** El panel perdió las cuatro dimensiones de preferencia que lo tenían —cátedra, modalidad, franjas horarias y cantidad de días— y con ellas su estado. La única preferencia que queda, la del profesor de cada materia, es blanda por construcción: ordena alternativas válidas y nunca vuelve infactible el resultado, así que un selector de nivel no tendría nada que elegir. La distinción entre lo duro y lo blando se lee por el lugar y la etiqueta, no por un control.
- Las opciones de profesor salen exclusivamente de las cátedras publicadas de las materias actualmente marcadas, y se resuelven contra el catálogo de docentes de la capa compartida. Una materia sin cátedras publicadas muestra estado vacío en lugar de una lista fabricada. La elección de una materia que se quite se conserva en la preferencia del período, pero no se muestra hasta que la materia vuelva a estar marcada.
- El bloque de disponibilidad y la preferencia de profesor son los **dos únicos bloques de entrada** que el panel agregó. El título «Selección» y la línea de ayuda se retiraron para hacerles lugar, y el panel conserva su nombre accesible mediante `aria-label` en lugar del encabezado visual.

### El nombre de la materia es la cabecera del acordeón de profesores — **decisión revisada por el autor**

La no afordancia deliberada se probó y se rechazó. El autor revirtió la decisión el 2026-09-19 después de ver la maqueta: el nombre, presentado como texto plano, no se leía como control y no permitió encontrar la función. La reversión es una decisión del autor, no un defecto del trabajo anterior.

El hallazgo `R3-TOGGLE-AFFORDANCE` de la revisión nativa resultó acertado en la práctica. La resolución es un acordeón real: el nombre de la materia es la cabecera, empieza contraído, conserva `button`, `aria-expanded` y `aria-controls`, e incorpora un indicador visible que cambia entre los estados. El nombre y los metadatos de oferta siguen dentro de la cabecera; la nota de origen y el motivo de exclusión quedan fuera, porque explican en lugar de etiquetar.

El autor pidió retirar de la cabecera el distintivo visual de intención. El valor se sigue calculando: cuando es `no considerar`, aún determina el motivo visible fuera de la cabecera; no se retiró la regla de negocio ni el atributo de las tarjetas del grafo.

### Decisiones de la ronda 2026-09-19

- El encabezado del panel ahora muestra el contador de carga en línea y se retiró la sección «Carga conocida».
- Se retiraron seis textos: la ceja del borrador, el distintivo de materias marcadas, la nota de restricción dura, la nota de oferta conocida, la leyenda de preferencia blanda y la nota de acción.
- Se retiraron el cuadro de comprobaciones locales y su cálculo; como consecuencia explícita, los avisos de día bloqueado, sobrepaso de tope y correlatividades ya no existen en el mockup.
- Se eliminaron por completo el muting y el resaltado de correlatividades directas para que el autor pueda marcar varias materias a la vez sin que las demás tarjetas se atenúen.

### Preferencia de profesor por materia marcada — **reducción de alcance registrada**

La interfaz conserva una única preferencia blanda: profesor, dentro de cada materia marcada y limitada a los docentes de sus cátedras publicadas en el período actual. La elección ordena alternativas válidas y no vuelve infactible un resultado; por eso no tiene selector de nivel. Cátedra, modalidad, franjas horarias y cantidad de días, junto con sus estados y selectores, se retiraron del panel. La restricción por días se mantiene separada porque es dura.

La tensión con el documento **quedó resuelta el 2026-09-18**, y por eso no es deuda abierta: §1 y §3.3 ya no enumeran cinco dimensiones, sino «la preferencia por un profesor de cada materia y el registro de los días en que el estudiante no puede cursar», y D-02 quedó acotada en el mismo sentido (sección «Preferencias acotadas el 2026-09-18» de `decisiones.md`). El autor eligió ajustar el documento a lo que el prototipo ofrece antes que conservar capacidades sin interfaz. Las cuatro dimensiones retiradas no quedan esperando regreso: si vuelven, vuelven con una decisión nueva.

### Funcionalidad que estos bloques necesitan y los datos o requisitos no proveen

- No hay una definición de dominio para el valor de la preferencia de profesor: si elegir un docente entre las cátedras publicadas significa una alternativa permitida, un requisito simultáneo o una prioridad ordenada; ni cómo se pondera cuando varias materias marcadas declaran la suya. El panel la conserva sin prometer cómo la va a resolver el optimizador.
- Las cuatro dimensiones retiradas carecen de datos y de contrato en `DATOS_SIMULADOS`: no hay modalidades, ni relación declarada entre una modalidad y una cátedra, ni semántica para franjas horarias o cantidad de días como preferencia. No es un defecto del panel, que ya no las ofrece, sino una condición a resolver antes de reintroducirlas.
- Falta el modelo CP-SAT que combine cátedras de varias materias. Por eso la preferencia de profesor solo se puede contrastar contra las cátedras publicadas de una materia; el mockup no determina si toda la selección es factible.
- Falta especificar si la disponibilidad es por período, permanente, por semana concreta o por franja horaria; el mockup eligió conservarla por período para no mezclar borradores, pero esa persistencia requiere decisión de producto.
- No hay semántica para una cátedra sin franjas, una franja excepcional, cambios de oferta ni una causa prioritaria cuando se superponen varias restricciones. La futura explicación de infactibilidad necesita esos contratos y trazabilidad de la oferta.

## Requerimientos candidatos derivados

- **RC-UX-12:** distinguir selección a nivel materia de selección a nivel cátedra e informar la consecuencia sobre horarios, cupos y promesas del sistema, en el resultado de optimización.
- **RC-UX-13:** conservar y explicar el origen, vigencia y completitud de cada oferta usada para validar un borrador.
- **RC-UX-14:** evaluar los topes solo con bimestres conocidos y declarar explícitamente la parte del cuatrimestre que falta conocer. La maqueta lo resuelve declarando el bimestre hermano sin datos y limitando la referencia mostrada a `min(6, 2 × máximo configurado)`; todavía requiere validación institucional del tope reglamentario, de los datos vigentes del bimestre hermano y de cuándo una configuración del estudiante puede aplicarse a esa regla.
- **RC-UX-15:** definir formalmente la traducción de `no considerar` a restricciones y flexibilizaciones de optimización.
- **RC-UX-16:** separar visual y semánticamente las explicaciones de infactibilidad del resultado de las alternativas producidas por una ejecución global.
- **RC-UX-17:** ofrecer una alternativa navegable al grafo que mantenga selección, intención y avisos sincronizados.
- **RC-UX-18:** modelar el período y el origen de cada compromiso preexistente del borrador.

## Revisión de alcance del 2026-09-19

El autor decidió que el período de planificación no ejecuta CP-SAT. El modal de resultados queda solo para la inscripción del período actual; la etiqueta de resultado del período siguiente se retira y la etiqueta de entrada vuelve a `Planificar`. En planificación, `Aceptar` pasa el borrador vigente a `Planificada` en ese período.

- El estado base `planned` se presenta como `Disponible`, mientras una materia que el estudiante acaba de planificar se presenta como `Planificada`. El primero describe un plan de otro período que la vista actual no puede afirmar; el segundo pertenece al plan aceptado del período renderizado.
- La capa de resultados declara su propia foto de oferta y no está vinculada a `DATOS_SIMULADOS`, por lo que un resultado no se puede trazar a la oferta que supuestamente utilizó.
- El resultado simulado no reacciona a las restricciones declaradas en el panel: la explicación de `infactible` nombra días que el estudiante puede no haber bloqueado. Es un requerimiento candidato.
- Las acciones de recuperación vuelven a la selección o vuelven a mostrar el mismo desenlace, sin cambiar la corrida: la maqueta no puede reoptimizar. La explicación de cada desenlace se declara en la capa de resultados y no deriva del borrador ni de los días restringidos que el estudiante haya alternado. Es un requerimiento candidato que el resultado real pueda sostener esa trazabilidad.
- La verificación independiente encontró dos defectos: `horas` no estaba definido en `alternativeMetrics()` y `!offersFor(...)` evaluaba un arreglo siempre verdadero. La comprobación del escritor no los detectó porque rederivaba métricas desde el archivo de datos y no ejercitaba la ruta de renderizado.
