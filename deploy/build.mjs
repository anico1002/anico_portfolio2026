// Arma el paquete de la web nueva para un hosting estático, y lo audita (2026-10-20).
//
//   Cloudflare (puente):  SITE_URL=https://anico-design.pages.dev EXPORT_STATIC=1 npm run build && node deploy/build.mjs cloudflare
//   Apache (MindYourGap): SITE_URL=https://anico.es EXPORT_STATIC=1 npm run build && node deploy/build.mjs apache
//
// Salida en deploy/<destino>-out/ (cf-out para Cloudflare, por compatibilidad). Lista de fallos que esto evita y la
// revisión obligatoria antes de publicar: deploy/README.md.
//
// Antes se armaba a mano copiando carpetas sueltas (new, _next, maqueta, opt…) y se quedaron fuera los archivos
// de la raíz de public/: /about.webp, la foto del bloque About, salía rota. Ahora no se elige nada a mano: se
// copian las páginas de /new y TODO archivo que cualquiera de ellas (o el CSS/JS de Next) nombre, sacado del propio
// export. Si algo nombrado no existe en el export, el script falla y no hay paquete que subir.
//
// Solo añade o sobrescribe dentro de la carpeta de salida: no borra nada (si sobra algo de un paquete viejo, no estorba).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  cloudflare: { site: "https://anico-design.pages.dev", out: "cf-out", conf: ["_headers", "_redirects", "robots.txt"] },
  apache: { site: "https://anico.es", out: "apache-out", conf: [".htaccess", "robots.txt"] },
};
const TARGET = process.argv[2];
if (!TARGETS[TARGET]) {
  console.error(`✗ Destino: node deploy/build.mjs <${Object.keys(TARGETS).join("|")}>`);
  process.exit(1);
}
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const DEST = join(ROOT, "deploy", TARGETS[TARGET].out);
const CONF = join(ROOT, "deploy", TARGET);

if (!existsSync(join(OUT, "new", "index.html"))) {
  console.error("✗ Falta el export: lanza antes `EXPORT_STATIC=1 npm run build`.");
  process.exit(1);
}

// La imagen para compartir el enlace (og:image) lleva el dominio completo: tiene que ser el del destino. Con el de
// anico.design salía rota al pegar el enlace en WhatsApp o LinkedIn (2026-10-20).
const SITE = TARGETS[TARGET].site;
if (!readFileSync(join(OUT, "new", "index.html"), "utf8").includes(`content="${SITE}/`)) {
  console.error(`✗ El export no apunta a ${SITE}: constrúyelo con SITE_URL=${SITE}.`);
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
// Las del propio dominio (las imágenes para compartir) se comprueban igual, como rutas desde la raíz.
const unescape = (t) => t.replaceAll("&amp;", "&").replaceAll("\\u0026", "&").replaceAll(SITE, "");
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

// 3. Cabeceras, redirecciones y robots del destino.
for (const f of TARGETS[TARGET].conf) cpSync(join(CONF, f), join(DEST, f));

if (missing.length) {
  console.error(`✗ ${missing.length} archivo(s) nombrados por la web no existen en el export:`);
  missing.forEach((m) => console.error("   " + m));
  process.exit(1);
}
console.log(`✓ ${relative(ROOT, DEST)} listo (${TARGET}): ${copied} medios referenciados + new/ + _next/ + medios de la web nueva.`);
