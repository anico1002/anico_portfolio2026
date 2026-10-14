#!/bin/bash
# Libera el almacenamiento de despliegues del equipo de Vercel (alberto-projects, plan Hobby, 10 GB).
#
#   bash scripts/vercel-limpieza.sh            # solo enseña lo que borraría (no toca nada)
#   bash scripts/vercel-limpieza.sh --borrar   # borra
#
# En cada proyecto se conserva SIEMPRE el despliegue de producción en uso (el que sirve su dominio) y
# cualquiera que tenga un alias activo (`vercel remove --safe` se los salta). Se borra lo demás: previews y
# producciones antiguas. Borrar un despliegue antiguo no cambia ninguna web publicada, pero no se puede deshacer
# (ya no se podría volver a esa versión con un rollback).
#
# Además deja la retención automática de cada proyecto en lo mínimo razonable del plan Hobby: previews 1 semana,
# producción 1 mes (el máximo del plan), fallidos y cancelados 1 día.
# 2026-10-14: aviso de Vercel al 75 % de Deployment Storage.
set -euo pipefail
SCOPE=alberto-projects
BORRAR=false; [ "${1:-}" = "--borrar" ] && BORRAR=true
api(){ npx --yes vercel@latest api "$@" --scope $SCOPE 2>/dev/null; }
TMP=$(mktemp -d)

api "/v9/projects?limit=100" > $TMP/projects.json
python3 - $TMP/projects.json > $TMP/list.tsv <<'EOF'
import json,sys
t=open(sys.argv[1]).read(); d=json.loads(t[t.find('{'):])
for p in d["projects"]:
    prod=((p.get("targets") or {}).get("production") or {}).get("id","")
    print(p["id"], p["name"], prod, sep="\t")
EOF
echo "{\"expiration\":\"1w\",\"expirationProduction\":\"1m\",\"expirationCanceled\":\"1d\",\"expirationErrored\":\"1d\"}" > $TMP/ret.json

total=0
while IFS=$'\t' read -r pid name prod; do
  api "/v6/deployments?projectId=$pid&limit=100" > $TMP/deps.json
  python3 - $TMP/deps.json "$prod" > $TMP/del.txt <<'EOF'
import json,sys
t=open(sys.argv[1]).read(); d=json.loads(t[t.find('{'):]); keep=sys.argv[2]
deps=sorted(d.get("deployments",[]), key=lambda x: -x.get("created",0))
if not keep and deps: keep=deps[0]["uid"]   # sin producción marcada: se queda el más reciente
for x in deps:
    if x["uid"]!=keep and x.get("url"): print(x["url"])
EOF
  n=$(wc -l < $TMP/del.txt | tr -d ' '); total=$((total+n))
  printf "%-32s %3s para borrar (se queda %s)\n" "$name" "$n" "${prod:-el más reciente}"
  if $BORRAR; then
    api "/v9/projects/$pid/deployment-expiration" --method PATCH --input $TMP/ret.json >/dev/null || true
    while read -r url; do npx --yes vercel@latest remove "$url" --safe --yes --scope $SCOPE >/dev/null 2>&1 || true; done < $TMP/del.txt
  fi
done < $TMP/list.tsv
echo "Total: $total despliegues. $($BORRAR && echo 'Borrados (los que tenían alias activo se han respetado).' || echo 'Nada borrado: repite con --borrar.')"
echo "Nota: cada proyecto lista hasta 100 despliegues por pasada; si alguno tenía más, vuelve a lanzarlo."
