# Hero reel — vídeo de motion para el fondo del hero

Pieza de unos 20 s en bucle que sustituirá al pase de diapositivas del hero. **No es un reel de proyectos**:
es una pieza inspiracional, de puro diseño, al estilo de los vídeos de art-yakushev.com. Está en pruebas.

## Cómo se trabaja

```bash
bash scripts/hero-reel/prep.sh                       # una vez por Mac: fotogramas en fr/ (necesita los medios del MacBook)
node scripts/hero-reel/render.mjs 1.1,6.9,9.2        # revisar instantes sueltos → out/at-<t>.jpg
node scripts/hero-reel/render.mjs                    # vídeo entero → out/prueba.mp4 (dura lo que diga DUR en comp.html; OUT=nombre)
```

`comp.html` lo contiene todo: `window.render(t)` coloca cada elemento para el instante `t`, sin animaciones
en vivo, y por eso cada fotograma sale exacto. El vídeo de fondo se sirve como secuencias de JPG (`fr/`),
no como `<video>`, para no depender de los códecs del navegador sin cabeza. `fr/` y `out/` no van a git.

## Estado (prueba 06, 2026-10-29, 11,7 s) — pendiente de que la vea Alberto

Rehecha tras su feedback a la 05: nada de texto blanco macizo (no puede competir con Product del Launcher),
tempo más bajo con cambios de ritmo y bucle sin costura.

| Tiempo | Qué pasa | Tempo |
|---|---|---|
| 0–1,6 s | Ráfaga de trabajos a pantalla completa, cortes de 4–6 fotogramas, sin texto | caña |
| 1,6–3,5 s | «SHAPE / [hueco] THE / INTERFACE» **en máscara** (metraje dentro de las letras + copia al 13 % para que se lean). La «E» se estira y colapsa en franjas | media |
| 3,5–6,6 s | Pausa: pantalla partida, retícula masonry de componentes de Dovla (rectos, suben como un scroll) y el móvil girando sobre morado | calma |
| 6,6–9,9 s | Tipo gigante en máscara con caracteres que cambian como código (consonantes y números: no forman palabras); al final entramos en una «I» | caña |
| 9,9–11,7 s | Ráfaga de trabajos; enlaza con el principio (`DUR` se calcula para acabar en un corte) | caña |

Texto pequeño solo en el margen izquierdo (arriba y abajo), al 50 %, con vocabulario de interfaz. Los glifos de
relleno al descifrarse son números y símbolos: con letras salió «ZUGOO» a mitad de escribirse un texto.

## Lo que pidió Alberto (no perderlo)

- **Sí**: tipografía enorme y **asimétrica** sobre imagen en movimiento; el bloque escalonado con vídeo en el hueco de
  una línea; texto pequeño que se escribe solo, en otro plano y con perspectiva; mucho dispositivo en movimiento;
  **alternar caña con calma**; el gesto de carga de la web, pero más rápido; componentes de los casos.
- **No** (29-10): texto blanco grande (resta a Product en el Launcher); copy inventado que no hable de diseño («AFTER DARK»); datos personales (Barcelona, años); textos pequeños en las cuatro esquinas; demasiada caña seguida.
- **No**: letras que caen con física («PowerPoint»); negro y lento al empezar; abusar del ruido blanco o del RGB
  cian/magenta («amateur»); texturas de televisor demasiado sucias.
- Sus ideas sueltas (p. ej. «un carácter que se estira») son inspiración, no encargo.

## Pendiente para la siguiente sesión

1. Feedback de Alberto a la prueba 06.
2. Probarlo aplicado: dónde va exactamente (fondo del Launcher o hero de la home) y con qué capa oscura encima.
3. Copy de los textos pequeños: revisar con copywriting (vocabulario del sector, nada inventado ni con marcas).
4. Versión vertical para móvil, MP4/WebM ligero, póster y versión estática para `prefers-reduced-motion`.

## Referencia: qué hace Yakushev (análisis de sus 10 piezas)

Sus piezas son **webs que se animan solas**: la interfaz siempre en pantalla (MENU, frase centrada, interruptor,
«CART 00», párrafo en mayúsculas pequeñas abajo a la izquierda). Recursos: marquesina gigante con la imagen dentro
de las letras; letras rotas escritas sobre la imagen; bloque escalonado con vídeo en el hueco de una línea; **glitch
en el que las líneas se adelgazan en franjas hasta desaparecer**; imagen que crece de rectángulo pequeño a pantalla
completa; letras grandes dispersas sobre metraje que corta (Elkruff). Cortes cada 2–4 s, nunca fundidos.
Los vídeos se descargan del CDN de Webflow que enlaza el HTML de su home (`curl` de la portada y buscar `.mp4`).
