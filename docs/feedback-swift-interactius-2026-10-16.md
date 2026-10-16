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
- [x] Por dentro: las etiquetas violetas nacen de la barra y crecen hacia arriba, mismo tempo.
- [x] Fuera las banderas (`ImpossibleFlags.tsx` queda sin usar; borrar con tu OK).
- [x] Fuera los tres conceptos de icono (los SVG `concept-*.svg` quedan sin usar).
- [x] Icono sobre imagen para que se vea el cristal — **fondo provisional (degradado)**.
- [x] Landing: captura a toda página en inglés (WebP 216 KB, más ligera que el vídeo); la máscara se abre a
      pantalla completa, se queda fija y la web hace scroll entera con su barra quieta (`WebScroll.tsx`).
- [ ] **Pendiente de Alberto:** imagen de fondo para el icono (prop `bg` de `IconStory`).
- [ ] **Pendiente de Alberto:** lámina técnica del diseño del logo (irá antes del icono).

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
