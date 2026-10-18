#!/usr/bin/env bash
# Piezas del UI kit de Dovla en movimiento (2026-10-18, Alberto: «si los componentes los animamos un poco quedará
# mucho mejor»). Recortes de las grabaciones reales del simulador (scripts/case-media/clips/dovla/, @3x) en el mismo
# marco que sus PNG de dovla-kit.py, a @2x y en bucle. Salen a public/maqueta/dovla/media/kit/ (fuera de git).
#   promo   home.mp4 16–26 s: el carrusel pasa por las tres promos y vuelve a la primera
#   months  tx.mp4 11,5–18,5 s: el selector sigue al scroll (octubre → agosto → octubre)
#   tabbar  tabs.mp4 entero: la píldora va de Inicio a Pagos, Perfil y vuelve
set -euo pipefail
cd "$(dirname "$0")/../.."
FF="$(npm root -g)/ffmpeg-static/ffmpeg"
C=scripts/case-media/clips/dovla
O=public/maqueta/dovla/media/kit
cut() { # nombre clip inicio duración x y ancho alto (en pt)
  "$FF" -v error -y -ss "$3" -t "$4" -i "$C/$2.mp4" \
    -vf "crop=$(($7 * 3)):$(($8 * 3)):$(($5 * 3)):$(($6 * 3)),scale=$(($7 * 2)):$(($8 * 2)):flags=lanczos,fps=30" \
    -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -an -movflags +faststart "$O/$1.mp4"
  echo "$O/$1.mp4"
}
cut promo home 16 10 16 626 370 128
cut months tx 11.5 7 12 124 390 44
cut tabbar tabs 0 6.25 18 791 366 60
