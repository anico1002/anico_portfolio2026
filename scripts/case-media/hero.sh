#!/bin/bash
# Recorridos de Gloop (2026-10-14). En inglés por defecto (la web va en inglés); LANG_APP=es para castellano.
# Recorridos para la cabecera de Gloop (2026-10-14): delante la Home con El Piso y La Cuenta, detrás la ruleta.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}; C=$S/clips
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.6}; }
sw(){ $AXE swipe --start-x 201 --start-y $1 --end-x 201 --end-y $2 --duration ${3:-0.45} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.4}; }
start(){ xcrun simctl terminate $SIM com.digitalcraft.gloop.design 2>/dev/null; sleep 0.5
  xcrun simctl io $SIM recordVideo --codec=h264 --force "$C/$1.mp4" >/dev/null 2>&1 & P=$!; sleep 1; shift
  xcrun simctl launch $SIM com.digitalcraft.gloop.design -AppleLanguages "(${LANG_APP:-en})" -AppleLocale ${LOCALE_APP:-en_US} "$@" >/dev/null; }
stop(){ sleep ${1:-0.5}; kill -INT $P; wait $P 2>/dev/null; echo "ok"; }
case "$1" in
front) start front -GloopSkipSplash YES; sleep 8.5
       sw 650 430 0.6 1.4; sw 430 650 0.6 1.2; t 201 563 2.4; t 110 698 2.6; sw 700 430 0.6 1.6; sw 430 700 0.5 1.0; t 42 100 1.6; t 42 100 2.2; stop;;
back)  start back -GloopSkipSplash YES -GloopRoute team:piso/night:piso; sleep 13.5; t 201 246 8.5; stop;;
revelado) start revelado -GloopSkipSplash YES -GloopScenario reveal -GloopCover reveal:n14; sleep 16; stop;;
esac
