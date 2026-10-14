#!/bin/bash
# Recorrido de 7news para el caso (2026-10-14, 2.ª toma con el feedback de Alberto): una sola toma con toques
# reales (AXe). Contenido real: las fuentes del iPhone de Alberto (news-reset.sh las trae; solo lee del móvil).
#   splash → portada → filtro de portada (fuera Chollos, Fun y Pelis) y recarga visible → Temas → Tech →
#   Apple → Apple Watch Series 12 → deslizar a la siguiente → «Guardar para después» → crear «Videojuegos» →
#   Guardadas.
# Las noticias se tocan por su título (el orden de las listas cambia con cada refresco): TECH_PICK y
# APPLE_PICK, trozos del título. Elegir noticias con foto de producto, nunca retratos del autor.
# Al acabar, el simulador queda tocado: se recupera con news-reset.sh.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}; C=$S/clips
OUT=$C/news.mp4
APPLE_PICK=${APPLE_PICK:-Apple Watch Series 12}
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.4}; }
tp(){ $AXE batch --udid $SIM --tap-style physical --step "tap -x $1 -y $2" >/dev/null 2>&1; sleep ${3:-0.8}; }
sw(){ $AXE swipe --start-x ${5:-201} --start-y $1 --end-x ${6:-201} --end-y $2 --duration ${3:-0.5} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.3}; }
# Toca el botón cuya etiqueta contiene el texto dado (espera hasta 20 s a que aparezca).
tl(){
  local txt="$1" w=${2:-1.6}
  for i in $(seq 1 40); do
    xy=$($AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
txt=sys.argv[1]; d=json.load(sys.stdin)
def walk(n):
    l=(n.get('AXLabel') or ''); f=n.get('frame',{})
    if txt in l and n.get('type') in ('Button','Cell') and f.get('y',0)>60 and f.get('y',0)<800:
        print(int(f['x']+min(f['width'],380)/2), int(f['y']+f['height']/2)); sys.exit()
    for c in n.get('children',[]): walk(c)
for n in (d if isinstance(d,list) else [d]): walk(n)" "$txt")
    [ -n "$xy" ] && break; sleep 0.5
  done
  [ -z "$xy" ] && { echo "no encuentro: $txt" >&2; return 1; }
  t $xy $w
}

SIM=$SIM $S/news-reset.sh >/dev/null 2>&1
xcrun simctl terminate $SIM com.anico.news 2>/dev/null; sleep 0.5
# Ojo: no volver a traer las fuentes aquí. Al importarlas reaparecen los grupos creados en tomas anteriores
# (Videojuegos); news-reset.sh ya las trae y luego los borra. La splash sale igual al abrir (refresca siempre).
xcrun simctl io $SIM recordVideo --codec=h264 --force "$OUT" >/dev/null 2>&1 & P=$!; sleep 1
xcrun simctl launch $SIM com.anico.news >/dev/null; sleep 3
# La splash dura lo que tarde la red: se espera a la portada.
# (la portada ya está debajo de la splash: se espera a que desaparezca la etiqueta de la splash)
for i in $(seq 1 60); do $AXE describe-ui --udid $SIM 2>/dev/null | grep -qi "actualizando noticias" || break; sleep 0.5; done
sleep 1.2

# 1 · portada: un poco de scroll
sw 700 380 0.5 1.2; sw 380 700 0.45 1.0
# 2 · qué sale en portada: fuera Chollos, Fun y Pelis & Series; «Hecho» y recarga a la vista
t 201 142 1.4
tp 322 196; tp 322 660; tp 322 544 1.0
t 344 100 1.0
sw 260 700 0.6 3.5
sw 700 380 0.5 1.2
# 3 · Temas → Tech (un vistazo) → Apple → noticia con foto → deslizar a la siguiente → guardar
t 201 838 1.3
tl "Tech," 1.6; sw 700 360 0.5 1.2; t 38 84 1.2
tl "Apple," 1.6
tl "$APPLE_PICK" 2.0
sw 700 470 0.5 1.3
sw 520 520 0.35 1.6 360 40
t 364 84 1.2
tl "Guardar para después" 1.5
t 38 84 1.0; t 38 84 1.3
# 4 · crear un tema: «Videojuegos» (la búsqueda se acelera en el montaje)
t 186 163 0.7
$AXE type 'Videojuegos' --udid $SIM >/dev/null 2>&1; sleep 0.8
$AXE key 40 --udid $SIM >/dev/null 2>&1
for i in $(seq 1 70); do
  $S/ui.sh | grep -q "Button 'Videojuegos, [0-9]* fuentes" && break
  [ $i = 6 ] && $AXE key 40 --udid $SIM >/dev/null 2>&1
  sleep 1
done
sleep 1.8
tl "Videojuegos," 1.8; sw 700 380 0.5 1.4; t 38 84 1.3
# 5 · Guardadas y vuelta a la portada
t 300 838 2.2
t 110 838 2.0
sleep 0.5; kill -INT $P; wait $P 2>/dev/null; echo "$OUT"
