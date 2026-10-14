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
"""
import cv2, numpy as np, json, sys, subprocess

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
    layers.append(dict(L=L, al=al, rgb=rgb, msk=msk, M=M, ssz=ssz, refl=refl, n=n)); caps.append(cap)

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


def screen_frame(i, l, cap):
    ok, f = cap.read()
    f = cv2.resize(f, l["ssz"], interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    if i < X:  # el final se funde sobre el principio
        t = i / X; f = f * t + l["tail"][i].astype(np.float32) / 255 * (1 - t)
    return cv2.warpPerspective(f, l["M"], (CW, CH), flags=cv2.INTER_LINEAR)


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


def compose(i, init=False):
    cur = B
    for l, clip in zip(layers, clips):
        if init: statics(l, cur)
        under = cur * l["shade"] * (1 - l["al"]) + l["body"]
        under = 1 - (1 - under) * (1 - l["wrap"])
        scr = np.clip(screen_frame(i, l, clip), 0, 1)
        lit = 1 - (1 - scr) * (1 - l["refl"])
        cur = under * (1 - l["msk"]) + lit * l["msk"]
    return cur


compose(0, init=True)
for c in caps: c.set(cv2.CAP_PROP_POS_FRAMES, 0)
p = subprocess.Popen([FF, "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{OW}x{OH}", "-r", "30", "-i", "-",
                      "-c:v", "libx264", "-crf", str(R.get("crf", 20)), "-preset", "slow", "-pix_fmt", "yuv420p",
                      "-movflags", "+faststart", "-an", OUT], stdin=subprocess.PIPE)
for i in range(T):
    fr = compose(i)
    out = cv2.resize(np.clip(fr * 255, 0, 255).astype(np.uint8), (OW, OH), interpolation=cv2.INTER_AREA)
    if i == 0 and R.get("poster"):
        cv2.imwrite(R["poster"], out, [cv2.IMWRITE_JPEG_QUALITY, 90])
    p.stdin.write(out.tobytes())
    if i % 60 == 0: print(f"{i}/{T}", file=sys.stderr)
p.stdin.close(); p.wait()
print(OUT, file=sys.stderr)
