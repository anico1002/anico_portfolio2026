"""Cierra el bucle de un render de Blender con --tail (2026-10-18). El giro ya es periódico, pero el vídeo de la
pantalla no: los primeros T fotogramas se funden con los T que se renderizaron después del final (misma pose), así
el último fotograma enlaza con el primero sin salto. Monta el MP4 y su póster.

python3 scripts/mockups/blender/loop.py <carpeta con f-0001.png…> <N> <T> <salida.mp4>
"""
import sys, subprocess, os, tempfile
from PIL import Image

src, N, T, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
tmp = tempfile.mkdtemp()
for k in range(1, N + 1):
    a = Image.open(f"{src}/f-{k:04d}.png").convert("RGB")
    if k <= T:
        b = Image.open(f"{src}/f-{N + k:04d}.png").convert("RGB")
        a = Image.blend(b, a, k / (T + 1))
    a.save(f"{tmp}/{k:04d}.png")
subprocess.run([FF, "-v", "error", "-y", "-framerate", "30", "-i", f"{tmp}/%04d.png", "-c:v", "libx264", "-crf", "20", "-preset", "slow",
                "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", out], check=True)
Image.open(f"{tmp}/0001.png").save(out.replace(".mp4", "-poster.jpg"), quality=88)
print(out, os.path.getsize(out) // 1024, "KB")
