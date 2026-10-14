"""Apple Watch flotando delante de una escena de móvil (imagen o vídeo), con su pantalla animada.

Uso: python3 scripts/mockups/float_watch.py <escena.mp4|jpg> <pantalla_reloj.mp4|png> <salida.mp4|jpg>
       [--c 1280,480] [--h 470] [--tilt 6] [--turn 0.9] [--poster t]

El reloj (PNG recortado de AppLaunchpad, pantalla hueca de 374×446 en 63,167) se coloca casi frontal, sin
deformarlo: solo una inclinación en el plano (--tilt, grados) y un giro leve sobre el eje vertical (--turn:
cuánto mide su canto izquierdo respecto al derecho, < 1 = la pantalla mira hacia la izquierda). Arroja una
sombra suave sobre lo que tiene detrás. Decisión de Alberto (2026-10-14): flotando, tocando el móvil solo por
un lado y sin tapar el aviso, como los dos móviles de Gloop.
"""
import argparse, subprocess
import cv2, numpy as np

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
ap = argparse.ArgumentParser()
ap.add_argument("scene"); ap.add_argument("screen"); ap.add_argument("out")
ap.add_argument("--watch", default="mockups-src/watch/s10-42mm-aluminum-jet-black-sport-band-black.webp")
ap.add_argument("--c", default="1280,480"); ap.add_argument("--h", type=float, default=470)
ap.add_argument("--tilt", type=float, default=6); ap.add_argument("--turn", type=float, default=0.9)
ap.add_argument("--shadow", default="-38,26"); ap.add_argument("--shade", type=float, default=0.9)
ap.add_argument("--poster"); ap.add_argument("--crf", type=int, default=21)
a = ap.parse_args()
is_vid = lambda p: p.lower().endswith((".mp4", ".mov"))

wt = cv2.imread(a.watch, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
wh, ww = wt.shape[:2]; al = wt[:, :, 3]
hx, hy, hw_, hh = 63, 167, 374, 446
hole = np.zeros((wh, ww), np.float32); hole[hy - 2:hy + hh + 2, hx - 2:hx + hw_ + 2] = 1
yy, xx = np.mgrid[0:wh, 0:ww].astype(np.float32)
glare = np.exp(-(((xx - ww * 0.25) + (yy - wh * 0.30) * 0.9) / (ww * 0.12)) ** 2) * 0.08

# Geometría: rectángulo del reloj, giro leve sobre el eje vertical y luego inclinación en el plano.
cx, cy = (float(v) for v in a.c.split(","))
s = a.h / wh; w2, h2 = ww * s / 2 * (0.5 + 0.5 * a.turn) ** 0.5, a.h / 2
L, R = h2 * a.turn, h2
pts = np.float32([[-w2, -L], [w2, -R], [w2, R], [-w2, L]])
t = np.radians(a.tilt); rot = np.float32([[np.cos(t), -np.sin(t)], [np.sin(t), np.cos(t)]])
dst = pts @ rot.T + np.float32([cx, cy])
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [ww, 0], [ww, wh], [0, wh]]), dst)


def watch_rgba(screen):
    scr = cv2.resize(screen.astype(np.float32) / 255, (hw_ + 4, hh + 4), interpolation=cv2.INTER_AREA)
    under = np.zeros((wh, ww, 3), np.float32); under[hy - 2:hy + hh + 2, hx - 2:hx + hw_ + 2] = scr
    under = 1 - (1 - under) * (1 - glare[..., None])
    a_ = al[..., None]
    rgb = wt[:, :, :3] * a_ * a.shade + under * (1 - a_) * hole[..., None]
    return rgb, np.clip(al + hole, 0, 1)


def place(rgb, alpha, W, H, k=2):
    Mk = np.diag([k, k, 1]).astype(np.float64) @ M
    f = lambda im: cv2.resize(cv2.warpPerspective(im, Mk, (W * k, H * k), flags=cv2.INTER_CUBIC), (W, H), interpolation=cv2.INTER_AREA)
    return f(rgb), np.clip(f(alpha), 0, 1)[..., None]


def frames(path):
    if is_vid(path):
        cap = cv2.VideoCapture(path)
        while True:
            ok, f = cap.read()
            if not ok: return
            yield f
    else:
        f = cv2.imread(path)
        while True: yield f


sx, sy = (float(v) for v in a.shadow.split(","))
out_vid = is_vid(a.out); p = None; shadow = None
n = int(cv2.VideoCapture(a.scene).get(cv2.CAP_PROP_FRAME_COUNT)) if is_vid(a.scene) else 1
for i, (sc, ws) in enumerate(zip(frames(a.scene), frames(a.screen))):
    if i >= n: break
    S = sc.astype(np.float32) / 255; H, W = S.shape[:2]
    rgb, alpha = watch_rgba(ws)
    Rw, Aw = place(rgb, alpha, W, H)
    if shadow is None:
        shadow = cv2.GaussianBlur(cv2.warpAffine(Aw[..., 0], np.float32([[1, 0, sx], [0, 1, sy]]), (W, H)), (0, 0), 26)
    S = S * (1 - 0.55 * shadow)[..., None]
    out = (np.clip(S * (1 - Aw) + Rw * Aw, 0, 1) * 255).astype(np.uint8)
    if not out_vid:
        cv2.imwrite(a.out, out, [cv2.IMWRITE_JPEG_QUALITY, 92]); break
    if p is None:
        p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                              "-vf", "scale=1920:-2", "-c:v", "libx264", "-crf", str(a.crf), "-preset", "slow", "-pix_fmt", "yuv420p",
                              "-movflags", "+faststart", "-an", a.out], stdin=subprocess.PIPE)
    if a.poster and i == int(float(a.poster.split(":")[1]) * 30):
        cv2.imwrite(a.poster.split(":")[0], cv2.resize(out, (1920, int(1920 * H / W) // 2 * 2)), [cv2.IMWRITE_JPEG_QUALITY, 90])
    p.stdin.write(out.tobytes())
if p: p.stdin.close(); p.wait()
print(a.out, dst.round(1).tolist())
