# Resultados y preferencias del panel

**Objetivo.** Extender `panel-seleccion/` con las dos piezas que faltan de la etapa de selección —las preferencias del alumno y las limitaciones por día— y con la etapa de resultados, que hoy es solo un marcador.

**Por qué extender y no crear otro mockup.** El usuario pidió explícitamente **no multiplicar interfaces**: todo vive en la misma página, y los resultados se muestran en un **segundo modal sobre el grafo**, no en una vista propia.

## Decisiones que enmarcan

- **D-02**: las preferencias se declaran en cinco dimensiones —cátedra, profesor, modalidad, franjas y cantidad de días— y cada una es **restricción configurable** o **criterio de optimización**.
- **Limitación por día** (decidida el 2026-09-18): es una **regla dura**. Si no hay forma de armar la cursada sin usar un día bloqueado, el resultado es **infactible** y la explicación señala el día como causa. El alumno puede bajar el nivel a criterio si quiere ver alternativas que lo usen.
- **D-11**: la guarda de foco se mantiene. El **modal de resultados sí puede tapar materias**, porque en esa etapa el grafo no es lo importante; el usuario lo autorizó explícitamente.
- **D-13**: el indicador de granularidad va en el resultado, no en el borrador.
- **D-18**: el cierre ofrece descargar un PDF, con leyenda visible y como requerimiento candidato.

Los seis desenlaces de CP-SAT que la interfaz debe distinguir, y la funcionalidad que falta, están en `panel-seleccion/discoveries.md`.

## Alcance

- El panel gana **dos bloques**: disponibilidad y preferencias de cursado.
- El panel **pierde** su título y su línea de ayuda, para hacer lugar.
- Un **segundo modal** sobre el grafo, abierto por el botón de cierre, con los resultados.

## Tareas

- [x] **T6 — Restricción y preferencia de profesor en el panel.** Bloque **RESTRICCIÓN** visible, con los seis días como alternadores y una línea que declara que es una restricción dura y qué pasa cuando no hay salida. Las comprobaciones locales advierten una materia marcada cuyas cátedras caen solo en días bloqueados. Cada materia marcada contiene una preferencia blanda de profesor, expandible y limitada a los docentes de sus cátedras publicadas del período; no tiene selector de nivel. Se eliminaron las dimensiones de cátedra, modalidad, franjas y cantidad de días, junto con su estado. Validación: TDD desactivado; comprobación Puppeteer y `node --check panel-seleccion/app.js`.

  **Evidencia**: `ecc4c0a` (el nombre de la materia pasa a ser la cabeza del desplegable de profesores) y `ecd1270` (la documentación del panel se alinea con la interfaz simplificada). El segundo corrige la deriva que `f2a649b` introdujo: la sección T6 de `discoveries.md` describía las cuatro dimensiones de preferencia que ese mismo commit había eliminado, y se contradecía con su propia subsección de reducción de alcance. Verificado con 14 aserciones sobre el mockup servido: el `aria-label` que reemplaza al título, los seis días, la ausencia de cualquier `select` u opción de nivel, la ausencia del encabezado y la línea de ayuda retirados, C23 listando D04, C24 cayendo en el estado vacío sin lista fabricada, y el aviso de día bloqueado nombrando C23 y martes.
- [ ] **T7 — Modal de resultados.** Segundo modal sobre el grafo, abierto por el botón que cierra la selección, con hasta tres alternativas comparables, distribución semanal, los seis desenlaces de CP-SAT, indicador de granularidad y la descarga en PDF con leyenda visible. No simula que el solver exista: los resultados son datos simulados y deben declararlo.

## Criterio de cierre

Cada tarea cierra con al menos un commit de unidad de trabajo. El push y el PR quedan a decisión del usuario. El producto de cada tarea es lo que agrega a `discoveries.md`, no el código.

## Fuera de alcance

- Escribir 7.2.5 en el documento de tesis: **el usuario pidió explícitamente no proceder con eso** hasta que lo autorice, y prefiere completar el diseño de todas las interfaces primero.
- La rama institucional (CU-10, CU-11, CU-13, CU-14), que sigue sin diseñar.
- Preferencias como pantalla propia: van en el panel.
