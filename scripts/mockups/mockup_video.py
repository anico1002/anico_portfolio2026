"""Mockup en movimiento: uno o varios móviles (escenas de iphone-mockups.com) con vídeo en la pantalla.

Uso: python3 scripts/mockups/mockup_video.py <receta.json> <salida.mp4>

La receta describe el fondo y los móviles de atrás hacia delante, con los mismos ajustes que
im_compose.py (que hace la imagen fija), para que vídeo e imagen sean el mismo encuadre:

{ "canvas": [2560, 1440], "out": [1920, 1080], "bg": "mockups-src/bg-ev5.jpg",
  "black": 0.07, "vignette": 0.55, "top": 0.7, "xfade": 0.5, "poster": "…jpg",
  "layers": [ { "scene": "mockups-src/im-transparent", "view": "view-3", "video": "…mp4",
                "place": "0.85,0.45,center", "rot": -30, "tint": 0.45, "body": 0.8, "wrap": 0.9, "refl": 0.35 } ] }

Todo lo que no cambia (móvil, sombra, tinte, reflejo del cristal, máscaras) se calcula una vez; por
fotograma solo se proyecta cada pantalla y se apilan las capas. El final se funde con el principio
(xfade) para que el bucle no tenga corte.

2,5D (2026-10-18, Gloop; «opción C»): con "move" en la receta la escena cobra vida sin girar los móviles, y todo
vuelve al punto de partida al final del bucle:
  "move": { "zoom": 0.05, "pan": 30, "bg_depth": 0.35, "beams": [[x, ángulo, amplitud, fase, [b, g, r]], …],
            "beam_width": 7, "beam_gain": 0.35, "gloss": 0.16 }
  · la cámara se acerca y vuelve (zoom) y se desliza de lado (pan, px del lienzo); cada capa se mueve según su
    "depth" (0–1; por defecto 0,7 la de atrás y 1 la de delante) y el fondo con bg_depth: eso es el paralaje;
  · haces de luz de escenario que barren el fondo por detrás de los móviles (beams: x de 0 a 1 en lo alto,
    ángulo y amplitud en grados respecto a la vertical, fase en vueltas, color BGR de 0 a 1);
  · un brillo en diagonal cruza el cristal de los móviles una vez por vaivén (gloss);
  · "cycles": vaivenes por bucle, entero para que cierre (2 en Gloop: con uno cada 21 s se hacía lento);
  · "overscan": aumento fijo de las capas para que el vaivén no enseñe el borde cuando la escena ocupa todo el lienzo;
  · "sweep" (7news, escena de una pieza con muro): una franja de luz de ventana cruza el muro una vez por bucle y la
    luz rasante cambia de ángulo, así que el relieve de la piedra (sacado de la propia foto) se mueve con ella. Todo
    multiplica la luz que ya hay (la sombra sigue siendo sombra) y el móvil queda fuera: { "angle": grados de la
    franja, "width": 0–1, "gain": subida dentro de la franja, "floor": luz fuera de ella, "rake": fuerza del relieve,
    "rake_swing": grados que gira la luz rasante, "soft": penumbra del borde, "mullion": medio ancho del parteluz, "keep_dx"/"keep_dy": canto del móvil que asoma junto a la pantalla }.
"""
import cv2, numpy as np, json, sys, subprocess, os

FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"
R = json.load(open(sys.argv[1])); OUT = sys.argv[2]
CW, CH = R["canvas"]; OW, OH = R.get("out", R["canvas"])
yy, xx = np.mgrid[0:CH, 0:CW].astype(np.float32)


def load_scene(L):
    raw = cv2.imread(f"{L['scene']}/{L['view']}.png", cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    q = np.array(json.load(open(f"{L['scene']}/{L['view']}.json"))["screen"]["quad"], np.float32)
    if L.get("rot"):
        h0, w0 = raw.shape[:2]
        M = cv2.getRotationMatrix2D(tuple(q.mean(0)), L["rot"], 1.0)
        raw = cv2.warpAffine(raw, M, (w0, h0), flags=cv2.INTER_CUBIC, borderValue=0)
        q = (np.hstack([q, np.ones((4, 1), np.float32)]) @ M.T).astype(np.float32)
    sc, cx, anchor = L.get("place", "1,0.5,center").split(","); sc, cx = float(sc), float(cx)
    h0, w0 = raw.shape[:2]
    A = np.float32([[sc, 0, cx * CW - w0 * sc / 2], [0, sc, CH - h0 * sc if anchor == "bottom" else (CH - h0 * sc) / 2]])
    raw = cv2.warpAffine(raw, A, (CW, CH), flags=cv2.INTER_AREA if sc < 1 else cv2.INTER_CUBIC, borderValue=0)
    q = (np.hstack([q, np.ones((4, 1), np.float32)]) @ A.T).astype(np.float32)
    return raw, q


def screen_geom(q, w, h, radius=0.155, k=3):
    m = np.zeros((h, w), np.float32); r = int(radius * w)
    cv2.rectangle(m, (r, 0), (w - r, h), 1, -1); cv2.rectangle(m, (0, r), (w, h - r), 1, -1)
    for c in ((r, r), (w - r, r), (w - r, h - r), (r, h - r)):
        cv2.circle(m, c, r, 1, -1, lineType=cv2.LINE_AA)
    Mk = np.diag([k, k, 1]).astype(np.float64) @ cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q)
    msk = cv2.resize(cv2.warpPerspective(m, Mk, (CW * k, CH * k)), (CW, CH), interpolation=cv2.INTER_AREA)[..., None]
    # para los fotogramas: se reducen antes a un tamaño cercano al de la pantalla y se proyectan sin supermuestreo
    side = np.linalg.norm(q[3] - q[0]); s = min(1.0, side * 1.15 / h)
    sw, sh = int(w * s), int(h * s)
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), q)
    return msk, M, (sw, sh)


# --- fondo ---
B = cv2.imread(R["bg"]).astype(np.float32) / 255
bh, bw = B.shape[:2]; s = max(CW / bw, CH / bh)
B = cv2.resize(B, (int(bw * s + 1), int(bh * s + 1)), interpolation=cv2.INTER_CUBIC)
oy, ox = (B.shape[0] - CH) // 2, (B.shape[1] - CW) // 2; B = B[oy:oy + CH, ox:ox + CW]
blk = R.get("black", 0.07); B = np.clip((B - blk) / (1 - blk), 0, 1) ** 1.15
v = ((xx - CW / 2) / (CW * 0.55)) ** 2 + ((yy - CH / 2) / (CH * 0.6)) ** 2
B = B * (1 - R.get("vignette", 0.55) * np.clip(v, 0, 1))[..., None]
if R.get("top"):
    B = B * (1 - R["top"] * np.clip(1 - yy / (CH * 0.38), 0, 1) ** 1.6)[..., None]

# --- capas: lo estático ---
caps, layers = [], []
for L in R["layers"]:
    cap = cv2.VideoCapture(L["video"]); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    raw, q = load_scene(L); al = raw[:, :, 3:]; rgb = raw[:, :, :3]
    msk, M, ssz = screen_geom(q, w, h)
    lum = rgb.mean(axis=2); base = np.percentile(lum[msk[..., 0] > 0.99], 5)
    refl = np.clip((rgb - base) / max(1e-3, 1 - base), 0, 1) * L.get("refl", 0.35)
    layers.append(dict(L=L, al=al, rgb=rgb, msk=msk, M=M, ssz=ssz, refl=refl, n=n, q=q)); caps.append(cap)

N = min(l["n"] for l in layers); X = int(R.get("xfade", 0.5) * 30); T = N - X
print(f"{N} fotogramas, bucle de {T/30:.2f}s", file=sys.stderr)


# Los fotogramas se leen en orden (no caben enteros en memoria); solo se guardan, ya reducidos,
# los del final que se funden sobre el principio.
for l, c in zip(layers, caps):
    tail = []
    for i in range(N):
        ok, f = c.read()
        if i >= T: tail.append(cv2.resize(f, l["ssz"], interpolation=cv2.INTER_AREA))
    l["tail"] = tail
    c.set(cv2.CAP_PROP_POS_FRAMES, 0)
clips = caps


# lo que depende del fondo (sombra, tinte, light wrap) se calcula con el fotograma 0 y se fija
def statics(l, bgimg):
    L = l["L"]; al = l["al"]
    cast = cv2.GaussianBlur(bgimg, (0, 0), 120); cast = cast / max(1e-3, cast.max())
    body = l["rgb"] * L.get("body", 0.8) * ((1 - L.get("tint", 0.45)) + L.get("tint", 0.45) * (0.35 + 1.3 * cast))
    sh = cv2.GaussianBlur(cv2.warpAffine(al, np.float32([[1, 0, 18], [0, 1, 40]]), (CW, CH)), (0, 0), 45)
    inner = np.clip(al[..., 0] - cv2.GaussianBlur(cv2.erode(al[..., 0], np.ones((9, 9), np.uint8)), (0, 0), 6), 0, 1)
    edge = cv2.GaussianBlur(inner, (0, 0), 3)[..., None]
    wrap = np.clip(cv2.GaussianBlur(bgimg, (0, 0), 25) * edge * L.get("wrap", 0.9) * 1.6, 0, 1)
    l["body"] = body * al; l["shade"] = (1 - 0.65 * np.clip(sh, 0, 1))[..., None]; l["wrap"] = wrap


MV = R.get("move")


def affine(d, i):
    """Cámara 2,5D para una capa a profundidad d en el fotograma i (matriz 3×3 sobre el lienzo)."""
    if not MV: return np.eye(3)
    ph = 2 * np.pi * MV.get("cycles", 1) * i / T
    sc = 1 + MV.get("zoom", 0.05) * d * (0.5 - 0.5 * np.cos(ph))
    dx = MV.get("pan", 30) * d * np.sin(ph); dy = -0.3 * MV.get("pan", 30) * d * np.sin(ph)
    return np.array([[sc, 0, CW / 2 * (1 - sc) + dx], [0, sc, CH / 2 * (1 - sc) + dy], [0, 0, 1]])


def warp(a, A):
    """Deforma un array de cualquier número de canales (cv2 admite hasta 4 por llamada)."""
    if np.allclose(A, np.eye(3)): return a
    a3 = a if a.ndim == 3 else a[..., None]
    outs = [cv2.warpAffine(np.ascontiguousarray(a3[..., k:k + 4]), A[:2].astype(np.float32), (CW, CH), flags=cv2.INTER_LINEAR,
                           borderMode=cv2.BORDER_REPLICATE) for k in range(0, a3.shape[2], 4)]
    outs = [o if o.ndim == 3 else o[..., None] for o in outs]
    return np.concatenate(outs, axis=2)


# Haces de escenario a un cuarto de resolución (son luz difusa): ángulo de cada píxel visto desde el foco.
QW, QH = CW // 4, CH // 4
qy, qx = np.mgrid[0:QH, 0:QW].astype(np.float32)


def beams(i):
    ph = 2 * np.pi * MV.get("cycles", 1) * i / T; acc = np.zeros((QH, QW, 3), np.float32)
    for x0, ang, amp, fase, col in MV.get("beams", []):
        ox, oy = x0 * QW, -0.08 * QH
        th = np.radians(ang + amp * np.sin(ph + 2 * np.pi * fase))
        a = np.arctan2(qx - ox, qy - oy) - th
        r = np.hypot(qx - ox, qy - oy) / QH
        acc += np.exp(-(a / np.radians(MV.get("beam_width", 7))) ** 2)[..., None] * np.exp(-r * 0.9)[..., None] * np.float32(col)
    acc = cv2.GaussianBlur(acc, (0, 0), 3)
    return cv2.resize(acc, (CW, CH), interpolation=cv2.INTER_LINEAR) * MV.get("beam_gain", 0.35)


def gloss(i):
    # Banda diagonal que entra por la izquierda y sale por la derecha una vez por vuelta (fuera de cuadro en la costura).
    u = (xx + 0.55 * yy) / (CW + 0.55 * CH) - (-0.25 + 1.5 * (MV.get("cycles", 1) * i / T % 1))
    return (np.exp(-(u / 0.035) ** 2) * MV.get("gloss", 0.16))[..., None]


def keep_mask(l):
    """Silueta del móvil a partir del cuadro de la pantalla: el cuadro un poco mayor (marco) y desplazado (canto)."""
    q = l["q"]; c = q.mean(0); sw = MV["sweep"]
    big = (q - c) * 1.05 + c
    pts = np.vstack([big, big + np.float32([sw.get("keep_dx", 28), sw.get("keep_dy", 8)])])
    m = np.zeros((CH, CW), np.float32)
    cv2.fillConvexPoly(m, cv2.convexHull(pts.astype(np.int32)), 1, lineType=cv2.LINE_AA)
    return cv2.GaussianBlur(m, (0, 0), 3)[..., None]


def sweep_gain(l, i):
    """Luz de ventana sobre el muro y el suelo en el fotograma i, como factor sobre la luz de la foto (2026-10-18, v2:
    la primera, una franja recta que cruzaba todo, «se siente poco real»). Cada punto se lleva por su rayo hasta la arista
    muro-suelo y allí se mide la ventana: así la luz dobla en la esquina y la mancha tiene su forma (dos paños, parteluz,
    travesaño y final), con la penumbra abriéndose al alejarse de la arista. El relieve rasante solo se enciende donde da
    la luz, el móvil la corta con su sombra y su canto brilla cuando le llega. La ventana no cruza: deriva despacio
    alrededor del móvil y, una vez por bucle, pasa una nube."""
    sw = MV["sweep"]; ph = 2 * np.pi * i / T
    if "geo" not in l:
        x0, y0, x1, y1 = sw["junction"]; k = (y1 - y0) / (x1 - x0); b = y0 - k * x0
        X, Y = xx[::2, ::2], yy[::2, ::2]  # a media resolución basta para la luz (en px del lienzo)
        def hit(d):
            dx, dy = d; t = (b + k * X - Y) / (dy - k * dx); return X + t * dx, np.abs(t) * np.hypot(dx, dy)
        wall = Y < b + k * X
        aw, af = np.radians(sw.get("wall_angle", 62)), np.radians(sw.get("floor_angle", 152))
        hw, dw = hit((np.cos(aw), np.sin(aw))); hf, df = hit((np.cos(af), np.sin(af)))
        l["geo"] = (np.where(wall, hw, hf), np.where(wall, dw, df), wall)
        lum = cv2.cvtColor((l["rgb"] * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        h = cv2.GaussianBlur(lum, (0, 0), 1.6)
        gx, gy = cv2.Sobel(h, cv2.CV_32F, 1, 0), cv2.Sobel(h, cv2.CV_32F, 0, 1)
        n = max(1e-4, float(np.std(np.hypot(gx, gy))))
        a = np.radians(sw.get("rake_dir", -135))
        l["rake"] = np.clip((gx * np.cos(a) + gy * np.sin(a)) / n, -3, 3)
        keep = keep_mask(l)[..., 0]
        sh = cv2.warpAffine(keep, np.float32([[1, 0, sw.get("shadow_dx", 70)], [0, 1, sw.get("shadow_dy", 14)]]), (CW, CH))
        l["shadow"] = cv2.GaussianBlur(np.clip(sh - keep, 0, 1), (0, 0), 9)
        l["frame"] = np.clip(keep - cv2.GaussianBlur(l["msk"][..., 0], (0, 0), 2), 0, 1)
    xh, dist, wall = l["geo"]
    c = sw.get("center", 900) + sw.get("drift", 120) * np.sin(ph)
    pen = sw.get("soft", 6) + sw.get("spread", 0.03) * dist
    def edge(v): return np.clip(v / np.maximum(pen, 1) + 0.5, 0, 1)
    u = xh - c; w2 = sw.get("width", 300) / 2; mu = sw.get("mullion", 14) / 2
    across = edge(w2 - np.abs(u)) * (1 - edge(mu - np.abs(u)) * sw.get("mullion_dark", 0.9))
    # A lo largo del rayo: la luz llega hasta el final de la ventana y la cruza un travesaño.
    top = np.where(wall, sw.get("wall_len", 760), sw.get("floor_len", 300)); tr = sw.get("transom", 0.45) * top
    along = edge(top - dist) * (1 - sw.get("bar_dark", 0.9) * edge(sw.get("bar", 12) / 2 - np.abs(dist - tr)))
    patch = cv2.resize((across * along).astype(np.float32), (CW, CH), interpolation=cv2.INTER_LINEAR)
    patch *= 1 - 0.85 * l["shadow"]
    if os.environ.get("DEBUG") and i == 0: cv2.imwrite(os.environ["DEBUG"], (patch * 255).astype(np.uint8))
    cloud = 1 - sw.get("cloud", 0.45) * (0.5 - 0.5 * np.cos(ph)) ** 4  # una nube a mitad del bucle
    lit = patch * cloud
    gain = sw.get("floor", 0.9) + sw.get("gain", 0.8) * lit * (1 + sw.get("rake", 0.18) * l["rake"])
    # El suelo es casi negro y multiplicar no lo levanta: ahí la luz también suma (se aplica en compose como "add").
    l["add"] = (lit * sw.get("add", 0.07) * (1 - l["keep"][..., 0]))[..., None]
    # El canto del móvil se enciende cuando le da la luz (como si fuera muro: misma mancha).
    gain = gain * (1 - l["keep_frame"]) + (1 + sw.get("rim", 0.5) * lit) * l["keep_frame"] if "keep_frame" in l else gain
    return gain[..., None]


def compose(i, init=False):
    cur = B
    if MV and not init:
        cur = warp(B, affine(MV.get("bg_depth", 0.35), i) @ np.diag([1.04, 1.04, 1]) @ np.array([[1, 0, -CW * 0.02], [0, 1, -CH * 0.02], [0, 0, 1]]))
        cur = 1 - (1 - cur) * (1 - np.clip(beams(i), 0, 1))
    for k, (l, clip) in enumerate(zip(layers, clips)):
        if init: statics(l, cur)
        d = l["L"].get("depth", 1.0 if k == len(layers) - 1 else 0.7)
        A = affine(d, i)
        if MV and MV.get("overscan"):
            o = MV["overscan"]; A = A @ np.array([[o, 0, CW / 2 * (1 - o)], [0, o, CH / 2 * (1 - o)], [0, 0, 1]])
        body = l["body"]
        if MV and MV.get("sweep") and not init:
            if "keep" not in l: l["keep"] = keep_mask(l)
            g = sweep_gain(l, i)
            if "keep_frame" not in l: l["keep_frame"] = l["frame"]
            body = body * (1 + (g - 1) * np.maximum(1 - l["keep"], l["keep_frame"][..., None])) + l["add"] * l["al"]
        st = warp(np.concatenate([l["al"], body, l["shade"], l["wrap"], l["msk"], l["refl"]], axis=2), A)
        al, body, shade, wrp, msk, refl = st[..., 0:1], st[..., 1:4], st[..., 4:5], st[..., 5:8], st[..., 8:9], st[..., 9:12]
        if MV: refl = np.clip(refl + gloss(i), 0, 1)
        under = cur * shade * (1 - al) + body
        under = 1 - (1 - under) * (1 - wrp)
        ok, f = clip.read()
        f = cv2.resize(f, l["ssz"], interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        if i < X:
            t = i / X; f = f * t + l["tail"][i].astype(np.float32) / 255 * (1 - t)
        scr = np.clip(cv2.warpPerspective(f, (A @ l["M"]).astype(np.float64), (CW, CH), flags=cv2.INTER_LINEAR), 0, 1)
        lit = 1 - (1 - scr) * (1 - refl)
        cur = under * (1 - msk) + lit * msk
    return cur


compose(0, init=True)
for c in caps: c.set(cv2.CAP_PROP_POS_FRAMES, 0)
p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-c:v", "libx264", "-crf", str(R.get("crf", 20)), "-preset", "slow", "-pix_fmt", "yuv420p",
                      "-movflags", "+faststart", "-an", OUT], stdin=subprocess.PIPE)
# STILLS=carpeta: solo cuatro fotogramas sueltos (al 0, 25, 50 y 75 % del bucle), para ajustar la luz sin esperar al vídeo.
import os
STILLS = os.environ.get("STILLS")
if STILLS:
    p.stdin.close(); p.wait(); os.remove(OUT)
    for i in range(T):
        if i not in (0, T // 4, T // 2, 3 * T // 4):
            for c in clips: c.read()
            continue
        fr = compose(i)
        cv2.imwrite(f"{STILLS}/s-{i:04d}.jpg", cv2.resize(np.clip(fr * 255, 0, 255).astype(np.uint8), (OW // 2, OH // 2), interpolation=cv2.INTER_AREA))
    sys.exit()
for i in range(T):
    fr = compose(i)
    out = cv2.resize(np.clip(fr * 255, 0, 255).astype(np.uint8), (OW, OH), interpolation=cv2.INTER_AREA)
    if i == 0 and R.get("poster"):
        cv2.imwrite(R["poster"], out, [cv2.IMWRITE_JPEG_QUALITY, 90])
    p.stdin.write(out.tobytes())
    if i % 60 == 0: print(f"{i}/{T}", file=sys.stderr)
p.stdin.close(); p.wait()
print(OUT, file=sys.stderr)
