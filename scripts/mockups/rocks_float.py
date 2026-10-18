"""ElReto en 2,5D (2026-10-18): las rocas flotan alrededor del móvil, la cámara se acerca con paralaje y el color de la
pantalla se refleja en la piedra. Usa las capas de scripts/mockups/rock_layers.py. Cada caso con su movimiento: Dovla
gira, 7news pasa la luz, Gloop barren los haces y aquí flotan las rocas.

python3 scripts/mockups/rocks_float.py scripts/case-media/clips/elreto-flow.mp4 public/maqueta/elreto/media/hero-25d-v2.mp4
  (args: <vídeo de la app> <salida.mp4>; la cabecera usa el recorrido entero, elreto-flow)   (STILLS=carpeta: cuatro fotogramas sueltos)
"""
import cv2, numpy as np, json, sys, subprocess, os

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
D = "mockups-src/im-darkrock/"; C = D + "capas/"
VIDEO, OUT = sys.argv[1], sys.argv[2]
OW, OH = 1920, 1280
ZOOM, PAN, OVER = 0.025, 14, 1.035  # acercamiento, deslizamiento (px) y margen para que no asome el borde
GLOW = 0.5  # cuánto tiñe la pantalla a las rocas
CYCLES = 3  # vaivenes por bucle: con el recorrido entero de la app (44 s), uno cada ~15 s

def rd(n): return cv2.imread(C + n, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
bg = rd("fondo.png"); H, W = bg.shape[:2]
front = rd("frente.png")
rocks = [rd(f) for f in sorted(os.listdir(C)) if f.startswith("roca-")]
q = np.float32(json.load(open(D + "view-1.json"))["screen"]["quad"])

# Pantalla: máscara de esquinas redondas proyectada y el reflejo del cristal sacado de la propia escena.
cap = cv2.VideoCapture(VIDEO); N = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
vw, vh = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
m = np.zeros((vh, vw), np.float32); r = int(0.155 * vw)
cv2.rectangle(m, (r, 0), (vw - r, vh), 1, -1); cv2.rectangle(m, (0, r), (vw, vh - r), 1, -1)
for c in ((r, r), (vw - r, r), (vw - r, vh - r), (r, vh - r)): cv2.circle(m, c, r, 1, -1, lineType=cv2.LINE_AA)
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [vw, 0], [vw, vh], [0, vh]]), q)
msk = cv2.warpPerspective(m, M, (W, H))[..., None]
lum = front[..., :3].mean(2); base = np.percentile(lum[msk[..., 0] > 0.99], 5)
refl = np.clip((front[..., :3] - base) / max(1e-3, 1 - base), 0, 1) * 0.45

# Cuánto le llega a cada punto la luz de la pantalla: cae con la distancia al móvil.
inside = (msk[..., 0] > 0.5).astype(np.uint8)
dist = cv2.distanceTransform(1 - inside, cv2.DIST_L2, 5)
fall = np.exp(-dist / 320)[..., None].astype(np.float32)

X = int(0.4 * 30); T = N - X
tail = []
for i in range(N):
    ok, f = cap.read()
    if i >= T: tail.append(f)
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

def cam(d, ph):
    sc = OVER * (1 + ZOOM * d * (0.5 - 0.5 * np.cos(ph)))
    dx = PAN * d * np.sin(ph); dy = -0.4 * PAN * d * np.sin(ph)
    return np.array([[sc, 0, W / 2 * (1 - sc) + dx], [0, sc, H / 2 * (1 - sc) + dy], [0, 0, 1]])

# Cada roca, su deriva: elipse de (ax, ay) px y giro de rot grados, con su fase. Poco recorrido de lado: la piedra que
# se esconde tras la losa solo está prolongada unos 15 px.
DRIFT = [(10, 22, 0.8, 0.0), (12, 16, -0.7, 0.37), (10, 20, 0.8, 0.71)]
cents = []
for rk in rocks:
    ys, xs = np.nonzero(rk[..., 3] > 0.5); cents.append((xs.mean(), ys.mean()))

def rock_m(k, ph):
    ax, ay, rot, fz = DRIFT[k % len(DRIFT)]; p = ph + 2 * np.pi * fz
    R = cv2.getRotationMatrix2D(cents[k], rot * np.sin(p), 1.0)
    R[0, 2] += ax * np.sin(p); R[1, 2] += ay * np.cos(p)
    return np.vstack([R, [0, 0, 1]])

def warp(a, A, border=cv2.BORDER_REPLICATE): return cv2.warpAffine(a, A[:2].astype(np.float32), (W, H), flags=cv2.INTER_LINEAR, borderMode=border)

def over(dst, src):
    a = src[..., 3:]; return dst * (1 - a) + src[..., :3] * a

def frame(i, f):
    ph = 2 * np.pi * CYCLES * i / T
    f = f.astype(np.float32) / 255
    if i < X: t = i / X; f = f * t + tail[i].astype(np.float32) / 255 * (1 - t)
    # Color de la parte más luminosa de la pantalla (la media se iba a negro: la app tiene mucho fondo oscuro).
    px = cv2.resize(f, (24, 48), interpolation=cv2.INTER_AREA).reshape(-1, 3); lu = px.mean(1)
    tint = px[lu >= np.percentile(lu, 75)].mean(0)
    out = warp(bg, cam(0.3, ph))
    Af = cam(1.0, ph)
    glow = warp(fall, Af)[..., None] * tint * GLOW
    for k, rk in enumerate(rocks):
        # En espejo más allá del borde: las rocas que corta la imagen siguen siendo piedra al alejarse de él.
        w = warp(rk, cam(0.7, ph) @ rock_m(k, ph), cv2.BORDER_REFLECT)
        w[..., :3] = w[..., :3] * (1 + 2 * glow)  # multiplica: tiñe los relieves con luz y deja negras las sombras
        out = over(out, w)
    out = over(out, warp(front, Af))
    scr = np.clip(cv2.warpPerspective(f, (Af @ M).astype(np.float64), (W, H), flags=cv2.INTER_LINEAR), 0, 1)
    mk = warp(msk, Af)[..., None]; rf = warp(refl, Af)
    lit = 1 - (1 - scr) * (1 - rf)
    return out * (1 - mk) + lit * mk

STILLS = os.environ.get("STILLS")
if STILLS:
    for i in range(T):
        ok, f = cap.read()
        if i in (0, T // 4, T // 2, 3 * T // 4):
            cv2.imwrite(f"{STILLS}/r-{i:04d}.jpg", cv2.resize(np.clip(frame(i, f) * 255, 0, 255).astype(np.uint8), (OW // 2, OH // 2), interpolation=cv2.INTER_AREA))
    sys.exit()
p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", OUT], stdin=subprocess.PIPE)
for i in range(T):
    ok, f = cap.read()
    o = cv2.resize(np.clip(frame(i, f) * 255, 0, 255).astype(np.uint8), (OW, OH), interpolation=cv2.INTER_AREA)
    if i == 0: cv2.imwrite(OUT.replace(".mp4", "-poster.jpg"), o, [cv2.IMWRITE_JPEG_QUALITY, 90])
    p.stdin.write(o.tobytes())
p.stdin.close(); p.wait(); print(OUT, T, "fotogramas", file=sys.stderr)
