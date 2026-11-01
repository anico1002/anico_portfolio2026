// css_scene.mjs — pinta una escena HTML (css-scene/*.html) fotograma a fotograma con una captura o una grabación en su
// pantalla, y saca un PNG o un MP4. Determinista: cada fotograma se pinta entero antes de capturarlo, así el vídeo
// sale fluido aunque la escena sea pesada (DesignOps Copilot, 2026-11-01).
//
//   node scripts/mockups/css_scene.mjs <escena.html> <fuente> <salida> <ancho> <alto> [query] [dpr=1]
//     fuente: un .png/.jpg (imagen fija) o un .mp4 (se sacan sus fotogramas a 30 fps)
//     salida: .png (un fotograma) o .mp4
//     query:  parámetros de la escena, p. ej. "rx=20&ry=-24&rz=6&s=1.1&y=-6"
// Variables: FROM y SECONDS recortan el vídeo de la fuente (s).
import { launch } from "../qa/_browsers.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const [scene, src, out, W, H, query = "", DPR = "1"] = process.argv.slice(2);
if (!scene || !src || !out) {
  console.error("uso: node css_scene.mjs <escena.html> <fuente> <salida> <ancho> <alto> [query] [dpr]");
  process.exit(1);
}
const FF = execFileSync("npm", ["root", "-g"]).toString().trim() + "/ffmpeg-static/ffmpeg";
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "scene-"));
let frames;
if (/\.(mp4|mov|webm)$/i.test(src)) {
  const args = ["-loglevel", "error"];
  if (process.env.FROM) args.push("-ss", process.env.FROM);
  args.push("-i", src);
  if (process.env.SECONDS) args.push("-t", process.env.SECONDS);
  args.push("-vf", "fps=30", "-q:v", "2", path.join(tmp, "src-%05d.jpg"));
  execFileSync(FF, args);
  frames = fs.readdirSync(tmp).filter((f) => f.startsWith("src-")).sort().map((f) => path.join(tmp, f));
} else frames = [path.resolve(src)];
if (out.endsWith(".png")) frames = frames.slice(0, 1);

const b = await launch("chromium");
const p = await b.newPage({ viewport: { width: +W, height: +H }, deviceScaleFactor: +DPR });
await p.goto(pathToFileURL(path.resolve(scene)).href + (query ? "?" + query : ""));
await p.waitForTimeout(300);
const shots = [];
for (const [i, f] of frames.entries()) {
  await p.evaluate((u) => window.setFrame(u), pathToFileURL(f).href);
  const file = out.endsWith(".png") ? out : path.join(tmp, `out-${String(i).padStart(5, "0")}.png`);
  await p.screenshot({ path: file, type: "png" });
  shots.push(file);
  if (i % 60 === 0) process.stdout.write(`${i}/${frames.length} `);
}
await b.close();
if (out.endsWith(".mp4")) {
  execFileSync(FF, ["-loglevel", "error", "-framerate", "30", "-i", path.join(tmp, "out-%05d.png"), "-vf", `scale=${W}:${H}:flags=lanczos`, "-vcodec", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", out]);
}
console.log("\nok", out, frames.length, "fotogramas");
