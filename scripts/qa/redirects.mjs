// Redirecciones (2026-11-02): atajos de cada caso, URLs viejas de /new y de la web anterior (/proyecto/…).
// node redirects.mjs <base>. Sin navegador: pide cada URL sin seguir la redirección y mira adónde manda.
const base = process.argv[2];
const tag = "[redirecciones]";
let fails = 0;
const fail = (m) => { fails++; console.log(tag, "✗", m); };

const PRODUCT = ["gloop", "7news", "dovla", "elreto-masterchef", "interactius", "swift-project", "wineup", "designops"];
const GAMES = ["asphalt-9", "asphalt-unite", "asphalt-xtreme", "cybertitans", "disney-karting"];
const CASES = [...PRODUCT.map((s) => [s, `/product/${s}/`]), ...GAMES.map((s) => [s, `/games/${s}/`])];
const CHECKS = [
  ["/new", "/"],
  ["/new/", "/"],
  ["/new/product/", "/product/"],
  ["/new/games", "/games/"],
  ...CASES.flatMap(([s, to]) => [[`/${s}`, to], [`/${s}/`, to], [`/new/${s}/`, to], [`/new/${s}`, to]]),
  // Web anterior: los que siguen existiendo, a su caso; Two Dots, a Games; el resto, a Product.
  ["/proyecto/asphalt-9", "/games/asphalt-9/"],
  ["/proyecto/elreto-masterchef/", "/product/elreto-masterchef/"],
  ["/proyecto/two-dots", "/games/"],
  ["/proyecto/netflix-app", "/product/"],
  ["/proyecto", "/product/"],
];

for (const [from, to] of CHECKS) {
  try {
    const r = await fetch(base + from, { redirect: "manual" });
    const loc = r.headers.get("location");
    const got = loc ? new URL(loc, base + from).pathname : null;
    if (r.status !== 301 || got !== to) fail(`${from} → ${r.status} ${got ?? "(sin destino)"}; se esperaba 301 ${to}`);
    else console.log(tag, "ok", from, "→", to);
  } catch (e) {
    fail(`${from}: ${e.message}`);
  }
}
// Y las páginas de verdad no redirigen a ningún sitio.
for (const u of ["/", "/product/", "/games/", ...CASES.map(([, to]) => to)]) {
  const r = await fetch(base + u, { redirect: "manual" }).catch(() => null);
  if (r?.status !== 200) fail(`${u} → ${r?.status ?? "sin respuesta"}; se esperaba 200`);
}
console.log(tag, fails ? `FALLOS: ${fails}` : "SIN FALLOS");
