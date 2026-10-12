#!/bin/bash
# Vídeo-resumen de Gloop: navegación real con AXe, grabada sin cursor.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}
OUT=${1:-$S/clips/overview-raw.mp4}
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.8}; }
sw(){ $AXE swipe --start-x 201 --start-y $1 --end-x 201 --end-y $2 --duration ${3:-0.35} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.4}; }
xcrun simctl terminate $SIM com.digitalcraft.gloop.design 2>/dev/null; sleep 0.5
xcrun simctl io $SIM recordVideo --codec=h264 --force "$OUT" >/dev/null 2>&1 & P=$!
sleep 1
xcrun simctl launch $SIM com.digitalcraft.gloop.design -GloopScenario night >/dev/null
sleep 7                         # splash → Equipos
sw 650 420 0.45 1.2; sw 420 680 0.45 1.6   # asomar la lista y volver
t 201 563 2.4                   # El Piso → equipo
t 201 600 2.0                   # Noche en marcha → la noche
t 201 246 6.0                   # Juego aleatorio → ruleta → Podium
t 42 100 1.6                    # cerrar juego
sw 700 330 0.5 2.0; sw 330 720 0.5 1.4     # marcador y vuelta
t 42 100 1.4                    # atrás → equipo
t 110 698 2.4                   # La Cuenta
t 42 100 1.2; t 42 100 1.6      # atrás, atrás → Equipos
t 115 822 2.2                   # Moments
t 201 290 2.4                   # álbum Los Cracks 14 sep
sw 700 300 0.5 1.8              # bajar a los momentos
t 108 330 5.5                   # abrir un momento (visor tipo Stories)
kill -INT $P; wait $P 2>/dev/null; echo "ok $OUT"
