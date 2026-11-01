#!/bin/bash
# designops-app.sh — exporta el prototipo de DesignOps Copilot (~/Vibe_Projects/designops-copilot) como web estática
# dentro del portfolio, en public/maqueta/designops/app/, para navegarlo de verdad dentro de la pantalla del caso
# (iframe del mismo dominio: nada se publica fuera). 2026-11-01.
#
# No toca el repo del prototipo: copia sus fuentes a una carpeta temporal y allí aplica los cambios del modo embebido:
#   - basePath /maqueta/designops/app y `output: export` (la ruta /drifts/[id] se envuelve con generateStaticParams);
#   - estado en sessionStorage en vez de localStorage: cada visita empieza con la demo limpia (82, 23 abiertos…)
#     y no se cruza con el prototipo en local;
#   - tema claro por defecto y onboarding ya hecho (el onboarding se enseña aparte, en vídeo);
# Uso: bash scripts/case-media/designops-app.sh   (necesita node_modules instalados en el prototipo)
set -euo pipefail
SRC="$HOME/Vibe_Projects/designops-copilot"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/public/maqueta/designops/app"
B="$(mktemp -d /tmp/dop-build.XXXX)"

rsync -a --exclude node_modules --exclude .next --exclude .git --exclude refs --exclude docs --exclude '*.tsbuildinfo' "$SRC/" "$B/"
ln -s "$SRC/node_modules" "$B/node_modules"
cd "$B"

cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/maqueta/designops/app",
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
EOF

D="src/app/(desk)/drifts/[id]"
mv "$D/page.tsx" "$D/Detail.tsx"
cat > "$D/page.tsx" <<'EOF'
import { drifts } from "@/data/drifts";
import Detail from "./Detail";
export function generateStaticParams() {
  return drifts.map((d) => ({ id: d.id }));
}
export default function Page() {
  return <Detail />;
}
EOF

# Rutas absolutas a public/ que el basePath no reescribe.
sed -i '' 's#"/avatars/#"/maqueta/designops/app/avatars/#g' src/components/ShellV3.tsx
# Estado por pestaña.
grep -rl "localStorage" src | xargs sed -i '' 's/localStorage/sessionStorage/g'
# Claro y con el onboarding hecho.
sed -i '' 's/theme: "system",/theme: "light",/; s/onboarded: false,/onboarded: true,/' src/lib/store.tsx
grep -q 'theme: "light",' src/lib/store.tsx && grep -q 'onboarded: true,' src/lib/store.tsx || { echo "store.tsx cambió: revisar los sed" >&2; exit 1; }

npx next build >/tmp/dop-build.log 2>&1 || { tail -40 /tmp/dop-build.log; exit 1; }
mkdir -p "$OUT"
rsync -a out/ "$OUT/"
echo "ok → $OUT ($(du -sh "$OUT" | cut -f1))"
