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

## Estado (prueba 05, 2026-10-29, 19 s) — pendiente de que la vea Alberto

| Tiempo | Qué pasa | Ritmo |
|---|---|---|
| 0–2 s | Montaje frenético + «AFTER / DARK®» descifrándose; zoom dentro de la «A» | caña |
| 2–2,8 s | Ráfaga de cortes de dispositivos | caña |
| 2,8–5,6 s | Bloque escalonado «PLAY / [hueco] THE / MOMENT». **Golpe a 4,6 s**: el clip del hueco revienta a pantalla completa 5 fotogramas y el bloque vuelve recolocado. La «E» se estira y todo colapsa en franjas | caña |
| 5,8–8,9 s | Componentes de Dovla con rebote; **el primero entra en el golpe del colapso** (ya no hay hueco ciruela) | calma |
| 8,9–11 s | Móvil de Dovla: máscara de la web y giro en perspectiva | calma |
| 11–14,6 s | **Nuevo**: marquesina gigante, dos líneas en sentidos opuestos con el metraje dentro de las letras; saltan y se inclinan en cada golpe | caña |
| 14,6–16,8 s | **Nuevo**: la imagen nace en un rectángulo pequeño, crece a pantalla entera y encadena cortes | media |
| 16,8–19 s | Montaje frenético con «MADE TO / BE FELT» y colapso en franjas; el último fotograma casi negro corta con el primero (bucle en un golpe) | caña |

Las marcas de tiempo de la segunda mitad cuelgan de `C` (inicio del cierre) en `comp.html`; `DUR = C + 2,2`.

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

1. Feedback de Alberto a la prueba 05 (sobre todo la marquesina y el crecimiento, que son nuevos).
2. Copy: «AFTER DARK», «MADE TO BE FELT», las líneas de la marquesina y los textos pequeños son provisionales; pasarlos por copywriting. El «◦» sale de una fuente de reserva (Satoshi no lo tiene).
3. Versión vertical para móvil, peso del MP4/WebM (el máster de 19 s pesa ~37 MB), póster y versión estática para `prefers-reduced-motion`; integrarlo en el hero.

## Referencia: qué hace Yakushev (análisis de sus 10 piezas)

Sus piezas son **webs que se animan solas**: la interfaz siempre en pantalla (MENU, frase centrada, interruptor,
«CART 00», párrafo en mayúsculas pequeñas abajo a la izquierda). Recursos: marquesina gigante con la imagen dentro
de las letras; letras rotas escritas sobre la imagen; bloque escalonado con vídeo en el hueco de una línea; **glitch
en el que las líneas se adelgazan en franjas hasta desaparecer**; imagen que crece de rectángulo pequeño a pantalla
completa; letras grandes dispersas sobre metraje que corta (Elkruff). Cortes cada 2–4 s, nunca fundidos.
Los vídeos se descargan del CDN de Webflow que enlaza el HTML de su home (`curl` de la portada y buscar `.mp4`).
