"""Mete un vídeo de pantalla dentro de una foto de concepto de portátil (mockup en movimiento).

Uso:  python3 motion/mockup.py <hero|thumb> <screen.mp4> <salida.mp4> [--test T] [--edges]

Para cada fotograma: homografía de la pantalla a las 4 esquinas medidas en la foto, luz de la
foto (sacada de su propio fondo blanco), desenfoque de profundidad que imita el de la foto y
recorte por la máscara de la pantalla (respeta lo que está por delante). 2026-10-12, caso SwifT.
"""
import subprocess
import sys

import cv2
import numpy as np

ROOT = "/Users/anico/Vibe_Projects/anico_portfolio2026"
FF = subprocess.check_output(["npm", "root", "-g"], text=True).strip() + "/ffmpeg-static/ffmpeg"

# Esquinas de la pantalla en cada foto (TL, TR, BR, BL), medidas sobre rejilla. Las que caen
# fuera del encuadre siguen la perspectiva de la foto: verticales paralelas al canto izquierdo y
# horizontales hacia el punto de fuga de las líneas de texto.
SETUPS = {
    "hero": {
        "photo": f"{ROOT}/public/projects/swift-project/SwifT_hero.png",
        "quad": [(544, -220), (2430, -184), (2200, 1113), (358, 828)],
        "crop_top": 0,  # se mapea la pantalla entera (la barra de menús queda fuera de cuadro)
        "focus": (850, 320), "sharp": 340, "soft": 760, "max_sigma": 2.2,
        "shade_k": 61,
        # Lo que hay por delante de la pantalla: nada.
        "front": None,
    },
    "thumb": {
        "photo": f"{ROOT}/public/projects/swift-project/SwifT_thumb.png",
        # Perspectiva sacada de la propia foto: SIFT entre la landing real (en inglés, 1512 px) y
        # la foto (210 puntos, error medio 0,25 px). Bordes medidos por píxeles (último blanco
        # antes del bisel): el derecho cae en x = 1246 px CSS en todas las filas y el superior en
        # y ≈ 3, justo bajo la barra de menús. Pantalla centrada en el eje de la web (756):
        # 981 × 589 px CSS → estas esquinas. La franja gris de la derecha es el bisel, no pantalla.
        "quad": [(-229.5, 137.2), (857.4, 255.6), (952.5, 866.6), (-179.1, 794.7)],
        "crop_top": 48,  # quita la barra de menús clara del vídeo
        "focus": (430, 480), "sharp": 210, "soft": 430, "max_sigma": 3.5,
        "shade_k": 161,
        # Base del portátil desenfocada por delante, abajo a la izquierda: todo lo que queda por
        # debajo de esta línea es primer plano.
        "front": [(0, 696), (660, 739), (1024, 760)],
    },
}


def mask_for(cfg, shape):
    h, w = shape
    m = np.zeros((h * 4, w * 4), np.uint8)
    q = (np.array(cfg["quad"], np.float32) * 4).astype(np.int32)
    cv2.fillPoly(m, [q], 255, lineType=cv2.LINE_AA)
    if cfg.get("clip"):
        c = np.zeros_like(m)
        cv2.fillPoly(c, [(np.array(cfg["clip"], np.float32) * 4).astype(np.int32)], 255, lineType=cv2.LINE_AA)
        m = cv2.min(m, c)
    if cfg["front"]:
        pts = [(x * 4, y * 4) for x, y in cfg["front"]] + [(w * 4, h * 4), (0, h * 4)]
        cv2.fillPoly(m, [np.array(pts, np.int32)], 0, lineType=cv2.LINE_AA)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    if cfg["front"]:  # el canto de la base está desenfocado: borde suave
        m = cv2.GaussianBlur(m, (0, 0), 2.5)
    return m[..., None]


def shading(photo, cfg):
    """Luz de la foto sobre la pantalla: el fondo de la página era blanco, así que un filtro de
    máximos borra el texto y deja solo iluminación (degradados, viñeteado, tono)."""
    k = cfg["shade_k"]
    bg = cv2.dilate(photo, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    bg = cv2.GaussianBlur(bg, (0, 0), k / 2.5)
    return np.clip(bg.astype(np.float32) / 250.0, 0, 1.05)


def sigma_map(cfg, shape):
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.hypot(xx - cfg["focus"][0], yy - cfg["focus"][1])
    t = np.clip((d - cfg["sharp"]) / (cfg["soft"] - cfg["sharp"]), 0, 1)
    return t * cfg["max_sigma"]


def main():
    which, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
    test = float(sys.argv[sys.argv.index("--test") + 1]) if "--test" in sys.argv else None
    edges = "--edges" in sys.argv
    cfg = SETUPS[which]
    photo = cv2.imread(cfg["photo"], cv2.IMREAD_COLOR)
    H, W = photo.shape[:2]
    mask = mask_for(cfg, (H, W))
    shade = shading(photo, cfg)
    sig = sigma_map(cfg, (H, W))
    levels = [0.0, cfg["max_sigma"] / 2, cfg["max_sigma"]]
    # Peso de cada nivel de desenfoque: interpolación lineal entre nítido, medio y máximo.
    idx = sig / levels[1]
    w0 = np.clip(1 - idx, 0, 1)
    w2 = np.clip(idx - 1, 0, 1)
    wts = [w0[..., None], (1 - w0 - w2)[..., None], w2[..., None]]

    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    if test is not None:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(test * fps))
    sw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    sh = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) - cfg["crop_top"]
    M = cv2.getPerspectiveTransform(
        np.array([(0, 0), (sw, 0), (sw, sh), (0, sh)], np.float32), np.array(cfg["quad"], np.float32)
    )
    base = photo.astype(np.float32)

    enc = None
    if test is None:
        enc = subprocess.Popen(
            [FF, "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
             "-c:v", "libx264", "-crf", "22", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out],
            stdin=subprocess.PIPE, stderr=subprocess.DEVNULL,
        )
    n = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        fr = fr[cfg["crop_top"]:]
        warped = cv2.warpPerspective(fr, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
        dof = sum(w * (warped if s == 0 else cv2.GaussianBlur(warped, (0, 0), s)) for w, s in zip(wts, levels))
        lit = dof * shade
        comp = base * (1 - mask) + lit * mask
        comp = np.clip(comp, 0, 255).astype(np.uint8)
        if edges:
            cv2.polylines(comp, [np.array(cfg["quad"], np.int32)], True, (0, 0, 255), 2, cv2.LINE_AA)
        if test is not None:
            cv2.imwrite(out, comp)
            return print("frame", out)
        enc.stdin.write(comp.tobytes())
        n += 1
    enc.stdin.close()
    enc.wait()
    print("ok", out, n, "frames")


if __name__ == "__main__":
    main()
