#!/usr/bin/env bash
# Renderiza las figuras de la tesis: Mermaid -> PNG.
# El --no-sandbox es obligatorio en esta distro: AppArmor restringe los
# user namespaces sin privilegios y Chromium aborta sin él.
set -euo pipefail
cd "$(dirname "$0")"
for src in figura-*.mmd; do
  png="${src%.mmd}.png"
  mmdc -i "$src" -o "$png" -w 1600 -b white -p puppeteer-config.json -c mermaid-config.json --scale 2
  # Verifica el tamaño final: el texto aparente depende de la proporción del
  # diagrama, y por debajo de 8,5 pt la figura no se lee en el documento.
  python3 - "$png" <<'PY'
import struct, sys
ruta = sys.argv[1]
d = open(ruta, "rb").read(33)
ancho_px = struct.unpack(">I", d[16:20])[0]
alto_px = struct.unpack(">I", d[20:24])[0]
ancho = min(468, 648 * ancho_px / alto_px)   # área de texto: 468 x 648 pt
texto = 34 * ancho / ancho_px                # --scale 2 sobre una fuente de 17 px
aviso = "" if texto >= 8.5 else "   <-- POR DEBAJO DE 8,5 pt: revisar el diseño"
print(f"listo: {ruta}  {ancho_px}x{alto_px} px  ->  {ancho:.0f} x {ancho * alto_px / ancho_px:.0f} pt  |  texto {texto:.1f} pt{aviso}")
PY
done
