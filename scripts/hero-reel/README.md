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

## Estado (prueba 11, 2026-10-29, 12,4 s) — pendiente de que la vea Alberto

| Tiempo | Qué pasa | Tempo |
|---|---|---|
| 0–1,6 s | Ráfaga: clips de dispositivos en movimiento y fotos de la última iteración de Gloop (otro repo, `Gloop-app`), 7news y WineUp; cortes de 4–6 fotogramas, sin texto | caña |
| 1,6–3,5 s | «SHAPE / [hueco] THE / INTERFACE» en máscara; líneas que se deslizan en sentidos alternos con temblor leve; la «E» se estira y colapsa en franjas. El hueco: SwifT, 7news, Interactius, MasterChef, WineUp | media |
| 3,5–6,75 s | Pausa: media pantalla llena de componentes de cristal de Dovla (rebote, 3 columnas que se salen y se deslizan) y el móvil de 7news, que crece hacia la izquierda hasta la pantalla entera | calma |
| 6,95–8,85 s | «DESIGN / IN MOTION» en máscara sobre ese móvil: se carga con símbolos, se desliza y entramos por la «I» | media |
| 8,85–11 s | Collage de 16 grabaciones de pantalla (todos los proyectos menos Dovla) en perspectiva, girando y creciendo | calma |
| 11–12,4 s | Ráfaga; enlaza con el principio. Las dos ráfagas tiran del mismo mazo sin repetir | caña |

Reglas que salen del feedback: **Dovla nunca a pantalla completa ni al principio o al final** (falta su permiso para
publicar); nada de capturas sueltas sin dispositivo (quedan pobres: van al collage); nada estático (todo lleva zoom
lento); no repetir metraje (mejor más corto); los glifos de relleno nunca son letras.

Prueba aplicada: `app/new/page.tsx` pone `public/maqueta/hero-reel/reel.mp4` (1600 px, crf 28) de fondo en Product,
sin commitear: el MP4 no está en git.

## Lo que pidió Alberto (no perderlo)

- **Sí**: tipografía enorme y **asimétrica** sobre imagen en movimiento; el bloque escalonado con vídeo en el hueco de
  una línea; texto pequeño que se escribe solo, en otro plano y con perspectiva; mucho dispositivo en movimiento;
  **alternar caña con calma**; el gesto de carga de la web, pero más rápido; componentes de los casos.
- **No** (29-10): texto blanco grande (resta a Product en el Launcher); copy inventado que no hable de diseño («AFTER DARK»); datos personales (Barcelona, años); textos pequeños en las cuatro esquinas; demasiada caña seguida.
- **No**: letras que caen con física («PowerPoint»); negro y lento al empezar; abusar del ruido blanco o del RGB
  cian/magenta («amateur»); texturas de televisor demasiado sucias.
- Sus ideas sueltas (p. ej. «un carácter que se estira») son inspiración, no encargo.

## Pendiente para la siguiente sesión

1. Feedback de Alberto a la prueba 11 y a cómo queda en el Launcher.
2. Textos pequeños: Alberto va a revisar los de Yakushev para afinar; si no quedan con sentido, se quitan.
3. Copy final de «SHAPE THE INTERFACE» (le gusta) y «DESIGN IN MOTION» (provisional).
4. Versión vertical para móvil, WebM, póster y versión estática para `prefers-reduced-motion`.

## Referencia: qué hace Yakushev (análisis de sus 10 piezas)

Sus piezas son **webs que se animan solas**: la interfaz siempre en pantalla (MENU, frase centrada, interruptor,
«CART 00», párrafo en mayúsculas pequeñas abajo a la izquierda). Recursos: marquesina gigante con la imagen dentro
de las letras; letras rotas escritas sobre la imagen; bloque escalonado con vídeo en el hueco de una línea; **glitch
en el que las líneas se adelgazan en franjas hasta desaparecer**; imagen que crece de rectángulo pequeño a pantalla
completa; letras grandes dispersas sobre metraje que corta (Elkruff). Cortes cada 2–4 s, nunca fundidos.
Los vídeos se descargan del CDN de Webflow que enlaza el HTML de su home (`curl` de la portada y buscar `.mp4`).
