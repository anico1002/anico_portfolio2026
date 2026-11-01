#!/bin/bash
# Vídeo de la cabecera y del thumb de DesignOps Copilot (2026-11-01): el recorrido grabado (web-rec.mjs + hero.json,
# recortado con fundidos rápidos entre partes) montado en la pantalla del iPad de la foto en las manos (photo.html,
# homografía de las cuatro esquinas). Uso: bash hero.sh <hero-src.mp4>. Salen hero-{band,thumb,portrait}.mp4 en media/.
set -euo pipefail
cd "$(dirname "$0")/../../.."
SRC="$1"; M=public/maqueta/designops/media; T="$(mktemp -d /tmp/dop-hero.XXXX)"
PHOTO="file://$PWD/$M/hands-photo.png"
Q="photo=$PHOTO&pw=2000&ph=1500&q=497.5,493,1319,322,1487,937.5,683,1130.5&sw=1376&sh=1032&r=28&bg=c8c8c8"
R(){ node scripts/mockups/css_scene.mjs scripts/mockups/css-scene/photo.html "$SRC" "$T/$1.mp4" "$2" "$3" "$Q&$4" 1 | tail -1
     bash scripts/mockups/loop_fade.sh "$T/$1.mp4" "$M/hero-$1.mp4" 0.7 22; }
R band     1600 1000 "vs=0.8&vx=1000&vy=760"
R thumb    1280 800  "vs=0.64&vx=1000&vy=760"
R portrait 780  1688 "vs=0.85&vx=1000&vy=780"
