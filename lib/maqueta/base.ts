// Ruta pública de la web (2026-11-02): sale en la raíz de anico.design. Hasta entonces vivía en /new (enlace
// privado); esas URLs viejas redirigen solas (deploy/build.mjs para Apache, next.config.ts en desarrollo).
// Las secciones cuelgan de aquí (`${BASE}/product`); los medios siguen en /maqueta/** (carpeta de public/).
export const BASE = "";
/** La portada (lanzador Product / Games). Para enlaces: BASE vacío no sirve como href. */
export const HOME = BASE || "/";

/** ¿Ruta de una página de la web (y no un archivo de medios, un ancla o un enlace externo)? Para el portal. */
export const isSitePath = (href: string) =>
  href.startsWith("/") && !href.startsWith("//") && !/^\/(maqueta|opt|fonts-licencia|_next)\//.test(href) && !/\.[a-z0-9]+$/i.test(href);

// Ruta sin barra final (2026-10-20). El export estático (Cloudflare, Apache) sirve `/games/` con barra y Next
// navega a `/games` sin ella: comparadas tal cual nunca coincidían y la cortinilla se quedaba tapando la página.
export const bare = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
