"""Fondos de noche para los mockups de Gloop.

  lens <foto> <salida> [--r 38]   desenfoque de lente real (discos, no gaussiano) sobre una foto
  synth <salida> [--seed 3]       bokeh dibujado con los colores de Gloop (sin derechos de terceros)
"""
import cv2, numpy as np, sys, argparse

W, H = 2000, 1333
ap = argparse.ArgumentParser(); ap.add_argument("mode"); ap.add_argument("a"); ap.add_argument("b", nargs="?")
ap.add_argument("--r", type=int, default=38); ap.add_argument("--seed", type=int, default=3)
ap.add_argument("--gain", type=float, default=2.2)
a = ap.parse_args()


def disk(r):
    k = np.zeros((2 * r + 1, 2 * r + 1), np.float32)
    cv2.circle(k, (r, r), r, 1, -1, lineType=cv2.LINE_AA)
    # borde algo más brillante, como un objetivo real
    ring = np.zeros_like(k); cv2.circle(ring, (r, r), r, 1, max(1, r // 10), lineType=cv2.LINE_AA)
    k = k + 0.35 * ring
    return k / k.sum()


def lens(img, r, gain):
    lin = (img.astype(np.float32) / 255) ** 2.2
    lum = lin.mean(axis=2, keepdims=True)
    lin = lin * (1 + gain * np.clip(lum - 0.25, 0, None) * 4)  # las luces mandan en el bokeh
    out = cv2.filter2D(lin, -1, disk(r), borderType=cv2.BORDER_REFLECT)
    out = out / (1 + out * 0.15)                                    # rolloff suave
    return (np.clip(out, 0, 1) ** (1 / 2.2) * 255).astype(np.uint8)


if a.mode == "lens":
    src = cv2.imread(a.a)
    h, w = src.shape[:2]; s = max(W / w, H / h)
    src = cv2.resize(src, (int(w * s + 1), int(h * s + 1)), interpolation=cv2.INTER_CUBIC)
    y0 = (src.shape[0] - H) // 2; x0 = (src.shape[1] - W) // 2
    src = src[y0:y0 + H, x0:x0 + W]
    out = lens(src, a.r, a.gain)
    out = (out.astype(np.float32) * 0.8).astype(np.uint8)  # un punto más de noche
    cv2.imwrite(a.b, out, [cv2.IMWRITE_JPEG_QUALITY, 94])
else:
    rng = np.random.default_rng(a.seed)
    # paleta Gloop en BGR: morado marca, fucsia, lima (poco), azul noche
    pal = [(250, 74, 159), (230, 60, 140), (80, 13, 250), (33, 230, 197), (255, 120, 90), (200, 90, 255)]
    wts = np.array([5, 3, 2, 0.6, 2, 3]); wts = wts / wts.sum()
    acc = np.zeros((H, W, 3), np.float32)
    # fondo: degradado de noche con una bruma morada abajo
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    acc += np.dstack([0.020 + 0.05 * (yy / H), 0.006 + 0.01 * (yy / H), 0.018 + 0.03 * (yy / H)])
    glow = np.exp(-(((xx - W * 0.5) / (W * 0.6)) ** 2 + ((yy - H * 1.05) / (H * 0.55)) ** 2))
    acc += glow[..., None] * np.array([0.10, 0.02, 0.07], np.float32)
    # tres capas de profundidad: muchos discos pequeños al fondo, pocos grandes delante
    for n, rmin, rmax, inten in ((140, 10, 26, 0.35), (60, 30, 60, 0.28), (16, 70, 130, 0.16)):
        layer = np.zeros((H, W, 3), np.float32)
        for _ in range(n):
            c = np.array(pal[rng.choice(len(pal), p=wts)], np.float32) / 255
            x = rng.uniform(-0.05, 1.05) * W
            y = (rng.beta(1.3, 1.6)) * H  # más luces por arriba, como focos
            r = rng.uniform(rmin, rmax)
            lay = np.zeros((H, W), np.float32)
            cv2.circle(lay, (int(x), int(y)), int(r), 1, -1, lineType=cv2.LINE_AA)
            cv2.circle(lay, (int(x), int(y)), int(r), 0.5, max(1, int(r / 9)), lineType=cv2.LINE_AA)
            layer += lay[..., None] * c * inten * rng.uniform(0.4, 1.0)
        layer = cv2.GaussianBlur(layer, (0, 0), 1.2 + rmax / 40)
        acc += layer
    # un par de haces de luz muy suaves desde arriba
    for ang, col in ((-0.35, (0.5, 0.1, 0.45)), (0.3, (0.35, 0.08, 0.6))):
        beam = np.zeros((H, W), np.float32)
        x0 = W * (0.5 + ang * 0.6)
        pts = np.array([[x0 - 30, -10], [x0 + 30, -10], [x0 + ang * W * 1.4 + 260, H], [x0 + ang * W * 1.4 - 260, H]], np.int32)
        cv2.fillPoly(beam, [pts], 1)
        beam = cv2.GaussianBlur(beam, (0, 0), 60) * np.exp(-yy / H * 1.6)
        acc += beam[..., None] * np.array(col, np.float32) * 0.18
    acc = acc / (1 + acc * 0.6)
    noise = rng.normal(0, 0.008, acc.shape).astype(np.float32)   # grano fino
    out = np.clip((np.clip(acc + noise, 0, 1)) ** (1 / 1.9), 0, 1)
    cv2.imwrite(a.a, (out * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
