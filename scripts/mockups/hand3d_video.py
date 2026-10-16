"""Móvil en la mano 3D (PSD de Alberto, mockups-src/hand-3d) sobre un fondo de foto desenfocada, con un vídeo en la
pantalla. Salidas de Photoshop por script: hand-dark.png (mano sin fondo), hand-magenta.png (máscara de la pantalla),
hand-markers.png (homografía). 2026-10-16, cabecera de WineUp.
python3 hand3d_video.py <fondo.jpg> <video.mp4> <salida.mp4> <poster.jpg> [--out 1920x1080] [--max 40]
"""
import sys, argparse, subprocess, numpy as np, cv2
a = argparse.ArgumentParser(); a.add_argument("bg"); a.add_argument("video"); a.add_argument("out"); a.add_argument("poster")
a.add_argument("--max", type=float, default=40); a.add_argument("--place", default="0.62,0.5,1.0")  # centro x (0-1), centro y, escala
A = a.parse_args()
D = "mockups-src/hand-3d/"
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
OW, OH = 1920, 1080
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
mw = warp(mag); scr = np.clip((mw[..., 2] - mw[..., 1]) * 1.2, 0, 1)[..., None] * mw[..., 3:4]  # magenta: R y B altos, G bajo
# Homografía de la pantalla: marcas a 182,8 px del borde en un objeto inteligente de 1179x2556.
SO = (1179, 2556); I = (182.79, 182.83)
src = np.float32([[I[0], I[1]], [SO[0] - I[0], I[1]], [SO[0] - I[0], SO[1] - I[1]], [I[0], SO[1] - I[1]]])
dst = np.float32([[1347.2, 534.8], [1908.7, 479.5], [2006.7, 1879.3], [1462.3, 1877.0]])
dst = (np.c_[dst, np.ones(4)] @ M.T).astype(np.float32)
VW, VH = 786, 1704  # clip a 2x de 393x852
Hm = cv2.getPerspectiveTransform((src * [VW / SO[0], VH / SO[1]]).astype(np.float32), dst)
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
