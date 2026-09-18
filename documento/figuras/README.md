# Figuras de la tesis

Fuentes de las figuras, en Mermaid. Cada `.mmd` se renderiza a PNG y el PNG se
inserta en el documento. Las fuentes viven en el repositorio para que una figura
se pueda regenerar y su cambio se vea en un diff, en lugar de ser un binario opaco.

## Renderizar

```bash
./render.sh          # recorre figura-*.mmd y genera figura-*.png
```

El comando de cada figura es:

```bash
mmdc -i figura-N-nombre.mmd -o figura-N-nombre.png \
     -w 1600 -b white -p puppeteer-config.json -c mermaid-config.json --scale 2
```

## Por qué hay dos archivos de configuración

- **`puppeteer-config.json`** — pasa `--no-sandbox`. Es **obligatorio** en este
  equipo: la distribución restringe los *user namespaces* sin privilegios por
  AppArmor y Chromium aborta con "No usable sandbox". Vale para renderizar estos
  `.mmd`, que son nuestros; **no** hay que usar este perfil para HTML de terceros.
- **`mermaid-config.json`** — paleta de la tesis, tipografía y, sobre todo,
  espaciado. El bloque `%%{init}%%` dentro del `.mmd` aplica las variables de tema
  pero **ignora las opciones de `flowchart`**; el espaciado solo funciona desde
  este archivo.

## Reglas de diseño que costó aprender

1. **El tamaño aparente del texto depende de la proporción del diagrama, no de su
   resolución.** A ancho de inserción fijo, un diagrama más ancho tiene texto más
   chico. La proporción del diagrama debe acercarse a la de la página: el área de
   texto es de 468 × 648 pt.
2. **Reducir el espaciado entre nodos es lo que más agranda el texto.** Sin
   `nodeSpacing` y `rankSpacing` bajos, un diagrama de once pasos no entra.
3. **Mermaid no reserva espacio para el rótulo de un subgrafo** y el título se
   superpone con el primer nodo. Por eso las figuras de casos de uso y de
   colaboración no usan subgrafos: los títulos de grupo son nodos con
   `classDef`, y el orden se fija con enlaces invisibles (`~~~`).
4. **Los subgrafos hermanos no se colocan en columnas**: se apilan igual, así que
   no sirven para partir una figura en dos columnas.
5. **El ancho de un diagrama de secuencia lo fija la cantidad de participantes**,
   no el texto de los mensajes. Con nueve líneas de vida el texto queda ilegible,
   por eso la colaboración se representa como flujo vertical de pasos.
6. **Verificar el tamaño antes de insertar**, con la relación de la imagen:

   ```
   ancho_inserción = min(468, 648 × ancho / alto)
   tamaño_de_texto = 34 × ancho_inserción / ancho     # --scale 2 sobre 17px
   ```

   El objetivo es que el texto no baje de 8,5 pt.

## Estado de las cinco figuras

| Archivo | Sección | Relación | Inserción | Texto |
| --- | --- | --- | --- | --- |
| `figura-1-arquitectura` | 6.1.3 | 0,74 | 468 × 636 pt | 16,7 pt |
| `figura-2-casos-de-uso` | 7.2.1 | 0,58 | 373 × 648 pt | 8,6 pt |
| `figura-3-entidades-academicas` | 7.2.2 | 1,72 | 468 × 272 pt | 8,3 pt |
| `figura-4-entidades-planificacion` | 7.2.2 | 1,59 | 468 × 294 pt | 9,4 pt |
| `figura-5-colaboracion` | 7.2.4 | 0,22 | 140 × 648 pt | 10,1 pt |

Las figuras 2 y 3 quedan en el límite inferior. La 2 conserva además una
indentación despareja de algunos casos, heredada de los enlaces invisibles que
fijan el orden; es cosmética y no afecta la lectura.

## Estado en el documento

Las cinco figuras están insertadas y numeradas de forma correlativa por orden de
aparición. Se reemplazaron las imágenes anteriores: las cuatro que había llevaban
los números 4 a 7 sin que existieran las figuras 1 a 3.

| Figura en la tesis | Archivo | Sección | Inserción |
| --- | --- | --- | --- |
| Figura 1 | `figura-1-arquitectura` | 6.1.3 | 468 × 636 pt |
| Figura 2 | `figura-2-casos-de-uso` | 7.2.1 | 373 × 648 pt |
| Figura 3 | `figura-3-entidades-academicas` | 7.2.2 | 468 × 272 pt |
| Figura 4 | `figura-4-entidades-planificacion` | 7.2.2 | 468 × 294 pt |
| Figura 5 | `figura-5-colaboracion` | 7.2.4 | 140 × 646 pt |

El mapa del Anexo D no lleva epígrafe, así que no consume número y queda fuera de
la serie.

## Cómo se reemplaza una imagen en el documento

La secuencia que funcionó, por si hay que repetirla:

1. `gdocs-api drive-upload` y `gdocs-api drive-share` de la imagen nueva. La
   publicación es obligatoria: `insertInlineImage` busca la imagen de forma anónima.
2. Localizar el párrafo de la imagen vieja, que es el inmediatamente anterior a su
   epígrafe, y borrarlo con `deleteContentRange`.
3. `gdocs-api insert-image <doc> <fileId> --at <ese índice> --width-pt <N> --center`.
4. `gdocs-api replace-text` para renumerar el epígrafe.
5. `gdocs-api drive-unshare` de la imagen, porque Docs ya copió una copia propia.

Dos cosas que hay que cuidar: insertar la imagen en el índice de un párrafo que ya
contiene texto deja **imagen y epígrafe en el mismo párrafo**; el epígrafe debe
quedar en su propio párrafo, y con alineación a la izquierda como los de tabla.
