# Revisión de calidad: Yakushev · Metalab · Plastic frente a la maqueta (2026-10-12)

Análisis medido en vivo (Playwright + lectura de sus bundles JS): curvas y tiempos salen de su
código, no de estimaciones. Capturas y código formateado en el scratchpad de la sesión
(`research/{yakushev,metalab,plastic}`), no versionados.

## Lo que ya tenemos alineado
- Scroll suavizado con Lenis (Yakushev lerp 0,1 · Metalab lerp 0,1 · nosotros 0,085).
- MaskReveal de Metalab (0,8 s Power3.easeInOut, 1,3→1) — confirmado exacto.
- Transición home→caso de Metalab (1,5 s Power4.easeInOut) — confirmado; nos falta su fase 2 (ver B4).
- Parallax por elemento a distintas velocidades y parallax interno imagen/marco (Yakushev).
- Ritmo de home casi uno por pantalla, cifras gigantes, selector claro/oscuro (Metalab también lo tiene).
- Desenfoque → foco como entrada (es el lenguaje de Yakushev).

## A · Sistema (lo que da la sensación de «premio»; base de todo lo demás)
1. **Una curva firma y 3 duraciones canónicas.** Yakushev: expo.inOut en todo. Plastic: CustomEase
   `.57,.24,.08,1`. Metalab: Power3.easeOut entradas / Power3–4.easeInOut pantalla; 0,3 · 0,8 · 1,2 s.
   Nosotros mezclamos 4–5 curvas sueltas. → `motion.ts` con tokens y auditoría de todos los usos.
2. **Salidas más rápidas que entradas** (Metalab: hover 0,8 s entra / 0,3 s sale). Nosotros simétrico.
3. **Un motivo visual de marca repetido** (Metalab: la línea vertical que se abre en preloader,
   transiciones y menú; Yakushev: el «A®» partido que queda como marcas laterales). Candidato
   nuestro: la **línea central** de la entrada B que se abre.
4. **Intro/preloader con significado, una sola vez** (cookie/localStorage; modo rápido después) y
   scroll bloqueado mientras dura. Nosotros: nada.
5. **Escala fluida pura** (Yakushev `html{font-size:1vw}`; Plastic todo en vw desde un lienzo de
   2184). Nosotros: clamps sueltos. → decidir lienzo y escalar todo igual.

## B · Transiciones y navegación
1. **Transición para TODOS los enlaces**, no solo tarjeta→caso: Metalab «portal» (paneles que cierran
   hacia la línea central 0,7 s, 0,5 s, reabren 0,7 s); Yakushev desenfoque + negro 1,4 s.
   Nosotros: corte seco en nav, «siguiente caso», contacto, volver atrás.
2. **Cabecera que evoluciona con el scroll** (Metalab: barra → pastilla de cristal 645 px ligada al
   scroll; Yakushev: la barra del pie del hero sube hasta ser cabecera; Plastic: segunda cabecera).
   Nosotros: estática.
3. **Menú propio en móvil** (Yakushev: backdrop-blur 30 px + palabras grandes con máscara; Metalab: la
   página encoge a tarjeta; Plastic: polígonos diagonales). Nosotros: 4 enlaces apretados en 390 px.
4. **Fase 2 de la llegada al caso** (Metalab): tras crecer la imagen, el hero baja a su sitio 1,2 s
   Power3.easeInOut revelando el título.
5. **«Siguiente caso» como cierre narrativo** (Metalab: ticker gigante que se apaga a 0,2 al hover,
   imagen 1,15→1, clic con zoom a 1,6 que encadena con la transición).
6. **Bloqueo de clics y scroll durante transiciones** (Yakushev) para que nada se vea a medias.

## C · Interacciones (hover, cursor, enlaces)
1. **Hover de tarjetas de proyecto** (no tenemos ninguno): Metalab máscara que crece desde un lado y
   textos que entran desde direcciones opuestas (±40 px, 0,8/0,3 s); Yakushev etiqueta «→ CASE
   STUDY» que sigue al ratón dentro de la tarjeta + info que aparece tras 1 s quieto.
2. **Cursor contextual solo donde aporta** (Plastic: círculo 88 px «View work», sigue con 0,5 s;
   Metalab: estados semánticos). Propuesta: etiqueta «Ver caso» en tarjetas, sin cursor global.
3. **Enlaces con texto que rueda** (Yakushev: `text-shadow` duplicado + letras que suben, stagger
   11 ms, 0,5 s) y **subrayado que crece / sale por un lado y entra por otro** (Metalab).
4. **Botones con relleno direccional** (Plastic: entra por abajo, sale por arriba, 0,3 s) y flecha que
   se desplaza al hover.
5. **Retraso intencionado** antes de mostrar info al pasar el ratón (Yakushev 1 s) para evitar ruido.

## D · Texto y tipografía
1. **Titulares por línea con máscara doble** (Plastic: `.line` recorte + `.line-child` translateY,
   1–1,4 s, stagger 0,05–0,1; Yakushev igual en móvil, letras desde el centro en el nombre).
   Metalab hace lo contrario (párrafos solo con fundido). → máscara por línea en titulares y
   frases grandes; párrafos con fundido simple (contención).
2. **Contadores tipo cuentakilómetros** (Yakushev «19-26»: dígitos que ruedan; Plastic: año del
   preloader; Metalab: cifra que sube en su máscara + línea scaleX 1,2 s). Nuestras cifras solo
   aparecen.
3. **Mezcla display + serif itálica en la misma frase** (Yakushev Suisse + Apparel Italic; Metalab
   serif fina PP Eiko 240–300 a 140 px frente a sans 16 px). Es dirección de arte, no código, pero
   es el mayor salto visual disponible.
4. **Párrafo de intro enorme** (Metalab 56 px) y tracking negativo sistemático (−0,01 a −0,06 em).
5. **Microtipografía**: etiquetas entre paréntesis «(Info)», recuentos en superíndice «All⁽¹⁵⁾»,
   numeración «00-1», punto final en nombres (Plastic «BBVA.»).
6. **Esperar a `document.fonts.ready`** antes de partir texto (Plastic).

## E · Detalles vivos y acabado
1. **Reloj local en vivo** (Yakushev «YEREVAN 03:36 PM»; Metalab rota ciudades cada 5 s) → «Barcelona
   HH:MM» con dígitos que ruedan.
2. **Footer grande** con nombre gigante, CTA, enlaces con microanimación y «volver arriba».
3. **`mix-blend-mode: difference`** en textos sobre imagen/vídeo (Yakushev 48 reglas, Plastic).
4. **Fondo por sección** con fundido (Plastic, dos capas fijas + difference).
5. Favicon animado (Yakushev, opcional).

## F · Técnica (no se ve, se nota)
1. **Imágenes optimizadas**: webp/avif responsive con `srcset`, placeholder de color o borroso y
   fundido al cargar (Metalab `w=50` → grande). Nosotros: PNG de 1920 sin optimizar.
2. **Vídeo gestionado**: cargar al acercarse, descargar al salir, pausar fuera de pantalla, presupuesto
   de MB por dispositivo (Metalab 3 MB / 0,75–1,2 MB). Gloop tiene ~12 vídeos reproduciéndose a la vez.
3. **Reduced motion completo** (Metalab en todos los componentes). Nosotros: parcial (no en vuelo,
   telón ni entrada B).
4. **Estados de foco** (`:focus-visible`): ninguno de los tres los tiene → podemos superarlos.
5. **Sincronía GSAP/Lenis/ScrollTrigger** con un solo ticker (Metalab `lagSmoothing(0)`); en nuestro
   caso framer + Lenis: revisar que todo lea la misma posición de scroll.

---

## Anexo · Valores exactos medidos (para implementar sin volver a investigar)

### Yakushev (Webflow + GSAP 3.15 + ScrollTrigger + SplitType + Lenis 1.2.3)
- Lenis `lerp 0.1, wheelMultiplier 0.7, smoothTouch false`. Barra de scroll oculta.
- Curva firma `expo.inOut` (≈ `cubic-bezier(.87,0,.13,1)`); IX2 `cubic-bezier(.645,.045,.355,1)`;
  flechas `cubic-bezier(.23,1,.32,1)` 600–650 ms.
- Intro: logo «A®» a escala 5 con blur 20 px → nítido (2 s expo.inOut), se parte ±43vw y baja a escala
  1 (2 s); nombre letra a letra desde `yPercent 150`, stagger 0,03 desde el centro, 1,5 s. Scroll
  bloqueado durante la intro. No se repite en navegación interna (`sessionStorage`).
- Letras barajadas en textos pequeños: aparición cada 40 ms, permutación cada 100 ms, 0,5–0,8 s.
- Enlaces: `text-shadow: 0 1.23em 0 currentColor` + letras `yPercent -96`, stagger 0,011, 0,5 s
  expo.inOut (grandes: −116, 0,02, 0,65 s). Salida instantánea.
- Contador «19-26»: cada dígito con clon arriba/abajo alterno, rueda ±100 % en 1,5 s power4.inOut,
  stagger 0,02.
- Párrafos `letters-fade-in`: cada letra opacidad 0 + blur 10 px → nítida con scrub 0,15, de
  `top 80%` a `bottom 20%`.
- Hero con scroll: fondo baja 0,25·vh y pasa a blur 35 px + opacidad 0 (scrub 0,5). La barra del pie
  del hero sube de 92vh a 0 hasta ser cabecera.
- Parallax cruzado: tarjeta pequeña y 25rem→−25rem con imagen −3rem→3rem; grande 6→−6 / −5→5.
- Hover tarjeta: etiqueta «→ CASE STUDY» sigue al ratón (suavizado 80–90), escala 0→1 400 ms; info
  barajada tras 1000 ms quieto. Rejilla: hover desenfoca título y footer 18 px en 800 ms.
- Transición entre páginas: capa negra 1000 ms con 300 ms de retraso + `backdrop-filter` 10 px;
  cambio de URL a 1400 ms. Las marcas «A» y «®» nunca desaparecen.
- Tipo: Suisse Intl 400/500 + Apparel Italic; `html{font-size:1vw}`; nombre 216 px, interlineado
  0,81, tracking −0,06em; etiquetas 13,68 px mayúsculas. Reloj «YEREVAN 03:36 PM» en vivo.

### Metalab (Next.js + GSAP 3.14.2 + ScrollTrigger + Lenis 1.0.19, sin SplitText ni WebGL)
- Lenis `duration 1.2` (efectivo lerp 0,1) en `gsap.ticker` con `lagSmoothing(0)`; táctil nativo.
- Curvas: Power3.easeOut (36 usos), Power4.easeInOut (17), Power3.easeInOut (11). Duraciones 0,3 ·
  0,8 · 1,2 (· 1,5 · 1,8).
- MaskReveal: `clip-path: polygon(0 0,100% 0,100% var(--left-y),0 var(--right-y))` animando las
  variables 0→100 %, 0,8 s Power3.easeInOut, hijo 1,3→1; fondo placeholder `#171717`.
- Home→caso: 1,5 s Power4.easeInOut (rect SVG que crece, rx 8→0, contenedor 0,4→1); tras el push el
  hero baja a su sitio 1,2 s Power3.easeInOut con delay 0,2 descubriendo el título.
- Transición «portal»: paneles del color invertido cierran hacia una línea vertical central (radio
  16 px) 0,7 s Power4.easeInOut, 0,5 s en blanco (scroll arriba), reabren 0,7 s Power3.easeInOut.
- Hover tarjeta home: máscara SVG crece desde un lado 0,8 s Power3.easeOut (sale 0,3 s); textos ±40 px
  desde direcciones opuestas; overlay 20/40/60 %. La imagen no escala.
- Cabecera: timeline con `progress = clamp((scroll−50)/350)` de barra a pastilla 645 px,
  `border-radius 1000px`, `rgba(186,186,186,.6)` + `backdrop-filter: blur(20px)`.
- Menú: la página encoge a tarjeta vertical (1,2 s Power4.easeInOut abrir / Power3 cerrar).
- Cursor (≥967 px): SVG 96 px sin lerp; estados 0,3 s Power3.easeOut: punto r6, foco anillo r17
  morado, «Hover/Drag» r48, vídeo con blur 20 px.
- Estadísticas: cifra que sube en su máscara 1,2 s Power3.easeOut stagger 0,3, línea scaleX 1,2 s.
- Next case: ticker «Next case study •» 220 px lineal 0,8 s/carácter; hover imagen 1,15→1 y ticker a
  0,2 (1,2 s Power3.easeOut); clic imagen a 1,6 en 0,96 s Power3.easeInOut → portal.
- Texto del caso: solo fundido 1 s power1.out stagger 0,1 (`top+=100px bottom`). Sin split.
- Vídeo: carga a 1200 px de entrar, descarga al salir, fade 0,3 s cuando hay frames; presupuesto 3 MB
  escritorio / 0,75–1,2 MB móvil. Imágenes Sanity webp/avif con placeholder `w=50`.
- Tipo: PP Eiko (serif 240–400) + Basis Grotesque 350; titular caso 140/168 −2,1 px; intro 56/67,76;
  texto 16/22,4. Separación vertical entre secciones 180 px; margen lateral 24 px.
- Reduced motion en todos los componentes. Tema claro/oscuro con transición 0,4 s.

### Plastic (Laravel + jQuery + GSAP 3.10.3 con ScrollSmoother, SplitText, CustomEase; Barba; Three r128)
- ScrollSmoother `smooth 1.5` (ease expo), desactivado en táctil; pausado durante intros.
- CustomEase firma `.57,.24,.08,1`; menú `M0,0 C0.294,-0.002 0.208,0.996 1,1`; preloader
  `.71,0,.12,.99`; botones CSS `cubic-bezier(.52,.24,.08,1)` 0,3 s.
- Texto: SplitText por líneas/palabras con doble envoltura (`.line` con
  `clip-path: polygon(0 0,100% 0,100% 0,0 50%)` + `.line-child` desde `translateY(100%)`), 1–1,4 s,
  stagger 0,05–0,1; letras `y 110%` 0,6 s power3.out stagger 0,03. Espera a `document.fonts.ready`.
- Preloader (una vez, cookie): contador de años con dígitos que ruedan (0,76 s, stagger 0,1) y salida
  `scaleY 1→0` 1 s.
- Cursor: círculo 88 px solo sobre `[data-cursor]` con etiqueta («View work»), escala 0,5→1 con
  retardo 0,3 s, seguimiento `gsap.to` 0,5 s.
- Botón píldora: relleno `scaleY(0)` que entra por abajo y sale por arriba (cambia
  `transform-origin`), 0,3 s; texto invertido con difference.
- Fondo por sección: dos capas fijas blanco/negro con fundido 0,6 s en `top 60%` + texto en
  `mix-blend-mode: difference`.
- Hover WebGL: ola diagonal sobre plano Three, 1,2–1,8 s, render solo bajo demanda.
- Transición a caso: la imagen sobrevive como plano WebGL y se borra con máscara de abajo arriba
  (1,2 s) mientras el fondo pasa de negro a blanco. Volver: fundido 0,4 s.
- Escala: todo en vw desde lienzos 2184 / 768 / 390. Tipo: PP Neue Montreal 300/400; headline-1
  139,8 px / 96 % / −0,01em; etiquetas 11,9 px mayúsculas tracking .04em.
- Caso: separación entre módulos 47 px (= medianil), 332 px de aire antes de bloques de texto.

### Valores comunes a las tres
- Scroll suavizado (lerp ≈ 0,1) y ~58–60 fps medidos en scroll.
- Ninguna tiene estados `:focus-visible` cuidados (oportunidad para nosotros).
