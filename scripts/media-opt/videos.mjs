// Versiones ligeras de los vídeos grandes (auditoría 2026-10-19). Las miniaturas de las tarjetas (home, pase de
// fondo, carrusel del final) eran los mismos vídeos de cabecera a 1920 px —El Reto, 13 MB— y el carrusel del final
// llegaba a reproducir cinco a la vez (30 fps en un monitor de 2560 aunque no se tocara nada). Los originales no se
// tocan; al lado, en public/opt/, cada vídeo de 1600 px o más tiene:
//   <vídeo>.1280.mp4  a 1280 px de ancho: para lo que se pinta a ese tamaño o menos (tarjetas, carrusel);
//   <vídeo>.port.mp4  recorte vertical del centro (ancho = 0,6 × alto) SIN reescalar: la cabecera en móvil solo
//                     enseña esa franja central con object-cover, así que son los mismos píxeles en menos de la mitad
//                     de peso.
// LazyVideo (components/case-study/LazyVideo.tsx) elige al cargar según el tamaño real en pantalla.
// Calidad: x264 CRF 22 y SSIM contra el original (mismo tamaño y región) ≥ 0,985 en 3 fotogramas; si no llega, o no
// ahorra al menos un 30 %, la versión no entra en el manifiesto (lib/maqueta/video-opt.json). Incremental.
//
//   node scripts/media-opt/videos.mjs
import fs from "fs";
import path from "path";
import os from "os";
import { execFile, execFileSync } from "child_process";
import { promisify } from "util";

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "opt");
const MANIFEST = path.join(ROOT, "lib/maqueta/video-opt.json");
const FF = path.join(execFileSync("npm", ["root", "-g"]).toString().trim(), "ffmpeg-static/ffmpeg");
const MIN_W = 1600, CARD_W = 1280, PORT = 0.6, CRF = "22", FLOOR = 0.985, SAVE = 0.7;

const videos = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.mp4$/i.test(f) && !/_src\.mp4$/i.test(f)) videos.push(p);
  }
};
walk(path.join(PUB, "maqueta"));

async function probe(f) {
  const { stderr } = await run(FF, ["-hide_banner", "-i", f]).catch((e) => e);
  const [, w, h] = stderr.match(/Video:.*?(\d{3,5})x(\d{3,5})/) ?? [];
  return { w: +w, h: +h };
}

// SSIM medio de 3 fotogramas (1, 40 %, 80 % del vídeo) entre la versión y el original pasado por el mismo filtro.
async function quality(orig, out, vf) {
  const { stderr } = await run(FF, ["-hide_banner", "-i", out, "-i", orig, "-filter_complex",
    `[1]${vf}[r];[0][r]ssim`, "-frames:v", "90", "-f", "null", "-"]).catch((e) => e);
  const m = stderr.match(/All:([\d.]+)/);
  return m ? +m[1] : 0;
}

async function variant(src, kind, vf) {
  const rel = path.relative(PUB, src);
  const out = path.join(OUT, rel.replace(/\.mp4$/i, `.${kind}.mp4`));
  const skip = out + ".skip";
  const st = fs.statSync(src).mtimeMs;
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > st) return out;
  if (fs.existsSync(skip) && fs.statSync(skip).mtimeMs > st) return null;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // Se codifica en el temporal del sistema y solo pasa a public/opt si cumple: lo descartado no se queda en el proyecto.
  const tmp = path.join(os.tmpdir(), `vopt-${process.pid}-${path.basename(out)}`);
  await run(FF, ["-v", "error", "-i", src, "-vf", vf, "-vcodec", "libx264", "-crf", CRF, "-preset", "slow",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", tmp]);
  const q = await quality(src, tmp, vf);
  const ratio = fs.statSync(tmp).size / fs.statSync(src).size;
  const ok = q >= FLOOR && ratio <= SAVE;
  console.log(`${ok ? "✓" : "✗"} ${kind.padEnd(4)} ssim ${q.toFixed(4)}  ${(ratio * 100).toFixed(0)} %  ${rel}`);
  if (ok) {
    fs.copyFileSync(tmp, out);
    return out;
  }
  fs.writeFileSync(skip, "");
  return null;
}

const manifest = {};
const queue = [];
for (const v of videos) {
  const { w, h } = await probe(v);
  if (!(w >= MIN_W)) continue;
  const key = "/" + path.relative(PUB, v);
  const pw = Math.round((h * PORT) / 2) * 2;
  queue.push(async () => {
    const e = {};
    const card = await variant(v, String(CARD_W), `scale=${CARD_W}:-2`);
    if (card) e.card = "/" + path.relative(PUB, card);
    if (w / h > 1.2) {
      const port = await variant(v, "port", `crop=${pw}:${h}:(iw-${pw})/2:0`);
      if (port) e.port = "/" + path.relative(PUB, port);
    }
    if (Object.keys(e).length) manifest[key] = { w, h, ...e };
  });
}
const N = Math.max(2, Math.floor(os.cpus().length / 3));
await Promise.all(Array.from({ length: N }, async () => { while (queue.length) await queue.shift()(); }));
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0).replace(/\},"/g, '},\n"') + "\n");
console.log(`${Object.keys(sorted).length} vídeos con versión ligera → lib/maqueta/video-opt.json`);
