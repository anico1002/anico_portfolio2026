import type { MetadataRoute } from "next";

// La web nueva (/new) es un enlace privado (2026-10-19). A los buscadores NO se les cierra: necesitan entrar para
// leer su noindex (meta y X-Robots-Tag); si se les cerrara, una URL enlazada desde fuera podría salir indexada «sin
// contenido». A los rastreadores de IA y de datasets sí, porque no siempre respetan el noindex.
const PRIVATE = ["/new", "/maqueta", "/opt/maqueta", "/fonts-licencia"];
const AI_ONLY = ["CCBot", "Google-Extended", "Applebot-Extended", "Bytespider", "meta-externalagent", "Amazonbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Web pública (la de siempre): abierta a los buscadores de IA (GEO); la nueva, cerrada.
      ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "anthropic-ai"].map(
        (userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })
      ),
      ...AI_ONLY.map((userAgent) => ({ userAgent, disallow: PRIVATE })),
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: "https://anico.design/sitemap.xml",
    host: "https://anico.design",
  };
}
