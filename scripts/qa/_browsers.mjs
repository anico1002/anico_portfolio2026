// Navegadores para las pruebas: Chrome for Testing y WebKit (el motor de Safari) de Playwright, nunca el Chrome de
// /Applications (deja copias en /private/var/folders; ver ~/CLAUDE.md). Si faltan: `npx playwright-core install
// chromium webkit`. Se usa la versión instalada más nueva, encaje o no con la de playwright-core.
import { chromium, webkit } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CACHE = join(process.env.HOME, "Library", "Caches", "ms-playwright");
const newest = (prefix, rel) => {
  const dirs = existsSync(CACHE) ? readdirSync(CACHE).filter((d) => d.startsWith(prefix)).sort((a, b) => +b.split("-").pop() - +a.split("-").pop()) : [];
  const hit = dirs.map((d) => join(CACHE, d, rel)).find(existsSync);
  if (!hit) throw new Error(`Falta ${prefix} en ${CACHE}: npx playwright-core install chromium webkit`);
  return hit;
};

export function launch(name) {
  if (name === "webkit") return webkit.launch({ executablePath: newest("webkit-", "pw_run.sh") });
  return chromium.launch({ executablePath: newest("chromium_headless_shell-", "chrome-headless-shell-mac-arm64/chrome-headless-shell") });
}
