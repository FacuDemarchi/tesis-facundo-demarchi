#!/usr/bin/env bash
# Renderiza las figuras de la tesis: Mermaid -> PNG.
# El --no-sandbox es obligatorio en esta distro: AppArmor restringe los
# user namespaces sin privilegios y Chromium aborta sin él.
set -euo pipefail
cd "$(dirname "$0")"
for src in figura-*.mmd; do
  png="${src%.mmd}.png"
  mmdc -i "$src" -o "$png" -w 1600 -b white -p puppeteer-config.json -c mermaid-config.json --scale 2
  echo "listo: $png"
done
