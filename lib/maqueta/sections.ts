/* Imágenes de fondo de cada sección: las usan la entrada partida (pase al pasar por encima) y la
   cabecera de su home (la misma imagen continúa tras el telón). */

export const SLIDES = {
  // Product: las miniaturas en movimiento de cada caso (2026-10-14). Cada vídeo nuevo de
  // miniatura entra aquí; necesita su póster al lado (`x.mp4` → `x-poster.jpg`, SlideMedia.tsx).
  product: [
    "/maqueta/gloop/media/hero-mock.mp4",
    "/maqueta/swift/duo-thumb.mp4",
    "/maqueta/7news/media/hero.mp4",
    // Dovla, su móvil 3D girando en el estudio oscuro (2026-10-18, Alberto lo da por bueno).
    "/maqueta/dovla/media/hero-3d.mp4",
    // Todos los casos aprobados (2026-10-17).
    "/maqueta/interactius/thumb.mp4",
    "/maqueta/elreto/media/hero.mp4",
    "/maqueta/wineup/media/thumb.mp4",
  ],
  games: [
    "/projects/asphalt-unite/AU_hero.png",
    "/projects/cybertitans/CyberTitans_hero.png",
    "/projects/disney-karting/Disney_hero.png",
    // Fuera el Ferrari de Asphalt 9 (2026-10-17): su degradado a blanco por abajo quedaba raro en móvil.
    "/projects/asphalt-xtreme/AXT_hero.png",
  ],
} as const;
