"""Móvil en la mano 3D (PSD de Alberto, mockups-src/hand-3d) sobre un fondo de foto desenfocada, con un vídeo en la
pantalla. Salidas de Photoshop por script: hand-dark.png (mano sin fondo), hand-magenta.png (máscara de la pantalla),
hand-markers.png (ya no se usa: las esquinas salen de la máscara). 2026-10-16, cabecera de WineUp.
python3 hand3d_video.py <fondo.jpg> <video.mp4> <salida.mp4> <poster.jpg> [--size 1920x1080] [--max 40] [--place cx,cy,escala]
WineUp (2026-10-17), con fondo mockups-src/bg-wine-bar-blur.jpg y clip scripts/case-media/clips/wineup/flow.mp4:
  cabecera (franja de arriba): --place 0.55,0.36,0.72                     → media/hero-band.mp4
  miniatura: --size 1920x1200 --place 0.555,0.5,1.0, luego escalada a 1280x800 → media/thumb.mp4
"""
import sys, argparse, subprocess, numpy as np, cv2
a = argparse.ArgumentParser(); a.add_argument("bg"); a.add_argument("video"); a.add_argument("out"); a.add_argument("poster")
a.add_argument("--max", type=float, default=40); a.add_argument("--size", default="1920x1080"); a.add_argument("--place", default="0.62,0.5,1.0")  # centro x (0-1), centro y, escala
A = a.parse_args()
D = "mockups-src/hand-3d/"
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
OW, OH = [int(v) for v in A.size.split("x")]
hand = cv2.imread(D + "hand-dark.png", cv2.IMREAD_UNCHANGED).astype(np.float32) / 255  # 3680x2760 RGBA
mag = cv2.imread(D + "hand-magenta.png", cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
HH, HW = hand.shape[:2]
# Encaje: la mano se escala para que su alto ocupe el lienzo y se coloca con su centro en (cx, cy).
cx, cy, sc = [float(v) for v in A.place.split(",")]
k = OH / HH * 1.0 * sc
M = np.float32([[k, 0, cx * OW - HW * k / 2], [0, k, cy * OH - HH * k / 2]])
warp = lambda im: cv2.warpAffine(im, M, (OW, OH), flags=cv2.INTER_AREA, borderValue=0)
hw = warp(hand); alpha = hw[..., 3:4]; hrgb = hw[..., :3]
# El PSD corta el antebrazo en el borde inferior: si ese borde cae dentro del lienzo, se funde hacia el fondo.
bot = HH * k + M[1, 2]; fade = 0.22 * HH * k
ramp = np.clip((bot - np.arange(OH)) / fade, 0, 1).astype(np.float32)[:, None, None]
alpha = alpha * ramp
# Máscara de la pantalla (magenta: R y B altos, G bajo). Los dedos que pisan la pantalla quedan a medias en el PSD
# (~0,4): se remapea para que el dedo sea opaco y el borde de la pantalla siga suave (2026-10-17).
magscr = np.clip((mag[..., 2] - mag[..., 1]) * 1.2, 0, 1) * mag[..., 3]
mw = warp(magscr[..., None].repeat(4, 2))[..., 0]
scr = np.clip((mw - 0.45) / 0.4, 0, 1)[..., None]
# Esquinas de la pantalla, sacadas del contorno de la máscara (2026-10-17; antes iban a mano desde unas marcas y el
# vídeo quedaba torcido arriba a la izquierda): se ajusta una recta al tramo central de cada lado, lejos de las
# esquinas redondeadas y de los dedos, y las esquinas son los cruces. El vídeo entero va a ese cuadrilátero.
def screen_quad(m):
    cs, _ = cv2.findContours((m > 0.5).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)[:, 0, :].astype(np.float32)
    x0, y0, x1, y1 = c[:, 0].min(), c[:, 1].min(), c[:, 0].max(), c[:, 1].max(); w, h = x1 - x0, y1 - y0
    band = lambda a, b: (c[:, 1] > y0 + a * h) & (c[:, 1] < y0 + b * h)
    sides = dict(top=c[(c[:, 1] < y0 + 0.08 * h) & (abs(c[:, 0] - (x0 + x1) / 2) < 0.25 * w)],
                 bot=c[(c[:, 1] > y1 - 0.08 * h) & (abs(c[:, 0] - (x0 + x1) / 2) < 0.25 * w)],
                 lef=c[(c[:, 0] < x0 + 0.15 * w) & (band(0.08, 0.2) | band(0.85, 0.93))],
                 rig=c[(c[:, 0] > x1 - 0.15 * w) & band(0.08, 0.93)])
    L = {k: cv2.fitLine(v, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel() for k, v in sides.items()}
    def cross(a, b):
        d1, p1, d2, p2 = L[a][:2], L[a][2:], L[b][:2], L[b][2:]
        return p1 + np.linalg.solve(np.array([d1, -d2]).T, p2 - p1)[0] * d1
    return np.float32([cross("top", "lef"), cross("top", "rig"), cross("bot", "rig"), cross("bot", "lef")])
dst = (np.c_[screen_quad(magscr), np.ones(4)] @ M.T).astype(np.float32)
VW, VH = 786, 1704  # clip a 2x de 393x852
Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [VW, 0], [VW, VH], [0, VH]]), dst)
# Fondo: cubre el lienzo, oscurecido y con viñeta para que mande la pantalla.
B = cv2.imread(A.bg).astype(np.float32) / 255; bh, bw = B.shape[:2]; s = max(OW / bw, OH / bh)
B = cv2.resize(B, (round(bw * s), round(bh * s)), interpolation=cv2.INTER_AREA)
y0 = (B.shape[0] - OH) // 2; x0 = (B.shape[1] - OW) // 2; B = B[y0:y0 + OH, x0:x0 + OW] * 0.8
yy, xx = np.mgrid[0:OH, 0:OW]; v = ((xx - OW / 2) / (OW / 2)) ** 2 + ((yy - OH / 2) / (OH / 2)) ** 2
B = B * (1 - 0.45 * np.clip(v, 0, 1))[..., None]
# Luz de la escena sobre la mano: un toque cálido del fondo en los bordes (light wrap).
edge = np.clip(cv2.GaussianBlur(alpha[..., 0], (0, 0), 6), 0, 1)[..., None]
base = B * (1 - alpha) + hrgb * alpha
wrap = cv2.GaussianBlur(B, (0, 0), 25) * np.clip(edge - alpha, 0, 1) * 1.3
base = np.clip(base + wrap, 0, 1)
p = subprocess.Popen([FF, "-loglevel", "error", "-t", str(A.max), "-i", A.video, "-vf", f"scale={VW}:{VH}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
o = subprocess.Popen([FF, "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-vcodec", "libx264", "-crf", "23", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", A.out], stdin=subprocess.PIPE)
n = 0
while True:
    b = p.stdout.read(VW * VH * 3)
    if len(b) < VW * VH * 3: break
    f = np.frombuffer(b, np.uint8).reshape(VH, VW, 3).astype(np.float32) / 255
    w = cv2.warpPerspective(f, Hm, (OW, OH), flags=cv2.INTER_LINEAR)
    img = (base * (1 - scr) + w * scr) * 255
    b8 = np.clip(img, 0, 255).astype(np.uint8)
    if n == 75: cv2.imwrite(A.poster, b8, [cv2.IMWRITE_JPEG_QUALITY, 88])
    o.stdin.write(b8.tobytes()); n += 1
o.stdin.close(); o.wait(); print("frames", n)
