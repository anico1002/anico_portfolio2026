#!/bin/bash
# Close-ups del caso de DesignOps Copilot (2026-11-01): trozos de las capturas a 3x (screens.mjs) en perspectiva, con
# profundidad de campo, sobre gris de estudio. Desenfoque suave y solo en una o dos esquinas (corners=…), el resto
# nítido: son capturas buenas y tienen que leerse (feedback 2026-11-01). OUT=<carpeta> para probar sin pisar media/.
# Sin recortes: siempre la pantalla entera (capturas a 4x: DPR=4 node screens.mjs), muy grande y con `at` en la zona
# que interesa, para que no se vean elementos cortados dentro del encuadre. El desenfoque es progresivo (plane.html). Escena: scripts/mockups/css-scene/plane.html. Salen a 2x en media/.
set -euo pipefail
cd "$(dirname "$0")/../../.."
SC=public/maqueta/designops/screens; M=${OUT:-public/maqueta/designops/media}
R(){ node scripts/mockups/css_scene.mjs scripts/mockups/css-scene/plane.html "$SC/$1" "$M/$2.png" "$3" "$4" "$5" 2 | tail -1; }
R health@4x.png cu-score   1600 1200 "at=0.40,0.27&pw=3400&rx=32&ry=-26&rz=9&blur=7&corners=tr&cs=60&r=40&edge=1&vig=0.08"
R health@4x.png cu-kpi     1600 1200 "at=0.63,0.59&pw=3000&rx=38&ry=-18&rz=-8&blur=7&corners=tl,tr&cs=45&r=40&edge=1&bg=d9d8e0&vig=0.08"
R health@4x.png cu-panel   1600 1200 "at=0.165,0.50&pw=3200&rx=16&ry=-30&rz=4&blur=7&corners=tr&cs=60&r=40&edge=1&bg=c9c7d4&vig=0.1"
R health@4x.png cu-copilot 1600 1200 "at=0.83,0.29&pw=3200&rx=24&ry=22&rz=-6&blur=7&corners=tl&cs=60&r=40&edge=1&bg=dddce3&vig=0.08"
R ask@4x.png    cu-ask     1600 1200 "at=0.62,0.80&pw=2800&rx=36&ry=-14&rz=5&blur=7&corners=tl,tr&cs=45&r=40&edge=1&bg=d4d2de&vig=0.08"
R drift@4x.png  cu-drift   1600 1200 "at=0.39,0.56&pw=3000&rx=28&ry=24&rz=-5&blur=7&corners=tl&cs=55&r=40&edge=1&bg=dcdbe2&vig=0.08"
R exception@4x.png cu-exception 1600 1200 "at=0.60,0.50&pw=2300&rx=30&ry=20&rz=-6&blur=7&corners=tl&cs=55&r=40&edge=1&bg=d6d4e0&vig=0.08"
