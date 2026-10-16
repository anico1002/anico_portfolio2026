// Graba una escena de un prototipo de ProtoPie Cloud abierto en un Chrome con --remote-debugging-port=9333
// (ventana visible: el reproductor necesita WebGL). La pantalla del prototipo es HTML (#webplayer-root): se emula
// una ventana muy alta (el reproductor encaja el móvil al alto, así la pantalla se pinta grande), se graba con el screencast de CDP y se recorta a la pantalla. WineUp, 2026-10-16.
// [HIDE_SB=1] node rec.mjs <salida.mp4> <escena|-> <guion>   guion: "tap:x,y@t;drag:x1,y1,x2,y2[,ms]@t;wheel:x,y,dy[,ms]@t;sb:show|hide@t;end@t" (t en s; x,y en pt del móvil 393x852)
import { chromium } from 'playwright-core';
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const [out, scene, script] = process.argv.slice(2);
const FF = execFileSync('npm', ['root', '-g']).toString().trim() + '/ffmpeg-static/ffmpeg';
const b = await chromium.connectOverCDP('http://localhost:9333');
const p = b.contexts()[0].pages().find(x => x.url().includes('protopie'));
const s = await b.contexts()[0].newCDPSession(p);
await s.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 2000, deviceScaleFactor: 1, mobile: false });
await p.waitForTimeout(800);
if (scene !== '-') {
  await p.mouse.click(160, 28); await p.waitForTimeout(700);
  const it = p.getByText(scene, { exact: true }).last(); await it.scrollIntoViewIfNeeded(); await it.click();
  await p.waitForTimeout(400); await p.mouse.click(160, 28); await p.waitForTimeout(300);
}
// El prototipo trae una capa de texto con la hora real encima del «9:41» de la barra de estado: se oculta (y se
// vigila, porque cada escena la vuelve a crear).
// Además, la barra de estado que ProtoPie pinta por su cuenta (capas `status-bar/*`): en las pantallas que ya traen la
// suya dibujada salía doble (2026-10-17). HIDE_SB=1 la oculta desde el principio, y el guion la enciende o la apaga
// en cada momento con `sb:show@t` / `sb:hide@t` (en WineUp, «¿Cómo te defines?» es la única pantalla sin barra dibujada).
await p.evaluate((hideSb) => { window.__hideSb = hideSb; clearInterval(window.__noClock); window.__noClock = setInterval(() => {
  for (const e of document.querySelectorAll('.TextLayer')) if (/^\s*\d{1,2}:\d{2}\s*$/.test(e.textContent || '') && !/9:41/.test(e.textContent)) e.style.visibility = 'hidden';
  for (const e of document.querySelectorAll('[data-layer-id^="status-bar/"]')) e.style.visibility = window.__hideSb ? 'hidden' : '';
}, 30); }, !!process.env.HIDE_SB);
await p.waitForTimeout(300);
const R = await p.evaluate(() => { const r = document.getElementById('webplayer-root').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
const k = R.w / 393; // pt del móvil → px de la página
const at = (x, y) => [R.x + x * k, R.y + y * k];
const dir = fs.mkdtempSync('/tmp/pie-'); const frames = [];
s.on('Page.screencastFrame', async (f) => { frames.push({ t: f.metadata.timestamp, file: path.join(dir, `${frames.length}.jpg`) }); fs.writeFileSync(frames.at(-1).file, Buffer.from(f.data, 'base64')); s.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
await s.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1, maxWidth: 1400, maxHeight: 2000 });
const t0 = Date.now(); let end = 6;
for (const step of script.split(';').filter(Boolean)) {
  const [act, t] = step.split('@'); const wait = +t * 1000 - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
  const [k2, v = ''] = act.split(':'); const n = v.split(',').map(Number);
  if (k2 === 'tap') { const [x, y] = at(n[0], n[1]); await p.mouse.click(x, y); }
  else if (k2 === 'drag') {
    // Arrastre como un dedo: arranca suave, acelera y frena al final (ease in-out), con un paso por fotograma.
    // n[4] = duración en ms (por defecto 900). Más lento = scroll sin inercia brusca.
    const [x1, y1] = at(n[0], n[1]); const [x2, y2] = at(n[2], n[3]); const ms = n[4] || 900; const steps = Math.round(ms / 16);
    const e = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    await p.mouse.move(x1, y1); await p.mouse.down();
    for (let i = 1; i <= steps; i++) { const t = e(i / steps); await p.mouse.move(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t); await p.waitForTimeout(16); }
    await p.waitForTimeout(60); await p.mouse.up();
  }
  else if (k2 === 'wheel') {
    // Rueda suave (wheel:x,y,dy[,ms]): donde un arrastre lo coge otro elemento (un carrusel), la rueda desplaza la
    // página igual. Pasos pequeños con la misma curva in-out que los arrastres.
    const [x, y] = at(n[0], n[1]); const dy = n[2] * k; const ms = n[3] || 1500; const steps = Math.round(ms / 16);
    const e = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    await p.mouse.move(x, y); let done = 0;
    for (let i = 1; i <= steps; i++) { const to = dy * e(i / steps); await p.mouse.wheel(0, to - done); done = to; await p.waitForTimeout(16); }
  }
  else if (k2 === 'sb') await p.evaluate((h) => (window.__hideSb = h), v === 'hide');
  else if (k2 === 'end') end = +t;
}
const rest = end * 1000 - (Date.now() - t0); if (rest > 0) await p.waitForTimeout(rest);
const stopTs = Date.now() / 1000; await s.send('Page.stopScreencast'); await p.waitForTimeout(300);
await s.send('Emulation.clearDeviceMetricsOverride');
// Fotogramas con su duración real → 30 fps constantes, recortados a la pantalla y a 786x1704 (393x852 a 2x).
let list = '';
// El screencast solo manda fotogramas cuando algo cambia: el último dura hasta el final real de la grabación (si no,
// una pantalla quieta al final se perdía y el clip salía corto; 2026-10-17).
frames.forEach((f, i) => { const d = i < frames.length - 1 ? frames[i + 1].t - f.t : Math.max(0.1, stopTs - f.t); list += `file '${f.file}'\nduration ${Math.max(0.001, d).toFixed(4)}\n`; });
list += `file '${frames.at(-1).file}'\n`; fs.writeFileSync(path.join(dir, 'list.txt'), list);
const c = `crop=${Math.round(R.w)}:${Math.round(R.h)}:${Math.round(R.x)}:${Math.round(R.y)},scale=786:1704,fps=30`;
execFileSync(FF, ['-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-vf', c, '-vcodec', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', '-y', out]);
console.log('ok', out, frames.length, 'fotogramas', R);
process.exit(0);
// ANTES DE GRABAR, en View options (rueda): desmarcar «Hotspot Hints» (si no, cada toque enseña las zonas activas en
// azul), desmarcar «Device Frame» (si no, sale el marco de ProtoPie dentro de nuestro iPhone) y cursor en flecha. Los gestos van lentos y con curva para que se note la fluidez de la app.
// Abrir el Chrome sin molestar (fuera de la pantalla y sin que deje de pintar por no verse):
// "…/Google Chrome for Testing" --remote-debugging-port=9333 --user-data-dir=<tmp> --window-position=-2400,0
//   --window-size=1400,1100 --disable-backgrounding-occluded-windows --disable-renderer-backgrounding
//   --disable-background-timer-throttling --no-first-run <url del prototipo>
