// Renderiza comp.html fotograma a fotograma (window.render(t) es determinista) y lo codifica a MP4.
//   node scripts/hero-reel/render.mjs                 → out/prueba.mp4 (duración de comp.html o DUR, 30 fps)
//   node scripts/hero-reel/render.mjs 1.1,6.9,9.2     → solo esos instantes, en out/at-<t>.jpg, para revisar
// Antes, una vez por Mac: bash scripts/hero-reel/prep.sh (genera fr/).
import { launch } from "../qa/_browsers.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const dir = new URL(".", import.meta.url).pathname;
const FPS = 30;
const OUT = process.env.OUT || "prueba";
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
if (!only) rmSync(dir + "out/f", { recursive: true, force: true });
mkdirSync(dir + "out/f", { recursive: true });

const b = await launch("chromium");
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("file://" + dir + (process.env.COMP || "comp.html"));
await p.evaluate(() => document.fonts.ready);
const DUR = Number(process.env.DUR || (await p.evaluate(() => window.DUR)));
const times = only ?? Array.from({ length: Math.round(DUR * FPS) }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await p.evaluate((t) => window.render(t), t);
  await p.screenshot({ path: only ? `${dir}out/at-${t}.jpg` : `${dir}out/f/${String(i).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 });
}
await b.close();
if (!only) {
  const ff = execFileSync("npm", ["root", "-g"]).toString().trim() + "/ffmpeg-static/ffmpeg";
  execFileSync(ff, ["-v", "error", "-framerate", String(FPS), "-i", dir + "out/f/%04d.jpg", "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-y", `${dir}out/${OUT}.mp4`]);
  console.log("ok", `${dir}out/${OUT}.mp4`);
}
