/* Color de cada página (2026-10-17, decidido con Alberto): cada caso lleva el fondo que le pega, en blanco o en
   negro, y se quita el selector sol/luna. Las homes de sección tienen color fijo para que la navegación tenga ancla
   (Product negro, Games blanco); About y Contact, negro. El final de cada caso (carrusel, «Let’s talk» y pie)
   hereda el color de la página. Lo que no esté aquí va en negro. */
import { BASE } from "@/lib/maqueta/base";

export type Theme = "dark" | "light";

export const THEMES: Record<string, Theme> = {
  [BASE]: "dark",
  [`${BASE}/home`]: "dark",
  [`${BASE}/games`]: "light",
  // Product
  [`${BASE}/gloop`]: "dark",
  [`${BASE}/swift-project`]: "light",
  [`${BASE}/7news`]: "dark",
  [`${BASE}/dovla`]: "dark",
  [`${BASE}/interactius`]: "light",
  [`${BASE}/elreto-masterchef`]: "dark",
  [`${BASE}/wineup`]: "dark",
  // Games: todos en blanco (2026-10-17; se diseñaron para la web anterior, que era blanca)
  [`${BASE}/asphalt-unite`]: "light",
  [`${BASE}/cybertitans`]: "light",
  [`${BASE}/disney-karting`]: "light",
  [`${BASE}/asphalt-9`]: "light",
  [`${BASE}/asphalt-xtreme`]: "light",
};

export const themeFor = (path: string): Theme => THEMES[path.replace(/\/$/, "")] ?? "dark";
