/* Color de cada página (2026-10-17, decidido con Alberto): cada caso lleva el fondo que le pega, en blanco o en
   negro, y se quita el selector sol/luna. Las homes de sección tienen color fijo para que la navegación tenga ancla
   (Product negro, Games blanco); About y Contact, negro. El final de cada caso (carrusel, «Let’s talk» y pie)
   hereda el color de la página. Lo que no esté aquí va en negro. */

export type Theme = "dark" | "light";

export const THEMES: Record<string, Theme> = {
  "/maqueta": "dark",
  "/maqueta/home": "dark",
  "/maqueta/games": "light",
  "/maqueta/sobre-mi": "dark",
  "/maqueta/contacto": "dark",
  // Product
  "/maqueta/gloop": "dark",
  "/maqueta/swift-project": "light",
  "/maqueta/7news": "dark",
  "/maqueta/dovla": "dark",
  "/maqueta/interactius": "light",
  "/maqueta/elreto-masterchef": "dark",
  "/maqueta/wineup": "dark",
  // Games: todos en blanco (2026-10-17; se diseñaron para la web anterior, que era blanca)
  "/maqueta/asphalt-unite": "light",
  "/maqueta/cybertitans": "light",
  "/maqueta/disney-karting": "light",
  "/maqueta/asphalt-9": "light",
  "/maqueta/asphalt-xtreme": "light",
};

export const themeFor = (path: string): Theme => THEMES[path.replace(/\/$/, "")] ?? "dark";
