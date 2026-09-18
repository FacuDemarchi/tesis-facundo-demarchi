#!/usr/bin/env bash
# Renderiza las figuras de la tesis: Mermaid -> PNG.
#
# El --no-sandbox es obligatorio en esta distro: AppArmor restringe los
# user namespaces sin privilegios y Chromium aborta sin él.
#
# Cada figura se renderiza a un archivo temporal oculto y recién después
# reemplaza al PNG definitivo. Así un render fallido no destruye la figura
# anterior ni deja un archivo viejo haciéndose pasar por nuevo.
#
# La verificación de tamaño corre al final y es informativa: el estado de salida
# de este script refleja el render, nunca el tamaño de las figuras.
set -euo pipefail
cd "$(dirname "$0")"

for src in figura-*.mmd; do
  png="${src%.mmd}.png"
  temporal=".${src%.mmd}.tmp.png"

  rm -f "$temporal"
  mmdc -i "$src" -o "$temporal" -w 1600 -b white \
       -p puppeteer-config.json -c mermaid-config.json --scale 2

  if [ ! -s "$temporal" ]; then
    echo "ERROR: $src no generó $temporal" >&2
    exit 1
  fi

  mv "$temporal" "$png"
  echo "renderizado: $png"
done

# La verificación es informativa: una figura por debajo del mínimo se avisa sin
# convertir una regeneración correcta en un fallo. Solo un verificador que no pudo
# completarse deja el script en error, porque eso sí indica un problema real.
if command -v python3 >/dev/null 2>&1; then
  estado=0
  python3 verificar-tamanos.py || estado=$?
  case "$estado" in
    0) ;;
    1) echo "aviso: hay figuras por debajo del mínimo; el render terminó bien" >&2 ;;
    *) echo "error: la verificación de tamaño no pudo completarse" >&2; exit 1 ;;
  esac
else
  echo "aviso: sin python3 no se verifica el tamaño de las figuras" >&2
fi
