# Mockup del período 2B

Escenario del grafo editable para el período 2B, con materias aprobadas, inscriptas y planificadas. Reconstrucción del grafo de la carrera con componentes HTML y conexiones SVG. El archivo original se utilizó únicamente como referencia visual: la página ya no lo incrusta como imagen.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/periodo-2B/`.

## Escenario simulado

Materias que pasan a `Aprobada`:

- C19 · Algoritmos y estructura de Datos II;
- C20 · Taller de algoritmos y estructura de Datos II;
- C27 · Herramientas matemáticas V – Estadística II.

Materias que aparecen como `Inscripta`:

- C23 · Ética y Deontología Profesional;
- C25 · Análisis y diseño de Software;
- C26 · Taller de Análisis de diseño de Software.

Materias que aparecen como `Planificada`:

- C24 · Sistemas operativos;
- C31 · Ingeniería de Software;
- C32 · Base de datos I.

C29 y C45 figuran como `Sin cátedra`; C42 permanece `Disponible`. El escenario 2A permanece en `periodo-2A/`.

## Alcance

El mockup contiene solamente:

- una barra compacta para alternar entre el bimestre actual `2B` de 2026 y el siguiente `1A` de 2027;
- 10 columnas de cuatrimestres que representan la estructura de la carrera;
- 46 tarjetas de materias;
- 26 conexiones de correlatividad;
- estados visuales aplicados directamente a cada tarjeta;

Se retiraron el encabezado descriptivo, las estadísticas y la leyenda inferior. La barra superior solo aporta el contexto y la navegación temporal solicitados; no incorpora funcionalidades de planificación.

No contiene paneles de planificación, preferencias, restricciones ni resultados de CP-SAT.

## Edición

Los datos de las materias se encuentran en el arreglo `courses` de `app.js`. Cada entrada define:

- código;
- cuatrimestre;
- posición vertical;
- nombre;
- estado;
- régimen.

Las correlatividades se encuentran en el arreglo `edges`. Cada conexión define origen, destino y estilo directo o ruteado.

## Advertencia

Los nombres y estados fueron transcritos visualmente del SVG. Las conexiones fueron reconstruidas para el mockup y deben contrastarse con la fuente académica antes de utilizarlas como reglas de dominio definitivas.
