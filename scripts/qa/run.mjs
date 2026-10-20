// Revisión de navegación real de la web nueva, antes y después de publicar (2026-10-20). Por qué existe: deploy/README.md.
//
//   npm run qa -- deploy/cf-out                     el paquete, servido en local como lo haría el hosting
//   npm run qa -- https://anico-design.pages.dev    la web ya publicada
//
// Chrome y WebKit (Safari), móvil y escritorio: 15 páginas enteras (404, errores JS, imágenes y vídeos rotos, scroll
// lateral, «N years»), cada enlace interno pulsado, el menú Product/Games/About desde cada página, el carrusel del final
// de cada caso y atrás/adelante. Tarda ~15 min. Sale con código 1 si algo falla.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2];
if (!target) {
  console.error("Uso: npm run qa -- <carpeta del paquete | https://…>");
  process.exit(1);
}
let base = target.replace(/\/$/, "");
let server;
if (!/^https?:/.test(target)) {
  if (!existsSync(join(target, "new", "index.html"))) {
    console.error(`✗ ${target} no es un paquete de la web (falta new/index.html)`);
    process.exit(1);
  }
  server = spawn("node", [join(HERE, "serve.mjs"), resolve(target)], { stdio: "ignore" });
  base = "http://localhost:4789";
  await new Promise((r) => setTimeout(r, 800));
}

const jobs = [];
for (const e of ["chromium", "webkit"]) {
  for (const v of ["mobile", "desktop"]) {
    for (const ph of ["static", "nav", "menu"]) jobs.push(["review.mjs", e, v, ph]);
    jobs.push(["carousel.mjs", e, v]);
  }
  jobs.push(["review.mjs", e, "mobile", "history"]);
}

const LOGS = join(HERE, "..", "..", ".qa-logs");
mkdirSync(LOGS, { recursive: true });
const results = [];
const run = ([script, ...args]) =>
  new Promise((r) => {
    let out = "";
    const c = spawn("node", [join(HERE, script), base, ...args], { env: { ...process.env, SP: LOGS } });
    c.stdout.on("data", (d) => (out += d));
    c.stderr.on("data", (d) => (out += d));
    c.on("close", () => {
      const name = [script.replace(".mjs", ""), ...args].join("-");
      writeFileSync(join(LOGS, name + ".log"), out);
      const fails = out.split("\n").filter((l) => l.includes("✗"));
      const done = /SIN FALLOS|FALLOS:/.test(out);
      results.push({ name, fails, done });
      console.log(`${!done ? "?" : fails.length ? "✗" : "✓"} ${name}${fails.length ? ` (${fails.length})` : ""}${done ? "" : " — no terminó"}`);
      r();
    });
  });

// De 5 en 5: con más a la vez, la máquina va lenta y salen falsos fallos por tiempo.
const queue = [...jobs];
await Promise.all(Array.from({ length: 5 }, async () => { while (queue.length) await run(queue.shift()); }));
server?.kill();

const bad = results.filter((r) => r.fails.length || !r.done);
console.log(`\n${bad.length ? "✗ HAY FALLOS" : "✓ TODO LIMPIO"} — ${results.length} pruebas · logs en .qa-logs/`);
for (const r of bad) for (const f of r.fails.slice(0, 10)) console.log("  " + f);
process.exit(bad.length ? 1 : 0);
