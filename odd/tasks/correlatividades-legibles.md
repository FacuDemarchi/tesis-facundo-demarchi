# Correlatividades legibles — que el plano diga qué materia precede a cuál

Feature pedida por el autor el 2026-09-30: «quiero mejorar el grafo, reorganizar la posición de las
materias para que se pueda hacer más visible la conexión por correlatividad entre ellas, con conexiones más
presentes, que se note que una materia precede de otra».

Rama: `feat/correlatividades-legibles`, sobre `main` = `7d00eaf`. Afecta las cuatro superficies que dibujan
el plano: `panel-seleccion/` (la que el autor mira) y los tres escenarios `mockup/`, `periodo-2A/`,
`periodo-2B/`.

## El diagnóstico, medido antes de tocar

El plano ya estaba diseñado: las filas codifican las cadenas (la fila 6 son los seis idiomas, la 3 la cadena
de algoritmos e ingeniería, la 4 los talleres y la construcción) y 24 de las 26 aristas salen perfectamente
horizontales. El problema no era el orden de las materias, era que **la conexión casi no se veía**:

| Medición | Valor |
| --- | --- |
| Aristas que saltan una columna sin cambio de fila | 22 de 26 → tramos rectos de 77 px |
| Flecha renderizada | 18 unidades × grosor 3 × escala 0,82 = **14,7 px** (no era chica: estaba **cortada**) |
| Aristas que pasan por encima de otra tarjeta | **2**: `C36→C44` el 73 % de su trazo sobre `C40`, `C32→C41` el 31 % sobre `C36` |
| Capa de las aristas | `#connections` con `z-index:1` y `.columns` con `z-index:2` **y contexto de apilado propio** |

Ese último renglón es la causa raíz y no era visible en el código sin medirlo: como `.columns` abría un
contexto de apilado, las aristas se pintaban **detrás del fondo de las columnas**. O sea que una conexión
existía únicamente en el canal: en cuanto la arista entraba en una columna, desaparecía. Con 26 aristas y
canales de 77 px, el plano mostraba una escalera de guiones, no un grafo.

## Qué cambió

1. **Las aristas son una capa entre el fondo de la columna y las tarjetas.** `.columns` pierde su `z-index`
   (deja de abrir contexto de apilado), `.course` pasa a `z-index:2` y las cabeceras de columna también: el
   orden queda fondo de columna → aristas → tarjetas. Una arista ahora existe en **todo** su recorrido.
2. **El canal pasa de 49 a 70 px** (decisión del autor entre tres anchos ofrecidos): 98 px entre tarjetas en
   unidades del escenario, **80 px en pantalla** a la escala 0,82. El lienzo crece de 3520 a **3708 px**
   —3630 de escenario más 76 de relleno y 2 de borde— y el desplazamiento horizontal es el de por defecto.
3. **Corredores de fila libre.** Tres materias cambian de fila dentro de su cuatrimestre para que ninguna
   arista pase por encima de una tarjeta: `C36` (cuatrimestre 7, fila 4 → 6), `C44` (9, 4 → 6) y `C46`
   (10, 4 → 6). Con eso la cadena `C36→C44→C46` corre entera por la fila 6 y `C32→C41` cruza el cuatrimestre
   7 por filas que quedaron libres. **Aristas tapadas: 2 → 0.**
4. **La flecha deja de estar cortada.** La arista termina 5 px antes del borde de la tarjeta destino: la
   punta mide 18 px y su extremo quedaba debajo del borde. Ahora se dibuja entera en el canal y señala la
   tarjeta con una hairline de aire.
5. **El trazo continuo a opacidad plena** (el punteado queda en .85, para que los dos sigan distinguiéndose).

## Verificación

Medido con Chrome for Testing 153 por CDP, en 1600×900, 1440×900, 1024×768 y 390×844:

| | Antes | Después |
| --- | --- | --- |
| Aristas con parte de su trazo sobre una tarjeta | 2 (73 % y 31 %) | **0** |
| Distancia de la punta al borde de la tarjeta | 0 (cortada por el borde) | **6-7 px** |
| Canal entre tarjetas en pantalla | 63 px | **80 px** |
| Escenario / región | 3444 / 3520 px | **3630 / 3708 px** |
| Consola | — | sin excepciones en los cuatro anchos |

## Pendientes declarados, no resueltos acá

- **La hoja del plano vive en dos lugares.** `mockup/`, `periodo-2A/` y `periodo-2B/` cargan
  `comun/escenario.css`; `panel-seleccion/` carga una **copia propia** (`styles.css?v=21`) con las mismas
  reglas del plano. Mi primera edición fue a la compartida y no tuvo efecto en la pantalla que el autor
  mira: hay que tocar las dos, y ya divergen en formato. Candidato a unificar como se hizo con las tres
  hojas de escenario idénticas.
- **El escenario está duplicado en cuatro `app.js`**, y no en el mismo formato: `panel-seleccion` guarda las
  materias como arrays y los tres escenarios como objetos. Lo mismo con `drawConnections()`, idéntica en los
  tres escenarios y casi idéntica en `panel-seleccion`. Un cambio del plano son cuatro ediciones a mano.
- **La arista dentro de una misma columna** (`C09→C10`) sigue resolviéndose con un rodeo por el canal. Un
  conector vertical entre tarjetas apiladas sería más directo, pero la separación entre filas es de 24 px y
  la punta mide 18: no entra sin repensar la fila.

## Intercambio de C10 y C13 (pedido del autor, después de ver el plano)

Se intercambió la celda completa en las cuatro copias: **C10** (Programación orientada a objetos) pasó de
cuatrimestre 2, fila 4 a **cuatrimestre 3, fila 2**, y **C13** (Lógica Simbólica) de 3, 2 a **2, 4**.

**Esto no es un cambio de layout y por eso queda escrito**: la **columna es el cuatrimestre de la carrera**
(dato transcrito del plan) y la fila es layout, así que el intercambio **mueve una materia de cuatrimestre**
en la estructura. Se hizo como se pidió y se declaró la consecuencia: o es una corrección del plan —y vale
como dato corregido— o se revierte. **Si el manuscrito tiene el plano fotografiado (figuras 6 y 7), esas
capturas quedan desactualizadas.**

**Efecto colateral medido**: `C09→C10` era la **única arista dentro de una misma columna** (un rodeo por el
canal). Con C10 en el cuatrimestre 3 es una arista hacia adelante con su curva y su flecha. El plano quedó
con **0 aristas dentro de una columna** y 26 hacia adelante (23 de una columna, 3 de dos), **0 sobre
tarjetas**, sin excepciones de consola, en `panel-seleccion` a cuatro anchos y en los tres escenarios.
