"""Vídeo de cabecera para CaseHero (2026-10-16): tras la apertura, la cabecera solo deja ver la franja de arriba
(56 % del alto), así que el dispositivo tiene que caber entero en esa franja. Toma una escena (foto) con una pantalla
(rectángulo o 4 esquinas), mete el vídeo en ella y la recoloca en un lienzo 16:10 con el dispositivo en la parte de
arriba; lo que falta de escena se rellena con el color del fondo, fundido. Fotogramas a ffmpeg.

python3 hero_band.py <escena.jpg> <video.mp4> <salida.mp4> --quad x,y x,y x,y x,y --box x0,y0,x1,y1 [--bg r,g,b]
Coordenadas sobre la escena tal cual (en píxeles). --box: el dispositivo entero (lo que tiene que verse).
"""
import argparse, subprocess, numpy as np, cv2
a = argparse.ArgumentParser()
a.add_argument("scene"); a.add_argument("video"); a.add_argument("out")
a.add_argument("--quad", nargs=4, required=True); a.add_argument("--box", required=True)
a.add_argument("--bg"); a.add_argument("--top", type=float, default=0.07); a.add_argument("--band", type=float, default=0.52)
a.add_argument("--feather", type=int, default=160)
A = a.parse_args()
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
S = cv2.imread(A.scene).astype(np.float32); SH, SW = S.shape[:2]
q = np.float32([[float(v) for v in p.split(",")] for p in A.quad])
x0, y0, x1, y1 = [float(v) for v in A.box.split(",")]
bg = np.float32([float(v) for v in A.bg.split(",")][::-1]) if A.bg else S[5:40, SW // 2 - 20: SW // 2 + 20].reshape(-1, 3).mean(0)
# Ventana en coordenadas de la escena: el dispositivo entre `top` y `band` del alto, centrado en horizontal.
H = (y1 - y0) / (A.band - A.top); W = H * 1.6
wx0 = (x0 + x1) / 2 - W / 2; wy0 = y0 - A.top * H
OW, OH = 1600, 1000; k = OW / W
# Escena llevada al lienzo de salida + máscara de dónde hay foto (para fundir el borde con el color de fondo).
M = np.float32([[k, 0, -wx0 * k], [0, k, -wy0 * k]])
scene = cv2.warpAffine(S, M, (OW, OH), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_CONSTANT, borderValue=bg.tolist())
inside = cv2.warpAffine(np.ones((SH, SW), np.float32), M, (OW, OH), borderValue=0)
f = max(1, int(A.feather * k)); inside = cv2.blur(cv2.erode(inside, np.ones((f, f))), (2 * f + 1, 2 * f + 1))[..., None]
base = scene * inside + bg * (1 - inside)
src = np.float32([[0, 0], [1440, 0], [1440, 900], [0, 900]])
Hm = cv2.getPerspectiveTransform(src, (q - [wx0, wy0]) * k)
scr = cv2.warpPerspective(np.ones((900, 1440), np.float32), Hm, (OW, OH))[..., None]
p = subprocess.Popen([FF, "-loglevel", "error", "-i", A.video, "-vf", "scale=1440:900", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
o = subprocess.Popen([FF, "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-vcodec", "libx264", "-crf", "25", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", A.out], stdin=subprocess.PIPE)
n = 0
while True:
    b = p.stdout.read(1440 * 900 * 3)
    if len(b) < 1440 * 900 * 3: break
    fr = np.frombuffer(b, np.uint8).reshape(900, 1440, 3).astype(np.float32)
    w = cv2.warpPerspective(fr, Hm, (OW, OH), flags=cv2.INTER_LINEAR)
    o.stdin.write(np.clip(base * (1 - scr) + w * scr, 0, 255).astype(np.uint8).tobytes()); n += 1
o.stdin.close(); o.wait(); print("frames", n)
