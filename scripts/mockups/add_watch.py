"""Añade un Apple Watch apoyado en la pared a una escena de móvil ya compuesta (im_compose.py).

Uso: python3 scripts/mockups/add_watch.py <escena.jpg> <escena_dir> <view> <pantalla_reloj.png> <salida.jpg>
       [--dx 520] [--slope -0.33] [--h 0.40] [--u 0.5] [--shade 0.85]

El reloj (PNG recortado de AppLaunchpad, con la pantalla hueca) se monta con la misma perspectiva que la
pantalla del móvil de la escena: se coloca como un rectángulo en las coordenadas de esa pantalla (alto --h
respecto al móvil) y se desplaza --dx píxeles a lo largo de la línea pared-suelo (pendiente --slope). Lleva
sombra de contacto, sombra arrojada hacia la pared, un brillo en el cristal y la luz de la escena.
"""
import argparse, json
import cv2, numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("scene_img"); ap.add_argument("scene"); ap.add_argument("view"); ap.add_argument("screen"); ap.add_argument("out")
ap.add_argument("--watch", default="mockups-src/watch/s10-42mm-aluminum-jet-black-sport-band-black.webp")
ap.add_argument("--dx", type=float, default=520); ap.add_argument("--dy", type=float, default=None)
ap.add_argument("--slope", type=float, default=-0.33)
ap.add_argument("--h", type=float, default=0.40); ap.add_argument("--u", type=float, default=0.5)
ap.add_argument("--shade", type=float, default=0.85)
ap.add_argument("--bend", type=float, default=0, help="fila del PNG donde la correa de abajo dobla y se tumba en el suelo (0 = sin doblar)")
ap.add_argument("--fz", type=float, default=0.55, help="escorzo del suelo")
ap.add_argument("--lay", default=None, help="cx,cy,ancho,giro,escorzo: reloj tumbado en el suelo en vez de apoyado")
ap.add_argument("--shadow", default="-46,-18", help="desplazamiento de la sombra arrojada")
a = ap.parse_args()

S = cv2.imread(a.scene_img).astype(np.float32) / 255
H, W = S.shape[:2]
q = np.array(json.load(open(f"{a.scene}/{a.view}.json"))["screen"]["quad"], np.float32)

# Reloj con su pantalla dentro (el hueco: 63,167 → 374×446 en el PNG de 500×780).
wt = cv2.imread(a.watch, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
wh, ww = wt.shape[:2]
scr = cv2.imread(a.screen).astype(np.float32) / 255
x, y, sw, sh = 63, 167, 374, 446
scr = cv2.resize(scr, (sw + 4, sh + 4), interpolation=cv2.INTER_AREA)
under = np.zeros((wh, ww, 3), np.float32); under[y - 2:y + sh + 2, x - 2:x + sw + 2] = scr
hole = np.zeros((wh, ww), np.float32); hole[y - 2:y + sh + 2, x - 2:x + sw + 2] = 1
al = wt[:, :, 3:]
# Brillo diagonal sobre el cristal.
yy, xx = np.mgrid[0:wh, 0:ww].astype(np.float32)
band = np.exp(-(((xx - ww * 0.25) + (yy - wh * 0.30) * 0.9) / (ww * 0.12)) ** 2) * 0.10
under = 1 - (1 - under) * (1 - band[..., None])
rgb = wt[:, :, :3] * al + under * (1 - al) * hole[..., None]
alpha = np.clip(al[..., 0] + hole, 0, 1)
rgb[..., :] = np.where(hole[..., None] * (1 - al) > 0.5, rgb, rgb * a.shade)

# Perspectiva: un rectángulo en coordenadas de la pantalla del móvil.
Hp = cv2.getPerspectiveTransform(np.float32([[0, 0], [1, 0], [1, 1], [0, 1]]), q)
phone_px = np.linalg.norm(q[3] - q[0]), np.linalg.norm(q[1] - q[0])
hw = a.h
wu = hw * (ww / wh) * (phone_px[0] / phone_px[1])
B = int(a.bend) if a.bend else wh            # filas que van apoyadas en la pared
u0, v0 = a.u - wu / 2, 1 - hw * B / wh
rect = np.float32([[u0, v0], [u0 + wu, v0], [u0 + wu, 1], [u0, 1]])
dst = cv2.perspectiveTransform(rect[None], Hp)[0]
dy = a.dy if a.dy is not None else a.slope * a.dx
dst += np.float32([a.dx, dy])
k = 2
def warp_to(img, src_quad, dst_quad):
    M = cv2.getPerspectiveTransform(np.float32(src_quad), np.float32(dst_quad))
    Mk = np.diag([k, k, 1]).astype(np.float64) @ M
    return cv2.resize(cv2.warpPerspective(img, Mk, (W * k, H * k), flags=cv2.INTER_CUBIC), (W, H), interpolation=cv2.INTER_AREA)
if a.lay:
    # Tumbado en el suelo: a lo largo de la pared, el canto inferior del móvil; hacia la cámara, casi vertical.
    cx, cy, wpx, rot, fz = (float(v) for v in a.lay.split(","))
    along = q[2] - q[3]; along /= np.linalg.norm(along)
    depth = np.float32([0.22, 1.0]); depth /= np.linalg.norm(depth)
    t = np.radians(rot)
    ex = (np.cos(t) * along + np.sin(t) * depth * fz)
    ey = (-np.sin(t) * along + np.cos(t) * depth * fz)
    s_ = wpx / ww
    c = np.float32([cx, cy])
    corners = [(-ww / 2, -wh / 2), (ww / 2, -wh / 2), (ww / 2, wh / 2), (-ww / 2, wh / 2)]
    dst = np.float32([c + s_ * (px * ex + py * ey) for px, py in corners])
    B = wh
src_up = [[0, 0], [ww, 0], [ww, B], [0, B]]
R = warp_to(rgb, src_up, dst); A = np.clip(warp_to(alpha.astype(np.float32) * (yy < B), src_up, dst), 0, 1)[..., None]
if B < wh:
    # La correa de abajo dobla en la base y se tumba en el suelo, hacia la cámara.
    depth = np.float32([0.22, 1.0]); depth /= np.linalg.norm(depth)
    sc = np.linalg.norm(dst[2] - dst[3]) / ww
    L = (wh - B) * sc * a.fz
    floor = [dst[3], dst[2], dst[2] + depth * L, dst[3] + depth * L]
    src_lo = [[0, B], [ww, B], [ww, wh], [0, wh]]
    low = rgb * 0.8                                # la parte tumbada recibe menos luz de frente
    Rl = warp_to(low, src_lo, floor); Al = np.clip(warp_to(alpha.astype(np.float32) * (yy >= B - 1), src_lo, floor), 0, 1)[..., None]
    R = R * A + Rl * Al * (1 - A); A = np.clip(A + Al * (1 - A), 0, 1)
    R = R / np.maximum(A, 1e-4)

# Sombras: de contacto (bajo la base) y arrojada hacia la pared.
sx, sy = (float(v) for v in a.shadow.split(","))
cast = cv2.GaussianBlur(cv2.warpAffine(A[..., 0], np.float32([[1, 0, sx], [0, 1, sy]]), (W, H)), (0, 0), 22)
base = dst[2:4].mean(0); bw = np.linalg.norm(dst[2] - dst[3])
contact = np.zeros((H, W), np.float32)
cv2.ellipse(contact, (int(base[0]), int(base[1] - 4)), (int(bw * 0.62), int(bw * 0.10)), float(np.degrees(np.arctan2(dst[2][1] - dst[3][1], dst[2][0] - dst[3][0]))), 0, 360, 1, -1)
contact = cv2.GaussianBlur(contact, (0, 0), 9)
if a.lay:
    # Tumbado: oclusión bajo todo el reloj, pegada y difusa.
    occ = cv2.GaussianBlur(cv2.warpAffine(A[..., 0], np.float32([[1, 0, sx * 0.35], [0, 1, 10]]), (W, H)), (0, 0), 14)
    S = S * (1 - 0.7 * np.clip(occ, 0, 1))[..., None]
else:
    S = S * (1 - 0.55 * np.clip(cast, 0, 1))[..., None] * (1 - 0.6 * contact)[..., None]

# La luz de la escena: el reloj toma el brillo medio de su zona.
zone = cv2.GaussianBlur(S, (0, 0), 60)
lum = float(zone[int(base[1]) - 40, int(base[0])].mean()) / max(1e-3, float(S.mean()))
R = R * np.clip(0.75 + 0.25 * lum, 0.7, 1.05)
out = S * (1 - A) + R * A
cv2.imwrite(a.out, np.clip(out * 255, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
print("reloj en", dst.round(1).tolist())
