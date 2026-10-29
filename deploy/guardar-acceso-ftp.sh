#!/bin/bash
# Guarda el acceso FTP de anico.es (MindYourGap) en el Llavero de este Mac.
# Pide los datos en ventanas de macOS: la contraseña no pasa por el chat, ni por la
# terminal, ni por git. Para leerla luego: security find-generic-password -s anico-es-ftp -w
set -euo pipefail

SERVICE="anico-es-ftp"

pedir() { # $1 = pregunta, $2 = valor por defecto, $3 = "oculto" para la contraseña
  local extra=""
  [ "${3:-}" = "oculto" ] && extra="with hidden answer"
  osascript -e "text returned of (display dialog \"$1\" default answer \"$2\" $extra with title \"Acceso FTP de anico.es\")"
}

# Servidor de MindYourGap (datos de Carlos, 2026-10-29). Acepta SFTP (22) y FTP sin
# cifrar (21, ProFTPD sin AUTH TLS); el protocolo lo decide quien sube, probando SFTP primero.
HOST="134.0.9.249"
USUARIO=$(pedir "Usuario FTP:" "")
CLAVE=$(pedir "Contraseña FTP:" "" oculto)

[ -n "$USUARIO" ] && [ -n "$CLAVE" ] || { echo "Falta usuario o contraseña: no se guarda nada." >&2; exit 1; }

security add-generic-password -U -s "$SERVICE" -a "$USUARIO" -w "$CLAVE" \
  -l "anico.es FTP (MindYourGap)" -j "$HOST"

echo "Guardado en el Llavero: $USUARIO@$HOST (contraseña no mostrada)"
