"""Prepara una grabación del simulador para meterla en un mockup.

Uso: python3 scripts/mockups/clip_prep.py <entrada.mp4> <salida.mp4> --start S [--end E] [--idle 1.3]
       [--cut A,B] [--speed A,B,F] [--hold-end 1.5] [--fit SEGUNDOS [--fit-range A,B]]

- Pasa a 30 fps constantes (recordVideo graba solo cuando cambia la pantalla).
- Recorta el arranque (--start) y el final (--end).
- --cut A,B: quita un tramo (un toque que no entró, por ejemplo).
- --speed A,B,F: acelera F veces un tramo (una búsqueda que tarda); con F < 1 lo ralentiza (la splash).
- --idle: cualquier tramo quieto más largo que esto se acorta a esto (AXe deja esperas muertas).
- --hold-end: congela el último fotograma un rato (resultado de la ruleta, etc.).
- --fit: si el clip queda más corto, alarga (repitiendo --fit-range o el primer fotograma) hasta esa duración.
Los tiempos de --cut y --speed son del clip ya recortado por --start. Salida en H.264 nativo, sin audio.

Trabaja con índices de fotograma y lee el vídeo dos veces (decidir y escribir): así no carga en memoria
una grabación larga a resolución nativa (2 min serían decenas de GB).
"""
import argparse, subprocess, sys, os, tempfile
from collections import Counter
import cv2, numpy as np

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--start", type=float, required=True); ap.add_argument("--end", type=float)
ap.add_argument("--idle", type=float, default=0)
ap.add_argument("--motion", type=float, default=0.12, help="cambio medio mínimo para contar como movimiento (teclear cambia muy poco)")
ap.add_argument("--hold-end", type=float, default=0)
ap.add_argument("--cut", action="append", default=[], help="A,B: quita el tramo de A a B segundos")
ap.add_argument("--speed", action="append", default=[], help="A,B,F: acelera (F>1) o ralentiza (F<1) el tramo")
ap.add_argument("--fit", type=float)
ap.add_argument("--fit-range", help="A,B: tramo que se repite en bucle para alargar hasta --fit")
a = ap.parse_args()

tmp = tempfile.mkdtemp()
cfr = os.path.join(tmp, "cfr.mp4")
args = [FF, "-loglevel", "error", "-y", "-ss", str(a.start), "-i", a.inp]
if a.end: args += ["-t", str(a.end - a.start)]
subprocess.check_call(args + ["-vf", "fps=30", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", cfr])

# Pasada 1: miniaturas en gris para medir el movimiento.
cap = cv2.VideoCapture(cfr); small = []
while True:
    ok, f = cap.read()
    if not ok: break
    small.append(cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (120, 260)).astype(np.float32))
n = len(small); print("fotogramas", n, file=sys.stderr)
idx = list(range(n))

for spec in sorted(a.cut, key=lambda x: -float(x.split(",")[0])):
    A, Bt = (float(x) for x in spec.split(","))
    idx = idx[:int(A * 30)] + idx[int(Bt * 30):]

for spec in sorted(a.speed, key=lambda x: -float(x.split(",")[0])):
    A, Bt, F = (float(x) for x in spec.split(","))
    i0, i1 = int(A * 30), int(Bt * 30)
    seg = idx[i0:i1:int(F)] if F >= 1 else [k for k in idx[i0:i1] for _ in range(round(1 / F))]
    idx = idx[:i0] + seg + idx[i1:]

if a.idle:
    keep, run, cap_n, prev = [], 0, int(a.idle * 30), None
    for k in idx:
        moving = prev is None or float(np.abs(small[k] - small[prev]).mean()) > a.motion
        run = 0 if moving else run + 1
        if run <= cap_n: keep.append(k)
        prev = k
    idx = keep

if a.hold_end:
    idx += [idx[-1]] * int(a.hold_end * 30)

if a.fit:
    need = int(a.fit * 30) - len(idx)
    if need > 0 and a.fit_range:
        s, e = (int(float(x) * 30) for x in a.fit_range.split(","))
        loop = idx[s:e]; idx = idx[:e] + (loop * (need // len(loop) + 1))[:need] + idx[e:]
    elif need > 0:
        idx = idx[:1] * need + idx
    elif need < 0:
        print(f"aviso: el clip dura {len(idx)/30:.2f}s, más que --fit", file=sys.stderr)

# Pasada 2: se lee en orden y se escriben los fotogramas de la lista. Los que se repiten (congelados,
# ralentizados o bucles hacia atrás) se guardan en caché; el resto pasa sin quedarse en memoria.
reused = {k for k, c in Counter(idx).items() if c > 1}
cap = cv2.VideoCapture(cfr)
w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", "30", "-i", "-",
                      "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
cache, cur, frame = {}, -1, None
for k in idx:
    if k in cache:
        frame = cache[k]
    else:
        while cur < k:
            ok, frame = cap.read(); cur += 1
            if cur in reused: cache[cur] = frame
    p.stdin.write(frame.tobytes())
p.stdin.close(); p.wait()
print(f"{a.out}: {len(idx)/30:.2f}s", file=sys.stderr)
