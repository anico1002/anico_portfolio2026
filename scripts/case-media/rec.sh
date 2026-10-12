#!/bin/bash
# rec.sh out.mp4 seconds [args...] — graba mientras lanza Gloop con argumentos
SIM=${SIM:-$(xcrun simctl list devices available | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}
OUT=$1; SECS=$2; shift 2
xcrun simctl terminate $SIM com.digitalcraft.gloop.design 2>/dev/null
sleep 0.5
xcrun simctl io $SIM recordVideo --codec=h264 --force "$OUT" >/dev/null 2>&1 &
P=$!
sleep 1.2
xcrun simctl launch $SIM com.digitalcraft.gloop.design "$@" >/dev/null
sleep $SECS
kill -INT $P; wait $P 2>/dev/null
echo "ok $OUT"
