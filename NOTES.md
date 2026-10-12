# NOTES — anico_portfolio2026

> Retoma rápida entre Macs. Detalle de arquitectura en `CLAUDE.md` / `INIT.md`.

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
