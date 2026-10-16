"""Apple Watch recortado de una plantilla en 3/4 (con su pantalla en perspectiva) sobre una escena de móvil.

Uso: python3 scripts/mockups/place_watch.py <escena.mp4> <pantalla_reloj.mp4> <reloj.png> <reloj.json> <salida.mp4>
       (7News: clips/reloj-escena.mp4 clips/aviso-reloj.mp4 mockups-src/watch-s10/watch-flip.{png,json} --contrast 0.5)
       [--c 1285,525] [--h 427] [--rot 0] [--poster salida.jpg:3.5]

`reloj.png` es el reloj recortado con alfa y `reloj.json` trae {"size": [w, h], "screen": [[x, y] × 4]} con las
esquinas de su pantalla (TL, TR, BR, BL). Los dos salen del PSD gratuito «Apple Watch Series 10 Mockup»
(objeto inteligente «Replace Watch Face»: nonAffineTransform); el reloj se recortó del fondo gris con GrabCut y
se volteó en horizontal (feedback de Alberto, 2026-10-14: la correa hacia la derecha, junto al iPhone).
La pantalla del aviso se encaja con su homografía y esquinas redondeadas, con un brillo tenue de cristal; el
reloj arroja una sombra suave sobre lo que tiene detrás.
"""
import argparse, json, subprocess
import cv2, numpy as np

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
ap = argparse.ArgumentParser()
ap.add_argument("scene"); ap.add_argument("screen"); ap.add_argument("watch"); ap.add_argument("meta"); ap.add_argument("out")
ap.add_argument("--c", default="1285,525"); ap.add_argument("--h", type=float, default=427)  # 2026-10-14: un 30 % más pequeño
ap.add_argument("--rot", type=float, default=0); ap.add_argument("--shadow", default="-30,30")
ap.add_argument("--poster"); ap.add_argument("--crf", type=int, default=20)
# Contraste del reloj (2026-10-17: se veía plano frente al fondo): sombras más hondas y luces más vivas. 0 = como antes.
ap.add_argument("--contrast", type=float, default=0)
a = ap.parse_args()

wt = cv2.imread(a.watch, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
wh, ww = wt.shape[:2]
meta = json.load(open(a.meta)); Q = np.float32(meta["screen"])
cx, cy = (float(v) for v in a.c.split(","))
s = a.h / wh
t = np.radians(a.rot)
# Reloj → escena: escala, giro en el plano y traslación (centro del PNG en --c).
A = np.float64([[s * np.cos(t), -s * np.sin(t), 0], [s * np.sin(t), s * np.cos(t), 0], [0, 0, 1]])
A[0, 2] = cx - (A[0, 0] * ww / 2 + A[0, 1] * wh / 2)
A[1, 2] = cy - (A[1, 0] * ww / 2 + A[1, 1] * wh / 2)


def rounded(w, h, r):
    m = np.zeros((h, w), np.float32)
    cv2.rectangle(m, (r, 0), (w - r, h), 1, -1); cv2.rectangle(m, (0, r), (w, h - r), 1, -1)
    for x, y in ((r, r), (w - r, r), (w - r, h - r), (r, h - r)):
        cv2.circle(m, (x, y), r, 1, -1, lineType=cv2.LINE_AA)
    return m


def frames(path):
    cap = cv2.VideoCapture(path)
    while True:
        ok, f = cap.read()
        if not ok: return
        yield f


out_vid = a.out.lower().endswith(".mp4"); p = None; shadow = None; K = 2
n = int(cv2.VideoCapture(a.scene).get(cv2.CAP_PROP_FRAME_COUNT))
for i, (sc, scr) in enumerate(zip(frames(a.scene), frames(a.screen))):
    if i >= n: break
    S = sc.astype(np.float32) / 255; H, W = S.shape[:2]
    if i == 0:
        Ak = np.diag([K, K, 1]) @ A
        warp = lambda im, M: cv2.resize(cv2.warpPerspective(im, M, (W * K, H * K), flags=cv2.INTER_CUBIC), (W, H), interpolation=cv2.INTER_AREA)
        Wrgb = warp(wt[:, :, :3], Ak); Wa = np.clip(warp(wt[:, :, 3], Ak), 0, 1)[..., None]
        if a.contrast:
            c = a.contrast
            blur = cv2.GaussianBlur(Wrgb, (0, 0), 6 * K)
            Wrgb = np.clip(Wrgb + (Wrgb - blur) * 1.6 * c, 0, 1)  # claridad: contraste local, no se pierden detalles
            Wrgb = np.clip(Wrgb, 0, 1) ** (1 + 0.35 * c)  # sombras algo más hondas
            Wrgb = np.clip(Wrgb * (1 + 0.25 * c), 0, 1)  # y luces más vivas
        sh, sw = scr.shape[:2]
        Ms = Ak @ cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), Q).astype(np.float64)
        Sm = np.clip(warp(rounded(sw, sh, int(sw * 0.16)), Ms), 0, 1)[..., None]
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        glare = (np.exp(-(((xx - cx) + (yy - cy) * 1.2) / (a.h * 0.18)) ** 2) * 0.07)[..., None]
        sx, sy = (float(v) for v in a.shadow.split(","))
        shadow = cv2.GaussianBlur(cv2.warpAffine(Wa[..., 0], np.float32([[1, 0, sx], [0, 1, sy]]), (W, H)), (0, 0), 24)[..., None]
    screen = warp(scr.astype(np.float32) / 255, Ms) * 0.94
    screen = 1 - (1 - screen) * (1 - glare)
    S = S * (1 - 0.5 * shadow)
    out = S * (1 - Wa) + Wrgb * Wa
    out = out * (1 - Sm) + screen * Sm
    out = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    if a.poster and i == int(float(a.poster.split(":")[1]) * 30):
        cv2.imwrite(a.poster.split(":")[0], cv2.resize(out, (1920, int(1920 * H / W) // 2 * 2)), [cv2.IMWRITE_JPEG_QUALITY, 90])
    if not out_vid:
        cv2.imwrite(a.out, out, [cv2.IMWRITE_JPEG_QUALITY, 92]); break
    if p is None:
        p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
                              "-vf", "scale=1920:-2", "-c:v", "libx264", "-crf", str(a.crf), "-preset", "slow", "-pix_fmt", "yuv420p",
                              "-movflags", "+faststart", "-an", a.out], stdin=subprocess.PIPE)
    p.stdin.write(out.tobytes())
if p: p.stdin.close(); p.wait()
print(a.out)
