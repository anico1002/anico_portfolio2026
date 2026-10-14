#!/bin/bash
# Miniatura de 7news (2026-10-14, feedback de Alberto: la de antes era solo el filtro de portada y no se veía
# la carga del logo). Una toma con toques reales (AXe), corta y vistosa:
#   splash con el logo cargando → portada que carga → scroll por las noticias → una noticia con foto
#   atractiva → vuelta → Temas (la lista) → borrar un tema deslizando.
# La carga del logo solo se ve en un arranque en frío (con la app recién cerrada y la red fresca); si la red
# va rápida dura muy poco: en el montaje se ralentiza con `clip_prep.py --speed`.
# PICK = trozos de título de noticias de portada con foto vistosa, separados por «|»: entra en la primera
# que aparezca (la portada cambia de orden con cada recarga y de contenido cada día).
# DEL = tema que se borra (vuelve con news-reset.sh, que trae las fuentes del iPhone).
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}; C=$S/clips
export SIM
OUT=$C/news-thumb.mp4
PICK=${PICK:-Apple TV 4K|Premios Xataka|Gafas de sol}
DEL=${DEL:-Chollos}
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.4}; }
sw(){ $AXE swipe --start-x ${5:-201} --start-y $1 --end-x ${6:-201} --end-y $2 --duration ${3:-0.5} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.3}; }
# Centro del primer botón cuya etiqueta empieza por el texto dado y cae en pantalla (vacío si no está).
find_btn(){
  $AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
txts=sys.argv[1].split('|'); d=json.load(sys.stdin)
def walk(n, txt):
    l=(n.get('AXLabel') or ''); f=n.get('frame',{})
    if txt in l and n.get('type') in ('Button','Cell') and 100<f.get('y',0)+f.get('height',0)/2<780:
        print(int(f['x']+min(f['width'],380)/2), int(f['y']+f['height']/2)); sys.exit()
    for c in n.get('children',[]): walk(c, txt)
# Por orden de preferencia: la primera de la lista que esté en pantalla.
for txt in txts:
    for n in (d if isinstance(d,list) else [d]): walk(n, txt)" "$1"
}

SIM=$SIM $S/news-reset.sh >/dev/null 2>&1
# Portada vistosa: fuera Chollos, Fun y Pelis & Series antes de grabar (lo deshace news-reset.sh).
tp(){ $AXE batch --udid $SIM --tap-style physical --step "tap -x $1 -y $2" >/dev/null 2>&1; sleep ${3:-0.8}; }
xcrun simctl launch $SIM com.anico.news >/dev/null; sleep 4
t 201 142 1.4; tp 322 196; tp 322 660; tp 322 544 1.0; t 344 100 2.0
$AXE button home --udid $SIM >/dev/null 2>&1; sleep 1.5
xcrun simctl terminate $SIM com.anico.news 2>/dev/null; sleep 2
xcrun simctl io $SIM recordVideo --codec=h264 --force "$OUT" >/dev/null 2>&1 & P=$!; sleep 1
xcrun simctl launch $SIM com.anico.news >/dev/null; sleep 2
for i in $(seq 1 60); do $AXE describe-ui --udid $SIM 2>/dev/null | grep -qi "actualizando noticias" || break; sleep 0.4; done
sleep 1.4

# 1 · scroll por la portada (bajar dos pantallas y volver), luego hasta la noticia elegida (sobra en el montaje)
sw 720 260 0.6 0.9; sw 720 260 0.6 0.9; sw 260 720 0.55 0.6; sw 260 720 0.55 0.9
for i in 1 2 3 4 5 6 7 8; do
  xy=$(find_btn "${PICK%%|*}"); [ -n "$xy" ] && break
  [ $i -ge 6 ] && { xy=$(find_btn "$PICK"); [ -n "$xy" ] && break; }
  sw 700 380 0.6 0.9
done
[ -z "$xy" ] && { echo "no encuentro en portada: $PICK" >&2; kill -INT $P; exit 1; }
# 2 · dentro de la noticia: la foto y un poco de texto; vuelta
t $xy 2.2
sw 700 420 0.6 1.6
t 38 84 1.3
# 3 · Temas: la lista y borrar un tema deslizando
t 201 838 1.8
xy=$(find_btn "$DEL,")
if [ -n "$xy" ]; then
  set -- $xy
  $AXE swipe --start-x 330 --start-y $2 --end-x 120 --end-y $2 --duration 0.45 --udid $SIM >/dev/null 2>&1; sleep 1.1
  t 358 $2 1.8
else echo "no encuentro el tema: $DEL" >&2; fi
sleep 0.6; kill -INT $P; wait $P 2>/dev/null; echo "$OUT"
