#!/bin/bash
# loop_fade.sh in.mp4 out.mp4 [fundido=0.6] [crf=24] — bucle sin salto: los últimos segundos funden con los primeros.
# El resultado dura (L − fundido) y su último fotograma enlaza con el primero. Póster al lado (out-poster.jpg).
set -euo pipefail
export LC_ALL=C  # awk con locale es escribe «10,6» y ffmpeg lo lee como dos filtros
IN=$1; OUT=$2; F=${3:-0.6}; CRF=${4:-24}
FF="$(npm root -g)/ffmpeg-static/ffmpeg"
L=$( ("$FF" -i "$IN" 2>&1 || true) | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
OFF=$(awk -v l="$L" -v f="$F" 'BEGIN{printf "%.3f", l-2*f}')
"$FF" -loglevel error -i "$IN" -filter_complex \
  "[0:v]split[a][b];[a]trim=start=$F,setpts=PTS-STARTPTS[main];[b]trim=0:$F,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=$F:offset=$OFF,format=yuv420p" \
  -vcodec libx264 -crf "$CRF" -preset slow -an -movflags +faststart -y "$OUT"
"$FF" -loglevel error -i "$OUT" -frames:v 1 -q:v 3 -y "${OUT%.mp4}-poster.jpg"
echo "ok $OUT"
