# STORYBOARD — SwifT hero

**Format:** 1920×1080 · 15 s · bucle sin costura (último fotograma = primero: blanco con el icono)
**Audio:** ninguno (cabecera muda del portfolio)
**Style basis:** DESIGN.md

## Dirección de movimiento (skill `motion-design`)

- **Personalidad: Premium** — el producto «se aparta del camino»: elegante, sereno, sin rebote.
- **Curva firma (80 %)**: `cubic-bezier(0.4, 0, 0.2, 1)` (GSAP: `CustomEase` equivalente → `power2.inOut`
  para lo que está en pantalla, `power3.out` para entradas, `power2.in` para salidas).
- **Paleta de duraciones**: rápida 0.35 s · estándar 0.5 s · lenta 0.8 s.
- **Entrada**: fundido lento + escala 0.98 → 1 + subida corta (16–24 px). Overshoot 0 %.
- **Tres capas** en cada beat: primaria (lo que se sigue), secundaria (sombra, etiquetas), ambiente
  (halo violeta muy suave que respira, deriva de cámara 1 → 1.03).
- **Regla 1/3**: nunca más de un tercio de elementos moviéndose a la vez; escalonados ≤ 500 ms.
- **Salidas** un 30–50 % más cortas que las entradas.

## Asset audit

| Asset | Tipo | Beat | Papel |
|---|---|---|---|
| capture/assets/swift-app-icon.png | Icono app | 1, 4 | Marca de apertura y cierre |
| capture/assets/logo-63a7e754.svg | Rayo SVG | 4 | Firma junto al nombre |
| capture/assets/svgs/logo-243b0917.svg | Apple | 3 | Motor Apple Translation |
| capture/assets/svgs/logo-d18effa5.svg | Google | 3 | Motor Google Translate |
| capture/assets/svgs/logo-68b088b8.svg | Chip violeta | 3 | Motor TranslateGemma (en el dispositivo) |
| capture/assets/start-translatingin-30-seconds.png | Icono grande | SKIP | Duplica el icono |
| favicon / icon-unsized | Iconos | SKIP | Baja resolución |

## BEAT 1 — ICONO (0.0–3.2 s)

**Concepto:** blanco absoluto; el icono aparece como si siempre hubiera estado ahí.
**Visual:** icono 220 px centrado: fundido + escala 0.98→1 (0.8 s). Sombra llega 0.1 s después
(secundaria). Halo violeta `#7C3AED` al 6 % respira detrás (ambiente). A 1.1 s, «Translate anything.»
entra palabra a palabra (stagger 80 ms, +20 px → 0). A 2.7 s todo se desplaza hacia arriba y se
desvanece (0.4 s, salida).

## BEAT 2 — EL GESTO (3.2–8.4 s)

**Concepto:** el producto en una frase: seleccionas, pulsas, ya está. Sin cursor.
**Visual:** ventana tipo Notas (semáforo, 960×520, sombra `0 8px 40px`) entra desde 24 px abajo.
Dentro, «¿Quedamos mañana a las nueve?». A 4.3 s el resaltado de selección (violeta al 18 %) se dibuja
de izquierda a derecha (0.5 s). A 5.0 s, bajo la ventana, las teclas ⌥ ⌘ T aparecen en cascada y
se hunden una a una (presión: escala 0.96 + sombra mínima, 120 ms). A 5.9 s llega la notificación
macOS arriba a la derecha (entra desde la derecha 40 px, 0.5 s): icono + «SwifT» + «Shall we meet
tomorrow at nine?». Cámara: deriva 1 → 1.03 durante el beat (ambiente). Salida: todo sube 30 px y
se desvanece (0.35 s).

## BEAT 3 — MOTORES (8.4–11.8 s)

**Concepto:** tres motores, cero configuración.
**Visual:** antetítulo violeta «TRANSLATION ENGINES» y «Three engines. Zero setup.» (dos líneas,
stagger 80 ms). Tres filas-tarjeta (TranslateGemma 4B · Apple Translation · Google Translate) entran
escalonadas 100 ms desde abajo; cada logo hace un pequeño 0.9→1 tras su tarjeta (secundaria). Una
etiqueta violeta «Most accurate» se ilumina en la primera. Salida: fundido 0.35 s.

## BEAT 4 — CIERRE (11.8–15.0 s)

**Concepto:** volver al principio. Una tecla, una frase.
**Visual:** «One shortcut.» grande; debajo ⌥ ⌘ T se pulsan juntas una vez. Después rayo + «SwifT
Translator» pequeño. A 14.2 s todo se funde salvo el icono, que vuelve al centro con el mismo tamaño
que en el fotograma 0 → bucle sin costura.

## Production Architecture

```
motion/swift-hero/
├── index.html            composición raíz (4 beats en línea de tiempo)
├── DESIGN.md · SCRIPT.md · STORYBOARD.md
└── capture/              captura de la web (no se versiona)
```
