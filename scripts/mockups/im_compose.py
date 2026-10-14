"""Compone una captura dentro de una escena de iphone-mockups.com (capa view-N.png + view-N.json).

Uso: python3 scripts/mockups/im_compose.py <escena_dir> <view> <captura.png> <salida.jpg> [--refl 0.6] [--radius 0.155]

La escena trae el móvil con la pantalla apagada (cristal oscuro con reflejos) y el cuadrilátero
de la pantalla. La captura se proyecta con homografía y esquinas redondeadas; el reflejo del cristal
se devuelve encima en modo trama (screen), así la pantalla no queda plana.
"""
import cv2, numpy as np, json, sys, argparse

ap = argparse.ArgumentParser()
ap.add_argument("scene"); ap.add_argument("view"); ap.add_argument("screen"); ap.add_argument("out")
ap.add_argument("--refl", type=float, default=0.6)
ap.add_argument("--radius", type=float, default=0.155, help="radio de esquina / ancho de la captura")
ap.add_argument("--ss", type=int, default=3, help="supermuestreo de bordes")
ap.add_argument("--bg", help="fondo para escenas con transparencia (se ajusta al lienzo)")
ap.add_argument("--black", type=float, default=0.07, help="punto negro del fondo")
ap.add_argument("--vignette", type=float, default=0.55)
ap.add_argument("--wrap", type=float, default=0.9)
ap.add_argument("--rot", type=float, default=0.0, help="giro del móvil en grados (positivo = antihorario)")
ap.add_argument("--top", type=float, default=0.0, help="oscurece la franja de arriba (legibilidad del menú)")
ap.add_argument("--canvas", help="lienzo nuevo AxB; la escena se escala con --place")
ap.add_argument("--place", default="1,0.5,bottom", help="escala,centro_x(0-1),bottom|center")
ap.add_argument("--tint", type=float, default=0.45)
ap.add_argument("--body", type=float, default=0.8)
a = ap.parse_args()

RAW = cv2.imread(f"{a.scene}/{a.view}.png", cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
q = np.array(json.load(open(f"{a.scene}/{a.view}.json"))["screen"]["quad"], np.float32)
if a.rot:
    Hh0, Ww0 = RAW.shape[:2]
    R = cv2.getRotationMatrix2D(tuple(q.mean(0)), a.rot, 1.0)
    RAW = cv2.warpAffine(RAW, R, (Ww0, Hh0), flags=cv2.INTER_CUBIC, borderValue=0)
    q = (np.hstack([q, np.ones((4, 1), np.float32)]) @ R.T).astype(np.float32)
if a.canvas:
    CW, CH = map(int, a.canvas.split("x")); sc, cx, anchor = a.place.split(","); sc, cx = float(sc), float(cx)
    h0, w0 = RAW.shape[:2]
    tx = cx * CW - w0 * sc / 2
    ty = CH - h0 * sc if anchor == "bottom" else (CH - h0 * sc) / 2
    A = np.float32([[sc, 0, tx], [0, sc, ty]])
    RAW = cv2.warpAffine(RAW, A, (CW, CH), flags=cv2.INTER_AREA if sc < 1 else cv2.INTER_CUBIC, borderValue=0)
    q = (np.hstack([q, np.ones((4, 1), np.float32)]) @ A.T).astype(np.float32)
L = RAW[:, :, :3]
if a.bg and RAW.shape[2] == 4:
    al = RAW[:, :, 3:]
    B = cv2.imread(a.bg).astype(np.float32) / 255
    bh, bw = B.shape[:2]; Hh, Ww = L.shape[:2]; sc = max(Ww / bw, Hh / bh)
    B = cv2.resize(B, (int(bw * sc + 1), int(bh * sc + 1)), interpolation=cv2.INTER_CUBIC)
    oy, ox = (B.shape[0] - Hh) // 2, (B.shape[1] - Ww) // 2; B = B[oy:oy + Hh, ox:ox + Ww]
    B = np.clip((B - a.black) / (1 - a.black), 0, 1) ** 1.15          # negros de verdad
    yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
    v = ((xx - Ww / 2) / (Ww * 0.55)) ** 2 + ((yy - Hh / 2) / (Hh * 0.6)) ** 2
    B = B * (1 - a.vignette * np.clip(v, 0, 1))[..., None]
    # sombra suave del móvil, un poco abajo: lo despega del fondo
    if a.top:
        B = B * (1 - a.top * np.clip(1 - yy / (Hh * 0.38), 0, 1) ** 1.6)[..., None]
    sh = cv2.GaussianBlur(cv2.warpAffine(al, np.float32([[1, 0, 18], [0, 1, 40]]), (Ww, Hh)), (0, 0), 45)
    B = B * (1 - 0.65 * np.clip(sh, 0, 1))[..., None]
    # light wrap: el color del fondo se cuela por los cantos del móvil
    inner = np.clip(al - cv2.GaussianBlur(cv2.erode(al, np.ones((9, 9), np.uint8)), (0, 0), 6)[..., None], 0, 1)
    edge = cv2.GaussianBlur(inner, (0, 0), 3)[..., None] if inner.ndim == 2 else cv2.GaussianBlur(inner, (0, 0), 3)
    edge = edge.reshape(al.shape)
    wrap = cv2.GaussianBlur(B, (0, 0), 25) * edge * a.wrap
    # el cuerpo del móvil recibe la luz de la noche: más oscuro y teñido del color del fondo
    cast = cv2.GaussianBlur(B, (0, 0), 120); cast = cast / max(1e-3, cast.max())
    L = L * a.body * ((1 - a.tint) + a.tint * (0.35 + 1.3 * cast))
    L = L * al + B * (1 - al)
    L = 1 - (1 - L) * (1 - np.clip(wrap * 1.6, 0, 1))
S = cv2.imread(a.screen).astype(np.float32) / 255
h, w = S.shape[:2]; H, W = L.shape[:2]; k = a.ss

# máscara de esquinas redondeadas en el espacio de la captura
m = np.zeros((h, w), np.float32); r = int(a.radius * w)
cv2.rectangle(m, (r, 0), (w - r, h), 1, -1); cv2.rectangle(m, (0, r), (w, h - r), 1, -1)
for cx, cy in ((r, r), (w - r, r), (w - r, h - r), (r, h - r)):
    cv2.circle(m, (cx, cy), r, 1, -1, lineType=cv2.LINE_AA)

M = np.diag([k, k, 1]).astype(np.float64) @ cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q)
scr = cv2.resize(cv2.warpPerspective(S, M, (W * k, H * k), flags=cv2.INTER_CUBIC), (W, H), interpolation=cv2.INTER_AREA)
msk = cv2.resize(cv2.warpPerspective(m, M, (W * k, H * k), flags=cv2.INTER_LINEAR), (W, H), interpolation=cv2.INTER_AREA)[..., None]

# reflejo: lo que el cristal apagado tiene por encima de su negro
lum = L.mean(axis=2)
base = np.percentile(lum[msk[..., 0] > 0.99], 5)
refl = np.clip((L - base) / max(1e-3, 1 - base), 0, 1) * a.refl
lit = 1 - (1 - np.clip(scr, 0, 1)) * (1 - refl)
out = L * (1 - msk) + lit * msk
cv2.imwrite(a.out, np.clip(out * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
