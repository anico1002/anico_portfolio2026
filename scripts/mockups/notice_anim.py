"""Anima la llegada de un aviso a partir de dos capturas (sin aviso / con aviso), en el móvil y en el reloj.

Uso: python3 scripts/mockups/notice_anim.py <sin.png> <con.png> <salida.mp4> --rect x0,y0,x1,y1 [--radius 66]
       [--enter 1.0] [--leave 5.0] [--dur 6.0]

recordVideo no recoge la animación con la pantalla bloqueada (apenas emite fotogramas), así que se recrea:
la tarjeta del aviso (recortada de la captura «con», dentro de --rect con esquinas redondeadas) entra desde
abajo con muelle, se queda y sale con un fundido hacia arriba.
2026-10-14 (feedback: «la aparición de la burbuja no parece nativa»): como en iOS, recorrido corto (≈ 40 % del
alto de la tarjeta, antes 90 %, que arrastraba el fondo del cristal y se notaba pegada), muelle sin rebote
(amortiguamiento crítico, ~0,5 s), escala 0,92 → 1, fundido rápido y un leve desenfoque los primeros fotogramas. Si no se da --rect,
la tarjeta se saca de la diferencia entre las dos capturas (sirve para la esfera del reloj, que no tiene ruido).
"""
import argparse, subprocess, math
import cv2, numpy as np

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
ap = argparse.ArgumentParser()
ap.add_argument("sin"); ap.add_argument("con"); ap.add_argument("out")
ap.add_argument("--rect"); ap.add_argument("--radius", type=int, default=66)
ap.add_argument("--enter", type=float, default=1.0); ap.add_argument("--leave", type=float, default=5.0)
ap.add_argument("--dur", type=float, default=6.0)
a = ap.parse_args()

A = cv2.imread(a.sin).astype(np.float32) / 255
B = cv2.imread(a.con).astype(np.float32) / 255
H, W = A.shape[:2]
m = np.zeros((H, W), np.float32)
if a.rect:
    x0, y0, x1, y1 = (int(v) for v in a.rect.split(","))
else:
    d = (np.abs(A - B).sum(2) > 0.03).astype(np.uint8)
    d = cv2.morphologyEx(d, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    ys, xs = np.where(d); x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
cv2.rectangle(m, (x0 + a.radius, y0), (x1 - a.radius, y1), 1, -1)
cv2.rectangle(m, (x0, y0 + a.radius), (x1, y1 - a.radius), 1, -1)
for cx, cy in ((x0 + a.radius, y0 + a.radius), (x1 - a.radius, y0 + a.radius), (x1 - a.radius, y1 - a.radius), (x0 + a.radius, y1 - a.radius)):
    cv2.circle(m, (cx, cy), a.radius, 1, -1, lineType=cv2.LINE_AA)
card = np.dstack([B, m])                           # la tarjeta con su alfa
center = np.float32([(x0 + x1) / 2, (y0 + y1) / 2]); ch = y1 - y0


def spring(t):  # 0→1 con amortiguamiento crítico (sin rebote), como los muelles de iOS
    if t <= 0: return 0.0
    if t >= 1: return 1.0
    w = 9.0
    return 1 - math.exp(-w * t) * (1 + w * t)


fps = 30; N = int(a.dur * fps)
p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
                      "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
for i in range(N):
    t = i / fps
    if t < a.enter:
        k, op, dy, sc = 0, 0, 0, 1
    elif t < a.leave:
        k = spring((t - a.enter) / 0.6)
        op = min(1, (t - a.enter) / 0.16)
        dy = (1 - k) * ch * 0.4; sc = 0.92 + 0.08 * k
    else:
        u = min(1, (t - a.leave) / 0.4)
        op = 1 - u; dy = -u * ch * 0.25; sc = 1 - 0.03 * u
    frame = A.copy()
    if op > 0:
        M = np.float32([[sc, 0, (1 - sc) * center[0]], [0, sc, (1 - sc) * center[1] + dy]])
        c = cv2.warpAffine(card, M, (W, H), flags=cv2.INTER_LINEAR)
        blur = max(0.0, 1 - (t - a.enter) / 0.18) * 7 if t >= a.enter and t < a.leave else 0
        if blur > 0.5: c = cv2.GaussianBlur(c, (0, 0), blur)
        al = c[:, :, 3:] * op
        frame = frame * (1 - al) + c[:, :, :3] * al
    p.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
print(a.out)
