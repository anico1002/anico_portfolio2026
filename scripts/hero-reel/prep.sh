#!/usr/bin/env bash
# Extrae de los medios del portfolio los fotogramas que usa comp.html (en fr/, ignorado por git).
# Los medios de public/maqueta/*/media/ no están en git: esto solo funciona en el Mac que los tiene (MacBook).
set -euo pipefail
cd "$(dirname "$0")/../../public/maqueta"
FF="$(npm root -g)/ffmpeg-static/ffmpeg"
OUT="$(cd ../../scripts/hero-reel && pwd)/fr"
mkdir -p "$OUT"

# clip <carpeta> <vídeo> <inicio s> <duración s> <ancho:alto>
clip() { mkdir -p "$OUT/$1"; "$FF" -v error -ss "$3" -t "$4" -i "$2" -vf "fps=30,scale=$5:force_original_aspect_ratio=increase,crop=$5" -q:v 3 -y "$OUT/$1/%04d.jpg"; }

# Fondos a pantalla completa
clip gl    gloop/media/hero-mock-25d-v2.mp4 3 6.5 1920:1080
clip f_7n  7news/media/hero-25d-v3.mp4      8 0.5 1920:1080
clip f_mc  elreto/media/hero-25d-v3.mp4     10 0.5 1920:1080
clip f_wu  wineup/media/hero-band-live2.mp4 8 0.5 1920:1080
clip dovla dovla/media/hero-3d.mp4          1 2.5 1920:1080
# Clips del hueco del bloque escalonado
clip s_gl2  gloop/media/phone-overview.mp4 12 1 960:540
clip s_mano gloop/media/app-mano.mp4       2  1 960:540
clip s_7n   7news/media/hero-25d-v3.mp4    4  1 960:540
clip s_mc   elreto/media/hero-25d-v3.mp4   6  1 960:540
clip s_wu   wineup/media/thumb-live2.mp4   5  1 960:540

# Fijos del montaje frenético: fotos a sangre (p1–p13) y pantallas (s1–s12)
mkdir -p "$OUT/st" "$OUT/kit"
i=0; for f in gloop/media/photo-echoes.jpg gloop/media/mock-rocas-bn.jpg gloop/media/game-culpable.jpg gloop/media/mock-fiesta-azul.jpg gloop/media/photo-xativometre.jpg gloop/cover.jpg dovla/cover.jpg dovla/media/photo-travel.jpg 7news/cover.jpg 7news/media/watch.jpg wineup/media/bg-copa-noche.jpg wineup/media/bg-cava.jpg wineup/media/bg-vinas.jpg; do
  i=$((i+1)); "$FF" -v error -i "$f" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -q:v 3 -y "$OUT/st/p$i.jpg"; done
j=0; for f in gloop/screens/home.png gloop/screens/game.png gloop/screens/night.png gloop/screens/moments.png gloop/screens/crew.png dovla/screens/home.png dovla/screens/cards.png dovla/screens/splash.png dovla/screens/welcome.png 7news/screens/portada.png 7news/screens/art-design.png 7news/screens/tema-tech.png; do
  j=$((j+1)); "$FF" -v error -i "$f" -vf "scale=-2:1080,format=rgb24" -q:v 3 -y "$OUT/st/s$j.jpg"; done

# Componentes del kit de Dovla (con transparencia)
for n in card-credit card-virtual balance chart-clean actions transactions-clean promo discover-clean contacts freeze detail-clean; do
  cp "dovla/media/kit/$n.png" "$OUT/kit/"; done
echo "fotogramas listos en $OUT"
