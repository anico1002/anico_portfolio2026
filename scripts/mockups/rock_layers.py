"""Capas de la escena de rocas (im-darkrock, ElReto) para que las rocas floten en el vídeo — 2026-10-18.
La escena viene de una pieza; aquí se separa en: fondo (sin rocas ni losa, rellenado), cada roca con su alfa, y la
losa con el móvil (lo que no se mueve). Las rocas se distinguen por la textura: el fondo y la losa son lisos y la
piedra no. El borde se ajusta con GrabCut y, donde la roca se mete detrás de la losa, se prolonga la piedra unos
píxeles para que al moverse no asome un corte recto.

python3 scripts/mockups/rock_layers.py   →   mockups-src/im-darkrock/capas/{fondo,roca-N,frente}.png
"""
import cv2, numpy as np, json
D = "mockups-src/im-darkrock/"
im = cv2.imread(D + "view-1.png"); H, W = im.shape[:2]
lum = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
m = cv2.GaussianBlur(lum, (0, 0), 3); sd = np.sqrt(np.maximum(cv2.GaussianBlur(lum * lum, (0, 0), 3) - m * m, 0))
rough = (cv2.GaussianBlur(sd, (0, 0), 6) > 1.6).astype(np.uint8)
rough = cv2.morphologyEx(rough, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
rough = cv2.morphologyEx(rough, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))

# La losa con el móvil: el cuadro de la pantalla agrandado y desplazado hacia abajo a la izquierda (su grosor).
q = np.float32(json.load(open(D + "view-1.json"))["screen"]["quad"]); c = q.mean(0)
big = (q - c) * 1.17 + c
slab = np.zeros((H, W), np.uint8)
cv2.fillConvexPoly(slab, cv2.convexHull(np.vstack([big, big + np.float32([-70, 45])]).astype(np.int32)), 1)

n, lab, st, _ = cv2.connectedComponentsWithStats(rough * (1 - slab))
rocks = [i for i in range(1, n) if st[i][4] > 100000]
# Dentro de la losa manda la textura fina: lo rugoso es roca (que se mete por detrás) y lo liso, losa o su canto.
fine = (cv2.GaussianBlur(sd, (0, 0), 2.5) > 2.2).astype(np.uint8)
fine = cv2.morphologyEx(cv2.morphologyEx(fine, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
alphas = []
for i in rocks:
    r = (lab == i).astype(np.uint8)
    near = cv2.dilate(r, np.ones((81, 81), np.uint8))
    gc = np.full((H, W), cv2.GC_BGD, np.uint8)
    gc[cv2.dilate(r, np.ones((41, 41), np.uint8)) > 0] = cv2.GC_PR_BGD
    gc[r > 0] = cv2.GC_PR_FGD
    gc[cv2.erode(r, np.ones((41, 41), np.uint8)) > 0] = cv2.GC_FGD
    inside = slab > 0
    gc[inside] = cv2.GC_BGD
    gc[inside & (fine > 0) & (near > 0)] = cv2.GC_PR_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(im, gc, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
    a = ((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)).astype(np.uint8)
    # Solo la pieza mayor y sin agujeros.
    k, l2, s2, _ = cv2.connectedComponentsWithStats(a); a = (l2 == 1 + np.argmax(s2[1:, 4])).astype(np.uint8)
    cnt, _ = cv2.findContours(a, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); a = np.zeros_like(a); cv2.drawContours(a, cnt, -1, 1, -1)
    alphas.append(cv2.GaussianBlur(a.astype(np.float32), (0, 0), 1.2))

# Lo que no se mueve: la losa con el móvil, sin la piedra que tenga dentro.
anyrock = np.clip(sum(alphas), 0, 1)

# Fondo: es un degradado liso, así que se rehace entero liso a partir de lo que queda lejos de rocas y losa (cerca de
# ellas, el brillo de su borde dejaba fantasmas).
far = 1 - np.clip(cv2.dilate((anyrock > 0.05).astype(np.uint8), np.ones((51, 51), np.uint8)) + cv2.dilate(slab, np.ones((31, 31), np.uint8)), 0, 1)
known = far.astype(np.float32); f = im.astype(np.float32); bg = np.zeros_like(f); got = np.zeros((H, W, 1), np.float32)
for sg in (30, 80, 200, 500):
    num = cv2.GaussianBlur(f * known[..., None], (0, 0), sg); den = cv2.GaussianBlur(known, (0, 0), sg)[..., None]
    w = np.clip(den * 3, 0, 1) * (1 - got)
    bg += num / np.maximum(den, 1e-5) * w; got += w
bg = bg / np.maximum(got, 1e-5)
# El original en todas partes salvo donde había piedra y su brillo de borde (una línea clara salía de mezclar el fondo
# original, más claro junto a la losa, con el rehecho: 2026-10-18).
near = cv2.GaussianBlur(cv2.dilate((anyrock > 0.05).astype(np.uint8), np.ones((31, 31), np.uint8)).astype(np.float32), (0, 0), 8)[..., None]
bg = f * (1 - near) + bg * near
cv2.imwrite(D + "capas/fondo.png", np.clip(bg, 0, 255).astype(np.uint8))

# Cada roca, prolongada unos píxeles hacia dentro de la losa (donde estaba tapada) para que al moverse no se vea el corte.
for k, a in enumerate(alphas):
    hard = (a > 0.5).astype(np.uint8)
    grow = cv2.dilate(hard, np.ones((31, 31), np.uint8)) * slab  # solo crece por detrás de la losa
    rgb = cv2.inpaint(im, ((grow > 0) & (hard == 0)).astype(np.uint8) * 255, 9, cv2.INPAINT_TELEA)
    alpha = np.maximum(a, cv2.GaussianBlur(grow.astype(np.float32), (0, 0), 1.2))
    cv2.imwrite(D + f"capas/roca-{k}.png", np.dstack([rgb, np.clip(alpha * 255, 0, 255).astype(np.uint8)]))
# Sin difuminar: el borde de la losa con la roca es el de la roca (2026-10-18). Donde el polígono pisa el fondo no se
# nota, porque el fondo es el original en todas partes salvo donde había piedra.
front = slab.astype(np.float32) * (1 - (anyrock > 0.5))
cv2.imwrite(D + "capas/frente.png", np.dstack([im, np.clip(front * 255, 0, 255).astype(np.uint8)]))
print(len(alphas), "rocas")
