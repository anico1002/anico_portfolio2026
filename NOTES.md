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
