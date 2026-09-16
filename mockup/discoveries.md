# Hallazgos iniciales del mockup de planificación

> Documento de trabajo. Estos hallazgos no fueron incorporados a la tesis y no representan decisiones de la universidad.

## Decisiones representadas

1. El producto realiza **planificación académica**, no inscripción oficial.
2. La planificación apunta al período posterior al actual; no necesita una pantalla duplicada para “el período siguiente”.
3. Un único CTA inicia un espacio de planificación persistente.
4. El estudiante elige materias iterativamente, pero CP-SAT procesa la solicitud completa como una unidad.
5. Elegir una materia no la vuelve automáticamente obligatoria. Se distinguen tres intenciones:
   - deseada;
   - requerida en esta planificación;
   - no considerar.
6. Se separan tres tipos de información:
   - condiciones académicas del escenario, de solo lectura;
   - restricciones personales no negociables;
   - preferencias flexibles usadas para ordenar alternativas válidas.
7. El resultado debe conservar el contexto que lo produjo: período, versión del plan, origen y fecha de los datos, materias, restricciones y preferencias.
8. El color del mapa siempre se acompaña con texto, icono o patrón.

## Flujo principal propuesto

1. Consultar el mapa completo y el estado de cada materia.
2. Iniciar una planificación para el período objetivo.
3. Agregar o quitar materias desde el mapa o su alternativa semántica.
4. Marcar cada materia como deseada o requerida.
5. Revisar las condiciones académicas simuladas.
6. Configurar restricciones personales.
7. Configurar preferencias.
8. Generar todas las alternativas mediante una única ejecución lógica de CP-SAT.
9. Comparar hasta tres alternativas.
10. Consultar explicaciones y materias omitidas.
11. Volver a editar sin perder el borrador.

## Casos secundarios detectados

- Buscar y filtrar materias por nombre, período o estado.
- Consultar el detalle y las correlatividades de una materia.
- Expresar interés por una materia bloqueada y recibir una explicación temprana.
- Cambiar una materia de requerida a deseada para flexibilizar el problema.
- Comparar escenarios con distintas prioridades.
- Priorizar cantidad de materias, días libres, agenda compacta o reducción de tiempos muertos.
- Bloquear días o franjas horarias.
- Definir una carga máxima personal.
- Revisar el origen y la fecha del escenario utilizado.
- Reintentar una optimización interrumpida.
- Recuperar el borrador después de un error técnico.
- Guardar, exportar o compartir un escenario; función candidata pendiente de privacidad y persistencia.
- Utilizar una lista navegable con teclado como alternativa al grafo visual.

## Estados de CP-SAT que la interfaz debe distinguir

### Factible completa

Todas las materias requeridas y deseadas incluidas cumplen las restricciones duras. La interfaz explica qué preferencias favoreció y cuáles no pudo satisfacer completamente.

### Factible parcial

Todas las materias requeridas permanecen incluidas, pero una o más materias deseadas quedan afuera. Deben mostrarse las materias omitidas y sus motivos. Una alternativa que omite una materia requerida no puede llamarse parcial válida.

### Límite de tiempo con alternativa válida

Existe una solución incumbente que cumple las restricciones, pero no se comprobó que sea óptima. La interfaz no debe presentarla como “la mejor”.

### Límite de tiempo sin alternativa

No se encontró una solución dentro del tiempo disponible. Esto no demuestra infactibilidad. Este estado todavía no está simulado de forma independiente en el primer wireframe.

### Infactible

Las restricciones activas se contradicen. La interfaz debe presentar conflictos concretos y acciones de flexibilización; no un mensaje genérico.

### Error técnico

La operación no pudo completarse por una falla del sistema. Debe conservar el borrador, permitir reintentar y diferenciarse tanto de la infactibilidad como del límite temporal.

## Estados de interfaz necesarios

- mapa o escenario en carga;
- mapa disponible con datos completos;
- datos incompletos o desactualizados;
- ninguna materia seleccionada;
- búsqueda sin resultados;
- planificación en proceso;
- resultados disponibles;
- error recuperable;
- borrador conservado;
- integración institucional no disponible;
- funcionamiento adaptable a pantallas pequeñas;
- navegación mediante teclado y anuncios por `aria-live`.

## Preguntas abiertas para la elicitación

### Período y oferta

- ¿Cómo se determina el período objetivo y cuándo queda habilitado para planificar?
- ¿La universidad publica una oferta preliminar antes del período de inscripción?
- ¿Qué ocurre si todavía no existen horarios o comisiones confirmadas?
- ¿Debe permitirse trabajar con más de un escenario de oferta?

### Situación académica

- ¿Cuál es la fuente oficial de materias aprobadas, regularizadas y en curso?
- ¿Cómo se representan equivalencias, excepciones y correlatividades condicionales?
- ¿Una materia actualmente en curso puede utilizarse como prerrequisito supuesto para el período siguiente?
- ¿Cómo reporta el estudiante un estado académico incorrecto?

### Selección de materias y comisiones

- ¿El estudiante elige primero materias y CP-SAT selecciona las comisiones?
- ¿Puede exigir una comisión específica o solo expresar una preferencia?
- ¿Debe admitir materias alternativas del tipo “A o B”?
- ¿Cómo se representan materias anuales, intensivas o con múltiples actividades obligatorias?

### Restricciones personales

- ¿Qué granularidad horaria se necesita?
- ¿Deben contemplarse tiempos de traslado entre sedes o modalidades?
- ¿Hay una carga mínima o máxima institucional además de la personal?
- ¿Se permiten restricciones distintas según el día?

### Preferencias

- ¿El estudiante ordena preferencias o asigna importancia alta, media y baja?
- ¿Qué preferencias deben estar disponibles sin volver incomprensible la optimización?
- ¿La explicación debe mostrar una puntuación o solamente las decisiones y trade-offs?

### Persistencia y privacidad

- ¿Se guardarán borradores y resultados?
- ¿Durante cuánto tiempo y asociados a qué identidad?
- ¿Puede el estudiante exportar o compartir una planificación?
- ¿Qué datos personales son estrictamente necesarios?

### Integración institucional futura

- ¿Qué sistemas contienen plan, historial, oferta, horarios y cupos?
- ¿Existen APIs o mecanismos de exportación autorizados?
- ¿Con qué frecuencia se actualizan los datos?
- ¿Quién responde por inconsistencias entre la planificación y el sistema oficial?

## Requerimientos candidatos derivados

- **RC-UX-01:** permitir iniciar una planificación para el período posterior al actual.
- **RC-UX-02:** conservar el borrador mientras el estudiante explora, edita o revisa resultados.
- **RC-UX-03:** permitir intención deseada, requerida o descartada por materia.
- **RC-UX-04:** separar restricciones duras de preferencias flexibles.
- **RC-UX-05:** registrar el escenario exacto utilizado por CP-SAT.
- **RC-UX-06:** explicar materias omitidas y preferencias no satisfechas.
- **RC-UX-07:** distinguir resultado completo, parcial, timeout, infactibilidad y error técnico.
- **RC-UX-08:** ofrecer una alternativa semántica y navegable al mapa visual.
- **RC-UX-09:** no ofrecer acciones que puedan confundirse con una inscripción oficial.
- **RC-UX-10:** etiquetar claramente los datos simulados y las integraciones pendientes.

## Limitación del primer wireframe

El SVG contiene el mapa completo, pero sus rótulos están convertidos a trazados. Por eso no permite asociar automáticamente cada tarjeta con datos semánticos o controles accesibles. La lista lateral utiliza ocho materias demostrativas. La implementación real debería reconstruir el mapa desde datos estructurados y mantener sincronizados el grafo, la lista y el detalle de cada materia.
