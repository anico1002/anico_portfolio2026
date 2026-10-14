"""Pantalla del Apple Watch con un aviso en cristal (watchOS) para los mockups.

Uso: python3 scripts/mockups/watch_notice.py <fondo.png> <icono.png> <salida.png> --title T --body B [--app 7news]

El fondo (p. ej. el fondo de pantalla del iPhone de la misma escena) se recorta, se desenfoca y se oscurece;
encima, la hora y una tarjeta de cristal: relleno translúcido, canto de luz arriba, icono, app, «ahora»,
título y cuerpo en SF Compact (la letra del reloj). Sale a 2x del hueco de la pantalla del reloj de
AppLaunchpad (374 × 446).
"""
import argparse
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("bg"); ap.add_argument("icon"); ap.add_argument("out")
ap.add_argument("--title", required=True); ap.add_argument("--body", required=True)
ap.add_argument("--app", default="7news"); ap.add_argument("--no-card", action="store_true", help="solo la esfera, sin aviso (para animarlo)"); ap.add_argument("--time", default="9:41")
a = ap.parse_args()

S = 2; W, H = 374 * S, 446 * S
F = "/Library/Fonts/SF-Compact-Display-{}.otf"
font = lambda w, s: ImageFont.truetype(F.format(w), int(s * S))

# Fondo: el del iPhone, recortado al formato del reloj, desenfocado y oscuro.
bg = Image.open(a.bg).convert("RGB")
bw, bh = bg.size; cw = int(bh * W / H)
cw = min(cw, bw); ch = int(cw * H / W)
bg = bg.crop(((bw - cw) // 2, int(bh * 0.25), (bw + cw) // 2, int(bh * 0.25) + ch)).resize((W, H), Image.LANCZOS)
bg = bg.filter(ImageFilter.GaussianBlur(10 * S))
bg = Image.blend(Image.new("RGB", (W, H), (0, 0, 0)), bg, 0.62)
img = bg.convert("RGBA")
d = ImageDraw.Draw(img)

# Hora, arriba a la derecha (como en el reloj).
tf = font("Semibold", 30)
tw = d.textlength(a.time, font=tf)
d.text((W - tw - 34 * S, 22 * S), a.time, font=tf, fill=(255, 255, 255, 235))

if a.no_card:
    img.convert("RGB").save(a.out); raise SystemExit
# Tarjeta de cristal, del alto de su contenido.
def wrap(text, f, width, max_lines):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while d.textlength(lines[-1] + "…", font=f) > width: lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    return lines

x0, y0, x1, r, pad = 14 * S, 78 * S, W - 14 * S, 34 * S, 24 * S
T_LINES = wrap(a.title, font("Semibold", 27), x1 - x0 - 2 * pad, 2)
B_LINES = wrap(a.body, font("Regular", 24), x1 - x0 - 2 * pad, 5)
y1 = min(H - 16 * S, y0 + pad + 58 * S + 32 * S * len(T_LINES) + 4 * S + 29 * S * len(B_LINES) + pad)
card_bg = img.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(14 * S))
mask = Image.new("L", (x1 - x0, y1 - y0), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, x1 - x0 - 1, y1 - y0 - 1), r, fill=255)
glass = Image.alpha_composite(card_bg.convert("RGBA"), Image.new("RGBA", card_bg.size, (255, 255, 255, 46)))
img.paste(glass, (x0, y0), mask)
# Canto de luz: borde fino, más brillante arriba a la izquierda.
edge = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
ed = ImageDraw.Draw(edge)
ed.rounded_rectangle((0, 0, x1 - x0 - 1, y1 - y0 - 1), r, outline=(255, 255, 255, 90), width=max(1, S))
grad = Image.linear_gradient("L").rotate(45, expand=True).resize(edge.size)
edge.putalpha(Image.composite(edge.getchannel("A"), Image.new("L", edge.size, 0), grad.point(lambda v: 255 - int(v * 0.8))))
img.alpha_composite(edge, (x0, y0))

d = ImageDraw.Draw(img)
# Icono redondo + app + ahora.
ic = Image.open(a.icon).convert("RGBA").resize((38 * S, 38 * S), Image.LANCZOS)
im = Image.new("L", ic.size, 0); ImageDraw.Draw(im).ellipse((0, 0, ic.size[0] - 1, ic.size[1] - 1), fill=255)
img.paste(ic, (x0 + pad, y0 + pad), im)
lf = font("Medium", 19)
d.text((x0 + pad + 48 * S, y0 + pad + 8 * S), a.app.upper(), font=lf, fill=(255, 255, 255, 170))
nw = d.textlength("ahora", font=lf)
d.text((x1 - pad - nw, y0 + pad + 8 * S), "ahora", font=lf, fill=(255, 255, 255, 140))

# Título y cuerpo, con salto de línea a lo ancho de la tarjeta.
y = y0 + pad + 58 * S
tf = font("Semibold", 27)
for line in T_LINES:
    d.text((x0 + pad, y), line, font=tf, fill=(255, 255, 255, 255)); y += 32 * S
y += 4 * S
bf = font("Regular", 24)
for line in B_LINES:
    d.text((x0 + pad, y), line, font=bf, fill=(255, 255, 255, 215)); y += 29 * S

img.convert("RGB").save(a.out)
