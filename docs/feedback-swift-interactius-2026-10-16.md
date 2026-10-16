# Feedback de SwifT e Interactius (Alberto, 2026-10-16)

## Todos los casos
- [x] Cierre común: frase centrada, sin titulillo «Resultado» ni párrafo, botón debajo si lo hay
      (`components/case-study/CaseClosing.tsx`, en los 7 casos y en las dos plantillas).

## SwifT
- [x] Cuatro funciones rehechas (`swift/FeatureCards.tsx`), con el menú real de la app:
      1. apps en bandas laterales grandes (patrón), sin vibrar;
      2. auto-flip con traducción real en bucle y las teclas encima (escribir → ⌘A → ⌥⌘T → da la vuelta);
      3. menú que se despliega, descarga TranslateGemma 4B (2,49 GB) con barra, aviso y después «Uninstall»;
      4. esquina de un MacBook (tapa, bisel, notch) con barra de menús: clic en el rayo y se abre el menú.
- [x] Por dentro (2.ª vuelta): la etiqueta es el propio trazo que crece en alto, a todo el ancho de la barra,
      con las esquinas de arriba redondas y las de abajo rectas. Mismo tempo.
- [x] Fuera las banderas (`ImpossibleFlags.tsx` queda sin usar; borrar con tu OK).
- [x] Fuera los tres conceptos de icono (los SVG `concept-*.svg` quedan sin usar).
- [x] Icono sobre fondo de cristal oscuro dibujado en CSS: luz cálida y fría detrás y dos placas esmeriladas
      con la forma de cada esquirla.
- [x] Landing (2.ª vuelta): misma apertura de máscara, pero dentro un MacBook minimal en CSS con la web en
      vídeo bajando y subiendo en bucle (`swift/LandingMac.tsx`, `landing/scroll.mp4`, 2 MB). El scroll del caso
      ya no se para. Los datos (14 idiomas, telemetría, 2,49 GB) van justo debajo. `WebScroll.tsx` queda sin usar.
- [ ] **Quizá de Alberto:** alguna imagen más técnica del diseño del logo (iría antes del icono).

## Interactius
- [x] Fuera las formas geométricas, el calendario (Gantt) y el texto líquido.
- [x] Logo en técnico: primera propuesta con la lámina de construcción del repo (`interactius-logo-tecnic.svg`)
      y el porqué del macrón. **Repasarlo juntos.**
- [x] Tipografía: Plex Mono (marca, logotipo, Regular/Semibold) + Plex Serif (contraste, Light/Regular), con
      el porqué del manual (`TypePair.tsx`). «Una sola fuente» pasa a «Un solo origen».
- [x] La web: recorrido real del manual en vídeo (24 s, paradas por sección) dentro de un portátil —
      **marco CSS provisional, la imagen se decide juntos**.
- [x] Capítulo «Preparada para IA»: prompt técnico de imagen con sus dos variantes y el clic de copiar junto a
      las fotos de referencia (no se presentan como generadas), el tono como prompt + validador, la capa para
      máquinas (prompt maestro, llms.txt, brand.json, validador, ReWritr, IMGr) y el origen único.
- [x] DeckMakr a todo el ancho dentro de su ventana — **recreado; falta grabar la herramienta de verdad**.
- [ ] **Pendiente:** grabar DeckMakr (está tras el login del equipo): o lo graba Alberto, o lo abre en su Chrome
      con sesión y lo grabo yo.
