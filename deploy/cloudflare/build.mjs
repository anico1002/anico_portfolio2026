// Arma el paquete de Cloudflare Pages (deploy/cf-out/) a partir del export estático, y lo audita (2026-10-20).
//
//   EXPORT_STATIC=1 npm run build && node deploy/cloudflare/build.mjs
//
// Antes se armaba a mano copiando carpetas sueltas (new, _next, maqueta, opt…) y se quedaron fuera los archivos
// de la raíz de public/: /about.webp, la foto del bloque About, salía rota. Ahora no se elige nada a mano: se
// copian las páginas de /new y TODO archivo que cualquiera de ellas (o el CSS/JS de Next) nombre, sacado del propio
// export. Si algo nombrado no existe en el export, el script falla y no hay paquete que subir.
//
// Solo añade o sobrescribe dentro de deploy/cf-out/: no borra nada (si sobra algo de un paquete viejo, no estorba).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "out");
const DEST = join(ROOT, "deploy", "cf-out");
const CONF = join(ROOT, "deploy", "cloudflare");

if (!existsSync(join(OUT, "new", "index.html"))) {
  console.error("✗ Falta el export: lanza antes `EXPORT_STATIC=1 npm run build`.");
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// 1. Lo que se sube entero: las páginas de la web nueva, los bundles de Next, la página de error y las carpetas de
//    medios de la web nueva (algunas rutas se montan en el navegador, p. ej. el póster `-poster.jpg` de cada vídeo,
//    y no aparecen escritas en ningún archivo).
const copy = (rel) => {
  mkdirSync(dirname(join(DEST, rel)), { recursive: true });
  cpSync(join(OUT, rel), join(DEST, rel), { recursive: true });
};
["new", "_next", "404.html", "maqueta", "opt/maqueta", "fonts-licencia"].forEach(copy);

// 2. Todo archivo que nombren las páginas (HTML y datos RSC) o el CSS/JS: rutas absolutas con extensión de medio.
const MEDIA = "avif|webp|png|jpe?g|gif|svg|ico|mp4|webm|mov|woff2?|ttf|otf|pdf|txt|json|xml|webmanifest";
// Solo rutas desde la raíz: no lo que va detrás de un dominio (`https://anico.design/…`) ni de `../`.
const REF = new RegExp(`(?<![\\w./:-])/(?!/)[A-Za-z0-9_\\-./%@()&]+\\.(?:${MEDIA})(?=[\\s"'\\\\),?#]|$)`, "g");
const sources = [...walk(join(OUT, "new")), ...walk(join(OUT, "_next", "static"))].filter((f) => /\.(html|txt|css|js)$/.test(f));
const refs = new Set();
// Las rutas pueden venir escapadas (`&amp;`, `\u0026`, `%20`): se leen ya desescapadas.
const unescape = (t) => t.replaceAll("&amp;", "&").replaceAll("\\u0026", "&");
for (const f of sources) for (const m of unescape(readFileSync(f, "utf8")).matchAll(REF)) refs.add(decodeURIComponent(m[0]));

const missing = [];
let copied = 0;
for (const r of refs) {
  const rel = r.slice(1);
  if (/^(_next|new|maqueta|opt\/maqueta|fonts-licencia)\//.test(rel)) continue; // ya van enteros
  if (!existsSync(join(OUT, rel))) {
    // Las rutas de los datos RSC de Next (`/new/x/__next.*.txt`) y similares no son archivos de public/.
    if (!/\.(txt|json|xml)$/.test(rel)) missing.push(r);
    continue;
  }
  if (statSync(join(OUT, rel)).isDirectory()) continue;
  copy(rel);
  copied++;
}

// 3. Cabeceras, redirecciones y robots del puente.
for (const f of ["_headers", "_redirects", "robots.txt"]) cpSync(join(CONF, f), join(DEST, f));

if (missing.length) {
  console.error(`✗ ${missing.length} archivo(s) nombrados por la web no existen en el export:`);
  missing.forEach((m) => console.error("   " + m));
  process.exit(1);
}
console.log(`✓ deploy/cf-out listo: ${copied} medios referenciados + new/ + _next/ (${relative(ROOT, DEST)}).`);
