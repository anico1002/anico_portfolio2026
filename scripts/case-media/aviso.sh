#!/bin/bash
# Graba la notificación de 7news llegando a la pantalla de bloqueo (para el mockup iPhone + reloj).
# Antes: pantalla de bloqueo limpia (sin avisos viejos) y la app con permiso de avisos.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}
PUSH=$1; OUT=${2:-$S/clips/aviso.mp4}
xcrun simctl io $SIM recordVideo --codec=h264 --force "$OUT" >/dev/null 2>&1 & P=$!
sleep 2.5
xcrun simctl push $SIM com.anico.news "$PUSH" >/dev/null
sleep 4.5
kill -INT $P; wait $P 2>/dev/null; echo "$OUT"
