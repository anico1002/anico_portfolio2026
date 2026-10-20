// Revisión final: node review.mjs <base> <chromium|webkit> <mobile|desktop> <static|nav|menu|history>
import { launch } from "./_browsers.mjs";
const [base, engName, vpName, phase] = process.argv.slice(2);
const b = await launch(engName);
const mobile = vpName === "mobile";
const ctx = await b.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: mobile, ...(engName === "chromium" ? { isMobile: mobile } : {}) });
const p = await ctx.newPage();
const fails = [];
const tag = `[${engName}/${vpName}/${phase}]`;
const fail = (m) => { fails.push(m); console.log(tag, "✗", m); };
let where = "";
p.on("response", (r) => r.status() >= 400 && fail(`HTTP ${r.status()} ${r.url()} @${where}`));
// WebKit da por «error» las precargas de Next que corta un page.goto de la propia prueba: se cuentan aparte.
let aborted = 0;
p.on("pageerror", (e) => (/access control checks/.test(e.message) && /__next\./.test(e.message) ? aborted++ : fail(`JS ${e.message} @${where}`)));
p.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && fail(`console ${m.text().slice(0, 200)} @${where}`));
const bare = (s) => (s.length > 1 ? s.replace(/\/+$/, "") : s);
const PORTAL = 'div.fixed.inset-0[class*="z-[90]"]';

const PAGES = ["/new/", "/new/product/", "/new/games/", "/new/gloop/", "/new/7news/", "/new/dovla/", "/new/elreto-masterchef/", "/new/interactius/", "/new/swift-project/", "/new/wineup/", "/new/asphalt-9/", "/new/asphalt-unite/", "/new/asphalt-xtreme/", "/new/cybertitans/", "/new/disney-karting/"];
const load = async (u) => { where = u; await p.goto(base + u, { waitUntil: "load" }); await p.waitForTimeout(400); };
async function arrived(target, label) {
  const t0 = Date.now();
  while (Date.now() - t0 < 12000) {
    const st = await p.evaluate((sel) => ({ path: location.pathname, hash: location.hash, portal: !!document.querySelector(sel), main: (document.querySelector("main")?.innerText || "").length }), PORTAL);
    if (bare(st.path) === bare(target.split("#")[0]) && !st.portal && st.main > 20) return Date.now() - t0;
    await p.waitForTimeout(150);
  }
  const st = await p.evaluate((sel) => ({ path: location.pathname, portal: !!document.querySelector(sel) }), PORTAL);
  fail(`${label}: no llega a ${target} (está en ${st.path}, cortinilla ${st.portal ? "PUESTA" : "fuera"})`);
  return -1;
}

if (phase === "static") {
  for (const u of PAGES) {
    await load(u);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, document.body.scrollHeight); });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({
      broken: [...document.images].filter((i) => i.currentSrc && i.complete && i.naturalWidth === 0 && i.loading !== "lazy").map((i) => i.currentSrc),
      brokenLazy: [...document.images].filter((i) => i.currentSrc && i.complete && i.naturalWidth === 0 && i.loading === "lazy").map((i) => i.currentSrc),
      vidErr: [...document.querySelectorAll("video")].filter((v) => v.error).map((v) => v.currentSrc || v.querySelector("source")?.src),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1 ? document.documentElement.scrollWidth : 0,
      // Página más alta que su contenido: hueco bajo el pie (Safari contaba las letras escondidas del rodillo, 2026-10-20).
      tail: document.documentElement.scrollHeight - Math.max(document.querySelector("main")?.offsetHeight ?? 0, innerHeight),
      title: document.title, h1: document.querySelector("h1")?.innerText?.slice(0, 40),
      years: /\b\d\d\+?\s*years\b/i.test(document.body.innerText) ? document.body.innerText.match(/.{0,30}\b\d\d\+?\s*years.{0,20}/i)[0] : "",
    }));
    r.broken.concat(r.brokenLazy).forEach((s) => fail(`imagen rota ${s} @${u}`));
    r.vidErr.forEach((s) => fail(`vídeo con error ${s} @${u}`));
    if (r.overflow) fail(`scroll horizontal (${r.overflow}px) @${u}`);
    if (r.tail > 2) fail(`hueco de ${r.tail}px bajo el pie @${u}`);
    if (r.years) fail(`texto con años: «${r.years}» @${u}`);
    console.log(tag, "ok", u, "·", r.title);
  }
}

if (phase === "nav") {
  let n = 0;
  for (const u of PAGES) {
    await load(u);
    // El carrusel final (a.shrink-0) se mueve solo: lo cubre carousel.mjs, que pulsa por coordenadas.
    const hrefs = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/new"]:not(.shrink-0)')].map((a) => a.getAttribute("href")))]);
    for (const h of hrefs) {
      if (bare(h.split("#")[0]) === bare(u) && !h.includes("#")) continue;
      await load(u);
      const a = p.locator(`a[href="${h}"]:not(.shrink-0)`).filter({ visible: true }).first();
      if (!(await a.count())) continue; // solo visibles (las de otro tamaño de pantalla las cubre la otra pasada)
      where = `${u} → ${h}`;
      try { await a.scrollIntoViewIfNeeded({ timeout: 5000 }); await p.waitForTimeout(300); await a.click({ timeout: 8000 }); }
      catch (e) { fail(`no se puede pulsar ${h} @${u}: ${e.message.split("\n")[0]}`); continue; }
      const ms = await arrived(h, `${u} → ${h}`);
      n++;
      if (ms >= 0) console.log(tag, "ok", u, "→", h, ms + "ms");
    }
  }
  console.log(tag, n, "navegaciones probadas");
}

if (phase === "menu") {
  for (const u of PAGES.slice(1)) {
    for (const label of ["Product", "Games", "About"]) {
      await load(u);
      where = `${u} menú ${label}`;
      try {
        if (mobile) {
          await p.getByRole("button", { name: "Open menu" }).click({ timeout: 8000 });
          await p.waitForTimeout(900);
          await p.locator("ul button", { hasText: label }).first().click({ timeout: 8000 });
        } else {
          await p.locator("nav a", { hasText: new RegExp(`^${label}`) }).first().click({ timeout: 8000 });
        }
      } catch (e) { fail(`menú ${label} @${u}: ${e.message.split("\n")[0]}`); continue; }
      const games = /asphalt|cybertitans|disney|games/.test(u);
      const target = label === "Product" ? "/new/product" : label === "Games" ? "/new/games" : games ? "/new/games" : "/new/product";
      const ms = await arrived(target, `menú ${label} @${u}`);
      if (ms < 0) continue;
      if (label === "About") {
        await p.waitForTimeout(2500);
        const top = await p.evaluate(() => document.getElementById("about")?.getBoundingClientRect().top);
        if (top === undefined || Math.abs(top) > 200) fail(`About no baja al bloque (top=${top}) @${u}`);
      }
      await p.waitForTimeout(1200);
      if (mobile && (await p.getByRole("button", { name: "Close menu" }).count()) && (await p.getByRole("button", { name: "Close menu" }).isVisible())) fail(`menú sigue abierto tras ${label} @${u}`);
      console.log(tag, "ok", u, "menú", label, ms + "ms");
    }
  }
}

if (phase === "history") {
  // Cadena real: lanzador → Product → Gloop → (menú) Games → CyberTitans; luego atrás hasta el principio y adelante hasta el final.
  const visited = ["/new/"];
  await load("/new/");
  const click = async (to) => {
    where = `click ${to}`;
    await p.waitForTimeout(1500);
    const a = p.locator(`a[href="${to}"]:not(.shrink-0)`).filter({ visible: true }).first();
    if (await a.count()) { await a.scrollIntoViewIfNeeded(); await a.click(); }
    else { await p.getByRole("button", { name: "Open menu" }).click(); await p.waitForTimeout(900); await p.locator("ul button", { hasText: "Games" }).first().click(); }
    if ((await arrived(to, `ir a ${to}`)) >= 0) visited.push(to);
  };
  for (const to of ["/new/product/", "/new/gloop/", "/new/games/", "/new/cybertitans/"]) await click(to);
  console.log(tag, "visitadas", visited.join(" → "));
  for (let k = visited.length - 2; k >= 0; k--) { where = `atrás → ${visited[k]}`; await p.waitForTimeout(800); await p.goBack(); if ((await arrived(visited[k], `atrás a ${visited[k]}`)) >= 0) console.log(tag, "ok atrás", visited[k]); }
  for (let k = 1; k < visited.length; k++) { where = `adelante → ${visited[k]}`; await p.waitForTimeout(800); await p.goForward(); if ((await arrived(visited[k], `adelante a ${visited[k]}`)) >= 0) console.log(tag, "ok adelante", visited[k]); }
  // Recarga directa de cada página con y sin barra final.
  for (const u of PAGES) for (const v of [u, bare(u)]) { where = v; const r = await p.goto(base + v); if (!r || r.status() >= 400) fail(`carga directa ${v} → ${r?.status()}`); }
  console.log(tag, "historial y cargas directas hechos");
}

console.log(tag, fails.length ? `FALLOS: ${fails.length}` : "SIN FALLOS", aborted ? `(precargas cortadas por la prueba: ${aborted})` : "");
await b.close();
