"""Cabecera vertical para móvil (auditoría 2026-10-19): las cabeceras con BandMedia usaban en móvil la miniatura 16:10
encajada a lo ancho y se veían franjas arriba y abajo, sobre todo a pantalla completa (al entrar y al aterrizar el
vuelo). Esto saca un vídeo vertical del tamaño de un iPhone: el dispositivo cabe a lo ancho y queda centrado en la
franja que CaseHero deja ver tras recogerse (el 56 % de arriba); el resto de la pantalla es la misma escena prolongada
(bordes estirados y muy desenfocados, horneado en el vídeo: el navegador no desenfoca nada).

python3 hero_portrait.py <miniatura-16x10.mp4> <salida.mp4> [--zoom 1.3] [--band 0.56] [--dy 0]
--zoom: ancho del vídeo / ancho de pantalla (el mismo de BandMedia). --dy: desplaza el dispositivo (fracción del alto).
"""
import argparse, subprocess, numpy as np, cv2

a = argparse.ArgumentParser()
a.add_argument("video"); a.add_argument("out")
a.add_argument("--zoom", type=float, default=1.3); a.add_argument("--band", type=float, default=0.56)
a.add_argument("--dy", type=float, default=0.0); a.add_argument("--feather", type=float, default=0.06)
A = a.parse_args()
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"

info = subprocess.run([FF, "-i", A.video], capture_output=True, text=True).stderr
import re
VW, VH = map(int, re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", info).groups())
fps = re.search(r"(\d+(?:\.\d+)?) fps", info).group(1)

OW, OH = 780, 1688  # 390×844 a 2x
fw = A.zoom * OW; k = fw / VW; fh = VH * k
cx, cy = OW / 2, OH * (A.band / 2 + A.dy)
M = np.float32([[k, 0, cx - fw / 2], [0, k, cy - fh / 2]])
# Máscara de dónde hay vídeo de verdad, con el borde fundido para que la prolongación no se note.
inside = cv2.warpAffine(np.ones((VH, VW), np.float32), M, (OW, OH), borderValue=0)
f = max(1, int(A.feather * OH))
inside = cv2.blur(cv2.erode(inside, np.ones((f, f))), (2 * f + 1, 2 * f + 1))[..., None]

p = subprocess.Popen([FF, "-loglevel", "error", "-i", A.video, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
o = subprocess.Popen([FF, "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", fps, "-i", "-",
                      "-vcodec", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
                      "-y", A.out], stdin=subprocess.PIPE)
n, size = 0, VW * VH * 3
while True:
    b = p.stdout.read(size)
    if len(b) < size: break
    fr = np.frombuffer(b, np.uint8).reshape(VH, VW, 3).astype(np.float32)
    sharp = cv2.warpAffine(fr, M, (OW, OH), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REPLICATE)
    # Desenfoque a un cuarto de resolución (mismo aspecto, 16 veces más rápido).
    small = cv2.resize(sharp, (OW // 4, OH // 4), interpolation=cv2.INTER_AREA)
    ext = cv2.resize(cv2.GaussianBlur(small, (0, 0), 9), (OW, OH), interpolation=cv2.INTER_LINEAR)
    o.stdin.write(np.clip(sharp * inside + ext * (1 - inside), 0, 255).astype(np.uint8).tobytes()); n += 1
o.stdin.close(); o.wait(); print("frames", n, A.out)
