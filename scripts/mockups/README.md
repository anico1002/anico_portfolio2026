# mockups — la app real dentro de escenas premium (imagen y vídeo)

Método montado el 2026-10-14 con Alberto (Gloop y 7News). Sirve para cualquier app del portfolio: miniaturas,
cabeceras y piezas dentro de los casos. **Nada de modelar en 3D**: plantilla de foto premium + captura o
grabación real de la app encajada en perspectiva.

## Criterio visual (decidido con Alberto)

- Estudio oscuro con luz dramática; vale gris claro si se ve premium. La pantalla es lo único con color.
- Plantillas **gratuitas y de uso comercial**, nunca de pago. Fondos de foto: Unsplash.
- Móviles inclinados, flotando, de dos en dos (uno a ~30°, otro casi recto), en mano o apoyados en pared.
- Encuadres cerrados también valen (útil cuando la app no es espectacular, como 7News).
- Antes de producir nada con dudas de estilo: tablero de referencias y elige Alberto.
- La franja de arriba de cada imagen, oscura: el menú de la web va encima.
- Primero imagen fija en la web; cuando Alberto la aprueba, la pantalla en movimiento.

## De dónde salen las plantillas (todo en `mockups-src/`, fuera de git)

| Fuente | Formato | Cómo se usa |
|---|---|---|
| iphone-mockups.com (gratis, uso comercial) | capa PNG + JSON con las 4 esquinas de la pantalla | abrir el generador en Chrome y leer en *Network* `view-N-….png` y `view-N.json`; bajarlos con curl a `mockups-src/im-<nombre>/view-N.{png,json}` |
| LS Graphics, MockupsVault (Gumroad, 0 €) | PSD con objeto inteligente | `photoshop/ps.sh <psd> <capa> <captura> <salida>` (`photoshop/list.jsx` lista las capas) |
| AppLaunchpad (gratis, uso comercial) | Apple Watch S10 recortado | `mockups-src/watch/` |

Escenas ya bajadas: `im-transparent` y `im-silver` (móviles recortados, 3 colores), `im-hand-male` y `im-hand`
(en mano), `im-darkrock`, `im-wall` (pared de hormigón) e `im-wall-black` (la misma con el suelo negro,
retocada a mano por Alberto), `im-shelf`. Fondos de fiesta con bokeh: `bg-ev5.jpg`, `bg-sonar.jpg`.

## Capturar la app

- **Simulador** `iPhone 18 Pro` (1206×2622 = el tamaño que esperan las plantillas). Barra de estado limpia:
  `xcrun simctl status_bar <sim> clear` y `override --time 9:41 --batteryState discharging --batteryLevel 100
  --cellularMode active --cellularBars 4 --wifiMode active --wifiBars 3` (si no, sale el rayo de carga).
- **Toques reales** con AXe (`scripts/case-media/axe/`, ver su README para instalarlo): `tap`, `swipe`, `type`,
  `key 40` (Intro), `button lock/home`. Los interruptores necesitan `--tap-style physical`. Para saber qué hay
  en pantalla: `scripts/case-media/ui.sh` (botones y textos con su marco).
- **Grabar**: `xcrun simctl io <sim> recordVideo` mientras corre el guion. Guiones: `scripts/case-media/hero.sh`
  (Gloop, en inglés por defecto) y `news.sh` (7News). Tocar las noticias o filas **por su texto**, no por
  posición: las listas cambian. Esperar a que aparezca algo con un bucle sobre `ui.sh`, no con `sleep` fijo.
- **Estado limpio antes de grabar**: la app recuerda la pantalla y la pila de cada pestaña; se vacían y se
  manda a segundo plano para que lo guarde (`news-reset.sh` es el modelo).
- **Idioma**: lanzar con `-AppleLanguages "(en)"` (la web va en inglés; 7News se queda en castellano).
- **Contenido real de 7News**: `~/Vibe_Projects/7News/Scripts/fuentes-del-movil.sh --simulador` (solo lee del
  iPhone de Alberto, nunca escribe en él).
- **Notificaciones**: permitir avisos desde la app, bloquear (`button lock`), despertar y
  `xcrun simctl push <sim> <bundle> aviso.json`. Con la pantalla bloqueada recordVideo no graba la entrada:
  se capturan sin/con aviso y se anima con `notice_anim.py`.

## Las piezas

| Script | Qué hace |
|---|---|
| `im_compose.py` | **imagen fija**: escena + captura (homografía, esquinas redondeadas, reflejo del cristal). Con `--bg`: fondo detrás, sombra, móvil teñido por la luz, light wrap, viñeta. `--rot`, `--canvas`/`--place` (recomponer en 16:9), `--top` (franja oscura para el menú) |
| `clip_prep.py` | limpia una grabación: 30 fps, recorte, `--cut`, `--speed A,B,F` (acelerar una búsqueda, ralentizar la splash), `--idle` (acorta esperas), `--hold-end`, `--fit` (igualar duraciones) |
| `mockup_video.py <receta.json> <salida.mp4>` | **vídeo**: una o varias escenas con un vídeo en cada pantalla, bucle con fundido. Recetas en `recetas/` |
| `bokeh.py` | fondo de noche: desenfoque de lente real sobre una foto (`lens`) o bokeh dibujado (`synth`) |
| `notice_anim.py` | anima la llegada de un aviso (muelle de iOS) a partir de dos capturas |
| `watch_notice.py` | pantalla del Apple Watch con el aviso en cristal (SF Compact) |
| `float_watch.py` | Apple Watch flotando junto al móvil, casi frontal, con su pantalla animada |
| `floor_black.py` | intento automático de pasar el suelo a negro (Alberto lo hizo mejor a mano: preferir eso) |
| `add_watch.py` | reloj apoyado en el suelo — **descartado** (perspectiva falsa); se conserva como referencia |
| `photoshop/` | encajar una captura en el objeto inteligente de un PSD y exportar |

## Receta tipo (de cero a la web)

```bash
# 1. grabar y limpiar
scripts/case-media/hero.sh front
python3 scripts/mockups/clip_prep.py scripts/case-media/clips/front.mp4 scripts/case-media/clips/front-cut.mp4 --start 3.4 --idle 1.3
# 2. componer (la receta dice escena, vídeo, posición, giro y fondo)
python3 scripts/mockups/mockup_video.py scripts/mockups/recetas/gloop-hero.json public/maqueta/gloop/media/hero-mock.mp4
# 3. revisar fotogramas (hoja de contacto con ffmpeg fps=1) antes de enseñarlo
```

Las capturas y los vídeos de apps sin publicar no se suben (repo público): `public/maqueta/*/{media,screens}/`
están en `.gitignore`. Para la demo se despliega desde el Mac que los tiene.
