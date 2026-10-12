#!/bin/bash
# shot.sh out.png [args...]  — lanza Gloop con argumentos y captura
SIM=${SIM:-$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}
OUT=$1; shift
xcrun simctl terminate $SIM com.digitalcraft.gloop.design 2>/dev/null
xcrun simctl launch $SIM com.digitalcraft.gloop.design -GloopSkipSplash YES "$@" >/dev/null
sleep ${WAIT:-4}
xcrun simctl io $SIM screenshot "$OUT" >/dev/null 2>&1 && echo "ok $OUT"
