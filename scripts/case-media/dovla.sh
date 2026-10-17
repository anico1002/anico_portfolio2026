#!/bin/bash
# Recorridos de Dovla (2026-10-17) para los mockups del caso. En inglés (la web va en inglés), tema oscuro.
# La app se compila e instala antes desde ~/Vibe_Projects/dovla-app (build/dd). Coordenadas en puntos del iPhone 18 Pro.
#   dovla.sh tour     → todo de una toma: splash, bienvenida, Home, promo, extracto, tarjetas, pagos y perfil
#   dovla.sh intro | home | promo | tx | cards | tabs → cada flujo por separado (clips en clips/dovla-*.mp4)
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}; C=$S/clips
APP=com.anico.dovla
t(){ $AXE tap -x $1 -y $2 --udid $SIM >/dev/null 2>&1; sleep ${3:-1.6}; }
sw(){ $AXE swipe --start-x ${5:-201} --start-y $1 --end-x ${5:-201} --end-y $2 --duration ${3:-0.6} --udid $SIM >/dev/null 2>&1; sleep ${4:-1.4}; }
hsw(){ $AXE swipe --start-x $1 --start-y $3 --end-x $2 --end-y $3 --duration ${4:-0.5} --udid $SIM >/dev/null 2>&1; sleep ${5:-1.6}; }
start(){ xcrun simctl terminate $SIM $APP 2>/dev/null; sleep 0.5
  xcrun simctl status_bar $SIM override --time 9:41 --batteryState discharging --batteryLevel 100 --cellularMode active \
    --cellularBars 4 --wifiMode active --wifiBars 3
  xcrun simctl io $SIM recordVideo --codec=h264 --force "$C/dovla-$1.mp4" >/dev/null 2>&1 & P=$!; sleep 1; shift
  xcrun simctl launch $SIM $APP -AppleLanguages "(en)" -AppleLocale en_GB "$@" >/dev/null; }
# Toca el primer elemento cuya etiqueta empiece por $1 (las posiciones cambian con el scroll y la inercia).
tl(){ local xy; xy=$($AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
want=sys.argv[1]; d=json.load(sys.stdin)
def walk(n):
    l=n.get('AXLabel') or ''; f=n.get('frame',{})
    if l.startswith(want) and 60<f.get('y',0)+f.get('height',0)/2<805 and 0<f.get('x',0)+f.get('width',0)/2<402:
        print(round(f['x']+f['width']/2),round(f['y']+f['height']/2)); sys.exit()
    for c in n.get('children',[]): walk(c)
for n in (d if isinstance(d,list) else [d]): walk(n)
" "$1"); [ -n "$xy" ] && t $xy ${2:-1.6} || { echo "no está: $1" >&2; sleep ${2:-1.6}; }; }
stop(){ sleep ${1:-0.8}; kill -INT $P; wait $P 2>/dev/null; echo "ok"; }

# Splash (el patrón se monta y se queda de fondo) → bienvenida → entrar.
intro(){ sleep 5.2; tl "Log in" 3.2; }
# Home: el saldo sube a la barra, hoja de cuentas, carrusel de promos y bajada hasta el gráfico.
home(){ sw 640 420 0.9 1.2; sw 420 640 0.9 1.4; tl Accounts 2.4; sw 160 820 0.35 1.4
  sw 640 500 1.4 1.6; hsw 330 60 $(py Travel) 0.45 1.8; hsw 330 60 $(py Invest) 0.45 1.8; hsw 60 340 $(py Invest) 0.45 1.0
  hsw 60 340 $(py Invest) 0.45 1.6; sw 700 300 1.1 1.4; sw 700 300 1.1 2.4; top; }
# Altura (y) del centro del elemento cuya etiqueta empieza por $1; 560 si no está.
py(){ $AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
want=sys.argv[1]; d=json.load(sys.stdin)
def walk(n):
    l=n.get('AXLabel') or ''; f=n.get('frame',{})
    if l.startswith(want) and n.get('type')=='Button': print(round(f['y']+f['height']/2)); sys.exit()
    for c in n.get('children',[]): walk(c)
for n in (d if isinstance(d,list) else [d]): walk(n)
print(560)" "$1"; }
# Vuelve arriba del todo (toque en la pestaña activa).
top(){ t ${1:-72} 820 1.4; }
# Promo: la hoja con la escalera de dovelas girando sobre la foto.
promo(){ sw 640 500 1.4 1.6; tl Travel 6.5; sw 150 820 0.35 1.6; top; }
# Extracto: ver todo, el selector de meses sigue al scroll, salto a septiembre, detalle de un movimiento.
tx(){ tl "See all" 2.2; sw 700 260 1.0 1.2; sw 700 260 1.0 1.6; tl September 2.2; tl August 2.2; tl October 2.2
  t 201 268 3.4; sw 150 820 0.35 1.4; t 37 83 1.8; top; }
# Tarjetas: elegir del abanico, el extracto se abre con el scroll, se vuelve a la tarjeta. Para cerrar con ⌄ hay que
# estar arriba del todo: si no, la app lo vuelve a abrir (el scroll sigue desplazado).
# El abanico se reordena al elegir: se toca por posición (izquierda, derecha, centro). Tocar la de arriba la gira.
cards(){ t 157 820 2.4; t 60 690 2.4; t 342 690 2.4; t 201 670 2.4; t 201 240 2.2; t 201 240 2.2; sw 600 300 1.2 1.8
  sw 700 300 1.2 1.6; sw 250 750 0.9 0.6; sw 250 750 0.9 0.6; sw 250 750 0.9 0.6; sw 250 750 0.9 0.6; sw 250 750 0.9 1.2
  t 38 84 2.6; }
# Pagos y perfil.
tabs(){ t 243 820 2.4; t 328 820 2.6; t 72 820 2.0; }

case "$1" in
tour)  start tour -startSignedOut; intro; home; promo; tx; cards; tabs; stop;;
intro) start intro -startSignedOut; intro; stop 1.5;;
home)  start home -startSignedIn; sleep 4; home; stop;;
promo) start promo -startSignedIn; sleep 4; promo; stop;;
tx)    start tx -startSignedIn; sleep 4; tx; stop;;
cards) start cards -startSignedIn; sleep 4; cards; stop;;
tabs)  start tabs -startSignedIn; sleep 4; tabs; stop;;
*) echo "uso: dovla.sh tour|intro|home|promo|tx|cards|tabs"; exit 1;;
esac
