// Ruta pública de la web nueva (2026-10-19): sale en anico.design/new, sin sustituir la home de siempre.
// Todas las rutas de páginas salen de aquí; los medios siguen en /maqueta/** (carpeta de public/).
export const BASE = "/new";

// Ruta sin barra final (2026-10-20). El export estático (Cloudflare, Apache) sirve `/new/games/` con barra y Next
// navega a `/new/games` sin ella: comparadas tal cual nunca coincidían y la cortinilla se quedaba tapando la página.
export const bare = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
