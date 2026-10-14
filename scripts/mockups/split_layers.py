"""Capas de Por capas (Gloop, 2026-10-14): una pantalla real de la app partida en planos que, juntos, la recomponen
píxel a píxel. Cada pieza se recorta de la captura en su sitio exacto (con su forma: tarjeta, botón, barra) y el
fondo rellena los huecos (inpaint), para que separado se vea limpio.

Uso: python3 scripts/mockups/split_layers.py public/maqueta/gloop/screens/home.png public/maqueta/gloop/media/layers

Pantalla: la home con la experiencia activa (Sónar 2027), elegida por Alberto (antes se probó «Esta noche»).
Capas, de abajo arriba:
  1-fondo      Brilla de noche   el degradado de la cabecera y los textos de la experiencia
  2-equipos    Se suelta         las tarjetas de equipo, cada una con su color
  3-nativo     Se siente iPhone  la barra de estado y la barra de pestañas
  4-controles  Viste de Gloop    «Join with a team» y el botón «+»
Coordenadas a la resolución de la captura (1206×2622)."""
import sys, numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
im = cv2.imread(src, cv2.IMREAD_COLOR); H, W = im.shape[:2]
Z = lambda: np.zeros((H, W), np.uint8)


def rr(m, x0, y0, x1, y1, r):
    cv2.rectangle(m, (x0 + r, y0), (x1 - r, y1), 255, -1); cv2.rectangle(m, (x0, y0 + r), (x1, y1 - r), 255, -1)
    for cx, cy in ((x0 + r, y0 + r), (x1 - r, y0 + r), (x1 - r, y1 - r), (x0 + r, y1 - r)):
        cv2.circle(m, (cx, cy), r, 255, -1, cv2.LINE_AA)
    return m


tab = rr(Z(), 192, 2374, 1012, 2552, 88)
cards = Z()
for y0, y1 in ((1278, 1542), (1556, 1820), (1836, 2100), (2114, 2378), (2392, H + 60)):
    rr(cards, 60, y0, 1146, y1, 48)
cards = cv2.bitwise_and(cards, cv2.bitwise_not(cv2.dilate(tab, np.ones((5, 5), np.uint8))))
ctrl = rr(Z(), 60, 990, 1146, 1180, 95)
cv2.circle(ctrl, (1080, 300), 66, 255, -1, cv2.LINE_AA)
status = Z(); cv2.rectangle(status, (0, 0), (W, 140), 255, -1)

holes = cv2.dilate(cards | ctrl | tab | status, np.ones((25, 25), np.uint8))
s = 4  # inpaint a 1/4 (rápido y suave) y se sube
small = cv2.inpaint(cv2.resize(im, (W // s, H // s), interpolation=cv2.INTER_AREA), cv2.resize(holes, (W // s, H // s)), 12, cv2.INPAINT_TELEA)
fill = cv2.GaussianBlur(cv2.resize(small, (W, H), interpolation=cv2.INTER_CUBIC), (0, 0), 6)
base = np.where(holes[..., None] > 0, fill, im)

# La barra de estado, recortada sin fondo (alfa por diferencia con el fondo limpio).
d = np.abs(im.astype(np.float32) - fill.astype(np.float32)).max(axis=2)
lum = im.astype(np.float32).min(axis=2)  # la hora y los iconos son blancos: así no se cuela el láser de detrás
status_a = (np.clip((d - 12) * 4, 0, 255) * np.clip((lum - 150) / 60, 0, 1) * (status > 0)).astype(np.uint8)
native = np.maximum(tab, status_a)


def save(name, img, mask):
    rgba = np.dstack([img, mask if mask is not None else np.full((H, W), 255, np.uint8)])
    cv2.imwrite(f"{out}/{name}.png", cv2.resize(rgba, (W // 2, H // 2), interpolation=cv2.INTER_AREA))


save("1-fondo", base, None); save("2-equipos", im, cards); save("3-nativo", im, native); save("4-controles", im, ctrl)
over = lambda a, b, m: a * (1 - m[..., None] / 255.0) + b * (m[..., None] / 255.0)
comp = over(over(over(base.astype(float), im, cards), im, native), im, ctrl)
print("diferencia media al juntar:", round(float(np.abs(comp - im).mean()), 3))
