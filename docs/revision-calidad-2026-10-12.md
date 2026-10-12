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
