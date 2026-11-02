/* Color de cada página (2026-10-17, decidido con Alberto): cada caso lleva el fondo que le pega, en blanco o en
   negro, y se quita el selector sol/luna. Las homes de sección tienen color fijo para que la navegación tenga ancla
   (Product negro, Games blanco); About y Contact, negro. El final de cada caso (carrusel, «Let’s talk» y pie)
   hereda el color de la página. Lo que no esté aquí va en negro. */
import { BASE } from "@/lib/maqueta/base";
import { caseHref } from "@/lib/maqueta/cases";

export type Theme = "dark" | "light";

export const THEMES: Record<string, Theme> = {
  [BASE]: "dark",
  [`${BASE}/product`]: "dark",
  [`${BASE}/games`]: "light",
  // Product
  [caseHref("designops")]: "light", // el producto es claro y sus escenas, gris de estudio (2026-11-01)
  [caseHref("gloop")]: "dark",
  [caseHref("swift-project")]: "light",
  [caseHref("7news")]: "dark",
  [caseHref("dovla")]: "dark",
  [caseHref("interactius")]: "light",
  [caseHref("elreto-masterchef")]: "dark",
  [caseHref("wineup")]: "dark",
  // Games: todos en blanco (2026-10-17; se diseñaron para la web anterior, que era blanca)
  [caseHref("asphalt-unite")]: "light",
  [caseHref("cybertitans")]: "light",
  [caseHref("disney-karting")]: "light",
  [caseHref("asphalt-9")]: "light",
  [caseHref("asphalt-xtreme")]: "light",
};

export const themeFor = (path: string): Theme => THEMES[path.replace(/\/$/, "")] ?? "dark";
