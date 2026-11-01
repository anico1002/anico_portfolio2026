// web-rec.mjs — graba un recorrido por una web (un prototipo exportado, p. ej. DesignOps Copilot) sin ventana, con
// un cursor de macOS dibujado en la página y movimientos de ratón suaves, para vídeos de casos. 2026-11-01.
//
//   node scripts/case-media/web-rec.mjs <url> <salida.mp4> <guion.json> [ancho=1376] [alto=1032] [dpr=2]
//
// El guion es una lista de pasos, en orden:
//   { "wait": 800 }                           espera (ms)
//   { "to": "css o text=Texto", "ms": 700 }   lleva el cursor al centro del elemento (curva in-out)
//   { "at": [x, y], "ms": 700 }               lleva el cursor a un punto
//   { "click": "css o text=…" }               lleva el cursor y pulsa (si no se da, pulsa donde esté: { "click": true })
//   { "wheel": 600, "ms": 1400 }              rueda suave hacia abajo (negativo, arriba) donde esté el cursor
//   { "type": "texto", "delay": 45 }          escribe
//   { "key": "Escape" }                       tecla
//   { "eval": "js" }                          ejecuta en la página
//   { "goto": "/ruta/" }                      navega (relativo a la url de inicio)
//   { "cursor": false }                       esconde/enseña el cursor
// Fotogramas del screencast de CDP con su duración real → 30 fps constantes (como protopie/rec.mjs).
import { launch } from "../qa/_browsers.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const [url, out, script, W = "1376", H = "1032", DPR = "2"] = process.argv.slice(2);
if (!url || !out || !script) {
  console.error("uso: node web-rec.mjs <url> <salida.mp4> <guion.json> [ancho] [alto] [dpr]");
  process.exit(1);
}
const steps = JSON.parse(fs.readFileSync(script, "utf8"));
const FF = execFileSync("npm", ["root", "-g"]).toString().trim() + "/ffmpeg-static/ffmpeg";
const w = +W, h = +H, dpr = +DPR;

const b = await launch("chromium");
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
// Cursor de macOS (flecha negra con borde blanco) que sigue al ratón y se encoge un poco al pulsar.
// NOCURSOR=1: sin cursor (pantallas de móvil, donde se toca con el dedo).
if (!process.env.NOCURSOR) await ctx.addInitScript(() => {
  const put = () => {
    if (document.getElementById("__cur")) return;
    const c = document.createElement("div");
    c.id = "__cur";
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 28 28"><path d="M6 3.5v18.2l4.6-4.4 3 6.9 3.1-1.3-3-6.8h6.4z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, { position: "fixed", left: "0", top: "0", zIndex: "2147483647", pointerEvents: "none", transform: "translate(-200px,-200px)", transition: "scale .12s", transformOrigin: "6px 4px", filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,.35))" });
    document.documentElement.appendChild(c);
    const xy = window.__curXY || [-200, -200];
    c.style.transform = `translate(${xy[0] - 6}px,${xy[1] - 4}px)`;
  };
  addEventListener("mousemove", (e) => {
    window.__curXY = [e.clientX, e.clientY];
    const c = document.getElementById("__cur");
    if (c) c.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 4}px)`;
  }, true);
  addEventListener("mousedown", () => { const c = document.getElementById("__cur"); if (c) c.style.scale = ".88"; }, true);
  addEventListener("mouseup", () => { const c = document.getElementById("__cur"); if (c) c.style.scale = "1"; }, true);
  new MutationObserver(put).observe(document, { childList: true, subtree: true });
});
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(600);

let cur = [w * 0.62, h * 0.7];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
async function moveTo(x, y, ms = 700) {
  const n = Math.max(1, Math.round(ms / 16));
  const [x0, y0] = cur;
  // Un pequeño arco, como una mano: el cursor no viaja en línea recta.
  const bend = Math.min(60, Math.hypot(x - x0, y - y0) * 0.08);
  for (let i = 1; i <= n; i++) {
    const t = ease(i / n);
    const off = Math.sin(Math.PI * t) * bend;
    await p.mouse.move(x0 + (x - x0) * t, y0 + (y - y0) * t - off);
    await p.waitForTimeout(16);
  }
  cur = [x, y];
}
async function center(sel) {
  const loc = sel.startsWith("text=") ? p.getByText(sel.slice(5), { exact: true }).first() : p.locator(sel).first();
  await loc.waitFor({ state: "visible", timeout: 15000 });
  const r = await loc.boundingBox();
  return [r.x + r.width / 2, r.y + r.height / 2];
}

await p.mouse.move(...cur);
const s = await ctx.newCDPSession(p);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "webrec-"));
const frames = [];
s.on("Page.screencastFrame", (f) => {
  const file = path.join(dir, `${frames.length}.jpg`);
  frames.push({ t: f.metadata.timestamp, file });
  fs.writeFileSync(file, Buffer.from(f.data, "base64"));
  s.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
await s.send("Page.startScreencast", { format: "jpeg", quality: 92, everyNthFrame: 1, maxWidth: w * dpr, maxHeight: h * dpr });

for (const st of steps) {
  if (st.wait) await p.waitForTimeout(st.wait);
  else if (st.to && !st.drag) await moveTo(...(await center(st.to)), st.ms);
  else if (st.at) await moveTo(st.at[0], st.at[1], st.ms);
  else if (st.click) {
    if (st.click !== true) await moveTo(...(await center(st.click)), st.ms ?? 700);
    await p.waitForTimeout(120);
    await p.mouse.down();
    await p.waitForTimeout(90);
    await p.mouse.up();
  } else if (st.drag) {
    // { "drag": "css", "from": 0.1, "to": 0.9, "ms": 1500, "back": 0.5 }: arrastra en horizontal por dentro del elemento
    // (un deslizador), de la fracción `from` a `to` de su ancho; con `back`, vuelve hasta ahí antes de soltar.
    const loc = st.drag.startsWith("text=") ? p.getByText(st.drag.slice(5), { exact: true }).first() : p.locator(st.drag).first();
    const r = await loc.boundingBox();
    const y = r.y + r.height / 2, X = (f) => r.x + r.width * f;
    await moveTo(X(st.from ?? 0.5), y, 700);
    await p.mouse.down();
    await moveTo(X(st.to ?? 0.9), y, st.ms ?? 1500);
    if (st.back != null) { await p.waitForTimeout(500); await moveTo(X(st.back), y, (st.ms ?? 1500) * 0.7); }
    await p.mouse.up();
  } else if (st.wheel) {
    const ms = st.ms ?? 1400, n = Math.round(ms / 16);
    let done = 0;
    for (let i = 1; i <= n; i++) {
      const to = st.wheel * ease(i / n);
      await p.mouse.wheel(0, to - done);
      done = to;
      await p.waitForTimeout(16);
    }
  } else if (st.type) await p.keyboard.type(st.type, { delay: st.delay ?? 45 });
  else if (st.key) await p.keyboard.press(st.key);
  else if (st.eval) await p.evaluate(st.eval);
  else if (st.goto) await p.goto(new URL(st.goto, url).href, { waitUntil: "networkidle" });
  else if ("cursor" in st) await p.evaluate((v) => { const c = document.getElementById("__cur"); if (c) c.style.opacity = v ? "1" : "0"; }, st.cursor);
}
const stop = Date.now() / 1000;
await s.send("Page.stopScreencast");
await p.waitForTimeout(200);
await b.close();

let list = "";
frames.forEach((f, i) => {
  const d = i < frames.length - 1 ? frames[i + 1].t - f.t : Math.max(0.1, stop - f.t);
  list += `file '${f.file}'\nduration ${Math.max(0.001, d).toFixed(4)}\n`;
});
list += `file '${frames.at(-1).file}'\n`;
fs.writeFileSync(path.join(dir, "list.txt"), list);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
execFileSync(FF, ["-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(dir, "list.txt"), "-vf", `scale=${w * dpr}:${h * dpr},fps=30`, "-vcodec", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "-y", out]);
console.log("ok", out, frames.length, "fotogramas");
