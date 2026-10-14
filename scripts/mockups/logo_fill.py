"""Splash con el logo «cargando» a partir de UN fotograma de la splash con el logo aún apagado.

Uso: python3 scripts/mockups/logo_fill.py <grabacion.mp4> <t_logo_apagado> <salida.mp4>
       [--fade 0.4] [--fill 1.3] [--hold 0.5] [--dim 0.22]

Reproduce la splash de 7news (el logo aparece apagado y se rellena de blanco de izquierda a derecha según
cargan las noticias) cuando la red va tan rápida (o tan a tirones) que en la grabación no se ve bien: el logo apagado
y el blanco salen del mismo fotograma (la forma del logo, con su antialias, es lo que se aparta del fondo),
así que no cambia nada más de la pantalla. 30 fps, H.264 a resolución
nativa, listo para concatenar con el resto de la toma.
"""
import argparse, subprocess, os, tempfile
import cv2, numpy as np

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("t", type=float); ap.add_argument("out")
ap.add_argument("--fade", type=float, default=0.4, help="aparece el logo apagado")
ap.add_argument("--fill", type=float, default=1.3, help="relleno de izquierda a derecha")
ap.add_argument("--hold", type=float, default=0.5, help="logo entero quieto")
ap.add_argument("--dim", type=float, default=0.22, help="brillo del logo apagado (0–1)")
a = ap.parse_args()

cap = cv2.VideoCapture(a.inp); cap.set(cv2.CAP_PROP_POS_MSEC, a.t * 1000)
ok, frame = cap.read(); assert ok, "no hay fotograma en ese instante"
f = frame.astype(np.float32)
h, w = f.shape[:2]
bg = np.median(f.reshape(-1, 3), axis=0)
# El logo es lo que se aparta del fondo en la franja central (fuera la barra de estado y el texto de abajo).
diff = np.abs(f - bg).max(axis=2)
band = np.zeros_like(diff); band[int(h * .3):int(h * .7)] = 1
diff *= band
ys, xs = np.where(diff > 6)
x0, x1 = xs.min(), xs.max()
print(f"logo en x {x0}–{x1}, y {ys.min()}–{ys.max()}")
# Opacidad del logo (con su antialias) respecto al gris más claro del logo apagado.
alpha = np.clip(diff / np.percentile(diff[diff > 6], 95), 0, 1)[..., None]

base = np.where(alpha > 0, bg, f)                       # pantalla sin logo
dim = base + (np.array([255, 255, 255]) - bg) * alpha * a.dim
full = base + (np.array([255, 255, 255]) - bg) * alpha  # logo en blanco
f = full
ease = lambda u: u * u * (3 - 2 * u)
fps = 30; tmp = tempfile.mkdtemp(); n = 0
def put(img):
    global n; cv2.imwrite(os.path.join(tmp, f"{n:05d}.png"), np.clip(img, 0, 255).astype(np.uint8)); n += 1
for i in range(int(a.fade * fps)): put(base + (dim - base) * ease(i / (a.fade * fps)))
soft = 24  # canto suave del relleno, en px
cols = np.arange(w, dtype=np.float32)
for i in range(int(a.fill * fps) + 1):
    edge = x0 - soft + (x1 - x0 + 2 * soft) * ease(i / (a.fill * fps))
    m = np.clip((edge - cols) / soft, 0, 1)[None, :, None]
    put(dim + (f - dim) * m)
for i in range(int(a.hold * fps)): put(f)
subprocess.check_call([FF, "-loglevel", "error", "-y", "-framerate", str(fps), "-i", os.path.join(tmp, "%05d.png"),
                       "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", a.out])
print(a.out, f"{n / fps:.2f} s")
