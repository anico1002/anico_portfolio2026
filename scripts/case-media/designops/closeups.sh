#!/bin/bash
# Close-ups del caso de DesignOps Copilot (2026-11-01): trozos de las capturas a 3x (screens.mjs) en perspectiva, con
# profundidad de campo, sobre gris de estudio. Desenfoque suave y solo en una o dos esquinas (corners=…), el resto
# nítido: son capturas buenas y tienen que leerse (feedback 2026-11-01). OUT=<carpeta> para probar sin pisar media/. Escena: scripts/mockups/css-scene/plane.html. Salen a 2x en media/.
set -euo pipefail
cd "$(dirname "$0")/../../.."
SC=public/maqueta/designops/screens; M=${OUT:-public/maqueta/designops/media}
R(){ node scripts/mockups/css_scene.mjs scripts/mockups/css-scene/plane.html "$SC/$1" "$M/$2.png" "$3" "$4" "$5" 2 | tail -1; }
R health@3x.png cu-score   1600 1200 "crop=0.28,0.08,0.44,0.42&pw=2100&rx=32&ry=-26&rz=9&x=6&y=4&blur=6&corners=tr&cs=60&r=40&edge=1&vig=0.08"
R health@3x.png cu-kpi     1600 900  "crop=0.27,0.45,0.72,0.29&pw=2300&rx=38&ry=-18&rz=-8&x=4&y=6&blur=6&corners=tl,tr&cs=45&r=36&edge=1&bg=d9d8e0&vig=0.08"
R health@3x.png cu-panel   1000 1250 "crop=0.0,0.0,0.5,1&pw=1250&rx=16&ry=-30&rz=4&x=10&y=2&blur=6&corners=tr&cs=60&r=40&edge=1&bg=c9c7d4&vig=0.1"
R health@3x.png cu-copilot 1000 1250 "crop=0.64,0.06,0.36,0.46&pw=1350&rx=24&ry=22&rz=-6&x=-2&y=0&blur=6&corners=tl&cs=60&r=40&edge=1&bg=dddce3&vig=0.08"
R ask@3x.png    cu-ask     1600 900  "crop=0.22,0.42,0.78,0.58&pw=2900&rx=36&ry=-14&rz=5&x=0&y=4&blur=6&corners=tl,tr&cs=45&r=36&bg=d4d2de&vig=0.08"
R drift@3x.png  cu-drift   1600 900  "crop=0.12,0.27,0.54,0.46&pw=1650&rx=28&ry=24&rz=-5&x=-2&y=2&blur=6&corners=tl&cs=55&r=36&edge=1&bg=dcdbe2&vig=0.08"
