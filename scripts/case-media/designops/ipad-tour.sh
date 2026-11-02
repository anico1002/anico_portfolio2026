#!/bin/bash
# Recorrido del iPad del caso en móvil (2026-11-02): el mismo guion que la cabecera (hero.json), grabado plano a 4:3
# y sin los ratos de pantalla quieta (se quedan 0,7 s de cada uno; el corte cae dentro de fotogramas idénticos, así que
# no se nota). Guarda también la grabación limpia: de ayer solo quedaron los vídeos ya montados en la foto.
# Uso: bash scripts/case-media/designops/ipad-tour.sh  (con el prototipo exportado en public/maqueta/designops/app)
set -euo pipefail
cd "$(dirname "$0")/../../.."
M=public/maqueta/designops/media; SRC=scripts/case-media/tmp/designops; mkdir -p "$SRC"   # fuera de public: no se publica
FF="$(npm root -g)/ffmpeg-static/ffmpeg"
PORT=4790 node scripts/qa/serve.mjs public >/dev/null 2>&1 & SV=$!; trap 'kill $SV' EXIT; sleep 1
NOCURSOR=1 node scripts/case-media/web-rec.mjs http://localhost:4790/maqueta/designops/app/welcome/ "$SRC/hero-raw.mp4" scripts/case-media/designops/hero.json 1376 1032 2
"$FF" -i "$SRC/hero-raw.mp4" -vf "freezedetect=n=0.001:d=1.0" -map 0:v -f null - 2>&1 | grep -o "freeze_\(start\|end\): [0-9.]*" > "$SRC/freezes.txt"
DUR=$("$FF" -i "$SRC/hero-raw.mp4" 2>&1 | grep -o "Duration: [0-9:.]*" | awk -F'[: ]' '{print $2*3600+$3*60+$4}')
python3 - "$SRC" "$DUR" <<'PY'
import sys
sp, dur = sys.argv[1], float(sys.argv[2])
L = [float(l.split(": ")[1]) for l in open(sp + "/freezes.txt")]
pairs = [(L[i], L[i + 1] if i + 1 < len(L) else dur) for i in range(0, len(L), 2)]
m = []
for a, b in pairs:
    if m and a - m[-1][1] < 0.15: m[-1][1] = b
    else: m.append([a, b])
cuts = [(a + 0.7, b - 0.4) for a, b in m if b - a > 1.4]
expr = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in cuts)
open(sp + "/select.txt", "w").write(f"select='not({expr})',setpts=N/FRAME_RATE/TB,scale=1024:768:flags=lanczos")
PY
"$FF" -y -loglevel error -i "$SRC/hero-raw.mp4" -filter_script:v "$SRC/select.txt" -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart -r 30 "$M/ipad-tour.mp4"
echo "ok $M/ipad-tour.mp4 — ahora: npm run media:opt"
