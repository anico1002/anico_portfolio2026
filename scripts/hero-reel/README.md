# Hero reel — vídeo de motion para el fondo del hero

Pieza de unos 20 s en bucle que sustituirá al pase de diapositivas del hero. **No es un reel de proyectos**:
es una pieza inspiracional, de puro diseño, al estilo de los vídeos de art-yakushev.com. Está en pruebas.

## Cómo se trabaja

```bash
bash scripts/hero-reel/prep.sh                       # una vez por Mac: fotogramas en fr/ (necesita los medios del MacBook)
node scripts/hero-reel/render.mjs 1.1,6.9,9.2        # revisar instantes sueltos → out/at-<t>.jpg
node scripts/hero-reel/render.mjs                    # vídeo entero → out/prueba.mp4 (DUR=13.4 por defecto)
```

`comp.html` lo contiene todo: `window.render(t)` coloca cada elemento para el instante `t`, sin animaciones
en vivo, y por eso cada fotograma sale exacto. El vídeo de fondo se sirve como secuencias de JPG (`fr/`),
no como `<video>`, para no depender de los códecs del navegador sin cabeza. `fr/` y `out/` no van a git.

## Estado (prueba 04, 2026-10-25) — a Alberto «le gusta»

| Tiempo | Qué pasa | Ritmo |
|---|---|---|
| 0–2 s | Montaje frenético (cortes cada 2–4 fotogramas: capturas de vídeo, fotos y pantallas fijas, a sangre, centradas o en detalle). Encima, «AFTER / DARK®» asimétrico, con las letras descifrándose; zoom brutal dentro de la «A» | caña |
| 2–2,8 s | Ráfaga de cortes de dispositivos | caña |
| 2,8–5,6 s | Bloque escalonado «PLAY / [hueco] THE / MOMENT»; el hueco cambia de proyecto cada 0,2 s. La «E» se estira hasta cruzar la pantalla y todo colapsa en franjas | caña |
| 6,2–8,9 s | Componentes del kit de Dovla que entran con rebote hasta llenar la pantalla y se recogen al centro | calma |
| 8,9–11 s | Móvil de Dovla: máscara de la web (EASE.inOut) y giro lento en perspectiva | calma |
| 11–13,4 s | Vuelta al montaje frenético con «MADE TO / BE FELT»; colapso final a negro | caña |

Siempre encima: el texto pequeño en dos planos 3D que flotan a su ritmo y se reescriben solos con fallos sueltos,
más las texturas (grano, líneas de televisor, banda VHS ocasional, viñeta, destello de color), ya bajadas de tono.

## Lo que pidió Alberto (no perderlo)

- **Sí**: tipografía enorme y **asimétrica** sobre imagen en movimiento; el bloque escalonado con vídeo en el hueco de
  una línea; texto pequeño que se escribe solo, en otro plano y con perspectiva; mucho dispositivo en movimiento;
  **alternar caña con calma**; el gesto de carga de la web, pero más rápido; componentes de los casos.
- **No**: letras que caen con física («PowerPoint»); negro y lento al empezar; abusar del ruido blanco o del RGB
  cian/magenta («amateur»); texturas de televisor demasiado sucias.
- Sus ideas sueltas (p. ej. «un carácter que se estira») son inspiración, no encargo.

## Pendiente para la siguiente sesión

1. Quitar el hueco muerto de fondo ciruela tras el primer colapso (~6,0–6,2 s): que el primer componente entre en el golpe.
2. Dar un golpe intermedio al bloque «PLAY THE MOMENT», que se queda quieto casi 2 s.
3. Llegar a ~20 s y cerrar el bucle sin costura (el final tiene que enlazar con el primer fotograma).
4. Copy: «AFTER DARK», «MADE TO BE FELT» y los textos pequeños son provisionales; pasarlos por copywriting.
5. Versión vertical para móvil, peso del MP4/WebM, póster y versión estática para `prefers-reduced-motion`; integrarlo en el hero.

## Referencia: qué hace Yakushev (análisis de sus 10 piezas)

Sus piezas son **webs que se animan solas**: la interfaz siempre en pantalla (MENU, frase centrada, interruptor,
«CART 00», párrafo en mayúsculas pequeñas abajo a la izquierda). Recursos: marquesina gigante con la imagen dentro
de las letras; letras rotas escritas sobre la imagen; bloque escalonado con vídeo en el hueco de una línea; **glitch
en el que las líneas se adelgazan en franjas hasta desaparecer**; imagen que crece de rectángulo pequeño a pantalla
completa; letras grandes dispersas sobre metraje que corta (Elkruff). Cortes cada 2–4 s, nunca fundidos.
Los vídeos se descargan del CDN de Webflow que enlaza el HTML de su home (`curl` de la portada y buscar `.mp4`).
