"""Piezas del UI kit de Dovla recortadas de capturas reales del simulador (2026-10-17).

Uso: python3 scripts/case-media/dovla-kit.py
Lee public/maqueta/dovla/screens/*.png (iPhone 18 Pro, @3x) y escribe public/maqueta/dovla/media/kit/*.png con
las esquinas del componente recortadas a su radio (transparente fuera). Marcos en puntos, sacados de ui.sh.
Todo es local: capturas y piezas de una app sin publicar no van a git.
"""
from PIL import Image, ImageDraw
import json, os

SRC = "public/maqueta/dovla/screens"
OUT = "public/maqueta/dovla/media/kit"
K = 3  # @3x

# nombre: (captura, x, y, ancho, alto, radio) en puntos; radio 0 = sin máscara
PIECES = {
    "balance": ("home", 40, 134, 322, 104, 0),
    "accounts": ("home", 142, 255, 118, 40, 20),
    "actions": ("home", 16, 314, 370, 80, 0),
    "transactions": ("home", 16, 452, 370, 222, 20),
    "promo": ("home-promos", 16, 626, 370, 128, 20),
    "tabbar": ("home", 18, 791, 366, 60, 30),
    "discover": ("home-mid", 16, 284, 370, 202, 20),
    "thumbs": ("home-mid", 16, 562, 386, 104, 0),
    "wealth": ("home-bottom", 16, 284, 370, 226, 20),
    "chart": ("home-bottom", 16, 580, 370, 186, 20),
    "months": ("transactions", 12, 124, 390, 44, 0),
    "detail": ("detail", 16, 426, 370, 96, 20),
    "button": ("welcome", 16, 700, 370, 56, 28),
    "button-2": ("welcome", 16, 768, 370, 56, 28),
    "contacts": ("payments", 16, 175, 370, 370, 20),
    "benefits": ("promo-travel", 16, 466, 370, 214, 0),
    "freeze": ("card-physical", 255, 373, 131, 44, 22),
    "card-physical": ("card-physical", 16, 124, 370, 233, 18),
    "card-credit": ("card-credit", 16, 124, 370, 233, 18),
    "card-virtual": ("card-virtual", 16, 124, 370, 233, 18),
    "card-disposable": ("card-disposable", 16, 124, 370, 233, 18),
}

os.makedirs(OUT, exist_ok=True)
cache, meta = {}, {}
for name, (src, x, y, w, h, r) in PIECES.items():
    im = cache.setdefault(src, Image.open(f"{SRC}/{src}.png").convert("RGBA"))
    piece = im.crop((x * K, y * K, (x + w) * K, (y + h) * K))
    if r:
        mask = Image.new("L", (w * K * 2, h * K * 2), 0)  # al doble para que el borde salga suave
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, w * K * 2 - 1, h * K * 2 - 1), r * K * 2, fill=255)
        piece.putalpha(mask.resize(piece.size, Image.LANCZOS))
    piece.save(f"{OUT}/{name}.png", optimize=True)
    meta[name] = {"w": w, "h": h}
json.dump(meta, open(f"{OUT}/sizes.json", "w"), indent=1)
print(len(PIECES), "piezas en", OUT)

# Escala tipográfica de la app en Silka, como imagen: la licencia de la fuente no cubre servirla en la web.
from PIL import ImageFont
FONTS = os.path.expanduser("~/Vibe_Projects/dovla-app/DOVLA/Resources/Fonts")
SAND = (235, 211, 184, 255)
TYPE = [  # nombre, peso, tamaño (pt), muestra
    ("type-balance", "SemiBold", 48, "€48,735.50"),
    ("type-title-l", "Bold", 28, "Travel fee-free"),
    ("type-title-m", "SemiBold", 22, "Total wealth"),
    ("type-title-s", "SemiBold", 17, "Unlimited lounge access"),
    ("type-body", "Regular", 17, "Your Metal card goes everywhere you do."),
    ("type-callout", "Regular", 15, "A portfolio built around your goals."),
    ("type-footnote", "Regular", 13, "For DOVLA Private clients."),
    ("type-caption", "Medium", 12, "PHYSICAL · 4417"),
    ("type-aa", "Medium", 160, "Aa"),
]
for name, weight, size, text in TYPE:
    f = ImageFont.truetype(f"{FONTS}/Silka-{weight}.otf", size * K)
    l, _, r, _ = f.getbbox(text)
    asc, desc = f.getmetrics()  # misma caja para todas las muestras de un tamaño, con descendentes
    im = Image.new("RGBA", (r - l + 4, asc + desc), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((-l + 2, 0), text, font=f, fill=SAND)
    im.save(f"{OUT}/{name}.png", optimize=True)
    meta[name] = {"w": round(im.width / K), "h": round(im.height / K)}
json.dump(meta, open(f"{OUT}/sizes.json", "w"), indent=1)
print("tipografía hecha")
