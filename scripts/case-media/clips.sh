#!/bin/bash
# Clips cortos de Gloop con toques reales (AXe), sin cursor.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}; C=$S/clips
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.6}; }
sw(){ $AXE swipe --start-x 201 --start-y $1 --end-x 201 --end-y $2 --duration ${3:-0.45} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.4}; }
start(){ xcrun simctl terminate $SIM com.digitalcraft.gloop.design 2>/dev/null; sleep 0.5
  xcrun simctl io $SIM recordVideo --codec=h264 --force "$C/$1.mp4" >/dev/null 2>&1 & P=$!; sleep 1; shift
  xcrun simctl launch $SIM com.digitalcraft.gloop.design "$@" >/dev/null; }
stop(){ sleep ${1:-0.5}; kill -INT $P; wait $P 2>/dev/null; echo "ok"; }
case "$1" in
ruleta)  start ruleta -GloopSkipSplash YES -GloopScenario night -GloopRoute night:piso; sleep 6; t 201 246 7; stop;;
diario)  start diario -GloopSkipSplash YES -GloopScenario none -GloopCover crew:cracks; sleep 6
         t 201 272 1.2; t 201 792 1.8; t 201 341 1.2; t 201 792 2.8; t 201 806 2.5; sw 700 350 0.5 2.5; stop;;
unirse)  start unirse -GloopScenario invited; sleep 9.5; t 201 732 2.2; t 201 591 3.5; stop;;
visor)   start visor -GloopSkipSplash YES -GloopScenario reveal -GloopCover viewer:n14:0; sleep 8; t 340 450 3; t 340 450 3; stop;;
revelado) start revelado -GloopSkipSplash YES -GloopScenario reveal -GloopCover reveal:n14; sleep 12; stop;;
cuenta)  start cuenta -GloopSkipSplash YES -GloopScenario night -GloopRoute tab:piso; sleep 7; t 201 1080 2.6; t 42 100 1.4; sw 700 420 0.45 1.6; stop;;
podium|culpable|de0a100) start game-$1 -GloopSkipSplash YES -GloopScenario night -GloopCover game:piso:$1; sleep 9; stop;;
esac
