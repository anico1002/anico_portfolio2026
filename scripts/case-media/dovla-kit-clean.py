"""Limpia el canto de las piezas del kit de Dovla (2026-10-18). Las capturas venían recortadas con un radio que no
era el de la tarjeta: en las esquinas quedaba una franja del fondo oscuro de la app y sobre el berenjena de la web se
veía el perfil del recorte. Mide el radio real de cada pieza por la diagonal de su esquina, vuelve a recortarla con
ese radio, 3 px hacia dentro y con antialias, y guarda <pieza>-clean.png al lado (los originales no se tocan).

python3 scripts/case-media/dovla-kit-clean.py
"""
from PIL import Image, ImageDraw
import math

KIT = "public/maqueta/dovla/media/kit"
PIECES = ["transactions", "wealth", "chart", "discover", "detail"]
INSET, SS = 3, 4

for n in PIECES:
    im = Image.open(f"{KIT}/{n}.png").convert("RGBA")
    w, h = im.size
    ref = im.getpixel((w // 2, h // 2))
    near = lambda p: p[3] == 255 and sum(abs(p[i] - ref[i]) for i in range(3)) < 24
    d = next(d for d in range(0, min(w, h) // 2) if near(im.getpixel((d, d))))
    r = d / (1 - 1 / math.sqrt(2))
    mask = Image.new("L", (w * SS, h * SS), 0)
    ImageDraw.Draw(mask).rounded_rectangle((INSET * SS, INSET * SS, (w - INSET) * SS, (h - INSET) * SS), radius=(r - INSET) * SS, fill=255)
    mask = mask.resize((w, h), Image.LANCZOS)
    a = Image.composite(im.getchannel("A"), Image.new("L", (w, h), 0), mask)
    a = Image.fromarray(__import__("numpy").minimum(__import__("numpy").array(a), __import__("numpy").array(mask)))
    im.putalpha(a)
    im.save(f"{KIT}/{n}-clean.png")
    print(n, "radio", round(r), "px")
