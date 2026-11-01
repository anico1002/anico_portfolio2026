// Capturas a 3x del prototipo de DesignOps Copilot para los close-ups del caso (2026-11-01).
// Necesita el portfolio en marcha con el prototipo exportado (scripts/case-media/designops-app.sh):
//   node scripts/case-media/designops/screens.mjs [http://localhost:3123]
// Salen en public/maqueta/designops/screens/ (ignorado por git).
import { launch } from "../../qa/_browsers.mjs";
import fs from "node:fs";

const HOST = process.argv[2] ?? "http://localhost:3123";
const APP = `${HOST}/maqueta/designops/app`;
const OUT = "public/maqueta/designops/screens";
fs.mkdirSync(OUT, { recursive: true });

const b = await launch("chromium");
const page = async (dpr = 3) => b.newPage({ viewport: { width: 1376, height: 1032 }, deviceScaleFactor: dpr });

// Health, con la nota ya contada y el resumen escrito.
let p = await page();
await p.goto(`${APP}/health/`);
await p.waitForTimeout(5500);
await p.mouse.move(-10, -10);
await p.screenshot({ path: `${OUT}/health@3x.png` });

// El Copilot abierto con sus preguntas (el campo con el trazo de luz).
await p.click(".p-ask");
await p.waitForTimeout(2200);
await p.screenshot({ path: `${OUT}/ask@3x.png` });
// Y la respuesta del mapa de impacto.
await p.getByText("What breaks if I change action-primary?", { exact: true }).click();
await p.waitForTimeout(7000);
await p.screenshot({ path: `${OUT}/impact@3x.png` });
await p.close();

// El desvío del título que desaparece, con el deslizador a medias.
p = await page();
await p.goto(`${APP}/drifts/DR-482/`);
await p.waitForTimeout(2500);
const r = await p.locator("input[type=range]").boundingBox();
await p.mouse.move(r.x + r.width * 0.5, r.y + r.height / 2);
await p.mouse.down();
await p.mouse.move(r.x + r.width * 0.42, r.y + r.height / 2, { steps: 8 });
await p.mouse.up();
await p.mouse.move(-10, -10);
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/drift@3x.png` });
await p.close();

// La revisión del lote: el diff y la nota antes y después.
p = await page();
await p.goto(`${APP}/review/?ids=DR-482,DR-483,DR-484,DR-485,DR-486,DR-487`);
await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}/review@3x.png` });
await p.close();

await b.close();
console.log("ok", fs.readdirSync(OUT).join(" "));
