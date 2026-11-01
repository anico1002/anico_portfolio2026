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
// DPR=6 para los close-ups (la pantalla entera en perspectiva, muy de cerca: a 3x se ampliaba y perdía nitidez).
const DPR = +(process.env.DPR ?? 3), X = `${DPR}x`;
const SLOW = Math.max(1, DPR / 2); // a más resolución las animaciones de entrada tardan más en pintarse
// ONLY=<nombre> captura solo esa pantalla (health, drift, review, exception)
const ONLY = process.env.ONLY;
const want = (k) => !ONLY || ONLY.split(",").includes(k);
const page = async (dpr = DPR) => b.newPage({ viewport: { width: 1376, height: 1032 }, deviceScaleFactor: dpr });

let p;
// Health, con la nota ya contada y el resumen escrito.
if (want("health")) {
p = await page();
await p.goto(`${APP}/health/`);
await p.waitForTimeout(5500 * SLOW);
await p.mouse.move(-10, -10);
await p.screenshot({ path: `${OUT}/health@${X}.png` });

// El Copilot abierto con sus preguntas (el campo con el trazo de luz).
await p.click(".p-ask");
await p.waitForTimeout(2200 * SLOW);
await p.screenshot({ path: `${OUT}/ask@${X}.png` });
// Y la respuesta del mapa de impacto.
await p.getByText("What breaks if I change action-primary?", { exact: true }).click();
await p.waitForTimeout(7000 * SLOW);
await p.screenshot({ path: `${OUT}/impact@${X}.png` });
await p.close();
}

// El desvío del título que desaparece, con el deslizador a medias.
if (want("drift")) {
p = await page();
await p.goto(`${APP}/drifts/DR-482/`);
await p.waitForTimeout(2500 * SLOW);
const r = await p.locator("input[type=range]").boundingBox();
await p.mouse.move(r.x + r.width * 0.5, r.y + r.height / 2);
await p.mouse.down();
await p.mouse.move(r.x + r.width * 0.42, r.y + r.height / 2, { steps: 8 });
await p.mouse.up();
await p.mouse.move(-10, -10);
await p.waitForTimeout(600 * SLOW);
await p.screenshot({ path: `${OUT}/drift@${X}.png` });
await p.close();
}

// La revisión del lote: el diff y la nota antes y después.
if (want("review")) {
p = await page();
await p.goto(`${APP}/review/?ids=DR-482,DR-483,DR-484,DR-485,DR-486,DR-487`);
await p.waitForTimeout(2500 * SLOW);
await p.screenshot({ path: `${OUT}/review@${X}.png` });
await p.close();
}

// Aceptar una excepción con su motivo (principio «una excepción pide un motivo», 2026-11-01): el titular de 44px de la
// home de marketing, que está así a propósito.
if (want("exception")) {
p = await page();
await p.goto(`${APP}/drifts/DR-492/`);
await p.waitForTimeout(2500 * SLOW);
await p.getByText("Accept as exception", { exact: true }).first().click();
await p.waitForTimeout(800 * SLOW);
await p.locator("#ex-reason").pressSequentially("The launch hero is set at 44px on purpose. Brand signed it off for the spring campaign.", { delay: 5 });
await p.getByText("Every similar case", { exact: true }).click();
await p.mouse.move(-10, -10);
await p.waitForTimeout(700 * SLOW);
await p.screenshot({ path: `${OUT}/exception@${X}.png` });
await p.close();
}

await b.close();
console.log("ok", fs.readdirSync(OUT).join(" "));
