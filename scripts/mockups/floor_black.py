"""Pasa a negro el suelo de terrazo de la escena de pared (iphone-mockups.com no da PSD, así que se separa a mano).

Uso: python3 scripts/mockups/floor_black.py <view.png> <view.json> <salida.png> [--k 0.2]
El suelo es lo que queda por debajo de la línea pared-suelo (medida en la propia imagen: y = 1243 − 0,283·x en
view-1) y fuera de la silueta del móvil (la pantalla ensanchada por el marco). Negro liso por defecto (decisión de
Alberto: que se funda con el negro de la web); con --k > 0 conserva la textura a oscuras.
"""
import argparse, json, cv2, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument("png"); ap.add_argument("json"); ap.add_argument("out")
ap.add_argument("--k", type=float, default=0.0, help="cuánto queda de la textura (0 = negro liso)")
ap.add_argument("--r", type=int, default=58, help="radio de las esquinas del móvil"); ap.add_argument("--y0", type=float, default=1243); ap.add_argument("--m", type=float, default=-0.283)
a = ap.parse_args()
L = cv2.imread(a.png, cv2.IMREAD_UNCHANGED); H, W = L.shape[:2]
rgb = L[:, :, :3].astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
floor = np.clip((yy - (a.y0 + a.m * xx) + 3) / 6, 0, 1)
q = np.array(json.load(open(a.json))["screen"]["quad"], np.int32)
# Silueta del móvil: la pantalla con cada canto desplazado hacia fuera lo que mide el marco en esta vista
# (por la izquierda se ve el canto entero del móvil; por la derecha y abajo, casi nada).
def offset_quad(q, d):  # d: arriba, derecha, abajo, izquierda (TL,TR,BR,BL)
    q = q.astype(np.float64); c = q.mean(0); lines = []
    for i, off in enumerate(d):
        p0, p1 = q[i], q[(i + 1) % 4]; t = (p1 - p0) / np.linalg.norm(p1 - p0); n = np.array([t[1], -t[0]])
        if np.dot(n, (p0 + p1) / 2 - c) < 0: n = -n
        lines.append((p0 + n * off, t))
    pts = []
    for i in range(4):
        (pa, ta), (pb, tb) = lines[i - 1], lines[i]
        s_ = np.linalg.solve(np.array([ta, -tb]).T, pb - pa); pts.append(pa + s_[0] * ta)
    return np.array(pts, np.int32)
ph = np.zeros((H, W), np.uint8); cv2.fillPoly(ph, [offset_quad(q, (10, 6, 9, 34))], 255, lineType=cv2.LINE_AA)
# Esquinas redondeadas como las del móvil: apertura con un disco del radio de la esquina.
disk = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * a.r + 1, 2 * a.r + 1))
ph = cv2.morphologyEx(ph, cv2.MORPH_OPEN, disk)
ph = cv2.GaussianBlur(ph.astype(np.float32) / 255, (0, 0), 1.5)
m = (floor * (1 - ph))[..., None]
lum = rgb.mean(axis=2, keepdims=True)
dark = np.repeat(lum * a.k, 3, axis=2)
rgb = rgb * (1 - m) + dark * m
out = L.copy(); out[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
cv2.imwrite(a.out, out)
