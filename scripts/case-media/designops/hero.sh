#!/bin/bash
# Vídeo de la cabecera y del thumb de DesignOps Copilot. Desde el 2026-11-02, en la foto del iPad Pro con Magic Keyboard
# (mockup gratuito que trajo Alberto, «001 Free iPad Pro With Magic Keyboard Mockup.jpg»), con el fondo prolongado
# para los tres formatos (ipad-keyboard-scene.jpg: degradado del estudio y canto de la mesa en diagonal) y la grabación
# plana del recorrido (ipad-tour.sh) en la pantalla, con la homografía de sus cuatro esquinas medidas en la foto.
# Antes (2026-11-01): foto de unas manos, con los dedos encima de la pantalla — no quedaba limpio.
# Uso: bash hero.sh <grabación 4:3 a 1376×1032>. Salen hero-{band,thumb,portrait}.mp4 en media/ (o en OUT=…).
set -euo pipefail
cd "$(dirname "$0")/../../.."
SRC="$1"; M=public/maqueta/designops/media; OUT="${OUT:-$M}"; T="$(mktemp -d /tmp/dop-hero.XXXX)"
PHOTO="file://$PWD/$M/ipad-keyboard-scene.jpg"
Q="photo=$PHOTO&pw=7500&ph=6100&q=3403.9,950.3,4804.4,1399.4,4356.2,2714.2,2982.9,2194.9&sw=1376&sh=1032&r=36&bg=d9d9d9"
R(){ node scripts/mockups/css_scene.mjs scripts/mockups/css-scene/photo.html "$SRC" "$T/$1.mp4" "$2" "$3" "$Q&$4" 1 | tail -1
     bash scripts/mockups/loop_fade.sh "$T/$1.mp4" "$OUT/hero-$1.mp4" 0.7 22; }
# La cabecera deja ver el 56 % de arriba (CaseHero): la pantalla entera cabe ahí en escritorio y en móvil.
R band     1600 1000 "vs=0.26&vx=3650&vy=2650"
R thumb    1280 800  "vs=0.27&vx=3515&vy=2130"
R portrait 780  1688 "vs=0.27&vx=3580&vy=3480"
