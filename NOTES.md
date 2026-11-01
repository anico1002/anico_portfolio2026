# NOTES — anico_portfolio2026

> Retoma rápida entre Macs. Detalle de arquitectura en `CLAUDE.md` / `INIT.md`.

## ▶ EMPEZAR AQUÍ (cierre 2026-11-01) — caso DesignOps Copilot terminado y publicado en el puente

Caso en **`/new/designops`** (proyecto propio, primero en Product). Alberto lo dio por bueno («está perfecta»).
Código: `components/case-study/designops/` + `app/new/designops/page.tsx`. Publicado en https://anico-design.pages.dev
y también subido al servidor de Carlos (http://anico.es.mialias.net/, sin DNS aún) con `python3 deploy/subir-ftp.py`
(sube solo lo nuevo o cambiado; `--dry` para ver qué subiría). Útil los días de LaLiga, que bloquean pages.dev.

**Estructura (sigue el thinking del guion de Cowork, `designops-copilot/docs/case-study-draft.md`, sin calcarlo):**
cabecera (iPad en las manos con el recorrido) → intro: problema + primera idea + benchmark solo nombrado (Figma Check
designs, Buoy, Design Bug Bot, Omlet) → el giro (detectores de humo / fire chief) con el diagrama y «Who it's for» →
identidad (bola + demo de preguntas) → onboarding → dashboard navegable → principios (tablero de 6 close-ups, incl.
«An exception needs a reason») → app móvil (bola blanca grande detrás) → «What's next» y «Isn't this just…» como
paradas de scroll (titular fijo + filas) → bola como sello → cierre «Drift in. Decisions out.».

**Rol de los proyectos propios** (DesignOps, SwifT, 7News): End-to-end Product Designer. Gloop NO es propio.

**Medios** (`public/maqueta/designops/{media,screens,app}`, **fuera de git**: en el otro Mac hay que regenerarlos):
- prototipo navegable: `bash scripts/case-media/designops-app.sh`;
- capturas: `DPR=4 node scripts/case-media/designops/screens.mjs` (`ONLY=health,drift,review,exception`);
- close-ups: `bash scripts/case-media/designops/closeups.sh` (escena `plane.html`, desenfoque progresivo por capas);
- vídeos: `scripts/case-media/web-rec.mjs` + guiones `designops/{walkthrough,onboarding,mobile,hero}.json`;
- cabecera/thumb: grabar `hero.json` (NOCURSOR=1, 1376×1032 dpr 2), recortar en partes con fundidos de 0,3 s
  (cortes en la nota del commit) y `bash scripts/case-media/designops/hero.sh <src.mp4>` (foto de las manos con
  `photo.html`); después `npm run media:opt`.

**▶ PRÓXIMA SESIÓN (pedido por Alberto, cierre 2026-11-01):**
1. **Meter DesignOps en el motion de Product** (el reel de `scripts/hero-reel/`, fondo del Launcher y cabecera de Product).
2. **Versión móvil del caso:** repasarla entera; se ve **deformada/condensada** en el móvil.
3. **Móvil de «On the go» en pantallas grandes:** que crezca más para que salga por arriba y por abajo del fondo, como
   se acordó (en portátil ya queda bien; en una pantalla grande no sobresale).
4. **Revisar la imagen del iPad de cabecera/thumb:** no le acaba de gustar; además la pantalla no está bien recortada
   por las manos que quedan encima (los dedos deberían tapar la pantalla) y los bordes se ven pixelados.

**Pendiente / ideas:** el dashboard del vídeo de cabecera sale ya en 88 (tras el onboarding); si se quiere el 82 con
los arreglos pendientes, regrabar. Aviso #418 de hidratación dentro del prototipo exportado (no se ve).

## ▶ (anterior) cierre 2026-10-30 — web subida al servidor de Carlos, sin publicar

**FTP resuelto:** entra por FTP (puerto 21) con `anico62`. El 530 era un carácter invisible al **pegar** la
contraseña; tecleada a mano funciona. Llavero (`anico-es-ftp`) re-guardado a mano y ya entra desde el terminal.
El SFTP sigue sin ir, pero no hace falta: no se le pide nada más a Carlos sobre eso.

**Hecho hoy:** por orden de Alberto, `web/` vaciada entera (WordPress viejo + carpetas de 2018–19, sin copia: no
quería nada) y subido `deploy/apache-out` (build con `SITE_URL=https://anico.es`, 1.505 archivos, 656 MB) con un
script Python `ftplib` (wipe/upload; no hay lftp — recrearlo si hace falta). Sin `npm run qa`. Se ve en
http://anico.es.mialias.net/ (raíz → `/new/`, `.htaccess` activo, noindex OK).

**NO publicar todavía:** Alberto tiene que pedir permiso a **Gloop y Dovla**. Cuando lo tenga, en esta sesión:
1. **Quitar `/new`** de las URLs y hacer **todas las redirecciones** (las de `/new/...` y las viejas `/proyecto/...`).
2. **Dominios:** el principal sigue siendo **anico.design** (Spaceship, hoy → Vercel) y **anico.es** (Piensa) lleva a
   la misma web; los dos al servidor 134.0.9.249. Propuesta: anico.es con 301 → anico.design (decidir ese día).
   Rehacer el build con `SITE_URL=https://anico.design`.
3. Pedir a Carlos: añadir anico.design al alojamiento + **SSL (https)** para los dos dominios (hoy https da 403 con
   certificado genérico `*.srv.cat`: normal hasta que apunte el DNS).
4. Meter el snippet de Cloudflare Web Analytics en `app/layout.tsx` (fuera de Pages no se inyecta solo).
5. Quitar anico.design de Vercel y **cambiar la contraseña del FTP** (ha pasado por chats).

## ▶ (anterior) cierre 2026-10-29, MacBook — reel publicado, menú nuevo y SFTP pendiente

**Publicado en https://anico-design.pages.dev** (último deploy de hoy, rama `case-study-maqueta` pusheada):
- **Reel de motion** (`scripts/hero-reel/`, prueba 15, 12,8 s) de fondo en la mitad de Product del Launcher (solo con
  el ratón encima; en móvil siempre) y en la cabecera de la home de Product; el telón lo recoge por su segundo, sin
  saltos. Vídeos en `public/maqueta/hero-reel/`: `reel.mp4` 1920 px (5,1 MB, escritorio) y `reel-m.mp4` 1280 px
  (2,1 MB, móvil, elegido por `<source media>` en `SlideMedia`). Con menos calidad se veía roto.
- **Pase de Games al doble de ritmo** (0,8 s / 1,6 s y fundido corto) para acompañar al reel.
- **Menú nuevo, también en escritorio** (`SiteNav.tsx`): un módulo del logo se estira donde estaba el menú en texto,
  se recoge y se parte en dos rayas finas; al abrir se cruzan en X. Menú a pantalla completa siempre en negro, con la
  ola de letras (RollText) en el hover salvo la sección activa (About si estás en su bloque). Al elegir: fundido →
  logo de carga → cortinilla. La sección en la que ya estás recarga desde arriba. El logo del menú lleva al Launcher.
  En móvil la hamburguesa de las homes va arriba desde el principio.
- Texto de las mitades del Launcher sin guiones ni justificado (partía «mil-lions»).

**Forma de trabajar (Alberto, hoy):** mientras itera delante de la pantalla, no comprobar nada. «Súbelo» = build +
subir directo; el `npm run qa` completo solo en una salida grande (la primera subida a MindYourGap) o si lo pide.

**Pendiente:**
- **SFTP de MindYourGap:** Carlos activó SFTP; usuario `anico62`, host 134.0.9.249. La contraseña nueva (cambiada hoy)
  está en el Llavero (`anico-es-ftp`), pero el servidor rechaza el acceso por SFTP (22) y FTP (530). Se le ha
  preguntado el puerto del SFTP, si la contraseña es la de `anico62` en «Datos de conexión remota» y si hay que
  esperar. Un único intento por prueba (riesgo de bloqueo). Cuando entre: copia del WordPress, borrarlo (con OK),
  `SITE_URL=https://anico.es EXPORT_STATIC=1 npm run build && node deploy/build.mjs apache`, `npm run qa`, subir y
  comprobar con el Chrome que apunta al servidor. Después, cambiar la contraseña (salió en el chat) con
  `deploy/guardar-acceso-ftp.sh`.
- **hero-reel:** `prep.sh` y `README.md` no reflejan aún lo que se extrae de verdad (carpetas k1–k12, f_gh, f_rec,
  f_am, s_*, kit…); sincronizarlos. Versión vertical del reel para móvil (se vería mejor y pesaría menos); probarla
  en HyperFrames. «DESIGN IN MOTION» sigue siendo copy provisional.

## ▶ (anterior) cierre 2026-10-25, MacBook — vídeo de motion para el hero

**En curso: vídeo de fondo del hero** (sustituye al pase de diapositivas), al estilo de art-yakushev.com. Todo en
**`scripts/hero-reel/`**: su `README.md` tiene el estado, lo que Alberto quiere y lo que no, el análisis de Yakushev y
los pendientes. Vamos por la **prueba 04 (13,4 s)** y a Alberto le gusta. Mañana se sigue afinando.
- Retomar: `bash scripts/hero-reel/prep.sh` (una vez; usa los medios que solo están en el MacBook) y
  `node scripts/hero-reel/render.mjs` → `scripts/hero-reel/out/prueba.mp4`.
- Siguiente: quitar el hueco muerto tras el primer colapso, dar un golpe intermedio a «PLAY THE MOMENT», llegar a
  ~20 s con bucle sin costura, y pasar el copy provisional («AFTER DARK», «MADE TO BE FELT») por copywriting.

**anico-design.pages.dev «no carga» (2026-10-25):** no es fallo nuestro. Es el bloqueo de LaLiga: los operadores
españoles cortan las IPs compartidas de Cloudflare (188.114.96.5 / 97.5) durante los partidos. Vuelve sola al acabar.
Se arregla de verdad al pasar a anico.es (MindYourGap no usa Cloudflare).

## ▶ (anterior) cierre 2026-10-20, MacBook

**Web nueva lista para enviar al recruiter: https://anico-design.pages.dev** (publicada y revisada con `npm run qa`
antes y después de subir: Chrome y Safari, móvil y escritorio, 18 pruebas). Último arreglo: pie de Safari (hueco
negro y «k» cortada en el hover de «Let’s talk»).

La demo de Vercel (anico-maqueta) **no se ha redesplegado**: la versión buena es la de Cloudflare y Vercel está al
100 % de almacenamiento. Si se vuelve a usar, redesplegar antes desde el MacBook.

**Analítica (2026-10-20 tarde):** Cloudflare Web Analytics activado en el proyecto `anico-design` (Metrics → Web
Analytics) y redesplegado el mismo `deploy/cf-out` para que se inyecte. Comprobado: el beacon carga y la visita llega
(POST `/cdn-cgi/rum` 204). Cuenta desde hoy, sin datos anteriores. Datos: botón «Web Analytics» del proyecto.

**Pendiente:**
1. FTP de Carlos (MindYourGap) → subir a anico.es siguiendo `deploy/README.md` (raíz → lanzador `/new/`).
   Al moverse, la inyección automática de Cloudflare deja de valer: meter el snippet de Web Analytics (con token)
   en `app/layout.tsx`.
2. Idea aparcada «sigue bajando para el siguiente proyecto» (ver Pendientes).

## ▶ 2026-10-20 — puente de Cloudflare corregido y revisado a fondo

Fallos que vio Alberto y que la auditoría del 19 no cazó: la foto del About (`/about.webp`) no se subió, y la
cortinilla se quedaba en negro al navegar (el export usa rutas con barra final y se comparaban sin ella). Corregidos,
más: og:image apuntaba a anico.design (404), y la cortinilla esperaba ~5 s a un vídeo tapado al ir a About.
Fuera los «28+ years» de la intro y del About (edadismo: va a recruiters).

**Publicar (Cloudflare o Apache): seguir `deploy/README.md`** — export con `SITE_URL`, `node deploy/build.mjs
<cloudflare|apache>` y `npm run qa -- <paquete>` antes de subir y `npm run qa -- <url>` después. Ahí está también la
tabla de los fallos de estos días y qué los evita. La revisión navega de verdad (Chrome y WebKit, móvil y escritorio,
cada enlace, menú, carrusel, atrás/adelante); hecha el 2026-10-20 en local y en producción: 0 fallos.

## ▶ EMPEZAR AQUÍ (cierre 2026-10-19 tarde, MacBook)

**Web nueva PUBLICADA como puente en Cloudflare Pages** para enviar al recruiter ya, sin tocar Vercel:
👉 **https://anico-design.pages.dev** (raíz → `/new/` launcher). Enlace privado: noindex total + robots.txt cerrado,
sin contraseña. Proyecto CF `anico-design`, cuenta anico.es@gmail.com. Detalle en memoria `puente-cloudflare-pages`.

**Hecho hoy (commits 42a2571, e037484, 21451a7):**
- Movida la web nueva a `/new` (Product en `/new/product`) con layout raíz propio; la clásica a `app/(classic)`.
- Export estático para Apache/CF: `EXPORT_STATIC=1 npm run build` → `out/`; `next.config.ts` con `output:export`+
  `trailingSlash` tras el flag; `app/sitemap.ts`/`robots.ts` con `dynamic="force-static"`.
- `deploy/apache/.htaccess` (para anico.es) y `deploy/cloudflare/` (_headers/_redirects/robots) — noindex, seguridad,
  caché, MIME. `deploy/cf-out/` es el build subido (gitignored).
- Carrusel del footer: pista **"↔ Drag" fija** y visible en todos los casos (CaseEnd.tsx).
- Auditoría de assets: las 15 páginas, 593 assets, 0 faltan. Arreglado: faltaban las 6 carpetas de juegos
  (`opt/projects` + `projects`) → las imágenes de Games del launcher no cargaban. Verificado visualmente en vivo.

**PRÓXIMA SESIÓN — subir al hosting definitivo (lo que pidió Alberto):**
1. **Esperamos los datos de FTP de Carlos (MindYourGap)** — él los pide. El panel es `gestiona.mi-alojamiento.com`
   (deep-link caducado); credenciales no están en Gmail; anico.es ha cambiado de servidor 3 veces, solo Carlos sabe
   cuál está vivo hoy. Memoria `hosting-mindyourgap`.
2. Con el FTP: subir el export de Apache a anico.es, **siguiendo `deploy/README.md` paso a paso** (paquete con
   `deploy/build.mjs apache`, `npm run qa` antes y después), y retirar el puente de Cloudflare. La raíz lleva al
   lanzador `/new/` en los dos (decidido 2026-10-20).
3. Decidir entonces si se quita el `/new` de la ruta (requiere montar la web nueva en la raíz: rebuild dedicado;
   hoy se deja con `/new` a propósito, no molesta).

Legal: aparcado para esta entrega (no se crean páginas nuevas). Standby de borrado: igual que abajo.

## ▶ AUDITORÍA FINAL (2026-10-19, MacBook) — hecha salvo lo de abajo

**Hecho (commits 61ae2f8…):** cabeceras de móvil sin franjas (versión vertical de SwifT, Interactius y WineUp,
`scripts/mockups/hero_portrait.py`); vídeos a su tamaño justo (`scripts/media-opt/videos.mjs`: 1280 px para tarjetas
y recorte vertical sin reescalar para la cabecera en móvil; LazyVideo elige; `npm run media:opt` ya genera las dos
cosas); carrusel del final sin cargar ni animar hasta acercarse; en Safari, desenfoques horneados
(`scripts/media-opt/bake-blur.mjs`) y halos con degradado (Gloop llegaba a 400 ms por fotograma, medido con WebKit);
Lenis en el bucle de framer; bucles CSS en pausa fuera de pantalla (`LoopGate`); tipografía a 10 tamaños por pantalla
y fuera PT Serif, Bitter, Familjen y PP Neue Montreal (licencia personal); Satoshi precargada; noindex + X-Robots-Tag
para la web nueva y sus medios, robots.txt cerrado a rastreadores de IA, metadatos y `og.jpg` propios, cabeceras de
seguridad y caché (`next.config.ts`); lint sin errores. Medición: sin fotogramas perdidos al hacer scroll en
Chrome y WebKit a 2560 y 390 px (el sin-ventana engaña con la página quieta: baja a 30 fps sin que pase nada).

**Pendiente:**
1. **Mover a `/new`** (bloqueado por permisos: `git mv`). Plan: `app/layout.tsx`, `app/page.tsx` y `app/proyecto` →
   `app/(classic)/`; `app/maqueta` → `app/new` con su propio layout raíz (`<html lang="en">`, sin Inter ni PersonSchema
   ni canonical de la web vieja); páginas de prueba `tipos`, `logo`, `entrada-a`, `sobre-mi` → `_tipos`… (fuera del
   build); `BASE` = "/new" en `lib/maqueta/base.ts`. Después: `not-found` propio en /new.
2. **Hosting** (Alberto, 2026-10-19: Vercel avisa al 100 % — es el *Deployment Storage* de 10 GB del plan Hobby, cada
   despliegue sube los ~400 MB de medios). Hablar: código en Vercel + medios fuera (Cloudflare R2 o el hosting de
   Arsys de anico.es), o todo estático en Arsys. anico.es = Apache compartido de Piensa Solutions, hoy solo redirige.
3. **Legal**: Alberto quiere ver qué hacen portfolios personales antes de decidir (análisis hecho en la sesión).
4. **Standby de borrado (con OK):** ~68 MB de vídeos que el código no parece usar (versiones viejas: `hero-25d.mp4`,
   `-v2`…; la lista sale de `grep`, comprobar antes), `components/CustomCursor.tsx` sin uso.

## ▶ EMPEZAR AQUÍ (cierre 2026-10-18)

**Desplegado en https://anico-maqueta.vercel.app.** Alberto confirma que **solo queda la auditoría final** (⛔ de
abajo, puntos 2–8). Empezar por el 7 (scroll a saltos en pantalla grande), que es técnico y no necesita decisiones.

**Hecho hoy:** cada caso con su propio movimiento (sin plantilla común; el pedestal, fuera para siempre): Gloop 2,5D
con vaivén más rápido, 7news con luz de ventana sobre el muro (geometría real, bandas suaves), ElReto con las rocas
flotando y tomando el color de la pantalla, WineUp con el fondo del bar vivo (`hand3d_video.py --live --busy`: cinco
siluetas, luces, deriva; `*-live2`, ~100 KB más que la foto quieta), Dovla con el móvil 3D a 108 mm para miniatura y
pase del launcher (un archivo para los dos). Dovla cerrado (visto en móvil). Logo: la «n» vuelve a la cúpula (el
hombro solo podía leerse M). Favicon animado también en Chrome. Párrafos del launcher en `t-small` y a 2,5 columnas
(los dos en 3 líneas). Los vídeos generados no van en git: viven en `public/maqueta/*/media/` y en la demo.

**Salida a producción (Alberto, 2026-10-18):** no sustituye la home: va a **anico.design/new**, solo para quien tenga
la URL, navegando entre Product y Games, **fuera de buscadores** (noindex, robots, sin sitemap). NDA de Dovla y logo
de Rolls-Royce: sin problema. Publicar solo con su OK.

## (anterior) cierre 2026-10-17 noche, MacBook

**Desplegado en https://anico-maqueta.vercel.app** con todo lo de hoy. **Siguiente sesión, por orden:**
0. **Alberto prueba la demo en el móvil (Safari) con wifi justo y 4G** y trae lo que vea: sobre todo abrir casos de
   Product desde la home y desde el carrusel del pie (antes se congelaba y no llegaba a pantalla completa).
1. **Dovla** (necesita que Alberto abra antes la app para sus capturas): revisión, inglés y miniatura en Product.
2. **Auditoría final** (⛔ de abajo): falta repaso de copy del resto de la web (homes de sección, About, pies), Gloop
   en Safari/móvil, consistencia tipográfica, privacidad/cookies. Rendimiento de imágenes y vuelo: hechos.

**Hecho hoy:** copy en inglés de los cinco juegos (Disney Karting se llama ya **Disney Speedstorm**, slug igual);
vuelo desde el carrusel del pie sin salto; rayas de la ola del titular en Safari; imágenes AVIF con calidad medida
(`npm run media:opt` al añadir imágenes o vídeos); vuelo con poca red arreglado y pósters para todos los vídeos.

## Dovla rehecho (2026-10-17 noche, MacBook, «tira millas»)

**Cierre:** desplegado en https://anico-maqueta.vercel.app/maqueta/dovla. Alberto lo mira en el móvil y **mañana se
itera**: empezar por su feedback y por el standby de abajo. A Alberto le ha gustado mucho la primera versión.

Nuevo enfoque (Alberto): **banca privada** para clientes con mucho patrimonio, el **UI kit** como capítulo central
(como Interactius) y las **dovelas que giran** como hilo visual. Caso en inglés en `components/case-study/dovla/`
(`DovlaCase.tsx` + piezas nuevas en `DovlaKit.tsx`): cabecera con dos móviles, intro con la promo en vídeo,
Identity (fotos que se deshacen en dovelas giratorias + patrón), UI kit (la Home señalando cada pieza, color,
Silka en imagen, espaciado y radios, hoja de componentes), Cards (familia en abanico + vídeo del monedero), Private
service, Accessibility, Appearance (claro/oscuro arrastrando), cierre. Ficha de `cases.ts` en inglés y miniatura
en vídeo. **Aún no está en el pase de Product** (`sections.ts`): esperar a que Alberto lo dé por bueno.

- **Grabar la app:** `scripts/case-media/dovla.sh tour|intro|home|promo|tx|cards|tabs` (toca por texto; la app se
  compila antes desde `~/Vibe_Projects/dovla-app` en `build/dd`). Recorrido completo de 1:51 en
  `scripts/case-media/clips/dovla/tour.mp4`, tramos limpios al lado.
- **Piezas del kit:** `python3 scripts/case-media/dovla-kit.py` recorta componentes de `public/maqueta/dovla/screens/`
  y renderiza la escala de Silka como imagen (su licencia no permite servirla en la web).
- **Mockups:** recetas `scripts/mockups/recetas/dovla-{hero,cards,promo}.json`, fondo `mockups-src/bg-dovla-plum.jpg`.
- Todo lo de `public/maqueta/dovla/{media,screens}` va fuera de git (app sin publicar).

**Standby para revisar con Alberto:** copy (titulares alternativos), la foto del coche enseña el logo de
Rolls-Royce, más fotos si hacen falta, la nota interna visible en Pagos de la app y el ⌄ de Tarjetas que reabre el
extracto si no está arriba (los dos en `dovla-app`, sin tocar), NDA/nombre.

## (anterior) 2026-10-17 tarde, MacBook — repaso de copy de Games

**Ahora:** repasar y traducir al inglés los copys de los juegos, uno a uno, con Alberto (opciones de copy → elige él).
Criterio: publicitario, nada que no sea cierto (p. ej. Unite NO era para esports: solo la estética). Los textos que se
ven en la página de juego son `tagline`, `overview[0]`, `line` (tarjeta), `outcomeTitle` y `cta` en `lib/maqueta/cases.ts`,
y los bloques (`eyebrow`/`title`/`body`) en `lib/maqueta/games.ts`; el resto de campos de la ficha no se pinta.
- **Asphalt Unite: hecho entero.** Cards sin texto (pegadas al design system).
- **CyberTitans: hecho entero.** Año 2024 (el de anico.design) y salió en móvil (confirmado).
- **Disney Karting: hecho entero.** Es una exploración inicial (el juego final cambió mucho): no nombrar Speedstorm.
- **Asphalt 9 y Asphalt Xtreme: hechos enteros.** Disney Karting se llama ya Disney Speedstorm (slug igual).
- **Games: copy cerrado.** Cabeceras y miniaturas de Games se quedan como están (Alberto, 2026-10-17: no hace falta cambiarlas).

**Hecho en esta sesión (feedback de móvil, todo en commits locales, sin desplegar):** menú con hamburguesa de dos rayas,
email y LinkedIn dentro; About desde la home (antes no hacía nada); sin salto al ir a Product/Games desde el menú; cuelgue
al llegar a Interactius/WineUp desde la miniatura (esperaba al vídeo de escritorio oculto; topes en todas las esperas);
vuelo de miniatura desde el carrusel del pie; 7news con la parada también en móvil; WineUp con los tres pasos en lista en
móvil; Let’s talk pegado a la raya, sin animación al salir y aviso de copiar solo sobre las letras; «Personal project» en
la ficha de 7news y SwifT; Foundations sin cortar; juegos de Gloop en inglés (nombres traducidos por Claude: confirmar si
la app tiene oficiales); velo en la esquina del nombre de las miniaturas de la home; intro de Product sin corte tras «idea».

Desplegado en anico-maqueta (2026-10-17 noche).

## ▶ (anterior) cierre 2026-10-17, MacBook

**Siguiente sesión, por orden:**
0. **Feedback de la revisión en móvil:** Alberto revisa la maqueta en el móvil antes de la sesión
   (https://anico-maqueta.vercel.app) y trae apuntado lo que haya que retocar. Empezar por ahí.
1. **Dovla:** antes, Alberto abre el proyecto de la app por separado para cambiar cosas y poder hacer las capturas.
   Luego revisión del caso, traducción al inglés y su miniatura al pase de Product (`lib/maqueta/sections.ts`).
2. **Los cinco juegos:** revisión y traducción (en inglés solo está la ficha).
3. **Auditoría final** (lista ⛔ de abajo) y **publicar**.

**Hecho hoy (2026-10-16 noche → 17):** todo en inglés salvo Dovla y los juegos; color por página
(`lib/maqueta/theme.ts`: cada caso en blanco o negro, Product negro, Games y todos los juegos blanco, sin
selector sol/luna; cortinilla entre páginas siempre negra); entrada con Product negro / Games blanco y recuentos;
About como bloque al final de las dos homes (`AboutBlock.tsx`), menú Product · Games · About; Contact fuera
(página borrada) y «Let’s talk» + email del pie que **copian** el email (montado en el navegador, no en el HTML);
`© año` y `28+ years` automáticos; ocultos (no borrados) Netflix, Nike, Hawkers y los de Marca y web (`HIDDEN` en
`cases.ts`); roles unificados (Lead Product Designer, Brand Designer, Art Director, Lead UI/UX Designer); copy
publicitario en Gloop, 7News, Interactius, MasterChef, WineUp y SwifT; WineUp rehecho (mitades alternas, clips
regrabados sin barra doble, fotos de Alberto con velo, prototipo enlazado); MasterChef con la app real y tortitas;
SwifT con el iPhone Duo (miniatura y cabecera), teclas ⌥⌘T como pieza común (`Keys.tsx`) y MacBook limpio;
palabras clave «pruebo una serif y la descarto» (`FontFlip.tsx`); cabecera de sección común (`SectionHead.tsx`);
**Satoshi** en prueba (gratis, Fontshare) con los textos pequeños un peso más.

**Solo en el MacBook (fuera de git):** los vídeos de `public/maqueta/*/media/`, las fuentes de
`public/fonts-licencia/` (Satoshi incluida: en el otro Mac la web saldría en otra tipografía) y `mockups-src/`.

## ⛔ ANTES DE PUBLICAR: auditoría final (pedido por Alberto, 2026-10-17)

1. **Rendimiento — imágenes HECHO (2026-10-17):** AVIF con el ancho justo por pantalla y calidad medida (Unite
   51,6 → 4,5 MB en móvil; Disney 55,9 → 6,8; Asphalt 9 39,8 → 2,9). Vídeos ya razonables (H.264 ≤ 1,7 Mbps, solo cargan
   al acercarse): no se han tocado. Vuelo miniatura → caso con poca red ARREGLADO (medido en producción, iPhone
   emulado con 4G y sin caché): la capa abre con el fotograma de la tarjeta congelado (antes crecía vacía 1,4 s), el
   aterrizaje no espera más de ~1 s al vídeo de la portada (antes hasta 4,5 s congelada) y se funde sobre su póster,
   todo vídeo tiene póster (los genera `npm run media:opt`) y la portada se descarga antes que el resto. Queda
   probarlo Alberto en el móvil con wifi justo y 4G. Antes:
   optimizar TODOS los contenidos para que pesen lo mínimo y carguen ligeros en móvil, sin perder
   calidad (vídeos H.264/H.265 + póster, tamaños por dispositivo, imágenes en AVIF/WebP, lazy load, fuentes).
2. **Detalles de transición:** revisar en Safari y en móvil el paso miniatura → cabecera (Alberto vio «un salto
   raro» en Gloop que en Chrome no se reproduce).
3. **Copy:** el repaso de abajo.
5. **Privacidad y cookies:** revisar qué recoge la web (analítica, cookies, embeds de terceros como vídeos o fuentes
   externas), si hace falta aviso de cookies y una página de privacidad/aviso legal (RGPD, al ser España).
6. **Email a la vista:** hoy sale en texto plano en el pie. Al montar «Let’s talk» (copiar el email), sacarlo del
   HTML (montarlo en el navegador) para que no lo recojan los bots.
4. **Consistencia de tipografía y estilos:** recorrer todas las páginas buscando estilos sueltos (tamaños, pesos o
   familias que no salgan de las clases `t-*`), para que no quede nada fuera del sistema.
7. **Scroll a saltos en pantalla grande (Alberto, 2026-10-18):** en monitor grande la web «va un poco a saltos, no se
   percibe el scroll fluido que buscamos». Medir con rAF y grabación (memoria `movimiento-fluido-sutil`) a 1440, 1920
   y 2560 px, en Chrome y Safari: fotogramas perdidos al hacer scroll, vídeos que decodifican a la vez (pase de fondo,
   miniaturas y cabeceras 2,5D a pantalla completa), capas con `backdrop-filter`/`blur` grandes, máscaras y el
   suavizado del scroll (`SmoothScroll`). Revisar sobre todo Dovla (mosaico de dovelas, cristal) y las homes.
8. **Ruta `/new` y fuera de buscadores (2026-10-18):** montar la maqueta en anico.design/new sin tocar la home actual;
   `noindex` en esas páginas, robots.txt y sitemap sin ellas, y que la navegación no salga de Product/Games.

## ⛔ ANTES DE PUBLICAR: repaso de copy de TODA la web (pedido por Alberto, 2026-10-17)

Pasar cada texto de cada página (home, casos, verticales, Sobre mí, contacto, pies, fichas, notas de los apartados)
por la skill `copywriting`/`copy-editing` con el criterio de la memoria `copy-publicitario-sin-cocina`: publicitario,
que venda el perfil de Alberto y la idea del producto, NADA descriptivo de cómo funciona la app ni técnico. Ejemplo
del fallo: «La app empieza preguntando quién eres… el experto se reconoce por su cabecera violeta» → «Dos perfiles,
dos experiencias. Para quien disfruta del vino y para quien lo conoce a fondo». Se hace en inglés, que es como sale
la web. No se publica sin este repaso.

## ▶ PASO AL INGLÉS (decidido 2026-10-17)

La web sale solo en inglés: el castellano se sustituye, no se mantienen dos versiones. Lo común ya está (menú,
pie «Let’s talk», «More projects / All projects», «Role:», entrada Product/Games, etiquetas accesibles). Cada caso
se pasa cuando Alberto lo da por revisado, con el repaso de copy publicitario a la vez (el ⛔ de abajo) y mirando
cortes de línea y cajas. Pendientes de pasar: todos los casos, homes de sección, Sobre mí y Contacto.

## ▶ WINEUP REHECHO (2026-10-17, MacBook)

- **Composición:** apartados en mitades alternas (`Feature` en `WineupCase.tsx`): un solo móvil sobre un fondo más bajo
  que él, tres capas de parallax, fotos de Unsplash elegidas por Alberto con velo negro (`VEIL`) y colores con
  degradado casi a negro (`shade`). La home se queda fija y sus tres puntos se sustituyen uno a uno con el scroll.
- **Clips regrabados** con `scripts/case-media/protopie/rec.mjs` (prototipo https://cloud.protopie.io/p/60728aeeed322a3cf2520398):
  View options sin «Hotspot Hints» ni «Device Frame» y cursor flecha; `HIDE_SB=1` oculta la barra de estado que
  ProtoPie pinta encima de la dibujada (salía doble); `sb:show@t` donde no hay dibujada («¿Cómo te defines?»);
  `wheel:` para subir sin que un carrusel se quede el gesto. Fuentes en `scripts/case-media/clips/wineup/v2/` (con
  `flow.mp4` para la mano), los viejos en `v1-*`. Guiones usados:
  - perfiles `Splash` «sb:show@6.9;tap:196,233@11.5;end@55» (recortado a 50 s)
  - home `Home` «drag:300,380,70,380,1500@7.5;tap:105,635@12;tap:196,800@17.5;end@25»
  - explorar `Explore` «drag:330,300,60,300,1500@2.5;drag:196,700,196,320,1800@5.5;drag:196,320,196,700,1800@8.5;tap:196,160@11.5;drag:196,700,196,320,1800@13.5;tap:300,160@17;end@22»
  - vino `Explore` «tap:70,680@2.5;drag:196,700,196,400,2600@7.5 (×4, cada 3,5 s);wheel:196,600,-500,2600@22 (×3);end@34» (recortado a 33 s)
  - perfil `Profile` «drag:196,650,196,300,2400@2.5;wheel:196,500,-400,2000@6;tap:197,305@9;drag:196,650,196,300,2400@11.5;end@15.5» + expert `Profile-Expert` → `cava.mp4`
  - trivias `Trivias` «drag:196,700,196,250,1800@3;drag:196,250,196,700,1800@6.5;end@9.5»
- **Pendiente WineUp:** revisión de Alberto; en «Dos perfiles» la pantalla «¿Cómo te defines?» y el onboarding no
  traen barra de estado en el prototipo (salen sin ella).

## ▶ EMPEZAR AQUÍ (cierre 2026-10-16, MacBook)

**Pendiente (próxima sesión):**
1. Revisión de Alberto de WineUp (copy, orden, colores de bandas; «Para: WineUp» o cliente).
2. Interactius: repasar juntos el logo técnico; grabar DeckMakr de verdad (tras login del equipo); copy de «La web».
3. SwifT: quizá una lámina técnica del logo (la pasa Alberto).
4. Comprobar en móvil la zona web/manual de Interactius y la cabecera de WineUp.
5. En el carrusel de Product siguen los conceptos antiguos (Netflix, Nike…): decidir si se filtran.
6. Pendientes de antes: tipografía (licencia), Marca y web (¿se quedan?), ACT (prototipo de Figma), El Reto.

## ▶ HECHO EL 2026-10-16 (MacBook)

Feedback de **SwifT e Interactius** aplicado; detalle con casillas en `docs/feedback-swift-interactius-2026-10-16.md`.
Cierre común en todos los casos (`CaseClosing`). SwifT con 2.ª vuelta (etiquetas desde el trazo, icono sobre cristal oscuro, landing en MacBook en bucle).
**Standby (Alberto):** quizá una lámina técnica del logo de SwifT; imagen del portátil de Interactius; repasar juntos el logo técnico; grabación real de DeckMakr.
**Final de los casos (idea de madebyaran.com):** el caso va en una capa (`CaseLayer`) que sube como un telón y
descubre debajo, pegado abajo (sticky), un carrusel lateral con todos los proyectos de la sección empezando por el
siguiente y «Ver todos» (`CaseEnd.tsx`, lista en `moreCases()` de `lib/maqueta/media.ts`); después «¿Hablamos?» y pie.
Sustituye a `NextCase` en los 8 casos. Gloop pasa a `components/case-study/gloop/GloopCase.tsx`.
Miniatura y cabecera de Interactius = el manual en el MacBook real (`interactius/thumb.mp4`).
**Más del 2026-10-16:** final de casos en UNA pantalla (carrusel arrastrable + «¿Hablamos?» + pie; el «¿Hablamos?» se
anima cada vez). Home de Product por fecha (`productInOrder()` en cases.ts, también para el carrusel). SwifT: MacBook
frontal sobre mármol (opción B) + landing en el iPhone plegable de Pixeden (PSD en `mockups-src/iphone-duo`, Photoshop
por script `scripts/mockups/photoshop/duo*.jsx`, vídeo `scripts/mockups/duo_video.py`); miniatura = la del portátil
sobre piedra (Alberto la prefiere). Interactius: logotipo ampliado (macrón animado + versiones) y cabecera en franja
(`BandMedia`, `scripts/mockups/hero_band.py`: el dispositivo entero en el 56 % de arriba que deja ver CaseHero).
**Interactius y la web (2026-10-16):** la web corporativa (www.interactius.com, grabada con `ixweb.mjs` del
scratchpad: acepta cookies y baja con paradas) pasa al MacBook + móvil volandero, y a miniatura/cabecera/cierre.
El manual va en una ventana de navegador sin enlace: **no se enlaza brand.interactius.com** (la empresa no lo ha
hecho público).
**WineUp (2026-10-16, tira millas):** caso a medida en `/maqueta/wineup` (`components/case-study/wineup/`). Grabado del
ProtoPie (https://cloud.protopie.io/p/60728aeeed322a3cf2520398) con `scripts/case-media/protopie/rec.mjs` (Chrome con --remote-debugging-port=9333, ventana fuera
de pantalla: Alberto no quiere que salte al frente; oculta el reloj real que el prototipo pinta sobre el 9:41).
Cabecera/miniatura: mano 3D de su carpeta de mockups (`mockups-src/hand-3d`, Photoshop por script) sobre un bar de
vinos de Unsplash desenfocado (`scripts/mockups/hand3d_video.py`). Apartados en iPhone frontal (marco iphone18).
**Pendiente de revisión de Alberto:** copy, orden y colores de las bandas; el escáner, «Catar» y abrir trivias no
responden en el prototipo (se ven como pantalla). Vídeos en `public/maqueta/wineup/media/` (fuera de git).
`WebScroll.tsx` (web a toda página fija dentro de la máscara) queda sin usar, por si sirve en otra landing.

## ▶ EMPEZAR AQUÍ (cierre 2026-10-15, MacBook)

**Hecho hoy:**
- **Proyectos verticales** (así los llama Alberto: Games + Marca y web, plantilla `GamesTemplate`): Obliq, ACT,
  GM World! y Metacampus pasaron a láminas en vertical con texto solo en los cortes; titulares recortados de
  las láminas cuando el texto ya los dice; textos alineados en grupo por **columnas de la rejilla** (titular
  una columna más que el párrafo), sin números en los titulillos; cierre centrado sin titulillo.
- **El Reto** pasó de caso a medida a proyecto vertical (la página a medida queda en `app/maqueta/_elreto-a-medida`).
  Cabecera/miniatura = prototipo 2.ª edición en rocas negras; apertura = recorrido completo en mano (iPhone
  naranja) sobre pizarra con caquis.
- **Estudio de tipografía** y comparador privado: `docs/estudio-tipografia-2026-10-15.md`. **PP Neue Montreal
  y el ácido, en prueba en toda la maqueta.**

**Pendiente (próxima sesión):**
1. Seguir el feedback de Alberto proyecto a proyecto (ha revisado Obliq, ACT, GM World!, Metacampus y El Reto).
2. **El Reto:** decidir si cabecera y apertura usan el mismo prototipo o los dos distintos de ahora; opción de
   regrabar el recorrido completo en alta desde ProtoPie (bc6dc134…).
3. **ACT:** movimiento en el portátil con un prototipo de Figma que pasará Alberto.
4. **Marca y web:** decidir si se quedan o se quitan; si se quedan, rediseñar miniaturas y cabeceras.
5. **Tipografía:** decidir la sans (Neue Montreal en prueba; Haffer, Messina, Nohemi, Satoshi en la recámara)
   y comprar licencia; decidir si el ácido se queda (y el peso a saltos con él).
6. Repaso en inglés de cortes de línea y cajas de texto (al traducir).

**Solo en el MacBook (fuera de git):** `public/fonts-licencia/` (Neue Montreal de prueba), `fuentes-prueba/`
(zips y comparador local), `mockups-src/` (escenas y fondos) y `scripts/case-media/clips/`.

## ▶ TIPOGRAFÍA Y ÁCIDO EN PRUEBA (2026-10-15)

- **PP Neue Montreal** en toda la maqueta, en prueba (Instrument Sans de respaldo). Versión oficial gratuita
  para uso personal de Pangram (OTF, sin Medium ni Bold): 300–400 → Regular, 500–700 → Semibold, 800+ →
  Extrabold, medido para igualar el grosor de Instrument. Archivos en `public/fonts-licencia/` **fuera de git**
  (el repo es público): en el otro Mac hay que copiarlos o se verá Instrument. Si se compra: Regular + Medium
  + Bold (40 USD/estilo).
- **Ácido** en las palabras clave de los titulares (`.kw`): degradado naranja → fucsia → morado → azul que fluye.
- Comparador privado de 14 sans de autor: https://claude.ai/artifact/PmHETffoTSWVQ3U9kuwvDZ (fuentes de prueba en
  `fuentes-prueba/`, fuera de git y de Vercel). Efecto de Games elegido para seguir probando: mosaico suave.
- **Siguiente:** feedback de Alberto sobre los casos de Marca y web (y Games) tras revisarlos.
- **El Reto vertical (2026-10-15):** cabecera y miniatura = prototipo de la 2.ª edición (ProtoPie
  8bc2585f…, grabado en alta con CDP screencast desde Chrome con ventana) en `im-darkrock`; apertura = recorrido
  completo (`elreto_phone.mp4` de la web actual) en `im-hand` (iPhone naranja) sobre pizarra con caquis de
  Unsplash (`mockups-src/bg-pizarra-caquis.jpg`, photo-1604872833696-8d393d32653d). Recetas `elreto-*.json`.
  La pared negra es de 7News: no repetir escenas entre casos.
- **Pendiente ACT:** movimiento en el portátil (ACT_11). Alberto tiene un prototipo en Figma y lo pasará.
- **Marca y web, revisados (2026-10-15):** GM World! perfecto; Metacampus ok. **Por decidir (Alberto):** mantener
  estos proyectos o quitarlos y enseñar solo casos de éxito actuales. Si se mantienen, rediseñar miniaturas y
  cabeceras (thumbs y headers).

## ▶ MARCA Y WEB COMO GAMES (2026-10-15)

Obliq, ACT, GM World! y Metacampus pasan a la plantilla de Games (`GamesTemplate`, bloques en
`lib/maqueta/games.ts`): láminas en vertical, cortes solo donde no se parte nada enlazado y un texto
breve en cada corte. Los titulares numerados del manual de GM World («02/ ISOTYPE»…) se recortan en
pantalla y pasan al texto; nuevo `crop.left` para el «08/ MOBILE» que va al lado del iPhone.
`RollText` va ahora con una máscara por palabra (los nombres largos se partían a mitad de palabra).
**Pendiente:** repaso de Alberto (cortes, recortes y copy nuevo de los cuatro).

## ▶ EMPEZAR AQUÍ (cierre 2026-10-14 noche, MacBook)

Sesión larga de feedback de Alberto sobre **Gloop** y **7News**. Detalle con casillas en
`docs/feedback-gloop-2026-10-14.md` y `docs/feedback-7news-2026-10-14.md`.
- **Carrusel de Product** (cabecera de la home y entrada partida): ahora son las **miniaturas en vídeo** de Gloop,
  SwifT y 7News (`lib/maqueta/sections.ts`; vídeo + póster `x-poster.jpg`, `components/case-study/SlideMedia.tsx`). El
  telón sigue el vídeo por el mismo segundo. Cada miniatura nueva se añade ahí.
- **7News: DADO POR ACABADO.** Miniatura rehecha (splash con carga del logo, portada, noticia, Temas y borrado;
  `scripts/case-media/news-thumb.sh` + `scripts/mockups/logo_fill.py`). Apertura con la app a un lado, «El día se
  acaba» con muro de noticias reales que se apagan → móvil plano que crece y pasa a la búsqueda real de
  «Videojuegos». Aviso: escena fija con cifras sobre la piedra, Apple Watch Series 10 del PSD de Alberto (recortado,
  volteado, 30 % más pequeño; `scripts/mockups/place_watch.py`) y burbuja nativa (`notice_anim.py`). Pared con suelo
  negro de Alberto (`mockups-src/im-wall-black/`, las de antes en `view-*-v1.png`).
- **Gloop:** Paradigma sin parada (esquina recta hacia el centro, avatares reales, «Enter now»), insight y cards de
  color redondeados, La forma con logo letra a letra → imago → cinco colores → metamorfosis en bucle, design system
  con **MacBook frontal oscuro** (PNG de Alberto, `kit-macbook.png`) y vídeo del kit dentro, móvil negro girado 30°
  junto a «El método», proceso animado (benchmark isométrico con sus capturas: `scripts/mockups/iso_grid.py`;
  wireframes vectoriales; código que se escribe; app final sobre foto desenfocada), **ruleta de juegos a pantalla
  completa** (le encanta) y **Por capas con la pantalla real** (home Sónar 2027 partida en 4 capas:
  `scripts/mockups/split_layers.py`) que acaba dentro de un marco real de iPhone 18 Pro con fundido.
- `RealPhone.tsx`: marco de móvil real reutilizable (plantilla de iphone-mockups.com) con vídeo o capas dentro.

**Pendiente Gloop (próxima sesión):**
1. **La app entera dentro de un móvil al abrir el caso** (norma para todos los casos de app; Gloop aún no lo tiene).
2. Imagen de **Primeras pantallas** (la pasa Alberto; se parece a la de prototipo).
3. **iPhone Duo**: buscarle sitio o descartarlo (falta la ruta del PSD).
4. Repaso general **en inglés**: titular de Paradigma («vives.» sola), frase grande de la intro, copy de las capas.
5. Revisión en **móvil** de todo lo nuevo (ruleta, La forma, MacBook, capas, aviso con el reloj).
Plantillas guardadas para otros casos: **M9** (MacBook en pedestal claro) para SwifT e Interactius.

## Cierre anterior (2026-10-14 mediodía, MacBook)

Sesión de **mockups de dispositivo**: la app real dentro de escenas premium, en imagen y vídeo. Método completo y
reutilizable en **`scripts/mockups/README.md`** (para Dovla, Interactius, El Reto…). Hecho:
- **Gloop** (en inglés): cabecera + miniatura con dos móviles en marcha sobre un escenario desenfocado; sección
  «La app» con el móvil en mano y el visor de Moments. Feedback general (titulillos sin número, párrafo alineado
  con la última línea del titular) aplicado a todos los casos.
- **7News**: recorrido entero con contenido real (pared de hormigón con suelo negro), cabecera y el aviso que llega
  del iPhone al Apple Watch.
**Vercel (mismo día):** aviso al 75 % de almacenamiento. Limpieza hecha (`scripts/vercel-limpieza.sh`: 133
despliegues viejos borrados, retención automática en todos los proyectos), la rama de la maqueta ya no genera
previews (`vercel.json`) y `.vercelignore` deja fuera PSD y grabaciones al desplegar. Permiso fijo para
`vercel deploy` en la config compartida (el filtro del modo automático lo bloqueaba). Demo desplegada.
**Próxima sesión:** feedback de Alberto sobre el recorrido nuevo de 7News; Dovla (cuando retoque el prototipo);
Interactius (la web en un portátil, decidir qué web); imagen para el interior de Gloop; El Reto.

## ▶ MOCKUPS DE DISPOSITIVO (2026-10-14, MacBook)

Estilo decidido con Alberto: escenas premium (estudio oscuro / noche), plantillas gratuitas de uso comercial
(iphone-mockups.com: capa PNG + JSON con las esquinas de la pantalla; LS Graphics y MockupsVault en PSD) y
la app real encajada en perspectiva. Nada de modelar en 3D. Fondos de fiesta: fotos de Unsplash con
desenfoque de lente (`scripts/mockups/bokeh.py`).
- **Imagen fija:** `scripts/mockups/im_compose.py` (una escena + captura + fondo; giro, lienzo, tinte, light wrap,
  franja superior oscura para el menú). PSD: Photoshop por script (`place2.jsx` en el scratchpad de la sesión).
- **Vídeo:** grabar con toques reales (`scripts/case-media/hero.sh`, AXe en `scripts/case-media/axe/`), limpiar con
  `scripts/mockups/clip_prep.py` (arranque, pausas, misma duración) y componer con
  `scripts/mockups/mockup_video.py <receta.json>` (recetas en `scripts/mockups/recetas/`).
- **Gloop hecho:** cabecera + miniatura = dos móviles en marcha sobre el escenario (`media/hero-mock.mp4`;
  detrás la ruleta, delante Home → El Piso → La Cuenta). Sección «La app» = móvil en mano con el visor de
  Momentos (`media/app-mano.mp4`), texto centrado en el hueco de la izquierda.
- Sin versionar (solo en este Mac): `mockups-src/` (plantillas, fondos, recetas), `public/maqueta/gloop/{media,screens}/`
  y `scripts/case-media/{axe,clips}/`.
- **7News hecho (mismo día):** contenido real sin tocar el iPhone (`~/Vibe_Projects/7News/Scripts/fuentes-del-movil.sh
  --simulador` solo lee del móvil). Recorrido de una toma con toques reales (`scripts/case-media/news.sh`: leer,
  quitar Chollos de portada, crear «Videojuegos», borrar un grupo, ajustes en claro/oscuro); la búsqueda de
  fuentes se acelera ×8 en `clip_prep.py --speed`. Mockup: pared de hormigón con luz dura (iphone-mockups.com).
  Cabecera + miniatura `7news/media/hero.mp4`, recorrido a pantalla completa tras la intro (`recorrido.mp4`,
  10,7 MB: recomprimir en el pase final). Al grabar, el simulador queda tocado: se restaura con el mismo script
  de fuentes + Chollos en portada + máximo 3 por fuente. Feedback general de Gloop aplicado a 7News (titulillos
  sin número, párrafo alineado con la última línea del titular, titular equilibrado). El acero oscuro (P7, PSD)
  queda para piezas de detalle. **Reloj hecho (2.ª versión, feedback de Alberto):** el reloj
  apoyado en el suelo quedaba falso. Ahora flota a la derecha del iPhone, tocándolo por un canto, casi frontal y
  mirando hacia él (`float_watch.py`), y el aviso entra en el iPhone con muelle de iOS y medio segundo después en
  el reloj (`notice_anim.py`, a partir de las capturas sin/con aviso: con la pantalla bloqueada recordVideo no
  graba la animación). Suelo de la pared pasado a **negro liso** (`floor_black.py` → `mockups-src/im-wall-black/`;
  iphone-mockups.com no da PSD). Pantalla del reloj: `watch_notice.py` (SF Compact). Vídeo: `7news/media/reloj.mp4`.
- **Idioma (2026-10-14):** Gloop se graba **en inglés** (`hero.sh` lanza con `-AppleLanguages (en)`; los nombres de
  equipo siguen en castellano, decisión de Alberto). 7News se queda en castellano: no se traduce la app.
  Barra de estado sin rayo de carga: `simctl status_bar clear` y luego `override --batteryState discharging`.
- **7News regrabado con el feedback (2026-10-14):** splash → portada → filtro (fuera Chollos, Fun, Pelis) y recarga
  visible → Tech → Apple → Apple Watch Series 12 (fotos de producto) → deslizar a la siguiente → «Guardar para
  después» → crear «Videojuegos» → Guardadas. `scripts/case-media/news.sh` toca las noticias por título y
  `news-reset.sh` deja el simulador limpio (fuentes del iPhone, interruptores leídos por accesibilidad, borra
  grupos «Videojuegos» y guardadas, vacía la pila de cada pestaña). Ojo: el grupo «Videojuegos» existe de verdad
  en el iPhone de Alberto (lo creó él grabando su vídeo), así que vuelve con cada importación: el reset lo borra
  después de importar, solo en el simulador. La portada depende de las noticias del día.
- **Siguiente:** Dovla (cuando Alberto retoque el prototipo),
  Interactius (la web en un portátil). Imagen para el interior de Gloop pendiente.

## ▶ PENDIENTE PARA LA PRÓXIMA SESIÓN (Gloop, apuntado por Alberto el 2026-10-13 noche)

Primera vuelta al feedback de Gloop hecha (copy publicitario sin cocina interna, cristal iOS, parada del
design system, móviles sobre fotos, entradas con máscara…). Detalle de copy en `docs/copy-gloop-propuestas.md`.
**Recordarle a Alberto al empezar:**
1. **El logo de Gloop casi no aparece en todo el caso** (hablamos de la marca y no sale). Sacarlo en la
   sección de **La forma** (el imago, la esquina recta): el logo y el isotipo de `public/maqueta/gloop/brand/`.
   No hacerlo antes de hablarlo.
2. **Vídeo del flujo de la app dentro de un mockup de móvil**, como en el caso de SwifT. Ya lo había pedido en
   su feedback y no se hizo. **Él dirá en qué sitio va**: preguntárselo.
3. Abiertos de antes: los cuatro pasos de **Por capas** (+ capas PNG reales y vídeo de un móvil en una mano),
   el formato de **Momentos firma** (coverflow, cartas o ruleta a pantalla completa; yo recomiendo la ruleta),
   el **zoom** del portátil a la app, imágenes de **Benchmark y Wireframes**, la **frase grande de la intro**
   (no le gustó ninguna propuesta), «encender» o «activar la noche» y el ejemplo del acordeón en cristal.

## ▶ EMPEZAR AQUÍ (cierre 2026-10-13, MacBook)

Rama `case-study-maqueta`, todo commiteado y pusheado; demo en https://anico-maqueta.vercel.app.
**Hoy:** revisión de calidad completa (bloques C–F), Games como escaparate gráfico, móvil a sangre, y **los seis
casos de Product rehechos a medida** con piezas recreadas de cada repo (Gloop el principal). Alberto: «has
superado mis expectativas»; ahora toca **pulir**, partiendo de esta base.
**Próxima sesión:**
1. Feedback de Alberto tras revisarlo con calma (todo: casos, Games, Sobre mí, contacto, pie, favicon).
2. Resolver las dudas de cada caso (lista en `docs/plan-contenidos-casos.md`: feria y autoría en Gloop, crédito en
   Interactius, NDA y agencia en Dovla, el «7» de 7news, año y cifras de El Reto, nombre de SwifT).
3. Después: decidir con Alberto qué cuenta cada proyecto → revisión de copy (senior copywriter) → imágenes.
4. Pendientes ya anotados: motivo de marca e intro (A3/A4), pie a pantalla completa (+ E4), cabeceras nuevas con
   franja superior contrastada, idea aparcada de tema por sección, audit técnico + optimización de imágenes al final.
**Ojo, medios solo en el MacBook** (no en git): `public/maqueta/gloop/media/` (incl. `kit.mp4`, `photo-*.jpg`) e
`public/maqueta/interactius/media/`. El deploy de la demo, desde este Mac.

## Cierre anterior (2026-10-12 noche, MacBook)

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

**Hecho el 2026-10-13 (revisión de calidad completa, bloques C–F):** hover de tarjetas + «Ver caso» que
sigue al ratón (0,4 s de retraso), flecha diagonal en SVG (`Arrow`), botón con relleno, rodillo en todos los
enlaces; titulares por líneas (`Lines`); arranque que espera a la tipografía con el logo (`Boot`); recuento en
el menú; pie común (`SiteFooter`); favicon que rueda por «anico» (`AnimatedFavicon`); vídeos que cargan al
acercarse (`LazyVideo`); movimiento reducido completo (`useReduce`: con el de framer la página salía en blanco);
foco con teclado; atrás/adelante con barrido y posición recuperada; «¿»/«¡» alineados (`Inv`); años de
experiencia automáticos (`lib/maqueta/years.ts`, revalidate diario); Sobre mí y Contacto con la escala de las
homes; frases de los casos en columnas 3–10; texto casi puro (decidido: no #FFF/#000); borrados `Inked`, `ink.ts`
y `flow.mp4`. Descartados: E1 reloj, D2 contadores (y las cifras grandes, a decidir si se quitan). Standby: E4
fondo por sección (para un pie a pantalla completa futuro), D5 microtipografía (repaso de diseño de Alberto).
Alberto revisará todo y dará feedback.

**Casos de Product a medida (2026-10-13, «tira millas»):** Alberto pide componer cada caso con piezas
redibujadas del producto real, no con las láminas viejas. Plan de los 6 en `docs/plan-contenidos-casos.md`
(Gloop → SwifT → Interactius → 7news → Dovla → El Reto; WineUp fuera). **Gloop es el caso estrella.**
- **Gloop hecho:** `app/maqueta/gloop/page.tsx` + `components/case-study/gloop/` (OneThing, TeamShift,
  ColorMeaning, FourLayers 3D, ImagoCanon, KitLaptop, ProcessLine horizontal, GameRoulette), con los tokens y
  la Geist reales. Medios nuevos en `public/maqueta/gloop/media/` (**sin versionar, solo en el MacBook**):
  `kit.mp4` + `kit-poster.jpg` (recorrido del UI kit desplegado, grabado fotograma a fotograma con
  Playwright) y `photo-*.jpg` (fotos de la app). Dudas para Alberto en el plan (feria, autoría, publicación).
- **Los otros cinco, hechos el mismo día** (cada uno su página fija + `components/case-study/<caso>/`, que
  mandan sobre `/maqueta/[slug]`): **SwifT** (demo del atajo ⌥⌘T, 4 funciones en horizontal con
  `HorizontalPin`, frases trampa 15/11/10, cascada de motores, banderas imposibles, icono), **Interactius**
  (fuente única, Markdown → slide, Gantt tecleado, FitText, validador de tono; Plex Mono/Serif reales; fotos
  del universo sin versionar), **7news** (logo como carga, 678 → 32, crear un tema, frente a un lector
  cualquiera, iPhone → Watch), **Dovla** (patrón dovela, saldo que viaja en el tiempo, extracto → escaparate
  arrastrable, «un dato, no un piropo», color accesible, texto al 200 %) y **El Reto** (brillos, energía y
  reglas reales, sigue al chef, embudo, dos superficies, IA). Portadas compuestas para Interactius, 7news y
  Dovla (`public/maqueta/<caso>/cover.jpg`). La home de Product pone estos casos delante de los pendientes;
  solo WineUp sigue en pendiente. Revisado en 390 y 1440: sin errores ni scroll horizontal.

**Games = escaparate gráfico (2026-10-13, «tira millas»):** decisión de Alberto: Product son casos de éxito
largos (estilo Metalab); Games, no. Plantilla propia `GamesTemplate.tsx` + plan de bloques en
`lib/maqueta/games.ts`: cabecera común, intro corta, lámina de portada (logo) y bloques numerados con texto
breve; dentro, láminas apiladas a todo el ancho y sin hueco (como la web actual), series a/b/c en pase de
diapositivas (3,2 s, solo a la vista), vídeos con `LazyVideo`. Cierre: solo frase de resultado + enlace (sin
cifras). Recortes de títulos dibujados con CSS (`crop.top`), sin tocar `public/projects/` (es de la web en
producción): de momento solo «DESIGN SYSTEM» de Asphalt Unite. Orden natural (A9_8, 9, 10). La entrada del
bloque es una capa del color de fondo que se retira (con clip-path en las láminas, Chrome no cargaba las
diferidas). Two Dots: móvil sobre su fondo (en móvil, fondo encuadrado en vertical).

**Games, segunda vuelta (2026-10-13):** fuera Two Dots (poca chicha). Bloques `bleed` a sangre en escritorio
con parallax muy sutil dentro de cada imagen (portadas, dirección de arte, marketing de color, pases
fotográficos, vídeos); la documentación de UI, con márgenes. Textos de bloque con 4 composiciones asimétricas
que se turnan (`BlockText`). **Móvil, en toda la web:** imágenes horizontales de borde a borde (`.m-bleed`;
las verticales conservan el margen).

**Cabeceras sin degradado (2026-10-13):** se quitó el degradado del color de fondo bajo la barra (en claro
era una bruma blanca). Criterio para las **cabeceras nuevas** (la mayoría se van a cambiar): la franja de arriba
bien contrastada, sin grises ni tonos medios, para que el logo y el menú (mezcla por diferencia) se lean.
Hoy flojas: ACT, Asphalt Xtreme, El Reto, Asphalt Unite (menú) y Two Dots (logo).

**Pendiente / próxima sesión:**
- **ÚLTIMO PASO ANTES DE PRODUCCIÓN (pedido por Alberto, 2026-10-13): audit técnico final + optimización
  de imágenes y vídeos (F1).** Las imágenes y vídeos aún no son finales, por eso no se optimizan ahora.
  Al cerrar la web: AVIF/WebP a varios anchos con `srcset`, placeholder de color y fundido; vídeos
  recomprimidos. Regla: **pesar lo menos posible sin que ninguna imagen pierda calidad visible** (es un
  portfolio gráfico). Hoy: 176 imágenes, 286 MB, 97 PNG de más de 1 MB (la mayor, 7,6 MB). En el audit,
  repasar también accesibilidad (foco, movimiento reducido, contraste) y rendimiento.
- **Énfasis en titulares**: queda Playfair cursiva «a ver si se acostumbra»; revisar más adelante.
- **Idea aparcada (Alberto, 2026-10-13):** Product en oscuro y Games en claro, sin selector sol/luna (le
  parece anticuado); en el negro de Product, los ácidos como distintivo. No es encargo: rescatar si toca.
- **Standby**: A3 motivo de marca + A4 intro (propuestas en la sección del bloque A); palabras que
  cambian (aparcado, regla: sola en su línea).
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

**Instrument Sans** para todo y **DM Serif Display Italic** en palabras destacadas de los titulares (se marcan
con `*asteriscos*` → `.kw`; 103 % del cuerpo para igualar la altura de x, sin partirse entre líneas). Cambiada
el 2026-10-13 desde Playfair, que en claro quedaba demasiado fina al lado de la sans. Probadas y descartadas:
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

- **«Sigue bajando para el siguiente proyecto»** (idea de Alberto, 2026-10-20, aparcada para después de enviar la web
  al recruiter). Al final de un caso, junto al carrusel «Drag», un aviso «continúa para el siguiente proyecto»; si se
  sigue haciendo scroll, sube la cortinilla negra (la de los enlaces, `Portal.tsx`) y se destapa el siguiente caso de
  la lista. Objetivo: que el visitante se quede más tiempo.
  - Técnico: la cortinilla ya existe; lo delicado es el disparo — distinguir «sigo bajando a propósito» de un golpe
    de rueda o la inercia/rebote de Safari en móvil. Riesgo de fallos por navegador: probar con `npm run qa` y a mano
    en su Safari y móvil antes de publicar.
  - Usabilidad (mi propuesta): gesto claro y cancelable — una barra que se llena mientras sigues bajando y se vacía
    si subes —, nunca un salto sin querer; «atrás» debe volver al final del caso anterior. Quien llega al final a
    menudo quiere contactar: que «Let’s talk» y el pie sigan a la vista antes del disparo.

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
