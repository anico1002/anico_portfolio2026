#!/bin/bash
# Deja 7news en el simulador como en el iPhone tras grabar news.sh: fuentes del móvil, todos los temas en
# portada (lo encendido se apaga con un toque físico) y máximo 3 por fuente.
S=$(dirname "$0"); AXE=$S/axe/axe; SIM=${SIM:-$(xcrun simctl list devices booted | grep -m1 'iPhone 18 Pro (' | grep -oE '[0-9A-F-]{36}')}
# La app, cerrada antes de poner las fuentes: si sigue abierta, al cerrarse vuelve a guardar su estado
# y los grupos creados en la toma anterior (Videojuegos) sobreviven.
xcrun simctl terminate $SIM com.anico.news 2>/dev/null; sleep 1
bash ~/Vibe_Projects/7News/Scripts/fuentes-del-movil.sh --simulador | tail -1
xcrun simctl launch $SIM com.anico.news >/dev/null; sleep 3
# Se espera a la portada (la splash dura lo que tarde la red) y se vuelve a la raíz por si la app restaura
# una pantalla abierta.
for i in $(seq 1 40); do $S/ui.sh | grep -q "Qué fuentes salen en portada" && break; $AXE tap -x 38 -y 84 --udid $SIM >/dev/null 2>&1; sleep 0.7; done
sleep 1
$AXE tap -x 201 -y 142 --udid $SIM >/dev/null 2>&1
for i in $(seq 1 20); do $S/ui.sh | grep -q "Button 'Hecho'" && break; sleep 0.4; done; sleep 0.6
# Interruptores del filtro de portada: se leen (CheckBox con valor 0/1) y se enciende el que esté apagado.
$AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
def w(n):
    f=n.get('frame',{})
    if n.get('type')=='CheckBox' and n.get('AXValue')=='0': print(int(f['x']+f['width']/2), int(f['y']+f['height']/2))
    for c in n.get('children',[]): w(c)
for n in (d if isinstance(d,list) else [d]): w(n)" | while read x y; do
  $AXE batch --udid $SIM --tap-style physical --step "tap -x $x -y $y" --step "sleep 0.6" >/dev/null 2>&1; echo "encendido y=$y"
done
$AXE batch --udid $SIM --step "tap -x 344 -y 100" --step "sleep 1" --step "tap -x 201 -y 838" --step "sleep 1.2" --step "tap -x 364 -y 84" --step "sleep 1.5" >/dev/null 2>&1
for i in 1 2 3 4; do $S/ui.sh | grep -q "Máximo 3 por fuente" && break; $AXE tap -x 299 -y 381 --udid $SIM >/dev/null 2>&1; sleep 0.6; done
$S/ui.sh | grep -o "Máximo [0-9] por fuente" | head -1
$AXE batch --udid $SIM --step "tap -x 349 -y 100" --step "sleep 1" --step "tap -x 110 -y 838" >/dev/null 2>&1
sleep 1.2; for i in 1 2 3; do $AXE tap -x 38 -y 84 --udid $SIM >/dev/null 2>&1; sleep 0.5; done
$AXE tap -x 110 -y 838 --udid $SIM >/dev/null 2>&1
# Restos de tomas anteriores en el simulador (no los quita traer las fuentes): grupos «Videojuegos…» creados
# por el guion y lo guardado para después.
for i in 1 2 3; do
  xy=$($AXE describe-ui --udid $SIM 2>/dev/null >/dev/null; $AXE tap -x 201 -y 838 --udid $SIM >/dev/null 2>&1; sleep 1.2; $S/ui.sh | grep "^Button 'Videojuegos" | head -1 | grep -oE "[0-9]+,[0-9]+ " | tr ',' ' ')
  [ -z "$xy" ] && break
  set -- $xy; y=$(( $2 + 40 ))
  $AXE swipe --start-x 330 --start-y $y --end-x 120 --end-y $y --duration 0.4 --udid $SIM >/dev/null 2>&1; sleep 1
  $AXE tap -x 358 -y $(( y - 10 )) --udid $SIM >/dev/null 2>&1; sleep 1.2
  echo "borrado un grupo Videojuegos"
done
$AXE tap -x 300 -y 838 --udid $SIM >/dev/null 2>&1; sleep 1.2
if $S/ui.sh | grep -q "Button 'Vaciar'"; then
  $AXE tap -x 364 -y 84 --udid $SIM >/dev/null 2>&1; sleep 1
  $AXE describe-ui --udid $SIM 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
def w(n):
    l=n.get('AXLabel') or ''; f=n.get('frame',{})
    if l.startswith('Vaciar las'): print(int(f['x']+f['width']/2), int(f['y']+f['height']/2)); sys.exit()
    for c in n.get('children',[]): w(c)
for n in (d if isinstance(d,list) else [d]): w(n)" | { read x y; [ -n "$x" ] && $AXE tap -x $x -y $y --udid $SIM >/dev/null 2>&1 && echo "guardadas vaciadas"; }
  sleep 1
fi
$AXE tap -x 110 -y 838 --udid $SIM >/dev/null 2>&1; sleep 1
# La app solo guarda su estado (la pantalla que restaura al abrir) al pasar a segundo plano: se manda al
# inicio desde la portada para que la siguiente toma arranque ahí.
# Cada pestaña recuerda su pila (si la toma anterior acabó dentro de Tech, la app abre ahí): se vacían.
for tab in 201 300 110; do
  $AXE tap -x $tab -y 838 --udid $SIM >/dev/null 2>&1; sleep 0.8
  for i in 1 2 3; do $AXE tap -x 38 -y 84 --udid $SIM >/dev/null 2>&1; sleep 0.5; done
done
sleep 1; $AXE button home --udid $SIM >/dev/null 2>&1; sleep 1.5
