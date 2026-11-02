// Arma el paquete de la web para un hosting estático, y lo audita (2026-10-20; rutas en la raíz desde el 2026-11-02).
//
//   Apache (MindYourGap, anico.design):  SITE_URL=https://anico.design EXPORT_STATIC=1 npm run build && node deploy/build.mjs apache
//   Cloudflare (puente retirado):        node deploy/build.mjs cloudflare   → solo redirige todo a anico.design
//
// Salida en deploy/<destino>-out/. Lista de fallos que esto evita y la revisión obligatoria antes de publicar:
// deploy/README.md.
//
// Antes se armaba a mano copiando carpetas sueltas (new, _next, maqueta, opt…) y se quedaron fuera los archivos
// de la raíz de public/: /about.webp, la foto del bloque About, salía rota. Ahora no se elige nada a mano: se
// copian las páginas y TODO archivo que cualquiera de ellas (o el CSS/JS de Next) nombre, sacado del propio
// export. Si algo nombrado no existe en el export, el script falla y no hay paquete que subir.
//
// Solo añade o sobrescribe dentro de la carpeta de salida: no borra nada (si sobra algo de un paquete viejo, no estorba).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TARGETS = {
  cloudflare: { site: "https://anico.design", out: "cf-redirect-out" },
  apache: { site: "https://anico.design", out: "apache-out", conf: [".htaccess"] },
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

// El puente de Cloudflare (anico-design.pages.dev) ya no sirve la web: manda cada URL a la misma ruta de anico.design,
// donde las de /new/... redirigen a su sitio nuevo. Así no se rompe ningún enlace que ya se mandó.
if (TARGET === "cloudflare") {
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, "_redirects"), "# El puente se retiró: la web está en anico.design (2026-11-02).\n/*  https://anico.design/:splat  301\n");
  writeFileSync(join(DEST, "index.html"), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=https://anico.design/"><title>anico</title><a href="https://anico.design/">anico.design</a>\n');
  console.log(`✓ ${relative(ROOT, DEST)} listo: todo redirige a https://anico.design.`);
  process.exit(0);
}

if (!existsSync(join(OUT, "product", "index.html"))) {
  console.error("✗ Falta el export: lanza antes `EXPORT_STATIC=1 npm run build`.");
  process.exit(1);
}

// La imagen para compartir el enlace (og:image) lleva el dominio completo: tiene que ser el del destino. Con el de
// anico.design salía rota al pegar el enlace en WhatsApp o LinkedIn (2026-10-20).
const SITE = TARGETS[TARGET].site;
if (!readFileSync(join(OUT, "index.html"), "utf8").includes(`content="${SITE}/`)) {
  console.error(`✗ El export no apunta a ${SITE}: constrúyelo con SITE_URL=${SITE}.`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// 1. Lo que se sube entero: las páginas (portada y sus datos en la raíz, product/, games/), los bundles de Next, la
//    página de error, robots y sitemap, y las carpetas de medios de la web (algunas rutas se montan en el navegador,
//    p. ej. el póster `-poster.jpg` de cada vídeo, y no aparecen escritas en ningún archivo).
const copy = (rel) => {
  mkdirSync(dirname(join(DEST, rel)), { recursive: true });
  cpSync(join(OUT, rel), join(DEST, rel), { recursive: true });
};
const ROOT_PAGE = readdirSync(OUT).filter((f) => f === "index.html" || f === "index.txt" || /^__next\..*\.txt$/.test(f));
const PAGES = ["product", "games"];
[...ROOT_PAGE, ...PAGES, "_next", "404.html", "robots.txt", "sitemap.xml", "maqueta", "opt/maqueta", "fonts-licencia"].forEach(copy);

// 2. Todo archivo que nombren las páginas (HTML y datos RSC) o el CSS/JS: rutas absolutas con extensión de medio.
const MEDIA = "avif|webp|png|jpe?g|gif|svg|ico|mp4|webm|mov|woff2?|ttf|otf|pdf|txt|json|xml|webmanifest";
// Solo rutas desde la raíz: no lo que va detrás de un dominio (`https://anico.design/…`) ni de `../`.
const REF = new RegExp(`(?<![\\w./:-])/(?!/)[A-Za-z0-9_\\-./%@()&]+\\.(?:${MEDIA})(?=[\\s"'\\\\),?#]|$)`, "g");
const sources = [...ROOT_PAGE.map((f) => join(OUT, f)), ...PAGES.flatMap((d) => walk(join(OUT, d))), ...walk(join(OUT, "_next", "static"))].filter((f) => /\.(html|txt|css|js)$/.test(f));
const refs = new Set();
// Las rutas pueden venir escapadas (`&amp;`, `\u0026`, `%20`): se leen ya desescapadas.
// Las del propio dominio (las imágenes para compartir) se comprueban igual, como rutas desde la raíz.
const unescape = (t) => t.replaceAll("&amp;", "&").replaceAll("\\u0026", "&").replaceAll(SITE, "");
for (const f of sources) for (const m of unescape(readFileSync(f, "utf8")).matchAll(REF)) refs.add(decodeURIComponent(m[0]));

const missing = [];
let copied = 0;
for (const r of refs) {
  const rel = r.slice(1);
  if (/^(_next|product|games|maqueta|opt\/maqueta|fonts-licencia)\//.test(rel)) continue; // ya van enteros
  if (!existsSync(join(OUT, rel))) {
    // Las rutas de los datos RSC de Next (`/product/x/__next.*.txt`) y similares no son archivos de public/.
    if (!/\.(txt|json|xml)$/.test(rel)) missing.push(r);
    continue;
  }
  if (statSync(join(OUT, rel)).isDirectory()) continue;
  copy(rel);
  copied++;
}

// 3. Redirecciones (2026-11-02), sacadas de las páginas que existen en el export: así cada caso nuevo tiene su atajo
//    (/gloop → /product/gloop) y su URL vieja de /new sin tener que acordarse. Las de la web anterior (/proyecto/…)
//    van a su caso si sigue existiendo; si no, adonde diga lib/maqueta/rutas-viejas.json, y si no, a /product.
const casesOf = (section) =>
  readdirSync(join(OUT, section)).filter((d) => existsSync(join(OUT, section, d, "index.html"))).map((slug) => ({ slug, href: `/${section}/${slug}/` }));
const live = [...casesOf("product"), ...casesOf("games")];
const dupes = live.filter((c, i) => live.findIndex((x) => x.slug === c.slug) !== i);
if (dupes.length) {
  console.error(`✗ Caso en las dos secciones (el atajo no sabría adónde ir): ${dupes.map((c) => c.slug).join(", ")}`);
  process.exit(1);
}
const OLD = JSON.parse(readFileSync(join(ROOT, "lib", "maqueta", "rutas-viejas.json"), "utf8"));
const esc = (s) => s.replace(/[.+*?^$()[\]{}|\\]/g, "\\$&");
const rule = (from, to) => `RewriteRule ^${from}/?$ ${to} [R=301,L]`;
const rules = [
  rule("new", "/"),
  rule("new/(product|games)", "/$1/"),
  ...live.flatMap(({ slug, href }) => [rule(esc(slug), href), rule(`new/${esc(slug)}`, href), rule(`proyecto/${esc(slug)}`, href)]),
  ...Object.entries(OLD)
    .filter(([k]) => k.startsWith("/"))
    .map(([k, v]) => rule(esc(k.slice(1)), v === "/" ? "/" : `${v}/`)),
  "RewriteRule ^proyecto(/.*)?$ /product/ [R=301,L]",
  "RewriteRule ^new/(.*)$ /$1 [R=301,L]",
];
const tpl = readFileSync(join(CONF, ".htaccess"), "utf8");
if (!tpl.includes("# @@REDIRECCIONES@@")) {
  console.error("✗ La plantilla deploy/apache/.htaccess no tiene la marca # @@REDIRECCIONES@@.");
  process.exit(1);
}
writeFileSync(join(DEST, ".htaccess"), tpl.replace("# @@REDIRECCIONES@@", rules.join("\n")));

// 4. El sitemap solo nombra páginas que están en el paquete (y en el dominio del destino).
const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const badLocs = locs.filter((u) => !u.startsWith(`${SITE}/`) || !existsSync(join(DEST, u.slice(SITE.length), "index.html")));
if (!locs.length || badLocs.length) {
  console.error(`✗ Sitemap con URLs que no están en el paquete o en otro dominio:\n   ${badLocs.join("\n   ") || "(vacío)"}`);
  process.exit(1);
}

if (missing.length) {
  console.error(`✗ ${missing.length} archivo(s) nombrados por la web no existen en el export:`);
  missing.forEach((m) => console.error("   " + m));
  process.exit(1);
}
console.log(`✓ ${relative(ROOT, DEST)} listo (${TARGET}): ${copied} medios referenciados + páginas + _next/ + medios de la web.`);
console.log(`  ${live.length} casos con atajo y redirección: ${live.map((c) => c.slug).join(", ")}. Sitemap: ${locs.length} URLs.`);
