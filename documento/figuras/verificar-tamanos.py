#!/usr/bin/env python3
"""Verifica el tamaño de inserción y el texto aparente de las figuras.

El tamaño aparente del texto no depende de la resolución de la imagen sino de la
proporción del diagrama: a igual ancho de inserción, un diagrama más ancho tiene
texto más chico. Las figuras se insertan en un área de texto de 468 x 648 pt y se
renderizan con `--scale 2` sobre una fuente de 17 px, de modo que el tamaño
aparente se calcula como:

    ancho_insercion = min(468, 648 x ancho / alto)
    texto_pt        = 17 x 2 x ancho_insercion / ancho

Uso:
    verificar-tamanos.py [minimo_pt]      # por defecto 8,5 pt

Códigos de salida: 0 si todas las figuras alcanzan el mínimo, 1 si alguna queda
por debajo y 2 si alguna no se pudo leer. El 2 es un fallo real; el 1 es un aviso,
y quien invoque el verificador decide si lo trata como error.
"""
import struct
import sys
from pathlib import Path

ANCHO_TEXTO_PT = 468.0
ALTO_TEXTO_PT = 648.0
FUENTE_PX = 17
ESCALA = 2
MINIMO_PT = 8.5

# El encabezado PNG guarda el ancho y el alto en los bytes 16 a 24, en big endian.
OFFSET_ANCHO = slice(16, 20)
OFFSET_ALTO = slice(20, 24)
LARGO_ENCABEZADO = 24


def dimensiones(ruta):
    """Devuelve (ancho, alto) en píxeles leyendo solo el encabezado del PNG."""
    datos = ruta.read_bytes()[:LARGO_ENCABEZADO]
    if len(datos) < LARGO_ENCABEZADO:
        raise ValueError("archivo truncado: %d bytes de encabezado" % len(datos))
    if datos[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("no parece un PNG")
    return (
        struct.unpack(">I", datos[OFFSET_ANCHO])[0],
        struct.unpack(">I", datos[OFFSET_ALTO])[0],
    )


def evaluar(ruta, minimo):
    """Imprime el tamaño de una figura.

    Devuelve "ok", "ilegible" o "bajo" según el resultado, para que el resumen
    final no confunda un archivo que no se pudo leer con uno que se leyó bien y
    no alcanza el mínimo.
    """
    try:
        ancho_px, alto_px = dimensiones(ruta)
    except (OSError, ValueError) as error:
        print("ERROR: %s: no se pudo leer el tamaño (%s)" % (ruta, error))
        return "ilegible"
    if not ancho_px or not alto_px:
        print("ERROR: %s: dimensiones inválidas %dx%d" % (ruta, ancho_px, alto_px))
        return "ilegible"

    ancho = min(ANCHO_TEXTO_PT, ALTO_TEXTO_PT * ancho_px / alto_px)
    alto = ancho * alto_px / ancho_px
    texto = FUENTE_PX * ESCALA * ancho / ancho_px
    alcanza = texto >= minimo
    aviso = "" if alcanza else "   <-- por debajo de %.1f pt: revisar el diseño" % minimo
    print(
        "%s: %dx%d px -> %.0f x %.0f pt | texto %.1f pt%s"
        % (ruta, ancho_px, alto_px, ancho, alto, texto, aviso)
    )
    return "ok" if alcanza else "bajo"


def main(argumentos):
    minimo = float(argumentos[0]) if argumentos else MINIMO_PT
    figuras = sorted(Path(".").glob("figura-*.png"))
    if not figuras:
        print("ERROR: no hay figura-*.png en el directorio actual")
        return 1

    resultados = [(ruta, evaluar(ruta, minimo)) for ruta in figuras]
    ilegibles = [ruta for ruta, estado in resultados if estado == "ilegible"]
    bajas = [ruta for ruta, estado in resultados if estado == "bajo"]

    if ilegibles:
        print("\n%d de %d figuras no se pudieron leer: %s" % (len(ilegibles), len(figuras), ", ".join(str(r) for r in ilegibles)))
    if bajas:
        print("\n%d de %d figuras no alcanzan el mínimo de %.1f pt: %s" % (len(bajas), len(figuras), minimo, ", ".join(str(r) for r in bajas)))
    if not ilegibles and not bajas:
        print("\n%d figuras alcanzan el mínimo de %.1f pt" % (len(figuras), minimo))
    if ilegibles:
        return 2
    return 1 if bajas else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
