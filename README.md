# Tesis — Planificador académico para Ingeniería en Software

Prototipo preliminar de un asistente de planificación académica para estudiantes de Ingeniería en Software. El sistema permitiría consultar el plan de estudios, seleccionar materias para un período objetivo y obtener alternativas de cursado factibles, junto con la explicación de los conflictos detectados.

> **Estado:** proyecto en fase de propuesta. Ningún cambio fue aplicado todavía al documento de tesis. Los mockups son wireframes estáticos y no constituyen un incremento funcional del prototipo descripto en el capítulo 6.

## Índice de escenarios

Los tres escenarios son reconstrucciones del mapa de correlatividades de la carrera. Comparten estructura y estilos; difieren en el estado académico simulado de las materias.

| Escenario | Ruta | Período representado | Qué muestra |
| --- | --- | --- | --- |
| Previo a 2A | [`mockup/`](mockup/) | `1B · 2026` actual, `2A · 2026` siguiente | Sin materias inscriptas. C19, C20 y C27 planificadas para 2A. |
| 2A | [`periodo-2A/`](periodo-2A/) | `2A · 2026` actual, `2B · 2026` siguiente | C19, C20 y C27 inscriptas. C23, C25 y C26 planificadas. |
| 2B | [`periodo-2B/`](periodo-2B/) | `2B · 2026` actual, `1A · 2027` siguiente | C19, C20 y C27 aprobadas. C23, C25 y C26 inscriptas. C24, C31 y C32 planificadas. |

Cada escenario incluye su propio `README.md` con el detalle de estados y el documento de trabajo [`discoveries.md`](mockup/discoveries.md) (idéntico en los tres), que registra decisiones de diseño, estados requeridos y preguntas abiertas para la elicitación institucional.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Luego abrir `http://localhost:8080/mockup/` o el escenario correspondiente. No hay dependencias ni paso de compilación: son páginas HTML que cargan `app.js` y la hoja compartida de `comun/`.

## Estructura

```text
.
├── README.md                          # este archivo
├── decisiones.md                      # registro autoritativo de decisiones de diseño
├── propuesta-capitulos-6-y-7.md       # propuesta de avance, pendiente de aprobación
├── Mapa horizontal · ... .svg         # mapa original de la carrera (referencia visual)
├── comun/                             # hoja compartida del plano, tokens y datos simulados
├── mockup/                            # escenario previo a las inscripciones de 2A
├── periodo-2A/                        # escenario 2A
├── periodo-2B/                        # escenario 2B
├── panel-seleccion/                   # el recorrido del estudiante: selección y resultados
└── institucional-demanda/             # la vista institucional de demanda agregada
```

Cada escenario contiene `index.html`, `app.js`, `README.md` y `discoveries.md`. La hoja de estilos es
compartida —`comun/tokens.css` para los tokens y `comun/escenario.css` para el plano—, igual que los datos
simulados y los módulos de `comun/`. Los datos de materias y correlatividades están escritos directamente en
el arreglo `courses` y `edges` de `app.js`.

## Alcance

El mockup representa únicamente la estructura del plan y el estado visual de las materias. Permite alternar entre dos períodos. Las tarjetas no son interactivas: no hay selección de materias ni resaltado de correlatividades.

No contiene paneles de planificación, preferencias, restricciones, resultados de CP-SAT, autenticación ni integración con sistemas universitarios. Tampoco habilita ninguna acción de inscripción.

## Advertencias

- **Datos reconstruidos.** Los 46 nombres y estados de materias y las 26 correlatividades fueron transcritos visualmente desde el SVG de referencia, cuyos rótulos están convertidos a trazados y no son legibles por máquina. Las conexiones fueron reconstruidas para el mockup. Deben contrastarse con la fuente académica antes de usarse como reglas de dominio.
- **Datos simulados.** Los estados académicos corresponden a escenarios ficticios de avance en la carrera.
- **Sin validación institucional.** Los procesos, permisos, integraciones y reglas que dependen de la universidad permanecen pendientes de la elicitación. La propuesta los clasifica como requerimientos candidatos.
- **Accesibilidad parcial.** Se aplican foco visible en la navegación de períodos, patrones visuales además del color y una alternativa textual por estado. La verificación con herramientas automatizadas (por ejemplo `axe-core`) todavía no fue ejecutada.

## Documentos de referencia

- [`decisiones.md`](decisiones.md) — registro autoritativo de decisiones de diseño: cuándo se ejecuta CP-SAT, qué declara marcar una materia, vocabulario de la fase de planificación y tope de materias por bimestre.
- [`propuesta-capitulos-6-y-7.md`](propuesta-capitulos-6-y-7.md) — propuesta de avance para los capítulos 6 y 7, con requerimientos preliminares, candidatos y casos de prueba. Pendiente de aprobación.
- [`discoveries.md`](mockup/discoveries.md) — hallazgos del mockup: decisiones representadas, estados de CP-SAT que la interfaz debe distinguir y preguntas abiertas para la elicitación.

## Próximos pasos

El orden es deliberado: la interfaz de planificación depende de las decisiones de diseño, y la unificación de los escenarios depende de que la interfaz exista.

1. Cerrar las decisiones pendientes de [`decisiones.md`](decisiones.md): clasificación del tope de materias y rol de la carga máxima personal.
2. Construir la superficie de planificación: intención por materia, advertencias locales inmediatas, restricciones, preferencias, acción explícita y resultados.
3. Converger los tres escenarios en una sola página con datos estructurados y un selector de período.
4. Corregir el pie de tarjeta del mockup, que hoy muestra `Disponible` sin importar el estado real de la materia.
5. Incorporar la matriz de trazabilidad entre requerimientos y casos de prueba, y archivar el relevamiento estudiantil.
6. Aplicar en el documento de tesis únicamente los cambios confirmados en la propuesta.
