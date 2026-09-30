# Mockup previo a las inscripciones de 2A

Escenario del grafo editable anterior a las inscripciones del período 2A. Reconstrucción del grafo de la carrera con componentes HTML y conexiones SVG. El archivo original se utilizó únicamente como referencia visual: la página ya no lo incrusta como imagen.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/mockup/`.

## Escenario previo a 2A

No hay materias inscriptas. Las materias planificadas para 2A son:

- C19 · Algoritmos y estructura de Datos II;
- C20 · Taller de algoritmos y estructura de Datos II;
- C27 · Herramientas matemáticas V – Estadística II.

C23 figura como `Disponible`; C25 y C26 permanecen `Bloqueadas`.

## Alcance

El mockup contiene solamente:

- una barra compacta para alternar entre el período actual `1B` y el siguiente `2A` de 2026;
- 10 columnas de cuatrimestres que representan la estructura de la carrera;
- 46 tarjetas de materias;
- 26 conexiones de correlatividad;
- estados visuales aplicados directamente a cada tarjeta;

Se retiraron el encabezado descriptivo, las estadísticas y la leyenda inferior. La barra superior solo aporta el contexto y la navegación temporal solicitados; no incorpora funcionalidades de planificación.

A diferencia de `panel-seleccion/`, este mockup no contiene panel de selección, preferencias, restricciones ni resultados del motor: su alcance es el grafo y la navegación temporal.

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
