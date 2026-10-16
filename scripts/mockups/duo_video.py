"""La landing de SwifT en el iPhone Duo plegable (Pixeden, PSD de Alberto) — 2026-10-16.
Entradas (mockups-src/iphone-duo/, salidas de Photoshop por script, scripts/mockups/photoshop/duo*.jsx):
  duo-light.png   escena con fondo claro y pantalla negra (con su brillo)
  duo-black.png / duo-magenta.png   para la máscara exacta de la pantalla (esquinas redondas)
  duo-markers.png marcas de color en las esquinas del objeto inteligente → homografía
Contenido: captura a toda página de la web (2x) + barra de navegación, en bucle baja-sube.
python3 duo_video.py <full.png> <nav.png> <salida.mp4> <poster.jpg> [--crop=x0,y0,x1,y1]
  miniatura 16:10 de SwifT: --crop=672,849,6058,4215
  cabecera en franja (el dispositivo en el 56 % de arriba): --crop=-786,1002,7516,6191
"""
import sys, subprocess, numpy as np, cv2
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
full, navp, out, poster = sys.argv[1:5]
# Encuadre opcional (2026-10-17, miniatura de SwifT): --crop x0,y0,x1,y1 sobre el PSD de 6500x5000.
_crop = next((a.split("=")[1] for a in sys.argv[5:] if a.startswith("--crop=")), None)
D = "mockups-src/iphone-duo/"
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
CROP = tuple(int(v) for v in _crop.split(",")) if _crop else (700, 650, 5900, 4250)  # x0, y0, x1, y1 sobre 6500x5000
OW = 1600; k = OW / (CROP[2] - CROP[0]); OH = round((CROP[3] - CROP[1]) * k) // 2 * 2
def load(n):
    # El encuadre puede salirse del PSD (cabecera en franja de SwifT): lo que falta se rellena repitiendo el borde, que
    # es fondo liso, y se suaviza para que no se noten las rayas.
    im = cv2.imread(D + n).astype(np.float32); h, w = im.shape[:2]
    pad = [max(0, -CROP[1]), max(0, CROP[3] - h), max(0, -CROP[0]), max(0, CROP[2] - w)]
    if any(pad):
        big = cv2.copyMakeBorder(im, *pad, cv2.BORDER_REPLICATE)
        soft = cv2.GaussianBlur(big, (0, 0), 60)
        inside = np.zeros(big.shape[:2], np.float32); inside[pad[0]:pad[0] + h, pad[2]:pad[2] + w] = 1
        inside = cv2.GaussianBlur(inside, (0, 0), 40)[..., None]
        im = big * inside + soft * (1 - inside)
        x0, y0 = CROP[0] + pad[2], CROP[1] + pad[0]
        im = im[y0:y0 + CROP[3] - CROP[1], x0:x0 + CROP[2] - CROP[0]]
    else:
        im = im[CROP[1]:CROP[3], CROP[0]:CROP[2]]
    return cv2.resize(im, (OW, OH), interpolation=cv2.INTER_AREA)
base = load("duo-light.png"); blk = load("duo-black.png"); mag = load("duo-magenta.png")
mask = np.clip((mag[..., 2] - blk[..., 2]) / 200.0, 0, 1)[..., None]
# Homografía: esquinas de las marcas en el objeto inteligente (3236x2224, a 200 px del borde) → foto.
SO = (3236, 2224); I = 200
src_pts = np.float32([[I, I], [SO[0] - I, I], [SO[0] - I, SO[1] - I], [I, SO[1] - I]])
dst = np.float32([[2240.9, 1605.3], [4632.5, 1656.6], [5103.9, 3411.3], [2656.4, 3428.5]])
dst = ((dst - [CROP[0], CROP[1]]) * k).astype(np.float32)  # vale también con encuadre fuera del PSD (coordenadas negativas)
CW, CH = 1618, 1112  # contenido a medio tamaño del objeto inteligente
Hm = cv2.getPerspectiveTransform((src_pts * (CW / SO[0])).astype(np.float32), dst)
glare = base / 255.0
# Página: 2224 de ancho (1112 a 2x), barra de 120 px fija arriba.
page = Image.open(full).convert("RGB"); nav = Image.open(navp).convert("RGB").resize((page.width, 120))
NAV = 120; VIEW = round(page.width * SO[1] / SO[0]) - NAV
body = page.crop((0, NAV, page.width, page.height)); maxy = body.height - VIEW
def ease(t): return 4 * t * t * t if t < .5 else 1 - (-2 * t + 2) ** 3 / 2
plan = [("hold", 1.2, 0, 0), ("move", 14, 0, maxy), ("hold", 1.0, maxy, maxy), ("move", 6, maxy, 0)]
o = subprocess.Popen([FF, "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-vcodec", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", out], stdin=subprocess.PIPE)
first = True
for kind, sec, a, z in plan:
    n = int(sec * 30)
    for i in range(n):
        t = i / (n - 1)
        y = round(a + (z - a) * (ease(t) if kind == "move" else 1))
        fr = Image.new("RGB", (page.width, NAV + VIEW)); fr.paste(nav, (0, 0)); fr.paste(body.crop((0, y, page.width, y + VIEW)), (0, NAV))
        c = cv2.cvtColor(np.asarray(fr.resize((CW, CH), Image.LANCZOS)), cv2.COLOR_RGB2BGR).astype(np.float32) / 255.0
        w = cv2.warpPerspective(c, Hm, (OW, OH), flags=cv2.INTER_LINEAR)
        scr = 1 - (1 - w) * (1 - glare)  # el brillo del cristal, en modo trama, encima de la web
        img = base / 255.0 * (1 - mask) + scr * mask
        b8 = np.clip(img * 255, 0, 255).astype(np.uint8)
        if first: cv2.imwrite(poster, b8, [cv2.IMWRITE_JPEG_QUALITY, 88]); first = False
        o.stdin.write(b8.tobytes())
o.stdin.close(); o.wait(); print("ok", OW, OH)
