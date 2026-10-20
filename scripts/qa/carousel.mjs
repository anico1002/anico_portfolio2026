// Carrusel «más proyectos» y enlaces del final de cada caso: node carousel.mjs <base> <chromium|webkit> <mobile|desktop>
import { launch } from "./_browsers.mjs";
const [base, engName, vpName] = process.argv.slice(2);
const b = await launch(engName);
const mobile = vpName === "mobile";
const ctx = await b.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: mobile, ...(engName === "chromium" ? { isMobile: mobile } : {}) });
const p = await ctx.newPage();
const tag = `[${engName}/${vpName}/carrusel]`;
let fails = 0, where = "";
const fail = (m) => { fails++; console.log(tag, "✗", m); };
p.on("response", (r) => r.status() >= 400 && fail(`HTTP ${r.status()} ${r.url()} @${where}`));
p.on("pageerror", (e) => fail(`JS ${e.message} @${where}`));
const bare = (s) => (s.length > 1 ? s.replace(/\/+$/, "") : s);
const CASES = ["gloop", "7news", "dovla", "elreto-masterchef", "interactius", "swift-project", "wineup", "asphalt-9", "asphalt-unite", "asphalt-xtreme", "cybertitans", "disney-karting"];
for (const c of CASES) {
  where = c;
  await p.goto(`${base}/new/${c}/`, { waitUntil: "load" });
  await p.waitForTimeout(800);
  // Hasta el final con la rueda/scroll real (la página usa Lenis).
  for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, 1200); await p.waitForTimeout(60); }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1500);
  // Primera tarjeta del carrusel que se vea entera en pantalla.
  const card = await p.evaluate(() => {
    const a = [...document.querySelectorAll('a.shrink-0[href^="/new"]')].find((e) => { const r = e.getBoundingClientRect(); const cx = (r.left + r.right) / 2; return cx > 40 && cx < innerWidth - 40 && r.top >= 0 && r.top + 60 < innerHeight && r.width > 0; });
    if (!a) return { none: [...document.querySelectorAll('a.shrink-0[href^="/new"]')].slice(0, 3).map((e) => JSON.stringify(e.getBoundingClientRect())), y: scrollY, h: document.body.scrollHeight };
    const r = a.getBoundingClientRect(); return { href: a.getAttribute("href"), x: (r.left + r.right) / 2, y: r.top + 40 };
  });
  if (!card.href) { fail(`sin tarjeta visible en el carrusel @${c} ${JSON.stringify(card)}`); continue; }
  where = `${c} → ${card.href}`;
  if (mobile) await p.touchscreen.tap(card.x, card.y); else await p.mouse.click(card.x, card.y);
  const t0 = Date.now(); let ok = false;
  while (Date.now() - t0 < 12000) {
    const s = await p.evaluate(() => ({ path: location.pathname, y: scrollY, n: (document.querySelector("main")?.innerText || "").length, layer: [...document.querySelectorAll("body > div, #case-root > div")].some((d) => { const cs = getComputedStyle(d); return cs.position === "fixed" && +cs.zIndex >= 80 && d.getBoundingClientRect().height > innerHeight * 0.9 && cs.pointerEvents !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.05; }) }));
    if (bare(s.path) === bare(card.href) && s.n > 20 && !s.layer) { ok = true; console.log(tag, "ok", c, "→", card.href, Date.now() - t0 + "ms", "scrollY", Math.round(s.y)); break; }
    await p.waitForTimeout(150);
  }
  if (!ok) { const s = await p.evaluate(() => location.pathname); fail(`carrusel ${c} → ${card.href}: no llega (en ${s})`); await p.screenshot({ path: `${process.env.SP || "/tmp"}/fail-${engName}-${vpName}-${c}.png` }); }
}
console.log(tag, fails ? `FALLOS: ${fails}` : "SIN FALLOS");
await b.close();
