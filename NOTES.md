# NOTES — anico_portfolio2026

> Retoma rápida entre Macs. Detalle de arquitectura en `CLAUDE.md` / `INIT.md`.

## ▶ EMPEZAR AQUÍ (cierre 2026-10-12 noche, MacBook)

Rama `case-study-maqueta`, todo commiteado y pusheado. `npm run dev` → `localhost:3000/maqueta`.
**Demo pública de la maqueta: https://anico-maqueta.vercel.app** (proyecto de Vercel aparte, `anico-maqueta`,
`prj_IPCyRe2TsbnQvF3UZ65J1x0NVSaX`; nada que ver con anico.design). La raíz redirige a `/maqueta` (solo en
ese proyecto, `next.config.ts`). Para actualizarla, desde la rama:
`VERCEL_ORG_ID=team_KTElqOD9OtNMTmjQ9Vc7BPgB VERCEL_PROJECT_ID=prj_IPCyRe2TsbnQvF3UZ65J1x0NVSaX vercel deploy --prod --yes`
(sube los vídeos de Gloop aunque estén fuera de git, porque salen del disco: hacerlo desde el MacBook).

**Hecho en esta sesión** (detalle en las secciones de arriba): bloque A (sistema de movimiento,
escala tipográfica `.t-*`, escala fluida); bloque B (barrido vertical entre páginas con logo que hace el
rodillo del menú en bucle mientras carga; bloqueo de clics/scroll; menú propio en móvil; llegada al caso;
«Siguiente caso» con ventana que se abre); portada partida en `/maqueta` (adonde lleva el logo);
cabecera de las homes viva (pase de imágenes que se recoge a media pantalla; logo fijo arriba y menú al
pie que sube y se pega); todo con máscara, sin desenfoques; Instrument Sans + Playfair cursiva;
titulillos `.t-tag`; negro puro en oscuro; logo y menú con `mix-blend-difference`; arreglos de Safari.

**Pendiente / próxima sesión:**
- **ÚLTIMO PASO ANTES DE PRODUCCIÓN (pedido por Alberto, 2026-10-13): audit técnico final + optimización
  de imágenes y vídeos (F1).** Las imágenes y vídeos aún no son finales, por eso no se optimizan ahora.
  Al cerrar la web: AVIF/WebP a varios anchos con `srcset`, placeholder de color y fundido; vídeos
  recomprimidos. Regla: **pesar lo menos posible sin que ninguna imagen pierda calidad visible** (es un
  portfolio gráfico). Hoy: 176 imágenes, 286 MB, 97 PNG de más de 1 MB (la mayor, 7,6 MB). En el audit,
  repasar también accesibilidad (foco, movimiento reducido, contraste) y rendimiento.
- **Bloque C** de la revisión: hover de tarjetas, etiqueta «Ver caso», enlaces (hover = `RollText`).
- **Énfasis en titulares**: queda Playfair cursiva «a ver si se acostumbra»; revisar más adelante.
- **Standby**: A3 motivo de marca + A4 intro (propuestas en la sección del bloque A); palabras que
  cambian (aparcado, regla: sola en su línea).
- ¿Borrar `components/case-study/Inked.tsx` y `lib/maqueta/ink.ts`? (sin uso; pendiente de su OK).
- ¿Texto en blanco/negro puros también (`#FFF`/`#000`) además del fondo? (preguntado, sin respuesta).
- Frases de los casos: ¿centradas en columnas 3–10 como la intro de las homes? (ahora 3–9).
- Contenidos: casos más cortos y con menos imágenes de más calidad (Gloop el primero).

## Lo primero: esta es la carpeta buena

`~/Vibe_Projects/anico_portfolio2026/` es **el portfolio en producción** → proyecto Vercel
`anico_portfolio2026` (`prj_0jnbmUrypD9B9LiDSiAVntkSHwFy`) → **`anico.design`**.

La otra carpeta, `~/Vibe_Projects/anico_portfolio26_old/`, es el **v1 archivado**: no tiene dominio
custom y su último deploy a producción quedó `BLOCKED`. **No se toca.** Se renombró con `_old`
el 2026-07-31 justo para no volver a confundirlas.

Dos trampas que ya han costado tiempo:
- El `.vercel/project.json` de esta carpeta tiene un `projectName` desactualizado
  (`anico_portfolio26_2`). El `projectId` sí es correcto — fiarse del id, no del nombre.
- Las rutas de caso son **`/proyecto/[slug]`**, no `/work/[slug]` (eso es del v1).
  Y `lib/projects.ts` conserva slugs del v1 que ya no se corresponden con las carpetas
  de `public/projects/` — la home se construye del escaneo de carpetas.

## Estado a 2026-07-31

Todo desplegado y verificado en producción. Working tree limpio, `main` pusheado.

Último trabajo (commit `e9e339e`): actualizadas `SwifT_1/5/8.png` del proyecto SwifT — cambian el
icono de la app de la 'S' geométrica al **rayo** — y corregido el copy de
`public/projects/swift-project/content.txt`, que en el bloque `[process]` seguía describiendo
*"a sharp geometric 'S' mark"* → ahora *"bolt mark"*.

Ojo: esas 3 imágenes se habían actualizado **en la carpeta vieja** por error. Si algún cambio de
assets "no se ve", comprobar primero en cuál de las dos carpetas se tocó.

## Tipografía (D3, 2026-10-12)

**Instrument Sans** para todo y **Playfair Italic** en palabras destacadas de los titulares (se marcan con
`*asteriscos*` → `.kw`; 116 % del cuerpo de la sans y sin partirse entre líneas). Probadas y descartadas:
Instrument Serif (estrecha), DM Sans + DM Serif Display, gris, ácido, imagen en la frase, cursiva de la
sans, anchura variable, barras. Selector `?em=` retirado. Titulillos (antetítulos y datos) en un
solo estilo `.t-tag`: Instrument Sans 500, MAYÚSCULAS, espaciado 0,1 em (se probaron Geist Mono e
Instrument Serif; descartadas). Geist Mono ya no se carga. Display a peso 700 (Instrument Sans no llega a 800). Intro de las homes
`.t-hero` a 64 px (empezó en 80). Las máscaras de texto llevan margen por abajo para no cortar g/j/p.

## Titular de las homes: palabras que cambian (probado y aparcado, 2026-10-12)

`{a|b|c}` en el titular → una palabra cambia cada 2,4 s, letra a letra en ola con la máscara del menú
(`Rotating` en `HomeHero.tsx`). Le gusta para la intro: da movimiento y **hay que huir de lo estático**
(también con imágenes siempre en movimiento). Como recurso gráfico general se queda corto; se reusará
donde haga falta. **Aparcado**: al cambiar el ancho de la palabra se recoloca la frase y salta de línea
(Games 3-4 líneas según palabra y ancho), y cada idioma o pantalla pediría ajustes a mano. Si vuelve:
regla de que la palabra que cambia vaya sola en su línea. El componente sigue en el código (solo actúa
si el titular lleva `{a|b|c}`); los titulares de las homes van fijos.

## Énfasis en titulares (en prueba, 2026-10-12)

Recurso sans + serif cursiva: le gusta pero lo ve **trillado**. Gris + palabras en color pleno:
**descartado** (pierde potencia). Degradado ácido en las palabras clave: le gustó (idea: verde para Games, violeta para Product), pero
**descartado**: en tema claro no funciona igual de bien. Se queda el titular con palabras que cambian;
el énfasis se revisará más adelante. Imagen dentro de la frase (`[m]`): muy vista; solo si tiene un juego (ampliarse al
pasar o con el scroll), no puesta porque sí. (Selector de pruebas retirado.) Anchura variable: no convence (y expandir exige otra fuente, p. ej. Mona Sans); descartada.

## Sin desenfoques: todo es máscara (2026-10-12)

El desenfoque se quitó de toda la maqueta (Safari lo hacía mal y es caro de animar). Equivalencias:
hover de enlaces = letras que ruedan (`RollText`); entrada de textos (`FadeIn`, conserva el nombre) =
barrido de abajo arriba; logo de carga = el rodillo del hover del menú, en bucle mientras carga; «Siguiente caso» = ventana que
se abre; menú de móvil = capa sólida que baja; salida de titulares de la portada = máscara que sigue al
borde entre mitades (lateral en escritorio, vertical en móvil), al ritmo de la imagen.

## Contraste del logo y el menú: `mix-blend-difference` + degradado (2026-10-12)

Logo y menú vuelven a la inversión por píxel de Yakushev. La tinta adaptativa (`Inked`, abajo) se
quitó: cambiaba el logo entero con retraso y se notaba el salto. Los grises medios (donde la diferencia
deja gris sobre gris) se evitan con un degradado del fondo bajo la barra en las cabeceras con imagen.
Sobre imágenes de color la inversión da el complementario (como en Yakushev). `Inked`/`lib/maqueta/ink.ts`
quedan sin uso (pendiente de que Alberto apruebe borrarlos).

### Historia: tinta adaptativa (descartada)

La inversión por diferencia deja gris sobre gris en fondos medios (gris 128 → contraste 1:1): el logo se
perdía. Ahora el menú usa `Inked` (`components/case-study/Inked.tsx` +
`lib/maqueta/ink.ts`): mide el brillo real de lo que hay detrás (imagen/vídeo con sus velos, o color de
fondo) y pone blanco o negro puro, nunca menos de 5,3:1. En la portada se probó y se quitó (mareaba):
allí los textos van en blanco sobre las imágenes y en el color del tema en reposo. Tema oscuro en negro
puro (#000; antes #0A0A0B). Depurar: `__inkBehind(el)` en la consola (dev).

## Safari: no usar `whileInView` de framer-motion

En Safari, al llegar a una página navegando (no recargando), el detector de `whileInView` no se
disparaba nunca y los bloques con entrada se quedaban invisibles: páginas en blanco tras el barrido
(2026-10-12; en Chrome no pasaba). Las entradas usan `useSeen()` de `components/case-study/primitives.tsx`,
que va sobre el IntersectionObserver del navegador. Safari tampoco aplica `filter` CSS a trazos dentro de un SVG (solo al elemento entero): las letras del logo
de carga son un `<svg>` cada una por eso.
Para comprobar en WebKit sin Safari:
`PLAYWRIGHT_BROWSERS_PATH=<scratchpad>/pw-browsers npx playwright-core install webkit`.

## Si el dev server se vuelve loco

Síntoma: la página se autorecarga sin parar, no responde, pero `curl` devuelve 200. En el log,
`FATAL: An unexpected Turbopack error` en bucle y montones de `GET /` que nadie ha pedido.

Es el **caché de Turbopack en `.next/`**, no las imágenes ni `node_modules`. El panic dice
`Next.js package not found` pero engaña: la traza acaba en `Project::hmr_version_state`, o sea que
falla el HMR y cada panic dispara un full reload que provoca el siguiente.

```bash
mv .next .next.bak    # apartar, no borrar
npm run dev
```

Verificar que ha quedado arreglado contando en el log: `grep -c FATAL` a 0 y tantos `GET /` como
peticiones hayas hecho tú. Pasa sobre todo tras cambiar `public/projects/`, porque ahí se cachea
el escaneo del filesystem.

## 2026-10-12 (tarde) — BLOQUE A: SISTEMA (hecho A1, A2, A5)

Todo sale ya de dos archivos; **no meter valores sueltos** en componentes:
- `lib/maqueta/motion.ts` — `EASE` (out · inOut · screen, cada una con un papel), `DUR` (fast 0,3 ·
  base 0,8 · slow 1,2 · screen 1,5 · drift 2,4), `STAGGER` 0,1 e `inOrOut(on)` (entra base, sale fast).
- `app/maqueta/system.css` — escala fluida (raíz = ancho / lienzo; lienzos 390 y 1440, tope 18 px en
  móvil, suelo 13 px en escritorio), escala tipográfica `.t-label … .t-d1` (tabla dentro, con mínimos de
  legibilidad en los pequeños), variables `--ease-*`/`--dur-*` y `.hov` (hover 0,8 entra / 0,3 sale).
Excepciones a propósito: `FitTitle` (se mide) y el «Siguiente caso» en vw (se rehace en B5).
**Standby (Alberto, 2026-10-12): A3 y A4 juntos, hasta tener motivo de marca.** (La barra de Yakushev que estaba aquí ya está hecha en las homes.) Propuestas de intro
(solo primera visita, ~2 s, scroll bloqueado): 1) la línea central que se dibuja y se abre en la
entrada B (si la línea acaba siendo el motivo); 2) contador de años tipo cuentakilómetros; 3) «anico»
letra a letra en gigante que encoge hasta el logo del menú. Recomendada: 1, o 3 si no hay línea.
Siguiente: bloque B.

**Bloque B hecho (2026-10-12, sin validar aún por Alberto):** portal en todos los enlaces internos
(`components/case-study/Portal.tsx`: `TLink` y `go()`; **barrido vertical** de abajo arriba del color del
texto, como el telón; los paneles laterales de Metalab se descartaron por demasiado copiados;
con la pantalla tapada espera a que la página nueva esté lista —ruta, fuentes, imágenes y vídeos de la
primera pantalla, tope 6 s— y el logo del centro, al tamaño de la cabecera, hace el rodillo del hover del menú en bucle mientras carga
(`LogoLetters.tsx`; antes relleno de izquierda a derecha, luego letras desordenadas: descartados)); bloqueo de clics y scroll en portal, vuelo y telón (`scrollLock` en `SmoothScroll.tsx`);
cabecera: se probó la placa de cristal de Metalab y **se descartó** (prefiere el menú en su sitio
invirtiéndose, como Yakushev); hover del menú = desenfoque → foco letra a letra (`BlurText`); menú propio en móvil; llegada al
caso en 1,2 s con 0,2 s de espera; «Siguiente caso» propio (`NextCase.tsx`): portada desenfocada que se enfoca
al pasar + ola de desenfoque en el nombre, texto estrecho a la izquierda; vuelo al caso siguiente. El ticker
gigante de Metalab se descartó (copiado, y Alberto duda de los tipos gigantes en general).
**Cabecera de las homes (2026-10-12):** `HomeHero.tsx` continúa la entrada sin corte —el telón se funde
cuando la cabecera pinta la misma imagen (`endCurtain`)—, pase de imágenes a pantalla completa
(`lib/maqueta/sections.ts`, compartido con la entrada) y máscara de abajo arriba hasta media pantalla; el texto respira en la mitad de abajo y la barra (logo +
menú, `SiteNav docked`) aparece al pie y al hacer scroll se queda `sticky` arriba (la barra de Yakushev).
Desde 2026-10-12 el **logo va aparte, fijo arriba a la izquierda desde el principio** y solo el menú va al
pie (`parts="logo"|"menu"`): se lee logo → titular → menú. Intro en `.t-hero` (80 px a 1440, medida de Yakushev: 79 px, peso 400). Fuera el
antetítulo «Alberto Nicolás · …». En la entrada, «01»/«02» pequeños pegados al titular (antes repetidos
abajo).
**Entrada decidida: la pantalla partida** es ahora `/maqueta` (adonde lleva el logo); la A queda en
`/maqueta/entrada-a`. Falta: el botón «atrás» del navegador sigue cambiando de página en seco.

## Cierre anterior (2026-10-12 mediodía, MacBook)

**Primera tarea de la próxima sesión:** abrir `docs/revision-calidad-2026-10-12.md` y decidir con
Alberto por dónde atacar. Es la revisión exhaustiva de Yakushev, Metalab y Plastic contra nuestra
maqueta (medido en vivo, curvas sacadas de su código; anexo con todos los valores exactos).
Diagnóstico: no nos faltan efectos, nos falta **disciplina** (una curva firma + 3 duraciones),
**continuidad** (transición en todos los enlaces) y **un motivo propio repetido**. Mi propuesta de
orden: bloque A (sistema de movimiento + motivo: la línea central de la entrada B) → B1 (transición en
todos los enlaces) y C1 (hover de tarjetas) → decidir pronto la tipografía (D3: serif itálica mezclada).

Rama `case-study-maqueta`, todo commiteado y pusheado. `npm run dev` → `localhost:3000/maqueta`.

**Hecho hoy (además de lo de abajo):**
- Tema negro/blanco con sol/luna; casos asimétricos; home al ritmo de Yakushev.
- Portada de caso unificada (`CaseHeroOverlay`): titular en una línea a todo el ancho, ficha abajo dcha.
- Transición home→caso reescrita (`components/case-study/Flight.tsx`): capa en el layout, arranque
  con el encuadre exacto de la tarjeta, máscara (1,3 s) e imagen (1,5 s) a distinta velocidad,
  relevo sin parpadeo (en vídeo, mismo fotograma), precarga antes del clic. Medido: sin pausas.
- **Entrada B** (`/maqueta/entrada-b`, la que le gusta): pantalla partida Product/Games, titulares
  juntos en la línea central, párrafo abajo en el lado exterior solo al pasar por encima, pase de
  proyectos de fondo; al elegir, la mitad crece a pantalla completa y un telón
  (`components/case-study/Curtain.tsx`) se levanta con barrido de abajo arriba sobre la home.
  La entrada A sigue en `/maqueta` (decidir cuál se queda).
- SwifT: vídeo HyperFrames dentro de las fotos de concepto del MacBook (`motion/mockup.py`, perspectiva
  por registro SIFT con la landing real); miniatura = cabecera; el vídeo del portátil crece entero tras
  la intro (`feature` en `cases.ts`).

**Pendientes sueltos:**
- `public/maqueta/swift/flow.mp4` (vídeo plano sobrante, sin versionar): Alberto decide si se borra.
- Skill `motion-design` solo instalado en el MacBook: en el Mac mini, `npx skills add LottieFiles/motion-design-skill -g -a claude-code -y`.
- Standby de contenidos (7News, Dovla, Interactius, WineUp; «Marca y web»; cifra de Asphalt Unite;
  idioma) — ver la sección de la maqueta navegable más abajo.

## 2026-10-12 — PRUEBA DE MOTION: SKILL `motion-design` + VÍDEO DE SWIFT

Instalado `LottieFiles/motion-design-skill` (`npx skills add … -g -a claude-code`, en
`~/.claude/skills/motion-design`; **solo en el MacBook**: en el Mac mini, repetir el comando).
Ojo: **no lee webs ni genera vídeo**; son principios de motion (tiempos, curvas, coreografía,
Disney). Lo que lee una web y hace vídeo es `website-to-hyperframes` (ya instalado). La prueba
combina los dos: `motion/swift-hero/` → vídeo de 15 s, mudo y en bucle, de la landing de SwifT,
dirigido en Premium (curva única, fundido + escala 0.98→1, sin rebote). Studio:
`cd motion/swift-hero && npx hyperframes preview`. La captura (`capture/`) no se versiona:
en otro Mac, `npx hyperframes capture https://swift-translator.vercel.app -o motion/swift-hero/capture`.
Le gustó. **Siguiente paso hecho: el vídeo dentro de las fotos de concepto del MacBook.**
`motion/swift-screen/` = misma composición a 1920×1200 con barra de menús de macOS (la pantalla
entera). `motion/mockup.py` la mete en `SwifT_hero.png` y `SwifT_thumb.png`: homografía a las
esquinas medidas, luz sacada del fondo blanco de la propia foto, desenfoque de profundidad que
imita el de la foto y máscara que respeta lo que está delante (barra oscura y base del portátil
en la miniatura). Salen `public/maqueta/swift/{hero,thumb}.mp4` (1,1 y 0,6 MB) y se usan como
miniatura de la home y cabecera del caso (`thumb`/`hero` en `lib/maqueta/cases.ts`). Render de
HyperFrames: necesita `ffprobe` en el PATH (en este Mac no hay Homebrew: se usó
`@ffprobe-installer/ffprobe`, el de `ffprobe-static` es Intel y sin Rosetta no arranca).

## 2026-10-12 (MacBook, «tira millas») — MAQUETA NAVEGABLE ENTERA

Entrada en **`localhost:3000/maqueta`** (elegir Product o Games). Rutas: `/maqueta/home` (Product +
bloque «Marca y web»), `/maqueta/games`, `/maqueta/sobre-mi`, `/maqueta/contacto`,
`/maqueta/gloop` (a medida) y **14 casos** en `/maqueta/<slug>` con una plantilla común
(`components/case-study/CaseTemplate.tsx`). Textos de cada caso en **`lib/maqueta/cases.ts`**
(castellano, sacados solo del `content.txt` de la web actual; estructura de textos de
**plastic.design** —frase de cabecera, resumen con el reto como pregunta, capítulos con
titular-frase, pie corto, «Más trabajo» + «Hablemos»— y concisión de Metalab). Medios: los de
`public/projects/<slug>/` tal cual, a su proporción natural (son láminas con texto; nunca recortar),
leídos por `lib/maqueta/media.ts`. Cada caso tiene su color de acento sacado de su portada y fondo
claro u oscuro. Verificado en Chrome headless (escritorio y 390 px): sin errores, sin imágenes rotas,
sin scroll horizontal.

**Ajustes de Alberto tras verla (mismo día):**
- Fondo **negro/blanco** con **sol/luna** a la derecha del menú (recuerda la elección; si no hay,
  sigue al sistema). Fuera los colores por caso y el glow de Gloop.
- plastic.design era referencia **solo para redactar**, no para maquetar: los casos vuelven a la
  **asimetría** (Yakushev/Metalab): imagen grande a un lado y texto estrecho al otro, alternando, y
  el resto de láminas en parejas escalonadas 7+5 con parallax distinto.
- Home con el **ritmo de Yakushev**: casi un proyecto por pantalla; cuando coinciden dos, uno es
  pequeño y va mucho más rápido.

**Standby para Alberto:**
- Sin caso aún (en gris en la home, sin enlace): **7News, Dovla, Interactius y WineUp** — no hay
  texto en la web actual. Hacen falta sus contenidos.
- **Marca y web** (OBLIQ, ACT, GM World!, Metacampus) va como bloque aparte al final de Product. ¿Ahí, o
  tercera sección propia?
- Los protos hipercasuales de `games/` no están en Games (no estaban en la web actual).
- Casos de concepto (Netflix, Nike, Hawkers, Two Dots) quedan cortos: en la web solo tienen el vídeo
  del móvil. Encajan con la idea de mockups en escena + fotos de ambiente.
- Idioma: todo en castellano como el resto de la maqueta; la web final va en inglés (los textos
  viven en un solo archivo para traducirlos de una vez).
- Cifra de Asphalt Unite «1.000M+ descargas»: es la que pone la web actual; suena a la franquicia
  entera, confirmar.

## 2026-10-12 (MacBook) — CASO GLOOP POBLADO CON MEDIOS NATIVOS

Hecho el pendiente de capturas/vídeos: simulador **sin ventana** + **AXe** para toques reales
(sin cursor ni círculos), 24 capturas y 8 grabaciones (vídeo-resumen de ~1 min + ruleta, juego del
día, unirse por invitación, visor de Momentos, La Cuenta, llegada de un Momento). Montadas tipo
Metalab: pantalla con esquinas de iPhone sobre campos de color de Gloop, cada pieza con la
proporción exacta de su hueco. Conectadas en `app/maqueta/gloop/page.tsx` (hero, móvil de la intro,
prototipo, 3 decisiones, 4 de experiencia, franja 21/9, ventana nativa, 3 juegos).
Viven en `public/maqueta/gloop/media/` (**ignorado por git**, solo en el MacBook). El sistema para
regenerarlas está en `scripts/case-media/` (README dentro).

**Siguen en placeholder:** Clones (solo existe en web), las 3 tarjetas de casos límite (no hay ruta
directa a moderación / cerrar con deudas / noche de 2), UI kit, diagramas y portada del siguiente caso.
Pendiente de que Alberto valide el look de las composiciones antes de repetirlo en otros casos.

## 2026-10-11 (cierre) — MAQUETA DE HOME DE PRODUCT + CASO GLOOP (rama `case-study-maqueta`)

Objetivo de Alberto: casos de estudio profesionales de sus apps (Gloop primero; luego El Reto,
7News, Dovla, Interactius, WineUp) y una home de Product separada de Games. Enfoque y criterio de
textos: memoria `casos-estudio-enfoque` (venderle a él de la idea al handoff, sin cliente, IA en
todo, redacción tipo Metalab sin paja).

**Dónde verlo:** `npm run dev` → `localhost:3000/maqueta/home` (clic en Gloop) y `/maqueta/gloop`.
Piezas en `components/case-study/` (`primitives.tsx`, `SiteNav.tsx`, `SmoothScroll.tsx`).
Dependencia nueva: `lenis`. Nada en producción; la web actual no se ha tocado.

**Decidido (no relitigar):**
- Referencias: **Metalab** (caso Midjourney) para concepto, tamaños (56/40/20/16 px a 1300) y
  redacción; **Yakushev** para parallax (Lenis + tarjeta a su velocidad + imagen interna en sentido
  contrario), cifras gigantes y titulares. Inspirarse fuerte, **no copiar** (se rechazó el crecer
  con inclinación 3D de Yakushev por demasiado copiado).
- Easings **exactos de Metalab** (sacados de su JS): máscara 0,8 s `Power3.easeInOut` con imagen
  1,3 → 1; textos 0,8 s `Power3.easeOut` +90 px, escalonado 0,2; transición home → caso 1,5 s
  `Power4.easeInOut`.
- **Geist + Geist Mono** (antetítulos en minúscula); probadas y descartadas Bricolage e Inter.
- **Cantos rectos** en todo (solo los móviles conservan la forma del iPhone). Sin selector
  claro/oscuro: color por proyecto (Gloop = glows de la app, magenta ampliado y subido).
- **Home → caso:** clic en la miniatura → crece EN LA HOME a pantalla completa → cambia de página →
  la imagen se enmascara hacia arriba (franja de cabecera 56 %) → titular arriba-izq y ficha
  abajo-der en diagonal. La miniatura de la home y la portada del caso son **la misma imagen**.
- **Patrón de caso** (para todos): cabecera → intro a la izquierda + UN móvil con vídeo-resumen del
  flujo completo → detalles. Una sola imagen que crece con el scroll por caso (la de la app nativa).
- **Home de Product:** solo proyectos de producto (sin juegos ni marca/web). Primera pantalla:
  titular + primer proyecto + párrafo abajo a la derecha; luego «19–26», el resto en rejilla
  escalonada asimétrica con algunas tarjetas a sangre. Texto de tarjeta solo a un lado:
  `01 / 2026` · nombre · descripción.

**Valoración de Alberto al cerrar: «no estamos llegando al nivel de diseño de Yakushev».** La
estructura y los efectos están; falta el salto de dirección de arte. Próxima sesión, empezar por
ahí: diseccionar qué hace Yakushev a nivel gráfico (escala y contraste tipográfico, mezcla de
pesos/estilos, detalles editoriales, ritmo de vacíos, texturas, micro-tipografía, hover/cursor,
carga de la home) y proponer 2-3 direcciones antes de seguir puliendo layout. Con placeholders
grises cuesta juzgarlo: conseguir antes material real (abajo).

**~~PENDIENTE EN EL MACBOOK~~ (hecho el 2026-10-12, ver arriba) — capturas y vídeos nativos de Gloop** (en el Mac mini el simulador
tiró SpringBoard y salieron popups: no repetir aquí). Compilar `Gloop-app/ios` en un derivedData
fuera del repo, simulador sin ventana, `simctl status_bar override --time 9:41`, y abrir pantallas
con argumentos (`-GloopSkipSplash YES -GloopScenario … -GloopTab … -GloopRoute …`). Rutas útiles
(`GloopDesign/App/DebugLaunch.swift`): `night:piso`, `nightStart:piso`, `tab:piso`,
`expense:piso:x1`, `debt:piso:you:marcos`, `chat:piso`, `crewResults:cracks`, `invite:piso`,
`experienceJoin`, `experienceResult`, `event:<id>`; covers `crew:cracks`, `viewer:n14:0`,
`game:piso:<id>`, `invitation`, `newTeam`, `route`. Pocos relanzamientos seguidos. Ojo: Podium,
Culpable y De 0 a 100 son `GamePlaceholder` en nativo y Clones solo existe en la web; la ruleta
solo se dispara tocando. **El vídeo-resumen del flujo completo**, mejor grabado en el iPhone.
Destino: `public/maqueta/gloop/{screens,phone,hero}/`.
**Las capturas nativas NO se suben** (repo público, UI sin publicar): `public/maqueta/gloop/screens/`
está en `.gitignore`; las 2 que hay viven solo en el Mac mini. Alberto hará las imágenes estáticas
(portada/miniatura, composiciones); los vídeos de móvil los hace Claude.

**Otros pendientes de la maqueta:** textos definitivos (Alberto los está revisando; están en
castellano, la web final va en inglés; validar la premisa de la intro) · ruta corta
`anico.design/gloop` · contraseña opcional para casos sensibles (al final) · casos de El Reto
(este sí con datos), 7News, Dovla, Interactius y WineUp (preguntarle lo que no se sepa).

**Carpeta fantasma en el escritorio (2026-10-11).** Apareció `~/Desktop/Vibe_Projects/anico_portfolio2026`
**vacía** (sin archivos ni git), creada a las 17:55 durante la sesión. Ningún script de
`_machine-config` crea esa ruta; lo más probable es que la creara una herramienta de Claude que aún
tenía la ruta vieja de antes de la mudanza de julio. Borrada con `rmdir` (solo borra vacías), con OK
de Alberto. El trabajo estaba íntegro aquí. Si reaparece: buscar qué la crea antes de borrarla, y
**nunca** `rm -r` ahí sin mirar dentro.

## Pendientes

- **Separar el portfolio en dos recorridos: app/web y videojuegos** (pedido el 2026-09-09).
  Una **pantalla de selección inicial** donde el visitante elige por dónde entrar, y de ahí
  **dos páginas independientes** — proyectos de web/app por un lado, portfolio de videojuegos
  por otro. Son dos públicos distintos y hoy van mezclados.
  Dicho como aviso, **no como encargo inmediato**: *«ya lo haremos»*.
  - Referencia que trajo él, **como ejemplo y no como dirección cerrada**:
    `https://www.art-yakushev.com/` y su página de proyectos `/work`. La vio en A1 y le
    pareció brillante. Sin diseccionar todavía.
  - Cuando se ataque, se empieza por una **búsqueda de referencia abierta** con varias
    opciones para que elija él — es el protocolo, antes de proponer o codificar nada.
  - Contexto medido (A1, sep-2026): el portfolio va hoy con **Inter** en todo y paleta
    blanco/negro, e Inter es la tipografía **nº 1** en portfolios (36 sitios indexados) —
    la elección actual es exactamente la media. En los héroes de portfolio casi ninguna
    tipografía de titular se repite: ahí la tipografía es la firma. Valores de referencia
    sobre 49 héroes: titular 22/**40**/68 px · cuerpo 14/**18**/20 · ratio ×3 · padding
    15/**60**/176 · contenedor ~1.226 px · radio 16 · sombra 8 % · degradado 10 %.

- ~~`.next.bak/` sin borrar~~ — **resuelto el 2026-09-10**: borrada aquí y en
  `anico_portfolio26_old` (593 MB de caché de Next de marzo, sin fuentes dentro).
- ~~Token de GitHub expuesto en el remote~~ — **resuelto el 2026-09-10**: el remote quedó limpio
  (`https://github.com/anico1002/anico_portfolio2026.git`). El token seguía vivo, pero nunca
  llegó a subirse a ningún repo. La autenticación la dan `osxkeychain` y `gh auth`, así que el
  token en la URL era redundante — verificado con `fetch`. **No hace falta revocarlo.**
  Lo mismo se limpió en `CSS-Picker` y `ElReto-app-2026-Lovable`, y `sync-all.sh` ya no escribe
  credenciales en su manifiesto (detalle en `_machine-config/README.md`).

## Comandos

```bash
npm run dev          # localhost:3000
npm run dev:mobile   # 0.0.0.0 para móvil real
npm run build        # build de producción
npx vercel --prod    # deploy (solo con OK de Alberto)
```
