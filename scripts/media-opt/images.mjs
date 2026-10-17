// Versiones ligeras de las imágenes de la maqueta (2026-10-17). Los originales (PNG/JPG de hasta 8 MB) no se tocan:
// al lado, en public/opt/, se genera cada imagen en AVIF a su ancho original y, para móviles, a 1290 y 828 px
// (iPhone a 3x y a 2x). El navegador elige la justa con srcset (`components/case-study/Img.tsx`).
//
// Calidad: AVIF 85 sin submuestreo de color (con 80 ya se suavizaba el grano de las texturas). Cada versión se mide
// con SSIM contra el original al mismo tamaño; si baja de 0,99, se repite con más calidad hasta pasar (tope 95).
// Si a su ancho original no pasa ese listón, o no ahorra al menos un 40 % (JPG que ya venían comprimidos: recomprimirlos
// solo añade pérdida), la imagen se queda con su original y no entra en el manifiesto (marca `.skip` en public/opt/).
// Antes, a cada vídeo sin póster se le saca el suyo (primer fotograma).
// Es incremental: solo procesa lo que no tiene versión o cuyo original ha cambiado.
//
//   node scripts/media-opt/images.mjs          → genera lo que falte y reescribe lib/maqueta/opt.json
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";
import { ssim } from "./ssim.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "opt");
const MANIFEST = path.join(ROOT, "lib/maqueta/opt.json");
// Casos ocultos en la maqueta (HIDDEN de lib/maqueta/cases.ts): sus imágenes no se usan.
const SKIP = /\/(netflix-app|nike-shop|hawkers|obliq|act|gm-world|metacampus)\//;
const WIDTHS = [828, 1290];
const Q0 = 85;
const FLOOR = 0.99;
const SAVE = 0.6; // la versión a ancho original debe pesar como mucho esto del original

// Pósters (2026-10-17): todo vídeo lleva al lado su primer fotograma en JPG (`<vídeo>-poster.jpg`), que es lo que se
// ve mientras el vídeo no ha llegado (en 4G, segundos). LazyVideo lo pone solo cuando el vídeo está cerca.
import { execFileSync } from "child_process";
const FF = path.join(execFileSync("npm", ["root", "-g"]).toString().trim(), "ffmpeg-static/ffmpeg");
const videos = [];
const walkV = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walkV(p);
    else if (/\.mp4$/i.test(f) && !/_src\.mp4$/i.test(f) && !SKIP.test(p)) videos.push(p);
  }
};
walkV(path.join(PUB, "maqueta"));
walkV(path.join(PUB, "projects"));
for (const v of videos) {
  const poster = v.replace(/\.mp4$/i, "-poster.jpg");
  if (fs.existsSync(poster)) continue;
  execFileSync(FF, ["-v", "error", "-i", v, "-frames:v", "1", "-q:v", "2", "-y", poster]);
  console.log("póster nuevo:", path.relative(PUB, poster));
}

const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(png|jpe?g)$/i.test(f) && !SKIP.test(p)) files.push(p);
  }
};
walk(path.join(PUB, "maqueta"));
walk(path.join(PUB, "projects"));

const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
const manifest = {};
let done = 0, made = 0, before = 0, after = 0;
const worst = [];

async function one(file) {
  const src = "/" + path.relative(PUB, file).split(path.sep).join("/");
  const meta = await sharp(file).metadata();
  const widths = [...WIDTHS.filter((w) => w < meta.width * 0.9), meta.width];
  const base = path.join(OUT, path.relative(PUB, file)).replace(/\.(png|jpe?g)$/i, "");
  const outs = widths.map((w) => `${base}.${w}.avif`);
  const mtime = fs.statSync(file).mtimeMs;
  before += fs.statSync(file).size;
  const skip = `${base}.skip`;
  if (fs.existsSync(skip) && fs.statSync(skip).mtimeMs >= mtime) {
    after += fs.statSync(file).size;
    return void ++done;
  }
  const fresh = old[src] && outs.every((o) => fs.existsSync(o) && fs.statSync(o).mtimeMs >= mtime);
  if (!fresh) {
    fs.mkdirSync(path.dirname(base), { recursive: true });
    // El ancho original primero: decide si la imagen se optimiza o se queda como está.
    for (let i = widths.length - 1; i >= 0; i--) {
      const w = widths[i];
      const h = Math.round((meta.height * w) / meta.width);
      const ref = w === meta.width ? file : await sharp(file).resize(w).png().toBuffer();
      let q = Q0, buf, s;
      for (;;) {
        buf = await sharp(ref).avif({ quality: q, effort: 5, chromaSubsampling: "4:4:4" }).toBuffer();
        s = await ssim(ref, buf, w, h);
        if (s.mean >= FLOOR || q >= 95) break;
        q += 5;
      }
      if (w === meta.width && (s.mean < FLOOR || buf.length > SAVE * fs.statSync(file).size)) {
        for (const o of outs) fs.rmSync(o, { force: true });
        fs.writeFileSync(skip, "");
        after += fs.statSync(file).size;
        return void ++done;
      }
      fs.writeFileSync(outs[i], buf);
      if (w === meta.width) worst.push([s.mean, q, src]);
    }
    made++;
  }
  for (const o of outs) after += fs.statSync(o).size;
  manifest[src] = widths;
  if (++done % 20 === 0) console.log(`${done}/${files.length}`);
}

// En paralelo, uno por núcleo (sharp ya reparte cada imagen en hilos).
const queue = [...files];
const N = Math.max(2, Math.floor(os.cpus().length / 2));
await Promise.all(Array.from({ length: N }, async () => { while (queue.length) await one(queue.shift()); }));

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0).replace(/\],/g, "],\n") + "\n");
worst.sort((a, b) => a[0] - b[0]);
console.log(`\n${files.length} imágenes, ${made} generadas. Originales ${(before / 1e6).toFixed(0)} MB → versiones ${(after / 1e6).toFixed(0)} MB`);
if (worst.length) console.log("SSIM más bajos:", worst.slice(0, 5).map(([s, q, f]) => `${s.toFixed(4)} q${q} ${f}`).join("\n  "));
