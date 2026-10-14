#!/bin/bash
# ps.sh <psd> <capa> <captura.png> <salida.jpg>
D="$(cd "$(dirname "$0")" && pwd)"
sed -e "s#PSD_PATH#'$1'#" -e "s#LAYER_NAME#'$2'#" -e "s#SCREEN#'$3'#" -e "s#OUT#'$4'#" "$D/place2.jsx" > "$D/run.jsx"
osascript -e "tell application id \"com.adobe.Photoshop\" to do javascript (read POSIX file \"$D/run.jsx\" as «class utf8»)"
